import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
    isCollapsed?: boolean;
    toggleSidebar?: () => void;
}

export default function Sidebar({ isCollapsed = false, toggleSidebar }: SidebarProps) {
    const location = useLocation();
    const { user, profile, signOut } = useAuth();

    const navItems = [
        { name: 'Kullanıcı Listesi', path: '/recipients', icon: 'group', roles: ['admin'] },
        { name: profile?.role === 'irsaliye' ? 'İrsaliye Yükle' : profile?.role === 'user' ? 'Fatura Yükle' : 'Fatura / İrsaliye Yükle', path: '/upload', icon: 'upload_file', roles: ['admin', 'user', 'irsaliye'] },
        { name: profile?.role === 'irsaliye' ? 'Onaya Gönderilen İrsaliyeler' : 'Faturalarım', path: '/my-invoices', icon: 'folder_open', roles: ['user', 'irsaliye'] },
        { name: 'Onaylar', path: '/approvals', icon: 'fact_check', roles: ['admin', 'manager'] },
        { name: profile?.role === 'muhasebe' ? 'Alım Onaylı Faturalar' : profile?.role === 'satinalma' ? 'Onaylı İrsaliyeler' : 'Onaylanan Faturalar', path: '/approved-invoices', icon: 'task_alt', roles: ['admin', 'manager', 'muhasebe', 'satinalma'] },
        { name: 'Sistem Kayıtları', path: '/system-logs', icon: 'manage_search', roles: ['admin', 'manager'] },
        { name: 'Ayarlar', path: '/settings', icon: 'settings', roles: ['admin', 'manager', 'user', 'muhasebe'] },
    ];

    return (
        <aside className={`hidden md:flex flex-col ${isCollapsed ? 'w-20' : 'w-64'} bg-surface-light dark:bg-surface-dark border-r border-border-light dark:border-border-dark h-screen fixed left-0 top-0 z-20 transition-all duration-300`}>
            <div className={`py-6 flex items-center ${isCollapsed ? 'justify-center px-4' : 'gap-3 px-6'} overflow-hidden`}>
                <div className="w-8 h-8 rounded-lg bg-primary flex shrink-0 items-center justify-center text-white" title={isCollapsed ? "Fatura Yöneticisi" : undefined}>
                    <span className="material-symbols-outlined text-[20px]">description</span>
                </div>
                {!isCollapsed && (
                    <div className="min-w-0 flex-1">
                        <h1 className="font-bold text-lg text-slate-900 dark:text-white leading-tight truncate">
                            Fatura<br /><span className="text-primary">Yöneticisi</span>
                        </h1>
                    </div>
                )}
                {toggleSidebar && (
                    <button
                        onClick={toggleSidebar}
                        className={`absolute right-[-12px] top-6 w-6 h-6 bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-full flex items-center justify-center text-slate-500 hover:text-primary transition-colors cursor-pointer z-30 shadow-sm`}
                        title={isCollapsed ? 'Menüyü Genişlet' : 'Menüyü Daralt'}
                    >
                        <span className="material-symbols-outlined text-[14px]">
                            {isCollapsed ? 'keyboard_double_arrow_right' : 'keyboard_double_arrow_left'}
                        </span>
                    </button>
                )}
            </div>
            <nav className={`flex-1 ${isCollapsed ? 'px-2' : 'px-4'} py-4 space-y-1 overflow-y-auto`}>
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
                                title={isCollapsed ? item.name : undefined}
                                className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3 px-3'} py-3 rounded-lg transition-colors group ${isActive
                                    ? 'bg-primary/10 text-primary dark:text-primary-400'
                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                                    }`}
                            >
                                <span className={`material-symbols-outlined ${isActive ? 'fill-1' : 'group-hover:text-primary'} shrink-0`}>
                                    {item.icon}
                                </span>
                                {!isCollapsed && <span className="font-medium text-sm leading-tight">{item.name}</span>}
                            </Link>
                        );
                    })}
            </nav>
            <div className={`p-4 border-t border-border-light dark:border-border-dark flex flex-col ${isCollapsed ? 'gap-4 items-center' : 'gap-2'}`}>
                <div
                    className={`flex items-center ${isCollapsed ? 'justify-center w-10 h-10' : 'gap-3 px-3 py-2 w-full'} rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors`}
                    onClick={() => signOut()}
                    title={isCollapsed ? 'Çıkış Yap' : undefined}
                >
                    <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex flex-shrink-0 items-center justify-center overflow-hidden">
                        {profile?.avatar_url ? (
                            <img src={profile.avatar_url} alt="Profil" className="w-full h-full object-cover" />
                        ) : (
                            <span className="material-symbols-outlined text-slate-500">person</span>
                        )}
                    </div>
                    {!isCollapsed && (
                        <>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                                    {profile?.full_name || user?.email || 'Kullanıcı'}
                                </p>
                                <p className="text-xs text-slate-500 truncate capitalize">
                                    {profile?.role === 'manager' ? 'Müdür' : profile?.role === 'admin' ? 'Admin' : profile?.role === 'muhasebe' ? 'Muhasebe' : profile?.role === 'satinalma' ? 'Satın Alma' : profile?.role === 'irsaliye' ? 'İrsaliye' : 'Kullanıcı'}
                                </p>
                            </div>
                            <span className="material-symbols-outlined text-slate-400 text-[18px] shrink-0">logout</span>
                        </>
                    )}
                </div>
            </div>
        </aside>
    );
}
