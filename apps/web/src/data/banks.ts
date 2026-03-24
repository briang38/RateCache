export interface Bank {
  id: string;
  name: string;
  markup: number; // percentage e.g. 3 = 3%
  foreignTransactionFee: number; // percentage e.g. 3 = 3%
  notes: string;
}

export const BANKS: Bank[] = [
  { id: "chase_sapphire", name: "Chase Sapphire", markup: 0, foreignTransactionFee: 0, notes: "No foreign fees" },
  { id: "chase_freedom", name: "Chase Freedom", markup: 1.5, foreignTransactionFee: 3, notes: "3% foreign transaction fee" },
  { id: "bofa_travel", name: "Bank of America Travel", markup: 1, foreignTransactionFee: 0, notes: "No foreign fees" },
  { id: "bofa_standard", name: "Bank of America Standard", markup: 1.5, foreignTransactionFee: 3, notes: "3% foreign transaction fee" },
  { id: "wells_fargo", name: "Wells Fargo", markup: 2, foreignTransactionFee: 3, notes: "3% foreign transaction fee" },
  { id: "citi_premier", name: "Citi Premier", markup: 0, foreignTransactionFee: 0, notes: "No foreign fees" },
  { id: "citi_standard", name: "Citi Standard", markup: 1.5, foreignTransactionFee: 3, notes: "3% foreign transaction fee" },
  { id: "capital_one", name: "Capital One", markup: 0, foreignTransactionFee: 0, notes: "No foreign fees" },
  { id: "schwab", name: "Charles Schwab", markup: 0, foreignTransactionFee: 0, notes: "No foreign fees" },
  { id: "wise", name: "Wise", markup: 0.5, foreignTransactionFee: 0, notes: "~0.5% markup, best for transfers" },
  { id: "revolut", name: "Revolut", markup: 0, foreignTransactionFee: 0, notes: "No fees on weekdays" },
  { id: "amex_gold", name: "Amex Gold", markup: 0, foreignTransactionFee: 0, notes: "No foreign fees" },
  { id: "amex_standard", name: "Amex Standard", markup: 1.5, foreignTransactionFee: 2.7, notes: "2.7% foreign transaction fee" },
  { id: "discover", name: "Discover", markup: 0, foreignTransactionFee: 0, notes: "No foreign fees" },
  { id: "custom", name: "Custom / Other", markup: 0, foreignTransactionFee: 0, notes: "Set your own rates" },
];