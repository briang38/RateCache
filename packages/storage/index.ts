const STORAGE_KEY = "ratecache_rates";

export function saveRates(data: object): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getRates(): any {
  const cached = localStorage.getItem(STORAGE_KEY);
  return cached ? JSON.parse(cached) : null;
}