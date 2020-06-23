import { Controller, Get, Query, Logger } from '@nestjs/common';
import { EmojiService } from './emoji.service';
import { Emoji } from './emoji';
import { ApiQuery, ApiResponse } from '@nestjs/swagger';
import { Language } from './lang';
import { v4 as uuid } from 'uuid';


@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);
  constructor(private readonly emojiService: EmojiService) { }

  @Get()
  @ApiQuery({ name: 'lang', description: 'The language of the request', required: false, enum: Language })
  @ApiQuery({ name: 'search', description: 'The search term', required: false, example: 'heart' })
  @ApiQuery({ name: 'max', description: 'Maximum amount of results', required: false, example: 15 })
  @ApiQuery({ name: 'minRelevance', description: 'The minimum required relevance - 1 is most relevant, 0 is least relevant', required: false, example: 0.3 })
  @ApiResponse({ description: 'The emojis, determined by the given criteria', type: [Emoji] })
  async getEmojis(@Query('lang') lang?: Language, @Query('search') search?: string, @Query('max') max?: number, @Query('minRelevance') minRelevance?: number): Promise<Emoji[]> {
    const start = new Date();
    const id = uuid();
    const emojis: Emoji[] = await this.emojiService.getEmojis(lang, search, max, minRelevance);
    const end = new Date();
    this.logger.log({ request: { id, time: { start, end, delta: end.valueOf() - start.valueOf() + 'ms' }, params: { lang, search, max, minRelevance }, result: emojis.length } }, AppController.name + '|' + this.getEmojis.name);
    return emojis;
  }
}
