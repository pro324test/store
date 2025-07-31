'use client';

import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { 
  GET_ALL_ROLES
} from '@/lib/graphql/admin';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { 
  Shield, 
  UserPlus, 
  Edit, 
  Trash2, 
  Search, 
  Filter,
  Users,
  Key
} from 'lucide-react';

interface Role {
  id: number;
  roleName: string;
  roleNameEn: string;
  description?: string;
  descriptionEn?: string;
  createdAt: string;
  updatedAt: string;
  permissions: Array<{
    id: number;
    permissionKey: string;
    category: string;
    categoryEn: string;
    description?: string;
    descriptionEn?: string;
  }>;
  staffProfiles: Array<{
    userId: number;
    user: {
      id: number;
      fullName: string;
      phoneNumber: string;
      email?: string;
    };
  }>;
}

export function UserRoles() {
  const [searchTerm, setSearchTerm] = useState('');

  const { data, loading, error, refetch } = useQuery(GET_ALL_ROLES);

  const roles: Role[] = data?.systemStaffRoles || [];

  const filteredRoles = roles.filter(role =>
    role.roleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.roleNameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (role.description && role.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (role.descriptionEn && role.descriptionEn.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading roles...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-600">Error loading roles: {error.message}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="w-6 h-6" />
            User Roles
          </h2>
          <p className="text-gray-600">Manage system roles and their permissions</p>
        </div>
        
        <Button 
          onClick={() => {
            // TODO: Implement role creation
            alert('Role creation will be implemented in the future');
          }}
          className="flex items-center gap-2"
        >
          <UserPlus className="w-4 h-4" />
          Add Role
        </Button>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search roles by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Roles List */}
      <Card>
        <CardHeader>
          <CardTitle>All Roles ({filteredRoles.length})</CardTitle>
          <CardDescription>
            Manage system roles and their permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredRoles.map((role) => (
              <div key={role.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{role.roleNameEn}</h3>
                      {role.roleName !== role.roleNameEn && (
                        <span className="text-sm text-gray-600">({role.roleName})</span>
                      )}
                    </div>
                    
                    {(role.description || role.descriptionEn) && (
                      <p className="text-gray-600 mb-2">
                        {role.descriptionEn || role.description}
                      </p>
                    )}
                    
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-2">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {role.staffProfiles.length} users
                      </div>
                      <div className="flex items-center gap-1">
                        <Key className="w-4 h-4" />
                        {role.permissions.length} permissions
                      </div>
                      <div>
                        Created {formatDate(role.createdAt)}
                      </div>
                    </div>
                    
                    {role.permissions.length > 0 && (
                      <div className="mt-2">
                        <div className="flex flex-wrap gap-1">
                          {role.permissions.slice(0, 5).map((permission) => (
                            <span 
                              key={permission.id}
                              className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-800"
                            >
                              {permission.permissionKey}
                            </span>
                          ))}
                          {role.permissions.length > 5 && (
                            <span className="px-2 py-1 rounded text-xs bg-gray-100 text-gray-600">
                              +{role.permissions.length - 5} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // TODO: Implement role editing
                        alert('Role editing will be implemented in the future');
                      }}
                      className="flex items-center gap-1"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // TODO: Implement role deletion
                        if (confirm(`Are you sure you want to delete role "${role.roleNameEn}"?`)) {
                          alert('Role deletion will be implemented in the future');
                        }
                      }}
                      className="flex items-center gap-1 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            
            {filteredRoles.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No roles found matching your search criteria.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}