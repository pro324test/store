# User Role Management Module - GraphQL API Documentation

This document provides examples of how to use the newly implemented User Role Management GraphQL API.

## Enums

### UserRole
- `SYSTEM_STAFF`
- `CUSTOMER` 
- `VENDOR`
- `DELIVERY_PERSON`

### UserRoleRequestStatus
- `PENDING`
- `APPROVED`
- `REJECTED`

### UserRoleHistoryAction
- `ASSIGNED`
- `REVOKED`
- `PRIMARY_CHANGED`

## User Role Requests

### Create a Role Request
```graphql
mutation CreateRoleRequest {
  createUserRoleRequest(
    userId: 1
    input: {
      requestedRole: VENDOR
      submissionData: {
        businessName: "My Store"
        businessAddress: "123 Main St"
        businessType: "Electronics"
        businessLicense: "LIC123456"
      }
    }
  ) {
    id
    userId
    requestedRole
    status
    submissionData
    submittedAt
    user {
      id
      fullName
      phoneNumber
    }
  }
}
```

### Get All Role Requests
```graphql
query GetRoleRequests {
  userRoleRequests {
    id
    userId
    requestedRole
    status
    submittedAt
    processedAt
    user {
      fullName
      phoneNumber
    }
    processedBy {
      fullName
    }
  }
}
```

### Get Pending Requests (for admin review)
```graphql
query GetPendingRequests {
  pendingRoleRequests {
    id
    userId
    requestedRole
    submissionData
    submittedAt
    user {
      fullName
      phoneNumber
      email
    }
  }
}
```

### Approve a Role Request
```graphql
mutation ApproveRequest {
  approveUserRoleRequest(
    id: 1
    processedById: 2
    adminNotes: "Business documents verified. Approved for vendor status."
  ) {
    id
    status
    processedAt
    adminNotes
    user {
      fullName
    }
    processedBy {
      fullName
    }
  }
}
```

### Reject a Role Request
```graphql
mutation RejectRequest {
  rejectUserRoleRequest(
    id: 1
    processedById: 2
    rejectionReason: "Incomplete business documentation"
    adminNotes: "Missing business license and tax registration"
  ) {
    id
    status
    rejectionReason
    adminNotes
    processedAt
  }
}
```

### Get User's Requests
```graphql
query GetUserRequests {
  userRoleRequestsByUser(userId: 1) {
    id
    requestedRole
    status
    submittedAt
    processedAt
    rejectionReason
    adminNotes
  }
}
```

## User Role History

### Get Role History for a User
```graphql
query GetUserRoleHistory {
  userRoleHistoryByUser(userId: 1) {
    id
    role
    action
    changedAt
    reason
    user {
      fullName
    }
    changedBy {
      fullName
    }
  }
}
```

### Get All Role History (with filters)
```graphql
query GetRoleHistory {
  userRoleHistory(
    role: VENDOR
    action: ASSIGNED
  ) {
    id
    userId
    role
    action
    changedAt
    reason
    user {
      fullName
      phoneNumber
    }
    changedBy {
      fullName
    }
  }
}
```

### Get Changes Made by Admin
```graphql
query GetAdminChanges {
  roleChangesBy(changedById: 2) {
    id
    userId
    role
    action
    changedAt
    reason
    user {
      fullName
    }
  }
}
```

## Enhanced User Role Management

### Assign Role with History Tracking
```graphql
mutation AssignRole {
  assignUserRole(
    userId: 1
    role: "VENDOR"
    isPrimary: true
    changedById: 2
  ) {
    id
    userId
    role
    isActive
    isPrimary
  }
}
```

### Remove Role with History Tracking
```graphql
mutation RemoveRole {
  removeUserRole(
    userId: 1
    role: "VENDOR"
    changedById: 2
  )
}
```

### Update Role Status with History Tracking
```graphql
mutation UpdateRole {
  updateUserRole(
    userId: 1
    role: "VENDOR"
    isActive: true
    isPrimary: true
    changedById: 2
  ) {
    id
    userId
    role
    isActive
    isPrimary
  }
}
```

## Workflow Example

### Complete Vendor Application Workflow

1. **User submits vendor request:**
```graphql
mutation {
  createUserRoleRequest(
    userId: 1
    input: {
      requestedRole: VENDOR
      submissionData: {
        businessName: "Tech Solutions LLC"
        businessAddress: "456 Commerce St"
        businessType: "Technology Services"
        businessLicense: "BL789012"
        taxId: "TAX345678"
        contactEmail: "business@techsolutions.com"
        yearsInBusiness: 5
      }
    }
  ) {
    id
    status
  }
}
```

2. **Admin reviews and approves:**
```graphql
mutation {
  approveUserRoleRequest(
    id: 1
    processedById: 2
    adminNotes: "All documentation verified. Business license valid. Approved for vendor access."
  ) {
    id
    status
    user {
      roles {
        role
        isActive
        isPrimary
      }
    }
  }
}
```

3. **Check role history:**
```graphql
query {
  userRoleHistoryByUser(userId: 1) {
    role
    action
    changedAt
    reason
    changedBy {
      fullName
    }
  }
}
```

This implementation provides a complete role management system with audit trails, approval workflows, and comprehensive GraphQL APIs for managing user roles in the application.