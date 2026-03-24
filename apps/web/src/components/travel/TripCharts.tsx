import {
  BarChart, Bar, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie,
} from "recharts";

import useTripStore, { tripDays, getCurrencySymbol } from "../../store/tripStore";
import { GlassCard, SectionHeader } from "./TripUI";

const CAT_COLORS = ["#f0c060","#60a5fa","#f472b6","#34d399","#c084fc","#fb923c"];

// ─── Shared tooltip style ─────────────────────────────────────────────────────
const ttStyle: React.CSSProperties = {
  background: "rgba(10,10,25,0.96)",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: 10,
  padding: "8px 14px",
  fontSize: 12,
  fontFamily: "'DM Mono',monospace",
  color: "#f0effe",
};

function DailyTooltip({ active, payload, label }: { active?: boolean; payload?: any[]; label?: string; sym?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={ttStyle}>
      <div style={{ color: "rgba(240,239,254,0.45)", marginBottom: 4, fontSize: 11 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: (p.color as string) ?? "#f0effe" }}>
          {p.name}: ${Number(p.value).toFixed(2)}
        </div>
      ))}
    </div>
  );
}

// ─── Daily Spending Bar Chart ─────────────────────────────────────────────────
export function DailyChart() {
  const trip          = useTripStore(s => s.trip);
  const getDailyTotals = useTripStore(s => s.getDailyTotals);
  if (!trip) return null;

  const sym    = getCurrencySymbol(trip.currency);
  const days   = tripDays(trip.startDate, trip.endDate);
  const daily  = getDailyTotals();
  const target = trip.totalBudget / days;
  const start  = new Date(trip.startDate + "T00:00:00");

  const data = daily.map((val, i) => {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    return {
      day: `${d.getMonth()+1}/${d.getDate()}`,
      spent: Math.round(val * 100) / 100,
      budget: Math.round(target * 100) / 100,
    };
  });

  return (
    <GlassCard style={{ padding: "1.5rem" }}>
      <SectionHeader title="Daily Spending" right="vs budget" />
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 4, right: 4, left: -18, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
          <XAxis dataKey="day" tick={{ fill: "rgba(240,239,254,0.35)", fontSize: 10, fontFamily: "DM Mono" }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
          <YAxis tick={{ fill: "rgba(240,239,254,0.35)", fontSize: 10, fontFamily: "DM Mono" }} axisLine={false} tickLine={false} tickFormatter={v => `${sym}${v}`} />
          <Tooltip content={<DailyTooltip sym={sym} />} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
          <Bar dataKey="spent" name="Spent" radius={[4,4,0,0]} maxBarSize={32}>
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.spent > entry.budget ? "#f87171" : "#f0c060"} fillOpacity={0.85} />
            ))}
          </Bar>
          {/* Budget line rendered as a bar with 0 width + line trick via reference line */}
          <Bar dataKey="budget" name="Budget" fill="transparent" maxBarSize={0}>
            {data.map((_, i) => <Cell key={i} fill="transparent" />)}
          </Bar>
          <Line type="monotone" dataKey="budget" stroke="rgba(255,255,255,0.22)" strokeWidth={1.5} dot={false} strokeDasharray="4 3" />
        </BarChart>
      </ResponsiveContainer>
    </GlassCard>
  );
}

// ─── Category Donut ───────────────────────────────────────────────────────────
function CatTooltip({ active, payload }: { active?: boolean; payload?: any[] }) {
  if (!active || !payload?.length) return null;
  const p = payload[0];
  return (
    <div style={ttStyle}>
      <span style={{ color: p.payload.fill }}>{p.name}</span>
      {" "}<span>${Number(p.value).toFixed(2)}</span>
    </div>
  );
}

export function CategoryDonut() {
  const trip        = useTripStore(s => s.trip);
  const getCatSpent = useTripStore(s => s.getCatSpent);
  if (!trip) return null;

  const sym  = getCurrencySymbol(trip.currency);
  const data = trip.categories.map((c, i) => ({
    name:   c.name,
    icon:   c.icon,
    value:  Math.round(getCatSpent(c.name) * 100) / 100,
    budget: trip.catBudgets[c.name] ?? 0,
    fill:   CAT_COLORS[i % CAT_COLORS.length],
  }));
  const anySpent = data.some(d => d.value > 0);
  const displayData = anySpent ? data.filter(d => d.value > 0) : data.map(d => ({ ...d, value: 1, fill: d.fill + "44" }));
  const total = data.reduce((a, d) => a + d.value, 0);

  return (
    <GlassCard style={{ padding: "1.5rem" }}>
      <SectionHeader title="By Category" />
      <div style={{ position: "relative" }}>
        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <Pie data={displayData} cx="50%" cy="50%" innerRadius={52} outerRadius={76} paddingAngle={3} dataKey="value" strokeWidth={0}>
              {displayData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
            </Pie>
            {anySpent && <Tooltip content={<CatTooltip />} />}
          </PieChart>
        </ResponsiveContainer>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", textAlign: "center", pointerEvents: "none" }}>
          <div style={{ fontSize: 20, fontWeight: 900, letterSpacing: "-0.03em", color: "#f0effe" }}>{sym}{total.toFixed(0)}</div>
          <div style={{ fontSize: 10, color: "rgba(240,239,254,0.45)", fontFamily: "'DM Mono',monospace" }}>spent</div>
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
        {trip.categories.map((c, i) => {
          const spent  = getCatSpent(c.name);
          const budget = trip.catBudgets[c.name] ?? 0;
          const pct    = budget > 0 ? Math.min(100, (spent / budget) * 100) : 0;
          const color  = CAT_COLORS[i % CAT_COLORS.length];
          return (
            <div key={c.name} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: color, flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#f0effe" }}>{c.icon} {c.name}</span>
                  <span style={{ fontSize: 11, fontFamily: "'DM Mono',monospace", color }}>
                    {sym}{spent.toFixed(0)}<span style={{ color: "rgba(240,239,254,0.35)" }}>/{sym}{budget}</span>
                  </span>
                </div>
                <div style={{ background: "rgba(255,255,255,0.07)", borderRadius: 99, height: 3, overflow: "hidden" }}>
                  <div style={{ width: `${pct}%`, height: 3, background: pct > 90 ? "#f87171" : color, borderRadius: 99, transition: "width 0.5s ease" }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
}