import { Link } from 'react-router-dom';
import type { Listing } from '../types';
import { formatCurrency, truncateText } from '../utils';
import SmartImage from './SmartImage';
import { IconPin, IconStar } from './Icons';

function ratingWord(score: number): string {
  if (score >= 4.8) return 'Tuyệt hảo';
  if (score >= 4.5) return 'Rất tốt';
  return 'Tốt';
}

export default function ListingCard({ listing, priority = false }: { listing: Listing; priority?: boolean }) {
  return (
    <article className="group relative flex w-full flex-col overflow-hidden rounded-3xl bg-white shadow-card ring-1 ring-slate-200/70 transition duration-300 hover:-translate-y-1 hover:shadow-card-hover focus-within:ring-2 focus-within:ring-brand-700">
      <div className="relative aspect-[4/3] overflow-hidden">
        <SmartImage
          photoId={listing.images[0]}
          fallbackPhotoId={listing.images[1]}
          alt={`Toàn cảnh ${listing.name} tại ${listing.city}`}
          width={640}
          height={480}
          widths={[400, 640]}
          sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
        />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/0 to-slate-950/10" />
        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-slate-800 shadow-sm backdrop-blur">
          {listing.type === 'hotel' ? `Khách sạn · ${'★'.repeat(listing.stars)}` : 'Homestay'}
        </span>
        <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-slate-950/70 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur">
          <IconStar className="text-amber-300" />
          {listing.rating.toFixed(1)}
          <span className="sr-only"> trên 5, {ratingWord(listing.rating)}</span>
        </span>
        <p className="absolute bottom-3 left-3 right-3 flex items-center gap-1 text-sm font-medium text-white drop-shadow">
          <IconPin /> {listing.area}, {listing.city}
        </p>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <h3 className="text-lg font-bold leading-snug text-slate-900">
            {/* Link phủ toàn thẻ: cả thẻ bấm được nhưng chỉ là 1 điểm dừng Tab */}
            <Link to={`/item/${listing.id}`} className="outline-none after:absolute after:inset-0 after:content-['']">
              {listing.name}
            </Link>
          </h3>
          <p className="mt-1 text-sm leading-relaxed text-slate-600">{truncateText(listing.description, 84)}</p>
        </div>
        <ul className="flex flex-wrap gap-1.5" aria-label="Tiện nghi nổi bật">
          {listing.amenities.slice(0, 2).map((a) => (
            <li key={a} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
              {a}
            </li>
          ))}
        </ul>
        <div className="mt-auto flex items-end justify-between gap-2 border-t border-dashed border-slate-200 pt-3">
          <div>
            <p className="whitespace-nowrap text-xs text-slate-600">{listing.reviewCount.toLocaleString('vi-VN')} đánh giá</p>
            {listing.freeCancellation && <p className="text-xs font-semibold text-brand-800">✓ Hủy miễn phí</p>}
          </div>
          <p className="text-right">
            <span className="block whitespace-nowrap text-xl font-extrabold tracking-tight text-slate-900">{formatCurrency(listing.pricePerNight)}</span>
            <span className="text-xs text-slate-600">/ đêm</span>
          </p>
        </div>
      </div>
    </article>
  );
}
