/**
 * Định dạng số tiền theo chuẩn Việt Nam.
 * formatCurrency(150000) -> "150.000 ₫"
 */
export function formatCurrency(amount: number, currency: string = 'VND'): string {
  const locale = currency === 'VND' ? 'vi-VN' : 'en-US';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: currency === 'VND' ? 0 : 2,
  }).format(amount);
}

/**
 * Cắt chuỗi về tối đa maxLength ký tự, thêm "..." nếu bị cắt.
 * truncateText('Hello world', 5) -> "Hello..."
 */
export function truncateText(text: string, maxLength: number): string {
  if (maxLength < 0) return '...';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '...';
}

/**
 * Kiểm tra email hợp lệ: có phần tên, ký tự @, tên miền có ít nhất một dấu chấm
 * và đuôi tên miền dài tối thiểu 2 ký tự. "abc@com" -> false.
 */
export function validateEmail(email: string): boolean {
  const pattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;
  return pattern.test(email.trim());
}

/**
 * Trì hoãn việc gọi fn cho tới khi ngừng gọi trong `delay` ms.
 * Nhiều lần gọi liên tiếp chỉ thực thi lần cuối cùng.
 */
// Chữ ký hàm giữ nguyên theo đề bài (có any[]), nên tắt rule no-explicit-any đúng tại dòng này.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debounce<T extends (...args: any[]) => void>(fn: T, delay: number): T {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const debounced = (...args: Parameters<T>): void => {
    if (timer !== undefined) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = undefined;
      fn(...args);
    }, delay);
  };
  return debounced as T;
}

/** Số đêm giữa 2 ngày dạng yyyy-mm-dd (0 nếu không hợp lệ). */
export function nightsBetween(checkIn: string, checkOut: string): number {
  const start = Date.parse(checkIn);
  const end = Date.parse(checkOut);
  if (Number.isNaN(start) || Number.isNaN(end)) return 0;
  const diff = Math.round((end - start) / 86_400_000);
  return diff > 0 ? diff : 0;
}

/** Ngày hôm nay + offset ngày, dạng yyyy-mm-dd theo giờ địa phương. */
export function isoDate(offsetDays = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

/** Hiển thị ngày yyyy-mm-dd thành dd/mm/yyyy. */
export function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-');
  if (!y || !m || !d) return iso;
  return `${d}/${m}/${y}`;
}

/** Số điện thoại di động Việt Nam: 10 số, bắt đầu bằng 03/05/07/08/09 (cho phép +84). */
export function validatePhone(phone: string): boolean {
  const normalized = phone.replace(/[\s.-]/g, '').replace(/^\+84/, '0');
  return /^0(3|5|7|8|9)\d{8}$/.test(normalized);
}
