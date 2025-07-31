import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { AdminService } from './admin.service';
import {
  SystemStaffProfile,
  SystemStaffRole,
  Permission,
  SystemStaffRolePermission,
} from './admin.model';

@Resolver(() => SystemStaffProfile)
export class AdminResolver {
  constructor(private adminService: AdminService) {}

  // ==================== SystemStaffProfile Resolvers ====================

  @Query(() => [SystemStaffProfile], { name: 'systemStaffProfiles' })
  findAllStaffProfiles() {
    return this.adminService.findAllStaffProfiles();
  }

  @Query(() => SystemStaffProfile, {
    name: 'systemStaffProfile',
    nullable: true,
  })
  findStaffProfile(@Args('userId', { type: () => Int }) userId: number) {
    return this.adminService.findStaffProfile(userId);
  }

  @Mutation(() => SystemStaffProfile)
  createSystemStaffProfile(
    @Args('userId', { type: () => Int }) userId: number,
    @Args('roleId', { type: () => Int }) roleId: number,
    @Args('employeeId', { nullable: true }) employeeId?: string,
  ) {
    return this.adminService.createStaffProfile({
      userId,
      roleId,
      employeeId,
    });
  }

  @Mutation(() => SystemStaffProfile)
  updateSystemStaffProfile(
    @Args('userId', { type: () => Int }) userId: number,
    @Args('roleId', { type: () => Int, nullable: true }) roleId?: number,
    @Args('employeeId', { nullable: true }) employeeId?: string,
    @Args('isActive', { nullable: true }) isActive?: boolean,
    @Args('leftAt', { nullable: true }) leftAt?: Date,
  ) {
    return this.adminService.updateStaffProfile(userId, {
      roleId,
      employeeId,
      isActive,
      leftAt,
    });
  }

  @Mutation(() => Boolean)
  deleteSystemStaffProfile(
    @Args('userId', { type: () => Int }) userId: number,
  ) {
    return this.adminService.deleteStaffProfile(userId);
  }

  // ==================== SystemStaffRole Resolvers ====================

  @Query(() => [SystemStaffRole], { name: 'systemStaffRoles' })
  findAllRoles() {
    return this.adminService.findAllRoles();
  }

  @Query(() => SystemStaffRole, { name: 'systemStaffRole', nullable: true })
  findRole(@Args('id', { type: () => Int }) id: number) {
    return this.adminService.findRole(id);
  }

  @Mutation(() => SystemStaffRole)
  createSystemStaffRole(
    @Args('roleName') roleName: string,
    @Args('roleNameEn') roleNameEn: string,
    @Args('description', { nullable: true }) description?: string,
    @Args('descriptionEn', { nullable: true }) descriptionEn?: string,
  ) {
    return this.adminService.createRole({
      roleName,
      roleNameEn,
      description,
      descriptionEn,
    });
  }

  @Mutation(() => SystemStaffRole)
  updateSystemStaffRole(
    @Args('id', { type: () => Int }) id: number,
    @Args('roleName', { nullable: true }) roleName?: string,
    @Args('roleNameEn', { nullable: true }) roleNameEn?: string,
    @Args('description', { nullable: true }) description?: string,
    @Args('descriptionEn', { nullable: true }) descriptionEn?: string,
  ) {
    return this.adminService.updateRole(id, {
      roleName,
      roleNameEn,
      description,
      descriptionEn,
    });
  }

  @Mutation(() => Boolean)
  deleteSystemStaffRole(@Args('id', { type: () => Int }) id: number) {
    return this.adminService.deleteRole(id);
  }

  // ==================== Permission Resolvers ====================

  @Query(() => [Permission], { name: 'permissions' })
  findAllPermissions() {
    return this.adminService.findAllPermissions();
  }

  @Query(() => [Permission], { name: 'permissionsByCategory' })
  findPermissionsByCategory(@Args('category') category: string) {
    return this.adminService.findPermissionsByCategory(category);
  }

  @Query(() => Permission, { name: 'permission', nullable: true })
  findPermission(@Args('id', { type: () => Int }) id: number) {
    return this.adminService.findPermission(id);
  }

  @Mutation(() => Permission)
  createPermission(
    @Args('permissionKey') permissionKey: string,
    @Args('category') category: string,
    @Args('categoryEn') categoryEn: string,
    @Args('description', { nullable: true }) description?: string,
    @Args('descriptionEn', { nullable: true }) descriptionEn?: string,
  ) {
    return this.adminService.createPermission({
      permissionKey,
      category,
      categoryEn,
      description,
      descriptionEn,
    });
  }

  @Mutation(() => Permission)
  updatePermission(
    @Args('id', { type: () => Int }) id: number,
    @Args('permissionKey', { nullable: true }) permissionKey?: string,
    @Args('category', { nullable: true }) category?: string,
    @Args('categoryEn', { nullable: true }) categoryEn?: string,
    @Args('description', { nullable: true }) description?: string,
    @Args('descriptionEn', { nullable: true }) descriptionEn?: string,
  ) {
    return this.adminService.updatePermission(id, {
      permissionKey,
      category,
      categoryEn,
      description,
      descriptionEn,
    });
  }

  @Mutation(() => Boolean)
  deletePermission(@Args('id', { type: () => Int }) id: number) {
    return this.adminService.deletePermission(id);
  }

  // ==================== Role-Permission Assignment Resolvers ====================

  @Mutation(() => SystemStaffRolePermission)
  assignPermissionToRole(
    @Args('roleId', { type: () => Int }) roleId: number,
    @Args('permissionId', { type: () => Int }) permissionId: number,
  ) {
    return this.adminService.assignPermissionToRole(roleId, permissionId);
  }

  @Mutation(() => Boolean)
  removePermissionFromRole(
    @Args('roleId', { type: () => Int }) roleId: number,
    @Args('permissionId', { type: () => Int }) permissionId: number,
  ) {
    return this.adminService.removePermissionFromRole(roleId, permissionId);
  }

  @Mutation(() => Boolean)
  assignMultiplePermissionsToRole(
    @Args('roleId', { type: () => Int }) roleId: number,
    @Args('permissionIds', { type: () => [Int] }) permissionIds: number[],
  ) {
    return this.adminService.assignMultiplePermissionsToRole(
      roleId,
      permissionIds,
    );
  }

  @Query(() => [SystemStaffRolePermission], { name: 'rolePermissions' })
  getRolePermissions(@Args('roleId', { type: () => Int }) roleId: number) {
    return this.adminService.getRolePermissions(roleId);
  }

  @Query(() => [Permission], { name: 'permissionCategories' })
  getAllCategories() {
    return this.adminService.getAllCategories();
  }
}
