import { create } from "zustand";
import {
  collection, doc, setDoc, getDocs,
  deleteDoc, query, where, serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";

// ─── Types ────────────────────────────────────────────────────────────────────
export interface TripCategory {
  name: string;
  icon: string;
  color: string;
}

export interface Trip {
  id: string;
  userId: string;
  destination: string;
  startDate: string;   // "YYYY-MM-DD"
  endDate: string;     // "YYYY-MM-DD"
  totalBudget: number;
  currency: string;
  categories: TripCategory[];
  catBudgets: Record<string, number>;
  createdAt?: number;
}

export interface Hotel {
  id: string;
  tripId: string;
  userId: string;
  name: string;
  address: string;
  checkIn: string;       // "YYYY-MM-DD"
  checkOut: string;      // "YYYY-MM-DD"
  nights: number;
  pricePerNight: number;
  totalPrice: number;
  bookingUrl: string;
  timestamp: number;
}

export interface Expense {
  id: string;
  tripId: string;
  userId: string;
  name: string;
  amount: number;
  category: string;
  date: string;        // "YYYY-MM-DD"
  note: string;
  timestamp: number;
}

export interface TripState {
  trip: Trip | null;
  trips: Trip[];
  expenses: Expense[];
  expensesTripId: string | null;
  hotels: Hotel[];
  hotelsTripId: string | null;
  loading: boolean;
  isDirty: boolean;
  view: "setup" | "dashboard";
  // Actions
  setView: (v: "setup" | "dashboard") => void;
  setTrip: (trip: Trip) => void;
  createTrip: (userId: string, data: Omit<Trip, "id" | "userId" | "createdAt">) => Promise<void>;
  loadTrip: (userId: string) => Promise<void>;
  loadExpenses: (tripId: string) => Promise<void>;
  loadHotels: (tripId: string) => Promise<void>;
  updateCatBudget: (catName: string, value: number) => void;
  autoSplit: () => void;
  addExpense: (data: Omit<Expense, "id" | "tripId" | "userId" | "timestamp">) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  addHotel: (data: Omit<Hotel, "id" | "tripId" | "userId" | "timestamp">) => Promise<void>;
  deleteHotel: (id: string) => Promise<void>;
  saveTrip: () => Promise<void>;
  resetTrip: () => void;
  // Derived
  getTotalSpent: () => number;
  getCatSpent: (catName: string) => number;
  getDailyTotals: () => number[];
}

// ─── Category presets ─────────────────────────────────────────────────────────
export const CATEGORY_PRESETS: TripCategory[] = [
  { name: "Food",       icon: "🍜", color: "#f0c060" },
  { name: "Transport",  icon: "🚆", color: "#60a5fa" },
  { name: "Shopping",   icon: "🛍️", color: "#f472b6" },
  { name: "Activities", icon: "⛩️", color: "#34d399" },
  { name: "Lodging",    icon: "🏨", color: "#c084fc" },
  { name: "Misc",       icon: "💡", color: "#fb923c" },
];

export const CURRENCIES = [
  { code: "USD", symbol: "$",  label: "US Dollar" },
  { code: "JPY", symbol: "¥",  label: "Japanese Yen" },
  { code: "EUR", symbol: "€",  label: "Euro" },
  { code: "GBP", symbol: "£",  label: "British Pound" },
  { code: "KRW", symbol: "₩",  label: "Korean Won" },
  { code: "AUD", symbol: "A$", label: "Australian Dollar" },
  { code: "CAD", symbol: "C$", label: "Canadian Dollar" },
  { code: "THB", symbol: "฿",  label: "Thai Baht" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
export function tripDays(startDate: string, endDate: string): number {
  if (!startDate || !endDate) return 1;
  const d1 = new Date(startDate + "T00:00:00");
  const d2 = new Date(endDate   + "T00:00:00");
  return Math.max(1, Math.round((d2.getTime() - d1.getTime()) / 86400000) + 1);
}

export function daysElapsed(startDate: string, endDate: string): number {
  const today = new Date();
  const start = new Date(startDate + "T00:00:00");
  return Math.max(0, Math.min(tripDays(startDate, endDate), Math.floor((today.getTime() - start.getTime()) / 86400000) + 1));
}

export function daysLeft(startDate: string, endDate: string): number {
  return Math.max(0, tripDays(startDate, endDate) - daysElapsed(startDate, endDate));
}

export function getCurrencySymbol(code: string): string {
  return CURRENCIES.find(c => c.code === code)?.symbol ?? "$";
}

export function fmtDate(dateStr: string): string {
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const d = new Date(dateStr + "T00:00:00");
  return `${months[d.getMonth()]} ${d.getDate()}`;
}

// ─── Store ────────────────────────────────────────────────────────────────────
const useTripStore = create<TripState>((set, get) => ({
  trip: null,
  trips: [],
  expenses: [],
  expensesTripId: null,
  hotels: [],
  hotelsTripId: null,
  loading: false,
  isDirty: false,
  view: "setup",

  setView: (v) => set({ view: v }),

  setTrip: (trip) => set({ trip, view: "dashboard", expensesTripId: null }),

  loadExpenses: async (tripId) => {
    const userId = get().trip?.userId;
    if (!userId) return;
    try {
      const eq = query(collection(db, "expenses"), where("userId", "==", userId));
      const esnap = await getDocs(eq);
      const expenses = esnap.docs
        .map(d => d.data() as Expense)
        .filter(e => e.tripId === tripId)
        .sort((a, b) => b.timestamp - a.timestamp);
      set({ expenses, expensesTripId: tripId });
    } catch (e) {
      console.warn("Expense load failed:", e);
    }
  },

  createTrip: async (userId, data) => {
    set({ loading: true });
    const id = `trip_${Date.now()}`;
    const trip: Trip = { id, userId, ...data, createdAt: Date.now() };
    try {
      await setDoc(doc(db, "trips", id), { ...trip, createdAt: serverTimestamp() });
    } catch (e) {
      set({ loading: false });
      throw e; // surface to caller so the UI can show the error
    }
    set(s => ({ trip, trips: [trip, ...s.trips], expenses: [], expensesTripId: null, view: "dashboard", loading: false }));
  },

  loadTrip: async (userId) => {
    set({ loading: true });
    try {
      console.log("[loadTrip] querying with userId:", userId);
      const q = query(collection(db, "trips"), where("userId", "==", userId));
      const snap = await getDocs(q);
      console.log("[loadTrip] got", snap.size, "trips");
      if (!snap.empty) {
        const allTrips = snap.docs
          .map(d => d.data() as Trip)
          .sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));
        const active = get().trip ?? allTrips[0];
        const eq = query(collection(db, "expenses"), where("userId", "==", userId));
        const esnap = await getDocs(eq);
        const expenses = esnap.docs
          .map(d => d.data() as Expense)
          .filter(e => e.tripId === active.id)
          .sort((a, b) => b.timestamp - a.timestamp);
        set({ trip: active, trips: allTrips, expenses, expensesTripId: active.id, view: "dashboard" });
      }
    } catch (e) {
      console.warn("Firestore load failed:", e);
    }
    set({ loading: false });
  },

  updateCatBudget: (catName, value) => {
    const { trip } = get();
    if (!trip) return;
    const updated = { ...trip, catBudgets: { ...trip.catBudgets, [catName]: value } };
    set({ trip: updated, isDirty: true });
    setDoc(doc(db, "trips", trip.id), updated).catch(() => {});
  },

  autoSplit: () => {
    const { trip } = get();
    if (!trip) return;
    const each = Math.round(trip.totalBudget / trip.categories.length);
    const catBudgets: Record<string, number> = {};
    trip.categories.forEach(c => { catBudgets[c.name] = each; });
    const updated = { ...trip, catBudgets };
    set({ trip: updated, isDirty: true });
    setDoc(doc(db, "trips", trip.id), updated).catch(() => {});
  },

  addExpense: async (data) => {
    const { trip } = get();
    if (!trip) return;
    const id = `exp_${Date.now()}`;
    const expense: Expense = { id, tripId: trip.id, userId: trip.userId, timestamp: Date.now(), ...data };
    set(s => ({ expenses: [expense, ...s.expenses], isDirty: true }));
    setDoc(doc(db, "expenses", id), expense).catch(() => {});
  },

  deleteExpense: async (id) => {
    set(s => ({ expenses: s.expenses.filter(e => e.id !== id), isDirty: true }));
    deleteDoc(doc(db, "expenses", id)).catch(() => {});
  },

  loadHotels: async (tripId) => {
    const userId = get().trip?.userId;
    if (!userId) return;
    try {
      const q = query(collection(db, "hotels"), where("userId", "==", userId));
      const snap = await getDocs(q);
      const hotels = snap.docs
        .map(d => d.data() as Hotel)
        .filter(h => h.tripId === tripId)
        .sort((a, b) => a.checkIn.localeCompare(b.checkIn));
      set({ hotels, hotelsTripId: tripId });
    } catch (e) {
      console.warn("Hotel load failed:", e);
    }
  },

  addHotel: async (data) => {
    const { trip } = get();
    if (!trip) return;
    const id = `hotel_${Date.now()}`;
    const hotel: Hotel = { id, tripId: trip.id, userId: trip.userId, timestamp: Date.now(), ...data };
    set(s => ({ hotels: [...s.hotels, hotel].sort((a, b) => a.checkIn.localeCompare(b.checkIn)) }));
    setDoc(doc(db, "hotels", id), hotel).catch(() => {});
  },

  deleteHotel: async (id) => {
    set(s => ({ hotels: s.hotels.filter(h => h.id !== id), isDirty: true }));
    deleteDoc(doc(db, "hotels", id)).catch(() => {});
  },

  saveTrip: async () => {
    const { trip } = get();
    if (!trip) return;
    await setDoc(doc(db, "trips", trip.id), trip);
    set({ isDirty: false });
  },

  resetTrip: () => set({ trip: null, expenses: [], expensesTripId: null, hotels: [], hotelsTripId: null, isDirty: false, view: "setup" }),

  getTotalSpent: () => get().expenses.reduce((a, e) => a + e.amount, 0),

  getCatSpent: (catName) =>
    get().expenses.filter(e => e.category === catName).reduce((a, e) => a + e.amount, 0),

  getDailyTotals: () => {
    const { trip, expenses } = get();
    if (!trip) return [];
    const days = tripDays(trip.startDate, trip.endDate);
    const start = new Date(trip.startDate + "T00:00:00");
    const totals = new Array(days).fill(0);
    expenses.forEach(e => {
      const idx = Math.round((new Date(e.date + "T00:00:00").getTime() - start.getTime()) / 86400000);
      if (idx >= 0 && idx < days) totals[idx] += e.amount;
    });
    return totals;
  },
}));

export default useTripStore;