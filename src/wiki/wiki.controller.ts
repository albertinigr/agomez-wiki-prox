import { PaginatedResource } from '@/common/types/paginated-resource';
import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { WikiService } from './service/wiki/wiki.service';
import { ArticleDto } from './dto';
import { PaginationParams } from '@/common/decorator/pagination-param.decorator';
import { Pagination } from '@/common/types/pagination';
import { FilteringParams } from '@/common/decorator/filtering-param.decorator';
import { Filtering } from '@/common/types/filtering';
import { DEFAULT_SECTION } from '@/common/lib/constants';

@Controller('feed')
export class WikiController {
  constructor(private readonly wikiService: WikiService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async feed(
    @FilteringParams() filteringParams: Filtering,
    @PaginationParams() paginationParams?: Pagination,
  ): Promise<PaginatedResource<ArticleDto>> {
    const section = DEFAULT_SECTION;
    const paginatedResult = await this.wikiService.feed(
      section,
      filteringParams,
      paginationParams,
    );

    return paginatedResult;
  }

  @Get('translate/:language')
  @HttpCode(HttpStatus.OK)
  findOne(@Param() language: string) {
    return `This action returns a #${language} wiki`;
  }
}
