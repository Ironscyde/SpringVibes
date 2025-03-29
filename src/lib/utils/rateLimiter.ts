export class RateLimiter {
  private static lastRequest: number = 0;
  private static delay: number = 10000; // Default 10 seconds

  static setDelay(seconds: number) {
    this.delay = seconds * 1000;
  }

  static async waitForNext(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequest;
    
    if (timeSinceLastRequest < this.delay) {
      await new Promise(resolve => 
        setTimeout(resolve, this.delay - timeSinceLastRequest)
      );
    }
    
    this.lastRequest = Date.now();
  }
} 