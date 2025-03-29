interface RobotsRule {
  userAgent: string;
  allow: string[];
  disallow: string[];
  crawlDelay?: number;
}

export class RobotsParser {
  private static rules: RobotsRule[] = [];
  private static baseUrl: string = '';

  static async init(domain: string) {
    this.baseUrl = domain;
    try {
      const response = await fetch(`${domain}/robots.txt`);
      const text = await response.text();
      const lines = text.split('\n');
      
      let currentRule: Partial<RobotsRule> = {};
      
      lines.forEach((line: string) => {
        line = line.trim();
        if (!line || line.startsWith('#')) return;

        const [field, value] = line.split(':').map(s => s.trim());
        
        switch (field.toLowerCase()) {
          case 'user-agent':
            if (Object.keys(currentRule).length > 0) {
              this.rules.push(currentRule as RobotsRule);
              currentRule = {};
            }
            currentRule.userAgent = value;
            currentRule.allow = [];
            currentRule.disallow = [];
            break;
          case 'allow':
            currentRule.allow = [...(currentRule.allow || []), value];
            break;
          case 'disallow':
            currentRule.disallow = [...(currentRule.disallow || []), value];
            break;
          case 'crawl-delay':
            currentRule.crawlDelay = parseInt(value);
            break;
        }
      });

      if (Object.keys(currentRule).length > 0) {
        this.rules.push(currentRule as RobotsRule);
      }
    } catch (error) {
      console.error('Error parsing robots.txt:', error);
      // Default conservative rules if we can't read robots.txt
      this.rules = [{
        userAgent: '*',
        allow: [],
        disallow: [],
        crawlDelay: 10 // 10 seconds default delay
      }];
    }
  }

  static isAllowed(path: string): boolean {
    const rule = this.rules.find(r => r.userAgent === '*') || this.rules[0];
    
    // Check if path matches any disallow rule
    const isDisallowed = rule.disallow.some(pattern => 
      path.startsWith(pattern) || path.match(pattern.replace('*', '.*'))
    );
    
    // Check if path matches any allow rule
    const isAllowed = rule.allow.some(pattern => 
      path.startsWith(pattern) || path.match(pattern.replace('*', '.*'))
    );
    
    // Allow takes precedence over disallow
    return isAllowed || !isDisallowed;
  }

  static getCrawlDelay(): number {
    const rule = this.rules.find(r => r.userAgent === '*') || this.rules[0];
    return rule.crawlDelay || 10; // Default to 10 seconds if not specified
  }
} 