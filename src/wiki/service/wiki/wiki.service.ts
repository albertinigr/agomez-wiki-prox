import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { buildWikiUrl } from '../../lib/util';
import {
  DEFAULT_LOCALE,
  DEFAULT_PAGE,
  DEFAULT_SECTION,
  DEFAULT_SIZE,
} from '@/common/lib/constants';
import { Filtering } from '@/common/entity/filtering';
import { Pagination } from '@/common/entity/pagination';
import { PaginatedResource } from '@/common/entity/paginated-resource';
import { Article } from '@/wiki/entity';

@Injectable()
export class WikiService {
  private readonly logger = new Logger(WikiService.name);
  private baseUrl: string = this.configService.get('wikiService.feed');

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async feed(
    section = DEFAULT_SECTION,
    { locale, date }: Filtering = { locale: DEFAULT_LOCALE, date: null },
    pagination?: Pagination,
  ): Promise<PaginatedResource<Article>> {
    const today = new Date().toISOString().split('T')[0].replace(/-/g, '/');

    const url = buildWikiUrl({
      path: this.baseUrl,
      locale,
      section,
      date: date ?? today,
    });

    console.log(url);

    const { data } = await firstValueFrom(
      this.httpService.get(url).pipe(
        catchError((error: AxiosError) => {
          this.logger.error(error.response.data);
          throw 'An error happened!';
        }),
      ),
    );

    if (!data?.mostread?.articles?.length) {
      throw 'No data found!';
    }

    const start = pagination?.page * pagination?.size || DEFAULT_PAGE;
    const offset = pagination?.size || DEFAULT_SIZE;
    const pagedData = data?.mostread?.articles?.slice(start, start + offset);
    return {
      totalItems: data?.mostread?.articles?.length,
      items: pagedData,
      page: pagination?.page || DEFAULT_PAGE,
      size: pagination?.size || DEFAULT_SIZE,
    } as PaginatedResource<Article>;
  }
}
