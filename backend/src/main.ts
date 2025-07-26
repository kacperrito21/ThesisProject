import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import * as dotenv from 'dotenv';
import * as process from 'node:process';
import cookieParser from 'cookie-parser';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  const origins = (process.env.CORS_ORIGINS ?? '')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);

  app.enableCors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);
      const ok =
        origins.includes(origin) ||
        origins.some((o) =>
          o.startsWith('https://*.')
            ? origin.endsWith(o.replace('*.', ''))
            : false,
        );

      return ok ? cb(null, true) : cb(new Error(`CORS blocked: ${origin}`));
    },
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization',
  });

  await app.listen(process.env.PORT || 5000);
}

bootstrap();
