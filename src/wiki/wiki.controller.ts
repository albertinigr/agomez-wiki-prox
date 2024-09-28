import { Controller, Get, Param, Query } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { WikiService } from './service/wiki/wiki.service';
import { FeedDto } from './dto';

@Controller('feed')
export class WikiController {
  constructor(private readonly wikiService: WikiService) {}

  @Get()
  async feed(@Query() params: any): Promise<FeedDto> {
    console.log(params);
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
