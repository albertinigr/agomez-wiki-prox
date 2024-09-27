import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { buildWikiUrl } from './lib/util';

@Injectable()
export class WikiService {
  private readonly logger = new Logger(WikiService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async feed({
    locale = 'en',
    section = 'featured',
    date = '2024/09/27',
  }: {
    locale: string;
    section: string;
    date: string;
  }) {
    const url = buildWikiUrl({
      path: this.configService.get('wikiService.feed'),
      locale,
      section,
      date,
    });
    this.logger.log(`GET ${url}`);
    const data = await this.httpService.get(url).toPromise();
    return data.data;
  }
}
