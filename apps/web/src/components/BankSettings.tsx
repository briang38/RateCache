import { useState } from "react";
import { BANKS } from "../data/banks";
import type { UserPreferences } from "../hooks/useUserPreferences";

interface Props {
  preferences: UserPreferences;
  onSave: (updated: Partial<UserPreferences>) => Promise<void>;
  onClose: () => void;
}

export default function BankSettings({ preferences, onSave, onClose }: Props) {
  const [bankId, setBankId] = useState(preferences.bankId ?? "custom");
  const [customMarkup, setCustomMarkup] = useState(preferences.customMarkup ?? 0);
  const [customForeignFee, setCustomForeignFee] = useState(preferences.customForeignFee ?? 0);
  const [saving, setSaving] = useState(false);

  const selectedBank = BANKS.find((b) => b.id === bankId);
  const isCustom = bankId === "custom";

  const effectiveMarkup = isCustom ? customMarkup : (selectedBank?.markup ?? 0);
  const effectiveFee = isCustom ? customForeignFee : (selectedBank?.foreignTransactionFee ?? 0);

  async function handleSave() {
    setSaving(true);
    await onSave({ bankId, customMarkup, customForeignFee });
    setSaving(false);
    onClose();
  }

  return (
    <div style={{ padding: "24px", maxWidth: "480px", margin: "0 auto" }}>
      <h2>Bank & Fee Settings</h2>
      <p style={{ color: "gray", fontSize: "14px" }}>
        We use the live mid-market rate and apply your bank's typical markup so you see your real cost.
      </p>

      {/* Bank picker */}
      <label style={{ display: "block", fontWeight: "bold", marginBottom: "8px" }}>
        Select Your Bank / Card
      </label>
      <select
        value={bankId}
        onChange={(e) => setBankId(e.target.value)}
        style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc", marginBottom: "16px" }}
      >
        {BANKS.map((b) => (
          <option key={b.id} value={b.id}>{b.name}</option>
        ))}
      </select>

      {/* Bank info */}
      {selectedBank && !isCustom && (
        <div style={{ backgroundColor: "#f0f0f0", padding: "12px", borderRadius: "8px", marginBottom: "16px", fontSize: "14px" }}>
          <p style={{ margin: "0 0 4px" }}>📊 Typical markup: <strong>{selectedBank.markup}%</strong></p>
          <p style={{ margin: "0 0 4px" }}>💳 Foreign transaction fee: <strong>{selectedBank.foreignTransactionFee}%</strong></p>
          <p style={{ margin: 0, color: "gray" }}>{selectedBank.notes}</p>
        </div>
      )}

      {/* Custom inputs */}
      {isCustom && (
        <>
          <label style={{ display: "block", fontWeight: "bold", marginBottom: "6px" }}>
            Exchange Rate Markup (%)
          </label>
          <input
            type="number"
            value={customMarkup}
            step="0.1"
            min="0"
            onChange={(e) => setCustomMarkup(Number(e.target.value))}
            style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc", marginBottom: "16px", boxSizing: "border-box" }}
          />

          <label style={{ display: "block", fontWeight: "bold", marginBottom: "6px" }}>
            Foreign Transaction Fee (%)
          </label>
          <input
            type="number"
            value={customForeignFee}
            step="0.1"
            min="0"
            onChange={(e) => setCustomForeignFee(Number(e.target.value))}
            style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc", marginBottom: "16px", boxSizing: "border-box" }}
          />
        </>
      )}

      {/* Summary */}
      <div style={{ backgroundColor: "#fff8e1", padding: "12px", borderRadius: "8px", marginBottom: "20px", fontSize: "14px" }}>
        <p style={{ margin: "0 0 4px", fontWeight: "bold" }}>Your effective rates:</p>
        <p style={{ margin: "0 0 4px" }}>📉 Rate markup: <strong>{effectiveMarkup}%</strong></p>
        <p style={{ margin: 0 }}>💳 Foreign fee: <strong>{effectiveFee}%</strong></p>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        style={{ width: "100%", padding: "12px", backgroundColor: "#222", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", marginBottom: "10px" }}
      >
        {saving ? "Saving..." : "Save Bank Settings"}
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