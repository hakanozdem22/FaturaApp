// @ts-nocheck
export default function SecurityReAuthenticationModal() {
  return (
    <>

      {/*  Background Dashboard Context (Blurred)  */}
      <div aria-hidden="true" className="absolute inset-0 z-0 flex flex-col h-full w-full opacity-40 pointer-events-none select-none">
        {/*  Top Nav  */}
        <div className="h-16 border-b border-slate-200 dark:border-slate-800 flex items-center px-8 bg-white dark:bg-slate-900">
          <div className="w-8 h-8 rounded bg-primary/20 mr-4"></div>
          <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded"></div>
          <div className="flex-1"></div>
          <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-800"></div>
        </div>
        {/*  Main Content Area  */}
        <div className="flex-1 flex p-8 gap-8 bg-slate-50 dark:bg-slate-950">
          {/*  Sidebar  */}
          <div className="w-64 hidden md:flex flex-col gap-4">
            <div className="h-8 w-full bg-slate-200 dark:bg-slate-800 rounded"></div>
            <div className="h-8 w-3/4 bg-slate-200 dark:bg-slate-800 rounded"></div>
            <div className="h-8 w-5/6 bg-slate-200 dark:bg-slate-800 rounded"></div>
          </div>
          {/*  Dashboard Table Placeholder  */}
          <div className="flex-1 bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 p-6 flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded"></div>
              <div className="h-10 w-32 bg-primary rounded"></div>
            </div>
            <div className="h-64 w-full bg-slate-100 dark:bg-slate-800 rounded flex items-center justify-center">
              {/*  Abstract chart pattern  */}
              <div className="w-full h-full bg-[linear-gradient(45deg,#f1f5f9_25%,transparent_25%,transparent_75%,#f1f5f9_75%,#f1f5f9),linear-gradient(45deg,#f1f5f9_25%,transparent_25%,transparent_75%,#f1f5f9_75%,#f1f5f9)] bg-[length:20px_20px] opacity-50"></div>
            </div>
            <div className="flex flex-col gap-3">
              <div className="h-12 w-full bg-slate-50 dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700"></div>
              <div className="h-12 w-full bg-slate-50 dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700"></div>
              <div className="h-12 w-full bg-slate-50 dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700"></div>
            </div>
          </div>
        </div>
      </div>
      {/*  Modal Overlay  */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm transition-all duration-300">
        {/*  Modal Content  */}
        <div className="relative w-full max-w-[480px] bg-white dark:bg-slate-900 rounded-xl shadow-2xl overflow-hidden ring-1 ring-slate-900/5 dark:ring-white/10 flex flex-col animate-in fade-in zoom-in-95 duration-200">
          {/*  Modal Header / Hero Icon  */}
          <div className="flex flex-col items-center pt-10 pb-6 px-8 text-center">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 ring-8 ring-primary/5">
              <span className="material-symbols-outlined text-primary text-[32px]">shield_lock</span>
            </div>
            <h2 className="text-slate-900 dark:text-slate-50 text-2xl font-bold tracking-tight mb-2">
              Güvenlik Doğrulaması Gerekli
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-sm mx-auto">
              Fatura ayarlarındaki bu kritik değişikliklere yetki vermek için lütfen kimliğinizi doğrulayın.
            </p>
          </div>
          {/*  Modal Body  */}
          <div className="px-8 pb-4 flex flex-col gap-5">
            {/*  Password Input Group  */}
            <div className="flex flex-col gap-2">
              <label className="text-slate-700 dark:text-slate-300 text-sm font-medium" htmlFor="manager-password">
                Yönetici Şifresi
              </label>
              <div className="relative group">
                <input autofocus="" className="form-input block w-full rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-primary focus:ring-primary dark:focus:border-primary dark:focus:ring-primary sm:text-sm h-12 pr-10 transition-colors" id="manager-password" placeholder="••••••••••••" type="password" value="" />
                <button className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 focus:outline-none transition-colors" type="button">
                  <span className="material-symbols-outlined text-[20px]">visibility_off</span>
                </button>
              </div>
            </div>
            {/*  Info Box  */}
            <div className="flex gap-3 bg-primary/5 border border-primary/10 rounded-lg p-3 items-start">
              <span className="material-symbols-outlined text-primary text-[20px] mt-0.5 shrink-0">verified_user</span>
              <div className="flex flex-col gap-0.5">
                <p className="text-slate-900 dark:text-slate-100 text-xs font-semibold">Güvenli Yetkilendirme</p>
                <p className="text-slate-500 dark:text-slate-400 text-xs leading-normal">
                  Bu işlem kaydedilir ve 256-bit şifreleme ile korunur.
                </p>
              </div>
            </div>
            {/*  Alternative Action  */}
            <div className="flex justify-center pt-2">
              <button className="group flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all" type="button">
                <span className="material-symbols-outlined text-[18px] text-slate-400 group-hover:text-primary transition-colors">phonelink_lock</span>
                <span>MFA Kodu ile Aç</span>
              </button>
            </div>
          </div>
          {/*  Modal Footer  */}
          <div className="bg-slate-50 dark:bg-slate-950/50 border-t border-slate-100 dark:border-slate-800 px-8 py-5 flex flex-col sm:flex-row gap-3 sm:justify-end">
            <button className="order-2 sm:order-1 flex-1 sm:flex-none justify-center items-center px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-700 transition-all shadow-sm" type="button">
              İptal
            </button>
            <button className="order-1 sm:order-2 flex-1 sm:flex-none justify-center items-center px-6 py-2.5 rounded-lg text-sm font-semibold text-white bg-primary hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-slate-900 transition-all shadow-sm shadow-primary/25" type="button">
              Onayla ve Değişiklikleri Kaydet
            </button>
          </div>
        </div>
      </div>

    </>
  );
}
