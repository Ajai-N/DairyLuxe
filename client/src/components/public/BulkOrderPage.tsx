import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Landmark, Check, Send, Store, Coffee, ShieldAlert } from 'lucide-react';

export const BulkOrderPage: React.FC = () => {
  const { submitBulkOrder } = useApp();

  const [formData, setFormData] = useState({
    businessName: '',
    contactPerson: '',
    phone: '',
    requirements: '',
    quantity: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitBulkOrder(formData);
    setSubmitted(true);
    setFormData({
      businessName: '',
      contactPerson: '',
      phone: '',
      requirements: '',
      quantity: '',
      message: ''
    });
  };

  const targets = [
    { name: 'Restaurants & Hotels', desc: 'Premium thick curds, raw milk for rich cooking, and ghee/butter consistency for top chefs.' },
    { name: 'Tea & Coffee Shops', desc: 'High-fat, pure raw milk that produces stable cream froth and traditional beverage texture.' },
    { name: 'Cafeterias & Hostels', desc: 'Nutritious bulk supply of badam milk, curds, and whole milk for employee/student health.' },
    { name: 'Retail Distributors', desc: 'Packaged curd, butter, and flavoured milks distributed in high-quality refrigerated storage.' }
  ];

  return (
    <div className="bg-brand-cream-light py-16 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase font-extrabold tracking-widest text-brand-green bg-brand-green-soft px-3 py-1 rounded-full border border-brand-green/20">
            Wholesale & Catering
          </span>
          <h1 className="text-4xl sm:text-5xl font-display font-extrabold text-brand-green-dark mt-4 mb-6">
            B2B Commercial Milk & Dairy Supply
          </h1>
          <p className="text-base sm:text-lg text-brand-charcoal/80 leading-relaxed">
            Consistently pure, cold-chain monitored milk and derivative products optimized for high-volume kitchen prep and retail networks.
          </p>
        </div>

        {/* Business Profiles Segment */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {targets.map((t, i) => (
            <div key={i} className="bg-brand-cream p-6 rounded-2xl border border-brand-cream-dark shadow-sm">
              <div className="h-10 w-10 bg-brand-green-soft text-brand-green rounded-xl flex items-center justify-center mb-4">
                {i === 0 ? <Store className="h-5 w-5" /> : i === 1 ? <Coffee className="h-5 w-5" /> : i === 2 ? <Landmark className="h-5 w-5" /> : <ShieldAlert className="h-5 w-5" />}
              </div>
              <h3 className="font-display font-bold text-base text-brand-green-dark mb-2">{t.name}</h3>
              <p className="text-xs text-brand-charcoal/70 leading-relaxed">{t.desc}</p>
            </div>
          ))}
        </div>

        {/* Inquiry Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Details Side */}
          <div className="lg:col-span-5 space-y-6">
            <h2 className="text-3xl font-display font-extrabold text-brand-green-dark">
              Why Partner with DairyLuxe B2B?
            </h2>
            <p className="text-sm text-brand-charcoal/80 leading-relaxed">
              We specialize in fulfilling batch requirements for commercial establishments with stringent quality parameters.
            </p>

            <ul className="space-y-4">
              {[
                'Morning delivery before kitchen shifts begin (4:30 AM - 6:00 AM)',
                '100% adulteration testing reports provided on demand',
                'Tax-compliant invoices and customizable contracts',
                'Cold chain temperature logger verification at delivery'
              ].map((text, i) => (
                <li key={i} className="flex items-start text-xs text-brand-charcoal/80 leading-relaxed">
                  <div className="h-5 w-5 bg-brand-green-soft text-brand-green rounded-full flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                    <Check className="h-3 w-3" />
                  </div>
                  <span>{text}</span>
                </li>
              ))}
            </ul>

            <div className="bg-brand-brown/10 p-5 rounded-2xl border border-brand-brown-light/20 text-xs text-brand-brown-dark leading-relaxed">
              <strong>Need immediate assistance?</strong> Contact our B2B accounts manager directly at <strong>+91 98765 43210</strong> or email <strong>wholesale@dairyluxe.com</strong>.
            </div>
          </div>

          {/* Form Side */}
          <div className="lg:col-span-7 bg-brand-cream border border-brand-cream-dark p-8 sm:p-10 rounded-3xl shadow-sm">
            {submitted ? (
              <div className="text-center py-12 animate-fade-in">
                <Check className="h-12 w-12 text-brand-cream bg-brand-green rounded-full mx-auto mb-4 p-2.5 shadow" />
                <h3 className="text-xl font-bold text-brand-green-dark mb-2">Bulk Inquiry Filed</h3>
                <p className="text-sm text-brand-charcoal/70 max-w-sm mx-auto mb-6">
                  Thank you. Your commercial supply inquiry has been recorded and assigned to a regional sales executive.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="bg-brand-green text-brand-cream hover:bg-brand-green-light font-bold px-6 py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
                >
                  New Business Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h3 className="text-xl font-display font-extrabold text-brand-green-dark mb-1">Commercial Quote Request</h3>
                  <p className="text-xs text-brand-charcoal/50">Submit details for specialized pricing charts.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="businessName" className="block text-xs font-bold text-brand-charcoal uppercase tracking-wider mb-2">
                      Business Name *
                    </label>
                    <input
                      type="text"
                      id="businessName"
                      name="businessName"
                      required
                      value={formData.businessName}
                      onChange={handleChange}
                      placeholder="e.g. Grand Plaza Hotel"
                      className="w-full bg-brand-cream-light border border-brand-cream-dark focus:border-brand-green focus:ring-1 focus:ring-brand-green focus:outline-none rounded-xl px-4 py-3 text-sm text-brand-charcoal transition-all"
                    />
                  </div>

                  <div>
                    <label htmlFor="contactPerson" className="block text-xs font-bold text-brand-charcoal uppercase tracking-wider mb-2">
                      Contact Person *
                    </label>
                    <input
                      type="text"
                      id="contactPerson"
                      name="contactPerson"
                      required
                      value={formData.contactPerson}
                      onChange={handleChange}
                      placeholder="e.g. Manager Suresh"
                      className="w-full bg-brand-cream-light border border-brand-cream-dark focus:border-brand-green focus:ring-1 focus:ring-brand-green focus:outline-none rounded-xl px-4 py-3 text-sm text-brand-charcoal transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-xs font-bold text-brand-charcoal uppercase tracking-wider mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="e.g. 9876543210"
                      className="w-full bg-brand-cream-light border border-brand-cream-dark focus:border-brand-green focus:ring-1 focus:ring-brand-green focus:outline-none rounded-xl px-4 py-3 text-sm text-brand-charcoal transition-all"
                    />
                  </div>

                  <div>
                    <label htmlFor="requirements" className="block text-xs font-bold text-brand-charcoal uppercase tracking-wider mb-2">
                      Products Needed *
                    </label>
                    <input
                      type="text"
                      id="requirements"
                      name="requirements"
                      required
                      value={formData.requirements}
                      onChange={handleChange}
                      placeholder="e.g. 80L Raw Milk, 10kg Curd"
                      className="w-full bg-brand-cream-light border border-brand-cream-dark focus:border-brand-green focus:ring-1 focus:ring-brand-green focus:outline-none rounded-xl px-4 py-3 text-sm text-brand-charcoal transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="quantity" className="block text-xs font-bold text-brand-charcoal uppercase tracking-wider mb-2">
                    Approximate Weekly/Daily Volume *
                  </label>
                  <input
                    type="text"
                    id="quantity"
                    name="quantity"
                    required
                    value={formData.quantity}
                    onChange={handleChange}
                    placeholder="e.g. 100 Litres Daily"
                    className="w-full bg-brand-cream-light border border-brand-cream-dark focus:border-brand-green focus:ring-1 focus:ring-brand-green focus:outline-none rounded-xl px-4 py-3 text-sm text-brand-charcoal transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-xs font-bold text-brand-charcoal uppercase tracking-wider mb-2">
                    Additional Requirements
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Special packaging requirements, delivery windows, billing cycles, etc..."
                    className="w-full bg-brand-cream-light border border-brand-cream-dark focus:border-brand-green focus:ring-1 focus:ring-brand-green focus:outline-none rounded-xl px-4 py-3 text-sm text-brand-charcoal transition-all"
                  />
                </div>

                <div>
                  <button
                    type="submit"
                    className="w-full bg-brand-green text-brand-cream hover:bg-brand-green-light hover:shadow-md font-bold py-4 rounded-xl text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="h-4 w-4" /> Submit Commercial Inquiry
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
