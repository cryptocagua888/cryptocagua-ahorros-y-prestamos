import React, { useState, useEffect, useMemo } from 'react';
import { UserData } from './types';
import LoginForm from './components/LoginForm';
import Card from './components/Card';
import LoanRequestForm from './components/LoanRequestForm';
import { fetchUserData } from './services/sheetService';
import { getFinancialAdvice } from './services/geminiService';

// Main application component for Cryptocagua banking dashboard
const App: React.FC = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [advice, setAdvice] = useState<string>('');
  const [loginError, setLoginError] = useState<string | null>(null);

  const fmt = (val: number) => val.toLocaleString(undefined, { 
    minimumFractionDigits: 3, 
    maximumFractionDigits: 3 
  });

  // Calculate total wealth across all tokenized and fiat assets
  const totalAssets = useMemo(() => {
    if (!user) return 0;
    return (user.savings || 0) + (user.paxg || 0) + (user.latam || 0) + (user.gldc || 0);
  }, [user]);

  const loanLimit = totalAssets * 0.5;
  const availableToBorrow = Math.max(0, loanLimit - (user?.totalDebt || 0));

  const handleLogin = async (email: string, pin: string) => {
    setIsLoading(true);
    setLoginError(null);
    try {
      const data = await fetchUserData(email, pin);
      if (data) {
        setUser(data);
        // Get financial insight from Gemini upon successful login
        getFinancialAdvice(data).then(setAdvice).catch(() => setAdvice('Mantén el control de tus ahorros.'));
      } else {
        setLoginError('Credenciales incorrectas');
      }
    } catch (err) {
      setLoginError('Error de conexión con la base de datos');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#0a0f1e]">
        <LoginForm onLogin={handleLogin} isLoading={isLoading} />
        {loginError && (
          <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-[85%] max-w-sm bg-rose-600 text-white px-6 py-4 rounded-2xl text-xs font-black shadow-2xl text-center">
            {loginError.toUpperCase()}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-slate-100 flex flex-col">
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-white/5 px-4 py-3">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-black text-sm text-white">C</div>
            <h1 className="text-sm font-black tracking-tight">Cryptocagua</h1>
          </div>
          <button 
            onClick={() => setUser(null)}
            className="p-2 rounded-xl bg-slate-800 active:bg-slate-700 text-slate-400"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </header>

      <main className="flex-1 p-4 sm:p-6 max-w-4xl mx-auto w-full space-y-6">
        <section className="bg-gradient-to-br from-blue-600 to-blue-800 p-8 rounded-[2.5rem] shadow-2xl shadow-blue-900/20 relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-[10px] font-black text-blue-200 uppercase tracking-widest mb-2 opacity-80">Patrimonio Total Estimado</p>
            <h2 className="text-4xl sm:text-5xl font-black font-mono tracking-tighter text-white">
              ${fmt(totalAssets)}
            </h2>
            <div className="mt-6 inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-xs font-black text-white/90 uppercase tracking-widest">Sincronizado</span>
            </div>
          </div>
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <svg className="w-32 h-32 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
            </svg>
          </div>
        </section>

        {advice && (
          <div className="bg-slate-900/50 border border-blue-500/20 p-4 rounded-2xl flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-sm text-blue-200/80 italic font-medium">"{advice}"</p>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card title="Ahorros USD" value={`$${fmt(user.savings)}`} color="text-slate-100" />
          <Card title="PAXG (Oro)" value={`${fmt(user.paxg)} oz`} color="text-amber-400" />
          <Card title="Latam Fund" value={`$${fmt(user.latam)}`} color="text-emerald-400" />
          <Card title="GLDC" value={`${fmt(user.gldc)}`} color="text-blue-400" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-[2.5rem]">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">Estado de Cuenta</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-slate-950/50 rounded-2xl border border-white/5">
                  <span className="text-xs font-bold text-slate-400">Préstamos Activos</span>
                  <span className="text-sm font-black font-mono text-rose-400">{user.activeLoans}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-slate-950/50 rounded-2xl border border-white/5">
                  <span className="text-xs font-bold text-slate-400">Deuda Total</span>
                  <span className="text-sm font-black font-mono text-rose-400">${fmt(user.totalDebt)}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-slate-950/50 rounded-2xl border border-white/5">
                  <span className="text-xs font-bold text-slate-400">Capacidad Disponible</span>
                  <span className="text-sm font-black font-mono text-emerald-400">${fmt(availableToBorrow)}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-[2.5rem]">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Plan de Ahorro</h3>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 rounded-full transition-all duration-1000" 
                      style={{ width: `${(user.pendingSavingsInstallments / 24) * 100}%` }}
                    />
                  </div>
                  <p className="text-[10px] mt-2 font-bold text-slate-500">{user.pendingSavingsInstallments} cuotas pendientes</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-slate-100">${fmt(user.savingsInstallmentAmount)}</span>
                  <span className="text-[8px] block text-slate-500 font-bold uppercase tracking-tighter">Mensual</span>
                </div>
              </div>
            </div>
          </div>

          <LoanRequestForm user={user} loanLimit={availableToBorrow} />
        </div>
      </main>

      <footer className="p-8 text-center border-t border-white/5 bg-slate-900/30">
        <p className="text-[10px] font-black text-slate-700 uppercase tracking-[0.3em]">Cryptocagua &copy; 2025</p>
      </footer>
    </div>
  );
};

export default App;
