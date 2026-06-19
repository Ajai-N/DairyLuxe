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
  | 'admin-orders';

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
  };

  // Sync to history if user uses back button, or handle URL hashtags
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '') as PageType;
      const validPages: PageType[] = [
        'home', 'about', 'products', 'partner-apply', 'subscribe',
        'bulk-order', 'contact', 'signin', 'admin-dashboard',
        'admin-applications', 'admin-partners', 'admin-subscriptions',
        'admin-products', 'admin-orders'
      ];
      if (validPages.includes(hash)) {
        setCurrentPage(hash);
      }
    };

    window.addEventListener('hashchange', handleHash);
    handleHash(); // initial load check

    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Update hash when page changes
  useEffect(() => {
    window.location.hash = currentPage;
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
