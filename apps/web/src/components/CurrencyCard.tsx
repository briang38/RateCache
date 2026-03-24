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
      borderRadius: "12px",
      border: "1px solid #e0e0e0",
      marginBottom: "12px",
      backgroundColor: "#fafafa",
    }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
        <span style={{ fontSize: "14px", color: "gray" }}>{fromCurrency} → {toCurrency}</span>
        <span style={{ fontSize: "12px", color: "#aaa" }}>
          1 {fromCurrency} = {rate ? rate.toFixed(4) : "..."} {toCurrency}
        </span>
      </div>

      {/* Live rate */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
        <span style={{ fontSize: "13px", color: "gray" }}>🌐 Live mid-market rate</span>
        <span style={{ fontSize: "15px" }}>
          {liveConverted ? `${liveConverted.toFixed(2)} ${toCurrency}` : "..."}
        </span>
      </div>

      {/* Bank rate */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
        <span style={{ fontSize: "13px", color: "gray" }}>🏦 {bankName} rate (-{bankMarkup}%)</span>
        <span style={{ fontSize: "15px" }}>
          {bankConverted ? `${bankConverted.toFixed(2)} ${toCurrency}` : "..."}
        </span>
      </div>

      {/* Real cost after fees */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        borderTop: "1px solid #e0e0e0",
        paddingTop: "8px",
        marginTop: "8px",
      }}>
        <span style={{ fontSize: "13px", fontWeight: "bold" }}>
          💳 Real cost (with {foreignFee}% fee)
        </span>
        <span style={{ fontSize: "17px", fontWeight: "bold", color: "#222" }}>
          {realCost ? `${realCost.toFixed(2)} ${toCurrency}` : "..."}
        </span>
      </div>
    </div>
  );
}