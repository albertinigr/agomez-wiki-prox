import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor } from '@nestjs/common';
import helmet from 'helmet';
import * as compression from 'compression';
import errsole from 'errsole';
import ErrsoleSequelize from 'errsole-sequelize';
import 'dotenv/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

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

  // Swagger
  const options = new DocumentBuilder()
    .setTitle('Wiki Proxy')
    .setDescription('The Wiki Prox API description')
    .setVersion('1.0')
    .addServer('http://localhost:3000/', 'Local environment')
    .addTag('wiki')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('', app, document);

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
