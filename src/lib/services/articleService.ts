import { warhammerScraper } from '$lib/utils/warhammerScraper';
import { Logger } from '$lib/utils/logger';

export class ArticleService {
  static async getArticles() {
    try {
      return await warhammerScraper.scrapeArticles();
    } catch (error) {
      Logger.error('Error fetching articles:', error);
      return [];
    }
  }

  static async getArticlesByFaction(faction: string) {
    const articles = await this.getArticles();
    return articles.filter(article => article.factions.includes(faction));
  }
} 