import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { EmojiService } from './emoji.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [EmojiService],
})
export class AppModule { }
