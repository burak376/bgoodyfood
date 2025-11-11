'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Search, Filter, Eye, Edit, Trash2, CheckCircle, AlertCircle, UserPlus } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import AdminLayout from '@/components/admin/admin-layout';
import { adminApi, User } from '@/lib/api/admin';
import { fallbackUsers, userRoles } from '@/lib/api/fallback-data';

export default function AdminUsers() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>(fallbackUsers);
  const [filteredUsers, setFilteredUsers] = useState<User[]>(fallbackUsers);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('Tümü');
  const [selectedStatus, setSelectedStatus] = useState('Tümü');
  const [apiConnected, setApiConnected] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'ADMIN') {
      router.push('/');
      return;
    }

    loadUsers();
  }, [isAuthenticated, user, router]);

  useEffect(() => {
    // Filter users based on search, role, and status
    let filtered = users;
    
    if (searchTerm) {
      filtered = filtered.filter(userItem => 
        userItem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        userItem.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedRole !== 'Tümü') {
      filtered = filtered.filter(userItem => userItem.role === selectedRole);
    }
    
    if (selectedStatus !== 'Tümü') {
      filtered = filtered.filter(userItem => userItem.status === selectedStatus);
    }
    
    setFilteredUsers(filtered);
  }, [users, searchTerm, selectedRole, selectedStatus]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      
      // Try to load from .NET API first
      try {
        const apiUsers = await adminApi.getUsers();
        setUsers(apiUsers);
        setFilteredUsers(apiUsers);
        setApiConnected(true);
        console.log('✅ Users loaded from .NET API');
      } catch (apiError) {
        console.log('⚠️ .NET API not available, using fallback data');
        
        // Fallback to existing API endpoints
        const response = await fetch('/api/admin/users');
        if (response.ok) {
          const data = await response.json();
          const localUsers = data.users || [];
          setUsers(localUsers);
          setFilteredUsers(localUsers);
        }
        setApiConnected(false);
      }
    } catch (error) {
      console.error('Users loading error:', error);
      setUsers(fallbackUsers);
      setFilteredUsers(fallbackUsers);
      setApiConnected(false);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Bu kullanıcıyı silmek istediğinizden emin misiniz?')) return;
    
    try {
      if (apiConnected) {
        await adminApi.deleteUser(userId);
      } else {
        // Fallback delete logic
        console.log('Delete user:', userId);
      }
      await loadUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleToggleUserStatus = async (userId: string) => {
    try {
      if (apiConnected) {
        await adminApi.toggleUserStatus(userId);
      } else {
        // Fallback toggle logic
        console.log('Toggle user status:', userId);
      }
      await loadUsers();
    } catch (error) {
      console.error('Error toggling user status:', error);
    }
  };

  const getRoleBadge = (role: string) => {
    const roleConfig = userRoles.find(r => r.value === role);
    return roleConfig ? (
      <Badge className={role.value === 'admin' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}>
        {roleConfig.label}
      </Badge>
    ) : (
      <Badge variant="outline">{role}</Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    return status === 'active' ? (
      <Badge className="bg-green-100 text-green-800">Aktif</Badge>
    ) : (
      <Badge className="bg-gray-100 text-gray-800">Pasif</Badge>
    );
  };

  if (!isAuthenticated || user?.role !== 'ADMIN') {
    return (
      <AdminLayout title="Yetkisiz Erişim" subtitle="Bu sayfaya erişim izniniz yok">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Users className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <Button onClick={() => router.push('/')}>Ana Sayfaya Dön</Button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (loading) {
    return (
      <AdminLayout title="Kullanıcı Yönetimi" subtitle="Yükleniyor...">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </div>
      </AdminLayout>
    );
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'bg-red-100 text-red-800';
      case 'USER': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'Admin';
      case 'USER': return 'Kullanıcı';
      default: return role;
    }
  };

  return (
    <AdminLayout title="Kullanıcı Yönetimi" subtitle="Kullanıcıları yönet">
      {/* API Connection Status */}
      <div className="mb-6">
        <div className={`p-4 rounded-lg flex items-center gap-3 ${
          apiConnected 
            ? 'bg-green-50 border border-green-200' 
            : 'bg-yellow-50 border border-yellow-200'
        }`}>
          {apiConnected ? (
            <>
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-green-800 font-medium">
                ✅ .NET API Bağlantısı Aktif - Gerçek veriler kullanılıyor
              </span>
            </>
          ) : (
            <>
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              <span className="text-yellow-800 font-medium">
                ⚠️ .NET API Bağlantısı Pasif - Örnek veriler kullanılıyor
              </span>
            </>
          )}
        </div>
      </div>

      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Kullanıcı ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="Tümü">Tüm Roller</option>
              {userRoles.map(role => (
                <option key={role.value} value={role.value}>{role.label}</option>
              ))}
            </select>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="Tümü">Tüm Durumlar</option>
              <option value="active">Aktif</option>
              <option value="inactive">Pasif</option>
            </select>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filtrele
            </Button>
          </div>
          <Button className="bg-green-600 hover:bg-green-700">
            <UserPlus className="w-4 h-4 mr-2" />
            Yeni Kullanıcı
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Toplam Kullanıcılar</p>
                  <p className="text-2xl font-bold text-gray-900">{filteredUsers.length}</p>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Admin Kullanıcılar</p>
                  <p className="text-2xl font-bold text-gray-900">{filteredUsers.filter(u => u.role === 'admin').length}</p>
                </div>
                <Badge className="bg-red-100 text-red-800">Admin</Badge>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Normal Kullanıcılar</p>
                  <p className="text-2xl font-bold text-gray-900">{filteredUsers.filter(u => u.role === 'customer').length}</p>
                </div>
                <Badge className="bg-blue-100 text-blue-800">Kullanıcı</Badge>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Yeni Kullanıcılar</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {filteredUsers.filter(u => {
                      const createdAt = new Date(u.registrationDate);
                      const thirtyDaysAgo = new Date();
                      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                      return createdAt > thirtyDaysAgo;
                    }).length}
                  </p>
                </div>
                <Badge className="bg-green-100 text-green-800">Yeni</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>Kullanıcı Listesi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Kullanıcı</th>
                    <th className="text-left py-3 px-4">E-posta</th>
                    <th className="text-left py-3 px-4">Telefon</th>
                    <th className="text-left py-3 px-4">Rol</th>
                    <th className="text-left py-3 px-4">Kayıt Tarihi</th>
                    <th className="text-left py-3 px-4">Durum</th>
                    <th className="text-left py-3 px-4">İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((userItem) => (
                    <tr key={userItem.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium">
                              {userItem.name?.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium">{userItem.name}</p>
                            <p className="text-sm text-gray-500">
                              {userItem.totalOrders} sipariş • ₺{userItem.totalSpent?.toFixed(0) || '0'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">{userItem.email}</td>
                      <td className="py-3 px-4">-</td>
                      <td className="py-3 px-4">
                        {getRoleBadge(userItem.role)}
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p>{new Date(userItem.registrationDate).toLocaleDateString('tr-TR')}</p>
                          <p className="text-sm text-gray-500">
                            Son giriş: {userItem.lastLogin ? new Date(userItem.lastLogin).toLocaleDateString('tr-TR') : 'Hiç'}
                          </p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {getStatusBadge(userItem.status)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-1" />
                            Gör
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4 mr-1" />
                            Düzenle
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleToggleUserStatus(userItem.id)}
                          >
                            {userItem.status === 'active' ? 'Pasif Yap' : 'Aktif Yap'}
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDeleteUser(userItem.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}