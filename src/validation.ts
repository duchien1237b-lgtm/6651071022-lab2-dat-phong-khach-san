import type { BookingDraft, Room } from './types';
import { isoDate, nightsBetween, validateEmail, validatePhone } from './utils';

export type Errors = Partial<Record<keyof BookingDraft, string>>;

export const MAX_NIGHTS = 30;

/** Bước 1: phòng, ngày nhận/trả, số khách. */
export function validateStay(d: BookingDraft, room: Room | undefined): Errors {
  const e: Errors = {};
  if (!room) e.roomId = 'Vui lòng chọn loại phòng.';
  const today = isoDate(0);
  if (!d.checkIn) e.checkIn = 'Vui lòng chọn ngày nhận phòng.';
  else if (d.checkIn < today) e.checkIn = 'Ngày nhận phòng không được ở trong quá khứ.';
  if (!d.checkOut) e.checkOut = 'Vui lòng chọn ngày trả phòng.';
  else if (d.checkIn && d.checkOut <= d.checkIn) e.checkOut = 'Ngày trả phòng phải sau ngày nhận phòng.';
  else if (d.checkIn && nightsBetween(d.checkIn, d.checkOut) > MAX_NIGHTS)
    e.checkOut = `Mỗi lần đặt tối đa ${MAX_NIGHTS} đêm.`;
  if (!Number.isInteger(d.adults) || d.adults < 1) e.adults = 'Cần ít nhất 1 người lớn.';
  else if (room && d.adults + d.children > room.capacity)
    e.adults = `${room.name} chỉ nhận tối đa ${room.capacity} khách (gồm cả trẻ em).`;
  if (!Number.isInteger(d.children) || d.children < 0) e.children = 'Số trẻ em không hợp lệ.';
  return e;
}

/** Bước 2: thông tin liên hệ. */
export function validateGuest(d: BookingDraft): Errors {
  const e: Errors = {};
  const name = d.fullName.trim();
  if (!name) e.fullName = 'Vui lòng nhập họ và tên.';
  else if (name.split(/\s+/).length < 2) e.fullName = 'Vui lòng nhập đầy đủ họ và tên (ít nhất 2 từ).';
  else if (!/^[\p{L}\s'.-]+$/u.test(name)) e.fullName = 'Họ tên chỉ gồm chữ cái và khoảng trắng.';
  if (!d.email.trim()) e.email = 'Vui lòng nhập email để nhận xác nhận.';
  else if (!validateEmail(d.email)) e.email = 'Email không hợp lệ, ví dụ: ten@gmail.com';
  if (!d.phone.trim()) e.phone = 'Vui lòng nhập số điện thoại.';
  else if (!validatePhone(d.phone)) e.phone = 'Số điện thoại di động Việt Nam gồm 10 số, ví dụ: 0912 345 678';
  if (d.note.length > 300) e.note = 'Ghi chú tối đa 300 ký tự.';
  return e;
}

/** Bước 3: thanh toán và đồng ý điều khoản. */
export function validateConfirm(d: BookingDraft): Errors {
  const e: Errors = {};
  if (!d.payment) e.payment = 'Vui lòng chọn phương thức thanh toán.';
  if (!d.agree) e.agree = 'Bạn cần đồng ý với điều khoản đặt phòng.';
  return e;
}
