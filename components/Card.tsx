
import React from 'react';

interface CardProps {
  title: string;
  value: string;
  color?: string;
}

const Card: React.FC<CardProps> = ({ title, value, color = "text-blue-400" }) => {
  return (
    <div className="bg-slate-900/60 border border-slate-800/80 p-5 rounded-3xl shadow-xl flex flex-col justify-between aspect-auto min-h-[120px] transition-transform active:scale-95">
      <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">{title}</h3>
      <div className={`text-xl sm:text-2xl font-black font-mono truncate ${color}`}>
        {value}
      </div>
    </div>
  );
};

export default Card;
