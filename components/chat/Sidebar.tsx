'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Search, X } from 'lucide-react'
import { useChatStore } from '@/lib/store'
import { Contact } from '@/types'
import { cn } from '@/lib/utils'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { contacts, currentChat, setCurrentChat } = useChatStore()
  const [searchQuery, setSearchQuery] = useState('')

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSelectContact = (contact: Contact) => {
    setCurrentChat(contact)
    onClose()
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed md:relative inset-y-0 left-0 z-50 w-80 md:w-96 bg-card border-r border-border flex flex-col transition-transform duration-300 md:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-bold">Messages</h2>
            <button
              onClick={onClose}
              className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-muted border border-border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>
        </div>

        {/* Contacts List */}
        <div className="flex-1 overflow-y-auto p-2">
          {filteredContacts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <div className="text-4xl mb-4">💬</div>
              <p className="text-muted-foreground">No conversations found</p>
            </div>
          ) : (
            filteredContacts.map((contact) => (
              <button
                key={contact.id}
                onClick={() => handleSelectContact(contact)}
                className={cn(
                  'w-full flex items-center gap-3 p-3 rounded-xl transition-all hover:bg-muted group',
                  currentChat?.id === contact.id && 'bg-gradient-to-r from-primary/10 to-secondary/10 border-l-4 border-primary'
                )}
              >
                <div className="relative">
                  <Image
                    src={contact.avatar}
                    alt={contact.name}
                    width={50}
                    height={50}
                    className="rounded-full border-2 border-border group-hover:border-primary transition-colors"
                  />
                  {/* Status Indicator */}
                  <span
                    className={cn(
                      'absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-card',
                      contact.status === 'online' && 'bg-green-500',
                      contact.status === 'away' && 'bg-yellow-500',
                      contact.status === 'offline' && 'bg-gray-500'
                    )}
                  />
                </div>

                <div className="flex-1 text-left min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-semibold truncate">{contact.name}</p>
                    {contact.unreadCount && contact.unreadCount > 0 && (
                      <span className="flex items-center justify-center w-6 h-6 bg-primary text-primary-foreground text-xs font-bold rounded-full">
                        {contact.unreadCount}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {contact.lastMessage || 'No messages yet'}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      </aside>
    </>
  )
}
