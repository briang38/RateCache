import { useMemo, useState } from "react";
import useTripStore, { tripDays, daysLeft, daysElapsed, getCurrencySymbol, fmtDate } from "../../store/tripStore";
import { StatCard, ProgressBar, GlassCard } from "./TripUI";
import { DailyChart, CategoryDonut } from "./TripCharts";
import { AddExpenseForm, ExpenseLog } from "./ExpenseTracker";
import CategoryAllocator from "./CategoryAllocator";
import HotelsSection from "./HotelsSection";

interface Props { onNewTrip: () => void; onBack: () => void; }

export default function TripDashboard({ onNewTrip, onBack }: Props) {
  const trip          = useTripStore(s => s.trip);
  const getTotalSpent = useTripStore(s => s.getTotalSpent);
  const isDirty       = useTripStore(s => s.isDirty);
  const saveTrip      = useTripStore(s => s.saveTrip);
  const [saving, setSaving]   = useState(false);
  const [savedOk, setSavedOk] = useState(false);

  if (!trip) return null;

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveTrip();
      setSavedOk(true);
      setTimeout(() => setSavedOk(false), 2500);
    } finally {
      setSaving(false);
    }
  };

  const sym      = getCurrencySymbol(trip.currency);
  const days     = tripDays(trip.startDate, trip.endDate);
  const elapsed  = Math.max(1, daysElapsed(trip.startDate, trip.endDate));
  const left     = daysLeft(trip.startDate, trip.endDate);
  const spent    = getTotalSpent();
  const remaining = Math.max(0, trip.totalBudget - spent);
  const pct       = Math.min(100, (spent / trip.totalBudget) * 100);
  const avgDaily  = spent / elapsed;
  const projected = avgDaily * days;
  const dailyTarget = trip.totalBudget / days;

  const barColor = pct > 90 ? "#f87171" : pct > 70 ? "#f0c060" : "#4ade80";

  const alertMsg = useMemo(() => {
    if (spent === 0) return null;
    if (pct > 90) return `You've used ${pct.toFixed(0)}% of your budget — slow down!`;
    if (avgDaily > dailyTarget * 1.2) return `Spending ${sym}${(avgDaily - dailyTarget).toFixed(0)}/day over target. Projected overage: ${sym}${Math.abs(projected - trip.totalBudget).toFixed(0)}.`;
    return null;
  }, [pct, avgDaily, dailyTarget]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cabinet+Grotesk:wght@400;500;700;800;900&family=DM+Mono:wght@400;500&display=swap');
        @keyframes rcAlertIn { from{opacity:0;transform:translateY(-6px)} to{opacity:1;transform:translateY(0)} }
        .rc-dash { font-family: 'Cabinet Grotesk', sans-serif; }
        @media(max-width:960px)  { .rc-stats-grid { grid-template-columns: repeat(2,1fr) !important; } .rc-main-grid { grid-template-columns: 1fr !important; } }
        @media(max-width:620px)  { .rc-bottom-grid { grid-template-columns: 1fr !important; } .rc-dash-wrap { padding: 0 1rem 3rem !important; } }
      `}</style>

      <div className="rc-dash" style={{ position: "relative", zIndex: 1 }}>
        {/* ── Top nav ── */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.25rem 1.5rem", borderBottom: "1px solid rgba(255,255,255,0.06)", maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, background: "#f0c060", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 900, color: "#0a0800" }}>RC</div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 900, letterSpacing: "-0.03em", color: "#f0effe" }}>RateCache</div>
              <div style={{ fontSize: 10, color: "rgba(240,239,254,0.45)", fontFamily: "'DM Mono',monospace", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 1 }}>Travel Budget</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ fontSize: 11, fontWeight: 700, fontFamily: "'DM Mono',monospace", letterSpacing: "0.06em", padding: "5px 14px", borderRadius: 99, border: "1px solid rgba(240,192,96,0.3)", background: "rgba(240,192,96,0.1)", color: "#f0c060", whiteSpace: "nowrap" }}>
              {left === 0 ? "Trip complete" : `${left} days left`}
            </div>
            <button onClick={onBack} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(240,239,254,0.7)", padding: "8px 16px", borderRadius: 8, fontFamily: "inherit", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
              ← Home
            </button>
            <button onClick={onNewTrip} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#f0effe", padding: "8px 16px", borderRadius: 8, fontFamily: "inherit", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
              + New Trip
            </button>
          </div>
        </div>

        <div className="rc-dash-wrap" style={{ maxWidth: 1200, margin: "0 auto", padding: "0 1.5rem 4rem" }}>
          {/* ── Trip title ── */}
          <div style={{ padding: "1.5rem 0 1.25rem", borderBottom: "1px solid rgba(255,255,255,0.06)", marginBottom: "1.25rem" }}>
            <div style={{ fontSize: 26, fontWeight: 900, letterSpacing: "-0.03em", color: "#f0effe" }}>{trip.destination}</div>
            <div style={{ fontSize: 12, color: "rgba(240,239,254,0.45)", fontFamily: "'DM Mono',monospace", marginTop: 5 }}>
              {fmtDate(trip.startDate)} – {fmtDate(trip.endDate)}, {new Date(trip.startDate + "T00:00:00").getFullYear()} · {days} days
            </div>
          </div>

          {/* ── Alert ── */}
          {alertMsg && (
            <div style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.25)", borderRadius: 12, padding: "12px 16px", fontSize: 13, color: "#fca5a5", marginBottom: "1.25rem", animation: "rcAlertIn 0.3s ease both" }}>
              <span style={{ fontSize: 16 }}>⚠</span>{alertMsg}
            </div>
          )}

          {/* ── Stats ── */}
          <div className="rc-stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: "1.25rem" }}>
            <StatCard label="Total Spent"     value={`${sym}${spent.toFixed(0)}`}     sub={`of ${sym}${trip.totalBudget.toLocaleString()}`}             tone={pct > 90 ? "danger" : pct > 70 ? "warn" : "neutral"} delay={0} />
            <StatCard label="Remaining"       value={`${sym}${remaining.toFixed(0)}`} sub={`${pct.toFixed(0)}% used`}                                    tone={pct > 90 ? "danger" : pct > 70 ? "warn" : "good"}    delay={60} />
            <StatCard label="Avg Daily Spend" value={`${sym}${avgDaily.toFixed(0)}`}  sub={`target ${sym}${dailyTarget.toFixed(0)}/day`}                 tone={avgDaily > dailyTarget * 1.1 ? "warn" : "neutral"}   delay={120} />
            <StatCard label="Projected Total" value={`${sym}${projected.toFixed(0)}`} sub={projected > trip.totalBudget ? `⚠ ${sym}${(projected - trip.totalBudget).toFixed(0)} over` : "on track"} tone={projected > trip.totalBudget ? "danger" : "good"} delay={180} />
          </div>

          {/* ── Budget progress ── */}
          <GlassCard style={{ padding: "1.25rem 1.5rem", marginBottom: "1.25rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(240,239,254,0.45)", fontFamily: "'DM Mono',monospace" }}>Budget Used</span>
              <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 13, color: barColor }}>{pct.toFixed(1)}%</span>
            </div>
            <ProgressBar pct={pct} color={barColor} height={8} />
          </GlassCard>

          {/* ── Category Allocator ── */}
          <div style={{ marginBottom: "1.25rem" }}><CategoryAllocator /></div>

          {/* ── Charts ── */}
          <div className="rc-main-grid" style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "1.25rem", marginBottom: "1.25rem" }}>
            <DailyChart />
            <CategoryDonut />
          </div>

          {/* ── Hotels ── */}
          <div style={{ marginBottom: "1.25rem" }}><HotelsSection /></div>

          {/* ── Expense form + log ── */}
          <div className="rc-bottom-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", marginBottom: "1.25rem" }}>
            <AddExpenseForm />
            <ExpenseLog />
          </div>

          {/* ── Save button ── */}
          <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 12, paddingTop: "0.5rem", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            {savedOk && (
              <span style={{ fontSize: 12, color: "#4ade80", fontFamily: "'DM Mono', monospace", letterSpacing: "0.04em" }}>
                ✓ Saved
              </span>
            )}
            {isDirty && !savedOk && (
              <span style={{ fontSize: 11, color: "rgba(240,239,254,0.3)", fontFamily: "'DM Mono', monospace" }}>
                Unsaved changes
              </span>
            )}
            <button
              onClick={handleSave}
              disabled={saving || savedOk}
              style={{
                padding: "10px 28px", borderRadius: 10, border: "none",
                background: savedOk ? "rgba(74,222,128,0.15)" : isDirty ? "#f0c060" : "rgba(255,255,255,0.07)",
                color: savedOk ? "#4ade80" : isDirty ? "#0a0800" : "rgba(240,239,254,0.4)",
                fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 14, fontWeight: 900,
                cursor: saving || savedOk ? "default" : "pointer",
                transition: "all 0.2s",
              }}
            >
              {saving ? "Saving…" : savedOk ? "Saved ✓" : "Save Trip"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}