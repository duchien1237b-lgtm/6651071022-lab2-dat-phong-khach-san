import { Link } from 'react-router-dom';
import { listings } from '../../data/listings';
import { IconStar } from '../Icons';
import Reveal from '../Reveal';

// Lấy 3 đánh giá 5 sao tiếng Việt từ 3 chỗ nghỉ được chấm cao nhất
const featured = [...listings]
  .sort((a, b) => b.rating - a.rating)
  .flatMap((l) => l.reviews.filter((r) => r.rating === 5 && !/^[A-Za-z ]+$/.test(r.comment.slice(0, 12)) && !r.comment.includes('hơi')).slice(0, 1).map((r) => ({ ...r, listing: l })))
  .slice(0, 3);

export default function Testimonials() {
  return (
    <section aria-labelledby="reviews-heading" className="relative mt-20 overflow-hidden bg-brand-900 py-16 text-white">
      <div aria-hidden="true" className="bg-dots absolute inset-0" />
      <div aria-hidden="true" className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-emerald-400/20 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-4 tablet:px-6">
        <Reveal className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-emerald-300">Khách hàng nói gì</p>
          <h2 id="reviews-heading" className="mt-1 text-2xl font-bold tracking-tight tablet:text-3xl">
            Hơn 15.000 đánh giá thật từ du khách
          </h2>
        </Reveal>
        <ul className="mt-8 grid gap-5 laptop:grid-cols-3">
          {featured.map((r, i) => (
            <Reveal as="li" key={r.author + r.listing.id} delay={i * 120}>
              <figure className="flex h-full flex-col rounded-3xl bg-white/10 p-6 ring-1 ring-white/15 backdrop-blur transition duration-300 hover:-translate-y-1 hover:bg-white/15">
                <div className="flex gap-0.5 text-amber-300" aria-label="5 trên 5 sao" role="img">
                  {Array.from({ length: 5 }, (_, k) => (
                    <IconStar key={k} />
                  ))}
                </div>
                <blockquote className="mt-4 flex-1 text-lg leading-relaxed text-white">“{r.comment}”</blockquote>
                <figcaption className="mt-6 flex items-center gap-3 border-t border-white/15 pt-4">
                  <span aria-hidden="true" className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-emerald-300 to-teal-500 font-bold text-slate-950">
                    {r.author.charAt(0)}
                  </span>
                  <span>
                    <span className="block font-semibold">{r.author} · {r.from}</span>
                    <Link to={`/item/${r.listing.id}`} className="text-sm text-emerald-200 underline-offset-2 hover:underline">
                      Đã ở {r.listing.name}
                    </Link>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
