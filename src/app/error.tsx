"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function GlobalError({
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
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-bg-page">
      <AlertTriangle className="w-16 h-16 text-accent-gold mb-6" />

      <h1 className="text-3xl font-bold text-accent-gold mb-2">
        Something Went Wrong
      </h1>
      <p className="text-text-secondary mb-6">An unexpected error occurred.</p>

      <div className="bg-bg-card border border-border-card rounded-xl p-4 mb-6 w-full max-w-lg">
        <p className="text-red-400 font-mono text-sm">{error.message}</p>
        {error.digest && (
          <p className="text-text-dim text-xs mt-2">
            Digest: {error.digest}
          </p>
        )}
      </div>

      {process.env.NODE_ENV === "development" && error.stack && (
        <pre className="text-xs text-text-muted overflow-auto max-h-40 w-full max-w-lg mb-6 bg-bg-card border border-border-card rounded-xl p-4">
          {error.stack}
        </pre>
      )}

      <div className="flex gap-4">
        <button
          onClick={reset}
          className="bg-accent-red hover:bg-accent-red/80 text-white rounded-xl px-6 py-3 font-bold transition-colors"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="bg-bg-input hover:bg-bg-input/80 text-white rounded-xl px-6 py-3 font-bold transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
