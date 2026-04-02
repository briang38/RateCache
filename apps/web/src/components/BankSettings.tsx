import { useState } from "react";
import { BANKS, ISSUERS, cardsByIssuer } from "../data/banks";
import type { UserPreferences } from "../hooks/useUserPreferences";

interface Props {
  preferences: UserPreferences;
  onSave: (updated: Partial<UserPreferences>) => Promise<void>;
  onClose: () => void;
}

const inp: React.CSSProperties = {
  width: "100%",
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 10,
  padding: "11px 14px",
  color: "#f0effe",
  fontFamily: "'Cabinet Grotesk', sans-serif",
  fontSize: 14,
  outline: "none",
  boxSizing: "border-box",
};

const networkColor: Record<string, string> = {
  Visa: "#1a1f71",
  Mastercard: "#eb001b",
  Amex: "#007bc1",
  Discover: "#f76f20",
  Other: "#444",
};

export default function BankSettings({ preferences, onSave, onClose }: Props) {
  const current = BANKS.find(b => b.id === (preferences.bankId ?? "custom")) ?? BANKS[BANKS.length - 1];
  const [step, setStep]                   = useState<"issuer" | "card">(preferences.bankId ? "card" : "issuer");
  const [selectedIssuer, setSelectedIssuer] = useState(current.issuer);
  const [bankId, setBankId]               = useState(preferences.bankId ?? "custom");
  const [customMarkup, setCustomMarkup]   = useState(preferences.customMarkup ?? 0);
  const [customFee, setCustomFee]         = useState(preferences.customForeignFee ?? 0);
  const [saving, setSaving]               = useState(false);

  const selectedCard = BANKS.find(b => b.id === bankId) ?? BANKS[BANKS.length - 1];
  const isCustom     = bankId === "custom";
  const effectiveMarkup = isCustom ? customMarkup : selectedCard.markup;
  const effectiveFee    = isCustom ? customFee    : selectedCard.foreignTransactionFee;
  const totalCost       = effectiveMarkup + effectiveFee;

  async function handleSave() {
    setSaving(true);
    await onSave({ bankId, customMarkup, customForeignFee: customFee });
    setSaving(false);
    onClose();
  }

  return (
    <div style={{ minHeight: "100vh", background: "#05050f", fontFamily: "'Cabinet Grotesk', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cabinet+Grotesk:wght@400;500;700;800;900&family=DM+Mono:wght@400;500&display=swap');
        .bs-content { max-width: 480px; margin: 0 auto; padding: 20px 20px 40px; }
        .bs-issuer-grid { display: flex; flex-direction: column; gap: 8px; }
        .bs-card-grid { display: flex; flex-direction: column; gap: 8px; }
        .bs-card-img { width: 80px; height: 50px; }
        .bs-header-inner { max-width: 900px; margin: 0 auto; display: flex; align-items: center; gap: 12px; padding: 0 20px; }
        @media (min-width: 640px) {
          .bs-content { max-width: 720px; padding: 28px 32px 48px; }
          .bs-issuer-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
          .bs-card-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
          .bs-card-img { width: 96px; height: 60px; }
        }
        @media (min-width: 1024px) {
          .bs-content { max-width: 900px; }
          .bs-issuer-grid { grid-template-columns: 1fr 1fr 1fr; }
          .bs-card-grid { grid-template-columns: 1fr 1fr 1fr; }
          .bs-card-img { width: 110px; height: 69px; }
        }
      `}</style>

      {/* Header */}
      <div style={{
        position: "sticky", top: 0, zIndex: 10,
        background: "rgba(5,5,15,0.85)", backdropFilter: "blur(14px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        padding: "14px 0",
      }}>
        <div className="bs-header-inner">
          <button
            onClick={step === "card" ? () => setStep("issuer") : onClose}
            style={{ background: "none", border: "none", color: "rgba(240,239,254,0.6)", cursor: "pointer", fontSize: 18, padding: 0, lineHeight: 1 }}
          >
            ←
          </button>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: "#f0effe" }}>
              {step === "issuer" ? "Choose Your Bank" : selectedIssuer}
            </div>
            <div style={{ fontSize: 11, color: "rgba(240,239,254,0.35)", fontFamily: "'DM Mono',monospace" }}>
              {step === "issuer" ? "Select your card issuer" : "Select your card"}
            </div>
          </div>
        </div>
      </div>

      <div className="bs-content">

        {/* Current card badge */}
        {preferences.bankId && (
          <div style={{
            display: "flex", alignItems: "center", gap: 12, marginBottom: 20,
            padding: "12px 14px", borderRadius: 14,
            background: "rgba(240,192,96,0.06)", border: "1px solid rgba(240,192,96,0.2)",
          }}>
            <div style={{ width: 64, height: 40, borderRadius: 5, overflow: "hidden", background: "rgba(255,255,255,0.08)", flexShrink: 0 }}>
              <img
                src={`/cards/${current.id}.png`}
                alt={current.name}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                onError={e => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 10, color: "rgba(240,239,254,0.35)", fontFamily: "'DM Mono',monospace", marginBottom: 2 }}>ACTIVE CARD</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#f0c060" }}>{current.issuer} {current.name}</div>
            </div>
            <span style={{ fontSize: 12, fontWeight: 700, color: totalCost === 0 ? "#34d399" : "#fb923c", fontFamily: "'DM Mono',monospace" }}>
              {totalCost === 0 ? "0% fees" : `+${totalCost}%`}
            </span>
          </div>
        )}

        {/* Step 1: Issuer list */}
        {step === "issuer" && (
          <div className="bs-issuer-grid">
            {ISSUERS.map(issuer => {
              const cards = cardsByIssuer(issuer);
              const hasNoFeeCards = cards.some(c => c.foreignTransactionFee === 0 && c.markup === 0);
              return (
                <button
                  key={issuer}
                  onClick={() => { setSelectedIssuer(issuer); setStep("card"); }}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "14px 16px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.08)",
                    background: selectedIssuer === issuer ? "rgba(240,192,96,0.07)" : "rgba(255,255,255,0.03)",
                    cursor: "pointer", textAlign: "left", transition: "background 0.15s",
                  }}
                >
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#f0effe", marginBottom: 2 }}>{issuer}</div>
                    <div style={{ fontSize: 11, color: "rgba(240,239,254,0.35)", fontFamily: "'DM Mono',monospace" }}>
                      {cards.length === 1 ? "1 card" : `${cards.length} cards`}
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {hasNoFeeCards && (
                      <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20, background: "rgba(52,211,153,0.1)", color: "#34d399", border: "1px solid rgba(52,211,153,0.2)" }}>
                        NO FEE
                      </span>
                    )}
                    <span style={{ color: "rgba(240,239,254,0.25)", fontSize: 14 }}>›</span>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Step 2: Card list */}
        {step === "card" && (
          <div className="bs-card-grid">
            {cardsByIssuer(selectedIssuer).map(card => {
              const isSelected = bankId === card.id;
              const totalFee   = card.markup + card.foreignTransactionFee;
              const imgSrc     = `/cards/${card.id}.png`;
              return (
                <button
                  key={card.id}
                  onClick={() => setBankId(card.id)}
                  style={{
                    display: "flex", alignItems: "center", gap: 14,
                    padding: "12px 14px", borderRadius: 14,
                    border: `1px solid ${isSelected ? "rgba(240,192,96,0.4)" : "rgba(255,255,255,0.08)"}`,
                    background: isSelected ? "rgba(240,192,96,0.08)" : "rgba(255,255,255,0.03)",
                    cursor: "pointer", textAlign: "left", transition: "all 0.15s",
                  }}
                >
                  {/* Card image */}
                  <div className="bs-card-img" style={{
                    borderRadius: 6, flexShrink: 0, overflow: "hidden",
                    background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <img
                      src={imgSrc}
                      alt={card.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 5 }}
                      onError={e => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                    />
                  </div>

                  {/* Card info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: isSelected ? "#f0c060" : "#f0effe" }}>{card.name}</span>
                      <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 4, background: networkColor[card.network] ?? "#333", color: "#fff" }}>
                        {card.network}
                      </span>
                    </div>
                    <div style={{ fontSize: 11, color: "rgba(240,239,254,0.4)", fontFamily: "'DM Mono',monospace" }}>
                      {card.foreignTransactionFee > 0 ? `${card.foreignTransactionFee}% foreign fee` : "no foreign fee"}
                      {card.markup > 0 ? ` · ${card.markup}% markup` : ""}
                    </div>
                  </div>

                  {/* Fee badge + checkmark */}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4, flexShrink: 0 }}>
                    <span style={{
                      fontSize: 11, fontWeight: 700, fontFamily: "'DM Mono',monospace",
                      padding: "3px 8px", borderRadius: 20,
                      background: totalFee === 0 ? "rgba(52,211,153,0.1)" : "rgba(251,146,60,0.1)",
                      color: totalFee === 0 ? "#34d399" : totalFee <= 1 ? "#a78bfa" : "#fb923c",
                      border: `1px solid ${totalFee === 0 ? "rgba(52,211,153,0.2)" : "rgba(251,146,60,0.2)"}`,
                    }}>
                      {totalFee === 0 ? "FREE" : `+${totalFee}%`}
                    </span>
                    {isSelected && <span style={{ color: "#f0c060", fontSize: 14 }}>✓</span>}
                  </div>
                </button>
              );
            })}

            {/* Custom inputs */}
            {isCustom && (
              <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 12 }}>
                <div>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(240,239,254,0.35)", fontFamily: "'DM Mono',monospace", marginBottom: 6 }}>
                    Exchange Rate Markup (%)
                  </label>
                  <input style={inp} type="number" step="0.1" min="0" value={customMarkup} onChange={e => setCustomMarkup(Number(e.target.value))} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(240,239,254,0.35)", fontFamily: "'DM Mono',monospace", marginBottom: 6 }}>
                    Foreign Transaction Fee (%)
                  </label>
                  <input style={inp} type="number" step="0.1" min="0" value={customFee} onChange={e => setCustomFee(Number(e.target.value))} />
                </div>
              </div>
            )}

            {/* Fee summary */}
            <div style={{ marginTop: 8, padding: "14px 16px", borderRadius: 12, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(240,239,254,0.35)", fontFamily: "'DM Mono',monospace", marginBottom: 10 }}>
                Your effective cost
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 13, color: "rgba(240,239,254,0.5)" }}>Exchange markup</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: effectiveMarkup > 0 ? "#fb923c" : "#34d399", fontFamily: "'DM Mono',monospace" }}>
                  {effectiveMarkup > 0 ? `+${effectiveMarkup}%` : "0%"}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <span style={{ fontSize: 13, color: "rgba(240,239,254,0.5)" }}>Foreign transaction fee</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: effectiveFee > 0 ? "#fb923c" : "#34d399", fontFamily: "'DM Mono',monospace" }}>
                  {effectiveFee > 0 ? `+${effectiveFee}%` : "0%"}
                </span>
              </div>
              <div style={{ height: 1, background: "rgba(255,255,255,0.06)", marginBottom: 10 }} />
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 14, fontWeight: 800, color: "#f0effe" }}>Total added cost</span>
                <span style={{ fontSize: 14, fontWeight: 800, color: totalCost === 0 ? "#34d399" : totalCost <= 1 ? "#a78bfa" : "#fb923c", fontFamily: "'DM Mono',monospace" }}>
                  {totalCost === 0 ? "0% — no fees!" : `+${totalCost}%`}
                </span>
              </div>
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              style={{
                marginTop: 8, width: "100%", padding: "13px", borderRadius: 12, border: "none",
                background: "#f0c060", color: "#0a0800",
                fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 15, fontWeight: 900,
                cursor: "pointer", opacity: saving ? 0.7 : 1,
              }}
            >
              {saving ? "Saving…" : "Save Card Settings"}
            </button>
            <button
              onClick={onClose}
              style={{
                width: "100%", padding: "11px", borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.1)", background: "transparent",
                color: "rgba(240,239,254,0.5)",
                fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 14, fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
