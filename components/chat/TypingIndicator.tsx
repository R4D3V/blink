'use client'

import { useChatStore } from '@/lib/store'

export default function TypingIndicator() {
  const { currentChat, typingUsers } = useChatStore()

  if (!currentChat) return null

  const isTyping = typingUsers[`${currentChat.id}-${currentChat.id}`]

  if (!isTyping) return null

  return (
    <div className="flex gap-3 max-w-[75%] mr-auto">
      <div className="w-9 h-9 rounded-full bg-muted flex-shrink-0" />
      <div className="px-4 py-3 bg-muted rounded-2xl rounded-tl-none">
        <div className="flex gap-1">
          <span className="w-2 h-2 bg-muted-foreground rounded-full typing-dot" />
          <span className="w-2 h-2 bg-muted-foreground rounded-full typing-dot" />
          <span className="w-2 h-2 bg-muted-foreground rounded-full typing-dot" />
        </div>
      </div>
    </div>
  )
}
