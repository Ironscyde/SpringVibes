interface Proxy {
  host: string;
  port: number;
  protocol: string;
}

export class ProxyRotator {
  private static proxies: Proxy[] = [
    // Add your proxy list here
    // Example format:
    // { host: 'proxy1.example.com', port: 8080, protocol: 'http' },
    // { host: 'proxy2.example.com', port: 8080, protocol: 'http' },
  ];
  
  private static currentIndex = 0;

  static getNext(): Proxy | null {
    if (this.proxies.length === 0) return null;
    
    const proxy = this.proxies[this.currentIndex];
    this.currentIndex = (this.currentIndex + 1) % this.proxies.length;
    return proxy;
  }
} 