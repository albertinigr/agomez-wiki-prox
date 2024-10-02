import { Test, TestingModule } from '@nestjs/testing';
import { TranslateService } from './translate.service';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { TargetLanguage, TranslationResult } from '@/common/entity';
import { from } from 'rxjs';

describe('TranslateService', () => {
  let httpService: HttpService;
  let configService: ConfigService;
  let service: TranslateService;

  beforeEach(async () => {
    httpService = new HttpService();
    configService = new ConfigService();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TranslateService,
        {
          provide: HttpService,
          useValue: httpService,
        },
        { provide: ConfigService, useValue: configService },
      ],
    }).compile();

    service = module.get<TranslateService>(TranslateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return a list of languages', async () => {
    const languages: TargetLanguage[] = [
      { code: 'en', name: 'English', targets: ['es'] },
    ];

    httpService.get = jest
      .fn()
      .mockReturnValue(from(Promise.resolve({ data: languages })));

    const result = await service.languages();
    expect(result).toEqual(languages);
  });

  it('should return an error when an error is throw in languages', async () => {
    httpService.get = jest.fn().mockReturnValue(from(Promise.reject()));

    try {
      await service.languages();
    } catch (error) {
      expect(error).toEqual('An error happened!');
    }
  });

  it('should return a translated text', async () => {
    const response: TranslationResult = { translatedText: 'Articulo 1' };

    httpService.post = jest
      .fn()
      .mockReturnValue(from(Promise.resolve({ data: response })));

    const result = await service.translate('Article 1', 'en', 'en');

    expect(result).toEqual(response);
  });

  it('should return an error when an error is throw in translate', async () => {
    httpService.get = jest.fn().mockReturnValue(from(Promise.reject()));

    try {
      await service.languages();
    } catch (error) {
      expect(error).toEqual('An error happened!');
    }
  });

  it('should return a paginated list of translated articles', async () => {
    const response: TranslationResult = { translatedText: 'Articulo 1' };

    httpService.post = jest
      .fn()
      .mockReturnValue(from(Promise.resolve({ data: response })));

    const result = await service.translateList(
      [
        {
          title: 'Article 1',
          extract: 'This is the content of article 1',
          locale: 'en',
          timestamp: '2024-10-01T22:59:18.528Z',
          wikibase_item: 'Q1',
          content_urls: {},
        },
      ],
      ['title', 'extract'],
      'en',
      'es',
    );

    expect(result).toEqual([
      {
        title: 'Articulo 1',
        extract: 'Articulo 1',
        locale: 'en',
        timestamp: '2024-10-01T22:59:18.528Z',
        wikibase_item: 'Q1',
        content_urls: {},
      },
    ]);
  });
});
