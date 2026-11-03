import { useEffect } from 'react';

export function useDocumentTitle(title: string): void {
  useEffect(() => {
    document.title = title ? `${title} · Emerald Stay` : 'Emerald Stay – Đặt phòng khách sạn & homestay';
  }, [title]);
}
