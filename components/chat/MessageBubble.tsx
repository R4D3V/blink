'use client'

import Image from 'next/image'
import { Message } from '@/types'
import { formatMessageTime, cn } from '@/lib/utils'
import { Check, CheckCheck } from 'lucide-react'

interface MessageBubbleProps {
  message: Message
  isSent: boolean
  senderAvatar: string
}

export default function MessageBubble({ message, isSent, senderAvatar }: MessageBubbleProps) {
  return (
    <div
      className={cn(
        'flex gap-3 max-w-[75%] animate-slide-up',
        isSent ? 'ml-auto flex-row-reverse' : 'mr-auto'
      )}
    >
      <Image
        src={senderAvatar}
        alt="Avatar"
        width={36}
        height={36}
        className="rounded-full flex-shrink-0"
      />

      <div className="flex flex-col gap-1">
        <div
          className={cn(
            'px-4 py-3 rounded-2xl break-words',
            isSent
              ? 'bg-gradient-to-r from-primary to-primary/90 text-primary-foreground rounded-tr-none'
              : 'bg-muted text-foreground rounded-tl-none'
          )}
        >
          {message.mediaUrl && (
            <div className="mb-2">
              {message.mediaType === 'image' ? (
                <Image
                  src={message.mediaUrl}
                  alt="Shared image"
                  width={300}
                  height={200}
                  className="rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                  style={{ objectFit: 'cover' }}
                />
              ) : message.mediaType === 'video' ? (
                <video
                  src={message.mediaUrl}
                  controls
                  className="rounded-lg max-w-full"
                  style={{ maxHeight: '300px' }}
                />
              ) : null}
            </div>
          )}
          {message.content && <p className="whitespace-pre-wrap">{message.content}</p>}
        </div>

        <div className={cn('flex items-center gap-1 px-2', isSent ? 'justify-end' : 'justify-start')}>
          <span className="text-xs text-muted-foreground">
            {formatMessageTime(message.timestamp)}
          </span>
          {isSent && (
            <span className="text-muted-foreground">
              {message.status === 'read' ? (
                <CheckCheck className="w-4 h-4 text-secondary" />
              ) : message.status === 'delivered' ? (
                <CheckCheck className="w-4 h-4" />
              ) : (
                <Check className="w-4 h-4" />
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
