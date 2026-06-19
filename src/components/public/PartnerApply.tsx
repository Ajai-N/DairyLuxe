import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Award, CheckCircle2, UserPlus, HeartHandshake } from 'lucide-react';

export const PartnerApply: React.FC = () => {
  const { submitPartnerApp } = useApp();

  const [formData, setFormData] = useState({
    fullName: '',
    mobile: '',
    address: '',
    village: '',
    district: '',
    farmingExperience: '',
    whyJoin: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitPartnerApp(formData);
    setSubmitted(true);
    setFormData({
      fullName: '',
      mobile: '',
      address: '',
      village: '',
      district: '',
      farmingExperience: '',
      whyJoin: ''
    });
  };

  return (
    <div className="bg-brand-cream-light py-16 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Info Side */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <span className="text-xs uppercase font-extrabold tracking-widest text-brand-green bg-brand-green-soft px-3 py-1 rounded-full border border-brand-green/20">
                Grow With Us
              </span>
              <h1 className="text-4xl font-display font-extrabold text-brand-green-dark mt-4 mb-6">
                Become a DairyLuxe Partner
              </h1>
              <p className="text-base text-brand-charcoal/80 leading-relaxed">
                If you are a rural farmer, cattle owner, or family interested in dairy management, we invite you to partner with us.
              </p>
            </div>

            <div className="space-y-4">
              {[
                {
                  title: 'Assured Procurement Contracts',
                  desc: 'Never worry about milk surplus or drop in seasonal market demand. We buy your entire yield.'
                },
                {
                  title: 'Feed & Veterinary Subsidies',
                  desc: 'Partners get access to organic feed stocks, mineral supplements, and monthly doctor health visits.'
                },
                {
                  title: 'Fair Quality Pricing',
                  desc: 'Get paid transparently based on computerized fat and SNF testing. Payouts sent directly to your bank account.'
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

            <div className="bg-brand-brown-dark text-brand-cream p-6 rounded-2xl border border-brand-accent-gold flex items-center gap-4">
              <HeartHandshake className="h-10 w-10 text-brand-accent-gold flex-shrink-0" />
              <div className="text-xs">
                <span className="font-semibold text-brand-accent-gold uppercase tracking-wider block mb-1">Our Pledge</span>
                We guarantee to pay a minimum of 20% higher than the baseline cooperative society market price to protect livelihoods.
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="lg:col-span-7 bg-brand-cream border border-brand-cream-dark p-8 sm:p-10 rounded-3xl shadow-sm">
            {submitted ? (
              <div className="text-center py-12 animate-fade-in">
                <div className="h-16 w-16 bg-brand-green-soft text-brand-green rounded-full flex items-center justify-center mx-auto mb-6">
                  <Award className="h-8 w-8" />
                </div>
                <h2 className="text-2xl font-display font-extrabold text-brand-green-dark mb-3">Application Submitted!</h2>
                <p className="text-sm text-brand-charcoal/70 max-w-md mx-auto mb-8">
                  Your application is now under <strong>Pending Review</strong> status. Our regional supervisor will visit your location to inspect cattle health in 2-3 working days.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="bg-brand-green text-brand-cream hover:bg-brand-green-light font-bold px-6 py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
                >
                  Submit Another Application
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h2 className="text-2xl font-display font-extrabold text-brand-green-dark mb-2">Partner Application Form</h2>
                  <p className="text-xs text-brand-charcoal/60">Fill in your rural livestock details. Fields marked with * are required.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                      placeholder="e.g. Ramesh Kumar"
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
                      placeholder="10 digit phone number"
                      className="w-full bg-brand-cream-light border border-brand-cream-dark focus:border-brand-green focus:ring-1 focus:ring-brand-green focus:outline-none rounded-xl px-4 py-3 text-sm text-brand-charcoal transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="address" className="block text-xs font-bold text-brand-charcoal uppercase tracking-wider mb-2">
                    Permanent Address *
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Door number, street name, pincode"
                    className="w-full bg-brand-cream-light border border-brand-cream-dark focus:border-brand-green focus:ring-1 focus:ring-brand-green focus:outline-none rounded-xl px-4 py-3 text-sm text-brand-charcoal transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="village" className="block text-xs font-bold text-brand-charcoal uppercase tracking-wider mb-2">
                      Village *
                    </label>
                    <input
                      type="text"
                      id="village"
                      name="village"
                      required
                      value={formData.village}
                      onChange={handleChange}
                      placeholder="Your village name"
                      className="w-full bg-brand-cream-light border border-brand-cream-dark focus:border-brand-green focus:ring-1 focus:ring-brand-green focus:outline-none rounded-xl px-4 py-3 text-sm text-brand-charcoal transition-all"
                    />
                  </div>

                  <div>
                    <label htmlFor="district" className="block text-xs font-bold text-brand-charcoal uppercase tracking-wider mb-2">
                      District *
                    </label>
                    <input
                      type="text"
                      id="district"
                      name="district"
                      required
                      value={formData.district}
                      onChange={handleChange}
                      placeholder="Your district name"
                      className="w-full bg-brand-cream-light border border-brand-cream-dark focus:border-brand-green focus:ring-1 focus:ring-brand-green focus:outline-none rounded-xl px-4 py-3 text-sm text-brand-charcoal transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="farmingExperience" className="block text-xs font-bold text-brand-charcoal uppercase tracking-wider mb-2">
                    Farming & Cattle Experience *
                  </label>
                  <textarea
                    id="farmingExperience"
                    name="farmingExperience"
                    required
                    rows={3}
                    value={formData.farmingExperience}
                    onChange={handleChange}
                    placeholder="How many years have you managed cattle? How many cows/buffaloes do you own?"
                    className="w-full bg-brand-cream-light border border-brand-cream-dark focus:border-brand-green focus:ring-1 focus:ring-brand-green focus:outline-none rounded-xl px-4 py-3 text-sm text-brand-charcoal transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="whyJoin" className="block text-xs font-bold text-brand-charcoal uppercase tracking-wider mb-2">
                    Why do you want to join DairyLuxe? *
                  </label>
                  <textarea
                    id="whyJoin"
                    name="whyJoin"
                    required
                    rows={3}
                    value={formData.whyJoin}
                    onChange={handleChange}
                    placeholder="e.g. Seeking transparent pricing, feed support, or stable monthly salary..."
                    className="w-full bg-brand-cream-light border border-brand-cream-dark focus:border-brand-green focus:ring-1 focus:ring-brand-green focus:outline-none rounded-xl px-4 py-3 text-sm text-brand-charcoal transition-all"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full bg-brand-green text-brand-cream hover:bg-brand-green-light hover:shadow-md font-bold py-4 rounded-xl text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <UserPlus className="h-4 w-4" /> Submit Application
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
