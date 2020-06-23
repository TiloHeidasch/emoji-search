import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const options = new DocumentBuilder()
    .setTitle('Emoji Search API')
    .setDescription('An API that lets you search the available Unicode Emojis in different languages')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
  const port = 80;
  await app.listen(port, () => {
    Logger.log('Listening at http://localhost:' + port + '/');
  });
}
bootstrap();
