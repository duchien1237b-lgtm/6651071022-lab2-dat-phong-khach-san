import { listings } from './listings';

export interface Destination {
  city: string;
  tagline: string;
  photoId: string;
  /** Ảnh dự phòng: ảnh đại diện của chỗ nghỉ đầu tiên tại thành phố */
  fallbackPhotoId: string;
  count: number;
}

const META: { city: string; tagline: string; photoId: string }[] = [
  { city: 'Đà Nẵng', tagline: 'Biển xanh & cầu Rồng', photoId: '1559592413-7cec4d0cae2b' },
  { city: 'Hội An', tagline: 'Phố cổ đèn lồng', photoId: '1557750255-c76072a7aad1' },
  { city: 'Đà Lạt', tagline: 'Thành phố ngàn hoa', photoId: '1600298881974-6be191ceeda1' },
  { city: 'Phú Quốc', tagline: 'Đảo ngọc hoàng hôn', photoId: '1540541338287-41700207dee6' },
  { city: 'Sa Pa', tagline: 'Ruộng bậc thang', photoId: '1570366583862-f91883984fde' },
  { city: 'Hạ Long', tagline: 'Kỳ quan vịnh biển', photoId: '1528127269322-539801943592' },
];

export const destinations: Destination[] = META.map((m) => {
  const inCity = listings.filter((l) => l.city === m.city);
  return { ...m, fallbackPhotoId: inCity[0]?.images[0] ?? '', count: inCity.length };
});

export const stats = {
  listings: listings.length,
  cities: new Set(listings.map((l) => l.city)).size,
  avgRating: listings.reduce((s, l) => s + l.rating, 0) / listings.length,
  reviews: listings.reduce((s, l) => s + l.reviewCount, 0),
};
