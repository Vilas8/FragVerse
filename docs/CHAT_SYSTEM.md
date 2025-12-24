# Real-Time Chat System - FragVerse

## Overview

FragVerse now includes a fully-functional real-time chat system powered by Supabase Realtime. This system supports multiple chat room types, real-time message updates, message editing/deletion, and user presence.

## Features

- ✅ Real-time messaging using Supabase Realtime
- ✅ Multiple chat room types (Tournament, Team, Direct, Global)
- ✅ Message editing and deletion
- ✅ Reply to messages
- ✅ User avatars and profiles
- ✅ Message history
- ✅ Typing indicators support (ready for implementation)
- ✅ Read receipts support (ready for implementation)

## Architecture

### Database Schema

The chat system uses three main tables:

#### 1. `chat_rooms`
Stores chat room information
```sql
CREATE TABLE chat_rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('tournament', 'team', 'direct', 'global')),
  tournament_id UUID REFERENCES tournaments(id),
  team_id UUID REFERENCES teams(id),
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB
);
```

#### 2. `chat_messages`
Stores all chat messages
```sql
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES chat_rooms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  username TEXT NOT NULL,
  user_avatar TEXT,
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'file', 'system')),
  reply_to UUID REFERENCES chat_messages(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  is_edited BOOLEAN DEFAULT FALSE,
  metadata JSONB
);

CREATE INDEX idx_chat_messages_room_id ON chat_messages(room_id);
CREATE INDEX idx_chat_messages_created_at ON chat_messages(created_at);
```

#### 3. `chat_participants`
Tracks room participants and their roles
```sql
CREATE TABLE chat_participants (
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

CREATE INDEX idx_chat_participants_user_id ON chat_participants(user_id);
CREATE INDEX idx_chat_participants_room_id ON chat_participants(room_id);
```

### Row Level Security (RLS)

**Important:** Enable RLS and set up policies:

```sql
-- Enable RLS
ALTER TABLE chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_participants ENABLE ROW LEVEL SECURITY;

-- Chat Rooms Policies
CREATE POLICY "Users can view rooms they're participants of"
  ON chat_rooms FOR SELECT
  USING (
    id IN (
      SELECT room_id FROM chat_participants
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create rooms"
  ON chat_rooms FOR INSERT
  WITH CHECK (created_by = auth.uid());

-- Chat Messages Policies
CREATE POLICY "Users can view messages in their rooms"
  ON chat_messages FOR SELECT
  USING (
    room_id IN (
      SELECT room_id FROM chat_participants
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can send messages to their rooms"
  ON chat_messages FOR INSERT
  WITH CHECK (
    room_id IN (
      SELECT room_id FROM chat_participants
      WHERE user_id = auth.uid() AND is_muted = FALSE
    )
  );

CREATE POLICY "Users can update their own messages"
  ON chat_messages FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own messages"
  ON chat_messages FOR DELETE
  USING (user_id = auth.uid());

-- Chat Participants Policies
CREATE POLICY "Users can view participants in their rooms"
  ON chat_participants FOR SELECT
  USING (
    room_id IN (
      SELECT room_id FROM chat_participants
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Room admins can add participants"
  ON chat_participants FOR INSERT
  WITH CHECK (
    room_id IN (
      SELECT room_id FROM chat_participants
      WHERE user_id = auth.uid() AND role IN ('admin', 'moderator')
    )
  );
```

## Setup Instructions

### 1. Supabase Configuration

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Run the SQL schema from above in the SQL Editor
3. Enable Realtime for the tables:
   - Go to Database → Replication
   - Enable replication for `chat_messages`, `chat_rooms`, and `chat_participants`

### 2. Environment Variables

Add these to your `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Install Dependencies

The required packages are already in package.json:
```bash
npm install
```

## Usage

### Basic Chat Implementation

```tsx
import { ChatWindow } from '@/components/chat/ChatWindow'

export default function ChatPage() {
  const roomId = 'your-room-id'
  const userId = 'current-user-id'
  const username = 'current-username'

  return (
    <div className="h-screen">
      <ChatWindow
        roomId={roomId}
        userId={userId}
        username={username}
        roomName="Tournament Chat"
      />
    </div>
  )
}
```

### Creating a Chat Room

```tsx
import { useChatRooms } from '@/hooks/useChatRooms'

function CreateRoomButton() {
  const { createRoom } = useChatRooms(userId)

  const handleCreateRoom = async () => {
    const room = await createRoom(
      'Tournament Lobby',
      'tournament',
      { tournament_id: 'tournament-123' }
    )
    console.log('Room created:', room)
  }

  return <button onClick={handleCreateRoom}>Create Room</button>
}
```

### Joining a Chat Room

```tsx
import { useChatRooms } from '@/hooks/useChatRooms'

