import { Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class AppService {
  constructor(private readonly i18nService: I18nService) {}

  async getHello(lang?: string): Promise<string> {
    return this.i18nService.translate('common.hello', { lang });
  }

  async getWelcome(lang?: string): Promise<string> {
    return this.i18nService.translate('common.welcome', { lang });
  }

  async getApiInfo(lang?: string): Promise<any> {
    return {
      title: this.i18nService.translate('common.api.title', { lang }),
      description: this.i18nService.translate('common.api.description', {
        lang,
      }),
      version: this.i18nService.translate('common.api.version', { lang }),
    };
  }
}
