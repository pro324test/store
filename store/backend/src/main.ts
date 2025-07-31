import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend development
  app.enableCors({
    origin: [
      'http://localhost:3001', // Frontend development server
      'http://localhost:3000', // Alternative frontend port
      'http://127.0.0.1:3001',
      'http://127.0.0.1:3000',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-lang'],
  });

  await app.listen(process.env.PORT ?? 3000);
  console.log(
    `🚀 Backend server running on: http://localhost:${process.env.PORT ?? 3000}`,
  );
  console.log(
    `📊 GraphQL Playground: http://localhost:${process.env.PORT ?? 3000}/graphql`,
  );
}
void bootstrap();
