import React, { useState } from 'react';
import { useApp, type Order, type BulkOrder } from '../../context/AppContext';
import { Search, Eye, X } from 'lucide-react';

export const Orders: React.FC = () => {
  const { orders, bulkOrders, updateOrderStatus, updateBulkOrderStatus } = useApp();

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  
  // Selected Order for Modal Invoice
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedBulk, setSelectedBulk] = useState<BulkOrder | null>(null);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusChange = (orderId: string, status: Order['status']) => {
    updateOrderStatus(orderId, status);
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status });
    }
  };

  const handleBulkStatusChange = (bulkId: string, status: BulkOrder['status']) => {
    updateBulkOrderStatus(bulkId, status);
    if (selectedBulk && selectedBulk.id === bulkId) {
      setSelectedBulk({ ...selectedBulk, status });
    }
  };

  // Combine searches & filters for B2C orders
  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          o.productName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || o.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      
      {/* Search & Filter Header */}
      <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-2xl border border-brand-cream-dark shadow-sm justify-between items-center">
        <div className="flex gap-3 w-full sm:max-w-md">
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-brand-charcoal/40">
              <Search className="h-4 w-4" />
            </span>
            <input
              type="text"
              placeholder="Search ID, client, or item..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full bg-brand-gray-light border border-brand-cream-dark focus:border-brand-green focus:ring-1 focus:ring-brand-green focus:outline-none rounded-xl pl-9 pr-4 py-2.5 text-xs text-brand-charcoal transition-all"
            />
          </div>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-brand-gray-light border border-brand-cream-dark focus:border-brand-green focus:ring-1 focus:ring-brand-green focus:outline-none rounded-xl px-3 py-2 text-xs text-brand-charcoal transition-all"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <div className="text-xs text-brand-charcoal/40 font-semibold uppercase tracking-wider">
          Transaction Logs: {filteredOrders.length}
        </div>
      </div>

      {/* Standalone B2B Bulk Requests segment */}
      <div className="bg-white rounded-2xl border border-brand-cream-dark shadow-sm overflow-hidden p-6 space-y-4">
        <div>
          <h3 className="font-display font-bold text-base text-brand-green-dark">Active B2B Bulk Requests</h3>
          <p className="text-[10px] text-brand-charcoal/40">Wholesale, retail, and catering requests from local institutions.</p>
        </div>

        <div className="overflow-x-auto">
          {bulkOrders.length === 0 ? (
            <div className="p-6 text-center text-xs text-brand-charcoal/40">No B2B inquiries logged.</div>
          ) : (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-brand-gray-light text-brand-charcoal/60 border-b border-brand-cream-dark font-semibold uppercase tracking-wider">
                  <th className="p-3 pl-4">Inquiry ID</th>
                  <th className="p-3">Business Name</th>
                  <th className="p-3">Requirements</th>
                  <th className="p-3">Quantity</th>
                  <th className="p-3">Contract Value</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right pr-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-cream-dark">
                {bulkOrders.map((bulk) => (
                  <tr key={bulk.id} className="hover:bg-brand-cream/10 transition-colors">
                    <td className="p-3 pl-4 font-mono font-bold text-brand-brown">{bulk.id}</td>
                    <td className="p-3 font-semibold text-brand-charcoal">{bulk.businessName} ({bulk.contactPerson})</td>
                    <td className="p-3 text-brand-charcoal/70">{bulk.requirements}</td>
                    <td className="p-3 font-medium text-brand-charcoal/60">{bulk.quantity}</td>
                    <td className="p-3 font-bold text-brand-green-dark">₹{bulk.amount}</td>
                    <td className="p-3">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${
                        bulk.status === 'Delivered' ? 'bg-brand-green-soft text-brand-green' :
                        bulk.status === 'Processing' ? 'bg-amber-50 text-amber-800 border border-amber-200' :
                        bulk.status === 'Pending' ? 'bg-brand-cream-dark text-brand-charcoal/60' : 'bg-red-50 text-red-800 border border-red-200'
                      }`}>
                        {bulk.status}
                      </span>
                    </td>
                    <td className="p-3 pr-4 text-right space-x-2">
                      <button
                        onClick={() => setSelectedBulk(bulk)}
                        className="p-1 text-brand-charcoal hover:bg-brand-cream-dark rounded transition-colors cursor-pointer"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Main Order Registry */}
      <div className="bg-white rounded-2xl border border-brand-cream-dark shadow-sm overflow-hidden">
        <div className="p-6 border-b border-brand-cream-dark">
          <h3 className="font-display font-bold text-base text-brand-green-dark">General Order History</h3>
          <p className="text-[10px] text-brand-charcoal/40 font-medium">B2C Subscriptions and retail operations.</p>
        </div>

        <div className="overflow-x-auto">
          {filteredOrders.length === 0 ? (
            <div className="p-12 text-center text-brand-charcoal/40">
              No orders found matching status and search parameters.
            </div>
          ) : (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-brand-gray-light text-brand-charcoal/60 border-b border-brand-cream-dark font-semibold uppercase tracking-wider">
                  <th className="p-4 pl-6">Order ID</th>
                  <th className="p-4">Customer Name</th>
                  <th className="p-4">Product / Details</th>
                  <th className="p-4">Quantity</th>
                  <th className="p-4">Amount Paid</th>
                  <th className="p-4 text-center">Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right pr-6">Manage Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-cream-dark">
                {filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-brand-cream/10 transition-colors">
                    <td className="p-4 pl-6 font-mono font-bold text-brand-brown-light">{ord.id}</td>
                    <td className="p-4 font-semibold text-brand-charcoal">{ord.customerName}</td>
                    <td className="p-4 text-brand-charcoal/70">{ord.productName}</td>
                    <td className="p-4 text-brand-charcoal/60">{ord.quantity}</td>
                    <td className="p-4 font-bold text-brand-green-dark">₹{ord.amount}</td>
                    <td className="p-4 text-center text-brand-charcoal/50">{ord.date}</td>
                    <td className="p-4">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-[9px] font-extrabold uppercase ${
                        ord.status === 'Delivered' ? 'bg-brand-green-soft text-brand-green' :
                        ord.status === 'Processing' ? 'bg-amber-50 text-amber-800 border border-amber-200' :
                        ord.status === 'Pending' ? 'bg-brand-cream-dark text-brand-charcoal/60' : 'bg-red-50 text-red-800 border border-red-200'
                      }`}>
                        {ord.status}
                      </span>
                    </td>
                    <td className="p-4 pr-6 text-right space-x-2">
                      <button
                        onClick={() => setSelectedOrder(ord)}
                        className="p-1 text-brand-charcoal hover:bg-brand-cream-dark rounded transition-colors cursor-pointer"
                        title="Invoice Receipt"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Invoice Details Modal B2C */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-brand-charcoal/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-brand-cream border border-brand-cream-dark max-w-sm w-full rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl animate-scale-up">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-display font-extrabold text-lg text-brand-green-dark">Invoice Receipt</h3>
                <span className="text-[10px] text-brand-brown font-mono font-bold">Transaction {selectedOrder.id}</span>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1 hover:bg-brand-cream-dark rounded-full text-brand-charcoal/60"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Receipt Details Box */}
            <div className="border-2 border-dashed border-brand-cream-dark bg-white p-5 rounded-2xl space-y-4 text-xs">
              <div className="flex justify-between items-center text-[10px] uppercase font-bold text-brand-charcoal/50 pb-2 border-b border-brand-cream-dark">
                <span>Description</span>
                <span>Value</span>
              </div>

              <div className="flex justify-between">
                <span className="text-brand-charcoal/60 font-semibold">Customer Sourced</span>
                <span className="font-bold text-brand-charcoal text-right">{selectedOrder.customerName}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-brand-charcoal/60 font-semibold">Purchased Item</span>
                <span className="font-bold text-brand-charcoal text-right">{selectedOrder.productName}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-brand-charcoal/60 font-semibold">Quantity</span>
                <span className="font-bold text-brand-charcoal">{selectedOrder.quantity} units</span>
              </div>

              <div className="flex justify-between">
                <span className="text-brand-charcoal/60 font-semibold">Billed Date</span>
                <span className="font-bold text-brand-charcoal">{selectedOrder.date}</span>
              </div>

              <div className="flex justify-between pt-3 border-t border-brand-cream-dark text-sm">
                <span className="font-bold text-brand-green-dark font-display">Grand Total</span>
                <span className="font-extrabold text-brand-green-dark">₹{selectedOrder.amount}</span>
              </div>
            </div>

            {/* Update Status Actions */}
            <div className="space-y-2.5">
              <label className="block text-[10px] font-bold text-brand-charcoal uppercase tracking-wider">Update Order Status</label>
              <div className="grid grid-cols-2 gap-2">
                {['Pending', 'Processing', 'Delivered', 'Cancelled'].map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(selectedOrder.id, status as Order['status'])}
                    className={`px-3 py-2 rounded-xl text-[10px] font-bold uppercase transition-all cursor-pointer ${
                      selectedOrder.status === status
                        ? 'bg-brand-green text-brand-cream shadow-sm'
                        : 'bg-brand-cream-dark text-brand-charcoal/60 hover:bg-brand-cream-dark/80'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-brand-cream-dark">
              <button
                onClick={() => setSelectedOrder(null)}
                className="bg-brand-cream-dark text-brand-charcoal hover:bg-brand-cream-dark/80 font-bold px-6 py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
              >
                Close Receipt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Details Modal B2B */}
      {selectedBulk && (
        <div className="fixed inset-0 bg-brand-charcoal/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-brand-cream border border-brand-cream-dark max-w-sm w-full rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl animate-scale-up">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-display font-extrabold text-lg text-brand-green-dark">B2B Corporate Invoice</h3>
                <span className="text-[10px] text-brand-brown font-mono font-bold">Transaction {selectedBulk.id}</span>
              </div>
              <button
                onClick={() => setSelectedBulk(null)}
                className="p-1 hover:bg-brand-cream-dark rounded-full text-brand-charcoal/60"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Receipt Details Box */}
            <div className="border-2 border-dashed border-brand-cream-dark bg-white p-5 rounded-2xl space-y-4 text-xs animate-fade-in">
              <div className="flex justify-between items-center text-[10px] uppercase font-bold text-brand-charcoal/50 pb-2 border-b border-brand-cream-dark">
                <span>Description</span>
                <span>Value</span>
              </div>

              <div className="flex justify-between">
                <span className="text-brand-charcoal/60 font-semibold">Corporate Client</span>
                <span className="font-bold text-brand-charcoal text-right">{selectedBulk.businessName}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-brand-charcoal/60 font-semibold">Contact Person</span>
                <span className="font-bold text-brand-charcoal text-right">{selectedBulk.contactPerson} ({selectedBulk.phone})</span>
              </div>

              <div className="flex justify-between">
                <span className="text-brand-charcoal/60 font-semibold">Requirements</span>
                <span className="font-bold text-brand-charcoal text-right">{selectedBulk.requirements}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-brand-charcoal/60 font-semibold">Estimated Volume</span>
                <span className="font-bold text-brand-charcoal">{selectedBulk.quantity}</span>
              </div>

              <div className="bg-brand-cream-light p-3 rounded-xl border border-brand-cream-dark/60 italic text-brand-charcoal/70">
                "{selectedBulk.message}"
              </div>

              <div className="flex justify-between pt-3 border-t border-brand-cream-dark text-sm">
                <span className="font-bold text-brand-green-dark font-display">Contract Valuation</span>
                <span className="font-extrabold text-brand-green-dark">₹{selectedBulk.amount}</span>
              </div>
            </div>

            {/* Update Status Actions */}
            <div className="space-y-2.5">
              <label className="block text-[10px] font-bold text-brand-charcoal uppercase tracking-wider">Update Order Status</label>
              <div className="grid grid-cols-2 gap-2">
                {['Pending', 'Processing', 'Delivered', 'Cancelled'].map((status) => (
                  <button
                    key={status}
                    onClick={() => handleBulkStatusChange(selectedBulk.id, status as BulkOrder['status'])}
                    className={`px-3 py-2 rounded-xl text-[10px] font-bold uppercase transition-all cursor-pointer ${
                      selectedBulk.status === status
                        ? 'bg-brand-green text-brand-cream shadow-sm'
                        : 'bg-brand-cream-dark text-brand-charcoal/60 hover:bg-brand-cream-dark/80'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-brand-cream-dark">
              <button
                onClick={() => setSelectedBulk(null)}
                className="bg-brand-cream-dark text-brand-charcoal hover:bg-brand-cream-dark/80 font-bold px-6 py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
