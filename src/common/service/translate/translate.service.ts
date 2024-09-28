import { TargetLanguage } from '@/common/entity/target-language';
import { TranslationResult } from '@/common/entity/translation-result';
import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from 'axios';
import { log } from 'console';
import { catchError, firstValueFrom } from 'rxjs';

@Injectable()
export class TranslateService {
  private readonly logger = new Logger(TranslateService.name);
  private baseUrl: string = this.configService.get('translationService.url');

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async languages(): Promise<TargetLanguage[]> {
    const { data } = await firstValueFrom(
      this.httpService.get(`${this.baseUrl}/languages`).pipe(
        catchError((error: AxiosError) => {
          this.logger.error(error.response);
          throw 'An error happened!';
        }),
      ),
    );

    return data;
  }

  async translate(
    text: string,
    source: string,
    target: string,
  ): Promise<TranslationResult> {
    const { data } = await firstValueFrom(
      this.httpService
        .post(`${this.baseUrl}/translate`, {
          q: text,
          source,
          target,
        })
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error.response.data);
            throw 'An error happened!';
          }),
        ),
    );

    return data;
  }

  async translateList<T>(list: T[], fields, source, target): Promise<T[]> {
    const resultingList = await Promise.all(
      list.map(async (item) => {
        const translatedItem = { ...item };
        for (const field of fields) {
          const text = item[field];
          const { translatedText } = await this.translate(text, source, target);
          translatedItem[field] = translatedText;
        }
        return translatedItem;
      }),
    );

    return resultingList;
  }
}
