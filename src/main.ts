import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = new ConfigService();
  const config = new DocumentBuilder()
    .addOAuth2()
    .setTitle('WeMeet')
    .setDescription('The weMeet API description')
    .setVersion('1.0')
    .addTag('weMeet')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    customSiteTitle: 'App API',
    swaggerOptions: {
      persistAuthorization: true,
      oauth2RedirectUrl: 'http://localhost:4000/api/oauth2-redirect.html',
      initOAuth: {
        clientId:
          '445986193855-bcb87d7m354vgd03h59a942umt8m4c19.apps.googleusercontent.com',
        clientSecret: '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',
        scopes: ['openid, profile'],
        appName: 'wemeet',
      },
    },
  });
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
