import { useState, useEffect, useRef } from "react";
import "./App.css";
import { onAuthStateChanged } from "firebase/auth";
import type { User } from "firebase/auth";
import { auth } from "./firebase";
import Login from "./components/Login";
import RatesPage from "./components/RatesPage";
import TravelPage from "./components/travel/TravelPage";

type Tab = "rates" | "travel";

// Must be slightly longer than SPIN_DELAY in Login.tsx so the
// animation finishes before the page unmounts.
const LOGIN_TRANSITION_DELAY = 2600;

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("rates");
  const firstCheck = useRef(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (firstCheck.current) {
        // Page load — already logged in or not, no animation needed
        firstCheck.current = false;
        setUser(currentUser);
        setLoading(false);
      } else if (currentUser) {
        // Fresh login from the Login page — hold Login mounted
        // long enough for the spin animation to finish
        setTimeout(() => {
          setUser(currentUser);
          setLoading(false);
        }, LOGIN_TRANSITION_DELAY);
      } else {
        // Logout — immediate
        setUser(null);
        setLoading(false);
      }
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