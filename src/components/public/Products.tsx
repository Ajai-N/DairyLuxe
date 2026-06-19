import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, ShoppingCart, Send, Info } from 'lucide-react';

export const Products: React.FC = () => {
  const { products, submitBulkOrder } = useApp();
  
  // Form State
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
    submitBulkOrder({
      businessName: formData.businessName,
      contactPerson: formData.contactPerson,
      phone: formData.phone,
      requirements: formData.requirements,
      quantity: formData.quantity,
      message: formData.message
    });
    setSubmitted(true);
    setFormData({
      businessName: '',
      contactPerson: '',
      phone: '',
      requirements: '',
      quantity: '',
      message: ''
    });
    setTimeout(() => setSubmitted(false), 5000);
  };

  const handleBulkScroll = (productName: string) => {
    setFormData(prev => ({
      ...prev,
      requirements: `Inquiry for ${productName}`
    }));
    const element = document.getElementById('bulk-inquiry-form');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-brand-cream-light py-16 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase font-extrabold tracking-widest text-brand-green bg-brand-green-soft px-3.5 py-1.5 rounded-full border border-brand-green/20">
            Fresh Catalog
          </span>
          <h1 className="text-4xl sm:text-5xl font-display font-extrabold text-brand-green-dark mt-4 mb-6">
            Our Premium Products
          </h1>
          <p className="text-base sm:text-lg text-brand-charcoal/80 leading-relaxed">
            Every product is prepared from fresh, chemical-free raw milk collected daily. Pure processing, traditional methods, and rich flavors.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-brand-cream rounded-3xl overflow-hidden border border-brand-cream-dark shadow-sm flex flex-col justify-between hover-card-effect h-full"
            >
              <div>
                <div className="h-64 overflow-hidden relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-brand-green text-brand-cream text-xs font-bold px-3 py-1 rounded-full border border-brand-cream-dark">
                    ₹{product.price} / {product.unit}
                  </div>
                  {!product.available && (
                    <div className="absolute inset-0 bg-brand-charcoal/60 backdrop-blur-[2px] flex items-center justify-center">
                      <span className="bg-red-600 text-brand-cream text-sm font-black px-4 py-2 rounded-full uppercase tracking-wider">
                        Temporarily Out of Stock
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-8">
                  <h3 className="font-display font-bold text-2xl text-brand-green-dark mb-3">
                    {product.name}
                  </h3>
                  <p className="text-sm text-brand-charcoal/70 leading-relaxed mb-6">
                    {product.description}
                  </p>

                  <div className="border-t border-brand-cream-dark pt-6">
                    <h4 className="text-xs uppercase font-extrabold text-brand-brown-light tracking-widest mb-3 flex items-center gap-1.5">
                      <Info className="h-3.5 w-3.5" /> Key Benefits & Purity
                    </h4>
                    <ul className="space-y-2">
                      {product.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-start text-xs text-brand-charcoal/80 leading-relaxed">
                          <CheckCircle2 className="h-4 w-4 text-brand-green mr-2.5 flex-shrink-0 mt-0.5" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="p-8 pt-0">
                <button
                  disabled={!product.available}
                  onClick={() => handleBulkScroll(product.name)}
                  className={`w-full font-bold py-3.5 px-6 rounded-xl text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    product.available
                      ? 'bg-brand-green text-brand-cream hover:bg-brand-green-light hover:shadow-md'
                      : 'bg-brand-cream-dark text-brand-charcoal/40 cursor-not-allowed'
                  }`}
                >
                  <ShoppingCart className="h-4 w-4" /> Bulk Order Inquiry
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Bulk Inquiry Form Section */}
        <div id="bulk-inquiry-form" className="max-w-4xl mx-auto bg-brand-cream rounded-3xl border border-brand-cream-dark p-8 sm:p-12 shadow-md">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-3xl font-display font-extrabold text-brand-green-dark mb-3">
              Bulk Order Inquiry
            </h2>
            <p className="text-sm text-brand-charcoal/70">
              For cafes, hotels, caterers, and institutions. Fill out the details below and our logistics coordinator will reach out in 24 hours.
            </p>
          </div>

          {submitted ? (
            <div className="bg-brand-green-soft border border-brand-green/20 rounded-2xl p-8 text-center animate-fade-in">
              <CheckCircle2 className="h-12 w-12 text-brand-green mx-auto mb-4" />
              <h3 className="text-xl font-bold text-brand-green-dark mb-2">Inquiry Submitted!</h3>
              <p className="text-sm text-brand-charcoal/70">
                Thank you for your business interest. We have received your requirements and will contact you shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
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
                    placeholder="e.g. Saravana Caterers"
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
                    placeholder="e.g. Rajesh Pillai"
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
                    Product Requirements *
                  </label>
                  <select
                    id="requirements"
                    name="requirements"
                    required
                    value={formData.requirements}
                    onChange={handleChange}
                    className="w-full bg-brand-cream-light border border-brand-cream-dark focus:border-brand-green focus:ring-1 focus:ring-brand-green focus:outline-none rounded-xl px-4 py-3 text-sm text-brand-charcoal transition-all"
                  >
                    <option value="">Select Primary Product</option>
                    <option value="Raw Milk (Bulk)">Raw Milk</option>
                    <option value="Butter (Bulk)">Creamery Butter</option>
                    <option value="Curd (Bulk)">Thick Curd</option>
                    <option value="Buttermilk (Bulk)">Spiced Buttermilk</option>
                    <option value="Rose Milk (Bulk)">Organic Rose Milk</option>
                    <option value="Badam Milk (Bulk)">Saffron Badam Milk</option>
                    <option value="Multiple Products">Multiple / Combo Bulk</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="quantity" className="block text-xs font-bold text-brand-charcoal uppercase tracking-wider mb-2">
                  Expected Volume / Quantity (e.g. 50 Litres daily, 20kg weekly) *
                </label>
                <input
                  type="text"
                  id="quantity"
                  name="quantity"
                  required
                  value={formData.quantity}
                  onChange={handleChange}
                  placeholder="e.g. 100 Litres daily"
                  className="w-full bg-brand-cream-light border border-brand-cream-dark focus:border-brand-green focus:ring-1 focus:ring-brand-green focus:outline-none rounded-xl px-4 py-3 text-sm text-brand-charcoal transition-all"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-xs font-bold text-brand-charcoal uppercase tracking-wider mb-2">
                  Delivery Details / Specific Instructions
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us about your delivery timings, frequency, or packaging customization requests..."
                  className="w-full bg-brand-cream-light border border-brand-cream-dark focus:border-brand-green focus:ring-1 focus:ring-brand-green focus:outline-none rounded-xl px-4 py-3 text-sm text-brand-charcoal transition-all"
                />
              </div>

              <div className="text-center pt-2">
                <button
                  type="submit"
                  className="bg-brand-green text-brand-cream hover:bg-brand-green-light hover:shadow-lg font-bold px-8 py-4 rounded-xl text-sm transition-all flex items-center justify-center gap-2 mx-auto cursor-pointer"
                >
                  <Send className="h-4 w-4" /> Send Bulk Inquiry
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
