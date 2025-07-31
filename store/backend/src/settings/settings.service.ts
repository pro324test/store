import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SettingDataType } from './settings.model';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  async findAllSettings() {
    return this.prisma.systemSetting.findMany({
      orderBy: { key: 'asc' },
    });
  }

  async findPublicSettings() {
    return this.prisma.systemSetting.findMany({
      where: { isSecret: false },
      orderBy: { key: 'asc' },
    });
  }

  async findSettingByKey(key: string) {
    return this.prisma.systemSetting.findUnique({
      where: { key },
    });
  }

  async getSettingValue(key: string): Promise<any> {
    const setting = await this.findSettingByKey(key);
    if (!setting) {
      return null;
    }

    // Parse value based on data type
    switch (setting.dataType) {
      case 'boolean':
        return setting.value === 'true';
      case 'number':
        return Number(setting.value);
      case 'json':
        try {
          return JSON.parse(setting.value);
        } catch {
          return null;
        }
      default:
        return setting.value;
    }
  }

  async setSetting(
    key: string,
    value: any,
    dataType: SettingDataType,
    updatedById?: number,
    description?: string,
    descriptionEn?: string,
    isSecret = false,
  ) {
    // Convert value to string for storage
    let stringValue: string;
    switch (dataType) {
      case 'boolean':
        stringValue = value ? 'true' : 'false';
        break;
      case 'number':
        stringValue = String(value);
        break;
      case 'json':
        stringValue = JSON.stringify(value);
        break;
      default:
        stringValue = String(value);
    }

    return this.prisma.systemSetting.upsert({
      where: { key },
      create: {
        key,
        value: stringValue,
        dataType,
        isSecret,
        description,
        descriptionEn,
        updatedById,
      },
      update: {
        value: stringValue,
        dataType,
        isSecret,
        description,
        descriptionEn,
        updatedById,
      },
    });
  }

  async updateSetting(key: string, value: any, updatedById?: number) {
    const existing = await this.findSettingByKey(key);
    if (!existing) {
      throw new Error('Setting not found');
    }

    let stringValue: string;
    switch (existing.dataType) {
      case 'boolean':
        stringValue = value ? 'true' : 'false';
        break;
      case 'number':
        stringValue = String(value);
        break;
      case 'json':
        stringValue = JSON.stringify(value);
        break;
      default:
        stringValue = String(value);
    }

    return this.prisma.systemSetting.update({
      where: { key },
      data: {
        value: stringValue,
        updatedById,
      },
    });
  }

  async deleteSetting(key: string) {
    return this.prisma.systemSetting.delete({
      where: { key },
    });
  }

  async getSettingsByGroup(): Promise<any[]> {
    const settings = await this.findAllSettings();

    // Group settings by their key prefix (e.g., "app.", "payment.", "shipping.")
    const groups = new Map<string, any[]>();

    settings.forEach((setting) => {
      const parts = setting.key.split('.');
      const groupKey = parts.length > 1 ? parts[0] : 'general';

      if (!groups.has(groupKey)) {
        groups.set(groupKey, []);
      }
      groups.get(groupKey)?.push(setting);
    });

    return Array.from(groups.entries()).map(([group, groupSettings]) => ({
      group,
      groupEn: this.getGroupDisplayName(group),
      settings: groupSettings,
    }));
  }

  private getGroupDisplayName(group: string): string {
    const displayNames: Record<string, string> = {
      app: 'Application Settings',
      payment: 'Payment Settings',
      shipping: 'Shipping Settings',
      notification: 'Notification Settings',
      vendor: 'Vendor Settings',
      email: 'Email Settings',
      sms: 'SMS Settings',
      general: 'General Settings',
    };
    return (
      displayNames[group] || group.charAt(0).toUpperCase() + group.slice(1)
    );
  }

  // Helper methods for common settings
  async getAppName(): Promise<string> {
    return (await this.getSettingValue('app.name')) || 'Ajjmal';
  }

  async getAppDescription(): Promise<string> {
    return (
      (await this.getSettingValue('app.description')) ||
      'Modern E-commerce Platform'
    );
  }

  async getCurrency(): Promise<string> {
    return (await this.getSettingValue('app.currency')) || 'LYD';
  }

  async getDefaultLanguage(): Promise<string> {
    return (await this.getSettingValue('app.defaultLanguage')) || 'ar';
  }

  async isMaintenanceMode(): Promise<boolean> {
    return (await this.getSettingValue('app.maintenanceMode')) || false;
  }

  async getShippingFee(): Promise<number> {
    return (await this.getSettingValue('shipping.defaultFee')) || 0;
  }

  async getVendorCommissionRate(): Promise<number> {
    return (await this.getSettingValue('vendor.commissionRate')) || 10;
  }

  // Initialize default settings
  async initializeDefaultSettings() {
    const defaultSettings = [
      {
        key: 'app.name',
        value: 'Ajjmal',
        dataType: SettingDataType.STRING,
        description: 'Application name',
        descriptionEn: 'Application name',
      },
      {
        key: 'app.description',
        value: 'Modern E-commerce Platform for Libya',
        dataType: SettingDataType.STRING,
        description: 'وصف التطبيق',
        descriptionEn: 'Application description',
      },
      {
        key: 'app.currency',
        value: 'LYD',
        dataType: SettingDataType.STRING,
        description: 'العملة الافتراضية',
        descriptionEn: 'Default currency',
      },
      {
        key: 'app.defaultLanguage',
        value: 'ar',
        dataType: SettingDataType.STRING,
        description: 'اللغة الافتراضية',
        descriptionEn: 'Default language',
      },
      {
        key: 'app.maintenanceMode',
        value: 'false',
        dataType: SettingDataType.BOOLEAN,
        description: 'وضع الصيانة',
        descriptionEn: 'Maintenance mode',
      },
      {
        key: 'shipping.defaultFee',
        value: '5',
        dataType: SettingDataType.NUMBER,
        description: 'رسوم الشحن الافتراضية',
        descriptionEn: 'Default shipping fee',
      },
      {
        key: 'vendor.commissionRate',
        value: '10',
        dataType: SettingDataType.NUMBER,
        description: 'نسبة عمولة التاجر',
        descriptionEn: 'Vendor commission rate (%)',
      },
      {
        key: 'vendor.minPayout',
        value: '100',
        dataType: SettingDataType.NUMBER,
        description: 'الحد الأدنى للسحب',
        descriptionEn: 'Minimum payout amount',
      },
      {
        key: 'notification.orderStatusEnabled',
        value: 'true',
        dataType: SettingDataType.BOOLEAN,
        description: 'إشعارات حالة الطلب',
        descriptionEn: 'Order status notifications',
      },
      {
        key: 'payment.allowCOD',
        value: 'true',
        dataType: SettingDataType.BOOLEAN,
        description: 'السماح بالدفع عند الاستلام',
        descriptionEn: 'Allow cash on delivery',
      },
    ];

    for (const setting of defaultSettings) {
      const existing = await this.findSettingByKey(setting.key);
      if (!existing) {
        await this.setSetting(
          setting.key,
          setting.value,
          setting.dataType,
          undefined,
          setting.description,
          setting.descriptionEn,
        );
      }
    }
  }
}
