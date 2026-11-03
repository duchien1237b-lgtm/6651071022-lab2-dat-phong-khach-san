import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

export default function Layout() {
  const { pathname } = useLocation();
  // Cuộn lên đầu trang khi đổi route
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [pathname]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="main" className="flex-1 pb-12">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
