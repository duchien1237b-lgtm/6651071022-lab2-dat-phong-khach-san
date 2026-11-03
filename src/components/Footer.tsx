import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '../hooks/useToast';
import { validateEmail } from '../utils';

export default function Footer() {
  const { notify } = useToast();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  function subscribe(e: FormEvent) {
    e.preventDefault();
    if (!validateEmail(email)) {
      setError('Email chưa đúng định dạng, ví dụ: ten@gmail.com');
      notify({ kind: 'error', title: 'Không thể đăng ký', message: 'Vui lòng kiểm tra lại email.' });
      return;
    }
    setError('');
    setEmail('');
    notify({ kind: 'success', title: 'Đăng ký nhận ưu đãi thành công', message: `Ưu đãi sẽ được gửi tới ${email.trim()}.` });
  }

  return (
    <footer className="mt-20 bg-slate-950 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 tablet:px-6">
        {/* Băng đăng ký nhận ưu đãi */}
        <div className="relative -top-10 grid gap-6 overflow-hidden rounded-3xl bg-gradient-to-r from-brand-700 to-brand-900 p-6 text-white shadow-2xl tablet:p-8 laptop:grid-cols-[1.2fr_1fr] laptop:items-center">
          <div aria-hidden="true" className="pointer-events-none absolute -right-10 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
          <div>
            <h2 className="text-xl font-bold tablet:text-2xl">Nhận ưu đãi độc quyền mỗi tuần</h2>
            <p className="mt-1 text-brand-50">Giảm đến 25% cho thành viên, không spam, hủy đăng ký bất cứ lúc nào.</p>
          </div>
          <form onSubmit={subscribe} noValidate className="relative">
            <label htmlFor="newsletter" className="sr-only">
              Email nhận ưu đãi
            </label>
            <div className="flex flex-col gap-2 tablet:flex-row">
              <input
                id="newsletter"
                type="email"
                autoComplete="email"
                placeholder="Email của bạn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? 'newsletter-error' : undefined}
                className="min-w-0 flex-1 rounded-xl border-0 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-4 focus:ring-emerald-300"
              />
              <button
                type="submit"
                className="rounded-xl bg-slate-950 px-5 py-3 font-semibold text-white hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Đăng ký
              </button>
            </div>
            {error && (
              <p id="newsletter-error" className="mt-2 text-sm font-medium text-white">
                ⚠ {error}
              </p>
            )}
          </form>
        </div>

        <div className="grid gap-8 pb-10 text-sm tablet:grid-cols-2 laptop:grid-cols-4">
          <div>
            <p className="text-lg font-bold text-white">
              Emerald<span className="text-emerald-400">Stay</span>
            </p>
            <p className="mt-2 leading-relaxed">Đặt phòng khách sạn & homestay khắp Việt Nam, giá minh bạch, xác nhận tức thì.</p>
          </div>
          <div>
            <h2 className="font-semibold text-white">Khám phá</h2>
            <ul className="mt-3 space-y-2">
              <li><Link className="hover:text-white hover:underline" to="/?type=hotel">Khách sạn</Link></li>
              <li><Link className="hover:text-white hover:underline" to="/?type=homestay">Homestay</Link></li>
              <li><Link className="hover:text-white hover:underline" to="/bookings">Đặt phòng của tôi</Link></li>
            </ul>
          </div>
          <div>
            <h2 className="font-semibold text-white">Hỗ trợ</h2>
            <ul className="mt-3 space-y-2">
              <li>Hotline: 1900 6651</li>
              <li>Email: hotro@emeraldstay.vn</li>
              <li>Hỗ trợ 24/7, kể cả ngày lễ</li>
            </ul>
          </div>
          <div>
            <h2 className="font-semibold text-white">Về đồ án</h2>
            <p className="mt-3">Lab 2 – Thiết kế Web</p>
            <p>Nguyễn Đức Hiền · MSSV 6651071022</p>
          </div>
        </div>
        <p className="border-t border-slate-800 py-6 text-xs text-slate-400">
          © 2026 Emerald Stay. Ảnh minh họa từ Unsplash. Tên chỗ nghỉ là hư cấu phục vụ bài tập.
        </p>
      </div>
    </footer>
  );
}
