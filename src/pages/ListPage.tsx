import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { cities, listings } from '../data/listings';
import ListingCard from '../components/ListingCard';
import { IconBuilding, IconCalendar, IconCheck, IconFilter, IconHome, IconSearch, IconShield, IconStar, IconUsers } from '../components/Icons';
import Reveal from '../components/Reveal';
import Offers from '../components/home/Offers';
import Testimonials from '../components/home/Testimonials';
import JourneyMap from '../components/home/JourneyMap';
import SmartImage from '../components/SmartImage';
import { destinations, stats } from '../data/destinations';
import { debounce, formatCurrency } from '../utils';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import type { Listing } from '../types';

type SortKey = 'popular' | 'price-asc' | 'price-desc' | 'rating';
type TypeFilter = 'all' | 'hotel' | 'homestay';

const SORTS: { value: SortKey; label: string }[] = [
  { value: 'popular', label: 'Phổ biến nhất' },
  { value: 'rating', label: 'Đánh giá cao nhất' },
  { value: 'price-asc', label: 'Giá thấp đến cao' },
  { value: 'price-desc', label: 'Giá cao đến thấp' },
];

// 3 chỗ nghỉ điểm cao nhất dùng cho ảnh ghép ở hero
const collage = [...listings].sort((a, b) => b.rating - a.rating).slice(0, 3);

const PRICE_STEPS = [0, 600000, 1000000, 1500000, 2000000];

/** Bỏ dấu tiếng Việt để tìm kiếm "da lat" vẫn ra "Đà Lạt". */
function normalize(s: string): string {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase();
}

function filterListings(q: string, city: string, type: TypeFilter, maxPrice: number, sort: SortKey): Listing[] {
  const query = normalize(q.trim());
  const result = listings.filter((l) => {
    if (city && l.city !== city) return false;
    if (type !== 'all' && l.type !== type) return false;
    if (maxPrice > 0 && l.pricePerNight > maxPrice) return false;
    if (!query) return true;
    return normalize(`${l.name} ${l.city} ${l.area} ${l.tags.join(' ')}`).includes(query);
  });
  const sorted = [...result];
  switch (sort) {
    case 'price-asc':
      sorted.sort((a, b) => a.pricePerNight - b.pricePerNight);
      break;
    case 'price-desc':
      sorted.sort((a, b) => b.pricePerNight - a.pricePerNight);
      break;
    case 'rating':
      sorted.sort((a, b) => b.rating - a.rating);
      break;
    default:
      sorted.sort((a, b) => b.reviewCount - a.reviewCount);
  }
  return sorted;
}

