import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { TranslateService } from '@/common/service/translate/translate.service';
import { WikiService } from './service/wiki/wiki.service';
import { WikiController } from './wiki.controller';

@Module({
  imports: [HttpModule, ConfigModule],
  controllers: [WikiController],
  providers: [WikiService, TranslateService],
})
export class WikiModule {}
