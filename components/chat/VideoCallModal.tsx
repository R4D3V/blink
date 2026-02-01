"use client";

import { useEffect, useRef, useState } from "react";
import {
  PhoneOff,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Maximize2,
  Minimize2,
  Move,
} from "lucide-react";
import { useCallStore, useChatStore } from "@/lib/store";
import { useSocket } from "@/hooks/useSocket";
import { cn } from "@/lib/utils";

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
  } = useCallStore();
  const currentChat = useChatStore((state) => state.currentChat);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  const [isSharingScreen, setIsSharingScreen] = useState(false);
  const cameraStreamRef = useRef<MediaStream | null>(null);
  const [callDuration, setCallDuration] = useState(0);
  const { onIncomingCall, onCallAccepted } = useSocket();

  // PiP controls state
  const [pipPosition, setPipPosition] = useState({ x: 0, y: 0 });
  const [pipSize, setPipSize] = useState<"small" | "medium" | "large">(
    "medium",
  );
  const [isDragging, setIsDragging] = useState(false);
  const [isHoveringPip, setIsHoveringPip] = useState(false);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const pipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isInCall && callType) {
      startCall();
    } else {
      stopCall();
    }

    return () => {
      stopCall();
    };
  }, [isInCall, callType]);

  useEffect(() => {
    if (!isInCall) return;

    const interval = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isInCall]);

  const startCall = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: callType === "video",
        audio: true,
      });

      // Keep a reference to camera stream so we can restore it after screen share
      cameraStreamRef.current = mediaStream;

      setStream(mediaStream);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = mediaStream;
      }

      // In a real implementation, you would:
      // 1. Create a SimplePeer instance
      // 2. Set up signaling with Socket.IO
      // 3. Handle peer connection events
      // 4. Display remote stream when received
    } catch (error) {
      console.error("Error accessing media devices:", error);
      alert("Could not access camera/microphone. Please check permissions.");
      endCall();
    }
  };

  const stopCall = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }
    setCallDuration(0);
  };

  const toggleMute = () => {
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  };

  const toggleVideo = () => {
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOff(!videoTrack.enabled);
      }
    }
  };

  const startScreenShare = async () => {
    try {
      if (isSharingScreen) return;
      const s = await (navigator.mediaDevices as any).getDisplayMedia({
        video: true,
      });
      if (!s) return;

      setScreenStream(s);
      setIsSharingScreen(true);

      // If in a video call, show the screen in the local preview
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = s;
      }

      // If we had a camera stream, try to replace the outgoing track on the peer (if implemented)
      try {
        const screenTrack = s.getVideoTracks()[0];
        // @ts-ignore - peppered for demo: if you integrate simple-peer you can call replaceTrack
        const peer = (window as any).peer;
        const cameraTrack = cameraStreamRef.current?.getVideoTracks()[0];
        if (peer && typeof peer.replaceTrack === "function" && cameraTrack) {
          peer.replaceTrack(cameraTrack, screenTrack, cameraStreamRef.current);
        }
      } catch (e) {
        console.debug("screen share replaceTrack skipped", e);
      }

      // Monitor when the user stops sharing via browser controls
      const track = s.getVideoTracks()[0];
      track.onended = () => {
        stopScreenShare();
      };
    } catch (error) {
      console.error("Screen share failed", error);
      alert(
        "Could not start screen sharing. Your browser may have blocked it.",
      );
    }
  };

  const stopScreenShare = () => {
    if (!isSharingScreen) return;
    if (screenStream) {
      screenStream.getTracks().forEach((t) => t.stop());
      setScreenStream(null);
    }

    // Restore camera preview if available
    if (cameraStreamRef.current && localVideoRef.current) {
      localVideoRef.current.srcObject = cameraStreamRef.current;
    }

    // If we had a peer, attempt to restore camera track
    try {
      const peer = (window as any).peer;
      const cameraTrack = cameraStreamRef.current?.getVideoTracks()[0];
      const screenTrack = screenStream?.getVideoTracks()[0];
      if (
        peer &&
        typeof peer.replaceTrack === "function" &&
        cameraTrack &&
        screenTrack
      ) {
        peer.replaceTrack(screenTrack, cameraTrack, cameraStreamRef.current);
      }
    } catch (e) {
      console.debug("restore camera track skipped", e);
    }

    setIsSharingScreen(false);
  };

  const endCall = () => {
    stopCall();
    setIsInCall(false);
    setIsMuted(false);
    setIsVideoOff(false);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // PiP drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartPos.current = {
      x: e.clientX - pipPosition.x,
      y: e.clientY - pipPosition.y,
    };
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;

    const newX = e.clientX - dragStartPos.current.x;
    const newY = e.clientY - dragStartPos.current.y;

    // Keep PiP within viewport bounds
    const pipElement = pipRef.current;
    if (pipElement) {
      const maxX = window.innerWidth - pipElement.offsetWidth;
      const maxY = window.innerHeight - pipElement.offsetHeight - 100; // Account for controls

      setPipPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY)),
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging]);

  const cyclePipSize = () => {
    setPipSize((prev) => {
      if (prev === "small") return "medium";
      if (prev === "medium") return "large";
      return "small";
    });
  };

  const getPipDimensions = () => {
    switch (pipSize) {
      case "small":
        return { width: "w-40", height: "h-28" };
      case "medium":
        return { width: "w-48", height: "h-36" };
      case "large":
        return { width: "w-64", height: "h-48" };
    }
  };

  if (!isInCall) return null;

  const pipDimensions = getPipDimensions();

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      {/* Call Info */}
      <div className="absolute top-0 left-0 right-0 z-10 p-6 bg-gradient-to-b from-background/80 to-transparent backdrop-blur-sm">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-1">
            {currentChat?.name || "Unknown"}
          </h2>
          <p className="text-muted-foreground">
            {formatDuration(callDuration)}
          </p>
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
                <span className="text-5xl">
                  {currentChat?.name.charAt(0) || "?"}
                </span>
              </div>
              <p className="text-xl font-semibold">{currentChat?.name}</p>
              <p className="text-muted-foreground mt-2">Connecting...</p>
            </div>
          </div>
        )}

        {/* Local Video (picture-in-picture) - Enhanced */}
        {callType === "video" && (
          <div
            ref={pipRef}
            className={cn(
              "absolute rounded-2xl overflow-hidden border-2 shadow-2xl transition-all group",
              pipDimensions.width,
              pipDimensions.height,
              isDragging
                ? "border-primary cursor-grabbing"
                : "border-primary/50 cursor-grab",
              isHoveringPip && "border-primary",
            )}
            style={{
              bottom: pipPosition.y === 0 ? "6rem" : "auto",
              right: pipPosition.x === 0 ? "1.5rem" : "auto",
              top: pipPosition.y !== 0 ? `${pipPosition.y}px` : "auto",
              left: pipPosition.x !== 0 ? `${pipPosition.x}px` : "auto",
            }}
            onMouseEnter={() => setIsHoveringPip(true)}
            onMouseLeave={() => setIsHoveringPip(false)}
            onMouseDown={handleMouseDown}
          >
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className={cn(
                "w-full h-full object-cover",
                isVideoOff && "hidden",
              )}
            />
            {isVideoOff && (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <VideoOff className="w-8 h-8 text-muted-foreground" />
              </div>
            )}

            {/* PiP Controls Overlay */}
            <div
              className={cn(
                "absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none",
              )}
            />

            <div
              className={cn(
                "absolute top-2 left-2 right-2 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none",
              )}
            >
              <div className="flex items-center gap-1 bg-black/50 rounded-full px-2 py-1">
                <Move className="w-3 h-3 text-white" />
                <span className="text-xs text-white">Drag</span>
              </div>
            </div>

            <div
              className={cn(
                "absolute bottom-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity",
              )}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  cyclePipSize();
                }}
                className="p-1.5 bg-black/50 hover:bg-black/70 rounded-full transition-colors pointer-events-auto"
                title="Resize"
              >
                {pipSize === "large" ? (
                  <Minimize2 className="w-3 h-3 text-white" />
                ) : (
                  <Maximize2 className="w-3 h-3 text-white" />
                )}
              </button>
            </div>

            {/* Mute indicator */}
            {isMuted && (
              <div className="absolute top-2 right-2 p-1.5 bg-destructive rounded-full">
                <MicOff className="w-3 h-3 text-destructive-foreground" />
              </div>
            )}
          </div>
        )}

        {/* Screen Share Preview (for audio calls) */}
        {isSharingScreen && callType !== "video" && (
          <div
            ref={pipRef}
            className={cn(
              "absolute rounded-2xl overflow-hidden border-2 shadow-2xl transition-all group",
              pipDimensions.width,
              pipDimensions.height,
              isDragging
                ? "border-primary cursor-grabbing"
                : "border-primary/50 cursor-grab",
              isHoveringPip && "border-primary",
            )}
            style={{
              bottom: pipPosition.y === 0 ? "6rem" : "auto",
              right: pipPosition.x === 0 ? "1.5rem" : "auto",
              top: pipPosition.y !== 0 ? `${pipPosition.y}px` : "auto",
              left: pipPosition.x !== 0 ? `${pipPosition.x}px` : "auto",
            }}
            onMouseEnter={() => setIsHoveringPip(true)}
            onMouseLeave={() => setIsHoveringPip(false)}
            onMouseDown={handleMouseDown}
          >
            <video
              autoPlay
              playsInline
              muted
              ref={localVideoRef}
              className="w-full h-full object-cover"
            />

            {/* PiP Controls Overlay */}
            <div
              className={cn(
                "absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none",
              )}
            />

            <div
              className={cn(
                "absolute top-2 left-2 right-2 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none",
              )}
            >
              <div className="flex items-center gap-1 bg-black/50 rounded-full px-2 py-1">
                <Move className="w-3 h-3 text-white" />
                <span className="text-xs text-white">Drag</span>
              </div>
            </div>

            <div
              className={cn(
                "absolute bottom-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity",
              )}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  cyclePipSize();
                }}
                className="p-1.5 bg-black/50 hover:bg-black/70 rounded-full transition-colors pointer-events-auto"
                title="Resize"
              >
                {pipSize === "large" ? (
                  <Minimize2 className="w-3 h-3 text-white" />
                ) : (
                  <Maximize2 className="w-3 h-3 text-white" />
                )}
              </button>
            </div>

            {/* Screen sharing indicator */}
            <div className="absolute top-2 left-2 px-2 py-1 bg-primary rounded-full">
              <span className="text-xs text-primary-foreground font-medium">
                Screen
              </span>
            </div>
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
              "p-5 rounded-full transition-all hover:scale-110",
              isMuted
                ? "bg-destructive text-destructive-foreground"
                : "bg-muted text-foreground hover:bg-muted/80",
            )}
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? (
              <MicOff className="w-6 h-6" />
            ) : (
              <Mic className="w-6 h-6" />
            )}
          </button>

          {/* Video Toggle (only for video calls) */}
          {callType === "video" && (
            <button
              onClick={toggleVideo}
              className={cn(
                "p-5 rounded-full transition-all hover:scale-110",
                isVideoOff
                  ? "bg-destructive text-destructive-foreground"
                  : "bg-muted text-foreground hover:bg-muted/80",
              )}
              title={isVideoOff ? "Turn on camera" : "Turn off camera"}
            >
              {isVideoOff ? (
                <VideoOff className="w-6 h-6" />
              ) : (
                <Video className="w-6 h-6" />
              )}
            </button>
          )}

          {/* Screen Share Button */}
          <button
            onClick={() =>
              isSharingScreen ? stopScreenShare() : startScreenShare()
            }
            className={cn(
              "p-5 rounded-full transition-all hover:scale-110",
              isSharingScreen
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-foreground hover:bg-muted/80",
            )}
            title={isSharingScreen ? "Stop sharing" : "Share screen"}
          >
            {/* Inline monitor SVG */}
            {isSharingScreen ? (
              <svg
                className="w-6 h-6"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M21 12V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M7 18h10M12 14v4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="2"
                  y="4"
                  width="20"
                  height="12"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M8 20h8"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </button>

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
  );
}
