import useTripStore, { tripDays, getCurrencySymbol } from "../../store/tripStore";
import { GlassCard, GhostButton } from "./TripUI";

const CAT_COLORS = ["#f0c060","#60a5fa","#f472b6","#34d399","#c084fc","#fb923c"];

export default function CategoryAllocator() {
  const trip            = useTripStore(s => s.trip);
  const updateCatBudget = useTripStore(s => s.updateCatBudget);
  const autoSplit       = useTripStore(s => s.autoSplit);
  const getCatSpent     = useTripStore(s => s.getCatSpent);
  if (!trip) return null;

  const sym       = getCurrencySymbol(trip.currency);
  const days      = tripDays(trip.startDate, trip.endDate);
  const allocated = Object.values(trip.catBudgets).reduce((a, b) => a + b, 0);
  const over      = allocated > trip.totalBudget;

  return (
    <>
      <style>{`
        .rc-alloc-input:focus { border-bottom-color: var(--focus-color, #f0c060) !important; }
      `}</style>
      <GlassCard style={{ padding: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1rem" }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, letterSpacing: "-0.01em", color: "#f0effe" }}>Category Budgets</div>
            <div style={{ fontSize: 12, color: "rgba(240,239,254,0.45)", fontFamily: "'DM Mono',monospace", marginTop: 4 }}>
              {sym}{allocated.toLocaleString()} allocated
              <span style={{ color: over ? "#f87171" : "rgba(240,239,254,0.45)" }}> / {sym}{trip.totalBudget.toLocaleString()}</span>
            </div>
          </div>
          <GhostButton onClick={autoSplit}>Auto-split</GhostButton>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(148px,1fr))", gap: 10 }}>
          {trip.categories.map((c, i) => {
            const budget  = trip.catBudgets[c.name] ?? 0;
            const spent   = getCatSpent(c.name);
            const pct     = budget > 0 ? Math.min(100, (spent / budget) * 100) : 0;
            const color   = CAT_COLORS[i % CAT_COLORS.length];
            const perDay  = days > 0 ? (budget / days).toFixed(1) : "0";
            return (
              <div key={c.name} style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${color}22`, borderRadius: 12, padding: 14 }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "'DM Mono',monospace", color, marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
                  {c.icon} {c.name}
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                  <span style={{ fontSize: 14, color: "rgba(240,239,254,0.45)", fontFamily: "'DM Mono',monospace" }}>{sym}</span>
                  <input
                    className="rc-alloc-input"
                    type="number"
                    value={budget}
                    // @ts-ignore css variable trick
                    style={{ "--focus-color": color, background: "transparent", border: "none", borderBottom: `1px solid ${color}55`, color: "#f0effe", fontFamily: "'DM Mono',monospace", fontSize: 20, fontWeight: 500, width: "100%", outline: "none", padding: "2px 0", transition: "border-bottom-color 0.15s" } as React.CSSProperties}
                    onChange={e => updateCatBudget(c.name, parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div style={{ fontSize: 11, color: "rgba(240,239,254,0.4)", fontFamily: "'DM Mono',monospace", marginTop: 8 }}>
                  {sym}{perDay}/day · {sym}{spent.toFixed(0)} spent
                </div>
                <div style={{ background: "rgba(255,255,255,0.07)", borderRadius: 99, height: 3, marginTop: 6, overflow: "hidden" }}>
                  <div style={{ width: `${pct}%`, height: 3, background: pct > 90 ? "#f87171" : color, borderRadius: 99, transition: "width 0.4s ease" }} />
                </div>
              </div>
            );
          })}
        </div>
      </GlassCard>
    </>
  );
}