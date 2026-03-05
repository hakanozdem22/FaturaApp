import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Loader2, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';

interface Invoice {
  id: string;
  invoice_no: string;
  company_name?: string;
  submission_date: string;
  amount: number;
  status: string;
  file_url?: string;
}

export default function ManagerApprovalWorkspace() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [actionStatus, setActionStatus] = useState<{ type: 'idle' | 'success' | 'error', message: string }>({ type: 'idle', message: '' });
  const [isProcessing, setIsProcessing] = useState(false);
  const [rejectNote, setRejectNote] = useState('');

  const fetchPendingInvoices = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('status', 'Bekliyor')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Fatura çekme hatası:", error);
      } else {
        setInvoices(data || []);
        // Eğer seçili fatura artık listede yoksa, seçimi kaldır
        if (selectedInvoice && !(data || []).find((inv: Invoice) => inv.id === selectedInvoice.id)) {
          setSelectedInvoice(data && data.length > 0 ? data[0] : null);
        }
        // İlk yüklemede ilk faturayı seç
        if (!selectedInvoice && data && data.length > 0) {
          setSelectedInvoice(data[0]);
        }
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
      const { error } = await supabase
        .from('invoices')
        .update({ status: 'Onaylandı' })
        .eq('id', selectedInvoice.id);

      if (error) throw error;

      setActionStatus({ type: 'success', message: `Fatura #${selectedInvoice.invoice_no} onaylandı.` });
      setSelectedInvoice(null);
      await fetchPendingInvoices();
    } catch (error) {
      console.error('Onay hatası:', error);
      setActionStatus({ type: 'error', message: 'Fatura onaylanırken bir hata oluştu.' });
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

      setActionStatus({ type: 'success', message: `Fatura #${selectedInvoice.invoice_no} reddedildi.` });
      setRejectNote('');
      setSelectedInvoice(null);
      await fetchPendingInvoices();
    } catch (error) {
      console.error('Red hatası:', error);
      setActionStatus({ type: 'error', message: 'Fatura reddedilirken bir hata oluştu.' });
    } finally {
      setIsProcessing(false);
      setTimeout(() => setActionStatus({ type: 'idle', message: '' }), 4000);
    }
  };

  return (
    <>
      {/*  Header  */}
      <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 shrink-0 z-10">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Onay Çalışma Alanı</h2>
        </div>
        <div className="flex items-center gap-4">
          {/*  Status Message  */}
          {actionStatus.message && (
            <div className={`text-sm px-4 py-2 rounded-md flex items-center gap-2 transition-all
                            ${actionStatus.type === 'success' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'
                : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'}`}>
              {actionStatus.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
              {actionStatus.message}
            </div>
          )}
          {/*  Notifications  */}
          <button className="relative p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <span className="material-symbols-outlined">notifications</span>
            {invoices.length > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
            )}
          </button>
        </div>
      </header>

      {/*  Split Screen Layout Container  */}
      <div className="flex-1 flex overflow-hidden">
        {/*  Invoice List Sidebar (Bekleyenler Kuyruğu)  */}
        <div className="w-80 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col shrink-0">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
            <h3 className="font-semibold text-sm text-slate-700 dark:text-slate-300">Bekleyenler Kuyruğu</h3>
            <span className="text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 px-2 py-0.5 rounded-full">
              {invoices.length}
            </span>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2">
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="animate-spin text-slate-400" size={24} />
              </div>
            ) : invoices.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center px-4">
                <CheckCircle2 size={40} className="text-emerald-400 mb-3" />
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Tüm faturalar işlendi!</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Bekleyen fatura bulunmuyor.</p>
              </div>
            ) : (
              invoices.map((invoice) => (
                <div
                  key={invoice.id}
                  onClick={() => setSelectedInvoice(invoice)}
                  className={`p-3 rounded-lg cursor-pointer transition-all relative group
                                        ${selectedInvoice?.id === invoice.id
                      ? 'bg-primary/5 border border-primary/20 shadow-sm'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700'
                    }`}
                >
                  {selectedInvoice?.id === invoice.id && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-l-lg"></div>
                  )}
                  <div className={`flex justify-between items-start mb-1 ${selectedInvoice?.id === invoice.id ? 'pl-2' : ''}`}>
                    <span className={`text-sm ${selectedInvoice?.id === invoice.id ? 'font-semibold text-slate-900 dark:text-white' : 'font-medium text-slate-700 dark:text-slate-300'}`}>
                      {invoice.company_name || 'Bilinmiyor'}
                    </span>
                    <span className="text-xs font-mono text-slate-400">#{invoice.invoice_no}</span>
                  </div>
                  <div className={`flex justify-between items-end ${selectedInvoice?.id === invoice.id ? 'pl-2' : ''}`}>
                    <div>
                      <div className="text-xs text-slate-400">
                        {new Date(invoice.submission_date).toLocaleDateString('tr-TR')}
                      </div>
                      <div className="mt-1 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200">
                        Bekliyor
                      </div>
                    </div>
                    <span className={`font-bold text-sm ${selectedInvoice?.id === invoice.id ? 'text-primary' : 'text-slate-600 dark:text-slate-400'}`}>
                      ₺{invoice.amount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/*  Central Workspace (Split View)  */}
        <div className="flex-1 flex flex-col md:flex-row h-full overflow-hidden bg-slate-100 dark:bg-black/20">
          {selectedInvoice ? (
            <>
              {/*  DOCUMENT VIEWER (Left/Top)  */}
              <div className="flex-1 flex flex-col h-full md:h-full border-r border-slate-200 dark:border-slate-800 bg-slate-200/50 dark:bg-slate-900/50 relative">
                {/*  Viewer Toolbar  */}
                <div className="h-12 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 shrink-0">
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <span className="material-symbols-outlined text-lg">description</span>
                    <span className="text-sm font-medium">Fatura #{selectedInvoice.invoice_no}</span>
                  </div>
                  <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                    {selectedInvoice.file_url && (
                      <a
                        href={selectedInvoice.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 hover:bg-white dark:hover:bg-slate-700 rounded shadow-sm transition-colors text-slate-600 dark:text-slate-400"
                        title="Yeni sekmede aç"
                      >
                        <span className="material-symbols-outlined text-lg">open_in_new</span>
                      </a>
                    )}
                  </div>
                </div>
                {/*  Viewer Content  */}
                <div className="flex-1 overflow-auto custom-scrollbar p-4 flex justify-center items-start">
                  {selectedInvoice.file_url ? (
                    selectedInvoice.file_url.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                      <img
                        src={selectedInvoice.file_url}
                        alt={`Fatura ${selectedInvoice.invoice_no}`}
                        className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                      />
                    ) : (
                      <embed
                        src={selectedInvoice.file_url}
                        type="application/pdf"
                        className="w-full h-full min-h-[700px] rounded-lg shadow-lg"
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

              {/*  METADATA & ACTIONS (Right/Bottom)  */}
              <div className="w-full md:w-[400px] lg:w-[450px] bg-white dark:bg-slate-900 flex flex-col h-full shrink-0 shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.05)] z-10">
                {/*  Form Header  */}
                <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">Fatura Detayları</h3>
                    <p className="text-xs text-slate-500">Taranan belge ile çıkarılan verileri doğrulayın.</p>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                    Onay Bekliyor
                  </span>
                </div>
                {/*  Scrollable Form Area  */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
                  {/*  Section 1: Vendor Info  */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Tedarikçi Bilgileri</h4>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tedarikçi / Şirket Adı</label>
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
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Fatura No</label>
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
                  {/*  Section 2: Financials  */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Finansal Bilgiler</h4>
                    <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                      <label className="block text-sm font-bold text-slate-900 dark:text-white mb-1">Toplam Tutar</label>
                      <div className="text-2xl font-bold text-primary font-mono">
                        ₺{selectedInvoice.amount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                      </div>
                    </div>
                  </div>
                  <div className="h-px bg-slate-200 dark:bg-slate-800"></div>
                  {/*  Section 3: Notes  */}
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
                {/*  Footer Actions  */}
                <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 z-20">
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
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center px-8">
                {isLoading ? (
                  <div className="flex items-center gap-3 text-slate-400">
                    <Loader2 className="animate-spin" size={24} />
                    <span>Faturalar yükleniyor...</span>
                  </div>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-600 mb-4 block">task_alt</span>
                    <h3 className="text-xl font-bold text-slate-500 dark:text-slate-400 mb-2">
                      {invoices.length === 0 ? 'Bekleyen Fatura Yok' : 'Bir Fatura Seçin'}
                    </h3>
                    <p className="text-sm text-slate-400 dark:text-slate-500">
                      {invoices.length === 0
                        ? 'Tüm faturalar işlenmiş durumda. Yeni fatura yüklendiğinde burada görüntülenecektir.'
                        : 'Sol taraftaki kuyruktan incelemek istediğiniz faturayı seçin.'}
                    </p>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
