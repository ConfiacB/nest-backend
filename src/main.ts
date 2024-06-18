import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';
import * as bodyParser from 'body-parser'

async function bootstrap() {
  const logger = new Logger();
  const app = await NestFactory.create(AppModule, {logger: ['error', 'debug', 'log']});
  const port = +process.env.APP_PORT || 3000;
  app.setGlobalPrefix('api');
  logger.log('Port running on: ', port);

  const options = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Bulletin board APP')
    .setDescription('Bulletin board API documentation')
    .setVersion('1.0')
    .addTag('Post')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  app.enableCors();

  app.use(bodyParser.json({limit: '1mb'}));
  app.use(bodyParser.urlencoded({ limit:'1mb', extended: true }));
  app.use(bodyParser.text({type: 'text/html'}));
  
  await app.listen(port);
}
bootstrap();
