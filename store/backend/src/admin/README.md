# Admin Module

This module provides comprehensive System Admin functionality for managing staff profiles, roles, and permissions.

## Features

### SystemStaffProfile Management
- Create, update, delete staff profiles
- Link staff to roles with employee IDs
- Track join/leave dates and active status

### SystemStaffRole Management  
- Create, update, delete system staff roles
- Multilingual support (Arabic/English)
- Role descriptions and metadata

### Permission Management
- Create, update, delete permissions
- Categorize permissions for organization
- Multilingual descriptions

### Role-Permission Assignment
- Assign/remove permissions to/from roles
- Bulk permission assignments
- Query role permissions

## GraphQL Operations

### Queries

```graphql
# Get all staff profiles
query {
  systemStaffProfiles {
    userId
    employeeId
    isActive
    role {
      roleName
      permissions {
        permissionKey
        category
      }
    }
  }
}

# Get all roles with permissions
query {
  systemStaffRoles {
    id
    roleName
    roleNameEn
    permissions {
      id
      permissionKey
      category
    }
  }
}

# Get all permissions
query {
  permissions {
    id
    permissionKey
    category
    description
  }
}

# Get permissions by category
query {
  permissionsByCategory(category: "User Management") {
    id
    permissionKey
    description
  }
}
```

### Mutations

```graphql
# Create a permission
mutation {
  createPermission(
    permissionKey: "user.create"
    category: "User Management"
    categoryEn: "User Management"
    description: "إنشاء مستخدم جديد"
    descriptionEn: "Create new user"
  ) {
    id
    permissionKey
    category
  }
}

# Create a role
mutation {
  createSystemStaffRole(
    roleName: "مدير النظام"
    roleNameEn: "System Administrator"
    description: "مدير النظام الرئيسي"
    descriptionEn: "Main system administrator"
  ) {
    id
    roleName
    roleNameEn
  }
}

# Create staff profile
mutation {
  createSystemStaffProfile(
    userId: 1
    roleId: 1
    employeeId: "EMP001"
  ) {
    userId
    employeeId
    isActive
    role {
      roleName
    }
  }
}

# Assign permission to role
mutation {
  assignPermissionToRole(roleId: 1, permissionId: 1) {
    roleId
    permissionId
  }
}

# Assign multiple permissions to role
mutation {
  assignMultiplePermissionsToRole(roleId: 1, permissionIds: [1, 2, 3])
}
```

## Database Relations

The module uses the existing Prisma schema models:
- `SystemStaffProfile` - Staff member profiles
- `SystemStaffRole` - System roles 
- `Permission` - Individual permissions
- `SystemStaffRolePermission` - Role-permission associations

## Testing

The module includes comprehensive unit tests for all service methods. Run tests with:

```bash
npm test -- --testPathPattern=admin.service.spec.ts
```