export interface Bank {
  id: string;
  issuer: string;
  name: string;
  network: "Visa" | "Mastercard" | "Amex" | "Discover" | "Other";
  type: "credit" | "debit";
  markup: number;              // exchange rate markup %
  foreignTransactionFee: number; // foreign transaction fee %
  notes: string;
}

export const BANKS: Bank[] = [
  // ── Chase ──────────────────────────────────────────────────────────────────
  { id: "chase_sapphire_preferred",  issuer: "Chase", name: "Sapphire Preferred",  network: "Visa",       type: "credit", markup: 0,   foreignTransactionFee: 0,   notes: "No foreign transaction fees" },
  { id: "chase_sapphire_reserve",    issuer: "Chase", name: "Sapphire Reserve",    network: "Visa",       type: "credit", markup: 0,   foreignTransactionFee: 0,   notes: "No foreign transaction fees" },
  { id: "chase_freedom_unlimited",   issuer: "Chase", name: "Freedom Unlimited",   network: "Visa",       type: "credit", markup: 1.5, foreignTransactionFee: 3,   notes: "3% foreign transaction fee" },
  { id: "chase_freedom_flex",        issuer: "Chase", name: "Freedom Flex",        network: "Visa",       type: "credit", markup: 1.5, foreignTransactionFee: 3,   notes: "3% foreign transaction fee" },
  { id: "chase_freedom_student",     issuer: "Chase", name: "Freedom Student",     network: "Visa",       type: "credit", markup: 1.5, foreignTransactionFee: 3,   notes: "3% foreign transaction fee" },
  { id: "chase_ink_preferred",       issuer: "Chase", name: "Ink Business Preferred", network: "Visa",   type: "credit", markup: 0,   foreignTransactionFee: 0,   notes: "No foreign transaction fees" },

  // ── Capital One ────────────────────────────────────────────────────────────
  { id: "cap1_venture_x",            issuer: "Capital One", name: "Venture X",          network: "Visa",       type: "credit", markup: 0, foreignTransactionFee: 0, notes: "No foreign transaction fees on all Capital One cards" },
  { id: "cap1_venture",              issuer: "Capital One", name: "Venture",             network: "Visa",       type: "credit", markup: 0, foreignTransactionFee: 0, notes: "No foreign transaction fees" },
  { id: "cap1_quicksilver",          issuer: "Capital One", name: "Quicksilver",         network: "Visa",       type: "credit", markup: 0, foreignTransactionFee: 0, notes: "No foreign transaction fees" },
  { id: "cap1_savor",                issuer: "Capital One", name: "Savor / SavorOne",    network: "Mastercard", type: "credit", markup: 0, foreignTransactionFee: 0, notes: "No foreign transaction fees" },
  { id: "cap1_debit",                issuer: "Capital One", name: "360 Checking Debit",  network: "Mastercard", type: "debit",  markup: 0, foreignTransactionFee: 0, notes: "No foreign transaction fees" },

  // ── American Express ───────────────────────────────────────────────────────
  { id: "amex_platinum",             issuer: "American Express", name: "Platinum",        network: "Amex", type: "credit", markup: 0,   foreignTransactionFee: 0,   notes: "No foreign transaction fees" },
  { id: "amex_gold",                 issuer: "American Express", name: "Gold",            network: "Amex", type: "credit", markup: 0,   foreignTransactionFee: 0,   notes: "No foreign transaction fees" },
  { id: "amex_green",                issuer: "American Express", name: "Green",           network: "Amex", type: "credit", markup: 0,   foreignTransactionFee: 0,   notes: "No foreign transaction fees" },
  { id: "amex_blue_cash_preferred",  issuer: "American Express", name: "Blue Cash Preferred", network: "Amex", type: "credit", markup: 1.5, foreignTransactionFee: 2.7, notes: "2.7% foreign transaction fee" },
  { id: "amex_blue_cash_everyday",   issuer: "American Express", name: "Blue Cash Everyday",  network: "Amex", type: "credit", markup: 1.5, foreignTransactionFee: 2.7, notes: "2.7% foreign transaction fee" },

  // ── Citi ───────────────────────────────────────────────────────────────────
  { id: "citi_strata_premier",       issuer: "Citi", name: "Strata Premier",    network: "Mastercard", type: "credit", markup: 0,   foreignTransactionFee: 0,   notes: "No foreign transaction fees" },
  { id: "citi_double_cash",          issuer: "Citi", name: "Double Cash",       network: "Mastercard", type: "credit", markup: 1.5, foreignTransactionFee: 3,   notes: "3% foreign transaction fee" },
  { id: "citi_custom_cash",          issuer: "Citi", name: "Custom Cash",       network: "Mastercard", type: "credit", markup: 1.5, foreignTransactionFee: 3,   notes: "3% foreign transaction fee" },
  { id: "citi_diamond_preferred",    issuer: "Citi", name: "Diamond Preferred", network: "Mastercard", type: "credit", markup: 1.5, foreignTransactionFee: 3,   notes: "3% foreign transaction fee" },

  // ── Bank of America ────────────────────────────────────────────────────────
  { id: "bofa_premium_rewards",      issuer: "Bank of America", name: "Premium Rewards",    network: "Visa", type: "credit", markup: 0,   foreignTransactionFee: 0,   notes: "No foreign transaction fees" },
  { id: "bofa_travel_rewards",       issuer: "Bank of America", name: "Travel Rewards",     network: "Visa", type: "credit", markup: 1,   foreignTransactionFee: 0,   notes: "No foreign transaction fees" },
  { id: "bofa_customized_cash",      issuer: "Bank of America", name: "Customized Cash",    network: "Visa", type: "credit", markup: 1.5, foreignTransactionFee: 3,   notes: "3% foreign transaction fee" },
  { id: "bofa_unlimited_cash",       issuer: "Bank of America", name: "Unlimited Cash",     network: "Visa", type: "credit", markup: 1.5, foreignTransactionFee: 3,   notes: "3% foreign transaction fee" },

  // ── Wells Fargo ────────────────────────────────────────────────────────────
  { id: "wf_autograph",              issuer: "Wells Fargo", name: "Autograph",    network: "Visa", type: "credit", markup: 0,   foreignTransactionFee: 0, notes: "No foreign transaction fees" },
  { id: "wf_autograph_journey",      issuer: "Wells Fargo", name: "Autograph Journey", network: "Visa", type: "credit", markup: 0, foreignTransactionFee: 0, notes: "No foreign transaction fees" },
  { id: "wf_active_cash",            issuer: "Wells Fargo", name: "Active Cash",  network: "Visa", type: "credit", markup: 1.5, foreignTransactionFee: 3, notes: "3% foreign transaction fee" },
  { id: "wf_reflect",                issuer: "Wells Fargo", name: "Reflect",      network: "Visa", type: "credit", markup: 1.5, foreignTransactionFee: 3, notes: "3% foreign transaction fee" },

  // ── Discover ───────────────────────────────────────────────────────────────
  { id: "discover_it",               issuer: "Discover", name: "Discover it Cash Back", network: "Discover", type: "credit", markup: 0, foreignTransactionFee: 0, notes: "No foreign transaction fees" },
  { id: "discover_it_miles",         issuer: "Discover", name: "Discover it Miles",     network: "Discover", type: "credit", markup: 0, foreignTransactionFee: 0, notes: "No foreign transaction fees" },
  { id: "discover_student",          issuer: "Discover", name: "Discover it Student",   network: "Discover", type: "credit", markup: 0, foreignTransactionFee: 0, notes: "No foreign transaction fees" },

  // ── Charles Schwab ─────────────────────────────────────────────────────────
  { id: "schwab_debit",              issuer: "Charles Schwab", name: "Investor Checking Debit", network: "Visa", type: "debit", markup: 0, foreignTransactionFee: 0, notes: "Reimburses all ATM fees worldwide" },

  // ── Fidelity ───────────────────────────────────────────────────────────────
  { id: "fidelity_debit",            issuer: "Fidelity", name: "Cash Management Debit", network: "Visa", type: "debit",  markup: 0, foreignTransactionFee: 0,   notes: "No foreign transaction fees" },
  { id: "fidelity_rewards_visa",     issuer: "Fidelity", name: "Rewards Visa Signature", network: "Visa", type: "credit", markup: 1, foreignTransactionFee: 1, notes: "1% foreign transaction fee" },

  // ── Wise ───────────────────────────────────────────────────────────────────
  { id: "wise_debit",                issuer: "Wise", name: "Wise Debit Card",     network: "Visa",       type: "debit",  markup: 0.5, foreignTransactionFee: 0, notes: "~0.5% markup, best mid-market rate" },

  // ── Revolut ────────────────────────────────────────────────────────────────
  { id: "revolut_standard",          issuer: "Revolut", name: "Standard (Free)",  network: "Visa",       type: "debit",  markup: 0,   foreignTransactionFee: 0, notes: "No fees on weekdays (fair use limit)" },
  { id: "revolut_premium",           issuer: "Revolut", name: "Premium / Metal",  network: "Visa",       type: "debit",  markup: 0,   foreignTransactionFee: 0, notes: "No fees, higher limits" },

  // ── Custom ─────────────────────────────────────────────────────────────────
  { id: "custom", issuer: "Custom / Other", name: "Enter manually", network: "Other", type: "credit", markup: 0, foreignTransactionFee: 0, notes: "Set your own markup and fee" },
];

/** All unique issuers in display order */
export const ISSUERS = Array.from(new Set(BANKS.map(b => b.issuer)));

/** Cards grouped by issuer */
export function cardsByIssuer(issuer: string): Bank[] {
  return BANKS.filter(b => b.issuer === issuer);
}
