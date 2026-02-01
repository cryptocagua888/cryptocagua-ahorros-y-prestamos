
export interface UserData {
  email: string;
  name: string;
  savings: number; // Ahorro base en USD/Moneda local
  balance: number;
  activeLoans: number;
  totalDebt: number;
  pendingSavingsInstallments: number;
  savingsInstallmentAmount: number;
  // Nuevos Activos Tokenizados
  paxg: number;
  latam: number;
  gldc: number;
  history: Transaction[];
}

export interface Transaction {
  id: string;
  type: 'deposito' | 'retiro' | 'prestamo' | 'pago';
  amount: number;
  date: string;
  description: string;
}
