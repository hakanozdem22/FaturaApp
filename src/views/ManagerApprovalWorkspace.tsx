import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Loader2, CheckCircle2, AlertCircle, XCircle, Search, X, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { logAction } from '../lib/logger';
import { PDFDocument } from 'pdf-lib';
import { v4 as uuidv4 } from 'uuid';

interface Invoice {
  id: string;
  invoice_no: string;
  company_name?: string;
  submission_date: string;
  amount: number;
  status: string;
  file_url?: string;
  document_type?: string;
  assigned_manager_id?: string;
}

export default function ManagerApprovalWorkspace() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [actionStatus, setActionStatus] = useState<{ type: 'idle' | 'success' | 'error', message: string }>({ type: 'idle', message: '' });
  const [isProcessing, setIsProcessing] = useState(false);
  const [rejectNote, setRejectNote] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuth();

  const fetchPendingInvoices = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('invoices')
        .select('*')
        .eq('status', 'Bekliyor')
        .order('created_at', { ascending: false });

      // YENİ EKLENEN FİLTRE: Kullanıcı müdür ise sadece kendisine atananları görsün
      const { data: userProfile } = await supabase.from('users').select('role').eq('id', user?.id).single();
      if (userProfile?.role === 'manager' && user?.id) {
        query = query.eq('assigned_manager_id', user.id);
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
    fetchPendingInvoices();
  }, []);

  const handleApprove = async () => {
    if (!selectedInvoice || isProcessing) return;
    setIsProcessing(true);
    try {
      let finalFileUrl = selectedInvoice.file_url;

      // Eğer PDF ise ve kullanıcının (yöneticinin) kaşesi varsa, PDF'i damgala
      const isPdf = selectedInvoice.file_url?.toLowerCase().endsWith('.pdf');
      const userProfile = user ? await supabase.from('users').select('stamp_url').eq('id', user.id).single() : null;
      const stampUrl = userProfile?.data?.stamp_url;

      if (isPdf && stampUrl && selectedInvoice.file_url) {
        setActionStatus({ type: 'idle', message: 'Kaşe ekleniyor...' });

        try {
          // 1. Orijinal PDF'i indir
          const existingPdfBytes = await fetch(selectedInvoice.file_url).then(res => res.arrayBuffer());

          // 2. Kaşeyi indir
          const stampImageBytes = await fetch(stampUrl).then(res => res.arrayBuffer());

          // 3. PDF ve Kaşe resmini oku
          const pdfDoc = await PDFDocument.load(existingPdfBytes);

          let stampImage;
          if (stampUrl.toLowerCase().includes('.png')) {
            stampImage = await pdfDoc.embedPng(stampImageBytes);
          } else {
            stampImage = await pdfDoc.embedJpg(stampImageBytes);
          }

          const pages = pdfDoc.getPages();
          // Sadece ilk sayfaya ekle
          if (pages.length > 0) {
            const firstPage = pages[0];
            const { width } = firstPage.getSize();

            // Calculate proportional size (max 150px width or 20% of page width)
            const maxStampWidth = Math.min(150, width * 0.2);
            const scaleFactor = maxStampWidth / stampImage.width;
            const stampDims = stampImage.scale(scaleFactor);

            // Calculate safe position (bottom right corner with padding)
            const paddingX = 40;
            const paddingY = 40;
            const safeX = Math.max(0, width - stampDims.width - paddingX);
            const safeY = Math.max(0, paddingY);

            // Kaşeyi güvenli koordinatlara yerleştir
            firstPage.drawImage(stampImage, {
              x: safeX,
              y: safeY,
              width: stampDims.width,
              height: stampDims.height,
            });
          }

          // 4. Yeni PDF'i kaydet
          const pdfBytes = await pdfDoc.save();

          // 5. Yeni PDF'i Supabase Storage'a yükle (invoices-pdfs/stamped)
          const newFileName = `stamped_${uuidv4()}.pdf`;
          const pdfBlob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });

          const { error: uploadError } = await supabase.storage
            .from('invoices-pdfs')
            .upload(`stamped/${newFileName}`, pdfBlob, {
              contentType: 'application/pdf',
            });

          if (uploadError) throw new Error("Damgalı PDF yüklenemedi: " + uploadError.message);

          // 6. Yeni dosyanın public URL'sini al
          const { data: { publicUrl } } = supabase.storage
            .from('invoices-pdfs')
            .getPublicUrl(`stamped/${newFileName}`);

          finalFileUrl = publicUrl;
          setActionStatus({ type: 'idle', message: 'Belge onaylanıyor...' });
        } catch (pdfError) {
          console.error("PDF Damgalama Hatası:", pdfError);
          // Hata olursa damgasız onaya devam et (opsiyonel)
          setActionStatus({ type: 'error', message: 'Kaşe eklenemedi, normal onay yapılıyor...' });
        }
      }

      const { error } = await supabase
        .from('invoices')
        .update({ status: 'Onaylandı', file_url: finalFileUrl, approved_by: user?.id })
        .eq('id', selectedInvoice.id);

      if (error) throw error;

      setActionStatus({ type: 'success', message: `Belge #${selectedInvoice.invoice_no} onaylandı.` });

      // YENİ: Başarılı Onay Logu
      await logAction(
        user?.email,
        'Belge Onaylama',
        `${selectedInvoice.document_type || 'Belge'} #${selectedInvoice.invoice_no} onaylandı: ${selectedInvoice.document_type === 'İrsaliye' ? `${selectedInvoice.amount} kg` : `₺${selectedInvoice.amount}`}`
      );

      setSelectedInvoice(null);
      await fetchPendingInvoices();
    } catch (error) {
      console.error('Onay hatası:', error);
      setActionStatus({ type: 'error', message: 'Belge onaylanırken bir hata oluştu.' });
    } finally {
      setIsProcessing(false);
      setTimeout(() => setActionStatus({ type: 'idle', message: '' }), 4000);
    }
  };

  const handleReject = async () => {
    if (!selectedInvoice || isProcessing) return;
    setIsProcessing(true);
    try {
      const { error } = await supabase
        .from('invoices')
        .update({ status: 'Reddedildi' })
        .eq('id', selectedInvoice.id);

      if (error) throw error;

      setActionStatus({ type: 'success', message: `Belge #${selectedInvoice.invoice_no} reddedildi.` });

      // YENİ: Başarılı Red Logu
      await logAction(
        user?.email,
        'Belge Reddetme',
        `${selectedInvoice.document_type || 'Belge'} #${selectedInvoice.invoice_no} reddedildi. Not: ${rejectNote || 'Belirtilmedi'}`
      );

      setRejectNote('');
      setSelectedInvoice(null);
      await fetchPendingInvoices();
    } catch (error) {
      console.error('Red hatası:', error);
      setActionStatus({ type: 'error', message: 'Belge reddedilirken bir hata oluştu.' });
    } finally {
      setIsProcessing(false);
      setTimeout(() => setActionStatus({ type: 'idle', message: '' }), 4000);
    }
  };

  const filteredInvoices = invoices.filter(invoice =>
    invoice.company_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    invoice.invoice_no?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingFaturas = filteredInvoices.filter(inv => inv.document_type !== 'İrsaliye');
  const pendingIrsaliyes = filteredInvoices.filter(inv => inv.document_type === 'İrsaliye');

  const renderTable = (data: Invoice[], title: string, emptyMessage: string) => (
    <div className="mb-2">
      <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-4 px-1">{title}</h3>
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4 font-semibold text-slate-900 dark:text-white">Şirket/Firma</th>
                <th className="px-6 py-4 font-semibold text-slate-900 dark:text-white">Belge No</th>
                <th className="px-6 py-4 font-semibold text-slate-900 dark:text-white">Gönderim Tarihi</th>
                <th className="px-6 py-4 font-semibold text-slate-900 dark:text-white">Tutar/Miktar</th>
                <th className="px-6 py-4 font-semibold text-slate-900 dark:text-white">Durum</th>
                <th className="px-6 py-4 font-semibold text-slate-900 dark:text-white text-right">İşlemler</th>
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
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <CheckCircle2 size={40} className="text-emerald-400/50 mb-3" />
                      <p className="text-slate-500 font-medium">
                        {emptyMessage}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                data.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                      {invoice.company_name || <span className="text-slate-400 italic">Bilinmiyor</span>}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-500 dark:text-slate-400">{invoice.invoice_no}</td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                      {new Date(invoice.submission_date).toLocaleDateString('tr-TR')}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">
                      {invoice.document_type === 'İrsaliye'
                        ? `${invoice.amount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} kg`
                        : `₺${invoice.amount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}`}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                        Bekliyor
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {invoice.file_url && (
                          <a href={invoice.file_url} target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center justify-center p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                            title="Dosyayı Gör">
                            <span className="material-symbols-outlined text-[20px]">visibility</span>
                          </a>
                        )}
                        <button
                          onClick={() => { setSelectedInvoice(invoice); setRejectNote(''); }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-primary bg-primary/10 hover:bg-primary/20 border border-primary/20 rounded-lg transition-colors"
                          title="İncele ve Onayla/Reddet"
                        >
                          <span className="material-symbols-outlined text-[18px]">rate_review</span>
                          İncele
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
  );

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 p-8">
      {/* Header */}
      <header className="flex flex-col gap-1">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Fatura / İrsaliye Onay Alanı</h2>
        <p className="text-slate-500 dark:text-slate-400">Bekleyen belgeleri inceleyin, onaylayın veya reddedin.</p>
      </header>

      {/* Toolbar */}
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
          {/* Status Message */}
          {actionStatus.message && (
            <div className={`text-sm px-4 py-2 rounded-lg flex items-center gap-2 transition-all
              ${actionStatus.type === 'success' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'
                : actionStatus.type === 'error' ? 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                  : 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'}`}>
              {actionStatus.type === 'success' ? <CheckCircle2 size={16} /> : actionStatus.type === 'error' ? <AlertCircle size={16} /> : <Loader2 className="animate-spin" size={16} />}
              {actionStatus.message}
            </div>
          )}
          <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 rounded-lg border border-amber-200 dark:border-amber-800/50">
            <Clock size={18} />
            <span className="font-medium text-sm">Toplam {invoices.length} Bekleyen Belge</span>
          </div>
        </div>
      </div>

      {/* Tables */}
      <div className="flex flex-col gap-8">
        {renderTable(pendingFaturas, "Onay Bekleyen Faturalar", "Bekleyen fatura bulunmuyor.")}
        {renderTable(pendingIrsaliyes, "Onay Bekleyen İrsaliyeler", "Bekleyen irsaliye bulunmuyor.")}
      </div>

      {/* Detail Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-5xl max-h-[90vh] flex flex-col md:flex-row rounded-2xl bg-white shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden">

            {/* Sol Taraf: Belge Önizleme */}
            <div className="w-full md:w-3/5 bg-slate-100 dark:bg-slate-950 p-4 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 min-h-[400px] flex flex-col">
              <h3 className="text-sm font-semibold text-slate-500 mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">description</span>
                Fatura #{selectedInvoice.invoice_no}
              </h3>
              <div className="flex-1 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex justify-center items-center">
                {selectedInvoice.file_url ? (
                  selectedInvoice.file_url.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                    <img
                      src={selectedInvoice.file_url}
                      alt={`Fatura ${selectedInvoice.invoice_no}`}
                      className="max-w-full max-h-full object-contain p-2"
                    />
                  ) : (
                    <embed
                      src={selectedInvoice.file_url}
                      type="application/pdf"
                      className="w-full h-full min-h-[500px] object-contain"
                    />
                  )
                ) : (
                  <div className="flex flex-col items-center justify-center text-slate-400 py-20">
                    <span className="material-symbols-outlined text-6xl mb-3">description</span>
                    <p className="text-sm">Dosya önizleme mevcut değil</p>
                  </div>
                )}
              </div>
            </div>

            {/* Sağ Taraf: Detay ve İşlemler */}
            <div className="w-full md:w-2/5 flex flex-col overflow-y-auto">
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-start bg-slate-50/50 dark:bg-slate-800/50">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Fatura Detayları</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Belge ile çıkarılan verileri doğrulayın.</p>
                </div>
                <button
                  onClick={() => setSelectedInvoice(null)}
                  className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 p-1.5 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Form Content */}
              <div className="flex-1 p-6 space-y-6">
                {/* Section 1: Vendor Info */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Belge Bilgileri</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tedarikçi / Şirket</label>
                      <div className="relative">
                        <input
                          className="block w-full rounded-md border-slate-300 dark:border-slate-700 shadow-sm dark:bg-slate-800 dark:text-white sm:text-sm pl-9"
                          readOnly
                          type="text"
                          value={selectedInvoice.company_name || 'Bilinmiyor'}
                        />
                        <span className="material-symbols-outlined absolute left-2.5 top-2 text-slate-400 text-lg">store</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Belge Tipi</label>
                      <div className="relative">
                        <input
                          className="block w-full rounded-md border-slate-300 dark:border-slate-700 shadow-sm dark:bg-slate-800 dark:text-white sm:text-sm pl-9"
                          readOnly
                          type="text"
                          value={selectedInvoice.document_type || 'Belirtilmedi'}
                        />
                        <span className="material-symbols-outlined absolute left-2.5 top-2 text-slate-400 text-lg">category</span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Belge No</label>
                      <div className="relative">
                        <input
                          className="block w-full rounded-md border-slate-300 dark:border-slate-700 shadow-sm dark:bg-slate-800 dark:text-white sm:text-sm pl-9"
                          readOnly
                          type="text"
                          value={selectedInvoice.invoice_no}
                        />
                        <span className="material-symbols-outlined absolute left-2.5 top-2 text-slate-400 text-lg">receipt_long</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Gönderim Tarihi</label>
                      <div className="relative">
                        <input
                          className="block w-full rounded-md border-slate-300 dark:border-slate-700 shadow-sm dark:bg-slate-800 dark:text-white sm:text-sm pl-9"
                          readOnly
                          type="text"
                          value={new Date(selectedInvoice.submission_date).toLocaleDateString('tr-TR')}
                        />
                        <span className="material-symbols-outlined absolute left-2.5 top-2 text-slate-400 text-lg">calendar_today</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="h-px bg-slate-200 dark:bg-slate-800"></div>
                {/* Section 2: Financials */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Finansal Bilgiler</h4>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                    <label className="block text-sm font-bold text-slate-900 dark:text-white mb-1">
                      {selectedInvoice.document_type === 'İrsaliye' ? 'Toplam Ağırlık/Miktar' : 'Toplam Tutar'}
                    </label>
                    <div className="text-2xl font-bold text-primary font-mono">
                      {selectedInvoice.document_type === 'İrsaliye'
                        ? `${selectedInvoice.amount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} kg`
                        : `₺${selectedInvoice.amount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}`}
                    </div>
                  </div>
                </div>
                <div className="h-px bg-slate-200 dark:bg-slate-800"></div>
                {/* Section 3: Notes */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Dahili Notlar / Red Nedeni</label>
                  <textarea
                    className="block w-full rounded-md border-slate-300 dark:border-slate-700 shadow-sm focus:border-primary focus:ring-primary dark:bg-slate-800 dark:text-white sm:text-sm"
                    placeholder="Bir yorum ekle..."
                    rows={3}
                    value={rejectNote}
                    onChange={(e) => setRejectNote(e.target.value)}
                  ></textarea>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleReject}
                    disabled={isProcessing}
                    className="flex items-center justify-center gap-2 px-4 py-3 border border-red-200 dark:border-red-900/50 rounded-lg shadow-sm text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-300 dark:hover:bg-red-900/40 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all group disabled:opacity-50"
                  >
                    {isProcessing ? <Loader2 className="animate-spin" size={18} /> : <XCircle size={18} />}
                    Reddet
                  </button>
                  <button
                    onClick={handleApprove}
                    disabled={isProcessing}
                    className="flex items-center justify-center gap-2 px-4 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all group disabled:opacity-50"
                  >
                    {isProcessing ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle2 size={18} />}
                    Onayla
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
