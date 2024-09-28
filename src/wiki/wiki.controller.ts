import { Controller, Get, Param } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { WikiService } from './service/wiki/wiki.service';
import { FeedDto } from './dto';
import { PaginationParams } from '@/common/decorator/pagination-param.decorator';
import { Pagination } from '@/common/entity/pagination';
import { FilteringParams } from '@/common/decorator/filtering-param.decorator';
import { Filtering } from '@/common/entity/filtering';

@Controller('feed')
export class WikiController {
  constructor(private readonly wikiService: WikiService) {}

  @Get()
  async feed(
    @FilteringParams() filteringParams?: Filtering,
    @PaginationParams() paginationParams?: Pagination,
  ): Promise<FeedDto> {
    const feed = await this.wikiService.feed({
      locale: 'en',
      section: 'featured',
      date: '2024/09/27',
    });
    return plainToInstance(FeedDto, feed);
  }

  @Get('translate/:language')
  findOne(@Param() language: string) {
    return `This action returns a #${language} wiki`;
  }
}
