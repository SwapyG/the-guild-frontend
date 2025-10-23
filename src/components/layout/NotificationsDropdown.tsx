"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Bell, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getMyNotifications, markNotificationAsRead } from "@/services/api";
import { Notification } from "@/types";
import { cn } from "@/lib/utils";
import { toast } from "react-hot-toast";

// --- Helper: human-readable time
const timeAgo = (date: Date): string => {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  const intervals = [
    [31536000, "y"],
    [2592000, "mo"],
    [86400, "d"],
    [3600, "h"],
    [60, "m"],
  ] as const;
  for (const [secs, label] of intervals) {
    const val = Math.floor(seconds / secs);
    if (val >= 1) return `${val}${label} ago`;
  }
  return `${Math.floor(seconds)}s ago`;
};

export const NotificationsDropdown = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const fetchRef = useRef(false); // prevent multiple simultaneous loads

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const fetchNotifications = async () => {
    if (fetchRef.current) return;
    fetchRef.current = true;
    setLoading(true);
    try {
      const data = await getMyNotifications();
      setNotifications(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Failed to load notifications.");
    } finally {
      setLoading(false);
      fetchRef.current = false;
    }
  };

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.is_read) {
      // Optimistic UI update
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notification.id ? { ...n, is_read: true } : n
        )
      );
    }

    try {
      await markNotificationAsRead(notification.id);
      if (notification.link) router.push(notification.link);
    } catch {
      toast.error("Failed to sync notification status.");
    }
  };

  // Optional background auto-refresh (every 60s)
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <DropdownMenu onOpenChange={(open) => open && fetchNotifications()}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Notifications"
          className="relative"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-80 md:w-96 shadow-lg">
        <DropdownMenuLabel className="flex justify-between items-center">
          <span>Notifications</span>
          {loading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <ScrollArea className="h-[400px]">
          <div className="p-1 space-y-1">
            {loading ? (
              <p className="p-4 text-center text-sm text-muted-foreground">
                Fetching intel...
              </p>
            ) : notifications.length > 0 ? (
              notifications.map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={cn(
                    "h-auto cursor-pointer items-start whitespace-normal rounded-md transition-colors",
                    !notification.is_read
                      ? "bg-primary/5 hover:bg-primary/10"
                      : "hover:bg-accent"
                  )}
                >
                  <span
                    className={cn(
                      "mt-1.5 h-2 w-2 shrink-0 rounded-full",
                      !notification.is_read ? "bg-primary" : "bg-transparent"
                    )}
                  />
                  <div className="ml-2 flex-1">
                    <p
                      className={cn(
                        "text-sm leading-snug",
                        notification.is_read && "text-muted-foreground"
                      )}
                    >
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {timeAgo(new Date(notification.created_at))}
                    </p>
                  </div>
                </DropdownMenuItem>
              ))
            ) : (
              <div className="flex h-48 flex-col items-center justify-center text-center text-muted-foreground">
                <CheckCircle2 className="h-8 w-8 mb-2 text-muted-foreground/60" />
                <p className="font-semibold">Inbox Clear</p>
                <p className="text-xs opacity-75">No new notifications.</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
