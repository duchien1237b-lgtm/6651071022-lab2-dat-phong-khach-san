import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useBookings } from '../hooks/useBookings';
import { useToast } from '../hooks/useToast';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import Modal from '../components/Modal';
import ETicket from '../components/ETicket';
import SmartImage from '../components/SmartImage';
import { IconCalendar, IconCopy, IconTicket, IconUsers } from '../components/Icons';
import { PAYMENT_LABELS } from '../data/listings';
import { formatCurrency, formatDate } from '../utils';
import type { Booking } from '../types';

export default function MyBookingsPage() {
  useDocumentTitle('Đặt phòng của tôi');
  const { bookings, cancelBooking, removeBooking } = useBookings();
  const { notify } = useToast();
  const [params] = useSearchParams();
  const newCode = params.get('new');
  const [pending, setPending] = useState<Booking | null>(null);
  const newBooking = bookings.find((b) => b.code === newCode && b.status === 'confirmed');

  async function copy(code: string) {
    try {
      await navigator.clipboard.writeText(code);
      notify({ kind: 'info', title: 'Đã sao chép mã đặt phòng', message: code, duration: 2500 });
    } catch {
      notify({ kind: 'warning', title: 'Không thể sao chép', message: 'Trình duyệt chặn quyền truy cập clipboard.' });
    }
  }

  function confirmCancel() {
    if (!pending) return;
    cancelBooking(pending.code);
    notify({ kind: 'warning', title: 'Đã hủy đặt phòng', message: `${pending.code} · ${pending.listingName}` });
    setPending(null);
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 tablet:px-6">
      <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Đặt phòng của tôi</h1>
      <p className="mt-1 text-slate-600">Lưu trên trình duyệt này (localStorage).</p>
      {newBooking && (
        <div className="mb-4 mt-8">
          <ETicket booking={newBooking} />
        </div>
      )}

      {bookings.length === 0 ? (
        <div className="mt-8 rounded-2xl border-2 border-dashed border-slate-300 bg-white p-10 text-center">
          <IconTicket className="mx-auto text-4xl text-brand-700" />
          <p className="mt-3 text-lg font-semibold text-slate-900">Bạn chưa có đặt phòng nào</p>
          <p className="mt-1 text-slate-600">Hơn 20 khách sạn và homestay đang chờ bạn khám phá.</p>
          <Link
            to="/"
            className="mt-5 inline-block rounded-xl bg-brand-700 px-5 py-3 font-semibold text-white hover:bg-brand-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700"
          >
            Khám phá ngay
          </Link>
        </div>
      ) : (
        <ul className="mt-6 space-y-4">
          {bookings.map((b) => {
            const cancelled = b.status === 'cancelled';
            return (
              <li
                key={b.code}
                className={`overflow-hidden rounded-2xl bg-white shadow-sm ring-1 tablet:flex ${
                  b.code === newCode ? 'ring-2 ring-brand-600' : 'ring-slate-200'
                } ${cancelled ? 'opacity-75' : ''}`}
              >
                <SmartImage
                  photoId={b.image}
                  alt={`Ảnh ${b.listingName}`}
                  width={400}
                  height={300}
                  widths={[400]}
                  sizes="(min-width: 640px) 220px, 100vw"
                  loading="lazy"
                  className="aspect-[4/3] w-full object-cover tablet:w-56"
                />
                <div className="flex flex-1 flex-col gap-3 p-5">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <h2 className="text-lg font-semibold text-slate-900">
                        <Link to={`/item/${b.listingId}`} className="hover:underline">
                          {b.listingName}
                        </Link>
                      </h2>
                      <p className="text-sm text-slate-600">
                        {b.roomName} · {b.city}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        cancelled ? 'bg-slate-200 text-slate-700' : 'bg-brand-100 text-brand-800'
                      }`}
                    >
                      {cancelled ? 'Đã hủy' : b.code === newCode ? 'Mới xác nhận' : 'Đã xác nhận'}
                    </span>
                  </div>
                  <ul className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-slate-700">
                    <li className="flex items-center gap-1.5"><IconCalendar className="text-brand-700" /> {formatDate(b.checkIn)} → {formatDate(b.checkOut)} ({b.nights} đêm)</li>
                    <li className="flex items-center gap-1.5"><IconUsers className="text-brand-700" /> {b.adults} người lớn{b.children ? `, ${b.children} trẻ em` : ''}</li>
                  </ul>
                  <p className="text-sm text-slate-600">
                    {b.fullName} · {PAYMENT_LABELS[b.payment]}
                  </p>
                  <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-semibold text-slate-900">{b.code}</span>
                      <button
                        type="button"
                        onClick={() => copy(b.code)}
                        aria-label={`Sao chép mã ${b.code}`}
                        className="grid h-8 w-8 place-items-center rounded-lg text-slate-600 hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-700"
                      >
                        <IconCopy />
                      </button>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-lg font-bold text-brand-800">{formatCurrency(b.total)}</span>
                      {cancelled ? (
                        <button
                          type="button"
                          onClick={() => {
                            removeBooking(b.code);
                            notify({ kind: 'info', title: 'Đã xóa khỏi danh sách', message: b.code });
                          }}
                          className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-700"
                        >
                          Xóa
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setPending(b)}
                          className="rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-700"
                        >
                          Hủy đặt phòng
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <Modal
        open={pending !== null}
        onClose={() => setPending(null)}
        title="Hủy đặt phòng?"
        footer={
          <>
            <button
              type="button"
              onClick={() => setPending(null)}
              className="rounded-xl border border-slate-300 px-4 py-2.5 font-semibold text-slate-800 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-700"
            >
              Giữ lại
            </button>
            <button
              type="button"
              onClick={confirmCancel}
              className="rounded-xl bg-red-700 px-4 py-2.5 font-semibold text-white hover:bg-red-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700"
            >
              Xác nhận hủy
            </button>
          </>
        }
      >
        {pending && (
          <p className="text-slate-700">
            Bạn chắc chắn muốn hủy đặt phòng <strong>{pending.code}</strong> tại <strong>{pending.listingName}</strong> (
            {formatDate(pending.checkIn)} → {formatDate(pending.checkOut)})? Thao tác này không thể hoàn tác.
          </p>
        )}
      </Modal>
    </div>
  );
}
