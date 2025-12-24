'use client'

import { useState, useEffect, useRef } from 'react'
import { useChat } from '@/hooks/useChat'
import { MessageList } from './MessageList'
import { MessageInput } from './MessageInput'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Loader2 } from 'lucide-react'

interface ChatWindowProps {
  roomId: string
  userId: string
  username: string
  roomName?: string
}

export function ChatWindow({ roomId, userId, username, roomName = 'Chat' }: ChatWindowProps) {
  const { messages, loading, error, sendMessage, deleteMessage, editMessage } = useChat(
    roomId,
    userId,
    username
  )
  const [replyTo, setReplyTo] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return

    try {
      await sendMessage({
        content: content.trim(),
        reply_to: replyTo,
      })
      setReplyTo(null)
    } catch (error) {
      console.error('Failed to send message:', error)
    }
  }

  const handleReply = (messageId: string) => {
    setReplyTo(messageId)
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-destructive">Error: {error}</p>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b border-border bg-card px-6 py-4">
        <h2 className="text-xl font-bold text-foreground">{roomName}</h2>
        <p className="text-sm text-muted-foreground">{messages.length} messages</p>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 px-4" ref={scrollRef}>
        <MessageList
          messages={messages}
          currentUserId={userId}
          onReply={handleReply}
          onDelete={deleteMessage}
          onEdit={editMessage}
        />
      </ScrollArea>

      {/* Input */}
      <div className="border-t border-border bg-card p-4">
        {replyTo && (
          <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
            <span>Replying to message</span>
            <button
              onClick={() => setReplyTo(null)}
              className="text-primary hover:text-primary/80"
            >
              Cancel
            </button>
          </div>
        )}
        <MessageInput onSend={handleSendMessage} disabled={loading} />
      </div>
    </div>
  )
}
