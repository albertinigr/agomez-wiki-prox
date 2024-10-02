import { Test, TestingModule } from '@nestjs/testing';
import { LanguageController } from './language.controller';
import { TranslateService } from '../common/service/translate/translate.service';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

describe('LanguageController', () => {
  let controller: LanguageController;
  let httpService: HttpService;
  let configService: ConfigService;
  let translateService: TranslateService;
  let locale;

  beforeEach(async () => {
    httpService = new HttpService();
    configService = new ConfigService();
    translateService = new TranslateService(httpService, configService);

    const module: TestingModule = await Test.createTestingModule({
      controllers: [LanguageController],
      providers: [
        TranslateService,
        { provide: TranslateService, useValue: translateService },
      ],
    }).compile();

    controller = module.get<LanguageController>(LanguageController);

    locale = { code: 'en', name: 'English' };
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return a list of languages', async () => {
    const languages = [locale];

    jest.spyOn(translateService, 'languages').mockImplementation(() => {
      return Promise.resolve(languages);
    });

    const result = await controller.getAvailableLanguages();
    expect(result).toEqual(languages);
  });

  it('should return an error when an error is throw in languages', async () => {
    jest.spyOn(translateService, 'languages').mockImplementation(() => {
      return Promise.reject('An error happened!');
    });

    try {
      await controller.getAvailableLanguages();
    } catch (error) {
      expect(error).toEqual('An error happened!');
    }
  });
});
