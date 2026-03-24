interface Props {
  fromCurrency: string;
  toCurrency: string;
  amount: number;
  rate: number | null;
  bankMarkup: number;
  foreignFee: number;
  bankName: string;
}

export default function CurrencyCard({
  fromCurrency,
  toCurrency,
  amount,
  rate,
  bankMarkup,
  foreignFee,
  bankName,
}: Props) {
  const liveConverted = rate ? amount * rate : null;

  // Apply bank markup to rate
  const bankRate = rate ? rate * (1 - bankMarkup / 100) : null;
  const bankConverted = bankRate ? amount * bankRate : null;

  // Apply foreign transaction fee on top
  const totalFee = foreignFee / 100;
  const realCost = bankConverted ? bankConverted * (1 - totalFee) : null;

  return (
    <div style={{
      padding: "16px 20px",
      borderRadius: "14px",
      border: "1px solid rgba(255,255,255,0.08)",
      marginBottom: "12px",
      background: "rgba(255,255,255,0.04)",
    }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
        <span style={{ fontSize: "14px", fontWeight: 700, color: "rgba(240,239,254,0.85)", fontFamily: "'Cabinet Grotesk', sans-serif" }}>
          {fromCurrency} → {toCurrency}
        </span>
        <span style={{ fontSize: "11px", color: "rgba(240,239,254,0.35)" }}>
          1 {fromCurrency} = {rate ? rate.toFixed(4) : "..."} {toCurrency}
        </span>
      </div>

      {/* Live rate */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
        <span style={{ fontSize: "13px", color: "rgba(240,239,254,0.45)" }}>🌐 Live mid-market rate</span>
        <span style={{ fontSize: "15px", color: "rgba(240,239,254,0.75)" }}>
          {liveConverted ? `${liveConverted.toFixed(2)} ${toCurrency}` : "..."}
        </span>
      </div>

      {/* Bank rate */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
        <span style={{ fontSize: "13px", color: "rgba(240,239,254,0.45)" }}>🏦 {bankName} rate (-{bankMarkup}%)</span>
        <span style={{ fontSize: "15px", color: "rgba(240,239,254,0.75)" }}>
          {bankConverted ? `${bankConverted.toFixed(2)} ${toCurrency}` : "..."}
        </span>
      </div>

      {/* Real cost after fees */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        borderTop: "1px solid rgba(255,255,255,0.08)",
        paddingTop: "10px",
        marginTop: "10px",
      }}>
        <span style={{ fontSize: "13px", fontWeight: 700, color: "rgba(240,239,254,0.6)" }}>
          💳 Real cost (with {foreignFee}% fee)
        </span>
        <span style={{ fontSize: "18px", fontWeight: 800, color: "rgba(240,239,254,0.95)", fontFamily: "'Cabinet Grotesk', sans-serif" }}>
          {realCost ? `${realCost.toFixed(2)} ${toCurrency}` : "..."}
        </span>
      </div>
    </div>
  );
}