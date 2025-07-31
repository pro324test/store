# Profile Dropdown Testing Guide

## Testing the ProfileDropdown Component

Since the backend is not running, you can test the profile dropdown functionality using browser console commands to simulate different user states.

### Test Commands for Browser Console

Open the browser developer tools (F12) and run these commands in the console:

#### 1. Test Regular Customer User
```javascript
// Simulate a logged-in customer
localStorage.setItem('accessToken', 'mock-token');
window.dispatchEvent(new CustomEvent('mockUser', { 
  detail: {
    id: '1',
    phoneNumber: '+971501234567',
    fullName: 'أحمد محمد',
    email: 'ahmed@example.com',
    isActive: true,
    roles: [{ role: 'CUSTOMER', isActive: true, isPrimary: true, createdAt: '2024-01-15T10:00:00Z' }],
    createdAt: '2024-01-15T10:00:00Z'
  }
}));
location.reload();
```

#### 2. Test Admin User (SYSTEM_STAFF)
```javascript
// Simulate a logged-in admin
localStorage.setItem('accessToken', 'mock-admin-token');
window.dispatchEvent(new CustomEvent('mockUser', { 
  detail: {
    id: '2',
    phoneNumber: '+971501234568',
    fullName: 'سارة أحمد (مديرة النظام)',
    email: 'sara@admin.com',
    isActive: true,
    roles: [{ role: 'SYSTEM_STAFF', isActive: true, isPrimary: true, createdAt: '2024-01-10T10:00:00Z' }],
    createdAt: '2024-01-10T10:00:00Z'
  }
}));
location.reload();
```

#### 3. Test Multi-Role User (Vendor + Customer)
```javascript
// Simulate a user with multiple roles
localStorage.setItem('accessToken', 'mock-vendor-token');
window.dispatchEvent(new CustomEvent('mockUser', { 
  detail: {
    id: '3',
    phoneNumber: '+971501234569',
    fullName: 'محمد علي (تاجر)',
    email: 'mohamed@vendor.com',
    isActive: true,
    roles: [
      { role: 'VENDOR', isActive: true, isPrimary: true, createdAt: '2024-01-12T10:00:00Z' },
      { role: 'CUSTOMER', isActive: true, isPrimary: false, createdAt: '2024-01-12T10:00:00Z' }
    ],
    createdAt: '2024-01-12T10:00:00Z'
  }
}));
location.reload();
```

#### 4. Reset to Guest Mode
```javascript
// Clear authentication and return to guest mode
localStorage.removeItem('accessToken');
localStorage.removeItem('refreshToken');
location.reload();
```

### Expected Behavior

- **Guest User**: Shows login button that redirects to `/ar/auth`
- **Customer**: Shows dropdown with Profile, Dashboard, Logout
- **Admin (SYSTEM_STAFF)**: Shows dropdown with Profile, Dashboard, **Admin Dashboard**, Logout
- **Vendor**: Shows dropdown with Profile, Dashboard, Logout (no admin access)

### Testing URLs

- Home page with profile icon: `http://localhost:3001/ar`
- Admin dashboard (protected): `http://localhost:3001/ar/admin`
- Regular dashboard: `http://localhost:3001/ar/dashboard`
- Profile page: `http://localhost:3001/ar/profile`

### Manual Testing Steps

1. Start with guest mode (no user logged in)
2. Click the user icon → should redirect to login page
3. Use console commands to simulate different user types
4. Click the user icon → should show dropdown with appropriate options
5. Test admin user → should see "Admin Dashboard" option
6. Click "Admin Dashboard" → should access admin interface
7. Test non-admin user → should not see "Admin Dashboard" option