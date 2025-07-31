import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor() {}

  async getHello(lang?: string): Promise<string> {
    return lang === 'en' ? 'Hello World!' : 'مرحبا بالعالم!';
  }

  async getWelcome(lang?: string): Promise<string> {
    return lang === 'en'
      ? 'Welcome to Ajjmal API'
      : 'مرحبا بكم في واجهة برمجة تطبيقات أجمل';
  }

  async getApiInfo(lang?: string): Promise<any> {
    return {
      title:
        lang === 'en'
          ? 'Ajjmal E-commerce API'
          : 'واجهة برمجة تطبيقات أجمل للتجارة الإلكترونية',
      description:
        lang === 'en'
          ? 'Modern multi-vendor e-commerce platform'
          : 'منصة حديثة للتجارة الإلكترونية متعددة البائعين',
      version: '2.0.0',
    };
  }
}
