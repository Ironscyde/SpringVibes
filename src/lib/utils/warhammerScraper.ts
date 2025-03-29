import axios from 'axios';
import type { AxiosInstance } from 'axios';
import * as cheerio from 'cheerio';
import { RobotsParser } from './robotsParser';
import { RateLimiter } from './rateLimiter';
import { ProxyRotator } from './proxyRotator';
import { RequestQueue } from './requestQueue';
import { Cache } from './cache';
import { Logger } from './logger';

interface WarhammerArticle {
  title: string;
  url: string;
  date: string;
  factions: string[];
}

const WARHAMMER_DOMAIN = 'https://www.warhammer-community.com';
const WARHAMMER_NEWS_PATH = '/news/';
const CACHE_KEY = 'warhammer_articles';
const CACHE_TTL = 1000 * 60 * 60; // 1 hour

const factionKeywords = {
  'leagues-of-votann': ['leagues of votann', 'votann', 'kin'],
  'adeptus-custodes': ['adeptus custodes', 'custodian', 'custodes'],
  'orks': ['orks', 'orkz', 'greenskins'],
  'mission-pack': ['mission pack', 'missions', '10th edition missions', 'battle pack'],
  'errata': ['errata', 'faq', 'frequently asked questions', '10th edition errata'],
  'rules-update': ['rules update', 'rules changes', '10th edition rules', 'core rules update']
};

class WarhammerScraper {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      timeout: 10000,
      headers: {
        'User-Agent': 'Custom Bot (respectful scraping for personal project)',
        'Accept': 'text/html',
      }
    });
  }

  private async createRequest(url: string) {
    const proxy = ProxyRotator.getNext();
    
    if (proxy) {
      return this.axiosInstance.get(url, {
        proxy: {
          host: proxy.host,
          port: proxy.port,
          protocol: proxy.protocol
        }
      });
    }
    
    return this.axiosInstance.get(url);
  }

  async scrapeArticle(element: cheerio.Element, $: cheerio.Root): Promise<WarhammerArticle | null> {
    try {
      const title = $(element).find('.article-title').text().trim();
      const url = $(element).find('a').attr('href') || '';
      const date = $(element).find('.article-date').text().trim();
      
      const factions = Object.entries(factionKeywords).reduce((acc, [faction, keywords]) => {
        const contentText = $(element).text().toLowerCase();
        if (keywords.some(keyword => contentText.includes(keyword))) {
          acc.push(faction);
        }
        return acc;
      }, [] as string[]);

      if (factions.length > 0) {
        return { title, url, date, factions };
      }
    } catch (error) {
      Logger.error('Error scraping article:', error);
    }
    return null;
  }

  async scrapeArticles(): Promise<WarhammerArticle[]> {
    // Check cache first
    const cachedArticles = Cache.get<WarhammerArticle[]>(CACHE_KEY);
    if (cachedArticles) {
      Logger.debug('Returning cached articles');
      return cachedArticles;
    }

    if (!RobotsParser.isAllowed(WARHAMMER_NEWS_PATH)) {
      Logger.error('Scraping not allowed according to robots.txt');
      return [];
    }

    await RateLimiter.waitForNext();

    return RequestQueue.enqueue(async () => {
      try {
        const response = await this.createRequest(`${WARHAMMER_DOMAIN}${WARHAMMER_NEWS_PATH}`);
        const $ = cheerio.load(response.data);
        const articles: WarhammerArticle[] = [];

        const elements = $('.article-card').toArray();
        
        for (const element of elements) {
          await new Promise(resolve => 
            setTimeout(resolve, Math.random() * 2000 + 1000)
          );

          const article = await this.scrapeArticle(element, $);
          if (article) {
            articles.push(article);
          }
        }

        // Cache the results
        Cache.set(CACHE_KEY, articles, CACHE_TTL);
        Logger.info(`Successfully scraped ${articles.length} articles`);
        
        return articles;
      } catch (error) {
        Logger.error('Error scraping Warhammer Community:', error);
        throw error;
      }
    });
  }
}

export const warhammerScraper = new WarhammerScraper(); 