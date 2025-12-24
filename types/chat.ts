export interface ChatMessage {
  id: string
  room_id: string
  user_id: string
  username: string
  user_avatar: string | null
  content: string
  message_type: 'text' | 'image' | 'file' | 'system'
  reply_to: string | null
  created_at: string
  updated_at: string
  is_edited: boolean
  metadata: Record<string, any> | null
}

export interface ChatRoom {
  id: string
  name: string
  type: 'tournament' | 'team' | 'direct' | 'global'
  tournament_id: string | null
  team_id: string | null
  created_by: string
  created_at: string
  updated_at: string
  metadata: Record<string, any> | null
}

export interface ChatParticipant {
  id: string
  room_id: string
  user_id: string
  username: string
  role: 'admin' | 'moderator' | 'member'
  joined_at: string
  last_read_at: string | null
  is_muted: boolean
}

export interface SendMessageParams {
  room_id: string
  content: string
  message_type?: 'text' | 'image' | 'file' | 'system'
  reply_to?: string | null
}
