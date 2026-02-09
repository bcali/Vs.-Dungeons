"use client";

import { useEffect } from "react";
import { Swords } from "lucide-react";
import Link from "next/link";

export default function CombatError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-[#1a1a2e]">
      <Swords className="w-16 h-16 text-[#e5a91a] mb-6" />

      <h1 className="text-3xl font-bold text-[#e5a91a] mb-2">Combat Error</h1>
      <p className="text-zinc-400 mb-6">
        The battle encountered an unexpected problem.
      </p>

      <div className="bg-[#16213e] border border-[#0f3460] rounded-xl p-4 mb-6 w-full max-w-lg">
        <p className="text-red-400 font-mono text-sm">{error.message}</p>
        {error.digest && (
          <p className="text-zinc-600 text-xs mt-2">
            Digest: {error.digest}
          </p>
        )}
      </div>

      {process.env.NODE_ENV === "development" && error.stack && (
        <pre className="text-xs text-zinc-500 overflow-auto max-h-40 w-full max-w-lg mb-6 bg-[#16213e] border border-[#0f3460] rounded-xl p-4">
          {error.stack}
        </pre>
      )}

      <div className="flex gap-4">
        <button
          onClick={reset}
          className="bg-[#e94560] hover:bg-[#e94560]/80 text-white rounded-xl px-6 py-3 font-bold transition-colors"
        >
          Restart Combat
        </button>
        <Link
          href="/"
          className="bg-[#0f3460] hover:bg-[#0f3460]/80 text-white rounded-xl px-6 py-3 font-bold transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
