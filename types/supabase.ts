export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      chat_rooms: {
        Row: {
          id: string
          name: string
          type: 'tournament' | 'team' | 'direct' | 'global'
          tournament_id: string | null
          team_id: string | null
          created_by: string
          created_at: string
          updated_at: string
          metadata: Json | null
        }
        Insert: {
          id?: string
          name: string
          type: 'tournament' | 'team' | 'direct' | 'global'
          tournament_id?: string | null
          team_id?: string | null
          created_by: string
          created_at?: string
          updated_at?: string
          metadata?: Json | null
        }
        Update: {
          id?: string
          name?: string
          type?: 'tournament' | 'team' | 'direct' | 'global'
          tournament_id?: string | null
          team_id?: string | null
          created_by?: string
          created_at?: string
          updated_at?: string
          metadata?: Json | null
        }
      }
      chat_messages: {
        Row: {
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
          metadata: Json | null
        }
        Insert: {
          id?: string
          room_id: string
          user_id: string
          username: string
          user_avatar?: string | null
          content: string
          message_type?: 'text' | 'image' | 'file' | 'system'
          reply_to?: string | null
          created_at?: string
          updated_at?: string
          is_edited?: boolean
          metadata?: Json | null
        }
        Update: {
          id?: string
          room_id?: string
          user_id?: string
          username?: string
          user_avatar?: string | null
          content?: string
          message_type?: 'text' | 'image' | 'file' | 'system'
          reply_to?: string | null
          created_at?: string
          updated_at?: string
          is_edited?: boolean
          metadata?: Json | null
        }
      }
      chat_participants: {
        Row: {
          id: string
          room_id: string
          user_id: string
          username: string
          role: 'admin' | 'moderator' | 'member'
          joined_at: string
          last_read_at: string | null
          is_muted: boolean
        }
        Insert: {
          id?: string
          room_id: string
          user_id: string
          username: string
          role?: 'admin' | 'moderator' | 'member'
          joined_at?: string
          last_read_at?: string | null
          is_muted?: boolean
        }
        Update: {
          id?: string
          room_id?: string
          user_id?: string
          username?: string
          role?: 'admin' | 'moderator' | 'member'
          joined_at?: string
          last_read_at?: string | null
          is_muted?: boolean
        }
      }
    }
    Views: {}
    Functions: {}
    Enums: {}
  }
}
