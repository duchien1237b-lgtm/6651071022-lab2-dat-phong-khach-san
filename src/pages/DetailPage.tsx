import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getListing, listings } from '../data/listings';
import SmartImage from '../components/SmartImage';
import Rating from '../components/Rating';
import Modal from '../components/Modal';
import ListingCard from '../components/ListingCard';
import {
  IconArrowLeft,
  IconBed,
  IconCheck,
  IconChevronLeft,
  IconChevronRight,
  IconClock,
  IconExpand,
  IconPin,
  IconRuler,
  IconShield,
  IconUsers,
} from '../components/Icons';
import { formatCurrency, formatDate } from '../utils';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import NotFoundPage from './NotFoundPage';
import type { Listing } from '../types';

function imageAlt(listing: Listing, index: number): string {
  if (index === 0) return `Toàn cảnh ${listing.name} tại ${listing.city}`;
  if (index === listing.images.length - 1) return `Không gian chung và tiện ích của ${listing.name}`;
  return `Phòng nghỉ tại ${listing.name}, ảnh ${index + 1}`;
}

function Gallery({ listing }: { listing: Listing }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const total = listing.images.length;
  const step = useCallback(
    (delta: number) => setOpenIndex((i) => (i === null ? i : (i + delta + total) % total)),
    [total],
  );

  // Phím mũi tên trái/phải để chuyển ảnh khi đang mở xem ảnh lớn
  useEffect(() => {
    if (openIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [openIndex, step]);

  return (
    <>
      <div className="relative grid gap-2 overflow-hidden rounded-3xl shadow-card tablet:h-[440px] tablet:grid-cols-4 tablet:grid-rows-2">
        {listing.images.map((id, i) => (
          <button
            key={id + i}
            type="button"
            onClick={() => setOpenIndex(i)}
            className={`relative overflow-hidden focus-visible:outline focus-visible:outline-4 focus-visible:-outline-offset-4 focus-visible:outline-brand-700 ${
              i === 0 ? 'aspect-[4/3] tablet:col-span-2 tablet:row-span-2 tablet:aspect-auto' : 'hidden tablet:block'
            } ${i === 3 ? 'tablet:col-span-2' : ''}`}
            aria-label={`Xem ảnh lớn: ${imageAlt(listing, i)}`}
          >
            <SmartImage
              photoId={id}
              alt={imageAlt(listing, i)}
              width={i === 0 ? 960 : 640}
              height={i === 0 ? 720 : 480}
              widths={i === 0 ? [640, 960, 1280] : [400, 640]}
              sizes={i === 0 ? '(min-width: 640px) 50vw, 100vw' : '25vw'}
              loading={i === 0 ? 'eager' : 'lazy'}
              fetchPriority={i === 0 ? 'high' : 'auto'}
              className="h-full w-full object-cover transition duration-500 hover:scale-105"
            />
          </button>
        ))}
        <button
          type="button"
          onClick={() => setOpenIndex(0)}
          className="absolute bottom-3 right-3 flex items-center gap-2 rounded-xl bg-white/95 px-3 py-2 text-sm font-semibold text-slate-900 shadow hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-700"
        >
          <IconExpand /> Xem tất cả {total} ảnh
        </button>
      </div>

      <Modal
        open={openIndex !== null}
        onClose={() => setOpenIndex(null)}
        title={`Ảnh của ${listing.name}`}
        size="xl"
        tone="dark"
      >
        {openIndex !== null && (
          <figure>
            <div className="relative">
              <SmartImage
                key={openIndex}
                photoId={listing.images[openIndex]}
                alt={imageAlt(listing, openIndex)}
                width={1280}
                height={853}
                widths={[960, 1280, 1600]}
                sizes="(min-width: 1024px) 1024px, 100vw"
                className="max-h-[70vh] w-full rounded-xl object-contain"
              />
              <button
                type="button"
                onClick={() => step(-1)}
                aria-label="Ảnh trước"
                className="absolute left-2 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-black/60 text-2xl text-white hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
              >
                <IconChevronLeft />
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                aria-label="Ảnh tiếp theo"
                className="absolute right-2 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-black/60 text-2xl text-white hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
              >
                <IconChevronRight />
              </button>
            </div>
            <figcaption className="mt-3 text-center text-sm text-slate-200">
              {imageAlt(listing, openIndex)} · {openIndex + 1}/{total}
            </figcaption>
          </figure>
        )}
      </Modal>
    </>
  );
}

export default function DetailPage() {
  const { id } = useParams();
  const listing = getListing(id);
  useDocumentTitle(listing?.name ?? 'Không tìm thấy');

  if (!listing) return <NotFoundPage message="Chỗ nghỉ bạn tìm không tồn tại hoặc đã ngừng nhận khách." />;

  const similar = listings
    .filter((l) => l.id !== listing.id && (l.city === listing.city || l.type === listing.type))
    .sort((a, b) => Number(b.city === listing.city) - Number(a.city === listing.city) || b.rating - a.rating)
    .slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 tablet:px-6">
      <nav aria-label="Breadcrumb" className="mb-4 text-sm text-slate-600">
        <ol className="flex flex-wrap items-center gap-1">
          <li>
            <Link to="/" className="inline-flex items-center gap-1 font-medium text-brand-800 hover:underline">
              <IconArrowLeft /> Khám phá
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link to={`/?city=${encodeURIComponent(listing.city)}`} className="hover:underline">
              {listing.city}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-slate-900">
            {listing.name}
          </li>
        </ol>
      </nav>

      <header className="mb-5">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-800">
          {listing.type === 'hotel' ? `Khách sạn ${listing.stars} sao` : 'Homestay'}
        </p>
        <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900 laptop:text-4xl">{listing.name}</h1>
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2">
          <Rating score={listing.rating} count={listing.reviewCount} size="lg" />
          <span className="inline-flex items-center gap-1 text-slate-600">
            <IconPin /> {listing.address}
          </span>
        </div>
      </header>

      <Gallery listing={listing} />

      <div className="mt-8 grid gap-8 laptop:grid-cols-[1fr_360px]">
        <div className="space-y-10">
          <section aria-labelledby="about">
            <h2 id="about" className="text-xl font-bold text-slate-900">Giới thiệu</h2>
            <p className="mt-3 leading-relaxed text-slate-700">{listing.description}</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {listing.tags.map((t) => (
                <li key={t} className="rounded-full bg-brand-50 px-3 py-1 text-sm font-medium text-brand-800">
                  {t}
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="amenities">
            <h2 id="amenities" className="text-xl font-bold text-slate-900">Tiện nghi</h2>
            <ul className="mt-3 grid grid-cols-1 gap-2 tablet:grid-cols-2 laptop:grid-cols-3">
              {listing.amenities.map((a) => (
                <li key={a} className="flex items-center gap-2 text-slate-700">
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-brand-100 text-sm text-brand-800">
                    <IconCheck />
                  </span>
                  {a}
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="rooms">
            <h2 id="rooms" className="text-xl font-bold text-slate-900">Chọn phòng</h2>
            <ul className="mt-3 space-y-3">
              {listing.rooms.map((r) => (
                <li key={r.id} className="flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-card ring-1 ring-slate-200 transition hover:ring-brand-600 tablet:flex-row tablet:items-center tablet:justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-900">{r.name}</h3>
                    <p className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-600">
                      <span className="inline-flex items-center gap-1"><IconBed /> {r.bed}</span>
                      <span className="inline-flex items-center gap-1"><IconUsers /> Tối đa {r.capacity} khách</span>
                      <span className="inline-flex items-center gap-1"><IconRuler /> {r.size} m²</span>
                    </p>
                  </div>
                  <div className="flex items-center justify-between gap-4 tablet:justify-end">
                    <p className="text-right">
                      <span className="block text-lg font-bold text-brand-800">{formatCurrency(r.price)}</span>
                      <span className="text-xs text-slate-600">/ đêm, đã gồm thuế</span>
                    </p>
                    <Link
                      to={`/item/${listing.id}/book?room=${r.id}`}
                      className="rounded-xl bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700"
                      aria-label={`Đặt ${r.name}`}
                    >
                      Đặt phòng
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="policies">
            <h2 id="policies" className="text-xl font-bold text-slate-900">Chính sách</h2>
            <dl className="mt-3 grid gap-4 rounded-2xl bg-white p-4 ring-1 ring-slate-200 tablet:grid-cols-3">
              <div>
                <dt className="flex items-center gap-1 text-sm text-slate-600"><IconClock /> Nhận phòng</dt>
                <dd className="font-semibold text-slate-900">Từ {listing.checkInTime}</dd>
              </div>
              <div>
                <dt className="flex items-center gap-1 text-sm text-slate-600"><IconClock /> Trả phòng</dt>
                <dd className="font-semibold text-slate-900">Trước {listing.checkOutTime}</dd>
              </div>
              <div>
                <dt className="flex items-center gap-1 text-sm text-slate-600"><IconShield /> Hủy phòng</dt>
                <dd className="font-semibold text-slate-900">
                  {listing.freeCancellation ? 'Miễn phí trước 48 giờ' : 'Không hoàn tiền'}
                </dd>
              </div>
            </dl>
          </section>

          <section aria-labelledby="reviews">
            <h2 id="reviews" className="text-xl font-bold text-slate-900">Khách nói gì</h2>
            <ul className="mt-3 grid gap-4 tablet:grid-cols-2">
              {listing.reviews.map((r) => (
                <li key={r.author + r.date} className="rounded-2xl bg-white p-5 shadow-card ring-1 ring-slate-200">
                  <div className="flex items-center gap-3">
                    <span aria-hidden="true" className="grid h-10 w-10 place-items-center rounded-full bg-brand-100 font-bold text-brand-800">
                      {r.author.charAt(0)}
                    </span>
                    <div>
                      <p className="font-semibold text-slate-900">{r.author}</p>
                      <p className="text-xs text-slate-600">
                        {r.from} · {formatDate(r.date)}
                      </p>
                    </div>
                    <span className="ml-auto rounded-md bg-brand-700 px-2 py-0.5 text-sm font-semibold text-white">
                      <span className="sr-only">Chấm </span>
                      {r.rating}/5
                    </span>
                  </div>
                  <p className="mt-3 text-slate-700">“{r.comment}”</p>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <aside aria-label="Tóm tắt đặt phòng" className="laptop:sticky laptop:top-24 laptop:self-start">
          <div className="overflow-hidden rounded-3xl bg-white shadow-card-hover ring-1 ring-slate-200">
            <div className="bg-gradient-to-br from-brand-700 to-brand-900 p-5 text-white">
              <p className="text-sm text-brand-50">Giá mỗi đêm từ</p>
              <p className="text-3xl font-extrabold tracking-tight">{formatCurrency(listing.pricePerNight)}</p>
              <p className="mt-1 text-xs text-brand-50">Đã gồm thuế · chưa gồm phí dịch vụ 5%</p>
            </div>
            <div className="p-5">
            <ul className="space-y-2 text-sm text-slate-700">
              <li className="flex items-center gap-2"><IconCheck className="text-brand-700" /> Xác nhận ngay, không cần chờ</li>
              <li className="flex items-center gap-2"><IconCheck className="text-brand-700" /> {listing.freeCancellation ? 'Hủy miễn phí trước 48 giờ' : 'Giá tốt, không hoàn tiền'}</li>
              <li className="flex items-center gap-2"><IconCheck className="text-brand-700" /> Thanh toán tại nơi ở hoặc online</li>
            </ul>
            <Link
              to={`/item/${listing.id}/book`}
              className="mt-5 block rounded-xl bg-gradient-to-r from-brand-700 to-brand-800 px-5 py-3.5 text-center font-semibold text-white shadow hover:bg-brand-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700"
            >
              Đặt phòng ngay
            </Link>
            <p className="mt-3 text-center text-xs text-slate-600">Chưa trừ tiền ở bước này</p>
            </div>
          </div>
        </aside>
      </div>

      {similar.length > 0 && (
        <section aria-labelledby="similar" className="mt-14">
          <h2 id="similar" className="text-xl font-bold text-slate-900">Có thể bạn cũng thích</h2>
          <ul className="mt-4 grid grid-cols-1 gap-6 tablet:grid-cols-2 laptop:grid-cols-3 desktop:grid-cols-4">
            {similar.map((l) => (
              <li key={l.id} className="flex">
                <ListingCard listing={l} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
