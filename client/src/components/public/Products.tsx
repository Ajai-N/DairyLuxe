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
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.businessName.trim()) {
      newErrors.businessName = 'Business name is required.';
    }
    if (!formData.contactPerson.trim()) {
      newErrors.contactPerson = 'Contact person is required.';
    }
    const cleanPhone = formData.phone.trim();
    if (!cleanPhone) {
      newErrors.phone = 'Phone number is required.';
    } else if (!/^\d{10}$/.test(cleanPhone)) {
      newErrors.phone = 'Please enter a valid 10-digit mobile number.';
    }
    if (selectedProducts.length === 0) {
      newErrors.products = 'Please select at least one product.';
    }
    
    // Validate individual quantities
    selectedProducts.forEach(name => {
      const q = quantities[name];
      if (q === undefined || q === null || q <= 0) {
        newErrors[`qty_${name}`] = 'Quantity must be a positive number.';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProductToggle = (productName: string) => {
    setSelectedProducts(prev => {
      const isSelected = prev.includes(productName);
      if (isSelected) {
        setQuantities(q => {
          const copy = { ...q };
          delete copy[productName];
          return copy;
        });
        return prev.filter(name => name !== productName);
      } else {
        setQuantities(q => ({ ...q, [productName]: 10 }));
        return [...prev, productName];
      }
    });
    if (errors.products) {
      setErrors(prev => ({ ...prev, products: '' }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const selectedProductObjects = selectedProducts.map(name => 
      products.find(p => p.name === name)
    ).filter(Boolean) as typeof products;

    const totalAmount = selectedProductObjects.reduce((sum, p) => {
      const qty = quantities[p.name] || 0;
      return sum + (qty * p.price);
    }, 0);

    const requirementsString = selectedProductObjects.map(p => {
      const qty = quantities[p.name] || 0;
      const unitLabel = p.unit.toLowerCase().includes('litre') ? 'Litres' : 
                        p.unit.toLowerCase().includes('kg') ? 'kgs' : p.unit;
      return `${p.name} (${qty} ${unitLabel})`;
    }).join(', ');

    const quantityString = selectedProductObjects.map(p => {
      const qty = quantities[p.name] || 0;
      const unitLabel = p.unit.toLowerCase().includes('litre') ? 'Litres' : 
                        p.unit.toLowerCase().includes('kg') ? 'kgs' : p.unit;
      return `${qty} ${unitLabel}`;
    }).join(', ');

    submitBulkOrder({
      businessName: formData.businessName.trim(),
      contactPerson: formData.contactPerson.trim(),
      phone: formData.phone.trim(),
      requirements: requirementsString,
      quantity: quantityString,
      message: formData.message.trim(),
      amount: totalAmount
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
    setSelectedProducts([]);
    setQuantities({});
    setErrors({});
    setTimeout(() => setSubmitted(false), 5000);
  };

  const handleBulkScroll = (productName: string) => {
    if (!selectedProducts.includes(productName)) {
      setSelectedProducts(prev => [...prev, productName]);
      setQuantities(q => ({ ...q, [productName]: 10 }));
    }
    if (errors.products) {
      setErrors(prev => ({ ...prev, products: '' }));
    }
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
          {products.filter(product => !product.hidden).map((product) => (
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
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="businessName" className="block text-xs font-bold text-brand-charcoal uppercase tracking-wider mb-2">
                    Business Name *
                  </label>
                  <input
                    type="text"
                    id="businessName"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleChange}
                    placeholder="e.g. Saravana Caterers"
                    className={`w-full bg-brand-cream-light border ${errors.businessName ? 'border-red-500 ring-1 ring-red-500' : 'border-brand-cream-dark'} focus:border-brand-green focus:ring-1 focus:ring-brand-green focus:outline-none rounded-xl px-4 py-3 text-sm text-brand-charcoal transition-all`}
                  />
                  {errors.businessName && (
                    <p className="text-red-600 text-xs mt-1.5 font-semibold">{errors.businessName}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="contactPerson" className="block text-xs font-bold text-brand-charcoal uppercase tracking-wider mb-2">
                    Contact Person *
                  </label>
                  <input
                    type="text"
                    id="contactPerson"
                    name="contactPerson"
                    value={formData.contactPerson}
                    onChange={handleChange}
                    placeholder="e.g. Rajesh Pillai"
                    className={`w-full bg-brand-cream-light border ${errors.contactPerson ? 'border-red-500 ring-1 ring-red-500' : 'border-brand-cream-dark'} focus:border-brand-green focus:ring-1 focus:ring-brand-green focus:outline-none rounded-xl px-4 py-3 text-sm text-brand-charcoal transition-all`}
                  />
                  {errors.contactPerson && (
                    <p className="text-red-600 text-xs mt-1.5 font-semibold">{errors.contactPerson}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label htmlFor="phone" className="block text-xs font-bold text-brand-charcoal uppercase tracking-wider mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="e.g. 9876543210 (10 digit mobile)"
                    className={`w-full bg-brand-cream-light border ${errors.phone ? 'border-red-500 ring-1 ring-red-500' : 'border-brand-cream-dark'} focus:border-brand-green focus:ring-1 focus:ring-brand-green focus:outline-none rounded-xl px-4 py-3 text-sm text-brand-charcoal transition-all`}
                  />
                  {errors.phone && (
                    <p className="text-red-600 text-xs mt-1.5 font-semibold">{errors.phone}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-charcoal uppercase tracking-wider mb-2">
                  Product Requirements (Select all that apply) *
                </label>
                <div className={`grid grid-cols-2 sm:grid-cols-3 gap-3 bg-brand-cream-light border ${errors.products ? 'border-red-500 ring-1 ring-red-500' : 'border-brand-cream-dark'} p-4 rounded-xl`}>
                  {products.filter(p => !p.hidden).map((p) => (
                    <label key={p.id} className="flex items-center gap-2 text-xs text-brand-charcoal cursor-pointer select-none">
                      <input
                        type="checkbox"
                        name="requirements"
                        value={p.name}
                        checked={selectedProducts.includes(p.name)}
                        onChange={() => handleProductToggle(p.name)}
                        className="h-4 w-4 text-brand-green border-brand-cream-dark rounded focus:ring-brand-green bg-brand-cream-light cursor-pointer"
                      />
                      <span>{p.name}</span>
                    </label>
                  ))}
                </div>
                {errors.products && (
                  <p className="text-red-600 text-xs mt-1.5 font-semibold">{errors.products}</p>
                )}
              </div>

              {/* Dynamic selected list quantities */}
              {selectedProducts.length > 0 && (
                <div className="space-y-4 bg-brand-cream-light border border-brand-cream-dark p-6 rounded-2xl animate-fade-in">
                  <h4 className="text-xs uppercase font-extrabold text-brand-green-dark tracking-widest mb-2">
                    Specify Quantities
                  </h4>
                  <div className="space-y-3">
                    {(() => {
                      const selectedProductObjects = selectedProducts.map(name => 
                        products.find(p => p.name === name)
                      ).filter(Boolean) as typeof products;

                      const getUnitPrompt = (unit: string) => {
                        const u = unit.toLowerCase();
                        if (u.includes('litre')) return 'Enter Litres';
                        if (u.includes('kg')) return 'Enter kgs';
                        if (u.includes('g')) return `Enter units of ${unit}`;
                        if (u.includes('ml')) return `Enter units of ${unit}`;
                        return `Enter quantity (${unit})`;
                      };

                      return selectedProductObjects.map((p) => (
                        <div key={p.id} className="pb-3 border-b border-brand-cream-dark/50 last:border-0 last:pb-0">
                          <div className="flex flex-wrap items-center gap-3">
                            <span className="text-sm font-bold text-brand-charcoal">{p.name}</span>
                            <span className="text-brand-charcoal/40">—</span>
                            <div className="w-full sm:w-auto sm:flex-1 max-w-[200px]">
                              <input
                                type="number"
                                min="1"
                                value={quantities[p.name] !== undefined ? (quantities[p.name] === 0 ? '' : quantities[p.name]) : ''}
                                onChange={(e) => {
                                  const val = parseInt(e.target.value, 10);
                                  setQuantities(q => ({
                                    ...q,
                                    [p.name]: isNaN(val) ? 0 : val
                                  }));
                                  if (errors[`qty_${p.name}`]) {
                                    setErrors(prev => ({ ...prev, [`qty_${p.name}`]: '' }));
                                  }
                                }}
                                placeholder={getUnitPrompt(p.unit)}
                                className={`w-full bg-white border ${errors[`qty_${p.name}`] ? 'border-red-500 ring-1 ring-red-500' : 'border-brand-cream-dark'} focus:border-brand-green focus:ring-1 focus:ring-brand-green focus:outline-none rounded-xl px-4 py-2 text-sm text-brand-charcoal transition-all`}
                              />
                            </div>
                            <span className="text-xs text-brand-charcoal/50">(₹{p.price} / {p.unit})</span>
                            <span className="ml-auto text-sm font-bold text-brand-green-dark">
                              ₹{((quantities[p.name] || 0) * p.price).toLocaleString('en-IN')}
                            </span>
                          </div>
                          {errors[`qty_${p.name}`] && (
                            <p className="text-red-600 text-xs mt-1.5 font-semibold">{errors[`qty_${p.name}`]}</p>
                          )}
                        </div>
                      ));
                    })()}
                  </div>
                </div>
              )}

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

              {/* Total calculation shown at bottom */}
              {(() => {
                const selectedProductObjects = selectedProducts.map(name => 
                  products.find(p => p.name === name)
                ).filter(Boolean) as typeof products;

                const totalAmount = selectedProductObjects.reduce((sum, p) => {
                  const qty = quantities[p.name] || 0;
                  return sum + (qty * p.price);
                }, 0);

                if (selectedProducts.length > 0 && totalAmount > 0) {
                  return (
                    <div className="bg-brand-green-soft border border-brand-green/20 rounded-2xl p-5 flex justify-between items-center animate-fade-in">
                      <span className="text-sm font-bold text-brand-green-dark uppercase tracking-wider">Estimated Total Amount</span>
                      <span className="text-2xl font-display font-extrabold text-brand-green-dark">
                        ₹{totalAmount.toLocaleString('en-IN')}
                      </span>
                    </div>
                  );
                }
                return null;
              })()}

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
