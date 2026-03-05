import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import type { UserProfile, UserRole } from '../context/AuthContext';

export default function EmailRecipientsManagementScreen() {
    const { profile } = useAuth();
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('Tüm Roller');

    const fetchUsers = async () => {
        setLoading(true);
        const { data, error } = await supabase.from('users').select('*').order('full_name', { ascending: true });
        if (error) {
            console.error('Error fetching users:', error);
        } else {
            console.log('Fetched users list:', data);
            setUsers(data as UserProfile[]);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleStatusChange = async (userId: string, newStatus: string) => {
        const { error } = await supabase.from('users').update({ status: newStatus }).eq('id', userId);
        if (error) {
            console.error('Error updating status:', error);
            alert('Durum güncellenirken bir hata oluştu.');
        } else {
            fetchUsers();
        }
    };

    const handleRoleChange = async (userId: string, newRole: UserRole) => {
        const { error } = await supabase.from('users').update({ role: newRole }).eq('id', userId);
        if (error) {
            console.error('Error updating role:', error);
            alert('Rol güncellenirken bir hata oluştu.');
        } else {
            fetchUsers();
        }
    };

    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole = roleFilter === 'Tüm Roller' ||
            (roleFilter === 'Müdür' && user.role === 'manager') ||
            (roleFilter === 'Admin' && user.role === 'admin') ||
            (roleFilter === 'Kullanıcı' && user.role === 'user');
        return matchesSearch && matchesRole;
    });

    return (
        <>
            <header className="bg-surface-light dark:bg-surface-dark border-b border-border-light dark:border-border-dark py-4 px-6 sticky top-0 z-10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Kullanıcı Yönetimi</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Sistemdeki kullanıcıları yönetin ve onaylayın.</p>
                    </div>
                </div>
            </header>

            <div className="flex-1 overflow-auto p-6 bg-background-light dark:bg-background-dark">
                <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-surface-light dark:bg-surface-dark p-4 rounded-xl shadow-sm border border-border-light dark:border-border-dark">
                    <div className="relative w-full sm:max-w-md">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="material-symbols-outlined text-slate-400">search</span>
                        </div>
                        <input
                            className="block w-full pl-10 pr-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                            placeholder="İsim veya e-posta ile ara..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            type="text"
                        />
                    </div>
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Filtre:</span>
                            <select
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                                className="block w-full pl-3 pr-10 py-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-primary focus:border-primary rounded-lg"
                            >
                                <option>Tüm Roller</option>
                                <option>Admin</option>
                                <option>Müdür</option>
                                <option>Kullanıcı</option>
                            </select>
                        </div>
                        <button onClick={fetchUsers} className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors border border-transparent hover:border-primary/20" title="Yenile">
                            <span className="material-symbols-outlined">refresh</span>
                        </button>
                    </div>
                </div>

                <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-border-light dark:border-border-dark overflow-hidden flex flex-col">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-border-light dark:divide-border-dark">
                            <thead className="bg-slate-50 dark:bg-slate-800/50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">İsim</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">E-posta</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Rol</th>
                                    <th className="px-6 py-4 text-center text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Durum</th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">İşlemler</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-surface-dark divide-y divide-border-light dark:divide-border-dark">
                                {loading ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-slate-500">Yükleniyor...</td>
                                    </tr>
                                ) : filteredUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-slate-500">Kullanıcı bulunamadı.</td>
                                    </tr>
                                ) : (
                                    filteredUsers.map((user) => (
                                        <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm mr-3 border border-primary/20">
                                                        {getInitials(user.full_name || 'U')}
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium text-slate-900 dark:text-white">{user.full_name}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300 font-medium">
                                                {user.email}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <select
                                                    disabled={user.id === profile?.id}
                                                    value={user.role}
                                                    onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}
                                                    className="pl-3 pr-8 py-1 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-primary focus:border-primary rounded-lg text-xs"
                                                >
                                                    <option value="user">Kullanıcı</option>
                                                    <option value="manager">Müdür</option>
                                                    <option value="admin">Admin</option>
                                                </select>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                {user.status === 'pending_approval' ? (
                                                    <span className="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-50 text-yellow-700 border border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400">
                                                        Onay Bekliyor
                                                    </span>
                                                ) : user.status === 'active' ? (
                                                    <span className="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/30 dark:text-green-400">
                                                        Aktif
                                                    </span>
                                                ) : (
                                                    <span className="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/30 dark:text-red-400">
                                                        Reddedildi
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                {user.id !== profile?.id && (
                                                    <div className="flex items-center justify-end gap-2">
                                                        {user.status !== 'active' && (
                                                            <button
                                                                onClick={() => handleStatusChange(user.id, 'active')}
                                                                className="p-1.5 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-md transition-colors"
                                                                title="Onayla"
                                                            >
                                                                <span className="material-symbols-outlined text-[20px]">check_circle</span>
                                                            </button>
                                                        )}
                                                        {user.status !== 'rejected' && (
                                                            <button
                                                                onClick={() => handleStatusChange(user.id, 'rejected')}
                                                                className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                                                                title="Reddet/Engelle"
                                                            >
                                                                <span className="material-symbols-outlined text-[20px]">cancel</span>
                                                            </button>
                                                        )}
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}
