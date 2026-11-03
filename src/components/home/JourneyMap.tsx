import { listings } from '../../data/listings';

/** Tọa độ thật (vĩ độ, kinh độ) để vẽ bản đồ minh họa đúng hình chữ S. */
const COORDS: Record<string, { lat: number; lon: number; side: 'left' | 'right' }> = {
  'Sa Pa': { lat: 22.34, lon: 103.84, side: 'right' },
  'Hà Nội': { lat: 21.03, lon: 105.85, side: 'left' },
  'Hạ Long': { lat: 20.95, lon: 107.08, side: 'right' },
  'Ninh Bình': { lat: 20.25, lon: 105.97, side: 'left' },
  Huế: { lat: 16.46, lon: 107.59, side: 'left' },
  'Đà Nẵng': { lat: 16.05, lon: 108.2, side: 'right' },
  'Hội An': { lat: 15.88, lon: 108.33, side: 'left' },
  'Quy Nhơn': { lat: 13.77, lon: 109.22, side: 'right' },
  'Nha Trang': { lat: 12.24, lon: 109.19, side: 'right' },
  'Đà Lạt': { lat: 11.94, lon: 108.44, side: 'left' },
  'Phan Thiết': { lat: 10.93, lon: 108.1, side: 'right' },
  'TP. Hồ Chí Minh': { lat: 10.78, lon: 106.66, side: 'left' },
  'Vũng Tàu': { lat: 10.35, lon: 107.08, side: 'right' },
  'Phú Quốc': { lat: 10.22, lon: 103.96, side: 'left' },
};

const K = 40;
const toXY = (lat: number, lon: number) => ({ x: (lon - 102) * K + 20, y: (23.4 - lat) * K + 20 });

interface Props {
  activeCity: string;
  onPick: (city: string) => void;
}

export default function JourneyMap({ activeCity, onPick }: Props) {
  const points = Object.entries(COORDS)
    .map(([city, c]) => ({ city, ...c, ...toXY(c.lat, c.lon), count: listings.filter((l) => l.city === city).length }))
    .filter((p) => p.count > 0)
    .sort((a, b) => b.lat - a.lat);
  const route = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');

  return (
    <div className="mx-auto w-full max-w-[240px] tablet:max-w-[280px] laptop:max-w-sm">
      <div className="relative">
      <svg viewBox="0 0 380 560" className="h-auto w-full" role="img" aria-labelledby="map-title">
        <title id="map-title">Bản đồ minh họa vị trí 14 điểm đến từ Bắc vào Nam</title>
        <defs>
          <linearGradient id="route" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#6ee7b7" />
            <stop offset="1" stopColor="#059669" />
          </linearGradient>
          <radialGradient id="glow">
            <stop offset="0" stopColor="#10b981" stopOpacity="0.35" />
            <stop offset="1" stopColor="#10b981" stopOpacity="0" />
          </radialGradient>
        </defs>
        <ellipse cx="150" cy="140" rx="130" ry="110" fill="url(#glow)" />
        <ellipse cx="240" cy="330" rx="90" ry="150" fill="url(#glow)" />
        <ellipse cx="190" cy="500" rx="140" ry="70" fill="url(#glow)" />
        <path d={route} fill="none" stroke="url(#route)" strokeWidth="3" strokeDasharray="2 8" strokeLinecap="round" />
      </svg>
      <ul className="absolute inset-0">
        {points.map((p) => {
          const active = activeCity === p.city;
          return (
            <li
              key={p.city}
              className="absolute"
              style={{ left: `${(p.x / 380) * 100}%`, top: `${(p.y / 560) * 100}%` }}
            >
              <button
                type="button"
                onClick={() => onPick(p.city)}
                aria-pressed={active}
                aria-label={`${p.city}: ${p.count} chỗ nghỉ`}
                className={`group absolute flex -translate-y-1/2 items-center gap-2 whitespace-nowrap rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                  p.side === 'left' ? 'right-0 translate-x-[9px] flex-row-reverse' : 'left-0 -translate-x-[9px]'
                }`}
              >
                <span className="relative grid h-[18px] w-[18px] place-items-center">
                  <span className={`absolute inset-0 rounded-full bg-emerald-400 ${active ? 'animate-ping-slow' : ''}`} aria-hidden="true" />
                  <span className={`relative h-[18px] w-[18px] rounded-full border-[3px] border-white shadow ${active ? 'bg-amber-400' : 'bg-brand-600 group-hover:bg-emerald-400'}`} />
                </span>
                <span
                  className={`hidden rounded-full px-2.5 py-1 text-xs font-semibold shadow-lg transition tablet:inline ${
                    active ? 'bg-amber-400 text-slate-950' : 'bg-white/95 text-slate-900 group-hover:bg-emerald-100'
                  }`}
                >
                  {p.city}
                  <span className="ml-1 font-normal text-slate-600">· {p.count}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      </div>
      {/* Mobile: nhãn trên bản đồ quá dày nên hiện danh sách chip bên dưới */}
      <ul className="mt-6 flex flex-wrap justify-center gap-2 tablet:hidden" aria-label="Chọn điểm đến">
        {points.map((p) => (
          <li key={p.city}>
            <button
              type="button"
              onClick={() => onPick(p.city)}
              aria-pressed={activeCity === p.city}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                activeCity === p.city ? 'bg-amber-400 text-slate-950' : 'bg-white/10 text-white ring-1 ring-white/20'
              }`}
            >
              {p.city} · {p.count}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
