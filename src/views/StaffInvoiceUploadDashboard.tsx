import { useState, useRef, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { FileUp, Loader2, CheckCircle2, AlertCircle, ScanText } from 'lucide-react';
import { extractInvoiceData } from '../utils/ocrService';
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
    user_id?: string;
    document_type?: string;
    assigned_manager_id?: string;
}

interface Manager {
    id: string;
    full_name: string;
    email: string;
}

export default function StaffInvoiceUploadDashboard() {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState<{ type: 'idle' | 'info' | 'success' | 'error', message: string }>({ type: 'idle', message: '' });
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [invoiceToDelete, setInvoiceToDelete] = useState<{ id: string, fileUrl: string | undefined } | null>(null);
    const [managers, setManagers] = useState<Manager[]>([]);
    const { user, profile } = useAuth();

    // YENİ: Ön izleme modalı state'leri
    const [showPreviewModal, setShowPreviewModal] = useState(false);
    const [pendingInvoiceData, setPendingInvoiceData] = useState<Omit<Invoice, 'id'> | null>(null);
    const [previewFileUrl, setPreviewFileUrl] = useState<string | null>(null);
    const [previewFileType, setPreviewFileType] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    // Faturaları Supabase'den çek
    const fetchInvoices = async () => {
        if (!user) return;
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('invoices')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

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

    const fetchManagers = async () => {
        try {
            const { data, error } = await supabase
                .from('users')
                .select('id, full_name, email')
                .eq('role', 'manager')
                .eq('status', 'active');

            if (error) {
                console.error("Müdürleri çekme hatası:", error);
            } else {
                setManagers(data || []);
            }
        } catch (err) {
            console.error("Beklenmeyen hata:", err);
        }
    };

    useEffect(() => {
        if (user) {
            fetchInvoices();
            fetchManagers();
        }
    }, [user]);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Dosya boyutu kontrolü (Maks 20MB)
        if (file.size > 20 * 1024 * 1024) {
            setUploadStatus({ type: 'error', message: 'Dosya boyutu 20MB\'dan küçük olmalıdır.' });
            return;
        }

        setIsUploading(true);
        setUploadStatus({ type: 'info', message: 'Belge Hazırlanıyor...' });

        try {
            // --- YENİ EKLENEN OCR AŞAMASI ---
            setUploadStatus({ type: 'info', message: 'Belgeden metin çıkarılıyor (OCR)... Bu işlem biraz sürebilir.' });
            const extractedData = await extractInvoiceData(file);

            setUploadStatus({ type: 'info', message: 'Belge buluta yükleniyor...' });

            // DOSYAYI STORAGE'A YÜKLE
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
            const filePath = `uploads/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('invoices-pdfs')
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            // Dosyanın public URL'sini al
            const { data: { publicUrl } } = supabase.storage
                .from('invoices-pdfs')
                .getPublicUrl(filePath);

            // GEÇİCİ VERİLERİ STATE'E KAYDET VE MODALI AÇ (Veritabanına HENÜZ kaydetme)
            const generateFallbackInvoiceNo = () => `INV-OCR-${Math.floor(Math.random() * 1000)}`;
            const todayStr = new Date().toISOString().split('T')[0];

            setPendingInvoiceData({
                invoice_no: extractedData.invoice_no || generateFallbackInvoiceNo(),
                company_name: extractedData.company_name || 'Bilinmiyor (OCR)',
                submission_date: extractedData.submission_date || todayStr,
                amount: extractedData.amount || (Math.floor(Math.random() * 5000) + 100),
                status: 'Bekliyor',
                file_url: publicUrl,
                user_id: user?.id,
                document_type: profile?.role === 'irsaliye' ? 'İrsaliye' : profile?.role === 'user' ? 'Fatura' : '', // Başlangıçta zorunlu ise otomatik seç
                assigned_manager_id: '', // Başlangıçta boş
            });

            setPreviewFileUrl(URL.createObjectURL(file)); // Daha hızlı önizleme için local object url
            setPreviewFileType(file.type);
            setShowPreviewModal(true);

        } catch (error: unknown) {
            console.error('Yükleme hatası:', error);
            const errorMessage = error instanceof Error ? error.message : 'Yükleme sırasında bir hata oluştu.';
            setUploadStatus({ type: 'error', message: errorMessage });
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = ''; // Input'u temizle
            }
            // Hata varsa 5 sn sonra gizle
            setTimeout(() => setUploadStatus({ type: 'idle', message: '' }), 5000);
        }
    };

    const handleConfirmSubmit = async () => {
        if (!pendingInvoiceData) return;

        // Validasyonlar
        if (!pendingInvoiceData.document_type) {
            setUploadStatus({ type: 'error', message: 'Lütfen belge tipini (Fatura/İrsaliye) seçiniz.' });
            return;
        }

        if (!pendingInvoiceData.assigned_manager_id) {
            setUploadStatus({ type: 'error', message: 'Lütfen belgeyi onaylayacak müdürü seçiniz.' });
            return;
        }

        setUploadStatus({ type: 'info', message: 'Belge sisteme kaydediliyor...' });
        setShowPreviewModal(false);

        try {
            const { error: dbError } = await supabase
                .from('invoices')
                .insert([pendingInvoiceData]);

            if (dbError) {
                console.error("Veritabanı kayıt hatası:", dbError);
                throw new Error("Belge bilgileri kaydedilemedi.");
            }

            setUploadStatus({ type: 'success', message: 'Belge onaya başarıyla gönderildi.' });
            fetchInvoices(); // Listeyi yenile

            // YENİ: Başarılı Yükleme Logu
            await logAction(
                user?.email,
                'Belge Yükleme',
                `${pendingInvoiceData.document_type} yüklendi: ${pendingInvoiceData.invoice_no} (${pendingInvoiceData.company_name}) - ${pendingInvoiceData.document_type === 'İrsaliye' ? `${pendingInvoiceData.amount} kg` : `₺${pendingInvoiceData.amount}`}`
            );

            setPendingInvoiceData(null);
        } catch (error: unknown) {
            console.error('Kayıt hatası:', error);
            const errorMessage = error instanceof Error ? error.message : 'Kayıt sırasında bir hata oluştu.';
            setUploadStatus({ type: 'error', message: errorMessage });
            setShowPreviewModal(true); // Hata durumunda modalı geri açabiliriz
        }
    };

    const handleDeleteClick = (id: string, fileUrl: string | undefined) => {
        setInvoiceToDelete({ id, fileUrl });
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        if (!invoiceToDelete) return;

        const { id, fileUrl } = invoiceToDelete;
        setShowDeleteModal(false);
        setInvoiceToDelete(null);

        try {
            // 1. Veritabanından sil
            const { error: dbError } = await supabase
                .from('invoices')
                .delete()
                .eq('id', id);

            if (dbError) throw dbError;

            // 2. Storage'dan sil (Eğer dosya varsa)
            if (fileUrl) {
                // publicUrl'den dosya adını/yolunu çıkar: /storage/v1/object/public/invoices-pdfs/uploads/dosyadi.pdf
                const matches = fileUrl.match(/\/invoices-pdfs\/(.+)$/);
                if (matches && matches[1]) {
                    const filePath = matches[1];
                    const { error: storageError } = await supabase.storage
                        .from('invoices-pdfs')
                        .remove([filePath]);

                    if (storageError) console.error("Storage silme hatası:", storageError);
                }
            }

            // Listeyi UI'da güncelle
            setInvoices(invoices.filter(inv => inv.id !== id));
            setUploadStatus({ type: 'success', message: 'Belge başarıyla silindi.' });

            // YENİ: Başarılı Silme Logu
            await logAction(
                user?.email,
                'Belge Silme (Kullanıcı İşlemi)',
                `Bekleyen belge silindi: ID = ${id}`
            );

            setTimeout(() => setUploadStatus({ type: 'idle', message: '' }), 3000);

        } catch (error: unknown) {
            console.error('Silme hatası:', error);
            setUploadStatus({ type: 'error', message: 'Belge silinirken bir hata oluştu.' });
            setTimeout(() => setUploadStatus({ type: 'idle', message: '' }), 5000);
        }
    };

    const StatusBadge = ({ status }: { status: string }) => {
        switch (status) {
            case 'Bekliyor':
                return <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">{status}</span>;
            case 'Onaylandı':
                return <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">{status}</span>;
            case 'Reddedildi':
                return <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900/30 dark:text-red-400">{status}</span>;
            default:
                return <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-800 dark:bg-slate-800 dark:text-slate-400">{status}</span>;
        }
    };

    return (
        <>
            {/* Modal: PDF ve OCR Önizleme Onayı */}
            {showPreviewModal && pendingInvoiceData && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
                    <div className="w-full max-w-5xl max-h-[90vh] flex flex-col md:flex-row rounded-2xl bg-white shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden">

                        {/* Sol Taraf: Medya Önizleme (Şimdi Daha Büyük) */}
                        <div className="w-full md:w-3/5 bg-slate-100 dark:bg-slate-950 p-4 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 min-h-[400px] flex flex-col">
                            <h3 className="text-sm font-semibold text-slate-500 mb-3 flex items-center gap-2">
                                <ScanText size={16} /> Orijinal Belge
                            </h3>
                            <div className="flex-1 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex justify-center items-center">
                                {previewFileType?.includes('pdf') ? (
                                    <embed src={previewFileUrl || ''} type="application/pdf" className="w-full h-full object-contain" />
                                ) : (
                                    <img src={previewFileUrl || ''} alt="Belge" className="max-w-full max-h-full object-contain p-2" />
                                )}
                            </div>
                        </div>

                        {/* Sağ Taraf: OCR Bilgileri ve Onay (Form) */}
                        <div className="w-full md:w-2/5 p-6 flex flex-col justify-between overflow-y-auto">
                            <div>
                                <div className="border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                        <CheckCircle2 className="text-emerald-500" />
                                        Onaya Gönder
                                    </h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Belge detaylarını kontrol edip onaya asistan müdürü seçiniz.</p>

                                    {/* Uyarı Mesajı */}
                                    <div className="mt-3 flex items-start gap-2 bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-400 p-3 rounded-lg border border-amber-200 dark:border-amber-800/50">
                                        <AlertCircle size={18} className="mt-0.5 shrink-0" />
                                        <p className="text-sm">Lütfen yapay zekanın çıkardığı bilgileri kontrol ediniz. Eğer eksik veya yanlış varsa, <strong>göndermeden önce aşağıdaki alanlardan düzeltebilirsiniz.</strong></p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="bg-slate-50 border border-slate-100 dark:bg-slate-800/50 dark:border-slate-800 p-4 rounded-xl flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center text-lg font-bold flex-shrink-0 border border-primary/20">
                                            {profile?.full_name ? profile.full_name[0].toUpperCase() : 'U'}
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">Yükleyen Personel</p>
                                            <p className="text-sm font-semibold text-slate-900 dark:text-white">{profile?.full_name || user?.email}</p>
                                        </div>
                                    </div>

                                    {/* Düzenlenebilir Form Alanları */}
                                    <div className="space-y-3">
                                        <div className="grid grid-cols-2 gap-3 mb-2">
                                            <div>
                                                <label className="text-xs font-bold text-red-500 dark:text-red-400 mb-1 block">Belge Tipi *</label>
                                                <select
                                                    value={pendingInvoiceData.document_type || ''}
                                                    onChange={(e) => setPendingInvoiceData({ ...pendingInvoiceData, document_type: e.target.value })}
                                                    className="w-full text-sm font-medium text-slate-900 dark:text-white bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/50 p-2.5 rounded-lg focus:ring-2 focus:ring-red-500 outline-none transition-all"
                                                    disabled={profile?.role === 'irsaliye' || profile?.role === 'user'}
                                                >
                                                    {profile?.role !== 'irsaliye' && profile?.role !== 'user' && <option value="" disabled>Seçiniz...</option>}
                                                    {profile?.role !== 'irsaliye' && <option value="Fatura">Fatura</option>}
                                                    {profile?.role !== 'user' && <option value="İrsaliye">İrsaliye</option>}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-red-500 dark:text-red-400 mb-1 block">Onaylayacak Müdür *</label>
                                                <select
                                                    value={pendingInvoiceData.assigned_manager_id || ''}
                                                    onChange={(e) => setPendingInvoiceData({ ...pendingInvoiceData, assigned_manager_id: e.target.value })}
                                                    className="w-full text-sm font-medium text-slate-900 dark:text-white bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/50 p-2.5 rounded-lg focus:ring-2 focus:ring-red-500 outline-none transition-all"
                                                >
                                                    <option value="" disabled>Müdür Seçin...</option>
                                                    {managers.map(manager => (
                                                        <option key={manager.id} value={manager.id}>
                                                            {manager.full_name || manager.email}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 block">Şirket/Ünvan</label>
                                            <input
                                                type="text"
                                                value={pendingInvoiceData.company_name || ''}
                                                onChange={(e) => setPendingInvoiceData({ ...pendingInvoiceData, company_name: e.target.value })}
                                                className="w-full text-sm font-medium text-slate-900 dark:text-white bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-2.5 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                                                placeholder="Şirket adı giriniz..."
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 block">Belge/Fatura Numarası</label>
                                                <input
                                                    type="text"
                                                    value={pendingInvoiceData.invoice_no || ''}
                                                    onChange={(e) => setPendingInvoiceData({ ...pendingInvoiceData, invoice_no: e.target.value })}
                                                    className="w-full text-sm font-medium text-slate-900 dark:text-white bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-2.5 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 block">Tarih</label>
                                                <input
                                                    type="text"
                                                    value={pendingInvoiceData.submission_date || ''}
                                                    onChange={(e) => setPendingInvoiceData({ ...pendingInvoiceData, submission_date: e.target.value })}
                                                    className="w-full text-sm font-medium text-slate-900 dark:text-white bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-2.5 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-xs font-medium text-emerald-600 dark:text-emerald-400 mb-1 block">
                                                {pendingInvoiceData.document_type === 'İrsaliye' ? 'Toplam Ağırlık/Miktar (kg)' : 'Toplam Tutar (₺)'}
                                            </label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={pendingInvoiceData.amount || 0}
                                                onChange={(e) => setPendingInvoiceData({ ...pendingInvoiceData, amount: parseFloat(e.target.value) || 0 })}
                                                className="w-full text-lg font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800/50 p-2.5 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 justify-end mt-8 border-t border-slate-100 dark:border-slate-800 pt-5">
                                <button
                                    onClick={() => { setShowPreviewModal(false); setPendingInvoiceData(null); }}
                                    className="px-5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 font-medium hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700 transition"
                                >
                                    İptal Et
                                </button>
                                <button
                                    onClick={handleConfirmSubmit}
                                    className="px-5 py-2.5 rounded-xl bg-primary text-white font-medium hover:bg-primary/90 flex items-center gap-2 transition"
                                >
                                    Gönder <span className="material-symbols-outlined text-[18px]">send</span>
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/30">
                                <AlertCircle size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Belgeyi Sil</h3>
                        </div>
                        <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
                            Bu belgeyi ve bağlı olduğu PDF dosyasını kalıcı olarak silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
                        </p>
                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                onClick={() => { setShowDeleteModal(false); setInvoiceToDelete(null); }}
                                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700/50"
                            >
                                İptal
                            </button>
                            <button
                                onClick={handleConfirmDelete}
                                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 dark:hover:bg-red-500"
                            >
                                Sil
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 p-8">
                {/*  Header  */}
                <header className="flex flex-col gap-1">
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                        {profile?.role === 'irsaliye' ? 'İrsaliye Paneli' : profile?.role === 'user' ? 'Fatura Paneli' : 'Fatura / İrsaliye Paneli'}
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400">Onay için gönderdiğiniz son belgeleri yönetin ve takip edin.</p>
                </header>

                {/*  Stats Overview */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                                <span className="material-symbols-outlined">pending_actions</span>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">İnceleme Bekliyor</p>
                                <p className="text-xl font-bold text-slate-900 dark:text-white">{invoices.filter(i => i.status === 'Bekliyor').length}</p>
                            </div>
                        </div>
                    </div>
                    {/* Diğer stat kartları da benzer şekilde güncellenebilir */}
                    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                                <span className="material-symbols-outlined">check_circle</span>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Onaylananlar</p>
                                <p className="text-xl font-bold text-slate-900 dark:text-white">{invoices.filter(i => i.status === 'Onaylandı').length}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/*  Upload Section  */}
                <div className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <div className="border-b border-slate-100 p-6 dark:border-slate-800 flex justify-between items-center">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Yeni Belge Yükle</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Belgelerinizi güvenli bir şekilde aktarın.</p>
                        </div>
                        {uploadStatus.message && (
                            <div className={`text-sm px-4 py-2 rounded-md flex items-center gap-2 
                                ${uploadStatus.type === 'success' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'
                                    : uploadStatus.type === 'info' ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                                        : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'}`}>
                                {uploadStatus.type === 'success' ? <CheckCircle2 size={16} /> : uploadStatus.type === 'info' ? <Loader2 className="animate-spin" size={16} /> : <AlertCircle size={16} />}
                                {uploadStatus.message}
                            </div>
                        )}
                    </div>
                    <div className="p-6">
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept=".pdf, .jpg, .jpeg, .png"
                            className="hidden"
                            id="file-upload"
                            disabled={isUploading}
                        />
                        <label htmlFor="file-upload" className={`group relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 py-12 text-center transition-colors cursor-pointer ${isUploading ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary hover:bg-primary/5 dark:border-slate-700 dark:bg-slate-800/50 dark:hover:border-primary dark:hover:bg-primary/10'}`}>
                            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white text-primary shadow-sm dark:bg-slate-800">
                                {isUploading ? <ScanText className="animate-pulse text-primary" size={32} /> : <FileUp size={32} />}
                            </div>
                            <p className="text-lg font-medium text-slate-900 dark:text-white">
                                {isUploading ? 'Yapay Zeka Belgeyi İnceliyor...' : profile?.role === 'irsaliye' ? 'İrsaliyenizi (PDF/Fotoğraf) seçmek için tıklayın' : profile?.role === 'user' ? 'Faturanızı (PDF/Fotoğraf) seçmek için tıklayın' : 'Fatura veya İrsaliyenizi (PDF/Fotoğraf) seçmek için tıklayın'}
                            </p>
                            <p className="mt-4 text-xs text-slate-400 dark:text-slate-500">
                                Desteklenen formatlar: PDF, JPG, PNG (Maks 20MB)
                            </p>
                        </label>
                    </div>
                </div>

                {/*  Recent Uploads Table  */}
                <div className="flex flex-col gap-4">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Son Yüklenenler (Veritabanı)</h3>
                    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[600px] text-left text-sm">
                                <thead className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/50">
                                    <tr>
                                        <th className="px-6 py-4 font-semibold text-slate-900 dark:text-white">Belge Tipi</th>
                                        <th className="px-6 py-4 font-semibold text-slate-900 dark:text-white">Şirket/Firma</th>
                                        <th className="px-6 py-4 font-semibold text-slate-900 dark:text-white">Belge No</th>
                                        <th className="px-6 py-4 font-semibold text-slate-900 dark:text-white">Gönderim Tarihi</th>
                                        <th className="px-6 py-4 font-semibold text-slate-900 dark:text-white">Tutar/Miktar</th>
                                        <th className="px-6 py-4 font-semibold text-slate-900 dark:text-white">Durum</th>
                                        <th className="px-6 py-4 font-semibold text-slate-900 dark:text-white text-right">Dosya</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                                    {isLoading ? (
                                        <tr>
                                            <td colSpan={7} className="px-6 py-8 text-center text-slate-500">
                                                <div className="flex justify-center items-center gap-2">
                                                    <Loader2 className="animate-spin" size={20} /> Veriler yükleniyor...
                                                </div>
                                            </td>
                                        </tr>
                                    ) : invoices.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="px-6 py-8 text-center text-slate-500">
                                                Henüz belge yüklenmemiş.
                                            </td>
                                        </tr>
                                    ) : (
                                        invoices.map((invoice) => (
                                            <tr key={invoice.id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium border ${invoice.document_type === 'İrsaliye'
                                                        ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800/50'
                                                        : 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800/50'
                                                        }`}>
                                                        {invoice.document_type || 'Belirtilmedi'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                                                    {invoice.company_name || <span className="text-slate-400 italic">Bilinmiyor</span>}
                                                </td>
                                                <td className="px-6 py-4 font-medium text-slate-500 dark:text-slate-400">{invoice.invoice_no}</td>
                                                <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                                                    {new Date(invoice.submission_date).toLocaleDateString('tr-TR')}
                                                </td>
                                                <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                                                    {invoice.document_type === 'İrsaliye'
                                                        ? `${invoice.amount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} kg`
                                                        : `₺${invoice.amount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}`}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <StatusBadge status={invoice.status} />
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        {invoice.file_url && (
                                                            <a href={invoice.file_url} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-primary dark:hover:text-primary transition-colors inline-block" title="Dosyayı Gör">
                                                                <span className="material-symbols-outlined text-[20px]">visibility</span>
                                                            </a>
                                                        )}
                                                        <button
                                                            onClick={() => handleDeleteClick(invoice.id, invoice.file_url)}
                                                            className="text-slate-400 hover:text-red-500 transition-colors inline-block"
                                                            title="Faturayı Sil"
                                                        >
                                                            <span className="material-symbols-outlined text-[20px]">delete</span>
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
                </div>
            </div>
        </>
    );
}
