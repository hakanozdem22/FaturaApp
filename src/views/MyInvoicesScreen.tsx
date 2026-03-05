import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { Loader2, Search, FileText } from 'lucide-react';

interface Invoice {
    id: string;
    invoice_no: string;
    company_name?: string;
    submission_date: string;
    amount: number;
    status: string;
    file_url?: string;
}

export default function MyInvoicesScreen() {
    const { user } = useAuth();
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('Tümü');

    const fetchMyInvoices = async () => {
        if (!user) return;
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('invoices')
                .select('*')
                .eq('user_id', user.id)
                .in('status', ['Onaylandı', 'Reddedildi'])
                .order('updated_at', { ascending: false });

            if (error) {
                console.error("Fatura çekme hatası:", error);
            } else {
                setInvoices(data || []);
            }
        } catch (err) {
            console.error("Beklenmeyen hata:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMyInvoices();
    }, [user]);

    const filteredInvoices = invoices.filter(invoice =>
        (statusFilter === 'Tümü' || invoice.status === statusFilter) &&
        (invoice.company_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            invoice.invoice_no?.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const StatusBadge = ({ status }: { status: string }) => {
        if (status === 'Onaylandı') {
            return <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">{status}</span>;
        }
        if (status === 'Reddedildi') {
            return <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900/30 dark:text-red-400">{status}</span>;
        }
        return <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-800 dark:bg-slate-800 dark:text-slate-400">{status}</span>;
    };

    return (
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 p-8">
            <header className="flex flex-col gap-1">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Faturalarım</h2>
                <p className="text-slate-500 dark:text-slate-400">Yönetici tarafından onaylanan veya reddedilen geçmiş faturalarınızı buradan takip edebilirsiniz.</p>
            </header>

            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
                <div className="relative w-full sm:max-w-md">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search size={18} className="text-slate-400" />
                    </div>
                    <input
                        className="block w-full pl-10 pr-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                        placeholder="Şirket adı veya fatura no ile ara..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        type="text"
                    />
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="block w-full pl-3 pr-10 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary rounded-lg text-slate-700 dark:text-slate-300"
                    >
                        <option value="Tümü">Tüm Durumlar</option>
                        <option value="Onaylandı">Onaylananlar</option>
                        <option value="Reddedildi">Reddedilenler</option>
                    </select>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-slate-900 dark:text-white">Şirket/Firma</th>
                                <th className="px-6 py-4 font-semibold text-slate-900 dark:text-white">Fatura No</th>
                                <th className="px-6 py-4 font-semibold text-slate-900 dark:text-white">Tarih</th>
                                <th className="px-6 py-4 font-semibold text-slate-900 dark:text-white">Tutar</th>
                                <th className="px-6 py-4 font-semibold text-slate-900 dark:text-white">Durum</th>
                                <th className="px-6 py-4 font-semibold text-slate-900 dark:text-white text-right">Detay</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                                        <div className="flex justify-center items-center gap-2">
                                            <Loader2 className="animate-spin" size={24} /> Veriler yükleniyor...
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredInvoices.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center justify-center">
                                            <FileText size={40} className="text-slate-300 dark:text-slate-600 mb-3" />
                                            <p className="text-slate-500 font-medium">İşlem görmüş fatura bulunmuyor.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredInvoices.map((invoice) => (
                                    <tr key={invoice.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                                            {invoice.company_name || <span className="text-slate-400 italic">Bilinmiyor</span>}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-slate-500 dark:text-slate-400">{invoice.invoice_no}</td>
                                        <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                                            {new Date(invoice.submission_date).toLocaleDateString('tr-TR')}
                                        </td>
                                        <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">
                                            ₺{invoice.amount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                                        </td>
                                        <td className="px-6 py-4">
                                            <StatusBadge status={invoice.status} />
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {invoice.file_url ? (
                                                <a href={invoice.file_url} target="_blank" rel="noopener noreferrer"
                                                    className="inline-flex items-center justify-center p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                                    title="Dosyayı Gör">
                                                    <span className="material-symbols-outlined text-[20px]">visibility</span>
                                                </a>
                                            ) : (
                                                <span className="text-slate-300 dark:text-slate-700">-</span>
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
    );
}
