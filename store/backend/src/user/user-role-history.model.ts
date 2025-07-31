import { ObjectType, Field, Int, registerEnumType } from '@nestjs/graphql';
import { UserRole } from './user-role-request.model';

// Register UserRoleHistoryAction enum for GraphQL
export enum UserRoleHistoryAction {
  ASSIGNED = 'ASSIGNED',
  REVOKED = 'REVOKED',
  PRIMARY_CHANGED = 'PRIMARY_CHANGED',
}

registerEnumType(UserRoleHistoryAction, {
  name: 'UserRoleHistoryAction',
});

// Export UserRole for use in other files
export { UserRole };

@ObjectType()
export class UserRoleHistoryItem {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  userId: number;

  @Field(() => UserRole)
  role: UserRole;

  @Field(() => UserRoleHistoryAction)
  action: UserRoleHistoryAction;

  @Field()
  changedAt: Date;

  @Field(() => Int)
  changedById: number;

  @Field(() => String, { nullable: true })
  reason?: string | null;

  @Field(() => Int, { nullable: true })
  profileId?: number | null;

  // Relations - removed User references to avoid circular dependency
  // These will be resolved in the resolver using field resolvers if needed
}

// Input type for creating role history entries
@ObjectType()
export class CreateUserRoleHistoryInput {
  @Field(() => Int)
  userId: number;

  @Field(() => UserRole)
  role: UserRole;

  @Field(() => UserRoleHistoryAction)
  action: UserRoleHistoryAction;

  @Field(() => String, { nullable: true })
  reason?: string;

  @Field(() => Int, { nullable: true })
  profileId?: number;
}