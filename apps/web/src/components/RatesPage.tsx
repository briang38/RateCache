import { useState } from "react";
import type { User } from "firebase/auth";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import SceneBackground from "./travel/SceneBackground";
import CurrencyCard from "./CurrencyCard";
import CurrencySettings from "./CurrencySettings";
import BankSettings from "./BankSettings";
import useTripStore from "../store/tripStore";
import { daysLeft, getCurrencySymbol } from "../store/tripStore";
import { useRates } from "../hooks/useRates";
import { useUserPreferences } from "../hooks/useUserPreferences";
import { BANKS } from "../data/banks";

interface Props {
  user: User;
  onGoToTravel: () => void;
}

function greeting(name: string) {
  const h = new Date().getHours();
  const time = h < 12 ? "morning" : h < 17 ? "afternoon" : "evening";
  return `Good ${time}, ${name.split(" ")[0]}`;
}

const glassBtn: React.CSSProperties = {
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.1)",
  color: "rgba(240,239,254,0.7)",
  padding: "6px 13px",
  borderRadius: 8,
  fontSize: 12,
  fontWeight: 700,
  cursor: "pointer",
  fontFamily: "'Cabinet Grotesk', sans-serif",
};

export default function RatesPage({ user, onGoToTravel }: Props) {
  const [amount, setAmount] = useState(1);
  const [showSettings, setShowSettings] = useState(false);
  const [showBankSettings, setShowBankSettings] = useState(false);

  const { preferences, updatePreferences } = useUserPreferences(user);
  const { getRate, lastUpdated, isOffline } = useRates(preferences.baseCurrency);

  const trip = useTripStore(s => s.trip);
  const getTotalSpent = useTripStore(s => s.getTotalSpent);

  const selectedBank = BANKS.find(b => b.id === preferences.bankId) ?? BANKS[BANKS.length - 1];
  const effectiveMarkup = preferences.bankId === "custom" ? preferences.customMarkup : selectedBank.markup;
  const effectiveFee = preferences.bankId === "custom" ? preferences.customForeignFee : selectedBank.foreignTransactionFee;

  if (showSettings) {
    return <CurrencySettings preferences={preferences} onSave={updatePreferences} onClose={() => setShowSettings(false)} />;
  }
  if (showBankSettings) {
    return <BankSettings preferences={preferences} onSave={updatePreferences} onClose={() => setShowBankSettings(false)} />;
  }

  const totalSpent = trip ? getTotalSpent() : 0;
  const budgetPct = trip ? Math.min(100, Math.round((totalSpent / trip.totalBudget) * 100)) : 0;
  const dl = trip ? daysLeft(trip.startDate, trip.endDate) : 0;
  const sym = trip ? getCurrencySymbol(trip.currency) : "$";

  return (
    <div style={{ minHeight: "100vh", background: "#05050f", position: "relative" }}>
      <SceneBackground />

      {/* Fixed header */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "12px 20px",
        background: "rgba(5,5,15,0.75)",
        backdropFilter: "blur(14px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {user.photoURL && (
            <img
              src={user.photoURL}
              referrerPolicy="no-referrer"
              width={32}
              style={{ borderRadius: "50%", border: "2px solid rgba(255,255,255,0.15)" }}
            />
          )}
          <span style={{ color: "rgba(240,239,254,0.9)", fontWeight: 700, fontSize: 14, fontFamily: "'Cabinet Grotesk', sans-serif" }}>
            {user.displayName}
          </span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => setShowBankSettings(true)} style={glassBtn}>🏦 Bank</button>
          <button onClick={() => setShowSettings(true)} style={glassBtn}>⚙️ Settings</button>
          <button onClick={() => signOut(auth)} style={glassBtn}>Sign out</button>
        </div>
      </div>

      {/* Scrollable content */}
      <div style={{ position: "relative", zIndex: 1, maxWidth: 480, margin: "0 auto", padding: "80px 20px 48px" }}>

        {/* Greeting */}
        <h2 style={{
          color: "rgba(240,239,254,0.95)",
          fontFamily: "'Cabinet Grotesk', sans-serif",
          fontSize: 26, fontWeight: 800,
          margin: "0 0 10px",
        }}>
          {greeting(user.displayName ?? "there")}
        </h2>

        {/* Status + bank row */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24, flexWrap: "wrap" }}>
          <span style={{
            fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20,
            background: isOffline ? "rgba(251,146,60,0.15)" : "rgba(52,211,153,0.15)",
            color: isOffline ? "#fb923c" : "#34d399",
            border: `1px solid ${isOffline ? "rgba(251,146,60,0.3)" : "rgba(52,211,153,0.3)"}`,
          }}>
            {isOffline ? "⚠️ Offline" : "✅ Live"} · {lastUpdated ?? "loading..."}
          </span>
          <span style={{ fontSize: 11, color: "rgba(240,239,254,0.4)" }}>
            🏦 {selectedBank.name} · {effectiveMarkup}% markup · {effectiveFee}% fee
          </span>
        </div>

        {/* Active trip snapshot */}
        {trip && (
          <div
            onClick={onGoToTravel}
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.09)",
              borderRadius: 14,
              padding: "14px 16px",
              marginBottom: 24,
              cursor: "pointer",
              transition: "background 0.15s",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.07)")}
            onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.04)")}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <span style={{ color: "rgba(240,239,254,0.9)", fontWeight: 700, fontSize: 15, fontFamily: "'Cabinet Grotesk', sans-serif" }}>
                ✈️ {trip.destination}
              </span>
              <span style={{ fontSize: 11, color: "rgba(240,239,254,0.4)" }}>
                {dl > 0 ? `${dl} day${dl !== 1 ? "s" : ""} left` : "Trip ended"}
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: "rgba(240,239,254,0.45)" }}>Budget used</span>
              <span style={{ fontSize: 12, color: "rgba(240,239,254,0.75)" }}>
                {sym}{totalSpent.toLocaleString()}
                <span style={{ color: "rgba(240,239,254,0.3)" }}> / {sym}{trip.totalBudget.toLocaleString()}</span>
              </span>
            </div>
            <div style={{ height: 4, background: "rgba(255,255,255,0.08)", borderRadius: 2, overflow: "hidden" }}>
              <div style={{
                height: "100%", width: `${budgetPct}%`,
                background: budgetPct > 85 ? "#fb923c" : "#60a5fa",
                borderRadius: 2, transition: "width 0.4s ease",
              }} />
            </div>
            <div style={{ marginTop: 6, fontSize: 11, color: "rgba(240,239,254,0.3)", textAlign: "right" }}>
              {budgetPct}% used · tap to manage →
            </div>
          </div>
        )}

        {/* Tab switcher */}
        <div style={{
          display: "flex", gap: 5, marginBottom: 24,
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 10, padding: 4,
        }}>
          <div style={{
            flex: 1, padding: "8px", borderRadius: 7, textAlign: "center",
            fontSize: 13, fontWeight: 700, fontFamily: "'Cabinet Grotesk', sans-serif",
            background: "rgba(255,255,255,0.09)",
            color: "rgba(240,239,254,0.9)",
          }}>
            💱 Rates
          </div>
          <button
            onClick={onGoToTravel}
            style={{
              flex: 1, padding: "8px", borderRadius: 7, border: "none", cursor: "pointer",
              background: "transparent", textAlign: "center",
              fontSize: 13, fontWeight: 700, fontFamily: "'Cabinet Grotesk', sans-serif",
              color: "rgba(240,239,254,0.4)",
            }}
          >
            ✈️ Travel Budget
          </button>
        </div>

        {/* Amount input */}
        <div style={{ marginBottom: 20 }}>
          <label style={{
            fontSize: 11, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase",
            color: "rgba(240,239,254,0.4)", display: "block", marginBottom: 8,
          }}>
            Amount in {preferences.baseCurrency}
          </label>
          <input
            type="number"
            value={amount}
            onChange={e => setAmount(Number(e.target.value))}
            style={{
              width: "100%", padding: "13px 16px", fontSize: 22, fontWeight: 700,
              borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)",
              background: "rgba(255,255,255,0.05)", color: "rgba(240,239,254,0.95)",
              boxSizing: "border-box", outline: "none", fontFamily: "'Cabinet Grotesk', sans-serif",
            }}
          />
        </div>

        {/* Currency cards */}
        {preferences.currencies.map(currency => (
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
      </div>
    </div>
  );
}
