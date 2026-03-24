import { useState, useEffect } from "react";
import { fetchRates } from "@ratecache/api";
import { saveRates, getRates } from "@ratecache/storage";

export function useRates(baseCurrency: string) {
  const [rates, setRates] = useState<Record<string, number>>({});
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    async function loadRates() {
      try {
        if (navigator.onLine) {
          const data = await fetchRates();
          setRates(data.rates);
          setIsOffline(false);
          const now = new Date().toLocaleString();
          setLastUpdated(now);
          saveRates({ ...data, lastUpdated: now });
        } else {
          const cached = getRates();
          if (cached) {
            setRates(cached.rates);
            setLastUpdated(cached.lastUpdated ?? null);
            setIsOffline(true);
          }
        }
      } catch (err) {
        const cached = getRates();
        if (cached) {
          setRates(cached.rates);
          setLastUpdated(cached.lastUpdated ?? null);
          setIsOffline(true);
        }
      }
    }

    loadRates();
  }, [baseCurrency]);

  function getRate(toCurrency: string): number | null {
    if (!rates[toCurrency] || !rates[baseCurrency]) return null;
    return rates[toCurrency] / rates[baseCurrency];
  }

  return { rates, getRate, lastUpdated, isOffline };
}