import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import type { User } from "firebase/auth";

export interface UserPreferences {
  baseCurrency: string;
  currencies: string[];
  displayName: string;
  bankId: string;
  customMarkup: number;
  customForeignFee: number;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  baseCurrency: "USD",
  currencies: ["JPY", "EUR", "GBP"],
  displayName: "",
  bankId: "custom",
  customMarkup: 0,
  customForeignFee: 0,
};

export function useUserPreferences(user: User | null) {
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    async function loadPreferences() {
        if (!user) return; 
        try {
            const ref = doc(db, "users", user.uid);
            const snap = await getDoc(ref);

            if (snap.exists()) {
            // User already has preferences saved
            setPreferences(snap.data() as UserPreferences);
            } else {
            // First time login — create default preferences
            const defaults = {
                ...DEFAULT_PREFERENCES,
                displayName: user.displayName ?? "",
            };
            await setDoc(ref, defaults);
            setPreferences(defaults);
            }
        } catch (err) {
            console.error("Error loading preferences:", err);
        } finally {
            setLoading(false);
        }
    }

    loadPreferences();
  }, [user]);

  async function updatePreferences(updated: Partial<UserPreferences>) {
    if (!user) return;
    const ref = doc(db, "users", user.uid);
    const newPrefs = { ...preferences, ...updated };
    await setDoc(ref, newPrefs);
    setPreferences(newPrefs);
  }

  return { preferences, loading, updatePreferences };
}