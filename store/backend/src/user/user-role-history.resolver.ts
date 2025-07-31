import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { UserRoleHistoryService } from './user-role-history.service';
import { 
  UserRoleHistoryItem, 
  UserRole, 
  UserRoleHistoryAction 
} from './user-role-history.model';

@Resolver(() => UserRoleHistoryItem)
export class UserRoleHistoryResolver {
  constructor(private userRoleHistoryService: UserRoleHistoryService) {}

  @Query(() => [UserRoleHistoryItem], { name: 'userRoleHistory' })
  findAll(
    @Args('userId', { type: () => Int, nullable: true }) userId?: number,
    @Args('role', { type: () => UserRole, nullable: true }) role?: UserRole,
    @Args('action', { type: () => UserRoleHistoryAction, nullable: true }) action?: UserRoleHistoryAction,
    @Args('changedById', { type: () => Int, nullable: true }) changedById?: number,
  ) {
    return this.userRoleHistoryService.findAll({
      userId,
      role,
      action,
      changedById,
    });
  }

  @Query(() => UserRoleHistoryItem, { name: 'userRoleHistoryItem', nullable: true })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.userRoleHistoryService.findOne(id);
  }

  @Query(() => [UserRoleHistoryItem], { name: 'userRoleHistoryByUser' })
  findUserHistory(@Args('userId', { type: () => Int }) userId: number) {
    return this.userRoleHistoryService.getUserRoleHistory(userId);
  }

  @Query(() => [UserRoleHistoryItem], { name: 'roleHistoryByRole' })
  findRoleHistory(@Args('role', { type: () => UserRole }) role: UserRole) {
    return this.userRoleHistoryService.getRoleHistory(role);
  }

  @Query(() => [UserRoleHistoryItem], { name: 'roleChangesBy' })
  findChangesBy(@Args('changedById', { type: () => Int }) changedById: number) {
    return this.userRoleHistoryService.getChangesBy(changedById);
  }
}