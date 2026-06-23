import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useNavigation } from '../../context/NavigationContext';
import {
  LogOut, Home, Landmark, PlusCircle, CheckCircle2, History,
  Droplet, Calendar, ShieldCheck, Clock, User
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const {
    currentUser,
    signOut,
    partners,
    customers,
    milkRecords,
    addMilkRecord
  } = useApp();
  const { navigateTo } = useNavigation();

  // Selected Target state
  const [partnerId, setPartnerId] = useState('');
  const [partnerQty, setPartnerQty] = useState('');
  const [partnerSlot, setPartnerSlot] = useState<'Morning' | 'Evening'>('Morning');

  const [customerId, setCustomerId] = useState('');
  const [customerQty, setCustomerQty] = useState('');
  const [customerSlot, setCustomerSlot] = useState<'Morning' | 'Evening'>('Morning');

  const [successMsg, setSuccessMsg] = useState('');

  const name = currentUser?.name || '';
  const workerId = currentUser?.id || '';

  const activePartners = partners.filter(p => p.status === 'Active');
  const activeCustomers = customers.filter(c => c.status === 'Active');

  const handleLogout = () => {
    signOut();
    navigateTo('home');
  };

  const handlePartnerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg('');

    if (!partnerId) {
      alert('Please select a partner.');
      return;
    }
    const qty = parseFloat(partnerQty);
    if (isNaN(qty) || qty <= 0) {
      alert('Please enter a valid quantity.');
      return;
    }

    const partnerObj = partners.find(p => p.id === partnerId);
    if (!partnerObj) return;

    addMilkRecord({
      workerId,
      workerName: name,
      targetId: partnerId,
      targetName: partnerObj.name,
      targetType: 'partner',
      quantity: qty,
      date: new Date().toISOString().split('T')[0],
      slot: partnerSlot
    });

    setPartnerId('');
    setPartnerQty('');
    setSuccessMsg(`Success! Collected ${qty} Litres from partner ${partnerObj.name}.`);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleCustomerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg('');

    if (!customerId) {
      alert('Please select a customer.');
      return;
    }
    const qty = parseFloat(customerQty);
    if (isNaN(qty) || qty <= 0) {
      alert('Please enter a valid quantity.');
      return;
    }

    const customerObj = customers.find(c => c.id === customerId);
    if (!customerObj) return;

    addMilkRecord({
      workerId,
      workerName: name,
      targetId: customerId,
      targetName: customerObj.name,
      targetType: 'customer',
      quantity: qty,
      date: new Date().toISOString().split('T')[0],
      slot: customerSlot
    });

    setCustomerId('');
    setCustomerQty('');
    setSuccessMsg(`Success! Distributed ${qty} Litres to customer ${customerObj.name}.`);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  // Filter logs entered by this worker
  const myLogs = milkRecords.filter(r => r.workerId === workerId);

  return (
    <div className="min-h-screen bg-brand-gray-light flex flex-col lg:flex-row animate-fade-in">
      
      {/* Sidebar Navigation */}
      <aside className="w-full lg:w-72 bg-brand-green text-brand-cream-light flex flex-col justify-between p-6 lg:fixed lg:inset-y-0 lg:left-0 border-r border-brand-green-light/35 z-30">
        <div>
          {/* Brand Logo */}
          <div className="flex items-center gap-3 mb-10 cursor-pointer" onClick={() => navigateTo('home')}>
            <div className="h-10 w-10 bg-brand-cream-light rounded-full flex items-center justify-center text-brand-green border border-brand-cream shadow">
              <Landmark className="h-5 w-5" />
            </div>
            <div>
              <span className="font-display font-extrabold text-xl tracking-wide text-brand-cream">DairyLuxe</span>
              <span className="block text-[9px] uppercase font-bold tracking-widest text-brand-accent-gold -mt-1">Worker Hub</span>
            </div>
          </div>

          <div className="space-y-4 px-4 bg-white/5 p-4 rounded-2xl border border-white/10">
            <span className="block text-[10px] uppercase font-bold text-brand-accent-gold tracking-widest">Active Duty</span>
            <div className="space-y-1">
              <span className="font-semibold text-sm block truncate text-brand-cream">{name}</span>
              <span className="text-[10px] font-mono text-brand-cream-dark/60 block">{workerId}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-brand-green-soft">
              <ShieldCheck className="h-4.5 w-4.5" /> Checked-in Today
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="mt-8 border-t border-brand-cream-dark/10 pt-6 space-y-4">
          <button
            onClick={() => navigateTo('home')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-brand-cream-dark hover:bg-white/5 hover:text-brand-cream transition-colors cursor-pointer"
          >
            <Home className="h-5 w-5" />
            <span>Go to Website</span>
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-300 hover:bg-red-950/20 hover:text-red-100 transition-colors cursor-pointer"
          >
            <LogOut className="h-5 w-5" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Panel Content Area */}
      <main className="flex-grow lg:pl-72 flex flex-col min-h-screen">
        
        {/* Top Header Bar */}
        <header className="bg-white border-b border-brand-cream-dark py-5 px-6 sm:px-8 flex justify-between items-center">
          <h2 className="font-display font-extrabold text-xl text-brand-green-dark">Worker Operations Dashboard</h2>
          <div className="text-xs text-brand-charcoal/50 font-semibold flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-brand-brown-light" />
            Duty Date: {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </header>

        {/* Content Pane */}
        <div className="flex-grow p-6 sm:p-8 max-w-5xl w-full mx-auto space-y-8">
          
          {/* Notification Msg Banner */}
          {successMsg && (
            <div className="bg-brand-green-soft text-brand-green border border-brand-green/20 rounded-2xl p-4 text-xs font-semibold flex items-center gap-2.5 animate-slide-up">
              <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Core Collection/Distribution Form Panel */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Form 1: Sourcing Milk Collection from Partner */}
            <form onSubmit={handlePartnerSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-cream-dark shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-brand-cream-dark pb-3">
                <div className="h-8 w-8 bg-brand-green-soft text-brand-green rounded-full flex items-center justify-center">
                  <Droplet className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-sm text-brand-green-dark">Log Partner Collection</h4>
                  <p className="text-[10px] text-brand-charcoal/40">Log raw milk volume procured from active farmer partners</p>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-brand-charcoal uppercase tracking-wider mb-2">Select Active Partner</label>
                <select
                  required
                  value={partnerId}
                  onChange={(e) => setPartnerId(e.target.value)}
                  className="w-full bg-brand-gray-light border border-brand-cream-dark focus:border-brand-green focus:ring-1 focus:ring-brand-green focus:outline-none rounded-xl px-3 py-2.5 text-xs text-brand-charcoal transition-all"
                >
                  <option value="">-- Choose Partner --</option>
                  {activePartners.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.id} - {p.name} ({p.village})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-brand-charcoal uppercase tracking-wider mb-2">Quantity (Litres)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    max="1000"
                    required
                    placeholder="e.g. 15.5"
                    value={partnerQty}
                    onChange={(e) => setPartnerQty(e.target.value)}
                    className="w-full bg-brand-gray-light border border-brand-cream-dark focus:border-brand-green focus:ring-1 focus:ring-brand-green focus:outline-none rounded-xl px-3 py-2.5 text-xs text-brand-charcoal transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-brand-charcoal uppercase tracking-wider mb-2">Collection Slot</label>
                  <select
                    value={partnerSlot}
                    onChange={(e) => setPartnerSlot(e.target.value as any)}
                    className="w-full bg-brand-gray-light border border-brand-cream-dark focus:border-brand-green focus:ring-1 focus:ring-brand-green focus:outline-none rounded-xl px-3 py-2.5 text-xs text-brand-charcoal transition-all"
                  >
                    <option value="Morning">Morning Slot</option>
                    <option value="Evening">Evening Slot</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-brand-charcoal uppercase tracking-wider mb-1">Logging Date</label>
                <div className="text-xs font-semibold text-brand-brown-light flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" /> Today ({new Date().toISOString().split('T')[0]})
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-brand-green text-brand-cream hover:bg-brand-green-light font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-sm"
                >
                  <PlusCircle className="h-4.5 w-4.5" /> Save Collection Log
                </button>
              </div>
            </form>

            {/* Form 2: Distribute Milk to customer/subscriber */}
            <form onSubmit={handleCustomerSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-cream-dark shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-brand-cream-dark pb-3">
                <div className="h-8 w-8 bg-brand-brown/10 text-brand-brown rounded-full flex items-center justify-center">
                  <User className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-sm text-brand-brown">Log Customer Distribution</h4>
                  <p className="text-[10px] text-brand-charcoal/40">Log daily milk litres distributed to subscription customer doorsteps</p>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-brand-charcoal uppercase tracking-wider mb-2">Select Active Subscriber</label>
                <select
                  required
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                  className="w-full bg-brand-gray-light border border-brand-cream-dark focus:border-brand-green focus:ring-1 focus:ring-brand-green focus:outline-none rounded-xl px-3 py-2.5 text-xs text-brand-charcoal transition-all"
                >
                  <option value="">-- Choose Subscriber --</option>
                  {activeCustomers.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.id} - {c.name} ({c.address.slice(0, 25)}...)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-brand-charcoal uppercase tracking-wider mb-2">Quantity (Litres)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    max="1000"
                    required
                    placeholder="e.g. 2.0"
                    value={customerQty}
                    onChange={(e) => setCustomerQty(e.target.value)}
                    className="w-full bg-brand-gray-light border border-brand-cream-dark focus:border-brand-green focus:ring-1 focus:ring-brand-green focus:outline-none rounded-xl px-3 py-2.5 text-xs text-brand-charcoal transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-brand-charcoal uppercase tracking-wider mb-2">Delivery Slot</label>
                  <select
                    value={customerSlot}
                    onChange={(e) => setCustomerSlot(e.target.value as any)}
                    className="w-full bg-brand-gray-light border border-brand-cream-dark focus:border-brand-green focus:ring-1 focus:ring-brand-green focus:outline-none rounded-xl px-3 py-2.5 text-xs text-brand-charcoal transition-all"
                  >
                    <option value="Morning">Morning Slot</option>
                    <option value="Evening">Evening Slot</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-brand-charcoal uppercase tracking-wider mb-1">Logging Date</label>
                <div className="text-xs font-semibold text-brand-brown-light flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" /> Today ({new Date().toISOString().split('T')[0]})
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-brand-brown hover:bg-brand-brown-light text-brand-cream font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-sm border border-brand-brown"
                >
                  <PlusCircle className="h-4.5 w-4.5" /> Save Distribution Log
                </button>
              </div>
            </form>

          </div>

          {/* Worker's Log History */}
          <div className="bg-white rounded-2xl border border-brand-cream-dark shadow-sm overflow-hidden">
            <div className="p-5 border-b border-brand-cream-dark flex items-center gap-2 bg-brand-gray-light">
              <History className="h-5 w-5 text-brand-green" />
              <div>
                <h3 className="font-display font-bold text-base text-brand-green-dark">My Duty Entry History</h3>
                <p className="text-[11px] text-brand-charcoal/40 font-medium">Record of all collection and delivery transactions entered in your name</p>
              </div>
            </div>

            {myLogs.length === 0 ? (
              <div className="p-12 text-center text-xs text-brand-charcoal/40">
                You have not logged any milk transactions yet.
              </div>
            ) : (
              <div className="overflow-x-auto text-xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-brand-cream-light text-brand-charcoal/60 border-b border-brand-cream-dark font-semibold">
                      <th className="p-4 pl-6">Record ID</th>
                      <th className="p-4">Type</th>
                      <th className="p-4">Member Name (ID)</th>
                      <th className="p-4">Milk Quantity</th>
                      <th className="p-4">Slot</th>
                      <th className="p-4 pr-6">Transaction Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-cream-dark">
                    {myLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-brand-cream/10 transition-colors">
                        <td className="p-4 pl-6 font-mono text-brand-charcoal/60 font-semibold">{log.id}</td>
                        <td className="p-4">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                            log.targetType === 'partner' ? 'bg-brand-green-soft text-brand-green' : 'bg-brand-brown/10 text-brand-brown'
                          }`}>
                            {log.targetType === 'partner' ? 'Collection' : 'Distribution'}
                          </span>
                        </td>
                        <td className="p-4 font-semibold text-brand-charcoal">
                          {log.targetName} (<span className="font-mono text-[10px] text-brand-brown-light">{log.targetId}</span>)
                        </td>
                        <td className="p-4 font-bold text-brand-green-dark">{log.quantity} Litres</td>
                        <td className="p-4">
                          <span className="font-semibold text-brand-charcoal/70 uppercase text-[10px]">{log.slot}</span>
                        </td>
                        <td className="p-4 pr-6 text-brand-charcoal/50">{log.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      </main>

    </div>
  );
};
