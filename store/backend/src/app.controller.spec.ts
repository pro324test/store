import { Test, TestingModule } from '@nestjs/testing';
import { I18nService } from 'nestjs-i18n';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;
  let i18nService: I18nService;

  beforeEach(async () => {
    const mockI18nService = {
      translate: jest.fn().mockImplementation((key: string) => {
        if (key === 'common.hello') return 'Hello';
        if (key === 'common.welcome') return 'Welcome';
        return key;
      }),
    };

    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        {
          provide: I18nService,
          useValue: mockI18nService,
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
    i18nService = app.get<I18nService>(I18nService);
  });

  describe('root', () => {
    it('should return translated hello message', async () => {
      const result = await appController.getHello('en');
      expect(result).toBe('Hello');
      expect(i18nService.translate).toHaveBeenCalledWith('common.hello', {
        lang: 'en',
      });
    });

    it('should return translated welcome message', async () => {
      const result = await appController.getWelcome('en');
      expect(result).toBe('Welcome');
      expect(i18nService.translate).toHaveBeenCalledWith('common.welcome', {
        lang: 'en',
      });
    });
  });
});
