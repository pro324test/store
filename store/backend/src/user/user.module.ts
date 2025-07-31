import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { UserRoleRequestService } from './user-role-request.service';
import { UserRoleHistoryService } from './user-role-history.service';
import { UserRoleRequestResolver } from './user-role-request.resolver';
import { UserRoleHistoryResolver } from './user-role-history.resolver';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [
    UserService,
    UserResolver,
    UserRoleRequestService,
    UserRoleHistoryService,
    UserRoleRequestResolver,
    UserRoleHistoryResolver,
  ],
  exports: [
    UserService,
    UserRoleRequestService,
    UserRoleHistoryService,
  ],
})
export class UserModule {}
