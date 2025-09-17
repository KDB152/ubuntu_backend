// src/main.ts
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import 'dotenv/config'; // Import and call config from dotenv
import { SecurityHeadersMiddleware } from './common/security/security-headers.middleware';
import { RateLimiterMiddleware } from './common/security/rate-limiter.middleware';
import { CsrfMiddleware } from './common/security/csrf.middleware';
import helmet from 'helmet';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Security middleware
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'", "http://51.77.195.224:3001"],
      },
    },
    crossOriginEmbedderPolicy: false,
  }));

  // Apply security middleware
  app.use(new SecurityHeadersMiddleware().use.bind(new SecurityHeadersMiddleware()));
  app.use(new RateLimiterMiddleware().use.bind(new RateLimiterMiddleware()));
  app.use(new CsrfMiddleware().use.bind(new CsrfMiddleware()));

  // Configuration pour servir les fichiers statiques
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  // Configuration CORS
  app.enableCors({
    origin: [
      'http://51.77.195.224:3000',
      'http://51.77.195.224:3001',
      'http://192.168.1.11:3000',
      'http://192.168.1.11:3001',
      'http://51.77.195.224:3000',
      'http://51.77.195.224:3001',
      process.env.FRONTEND_URL || 'http://51.77.195.224:3000'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  // Pipes de validation with enhanced security
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true, // Reject unknown properties
    transform: true,
    transformOptions: {
      enableImplicitConversion: false, // Disable automatic type conversion
    },
    disableErrorMessages: process.env.NODE_ENV === 'production', // Hide detailed errors in production
  }));

  const port = process.env.PORT || 3001;
  await app.listen(port, '0.0.0.0');
  
  logger.log(`🚀 Serveur démarré sur http://0.0.0.0:${port}`);
  logger.log(`🌐 Accessible sur http://51.77.195.224:${port}`);
  logger.log(`📧 Email configuré: ${process.env.EMAIL_USER}`);
  logger.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL}`);
  logger.log(`🗄️ Base de données: ${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`);
}

bootstrap().catch((error) => {
  console.error('Erreur lors du démarrage du serveur:', error);
  process.exit(1);
});