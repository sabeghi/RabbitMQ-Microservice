import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  //await app.listen(3000);
  const configService = app.get(ConfigService)

  const USER = configService.get('RABBITMQ_USER')
  const PASSWORD = configService.get('RABBITMQ_PASS')
  const HOST = configService.get('RABBITMQ_HOST')
  const QUEUE = configService.get('RABBITMQ_AUTH_QUEUE')

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [`amop://${USER}:${PASSWORD}@${HOST}`],
      noAck: false,
      queue: QUEUE,
      queueOptions:{
        durable: true,
      },
    },    
  });

  app.startAllMicroservices();
}
bootstrap();
