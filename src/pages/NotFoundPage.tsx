import { Link } from 'react-router-dom';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export default function NotFoundPage({ message = 'Trang bạn tìm không tồn tại.' }: { message?: string }) {
  useDocumentTitle('Không tìm thấy trang');
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center">
      <p className="text-6xl font-black text-brand-700">404</p>
      <h1 className="mt-4 text-2xl font-bold text-slate-900">Không tìm thấy</h1>
      <p className="mt-2 text-slate-600">{message}</p>
      <Link
        to="/"
        className="mt-6 rounded-xl bg-brand-700 px-5 py-3 font-semibold text-white hover:bg-brand-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700"
      >
        Về trang chủ
      </Link>
    </div>
  );
}
