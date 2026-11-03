import { createContext } from 'react';
import type { Booking } from '../types';

export interface BookingContextValue {
  bookings: Booking[];
  addBooking: (booking: Booking) => void;
  cancelBooking: (code: string) => void;
  removeBooking: (code: string) => void;
}

export const BookingContext = createContext<BookingContextValue | null>(null);
