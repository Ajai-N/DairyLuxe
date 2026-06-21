import React, { createContext, useContext, useState, useEffect } from 'react';

export type PageType =
  | 'home'
  | 'about'
  | 'products'
  | 'partner-apply'
  | 'subscribe'
  | 'bulk-order'
  | 'contact'
  | 'signin'
  | 'admin-dashboard'
  | 'admin-applications'
  | 'admin-partners'
  | 'admin-subscriptions'
  | 'admin-products'
  | 'admin-orders'
  | 'partner-dashboard'
  | 'subscriber-dashboard';

interface NavigationContextType {
  currentPage: PageType;
  navigateTo: (page: PageType) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<PageType>('home');

  const navigateTo = (page: PageType) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Handle clean path routing for role-based dashboards
    if (page === 'admin-dashboard') {
      window.history.pushState(null, '', '/admin/dashboard');
    } else if (page === 'partner-dashboard') {
      window.history.pushState(null, '', '/partner/dashboard');
    } else if (page === 'subscriber-dashboard') {
      window.history.pushState(null, '', '/subscriber/dashboard');
    } else {
      if (window.location.pathname !== '/') {
        window.history.pushState(null, '', '/');
      }
    }
  };

  // Sync to history if user uses back button, or handle URL hashtags/pathnames
  useEffect(() => {
    const handleUrlChange = () => {
      const path = window.location.pathname;
      if (path === '/admin/dashboard') {
        setCurrentPage('admin-dashboard');
        return;
      } else if (path === '/partner/dashboard') {
        setCurrentPage('partner-dashboard');
        return;
      } else if (path === '/subscriber/dashboard') {
        setCurrentPage('subscriber-dashboard');
        return;
      }

      const hash = window.location.hash.replace('#', '') as PageType;
      const validPages: PageType[] = [
        'home', 'about', 'products', 'partner-apply', 'subscribe',
        'bulk-order', 'contact', 'signin', 'admin-dashboard',
        'admin-applications', 'admin-partners', 'admin-subscriptions',
        'admin-products', 'admin-orders', 'partner-dashboard', 'subscriber-dashboard'
      ];
      if (validPages.includes(hash)) {
        setCurrentPage(hash);
      }
    };

    window.addEventListener('hashchange', handleUrlChange);
    window.addEventListener('popstate', handleUrlChange);
    handleUrlChange(); // initial load check

    return () => {
      window.removeEventListener('hashchange', handleUrlChange);
      window.removeEventListener('popstate', handleUrlChange);
    };
  }, []);

  // Update hash/path when page changes
  useEffect(() => {
    if (currentPage === 'admin-dashboard') {
      if (window.location.pathname !== '/admin/dashboard') {
        window.history.pushState(null, '', '/admin/dashboard');
      }
    } else if (currentPage === 'partner-dashboard') {
      if (window.location.pathname !== '/partner/dashboard') {
        window.history.pushState(null, '', '/partner/dashboard');
      }
    } else if (currentPage === 'subscriber-dashboard') {
      if (window.location.pathname !== '/subscriber/dashboard') {
        window.history.pushState(null, '', '/subscriber/dashboard');
      }
    } else {
      window.location.hash = currentPage;
    }
  }, [currentPage]);

  return (
    <NavigationContext.Provider value={{ currentPage, navigateTo }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};
