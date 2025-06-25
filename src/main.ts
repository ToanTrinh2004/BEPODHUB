import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  console.log('MONGO_URI:', process.env.MONGO_URI); // ✅ Debug log
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
  
}
bootstrap();
