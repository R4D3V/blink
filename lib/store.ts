import { create } from "zustand";
import {
  AuthState,
  ChatState,
  CallState,
  User,
  Contact,
  Message,
} from "@/types";

// Auth Store
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  loadUser: () => {
    if (typeof window !== "undefined") {
      const savedUser = localStorage.getItem("blink_user");
      if (savedUser) {
        set({ user: JSON.parse(savedUser) });
      }
    }
  },
  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("blink_user");
    }
    set({ user: null });
  },
}));

// Chat Store
export const useChatStore = create<ChatState>((set) => ({
  contacts: [],
  messages: {},
  currentChat: null,
  typingUsers: {},
  setContacts: (contacts) => set({ contacts }),
  setCurrentChat: (contact) => set({ currentChat: contact }),
  addMessage: (conversationId, message) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [conversationId]: [...(state.messages[conversationId] || []), message],
      },
    })),
  setMessages: (conversationId, messages) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [conversationId]: messages,
      },
    })),
  setTyping: (conversationId, userId, isTyping) =>
    set((state) => ({
      typingUsers: {
        ...state.typingUsers,
        [`${conversationId}-${userId}`]: isTyping,
      },
    })),
}));

// Call Store
export const useCallStore = create<CallState>((set) => ({
  isInCall: false,
  callType: null,
  isMuted: false,
  isVideoOff: false,
  receivingCall: false,
  caller: null,
  callerSignal: null,
  setIsInCall: (isInCall) => set({ isInCall }),
  setCallType: (callType) => set({ callType }),
  setIsMuted: (isMuted) => set({ isMuted }),
  setIsVideoOff: (isVideoOff) => set({ isVideoOff }),
  setReceivingCall: (receivingCall) => set({ receivingCall }),
  setCaller: (caller) => set({ caller }),
  setCallerSignal: (callerSignal) => set({ callerSignal }),
}));
