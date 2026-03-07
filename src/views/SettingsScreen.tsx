import { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { Loader2, UploadCloud, CheckCircle2 } from 'lucide-react';

export default function SettingsScreen() {
    const [activeTab, setActiveTab] = useState<'user' | 'program'>('user');
    const { profile, user, refreshProfile } = useAuth();

    // Stamp upload states
    const [isUploadingStamp, setIsUploadingStamp] = useState(false);
    const [stampUploadMessage, setStampUploadMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Yalnızca admin veya manager program ayarlarını görebilir
    const canViewProgramSettings = profile?.role === 'admin' || profile?.role === 'manager';

    const handleStampUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user) return;

        // Dosya boyutu kontrolü (Maks 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setStampUploadMessage({ type: 'error', text: 'Dosya boyutu 5MB\'dan küçük olmalıdır.' });
            return;
        }

        setIsUploadingStamp(true);
        setStampUploadMessage(null);

        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `stamps/${user.id}_${Date.now()}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from('invoices-pdfs') // Using existing bucket
                .upload(fileName, file, { upsert: true });

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('invoices-pdfs')
                .getPublicUrl(fileName);

            const { error: dbError } = await supabase
                .from('users')
                .update({ stamp_url: publicUrl })
                .eq('id', user.id);

            if (dbError) throw dbError;

            // Refresh profile to reflect new stamp
            if (refreshProfile) {
                await refreshProfile();
            }

            setStampUploadMessage({ type: 'success', text: 'Kaşe başarıyla yüklendi.' });
        } catch (error: unknown) {
            console.error('Kaşe yükleme hatası:', error);
            const errorMessage = error instanceof Error ? error.message : 'Yükleme sırasında hata oluştu.';
            setStampUploadMessage({ type: 'error', text: errorMessage });
        } finally {
            setIsUploadingStamp(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
            setTimeout(() => setStampUploadMessage(null), 5000);
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto w-full">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Ayarlar</h1>
                <p className="text-sm text-slate-500 mt-1">Sistem ve kullanıcı ayarlarınızı yönetin</p>
            </div>

            <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-border-light dark:border-border-dark overflow-hidden">
                <div className="flex border-b border-border-light dark:border-border-dark">
                    <button
                        className={`flex-1 py-4 text-sm font-medium transition-colors ${activeTab === 'user' ? 'text-primary border-b-2 border-primary bg-primary/5' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
                        onClick={() => setActiveTab('user')}
                    >
                        Kullanıcı Ayarları
                    </button>
                    {canViewProgramSettings && (
                        <button
                            className={`flex-1 py-4 text-sm font-medium transition-colors ${activeTab === 'program' ? 'text-primary border-b-2 border-primary bg-primary/5' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
                            onClick={() => setActiveTab('program')}
                        >
                            Program Ayarları
                        </button>
                    )}
                </div>

                <div className="p-6">
                    {activeTab === 'user' && (
                        <div className="space-y-6 animate-fade-in">
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Profil Bilgileri</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Ad Soyad</label>
                                    <input type="text" className="w-full px-4 py-2 rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-surface-dark text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" defaultValue={profile?.full_name || ''} disabled />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">E-posta</label>
                                    <input type="email" className="w-full px-4 py-2 rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-surface-dark text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" defaultValue={profile?.email || ''} disabled />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Rol</label>
                                    <input type="text" className="w-full px-4 py-2 rounded-lg border border-border-light dark:border-border-dark bg-slate-50 dark:bg-surface-dark/50 text-slate-500 outline-none" value={profile?.role === 'admin' ? 'Yönetici' : profile?.role === 'manager' ? 'Müdür' : 'Kullanıcı'} disabled />
                                </div>
                            </div>
                            <div className="pt-4 border-t border-border-light dark:border-border-dark flex justify-end">
                                <button className="px-6 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary-600 transition-colors">
                                    Değişiklikleri Kaydet
                                </button>
                            </div>

                            {/* Kaşe Yükleme Bölümü (Sadece Admin ve Manager) */}
                            {canViewProgramSettings && (
                                <div className="pt-6 border-t border-border-light dark:border-border-dark">
                                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Kaşe (İmza) Yükleme</h3>
                                    <div className="flex flex-col sm:flex-row gap-6 items-start">
                                        <div className="w-full sm:w-1/3 flex flex-col items-center">
                                            <div className="w-full aspect-video rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center overflow-hidden relative">
                                                {profile?.stamp_url ? (
                                                    <img src={profile.stamp_url} alt="Kullanıcı Kaşesi" className="max-w-full max-h-full object-contain p-2" />
                                                ) : (
                                                    <div className="text-slate-400 flex flex-col items-center">
                                                        <span className="material-symbols-outlined text-4xl mb-2">draw</span>
                                                        <span className="text-sm">Kaşe Bulunamadı</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="w-full sm:w-2/3 space-y-4">
                                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                                Faturalarda ve resmi belgelerde kullanılmak üzere kaşe veya imzanızın görselini (PNG, JPG) yükleyebilirsiniz.
                                            </p>

                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                onChange={handleStampUpload}
                                                accept=".jpg, .jpeg, .png, .webp"
                                                className="hidden"
                                                id="stamp-upload"
                                                disabled={isUploadingStamp}
                                            />
                                            <label
                                                htmlFor="stamp-upload"
                                                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer ${isUploadingStamp ? 'bg-slate-100 text-slate-400 cursor-not-allowed dark:bg-slate-800 dark:text-slate-500' : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-700'}`}
                                            >
                                                {isUploadingStamp ? <Loader2 className="animate-spin" size={18} /> : <UploadCloud size={18} />}
                                                {isUploadingStamp ? 'Yükleniyor...' : (profile?.stamp_url ? 'Kaşeyi Değiştir' : 'Kaşe Seç ve Yükle')}
                                            </label>

                                            {stampUploadMessage && (
                                                <div className={`text-sm px-3 py-2 rounded-md flex items-center gap-2 ${stampUploadMessage.type === 'success' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400' : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'}`}>
                                                    {stampUploadMessage.type === 'success' ? <CheckCircle2 size={16} /> : <span className="material-symbols-outlined text-[16px]">error</span>}
                                                    {stampUploadMessage.text}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'program' && canViewProgramSettings && (
                        <div className="space-y-6 animate-fade-in">
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Genel Program Ayarları</h2>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-surface-dark/50 rounded-lg border border-border-light dark:border-border-dark">
                                    <div>
                                        <h3 className="font-medium text-slate-900 dark:text-white">E-posta Bildirimleri</h3>
                                        <p className="text-sm text-slate-500 mt-1">Yeni fatura onaylarında e-posta bildirimi gönder</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" defaultChecked />
                                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:peer-focus:ring-primary/80 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                                    </label>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-surface-dark/50 rounded-lg border border-border-light dark:border-border-dark">
                                    <div>
                                        <h3 className="font-medium text-slate-900 dark:text-white">Karanlık Tema Varsayılan</h3>
                                        <p className="text-sm text-slate-500 mt-1">Yeni kullanıcılar için karanlık temayı varsayılan yap</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" />
                                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:peer-focus:ring-primary/80 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                                    </label>
                                </div>
                            </div>
                            <div className="pt-4 border-t border-border-light dark:border-border-dark flex justify-end">
                                <button className="px-6 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary-600 transition-colors">
                                    Ayarları Uygula
                                </button>
                            </div>

                            {/* İkinci Kaşe Yükleme Bölümüne gerek yok, siliniyor */}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
