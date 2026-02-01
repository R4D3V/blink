'use client'

import { useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { useAuthStore, useChatStore } from '@/lib/store'
import { Message } from '@/types'

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001'

let socket: Socket | null = null

export function useSocket() {
  const [isConnected, setIsConnected] = useState(false)
  const user = useAuthStore((state) => state.user)
  const { addMessage, setTyping, currentChat } = useChatStore()

  useEffect(() => {
    if (!user) return

    // Initialize socket connection
    if (!socket) {
      socket = io(SOCKET_URL, {
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      })

      socket.on('connect', () => {
        console.log('Socket connected')
        setIsConnected(true)
        socket?.emit('user:join', user.id)
      })

      socket.on('disconnect', () => {
        console.log('Socket disconnected')
        setIsConnected(false)
      })

      socket.on('message:new', (message: Message) => {
        addMessage(message.conversationId, message)
      })

      socket.on('user:typing', ({ userId, conversationId, isTyping }) => {
        setTyping(conversationId, userId, isTyping)
      })
    }

    return () => {
      // Don't disconnect on unmount, keep connection alive
    }
  }, [user, addMessage, setTyping])

  const sendMessage = (conversationId: string, message: Message) => {
    socket?.emit('message:send', { conversationId, message })
  }

  const joinConversation = (conversationId: string) => {
    socket?.emit('conversation:join', conversationId)
  }

  const sendTypingStatus = (conversationId: string, isTyping: boolean) => {
    if (user) {
      socket?.emit('typing:send', {
        conversationId,
        userId: user.id,
        isTyping,
      })
    }
  }

  const callUser = (data: { userToCall: string; signalData: any; from: string }) => {
    socket?.emit('call:user', data)
  }

  const answerCall = (data: { signal: any; to: string }) => {
    socket?.emit('call:answer', data)
  }

  const onIncomingCall = (callback: (data: { from: string; signal: any }) => void) => {
    socket?.on('call:incoming', callback)
  }

  const onCallAccepted = (callback: (signal: any) => void) => {
    socket?.on('call:accepted', callback)
  }

  return {
    socket,
    isConnected,
    sendMessage,
    joinConversation,
    sendTypingStatus,
    callUser,
    answerCall,
    onIncomingCall,
    onCallAccepted,
  }
}
