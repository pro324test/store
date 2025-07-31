import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GeographyService {
  constructor(private prisma: PrismaService) {}

  // Zones
  async findAllZones() {
    return this.prisma.geoZone.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      include: {
        cities: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' },
          include: {
            regions: {
              where: { isActive: true },
              orderBy: { sortOrder: 'asc' },
            },
          },
        },
      },
    });
  }

  async findZoneById(id: number) {
    return this.prisma.geoZone.findUnique({
      where: { id },
      include: {
        cities: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' },
          include: {
            regions: {
              where: { isActive: true },
              orderBy: { sortOrder: 'asc' },
            },
          },
        },
      },
    });
  }

  async createZone(data: {
    name: string;
    nameEn: string;
    code?: string;
    description?: string;
    descriptionEn?: string;
    isActive?: boolean;
    sortOrder?: number;
  }) {
    return this.prisma.geoZone.create({
      data: {
        name: data.name,
        nameEn: data.nameEn,
        code: data.code,
        description: data.description,
        descriptionEn: data.descriptionEn,
        isActive: data.isActive ?? true,
        sortOrder: data.sortOrder ?? 0,
      },
    });
  }

  async updateZone(
    id: number,
    data: {
      name?: string;
      nameEn?: string;
      code?: string;
      description?: string;
      descriptionEn?: string;
      isActive?: boolean;
      sortOrder?: number;
    },
  ) {
    return this.prisma.geoZone.update({
      where: { id },
      data,
    });
  }

  async deleteZone(id: number) {
    return this.prisma.geoZone.delete({
      where: { id },
    });
  }

  // Cities
  async findAllCities() {
    return this.prisma.geoCity.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      include: {
        zone: true,
        regions: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' },
        },
      },
    });
  }

  async findCitiesByZone(zoneId: number) {
    return this.prisma.geoCity.findMany({
      where: {
        zoneId,
        isActive: true,
      },
      orderBy: { sortOrder: 'asc' },
      include: {
        regions: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' },
        },
      },
    });
  }

  async findCityById(id: number) {
    return this.prisma.geoCity.findUnique({
      where: { id },
      include: {
        zone: true,
        regions: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' },
        },
      },
    });
  }

  async createCity(data: {
    zoneId: number;
    name: string;
    nameEn: string;
    code?: string;
    description?: string;
    descriptionEn?: string;
    isActive?: boolean;
    sortOrder?: number;
  }) {
    return this.prisma.geoCity.create({
      data: {
        zoneId: data.zoneId,
        name: data.name,
        nameEn: data.nameEn,
        code: data.code,
        description: data.description,
        descriptionEn: data.descriptionEn,
        isActive: data.isActive ?? true,
        sortOrder: data.sortOrder ?? 0,
      },
    });
  }

  async updateCity(
    id: number,
    data: {
      zoneId?: number;
      name?: string;
      nameEn?: string;
      code?: string;
      description?: string;
      descriptionEn?: string;
      isActive?: boolean;
      sortOrder?: number;
    },
  ) {
    return this.prisma.geoCity.update({
      where: { id },
      data,
    });
  }

  async deleteCity(id: number) {
    return this.prisma.geoCity.delete({
      where: { id },
    });
  }

  // Regions
  async findAllRegions() {
    return this.prisma.geoRegion.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      include: {
        city: {
          include: {
            zone: true,
          },
        },
      },
    });
  }

  async findRegionsByCity(cityId: number) {
    return this.prisma.geoRegion.findMany({
      where: {
        cityId,
        isActive: true,
      },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async findRegionById(id: number) {
    return this.prisma.geoRegion.findUnique({
      where: { id },
      include: {
        city: {
          include: {
            zone: true,
          },
        },
      },
    });
  }

  async createRegion(data: {
    cityId: number;
    name: string;
    nameEn: string;
    code?: string;
    description?: string;
    descriptionEn?: string;
    isActive?: boolean;
    sortOrder?: number;
  }) {
    return this.prisma.geoRegion.create({
      data: {
        cityId: data.cityId,
        name: data.name,
        nameEn: data.nameEn,
        code: data.code,
        description: data.description,
        descriptionEn: data.descriptionEn,
        isActive: data.isActive ?? true,
        sortOrder: data.sortOrder ?? 0,
      },
    });
  }

  async updateRegion(
    id: number,
    data: {
      cityId?: number;
      name?: string;
      nameEn?: string;
      code?: string;
      description?: string;
      descriptionEn?: string;
      isActive?: boolean;
      sortOrder?: number;
    },
  ) {
    return this.prisma.geoRegion.update({
      where: { id },
      data,
    });
  }

  async deleteRegion(id: number) {
    return this.prisma.geoRegion.delete({
      where: { id },
    });
  }
}
