import { useToast } from '../../hooks/useToast';
import Reveal from '../Reveal';

const OFFERS = [
  {
    code: 'MUATHU25',
    title: 'Giảm 25% kỳ nghỉ mùa thu',
    desc: 'Áp dụng cho đặt phòng từ 2 đêm tại Đà Lạt, Sa Pa và Hạ Long.',
    tone: 'from-brand-700 via-brand-800 to-brand-900',
    badge: 'Hot',
  },
  {
    code: 'BIENXANH',
    title: 'Ở 3 đêm, tặng 1 đêm',
    desc: 'Resort biển Đà Nẵng, Nha Trang, Phú Quốc. Số lượng có hạn.',
    tone: 'from-sky-700 via-sky-800 to-slate-900',
    badge: 'Mới',
  },
  {
    code: 'HOMESTAY15',
    title: 'Homestay giảm 15%',
    desc: 'Trải nghiệm sống như người bản địa, áp dụng mọi homestay.',
    tone: 'from-amber-700 via-orange-800 to-rose-900',
    badge: 'Độc quyền',
  },
];

export default function Offers() {
  const { notify } = useToast();

  async function copy(code: string) {
    try {
      await navigator.clipboard.writeText(code);
      notify({ kind: 'success', title: `Đã sao chép mã ${code}`, message: 'Dán mã vào ô “Yêu cầu đặc biệt” khi đặt phòng để được áp dụng.' });
    } catch {
      notify({ kind: 'info', title: `Mã ưu đãi: ${code}`, message: 'Hãy ghi mã vào ô “Yêu cầu đặc biệt” khi đặt phòng.' });
    }
  }

  return (
    <section aria-labelledby="offers-heading" className="mx-auto mt-20 max-w-7xl px-4 tablet:px-6">
      <Reveal>
        <p className="text-sm font-semibold uppercase tracking-wider text-brand-800">Ưu đãi giới hạn</p>
        <h2 id="offers-heading" className="mt-1 text-2xl font-bold tracking-tight text-slate-900 tablet:text-3xl">
          Săn deal hời cho chuyến đi sắp tới
        </h2>
      </Reveal>
      <ul className="mt-6 grid gap-5 tablet:grid-cols-2 laptop:grid-cols-3">
        {OFFERS.map((o, i) => (
          <Reveal as="li" key={o.code} delay={i * 120}>
            <article className={`group relative h-full overflow-hidden rounded-3xl bg-gradient-to-br ${o.tone} p-6 text-white shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-2xl`}>
              <div aria-hidden="true" className="bg-dots absolute inset-0 opacity-60" />
              <div aria-hidden="true" className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/10 transition duration-500 group-hover:scale-125" />
              <div className="relative">
                <span className="inline-block rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider backdrop-blur">{o.badge}</span>
                <h3 className="mt-4 text-xl font-bold">{o.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/90">{o.desc}</p>
                <div className="mt-6 flex items-center justify-between gap-3 rounded-2xl border-2 border-dashed border-white/40 bg-black/10 p-2 pl-4">
                  <span className="font-mono text-lg font-bold tracking-widest">{o.code}</span>
                  <button
                    type="button"
                    onClick={() => copy(o.code)}
                    className="btn-shine rounded-xl bg-white px-4 py-2 text-sm font-bold text-slate-900 hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    aria-label={`Sao chép mã ưu đãi ${o.code}`}
                  >
                    Sao chép
                  </button>
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
