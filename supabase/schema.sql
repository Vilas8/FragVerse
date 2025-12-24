-- =============================================
-- FragVerse Chat System Database Schema
-- =============================================
-- This file contains the complete database schema for the real-time chat system
-- Run this in your Supabase SQL Editor

-- =============================================
-- TABLES
-- =============================================

-- Chat Rooms Table
CREATE TABLE IF NOT EXISTS chat_rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('tournament', 'team', 'direct', 'global')),
  tournament_id UUID,
  team_id UUID,
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB
);

-- Chat Messages Table
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES chat_rooms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  username TEXT NOT NULL,
  user_avatar TEXT,
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'file', 'system')),
  reply_to UUID REFERENCES chat_messages(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  is_edited BOOLEAN DEFAULT FALSE,
  metadata JSONB
);

-- Chat Participants Table
CREATE TABLE IF NOT EXISTS chat_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES chat_rooms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  username TEXT NOT NULL,
  role TEXT DEFAULT 'member' CHECK (role IN ('admin', 'moderator', 'member')),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  last_read_at TIMESTAMPTZ,
  is_muted BOOLEAN DEFAULT FALSE,
  UNIQUE(room_id, user_id)
);

-- =============================================
-- INDEXES
-- =============================================

CREATE INDEX IF NOT EXISTS idx_chat_messages_room_id ON chat_messages(room_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_participants_user_id ON chat_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_participants_room_id ON chat_participants(room_id);
CREATE INDEX IF NOT EXISTS idx_chat_rooms_type ON chat_rooms(type);
CREATE INDEX IF NOT EXISTS idx_chat_rooms_tournament_id ON chat_rooms(tournament_id) WHERE tournament_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_chat_rooms_team_id ON chat_rooms(team_id) WHERE team_id IS NOT NULL;

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

-- Enable RLS
ALTER TABLE chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_participants ENABLE ROW LEVEL SECURITY;

-- =============================================
-- RLS POLICIES FOR chat_rooms
-- =============================================

-- Users can view rooms they're participants of
CREATE POLICY "Users can view rooms they participate in"
  ON chat_rooms FOR SELECT
  USING (
    id IN (
      SELECT room_id FROM chat_participants
      WHERE user_id = auth.uid()
    )
    OR type = 'global'
  );

-- Users can create rooms
CREATE POLICY "Users can create rooms"
  ON chat_rooms FOR INSERT
  WITH CHECK (created_by = auth.uid());

-- Room creators and admins can update rooms
CREATE POLICY "Room admins can update rooms"
  ON chat_rooms FOR UPDATE
  USING (
    id IN (
      SELECT room_id FROM chat_participants
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Room creators can delete rooms
CREATE POLICY "Room creators can delete rooms"
  ON chat_rooms FOR DELETE
  USING (created_by = auth.uid());

-- =============================================
-- RLS POLICIES FOR chat_messages
-- =============================================

-- Users can view messages in their rooms
CREATE POLICY "Users can view messages in their rooms"
  ON chat_messages FOR SELECT
  USING (
    room_id IN (
      SELECT room_id FROM chat_participants
      WHERE user_id = auth.uid()
    )
    OR room_id IN (
      SELECT id FROM chat_rooms WHERE type = 'global'
    )
  );

-- Users can send messages to their rooms (if not muted)
CREATE POLICY "Users can send messages to their rooms"
  ON chat_messages FOR INSERT
  WITH CHECK (
    room_id IN (
      SELECT room_id FROM chat_participants
      WHERE user_id = auth.uid() AND is_muted = FALSE
    )
    OR room_id IN (
      SELECT id FROM chat_rooms WHERE type = 'global'
    )
  );

-- Users can update their own messages
CREATE POLICY "Users can update their own messages"
  ON chat_messages FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Users can delete their own messages
CREATE POLICY "Users can delete their own messages"
  ON chat_messages FOR DELETE
  USING (user_id = auth.uid());

-- =============================================
-- RLS POLICIES FOR chat_participants
-- =============================================

-- Users can view participants in their rooms
CREATE POLICY "Users can view participants in their rooms"
  ON chat_participants FOR SELECT
  USING (
    room_id IN (
      SELECT room_id FROM chat_participants
      WHERE user_id = auth.uid()
    )
  );

-- Room admins can add participants
CREATE POLICY "Room admins can add participants"
  ON chat_participants FOR INSERT
  WITH CHECK (
    room_id IN (
      SELECT room_id FROM chat_participants
      WHERE user_id = auth.uid() AND role IN ('admin', 'moderator')
    )
    OR user_id = auth.uid()
  );

-- Users can update their own participant record
CREATE POLICY "Users can update their own participant record"
  ON chat_participants FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Users can leave rooms (delete their participant record)
CREATE POLICY "Users can leave rooms"
  ON chat_participants FOR DELETE
  USING (user_id = auth.uid());

-- =============================================
-- FUNCTIONS
-- =============================================

-- Function to update room's updated_at timestamp when a message is sent
CREATE OR REPLACE FUNCTION update_room_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE chat_rooms
  SET updated_at = NOW()
  WHERE id = NEW.room_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update room timestamp on new message
CREATE TRIGGER update_room_timestamp_trigger
  AFTER INSERT ON chat_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_room_timestamp();

-- Function to update last_read_at for a user in a room
CREATE OR REPLACE FUNCTION update_last_read(p_room_id UUID, p_user_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE chat_participants
  SET last_read_at = NOW()
  WHERE room_id = p_room_id AND user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- REALTIME CONFIGURATION
-- =============================================
-- After running this script, go to:
-- Database → Replication in Supabase Dashboard
-- Enable replication for: chat_rooms, chat_messages, chat_participants

-- =============================================
-- SEED DATA (Optional - for testing)
-- =============================================

-- Create a global chat room
INSERT INTO chat_rooms (name, type, created_by)
VALUES (
  'Global Chat',
  'global',
  '00000000-0000-0000-0000-000000000000'
) ON CONFLICT DO NOTHING;

-- =============================================
-- NOTES
-- =============================================
-- 1. Replace '00000000-0000-0000-0000-000000000000' with actual user IDs
-- 2. Enable Realtime in Supabase Dashboard for all three tables
-- 3. Make sure to set up authentication before using the chat system
-- 4. Consider adding rate limiting for message sending in production
