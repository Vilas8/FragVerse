'use client'

import { useState } from 'react'
import { ChatMessage } from '@/types/chat'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { MoreVertical, Reply, Edit, Trash2 } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface MessageItemProps {
  message: ChatMessage
  isCurrentUser: boolean
  onReply: (messageId: string) => void
  onDelete: (messageId: string) => Promise<void>
  onEdit: (messageId: string, content: string) => Promise<void>
}

export function MessageItem({ message, isCurrentUser, onReply, onDelete, onEdit }: MessageItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(message.content)

  const handleEdit = async () => {
    if (editContent.trim() && editContent !== message.content) {
      await onEdit(message.id, editContent.trim())
      setIsEditing(false)
    }
  }

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this message?')) {
      await onDelete(message.id)
    }
  }

  const timeAgo = formatDistanceToNow(new Date(message.created_at), { addSuffix: true })

  return (
    <div
      className={`flex gap-3 ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {/* Avatar */}
      <Avatar className="h-10 w-10">
        <AvatarImage src={message.user_avatar || undefined} />
        <AvatarFallback className="bg-primary text-primary-foreground">
          {message.username.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      {/* Message Content */}
      <div className={`flex max-w-[70%] flex-col ${isCurrentUser ? 'items-end' : 'items-start'}`}>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-foreground">{message.username}</span>
          <span className="text-xs text-muted-foreground">{timeAgo}</span>
          {message.is_edited && <span className="text-xs text-muted-foreground">(edited)</span>}
        </div>

        {isEditing ? (
          <div className="mt-1 w-full">
            <input
              type="text"
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleEdit()
                if (e.key === 'Escape') setIsEditing(false)
              }}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              autoFocus
            />
            <div className="mt-2 flex gap-2">
              <Button size="sm" onClick={handleEdit}>
                Save
              </Button>
              <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div
            className={`group relative mt-1 rounded-lg px-4 py-2 ${
              isCurrentUser
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-foreground'
            }`}
          >
            <p className="break-words text-sm">{message.content}</p>

            {/* Actions */}
            <div className="absolute -right-2 -top-2 opacity-0 transition-opacity group-hover:opacity-100">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="icon" variant="ghost" className="h-6 w-6">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onReply(message.id)}>
                    <Reply className="mr-2 h-4 w-4" />
                    Reply
                  </DropdownMenuItem>
                  {isCurrentUser && (
                    <>
                      <DropdownMenuItem onClick={() => setIsEditing(true)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
