
import React, { useState, useEffect, useMemo } from 'react';
import { UserData } from './types';
import LoginForm from './components/LoginForm';
import Card from './components/Card';
import LoanRequestForm from './components/LoanRequestForm';
import { fetchUserData } from './services/sheetService';
import { getFinancialAdvice } from './services/geminiService';

const App: React.FC = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [advice, setAdvice] = useState<string>('');
  const [loginError, setLoginError] = useState<string | null>(null);

  const fmt = (val: number) => val.toLocaleString(undefined, { 
    minimumFractionDigits: 3, 
    maximumFractionDigits: 3 
  });

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
      } else {
        setLoginError('Credenciales incorrectas');
      }
    } catch (err) {
      setLoginError('Error de conexión');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user && !advice) {
      getFinancialAdvice(user).then(setAdvice);
    }
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#0a0f1e]">
        <LoginForm onLogin={handleLogin} isLoading={isLoading} />
        {loginError && (
          <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-[85%] max-w-sm bg-rose-600 text-white px-6 py-4 rounded-2xl text-xs font-black shadow-2xl animate-bounce text-center">
            {loginError.toUpperCase()}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-slate-100 flex flex-col">
      {/* Header Compacto */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-white/5 px-4 py-3">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-black text-sm">C</div>
            <h1 className="text-sm font-black tracking-tight">Cryptocagua</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden xs:block">
              <p className="text-[10px] font-black leading-none">{user.name.split(' ')[0]}</p>
              <p className="text-[8px] text-emerald-500 font-black uppercase">Online</p>
            </div>
            <button 
              onClick={() => { setUser(null); setAdvice(''); }}
              className="p-2 rounded-xl bg-slate-800 active:bg-slate-700"
            >
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 16l4-4m0 0l-4-4m4 4H7" strokeWidth={2.5}/></svg>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-6 space-y-6">
        {/* IA Advice Móvil */}
        <div className="bg-gradient-to-br from-indigo-600/20 to-blue-600/10 border border-blue-500/20 p-5 rounded-[2rem] flex items-center gap-4">
          <div className="shrink-0 w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" strokeWidth={2.5}/></svg>
          </div>
          <p className="text-xs text-slate-300 font-medium italic">
            {advice || 'Analizando activos...'}
          </p>
        </div>

        {/* Grid 2x2 en móvil */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <Card title="Patrimonio" value={`$${fmt(totalAssets)}`} color="text-emerald-400" />
          <Card title="Cupo" value={`$${fmt(loanLimit)}`} color="text-blue-400" />
          <Card title="Deuda" value={`$${fmt(user.totalDebt)}`} color="text-rose-400" />
          <Card title="Disponible" value={`$${fmt(user.balance)}`} color="text-indigo-400" />
        </div>

        {/* Sección de Préstamos y Detalles */}
        <div className="flex flex-col gap-6">
          <LoanRequestForm user={user} loanLimit={availableToBorrow} />
          
          <div className="bg-slate-900/40 border border-white/5 p-6 rounded-[2rem] space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 text-center">Tus Activos</h3>
            <div className="grid grid-cols-1 gap-2">
              {[
                { label: 'Oro (PAXG)', val: user.paxg, color: 'text-amber-400' },
                { label: 'LATAM Token', val: user.latam, color: 'text-blue-400' },
                { label: 'Ahorro Base', val: user.savings, color: 'text-slate-400' }
              ].map(token => token.val > 0 && (
                <div key={token.label} className="bg-slate-950/40 p-3 rounded-xl flex justify-between items-center border border-white/5">
                  <span className="text-[10px] font-bold uppercase text-slate-600">{token.label}</span>
                  <span className={`text-sm font-mono font-black ${token.color}`}>{fmt(token.val)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <footer className="py-8 text-center px-4">
        <p className="text-[8px] text-slate-700 font-black uppercase tracking-[0.3em]">
          Cryptocagua v2.5 • Conexión Segura
        </p>
      </footer>
    </div>
  );
};

export default App;
