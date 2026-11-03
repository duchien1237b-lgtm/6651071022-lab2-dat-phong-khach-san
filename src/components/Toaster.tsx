import { useEffect, useRef, useState } from 'react';
import type { Toast, ToastKind } from '../types';
import { IconAlert, IconCheck, IconClose, IconInfo } from './Icons';

const STYLES: Record<ToastKind, { ring: string; icon: string; bar: string; label: string }> = {
  success: { ring: 'border-brand-600', icon: 'bg-brand-100 text-brand-800', bar: 'bg-brand-600', label: 'Thành công' },
  error: { ring: 'border-red-600', icon: 'bg-red-100 text-red-800', bar: 'bg-red-600', label: 'Lỗi' },
  warning: { ring: 'border-amber-500', icon: 'bg-amber-100 text-amber-900', bar: 'bg-amber-500', label: 'Cảnh báo' },
  info: { ring: 'border-sky-600', icon: 'bg-sky-100 text-sky-900', bar: 'bg-sky-600', label: 'Thông báo' },
};

function ToastIcon({ kind }: { kind: ToastKind }) {
  if (kind === 'success') return <IconCheck />;
  if (kind === 'info') return <IconInfo />;
  return <IconAlert />;
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: number) => void }) {
  const [paused, setPaused] = useState(false);
  const remaining = useRef(toast.duration);
  const startedAt = useRef(0);

  // Tự đóng sau `duration`; tạm dừng khi rê chuột / focus vào toast
  useEffect(() => {
    if (paused) return;
    startedAt.current = Date.now();
    const timer = setTimeout(() => onDismiss(toast.id), remaining.current);
    return () => {
      clearTimeout(timer);
      remaining.current -= Date.now() - startedAt.current;
    };
  }, [paused, toast.id, onDismiss]);

  const s = STYLES[toast.kind];
  return (
    <li
      className={`pointer-events-auto relative w-full overflow-hidden rounded-xl border-l-4 bg-white shadow-lg ring-1 ring-slate-900/5 animate-toast-in ${s.ring}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      role={toast.kind === 'error' ? 'alert' : 'status'}
    >
      <div className="flex items-start gap-3 p-4 pr-10">
        <span className={`mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full text-base ${s.icon}`}>
          <ToastIcon kind={toast.kind} />
        </span>
        <div className="min-w-0">
          <p className="font-semibold text-slate-900">
            <span className="sr-only">{s.label}: </span>
            {toast.title}
          </p>
          {toast.message && <p className="mt-0.5 text-sm text-slate-600">{toast.message}</p>}
        </div>
      </div>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-700"
        aria-label="Đóng thông báo"
      >
        <IconClose />
      </button>
      <span
        aria-hidden="true"
        className={`absolute bottom-0 left-0 h-1 w-full origin-left animate-toast-progress ${s.bar}`}
        style={{ animationDuration: `${toast.duration}ms`, animationPlayState: paused ? 'paused' : 'running' }}
      />
    </li>
  );
}

export default function Toaster({ toasts, onDismiss }: { toasts: Toast[]; onDismiss: (id: number) => void }) {
  return (
    <section aria-label="Thông báo" aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-0 z-[60] flex justify-center p-4 tablet:inset-x-auto tablet:right-0 tablet:justify-end">
      <ol className="flex w-full max-w-sm flex-col gap-3">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={onDismiss} />
        ))}
      </ol>
    </section>
  );
}
