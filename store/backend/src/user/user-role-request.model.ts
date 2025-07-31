import { ObjectType, Field, Int, registerEnumType } from '@nestjs/graphql';
import { GraphQLJSON } from 'graphql-type-json';

// Register UserRole enum for GraphQL
export enum UserRole {
  SYSTEM_STAFF = 'SYSTEM_STAFF',
  CUSTOMER = 'CUSTOMER',
  VENDOR = 'VENDOR',
  DELIVERY_PERSON = 'DELIVERY_PERSON',
}

registerEnumType(UserRole, {
  name: 'UserRole',
});

// Register UserRoleRequestStatus enum for GraphQL
export enum UserRoleRequestStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

registerEnumType(UserRoleRequestStatus, {
  name: 'UserRoleRequestStatus',
});

@ObjectType()
export class UserRoleRequest {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  userId: number;

  @Field(() => UserRole)
  requestedRole: UserRole;

  @Field(() => UserRoleRequestStatus)
  status: UserRoleRequestStatus;

  @Field(() => GraphQLJSON)
  submissionData: any;

  @Field(() => String, { nullable: true })
  adminNotes?: string | null;

  @Field(() => String, { nullable: true })
  rejectionReason?: string | null;

  @Field()
  submittedAt: Date;

  @Field(() => Date, { nullable: true })
  processedAt?: Date | null;

  @Field(() => Int, { nullable: true })
  processedById?: number | null;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  // Relations - removed User references to avoid circular dependency
  // These will be resolved in the resolver using field resolvers if needed
}

// Input type for creating role requests
@ObjectType()
export class CreateUserRoleRequestInput {
  @Field(() => UserRole)
  requestedRole: UserRole;

  @Field(() => GraphQLJSON)
  submissionData: any;
}

// Input type for processing role requests
@ObjectType()
export class ProcessUserRoleRequestInput {
  @Field(() => UserRoleRequestStatus)
  status: UserRoleRequestStatus;

  @Field(() => String, { nullable: true })
  adminNotes?: string;

  @Field(() => String, { nullable: true })
  rejectionReason?: string;
}