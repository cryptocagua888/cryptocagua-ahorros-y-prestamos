
import React, { useState } from 'react';

interface LoginFormProps {
  onLogin: (email: string, pin: string) => Promise<void>;
  isLoading: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, isLoading }) => {
  const [email, setEmail] = useState('');
  const [pin, setPin] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && pin) onLogin(email, pin);
  };

  return (
    <div className="w-full max-w-[320px] bg-slate-900/90 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl">
      <div className="flex flex-col items-center mb-10">
        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-600/20 mb-4 transform -rotate-3">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
        </div>
        <h2 className="text-2xl font-black text-white">Cryptocagua</h2>
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Ahorro y Préstamos</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-1">Email</label>
          <input
            type="email"
            inputMode="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-slate-950 border border-white/5 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-800"
            placeholder="usuario@correo.com"
            disabled={isLoading}
            required
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-1">Pin Secreto</label>
          <input
            type="password"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={6}
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
            className="w-full bg-slate-950 border border-white/5 rounded-2xl px-5 py-4 text-center tracking-[0.5em] text-xl font-mono focus:ring-2 focus:ring-blue-500 outline-none placeholder:text-slate-900"
            placeholder="••••"
            disabled={isLoading}
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-black py-4 rounded-2xl shadow-lg shadow-blue-600/20 transition-all disabled:opacity-50 text-sm uppercase tracking-widest"
        >
          {isLoading ? 'Conectando...' : 'Entrar'}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
