
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
        setLoginError('Credenciales incorrectas o usuario no activo.');
      }
    } catch (err) {
      setLoginError('Error de red. Intente de nuevo.');
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
          <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-[90%] max-w-sm bg-rose-600 text-white px-6 py-4 rounded-2xl text-sm font-bold shadow-2xl animate-bounce text-center">
            {loginError}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-slate-100 pb-20">
      {/* Header Móvil y Desktop */}
      <header className="sticky top-0 z-50 bg-slate-900/60 backdrop-blur-2xl border-b border-slate-800/50 px-4 py-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-black">C</div>
            <h1 className="text-lg font-black tracking-tight hidden sm:block">Cryptocagua</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs font-black truncate max-w-[120px]">{user.name}</p>
              <p className="text-[9px] text-emerald-500 font-bold uppercase tracking-wider">Verificado</p>
            </div>
            <button 
              onClick={() => setUser(null)}
              className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 16l4-4m0 0l-4-4m4 4H7" strokeWidth={2}/></svg>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-6">
        {/* Banner Gemini Móvil */}
        <div className="bg-gradient-to-br from-indigo-600/20 to-blue-600/10 border border-blue-500/20 p-6 rounded-[2.5rem] flex items-start gap-4">
          <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/20">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" strokeWidth={2}/></svg>
          </div>
          <p className="text-sm text-slate-200 italic leading-relaxed">
            "{advice || 'Analizando tus activos...'}"
          </p>
        </div>

        {/* Grid de Balances */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card title="Patrimonio" value={`$${fmt(totalAssets)}`} color="text-emerald-400" />
          <Card title="Cupo Préstamo" value={`$${fmt(loanLimit)}`} color="text-blue-400" />
          <Card title="Mi Deuda" value={`$${fmt(user.totalDebt)}`} color="text-rose-400" />
          <Card title="Disponible" value={`$${fmt(user.balance)}`} color="text-indigo-400" />
        </div>

        {/* Sección de Préstamos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <LoanRequestForm user={user} loanLimit={availableToBorrow} />
          
          <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-[2.5rem] space-y-4">
            <h3 className="text-xl font-black">Activos Tokenizados</h3>
            <div className="space-y-3">
              {[
                { label: 'Oro (PAXG)', val: user.paxg, color: 'amber' },
                { label: 'Latam Token', val: user.latam, color: 'blue' },
                { label: 'GLDC Stable', val: user.gldc, color: 'emerald' }
              ].map(token => token.val > 0 && (
                <div key={token.label} className="bg-slate-950/50 p-4 rounded-2xl flex justify-between items-center border border-slate-800/50">
                  <span className="text-xs font-bold text-slate-500 uppercase">{token.label}</span>
                  <span className={`text-lg font-mono font-bold text-${token.color}-400`}>{fmt(token.val)}</span>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-slate-500 text-center uppercase tracking-widest pt-4 font-bold">
              Resguardado en Blockchain & Google Sheets
            </p>
          </div>
        </div>
      </main>

      <footer className="px-8 text-center text-[9px] text-slate-600 uppercase tracking-widest font-bold mt-10">
        Cryptocagua Ahorro & Préstamos © 2024
      </footer>
    </div>
  );
};

export default App;
