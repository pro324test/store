import { Test, TestingModule } from '@nestjs/testing';
import {
  I18nModule,
  I18nService,
  QueryResolver,
  HeaderResolver,
  AcceptLanguageResolver,
} from 'nestjs-i18n';
import { join } from 'path';

describe('I18nService', () => {
  let i18nService: I18nService;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        I18nModule.forRoot({
          fallbackLanguage: 'en',
          loaderOptions: {
            path: join(__dirname, '/i18n/'),
            watch: false,
          },
          resolvers: [
            { use: QueryResolver, options: ['lang'] },
            { use: HeaderResolver, options: ['x-lang'] },
            AcceptLanguageResolver,
          ],
        }),
      ],
    }).compile();

    i18nService = module.get<I18nService>(I18nService);
  });

  afterEach(async () => {
    await module.close();
  });

  describe('translate', () => {
    it('should translate common.hello in English', async () => {
      const result = await i18nService.translate('common.hello', {
        lang: 'en',
      });
      expect(result).toBe('Hello');
    });

    it('should translate common.hello in Arabic', async () => {
      const result = await i18nService.translate('common.hello', {
        lang: 'ar',
      });
      expect(result).toBe('مرحبا');
    });

    it('should translate user messages in English', async () => {
      const result = await i18nService.translate('messages.user.created', {
        lang: 'en',
      });
      expect(result).toBe('User created successfully');
    });

    it('should translate user messages in Arabic', async () => {
      const result = await i18nService.translate('messages.user.created', {
        lang: 'ar',
      });
      expect(result).toBe('تم إنشاء المستخدم بنجاح');
    });

    it('should fallback to English for unknown languages', async () => {
      const result = await i18nService.translate('common.hello', {
        lang: 'unknown',
      });
      expect(result).toBe('Hello');
    });

    it('should return key if translation not found', async () => {
      const result = await i18nService.translate('unknown.key', { lang: 'en' });
      expect(result).toBe('unknown.key');
    });
  });
});
