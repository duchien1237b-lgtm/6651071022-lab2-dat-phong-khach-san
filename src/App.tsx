import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import ListPage from './pages/ListPage';
import ToastProvider from './context/ToastProvider';
import BookingProvider from './context/BookingProvider';

// Tách code theo route để trang chủ tải nhanh hơn
const DetailPage = lazy(() => import('./pages/DetailPage'));
const BookingPage = lazy(() => import('./pages/BookingPage'));
const MyBookingsPage = lazy(() => import('./pages/MyBookingsPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

function PageLoader() {
  return (
    <div className="grid min-h-[50vh] place-items-center" role="status">
      <span className="h-10 w-10 animate-spin rounded-full border-4 border-brand-100 border-t-brand-700" />
      <span className="sr-only">Đang tải trang...</span>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <BookingProvider>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<ListPage />} />
                <Route path="/item/:id" element={<DetailPage />} />
                <Route path="/item/:id/book" element={<BookingPage />} />
                <Route path="/bookings" element={<MyBookingsPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>
          </Suspense>
        </BookingProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
