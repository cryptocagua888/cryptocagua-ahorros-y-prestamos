
import React from 'react';

interface CardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  subtitle?: string;
  color?: string;
}

const Card: React.FC<CardProps> = ({ title, value, icon, subtitle, color = "text-blue-400" }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-[1.5rem] hover:border-slate-700 transition-all group relative overflow-hidden">
      <div className="absolute top-0 left-0 w-1 h-full bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-slate-500 font-bold text-xs uppercase tracking-wider">{title}</h3>
        <div className={`${color} group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
      </div>
      <div className="flex flex-col">
        <span className="text-2xl font-black font-mono text-slate-100 truncate">{value}</span>
        {subtitle && <span className="text-[10px] text-slate-500 mt-2 font-bold uppercase">{subtitle}</span>}
      </div>
    </div>
  );
};

export default Card;