export default function ListPage() {
  useDocumentTitle('');
  const [params, setParams] = useSearchParams();
  const q = params.get('q') ?? '';
  const city = params.get('city') ?? '';
  const typeParam = params.get('type');
  const type: TypeFilter = typeParam === 'hotel' || typeParam === 'homestay' ? typeParam : 'all';
  const maxPrice = Number(params.get('max') ?? 0) || 0;
  const sortParam = params.get('sort') as SortKey | null;
  const sort: SortKey = SORTS.some((s) => s.value === sortParam) ? (sortParam as SortKey) : 'popular';

  // Ô tìm kiếm cập nhật tức thì, còn URL/kết quả cập nhật sau 300ms (debounce)
  const [text, setText] = useState(q);
  useEffect(() => setText(q), [q]);

  const updateParam = useMemo(
    () => (key: string, value: string) => {
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (value) next.set(key, value);
          else next.delete(key);
          return next;
        },
        { replace: true },
      );
    },
    [setParams],
  );

  const resultsRef = useRef<HTMLElement>(null);
  function pickCity(c: string) {
    updateParam('city', city === c ? '' : c);
    resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  const debouncedSearch = useMemo(() => debounce((value: string) => updateParam('q', value), 300), [updateParam]);

  const results = useMemo(() => filterListings(q, city, type, maxPrice, sort), [q, city, type, maxPrice, sort]);
  const hasFilter = Boolean(q || city || type !== 'all' || maxPrice || sort !== 'popular');

  return (
    <>
      {/* Hero chia đôi: nội dung bên trái, ảnh ghép bên phải */}
      <section className="relative isolate overflow-hidden bg-gradient-to-br from-brand-900 via-brand-800 to-slate-900 text-white">
        <div aria-hidden="true" className="bg-dots absolute inset-0 -z-10" />
        <div aria-hidden="true" className="pointer-events-none absolute -right-32 -top-32 -z-10 h-[28rem] w-[28rem] rounded-full bg-emerald-400/25 blur-3xl" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-40 left-1/4 -z-10 h-80 w-80 rounded-full bg-teal-300/20 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 pb-32 pt-14 tablet:px-6 laptop:grid-cols-[1.1fr_1fr] laptop:pb-40 laptop:pt-20">
          <div>
            <p className="inline-flex animate-rise items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-brand-50 ring-1 ring-white/20 backdrop-blur">
              <span className="relative flex h-2 w-2" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full animate-ping-slow rounded-full bg-emerald-300" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-300" />
              </span>
              Ưu đãi mùa thu · giảm đến 25%
            </p>
            <h1 className="mt-5 max-w-3xl animate-rise text-[2rem] font-extrabold leading-[1.15] tracking-tight [animation-delay:80ms] tablet:text-5xl laptop:text-[3.5rem]">
              Kỳ nghỉ trọn vẹn,{' '}
              <span className="bg-gradient-to-r from-emerald-200 via-teal-100 to-amber-100 bg-clip-text text-transparent">bắt đầu từ chỗ ở</span> ưng ý
            </h1>
            <p className="mt-5 max-w-xl animate-rise text-base leading-relaxed text-brand-50 [animation-delay:160ms] tablet:text-lg">
              Từ resort 5 sao bên biển đến homestay giữa ruộng bậc thang. So sánh giá minh bạch, đặt phòng trong 3 bước, xác nhận ngay.
            </p>
            <dl className="mt-10 grid max-w-2xl animate-rise grid-cols-2 gap-3 [animation-delay:240ms] tablet:grid-cols-4">
              {[
                { k: 'Chỗ nghỉ', v: `${stats.listings}+` },
                { k: 'Thành phố', v: String(stats.cities) },
                { k: 'Điểm trung bình', v: `${stats.avgRating.toFixed(1)}★` },
                { k: 'Lượt đánh giá', v: `${Math.round(stats.reviews / 1000)}K+` },
              ].map((x) => (
                <div key={x.k} className="rounded-2xl bg-white/10 px-4 py-3 ring-1 ring-white/15 backdrop-blur transition hover:bg-white/15">
                  <dt className="text-xs text-brand-50">{x.k}</dt>
                  <dd className="text-2xl font-bold">{x.v}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Ảnh ghép: chỉ hiện từ laptop để mobile tải nhẹ */}
          <div className="relative hidden h-[460px] laptop:block" aria-hidden="true">
            <div className="absolute right-0 top-0 h-[300px] w-[62%] overflow-hidden rounded-[2rem] shadow-2xl ring-4 ring-white/10">
              <SmartImage photoId={collage[0].images[0]} fallbackPhotoId={collage[0].images[1]} alt="" width={640} height={480} widths={[480, 640]} sizes="380px" loading="lazy" className="h-full w-full object-cover" />
            </div>
            <div className="absolute bottom-0 left-0 h-[260px] w-[52%] overflow-hidden rounded-[2rem] shadow-2xl ring-4 ring-white/10">
              <SmartImage photoId={collage[1].images[0]} fallbackPhotoId={collage[1].images[1]} alt="" width={640} height={480} widths={[480, 640]} sizes="320px" loading="lazy" className="h-full w-full object-cover" />
            </div>
            <div className="absolute bottom-6 right-6 h-[150px] w-[36%] overflow-hidden rounded-3xl shadow-2xl ring-4 ring-white/10">
              <SmartImage photoId={collage[2].images[0]} fallbackPhotoId={collage[2].images[1]} alt="" width={400} height={300} widths={[400]} sizes="220px" loading="lazy" className="h-full w-full object-cover" />
            </div>
            <div className="absolute left-6 top-10 animate-float rounded-2xl bg-white p-3 pr-5 text-slate-900 shadow-2xl">
              <p className="flex items-center gap-1 text-sm font-bold"><IconStar className="text-amber-400" /> {collage[0].rating.toFixed(1)} · Tuyệt hảo</p>
              <p className="text-xs text-slate-600">{collage[0].name}</p>
            </div>
            <div className="absolute bottom-48 right-2 animate-float rounded-2xl bg-white/95 p-3 text-slate-900 shadow-2xl [animation-delay:1.5s]">
              <p className="flex items-center gap-2 text-sm font-bold">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-brand-100 text-brand-800"><IconCheck /></span>
                Vừa đặt phòng thành công
              </p>
              <p className="pl-9 text-xs text-slate-600">Khách từ Hà Nội · 2 phút trước</p>
            </div>
          </div>
        </div>
      </section>

      {/* Thanh tìm kiếm + bộ lọc */}
      <div className="relative z-10 mx-auto -mt-16 max-w-7xl px-4 tablet:px-6">
        <form
          role="search"
          aria-label="Tìm kiếm chỗ nghỉ"
          onSubmit={(e) => {
            e.preventDefault();
            updateParam('q', text.trim());
          }}
          className="grid gap-3 rounded-3xl bg-white p-4 shadow-2xl shadow-brand-900/10 ring-1 ring-slate-200 tablet:grid-cols-2 tablet:p-5 laptop:grid-cols-[2fr_1fr_1fr_auto]"
        >
          <div className="relative tablet:col-span-2 laptop:col-span-1">
            <label htmlFor="q" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
              Điểm đến hoặc tên chỗ nghỉ
            </label>
            <IconSearch className="pointer-events-none absolute bottom-3.5 left-3.5 text-slate-500" />
            <input
              id="q"
              type="search"
              value={text}
              placeholder="Ví dụ: Đà Lạt, biển, phố cổ..."
              onChange={(e) => {
                setText(e.target.value);
                debouncedSearch(e.target.value.trim());
              }}
              className="w-full rounded-xl border border-slate-300 py-3 pl-10 pr-3 text-slate-900 placeholder:text-slate-500 focus:border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-100"
            />
          </div>
          <div>
            <label htmlFor="city" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
              Thành phố
            </label>
            <select
              id="city"
              value={city}
              onChange={(e) => updateParam('city', e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-slate-900 focus:border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-100"
            >
              <option value="">Tất cả thành phố</option>
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="max" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
              Giá tối đa / đêm
            </label>
            <select
              id="max"
              value={String(maxPrice)}
              onChange={(e) => updateParam('max', e.target.value === '0' ? '' : e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-slate-900 focus:border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-100"
            >
              {PRICE_STEPS.map((p) => (
                <option key={p} value={p}>
                  {p === 0 ? 'Không giới hạn' : `Dưới ${formatCurrency(p)}`}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              className="btn-shine flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-700 to-brand-800 px-7 py-3 font-semibold text-white shadow hover:bg-brand-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700"
            >
              <IconSearch /> Tìm kiếm
            </button>
          </div>
        </form>
      </div>

      {/* Điểm đến nổi bật */}
      <section aria-labelledby="dest-heading" className="mx-auto mt-14 max-w-7xl px-4 tablet:px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-brand-800">Cảm hứng du lịch</p>
            <h2 id="dest-heading" className="mt-1 text-2xl font-bold tracking-tight text-slate-900 tablet:text-3xl">
              Điểm đến được yêu thích
            </h2>
          </div>
        </div>
        <ul className="mt-6 grid grid-cols-2 gap-4 tablet:grid-cols-3 desktop:grid-cols-6">
          {destinations.map((d, i) => (
            <Reveal as="li" key={d.city} delay={i * 80}>
              <button
                type="button"
                onClick={() => pickCity(d.city)}
                aria-pressed={city === d.city}
                className={`group relative block aspect-[3/4] w-full overflow-hidden rounded-3xl text-left shadow-card focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-brand-700 ${
                  city === d.city ? 'ring-4 ring-brand-600' : ''
                }`}
              >
                <SmartImage
                  photoId={d.photoId}
                  fallbackPhotoId={d.fallbackPhotoId}
                  alt=""
                  width={400}
                  height={533}
                  widths={[300, 400, 600]}
                  sizes="(min-width: 1280px) 16vw, (min-width: 640px) 33vw, 50vw"
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-110"
                />
                <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />
                <span className="absolute inset-x-0 bottom-0 p-4 text-white">
                  <span className="block text-lg font-bold">{d.city}</span>
                  <span className="block text-sm text-slate-100">{d.tagline}</span>
                  <span className="mt-2 inline-block rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-semibold backdrop-blur">
                    {d.count} chỗ nghỉ
                  </span>
                </span>
              </button>
            </Reveal>
          ))}
        </ul>
      </section>

      <section ref={resultsRef} aria-labelledby="results-heading" className="mx-auto mt-16 max-w-7xl scroll-mt-24 px-4 tablet:px-6">
        <div className="flex flex-col gap-4 laptop:flex-row laptop:items-center laptop:justify-between">
          <div>
            <h2 id="results-heading" className="text-2xl font-bold tracking-tight text-slate-900 tablet:text-3xl">
              {city ? `Chỗ nghỉ tại ${city}` : 'Chỗ nghỉ nổi bật'}
            </h2>
            <p className="mt-1 text-sm text-slate-600" aria-live="polite">
              Tìm thấy <strong className="text-slate-900">{results.length}</strong> chỗ nghỉ
              {q && (
                <>
                  {' '}cho “<strong className="text-slate-900">{q}</strong>”
                </>
              )}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <fieldset className="flex rounded-xl bg-slate-100 p-1">
              <legend className="sr-only">Loại chỗ nghỉ</legend>
              {(
                [
                  { v: 'all', label: 'Tất cả', icon: <IconFilter /> },
                  { v: 'hotel', label: 'Khách sạn', icon: <IconBuilding /> },
                  { v: 'homestay', label: 'Homestay', icon: <IconHome /> },
                ] as const
              ).map((o) => (
                <label
                  key={o.v}
                  className={`flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-brand-700 ${
                    type === o.v ? 'bg-white text-brand-800 shadow' : 'text-slate-700 hover:text-slate-900'
                  }`}
                >
                  <input
                    type="radio"
                    name="type"
                    value={o.v}
                    checked={type === o.v}
                    onChange={() => updateParam('type', o.v === 'all' ? '' : o.v)}
                    className="sr-only"
                  />
                  {o.icon}
                  {o.label}
                </label>
              ))}
            </fieldset>
            <label htmlFor="sort" className="sr-only">
              Sắp xếp theo
            </label>
            <select
              id="sort"
              value={sort}
              onChange={(e) => updateParam('sort', e.target.value === 'popular' ? '' : e.target.value)}
              className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-100"
            >
              {SORTS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
            {hasFilter && (
              <button
                type="button"
                onClick={() => {
                  setText('');
                  setParams({}, { replace: true });
                }}
                className="rounded-xl px-3 py-2 text-sm font-semibold text-brand-800 underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-700"
              >
                Xóa bộ lọc
              </button>
            )}
          </div>
        </div>

        {results.length > 0 ? (
          <ul className="mt-6 grid grid-cols-1 gap-6 tablet:grid-cols-2 laptop:grid-cols-3 desktop:grid-cols-4">
            {results.map((l, i) => (
              <Reveal as="li" key={l.id} delay={(i % 4) * 80} className="flex">
                <ListingCard listing={l} priority={i < 2} />
              </Reveal>
            ))}
          </ul>
        ) : (
          <div className="mt-6 rounded-2xl border-2 border-dashed border-slate-300 bg-white p-10 text-center">
            <p className="text-lg font-semibold text-slate-900">Không tìm thấy chỗ nghỉ phù hợp</p>
            <p className="mt-1 text-slate-600">Hãy thử từ khóa khác hoặc nới rộng khoảng giá.</p>
          </div>
        )}
      </section>
      <Offers />

      {/* Bản đồ hành trình */}
      <section aria-labelledby="map-heading" className="mx-auto mt-20 max-w-7xl px-4 tablet:px-6">
        <div className="relative grid items-center gap-10 overflow-hidden rounded-[2rem] bg-slate-950 p-6 text-white tablet:p-10 laptop:grid-cols-[1fr_1.1fr]">
          <div aria-hidden="true" className="bg-dots absolute inset-0" />
          <Reveal className="relative">
            <p className="text-sm font-semibold uppercase tracking-wider text-emerald-300">Hành trình xuyên Việt</p>
            <h2 id="map-heading" className="mt-1 text-2xl font-bold tracking-tight tablet:text-3xl">
              Chọn điểm dừng chân trên dải đất hình chữ S
            </h2>
            <p className="mt-3 max-w-md leading-relaxed text-slate-300">
              Bấm vào một điểm trên bản đồ để xem các khách sạn và homestay tại đó. Từ núi rừng Sa Pa đến đảo ngọc Phú Quốc, đều có chỗ nghỉ ưng ý chờ bạn.
            </p>
            {city && (
              <button
                type="button"
                onClick={() => pickCity(city)}
                className="mt-5 rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold ring-1 ring-white/20 hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
              >
                Bỏ chọn {city}
              </button>
            )}
          </Reveal>
          <Reveal delay={150} className="relative">
            <JourneyMap activeCity={city} onPick={pickCity} />
          </Reveal>
        </div>
      </section>

      {/* Vì sao chọn */}
      <section aria-labelledby="why-heading" className="mx-auto mt-20 max-w-7xl px-4 tablet:px-6">
        <div className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-50 via-white to-emerald-50 p-6 ring-1 ring-brand-100 tablet:p-10">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand-800">Vì sao chọn Emerald Stay</p>
          <h2 id="why-heading" className="mt-1 max-w-xl text-2xl font-bold tracking-tight text-slate-900 tablet:text-3xl">
            Đặt phòng an tâm, nghỉ dưỡng trọn vẹn
          </h2>
          <ul className="mt-8 grid gap-6 tablet:grid-cols-2 laptop:grid-cols-4">
            {([
              { icon: <IconShield />, t: 'Giá minh bạch', d: 'Giá hiển thị đã gồm thuế, phí dịch vụ ghi rõ trước khi xác nhận.' },
              { icon: <IconCheck />, t: 'Xác nhận tức thì', d: 'Nhận mã đặt phòng ngay sau 3 bước, không cần chờ chủ nhà duyệt.' },
              { icon: <IconCalendar />, t: 'Hủy linh hoạt', d: 'Nhiều chỗ nghỉ cho hủy miễn phí trước 48 giờ nhận phòng.' },
              { icon: <IconUsers />, t: 'Hỗ trợ 24/7', d: 'Đội ngũ người Việt luôn sẵn sàng qua hotline 1900 6651.' },
            ]).map((f, i) => (
              <Reveal as="li" key={f.t} delay={i * 100} className="group rounded-2xl bg-white/80 p-5 shadow-card ring-1 ring-slate-200/60 backdrop-blur transition hover:-translate-y-1 hover:shadow-card-hover">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-700 text-xl text-white shadow-lg shadow-brand-700/30 transition duration-300 group-hover:rotate-6 group-hover:scale-110">{f.icon}</span>
                <h3 className="mt-4 font-bold text-slate-900">{f.t}</h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">{f.d}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <Testimonials />
    </>
  );
}
