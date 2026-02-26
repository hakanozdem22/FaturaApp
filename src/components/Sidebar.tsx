import { Link, useLocation } from 'react-router-dom';

export default function Sidebar() {
    const location = useLocation();

    const navItems = [
        { name: 'Gösterge Paneli', path: '/', icon: 'dashboard' },
        { name: 'Alıcı Listesi', path: '/recipients', icon: 'group' },
        { name: 'Fatura Yükle', path: '/upload', icon: 'upload_file' },
        { name: 'Onaylar', path: '/approvals', icon: 'fact_check' },
        { name: 'Raporlar', path: '/reports', icon: 'picture_as_pdf' },
        { name: 'Denetim Günlükleri', path: '/logs', icon: 'list_alt' },
        { name: 'Güvenlik', path: '/security', icon: 'security' },
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
                {navItems.map((item) => {
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
                <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer">
                    <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center overflow-hidden">
                        <img
                            alt="Admin User"
                            className="w-full h-full object-cover"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDDfkBRyQahAmYNCMpvHSKutmsPB9_a86B2hhdUkPqZn8eoRdI5wmtQuWjUVAhHaddEay0tCRVX6jTY8ui58-rt1wLTpWG0M283eDBa6cvdTcfOjAZxg3jfqqauM8yPPefpbw_gg8gs3uqMpYs3crMHxcCZ6QZZDF-G83kNCmYi0MHCVjgWBadxF2Zy5PK_lMvcZ9vLVKlLj5ub3fYF0iiB_ZONffrPlwrCxyWSRoQq_5QX6_Rfu5OHa4gkARQ5j2RW_HVjY1ABoc90"
                        />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 dark:text-white truncate">Alex Morgan</p>
                        <p className="text-xs text-slate-500 truncate">Sistem Yöneticisi</p>
                    </div>
                    <span className="material-symbols-outlined text-slate-400 text-[18px]">logout</span>
                </div>
            </div>
        </aside>
    );
}
