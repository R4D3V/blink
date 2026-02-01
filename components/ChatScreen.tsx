'use client'

import { useEffect, useState } from 'react'
import { useAuthStore, useChatStore } from '@/lib/store'
import { useSocket } from '@/hooks/useSocket'
import { createAvatarUrl, generateId } from '@/lib/utils'
import { Contact } from '@/types'
import Header from './chat/Header'
import Sidebar from './chat/Sidebar'
import ChatArea from './chat/ChatArea'
import VideoCallModal from './chat/VideoCallModal'

export default function ChatScreen() {
  const user = useAuthStore((state) => state.user)
  const { contacts, setContacts, currentChat } = useChatStore()
  const { isConnected } = useSocket()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  useEffect(() => {
    // Load demo contacts
    if (contacts.length === 0) {
      loadDemoContacts()
    }
  }, [contacts.length])

  const loadDemoContacts = () => {
    const demoContacts: Contact[] = [
      {
        id: '1',
        name: 'Alice Johnson',
        email: 'alice@example.com',
        avatar: createAvatarUrl('Alice Johnson', '#00f0ff'),
        status: 'online',
        lastMessage: 'See you tomorrow! 👋',
        unreadCount: 2,
      },
      {
        id: '2',
        name: 'Bob Smith',
        email: 'bob@example.com',
        avatar: createAvatarUrl('Bob Smith', '#00ff88'),
        status: 'online',
        lastMessage: 'Thanks for the help!',
        unreadCount: 0,
      },
      {
        id: '3',
        name: 'Carol Williams',
        email: 'carol@example.com',
        avatar: createAvatarUrl('Carol Williams', '#ffaa00'),
        status: 'away',
        lastMessage: 'Let\'s meet up soon',
        unreadCount: 0,
      },
      {
        id: '4',
        name: 'David Brown',
        email: 'david@example.com',
        avatar: createAvatarUrl('David Brown', '#9d4edd'),
        status: 'offline',
        lastMessage: 'Good night!',
        unreadCount: 0,
      },
      {
        id: '5',
        name: 'Emma Davis',
        email: 'emma@example.com',
        avatar: createAvatarUrl('Emma Davis', '#06ffa5'),
        status: 'online',
        lastMessage: 'The project looks great!',
        unreadCount: 1,
      },
    ]
    setContacts(demoContacts)
  }

  return (
    <div className="flex flex-col h-screen">
      <Header 
        isConnected={isConnected} 
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        
        <ChatArea />
      </div>

      <VideoCallModal />
    </div>
  )
}
