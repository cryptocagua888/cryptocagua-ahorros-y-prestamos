
import React, { useState } from 'react';

interface LoginFormProps {
  onLogin: (email: string, pin: string) => Promise<void>;
  isLoading: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, isLoading }) => {
  const [email, setEmail] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !pin) {
      setError('Por favor complete todos los campos');
      return;
    }
    try {
      await onLogin(email, pin);
    } catch (err) {
      setError('Error al iniciar sesión');
    }
  };

  return (
    <div className="w-full max-w-sm px-6 py-10 bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-[2.5rem] shadow-2xl">
      <div className="flex justify-center mb-6">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-500/40 transform -rotate-6">
          <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
      </div>
      
      <h2 className="text-3xl font-black text-center text-white mb-2">Cryptocagua</h2>
      <p className="text-slate-400 text-center text-sm mb-10">Banca Digital Cooperativa</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 px-1">Email</label>
          <input
            type="email"
            inputMode="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-5 py-4 text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-700"
            placeholder="correo@ejemplo.com"
            disabled={isLoading}
          />
        </div>
        
        <div>
          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 px-1">Clave (PIN)</label>
          <input
            type="password"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={6}
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
            className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-5 py-4 text-slate-100 tracking-[0.5em] text-xl font-mono focus:ring-2 focus:ring-blue-500 outline-none transition-all text-center placeholder:text-slate-800"
            placeholder="••••••"
            disabled={isLoading}
          />
        </div>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-4 rounded-2xl text-xs font-bold text-center">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black py-5 rounded-2xl shadow-xl shadow-blue-900/20 transition-all disabled:opacity-50 active:scale-[0.98]"
        >
          {isLoading ? 'Cargando datos...' : 'ENTRAR AL PANEL'}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
