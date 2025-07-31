import { gql } from '@apollo/client';

// User queries
export const GET_ALL_USERS = gql`
  query GetAllUsers {
    users {
      id
      fullName
      phoneNumber
      email
      isActive
      createdAt
      updatedAt
      roles {
        id
        role
        isActive
        isPrimary
        assignedAt
      }
    }
  }
`;

export const GET_USER_BY_ID = gql`
  query GetUserById($id: Int!) {
    user(id: $id) {
      id
      fullName
      phoneNumber
      email
      isActive
      createdAt
      updatedAt
      roles {
        id
        role
        isActive
        isPrimary
        assignedAt
      }
    }
  }
`;

// Staff profile queries
export const GET_ALL_STAFF_PROFILES = gql`
  query GetAllStaffProfiles {
    systemStaffProfiles {
      userId
      roleId
      employeeId
      joinedAt
      leftAt
      isActive
      role {
        id
        roleName
        roleNameEn
        description
        descriptionEn
        permissions {
          id
          permissionKey
          category
          categoryEn
          description
          descriptionEn
        }
      }
      user {
        id
        fullName
        phoneNumber
        email
        isActive
      }
    }
  }
`;

export const GET_STAFF_PROFILE = gql`
  query GetStaffProfile($userId: Int!) {
    systemStaffProfile(userId: $userId) {
      userId
      roleId
      employeeId
      joinedAt
      leftAt
      isActive
      role {
        id
        roleName
        roleNameEn
        description
        descriptionEn
        permissions {
          id
          permissionKey
          category
          categoryEn
          description
          descriptionEn
        }
      }
      user {
        id
        fullName
        phoneNumber
        email
        isActive
      }
    }
  }
`;

// Role queries
export const GET_ALL_ROLES = gql`
  query GetAllRoles {
    systemStaffRoles {
      id
      roleName
      roleNameEn
      description
      descriptionEn
      createdAt
      updatedAt
      permissions {
        id
        permissionKey
        category
        categoryEn
        description
        descriptionEn
      }
      staffProfiles {
        userId
        user {
          id
          fullName
          phoneNumber
          email
        }
      }
    }
  }
`;

export const GET_ROLE_BY_ID = gql`
  query GetRoleById($id: Int!) {
    systemStaffRole(id: $id) {
      id
      roleName
      roleNameEn
      description
      descriptionEn
      createdAt
      updatedAt
      permissions {
        id
        permissionKey
        category
        categoryEn
        description
        descriptionEn
      }
      staffProfiles {
        userId
        user {
          id
          fullName
          phoneNumber
          email
        }
      }
    }
  }
`;

// Permission queries
export const GET_ALL_PERMISSIONS = gql`
  query GetAllPermissions {
    permissions {
      id
      permissionKey
      category
      categoryEn
      description
      descriptionEn
      createdAt
      updatedAt
    }
  }
`;

export const GET_PERMISSIONS_BY_CATEGORY = gql`
  query GetPermissionsByCategory($category: String!) {
    permissionsByCategory(category: $category) {
      id
      permissionKey
      category
      categoryEn
      description
      descriptionEn
      createdAt
      updatedAt
    }
  }
`;

// User mutations
export const CREATE_USER = gql`
  mutation CreateUser($fullName: String!, $phoneNumber: String!, $email: String) {
    createUser(fullName: $fullName, phoneNumber: $phoneNumber, email: $email) {
      id
      fullName
      phoneNumber
      email
      isActive
      createdAt
    }
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser($id: Int!, $fullName: String, $phoneNumber: String, $email: String) {
    updateUser(id: $id, fullName: $fullName, phoneNumber: $phoneNumber, email: $email) {
      id
      fullName
      phoneNumber
      email
      isActive
      updatedAt
    }
  }
`;

export const TOGGLE_USER_STATUS = gql`
  mutation ToggleUserStatus($id: Int!) {
    toggleUserStatus(id: $id) {
      id
      isActive
      updatedAt
    }
  }
`;

