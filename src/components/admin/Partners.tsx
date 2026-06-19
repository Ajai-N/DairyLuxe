import React, { useState } from 'react';
import { useApp, type Partner } from '../../context/AppContext';
import { Search, Edit3, Eye, UserX, UserCheck, X } from 'lucide-react';

export const Partners: React.FC = () => {
  const { partners, updatePartner, togglePartnerStatus } = useApp();
  
  // Search & Edit state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState<Partner | null>(null);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const startEdit = (partner: Partner) => {
    setEditFormData({ ...partner });
    setIsEditing(true);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (editFormData) {
      setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
    }
  };

  const saveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editFormData) {
      updatePartner(editFormData);
      setIsEditing(false);
      setSelectedPartner(null);
    }
  };

  const filteredPartners = partners.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.village.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-2xl border border-brand-cream-dark shadow-sm justify-between items-center">
        <div className="relative w-full sm:max-w-xs">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-brand-charcoal/40">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="text"
            placeholder="Search by ID, name, or village..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full bg-brand-gray-light border border-brand-cream-dark focus:border-brand-green focus:ring-1 focus:ring-brand-green focus:outline-none rounded-xl pl-9 pr-4 py-2.5 text-xs text-brand-charcoal transition-all"
          />
        </div>
        <div className="text-xs text-brand-charcoal/40 font-semibold uppercase tracking-wider">
          Total Registered Partners: {partners.length}
        </div>
      </div>

      {/* Directory Grid */}
      <div className="bg-white rounded-2xl border border-brand-cream-dark shadow-sm overflow-hidden">
        {filteredPartners.length === 0 ? (
          <div className="p-12 text-center text-brand-charcoal/40">
            No active dairy partners match your search criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-brand-gray-light text-brand-charcoal/60 border-b border-brand-cream-dark font-semibold uppercase tracking-wider">
                  <th className="p-4 pl-6">Partner ID</th>
                  <th className="p-4">Farmer Name</th>
                  <th className="p-4">Mobile Number</th>
                  <th className="p-4">Village Sourcing Point</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right pr-6">Manage Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-cream-dark">
                {filteredPartners.map((partner) => (
                  <tr key={partner.id} className="hover:bg-brand-cream/10 transition-colors">
                    <td className="p-4 pl-6 font-mono font-bold text-brand-brown">{partner.id}</td>
                    <td className="p-4 font-semibold text-brand-charcoal">{partner.name}</td>
                    <td className="p-4 text-brand-charcoal/70">{partner.mobile}</td>
                    <td className="p-4 text-brand-charcoal/60">{partner.village}, {partner.district}</td>
                    <td className="p-4">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-[9px] font-extrabold uppercase ${
                        partner.status === 'Active' ? 'bg-brand-green-soft text-brand-green' : 'bg-red-50 text-red-800 border border-red-200'
                      }`}>
                        {partner.status}
                      </span>
                    </td>
                    <td className="p-4 pr-6 text-right space-x-2">
                      <button
                        onClick={() => setSelectedPartner(partner)}
                        className="p-1.5 text-brand-charcoal hover:bg-brand-cream-dark rounded-lg transition-colors cursor-pointer"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => startEdit(partner)}
                        className="p-1.5 text-brand-brown hover:bg-brand-cream-dark rounded-lg transition-colors cursor-pointer"
                        title="Edit Info"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => togglePartnerStatus(partner.id)}
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                          partner.status === 'Active' ? 'text-red-700 hover:bg-red-50' : 'text-brand-green hover:bg-brand-green-soft'
                        }`}
                        title={partner.status === 'Active' ? 'Deactivate Partner' : 'Activate Partner'}
                      >
                        {partner.status === 'Active' ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Details View Modal */}
      {selectedPartner && !isEditing && (
        <div className="fixed inset-0 bg-brand-charcoal/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-brand-cream border border-brand-cream-dark max-w-md w-full rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl animate-scale-up">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-display font-extrabold text-xl text-brand-green-dark">Partner Record Profile</h3>
                <span className="text-[10px] text-brand-brown font-mono font-bold">{selectedPartner.id}</span>
              </div>
              <button
                onClick={() => setSelectedPartner(null)}
                className="p-1 hover:bg-brand-cream-dark rounded-full text-brand-charcoal/60"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="block text-[9px] uppercase font-bold text-brand-charcoal/40">Farmer Name</span>
                  <span className="font-semibold text-brand-charcoal text-sm">{selectedPartner.name}</span>
                </div>
                <div>
                  <span className="block text-[9px] uppercase font-bold text-brand-charcoal/40">Contact Phone</span>
                  <span className="font-semibold text-brand-charcoal text-sm">{selectedPartner.mobile}</span>
                </div>
              </div>

              <div>
                <span className="block text-[9px] uppercase font-bold text-brand-charcoal/40">Address Location</span>
                <span className="font-medium text-brand-charcoal block">{selectedPartner.address}</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="block text-[9px] uppercase font-bold text-brand-charcoal/40">Village Hub</span>
                  <span className="font-semibold text-brand-charcoal">{selectedPartner.village}</span>
                </div>
                <div>
                  <span className="block text-[9px] uppercase font-bold text-brand-charcoal/40">District Sourcing</span>
                  <span className="font-semibold text-brand-charcoal">{selectedPartner.district}</span>
                </div>
              </div>

              <div className="border-t border-brand-cream-dark pt-4">
                <span className="block text-[9px] uppercase font-bold text-brand-brown-light tracking-wide mb-1">Cattle Inventory & Experience</span>
                <p className="text-brand-charcoal/70 italic bg-brand-cream-light p-3 rounded-xl border border-brand-cream-dark/60 leading-relaxed">
                  "{selectedPartner.experience}"
                </p>
              </div>

              <div>
                <span className="block text-[9px] uppercase font-bold text-brand-brown-light tracking-wide mb-1">Motivation Response</span>
                <p className="text-brand-charcoal/70 italic bg-brand-cream-light p-3 rounded-xl border border-brand-cream-dark/60 leading-relaxed">
                  "{selectedPartner.whyJoin}"
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedPartner(null)}
                className="bg-brand-green text-brand-cream hover:bg-brand-green-light font-bold px-6 py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
              >
                Close Record
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Info Modal */}
      {isEditing && editFormData && (
        <div className="fixed inset-0 bg-brand-charcoal/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={saveEdit} className="bg-brand-cream border border-brand-cream-dark max-w-md w-full rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl animate-scale-up">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-display font-extrabold text-xl text-brand-green-dark">Edit Partner Profile</h3>
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
                <label className="block text-[10px] font-bold text-brand-charcoal uppercase tracking-wider mb-2">Farmer Name</label>
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
                <label className="block text-[10px] font-bold text-brand-charcoal uppercase tracking-wider mb-2">Permanent Address</label>
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
                  <label className="block text-[10px] font-bold text-brand-charcoal uppercase tracking-wider mb-2">Village</label>
                  <input
                    type="text"
                    name="village"
                    required
                    value={editFormData.village}
                    onChange={handleEditChange}
                    className="w-full bg-brand-cream-light border border-brand-cream-dark focus:border-brand-green focus:ring-1 focus:ring-brand-green focus:outline-none rounded-xl px-3 py-2 text-xs text-brand-charcoal transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-brand-charcoal uppercase tracking-wider mb-2">District</label>
                  <input
                    type="text"
                    name="district"
                    required
                    value={editFormData.district}
                    onChange={handleEditChange}
                    className="w-full bg-brand-cream-light border border-brand-cream-dark focus:border-brand-green focus:ring-1 focus:ring-brand-green focus:outline-none rounded-xl px-3 py-2 text-xs text-brand-charcoal transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-brand-charcoal uppercase tracking-wider mb-2">Cattle Bio & Experience</label>
                <textarea
                  name="experience"
                  required
                  rows={2}
                  value={editFormData.experience}
                  onChange={handleEditChange}
                  className="w-full bg-brand-cream-light border border-brand-cream-dark focus:border-brand-green focus:ring-1 focus:ring-brand-green focus:outline-none rounded-xl px-3 py-2 text-xs text-brand-charcoal transition-all"
                />
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
                Save Profile
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
