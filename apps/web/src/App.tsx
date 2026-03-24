import { useState, useEffect } from "react";
import "./App.css";
import { onAuthStateChanged, signOut } from "firebase/auth";
import type { User } from "firebase/auth";
import { auth } from "./firebase";
import Login from "./components/Login";

// Shared packages
import { convertCurrency } from "@ratecache/core";
import { fetchRates } from "@ratecache/api";
import { saveRates, getRates } from "@ratecache/storage";

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState(1);
  const [rate, setRate] = useState(0);
  const [result, setResult] = useState(0);

  // Handle auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Load rates (online or offline)
  useEffect(() => {
    if (!user) return; // Don't fetch rates until logged in
    
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
  }, [user]); // Re-runs when user logs in

  // Convert when amount or rate changes
  useEffect(() => {
    if (rate) {
      setResult(convertCurrency(amount, rate));
    }
  }, [amount, rate]);

  if (loading) return <p>Loading...</p>;
  if (!user) return <Login />;

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      {/* User header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <img
            src={user.photoURL ?? ""}
            referrerPolicy="no-referrer"
            width={36}
            style={{ borderRadius: "50%" }}
          />
          <span>{user.displayName}</span>
        </div>
        <button onClick={() => signOut(auth)}>Sign Out</button>
      </div>

      {/* Currency converter */}
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