export const DELETE_USER = gql`
  mutation DeleteUser($id: Int!) {
    deleteUser(id: $id)
  }
`;

// Staff profile mutations
export const CREATE_STAFF_PROFILE = gql`
  mutation CreateStaffProfile($userId: Int!, $roleId: Int!, $employeeId: String) {
    createSystemStaffProfile(userId: $userId, roleId: $roleId, employeeId: $employeeId) {
      userId
      roleId
      employeeId
      joinedAt
      isActive
      role {
        id
        roleName
        roleNameEn
      }
    }
  }
`;

export const UPDATE_STAFF_PROFILE = gql`
  mutation UpdateStaffProfile($userId: Int!, $roleId: Int, $employeeId: String, $isActive: Boolean, $leftAt: DateTime) {
    updateSystemStaffProfile(userId: $userId, roleId: $roleId, employeeId: $employeeId, isActive: $isActive, leftAt: $leftAt) {
      userId
      roleId
      employeeId
      joinedAt
      leftAt
      isActive
      role {
        id
        roleName
        roleNameEn
      }
    }
  }
`;

export const DELETE_STAFF_PROFILE = gql`
  mutation DeleteStaffProfile($userId: Int!) {
    deleteSystemStaffProfile(userId: $userId)
  }
`;

// Role mutations
export const CREATE_ROLE = gql`
  mutation CreateRole($roleName: String!, $roleNameEn: String!, $description: String, $descriptionEn: String) {
    createSystemStaffRole(roleName: $roleName, roleNameEn: $roleNameEn, description: $description, descriptionEn: $descriptionEn) {
      id
      roleName
      roleNameEn
      description
      descriptionEn
      createdAt
    }
  }
`;

export const UPDATE_ROLE = gql`
  mutation UpdateRole($id: Int!, $roleName: String, $roleNameEn: String, $description: String, $descriptionEn: String) {
    updateSystemStaffRole(id: $id, roleName: $roleName, roleNameEn: $roleNameEn, description: $description, descriptionEn: $descriptionEn) {
      id
      roleName
      roleNameEn
      description
      descriptionEn
      updatedAt
    }
  }
`;

export const DELETE_ROLE = gql`
  mutation DeleteRole($id: Int!) {
    deleteSystemStaffRole(id: $id)
  }
`;

// Role assignment mutations
export const ASSIGN_USER_ROLE = gql`
  mutation AssignUserRole($userId: Int!, $role: String!, $isPrimary: Boolean, $changedById: Int) {
    assignUserRole(userId: $userId, role: $role, isPrimary: $isPrimary, changedById: $changedById) {
      id
      role
      isActive
      isPrimary
      assignedAt
    }
  }
`;

export const REMOVE_USER_ROLE = gql`
  mutation RemoveUserRole($userId: Int!, $role: String!, $changedById: Int) {
    removeUserRole(userId: $userId, role: $role, changedById: $changedById)
  }
`;

export const UPDATE_USER_ROLE = gql`
  mutation UpdateUserRole($userId: Int!, $role: String!, $isActive: Boolean, $isPrimary: Boolean, $changedById: Int) {
    updateUserRole(userId: $userId, role: $role, isActive: $isActive, isPrimary: $isPrimary, changedById: $changedById) {
      id
      role
      isActive
      isPrimary
      assignedAt
    }
  }
`;

// Dashboard statistics
export const GET_DASHBOARD_STATS = gql`
  query GetDashboardStats {
    dashboardStats {
      totalUsers
      totalProducts
      totalOrders
      totalVendors
      activeUsersCount
      pendingOrdersCount
      userGrowth
      productGrowth
      orderGrowth
      systemHealth {
        status
        message
        details
      }
      recentActivity {
        id
        type
        description
        storeName
        amount
        createdAt
        status
      }
    }
  }
`;