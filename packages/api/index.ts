const API_URL = "https://api.exchangerate-api.com/v4/latest/USD";

export async function fetchRates() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Failed to fetch rates");
  return res.json();
}