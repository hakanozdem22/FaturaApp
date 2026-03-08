import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Loader2, CheckCircle2, Search, Trash2, AlertTriangle, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { logAction } from '../lib/logger';

interface Invoice {
    id: string;
    invoice_no: string;
    company_name?: string;
    submission_date: string;
    amount: number;
    status: string;
    file_url?: string;
}

export default function ApprovedInvoicesScreen() {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean, id: string, invoiceNo: string }>({ isOpen: false, id: '', invoiceNo: '' });
    const [isDeleting, setIsDeleting] = useState(false);
    const { user, profile } = useAuth();

    const fetchApprovedInvoices = async () => {
        setIsLoading(true);
        try {
            let query = supabase
                .from('invoices')
                .select('*')
                .eq('status', 'Onaylandı')
                .order('created_at', { ascending: false });

            // Müdürler sadece kendi onayladıkları faturaları görsün
            if (profile?.role === 'manager' && user?.id) {
                query = query.eq('approved_by', user.id);
            }

            const { data, error } = await query;

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
        fetchApprovedInvoices();
    }, []);

    const handleDeleteClick = (id: string, invoiceNo: string) => {
        setDeleteModal({ isOpen: true, id, invoiceNo });
    };

    const confirmDelete = async () => {
        setIsDeleting(true);
        try {
            // Faturayı bul (Dosya URL'sini almak için)
            const invoiceToDelete = invoices.find(inv => inv.id === deleteModal.id);

            // Veritabanından sil
            const { error } = await supabase
                .from('invoices')
                .delete()
                .eq('id', deleteModal.id);

            if (error) {
                console.error("Fatura silme hatası:", error);
                // Instead of alert, we could use a toast, but for now we just close the modal
                // and maybe we should have a generic error state, but let's keep it simple
            } else {
                // UI'ı güncelle
                setInvoices(prev => prev.filter(inv => inv.id !== deleteModal.id));

                // Eğer varsa Supabase Storage'dan dosyasını da kalıcı olarak sil
                if (invoiceToDelete?.file_url) {
                    const matches = invoiceToDelete.file_url.match(/\/invoices-pdfs\/(.+)$/);
                    if (matches && matches[1]) {
                        const filePath = matches[1];
                        const { error: storageError } = await supabase.storage
                            .from('invoices-pdfs')
                            .remove([filePath]);

                        if (storageError) console.error("Storage silme hatası:", storageError);
                    }
                }

                await logAction(
                    user?.email,
                    'Onaylı Fatura Silme',
                    `Onaylı fatura silindi: Fatura No #${deleteModal.invoiceNo} (ID: ${deleteModal.id})`
                );
            }
        } catch (err) {
            console.error("Beklenmeyen hata:", err);
        } finally {
            setIsDeleting(false);
            setDeleteModal({ isOpen: false, id: '', invoiceNo: '' });
        }
    };

    const filteredInvoices = invoices.filter(invoice =>
        invoice.company_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        invoice.invoice_no?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 p-8">
            <header className="flex flex-col gap-1">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Onaylanan Faturalar</h2>
                <p className="text-slate-500 dark:text-slate-400">Sistemde onaylanmış olan tüm faturaları buradan görüntüleyebilir ve arayabilirsiniz.</p>
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
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-lg border border-emerald-200 dark:border-emerald-800/50">
                        <CheckCircle2 size={18} />
                        <span className="font-medium text-sm">Toplam {invoices.length} Onaylı Fatura</span>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-slate-900 dark:text-white">Şirket/Firma</th>
                                <th className="px-6 py-4 font-semibold text-slate-900 dark:text-white">Fatura No</th>
                                <th className="px-6 py-4 font-semibold text-slate-900 dark:text-white">Gönderim Tarihi</th>
                                <th className="px-6 py-4 font-semibold text-slate-900 dark:text-white">Tutar</th>
                                <th className="px-6 py-4 font-semibold text-slate-900 dark:text-white text-right">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                        <div className="flex justify-center items-center gap-2">
                                            <Loader2 className="animate-spin" size={24} /> Veriler yükleniyor...
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredInvoices.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center justify-center">
                                            <CheckCircle2 size={40} className="text-emerald-400/50 mb-3" />
                                            <p className="text-slate-500 font-medium">Fatura bulunamadı.</p>
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
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {invoice.file_url ? (
                                                    <a href={invoice.file_url} target="_blank" rel="noopener noreferrer"
                                                        className="inline-flex items-center justify-center p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                                        title="Dosyayı Gör">
                                                        <span className="material-symbols-outlined text-[20px]">visibility</span>
                                                    </a>
                                                ) : (
                                                    <span className="text-slate-300 dark:text-slate-700 w-9 text-center">-</span>
                                                )}
                                                <button
                                                    onClick={() => handleDeleteClick(invoice.id, invoice.invoice_no)}
                                                    className="inline-flex items-center justify-center p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                    title="Faturayı Sil"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Custom Delete Confirmation Modal */}
            {deleteModal.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200 dark:border-slate-800">
                        <div className="flex justify-between items-start p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400 shrink-0">
                                    <AlertTriangle size={20} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Faturayı Sil</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Bu işlem geri alınamaz</p>
                                </div>
                            </div>
                            <button
                                onClick={() => !isDeleting && setDeleteModal({ isOpen: false, id: '', invoiceNo: '' })}
                                className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 p-1.5 rounded-lg transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6">
                            <p className="text-slate-600 dark:text-slate-300">
                                <span className="font-bold text-slate-900 dark:text-white">{deleteModal.invoiceNo}</span> numaralı faturayı silmek istediğinize emin misiniz? Fatura kalıcı olarak silinecek ve sistemden kaldırılacaktır.
                            </p>
                        </div>
                        <div className="p-5 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/80">
                            <button
                                onClick={() => setDeleteModal({ isOpen: false, id: '', invoiceNo: '' })}
                                disabled={isDeleting}
                                className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-700 transition-colors"
                            >
                                İptal
                            </button>
                            <button
                                onClick={confirmDelete}
                                disabled={isDeleting}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 transition-colors disabled:opacity-50"
                            >
                                {isDeleting ? (
                                    <>
                                        <Loader2 className="animate-spin" size={16} />
                                        Siliniyor...
                                    </>
                                ) : (
                                    <>
                                        <Trash2 size={16} />
                                        Evet, Sil
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
