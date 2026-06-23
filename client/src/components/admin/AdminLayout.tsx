import React from 'react';
import { useNavigation, type PageType } from '../../context/NavigationContext';
import { useApp } from '../../context/AppContext';
import { LayoutDashboard, Inbox, Users, ShoppingBag, FileText, Settings, LogOut, Home, Landmark, Briefcase } from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { currentPage, navigateTo } = useNavigation();
  const { currentUser, signOut } = useApp();

  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5" />, page: 'admin-dashboard' as PageType },
    { name: 'Applications', icon: <Inbox className="h-5 w-5" />, page: 'admin-applications' as PageType },
    { name: 'Partners', icon: <Users className="h-5 w-5" />, page: 'admin-partners' as PageType },
    { name: 'Subscriptions', icon: <FileText className="h-5 w-5" />, page: 'admin-subscriptions' as PageType },
    { name: 'Workers', icon: <Briefcase className="h-5 w-5" />, page: 'admin-workers' as PageType },
    { name: 'Products Catalog', icon: <Settings className="h-5 w-5" />, page: 'admin-products' as PageType },
    { name: 'Order Logs', icon: <ShoppingBag className="h-5 w-5" />, page: 'admin-orders' as PageType },
  ];

  const handleLogout = () => {
    signOut();
    navigateTo('home');
  };

  return (
    <div className="min-h-screen bg-brand-gray-light flex flex-col lg:flex-row animate-fade-in">
      
      {/* Sidebar Navigation */}
      <aside className="w-full lg:w-72 bg-brand-green text-brand-cream-light flex flex-col justify-between p-6 lg:fixed lg:inset-y-0 lg:left-0 border-r border-brand-green-light/35 z-30">
        <div>
          {/* Brand Logo */}
          <div className="flex items-center gap-3 mb-10 cursor-pointer" onClick={() => navigateTo('home')}>
            <div className="h-10 w-10 bg-brand-cream-light rounded-full flex items-center justify-center text-brand-green border border-brand-cream shadow">
              <Landmark className="h-5 w-5" />
            </div>
            <div>
              <span className="font-display font-extrabold text-xl tracking-wide text-brand-cream">DairyLuxe</span>
              <span className="block text-[9px] uppercase font-bold tracking-widest text-brand-accent-gold -mt-1">Control Center</span>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.page}
                onClick={() => navigateTo(item.page)}
                className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                  currentPage === item.page
                    ? 'bg-brand-cream-light text-brand-green shadow-sm'
                    : 'text-brand-cream-dark hover:bg-white/10 hover:text-brand-cream'
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* User Stats & Logout */}
        <div className="mt-8 border-t border-brand-cream-dark/10 pt-6 space-y-4">
          <div className="px-4">
            <span className="block text-[10px] uppercase font-bold text-brand-accent-gold tracking-widest">Active Admin</span>
            <span className="font-semibold text-sm block mt-0.5">{currentUser?.name || 'System Operator'}</span>
          </div>

          <button
            onClick={() => navigateTo('home')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-brand-cream-dark hover:bg-white/5 hover:text-brand-cream transition-colors cursor-pointer"
          >
            <Home className="h-5 w-5" />
            <span>Public Website</span>
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-300 hover:bg-red-950/20 hover:text-red-100 transition-colors cursor-pointer"
          >
            <LogOut className="h-5 w-5" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Administrative Screen Area */}
      <main className="flex-1 lg:pl-72 flex flex-col min-h-screen">
        
        {/* Top Header Bar */}
        <header className="bg-white border-b border-brand-cream-dark py-5 px-6 sm:px-8 flex justify-between items-center">
          <h2 className="font-display font-extrabold text-xl text-brand-green-dark">
            {currentPage === 'admin-dashboard' && 'Operations Dashboard'}
            {currentPage === 'admin-applications' && 'Applications Center'}
            {currentPage === 'admin-partners' && 'Dairy Partner Directory'}
            {currentPage === 'admin-subscriptions' && 'Daily Delivery Accounts'}
            {currentPage === 'admin-products' && 'Product Inventory Catalog'}
            {currentPage === 'admin-orders' && 'Order Transactions'}
            {currentPage === 'admin-workers' && 'Worker Operations Directory'}
          </h2>
          <div className="text-xs text-brand-charcoal/50 font-semibold">
            System Local Time: {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </header>

        {/* Inner Content Grid */}
        <div className="flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto">
          {children}
        </div>
      </main>

    </div>
  );
};
