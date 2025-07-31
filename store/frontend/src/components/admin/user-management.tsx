'use client';

import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { 
  GET_ALL_USERS, 
  DELETE_USER, 
  TOGGLE_USER_STATUS,
  CREATE_USER,
  UPDATE_USER
} from '@/lib/graphql/admin';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { 
  Users, 
  UserPlus, 
  Edit, 
  Trash2, 
  Search, 
  Filter,
  UserCheck,
  UserX,
  Phone,
  Mail,
  Calendar
} from 'lucide-react';

interface User {
  id: number;
  fullName: string;
  phoneNumber: string;
  email?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  roles: Array<{
    id: number;
    role: string;
    isActive: boolean;
    isPrimary: boolean;
    assignedAt: string;
  }>;
}

interface UserFormData {
  fullName: string;
  phoneNumber: string;
  email: string;
}

export function UserManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<UserFormData>({
    fullName: '',
    phoneNumber: '',
    email: ''
  });

  const { data, loading, error, refetch } = useQuery(GET_ALL_USERS);
  
  const [deleteUserMutation] = useMutation(DELETE_USER, {
    refetchQueries: [{ query: GET_ALL_USERS }],
  });
  
  const [toggleUserStatusMutation] = useMutation(TOGGLE_USER_STATUS, {
    refetchQueries: [{ query: GET_ALL_USERS }],
  });
  
  const [createUserMutation] = useMutation(CREATE_USER, {
    refetchQueries: [{ query: GET_ALL_USERS }],
  });
  
  const [updateUserMutation] = useMutation(UPDATE_USER, {
    refetchQueries: [{ query: GET_ALL_USERS }],
  });

  const users: User[] = data?.users || [];

  const filteredUsers = users.filter(user =>
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phoneNumber.includes(searchTerm) ||
    (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleCreateUser = async () => {
    if (!formData.fullName || !formData.phoneNumber) {
      alert('Please fill in required fields');
      return;
    }

    try {
      await createUserMutation({
        variables: {
          fullName: formData.fullName,
          phoneNumber: formData.phoneNumber,
          email: formData.email || null,
        },
      });
      
      setShowCreateForm(false);
      setFormData({ fullName: '', phoneNumber: '', email: '' });
    } catch (error) {
      console.error('Error creating user:', error);
      alert('Failed to create user');
    }
  };

  const handleUpdateUser = async () => {
    if (!editingUser || !formData.fullName || !formData.phoneNumber) {
      alert('Please fill in required fields');
      return;
    }

    try {
      await updateUserMutation({
        variables: {
          id: editingUser.id,
          fullName: formData.fullName,
          phoneNumber: formData.phoneNumber,
          email: formData.email || null,
        },
      });
      
      setEditingUser(null);
      setFormData({ fullName: '', phoneNumber: '', email: '' });
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Failed to update user');
    }
  };

  const handleDeleteUser = async (userId: number, userName: string) => {
    if (!confirm(`Are you sure you want to delete user "${userName}"?`)) {
      return;
    }

    try {
      await deleteUserMutation({
        variables: { id: userId },
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user');
    }
  };

  const handleToggleUserStatus = async (userId: number) => {
    try {
      await toggleUserStatusMutation({
        variables: { id: userId },
      });
    } catch (error) {
      console.error('Error toggling user status:', error);
      alert('Failed to toggle user status');
    }
  };

  const startEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      fullName: user.fullName,
      phoneNumber: user.phoneNumber,
      email: user.email || '',
    });
    setShowCreateForm(false);
  };

  const cancelEdit = () => {
    setEditingUser(null);
    setShowCreateForm(false);
    setFormData({ fullName: '', phoneNumber: '', email: '' });
  };

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
        <div className="text-lg">Loading users...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-600">Error loading users: {error.message}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Users className="w-6 h-6" />
            User Management
          </h2>
          <p className="text-gray-600">Manage system users and their access</p>
        </div>
        
        <Button 
          onClick={() => {
            setShowCreateForm(true);
            setEditingUser(null);
            setFormData({ fullName: '', phoneNumber: '', email: '' });
          }}
          className="flex items-center gap-2"
        >
          <UserPlus className="w-4 h-4" />
          Add User
        </Button>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search users by name, phone, or email..."
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

      {/* Create/Edit Form */}
      {(showCreateForm || editingUser) && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingUser ? `Edit User: ${editingUser.fullName}` : 'Create New User'}
            </CardTitle>
            <CardDescription>
              {editingUser ? 'Update user information' : 'Add a new user to the system'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Enter full name"
                />
              </div>
              
              <div>
                <Label htmlFor="phoneNumber">Phone Number *</Label>
                <Input
                  id="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  placeholder="Enter phone number"
                />
              </div>
              
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter email address"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button onClick={editingUser ? handleUpdateUser : handleCreateUser}>
                {editingUser ? 'Update User' : 'Create User'}
              </Button>
              <Button variant="outline" onClick={cancelEdit}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle>All Users ({filteredUsers.length})</CardTitle>
          <CardDescription>
            Manage and monitor all system users
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <div key={user.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{user.fullName}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        {user.phoneNumber}
                      </div>
                      {user.email && (
                        <div className="flex items-center gap-1">
                          <Mail className="w-4 h-4" />
                          {user.email}
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Joined {formatDate(user.createdAt)}
                      </div>
                    </div>
                    
                    {user.roles.length > 0 && (
                      <div className="mt-2">
                        <div className="flex flex-wrap gap-1">
                          {user.roles.map((role) => (
                            <span 
                              key={role.id}
                              className={`px-2 py-1 rounded text-xs ${
                                role.isActive
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-gray-100 text-gray-600'
                              }`}
                            >
                              {role.role} {role.isPrimary && '(Primary)'}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleUserStatus(user.id)}
                      className="flex items-center gap-1"
                    >
                      {user.isActive ? (
                        <>
                          <UserX className="w-4 h-4" />
                          Deactivate
                        </>
                      ) : (
                        <>
                          <UserCheck className="w-4 h-4" />
                          Activate
                        </>
                      )}
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => startEdit(user)}
                      className="flex items-center gap-1"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteUser(user.id, user.fullName)}
                      className="flex items-center gap-1 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            
            {filteredUsers.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No users found matching your search criteria.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}