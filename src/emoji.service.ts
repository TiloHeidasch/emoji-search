import { Injectable, Logger } from '@nestjs/common';
import { Emoji } from './emoji';
import { Language } from './lang';
import { promisify } from 'util';
import { exists, readFile } from 'fs';

@Injectable()
export class EmojiService {
  private readonly filePathCn = 'data/emojis_cn.json';
  private readonly filePathDe = 'data/emojis_de.json';
  private readonly filePathEn = 'data/emojis_en.json';
  private readonly filePathFr = 'data/emojis_fr.json';
  private readonly filePathRu = 'data/emojis_ru.json';
  private readonly logger = new Logger(EmojiService.name);
  async getEmojis(lang?: Language, search?: string, max?: number, minRelevance?: number): Promise<Emoji[]> {
    const file = await this.loadFile(lang);
    const emojis: Emoji[] = this.fileToEmojis(file);
    if (max === undefined) {
      max = emojis.length;
    }
    if (search !== undefined && search !== '') {
      if (minRelevance === undefined) {
        minRelevance = 0;
      }
      return this.filterEmojis(emojis, search, minRelevance).sort((emoji1, emoji2) => { return emoji2.relevance - emoji1.relevance }).slice(0, max);
    } else {
      return emojis.slice(0, max);
    }
  }
  fileToEmojis(file: Record<string, { char, category, keywords, fitzpatrick_scale }>): Emoji[] {
    const emojis: Emoji[] = [];
    Object.keys(file).forEach((k) => {
      emojis.push({
        name: k,
        char: file[k].char,
        category: file[k].category,
        keywords: file[k].keywords,
      });
    });
    return emojis;
  }
  private filterEmojis(emojis: Emoji[], search: string, minRelevance: number): Emoji[] {
    const filteredEmojis: Emoji[] = [];
    emojis.forEach(emoji => {
      const relevance = this.determineRelevance(emoji, search);
      if (relevance >= minRelevance) {
        emoji.relevance = relevance;
        filteredEmojis.push(emoji);
      }
    });
    return filteredEmojis;
  }
  private determineRelevance(emoji: Emoji, search: string, relevanceFactor?: number): number {
    if (relevanceFactor === undefined) {
      relevanceFactor = 1;
    }
    if (emoji.name.toLowerCase() === search.toLowerCase()) {
      return relevanceFactor * 1;
    }
    if (emoji.name.toLowerCase().includes(search.toLowerCase())) {
      return relevanceFactor * 0.8
    }
    emoji.keywords.forEach(keyword => {
      if (keyword.toLowerCase() === search.toLowerCase()) {
        return relevanceFactor * 0.75;
      }
      if (keyword.toLowerCase().includes(search.toLowerCase())) {
        return relevanceFactor * 0.75 * 0.8;
      }
    });
    if (search.length > 0) {
      return this.determineRelevance(emoji, search.substr(0, search.length - 1), relevanceFactor * 0.5);
    }
    return 0;
  }
  private async loadFile(lang: Language): Promise<Record<string, { char, category, keywords, fitzpatrick_scale }>> {
    let filePath = '';
    switch (lang) {
      case Language.cn:
        filePath = this.filePathCn;
        break;
      case Language.de:
        filePath = this.filePathDe;
        break;
      case Language.en:
        filePath = this.filePathEn;
        break;
      case Language.fr:
        filePath = this.filePathFr;
        break;
      case Language.ru:
        filePath = this.filePathRu;
        break;
      case undefined:
        filePath = this.filePathEn;
        break;
    }

    try {
      if (await this.fileExists(filePath)) {
        const buffer = await promisify(readFile)(filePath);
        const emojis = buffer.toString();
        return emojis ? JSON.parse(emojis) : {};
      } else {
        this.logger.error({ error: 'File does not exist', filePath });
        return {};
      }
    } catch (error) {
      return {};
    }
  }
  private async fileExists(filePath: string) {
    return await promisify(exists)(filePath);
  }
}
