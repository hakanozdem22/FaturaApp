// @ts-nocheck
export default function StepBasedMfaBiometricLogin() {
  return (
    <>

      {/*  Background decorative elements  */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[100px]"></div>
      </div>
      <div className="w-full max-w-[900px] flex flex-col md:flex-row gap-0 rounded-2xl overflow-hidden shadow-2xl bg-white dark:bg-[#1a2230] border border-slate-200 dark:border-slate-700 relative z-10 h-[550px]">
        {/*  Left Side: Visual / Brand Area  */}
        <div className="hidden md:flex flex-col justify-between w-2/5 bg-gradient-to-br from-[#131b2e] to-[#0a0e17] p-8 relative overflow-hidden">
          {/*  Abstract tech lines  */}
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#135bec 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
          <div className="relative z-10">
            <div className="inline-flex items-center justify-center size-12 rounded-xl bg-primary/20 backdrop-blur-sm border border-primary/30 mb-6">
              <span className="material-symbols-outlined text-primary text-[28px]">lock_person</span>
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight leading-tight mb-2">Güvenli<br />Erişim</h1>
            <p className="text-slate-400 text-sm">Kurumsal düzeyde fatura yönetim sistemi.</p>
          </div>
          <div className="relative z-10 mt-auto">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-primary rounded-full"></div>
              <div className="h-1 w-2 bg-slate-600 rounded-full"></div>
              <div className="h-1 w-2 bg-slate-600 rounded-full"></div>
            </div>
            <p className="text-slate-500 text-xs leading-relaxed">
              256-bit SSL şifreleme ile korunur.
              Yetkisiz erişimler izlenir ve raporlanır.
            </p>
          </div>
        </div>
        {/*  Right Side: Interaction Area  */}
        <div className="flex-1 flex flex-col relative w-full md:w-3/5 bg-white dark:bg-[#1a2230]">
          {/*  Progress Header  */}
          <div className="px-8 pt-8 pb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Kimlik Doğrulama</span>
              <span className="text-xs font-medium text-primary">2. Adım (Toplam 2)</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-700 h-1 rounded-full overflow-hidden">
              <div className="bg-primary h-full w-full rounded-full transition-all duration-500 ease-out"></div>
            </div>
          </div>
          {/*  Step Content Container  */}
          <div className="flex-1 relative overflow-hidden">
            {/*  Content Switcher Logic (Simulated for layout)  */}
            {/*  Active State: Biometric Scan  */}
            <div className="absolute inset-0 px-8 py-4 flex flex-col items-center justify-center text-center transition-all duration-500 transform translate-x-0 opacity-100">
              <div className="mb-6 relative group">
                {/*  Outer scanning ring  */}
                <div className="absolute inset-[-10px] rounded-full border-2 border-primary/20 w-[100px] h-[100px] animate-[spin_3s_linear_infinite]"></div>
                <div className="absolute inset-[-10px] rounded-full border-t-2 border-primary w-[100px] h-[100px] animate-[spin_2s_linear_infinite]"></div>
                {/*  Fingerprint Icon Container  */}
                <div className="relative size-20 rounded-full bg-slate-100 dark:bg-[#151c28] flex items-center justify-center border border-slate-200 dark:border-slate-700 shadow-[0_0_30px_rgba(19,91,236,0.15)] animate-pulse-glow overflow-hidden">
                  <span className="material-symbols-outlined text-primary text-[48px] relative z-10">fingerprint</span>
                  {/*  Scan line effect  */}
                  <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-transparent to-primary/40 animate-scan z-20 pointer-events-none"></div>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Biyometrik Doğrulama</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm max-w-[280px] mx-auto mb-8">
                Kimliğinizi doğrulamak için lütfen parmak izinizi okutun veya güvenlik anahtarınızı kullanın.
              </p>
              <div className="flex items-center gap-2 text-primary font-medium text-sm animate-pulse mb-8">
                <span className="material-symbols-outlined text-[18px]">sensors</span>
                <span>Cihaz girişi bekleniyor...</span>
              </div>
              <div className="w-full pt-6 border-t border-slate-100 dark:border-slate-700/50">
                <button className="text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-primary text-sm font-medium transition-colors flex items-center justify-center gap-2 mx-auto">
                  <span className="material-symbols-outlined text-[18px]">sms</span>
                  Bunun yerine SMS Kodu gönder
                </button>
              </div>
            </div>
            {/*  Inactive State: Credentials (Hidden/Previous Step Visual Reference)  */}
            {/*  To show the other state, one would toggle hidden classes or translations  */}
            <div className="absolute inset-0 px-8 py-4 flex flex-col justify-center transition-all duration-500 transform -translate-x-full opacity-0 pointer-events-none">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Tekrar hoş geldiniz</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm">Devam etmek için giriş bilgilerinizi girin.</p>
              </div>
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-300 uppercase tracking-wide">Kullanıcı Adı</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                      <span className="material-symbols-outlined text-[20px]">person</span>
                    </span>
                    <input className="w-full bg-slate-50 dark:bg-[#111620] border border-slate-200 dark:border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all" placeholder="Kullanıcı adınızı girin" type="text" value="alex.morris@company.com" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-300 uppercase tracking-wide">Şifre</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                      <span className="material-symbols-outlined text-[20px]">key</span>
                    </span>
                    <input className="w-full bg-slate-50 dark:bg-[#111620] border border-slate-200 dark:border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all" type="password" value="••••••••••••" />
                    <button className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                      <span className="material-symbols-outlined text-[20px]">visibility_off</span>
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input className="rounded border-slate-300 text-primary focus:ring-primary bg-slate-100 dark:bg-slate-800 dark:border-slate-600" type="checkbox" />
                    <span className="text-sm text-slate-600 dark:text-slate-400">Beni hatırla</span>
                  </label>
                  <a className="text-sm text-primary hover:text-primary/80 font-medium" href="#">Şifremi unuttum?</a>
                </div>
                <button className="w-full bg-primary hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2 mt-4">
                  Sonraki Adım
                  <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>
          {/*  Footer Help Link  */}
          <div className="px-8 pb-6 pt-2 flex justify-center">
            <a className="text-xs text-slate-400 hover:text-slate-300 flex items-center gap-1" href="#">
              <span className="material-symbols-outlined text-[14px]">help</span>
              Giriş yaparken sorun mu yaşıyorsunuz?
            </a>
          </div>
        </div>
      </div>

    </>
  );
}
