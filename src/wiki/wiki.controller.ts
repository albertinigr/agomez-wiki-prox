import { PaginatedResource } from '@/common/entity/paginated-resource';
import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { WikiService } from './service/wiki/wiki.service';
import { ArticleDto } from './dto';
import { PaginationParams } from '@/common/decorator/pagination-param.decorator';
import { Pagination } from '@/common/entity/pagination';
import { FilteringParams } from '@/common/decorator/filtering-param.decorator';
import { Filtering } from '@/common/entity/filtering';
import { DEFAULT_SECTION } from '@/common/lib/constants';
import { plainToInstance } from 'class-transformer';
import { TranslateService } from '@/common/service/translate/translate.service';
import { ArticleEssencialDto } from './dto/article-essencial.dto';

@Controller('feed')
export class WikiController {
  constructor(
    private readonly wikiService: WikiService,
    private readonly translateService: TranslateService,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async feed(
    @FilteringParams() filteringParams: Filtering,
    @PaginationParams() paginationParams?: Pagination,
  ): Promise<PaginatedResource<ArticleEssencialDto>> {
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
  }

  @Get('translate/:language')
  @HttpCode(HttpStatus.OK)
  async translateToTargetLanguage(
    @Param('language') language: string,
    @FilteringParams() filteringParams: Filtering,
    @PaginationParams() paginationParams?: Pagination,
  ): Promise<any> {
    // validate if language is supported and also if the target language is supported
    const languages = await this.translateService.languages();
    const currentLanguage = languages.find(
      (lang) => lang.code === filteringParams.locale,
    );
    if (!currentLanguage) throw new Error('Language not supported');
    if (currentLanguage.targets.indexOf(language) === -1)
      throw new Error(
        `Target Language not supported for ${JSON.stringify(language)}`,
      );

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
  }
}
