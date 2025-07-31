import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { SettingsService } from './settings.service';
import { SystemSetting, SettingGroup, SettingDataType } from './settings.model';

@Resolver(() => SystemSetting)
export class SettingsResolver {
  constructor(private settingsService: SettingsService) {}

  @Query(() => [SystemSetting], { name: 'systemSettings' })
  findAllSettings() {
    return this.settingsService.findAllSettings();
  }

  @Query(() => [SystemSetting], { name: 'publicSettings' })
  findPublicSettings() {
    return this.settingsService.findPublicSettings();
  }

  @Query(() => [SettingGroup], { name: 'settingsGroups' })
  getSettingsByGroup() {
    return this.settingsService.getSettingsByGroup();
  }

  @Query(() => SystemSetting, { name: 'setting', nullable: true })
  findSettingByKey(@Args('key') key: string) {
    return this.settingsService.findSettingByKey(key);
  }

  @Query(() => String, { name: 'settingValue', nullable: true })
  async getSettingValue(@Args('key') key: string) {
    const value = await this.settingsService.getSettingValue(key);
    return value !== null ? JSON.stringify(value) : null;
  }

  // Common app settings queries
  @Query(() => String, { name: 'appName' })
  getAppName() {
    return this.settingsService.getAppName();
  }

  @Query(() => String, { name: 'appDescription' })
  getAppDescription() {
    return this.settingsService.getAppDescription();
  }

  @Query(() => String, { name: 'appCurrency' })
  getCurrency() {
    return this.settingsService.getCurrency();
  }

  @Query(() => String, { name: 'defaultLanguage' })
  getDefaultLanguage() {
    return this.settingsService.getDefaultLanguage();
  }

  @Query(() => Boolean, { name: 'isMaintenanceMode' })
  isMaintenanceMode() {
    return this.settingsService.isMaintenanceMode();
  }

  @Query(() => Int, { name: 'shippingFee' })
  getShippingFee() {
    return this.settingsService.getShippingFee();
  }

  @Query(() => Int, { name: 'vendorCommissionRate' })
  getVendorCommissionRate() {
    return this.settingsService.getVendorCommissionRate();
  }

  @Mutation(() => SystemSetting)
  setSetting(
    @Args('key') key: string,
    @Args('value') value: string,
    @Args('dataType', { type: () => SettingDataType })
    dataType: SettingDataType,
    @Args('updatedById', { type: () => Int, nullable: true })
    updatedById?: number,
    @Args('description', { nullable: true }) description?: string,
    @Args('descriptionEn', { nullable: true }) descriptionEn?: string,
    @Args('isSecret', { nullable: true, defaultValue: false })
    isSecret?: boolean,
  ) {
    // Parse the value based on data type
    let parsedValue: any;
    switch (dataType) {
      case SettingDataType.BOOLEAN:
        parsedValue = value === 'true';
        break;
      case SettingDataType.NUMBER:
        parsedValue = Number(value);
        break;
      case SettingDataType.JSON:
        try {
          parsedValue = JSON.parse(value);
        } catch {
          throw new Error('Invalid JSON value');
        }
        break;
      default:
        parsedValue = value;
    }

    return this.settingsService.setSetting(
      key,
      parsedValue,
      dataType,
      updatedById,
      description,
      descriptionEn,
      isSecret,
    );
  }

  @Mutation(() => SystemSetting)
  updateSetting(
    @Args('key') key: string,
    @Args('value') value: string,
    @Args('updatedById', { type: () => Int, nullable: true })
    updatedById?: number,
  ) {
    return this.settingsService.updateSetting(key, value, updatedById);
  }

  @Mutation(() => Boolean)
  async deleteSetting(@Args('key') key: string) {
    await this.settingsService.deleteSetting(key);
    return true;
  }

  @Mutation(() => Boolean)
  async initializeDefaultSettings() {
    await this.settingsService.initializeDefaultSettings();
    return true;
  }
}
