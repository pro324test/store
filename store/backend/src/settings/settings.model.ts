import { ObjectType, Field, registerEnumType } from '@nestjs/graphql';

export enum SettingDataType {
  STRING = 'string',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
  JSON = 'json',
}

registerEnumType(SettingDataType, {
  name: 'SettingDataType',
});

@ObjectType()
export class SystemSetting {
  @Field()
  key: string;

  @Field()
  value: string;

  @Field(() => SettingDataType)
  dataType: SettingDataType;

  @Field()
  isSecret: boolean;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  descriptionEn?: string;

  @Field()
  updatedAt: Date;
}

@ObjectType()
export class SettingGroup {
  @Field()
  group: string;

  @Field()
  groupEn: string;

  @Field(() => [SystemSetting])
  settings: SystemSetting[];
}
