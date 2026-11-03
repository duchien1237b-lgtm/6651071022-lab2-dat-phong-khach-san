import { useCallback, useMemo, useReducer, useRef, type ReactNode } from 'react';
import { ToastContext, type ToastOptions } from './toastContext';
import type { Toast } from '../types';
import Toaster from '../components/Toaster';

const MAX_TOASTS = 4;

type Action = { type: 'add'; toast: Toast } | { type: 'remove'; id: number };

function reducer(state: Toast[], action: Action): Toast[] {
  switch (action.type) {
    case 'add':
      // Toast mới nhất nằm cuối; giữ tối đa MAX_TOASTS cái
      return [...state, action.toast].slice(-MAX_TOASTS);
    case 'remove':
      return state.filter((t) => t.id !== action.id);
    default:
      return state;
  }
}

export default function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, dispatch] = useReducer(reducer, []);
  const nextId = useRef(1);

  const dismiss = useCallback((id: number) => dispatch({ type: 'remove', id }), []);

  const notify = useCallback((options: ToastOptions) => {
    const toast: Toast = {
      id: nextId.current++,
      kind: options.kind ?? 'info',
      title: options.title,
      message: options.message,
      duration: options.duration ?? 4000,
    };
    dispatch({ type: 'add', toast });
  }, []);

  const value = useMemo(() => ({ notify, dismiss }), [notify, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Toaster toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}
