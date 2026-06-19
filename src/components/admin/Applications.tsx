import React, { useState } from 'react';
import { useApp, type PartnerApplication, type SubscriptionApplication } from '../../context/AppContext';
import { ShieldCheck, X } from 'lucide-react';

export const Applications: React.FC = () => {
  const {
    partnerApplications,
    subscriptionApplications,
    approvePartnerApp,
    rejectPartnerApp,
    approveSubscriptionApp,
    rejectSubscriptionApp
  } = useApp();

  const [activeTab, setActiveTab] = useState<'partners' | 'subscriptions' | 'approved' | 'rejected'>('partners');
  const [selectedPartnerApp, setSelectedPartnerApp] = useState<PartnerApplication | null>(null);
  const [selectedSubApp, setSelectedSubApp] = useState<SubscriptionApplication | null>(null);
  const [approvedDetails, setApprovedDetails] = useState<{ id: string; tempPass: string } | null>(null);

  const handleApprovePartner = (id: string) => {
    const details = approvePartnerApp(id);
    if (details) {
      setApprovedDetails({ id: details.partnerId, tempPass: details.tempPass });
      setSelectedPartnerApp(null);
    }
  };

  const handleApproveSub = (id: string) => {
    const details = approveSubscriptionApp(id);
    if (details) {
      setApprovedDetails({ id: details.customerId, tempPass: details.tempPass });
      setSelectedSubApp(null);
    }
  };

  const handleRejectPartner = (id: string) => {
    rejectPartnerApp(id);
    setSelectedPartnerApp(null);
  };

  const handleRejectSub = (id: string) => {
    rejectSubscriptionApp(id);
    setSelectedSubApp(null);
  };

  const pendingPartners = partnerApplications.filter(a => a.status === 'Pending');
  const pendingSubscriptions = subscriptionApplications.filter(a => a.status === 'Pending');
  
  // Historical Approved/Rejected list combined
  const approvedApps = [
    ...partnerApplications.filter(a => a.status === 'Approved').map(a => ({ ...a, type: 'Dairy Partner' })),
    ...subscriptionApplications.filter(a => a.status === 'Approved').map(a => ({ ...a, type: 'Subscription Customer' }))
  ].sort((a, b) => b.id.localeCompare(a.id));

  const rejectedApps = [
    ...partnerApplications.filter(a => a.status === 'Rejected').map(a => ({ ...a, type: 'Dairy Partner' })),
    ...subscriptionApplications.filter(a => a.status === 'Rejected').map(a => ({ ...a, type: 'Subscription Customer' }))
  ].sort((a, b) => b.id.localeCompare(a.id));

  return (
    <div className="space-y-6">
      
      {/* Tabs Menu */}
      <div className="flex border-b border-brand-cream-dark bg-white p-2.5 rounded-2xl shadow-sm gap-2">
        <button
          onClick={() => setActiveTab('partners')}
          className={`px-5 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === 'partners'
              ? 'bg-brand-green text-brand-cream shadow-sm'
              : 'text-brand-charcoal/60 hover:text-brand-charcoal hover:bg-brand-gray-light'
          }`}
        >
          Partner Inquiries ({pendingPartners.length})
        </button>
        <button
          onClick={() => setActiveTab('subscriptions')}
          className={`px-5 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === 'subscriptions'
              ? 'bg-brand-green text-brand-cream shadow-sm'
              : 'text-brand-charcoal/60 hover:text-brand-charcoal hover:bg-brand-gray-light'
          }`}
        >
          Daily Subscriptions ({pendingSubscriptions.length})
        </button>
        <button
          onClick={() => setActiveTab('approved')}
          className={`px-5 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === 'approved'
              ? 'bg-brand-green text-brand-cream shadow-sm'
              : 'text-brand-charcoal/60 hover:text-brand-charcoal hover:bg-brand-gray-light'
          }`}
        >
          Approved Archive ({approvedApps.length})
        </button>
        <button
          onClick={() => setActiveTab('rejected')}
          className={`px-5 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === 'rejected'
              ? 'bg-brand-green text-brand-cream shadow-sm'
              : 'text-brand-charcoal/60 hover:text-brand-charcoal hover:bg-brand-gray-light'
          }`}
        >
          Rejected List ({rejectedApps.length})
        </button>
      </div>

      {/* Success Approval Modal */}
      {approvedDetails && (
        <div className="bg-brand-green text-brand-cream-light p-6 rounded-2xl border border-brand-accent-gold shadow-md flex justify-between items-center animate-fade-in">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center text-brand-accent-gold">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <span className="font-display font-extrabold text-base block text-brand-accent-gold">Account Created Successfully!</span>
              <span className="text-xs">
                System generated ID: <strong className="font-mono text-white text-sm">{approvedDetails.id}</strong> | Default temporary password: <strong className="font-mono text-white text-sm">{approvedDetails.tempPass}</strong>
              </span>
            </div>
          </div>
          <button
            onClick={() => setApprovedDetails(null)}
            className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* 1. Pending Partner Applications */}
      {activeTab === 'partners' && (
        <div className="bg-white rounded-2xl border border-brand-cream-dark shadow-sm overflow-hidden">
          {pendingPartners.length === 0 ? (
            <div className="p-12 text-center text-brand-charcoal/40">
              No pending partner inquiries currently in queue.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-brand-gray-light text-brand-charcoal/60 border-b border-brand-cream-dark font-semibold uppercase tracking-wider">
                    <th className="p-4 pl-6">Farmer Name</th>
                    <th className="p-4">Contact Number</th>
                    <th className="p-4">Village / District</th>
                    <th className="p-4">Submitted Date</th>
                    <th className="p-4 text-right pr-6">Review Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-cream-dark">
                  {pendingPartners.map((app) => (
                    <tr key={app.id} className="hover:bg-brand-cream/10 transition-colors">
                      <td className="p-4 pl-6 font-semibold text-brand-charcoal">{app.fullName}</td>
                      <td className="p-4 font-semibold text-brand-charcoal/70">{app.mobile}</td>
                      <td className="p-4 text-brand-charcoal/60">{app.village}, {app.district}</td>
                      <td className="p-4 text-brand-charcoal/50">{app.submittedAt}</td>
                      <td className="p-4 pr-6 text-right space-x-2">
                        <button
                          onClick={() => setSelectedPartnerApp(app)}
                          className="bg-brand-gray-light text-brand-charcoal hover:bg-brand-cream-dark px-3 py-1.5 rounded-lg font-bold text-[10px] uppercase transition-colors cursor-pointer"
                        >
                          Details
                        </button>
                        <button
                          onClick={() => handleApprovePartner(app.id)}
                          className="bg-brand-green text-brand-cream hover:bg-brand-green-light px-3 py-1.5 rounded-lg font-bold text-[10px] uppercase transition-colors cursor-pointer"
                        >
                          Approve
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* 2. Pending Subscription Applications */}
      {activeTab === 'subscriptions' && (
        <div className="bg-white rounded-2xl border border-brand-cream-dark shadow-sm overflow-hidden">
          {pendingSubscriptions.length === 0 ? (
            <div className="p-12 text-center text-brand-charcoal/40">
              No pending delivery subscription requests currently in queue.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-brand-gray-light text-brand-charcoal/60 border-b border-brand-cream-dark font-semibold uppercase tracking-wider">
                    <th className="p-4 pl-6">Client Name</th>
                    <th className="p-4">Contact Number</th>
                    <th className="p-4">Volume Required</th>
                    <th className="p-4">Time Pref</th>
                    <th className="p-4 text-right pr-6">Review Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-cream-dark">
                  {pendingSubscriptions.map((app) => (
                    <tr key={app.id} className="hover:bg-brand-cream/10 transition-colors">
                      <td className="p-4 pl-6 font-semibold text-brand-charcoal">{app.fullName}</td>
                      <td className="p-4 font-semibold text-brand-charcoal/70">{app.mobile}</td>
                      <td className="p-4 font-bold text-brand-green-dark">{app.quantity} L / Daily</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${app.deliveryTime === 'Morning' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-blue-50 text-blue-700 border border-blue-200'}`}>
                          {app.deliveryTime}
                        </span>
                      </td>
                      <td className="p-4 pr-6 text-right space-x-2">
                        <button
                          onClick={() => setSelectedSubApp(app)}
                          className="bg-brand-gray-light text-brand-charcoal hover:bg-brand-cream-dark px-3 py-1.5 rounded-lg font-bold text-[10px] uppercase transition-colors cursor-pointer"
                        >
                          Details
                        </button>
                        <button
                          onClick={() => handleApproveSub(app.id)}
                          className="bg-brand-green text-brand-cream hover:bg-brand-green-light px-3 py-1.5 rounded-lg font-bold text-[10px] uppercase transition-colors cursor-pointer"
                        >
                          Approve
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* 3. Approved Archive */}
      {activeTab === 'approved' && (
        <div className="bg-white rounded-2xl border border-brand-cream-dark shadow-sm overflow-hidden">
          {approvedApps.length === 0 ? (
            <div className="p-12 text-center text-brand-charcoal/40">
              No historical approvals recorded.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-brand-gray-light text-brand-charcoal/60 border-b border-brand-cream-dark font-semibold uppercase tracking-wider">
                    <th className="p-4 pl-6">Membership ID</th>
                    <th className="p-4">Membership Type</th>
                    <th className="p-4">Enrollment Name</th>
                    <th className="p-4">Contact Phone</th>
                    <th className="p-4 text-right pr-6">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-cream-dark">
                  {approvedApps.map((app) => (
                    <tr key={app.id} className="hover:bg-brand-cream/10 transition-colors">
                      <td className="p-4 pl-6 font-mono font-bold text-brand-brown">{app.generatedId}</td>
                      <td className="p-4 text-brand-charcoal/70 font-semibold">{app.type}</td>
                      <td className="p-4 font-semibold text-brand-charcoal">{app.fullName}</td>
                      <td className="p-4 text-brand-charcoal/60">{app.mobile}</td>
                      <td className="p-4 pr-6 text-right">
                        <span className="bg-brand-green-soft text-brand-green px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase">
                          Approved
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* 4. Rejected Archive */}
      {activeTab === 'rejected' && (
        <div className="bg-white rounded-2xl border border-brand-cream-dark shadow-sm overflow-hidden">
          {rejectedApps.length === 0 ? (
            <div className="p-12 text-center text-brand-charcoal/40">
              No rejected applications.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-brand-gray-light text-brand-charcoal/60 border-b border-brand-cream-dark font-semibold uppercase tracking-wider">
                    <th className="p-4 pl-6">ID</th>
                    <th className="p-4">Type</th>
                    <th className="p-4">Applicant Name</th>
                    <th className="p-4">Contact Phone</th>
                    <th className="p-4 text-right pr-6">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-cream-dark">
                  {rejectedApps.map((app) => (
                    <tr key={app.id} className="hover:bg-brand-cream/10 transition-colors">
                      <td className="p-4 pl-6 font-mono text-brand-charcoal/50">{app.id}</td>
                      <td className="p-4 text-brand-charcoal/70 font-semibold">{app.type}</td>
                      <td className="p-4 font-semibold text-brand-charcoal">{app.fullName}</td>
                      <td className="p-4 text-brand-charcoal/60">{app.mobile}</td>
                      <td className="p-4 pr-6 text-right">
                        <span className="bg-red-50 text-red-800 border border-red-200 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase">
                          Rejected
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Partner Inspection Modal */}
      {selectedPartnerApp && (
        <div className="fixed inset-0 bg-brand-charcoal/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-brand-cream border border-brand-cream-dark max-w-lg w-full rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl animate-scale-up">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-display font-extrabold text-xl text-brand-green-dark">Partner Application Review</h3>
                <span className="text-[10px] text-brand-charcoal/50 font-bold uppercase tracking-wider">{selectedPartnerApp.id}</span>
              </div>
              <button
                onClick={() => setSelectedPartnerApp(null)}
                className="p-1 hover:bg-brand-cream-dark rounded-full text-brand-charcoal/60"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="block text-[10px] uppercase font-bold text-brand-charcoal/40">Full Name</span>
                  <span className="font-semibold text-brand-charcoal text-sm">{selectedPartnerApp.fullName}</span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase font-bold text-brand-charcoal/40">Phone Number</span>
                  <span className="font-semibold text-brand-charcoal text-sm">{selectedPartnerApp.mobile}</span>
                </div>
              </div>

              <div>
                <span className="block text-[10px] uppercase font-bold text-brand-charcoal/40">Permanent Address</span>
                <span className="font-medium text-brand-charcoal leading-relaxed block">{selectedPartnerApp.address}</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="block text-[10px] uppercase font-bold text-brand-charcoal/40">Village</span>
                  <span className="font-semibold text-brand-charcoal">{selectedPartnerApp.village}</span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase font-bold text-brand-charcoal/40">District</span>
                  <span className="font-semibold text-brand-charcoal">{selectedPartnerApp.district}</span>
                </div>
              </div>

              <div className="border-t border-brand-cream-dark pt-4">
                <span className="block text-[10px] uppercase font-bold text-brand-brown-light tracking-wide mb-1">Livestock & Farming Experience</span>
                <p className="text-brand-charcoal/80 leading-relaxed italic bg-brand-cream-light p-3.5 rounded-xl border border-brand-cream-dark/60">
                  "{selectedPartnerApp.farmingExperience}"
                </p>
              </div>

              <div>
                <span className="block text-[10px] uppercase font-bold text-brand-brown-light tracking-wide mb-1">Why do they want to join?</span>
                <p className="text-brand-charcoal/80 leading-relaxed italic bg-brand-cream-light p-3.5 rounded-xl border border-brand-cream-dark/60">
                  "{selectedPartnerApp.whyJoin}"
                </p>
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-4 border-t border-brand-cream-dark">
              <button
                onClick={() => handleRejectPartner(selectedPartnerApp.id)}
                className="bg-red-50 text-red-800 border border-red-200 hover:bg-red-100 font-bold px-5 py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
              >
                Reject Application
              </button>
              <button
                onClick={() => handleApprovePartner(selectedPartnerApp.id)}
                className="bg-brand-green text-brand-cream hover:bg-brand-green-light font-bold px-5 py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
              >
                Approve & Issue ID
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Subscription Detail Modal */}
      {selectedSubApp && (
        <div className="fixed inset-0 bg-brand-charcoal/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-brand-cream border border-brand-cream-dark max-w-lg w-full rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl animate-scale-up">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-display font-extrabold text-xl text-brand-green-dark">Subscription Request Details</h3>
                <span className="text-[10px] text-brand-charcoal/50 font-bold uppercase tracking-wider">{selectedSubApp.id}</span>
              </div>
              <button
                onClick={() => setSelectedSubApp(null)}
                className="p-1 hover:bg-brand-cream-dark rounded-full text-brand-charcoal/60"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="block text-[10px] uppercase font-bold text-brand-charcoal/40">Client Name</span>
                  <span className="font-semibold text-brand-charcoal text-sm">{selectedSubApp.fullName}</span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase font-bold text-brand-charcoal/40">Phone Number</span>
                  <span className="font-semibold text-brand-charcoal text-sm">{selectedSubApp.mobile}</span>
                </div>
              </div>

              <div>
                <span className="block text-[10px] uppercase font-bold text-brand-charcoal/40">Delivery Address</span>
                <span className="font-medium text-brand-charcoal leading-relaxed block">{selectedSubApp.address}</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="block text-[10px] uppercase font-bold text-brand-charcoal/40">Daily Quantity Required</span>
                  <span className="font-bold text-brand-green-dark text-sm">{selectedSubApp.quantity} Litres</span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase font-bold text-brand-charcoal/40">Preferred Delivery Window</span>
                  <span className="font-semibold text-brand-charcoal">{selectedSubApp.deliveryTime} Slot</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-4 border-t border-brand-cream-dark">
              <button
                onClick={() => handleRejectSub(selectedSubApp.id)}
                className="bg-red-50 text-red-800 border border-red-200 hover:bg-red-100 font-bold px-5 py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
              >
                Reject Request
              </button>
              <button
                onClick={() => handleApproveSub(selectedSubApp.id)}
                className="bg-brand-green text-brand-cream hover:bg-brand-green-light font-bold px-5 py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
              >
                Approve & Allocate Route
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
