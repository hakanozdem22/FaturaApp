// @ts-nocheck
export default function SecureBiometricLoginScreen() {
  return (
    <>

      {/*  Custom Title Bar for Electron Feel  */}
      <div className="flex items-center justify-between w-full h-8 px-4 bg-[#0a0e16] border-b border-[#1f2937] select-none drag-region">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-slate-500 text-[14px]">shield</span>
          <span className="text-xs font-medium text-slate-400 tracking-wide">Fatura Yöneticisi Güvenli Giriş</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-yellow-500/20 hover:bg-yellow-500 transition-colors cursor-pointer"></div>
          <div className="w-3 h-3 rounded-full bg-green-500/20 hover:bg-green-500 transition-colors cursor-pointer"></div>
          <div className="w-3 h-3 rounded-full bg-red-500/20 hover:bg-red-500 transition-colors cursor-pointer"></div>
        </div>
      </div>
      {/*  Main Content Area with Radial Gradient Background  */}
      <div className="flex-1 flex items-center justify-center relative p-6">
        {/*  Abstract Background Gradients  */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] right-[-5%] w-[30%] h-[30%] bg-primary/5 rounded-full blur-[100px]"></div>
        </div>
        {/*  Login Card  */}
        <div className="w-full max-w-[420px] glass-panel rounded-2xl p-8 md:p-10 relative z-10 flex flex-col gap-6">
          {/*  Logo & Header  */}
          <div className="flex flex-col items-center text-center gap-4">
            <div className="size-12 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20 shadow-glow mb-2">
              <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white mb-1">Tekrar Hoş Geldiniz</h1>
              <p className="text-slate-400 text-sm font-medium">Güvenli Fatura Yönetim Sistemi</p>
            </div>
          </div>
          {/*  Main Form  */}
          <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-4">
              <label className="block space-y-1.5">
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider pl-1">İş E-postası</span>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-slate-500 group-focus-within:text-primary transition-colors text-[20px]">mail</span>
                  </div>
                  <input className="w-full pl-10 pr-4 py-3 bg-[#1c1f27]/50 border border-[#3b4354] rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm font-medium" placeholder="isim@sirket.com" type="email" value="alex.moran@faturaapp.com" />
                </div>
              </label>
              <label className="block space-y-1.5">
                <div className="flex justify-between items-center pl-1">
                  <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Şifre</span>
                  <a className="text-xs text-primary hover:text-primary/80 font-medium transition-colors" href="#">Şifremi Unuttum?</a>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-slate-500 group-focus-within:text-primary transition-colors text-[20px]">lock</span>
                  </div>
                  <input className="w-full pl-10 pr-10 py-3 bg-[#1c1f27]/50 border border-[#3b4354] rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm font-medium" placeholder="••••••••••••" type="password" />
                  <button className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 transition-colors cursor-pointer" type="button">
                    <span className="material-symbols-outlined text-[20px]">visibility_off</span>
                  </button>
                </div>
              </label>
            </div>
            <button className="mt-2 w-full bg-primary hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg shadow-glow hover:shadow-glow-lg transition-all duration-300 transform active:scale-[0.98] flex items-center justify-center gap-2" type="submit">
              <span>Giriş Yap</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </form>
          {/*  Divider  */}
          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-slate-700/50"></div>
            <span className="flex-shrink-0 mx-4 text-xs font-medium text-slate-500 uppercase tracking-widest">Veya şununla giriş yap</span>
            <div className="flex-grow border-t border-slate-700/50"></div>
          </div>
          {/*  Biometric Section  */}
          <div className="flex flex-col items-center gap-4">
            <button className="group relative flex flex-col items-center justify-center p-4 rounded-xl border border-dashed border-slate-600 hover:border-primary/50 hover:bg-primary/5 transition-all w-full cursor-pointer">
              <div className="relative mb-2">
                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="fingerprint-scan w-12 h-12 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300">
                  <span className="material-symbols-outlined text-[48px]">fingerprint</span>
                </div>
              </div>
              <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">Touch ID / Biyometrik</span>
              <span className="text-xs text-slate-500 mt-1">Sensör bekleniyor...</span>
            </button>
            <button className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors py-1">
              <span className="material-symbols-outlined text-[18px]">phonelink_lock</span>
              <span>Kimlik Doğrulayıcı Uygulaması (MFA) Kullan</span>
            </button>
          </div>
          {/*  Footer Security Badge  */}
          <div className="pt-2 mt-2 border-t border-slate-700/30 flex items-center justify-center gap-2 text-emerald-500/80">
            <span className="material-symbols-outlined text-[14px]">lock</span>
            <span className="text-[11px] font-medium tracking-wide uppercase">256-bit Şifreli Bağlantı</span>
          </div>
        </div>
        {/*  Floating Decorative Elements  */}
        <div className="absolute bottom-10 right-10 flex flex-col items-end gap-2 opacity-50 z-0 pointer-events-none">
          <div className="text-[10px] text-slate-600 font-mono">Sürüm v4.2.0 (Kararlı)</div>
          <div className="text-[10px] text-slate-600 font-mono">Sunucu: TR-IST-1</div>
        </div>
      </div>

    </>
  );
}
