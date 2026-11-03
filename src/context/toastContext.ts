import { createContext } from 'react';
import type { ToastKind } from '../types';

export interface ToastOptions {
  kind?: ToastKind;
  title: string;
  message?: string;
  /** Thời gian hiển thị (ms). Mặc định 4000. */
  duration?: number;
}

export interface ToastContextValue {
  notify: (options: ToastOptions) => void;
  dismiss: (id: number) => void;
}

export const ToastContext = createContext<ToastContextValue | null>(null);
