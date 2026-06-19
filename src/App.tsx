import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { NavigationProvider, useNavigation } from './context/NavigationContext';
import { Navbar } from './components/public/Navbar';
import { Footer } from './components/public/Footer';
import { Home } from './components/public/Home';
import { About } from './components/public/About';
import { Products } from './components/public/Products';
import { PartnerApply } from './components/public/PartnerApply';
import { Subscribe } from './components/public/Subscribe';
import { BulkOrderPage } from './components/public/BulkOrderPage';
import { Contact } from './components/public/Contact';
import { SignIn } from './components/public/SignIn';

// Admin Imports
import { AdminLayout } from './components/admin/AdminLayout';
import { Dashboard as AdminDashboard } from './components/admin/Dashboard';
import { Applications as AdminApplications } from './components/admin/Applications';
import { Partners as AdminPartners } from './components/admin/Partners';
import { Subscriptions as AdminSubscriptions } from './components/admin/Subscriptions';
import { Products as AdminProducts } from './components/admin/Products';
import { Orders as AdminOrders } from './components/admin/Orders';

const AppContent: React.FC = () => {
  const { currentPage } = useNavigation();
  const { currentUser } = useApp();

  const isAdminPage = currentPage.startsWith('admin-');

  // Route guarding for admin dashboard screens
  if (isAdminPage && currentUser?.role !== 'admin') {
    return (
      <div className="flex flex-col min-h-screen bg-brand-cream-light">
        <Navbar />
        <div className="flex-grow">
          {/* Automatically display Sign In page if unauthorized */}
          <SignIn />
        </div>
        <Footer />
      </div>
    );
  }

  // Render Admin Panels
  if (isAdminPage) {
    return (
      <AdminLayout>
        {currentPage === 'admin-dashboard' && <AdminDashboard />}
        {currentPage === 'admin-applications' && <AdminApplications />}
        {currentPage === 'admin-partners' && <AdminPartners />}
        {currentPage === 'admin-subscriptions' && <AdminSubscriptions />}
        {currentPage === 'admin-products' && <AdminProducts />}
        {currentPage === 'admin-orders' && <AdminOrders />}
      </AdminLayout>
    );
  }

  // Render Public Website Pages
  return (
    <div className="flex flex-col min-h-screen bg-brand-cream-light">
      <Navbar />
      <div className="flex-grow">
        {currentPage === 'home' && <Home />}
        {currentPage === 'about' && <About />}
        {currentPage === 'products' && <Products />}
        {currentPage === 'partner-apply' && <PartnerApply />}
        {currentPage === 'subscribe' && <Subscribe />}
        {currentPage === 'bulk-order' && <BulkOrderPage />}
        {currentPage === 'contact' && <Contact />}
        {currentPage === 'signin' && <SignIn />}
      </div>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <NavigationProvider>
        <AppContent />
      </NavigationProvider>
    </AppProvider>
  );
}

export default App;
