import { useState, useEffect } from "react";
import "./App.css";
import { onAuthStateChanged } from "firebase/auth";
import type { User } from "firebase/auth";
import { auth } from "./firebase";
import Login from "./components/Login";
import RatesPage from "./components/RatesPage";
import TravelPage from "./components/travel/TravelPage";

type Tab = "rates" | "travel";

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("rates");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <p style={{ textAlign: "center", marginTop: "40px", color: "#fff" }}>Loading...</p>;
  if (!user) return <Login />;

  if (activeTab === "travel") {
    return <TravelPage user={user} onBack={() => setActiveTab("rates")} />;
  }

  return <RatesPage user={user} onGoToTravel={() => setActiveTab("travel")} />;
}

export default App;