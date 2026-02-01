
import React, { useState } from 'react';
import { UserData } from '../types';

interface LoanRequestFormProps {
  user: UserData;
  loanLimit: number;
}

const LoanRequestForm: React.FC<LoanRequestFormProps> = ({ user, loanLimit }) => {
  const [amount, setAmount] = useState<string>('');
  const [reason, setReason] = useState('');
  
  // Variables de entorno para contacto
  const SUPPORT_PHONE = process.env.SUPPORT_PHONE || "584120000000";
  const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL || "soporte@cryptocagua.com";
  
  const fmt = (val: number) => val.toLocaleString(undefined, { 
    minimumFractionDigits: 3, 
    maximumFractionDigits: 3 
  });

  const generateMessage = () => {
    return `Hola Cryptocagua, soy ${user.name} (${user.email}). 
Solicito un préstamo por un monto de: $${parseFloat(amount).toFixed(3)}.
Mi límite disponible basado en mis ahorros es: $${fmt(loanLimit)}.
Motivo de la solicitud: ${reason || 'No especificado'}.
Quedo atento a la aprobación.`;
  };

  const handleWhatsApp = () => {
    const url = `https://wa.me/${SUPPORT_PHONE}?text=${encodeURIComponent(generateMessage())}`;
    window.open(url, '_blank');
  };

  const handleEmail = () => {
    const subject = `Solicitud de Préstamo - ${user.name}`;
    const body = generateMessage();
    window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const isInvalid = !amount || parseFloat(amount) <= 0 || parseFloat(amount) > loanLimit;

  return (
    <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2rem] shadow-xl">
      <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
        <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeWidth={2}/></svg>
        Nueva Solicitud de Préstamo
      </h3>
      
      <div className="space-y-5">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Monto Solicitado (Máx: ${fmt(loanLimit)})</label>
          <input 
            type="number" 
            step="0.001"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none font-mono"
            placeholder="0.000"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Motivo o Comentario</label>
          <textarea 
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none h-24 resize-none"
            placeholder="¿Para qué necesitas el crédito?"
          />
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2">
          <button 
            onClick={handleWhatsApp}
            disabled={isInvalid}
            className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-30 disabled:grayscale py-4 rounded-2xl font-bold transition-all"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.94 3.659 1.437 5.634 1.437h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            WhatsApp
          </button>
          <button 
            onClick={handleEmail}
            disabled={isInvalid}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-30 disabled:grayscale py-4 rounded-2xl font-bold transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeWidth={2}/></svg>
            Correo
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoanRequestForm;
