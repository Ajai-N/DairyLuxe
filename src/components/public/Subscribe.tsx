import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, CheckCircle2, ShoppingBag, Clock } from 'lucide-react';

export const Subscribe: React.FC = () => {
  const { submitSubscriptionApp } = useApp();

  const [formData, setFormData] = useState({
    fullName: '',
    mobile: '',
    address: '',
    quantity: 1,
    deliveryTime: 'Morning' as 'Morning' | 'Evening'
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const val = e.target.name === 'quantity' ? parseFloat(e.target.value) : e.target.value;
    setFormData({ ...formData, [e.target.name]: val });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitSubscriptionApp(formData);
    setSubmitted(true);
    setFormData({
      fullName: '',
      mobile: '',
      address: '',
      quantity: 1,
      deliveryTime: 'Morning'
    });
  };

  return (
    <div className="bg-brand-cream-light py-16 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Info Column */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <span className="text-xs uppercase font-extrabold tracking-widest text-brand-green bg-brand-green-soft px-3 py-1 rounded-full border border-brand-green/20">
                Fresh Deliveries
              </span>
              <h1 className="text-4xl font-display font-extrabold text-brand-green-dark mt-4 mb-6">
                Subscribe for Daily Farm Milk
              </h1>
              <p className="text-base text-brand-charcoal/80 leading-relaxed">
                Enjoy A2-rich, unpasteurized, cold-chained raw milk delivered directly to your doorstep before breakfast or dinner. No minimum contracts. Pause or resume anytime.
              </p>
            </div>

            <div className="space-y-4">
              {[
                {
                  title: 'Cold Chilled Transport',
                  desc: 'We transport milk in temperature-controlled boxes at 4°C, preserving active enzymes and probiotic quality.'
                },
                {
                  title: 'Glass Bottles System',
                  desc: 'Eco-friendly, food-grade reusable glass bottles sterilized daily. Zero plastic contact.'
                },
                {
                  title: 'Morning or Evening Slots',
                  desc: 'Delivered by 6:30 AM for morning coffee or by 6:00 PM for dinner. Select what fits your schedule.'
                }
              ].map((benefit, i) => (
                <div key={i} className="flex items-start bg-brand-cream p-5 rounded-2xl border border-brand-cream-dark shadow-sm">
                  <CheckCircle2 className="h-5 w-5 text-brand-green mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-display font-bold text-sm text-brand-green-dark">{benefit.title}</h3>
                    <p className="text-xs text-brand-charcoal/70 mt-1 leading-relaxed">{benefit.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-brand-cream p-6 rounded-2xl border border-brand-cream-dark text-xs flex items-center gap-3">
              <Clock className="h-6 w-6 text-brand-accent-gold flex-shrink-0" />
              <span>
                <strong>Subscription Schedule:</strong> Billings are compiled monthly. Deliveries occur daily unless modified on the portal or notified to local delivery agents.
              </span>
            </div>
          </div>

          {/* Form Column */}
          <div className="lg:col-span-7 bg-brand-cream border border-brand-cream-dark p-8 sm:p-10 rounded-3xl shadow-sm">
            {submitted ? (
              <div className="text-center py-12 animate-fade-in">
                <div className="h-16 w-16 bg-brand-green-soft text-brand-green rounded-full flex items-center justify-center mx-auto mb-6">
                  <Sparkles className="h-8 w-8" />
                </div>
                <h2 className="text-2xl font-display font-extrabold text-brand-green-dark mb-3">Subscription Request Received!</h2>
                <p className="text-sm text-brand-charcoal/70 max-w-md mx-auto mb-8">
                  Your request is set to <strong>Pending Review</strong>. Our logistics supervisor will verify your street address and assign a local milk run route details in 24 hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="bg-brand-green text-brand-cream hover:bg-brand-green-light font-bold px-6 py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
                >
                  Create Another Request
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h2 className="text-2xl font-display font-extrabold text-brand-green-dark mb-2">Daily Milk Enrollment</h2>
                  <p className="text-xs text-brand-charcoal/60">Configure your daily raw milk requirements below.</p>
                </div>

                <div>
                  <label htmlFor="fullName" className="block text-xs font-bold text-brand-charcoal uppercase tracking-wider mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="e.g. Priya Rajan"
                    className="w-full bg-brand-cream-light border border-brand-cream-dark focus:border-brand-green focus:ring-1 focus:ring-brand-green focus:outline-none rounded-xl px-4 py-3 text-sm text-brand-charcoal transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="mobile" className="block text-xs font-bold text-brand-charcoal uppercase tracking-wider mb-2">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    id="mobile"
                    name="mobile"
                    required
                    value={formData.mobile}
                    onChange={handleChange}
                    placeholder="10 digit contact number"
                    className="w-full bg-brand-cream-light border border-brand-cream-dark focus:border-brand-green focus:ring-1 focus:ring-brand-green focus:outline-none rounded-xl px-4 py-3 text-sm text-brand-charcoal transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="address" className="block text-xs font-bold text-brand-charcoal uppercase tracking-wider mb-2">
                    Delivery Address *
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    required
                    value={formData.address}
                    placeholder="Apartment name, door number, street, landmark, pincode"
                    className="w-full bg-brand-cream-light border border-brand-cream-dark focus:border-brand-green focus:ring-1 focus:ring-brand-green focus:outline-none rounded-xl px-4 py-3 text-sm text-brand-charcoal transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="quantity" className="block text-xs font-bold text-brand-charcoal uppercase tracking-wider mb-2">
                      Daily Quantity Required (Litres) *
                    </label>
                    <input
                      type="number"
                      id="quantity"
                      name="quantity"
                      required
                      min={0.5}
                      max={10}
                      step={0.5}
                      value={formData.quantity}
                      onChange={handleChange}
                      className="w-full bg-brand-cream-light border border-brand-cream-dark focus:border-brand-green focus:ring-1 focus:ring-brand-green focus:outline-none rounded-xl px-4 py-3 text-sm text-brand-charcoal transition-all"
                    />
                  </div>

                  <div>
                    <label htmlFor="deliveryTime" className="block text-xs font-bold text-brand-charcoal uppercase tracking-wider mb-2">
                      Preferred Delivery Time *
                    </label>
                    <select
                      id="deliveryTime"
                      name="deliveryTime"
                      required
                      value={formData.deliveryTime}
                      onChange={handleChange}
                      className="w-full bg-brand-cream-light border border-brand-cream-dark focus:border-brand-green focus:ring-1 focus:ring-brand-green focus:outline-none rounded-xl px-4 py-3 text-sm text-brand-charcoal transition-all"
                    >
                      <option value="Morning">Morning (5:30 AM - 7:00 AM)</option>
                      <option value="Evening">Evening (5:30 PM - 7:00 PM)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full bg-brand-green text-brand-cream hover:bg-brand-green-light hover:shadow-md font-bold py-4 rounded-xl text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ShoppingBag className="h-4 w-4" /> Start Daily Subscription
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
