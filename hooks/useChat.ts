import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase/client'
import type { ChatMessage, ChatRoom, SendMessageParams } from '@/types/chat'
import { RealtimeChannel } from '@supabase/supabase-js'

export function useChat(roomId: string, userId: string, username: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [channel, setChannel] = useState<RealtimeChannel | null>(null)

  // Fetch initial messages
  useEffect(() => {
    if (!roomId) return

    const fetchMessages = async () => {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('chat_messages')
          .select('*')
          .eq('room_id', roomId)
          .order('created_at', { ascending: true })
          .limit(100)

        if (error) throw error
        setMessages(data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch messages')
      } finally {
        setLoading(false)
      }
    }

    fetchMessages()
  }, [roomId])

  // Subscribe to real-time updates
  useEffect(() => {
    if (!roomId) return

    const channel = supabase
      .channel(`room:${roomId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as ChatMessage])
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'chat_messages',
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === payload.new.id ? (payload.new as ChatMessage) : msg
            )
          )
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'chat_messages',
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => {
          setMessages((prev) => prev.filter((msg) => msg.id !== payload.old.id))
        }
      )
      .subscribe()

    setChannel(channel)

    return () => {
      channel.unsubscribe()
    }
  }, [roomId])

  const sendMessage = useCallback(
    async ({ content, message_type = 'text', reply_to = null }: Omit<SendMessageParams, 'room_id'>) => {
      try {
        const { error } = await supabase.from('chat_messages').insert({
          room_id: roomId,
          user_id: userId,
          username: username,
          content,
          message_type,
          reply_to,
        })

        if (error) throw error
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to send message')
        throw err
      }
    },
    [roomId, userId, username]
  )

  const deleteMessage = useCallback(
    async (messageId: string) => {
      try {
        const { error } = await supabase
          .from('chat_messages')
          .delete()
          .eq('id', messageId)
          .eq('user_id', userId)

        if (error) throw error
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete message')
        throw err
      }
    },
    [userId]
  )

  const editMessage = useCallback(
    async (messageId: string, newContent: string) => {
      try {
        const { error } = await supabase
          .from('chat_messages')
          .update({ content: newContent, is_edited: true, updated_at: new Date().toISOString() })
          .eq('id', messageId)
          .eq('user_id', userId)

        if (error) throw error
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to edit message')
        throw err
      }
    },
    [userId]
  )

  return {
    messages,
    loading,
    error,
    sendMessage,
    deleteMessage,
    editMessage,
  }
}
