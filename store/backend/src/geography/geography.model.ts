import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class GeoZone {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field()
  nameEn: string;

  @Field({ nullable: true })
  code?: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  descriptionEn?: string;

  @Field()
  isActive: boolean;

  @Field(() => Int)
  sortOrder: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => [GeoCity])
  cities: GeoCity[];
}

@ObjectType()
export class GeoCity {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  zoneId: number;

  @Field()
  name: string;

  @Field()
  nameEn: string;

  @Field({ nullable: true })
  code?: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  descriptionEn?: string;

  @Field()
  isActive: boolean;

  @Field(() => Int)
  sortOrder: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => GeoZone)
  zone: GeoZone;

  @Field(() => [GeoRegion])
  regions: GeoRegion[];
}

@ObjectType()
export class GeoRegion {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  cityId: number;

  @Field()
  name: string;

  @Field()
  nameEn: string;

  @Field({ nullable: true })
  code?: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  descriptionEn?: string;

  @Field()
  isActive: boolean;

  @Field(() => Int)
  sortOrder: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => GeoCity)
  city: GeoCity;
}
