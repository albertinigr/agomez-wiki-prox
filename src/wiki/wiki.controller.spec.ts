import { Test, TestingModule } from '@nestjs/testing';
import { WikiController } from './wiki.controller';
import { WikiService } from './service/wiki/wiki.service';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { TranslateService } from '../common/service/translate/translate.service';
import { PaginatedResource, TargetLanguage } from '@/common/entity';

describe('WikiController', () => {
  let httpService: HttpService;
  let configService: ConfigService;
  let wikiService: WikiService;
  let translateService: TranslateService;
  let controller: WikiController;
  let article: any;
  let paginatedResource: PaginatedResource<any>;
  let request;
  let languages: TargetLanguage[];
  let translatedArticle: any;

  beforeEach(async () => {
    httpService = new HttpService();
    configService = new ConfigService();
    translateService = new TranslateService(httpService, configService);
    wikiService = new WikiService(httpService, configService);

    const module: TestingModule = await Test.createTestingModule({
      controllers: [WikiController],
      providers: [
        WikiService,
        {
          provide: WikiService,
          useValue: wikiService,
        },
        TranslateService,
        {
          provide: TranslateService,
          useValue: translateService,
        },
      ],
    }).compile();

    controller = module.get<WikiController>(WikiController);

    article = {
      title: 'Article 1',
      extract: 'This is the content of article 1',
      wikibase_item: 'Q1',
      timestamp: new Date('2024-10-02T01:07:27.513Z'),
      content_urls: undefined,
      locale: undefined,
      thumbnail: undefined,
    };

    paginatedResource = {
      items: [article],
      totalItems: 1,
      page: 0,
      size: 5,
    };

    request = [
      { locale: 'en', date: '2021/01/01' },
      { page: 0, size: 5 },
    ];

    languages = [{ code: 'en', name: 'English', targets: ['es'] }];
    translatedArticle = {
      title: 'Articulo 1',
      extract: 'Articulo 1',
      locale: 'en',
      timestamp: '2024-10-01T22:59:18.528Z',
      wikibase_item: 'Q1',
      content_urls: {},
    };
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return feeds', async () => {
    jest.spyOn(wikiService, 'feed').mockImplementation(() => {
      return Promise.resolve(paginatedResource);
    });
    const result = await controller.feed(request);
    expect(result).toEqual({
      items: [article],
      totalItems: 1,
      page: 0,
      size: 5,
    });
  });

  it('should return an error when service fails', async () => {
    jest.spyOn(wikiService, 'feed').mockImplementation(() => {
      return Promise.reject('An error happened!');
    });

    try {
      await controller.feed(request);
    } catch (error) {
      expect(error).toEqual('An error happened!');
    }
  });

  it('should return an error when translate service fails', async () => {
    jest.spyOn(translateService, 'languages').mockImplementation(() => {
      return Promise.resolve(languages);
    });
    jest.spyOn(wikiService, 'feed').mockImplementation(() => {
      return Promise.resolve(paginatedResource);
    });
    jest.spyOn(translateService, 'translateList').mockImplementation(() => {
      return Promise.resolve([translatedArticle]);
    });

    const result = await controller.translateToTargetLanguage(
      'es',
      { locale: 'en', date: '2021/01/01' },
      { page: 0, size: 5 },
    );

    expect(result).toEqual({
      items: [translatedArticle],
      totalItems: 1,
      page: 0,
      size: 5,
    });
  });
});
