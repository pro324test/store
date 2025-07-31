import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { GeographyService } from './geography.service';
import { GeoZone, GeoCity, GeoRegion } from './geography.model';

@Resolver(() => GeoZone)
export class GeographyResolver {
  constructor(private geographyService: GeographyService) {}

  // Zone queries
  @Query(() => [GeoZone], { name: 'geoZones' })
  findAllZones() {
    return this.geographyService.findAllZones();
  }

  @Query(() => GeoZone, { name: 'geoZone', nullable: true })
  findZoneById(@Args('id', { type: () => Int }) id: number) {
    return this.geographyService.findZoneById(id);
  }

  // City queries
  @Query(() => [GeoCity], { name: 'geoCities' })
  findAllCities() {
    return this.geographyService.findAllCities();
  }

  @Query(() => [GeoCity], { name: 'geoCitiesByZone' })
  findCitiesByZone(@Args('zoneId', { type: () => Int }) zoneId: number) {
    return this.geographyService.findCitiesByZone(zoneId);
  }

  @Query(() => GeoCity, { name: 'geoCity', nullable: true })
  findCityById(@Args('id', { type: () => Int }) id: number) {
    return this.geographyService.findCityById(id);
  }

  // Region queries
  @Query(() => [GeoRegion], { name: 'geoRegions' })
  findAllRegions() {
    return this.geographyService.findAllRegions();
  }

  @Query(() => [GeoRegion], { name: 'geoRegionsByCity' })
  findRegionsByCity(@Args('cityId', { type: () => Int }) cityId: number) {
    return this.geographyService.findRegionsByCity(cityId);
  }

  @Query(() => GeoRegion, { name: 'geoRegion', nullable: true })
  findRegionById(@Args('id', { type: () => Int }) id: number) {
    return this.geographyService.findRegionById(id);
  }

  // Zone mutations
  @Mutation(() => GeoZone)
  createGeoZone(
    @Args('name') name: string,
    @Args('nameEn') nameEn: string,
    @Args('code', { nullable: true }) code?: string,
    @Args('description', { nullable: true }) description?: string,
    @Args('descriptionEn', { nullable: true }) descriptionEn?: string,
    @Args('isActive', { nullable: true }) isActive?: boolean,
    @Args('sortOrder', { type: () => Int, nullable: true }) sortOrder?: number,
  ) {
    return this.geographyService.createZone({
      name,
      nameEn,
      code,
      description,
      descriptionEn,
      isActive,
      sortOrder,
    });
  }

  @Mutation(() => GeoZone)
  updateGeoZone(
    @Args('id', { type: () => Int }) id: number,
    @Args('name', { nullable: true }) name?: string,
    @Args('nameEn', { nullable: true }) nameEn?: string,
    @Args('code', { nullable: true }) code?: string,
    @Args('description', { nullable: true }) description?: string,
    @Args('descriptionEn', { nullable: true }) descriptionEn?: string,
    @Args('isActive', { nullable: true }) isActive?: boolean,
    @Args('sortOrder', { type: () => Int, nullable: true }) sortOrder?: number,
  ) {
    return this.geographyService.updateZone(id, {
      name,
      nameEn,
      code,
      description,
      descriptionEn,
      isActive,
      sortOrder,
    });
  }

  @Mutation(() => Boolean)
  async deleteGeoZone(@Args('id', { type: () => Int }) id: number) {
    await this.geographyService.deleteZone(id);
    return true;
  }

  // City mutations
  @Mutation(() => GeoCity)
  createGeoCity(
    @Args('zoneId', { type: () => Int }) zoneId: number,
    @Args('name') name: string,
    @Args('nameEn') nameEn: string,
    @Args('code', { nullable: true }) code?: string,
    @Args('description', { nullable: true }) description?: string,
    @Args('descriptionEn', { nullable: true }) descriptionEn?: string,
    @Args('isActive', { nullable: true }) isActive?: boolean,
    @Args('sortOrder', { type: () => Int, nullable: true }) sortOrder?: number,
  ) {
    return this.geographyService.createCity({
      zoneId,
      name,
      nameEn,
      code,
      description,
      descriptionEn,
      isActive,
      sortOrder,
    });
  }

  @Mutation(() => GeoCity)
  updateGeoCity(
    @Args('id', { type: () => Int }) id: number,
    @Args('zoneId', { type: () => Int, nullable: true }) zoneId?: number,
    @Args('name', { nullable: true }) name?: string,
    @Args('nameEn', { nullable: true }) nameEn?: string,
    @Args('code', { nullable: true }) code?: string,
    @Args('description', { nullable: true }) description?: string,
    @Args('descriptionEn', { nullable: true }) descriptionEn?: string,
    @Args('isActive', { nullable: true }) isActive?: boolean,
    @Args('sortOrder', { type: () => Int, nullable: true }) sortOrder?: number,
  ) {
    return this.geographyService.updateCity(id, {
      zoneId,
      name,
      nameEn,
      code,
      description,
      descriptionEn,
      isActive,
      sortOrder,
    });
  }

  @Mutation(() => Boolean)
  async deleteGeoCity(@Args('id', { type: () => Int }) id: number) {
    await this.geographyService.deleteCity(id);
    return true;
  }

  // Region mutations
  @Mutation(() => GeoRegion)
  createGeoRegion(
    @Args('cityId', { type: () => Int }) cityId: number,
    @Args('name') name: string,
    @Args('nameEn') nameEn: string,
    @Args('code', { nullable: true }) code?: string,
    @Args('description', { nullable: true }) description?: string,
    @Args('descriptionEn', { nullable: true }) descriptionEn?: string,
    @Args('isActive', { nullable: true }) isActive?: boolean,
    @Args('sortOrder', { type: () => Int, nullable: true }) sortOrder?: number,
  ) {
    return this.geographyService.createRegion({
      cityId,
      name,
      nameEn,
      code,
      description,
      descriptionEn,
      isActive,
      sortOrder,
    });
  }

  @Mutation(() => GeoRegion)
  updateGeoRegion(
    @Args('id', { type: () => Int }) id: number,
    @Args('cityId', { type: () => Int, nullable: true }) cityId?: number,
    @Args('name', { nullable: true }) name?: string,
    @Args('nameEn', { nullable: true }) nameEn?: string,
    @Args('code', { nullable: true }) code?: string,
    @Args('description', { nullable: true }) description?: string,
    @Args('descriptionEn', { nullable: true }) descriptionEn?: string,
    @Args('isActive', { nullable: true }) isActive?: boolean,
    @Args('sortOrder', { type: () => Int, nullable: true }) sortOrder?: number,
  ) {
    return this.geographyService.updateRegion(id, {
      cityId,
      name,
      nameEn,
      code,
      description,
      descriptionEn,
      isActive,
      sortOrder,
    });
  }

  @Mutation(() => Boolean)
  async deleteGeoRegion(@Args('id', { type: () => Int }) id: number) {
    await this.geographyService.deleteRegion(id);
    return true;
  }
}
