import { useCallback, useEffect, useMemo, useReducer, type ReactNode } from 'react';
import { BookingContext } from './bookingContext';
import type { Booking } from '../types';

const STORAGE_KEY = 'emerald-stay:bookings';

type Action =
  | { type: 'add'; booking: Booking }
  | { type: 'cancel'; code: string }
  | { type: 'remove'; code: string };

function reducer(state: Booking[], action: Action): Booking[] {
  switch (action.type) {
    case 'add':
      return [action.booking, ...state];
    case 'cancel':
      return state.map((b) => (b.code === action.code ? { ...b, status: 'cancelled' } : b));
    case 'remove':
      return state.filter((b) => b.code !== action.code);
    default:
      return state;
  }
}

function load(): Booking[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Booking[]) : [];
  } catch {
    return [];
  }
}

export default function BookingProvider({ children }: { children: ReactNode }) {
  const [bookings, dispatch] = useReducer(reducer, [], load);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
    } catch {
      /* bộ nhớ đầy hoặc bị chặn: bỏ qua */
    }
  }, [bookings]);

  const addBooking = useCallback((booking: Booking) => dispatch({ type: 'add', booking }), []);
  const cancelBooking = useCallback((code: string) => dispatch({ type: 'cancel', code }), []);
  const removeBooking = useCallback((code: string) => dispatch({ type: 'remove', code }), []);

  const value = useMemo(
    () => ({ bookings, addBooking, cancelBooking, removeBooking }),
    [bookings, addBooking, cancelBooking, removeBooking],
  );

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}
