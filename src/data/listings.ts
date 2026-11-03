import raw from './data.json';
import type { Listing } from '../types';

export const listings: Listing[] = raw as Listing[];

export function getListing(id: string | undefined): Listing | undefined {
  return listings.find((l) => l.id === id);
}

export const cities: string[] = Array.from(new Set(listings.map((l) => l.city))).sort((a, b) =>
  a.localeCompare(b, 'vi'),
);

export const PAYMENT_LABELS = {
  'pay-at-property': 'Thanh toán tại nơi lưu trú',
  'bank-transfer': 'Chuyển khoản ngân hàng',
  card: 'Thẻ tín dụng / ghi nợ',
} as const;
