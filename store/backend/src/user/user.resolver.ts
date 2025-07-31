import { Resolver, Query, Mutation, Args, Int, InputType, Field } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User, UserRoleAssignment } from './user.model';

@InputType()
export class UpdateProfileInput {
  @Field({ nullable: true })
  fullName?: string;

  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  phoneNumber?: string;
}

@Resolver(() => User)
export class UserResolver {
  constructor(private userService: UserService) {}

  @Query(() => [User], { name: 'users' })
  findAll() {
    return this.userService.findAll();
  }

  @Query(() => User, { name: 'user', nullable: true })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.userService.findOne(id);
  }

  @Query(() => User, { name: 'userByPhone', nullable: true })
  findByPhone(@Args('phoneNumber') phoneNumber: string) {
    return this.userService.findByPhoneNumber(phoneNumber);
  }

  @Mutation(() => User)
  createUser(
    @Args('fullName') fullName: string,
    @Args('phoneNumber') phoneNumber: string,
    @Args('email', { nullable: true }) email?: string,
  ) {
    return this.userService.create({
      fullName,
      phoneNumber,
      email,
      passwordHash: '$2b$12$defaulthashedpassword', // This should be properly hashed in real implementation
    });
  }

  @Mutation(() => User)
  updateUser(
    @Args('id', { type: () => Int }) id: number,
    @Args('fullName', { nullable: true }) fullName?: string,
    @Args('phoneNumber', { nullable: true }) phoneNumber?: string,
    @Args('email', { nullable: true }) email?: string,
  ) {
    return this.userService.update(id, {
      fullName,
      phoneNumber,
      email,
    });
  }

  @Mutation(() => User)
  toggleUserStatus(@Args('id', { type: () => Int }) id: number) {
    return this.userService.toggleStatus(id);
  }

  @Mutation(() => UserRoleAssignment)
  assignUserRole(
    @Args('userId', { type: () => Int }) userId: number,
    @Args('role') role: string,
    @Args('isPrimary', { defaultValue: false }) isPrimary: boolean,
    @Args('changedById', { type: () => Int, nullable: true }) changedById?: number,
  ) {
    return this.userService.assignRole(userId, role, isPrimary, changedById);
  }

  @Mutation(() => Boolean)
  removeUserRole(
    @Args('userId', { type: () => Int }) userId: number,
    @Args('role') role: string,
    @Args('changedById', { type: () => Int, nullable: true }) changedById?: number,
  ) {
    return this.userService.removeRole(userId, role, changedById);
  }

  @Mutation(() => UserRoleAssignment)
  updateUserRole(
    @Args('userId', { type: () => Int }) userId: number,
    @Args('role') role: string,
    @Args('isActive', { nullable: true }) isActive?: boolean,
    @Args('isPrimary', { nullable: true }) isPrimary?: boolean,
    @Args('changedById', { type: () => Int, nullable: true }) changedById?: number,
  ) {
    return this.userService.updateRole(userId, role, { isActive, isPrimary }, changedById);
  }

  @Mutation(() => Boolean)
  deleteUser(@Args('id', { type: () => Int }) id: number) {
    return this.userService.delete(id);
  }

  // Profile-specific operations
  @Query(() => User, { name: 'profile', nullable: true })
  getProfile(@Args('userId', { type: () => Int }) userId: number) {
    return this.userService.findOne(userId);
  }

  @Mutation(() => User, { name: 'updateProfile' })
  updateProfile(
    @Args('userId', { type: () => Int }) userId: number,
    @Args('input') input: UpdateProfileInput,
  ) {
    return this.userService.update(userId, input);
  }
}
