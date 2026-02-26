// @ts-nocheck
export default function SystemAuditLogsDashboardTwo() {
    return (
        <>

            <header className="bg-white dark:bg-background-dark border-b border-slate-200 dark:border-slate-800 px-8 py-6">
                <div className="max-w-[1400px] mx-auto w-full">
                    <nav className="flex mb-4 text-xs font-medium text-slate-500 dark:text-slate-400">
                        <a className="hover:text-primary" href="#">Ana Sayfa</a>
                        <span className="mx-2">/</span>
                        <a className="hover:text-primary" href="#">Ayarlar</a>
                        <span className="mx-2">/</span>
                        <span className="text-slate-800 dark:text-slate-200">Sistem Denetim Günlükleri</span>
                    </nav>
                    <div className="flex flex-wrap items-end justify-between gap-4">
                        <div className="flex flex-col gap-1">
                            <h1 className="text-slate-900 dark:text-white text-3xl font-bold leading-tight flex items-center gap-3">
                                Sistem Denetim Günlükleri
                                <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                                    <span className="material-symbols-outlined text-[14px] mr-1">lock</span> Şifreli
                                </span>
                            </h1>
                            <p className="text-slate-500 dark:text-slate-400 text-base">Tüm sistem aktivitelerinin ve güvenlik olaylarının ayrıntılı kronolojik kaydı.</p>
                        </div>
                        <div className="flex gap-2">
                            <button className="flex items-center justify-center rounded-lg h-10 px-4 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-semibold transition-colors shadow-sm">
                                <span className="material-symbols-outlined text-[20px] mr-2">download</span>
                                CSV İndir
                            </button>
                            <button className="flex items-center justify-center rounded-lg h-10 px-4 bg-primary hover:bg-blue-600 text-white text-sm font-semibold transition-colors shadow-sm">
                                <span className="material-symbols-outlined text-[20px] mr-2">picture_as_pdf</span>
                                PDF İndir
                            </button>
                        </div>
                    </div>
                </div>
            </header>
            <div className="flex-1 overflow-auto p-8 bg-background-light dark:bg-background-dark">
                <div className="max-w-[1400px] mx-auto w-full flex flex-col gap-6">
                    <div className="bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-4 w-full sm:w-auto">
                            <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2 rounded-full">
                                <span className="material-symbols-outlined text-emerald-600 dark:text-emerald-400">verified</span>
                            </div>
                            <div className="flex flex-col">
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    Veritabanı Bütünlüğü: %100 Güvenli
                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Son tam sağlama doğrulaması 2 dakika önce tamamlandı.</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 w-full sm:w-auto flex-1 justify-end">
                            <div className="hidden md:flex flex-col w-full max-w-xs gap-1">
                                <div className="flex justify-between text-[10px] font-medium text-slate-500 uppercase tracking-wider">
                                    <span>Taranan Kayıtlar</span>
                                    <span>%100</span>
                                </div>
                                <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500 w-full rounded-full"></div>
                                </div>
                            </div>
                            <button className="flex items-center justify-center whitespace-nowrap rounded-lg h-9 px-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-semibold transition-colors shadow-sm gap-2">
                                <span className="material-symbols-outlined text-[18px]">gpp_good</span>
                                Tüm Günlükleri Doğrula
                            </button>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-wrap gap-4 items-center justify-between">
                        <div className="flex flex-wrap gap-3 items-center flex-1">
                            <div className="relative w-full max-w-xs">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="material-symbols-outlined text-slate-400">search</span>
                                </div>
                                <input className="block w-full rounded-lg border-0 py-2 pl-10 pr-3 text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 dark:bg-slate-900 dark:ring-slate-700 dark:text-white" placeholder="ID, Kullanıcı veya IP'ye göre ara..." type="text" />
                            </div>
                            <button className="flex h-9 items-center gap-2 rounded-lg bg-slate-50 px-3 py-1 text-sm font-medium text-slate-700 ring-1 ring-inset ring-slate-200 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-300 dark:ring-slate-700">
                                <span className="material-symbols-outlined text-[18px] text-slate-500">calendar_today</span>
                                1 Eki - 31 Eki, 2023
                                <span className="material-symbols-outlined text-[18px] text-slate-400">expand_more</span>
                            </button>
                            <button className="flex h-9 items-center gap-2 rounded-lg bg-slate-50 px-3 py-1 text-sm font-medium text-slate-700 ring-1 ring-inset ring-slate-200 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-300 dark:ring-slate-700">
                                <span className="material-symbols-outlined text-[18px] text-slate-500">filter_list</span>
                                İşlem: Tümü
                                <span className="material-symbols-outlined text-[18px] text-slate-400">expand_more</span>
                            </button>
                            <button className="flex h-9 items-center gap-2 rounded-lg bg-slate-50 px-3 py-1 text-sm font-medium text-slate-700 ring-1 ring-inset ring-slate-200 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-300 dark:ring-slate-700">
                                <span className="material-symbols-outlined text-[18px] text-slate-500">person</span>
                                Kullanıcı: Tümü
                                <span className="material-symbols-outlined text-[18px] text-slate-400">expand_more</span>
                            </button>
                            <a className="text-sm text-primary hover:text-blue-700 font-medium ml-2" href="#">Tümünü temizle</a>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col">
                        <div className="overflow-x-auto overflow-y-visible">
                            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                                <thead className="bg-slate-50 dark:bg-slate-900/50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider w-[180px]" scope="col">Zaman Damgası</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider w-[220px]" scope="col">Kullanıcı &amp; Rol</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider w-[180px]" scope="col">İşlem Türü</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider" scope="col">
                                            Ayrıntılar (Fark Görünümü)
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider w-[180px]" scope="col">Bütünlük/Dijital İmza</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider w-[160px]" scope="col">IP Adresi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 dark:divide-slate-700 bg-white dark:bg-slate-800">
                                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-mono">
                                            24 Eki 2023 <br />
                                            <span className="text-slate-400 text-xs">14:30:45 UTC</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-9 w-9 flex-shrink-0 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">SJ</div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-slate-900 dark:text-white">Sarah Jenkins</div>
                                                    <div className="text-xs text-slate-500">Süper Yönetici</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">
                                                <span className="material-symbols-outlined text-[14px] mr-1">edit</span> Ayarlar Değiştirildi
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center text-sm gap-2 flex-wrap">
                                                <span className="text-slate-500 w-full mb-1 text-xs font-medium uppercase tracking-wide">Banka Bilgileri Güncellemesi</span>
                                                <div className="flex items-center gap-2 font-mono text-xs bg-red-50 text-red-700 px-2 py-1 rounded border border-red-100 line-through decoration-red-400">
                                                    Hesap: ...8891
                                                </div>
                                                <span className="material-symbols-outlined text-slate-400 text-sm">arrow_right_alt</span>
                                                <div className="flex items-center gap-2 font-mono text-xs bg-green-50 text-green-700 px-2 py-1 rounded border border-green-100">
                                                    Hesap: ...4420
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="group relative inline-flex">
                                                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 cursor-help">
                                                    <span className="material-symbols-outlined text-[16px]">verified</span>
                                                    <span className="text-xs font-bold uppercase tracking-wider">İmzalandı</span>
                                                </div>
                                                <div className="tooltip invisible opacity-0 absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-slate-900 text-white text-xs rounded-lg shadow-xl transition-all duration-200 pointer-events-none">
                                                    <div className="flex flex-col gap-2">
                                                        <div>
                                                            <span className="text-slate-400 font-semibold block text-[10px] uppercase">SHA-256 Özeti</span>
                                                            <span className="font-mono text-[10px] break-all text-emerald-400">e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855</span>
                                                        </div>
                                                        <div className="border-t border-slate-700 pt-2">
                                                            <span className="text-slate-400 font-semibold block text-[10px] uppercase">TSA Sertifikası</span>
                                                            <span className="font-mono text-[10px]">DigiCert Zaman Damgası 2023</span>
                                                        </div>
                                                    </div>
                                                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-2 border-4 border-transparent border-t-slate-900"></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-mono">
                                            192.168.1.45
                                        </td>
                                    </tr>
                                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-mono">
                                            24 Eki 2023 <br />
                                            <span className="text-slate-400 text-xs">13:15:12 UTC</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-9 w-9 flex-shrink-0 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">MR</div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-slate-900 dark:text-white">Mike Ross</div>
                                                    <div className="text-xs text-slate-500">Editör</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                                                <span className="material-symbols-outlined text-[14px] mr-1">check_circle</span> Fatura Onaylandı
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center text-sm gap-2 flex-wrap">
                                                <span className="text-slate-500 w-full mb-1 text-xs font-medium uppercase tracking-wide">Fatura #INV-2024-001</span>
                                                <div className="flex items-center gap-2 font-mono text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded border border-slate-200">
                                                    Durum: Bekliyor
                                                </div>
                                                <span className="material-symbols-outlined text-slate-400 text-sm">arrow_right_alt</span>
                                                <div className="flex items-center gap-2 font-mono text-xs bg-green-50 text-green-700 px-2 py-1 rounded border border-green-100">
                                                    Durum: Onaylandı
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="group relative inline-flex">
                                                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 cursor-help">
                                                    <span className="material-symbols-outlined text-[16px]">verified</span>
                                                    <span className="text-xs font-bold uppercase tracking-wider">İmzalandı</span>
                                                </div>
                                                <div className="tooltip invisible opacity-0 absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-slate-900 text-white text-xs rounded-lg shadow-xl transition-all duration-200 pointer-events-none">
                                                    <div className="flex flex-col gap-2">
                                                        <div>
                                                            <span className="text-slate-400 font-semibold block text-[10px] uppercase">SHA-256 Özeti</span>
                                                            <span className="font-mono text-[10px] break-all text-emerald-400">f2a1d88298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b899</span>
                                                        </div>
                                                        <div className="border-t border-slate-700 pt-2">
                                                            <span className="text-slate-400 font-semibold block text-[10px] uppercase">TSA Sertifikası</span>
                                                            <span className="font-mono text-[10px]">DigiCert Zaman Damgası 2023</span>
                                                        </div>
                                                    </div>
                                                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-2 border-4 border-transparent border-t-slate-900"></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-mono">
                                            192.168.1.12
                                        </td>
                                    </tr>
                                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-mono">
                                            24 Eki 2023 <br />
                                            <span className="text-slate-400 text-xs">11:45:00 UTC</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-9 w-9 flex-shrink-0 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 font-bold text-xs">
                                                    <span className="material-symbols-outlined text-[18px]">smart_toy</span>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-slate-900 dark:text-white">Sistem Botu</div>
                                                    <div className="text-xs text-slate-500">Otomatik İşlem</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                                                <span className="material-symbols-outlined text-[14px] mr-1">cloud_upload</span> Otomatik Yedekleme
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center text-sm gap-2">
                                                <span className="text-slate-600 text-xs">Sistem veritabanı yedeği <span className="font-mono bg-slate-100 px-1 rounded">backup_v4.2.zip</span> başarıyla oluşturuldu ve S3 deposunda saklandı.</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="group relative inline-flex">
                                                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 cursor-help">
                                                    <span className="material-symbols-outlined text-[16px]">verified</span>
                                                    <span className="text-xs font-bold uppercase tracking-wider">İmzalandı</span>
                                                </div>
                                                <div className="tooltip invisible opacity-0 absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-slate-900 text-white text-xs rounded-lg shadow-xl transition-all duration-200 pointer-events-none">
                                                    <div className="flex flex-col gap-2">
                                                        <div>
                                                            <span className="text-slate-400 font-semibold block text-[10px] uppercase">SHA-256 Özeti</span>
                                                            <span className="font-mono text-[10px] break-all text-emerald-400">a1b2c34298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b777</span>
                                                        </div>
                                                        <div className="border-t border-slate-700 pt-2">
                                                            <span className="text-slate-400 font-semibold block text-[10px] uppercase">TSA Sertifikası</span>
                                                            <span className="font-mono text-[10px]">DigiCert Zaman Damgası 2023</span>
                                                        </div>
                                                    </div>
                                                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-2 border-4 border-transparent border-t-slate-900"></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-mono">
                                            127.0.0.1
                                        </td>
                                    </tr>
                                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-mono">
                                            24 Eki 2023 <br />
                                            <span className="text-slate-400 text-xs">09:20:10 UTC</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-9 w-9 flex-shrink-0 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">SJ</div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-slate-900 dark:text-white">Sarah Jenkins</div>
                                                    <div className="text-xs text-slate-500">Süper Yönetici</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="inline-flex items-center rounded-md bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10">
                                                <span className="material-symbols-outlined text-[14px] mr-1">person_add</span> Kullanıcı Eklendi
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                <div className="text-xs text-slate-500">Yeni kullanıcı profili oluşturuldu</div>
                                                <div className="flex items-center gap-2 font-mono text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded border border-purple-100 w-fit">
                                                    Yeni Kullanıcı: John Doe (İzleyici)
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="group relative inline-flex">
                                                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 cursor-help">
                                                    <span className="material-symbols-outlined text-[16px]">verified</span>
                                                    <span className="text-xs font-bold uppercase tracking-wider">İmzalandı</span>
                                                </div>
                                                <div className="tooltip invisible opacity-0 absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-slate-900 text-white text-xs rounded-lg shadow-xl transition-all duration-200 pointer-events-none">
                                                    <div className="flex flex-col gap-2">
                                                        <div>
                                                            <span className="text-slate-400 font-semibold block text-[10px] uppercase">SHA-256 Özeti</span>
                                                            <span className="font-mono text-[10px] break-all text-emerald-400">77b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b123</span>
                                                        </div>
                                                        <div className="border-t border-slate-700 pt-2">
                                                            <span className="text-slate-400 font-semibold block text-[10px] uppercase">TSA Sertifikası</span>
                                                            <span className="font-mono text-[10px]">DigiCert Zaman Damgası 2023</span>
                                                        </div>
                                                    </div>
                                                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-2 border-4 border-transparent border-t-slate-900"></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-mono">
                                            192.168.1.45
                                        </td>
                                    </tr>
                                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors bg-red-50/30">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-mono">
                                            23 Eki 2023 <br />
                                            <span className="text-slate-400 text-xs">14:10:05 UTC</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-9 w-9 flex-shrink-0 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold text-xs">
                                                    <span className="material-symbols-outlined text-[18px]">dns</span>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-slate-900 dark:text-white">Yönetici Konsolu</div>
                                                    <div className="text-xs text-slate-500">Sistem</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
                                                <span className="material-symbols-outlined text-[14px] mr-1">warning</span> Giriş Başarısız
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center text-sm gap-2 text-red-700">
                                                <span className="text-xs font-medium">'admin_root' kullanıcısı için çoklu başarısız giriş denemesi tespit edildi.</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="group relative inline-flex">
                                                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 cursor-help">
                                                    <span className="material-symbols-outlined text-[16px]">verified</span>
                                                    <span className="text-xs font-bold uppercase tracking-wider">İmzalandı</span>
                                                </div>
                                                <div className="tooltip invisible opacity-0 absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-slate-900 text-white text-xs rounded-lg shadow-xl transition-all duration-200 pointer-events-none">
                                                    <div className="flex flex-col gap-2">
                                                        <div>
                                                            <span className="text-slate-400 font-semibold block text-[10px] uppercase">SHA-256 Özeti</span>
                                                            <span className="font-mono text-[10px] break-all text-emerald-400">99b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b666</span>
                                                        </div>
                                                        <div className="border-t border-slate-700 pt-2">
                                                            <span className="text-slate-400 font-semibold block text-[10px] uppercase">TSA Sertifikası</span>
                                                            <span className="font-mono text-[10px]">DigiCert Zaman Damgası 2023</span>
                                                        </div>
                                                    </div>
                                                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-2 border-4 border-transparent border-t-slate-900"></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-mono font-medium">
                                            203.0.113.42
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="bg-white dark:bg-slate-800 px-4 py-3 flex items-center justify-between border-t border-slate-200 dark:border-slate-700 sm:px-6 mt-auto">
                            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm text-slate-700 dark:text-slate-300">
                                        <span className="font-medium text-slate-900 dark:text-white">128</span> sonuçtan <span className="font-medium text-slate-900 dark:text-white">1</span> ile <span className="font-medium text-slate-900 dark:text-white">5</span> arası gösteriliyor
                                    </p>
                                </div>
                                <div>
                                    <nav aria-label="Pagination" className="isolate inline-flex -space-x-px rounded-md shadow-sm">
                                        <a className="relative inline-flex items-center rounded-l-md px-2 py-2 text-slate-400 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus:z-20 focus:outline-offset-0" href="#">
                                            <span className="sr-only">Önceki</span>
                                            <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                                        </a>
                                        <a aria-current="page" className="relative z-10 inline-flex items-center bg-primary px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary" href="#">1</a>
                                        <a className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-slate-900 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus:z-20 focus:outline-offset-0 dark:text-white dark:ring-slate-700 dark:hover:bg-slate-700" href="#">2</a>
                                        <a className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-slate-900 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus:z-20 focus:outline-offset-0 dark:text-white dark:ring-slate-700 dark:hover:bg-slate-700" href="#">3</a>
                                        <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-slate-700 ring-1 ring-inset ring-slate-300 focus:outline-offset-0 dark:text-slate-400 dark:ring-slate-700">...</span>
                                        <a className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-slate-900 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus:z-20 focus:outline-offset-0 dark:text-white dark:ring-slate-700 dark:hover:bg-slate-700" href="#">12</a>
                                        <a className="relative inline-flex items-center rounded-r-md px-2 py-2 text-slate-400 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus:z-20 focus:outline-offset-0" href="#">
                                            <span className="sr-only">Sonraki</span>
                                            <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                                        </a>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
}
