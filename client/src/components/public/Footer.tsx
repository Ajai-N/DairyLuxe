import React from 'react';
import { useNavigation } from '../../context/NavigationContext';
import { Landmark, Mail, Phone, MapPin, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigateTo } = useNavigation();

  return (
    <footer className="bg-brand-brown-dark text-brand-cream-light pt-16 pb-8 border-t-4 border-brand-accent-gold">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          
          {/* Brand Info */}
          <div>
            <div className="flex items-center mb-4 cursor-pointer" onClick={() => navigateTo('home')}>
              <div className="h-10 w-10 bg-brand-green rounded-full flex items-center justify-center text-brand-cream border border-brand-cream-dark mr-3">
                <Landmark className="h-5 w-5" />
              </div>
              <span className="font-display font-extrabold text-xl tracking-wide">DairyLuxe</span>
            </div>
            <p className="text-sm text-brand-cream-dark/80 leading-relaxed mb-4">
              Supporting rural farming families with fair livelihoods while delivering pure, farm-fresh milk and dairy products directly to you.
            </p>
            <div className="flex space-x-3 text-xs text-brand-accent-gold font-medium uppercase tracking-wider">
              <span>Farmers First</span>
              <span>•</span>
              <span>100% Organic</span>
              <span>•</span>
              <span>Sustainably Produced</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display font-semibold text-lg text-brand-accent-gold mb-4">Quick Navigation</h3>
            <ul className="space-y-2 text-sm text-brand-cream-dark/90">
              <li>
                <button onClick={() => navigateTo('home')} className="hover:text-brand-accent-gold transition-colors">
                  Home Page
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('about')} className="hover:text-brand-accent-gold transition-colors">
                  Our Mission & About
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('products')} className="hover:text-brand-accent-gold transition-colors">
                  Fresh Products Catalog
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('partner-apply')} className="hover:text-brand-accent-gold transition-colors">
                  Become a Dairy Partner
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('subscribe')} className="hover:text-brand-accent-gold transition-colors">
                  Daily Milk Subscription
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="font-display font-semibold text-lg text-brand-accent-gold mb-4">Reach Out</h3>
            <ul className="space-y-3 text-sm text-brand-cream-dark/90">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-brand-accent-gold mr-3 flex-shrink-0 mt-0.5" />
                <span>
                  DairyLuxe Processing Plant,<br />
                  NH-45, Farm Road, Melur,<br />
                  Madurai, Tamil Nadu - 625106
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="h-4 w-4 text-brand-accent-gold mr-3 flex-shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-4 w-4 text-brand-accent-gold mr-3 flex-shrink-0" />
                <span>support@dairyluxe.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-display font-semibold text-lg text-brand-accent-gold mb-4">Newsletter</h3>
            <p className="text-sm text-brand-cream-dark/80 mb-4">
              Get recipes, farm updates, and health tips directly in your inbox.
            </p>
            <form onSubmit={(e) => { e.preventDefault(); alert('Subscribed successfully!'); }} className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Your email address"
                required
                className="bg-brand-cream-light/10 text-brand-cream-light text-sm px-4 py-2.5 rounded-md border border-brand-cream/20 focus:outline-none focus:ring-1 focus:ring-brand-accent-gold w-full"
              />
              <button
                type="submit"
                className="bg-brand-green text-brand-cream font-semibold text-sm px-4 py-2.5 rounded-md hover:bg-brand-green-light transition-colors whitespace-nowrap cursor-pointer"
              >
                Join
              </button>
            </form>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-brand-cream/10 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-brand-cream-dark/60">
          <div className="mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} DairyLuxe Dairy Private Limited. All rights reserved.
          </div>
          <div className="flex items-center">
            <span>Made with</span>
            <Heart className="h-3.5 w-3.5 mx-1.5 text-red-500 fill-red-500 animate-pulse" />
            <span>for sustainable rural livelihoods.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
