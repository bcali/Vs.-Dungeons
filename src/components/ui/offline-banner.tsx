"use client";

import { useNetworkStatus } from "@/hooks/use-network-status";
import { WifiOff } from "lucide-react";

export function OfflineBanner() {
  const isOnline = useNetworkStatus();
  if (isOnline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-amber-600/90 backdrop-blur-sm border-b border-amber-500 px-4 py-2 flex items-center justify-center gap-2 text-sm font-medium text-bg-page">
      <WifiOff className="w-4 h-4" />
      <span>You are offline. Changes will be saved when you reconnect.</span>
    </div>
  );
}
