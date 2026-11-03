import { useEffect, useId, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { IconClose } from './Icons';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  /** Ẩn tiêu đề khỏi giao diện nhưng vẫn đọc được bằng trình đọc màn hình */
  hideTitle?: boolean;
  size?: 'sm' | 'lg' | 'xl';
  children: ReactNode;
  footer?: ReactNode;
  tone?: 'light' | 'dark';
}

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Hộp thoại có: đóng bằng phím Esc, bẫy focus (Tab/Shift+Tab xoay vòng bên trong),
 * khóa cuộn trang nền và trả focus về phần tử đã mở modal khi đóng.
 */
export default function Modal({ open, onClose, title, hideTitle, size = 'sm', children, footer, tone = 'light' }: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const dialog = dialogRef.current;
    const first = dialog?.querySelector<HTMLElement>(FOCUSABLE);
    (first ?? dialog)?.focus();

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault();
        onCloseRef.current();
        return;
      }
      if (e.key !== 'Tab' || !dialog) return;
      const items = Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (items.length === 0) {
        e.preventDefault();
        return;
      }
      const firstEl = items[0];
      const lastEl = items[items.length - 1];
      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    }

    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = originalOverflow;
      previouslyFocused?.focus();
    };
  }, [open]);

  if (!open) return null;

  const width = size === 'xl' ? 'max-w-5xl' : size === 'lg' ? 'max-w-2xl' : 'max-w-md';
  const dark = tone === 'dark';

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className={`absolute inset-0 ${dark ? 'bg-black/90' : 'bg-slate-900/60'}`} onClick={onClose} aria-hidden="true" />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={`relative w-full ${width} max-h-[90vh] overflow-auto rounded-2xl shadow-2xl outline-none ${dark ? 'bg-transparent text-white' : 'bg-white'}`}
      >
        <div className={`flex items-center justify-between gap-4 ${dark ? 'pb-3' : 'border-b border-slate-200 px-5 py-4'}`}>
          <h2 id={titleId} className={hideTitle ? 'sr-only' : 'text-lg font-semibold'}>
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng hộp thoại"
            className={`ml-auto grid h-10 w-10 place-items-center rounded-full text-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
              dark ? 'bg-white/10 text-white hover:bg-white/20 focus-visible:outline-white' : 'text-slate-600 hover:bg-slate-100 focus-visible:outline-brand-700'
            }`}
          >
            <IconClose />
          </button>
        </div>
        <div className={dark ? '' : 'px-5 py-4'}>{children}</div>
        {footer && <div className="flex flex-wrap justify-end gap-3 border-t border-slate-200 px-5 py-4">{footer}</div>}
      </div>
    </div>,
    document.body,
  );
}
