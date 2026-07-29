import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { resolve } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  const PORT = configService.get<number>('port')
  app.use(cookieParser());
  app.useStaticAssets(resolve(configService.get<string>('uploads.avatarsDir')!), {
    prefix: '/uploads/avatars',
  });
  app.enableCors({
    origin: configService.get('cors.origin'),
    methods: configService.get('cors.methods'),
    credentials: configService.get('cors.credentials'),
  })
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Education Material API')
    .setDescription('API for the EduGen educational material generator')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(PORT ?? 3000);
}
bootstrap();
