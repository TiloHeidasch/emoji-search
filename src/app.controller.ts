import { Controller, Get, Query } from '@nestjs/common';
import { EmojiService } from './emoji.service';
import { Emoji } from './emoji';
import { ApiQuery, ApiResponse } from '@nestjs/swagger';
import { Language } from './lang';

@Controller()
export class AppController {
  constructor(private readonly emojiService: EmojiService) { }

  @Get()
  @ApiQuery({ name: 'lang', description: 'The language of the request', required: false, enum: Language })
  @ApiQuery({ name: 'search', description: 'The search term', required: false, example: 'heart' })
  @ApiQuery({ name: 'max', description: 'Maximum amount of results', required: false, example: 15 })
  @ApiQuery({ name: 'minRelevance', description: 'The minimum required relevance - 1 is most relevant, 0 is least relevant', required: false, example: 0.3 })
  @ApiResponse({ description: 'The emojis, determined by the given criteria', type: [Emoji] })
  async getEmojis(@Query('lang') lang?: Language, @Query('search') search?: string, @Query('max') max?: number, @Query('minRelevance') minRelevance?: number): Promise<Emoji[]> {
    return this.emojiService.getEmojis(lang, search, max, minRelevance);
  }
}
