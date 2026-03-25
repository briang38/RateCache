import { useEffect, useState } from "react";
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
  const view           = useTripStore(s => s.view);
  const trip           = useTripStore(s => s.trip);
  const trips          = useTripStore(s => s.trips);
  const expensesTripId = useTripStore(s => s.expensesTripId);
  const isDirty        = useTripStore(s => s.isDirty);
  const saveTrip       = useTripStore(s => s.saveTrip);
  const loadTrip       = useTripStore(s => s.loadTrip);
  const loadExpenses   = useTripStore(s => s.loadExpenses);
  const resetTrip      = useTripStore(s => s.resetTrip);
  const setView        = useTripStore(s => s.setView);
  const [showPrompt, setShowPrompt] = useState(false);
  const [saving, setSaving]         = useState(false);

  const handleBack = () => {
    if (isDirty) { setShowPrompt(true); } else { onBack(); }
  };

  const handleSaveAndBack = async () => {
    setSaving(true);
    try { await saveTrip(); } finally { setSaving(false); }
    setShowPrompt(false);
    onBack();
  };

  // Only hit Firestore if trips haven't been loaded yet (e.g. landing directly on travel tab)
  useEffect(() => {
    if (trips.length === 0) loadTrip(user.uid);
  }, [user.uid]);

  // Reload expenses when the active trip changes (e.g. selected from home page)
  useEffect(() => {
    if (trip && expensesTripId !== trip.id) loadExpenses(trip.id);
  }, [trip?.id, expensesTripId]);

  const handleNewTrip = () => {
    resetTrip();
    setView("setup");
  };

  return (
    <div style={{ minHeight: "100vh", background: "#05050f", position: "relative" }}>
      <SceneBackground />

      {/* Save-before-leaving prompt */}
      {showPrompt && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 200,
          background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)",
          display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem",
        }}>
          <div style={{
            background: "#0e0e1e", border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 20, padding: "2rem", maxWidth: 360, width: "100%",
            fontFamily: "'Cabinet Grotesk', sans-serif",
            boxShadow: "0 32px 64px rgba(0,0,0,0.6)",
          }}>
            <div style={{ fontSize: 20, fontWeight: 900, color: "#f0effe", marginBottom: 8 }}>
              Unsaved changes
            </div>
            <p style={{ fontSize: 13, color: "rgba(240,239,254,0.5)", marginBottom: "1.5rem", lineHeight: 1.6 }}>
              You have changes that haven't been explicitly saved. Save before going back?
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <button
                onClick={handleSaveAndBack}
                disabled={saving}
                style={{
                  padding: "12px", borderRadius: 10, border: "none",
                  background: "#f0c060", color: "#0a0800",
                  fontSize: 14, fontWeight: 900, cursor: "pointer",
                }}
              >
                {saving ? "Saving…" : "Save & Go Back"}
              </button>
              <button
                onClick={() => { setShowPrompt(false); onBack(); }}
                style={{
                  padding: "12px", borderRadius: 10,
                  border: "1px solid rgba(255,255,255,0.1)",
                  background: "transparent", color: "rgba(240,239,254,0.6)",
                  fontSize: 14, fontWeight: 700, cursor: "pointer",
                }}
              >
                Go Back Without Saving
              </button>
              <button
                onClick={() => setShowPrompt(false)}
                style={{
                  padding: "10px", borderRadius: 10, border: "none",
                  background: "transparent", color: "rgba(240,239,254,0.35)",
                  fontSize: 13, fontWeight: 600, cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {view === "setup" ? (
        <TripSetup userId={user.uid} />
      ) : (
        <TripDashboard onNewTrip={handleNewTrip} onBack={handleBack} />
      )}
    </div>
  );
}