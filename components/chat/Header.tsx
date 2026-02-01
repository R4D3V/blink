"use client";

import Link from "next/link";
import Image from "next/image";
import { LogOut, Menu, Wifi, WifiOff } from "lucide-react";
import { useAuthStore } from "@/lib/store";

interface HeaderProps {
  isConnected: boolean;
  onToggleSidebar: () => void;
}

export default function Header({ isConnected, onToggleSidebar }: HeaderProps) {
  const { user, logout } = useAuthStore();

  return (
    <header className="flex items-center justify-between px-4 md:px-6 py-4 bg-card/80 backdrop-blur-xl border-b border-border sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        <Link href="/welcome" className="no-underline">
          <h1 className="font-display text-2xl md:text-3xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            BLINK
          </h1>
        </Link>

        {/* Connection Status */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-muted/50">
          {isConnected ? (
            <>
              <Wifi className="w-4 h-4 text-green-500" />
              <span className="text-xs text-muted-foreground">Connected</span>
            </>
          ) : (
            <>
              <WifiOff className="w-4 h-4 text-destructive" />
              <span className="text-xs text-muted-foreground">
                Connecting...
              </span>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {user && (
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
            <Image
              src={user.avatar}
              alt={user.name}
              width={40}
              height={40}
              className="rounded-full border-2 border-primary"
            />
          </div>
        )}

        <button
          onClick={logout}
          className="p-2 hover:bg-destructive/10 hover:text-destructive rounded-lg transition-all"
          title="Logout"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
