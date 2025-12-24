import type { Database } from './supabase'

export type ChatMessage = Database['public']['Tables']['chat_messages']['Row']
export type ChatRoom = Database['public']['Tables']['chat_rooms']['Row']
export type ChatParticipant = Database['public']['Tables']['chat_participants']['Row']

export interface SendMessageParams {
  room_id: string
  content: string
  message_type?: 'text' | 'image' | 'file' | 'system'
  reply_to?: string | null
}
