import { Module } from '@nestjs/common';
import { WikiService } from './wiki.service';
import { WikiController } from './wiki.controller';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { ServiceService } from './service/service.service';
import { TranslationService } from './service/translation/translation.service';
import { TranslateService } from './service/translate/translate.service';

@Module({
  imports: [HttpModule, ConfigModule],
  controllers: [WikiController],
  providers: [WikiService, ServiceService, TranslationService, TranslateService],
})
export class WikiModule {}
