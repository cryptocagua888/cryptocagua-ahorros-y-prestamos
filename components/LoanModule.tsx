
import React, { useState } from 'react';

interface LoanModuleProps {
  maxLoan: number;
  onApply: (amount: number) => Promise<void>;
}

const LoanModule: React.FC<LoanModuleProps> = ({ maxLoan, onApply }) => {
  const [amount, setAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleApply = async () => {
    if (amount <= 0 || amount > maxLoan) return;
    setIsLoading(true);
    try {
      await onApply(amount);
      setSuccess(true);
      setAmount(0);
      setTimeout(() => setSuccess(false), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-800/40 border border-slate-700 p-6 rounded-3xl">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        Solicitar Préstamo
      </h3>
      
      <div className="space-y-6">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-slate-400">Tu límite (50% de ahorros):</span>
            <span className="text-green-400 font-bold font-mono">${maxLoan.toLocaleString()}</span>
          </div>
          <input
            type="range"
            min="0"
            max={maxLoan}
            step="10"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
        </div>

        <div className="bg-slate-900 rounded-2xl p-4 flex justify-between items-center">
          <div>
            <span className="text-xs text-slate-500 block">Monto a recibir</span>
            <span className="text-2xl font-bold font-mono text-slate-100">${amount.toLocaleString()}</span>
          </div>
          <button
            onClick={handleApply}
            disabled={amount === 0 || isLoading}
            className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-6 rounded-xl transition-all disabled:opacity-50"
          >
            {isLoading ? 'Procesando...' : 'Solicitar'}
          </button>
        </div>

        {success && (
          <div className="text-center text-green-400 text-sm animate-bounce">
            ¡Préstamo aprobado y depositado!
          </div>
        )}
      </div>
    </div>
  );
};

export default LoanModule;
