import { Logger } from './logger';

interface QueueItem {
  task: () => Promise<any>;
  resolve: (value: any) => void;
  reject: (error: any) => void;
  retries: number;
}

export class RequestQueue {
  private static queue: QueueItem[] = [];
  private static isProcessing = false;
  private static MAX_RETRIES = 3;
  private static INITIAL_RETRY_DELAY = 1000;

  static async enqueue<T>(task: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push({ task, resolve, reject, retries: 0 });
      this.processQueue();
    });
  }

  private static async processQueue() {
    if (this.isProcessing || this.queue.length === 0) return;

    this.isProcessing = true;
    const item = this.queue.shift()!;

    try {
      const result = await this.executeWithRetry(item);
      item.resolve(result);
    } catch (error) {
      item.reject(error);
    } finally {
      this.isProcessing = false;
      this.processQueue();
    }
  }

  private static async executeWithRetry(item: QueueItem): Promise<any> {
    try {
      return await item.task();
    } catch (error) {
      if (item.retries < this.MAX_RETRIES) {
        item.retries++;
        const delay = this.INITIAL_RETRY_DELAY * Math.pow(2, item.retries - 1);
        Logger.warn(`Retry ${item.retries}/${this.MAX_RETRIES} after ${delay}ms`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.executeWithRetry(item);
      }
      throw error;
    }
  }
} 