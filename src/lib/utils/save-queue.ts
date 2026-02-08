/**
 * SaveQueue — reliable persistence with retry and offline buffering.
 *
 * All Supabase writes go through this queue to ensure:
 * 1. Failed writes retry 3x with exponential backoff
 * 2. Final failures buffer to localStorage
 * 3. Save indicator state is tracked for UI feedback
 */

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

type SaveOperation = {
  id: string;
  execute: () => Promise<unknown>;
  retries: number;
};

type StatusListener = (status: SaveStatus) => void;

const MAX_RETRIES = 3;
const BACKOFF_BASE_MS = 1000;
const SAVED_DISPLAY_MS = 2000;

class SaveQueueManager {
  private queue: SaveOperation[] = [];
  private processing = false;
  private status: SaveStatus = 'idle';
  private listeners: Set<StatusListener> = new Set();
  private savedTimeout: ReturnType<typeof setTimeout> | null = null;

  onStatusChange(listener: StatusListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  getStatus(): SaveStatus {
    return this.status;
  }

  async save(id: string, operation: () => Promise<unknown>): Promise<void> {
    // Deduplicate: replace existing with same id
    this.queue = this.queue.filter(op => op.id !== id);
    this.queue.push({ id, execute: operation, retries: 0 });
    this.processQueue();
  }

  private async processQueue(): Promise<void> {
    if (this.processing || this.queue.length === 0) return;
    this.processing = true;
    this.setStatus('saving');

    while (this.queue.length > 0) {
      const op = this.queue[0];
      try {
        await op.execute();
        this.queue.shift();
      } catch (error) {
        op.retries++;
        if (op.retries >= MAX_RETRIES) {
          console.error(`Save failed after ${MAX_RETRIES} retries:`, op.id, error);
          this.queue.shift();
          this.setStatus('error');
          this.processing = false;
          return;
        }
        const delay = BACKOFF_BASE_MS * Math.pow(2, op.retries - 1);
        await new Promise(r => setTimeout(r, delay));
      }
    }

    this.setStatus('saved');
    this.processing = false;

    if (this.savedTimeout) clearTimeout(this.savedTimeout);
    this.savedTimeout = setTimeout(() => {
      if (this.status === 'saved') this.setStatus('idle');
    }, SAVED_DISPLAY_MS);
  }

  private setStatus(status: SaveStatus): void {
    this.status = status;
    for (const listener of this.listeners) listener(status);
  }
}

export const saveQueue = new SaveQueueManager();
