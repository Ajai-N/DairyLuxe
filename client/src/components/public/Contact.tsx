import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, Clock } from 'lucide-react';

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="bg-brand-cream-light py-16 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase font-extrabold tracking-widest text-brand-green bg-brand-green-soft px-3 py-1 rounded-full border border-brand-green/20">
            Get In Touch
          </span>
          <h1 className="text-4xl sm:text-5xl font-display font-extrabold text-brand-green-dark mt-4 mb-6">
            Contact DairyLuxe
          </h1>
          <p className="text-base sm:text-lg text-brand-charcoal/80 leading-relaxed">
            Have questions about subscriptions, partnerships, or our ethical sourcing guidelines? Reach out and we will help you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-16">
          
          {/* Details Sidebar */}
          <div className="lg:col-span-5 space-y-6">
            <h2 className="text-2xl font-display font-extrabold text-brand-green-dark">
              Our Offices & Factory
            </h2>
            <p className="text-sm text-brand-charcoal/70 leading-relaxed">
              We operate collections hubs across 12 villages, with our centralized chilling and processing plant based in Madurai.
            </p>

            <div className="space-y-4">
              <div className="bg-brand-cream p-6 rounded-2xl border border-brand-cream-dark shadow-sm flex items-start">
                <MapPin className="h-6 w-6 text-brand-green mr-4 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-display font-bold text-sm text-brand-green-dark">Processing Plant & HQ</h3>
                  <p className="text-xs text-brand-charcoal/70 mt-1 leading-relaxed">
                    DairyLuxe Processing Plant, NH-45, Farm Road, Melur, Madurai, Tamil Nadu - 625106
                  </p>
                </div>
              </div>

              <div className="bg-brand-cream p-6 rounded-2xl border border-brand-cream-dark shadow-sm flex items-start">
                <Phone className="h-5 w-5 text-brand-green mr-4 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-display font-bold text-sm text-brand-green-dark">Phone Contacts</h3>
                  <p className="text-xs text-brand-charcoal/70 mt-1">General Support: +91 98765 43210</p>
                  <p className="text-xs text-brand-charcoal/70 mt-0.5">Partner Support: +91 88765 43211</p>
                </div>
              </div>

              <div className="bg-brand-cream p-6 rounded-2xl border border-brand-cream-dark shadow-sm flex items-start">
                <Mail className="h-5 w-5 text-brand-green mr-4 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-display font-bold text-sm text-brand-green-dark">Email Inquiries</h3>
                  <p className="text-xs text-brand-charcoal/70 mt-1">General: support@dairyluxe.com</p>
                  <p className="text-xs text-brand-charcoal/70 mt-0.5">Partnerships: partners@dairyluxe.com</p>
                </div>
              </div>

              <div className="bg-brand-cream p-6 rounded-2xl border border-brand-cream-dark shadow-sm flex items-start">
                <Clock className="h-5 w-5 text-brand-green mr-4 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-display font-bold text-sm text-brand-green-dark">Operating Hours</h3>
                  <p className="text-xs text-brand-charcoal/70 mt-1">Plant collection: 24/7 Operations</p>
                  <p className="text-xs text-brand-charcoal/70 mt-0.5">Office Support: 9:00 AM - 6:00 PM (Mon-Sat)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Card */}
          <div className="lg:col-span-7 bg-brand-cream border border-brand-cream-dark p-8 sm:p-10 rounded-3xl shadow-sm">
            {submitted ? (
              <div className="text-center py-12 animate-fade-in">
                <CheckCircle2 className="h-12 w-12 text-brand-green mx-auto mb-4" />
                <h3 className="text-xl font-bold text-brand-green-dark mb-2">Message Dispatched!</h3>
                <p className="text-sm text-brand-charcoal/70 max-w-sm mx-auto">
                  Thank you for reaching out. A representative from our help desk will contact you via email shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h3 className="text-xl font-display font-extrabold text-brand-green-dark mb-1">Write to Us</h3>
                  <p className="text-xs text-brand-charcoal/50">For general customer support, complaints, or feedback.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-xs font-bold text-brand-charcoal uppercase tracking-wider mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. John Doe"
                      className="w-full bg-brand-cream-light border border-brand-cream-dark focus:border-brand-green focus:ring-1 focus:ring-brand-green focus:outline-none rounded-xl px-4 py-3 text-sm text-brand-charcoal transition-all"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-xs font-bold text-brand-charcoal uppercase tracking-wider mb-2">
                      Your Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="e.g. john@example.com"
                      className="w-full bg-brand-cream-light border border-brand-cream-dark focus:border-brand-green focus:ring-1 focus:ring-brand-green focus:outline-none rounded-xl px-4 py-3 text-sm text-brand-charcoal transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-xs font-bold text-brand-charcoal uppercase tracking-wider mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="What is this regarding?"
                    className="w-full bg-brand-cream-light border border-brand-cream-dark focus:border-brand-green focus:ring-1 focus:ring-brand-green focus:outline-none rounded-xl px-4 py-3 text-sm text-brand-charcoal transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-xs font-bold text-brand-charcoal uppercase tracking-wider mb-2">
                    Message Details *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Detail your inquiry or request here..."
                    className="w-full bg-brand-cream-light border border-brand-cream-dark focus:border-brand-green focus:ring-1 focus:ring-brand-green focus:outline-none rounded-xl px-4 py-3 text-sm text-brand-charcoal transition-all"
                  />
                </div>

                <div>
                  <button
                    type="submit"
                    className="w-full bg-brand-green text-brand-cream hover:bg-brand-green-light hover:shadow-md font-bold py-4 rounded-xl text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="h-4 w-4" /> Send Message
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Google Maps Integration Representation */}
        <div className="w-full h-96 rounded-3xl overflow-hidden border border-brand-cream-dark relative shadow-sm">
          {/* Map canvas simulation with premium design */}
          <div className="absolute inset-0 bg-brand-cream-dark/40 flex flex-col items-center justify-center p-6 text-center">
            <MapPin className="h-10 w-10 text-brand-green mb-3 animate-bounce" />
            <h3 className="font-display font-bold text-lg text-brand-green-dark mb-1">Interactive Map Sourcing View</h3>
            <p className="text-xs text-brand-charcoal/70 max-w-sm mb-4">
              Our factory plant is located on Farm Road, NH-45, Melur. Direct transport links to major towns.
            </p>
            {/* Embedded map lookalike */}
            <div className="w-full max-w-lg h-44 rounded-xl bg-white border border-brand-cream-dark shadow-inner p-3 flex flex-col justify-between">
              <div className="flex justify-between items-center text-[10px] uppercase font-bold text-brand-charcoal/60">
                <span>Map Scale: 1:5000</span>
                <span className="text-brand-green flex items-center gap-1">● Live GPS Tracker enabled</span>
              </div>
              <div className="flex-1 flex items-center justify-center">
                {/* Styled vector grids representing roads */}
                <div className="w-full h-full relative overflow-hidden bg-brand-gray-light border border-dashed border-brand-cream-dark rounded-lg flex items-center justify-center">
                  <div className="absolute inset-x-0 h-4 bg-brand-cream-dark/50 top-1/2 -translate-y-1/2" />
                  <div className="absolute inset-y-0 w-4 bg-brand-cream-dark/50 left-1/3" />
                  <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-brand-green/20 border border-brand-green flex items-center justify-center">
                    <div className="h-2 w-2 rounded-full bg-brand-green" />
                  </div>
                  <span className="absolute top-3 right-3 text-[9px] bg-brand-green text-brand-cream px-1.5 py-0.5 rounded font-bold uppercase">DairyLuxe Plant</span>
                </div>
              </div>
              <div className="flex justify-between items-center text-[10px]">
                <span className="font-semibold text-brand-brown">Latitude: 9.9252° N</span>
                <span className="font-semibold text-brand-brown">Longitude: 78.1198° E</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
