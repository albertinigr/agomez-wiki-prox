import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import configuration from '@/common/config/configuration';
import { CommonModule } from '@/common/common.module';
import { WikiModule } from './wiki/wiki.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    CommonModule,
    WikiModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
