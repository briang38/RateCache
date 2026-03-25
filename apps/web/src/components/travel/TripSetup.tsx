import { useState } from "react";
import useTripStore, { CATEGORY_PRESETS, CURRENCIES } from "../../store/tripStore";

interface Props { userId: string; }

export default function TripSetup({ userId }: Props) {
  const createTrip = useTripStore(s => s.createTrip);
  const loading    = useTripStore(s => s.loading);
  const [saveError, setSaveError] = useState("");

  const [destination, setDestination] = useState("Tokyo, Japan");
  const [startDate,   setStartDate]   = useState("2025-05-18");
  const [endDate,     setEndDate]     = useState("2025-06-05");
  const [totalBudget, setTotalBudget] = useState("1000");
  const [currency,    setCurrency]    = useState("USD");
  const [activeCats,  setActiveCats]  = useState<Set<string>>(
    new Set(CATEGORY_PRESETS.map(c => c.name))
  );

  const toggleCat = (name: string) => {
    setActiveCats(prev => {
      const next = new Set(prev);
      if (next.has(name)) { if (next.size > 1) next.delete(name); }
      else next.add(name);
      return next;
    });
  };

  const handleStart = async () => {
    if (!destination.trim() || !startDate || !endDate) return;
    setSaveError("");
    const categories = CATEGORY_PRESETS.filter(c => activeCats.has(c.name));
    const budget = parseFloat(totalBudget) || 1000;
    const catBudgets: Record<string, number> = {};
    categories.forEach(c => { catBudgets[c.name] = Math.round(budget / categories.length); });
    try {
      await createTrip(userId, { destination, startDate, endDate, totalBudget: budget, currency, categories, catBudgets });
    } catch (e: any) {
      const code = e?.code ?? "";
      if (code.includes("permission")) {
        setSaveError("Save failed: Firestore permission denied. Check your database rules in Firebase Console.");
      } else {
        setSaveError("Save failed. Check your internet connection and try again.");
      }
    }
  };

  const inp: React.CSSProperties = {
    width: "100%",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 12,
    padding: "11px 14px",
    color: "#f0effe",
    fontFamily: "inherit",
    fontSize: 14,
    fontWeight: 500,
    outline: "none",
    boxSizing: "border-box",
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cabinet+Grotesk:wght@400;500;700;800;900&family=DM+Mono:wght@400;500&display=swap');
        .rc-setup-card { animation: rcSetupIn 0.5s ease both; }
        @keyframes rcSetupIn { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        .rc-cat-chip { transition: all 0.15s; }
        .rc-cat-chip:hover { background: rgba(255,255,255,0.08) !important; }
        .rc-inp:focus { border-color: #f0c060 !important; background: rgba(240,192,96,0.06) !important; }
        .rc-start-btn:hover { opacity: 0.87; }
        .rc-start-btn:active { transform: scale(0.98); }
      `}</style>

      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem 1.5rem", position: "relative", zIndex: 1, fontFamily: "'Cabinet Grotesk', sans-serif" }}>
        <div className="rc-setup-card" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 24, padding: "2.5rem", width: "100%", maxWidth: 540, backdropFilter: "blur(20px)", boxShadow: "0 32px 64px rgba(0,0,0,0.5)" }}>

          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#f0c060", fontFamily: "'DM Mono',monospace", marginBottom: "0.75rem" }}>
            RateCache · Travel
          </div>
          <div style={{ fontSize: 32, fontWeight: 900, letterSpacing: "-0.03em", marginBottom: "0.5rem", color: "#f0effe" }}>
            Plan your trip
          </div>
          <div style={{ color: "rgba(240,239,254,0.45)", fontSize: 14, marginBottom: "2rem", lineHeight: 1.6 }}>
            Set your destination, dates, and budget. We'll handle the math.
          </div>

          {/* Destination */}
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(240,239,254,0.45)", fontFamily: "'DM Mono',monospace", marginBottom: 8 }}>Destination</label>
            <input className="rc-inp" style={inp} placeholder="e.g. Tokyo, Japan" value={destination} onChange={e => setDestination(e.target.value)} />
          </div>

          {/* Dates */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
            <div>
              <label style={{ display: "block", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(240,239,254,0.45)", fontFamily: "'DM Mono',monospace", marginBottom: 8 }}>Start Date</label>
              <input className="rc-inp" style={inp} type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(240,239,254,0.45)", fontFamily: "'DM Mono',monospace", marginBottom: 8 }}>End Date</label>
              <input className="rc-inp" style={inp} type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
            </div>
          </div>

          {/* Budget + Currency */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
            <div>
              <label style={{ display: "block", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(240,239,254,0.45)", fontFamily: "'DM Mono',monospace", marginBottom: 8 }}>Total Budget</label>
              <input className="rc-inp" style={inp} type="number" placeholder="1000" value={totalBudget} onChange={e => setTotalBudget(e.target.value)} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(240,239,254,0.45)", fontFamily: "'DM Mono',monospace", marginBottom: 8 }}>Currency</label>
              <select className="rc-inp" style={{ ...inp, appearance: "none" }} value={currency} onChange={e => setCurrency(e.target.value)}>
                {CURRENCIES.map(c => <option key={c.code} value={c.code} style={{ background: "#0e0e1e" }}>{c.code} — {c.label}</option>)}
              </select>
            </div>
          </div>

          {/* Categories */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(240,239,254,0.45)", fontFamily: "'DM Mono',monospace", marginBottom: 10 }}>Categories</label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
              {CATEGORY_PRESETS.map(c => {
                const active = activeCats.has(c.name);
                return (
                  <div key={c.name} className="rc-cat-chip" onClick={() => toggleCat(c.name)} style={{
                    display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
                    padding: "12px 8px", borderRadius: 12, cursor: "pointer", userSelect: "none",
                    border: `1px solid ${active ? "#f0c060" : "rgba(255,255,255,0.08)"}`,
                    background: active ? "rgba(240,192,96,0.1)" : "rgba(255,255,255,0.03)",
                  }}>
                    <span style={{ fontSize: 22, lineHeight: 1 }}>{c.icon}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: active ? "#f0c060" : "rgba(240,239,254,0.45)", letterSpacing: "0.04em" }}>{c.name}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <button className="rc-start-btn" disabled={loading} onClick={handleStart} style={{
            width: "100%", background: "#f0c060", color: "#0a0800",
            border: "none", padding: 14, borderRadius: 12,
            fontFamily: "inherit", fontSize: 15, fontWeight: 900,
            cursor: "pointer", letterSpacing: "0.01em", transition: "opacity 0.15s, transform 0.1s",
          }}>
            {loading ? "Setting up…" : "Start Tracking →"}
          </button>

          {saveError && (
            <p style={{ marginTop: 12, fontSize: 12, color: "#fb923c", textAlign: "center", lineHeight: 1.5 }}>
              ⚠️ {saveError}
            </p>
          )}
        </div>
      </div>
    </>
  );
}