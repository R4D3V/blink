"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Phone, Video, Paperclip, Send, Smile } from "lucide-react";
import { useAuthStore, useChatStore, useCallStore } from "@/lib/store";
import { useSocket } from "@/hooks/useSocket";
import {
  generateId,
  formatMessageTime,
  fileToBase64,
  isImageFile,
  isVideoFile,
} from "@/lib/utils";
import { Message } from "@/types";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";

export default function ChatArea() {
  const user = useAuthStore((state) => state.user);
  const { currentChat, messages, addMessage, setMessages } = useChatStore();
  const setCallType = useCallStore((state) => state.setCallType);
  const setIsInCall = useCallStore((state) => state.setIsInCall);
  const { sendMessage, joinConversation, sendTypingStatus } = useSocket();

  const [messageText, setMessageText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  const currentMessages = currentChat ? messages[currentChat.id] || [] : [];

  useEffect(() => {
    if (currentChat) {
      joinConversation(currentChat.id);
      loadDemoMessages();
    }
  }, [currentChat?.id]);

  useEffect(() => {
    scrollToBottom();
  }, [currentMessages]);

  const loadDemoMessages = () => {
    if (!currentChat || messages[currentChat.id]) return;

    const demoMessages: Message[] = [
      {
        id: generateId(),
        conversationId: currentChat.id,
        senderId: currentChat.id,
        content: "Hey! How are you doing?",
        timestamp: new Date(Date.now() - 3600000),
        status: "read",
      },
      {
        id: generateId(),
        conversationId: currentChat.id,
        senderId: user!.id,
        content: "I'm great! Thanks for asking 😊",
        timestamp: new Date(Date.now() - 3500000),
        status: "read",
      },
      {
        id: generateId(),
        conversationId: currentChat.id,
        senderId: currentChat.id,
        content: "That's awesome! Want to catch up later?",
        timestamp: new Date(Date.now() - 3400000),
        status: "read",
      },
    ];

    setMessages(currentChat.id, demoMessages);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = () => {
    if (!messageText.trim() || !currentChat || !user) return;

    const newMessage: Message = {
      id: generateId(),
      conversationId: currentChat.id,
      senderId: user.id,
      content: messageText.trim(),
      timestamp: new Date(),
      status: "sending",
    };

    addMessage(currentChat.id, newMessage);
    sendMessage(currentChat.id, newMessage);
    setMessageText("");
    sendTypingStatus(currentChat.id, false);
    setIsTyping(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleTyping = (value: string) => {
    setMessageText(value);

    if (!currentChat) return;

    if (!isTyping) {
      setIsTyping(true);
      sendTypingStatus(currentChat.id, true);
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      sendTypingStatus(currentChat.id, false);
    }, 1000);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentChat || !user) return;

    try {
      const base64 = await fileToBase64(file);
      const mediaType = isImageFile(file.name)
        ? "image"
        : isVideoFile(file.name)
          ? "video"
          : "file";

      const newMessage: Message = {
        id: generateId(),
        conversationId: currentChat.id,
        senderId: user.id,
        content: file.name,
        mediaUrl: base64,
        mediaType,
        timestamp: new Date(),
        status: "sending",
      };

      addMessage(currentChat.id, newMessage);
      sendMessage(currentChat.id, newMessage);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const startCall = (type: "audio" | "video") => {
    setCallType(type);
    setIsInCall(true);
  };

  if (!currentChat) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <div className="text-6xl mb-6">💬</div>
        <h2 className="text-2xl font-bold mb-2">Welcome to Blink Chat</h2>
        <p className="text-muted-foreground max-w-md">
          Select a conversation from the sidebar to start chatting, or start a
          new conversation
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-background">
      {/* Chat Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-card/60 backdrop-blur-xl border-b border-border">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Image
              src={currentChat.avatar}
              alt={currentChat.name}
              width={48}
              height={48}
              className="rounded-full border-2 border-border"
            />
            <span
              className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-card ${
                currentChat.status === "online" ? "bg-green-500" : "bg-gray-500"
              }`}
            />
          </div>
          <div>
            <h3 className="font-semibold text-lg">{currentChat.name}</h3>
            <p className="text-sm text-muted-foreground capitalize">
              {currentChat.status}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => startCall("audio")}
            className="p-3 hover:bg-muted rounded-full transition-colors group"
            title="Audio Call"
          >
            <Phone className="w-5 h-5 group-hover:text-primary transition-colors" />
          </button>
          <button
            onClick={() => startCall("video")}
            className="p-3 hover:bg-muted rounded-full transition-colors group"
            title="Video Call"
          >
            <Video className="w-5 h-5 group-hover:text-secondary transition-colors" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {currentMessages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            isSent={message.senderId === user?.id}
            senderAvatar={
              message.senderId === user?.id ? user.avatar : currentChat.avatar
            }
          />
        ))}
        <TypingIndicator />
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-card/80 backdrop-blur-xl border-t border-border">
        <div className="flex items-end gap-3">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-3 hover:bg-muted rounded-full transition-all hover:rotate-45"
            title="Attach file"
          >
            <Paperclip className="w-5 h-5" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            onChange={handleFileUpload}
            className="hidden"
          />

          <div className="flex-1 relative">
            <textarea
              value={messageText}
              onChange={(e) => handleTyping(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              rows={1}
              className="w-full px-4 py-3 pr-12 bg-muted border border-border rounded-3xl resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all max-h-32"
              style={{
                height: "auto",
                minHeight: "48px",
                maxHeight: "128px",
              }}
            />
            <button
              className="absolute right-3 bottom-3 p-2 hover:bg-background rounded-full transition-colors"
              title="Add emoji"
            >
              <Smile className="w-5 h-5" />
            </button>
          </div>

          <button
            onClick={handleSendMessage}
            disabled={!messageText.trim()}
            className="p-3 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-full transition-all hover:scale-110 hover:shadow-lg hover:shadow-primary/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            title="Send message"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
