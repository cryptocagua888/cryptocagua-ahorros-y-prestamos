
import React, { useState } from 'react';
import { UserData } from '../types';

interface LoanRequestFormProps {
  user: UserData;
  loanLimit: number;
}

const LoanRequestForm: React.FC<LoanRequestFormProps> = ({ user, loanLimit }) => {
  const [amount, setAmount] = useState<string>('');
  const [reason, setReason] = useState('');
  
  const getEnv = (key: string, fallback: string) => {
    try {
      return (typeof process !== 'undefined' && process.env && process.env[key]) || fallback;
    } catch {
      return fallback;
    }
  };

  const SUPPORT_PHONE = getEnv("SUPPORT_PHONE", "584120000000");
  const SUPPORT_EMAIL = getEnv("SUPPORT_EMAIL", "soporte@cryptocagua.com");
  
  const fmt = (val: number) => val.toLocaleString(undefined, { 
    minimumFractionDigits: 3, 
    maximumFractionDigits: 3 
  });

  const generateMessage = () => {
    return `SOLICITUD DE PRÉSTAMO\nUsuario: ${user.name}\nEmail: ${user.email}\nMonto: $${amount}\nLímite: $${fmt(loanLimit)}\nMotivo: ${reason}`;
  };

  const handleWhatsApp = () => {
    const url = `https://wa.me/${SUPPORT_PHONE}?text=${encodeURIComponent(generateMessage())}`;
    window.open(url, '_blank');
  };

  const isInvalid = !amount || parseFloat(amount) <= 0 || parseFloat(amount) > loanLimit;

  return (
    <div className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-[2.5rem] shadow-2xl">
      <h3 className="text-xl font-black mb-6 flex items-center gap-3">
        <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2" strokeWidth={2}/></svg>
        Solicitar Crédito
      </h3>
      
      <div className="space-y-6">
        <div>
          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Monto (Máx: ${fmt(loanLimit)})</label>
          <input 
            type="number" 
            inputMode="decimal"
            step="0.001"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-blue-500 outline-none font-mono text-lg"
            placeholder="0.000"
          />
        </div>

        <div>
          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Comentario</label>
          <textarea 
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-blue-500 outline-none h-24 resize-none text-sm"
            placeholder="¿Cuál es el fin del préstamo?"
          />
        </div>

        <button 
          onClick={handleWhatsApp}
          disabled={isInvalid}
          className="w-full flex items-center justify-center gap-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-20 py-5 rounded-2xl font-black transition-all shadow-xl shadow-emerald-900/20 active:scale-95"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.94 3.659 1.437 5.634 1.437h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          ENVIAR POR WHATSAPP
        </button>
      </div>
    </div>
  );
};

export default LoanRequestForm;
