import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase/client'
import type { ChatRoom } from '@/types/chat'

export function useChatRooms(userId: string) {
  const [rooms, setRooms] = useState<ChatRoom[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) return

    const fetchRooms = async () => {
      try {
        setLoading(true)
        // Get rooms where user is a participant
        const { data: participantRooms, error: participantError } = await supabase
          .from('chat_participants')
          .select('room_id')
          .eq('user_id', userId)

        if (participantError) throw participantError

        const roomIds = participantRooms?.map((p) => p.room_id) || []

        // Fetch room details
        const { data: roomsData, error: roomsError } = await supabase
          .from('chat_rooms')
          .select('*')
          .in('id', roomIds)
          .order('updated_at', { ascending: false })

        if (roomsError) throw roomsError
        setRooms(roomsData || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch rooms')
      } finally {
        setLoading(false)
      }
    }

    fetchRooms()
  }, [userId])

  const createRoom = useCallback(
    async (
      name: string,
      type: 'tournament' | 'team' | 'direct' | 'global',
      options?: {
        tournament_id?: string
        team_id?: string
        metadata?: Record<string, any>
      }
    ) => {
      try {
        const { data: room, error: roomError } = await supabase
          .from('chat_rooms')
          .insert({
            name,
            type,
            created_by: userId,
            tournament_id: options?.tournament_id || null,
            team_id: options?.team_id || null,
            metadata: options?.metadata || null,
          })
          .select()
          .single()

        if (roomError) throw roomError

        // Add creator as admin participant
        const { error: participantError } = await supabase.from('chat_participants').insert({
          room_id: room.id,
          user_id: userId,
          username: '', // Should be fetched from user profile
          role: 'admin',
        })

        if (participantError) throw participantError

        setRooms((prev) => [room, ...prev])
        return room
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to create room')
        throw err
      }
    },
    [userId]
  )

  const joinRoom = useCallback(
    async (roomId: string, username: string) => {
      try {
        const { error } = await supabase.from('chat_participants').insert({
          room_id: roomId,
          user_id: userId,
          username,
          role: 'member',
        })

        if (error) throw error

        // Fetch the room details
        const { data: room, error: roomError } = await supabase
          .from('chat_rooms')
          .select('*')
          .eq('id', roomId)
          .single()

        if (roomError) throw roomError
        setRooms((prev) => [room, ...prev])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to join room')
        throw err
      }
    },
    [userId]
  )

  return {
    rooms,
    loading,
    error,
    createRoom,
    joinRoom,
  }
}
