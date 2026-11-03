import { useContext } from 'react';
import { BookingContext, type BookingContextValue } from '../context/bookingContext';

export function useBookings(): BookingContextValue {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error('useBookings phải được dùng bên trong <BookingProvider>');
  return ctx;
}
