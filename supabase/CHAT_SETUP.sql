-- =============================================
-- FragVerse Chat System - Production Ready Setup
-- =============================================
-- Run this complete script in your Supabase SQL Editor
-- This will create all tables, indexes, RLS policies, and functions

-- =============================================
-- STEP 1: CREATE TABLES
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
-- STEP 2: CREATE INDEXES FOR PERFORMANCE
-- =============================================

CREATE INDEX IF NOT EXISTS idx_chat_messages_room_id ON chat_messages(room_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_participants_user_id ON chat_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_participants_room_id ON chat_participants(room_id);
CREATE INDEX IF NOT EXISTS idx_chat_rooms_type ON chat_rooms(type);
CREATE INDEX IF NOT EXISTS idx_chat_rooms_tournament_id ON chat_rooms(tournament_id) WHERE tournament_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_chat_rooms_team_id ON chat_rooms(team_id) WHERE team_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_chat_rooms_created_by ON chat_rooms(created_by);

-- =============================================
-- STEP 3: ENABLE ROW LEVEL SECURITY
-- =============================================

ALTER TABLE chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_participants ENABLE ROW LEVEL SECURITY;

-- =============================================
-- STEP 4: CREATE RLS POLICIES FOR chat_rooms
-- =============================================

-- Drop existing policies if they exist (for re-running script)
DROP POLICY IF EXISTS "Users can view rooms they participate in" ON chat_rooms;
DROP POLICY IF EXISTS "Users can create rooms" ON chat_rooms;
DROP POLICY IF EXISTS "Room admins can update rooms" ON chat_rooms;
DROP POLICY IF EXISTS "Room creators can delete rooms" ON chat_rooms;

-- Users can view rooms they're participants of or global rooms
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

-- Room admins can update rooms
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
-- STEP 5: CREATE RLS POLICIES FOR chat_messages
-- =============================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view messages in their rooms" ON chat_messages;
DROP POLICY IF EXISTS "Users can send messages to their rooms" ON chat_messages;
DROP POLICY IF EXISTS "Users can update their own messages" ON chat_messages;
DROP POLICY IF EXISTS "Users can delete their own messages" ON chat_messages;

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
-- STEP 6: CREATE RLS POLICIES FOR chat_participants
-- =============================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view participants in their rooms" ON chat_participants;
DROP POLICY IF EXISTS "Room admins can add participants" ON chat_participants;
DROP POLICY IF EXISTS "Users can update their own participant record" ON chat_participants;
DROP POLICY IF EXISTS "Users can leave rooms" ON chat_participants;

-- Users can view participants in their rooms
CREATE POLICY "Users can view participants in their rooms"
  ON chat_participants FOR SELECT
  USING (
    room_id IN (
      SELECT room_id FROM chat_participants
      WHERE user_id = auth.uid()
    )
  );

-- Room admins can add participants, or users can add themselves
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
-- STEP 7: CREATE UTILITY FUNCTIONS
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update room timestamp on new message
DROP TRIGGER IF EXISTS update_room_timestamp_trigger ON chat_messages;
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
-- STEP 8: CREATE DEFAULT GLOBAL CHAT ROOM
-- =============================================

-- Insert a global chat room (only if it doesn't exist)
INSERT INTO chat_rooms (id, name, type, created_by, created_at, updated_at)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Global Chat',
  'global',
  '00000000-0000-0000-0000-000000000000',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- STEP 9: GRANT PERMISSIONS
-- =============================================

-- Grant necessary permissions to authenticated users
GRANT ALL ON chat_rooms TO authenticated;
GRANT ALL ON chat_messages TO authenticated;
GRANT ALL ON chat_participants TO authenticated;

-- =============================================
-- SETUP COMPLETE!
-- =============================================
-- Next steps:
-- 1. Go to Database → Replication in Supabase Dashboard
-- 2. Enable replication for:
--    - chat_rooms
--    - chat_messages
--    - chat_participants
-- 3. Your chat system is ready to use!

-- To verify the setup, run:
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name LIKE 'chat_%';
