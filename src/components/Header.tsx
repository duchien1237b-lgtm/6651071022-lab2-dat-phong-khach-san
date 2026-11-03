import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useBookings } from '../hooks/useBookings';
import { IconClose, IconMenu } from './Icons';

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2 rounded-lg font-bold text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-700">
      <svg viewBox="0 0 64 64" className="h-9 w-9" aria-hidden="true">
        <defs><linearGradient id="lg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#059669" /><stop offset="1" stopColor="#064e3b" /></linearGradient></defs>
        <rect width="64" height="64" rx="16" fill="url(#lg)" />
        <path d="M16 46V26l16-10 16 10v20H38V34H26v12z" fill="#fff" />
      </svg>
      <span className="text-xl font-extrabold leading-tight tracking-tight">
        Emerald<span className="text-brand-700">Stay</span>
      </span>
    </Link>
  );
}

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-700 ${
    isActive ? 'bg-brand-50 text-brand-800 ring-1 ring-brand-100' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
  }`;

export default function Header() {
  const { bookings } = useBookings();
  const active = bookings.filter((b) => b.status === 'confirmed').length;
  const [open, setOpen] = useState(false);

  const links = (
    <>
      <NavLink to="/" end className={linkClass} onClick={() => setOpen(false)}>
        Khám phá
      </NavLink>
      <NavLink to="/bookings" className={linkClass} onClick={() => setOpen(false)}>
        Đặt phòng của tôi
        {active > 0 && (
          <span className="ml-2 inline-grid min-w-[1.4rem] place-items-center rounded-full bg-brand-700 px-1.5 text-xs font-semibold text-white">
            <span className="sr-only">: </span>
            {active}
          </span>
        )}
      </NavLink>
    </>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/80 backdrop-blur-lg">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-lg focus:bg-brand-700 focus:px-4 focus:py-2 focus:text-white">
        Bỏ qua tới nội dung chính
      </a>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 tablet:px-6">
        <Logo />
        <nav aria-label="Điều hướng chính" className="hidden items-center gap-1 tablet:flex">
          {links}
        </nav>
        <button
          type="button"
          className="grid h-10 w-10 place-items-center rounded-lg text-2xl text-slate-700 hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-700 tablet:hidden"
          aria-label={open ? 'Đóng menu' : 'Mở menu'}
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <IconClose /> : <IconMenu />}
        </button>
      </div>
      {open && (
        <nav id="mobile-nav" aria-label="Điều hướng di động" className="flex flex-col gap-1 border-t border-slate-200 bg-white px-4 py-3 tablet:hidden">
          {links}
        </nav>
      )}
    </header>
  );
}
