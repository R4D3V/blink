'use client'

import { useEffect, useRef, useState } from 'react'
import { Phone, PhoneOff, Mic, MicOff, Video, VideoOff } from 'lucide-react'
import { useCallStore, useChatStore } from '@/lib/store'
import { useSocket } from '@/hooks/useSocket'
import { cn } from '@/lib/utils'

// Note: SimplePeer would be imported here in a full implementation
// For this demo, we'll simulate the call functionality

export default function VideoCallModal() {
  const {
    isInCall,
    callType,
    isMuted,
    isVideoOff,
    setIsInCall,
    setIsMuted,
    setIsVideoOff,
  } = useCallStore()
  const currentChat = useChatStore((state) => state.currentChat)
  
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [callDuration, setCallDuration] = useState(0)
  const { onIncomingCall, onCallAccepted } = useSocket()

  useEffect(() => {
    if (isInCall && callType) {
      startCall()
    } else {
      stopCall()
    }

    return () => {
      stopCall()
    }
  }, [isInCall, callType])

  useEffect(() => {
    if (!isInCall) return

    const interval = setInterval(() => {
      setCallDuration((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [isInCall])

  const startCall = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: callType === 'video',
        audio: true,
      })

      setStream(mediaStream)
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = mediaStream
      }

      // In a real implementation, you would:
      // 1. Create a SimplePeer instance
      // 2. Set up signaling with Socket.IO
      // 3. Handle peer connection events
      // 4. Display remote stream when received

    } catch (error) {
      console.error('Error accessing media devices:', error)
      alert('Could not access camera/microphone. Please check permissions.')
      endCall()
    }
  }

  const stopCall = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null
    }
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null
    }
    setCallDuration(0)
  }

  const toggleMute = () => {
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0]
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled
        setIsMuted(!audioTrack.enabled)
      }
    }
  }

  const toggleVideo = () => {
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0]
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled
        setIsVideoOff(!videoTrack.enabled)
      }
    }
  }

  const endCall = () => {
    stopCall()
    setIsInCall(false)
    setIsMuted(false)
    setIsVideoOff(false)
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  if (!isInCall) return null

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      {/* Call Info */}
      <div className="absolute top-0 left-0 right-0 z-10 p-6 bg-gradient-to-b from-background/80 to-transparent backdrop-blur-sm">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-1">{currentChat?.name || 'Unknown'}</h2>
          <p className="text-muted-foreground">{formatDuration(callDuration)}</p>
        </div>
      </div>

      {/* Video Container */}
      <div className="flex-1 relative">
        {/* Remote Video (full screen) */}
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover bg-muted"
        />

        {/* Remote Video Placeholder */}
        {!remoteVideoRef.current?.srcObject && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
            <div className="text-center">
              <div className="w-32 h-32 rounded-full bg-muted mb-4 mx-auto flex items-center justify-center">
                <span className="text-5xl">{currentChat?.name.charAt(0) || '?'}</span>
              </div>
              <p className="text-xl font-semibold">{currentChat?.name}</p>
              <p className="text-muted-foreground mt-2">Connecting...</p>
            </div>
          </div>
        )}

        {/* Local Video (picture-in-picture) */}
        {callType === 'video' && (
          <div className="absolute bottom-24 right-6 w-48 h-36 rounded-2xl overflow-hidden border-2 border-primary shadow-2xl">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className={cn(
                'w-full h-full object-cover',
                isVideoOff && 'hidden'
              )}
            />
            {isVideoOff && (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <VideoOff className="w-8 h-8 text-muted-foreground" />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Call Controls */}
      <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-background/95 to-transparent backdrop-blur-sm">
        <div className="flex items-center justify-center gap-4">
          {/* Mute Button */}
          <button
            onClick={toggleMute}
            className={cn(
              'p-5 rounded-full transition-all hover:scale-110',
              isMuted ? 'bg-destructive text-destructive-foreground' : 'bg-muted text-foreground hover:bg-muted/80'
            )}
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </button>

          {/* Video Toggle (only for video calls) */}
          {callType === 'video' && (
            <button
              onClick={toggleVideo}
              className={cn(
                'p-5 rounded-full transition-all hover:scale-110',
                isVideoOff ? 'bg-destructive text-destructive-foreground' : 'bg-muted text-foreground hover:bg-muted/80'
              )}
              title={isVideoOff ? 'Turn on camera' : 'Turn off camera'}
            >
              {isVideoOff ? <VideoOff className="w-6 h-6" /> : <Video className="w-6 h-6" />}
            </button>
          )}

          {/* End Call Button */}
          <button
            onClick={endCall}
            className="p-6 bg-destructive text-destructive-foreground rounded-full transition-all hover:scale-110 hover:shadow-lg hover:shadow-destructive/50"
            title="End call"
          >
            <PhoneOff className="w-7 h-7" />
          </button>
        </div>
      </div>
    </div>
  )
}
