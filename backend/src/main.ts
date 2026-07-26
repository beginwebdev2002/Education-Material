import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const PORT = configService.get<number>('port')
  app.use(cookieParser());
  app.enableCors({
    origin: configService.get('cors.origin'),
    methods: configService.get('cors.methods'),
    credentials: configService.get('cors.credentials'),
  })
<<<<<<< HEAD
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
=======
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

>>>>>>> 8799246afdbac4070d608d8196a352baa8a78d31
  await app.listen(PORT ?? 3000);
}
bootstrap();
