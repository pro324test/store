import { Controller, Get, Query } from '@nestjs/common';
import { I18nLang } from 'nestjs-i18n';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getHello(@I18nLang() lang: string): Promise<string> {
    return this.appService.getHello(lang);
  }

  @Get('welcome')
  async getWelcome(
    @I18nLang() lang: string,
    @Query('lang') queryLang?: string,
  ): Promise<string> {
    // Use query parameter lang if provided, otherwise use resolved lang
    const selectedLang = queryLang || lang;
    return this.appService.getWelcome(selectedLang);
  }

  @Get('api-info')
  async getApiInfo(
    @I18nLang() lang: string,
    @Query('lang') queryLang?: string,
  ): Promise<any> {
    const selectedLang = queryLang || lang;
    return this.appService.getApiInfo(selectedLang);
  }
}
