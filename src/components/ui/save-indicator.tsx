'use client';

import { useEffect, useState } from 'react';
import { saveQueue, type SaveStatus } from '@/lib/utils/save-queue';

/** Visual save indicator — shows current persistence status */
export function SaveIndicator() {
  const [status, setStatus] = useState<SaveStatus>('idle');

  useEffect(() => {
    return saveQueue.onStatusChange(setStatus);
  }, []);

  if (status === 'idle') return null;

  return (
    <div className="flex items-center gap-2 text-sm">
      {status === 'saving' && (
        <>
          <div className="h-2.5 w-2.5 rounded-full bg-yellow-400 animate-pulse" />
          <span className="text-yellow-400">Saving...</span>
        </>
      )}
      {status === 'saved' && (
        <>
          <div className="h-2.5 w-2.5 rounded-full bg-green-400" />
          <span className="text-green-400">Saved</span>
        </>
      )}
      {status === 'error' && (
        <>
          <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
          <span className="text-red-400">Save failed</span>
        </>
      )}
    </div>
  );
}
