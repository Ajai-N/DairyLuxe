import React, { useState } from 'react';
import { useApp, type Worker } from '../../context/AppContext';
import { Search, Edit3, UserPlus, UserX, UserCheck, X, Contact } from 'lucide-react';

export const Workers: React.FC = () => {
  const { workers, addWorker, updateWorker, toggleWorkerStatus } = useApp();

  // Search & Modal State
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [editFormData, setEditFormData] = useState<Worker | null>(null);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !mobile.trim()) {
      alert('Please fill in all fields.');
      return;
    }
    addWorker({ name, mobile });
    setName('');
    setMobile('');
    setIsAddModalOpen(false);
    alert('Worker registered successfully! Default password is "worker123".');
  };

  const startEdit = (worker: Worker) => {
    setEditFormData({ ...worker });
    setIsEditing(true);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editFormData) {
      setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
    }
  };

  const saveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editFormData) {
      updateWorker(editFormData);
      setIsEditing(false);
    }
  };

  const filteredWorkers = workers.filter(w =>
    w.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    w.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Search and Add Worker actions */}
      <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-2xl border border-brand-cream-dark shadow-sm justify-between items-center">
        <div className="relative w-full sm:max-w-xs">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-brand-charcoal/40">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="text"
            placeholder="Search workers by Name or ID..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full bg-brand-gray-light border border-brand-cream-dark focus:border-brand-green focus:ring-1 focus:ring-brand-green focus:outline-none rounded-xl pl-9 pr-4 py-2.5 text-xs text-brand-charcoal transition-all"
          />
        </div>

        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
          <div className="text-xs text-brand-charcoal/40 font-semibold uppercase tracking-wider hidden md:block">
            Total Workers: {workers.length}
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-brand-green hover:bg-brand-green-light text-brand-cream font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-sm transition-all"
          >
            <UserPlus className="h-4 w-4" /> Add New Worker
          </button>
        </div>
      </div>

      {/* Directory list of workers */}
      <div className="bg-white rounded-2xl border border-brand-cream-dark shadow-sm overflow-hidden">
        {filteredWorkers.length === 0 ? (
          <div className="p-12 text-center text-brand-charcoal/40">
            No company workers match your search criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-brand-gray-light text-brand-charcoal/60 border-b border-brand-cream-dark font-semibold uppercase tracking-wider">
                  <th className="p-4 pl-6">Worker ID</th>
                  <th className="p-4">Full Name</th>
                  <th className="p-4">Contact Phone</th>
                  <th className="p-4">Date Added</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right pr-6">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-cream-dark">
                {filteredWorkers.map((worker) => (
                  <tr key={worker.id} className="hover:bg-brand-cream/10 transition-colors">
                    <td className="p-4 pl-6 font-mono font-bold text-brand-brown">{worker.id}</td>
                    <td className="p-4 font-semibold text-brand-charcoal">{worker.name}</td>
                    <td className="p-4 text-brand-charcoal/70">{worker.mobile}</td>
                    <td className="p-4 text-brand-charcoal/50">{worker.createdAt}</td>
                    <td className="p-4">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-[9px] font-extrabold uppercase ${
                        worker.status === 'Active' ? 'bg-brand-green-soft text-brand-green' : 'bg-red-50 text-red-800 border border-red-200'
                      }`}>
                        {worker.status}
                      </span>
                    </td>
                    <td className="p-4 pr-6 text-right space-x-2">
                      <button
                        onClick={() => startEdit(worker)}
                        className="p-1.5 text-brand-brown hover:bg-brand-cream-dark rounded-lg transition-colors cursor-pointer inline-flex items-center"
                        title="Edit Worker Info"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => toggleWorkerStatus(worker.id)}
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer inline-flex items-center ${
                          worker.status === 'Active' ? 'text-red-700 hover:bg-red-50' : 'text-brand-green hover:bg-brand-green-soft'
                        }`}
                        title={worker.status === 'Active' ? 'Suspend Worker' : 'Activate Worker'}
                      >
                        {worker.status === 'Active' ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Worker Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-brand-charcoal/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleAddSubmit} className="bg-brand-cream border border-brand-cream-dark max-w-md w-full rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl animate-scale-up">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2.5">
                <Contact className="h-5 w-5 text-brand-green" />
                <h3 className="font-display font-extrabold text-xl text-brand-green-dark">Register Worker</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 hover:bg-brand-cream-dark rounded-full text-brand-charcoal/60"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-brand-charcoal uppercase tracking-wider mb-2">Worker Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-brand-cream-light border border-brand-cream-dark focus:border-brand-green focus:ring-1 focus:ring-brand-green focus:outline-none rounded-xl px-3 py-2.5 text-xs text-brand-charcoal transition-all"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-brand-charcoal uppercase tracking-wider mb-2">Mobile Number</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 9876543210"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full bg-brand-cream-light border border-brand-cream-dark focus:border-brand-green focus:ring-1 focus:ring-brand-green focus:outline-none rounded-xl px-3 py-2.5 text-xs text-brand-charcoal transition-all"
                />
              </div>

              <div className="bg-brand-green-soft/40 p-4 rounded-xl border border-brand-green/10 text-[11px] text-brand-green-dark leading-relaxed">
                <strong>Temporary Access Details:</strong> Registered workers can log in to the portal using their generated ID and the default password: <code className="bg-white px-1 font-mono font-bold text-[10px]">worker123</code>.
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-2 border-t border-brand-cream-dark">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="bg-brand-cream-dark text-brand-charcoal hover:bg-brand-cream-dark/80 font-bold px-5 py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-brand-green text-brand-cream hover:bg-brand-green-light font-bold px-5 py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
              >
                Create Account
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Worker Modal */}
      {isEditing && editFormData && (
        <div className="fixed inset-0 bg-brand-charcoal/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={saveEdit} className="bg-brand-cream border border-brand-cream-dark max-w-md w-full rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl animate-scale-up">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-display font-extrabold text-xl text-brand-green-dark">Edit Worker Profile</h3>
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
                <label className="block text-[10px] font-bold text-brand-charcoal uppercase tracking-wider mb-2">Worker Full Name</label>
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
                Save Details
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
