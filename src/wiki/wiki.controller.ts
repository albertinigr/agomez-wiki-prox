import { PaginatedResource } from '@/common/entity/paginated-resource';
import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  UseInterceptors,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { WikiService } from './service/wiki/wiki.service';
import { PaginationParams } from '../common/decorator/pagination-param.decorator';
import { FilteringParams } from '../common/decorator/filtering-param.decorator';
import { DEFAULT_SECTION } from '../common/lib/constants';
import { TranslateService } from '../common/service/translate/translate.service';
import { ArticleEssencialDto } from './dto/article-essencial.dto';
import { LoggingInterceptor } from '../common/interceptor/logging.interceptor';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { FilteringDto } from '../common/dto/filtering.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@ApiTags('Feed')
@Controller('feed')
@UseInterceptors(LoggingInterceptor)
export class WikiController {
  constructor(
    private readonly wikiService: WikiService,
    private readonly translateService: TranslateService,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiQuery({ name: 'date', required: true, example: '2024/09/28' })
  @ApiQuery({ name: 'locale', required: true, example: 'en' })
  @ApiQuery({ name: 'page', required: true, example: 0 })
  @ApiQuery({ name: 'size', required: true, example: 5 })
  async feed(
    @FilteringParams() filteringParams: FilteringDto,
    @PaginationParams() paginationParams?: PaginationDto,
  ): Promise<PaginatedResource<ArticleEssencialDto>> {
    try {
      const section = DEFAULT_SECTION;
      const paginatedResult = await this.wikiService.feed(
        section,
        filteringParams,
        paginationParams,
      );
      return {
        ...paginatedResult,
        items: plainToInstance(ArticleEssencialDto, paginatedResult.items),
      };
    } catch (error) {
      throw error;
    }
  }

  @Get('translate/:language')
  @HttpCode(HttpStatus.OK)
  @ApiQuery({ name: 'date', required: true, example: '2024/09/28' })
  @ApiQuery({ name: 'locale', required: true, example: 'en' })
  @ApiQuery({ name: 'page', required: true, example: 0 })
  @ApiQuery({ name: 'size', required: true, example: 5 })
  async translateToTargetLanguage(
    @Param('language') language: string,
    @FilteringParams() filteringParams: FilteringDto,
    @PaginationParams() paginationParams?: PaginationDto,
  ): Promise<any> {
    try {
      // validate if language is supported and also if the target language is supported
      const languages = await this.translateService.languages();
      const currentLanguage = languages.find(
        (lang) => lang.code === filteringParams.locale,
      );
      if (!currentLanguage) throw 'Language not supported';
      if (currentLanguage.targets.indexOf(language) === -1)
        throw 'Target Language not supported';

      // search articles
      const section = DEFAULT_SECTION;
      const results = await this.wikiService.feed(
        section,
        filteringParams,
        paginationParams,
      );

      const paginatedResult = {
        ...results,
        items: plainToInstance(ArticleEssencialDto, results.items),
      };

      // translate articles
      const translatedList = await this.translateService.translateList(
        paginatedResult.items,
        ['title', 'extract'],
        filteringParams.locale,
        language,
      );

      return {
        ...paginatedResult,
        items: translatedList,
      };
    } catch (error) {
      throw new Error(error);
    }
  }
}
