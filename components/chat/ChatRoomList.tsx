'use client'

import { useChatRooms } from '@/hooks/useChatRooms'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Plus, MessageSquare, Users, Trophy, Globe } from 'lucide-react'
import { ChatRoom } from '@/types/chat'
import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface ChatRoomListProps {
  userId: string
  username: string
  onSelectRoom: (room: ChatRoom) => void
  selectedRoomId?: string
}

export function ChatRoomList({
  userId,
  username,
  onSelectRoom,
  selectedRoomId,
}: ChatRoomListProps) {
  const { rooms, loading, error, createRoom } = useChatRooms(userId)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newRoomName, setNewRoomName] = useState('')
  const [newRoomType, setNewRoomType] = useState<'tournament' | 'team' | 'direct' | 'global'>(
    'global'
  )

  const handleCreateRoom = async () => {
    if (!newRoomName.trim()) return

    try {
      const room = await createRoom(newRoomName, newRoomType)
      setIsCreateDialogOpen(false)
      setNewRoomName('')
      if (room) onSelectRoom(room)
    } catch (error) {
      console.error('Failed to create room:', error)
    }
  }

  const getRoomIcon = (type: string) => {
    switch (type) {
      case 'tournament':
        return <Trophy className="h-4 w-4" />
      case 'team':
        return <Users className="h-4 w-4" />
      case 'global':
        return <Globe className="h-4 w-4" />
      default:
        return <MessageSquare className="h-4 w-4" />
    }
  }

  if (loading) {
    return <div className="p-4 text-center text-muted-foreground">Loading rooms...</div>
  }

  if (error) {
    return <div className="p-4 text-center text-destructive">Error: {error}</div>
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border p-4">
        <h2 className="text-lg font-semibold text-foreground">Chat Rooms</h2>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button size="icon" variant="ghost">
              <Plus className="h-5 w-5" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Chat Room</DialogTitle>
              <DialogDescription>Create a new chat room for your tournament or team.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="room-name">Room Name</Label>
                <Input
                  id="room-name"
                  placeholder="Enter room name"
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="room-type">Room Type</Label>
                <Select
                  value={newRoomType}
                  onValueChange={(value: any) => setNewRoomType(value)}
                >
                  <SelectTrigger id="room-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="global">Global</SelectItem>
                    <SelectItem value="tournament">Tournament</SelectItem>
                    <SelectItem value="team">Team</SelectItem>
                    <SelectItem value="direct">Direct Message</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleCreateRoom} className="w-full">
                Create Room
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Room List */}
      <ScrollArea className="flex-1">
        <div className="space-y-1 p-2">
          {rooms.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              No chat rooms yet. Create one to get started!
            </div>
          ) : (
            rooms.map((room) => (
              <button
                key={room.id}
                onClick={() => onSelectRoom(room)}
                className={`flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors hover:bg-accent ${
                  selectedRoomId === room.id ? 'bg-accent' : ''
                }`}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  {getRoomIcon(room.type)}
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="truncate font-medium text-foreground">{room.name}</p>
                  <p className="text-xs capitalize text-muted-foreground">{room.type}</p>
                </div>
              </button>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
