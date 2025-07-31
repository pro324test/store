import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Permission {
  @Field(() => Int)
  id: number;

  @Field()
  permissionKey: string;

  @Field()
  category: string;

  @Field()
  categoryEn: string;

  @Field(() => String, { nullable: true })
  description?: string | null;

  @Field(() => String, { nullable: true })
  descriptionEn?: string | null;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@ObjectType()
export class SystemStaffRole {
  @Field(() => Int)
  id: number;

  @Field()
  roleName: string;

  @Field()
  roleNameEn: string;

  @Field(() => String, { nullable: true })
  description?: string | null;

  @Field(() => String, { nullable: true })
  descriptionEn?: string | null;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  // Relations - use lazy loading to avoid circular reference
  @Field(() => [Permission], { nullable: true })
  permissions?: Permission[];

  @Field(() => [SystemStaffProfile], { nullable: true })
  staffProfiles?: SystemStaffProfile[];
}

@ObjectType()
export class SystemStaffProfile {
  @Field(() => Int)
  userId: number;

  @Field(() => Int)
  roleId: number;

  @Field(() => String, { nullable: true })
  employeeId?: string | null;

  @Field()
  joinedAt: Date;

  @Field(() => Date, { nullable: true })
  leftAt?: Date | null;

  @Field()
  isActive: boolean;

  // Relations
  @Field(() => SystemStaffRole, { nullable: true })
  role?: SystemStaffRole;
}

@ObjectType()
export class SystemStaffRolePermission {
  @Field(() => Int)
  roleId: number;

  @Field(() => Int)
  permissionId: number;

  @Field(() => SystemStaffRole)
  role: SystemStaffRole;

  @Field(() => Permission)
  permission: Permission;
}
