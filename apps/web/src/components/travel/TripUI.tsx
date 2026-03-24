import type { ReactNode, CSSProperties } from "react";

// ─── CSS variables (injected once) ───────────────────────────────────────────
const TRAVEL_VARS = `
  :root {
    --rc-bg: #05050f;
    --rc-surface: rgba(255,255,255,0.04);
    --rc-surface2: rgba(255,255,255,0.07);
    --rc-border: rgba(255,255,255,0.08);
    --rc-border2: rgba(255,255,255,0.15);
    --rc-text: #f0effe;
    --rc-muted: rgba(240,239,254,0.45);
    --rc-muted2: rgba(240,239,254,0.22);
    --rc-accent: #f0c060;
    --rc-accent-dim: rgba(240,192,96,0.12);
    --rc-green: #4ade80;
    --rc-red: #f87171;
    --rc-blue: #60a5fa;
    --rc-radius: 12px;
    --rc-radius-lg: 16px;
    --rc-font: 'Cabinet Grotesk', sans-serif;
    --rc-mono: 'DM Mono', monospace;
  }
`;

let varsInjected = false;
export function injectTravelVars() {
  if (varsInjected) return;
  const el = document.createElement("style");
  el.textContent = TRAVEL_VARS;
  document.head.appendChild(el);
  varsInjected = true;
}

// ─── GlassCard ────────────────────────────────────────────────────────────────
interface GlassCardProps {
  children: ReactNode;
  style?: CSSProperties;
  accent?: boolean;
}
export function GlassCard({ children, style, accent }: GlassCardProps) {
  return (
    <div style={{
      background: accent ? "rgba(240,192,96,0.05)" : "rgba(255,255,255,0.04)",
      border: `1px solid ${accent ? "rgba(240,192,96,0.22)" : "rgba(255,255,255,0.08)"}`,
      borderRadius: 16,
      backdropFilter: "blur(12px)",
      ...style,
    }}>
      {children}
    </div>
  );
}

// ─── StatCard ─────────────────────────────────────────────────────────────────
type Tone = "neutral" | "good" | "warn" | "danger" | "blue";
const TONE_COLORS: Record<Tone, string> = {
  neutral: "#f0effe",
  good:    "#4ade80",
  warn:    "#f0c060",
  danger:  "#f87171",
  blue:    "#60a5fa",
};

interface StatCardProps {
  label: string;
  value: string;
  sub?: string;
  tone?: Tone;
  delay?: number;
}
export function StatCard({ label, value, sub, tone = "neutral", delay = 0 }: StatCardProps) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 16,
      padding: "1.25rem 1.25rem 1rem",
      animation: `rcStatIn 0.4s ease ${delay}ms both`,
    }}>
      <style>{`@keyframes rcStatIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }`}</style>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(240,239,254,0.45)", fontFamily: "var(--rc-mono,monospace)", marginBottom: 10 }}>
        {label}
      </div>
      <div style={{ fontSize: 30, fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1, color: TONE_COLORS[tone] }}>
        {value}
      </div>
      {sub && <div style={{ fontSize: 12, color: "rgba(240,239,254,0.45)", marginTop: 6, fontFamily: "var(--rc-mono,monospace)" }}>{sub}</div>}
    </div>
  );
}

// ─── ProgressBar ─────────────────────────────────────────────────────────────
interface ProgressBarProps { pct: number; color?: string; height?: number; }
export function ProgressBar({ pct, color = "#4ade80", height = 6 }: ProgressBarProps) {
  return (
    <div style={{ background: "rgba(255,255,255,0.07)", borderRadius: 99, height, overflow: "hidden" }}>
      <div style={{ width: `${Math.min(100, Math.max(0, pct))}%`, height, background: color, borderRadius: 99, transition: "width 0.6s cubic-bezier(0.4,0,0.2,1)" }} />
    </div>
  );
}

// ─── SectionHeader ────────────────────────────────────────────────────────────
interface SectionHeaderProps { title: string; right?: ReactNode; }
export function SectionHeader({ title, right }: SectionHeaderProps) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
      <div style={{ fontSize: 15, fontWeight: 800, letterSpacing: "-0.01em", color: "#f0effe" }}>{title}</div>
      {right && <div style={{ fontSize: 12, color: "rgba(240,239,254,0.45)", fontFamily: "var(--rc-mono,monospace)" }}>{right}</div>}
    </div>
  );
}

// ─── GhostButton ─────────────────────────────────────────────────────────────
interface GhostButtonProps { children: ReactNode; onClick: () => void; }
export function GhostButton({ children, onClick }: GhostButtonProps) {
  return (
    <button onClick={onClick} style={{
      background: "rgba(255,255,255,0.06)",
      border: "1px solid rgba(255,255,255,0.1)",
      color: "#f0effe",
      padding: "7px 14px",
      borderRadius: 8,
      fontFamily: "inherit",
      fontSize: 12,
      fontWeight: 700,
      cursor: "pointer",
    }}>
      {children}
    </button>
  );
}