function JoinRoomButton({ roomId }: { roomId: string }) {
  const { joinRoom } = useChatRooms(userId)

  const handleJoin = async () => {
    await joinRoom(roomId, username)
  }

  return <button onClick={handleJoin}>Join Room</button>
}
```

## Chat Room Types

### Tournament Chat
Linked to specific tournaments for participants to communicate.
```tsx
await createRoom('Tournament Chat', 'tournament', {
  tournament_id: tournamentId
})
```

### Team Chat
Private chat for team members.
```tsx
await createRoom('Team Chat', 'team', {
  team_id: teamId
})
```

### Direct Messages
One-on-one conversations between users.
```tsx
await createRoom('DM', 'direct', {
  metadata: { participants: [userId1, userId2] }
})
```

### Global Chat
Open chat for all platform users.
```tsx
await createRoom('Global Chat', 'global')
```

## Customization

### Styling
The components use Tailwind CSS and shadcn/ui. Customize by:
- Modifying component classes
- Updating `tailwind.config.ts`
- Using the cyberpunk design system in `CYBERPUNK_DESIGN_SYSTEM.md`

### Adding Features

#### Typing Indicators
Extend the `useChat` hook to track typing status:
```tsx
const [typingUsers, setTypingUsers] = useState<string[]>([])

// Broadcast typing status
supabase.channel(`room:${roomId}:typing`)
  .on('presence', { event: 'sync' }, () => {
    // Handle typing presence
  })
```

#### File Uploads
Implement file uploads using Supabase Storage:
```tsx
const uploadFile = async (file: File) => {
  const { data, error } = await supabase.storage
    .from('chat-files')
    .upload(`${roomId}/${file.name}`, file)

  if (error) throw error

  await sendMessage({
    content: data.path,
    message_type: 'file',
  })
}
```

## Performance Optimization

### Message Pagination
Modify the `useChat` hook to implement pagination:
```tsx
const fetchMessages = async (before?: string) => {
  let query = supabase
    .from('chat_messages')
    .select('*')
    .eq('room_id', roomId)
    .order('created_at', { ascending: false })
    .limit(50)

  if (before) {
    query = query.lt('created_at', before)
  }

  const { data, error } = await query
  // Handle results
}
```

### Message Caching
Use React Query or SWR for better caching:
```tsx
import { useQuery } from '@tanstack/react-query'

const { data: messages } = useQuery({
  queryKey: ['messages', roomId],
  queryFn: () => fetchMessages(roomId),
})
```

## Troubleshooting

### Messages Not Appearing in Real-Time
- Verify Realtime is enabled in Supabase Dashboard
- Check browser console for WebSocket errors
- Ensure RLS policies allow message insertion

### Authentication Issues
- Verify environment variables are set correctly
- Check Supabase auth configuration
- Ensure user is authenticated before accessing chat

### Performance Issues
- Implement message pagination
- Add indexes on frequently queried columns
- Consider using Supabase Edge Functions for complex queries

## Security Best Practices

1. **Always use RLS policies** - Never disable RLS in production
2. **Validate user input** - Sanitize message content on the client
3. **Rate limiting** - Implement rate limits for message sending
4. **Content moderation** - Add profanity filters or moderation systems
5. **Secure file uploads** - Validate file types and sizes

## Future Enhancements

- [ ] Voice/Video chat integration
- [ ] Message reactions (emoji)
- [ ] Message search functionality
- [ ] User blocking/reporting
- [ ] Push notifications
- [ ] Message encryption
- [ ] Rich text formatting
- [ ] GIF/Emoji picker
- [ ] Thread support
- [ ] Message pinning

## API Reference

### `useChat` Hook

```tsx
const {
  messages,      // Array of chat messages
  loading,       // Loading state
  error,         // Error message if any
  sendMessage,   // Function to send a message
  deleteMessage, // Function to delete a message
  editMessage,   // Function to edit a message
} = useChat(roomId, userId, username)
```

### `useChatRooms` Hook

```tsx
const {
  rooms,      // Array of chat rooms
  loading,    // Loading state
  error,      // Error message if any
  createRoom, // Function to create a room
  joinRoom,   // Function to join a room
} = useChatRooms(userId)
```

## Support

For issues or questions:
1. Check the [Supabase Documentation](https://supabase.com/docs)
2. Review the code comments in the source files
3. Open an issue in the repository

---

**Built with ❤️ for FragVerse - The Ultimate E-Sports Platform**
