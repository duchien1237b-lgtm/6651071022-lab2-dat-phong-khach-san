import { useEffect, useMemo, useReducer, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { getListing, PAYMENT_LABELS } from '../data/listings';
import Stepper from '../components/Stepper';
import Field from '../components/Field';
import SmartImage from '../components/SmartImage';
import Rating from '../components/Rating';
import { IconArrowLeft, IconArrowRight, IconCalendar, IconCheck, IconUsers } from '../components/Icons';
import { describedBy, inputClass } from '../formStyles';
import { formatCurrency, formatDate, isoDate, nightsBetween } from '../utils';
import { MAX_NIGHTS, validateConfirm, validateGuest, validateStay, type Errors } from '../validation';
import { useToast } from '../hooks/useToast';
import { useBookings } from '../hooks/useBookings';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import NotFoundPage from './NotFoundPage';
import type { Booking, BookingDraft, Listing, PaymentMethod } from '../types';

const STEPS = ['Phòng & ngày', 'Thông tin khách', 'Thanh toán & xác nhận'];
const SERVICE_FEE_RATE = 0.05;

type Action =
  | { type: 'set'; field: keyof BookingDraft; value: BookingDraft[keyof BookingDraft] }
  | { type: 'reset'; draft: BookingDraft };

function reducer(state: BookingDraft, action: Action): BookingDraft {
  switch (action.type) {
    case 'set':
      return { ...state, [action.field]: action.value };
    case 'reset':
      return action.draft;
    default:
      return state;
  }
}

function draftKey(id: string) {
  return `emerald-stay:draft:${id}`;
}

function initialDraft(listing: Listing, roomParam: string | null): BookingDraft {
  const base: BookingDraft = {
    roomId: listing.rooms.some((r) => r.id === roomParam) ? (roomParam as string) : listing.rooms[0].id,
    checkIn: isoDate(7),
    checkOut: isoDate(9),
    adults: 2,
    children: 0,
    fullName: '',
    email: '',
    phone: '',
    note: '',
    payment: 'pay-at-property',
    agree: false,
  };
  try {
    const saved = sessionStorage.getItem(draftKey(listing.id));
    if (saved) {
      const parsed = JSON.parse(saved) as Partial<BookingDraft>;
      const savedRoomOk = listing.rooms.some((r) => r.id === parsed.roomId);
      const roomId = roomParam && base.roomId === roomParam ? roomParam : savedRoomOk ? (parsed.roomId as string) : base.roomId;
      return { ...base, ...parsed, roomId, agree: false };
    }
  } catch {
    /* bỏ qua bản nháp hỏng */
  }
  return base;
}

function bookingCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let s = 'ES-';
  for (let i = 0; i < 6; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}

export default function BookingPage() {
  const { id } = useParams();
  const listing = getListing(id);
  if (!listing) return <NotFoundPage message="Không thể đặt phòng vì chỗ nghỉ không tồn tại." />;
  return <BookingForm listing={listing} />;
}

function BookingForm({ listing }: { listing: Listing }) {
  useDocumentTitle(`Đặt phòng ${listing.name}`);
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { notify } = useToast();
  const { addBooking } = useBookings();

  const [draft, dispatch] = useReducer(reducer, undefined, () => initialDraft(listing, params.get('room')));
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);

  const room = listing.rooms.find((r) => r.id === draft.roomId);
  const nights = nightsBetween(draft.checkIn, draft.checkOut);
  const subtotal = room ? room.price * nights : 0;
  const fee = Math.round((subtotal * SERVICE_FEE_RATE) / 1000) * 1000;
  const total = subtotal + fee;

  // Lưu nháp vào sessionStorage để F5 không mất dữ liệu đã nhập
  useEffect(() => {
    try {
      sessionStorage.setItem(draftKey(listing.id), JSON.stringify(draft));
    } catch {
      /* bỏ qua */
    }
  }, [draft, listing.id]);

  // Khi đổi bước: đưa focus về tiêu đề bước để trình đọc màn hình thông báo
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    headingRef.current?.focus();
  }, [step]);

  const set =
    (field: keyof BookingDraft, kind: 'text' | 'number' | 'checkbox' = 'text') =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const target = e.target;
      const value =
        kind === 'checkbox' && target instanceof HTMLInputElement
          ? target.checked
          : kind === 'number'
            ? Number(target.value)
            : target.value;
      dispatch({ type: 'set', field, value });
      // Xóa lỗi của ô vừa sửa
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

  const validators = useMemo(
    () => [() => validateStay(draft, room), () => validateGuest(draft), () => validateConfirm(draft)],
    [draft, room],
  );

  function focusFirstError(errs: Errors) {
    const first = Object.keys(errs)[0];
    if (!first) return;
    requestAnimationFrame(() => {
      const el = formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`);
      el?.focus();
    });
  }

  function goNext() {
    const errs = validators[step]();
    const clean = Object.fromEntries(Object.entries(errs).filter(([, v]) => v)) as Errors;
    setErrors(clean);
    if (Object.keys(clean).length > 0) {
      notify({ kind: 'error', title: 'Thông tin chưa hợp lệ', message: `Vui lòng kiểm tra ${Object.keys(clean).length} trường được đánh dấu đỏ.` });
      focusFirstError(clean);
      return false;
    }
    return true;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!goNext()) return;
    if (step < STEPS.length - 1) {
      setStep((s) => s + 1);
      return;
    }
    // Bước cuối: kiểm tra lại toàn bộ trước khi tạo đơn
    const all = { ...validateStay(draft, room), ...validateGuest(draft), ...validateConfirm(draft) };
    const firstBadStep = [validateStay(draft, room), validateGuest(draft), validateConfirm(draft)].findIndex(
      (x) => Object.keys(x).length > 0,
    );
    if (firstBadStep !== -1 || !room) {
      setErrors(all);
      setStep(Math.max(firstBadStep, 0));
      notify({ kind: 'error', title: 'Có thông tin cần sửa lại' });
      return;
    }
    setSubmitting(true);
    // Giả lập gọi API xác nhận đặt phòng
    window.setTimeout(() => {
      const booking: Booking = {
        code: bookingCode(),
        listingId: listing.id,
        listingName: listing.name,
        city: listing.city,
        image: listing.images[0],
        roomName: room.name,
        checkIn: draft.checkIn,
        checkOut: draft.checkOut,
        nights,
        adults: draft.adults,
        children: draft.children,
        fullName: draft.fullName.trim(),
        email: draft.email.trim(),
        phone: draft.phone.trim(),
        note: draft.note.trim(),
        payment: draft.payment,
        total,
        createdAt: new Date().toISOString(),
        status: 'confirmed',
      };
      addBooking(booking);
      try {
        sessionStorage.removeItem(draftKey(listing.id));
      } catch {
        /* bỏ qua */
      }
      notify({
        kind: 'success',
        title: 'Đặt phòng thành công!',
        message: `Mã đặt phòng ${booking.code}. Xác nhận đã gửi tới ${booking.email}.`,
        duration: 6000,
      });
      navigate(`/bookings?new=${booking.code}`);
    }, 700);
  }

  function goBack() {
    setErrors({});
    setStep((s) => Math.max(0, s - 1));
  }

  const err = (f: keyof BookingDraft) => errors[f];

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 tablet:px-6">
      <Link to={`/item/${listing.id}`} className="inline-flex items-center gap-1 text-sm font-medium text-brand-800 hover:underline">
        <IconArrowLeft /> Quay lại {listing.name}
      </Link>
      <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900">Hoàn tất đặt phòng</h1>
      <p className="mt-1 text-slate-600">Chỉ 3 bước, mất chưa tới 2 phút. Thông tin của bạn được bảo mật.</p>

      <div className="mt-6 grid gap-8 laptop:grid-cols-[1fr_340px]">
        <div className="rounded-3xl bg-white p-5 shadow-card ring-1 ring-slate-200 tablet:p-8">
          <Stepper steps={STEPS} current={step} />

          <form ref={formRef} noValidate onSubmit={handleSubmit} className="mt-8" aria-labelledby="step-heading">
            <h2 id="step-heading" ref={headingRef} tabIndex={-1} className="text-xl font-semibold text-slate-900 outline-none">
              Bước {step + 1}: {STEPS[step]}
            </h2>

            {step === 0 && (
              <div className="mt-5 space-y-6">
                <fieldset>
                  <legend className="mb-2 text-sm font-medium text-slate-800">
                    Loại phòng <span className="text-red-700" aria-hidden="true">*</span>
                  </legend>
                  <div className="grid gap-3 tablet:grid-cols-2">
                    {listing.rooms.map((r) => (
                      <label
                        key={r.id}
                        className={`flex cursor-pointer flex-col rounded-xl border-2 p-4 transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brand-700 ${
                          draft.roomId === r.id ? 'border-brand-700 bg-brand-50' : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <span className="flex items-start justify-between gap-2">
                          <span className="font-semibold text-slate-900">{r.name}</span>
                          <input
                            type="radio"
                            name="roomId"
                            value={r.id}
                            checked={draft.roomId === r.id}
                            onChange={set('roomId')}
                            className="mt-1 h-4 w-4 accent-brand-700"
                          />
                        </span>
                        <span className="mt-1 text-sm text-slate-600">
                          {r.bed} · {r.size} m² · tối đa {r.capacity} khách
                        </span>
                        <span className="mt-2 font-bold text-brand-800">{formatCurrency(r.price)}<span className="text-xs font-normal text-slate-600"> / đêm</span></span>
                      </label>
                    ))}
                  </div>
                  {err('roomId') && <p className="mt-1 text-sm font-medium text-red-700">{err('roomId')}</p>}
                </fieldset>

                <div className="grid gap-4 tablet:grid-cols-2">
                  <Field id="checkIn" label="Ngày nhận phòng" required error={err('checkIn')}>
                    <input
                      id="checkIn"
                      name="checkIn"
                      type="date"
                      min={isoDate(0)}
                      value={draft.checkIn}
                      onChange={set('checkIn')}
                      aria-invalid={Boolean(err('checkIn'))}
                      aria-describedby={describedBy('checkIn', err('checkIn'))}
                      className={inputClass(Boolean(err('checkIn')))}
                    />
                  </Field>
                  <Field id="checkOut" label="Ngày trả phòng" required error={err('checkOut')} hint={`Tối đa ${MAX_NIGHTS} đêm mỗi lần đặt`}>
                    <input
                      id="checkOut"
                      name="checkOut"
                      type="date"
                      min={draft.checkIn || isoDate(1)}
                      value={draft.checkOut}
                      onChange={set('checkOut')}
                      aria-invalid={Boolean(err('checkOut'))}
                      aria-describedby={describedBy('checkOut', err('checkOut'), 'hint')}
                      className={inputClass(Boolean(err('checkOut')))}
                    />
                  </Field>
                  <Field id="adults" label="Người lớn" required error={err('adults')}>
                    <input
                      id="adults"
                      name="adults"
                      type="number"
                      inputMode="numeric"
                      min={1}
                      max={room?.capacity ?? 10}
                      value={draft.adults}
                      onChange={set('adults', 'number')}
                      aria-invalid={Boolean(err('adults'))}
                      aria-describedby={describedBy('adults', err('adults'))}
                      className={inputClass(Boolean(err('adults')))}
                    />
                  </Field>
                  <Field id="children" label="Trẻ em (dưới 12 tuổi)" error={err('children')}>
                    <input
                      id="children"
                      name="children"
                      type="number"
                      inputMode="numeric"
                      min={0}
                      max={10}
                      value={draft.children}
                      onChange={set('children', 'number')}
                      aria-invalid={Boolean(err('children'))}
                      aria-describedby={describedBy('children', err('children'))}
                      className={inputClass(Boolean(err('children')))}
                    />
                  </Field>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="mt-5 grid gap-4 tablet:grid-cols-2">
                <div className="tablet:col-span-2">
                  <Field id="fullName" label="Họ và tên" required error={err('fullName')}>
                    <input
                      id="fullName"
                      name="fullName"
                      autoComplete="name"
                      placeholder="Nguyễn Văn A"
                      value={draft.fullName}
                      onChange={set('fullName')}
                      aria-invalid={Boolean(err('fullName'))}
                      aria-describedby={describedBy('fullName', err('fullName'))}
                      className={inputClass(Boolean(err('fullName')))}
                    />
                  </Field>
                </div>
                <Field id="email" label="Email" required error={err('email')} hint="Xác nhận đặt phòng sẽ gửi về email này">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="ten@gmail.com"
                    value={draft.email}
                    onChange={set('email')}
                    aria-invalid={Boolean(err('email'))}
                    aria-describedby={describedBy('email', err('email'), 'hint')}
                    className={inputClass(Boolean(err('email')))}
                  />
                </Field>
                <Field id="phone" label="Số điện thoại" required error={err('phone')}>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    inputMode="tel"
                    placeholder="0912 345 678"
                    value={draft.phone}
                    onChange={set('phone')}
                    aria-invalid={Boolean(err('phone'))}
                    aria-describedby={describedBy('phone', err('phone'))}
                    className={inputClass(Boolean(err('phone')))}
                  />
                </Field>
                <div className="tablet:col-span-2">
                  <Field id="note" label="Yêu cầu đặc biệt (không bắt buộc)" error={err('note')} hint={`${draft.note.length}/300 ký tự`}>
                    <textarea
                      id="note"
                      name="note"
                      rows={3}
                      placeholder="Ví dụ: nhận phòng muộn, phòng tầng cao, giường phụ cho bé..."
                      value={draft.note}
                      onChange={set('note')}
                      aria-invalid={Boolean(err('note'))}
                      aria-describedby={describedBy('note', err('note'), 'hint')}
                      className={inputClass(Boolean(err('note')))}
                    />
                  </Field>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="mt-5 space-y-6">
                <fieldset>
                  <legend className="mb-2 text-sm font-medium text-slate-800">
                    Phương thức thanh toán <span className="text-red-700" aria-hidden="true">*</span>
                  </legend>
                  <div className="grid gap-3 tablet:grid-cols-3">
                    {(Object.keys(PAYMENT_LABELS) as PaymentMethod[]).map((m) => (
                      <label
                        key={m}
                        className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 p-4 text-sm font-medium transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brand-700 ${
                          draft.payment === m ? 'border-brand-700 bg-brand-50 text-slate-900' : 'border-slate-200 text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <input type="radio" name="payment" value={m} checked={draft.payment === m} onChange={set('payment')} className="h-4 w-4 accent-brand-700" />
                        {PAYMENT_LABELS[m]}
                      </label>
                    ))}
                  </div>
                </fieldset>

                <div className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200">
                  <h3 className="font-semibold text-slate-900">Kiểm tra lại thông tin</h3>
                  <dl className="mt-3 grid gap-x-6 gap-y-2 text-sm tablet:grid-cols-2">
                    <div className="flex justify-between gap-2 tablet:block"><dt className="text-slate-600">Phòng</dt><dd className="font-medium text-slate-900">{room?.name}</dd></div>
                    <div className="flex justify-between gap-2 tablet:block"><dt className="text-slate-600">Thời gian</dt><dd className="font-medium text-slate-900">{formatDate(draft.checkIn)} → {formatDate(draft.checkOut)} ({nights} đêm)</dd></div>
                    <div className="flex justify-between gap-2 tablet:block"><dt className="text-slate-600">Khách</dt><dd className="font-medium text-slate-900">{draft.adults} người lớn{draft.children > 0 ? `, ${draft.children} trẻ em` : ''}</dd></div>
                    <div className="flex justify-between gap-2 tablet:block"><dt className="text-slate-600">Người đặt</dt><dd className="font-medium text-slate-900">{draft.fullName}</dd></div>
                    <div className="flex justify-between gap-2 tablet:block"><dt className="text-slate-600">Email</dt><dd className="break-all font-medium text-slate-900">{draft.email}</dd></div>
                    <div className="flex justify-between gap-2 tablet:block"><dt className="text-slate-600">Điện thoại</dt><dd className="font-medium text-slate-900">{draft.phone}</dd></div>
                  </dl>
                  <div className="mt-3 flex flex-wrap gap-3 text-sm">
                    <button type="button" onClick={() => setStep(0)} className="font-semibold text-brand-800 hover:underline">Sửa phòng & ngày</button>
                    <button type="button" onClick={() => setStep(1)} className="font-semibold text-brand-800 hover:underline">Sửa thông tin khách</button>
                  </div>
                </div>

                <div>
                  <label className="flex items-start gap-3 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      name="agree"
                      checked={draft.agree}
                      onChange={set('agree', 'checkbox')}
                      aria-invalid={Boolean(err('agree'))}
                      aria-describedby={err('agree') ? 'agree-error' : undefined}
                      className="mt-0.5 h-5 w-5 shrink-0 accent-brand-700"
                    />
                    <span>
                      Tôi đã đọc và đồng ý với điều khoản đặt phòng, chính sách hủy và chính sách bảo mật của Emerald Stay.
                    </span>
                  </label>
                  {err('agree') && <p id="agree-error" className="mt-1 text-sm font-medium text-red-700">{err('agree')}</p>}
                </div>
              </div>
            )}

            <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 tablet:flex-row tablet:justify-between">
              {step > 0 ? (
                <button
                  type="button"
                  onClick={goBack}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-800 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-700"
                >
                  <IconArrowLeft /> Quay lại
                </button>
              ) : (
                <span />
              )}
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-700 px-6 py-3 font-semibold text-white shadow hover:bg-brand-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 disabled:cursor-wait disabled:opacity-70"
              >
                {step < STEPS.length - 1 ? (
                  <>
                    Tiếp tục <IconArrowRight />
                  </>
                ) : submitting ? (
                  'Đang xác nhận...'
                ) : (
                  <>
                    <IconCheck /> Xác nhận đặt phòng
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        <aside aria-label="Tóm tắt chi phí" className="laptop:sticky laptop:top-24 laptop:self-start">
          <div className="overflow-hidden rounded-3xl bg-white shadow-card ring-1 ring-slate-200">
            <SmartImage
              photoId={listing.images[0]}
              alt={`Toàn cảnh ${listing.name}`}
              width={640}
              height={360}
              widths={[400, 640]}
              sizes="(min-width: 1024px) 340px, 100vw"
              className="aspect-video w-full object-cover"
            />
            <div className="p-5">
              <p className="font-semibold text-slate-900">{listing.name}</p>
              <p className="text-sm text-slate-600">{listing.address}</p>
              <div className="mt-2">
                <Rating score={listing.rating} />
              </div>
              <ul className="mt-4 space-y-2 text-sm text-slate-700">
                <li className="flex items-center gap-2"><IconCalendar className="text-brand-700" /> {formatDate(draft.checkIn)} → {formatDate(draft.checkOut)}</li>
                <li className="flex items-center gap-2"><IconUsers className="text-brand-700" /> {draft.adults} người lớn{draft.children > 0 ? `, ${draft.children} trẻ em` : ''}</li>
              </ul>
              <dl className="mt-4 space-y-2 border-t border-slate-200 pt-4 text-sm">
                <div className="flex justify-between">
                  <dt className="text-slate-600">{room ? formatCurrency(room.price) : '—'} × {nights} đêm</dt>
                  <dd className="text-slate-900">{formatCurrency(subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-600">Phí dịch vụ (5%)</dt>
                  <dd className="text-slate-900">{formatCurrency(fee)}</dd>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-2 text-base font-bold">
                  <dt className="text-slate-900">Tổng cộng</dt>
                  <dd className="text-brand-800">{formatCurrency(total)}</dd>
                </div>
              </dl>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
