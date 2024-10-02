import { Test, TestingModule } from '@nestjs/testing';
import { WikiService } from './wiki.service';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { from } from 'rxjs';

describe('WikiService', () => {
  let httpService: HttpService;
  let configService: ConfigService;
  let service: WikiService;
  let article;
  let paginatedResource;
  let request;

  beforeEach(async () => {
    httpService = new HttpService();
    configService = new ConfigService();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WikiService,
        {
          provide: HttpService,
          useValue: httpService,
        },
        { provide: ConfigService, useValue: configService },
      ],
    }).compile();

    service = module.get<WikiService>(WikiService);

    article = {
      title: 'Article 1',
      extract: 'This is the content of article 1',
      locale: 'en',
      timestamp: new Date(),
      wikibase_item: 'Q1',
      content_urls: {},
    };

    paginatedResource = {
      items: [article],
      totalItems: 1,
      page: 0,
      size: 5,
    };

    request = [
      'section',
      { locale: 'en', date: '2021/01/01' },
      { page: 0, size: 5 },
    ];
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return a list of articles', async () => {
    httpService.get = jest.fn().mockReturnValue(
      from(
        Promise.resolve({
          data: {
            mostread: { articles: [article] },
          },
        }),
      ),
    );

    const result = await service.feed(...request);

    expect(result).toEqual(paginatedResource);
  });

  it('should return an error when an error happens', async () => {
    httpService.get = jest.fn().mockReturnValue(from(Promise.reject()));

    try {
      await service.feed(...request);
    } catch (error) {
      expect(error).toEqual('An error happened!');
    }
  });
});
