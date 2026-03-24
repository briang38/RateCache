import { useState } from "react";
import useTripStore, { getCurrencySymbol, fmtDate } from "../../store/tripStore";
import { GlassCard, SectionHeader } from "./TripUI";

const CAT_COLORS = ["#f0c060","#60a5fa","#f472b6","#34d399","#c084fc","#fb923c"];

const inp: React.CSSProperties = {
  width: "100%",
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 10,
  padding: "10px 13px",
  color: "#f0effe",
  fontFamily: "inherit",
  fontSize: 13,
  fontWeight: 500,
  outline: "none",
  boxSizing: "border-box",
  appearance: "none",
};

// ─── Add Expense Form ─────────────────────────────────────────────────────────
export function AddExpenseForm() {
  const trip       = useTripStore(s => s.trip);
  const addExpense = useTripStore(s => s.addExpense);

  const today = new Date().toISOString().split("T")[0];
  const [name,   setName]   = useState("");
  const [amount, setAmount] = useState("");
  const [cat,    setCat]    = useState(trip?.categories[0]?.name ?? "");
  const [date,   setDate]   = useState(today);
  const [note,   setNote]   = useState("");
  const [shake,  setShake]  = useState(false);

  if (!trip) return null;
  

  const handleAdd = async () => {
    if (!name.trim() || !amount || !date) {
      setShake(true);
      setTimeout(() => setShake(false), 400);
      return;
    }
    await addExpense({ name: name.trim(), amount: parseFloat(amount), category: cat || trip.categories[0].name, date, note: note.trim() });
    setName(""); setAmount(""); setNote("");
  };

  return (
    <>
      <style>{`
        @keyframes rcShake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-5px)} 60%{transform:translateX(5px)} 80%{transform:translateX(-3px)} }
        .rc-shake { animation: rcShake 0.35s ease; }
        .rc-inp-field:focus { border-color: #f0c060 !important; background: rgba(240,192,96,0.05) !important; }
        .rc-add-btn:hover { opacity: 0.87 !important; }
        .rc-add-btn:active { transform: scale(0.98) !important; }
      `}</style>
      <GlassCard style={{ padding: "1.5rem" }}>
        <SectionHeader title="Add Expense" />
        <div className={shake ? "rc-shake" : ""} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <input className="rc-inp-field" style={inp} placeholder="What did you spend on?" value={name} onChange={e => setName(e.target.value)} onKeyDown={e => e.key === "Enter" && handleAdd()} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <input className="rc-inp-field" style={inp} type="number" step="0.01" placeholder={`Amount (${trip.currency})`} value={amount} onChange={e => setAmount(e.target.value)} onKeyDown={e => e.key === "Enter" && handleAdd()} />
            <select className="rc-inp-field" style={inp} value={cat} onChange={e => setCat(e.target.value)}>
              {trip.categories.map(c => <option key={c.name} value={c.name} style={{ background: "#0e0e1e" }}>{c.icon} {c.name}</option>)}
            </select>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <input className="rc-inp-field" style={inp} type="date" value={date} onChange={e => setDate(e.target.value)} />
            <input className="rc-inp-field" style={inp} placeholder="Note (optional)" value={note} onChange={e => setNote(e.target.value)} onKeyDown={e => e.key === "Enter" && handleAdd()} />
          </div>
          <button className="rc-add-btn" onClick={handleAdd} style={{ width: "100%", background: "#f0c060", color: "#0a0800", border: "none", padding: 11, borderRadius: 10, fontFamily: "inherit", fontSize: 14, fontWeight: 800, cursor: "pointer", transition: "opacity 0.15s, transform 0.1s" }}>
            + Add Expense
          </button>
        </div>
      </GlassCard>
    </>
  );
}

// ─── Expense Log ─────────────────────────────────────────────────────────────
export function ExpenseLog() {
  const trip          = useTripStore(s => s.trip);
  const expenses      = useTripStore(s => s.expenses);
  const deleteExpense = useTripStore(s => s.deleteExpense);
  if (!trip) return null;

  const sym = getCurrencySymbol(trip.currency);

  return (
    <>
      <style>{`
        @keyframes rcExpIn { from{opacity:0;transform:translateX(-8px)} to{opacity:1;transform:translateX(0)} }
        .rc-exp-item { animation: rcExpIn 0.22s ease both; }
        .rc-del-btn:hover { color: #f87171 !important; background: rgba(248,113,113,0.1) !important; }
      `}</style>
      <GlassCard style={{ padding: "1.5rem" }}>
        <SectionHeader title="Expense Log" right={`${expenses.length} entries`} />
        <div style={{ display: "flex", flexDirection: "column", maxHeight: 340, overflowY: "auto" }}>
          {expenses.length === 0 ? (
            <div style={{ textAlign: "center", padding: "2.5rem 1rem", color: "rgba(240,239,254,0.35)", fontSize: 13, lineHeight: 1.7 }}>
              No expenses yet.<br />Add your first one ←
            </div>
          ) : (
            expenses.map((e, idx) => {
              const ci    = trip.categories.findIndex(c => c.name === e.category);
              const color = CAT_COLORS[ci % CAT_COLORS.length] ?? "#f0c060";
              const icon  = trip.categories[ci]?.icon ?? "💰";
              return (
                <div key={e.id} className="rc-exp-item" style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: idx < expenses.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none", animationDelay: `${idx * 25}ms` }}>
                  <div style={{ width: 36, height: 36, borderRadius: 9, background: color + "20", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{icon}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#f0effe", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{e.name}</div>
                    <div style={{ fontSize: 11, color: "rgba(240,239,254,0.4)", fontFamily: "'DM Mono',monospace", marginTop: 2 }}>
                      {e.category} · {fmtDate(e.date)}{e.note ? ` · ${e.note}` : ""}
                    </div>
                  </div>
                  <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 14, fontWeight: 500, color, whiteSpace: "nowrap" }}>{sym}{e.amount.toFixed(2)}</div>
                  <button className="rc-del-btn" onClick={() => deleteExpense(e.id)} style={{ background: "none", border: "none", color: "rgba(240,239,254,0.25)", cursor: "pointer", fontSize: 18, padding: "4px 6px", borderRadius: 6, lineHeight: 1, transition: "color 0.15s, background 0.15s" }}>×</button>
                </div>
              );
            })
          )}
        </div>
      </GlassCard>
    </>
  );
}