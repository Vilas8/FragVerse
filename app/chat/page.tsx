'use client'

import { useState, useEffect } from 'react'
import { ChatWindow } from '@/components/chat/ChatWindow'
import { ChatRoomList } from '@/components/chat/ChatRoomList'
import { ChatRoom } from '@/types/chat'
import { supabase } from '@/lib/supabase/client'
import { Loader2 } from 'lucide-react'

export default function ChatPage() {
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [username, setUsername] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get current user
    const getCurrentUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (user) {
          setUserId(user.id)
          setUsername(user.email?.split('@')[0] || 'User')
        }
      } catch (error) {
        console.error('Error fetching user:', error)
      } finally {
        setLoading(false)
      }
    }

    getCurrentUser()
  }, [])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!userId) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">Please Log In</h1>
          <p className="mt-2 text-muted-foreground">
            You need to be logged in to access the chat.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-80 border-r border-border bg-card">
        <ChatRoomList
          userId={userId}
          username={username}
          onSelectRoom={setSelectedRoom}
          selectedRoomId={selectedRoom?.id}
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 bg-background">
        {selectedRoom ? (
          <ChatWindow
            roomId={selectedRoom.id}
            userId={userId}
            username={username}
            roomName={selectedRoom.name}
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-foreground">Welcome to FragVerse Chat</h2>
              <p className="mt-2 text-muted-foreground">
                Select a room from the sidebar or create a new one to start chatting.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
