import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseInterceptors,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { TranslateService } from '../common/service/translate/translate.service';
import { LoggingInterceptor } from '../common/interceptor/logging.interceptor';
import { LocaleDto } from '../common/dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Language')
@Controller('language')
@UseInterceptors(LoggingInterceptor)
export class LanguageController {
  constructor(private readonly translateService: TranslateService) {}

  @Get('/available-languages')
  @HttpCode(HttpStatus.OK)
  async getAvailableLanguages(): Promise<LocaleDto[]> {
    try {
      const availableLanguages = await this.translateService.languages();
      return plainToInstance(LocaleDto, availableLanguages);
    } catch (error) {
      throw error;
    }
  }
}
