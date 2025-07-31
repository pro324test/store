import { Module } from '@nestjs/common';
import { GeographyService } from './geography.service';
import { GeographyResolver } from './geography.resolver';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [GeographyService, GeographyResolver],
  exports: [GeographyService],
})
export class GeographyModule {}
