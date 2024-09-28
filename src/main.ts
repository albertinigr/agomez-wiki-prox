import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor } from '@nestjs/common';
import helmet from 'helmet';
import * as compression from 'compression';
import errsole from 'errsole';
import ErrsoleSequelize from 'errsole-sequelize';
import 'dotenv/config';

errsole.initialize({
  storage: new ErrsoleSequelize({
    dialect: 'sqlite',
    storage: process.env.SQLITE_PATH,
  }),
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: console,
  });
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector), {
      // strategy: 'excludeAll',
    }),
  );
  app.use(compression());
  app.enableCors();
  app.use(helmet());
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
