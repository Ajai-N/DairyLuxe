import React, { useState } from 'react';
import { useNavigation } from '../../context/NavigationContext';
import { useApp } from '../../context/AppContext';
import { Menu, X, Landmark, ShieldAlert, LogOut } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { currentPage, navigateTo } = useNavigation();
  const { currentUser, signOut } = useApp();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const links = [
    { name: 'Home', page: 'home' as const },
    { name: 'About Us', page: 'about' as const },
    { name: 'Products', page: 'products' as const },
    { name: 'Become Partner', page: 'partner-apply' as const },
    { name: 'Subscription', page: 'subscribe' as const },
    { name: 'Bulk Orders', page: 'bulk-order' as const },
    { name: 'Contact', page: 'contact' as const },
  ];

  const handleNav = (page: typeof currentPage) => {
    navigateTo(page);
    setIsOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 glass-panel shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0 cursor-pointer" onClick={() => handleNav('home')}>
            <div className="h-12 w-12 bg-brand-green rounded-full flex items-center justify-center text-brand-cream shadow-md mr-3 border-2 border-brand-cream-dark">
              <Landmark className="h-6 w-6" />
            </div>
            <div>
              <span className="font-display font-extrabold text-2xl tracking-wide text-brand-green-dark">DairyLuxe</span>
              <span className="block text-[10px] uppercase font-bold tracking-widest text-brand-brown-light -mt-1">Pure & Ethical</span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-6">
            {links.map((link) => (
              <button
                key={link.page}
                onClick={() => handleNav(link.page)}
                className={`font-medium text-sm transition-colors duration-200 hover:text-brand-green relative py-2 ${
                  currentPage === link.page
                    ? 'text-brand-green font-semibold after:content-[""] after:absolute after:bottom-0 after:left-2 after:right-2 after:h-0.5 after:bg-brand-green'
                    : 'text-brand-charcoal/80'
                }`}
              >
                {link.name}
              </button>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center space-x-3">
            {currentUser ? (
              <div className="flex items-center space-x-3 bg-brand-green-soft px-3 py-1.5 rounded-full border border-brand-green/20">
                <span className="text-xs font-semibold text-brand-green">
                  {currentUser.role === 'admin' ? 'Admin' : currentUser.name}
                </span>
                
                {currentUser.role === 'admin' && (
                  <button
                    onClick={() => handleNav('admin-dashboard')}
                    className="p-1 text-brand-green hover:bg-brand-green/10 rounded-full transition-colors tooltip"
                    title="Admin Dashboard"
                  >
                    <ShieldAlert className="h-4 w-4" />
                  </button>
                )}

                {currentUser.role === 'partner' && (
                  <button
                    onClick={() => handleNav('partner-dashboard')}
                    className="p-1 text-brand-green hover:bg-brand-green/10 rounded-full transition-colors tooltip"
                    title="Partner Dashboard"
                  >
                    <ShieldAlert className="h-4 w-4" />
                  </button>
                )}

                {currentUser.role === 'customer' && (
                  <button
                    onClick={() => handleNav('subscriber-dashboard')}
                    className="p-1 text-brand-green hover:bg-brand-green/10 rounded-full transition-colors tooltip"
                    title="Subscriber Dashboard"
                  >
                    <ShieldAlert className="h-4 w-4" />
                  </button>
                )}
                
                <button
                  onClick={() => { signOut(); handleNav('home'); }}
                  className="p-1 text-brand-brown hover:bg-brand-brown/10 rounded-full transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleNav('signin')}
                className="bg-brand-green text-brand-cream hover:bg-brand-green-light px-5 py-2.5 rounded-full text-sm font-semibold transition-all hover:shadow-md cursor-pointer"
              >
                Member Portal
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-brand-green hover:text-brand-green-light hover:bg-brand-cream-dark transition-colors"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden border-t border-brand-cream-dark bg-brand-cream-light/95 backdrop-blur-md animate-fade-in">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {links.map((link) => (
              <button
                key={link.page}
                onClick={() => handleNav(link.page)}
                className={`block w-full text-left px-3 py-3 rounded-md text-base font-medium transition-colors ${
                  currentPage === link.page
                    ? 'bg-brand-green text-brand-cream'
                    : 'text-brand-charcoal hover:bg-brand-cream hover:text-brand-green'
                }`}
              >
                {link.name}
              </button>
            ))}
            
            <div className="border-t border-brand-cream-dark my-2 pt-2 px-3">
              {currentUser ? (
                <div className="space-y-2">
                  <div className="text-sm font-semibold text-brand-green py-1">
                    Logged in: {currentUser.name} ({currentUser.role.toUpperCase()})
                  </div>
                  {currentUser.role === 'admin' && (
                    <button
                      onClick={() => handleNav('admin-dashboard')}
                      className="flex items-center w-full px-3 py-2 bg-brand-green-soft text-brand-green rounded-md text-sm font-medium"
                    >
                      <ShieldAlert className="h-4 w-4 mr-2" />
                      Dashboard
                    </button>
                  )}
                  {currentUser.role === 'partner' && (
                    <button
                      onClick={() => handleNav('partner-dashboard')}
                      className="flex items-center w-full px-3 py-2 bg-brand-green-soft text-brand-green rounded-md text-sm font-medium"
                    >
                      <ShieldAlert className="h-4 w-4 mr-2" />
                      Partner Dashboard
                    </button>
                  )}
                  {currentUser.role === 'customer' && (
                    <button
                      onClick={() => handleNav('subscriber-dashboard')}
                      className="flex items-center w-full px-3 py-2 bg-brand-green-soft text-brand-green rounded-md text-sm font-medium"
                    >
                      <ShieldAlert className="h-4 w-4 mr-2" />
                      Subscriber Dashboard
                    </button>
                  )}
                  <button
                    onClick={() => { signOut(); handleNav('home'); }}
                    className="flex items-center w-full px-3 py-2 bg-red-50 text-red-700 rounded-md text-sm font-medium"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleNav('signin')}
                  className="w-full bg-brand-green text-brand-cream text-center px-4 py-2.5 rounded-md font-semibold block hover:bg-brand-green-light"
                >
                  Member Portal
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
