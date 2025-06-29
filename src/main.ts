import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS 설정 (프론트엔드와 통신)
  app.enableCors({
    origin: [
      'http://localhost:3000', // Next.js 개발 서버
      process.env.FRONTEND_URL || 'https://your-nextjs-app.vercel.app', // 프론트엔드 배포 도메인
    ],
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
  });

  // 전역 Validation 파이프
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Swagger 설정
  const config = new DocumentBuilder()
    .setTitle('고객 관리 시스템 API')
    .setDescription('NestJS + Supabase로 구축된 고객 관리 시스템의 REST API')
    .setVersion('1.0')
    .addTag('customers', '고객 관리')
    .addTag('system', '시스템 상태')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const port = process.env.PORT || 3001;
  await app.listen(port);
  
  console.log('🚀 NestJS 서버가 시작되었습니다!');
  console.log(`📡 서버 주소: http://localhost:${port}`);
  console.log(`📖 Swagger 문서: http://localhost:${port}/api`);
}
bootstrap();
