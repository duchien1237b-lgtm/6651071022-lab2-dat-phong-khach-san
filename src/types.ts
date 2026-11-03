export type StayType = 'hotel' | 'homestay';

export interface Room {
  id: string;
  name: string;
  bed: string;
  capacity: number;
  size: number;
  price: number;
}

export interface Review {
  author: string;
  from: string;
  rating: number;
  date: string;
  comment: string;
}

export interface Listing {
  id: string;
  name: string;
  type: StayType;
  city: string;
  area: string;
  address: string;
  stars: number;
  pricePerNight: number;
  rating: number;
  reviewCount: number;
  description: string;
  amenities: string[];
  tags: string[];
  images: string[];
  rooms: Room[];
  reviews: Review[];
  freeCancellation: boolean;
  checkInTime: string;
  checkOutTime: string;
}

export type PaymentMethod = 'pay-at-property' | 'bank-transfer' | 'card';

export interface BookingDraft {
  roomId: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  fullName: string;
  email: string;
  phone: string;
  note: string;
  payment: PaymentMethod;
  agree: boolean;
}

export interface Booking {
  code: string;
  listingId: string;
  listingName: string;
  city: string;
  image: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  adults: number;
  children: number;
  fullName: string;
  email: string;
  phone: string;
  note: string;
  payment: PaymentMethod;
  total: number;
  createdAt: string;
  status: 'confirmed' | 'cancelled';
}

export type ToastKind = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: number;
  kind: ToastKind;
  title: string;
  message?: string;
  duration: number;
}
