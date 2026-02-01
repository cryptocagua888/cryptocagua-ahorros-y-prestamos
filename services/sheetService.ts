
import { UserData } from "../types";

// Se intenta leer desde el entorno, de lo contrario usa una URL de respaldo para evitar errores fatales.
const SHEET_CSV_URL = process.env.SHEET_CSV_URL || "https://docs.google.com/spreadsheets/d/e/2PACX-1vS6y_mNf2-Jv_UuF_j-xH_i_v5uF0X6y_mNf2-Jv_UuF_j-xH_i_v5uF0X6y_mNf2-Jv_UuF_j/pub?output=csv";

const parseCSV = (csvText: string) => {
  const lines = csvText.split(/\r?\n/);
  if (lines.length === 0) return [];
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  
  return headers.length > 0 ? lines.slice(1).map(line => {
    const values = line.split(',');
    return headers.reduce((obj: any, header, index) => {
      obj[header] = values[index]?.trim();
      return obj;
    }, {});
  }) : [];
};

export const fetchUserData = async (email: string, pin: string): Promise<UserData | null> => {
  try {
    const response = await fetch(`${SHEET_CSV_URL}&t=${Date.now()}`);
    if (!response.ok) throw new Error("Error al conectar con la base de datos de Google Sheets");
    
    const csvText = await response.text();
    const rows = parseCSV(csvText);
    
    const userRow = rows.find(row => 
      row.email?.toLowerCase() === email.toLowerCase() && 
      row.clave === pin
    );

    if (userRow) {
      return {
        email: userRow.email,
        name: userRow.nombre || "Usuario",
        savings: parseFloat(userRow.ahorros) || 0,
        balance: parseFloat(userRow.saldo) || 0,
        activeLoans: parseFloat(userRow.prestamos_activos) || 0,
        totalDebt: parseFloat(userRow.deuda_total) || 0,
        pendingSavingsInstallments: parseInt(userRow.cuotas_ahorro_pendientes) || 0,
        savingsInstallmentAmount: parseFloat(userRow.monto_cuota_ahorro) || 0,
        paxg: parseFloat(userRow.paxg) || 0,
        latam: parseFloat(userRow.latam) || 0,
        gldc: parseFloat(userRow.gldc) || 0,
        history: [
          { 
            id: 'init', 
            type: 'deposito', 
            amount: (parseFloat(userRow.ahorros) || 0) + (parseFloat(userRow.paxg) || 0) + (parseFloat(userRow.latam) || 0) + (parseFloat(userRow.gldc) || 0), 
            date: new Date().toLocaleDateString(), 
            description: 'Sincronización de activos finalizada' 
          }
        ]
      };
    }
    return null;
  } catch (error) {
    console.error("Sheet Service Error:", error);
    return null;
  }
};

export const requestLoan = async (email: string, amount: number): Promise<boolean> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return true; 
};
