
import React, { useState, useEffect, useMemo } from 'react';
import { UserData } from './types';
import LoginForm from './components/LoginForm';
import Card from './components/Card';
import LoanRequestForm from './components/LoanRequestForm';
import { fetchUserData } from './services/sheetService';
import { getFinancialAdvice } from './services/geminiService';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const App: React.FC = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [advice, setAdvice] = useState<string>('');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Formateador de 3 decimales
  const fmt = (val: number) => val.toLocaleString(undefined, { 
    minimumFractionDigits: 3, 
    maximumFractionDigits: 3 
  });

  // Cálculo del Valor Total de Activos
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
        setLoginError('Usuario no encontrado o clave incorrecta.');
      }
    } catch (err) {
      setLoginError('Error de conexión con la base de datos.');
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
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-950">
        <LoginForm onLogin={handleLogin} isLoading={isLoading} />
        {loginError && (
          <div className="mt-6 bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl text-rose-400 text-sm flex items-center gap-3">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            {loginError}
          </div>
        )}
      </div>
    );
  }

  // Verificar cuáles tokens tienen balance
  const hasPaxg = user.paxg > 0;
  const hasLatam = user.latam > 0;
  const hasGldc = user.gldc > 0;
  const hasAnyToken = hasPaxg || hasLatam || hasGldc;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <header className="border-b border-slate-800 bg-slate-900/40 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <span className="text-white font-black text-xl">C</span>
            </div>
            <div>
              <h1 className="font-bold text-lg leading-none">Cryptocagua</h1>
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Ahorro y Crédito Digital</span>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold">{user.name}</p>
              <p className="text-[10px] text-blue-400 font-mono">PORTAFOLIO ACTIVO</p>
            </div>
            <button 
              onClick={() => setUser(null)}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-800 text-slate-400 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" strokeWidth={2} /></svg>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10 space-y-8">
        {/* Dash Grid Principal */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card 
            title="Total Activos" 
            value={`$${fmt(totalAssets)}`} 
            icon={<svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth={2}/></svg>}
            subtitle="Suma de todos tus ahorros"
            color="text-emerald-400"
          />
          <Card 
            title="Límite Préstamo" 
            value={`$${fmt(loanLimit)}`} 
            icon={<svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" strokeWidth={2}/></svg>}
            subtitle="50% de activos totales"
            color="text-blue-400"
          />
          <Card 
            title="Deuda Actual" 
            value={`$${fmt(user.totalDebt)}`} 
            icon={<svg className="w-6 h-6 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth={2}/></svg>}
            subtitle="Préstamos por pagar"
            color="text-rose-400"
          />
          <Card 
            title="Disp. Retiro" 
            value={`$${fmt(user.balance)}`} 
            icon={<svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" strokeWidth={2}/></svg>}
            subtitle="Saldo en cuenta corriente"
            color="text-indigo-400"
          />
        </div>

        {/* Portafolio de Tokens Condicional */}
        {hasAnyToken && (
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2rem]">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
              <svg className="w-6 h-6 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" /><path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" /></svg>
              Tus Activos Tokenizados
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {hasPaxg && (
                <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block mb-1">PAXG (Oro)</span>
                    <span className="text-2xl font-black font-mono text-amber-500">{fmt(user.paxg)}</span>
                  </div>
                  <div className="w-12 h-12 bg-amber-500/10 rounded-full flex items-center justify-center text-amber-500">
                    <span className="font-bold">Au</span>
                  </div>
                </div>
              )}
              {hasLatam && (
                <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block mb-1">$Latam Token</span>
                    <span className="text-2xl font-black font-mono text-blue-500">{fmt(user.latam)}</span>
                  </div>
                  <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-500 text-xl font-black">L</div>
                </div>
              )}
              {hasGldc && (
                <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block mb-1">GLDC Stable</span>
                    <span className="text-2xl font-black font-mono text-emerald-500">{fmt(user.gldc)}</span>
                  </div>
                  <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500 font-bold">G</div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Formulario de Solicitud de Préstamo */}
          <LoanRequestForm user={user} loanLimit={availableToBorrow} />

          {/* Información Adicional y Gemini */}
          <div className="space-y-8">
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2rem] flex flex-col justify-center h-full">
              <h3 className="text-xl font-bold mb-4">Información de Ahorro</h3>
              <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                Tu capacidad crediticia se actualiza automáticamente al detectar cambios en tus saldos de Google Sheets. 
                Recuerda que puedes solicitar hasta el 50% del valor total de tus activos combinados.
              </p>
              
              <div className="bg-indigo-600/10 border border-indigo-500/20 p-6 rounded-3xl flex items-start gap-5">
                <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" strokeWidth={2}/></svg>
                </div>
                <div>
                  <h4 className="text-indigo-400 text-xs font-black uppercase tracking-tighter mb-1">Asesoría Gemini</h4>
                  <p className="text-slate-300 text-sm font-medium italic leading-snug">
                    {advice || 'Analizando la composición de tu portafolio tokenizado...'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Gráfico Simple de Historial */}
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2rem]">
          <h3 className="text-xl font-bold mb-8">Tendencia de Activos</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={user.history.map(h => ({ d: h.date, v: h.amount })).reverse()}>
                <defs>
                  <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                <XAxis dataKey="d" stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                <YAxis stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '16px' }} />
                <Area type="monotone" dataKey="v" stroke="#3b82f6" strokeWidth={3} fill="url(#chartGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-800 py-12 text-center text-slate-600 text-[10px] uppercase tracking-[0.2em] font-bold">
        <p>© 2024 Cryptocagua Digital • Datos Sincronizados con Google Sheets</p>
      </footer>
    </div>
  );
};

export default App;
