import { useState, useEffect } from "react";
import "./App.css";

// Shared packages
import { convertCurrency } from "@ratecache/core";
import { fetchRates } from "@ratecache/api";
import { saveRates, getRates } from "@ratecache/storage";

function App() {
  const [amount, setAmount] = useState(1);
  const [rate, setRate] = useState(0);
  const [result, setResult] = useState(0);

  // Load rates (online or offline)
  useEffect(() => {
    async function loadRates() {
      try {
        if (navigator.onLine) {
          const data = await fetchRates();
          const usdToJpy = data.rates.JPY;

          setRate(usdToJpy);
          saveRates(data);
        } else {
          const cached = getRates();
          if (cached) {
            setRate(cached.rates.JPY);
          }
        }
      } catch (err) {
        console.error("Error loading rates:", err);
      }
    }

    loadRates();
  }, []);

  // Convert when amount or rate changes
  useEffect(() => {
    if (rate) {
      setResult(convertCurrency(amount, rate));
    }
  }, [amount, rate]);

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h1>RateCache</h1>

      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        style={{ padding: "10px", fontSize: "16px" }}
      />

      <p style={{ marginTop: "20px" }}>USD → JPY</p>

      <h2>{result ? result.toFixed(2) : "Loading..."} Yen</h2>

      {!navigator.onLine && (
        <p style={{ color: "orange" }}>Offline mode (using cached rate)</p>
      )}
    </div>
  );
}

export default App;