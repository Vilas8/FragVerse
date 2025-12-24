'use client'

import { ChatMessage } from '@/types/chat'
import { MessageItem } from './MessageItem'

interface MessageListProps {
  messages: ChatMessage[]
  currentUserId: string
  onReply: (messageId: string) => void
  onDelete: (messageId: string) => Promise<void>
  onEdit: (messageId: string, content: string) => Promise<void>
}

export function MessageList({
  messages,
  currentUserId,
  onReply,
  onDelete,
  onEdit,
}: MessageListProps) {
  if (messages.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">No messages yet. Start the conversation!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4 py-4">
      {messages.map((message) => (
        <MessageItem
          key={message.id}
          message={message}
          isCurrentUser={message.user_id === currentUserId}
          onReply={onReply}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  )
}
