import React, { useState } from 'react';
import { useApp, type Product } from '../../context/AppContext';
import { Plus, Edit, Trash2, X, Image, Eye, EyeOff } from 'lucide-react';

export const Products: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useApp();

  // Dialog State
  const [isOpen, setIsOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    unit: 'Litre',
    image: '',
    available: true,
    hidden: false,
    benefitsString: ''
  });

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: 50,
      unit: 'Litre',
      image: '',
      available: true,
      hidden: false,
      benefitsString: ''
    });
    setIsOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      unit: product.unit,
      image: product.image,
      available: product.available,
      hidden: product.hidden || false,
      benefitsString: product.benefits.join('\n')
    });
    setIsOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let finalVal: any = value;
    if (name === 'price') finalVal = parseFloat(value) || 0;
    if (name === 'available' || name === 'hidden') {
      const checkbox = e.target as HTMLInputElement;
      finalVal = checkbox.checked;
    }
    setFormData({ ...formData, [name]: finalVal });
  };

  const handleToggleAvailable = (product: Product) => {
    updateProduct({
      ...product,
      available: !product.available
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const benefits = formData.benefitsString
      .split('\n')
      .map(b => b.trim())
      .filter(b => b.length > 0);

    const productPayload = {
      name: formData.name,
      description: formData.description,
      price: formData.price,
      unit: formData.unit,
      image: formData.image || 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80&w=600',
      available: formData.available,
      hidden: formData.hidden,
      benefits: benefits.length > 0 ? benefits : ['Fresh & Natural', 'Locally Sourced']
    };

    if (editingProduct) {
      updateProduct({
        ...productPayload,
        id: editingProduct.id
      });
    } else {
      addProduct(productPayload);
    }
    setIsOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Action Header */}
      <div className="flex bg-white p-4 rounded-2xl border border-brand-cream-dark shadow-sm justify-between items-center">
        <div className="text-xs text-brand-charcoal/40 font-semibold uppercase tracking-wider">
          Products Inventory Count: {products.length}
        </div>
        <button
          onClick={openAddModal}
          className="bg-brand-green text-brand-cream hover:bg-brand-green-light px-4 py-2.5 rounded-xl font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="h-4 w-4" /> Add Product
        </button>
      </div>

      {/* Products Admin Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((p) => (
          <div key={p.id} className="bg-white rounded-2xl overflow-hidden border border-brand-cream-dark shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            
            {/* Top Info */}
            <div>
              <div className="h-48 overflow-hidden relative bg-brand-cream-dark">
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-3 left-3 bg-brand-green text-brand-cream text-[10px] font-extrabold uppercase px-2 py-0.5 rounded shadow">
                  ₹{p.price} / {p.unit}
                </span>
                
                {/* Available Status Overlay badge */}
                <button
                  onClick={() => handleToggleAvailable(p)}
                  className={`absolute top-3 right-3 px-2 py-0.5 rounded text-[10px] font-extrabold uppercase shadow cursor-pointer ${
                    p.available ? 'bg-brand-green-soft text-brand-green' : 'bg-red-600 text-brand-cream'
                  }`}
                >
                  {p.available ? 'In Stock' : 'Out of Stock'}
                </button>
                
                {/* Hidden Status Overlay badge */}
                {p.hidden && (
                  <span className="absolute top-11 right-3 bg-amber-600 text-brand-cream px-2 py-0.5 rounded text-[10px] font-extrabold uppercase shadow">
                    Hidden
                  </span>
                )}
              </div>

              <div className="p-6 space-y-3">
                <h3 className="font-display font-bold text-lg text-brand-green-dark">{p.name}</h3>
                <p className="text-xs text-brand-charcoal/60 leading-relaxed line-clamp-3">{p.description}</p>
                
                <div className="pt-2 border-t border-brand-cream-dark">
                  <span className="text-[9px] uppercase font-bold text-brand-charcoal/40 block mb-1">Configured Benefits</span>
                  <div className="flex flex-wrap gap-1">
                    {p.benefits.map((b, i) => (
                      <span key={i} className="bg-brand-cream text-brand-charcoal/70 px-2 py-0.5 rounded text-[9px] border border-brand-cream-dark">
                        {b}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-6 pt-0 border-t border-brand-cream-dark/50 flex gap-2 justify-end mt-4">
              <button
                onClick={() => {
                  updateProduct({
                    ...p,
                    hidden: !p.hidden
                  });
                }}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-bold text-[10px] uppercase transition-colors cursor-pointer ${
                  p.hidden
                    ? 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
                    : 'bg-brand-cream text-brand-green-dark hover:bg-brand-cream-dark border border-brand-cream-dark'
                }`}
                title={p.hidden ? 'Unhide product from catalog' : 'Hide product from catalog'}
              >
                {p.hidden ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                {p.hidden ? 'Unhide' : 'Hide'}
              </button>
              <button
                onClick={() => openEditModal(p)}
                className="flex items-center gap-1 bg-brand-cream text-brand-brown hover:bg-brand-cream-dark px-3 py-1.5 rounded-lg font-bold text-[10px] uppercase transition-colors cursor-pointer"
              >
                <Edit className="h-3.5 w-3.5" /> Edit
              </button>
              <button
                onClick={() => { if(confirm(`Are you sure you want to delete "${p.name}"?`)) deleteProduct(p.id); }}
                className="flex items-center gap-1 bg-red-50 text-red-800 border border-red-200 hover:bg-red-100 px-3 py-1.5 rounded-lg font-bold text-[10px] uppercase transition-colors cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" /> Delete
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* Add / Edit Form Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-brand-charcoal/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleSubmit} className="bg-brand-cream border border-brand-cream-dark max-w-md w-full rounded-3xl p-6 sm:p-8 space-y-5 shadow-xl animate-scale-up">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-display font-extrabold text-xl text-brand-green-dark">
                  {editingProduct ? 'Edit Catalog Product' : 'Add New Product'}
                </h3>
                <span className="text-[10px] text-brand-charcoal/40 font-bold uppercase tracking-wider">
                  {editingProduct ? editingProduct.id : 'New Inventory Record'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-brand-cream-dark rounded-full text-brand-charcoal/60"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-brand-charcoal uppercase tracking-wider mb-2">Product Name *</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Raw A2 Buffalo Milk"
                  className="w-full bg-brand-cream-light border border-brand-cream-dark focus:border-brand-green focus:ring-1 focus:ring-brand-green focus:outline-none rounded-xl px-3 py-2 text-xs text-brand-charcoal transition-all"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-brand-charcoal uppercase tracking-wider mb-2">Description *</label>
                <textarea
                  name="description"
                  required
                  rows={2}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Detailed public-facing product copy..."
                  className="w-full bg-brand-cream-light border border-brand-cream-dark focus:border-brand-green focus:ring-1 focus:ring-brand-green focus:outline-none rounded-xl px-3 py-2 text-xs text-brand-charcoal transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-brand-charcoal uppercase tracking-wider mb-2">Price (₹) *</label>
                  <input
                    type="number"
                    name="price"
                    required
                    min={1}
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full bg-brand-cream-light border border-brand-cream-dark focus:border-brand-green focus:ring-1 focus:ring-brand-green focus:outline-none rounded-xl px-3 py-2 text-xs text-brand-charcoal transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-brand-charcoal uppercase tracking-wider mb-2">Selling Unit *</label>
                  <select
                    name="unit"
                    required
                    value={formData.unit}
                    onChange={handleChange}
                    className="w-full bg-brand-cream-light border border-brand-cream-dark focus:border-brand-green focus:ring-1 focus:ring-brand-green focus:outline-none rounded-xl px-3 py-2 text-xs text-brand-charcoal transition-all"
                  >
                    <option value="Litre">Litre</option>
                    <option value="500ml">500ml</option>
                    <option value="300ml">300ml</option>
                    <option value="500g">500g</option>
                    <option value="1kg">1kg</option>
                    <option value="Bottle">Bottle</option>
                    <option value="Pack">Pack</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-brand-charcoal uppercase tracking-wider mb-2">Image URL</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-brand-charcoal/40">
                    <Image className="h-4 w-4" />
                  </div>
                  <input
                    type="url"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-brand-cream-light border border-brand-cream-dark focus:border-brand-green focus:ring-1 focus:ring-brand-green focus:outline-none rounded-xl pl-9 pr-4 py-2 text-xs text-brand-charcoal transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-brand-charcoal uppercase tracking-wider mb-2">Product Benefits (one per line) *</label>
                <textarea
                  name="benefitsString"
                  rows={2}
                  value={formData.benefitsString}
                  onChange={handleChange}
                  placeholder="e.g.&#10;Probiotic support&#10;Rich in calcium&#10;No stabilizers added"
                  className="w-full bg-brand-cream-light border border-brand-cream-dark focus:border-brand-green focus:ring-1 focus:ring-brand-green focus:outline-none rounded-xl px-3 py-2 text-xs text-brand-charcoal transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="available"
                    name="available"
                    checked={formData.available}
                    onChange={handleChange}
                    className="h-4 w-4 text-brand-green border-brand-cream-dark rounded focus:ring-brand-green bg-brand-cream-light cursor-pointer"
                  />
                  <label htmlFor="available" className="ml-2.5 text-xs text-brand-charcoal/70 select-none cursor-pointer">
                    Available for Sale
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="hidden"
                    name="hidden"
                    checked={formData.hidden}
                    onChange={handleChange}
                    className="h-4 w-4 text-brand-green border-brand-cream-dark rounded focus:ring-brand-green bg-brand-cream-light cursor-pointer"
                  />
                  <label htmlFor="hidden" className="ml-2.5 text-xs text-brand-charcoal/70 select-none cursor-pointer">
                    Hide from Catalog
                  </label>
                </div>
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-2 border-t border-brand-cream-dark">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="bg-brand-cream-dark text-brand-charcoal hover:bg-brand-cream-dark/80 font-bold px-5 py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-brand-green text-brand-cream hover:bg-brand-green-light font-bold px-5 py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
              >
                {editingProduct ? 'Save Product' : 'Create Product'}
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
