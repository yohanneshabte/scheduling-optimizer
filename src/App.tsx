import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Home, Calendar, CalendarCheck, BarChart3 } from 'lucide-react';
import { HomePage } from './pages/HomePage';
import { BookPage } from './pages/BookPage';
import { ReservationsPage } from './pages/ReservationsPage';
import { InsightsPage } from './pages/InsightsPage';
import { initializeStore } from './lib/seed';

function TabBar() {
  const location = useLocation();

  const tabs = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/book', icon: Calendar, label: 'Book' },
    { path: '/reservations', icon: CalendarCheck, label: 'My Bookings' },
    { path: '/insights', icon: BarChart3, label: 'Staff' },
  ];

  return (
    <div className="fixed bottom-0 w-full bg-warm-stone border-t border-dark-wood/20 pb-safe">
      <div className="flex justify-around items-center h-16">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = location.pathname === tab.path;
          return (
            <Link
              key={tab.path}
              to={tab.path}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
                isActive ? 'text-sage-dark font-bold' : 'text-dark-wood/70'
              }`}
            >
              <Icon size={24} />
              <span className="text-xs">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function App() {
  useEffect(() => {
    initializeStore();
  }, []);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-cream pb-16">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/book" element={<BookPage />} />
          <Route path="/reservations" element={<ReservationsPage />} />
          <Route path="/insights" element={<InsightsPage />} />
        </Routes>
        <TabBar />
      </div>
    </BrowserRouter>
  );
}

export default App;
