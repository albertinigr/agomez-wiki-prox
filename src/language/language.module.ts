import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { TranslateService } from '@/common/service/translate/translate.service';
import { LanguageController } from './language.controller';

@Module({
  imports: [HttpModule, ConfigModule],
  controllers: [LanguageController],
  providers: [TranslateService],
})
export class LanguageModule {}
