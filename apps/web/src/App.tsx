import { useState, useEffect } from "react";
import "./App.css";
import { onAuthStateChanged, signOut } from "firebase/auth";
import type { User } from "firebase/auth";
import { auth } from "./firebase";
import Login from "./components/Login";
import CurrencySettings from "./components/CurrencySettings";
import BankSettings from "./components/BankSettings";
import CurrencyCard from "./components/CurrencyCard";
import { useRates } from "./hooks/useRates";
import { useUserPreferences } from "./hooks/useUserPreferences";
import { BANKS } from "./data/banks";

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState(1);
  const [showSettings, setShowSettings] = useState(false);
  const [showBankSettings, setShowBankSettings] = useState(false);
  const { preferences, updatePreferences } = useUserPreferences(user);
  const { getRate, lastUpdated, isOffline } = useRates(preferences.baseCurrency);

  const selectedBank = BANKS.find((b) => b.id === preferences.bankId) ?? BANKS[BANKS.length - 1];
  const effectiveMarkup = preferences.bankId === "custom" ? preferences.customMarkup : selectedBank.markup;
  const effectiveFee = preferences.bankId === "custom" ? preferences.customForeignFee : selectedBank.foreignTransactionFee;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <p style={{ textAlign: "center", marginTop: "40px" }}>Loading...</p>;
  if (!user) return <Login />;
  if (showSettings) return (
    <CurrencySettings preferences={preferences} onSave={updatePreferences} onClose={() => setShowSettings(false)} />
  );
  if (showBankSettings) return (
    <BankSettings preferences={preferences} onSave={updatePreferences} onClose={() => setShowBankSettings(false)} />
  );

  return (
    <div style={{ padding: "24px", maxWidth: "480px", margin: "0 auto" }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <img src={user.photoURL ?? ""} referrerPolicy="no-referrer" width={36} style={{ borderRadius: "50%" }} />
          <span style={{ fontWeight: "bold" }}>{user.displayName}</span>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button onClick={() => setShowBankSettings(true)} style={{ padding: "6px 12px", borderRadius: "6px", border: "1px solid #ccc", cursor: "pointer" }}>
            🏦 Bank
          </button>
          <button onClick={() => setShowSettings(true)} style={{ padding: "6px 12px", borderRadius: "6px", border: "1px solid #ccc", cursor: "pointer" }}>
            ⚙️ Settings
          </button>
          <button onClick={() => signOut(auth)} style={{ padding: "6px 12px", borderRadius: "6px", border: "1px solid #ccc", cursor: "pointer" }}>
            Sign Out
          </button>
        </div>
      </div>

      {/* Title */}
      <h1 style={{ margin: "0 0 4px" }}>RateCache</h1>
      <p style={{ fontSize: "12px", color: "gray", margin: "0 0 4px" }}>
        {isOffline ? "⚠️ Offline — " : "✅ Live — "} Last updated: {lastUpdated}
      </p>
      <p style={{ fontSize: "12px", color: "gray", margin: "0 0 20px" }}>
        🏦 {selectedBank.name} · {effectiveMarkup}% markup · {effectiveFee}% foreign fee
      </p>

      {/* Amount input */}
      <div style={{ marginBottom: "24px" }}>
        <label style={{ fontSize: "14px", color: "gray", display: "block", marginBottom: "6px" }}>
          Amount in {preferences.baseCurrency}
        </label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          style={{ width: "100%", padding: "12px", fontSize: "20px", borderRadius: "8px", border: "1px solid #ccc", boxSizing: "border-box" }}
        />
      </div>

      {/* Currency cards */}
      {preferences.currencies.map((currency) => (
        <CurrencyCard
          key={currency}
          fromCurrency={preferences.baseCurrency}
          toCurrency={currency}
          amount={amount}
          rate={getRate(currency)}
          bankMarkup={effectiveMarkup}
          foreignFee={effectiveFee}
          bankName={selectedBank.name}
        />
      ))}

      {isOffline && (
        <p style={{ color: "orange", textAlign: "center", marginTop: "16px" }}>
          ⚠️ Offline mode — using cached rates
        </p>
      )}
    </div>
  );
}

export default App;