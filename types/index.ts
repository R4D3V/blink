export interface User {
  id: string
  email: string
  name: string
  avatar: string
  createdAt?: string
  lastSeen?: string
}

export interface Contact extends User {
  status: 'online' | 'offline' | 'away'
  lastMessage?: string
  unreadCount?: number
}

export interface Message {
  id: string
  conversationId: string
  senderId: string
  content?: string
  mediaUrl?: string
  mediaType?: 'image' | 'video' | 'audio' | 'file'
  timestamp: Date
  status: 'sending' | 'sent' | 'delivered' | 'read'
  isDeleted?: boolean
}

export interface Conversation {
  id: string
  type: 'direct' | 'group'
  name?: string
  participants: string[]
  lastMessage?: Message
  createdAt: Date
  updatedAt: Date
}

export interface TypingStatus {
  userId: string
  conversationId: string
  isTyping: boolean
}

export interface CallData {
  from: string
  to: string
  signal?: any
  callType: 'audio' | 'video'
  conversationId: string
}

export interface AuthState {
  user: User | null
  setUser: (user: User | null) => void
  loadUser: () => void
  logout: () => void
}

export interface ChatState {
  contacts: Contact[]
  messages: Record<string, Message[]>
  currentChat: Contact | null
  typingUsers: Record<string, boolean>
  setContacts: (contacts: Contact[]) => void
  setCurrentChat: (contact: Contact | null) => void
  addMessage: (conversationId: string, message: Message) => void
  setMessages: (conversationId: string, messages: Message[]) => void
  setTyping: (conversationId: string, userId: string, isTyping: boolean) => void
}

export interface CallState {
  isInCall: boolean
  callType: 'audio' | 'video' | null
  isMuted: boolean
  isVideoOff: boolean
  receivingCall: boolean
  caller: string | null
  callerSignal: any
  setIsInCall: (isInCall: boolean) => void
  setCallType: (type: 'audio' | 'video' | null) => void
  setIsMuted: (muted: boolean) => void
  setIsVideoOff: (off: boolean) => void
  setReceivingCall: (receiving: boolean) => void
  setCaller: (caller: string | null) => void
  setCallerSignal: (signal: any) => void
}
