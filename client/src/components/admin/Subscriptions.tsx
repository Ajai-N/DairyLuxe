import React, { useState } from 'react';
import { useApp, type SubscriptionCustomer } from '../../context/AppContext';
import { Search, Edit3, Eye, UserX, UserCheck, X, Coffee, CloudSun } from 'lucide-react';

export const Subscriptions: React.FC = () => {
  const { customers, updateCustomer, toggleCustomerStatus } = useApp();

  // Search & Edit states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCust, setSelectedCust] = useState<SubscriptionCustomer | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState<SubscriptionCustomer | null>(null);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const startEdit = (cust: SubscriptionCustomer) => {
    setEditFormData({ ...cust });
    setIsEditing(true);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (editFormData) {
      const val = e.target.name === 'quantity' ? parseFloat(e.target.value) : e.target.value;
      setEditFormData({ ...editFormData, [e.target.name]: val });
    }
  };

  const saveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editFormData) {
      updateCustomer(editFormData);
      setIsEditing(false);
      setSelectedCust(null);
    }
  };

  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Search Bar & Stats */}
      <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-2xl border border-brand-cream-dark shadow-sm justify-between items-center">
        <div className="relative w-full sm:max-w-xs">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-brand-charcoal/40">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="text"
            placeholder="Search by ID, name, or street..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full bg-brand-gray-light border border-brand-cream-dark focus:border-brand-green focus:ring-1 focus:ring-brand-green focus:outline-none rounded-xl pl-9 pr-4 py-2.5 text-xs text-brand-charcoal transition-all"
          />
        </div>
        <div className="text-xs text-brand-charcoal/40 font-semibold uppercase tracking-wider">
          Total Subscribers: {customers.length}
        </div>
      </div>

      {/* Grid Directory */}
      <div className="bg-white rounded-2xl border border-brand-cream-dark shadow-sm overflow-hidden">
        {filteredCustomers.length === 0 ? (
          <div className="p-12 text-center text-brand-charcoal/40">
            No active customers match your search criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-brand-gray-light text-brand-charcoal/60 border-b border-brand-cream-dark font-semibold uppercase tracking-wider">
                  <th className="p-4 pl-6">Customer ID</th>
                  <th className="p-4">Client Name</th>
                  <th className="p-4">Contact Phone</th>
                  <th className="p-4">Daily Volume</th>
                  <th className="p-4">Preferred Slot</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right pr-6">Manage Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-cream-dark">
                {filteredCustomers.map((cust) => (
                  <tr key={cust.id} className="hover:bg-brand-cream/10 transition-colors">
                    <td className="p-4 pl-6 font-mono font-bold text-brand-brown">{cust.id}</td>
                    <td className="p-4 font-semibold text-brand-charcoal">{cust.name}</td>
                    <td className="p-4 text-brand-charcoal/70">{cust.mobile}</td>
                    <td className="p-4 font-extrabold text-brand-green-dark">{cust.quantity} L / Day</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold ${
                        cust.deliveryTime === 'Morning' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}>
                        {cust.deliveryTime === 'Morning' ? <CloudSun className="h-3 w-3" /> : <Coffee className="h-3 w-3" />}
                        {cust.deliveryTime}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-[9px] font-extrabold uppercase ${
                        cust.status === 'Active' ? 'bg-brand-green-soft text-brand-green' : 'bg-red-50 text-red-800 border border-red-200'
                      }`}>
                        {cust.status}
                      </span>
                    </td>
                    <td className="p-4 pr-6 text-right space-x-2">
                      <button
                        onClick={() => setSelectedCust(cust)}
                        className="p-1.5 text-brand-charcoal hover:bg-brand-cream-dark rounded-lg transition-colors cursor-pointer"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => startEdit(cust)}
                        className="p-1.5 text-brand-brown hover:bg-brand-cream-dark rounded-lg transition-colors cursor-pointer"
                        title="Edit Subscription"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => toggleCustomerStatus(cust.id)}
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                          cust.status === 'Active' ? 'text-red-700 hover:bg-red-50' : 'text-brand-green hover:bg-brand-green-soft'
                        }`}
                        title={cust.status === 'Active' ? 'Deactivate Customer' : 'Activate Customer'}
                      >
                        {cust.status === 'Active' ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* View Detail Modal */}
      {selectedCust && !isEditing && (
        <div className="fixed inset-0 bg-brand-charcoal/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-brand-cream border border-brand-cream-dark max-w-md w-full rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl animate-scale-up">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-display font-extrabold text-xl text-brand-green-dark">Subscriber Profile</h3>
                <span className="text-[10px] text-brand-brown font-mono font-bold">{selectedCust.id}</span>
              </div>
              <button
                onClick={() => setSelectedCust(null)}
                className="p-1 hover:bg-brand-cream-dark rounded-full text-brand-charcoal/60"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="block text-[9px] uppercase font-bold text-brand-charcoal/40">Full Name</span>
                  <span className="font-semibold text-brand-charcoal text-sm">{selectedCust.name}</span>
                </div>
                <div>
                  <span className="block text-[9px] uppercase font-bold text-brand-charcoal/40">Contact Phone</span>
                  <span className="font-semibold text-brand-charcoal text-sm">{selectedCust.mobile}</span>
                </div>
              </div>

              <div>
                <span className="block text-[9px] uppercase font-bold text-brand-charcoal/40">Registered Delivery Location</span>
                <span className="font-medium text-brand-charcoal leading-relaxed block">{selectedCust.address}</span>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-brand-cream-dark pt-4">
                <div>
                  <span className="block text-[9px] uppercase font-bold text-brand-charcoal/40">Daily Volume Allocation</span>
                  <span className="font-bold text-brand-green-dark text-sm">{selectedCust.quantity} Litres</span>
                </div>
                <div>
                  <span className="block text-[9px] uppercase font-bold text-brand-charcoal/40">Preferred Delivery Slot</span>
                  <span className="font-semibold text-brand-charcoal text-sm">{selectedCust.deliveryTime} Slot</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="block text-[9px] uppercase font-bold text-brand-charcoal/40">Enrollment Date</span>
                  <span className="font-semibold text-brand-charcoal">{selectedCust.createdAt}</span>
                </div>
                <div>
                  <span className="block text-[9px] uppercase font-bold text-brand-charcoal/40">Subscription Status</span>
                  <span className="font-semibold text-brand-green">{selectedCust.status}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setSelectedCust(null)}
                className="bg-brand-green text-brand-cream hover:bg-brand-green-light font-bold px-6 py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
              >
                Close Record
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Form Modal */}
      {isEditing && editFormData && (
        <div className="fixed inset-0 bg-brand-charcoal/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={saveEdit} className="bg-brand-cream border border-brand-cream-dark max-w-md w-full rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl animate-scale-up">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-display font-extrabold text-xl text-brand-green-dark">Edit Subscription Config</h3>
                <span className="text-[10px] text-brand-brown font-mono font-bold">{editFormData.id}</span>
              </div>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="p-1 hover:bg-brand-cream-dark rounded-full text-brand-charcoal/60"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-brand-charcoal uppercase tracking-wider mb-2">Customer Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={editFormData.name}
                  onChange={handleEditChange}
                  className="w-full bg-brand-cream-light border border-brand-cream-dark focus:border-brand-green focus:ring-1 focus:ring-brand-green focus:outline-none rounded-xl px-3 py-2 text-xs text-brand-charcoal transition-all"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-brand-charcoal uppercase tracking-wider mb-2">Mobile Number</label>
                <input
                  type="tel"
                  name="mobile"
                  required
                  value={editFormData.mobile}
                  onChange={handleEditChange}
                  className="w-full bg-brand-cream-light border border-brand-cream-dark focus:border-brand-green focus:ring-1 focus:ring-brand-green focus:outline-none rounded-xl px-3 py-2 text-xs text-brand-charcoal transition-all"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-brand-charcoal uppercase tracking-wider mb-2">Delivery Address</label>
                <input
                  type="text"
                  name="address"
                  required
                  value={editFormData.address}
                  onChange={handleEditChange}
                  className="w-full bg-brand-cream-light border border-brand-cream-dark focus:border-brand-green focus:ring-1 focus:ring-brand-green focus:outline-none rounded-xl px-3 py-2 text-xs text-brand-charcoal transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-brand-charcoal uppercase tracking-wider mb-2">Quantity (Litres)</label>
                  <input
                    type="number"
                    name="quantity"
                    required
                    min={0.5}
                    max={10}
                    step={0.5}
                    value={editFormData.quantity}
                    onChange={handleEditChange}
                    className="w-full bg-brand-cream-light border border-brand-cream-dark focus:border-brand-green focus:ring-1 focus:ring-brand-green focus:outline-none rounded-xl px-3 py-2 text-xs text-brand-charcoal transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-brand-charcoal uppercase tracking-wider mb-2">Delivery Slot</label>
                  <select
                    name="deliveryTime"
                    required
                    value={editFormData.deliveryTime}
                    onChange={handleEditChange}
                    className="w-full bg-brand-cream-light border border-brand-cream-dark focus:border-brand-green focus:ring-1 focus:ring-brand-green focus:outline-none rounded-xl px-3 py-2 text-xs text-brand-charcoal transition-all"
                  >
                    <option value="Morning">Morning</option>
                    <option value="Evening">Evening</option>
                    <option value="Both">Both (Morning & Evening)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-2 border-t border-brand-cream-dark">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="bg-brand-cream-dark text-brand-charcoal hover:bg-brand-cream-dark/80 font-bold px-5 py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-brand-green text-brand-cream hover:bg-brand-green-light font-bold px-5 py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
