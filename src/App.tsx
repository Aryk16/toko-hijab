import { useEffect, useState } from 'react';
import { AuthProvider } from '@/lib/auth';
import { useAuth } from '@/lib/auth-context';
import { StoreLayout } from '@/components/StoreLayout';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { HomePage } from '@/pages/HomePage';
import { CategoryPage } from '@/pages/CategoryPage';
import { ProductDetailPage } from '@/pages/ProductDetailPage';
import { AboutPage } from '@/pages/AboutPage';
import { EventsPage } from '@/pages/EventsPage';
import { HijabPage } from '@/pages/HijabPage';
import { AdminLoginPage } from '@/pages/admin/AdminLoginPage';
import { AdminDashboard } from '@/pages/admin/AdminDashboard';
import { AdminProducts } from '@/pages/admin/AdminProducts';
import { AdminCategories } from '@/pages/admin/AdminCategories';
import { AdminHeroSlider } from '@/pages/admin/AdminHeroSlider';
import { AdminEvents } from '@/pages/admin/AdminEvents';
import { AdminSettings } from '@/pages/admin/AdminSettings';
import { Loader2 } from 'lucide-react';

function parsePath(pathname: string): string {
  return pathname || '/';
}

function AppContent() {
  const { session, loading } = useAuth();
  const [path, setPath] = useState(parsePath(window.location.pathname));

  useEffect(() => {
    const onPop = () => setPath(parsePath(window.location.pathname));
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const navigate = (newPath: string) => {
    if (newPath !== path) {
      window.history.pushState({}, '', newPath);
      setPath(newPath);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-primary-50">
        <Loader2 size={32} className="animate-spin text-primary-400" />
      </div>
    );
  }

  // Admin routes
  if (path === '/admin' || path === '/admin/') {
    if (session) {
      navigate('/admin/dashboard');
      return null;
    }
    return <AdminLoginPage onNavigate={navigate} />;
  }

  if (path.startsWith('/admin/')) {
    if (!session) {
      return <AdminLoginPage onNavigate={navigate} />;
    }

    const section = path.replace('/admin/', '');
    const sectionKey = section.split('/')[0];

    let content: React.ReactNode;
    switch (sectionKey) {
      case 'dashboard':
        content = <AdminDashboard onNavigate={navigate} />;
        break;
      case 'products':
        content = <AdminProducts />;
        break;
      case 'categories':
        content = <AdminCategories />;
        break;
      case 'hero-slider':
        content = <AdminHeroSlider />;
        break;
      case 'events':
        content = <AdminEvents />;
        break;
      case 'settings':
        content = <AdminSettings />;
        break;
      default:
        content = <AdminDashboard onNavigate={navigate} />;
    }

    return (
      <AdminLayout currentSection={sectionKey} onNavigate={navigate}>
        {content}
      </AdminLayout>
    );
  }

  // Storefront routes
  let page: React.ReactNode;
  if (path === '/' || path === '') {
    page = <HomePage onNavigate={navigate} />;
  } else if (path.startsWith('/category/')) {
    const slug = path.replace('/category/', '');
    page = <CategoryPage slug={slug} onNavigate={navigate} />;
  } else if (path.startsWith('/product/')) {
    const id = path.replace('/product/', '');
    page = <ProductDetailPage id={id} onNavigate={navigate} />;
  } else if (path === '/hijab') {
    page = <HijabPage onNavigate={navigate} />;
  } else if (path === '/about') {
    page = <AboutPage />;
  } else if (path === '/events') {
    page = <EventsPage />;
  } else {
    page = (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="font-serif text-3xl font-bold text-primary-900">Halaman Tidak Ditemukan</h1>
        <p className="mt-3 text-primary-600">Maaf, halaman yang Anda cari tidak ada.</p>
        <button onClick={() => navigate('/')} className="btn-primary mt-6">
          Kembali ke Home
        </button>
      </div>
    );
  }

  return (
    <StoreLayout onNavigate={navigate} currentPath={path}>
      {page}
    </StoreLayout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
