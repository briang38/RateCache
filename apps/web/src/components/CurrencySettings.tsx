import { useState } from "react";
import type { UserPreferences } from "../hooks/useUserPreferences";

const AVAILABLE_CURRENCIES = [
  "USD", "JPY", "EUR", "GBP", "CAD", "AUD", "CHF", "CNY", "INR", "MXN",
  "BRL", "KRW", "SGD", "HKD", "NOK", "SEK", "DKK", "NZD", "ZAR", "AED"
];

interface Props {
  preferences: UserPreferences;
  onSave: (updated: Partial<UserPreferences>) => Promise<void>;
  onClose: () => void;
}

export default function CurrencySettings({ preferences, onSave, onClose }: Props) {
  const [baseCurrency, setBaseCurrency] = useState(preferences.baseCurrency);
  const [selected, setSelected] = useState<string[]>(preferences.currencies);
  const [saving, setSaving] = useState(false);

  function toggleCurrency(currency: string) {
    if (selected.includes(currency)) {
      setSelected(selected.filter((c) => c !== currency));
    } else {
      setSelected([...selected, currency]);
    }
  }

  async function handleSave() {
    setSaving(true);
    await onSave({ baseCurrency, currencies: selected });
    setSaving(false);
    onClose();
  }

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "0 auto" }}>
      <h2>Currency Settings</h2>

      {/* Base currency */}
      <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>
        Your Home Currency
      </label>
      <select
        value={baseCurrency}
        onChange={(e) => setBaseCurrency(e.target.value)}
        style={{ width: "100%", padding: "10px", marginBottom: "20px", borderRadius: "6px", border: "1px solid #ccc" }}
      >
        {AVAILABLE_CURRENCIES.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>

      {/* Currency toggles */}
      <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>
        Currencies to Show on Home Screen
      </label>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "20px" }}>
        {AVAILABLE_CURRENCIES.map((c) => (
          <button
            key={c}
            onClick={() => toggleCurrency(c)}
            style={{
              padding: "6px 12px",
              borderRadius: "20px",
              border: "1px solid #ccc",
              cursor: "pointer",
              backgroundColor: selected.includes(c) ? "#222" : "#f0f0f0",
              color: selected.includes(c) ? "white" : "#333",
            }}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Actions */}
      <button
        onClick={handleSave}
        disabled={saving}
        style={{ width: "100%", padding: "12px", backgroundColor: "#222", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", marginBottom: "10px" }}
      >
        {saving ? "Saving..." : "Save Preferences"}
      </button>
      <button
        onClick={onClose}
        style={{ width: "100%", padding: "12px", backgroundColor: "#f0f0f0", border: "none", borderRadius: "6px", cursor: "pointer" }}
      >
        Cancel
      </button>
    </div>
  );
}