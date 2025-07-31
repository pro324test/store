import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class UserRoleAssignment {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  userId: number;

  @Field()
  role: string;

  @Field()
  isActive: boolean;

  @Field()
  isPrimary: boolean;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@ObjectType()
export class User {
  @Field(() => Int)
  id: number;

  @Field(() => String, { nullable: true })
  email?: string | null;

  @Field()
  phoneNumber: string;

  @Field()
  fullName: string;

  @Field()
  isActive: boolean;

  @Field(() => Date, { nullable: true })
  lastLoginAt?: Date | null;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => [UserRoleAssignment])
  roles: UserRoleAssignment[];

  // Don't expose password hash in GraphQL
  // passwordHash: string;
}
