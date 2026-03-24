import { useEffect } from "react";
import type { User } from "firebase/auth";
import useTripStore from "../../store/tripStore";
import SceneBackground from "./SceneBackground";
import TripSetup from "./TripSetup";
import TripDashboard from "./TripDashboard";

interface Props {
  user: User;
  onBack: () => void;
}

export default function TravelPage({ user, onBack }: Props) {
  const view      = useTripStore(s => s.view);
  const loadTrip  = useTripStore(s => s.loadTrip);
  const resetTrip = useTripStore(s => s.resetTrip);
  const setView   = useTripStore(s => s.setView);

  useEffect(() => {
    loadTrip(user.uid);
  }, [user.uid]);

  const handleNewTrip = () => {
    resetTrip();
    setView("setup");
  };

  return (
    <div style={{ minHeight: "100vh", background: "#05050f", position: "relative" }}>
      <SceneBackground />

      {/* Back to Rates button */}
      <button
        onClick={onBack}
        style={{
          position: "fixed",
          top: 16,
          right: 16,
          zIndex: 100,
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.12)",
          color: "rgba(240,239,254,0.7)",
          padding: "7px 14px",
          borderRadius: 8,
          fontFamily: "'Cabinet Grotesk', sans-serif",
          fontSize: 12,
          fontWeight: 700,
          cursor: "pointer",
          backdropFilter: "blur(8px)",
          transition: "background 0.15s",
        }}
      >
        ← Back to Rates
      </button>

      {view === "setup" ? (
        <TripSetup userId={user.uid} />
      ) : (
        <TripDashboard onNewTrip={handleNewTrip} />
      )}
    </div>
  );
}