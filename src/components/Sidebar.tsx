import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Sidebar() {
    const location = useLocation();
    const { user, profile, signOut } = useAuth();

    const navItems = [
        { name: 'Gösterge Paneli', path: '/', icon: 'dashboard', roles: ['admin', 'manager', 'user'] },
        { name: 'Kullanıcı Listesi', path: '/recipients', icon: 'group', roles: ['admin', 'manager'] },
        { name: 'Fatura Yükle', path: '/upload', icon: 'upload_file', roles: ['admin', 'manager', 'user'] },
        { name: 'Faturalarım', path: '/my-invoices', icon: 'folder_open', roles: ['user'] },
        { name: 'Onaylar', path: '/approvals', icon: 'fact_check', roles: ['admin', 'manager'] },
        { name: 'Onaylanan Faturalar', path: '/approved-invoices', icon: 'task_alt', roles: ['admin', 'manager'] },
        { name: 'Raporlar', path: '/reports', icon: 'picture_as_pdf', roles: ['admin', 'manager'] },
    ];

    return (
        <aside className="hidden md:flex flex-col w-64 bg-surface-light dark:bg-surface-dark border-r border-border-light dark:border-border-dark h-screen fixed left-0 top-0 z-20">
            <div className="p-6 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white">
                    <span className="material-symbols-outlined text-[20px]">description</span>
                </div>
                <div>
                    <h1 className="font-bold text-lg text-slate-900 dark:text-white leading-tight">
                        Fatura<br /><span className="text-primary">Yöneticisi</span>
                    </h1>
                </div>
            </div>
            <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
                {navItems
                    .filter(item => {
                        // Eğer role kısıtlaması yoksa göster
                        if (!item.roles) return true;
                        // Profil varsa ve rolü izin verilenler arasındaysa göster
                        if (profile && item.roles.includes(profile.role)) return true;
                        // Profil yüklenemediyse ama varsayılan olarak 'user' rolüne izin veriliyorsa göster (Fallback)
                        if (!profile && item.roles.includes('user')) return true;

                        return false;
                    })
                    .map((item) => {
                        const isActive = location.pathname === item.path || (location.pathname.startsWith(item.path) && item.path !== '/');
                        return (
                            <Link
                                key={item.name}
                                to={item.path}
                                className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors group ${isActive
                                    ? 'bg-primary/10 text-primary dark:text-primary-400'
                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                                    }`}
                            >
                                <span className={`material-symbols-outlined ${isActive ? 'fill-1' : 'group-hover:text-primary'}`}>
                                    {item.icon}
                                </span>
                                <span className="font-medium text-sm">{item.name}</span>
                            </Link>
                        );
                    })}
            </nav>
            <div className="p-4 border-t border-border-light dark:border-border-dark">
                <div
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                    onClick={() => signOut()}
                >
                    <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center overflow-hidden">
                        <span className="material-symbols-outlined text-slate-500">person</span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                            {profile?.full_name || user?.email || 'Kullanıcı'}
                        </p>
                        <p className="text-xs text-slate-500 truncate capitalize">
                            {profile?.role === 'manager' ? 'Müdür' : profile?.role === 'admin' ? 'Admin' : 'Kullanıcı'}
                        </p>
                    </div>
                    <span className="material-symbols-outlined text-slate-400 text-[18px]">logout</span>
                </div>
            </div>
        </aside>
    );
}
