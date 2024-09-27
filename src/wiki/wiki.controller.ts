import { Controller, Get } from '@nestjs/common';
import { WikiService } from './wiki.service';

@Controller('wiki')
export class WikiController {
  constructor(private readonly wikiService: WikiService) {}

  // @Post()
  // create(@Body() createWikiDto: CreateWikiDto) {
  //   return this.wikiService.create(createWikiDto);
  // }

  @Get('feed')
  feed() {
    return this.wikiService.feed({
      locale: 'en',
      section: 'featured',
      date: '2024/09/27',
    });
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.wikiService.findOne(+id);
  // }
}
