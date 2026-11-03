/** Ảnh lấy từ Unsplash (giấy phép Unsplash License – miễn phí sử dụng). */
const BASE = 'https://images.unsplash.com/photo-';

export function photoUrl(id: string, width: number): string {
  return `${BASE}${id}?auto=format&fit=crop&w=${width}&q=70`;
}

export function photoSrcSet(id: string, widths: number[]): string {
  return widths.map((w) => `${photoUrl(id, w)} ${w}w`).join(', ');
}
