import { Resolver, Query, Mutation, Args, Int, InputType, Field } from '@nestjs/graphql';
import { UserRoleRequestService } from './user-role-request.service';
import { UserRoleHistoryService } from './user-role-history.service';
import { 
  UserRoleRequest, 
  UserRole, 
  UserRoleRequestStatus 
} from './user-role-request.model';
import { GraphQLJSON } from 'graphql-type-json';

// Input types for GraphQL
@InputType()
export class CreateUserRoleRequestInput {
  @Field(() => UserRole)
  requestedRole: UserRole;

  @Field(() => GraphQLJSON)
  submissionData: any;
}

@InputType()
export class ProcessUserRoleRequestInput {
  @Field(() => UserRoleRequestStatus)
  status: UserRoleRequestStatus;

  @Field(() => String, { nullable: true })
  adminNotes?: string;

  @Field(() => String, { nullable: true })
  rejectionReason?: string;
}

@Resolver(() => UserRoleRequest)
export class UserRoleRequestResolver {
  constructor(
    private userRoleRequestService: UserRoleRequestService,
    private userRoleHistoryService: UserRoleHistoryService,
  ) {}

  @Query(() => [UserRoleRequest], { name: 'userRoleRequests' })
  findAll(
    @Args('userId', { type: () => Int, nullable: true }) userId?: number,
    @Args('status', { type: () => UserRoleRequestStatus, nullable: true }) status?: UserRoleRequestStatus,
    @Args('requestedRole', { type: () => UserRole, nullable: true }) requestedRole?: UserRole,
  ) {
    return this.userRoleRequestService.findAll({
      userId,
      status,
      requestedRole,
    });
  }

  @Query(() => UserRoleRequest, { name: 'userRoleRequest', nullable: true })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.userRoleRequestService.findOne(id);
  }

  @Query(() => [UserRoleRequest], { name: 'pendingRoleRequests' })
  findPendingRequests() {
    return this.userRoleRequestService.getPendingRequests();
  }

  @Query(() => [UserRoleRequest], { name: 'userRoleRequestsByUser' })
  findUserRequests(@Args('userId', { type: () => Int }) userId: number) {
    return this.userRoleRequestService.getUserRequests(userId);
  }

  @Mutation(() => UserRoleRequest)
  createUserRoleRequest(
    @Args('userId', { type: () => Int }) userId: number,
    @Args('input') input: CreateUserRoleRequestInput,
  ) {
    return this.userRoleRequestService.create({
      userId,
      requestedRole: input.requestedRole,
      submissionData: input.submissionData,
    });
  }

  @Mutation(() => UserRoleRequest)
  async approveUserRoleRequest(
    @Args('id', { type: () => Int }) id: number,
    @Args('processedById', { type: () => Int }) processedById: number,
    @Args('adminNotes', { nullable: true }) adminNotes?: string,
  ) {
    const result = await this.userRoleRequestService.approve(id, processedById, adminNotes);
    
    // Log the role assignment in history
    await this.userRoleHistoryService.logRoleAssignment(
      result.userId,
      result.requestedRole as UserRole,
      processedById,
      `Role assigned via approved request #${id}${adminNotes ? `: ${adminNotes}` : ''}`,
    );

    return result;
  }

  @Mutation(() => UserRoleRequest)
  async rejectUserRoleRequest(
    @Args('id', { type: () => Int }) id: number,
    @Args('processedById', { type: () => Int }) processedById: number,
    @Args('rejectionReason') rejectionReason: string,
    @Args('adminNotes', { nullable: true }) adminNotes?: string,
  ) {
    return this.userRoleRequestService.reject(id, processedById, rejectionReason, adminNotes);
  }

  @Mutation(() => Boolean)
  cancelUserRoleRequest(
    @Args('id', { type: () => Int }) id: number,
    @Args('userId', { type: () => Int }) userId: number,
  ) {
    return this.userRoleRequestService.cancel(id, userId);
  }
}