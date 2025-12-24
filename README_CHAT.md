# 💬 FragVerse Chat System - Quick Start Guide

## 🎉 What's Been Added

A complete real-time chat system has been integrated into your FragVerse platform! Here's what's ready to use:

### ✅ Features Implemented

- **Real-time messaging** using Supabase Realtime
- **Multiple room types**: Tournament, Team, Direct Messages, Global
- **Message management**: Edit, delete, and reply to messages
- **User presence**: See who's online (framework ready)
- **Responsive UI**: Mobile-friendly chat interface
- **Type-safe**: Full TypeScript support

## 🚀 Getting Started

### Step 1: Set Up Supabase

1. **Create a Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Click "New Project"
   - Choose your organization and region
   - Set a strong database password

2. **Run Database Schema**
   - Go to SQL Editor in your Supabase dashboard
   - Copy the contents of `supabase/schema.sql`
   - Paste and run it

3. **Enable Realtime**
   - Go to Database → Replication
   - Find these tables and enable replication:
     - `chat_rooms`
     - `chat_messages`
     - `chat_participants`

4. **Get Your API Keys**
   - Go to Settings → API
   - Copy your `Project URL` and `anon public` key

### Step 2: Configure Environment

1. **Create `.env.local` file** in your project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

2. **Install dependencies** (if not already installed):

```bash
npm install
```

### Step 3: Run the Application

```bash
npm run dev
```

Navigate to `http://localhost:3000/chat` to see your chat system!

## 📁 File Structure

```
FragVerse/
├── app/
│   └── chat/
│       └── page.tsx              # Main chat page
├── components/
│   └── chat/
│       ├── ChatWindow.tsx        # Main chat window
│       ├── ChatRoomList.tsx      # Room sidebar
│       ├── MessageList.tsx       # Message list
│       ├── MessageItem.tsx       # Individual message
│       └── MessageInput.tsx      # Message input field
├── hooks/
│   ├── useChat.ts             # Chat hook
│   └── useChatRooms.ts        # Room management hook
├── lib/
│   └── supabase/
│       ├── client.ts          # Browser client
│       └── server.ts          # Server client
├── types/
│   ├── chat.ts                # Chat types
│   └── supabase.ts            # Database types
└── supabase/
    └── schema.sql             # Database schema
```

## 💻 Usage Examples

### Using the Chat Component Anywhere

```tsx
import { ChatWindow } from '@/components/chat/ChatWindow'

export default function TournamentPage() {
  return (
    <div className="h-screen">
      <ChatWindow
        roomId="your-room-id"
        userId="current-user-id"
        username="PlayerName"
        roomName="Tournament Lobby"
      />
    </div>
  )
}
```

### Creating a Tournament Chat

```tsx
import { useChatRooms } from '@/hooks/useChatRooms'

function TournamentSetup() {
  const { createRoom } = useChatRooms(userId)

  const setupTournamentChat = async (tournamentId: string) => {
    const room = await createRoom(
      'Tournament Lobby',
      'tournament',
      { tournament_id: tournamentId }
    )
    console.log('Chat room created:', room.id)
  }

  return <button onClick={() => setupTournamentChat('123')}>Create Chat</button>
}
```

### Sending Custom Messages

```tsx
import { useChat } from '@/hooks/useChat'

function CustomChat() {
  const { sendMessage } = useChat(roomId, userId, username)

  const sendAnnouncement = async () => {
    await sendMessage({
      content: 'Tournament starts in 5 minutes!',
      message_type: 'system'
    })
  }

  return <button onClick={sendAnnouncement}>Send Announcement</button>
}
```

## 🎨 Customization

### Styling

All components use Tailwind CSS and can be customized:

```tsx
// In MessageItem.tsx
<div className={`your-custom-classes ${isCurrentUser ? 'custom-sent' : 'custom-received'}`}>
  {message.content}
</div>
```

### Adding Emojis

Install an emoji picker:

```bash
npm install emoji-picker-react
```

Integrate in `MessageInput.tsx`:

```tsx
import EmojiPicker from 'emoji-picker-react'

const [showPicker, setShowPicker] = useState(false)

<EmojiPicker onEmojiClick={(emoji) => setContent(prev => prev + emoji.emoji)} />
```

### File Uploads

1. Create a storage bucket in Supabase:
   - Go to Storage → Create bucket: `chat-files`

2. Add upload functionality:

```tsx
const uploadFile = async (file: File) => {
  const { data, error } = await supabase.storage
    .from('chat-files')
    .upload(`${roomId}/${Date.now()}_${file.name}`, file)

  if (error) throw error

  const fileUrl = supabase.storage.from('chat-files').getPublicUrl(data.path)

  await sendMessage({
    content: fileUrl.data.publicUrl,
    message_type: 'file'
  })
}
```

## 🛠️ Troubleshooting

### Issue: "Cannot read property 'from' of undefined"
**Solution**: Check your `.env.local` file has the correct Supabase credentials.

### Issue: Messages not appearing in real-time
**Solution**: 
1. Verify Realtime is enabled in Supabase Dashboard
2. Check browser console for WebSocket errors
3. Ensure RLS policies are set correctly

### Issue: "Auth session missing"
**Solution**: Make sure users are authenticated before accessing chat:

```tsx
const { data: { user } } = await supabase.auth.getUser()
if (!user) {
  // Redirect to login
}
```

### Issue: Can't send messages
**Solution**: Check RLS policies in Supabase:
- Go to Authentication → Policies
- Verify policies exist for `chat_messages`

## 📚 Additional Resources

- **Full Documentation**: See `docs/CHAT_SYSTEM.md`
- **Database Schema**: See `supabase/schema.sql`
- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
- **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)

## 🚀 Next Steps

1. **Set up authentication** (if not already done)
2. **Integrate with tournaments**: Auto-create chat rooms for new tournaments
3. **Add notifications**: Use Supabase Realtime for message notifications
4. **Implement typing indicators**: Track user typing status
5. **Add moderation**: Create moderator tools for managing messages

## 🤝 Support

If you encounter any issues:
1. Check the full documentation in `docs/CHAT_SYSTEM.md`
2. Review Supabase Dashboard for errors
3. Check browser console for JavaScript errors

---

**Happy Chatting! 🎮**

Your FragVerse chat system is now ready to bring your gaming community together!
