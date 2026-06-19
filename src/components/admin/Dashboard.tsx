import React from 'react';
import { useApp } from '../../context/AppContext';
import { useNavigation } from '../../context/NavigationContext';
import { Users, FileText, Inbox, ShoppingBag, ArrowUpRight, TrendingUp, DollarSign } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { getDashboardStats, orders } = useApp();
  const { navigateTo } = useNavigation();
  const stats = getDashboardStats();

  // Recents List
  const recentOrders = orders.slice(0, 5);

  return (
    <div className="space-y-8">
      
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        
        {/* Total Partners */}
        <div className="bg-white p-6 rounded-2xl border border-brand-cream-dark shadow-sm flex items-center justify-between hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigateTo('admin-partners')}>
          <div className="space-y-2">
            <span className="text-xs font-bold text-brand-charcoal/50 uppercase tracking-wider block">Active Partners</span>
            <span className="text-2xl font-display font-black text-brand-green-dark">{stats.totalPartners}</span>
            <span className="text-[10px] text-brand-green font-semibold flex items-center gap-0.5"><TrendingUp className="h-3 w-3" /> +12% this mo</span>
          </div>
          <div className="h-12 w-12 bg-brand-green-soft rounded-xl flex items-center justify-center text-brand-green">
            <Users className="h-6 w-6" />
          </div>
        </div>

        {/* Total Customers */}
        <div className="bg-white p-6 rounded-2xl border border-brand-cream-dark shadow-sm flex items-center justify-between hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigateTo('admin-subscriptions')}>
          <div className="space-y-2">
            <span className="text-xs font-bold text-brand-charcoal/50 uppercase tracking-wider block">Active Subscribers</span>
            <span className="text-2xl font-display font-black text-brand-green-dark">{stats.totalCustomers}</span>
            <span className="text-[10px] text-brand-green font-semibold flex items-center gap-0.5"><TrendingUp className="h-3 w-3" /> +8% weekly</span>
          </div>
          <div className="h-12 w-12 bg-brand-green-soft rounded-xl flex items-center justify-center text-brand-green">
            <FileText className="h-6 w-6" />
          </div>
        </div>

        {/* Pending Applications */}
        <div className="bg-white p-6 rounded-2xl border border-brand-cream-dark shadow-sm flex items-center justify-between hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigateTo('admin-applications')}>
          <div className="space-y-2">
            <span className="text-xs font-bold text-brand-charcoal/50 uppercase tracking-wider block">Pending Applications</span>
            <span className="text-2xl font-display font-black text-brand-brown">{stats.pendingApplications}</span>
            <span className="text-[10px] text-brand-brown-light font-semibold block">Requires verification</span>
          </div>
          <div className="h-12 w-12 bg-brand-cream-dark/40 rounded-xl flex items-center justify-center text-brand-brown">
            <Inbox className="h-6 w-6" />
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-6 rounded-2xl border border-brand-cream-dark shadow-sm flex items-center justify-between hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigateTo('admin-orders')}>
          <div className="space-y-2">
            <span className="text-xs font-bold text-brand-charcoal/50 uppercase tracking-wider block">Total Transactions</span>
            <span className="text-2xl font-display font-black text-brand-green-dark">{stats.totalOrders}</span>
            <span className="text-[10px] text-brand-green font-semibold flex items-center gap-0.5">Logs archive</span>
          </div>
          <div className="h-12 w-12 bg-brand-green-soft rounded-xl flex items-center justify-center text-brand-green">
            <ShoppingBag className="h-6 w-6" />
          </div>
        </div>

        {/* Revenue */}
        <div className="bg-white p-6 rounded-2xl border border-brand-cream-dark shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
          <div className="space-y-2">
            <span className="text-xs font-bold text-brand-charcoal/50 uppercase tracking-wider block">Monthly Value</span>
            <span className="text-2xl font-display font-black text-brand-green-dark">₹{stats.monthlyRevenue}</span>
            <span className="text-[10px] text-brand-green font-semibold flex items-center gap-0.5"><TrendingUp className="h-3 w-3" /> Growth trend</span>
          </div>
          <div className="h-12 w-12 bg-brand-green-soft rounded-xl flex items-center justify-center text-brand-green">
            <DollarSign className="h-6 w-6" />
          </div>
        </div>

      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Customer & Partner Growth Chart */}
        <div className="bg-white p-6 rounded-2xl border border-brand-cream-dark shadow-sm lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-display font-bold text-base text-brand-green-dark">Member Growth Profile</h3>
              <p className="text-[11px] text-brand-charcoal/40">Aggregated registration history (Monthly projection)</p>
            </div>
            <div className="flex gap-4 text-xs font-bold">
              <span className="flex items-center gap-1.5 text-brand-green"><span className="h-2 w-2 rounded-full bg-brand-green inline-block" /> Subscribers</span>
              <span className="flex items-center gap-1.5 text-brand-accent-gold"><span className="h-2 w-2 rounded-full bg-brand-accent-gold inline-block" /> Partners</span>
            </div>
          </div>

          {/* SVG Line Chart */}
          <div className="h-64 relative flex items-end">
            <svg className="w-full h-full" viewBox="0 0 500 200">
              <defs>
                <linearGradient id="sub-gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#156B52" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#156B52" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {/* Grids */}
              <line x1="0" y1="50" x2="500" y2="50" stroke="#F4EFE6" strokeWidth="1" />
              <line x1="0" y1="100" x2="500" y2="100" stroke="#F4EFE6" strokeWidth="1" />
              <line x1="0" y1="150" x2="500" y2="150" stroke="#F4EFE6" strokeWidth="1" />
              
              {/* Area path for Subscribers */}
              <path
                d="M 50,160 L 120,130 L 190,110 L 260,80 L 330,60 L 400,30 L 450,20 L 450,200 L 50,200 Z"
                fill="url(#sub-gradient)"
              />
              {/* Line path for Subscribers */}
              <path
                d="M 50,160 Q 120,130 190,110 T 330,60 T 450,20"
                fill="none"
                stroke="#156B52"
                strokeWidth="3"
                strokeLinecap="round"
              />
              {/* Line path for Partners */}
              <path
                d="M 50,185 Q 120,175 190,165 T 330,140 T 450,110"
                fill="none"
                stroke="#C29F5C"
                strokeWidth="2.5"
                strokeDasharray="4 3"
                strokeLinecap="round"
              />
              {/* Points */}
              <circle cx="450" cy="20" r="5" fill="#156B52" stroke="#FFF" strokeWidth="1.5" />
              <circle cx="450" cy="110" r="5" fill="#C29F5C" stroke="#FFF" strokeWidth="1.5" />
            </svg>
            <div className="absolute inset-x-0 bottom-0 flex justify-between px-6 text-[10px] text-brand-charcoal/40 font-bold">
              <span>Jan</span>
              <span>Feb</span>
              <span>Mar</span>
              <span>Apr</span>
              <span>May</span>
              <span>Jun (Current)</span>
            </div>
          </div>
        </div>

        {/* Product Sales Share Chart */}
        <div className="bg-white p-6 rounded-2xl border border-brand-cream-dark shadow-sm space-y-6">
          <div>
            <h3 className="font-display font-bold text-base text-brand-green-dark">Product Sales Share</h3>
            <p className="text-[11px] text-brand-charcoal/40">Category volume distributions</p>
          </div>

          <div className="space-y-4 pt-2">
            {[
              { name: 'Raw Milk', pct: 60, color: 'bg-brand-green' },
              { name: 'Thick Curd', pct: 20, color: 'bg-brand-green-light' },
              { name: 'Creamery Butter', pct: 12, color: 'bg-brand-accent-gold' },
              { name: 'Flavoured Milks', pct: 8, color: 'bg-brand-brown-light' }
            ].map((item, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-brand-charcoal">{item.name}</span>
                  <span className="text-brand-charcoal/60">{item.pct}%</span>
                </div>
                <div className="w-full bg-brand-gray-light h-2.5 rounded-full overflow-hidden border border-brand-cream-dark/50">
                  <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Recents Table Layout */}
      <div className="bg-white rounded-2xl border border-brand-cream-dark shadow-sm overflow-hidden">
        <div className="p-6 border-b border-brand-cream-dark flex justify-between items-center">
          <div>
            <h3 className="font-display font-bold text-base text-brand-green-dark">Recent Activity Log</h3>
            <p className="text-[11px] text-brand-charcoal/40 font-medium">Latest customer and catering bookings processed</p>
          </div>
          <button
            onClick={() => navigateTo('admin-orders')}
            className="text-xs font-bold text-brand-green hover:underline flex items-center gap-0.5 cursor-pointer"
          >
            All Logs <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-brand-gray-light text-brand-charcoal/60 border-b border-brand-cream-dark font-semibold uppercase tracking-wider">
                <th className="p-4 pl-6">Order ID</th>
                <th className="p-4">Customer Name</th>
                <th className="p-4">Item Catalog</th>
                <th className="p-4">Total Amount</th>
                <th className="p-4 text-center">Date</th>
                <th className="p-4 pr-6 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-cream-dark">
              {recentOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-brand-cream/10 transition-colors">
                  <td className="p-4 pl-6 font-mono font-bold text-brand-brown-light">{ord.id}</td>
                  <td className="p-4 font-semibold text-brand-charcoal">{ord.customerName}</td>
                  <td className="p-4 text-brand-charcoal/70">{ord.productName}</td>
                  <td className="p-4 font-bold text-brand-green-dark">₹{ord.amount}</td>
                  <td className="p-4 text-center text-brand-charcoal/50">{ord.date}</td>
                  <td className="p-4 pr-6 text-right">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                      ord.status === 'Delivered' ? 'bg-brand-green-soft text-brand-green' :
                      ord.status === 'Processing' ? 'bg-amber-50 text-amber-800 border border-amber-200' :
                      'bg-red-50 text-red-800'
                    }`}>
                      {ord.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
