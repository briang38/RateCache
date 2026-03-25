import { useEffect, useState } from "react";
import useTripStore, { getCurrencySymbol, fmtDate } from "../../store/tripStore";
import { GlassCard } from "./TripUI";

const inp: React.CSSProperties = {
  width: "100%",
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 10,
  padding: "10px 12px",
  color: "#f0effe",
  fontFamily: "'Cabinet Grotesk', sans-serif",
  fontSize: 13,
  outline: "none",
  boxSizing: "border-box",
};

const blank = { name: "", address: "", checkIn: "", checkOut: "", pricePerNight: "", bookingUrl: "" };

function nightsBetween(a: string, b: string) {
  if (!a || !b) return 0;
  return Math.max(0, Math.round((new Date(b + "T00:00:00").getTime() - new Date(a + "T00:00:00").getTime()) / 86400000));
}

export default function HotelsSection() {
  const trip        = useTripStore(s => s.trip);
  const hotels      = useTripStore(s => s.hotels);
  const hotelsTripId = useTripStore(s => s.hotelsTripId);
  const loadHotels  = useTripStore(s => s.loadHotels);
  const addHotel    = useTripStore(s => s.addHotel);
  const deleteHotel = useTripStore(s => s.deleteHotel);

  const [open, setOpen]       = useState(false);
  const [form, setForm]       = useState(blank);
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState("");

  useEffect(() => {
    if (trip && hotelsTripId !== trip.id) loadHotels(trip.id);
  }, [trip?.id, hotelsTripId]);

  if (!trip) return null;

  const sym    = getCurrencySymbol(trip.currency);
  const nights = nightsBetween(form.checkIn, form.checkOut);
  const total  = nights * (parseFloat(form.pricePerNight) || 0);

  const set = (k: keyof typeof blank, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleAdd = async () => {
    if (!form.name.trim())    { setError("Hotel name is required."); return; }
    if (!form.checkIn)        { setError("Check-in date is required."); return; }
    if (!form.checkOut)       { setError("Check-out date is required."); return; }
    if (nights <= 0)          { setError("Check-out must be after check-in."); return; }
    if (!form.pricePerNight)  { setError("Price per night is required."); return; }
    setError("");
    setSaving(true);
    await addHotel({
      name: form.name.trim(),
      address: form.address.trim(),
      checkIn: form.checkIn,
      checkOut: form.checkOut,
      nights,
      pricePerNight: parseFloat(form.pricePerNight),
      totalPrice: total,
      bookingUrl: form.bookingUrl.trim(),
    });
    setForm(blank);
    setOpen(false);
    setSaving(false);
  };

  const mapsUrl = (h: { name: string; address: string }) =>
    `https://maps.google.com/?q=${encodeURIComponent(h.address || h.name)}`;

  const totalHotelCost = hotels.reduce((s, h) => s + h.totalPrice, 0);

  return (
    <GlassCard style={{ padding: "1.25rem 1.5rem" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: hotels.length > 0 ? "1rem" : 0 }}>
        <div>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(240,239,254,0.45)", fontFamily: "'DM Mono',monospace" }}>
            Hotels
          </span>
          {hotels.length > 0 && (
            <span style={{ marginLeft: 10, fontSize: 11, color: "rgba(240,239,254,0.3)", fontFamily: "'DM Mono',monospace" }}>
              {sym}{totalHotelCost.toLocaleString()} total · {hotels.length} stay{hotels.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>
        <button
          onClick={() => { setOpen(o => !o); setError(""); }}
          style={{
            background: open ? "rgba(240,192,96,0.12)" : "rgba(255,255,255,0.06)",
            border: `1px solid ${open ? "rgba(240,192,96,0.3)" : "rgba(255,255,255,0.1)"}`,
            color: open ? "#f0c060" : "rgba(240,239,254,0.7)",
            padding: "6px 14px", borderRadius: 8,
            fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 12, fontWeight: 700,
            cursor: "pointer", transition: "all 0.15s",
          }}
        >
          {open ? "Cancel" : "+ Add Hotel"}
        </button>
      </div>

      {/* Hotel cards */}
      {hotels.map(h => (
        <div
          key={h.id}
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 12, padding: "12px 14px", marginBottom: 8,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#f0effe", fontFamily: "'Cabinet Grotesk', sans-serif" }}>
                🏨 {h.name}
              </div>
              {h.address && (
                <div style={{ fontSize: 11, color: "rgba(240,239,254,0.35)", marginTop: 2 }}>{h.address}</div>
              )}
            </div>
            <button
              onClick={() => deleteHotel(h.id)}
              style={{ background: "none", border: "none", color: "rgba(240,239,254,0.25)", cursor: "pointer", fontSize: 16, padding: "0 0 0 8px", lineHeight: 1 }}
            >
              ×
            </button>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <span style={{ fontSize: 12, color: "rgba(240,239,254,0.45)", fontFamily: "'DM Mono',monospace" }}>
              {fmtDate(h.checkIn)} – {fmtDate(h.checkOut)} · {h.nights} night{h.nights !== 1 ? "s" : ""}
            </span>
            <span style={{ fontSize: 13, fontWeight: 700, color: "rgba(240,239,254,0.85)", fontFamily: "'Cabinet Grotesk', sans-serif" }}>
              {sym}{h.totalPrice.toLocaleString()}
              <span style={{ fontSize: 11, fontWeight: 400, color: "rgba(240,239,254,0.35)" }}> ({sym}{h.pricePerNight}/night)</span>
            </span>
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <a
              href={mapsUrl(h)}
              target="_blank"
              rel="noreferrer"
              style={{
                display: "flex", alignItems: "center", gap: 5,
                padding: "6px 12px", borderRadius: 8,
                background: "rgba(96,165,250,0.1)", border: "1px solid rgba(96,165,250,0.2)",
                color: "#60a5fa", fontSize: 12, fontWeight: 700,
                textDecoration: "none", fontFamily: "'Cabinet Grotesk', sans-serif",
                transition: "background 0.15s",
              }}
            >
              📍 Maps
            </a>
            {h.bookingUrl && (
              <a
                href={h.bookingUrl.startsWith("http") ? h.bookingUrl : `https://${h.bookingUrl}`}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "flex", alignItems: "center", gap: 5,
                  padding: "6px 12px", borderRadius: 8,
                  background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.2)",
                  color: "#34d399", fontSize: 12, fontWeight: 700,
                  textDecoration: "none", fontFamily: "'Cabinet Grotesk', sans-serif",
                  transition: "background 0.15s",
                }}
              >
                🔗 View Booking
              </a>
            )}
          </div>
        </div>
      ))}

      {hotels.length === 0 && !open && (
        <div style={{ textAlign: "center", padding: "1.5rem 0 0.5rem", color: "rgba(240,239,254,0.25)", fontSize: 13 }}>
          No hotels added yet
        </div>
      )}

      {/* Add form */}
      {open && (
        <div style={{ marginTop: hotels.length > 0 ? "1rem" : "1rem", borderTop: hotels.length > 0 ? "1px solid rgba(255,255,255,0.06)" : "none", paddingTop: hotels.length > 0 ? "1rem" : 0 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
            <div style={{ gridColumn: "1 / -1" }}>
              <input style={inp} placeholder="Hotel name *" value={form.name} onChange={e => set("name", e.target.value)} />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <input style={inp} placeholder="Address (for map pin)" value={form.address} onChange={e => set("address", e.target.value)} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(240,239,254,0.35)", fontFamily: "'DM Mono',monospace", marginBottom: 5 }}>Check-in</label>
              <input style={inp} type="date" value={form.checkIn} onChange={e => set("checkIn", e.target.value)} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(240,239,254,0.35)", fontFamily: "'DM Mono',monospace", marginBottom: 5 }}>Check-out</label>
              <input style={inp} type="date" value={form.checkOut} onChange={e => set("checkOut", e.target.value)} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(240,239,254,0.35)", fontFamily: "'DM Mono',monospace", marginBottom: 5 }}>Price / night ({trip.currency})</label>
              <input style={inp} type="number" placeholder="0" value={form.pricePerNight} onChange={e => set("pricePerNight", e.target.value)} />
            </div>
            <div style={{ display: "flex", alignItems: "flex-end", paddingBottom: 2 }}>
              {nights > 0 && (
                <div style={{ fontSize: 13, color: "rgba(240,239,254,0.55)", fontFamily: "'DM Mono',monospace" }}>
                  {nights} night{nights !== 1 ? "s" : ""} · <span style={{ color: "#f0c060", fontWeight: 700 }}>{sym}{total.toLocaleString()}</span>
                </div>
              )}
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <input style={inp} placeholder="Booking URL (optional)" value={form.bookingUrl} onChange={e => set("bookingUrl", e.target.value)} />
            </div>
          </div>

          {error && <p style={{ fontSize: 12, color: "#fb923c", margin: "0 0 10px" }}>{error}</p>}

          <button
            onClick={handleAdd}
            disabled={saving}
            style={{
              width: "100%", padding: "11px", borderRadius: 10, border: "none",
              background: "#f0c060", color: "#0a0800",
              fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 14, fontWeight: 900,
              cursor: "pointer", opacity: saving ? 0.7 : 1,
            }}
          >
            {saving ? "Saving…" : "Save Hotel"}
          </button>
        </div>
      )}
    </GlassCard>
  );
}
