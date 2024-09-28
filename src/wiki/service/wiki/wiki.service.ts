import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { buildWikiUrl } from './lib/util';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { Feed } from './entity';

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
  }): Promise<Feed> {
    const url = buildWikiUrl({
      path: this.configService.get('wikiService.feed'),
      locale,
      section,
      date,
    });

    const { data } = await firstValueFrom(
      this.httpService.get(url).pipe(
        catchError((error: AxiosError) => {
          this.logger.error(error.response.data);
          throw 'An error happened!';
        }),
      ),
    );

    return data;
  }
}
