import { Link } from 'react-router-dom';
import type { Booking } from '../types';
import { PAYMENT_LABELS } from '../data/listings';
import { formatCurrency, formatDate } from '../utils';
import SmartImage from './SmartImage';
import { IconCheck } from './Icons';

/** Hoa văn kiểu mã QR sinh từ mã đặt phòng (chỉ để trang trí). */
function CodePattern({ code }: { code: string }) {
  let seed = 0;
  for (const ch of code) seed = (seed * 31 + ch.charCodeAt(0)) >>> 0;
  const cells: boolean[] = [];
  for (let i = 0; i < 121; i++) {
    seed = (seed * 1103515245 + 12345) >>> 0;
    cells.push((seed >> 16) % 2 === 0);
  }
  const finder = (x: number, y: number) =>
    (x < 3 && y < 3) || (x > 7 && y < 3) || (x < 3 && y > 7);
  return (
    <svg viewBox="0 0 11 11" className="h-24 w-24 rounded-lg bg-white p-1.5" aria-hidden="true" shapeRendering="crispEdges">
      {cells.map((on, i) => {
        const x = i % 11;
        const y = Math.floor(i / 11);
        const fill = finder(x, y) ? !(x % 8 === 1 && y % 8 === 1) : on;
        return fill ? <rect key={i} x={x} y={y} width="1" height="1" fill="#0f172a" /> : null;
      })}
    </svg>
  );
}

export default function ETicket({ booking }: { booking: Booking }) {
  return (
    <section aria-labelledby="ticket-heading" className="animate-rise">
      <div className="mb-4 flex items-center gap-3">
        <span className="relative grid h-10 w-10 place-items-center rounded-full bg-brand-700 text-xl text-white">
          <span className="absolute inset-0 animate-ping-slow rounded-full bg-brand-500" aria-hidden="true" />
          <IconCheck className="relative" />
        </span>
        <div>
          <h2 id="ticket-heading" className="text-xl font-bold text-slate-900">Đặt phòng thành công!</h2>
          <p className="text-sm text-slate-600">Vé điện tử đã gửi tới {booking.email}. Xuất trình mã khi nhận phòng.</p>
        </div>
      </div>
      <div className="relative overflow-hidden rounded-3xl bg-white shadow-card-hover ring-1 ring-slate-200 tablet:flex">
        <div className="relative flex-1 bg-gradient-to-br from-brand-800 to-brand-950 p-6 text-white tablet:p-8">
          <div aria-hidden="true" className="bg-dots absolute inset-0" />
          <div className="relative flex items-start gap-4">
            <SmartImage
              photoId={booking.image}
              alt={`Ảnh ${booking.listingName}`}
              width={160}
              height={160}
              widths={[160, 320]}
              sizes="80px"
              className="h-20 w-20 shrink-0 rounded-2xl object-cover ring-2 ring-white/30"
            />
            <div>
              <p className="text-xs uppercase tracking-widest text-emerald-200">Emerald Stay · E-ticket</p>
              <h3 className="mt-1 text-xl font-bold">{booking.listingName}</h3>
              <p className="text-sm text-emerald-50">{booking.roomName} · {booking.city}</p>
            </div>
          </div>
          <dl className="relative mt-6 grid grid-cols-2 gap-4 text-sm tablet:grid-cols-4">
            <div><dt className="text-emerald-200">Nhận phòng</dt><dd className="font-semibold">{formatDate(booking.checkIn)}</dd></div>
            <div><dt className="text-emerald-200">Trả phòng</dt><dd className="font-semibold">{formatDate(booking.checkOut)}</dd></div>
            <div><dt className="text-emerald-200">Số khách</dt><dd className="font-semibold">{booking.adults + booking.children} khách · {booking.nights} đêm</dd></div>
            <div><dt className="text-emerald-200">Thanh toán</dt><dd className="font-semibold">{PAYMENT_LABELS[booking.payment]}</dd></div>
          </dl>
        </div>
        {/* Đường răng cưa như vé thật */}
        <div aria-hidden="true" className="relative h-0 border-t-2 border-dashed border-slate-200 tablet:h-auto tablet:w-0 tablet:border-l-2 tablet:border-t-0">
          <span className="absolute -left-3 -top-3 h-6 w-6 rounded-full bg-slate-50 tablet:-left-3 tablet:-top-3" />
          <span className="absolute -right-3 -top-3 h-6 w-6 rounded-full bg-slate-50 tablet:-bottom-3 tablet:-left-3 tablet:right-auto tablet:top-auto" />
        </div>
        <div className="flex items-center justify-between gap-4 p-6 tablet:w-60 tablet:flex-col tablet:justify-center tablet:text-center">
          <CodePattern code={booking.code} />
          <div>
            <p className="text-xs uppercase tracking-widest text-slate-600">Mã đặt phòng</p>
            <p className="font-mono text-xl font-bold tracking-wider text-slate-900">{booking.code}</p>
            <p className="mt-1 text-lg font-extrabold text-brand-800">{formatCurrency(booking.total)}</p>
          </div>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        <Link to={`/item/${booking.listingId}`} className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-700">
          Xem lại chỗ nghỉ
        </Link>
        <Link to="/" className="btn-shine rounded-xl bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700">
          Tiếp tục khám phá
        </Link>
      </div>
    </section>
  );
}
