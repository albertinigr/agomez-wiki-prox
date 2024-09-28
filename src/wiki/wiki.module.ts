import { Module } from '@nestjs/common';
import { WikiService } from './service/wiki/wiki.service';
import { WikiController } from './wiki.controller';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { TranslateService } from './service/translate/translate.service';

@Module({
  imports: [HttpModule, ConfigModule],
  controllers: [WikiController],
  providers: [WikiService, TranslateService],
})
export class WikiModule {}
