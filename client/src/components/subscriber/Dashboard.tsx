import React, { useState, useEffect } from 'react';
import { useApp, type Product } from '../../context/AppContext';
import { useNavigation } from '../../context/NavigationContext';
import { 
  LayoutDashboard, FileText, Calendar, Edit3, Heart, 
  MessageSquare, ShoppingCart, PhoneCall, User, Landmark, 
  LogOut, Home, Sparkles, CheckCircle2, 
  ShieldCheck, Mail, AlertCircle, Coffee, CloudSun, Droplet
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { 
    currentUser, 
    signOut, 
    customers, 
    subscriptionApplications, 
    subscriptionRequests,
    submitSubscriptionRequest,
    products,
    createOrder,
    updateCustomer,
    milkRecords
  } = useApp();
  const { navigateTo } = useNavigation();

  // Active tab state
  const [activeTab, setActiveTab] = useState<'home' | 'details' | 'delivery' | 'deliveryLogs' | 'manage' | 'promise' | 'notifications' | 'recommendations' | 'support' | 'profile'>('home');

  // Request Forms State
  const [requestQty, setRequestQty] = useState(1);
  const [requestAddress, setRequestAddress] = useState('');
  const [reqSuccessMsg, setReqSuccessMsg] = useState('');

  // Profile Form State
  const [profileMobile, setProfileMobile] = useState('');
  const [profileAddress, setProfileAddress] = useState('');
  const [passwordOld, setPasswordOld] = useState('');
  const [passwordNew, setPasswordNew] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [profileSuccessMsg, setProfileSuccessMsg] = useState('');
  const [profileErrorMsg, setProfileErrorMsg] = useState('');

  // Find Customer details (either approved customer profile or pending application info)
  const customerProfile = customers.find(c => c.id === currentUser?.id);
  const customerApp = subscriptionApplications.find(a => a.id === currentUser?.id);

  // Settle status
  let status: 'Pending Approval' | 'Approved' | 'Active' | 'Suspended' = 'Pending Approval';
  let name = currentUser?.name || '';
  let id = currentUser?.id || '';
  let startDate = 'N/A';
  let address = '';
  let mobile = '';
  let quantity = 1;
  let deliveryTime: 'Morning' | 'Evening' | 'Both' = 'Morning';

  if (customerProfile) {
    name = customerProfile.name;
    id = customerProfile.id;
    startDate = customerProfile.createdAt;
    address = customerProfile.address;
    mobile = customerProfile.mobile;
    quantity = customerProfile.quantity;
    status = customerProfile.status === 'Active' ? 'Active' : 'Suspended';
    deliveryTime = customerProfile.deliveryTime;
  } else if (customerApp) {
    name = customerApp.fullName;
    id = customerApp.id;
    startDate = customerApp.submittedAt;
    address = customerApp.address;
    mobile = customerApp.mobile;
    quantity = customerApp.quantity;
    status = customerApp.status === 'Approved' ? 'Approved' : 'Pending Approval';
    deliveryTime = customerApp.deliveryTime;
  }

  // Pre-load states
  useEffect(() => {
    if (customerProfile) {
      setProfileMobile(customerProfile.mobile);
      setProfileAddress(customerProfile.address);
      setRequestAddress(customerProfile.address);
      setRequestQty(customerProfile.quantity);
    } else if (customerApp) {
      setProfileMobile(customerApp.mobile);
      setProfileAddress(customerApp.address);
      setRequestAddress(customerApp.address);
      setRequestQty(customerApp.quantity);
    }
  }, [customerProfile, customerApp]);

  const handleLogout = () => {
    signOut();
    navigateTo('home');
  };

  // Submit Quantity Change Request
  const handleQtyRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setReqSuccessMsg('');

    submitSubscriptionRequest({
      customerId: id,
      customerName: name,
      type: 'Quantity Change',
      details: `Change quantity to ${requestQty} Litres`
    });

    setReqSuccessMsg('Quantity adjustment request submitted to Admin for review.');
  };

  // Submit Address Change Request
  const handleAddressRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setReqSuccessMsg('');

    if (!requestAddress.trim()) return;

    submitSubscriptionRequest({
      customerId: id,
      customerName: name,
      type: 'Address Change',
      details: requestAddress
    });

    setReqSuccessMsg('Address adjustment request submitted to Admin for review.');
  };

  // Submit Pause Request
  const handlePauseRequest = () => {
    setReqSuccessMsg('');
    submitSubscriptionRequest({
      customerId: id,
      customerName: name,
      type: 'Pause',
      details: 'Request to pause daily delivery'
    });
    setReqSuccessMsg('Pause delivery request submitted to Admin for review.');
  };

  // Submit Resume Request
  const handleResumeRequest = () => {
    setReqSuccessMsg('');
    submitSubscriptionRequest({
      customerId: id,
      customerName: name,
      type: 'Resume',
      details: 'Request to resume daily delivery'
    });
    setReqSuccessMsg('Resume delivery request submitted to Admin for review.');
  };

  const handleUpdateContact = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSuccessMsg('');
    setProfileErrorMsg('');

    if (!profileMobile.trim() || !profileAddress.trim()) {
      setProfileErrorMsg('Contact fields cannot be empty.');
      return;
    }

    if (customerProfile) {
      const updated = {
        ...customerProfile,
        mobile: profileMobile,
        address: profileAddress
      };
      updateCustomer(updated);
      setProfileSuccessMsg('Contact information updated successfully. (Note: Official delivery address must be requested via Manage Subscription panel for route auditing)');
    } else {
      setProfileErrorMsg('Pending application profiles cannot be modified online. Please contact support.');
    }
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSuccessMsg('');
    setProfileErrorMsg('');

    if (!passwordOld || !passwordNew || !passwordConfirm) {
      setProfileErrorMsg('All password fields are required.');
      return;
    }

    if (passwordNew !== passwordConfirm) {
      setProfileErrorMsg('New passwords do not match.');
      return;
    }

    if (passwordOld !== 'customer123') {
      setProfileErrorMsg('Incorrect current password.');
      return;
    }

    setProfileSuccessMsg('Password updated successfully! (Demo simulated)');
    setPasswordOld('');
    setPasswordNew('');
    setPasswordConfirm('');
  };

  // Handle Order Recommendation
  const handleOrderProduct = (prod: Product) => {
    if (status !== 'Active') {
      alert('Only active subscription profiles can place on-demand orders.');
      return;
    }
    
    const qty = prompt(`How many units of ${prod.name} (${prod.unit}) would you like to order?`, '1');
    if (!qty) return;
    
    const numQty = parseInt(qty);
    if (isNaN(numQty) || numQty <= 0) {
      alert('Please enter a valid quantity.');
      return;
    }

    createOrder({
      customerName: `${name} (${id})`,
      productName: `${prod.name} (On-Demand)`,
      quantity: numQty,
      amount: numQty * prod.price,
      status: 'Pending'
    });

    alert(`Success! Sourcing order for ${numQty} x ${prod.name} has been logged. Delivery will occur in your next delivery slot.`);
  };

  // Filter requests submitted by this customer
  const customerRequests = subscriptionRequests.filter(r => r.customerId === id);

  const menuItems = [
    { name: 'Subscription Home', icon: <LayoutDashboard className="h-5 w-5" />, key: 'home' as const },
    { name: 'Subscription Details', icon: <FileText className="h-5 w-5" />, key: 'details' as const },
    { name: 'Delivery Information', icon: <Calendar className="h-5 w-5" />, key: 'delivery' as const },
    { name: 'Milk Delivery Logs', icon: <Droplet className="h-5 w-5" />, key: 'deliveryLogs' as const },
    { name: 'Manage Subscription', icon: <Edit3 className="h-5 w-5" />, key: 'manage' as const },
    { name: 'Milk Quality Promise', icon: <Heart className="h-5 w-5" />, key: 'promise' as const },
    { name: 'Portal Notifications', icon: <MessageSquare className="h-5 w-5" />, key: 'notifications' as const },
    { name: 'Order Extra Products', icon: <ShoppingCart className="h-5 w-5" />, key: 'recommendations' as const },
    { name: 'Support Center', icon: <PhoneCall className="h-5 w-5" />, key: 'support' as const },
    { name: 'Profile & Settings', icon: <User className="h-5 w-5" />, key: 'profile' as const },
  ];

  // Delivery Schedules
  const deliverySchedules = [
    { date: new Date().toISOString().split('T')[0], slot: deliveryTime, label: 'Today Delivery Route' },
    { date: new Date(Date.now() + 86400000).toISOString().split('T')[0], slot: deliveryTime, label: 'Tomorrow Delivery Route' },
    { date: new Date(Date.now() + 172800000).toISOString().split('T')[0], slot: deliveryTime, label: 'Upcoming Daily Sourcing' }
  ];

  // Sourced filter of product list ( Butter, Curd, Buttermilk, Rose Milk, Badam Milk)
  const recommendedItems = products.filter(p => 
    !p.hidden && (
      p.name.includes('Butter') || 
      p.name.includes('Curd') || 
      p.name.includes('Buttermilk') || 
      p.name.includes('Rose') || 
      p.name.includes('Badam')
    )
  );

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
              <span className="block text-[9px] uppercase font-bold tracking-widest text-brand-accent-gold -mt-1">Customer Portal</span>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.key}
                onClick={() => setActiveTab(item.key)}
                className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === item.key
                    ? 'bg-brand-cream-light text-brand-green shadow-sm'
                    : 'text-brand-cream-dark hover:bg-white/10 hover:text-brand-cream'
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* User Info & Logout */}
        <div className="mt-8 border-t border-brand-cream-dark/10 pt-6 space-y-4">
          <div className="px-4">
            <span className="block text-[10px] uppercase font-bold text-brand-accent-gold tracking-widest">Active Subscriber</span>
            <span className="font-semibold text-sm block mt-0.5 truncate">{name}</span>
            <span className="text-[10px] font-mono text-brand-cream-dark/50 block mt-0.5">{id}</span>
          </div>

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
      <main className="flex-1 lg:pl-72 flex flex-col min-h-screen">
        
        {/* Top Header Bar */}
        <header className="bg-white border-b border-brand-cream-dark py-5 px-6 sm:px-8 flex justify-between items-center">
          <h2 className="font-display font-extrabold text-xl text-brand-green-dark">
            {activeTab === 'home' && 'Customer Dashboard Home'}
            {activeTab === 'details' && 'My Subscription Details'}
            {activeTab === 'delivery' && 'Delivery Information & Schedules'}
            {activeTab === 'deliveryLogs' && 'Raw Milk Delivery Logs'}
            {activeTab === 'manage' && 'Manage Daily Milk Subscription'}
            {activeTab === 'promise' && 'DairyLuxe Milk Quality Promise'}
            {activeTab === 'notifications' && 'Portal Updates & Notifications'}
            {activeTab === 'recommendations' && 'Product Recommendations Catalog'}
            {activeTab === 'support' && 'Customer Support Desk'}
            {activeTab === 'profile' && 'Portal Settings & Password'}
          </h2>
          
          <div className="flex items-center gap-4">
            <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-extrabold uppercase ${
              status === 'Active' ? 'bg-brand-green-soft text-brand-green' :
              status === 'Approved' ? 'bg-blue-50 text-blue-800 border border-blue-200' :
              status === 'Suspended' ? 'bg-red-50 text-red-800 border border-red-200' :
              'bg-amber-50 text-amber-800 border border-amber-200'
            }`}>
              {status}
            </span>
          </div>
        </header>

        {/* Content Pane */}
        <div className="flex-grow p-6 sm:p-8 max-w-5xl w-full mx-auto">
          
          {/* TAB: HOME */}
          {activeTab === 'home' && (
            <div className="space-y-6">
              
              {/* Welcome Message Card */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-cream-dark shadow-sm space-y-3">
                <h3 className="text-2xl font-display font-extrabold text-brand-green-dark">Welcome to DairyLuxe, {name}!</h3>
                <p className="text-xs text-brand-charcoal/60">
                  Customer ID: <strong className="font-mono text-brand-brown">{id}</strong> | Status: <strong className="text-brand-green">{status}</strong>
                </p>
                <p className="text-xs text-brand-charcoal/40">Enrollment Date: {startDate}</p>
              </div>

              {/* Status Warning Banners */}
              {status === 'Pending Approval' && (
                <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6 text-amber-900 space-y-2.5 animate-slide-up">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-6 w-6 text-amber-700" />
                    <h4 className="font-display font-extrabold text-base">Subscription Request Pending Approval</h4>
                  </div>
                  <p className="text-xs leading-relaxed font-semibold">
                    Your enrollment request is currently under review. Our regional logistics inspector will inspect and map your route details. Deliveries will commence soon.
                  </p>
                </div>
              )}

              {status === 'Approved' && (
                <div className="bg-blue-50 border border-blue-200 rounded-3xl p-6 text-blue-950 space-y-2.5 animate-slide-up">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-6 w-6 text-blue-600" />
                    <h4 className="font-display font-extrabold text-base">Subscription Setup Approved!</h4>
                  </div>
                  <p className="text-xs leading-relaxed font-semibold">
                    Your DairyLuxe milk subscription has been approved. Deliveries are scheduled to start within 24 hours. Your local milk runner has been assigned.
                  </p>
                </div>
              )}

              {status === 'Active' && (
                <div className="bg-brand-green-soft border border-brand-green/20 rounded-3xl p-6 text-brand-green-dark space-y-2.5 animate-slide-up">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-6 w-6 text-brand-green" />
                    <h4 className="font-display font-extrabold text-base">Active Milk Subscription</h4>
                  </div>
                  <p className="text-xs leading-relaxed">
                    Your subscription is fully active. Dairy raw milk will arrive daily at your doorstep according to your slot settings.
                  </p>
                </div>
              )}

              {/* Stats Overview */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-brand-cream-dark shadow-sm space-y-2 cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab('details')}>
                  <span className="text-[10px] font-bold text-brand-charcoal/40 uppercase tracking-widest block">Daily Volume</span>
                  <span className="text-2xl font-display font-black text-brand-green-dark">{quantity} Litres</span>
                  <span className="text-[10px] text-brand-brown-light font-bold block mt-2">Manage settings &rarr;</span>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-brand-cream-dark shadow-sm space-y-2 cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab('delivery')}>
                  <span className="text-[10px] font-bold text-brand-charcoal/40 uppercase tracking-widest block">Preferred Window</span>
                  <span className="text-2xl font-display font-black text-brand-green-dark uppercase">{deliveryTime} Delivery</span>
                  <span className="text-[10px] text-brand-brown-light font-bold block mt-2">View delivery schedules &rarr;</span>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-brand-cream-dark shadow-sm space-y-2 cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab('recommendations')}>
                  <span className="text-[10px] font-bold text-brand-charcoal/40 uppercase tracking-widest block">Explore Extra products</span>
                  <span className="text-base font-semibold text-brand-charcoal block truncate">Butter, Curds & Flavoured Milks</span>
                  <span className="text-[10px] text-brand-brown-light font-bold block mt-2">Order on-demand items &rarr;</span>
                </div>
              </div>

            </div>
          )}

          {/* TAB: MILK DELIVERY LOGS */}
          {activeTab === 'deliveryLogs' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-cream-dark shadow-sm space-y-6 animate-slide-up">
              <div>
                <h3 className="text-lg font-display font-extrabold text-brand-green-dark border-b border-brand-cream-dark pb-3">Milk Delivery History</h3>
                <p className="text-xs text-brand-charcoal/50 mt-1">This panel displays all computerized distributions logged at your doorstep by our company workers.</p>
              </div>

              {milkRecords.filter(r => r.targetId === id && r.targetType === 'customer').length === 0 ? (
                <div className="p-12 text-center text-xs text-brand-charcoal/40">
                  No delivery transactions have been recorded for your subscriber ID yet.
                </div>
              ) : (
                <div className="overflow-x-auto text-xs">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-brand-gray-light text-brand-charcoal/60 border-b border-brand-cream-dark font-semibold">
                        <th className="p-4 pl-6">Record ID</th>
                        <th className="p-4">Milk Quantity</th>
                        <th className="p-4">Delivery Slot</th>
                        <th className="p-4">Handled By (Worker Name)</th>
                        <th className="p-4 pr-6">Delivery Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-cream-dark">
                      {milkRecords
                        .filter(r => r.targetId === id && r.targetType === 'customer')
                        .map((log) => (
                          <tr key={log.id} className="hover:bg-brand-cream/10 transition-colors">
                            <td className="p-4 pl-6 font-mono text-brand-charcoal/60 font-semibold">{log.id}</td>
                            <td className="p-4 font-bold text-brand-green-dark">{log.quantity} Litres</td>
                            <td className="p-4 font-semibold text-brand-charcoal/70 uppercase text-[10px]">{log.slot}</td>
                            <td className="p-4 text-brand-charcoal font-medium">{log.workerName} ({log.workerId})</td>
                            <td className="p-4 pr-6 text-brand-charcoal/50">{log.date}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB: SUBSCRIPTION DETAILS */}
          {activeTab === 'details' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-cream-dark shadow-sm space-y-6 animate-slide-up">
              <h3 className="text-lg font-display font-extrabold text-brand-green-dark border-b border-brand-cream-dark pb-3">Subscription Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
                <div className="space-y-4">
                  <div>
                    <span className="block text-[9px] uppercase font-bold text-brand-charcoal/40">Customer ID</span>
                    <span className="font-mono font-bold text-sm text-brand-brown">{id}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] uppercase font-bold text-brand-charcoal/40">Full Client Name</span>
                    <span className="font-semibold text-brand-charcoal text-sm">{name}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] uppercase font-bold text-brand-charcoal/40">Contact Phone</span>
                    <span className="font-semibold text-brand-charcoal text-sm">{mobile}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <span className="block text-[9px] uppercase font-bold text-brand-charcoal/40">Daily Quantity Allocation</span>
                    <span className="font-bold text-brand-green-dark text-sm">{quantity} Litres / Day</span>
                  </div>
                  <div>
                    <span className="block text-[9px] uppercase font-bold text-brand-charcoal/40">Preferred Delivery Slot</span>
                    <span className="font-semibold text-brand-charcoal text-sm uppercase">{deliveryTime} Slabs</span>
                  </div>
                  <div>
                    <span className="block text-[9px] uppercase font-bold text-brand-charcoal/40">Enrollment Start Date</span>
                    <span className="font-semibold text-brand-charcoal text-sm">{startDate}</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-brand-cream-dark pt-6 text-xs">
                <span className="block text-[9px] uppercase font-bold text-brand-charcoal/40">Registered Delivery Location</span>
                <span className="font-semibold text-brand-charcoal leading-relaxed block text-sm">{address}</span>
              </div>
            </div>
          )}

          {/* TAB: DELIVERY INFORMATION */}
          {activeTab === 'delivery' && (
            <div className="space-y-6 animate-slide-up">
              
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-cream-dark shadow-sm space-y-4">
                <h3 className="text-lg font-display font-extrabold text-brand-green-dark border-b border-brand-cream-dark pb-3">Delivery Slot Mode</h3>
                
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-brand-green-soft text-brand-green flex items-center justify-center flex-shrink-0">
                    {deliveryTime === 'Morning' ? <CloudSun className="h-6 w-6" /> : deliveryTime === 'Evening' ? <Coffee className="h-6 w-6" /> : <Sparkles className="h-6 w-6" />}
                  </div>
                  <div>
                    <span className="font-bold text-brand-green-dark text-sm block">
                      {deliveryTime === 'Morning' && 'Morning Sourcing Delivery (5:30 AM - 7:00 AM)'}
                      {deliveryTime === 'Evening' && 'Evening Sourcing Delivery (5:30 PM - 7:00 PM)'}
                      {deliveryTime === 'Both' && 'Both Slots Delivery (Morning & Evening Collection)'}
                    </span>
                    <span className="text-[10px] text-brand-charcoal/50 block mt-0.5">
                      {deliveryTime === 'Both' ? `${quantity} Litres will be delivered in the Morning AND another ${quantity} Litres in the Evening.` : `Allocated daily quantity of ${quantity} Litres delivered during preferred slot.`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Upcoming delivery schedules */}
              <div className="space-y-4">
                <h4 className="font-display font-extrabold text-sm text-brand-green-dark">Upcoming Sourcing delivery Schedule</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {deliverySchedules.map((sched, idx) => (
                    <div key={idx} className="bg-white p-5 rounded-2xl border border-brand-cream-dark shadow-sm space-y-3">
                      <div className="flex justify-between items-center text-[10px] font-bold text-brand-charcoal/40 uppercase">
                        <span>{sched.label}</span>
                        <Calendar className="h-4 w-4" />
                      </div>
                      <div className="space-y-1">
                        <span className="font-bold text-brand-green-dark text-sm block">{sched.date}</span>
                        <span className="text-[10px] text-brand-brown-light font-bold block uppercase">{sched.slot} Slot</span>
                      </div>
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-brand-green-soft text-brand-green uppercase">
                        {status === 'Active' ? 'Scheduled' : 'On Hold'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB: MANAGE SUBSCRIPTION */}
          {activeTab === 'manage' && (
            <div className="space-y-8 animate-slide-up">
              
              {/* Alert Message */}
              {reqSuccessMsg && (
                <div className="bg-brand-green-soft text-brand-green border border-brand-green/20 rounded-2xl p-4 text-xs font-semibold">
                  {reqSuccessMsg}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Form: Quantity Adjust */}
                <form onSubmit={handleQtyRequest} className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-cream-dark shadow-sm space-y-4">
                  <h4 className="font-display font-extrabold text-sm text-brand-green-dark">Request Quantity Change</h4>
                  <p className="text-[10px] text-brand-charcoal/50">Change your daily allocation volume (subject to supervisor approval)</p>
                  
                  <div>
                    <label className="block text-[10px] font-bold text-brand-charcoal uppercase tracking-wider mb-2">New Quantity Required (Litres)</label>
                    <input
                      type="number"
                      required
                      min={0.5}
                      max={10}
                      step={0.5}
                      value={isNaN(requestQty) ? '' : requestQty}
                      onChange={(e) => setRequestQty(parseFloat(e.target.value) || 0)}
                      className="w-full bg-brand-cream-light border border-brand-cream-dark focus:border-brand-green focus:ring-1 focus:ring-brand-green focus:outline-none rounded-xl px-3 py-2.5 text-xs text-brand-charcoal transition-all"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="bg-brand-green text-brand-cream hover:bg-brand-green-light font-bold px-5 py-2.5 rounded-xl text-xs cursor-pointer transition-colors shadow-sm"
                    >
                      Request Quantity Change
                    </button>
                  </div>
                </form>

                {/* Form: Address Change */}
                <form onSubmit={handleAddressRequest} className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-cream-dark shadow-sm space-y-4">
                  <h4 className="font-display font-extrabold text-sm text-brand-green-dark">Request Address Change</h4>
                  <p className="text-[10px] text-brand-charcoal/50">Modify daily shipping point parameters for routing schedules</p>
                  
                  <div>
                    <label className="block text-[10px] font-bold text-brand-charcoal uppercase tracking-wider mb-2">New Delivery Location Sourcing</label>
                    <textarea
                      required
                      rows={2}
                      value={requestAddress}
                      onChange={(e) => setRequestAddress(e.target.value)}
                      className="w-full bg-brand-cream-light border border-brand-cream-dark focus:border-brand-green focus:ring-1 focus:ring-brand-green focus:outline-none rounded-xl px-3 py-2.5 text-xs text-brand-charcoal transition-all"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="bg-brand-green text-brand-cream hover:bg-brand-green-light font-bold px-5 py-2.5 rounded-xl text-xs cursor-pointer transition-colors shadow-sm"
                    >
                      Request Address Change
                    </button>
                  </div>
                </form>

              </div>

              {/* Pause/Resume toggler */}
              <div className="bg-brand-cream p-6 rounded-2xl border border-brand-cream-dark space-y-4">
                <h4 className="font-display font-extrabold text-sm text-brand-brown">Temporary Pause or Resume Sourcing</h4>
                <p className="text-xs text-brand-charcoal/70 leading-relaxed">
                  Going out of town? You can pause your milk delivery temporarily and resume once you return. Requests are processed instantly by local delivery supervisors.
                </p>
                <div className="flex gap-3">
                  {status === 'Active' ? (
                    <button
                      type="button"
                      onClick={handlePauseRequest}
                      className="bg-red-700 text-brand-cream hover:bg-red-800 font-bold px-5 py-2.5 rounded-xl text-xs cursor-pointer transition-colors shadow-sm"
                    >
                      Pause Subscription Sourcing
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResumeRequest}
                      className="bg-brand-green text-brand-cream hover:bg-brand-green-light font-bold px-5 py-2.5 rounded-xl text-xs cursor-pointer transition-colors shadow-sm"
                    >
                      Resume Subscription Sourcing
                    </button>
                  )}
                </div>
              </div>

              {/* Change Requests Status Log */}
              <div className="bg-white rounded-2xl border border-brand-cream-dark shadow-sm overflow-hidden">
                <div className="p-4 border-b border-brand-cream-dark font-bold text-xs text-brand-green-dark bg-brand-gray-light uppercase">
                  My Sourcing Adjustment Requests Archive
                </div>
                {customerRequests.length === 0 ? (
                  <div className="p-6 text-center text-xs text-brand-charcoal/40">
                    No adjustment requests logged.
                  </div>
                ) : (
                  <div className="overflow-x-auto text-xs">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-brand-cream-light text-brand-charcoal/60 border-b border-brand-cream-dark font-semibold">
                          <th className="p-3 pl-6">Req ID</th>
                          <th className="p-3">Modification Type</th>
                          <th className="p-3">Details Requested</th>
                          <th className="p-3">Date</th>
                          <th className="p-3 text-right pr-6">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-brand-cream-dark">
                        {customerRequests.map((req) => (
                          <tr key={req.id} className="hover:bg-brand-cream/10">
                            <td className="p-3 pl-6 font-mono text-brand-charcoal/60 font-semibold">{req.id.slice(-6)}</td>
                            <td className="p-3 font-semibold text-brand-charcoal">{req.type}</td>
                            <td className="p-3 text-brand-charcoal/80 truncate max-w-xs">{req.details}</td>
                            <td className="p-3 text-brand-charcoal/40">{req.submittedAt}</td>
                            <td className="p-3 text-right pr-6">
                              <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                                req.status === 'Approved' ? 'bg-brand-green-soft text-brand-green' :
                                req.status === 'Rejected' ? 'bg-red-50 text-red-800' :
                                'bg-amber-50 text-amber-800 border border-amber-100'
                              }`}>
                                {req.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB: QUALITY PROMISE */}
          {activeTab === 'promise' && (
            <div className="space-y-6 animate-slide-up">
              <div>
                <h3 className="font-display font-extrabold text-base text-brand-green-dark">Milk Quality Promise</h3>
                <p className="text-[11px] text-brand-charcoal/40">Our commitment to pure, ethical, cold-chained daily dairy delivery</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  {
                    title: 'Fresh Daily Collection',
                    desc: 'Procured daily at 5:00 AM and 5:00 PM straight from rural partner cattle. Collected in computerized testing nodes and immediately sent to chilling centers.'
                  },
                  {
                    title: 'Farm-to-Home Delivery',
                    desc: 'Completely unpasteurized raw A2 milk delivered cold to your home within 3 hours of collection. Sourced from grass-fed native Indian cows.'
                  },
                  {
                    title: 'Quality Tested Milk',
                    desc: 'Every single batch undergoes digital computerized checks for solid fat (SNF), water dilution, and somatic cell count. Top incentives paid to farmers for excellence.'
                  },
                  {
                    title: 'No Artificial Preservatives',
                    desc: 'We strictly ban urea, starch, detergents, and synthetic hormones (like oxytocin). Guaranteed 100% natural pure raw milk for children.'
                  }
                ].map((p, idx) => (
                  <div key={idx} className="bg-white p-6 rounded-2xl border border-brand-cream-dark shadow-sm space-y-2 flex items-start gap-4">
                    <div className="h-10 w-10 rounded-xl bg-brand-green-soft text-brand-green flex items-center justify-center flex-shrink-0">
                      <Heart className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-display font-bold text-sm text-brand-green-dark">{p.title}</h4>
                      <p className="text-xs text-brand-charcoal/70 leading-relaxed">{p.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <div className="space-y-6 animate-slide-up">
              <div>
                <h3 className="font-display font-extrabold text-base text-brand-green-dark">Portal Notifications</h3>
                <p className="text-[11px] text-brand-charcoal/40">Live delivery logs, subscription adjustments, and community announcements</p>
              </div>

              <div className="space-y-4">
                {[
                  {
                    title: 'Morning delivery Dispatch Log',
                    content: 'Your daily raw milk morning dispatch completed by 6:05 AM. Sourced via Coimbatore Hub route.',
                    date: new Date().toISOString().split('T')[0],
                    type: 'Delivery Update'
                  },
                  {
                    title: 'Subscription Status Setup',
                    content: 'Welcome! Your digital account setup for daily delivery is verified and approved.',
                    date: startDate,
                    type: 'Subscription Update'
                  },
                  {
                    title: 'Holiday Sourcing delivery schedule',
                    content: 'Deliveries will occur as scheduled on upcoming holiday slots. Let us know if you need to pause.',
                    date: '2026-06-18',
                    type: 'Holiday Notice'
                  },
                  {
                    title: 'New Product Launch: Saffron Badam Milk',
                    content: 'A new rich flavoured milk made with ground almond paste and organic saffron strands is available for catering order.',
                    date: '2026-06-20',
                    type: 'Product Launch'
                  }
                ].map((notif, idx) => (
                  <div key={idx} className="bg-white p-5 rounded-2xl border border-brand-cream-dark shadow-sm space-y-2 flex flex-col sm:flex-row justify-between sm:items-start gap-3">
                    <div className="space-y-1">
                      <span className={`inline-block px-2.5 py-0.5 rounded text-[9px] font-bold uppercase mb-1 ${
                        notif.type.includes('Delivery') ? 'bg-brand-green-soft text-brand-green' :
                        notif.type.includes('Setup') || notif.type.includes('Subscription') ? 'bg-blue-50 text-blue-800' :
                        notif.type.includes('Holiday') ? 'bg-amber-50 text-amber-800' :
                        'bg-brand-cream-dark text-brand-brown'
                      }`}>
                        {notif.type}
                      </span>
                      <h4 className="font-display font-extrabold text-sm text-brand-green-dark">{notif.title}</h4>
                      <p className="text-xs text-brand-charcoal/70 leading-relaxed">{notif.content}</p>
                    </div>
                    <span className="text-[10px] text-brand-charcoal/40 font-semibold self-start sm:self-auto">{notif.date}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: RECOMMENDATIONS */}
          {activeTab === 'recommendations' && (
            <div className="space-y-6 animate-slide-up">
              <div>
                <h3 className="font-display font-extrabold text-base text-brand-green-dark">Extra Dairy Products</h3>
                <p className="text-[11px] text-brand-charcoal/40">On-demand country butter, traditional set curd, cooling beverages, and sweet saffron badam milk</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {recommendedItems.map((prod) => (
                  <div key={prod.id} className="bg-white rounded-2xl border border-brand-cream-dark shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div className="h-44 overflow-hidden relative">
                      <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" />
                      <span className="absolute top-3 right-3 bg-brand-green text-brand-cream text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm">
                        ₹{prod.price} / {prod.unit}
                      </span>
                    </div>
                    <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                      <div className="space-y-1">
                        <h4 className="font-display font-extrabold text-base text-brand-green-dark">{prod.name}</h4>
                        <p className="text-xs text-brand-charcoal/70 leading-relaxed">{prod.description}</p>
                      </div>
                      
                      <button
                        onClick={() => handleOrderProduct(prod)}
                        className="w-full bg-brand-green text-brand-cream hover:bg-brand-green-light font-bold py-2.5 rounded-xl text-xs transition-colors cursor-pointer mt-2 text-center"
                      >
                        Order Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: SUPPORT CENTER */}
          {activeTab === 'support' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-cream-dark shadow-sm space-y-6 animate-slide-up">
              <div>
                <h3 className="font-display font-extrabold text-base text-brand-green-dark">Customer Support Center</h3>
                <p className="text-[11px] text-brand-charcoal/40">Contact our dispatch help desk or file delivery route queries</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                <div className="bg-brand-cream-light p-6 rounded-2xl border border-brand-cream-dark/60 space-y-3">
                  <div className="h-10 w-10 bg-brand-green-soft text-brand-green rounded-full flex items-center justify-center mx-auto">
                    <PhoneCall className="h-5 w-5" />
                  </div>
                  <h4 className="text-xs font-bold text-brand-green-dark">Customer Care</h4>
                  <span className="text-xs font-mono font-semibold block text-brand-brown">+91 94455 00999</span>
                  <p className="text-[10px] text-brand-charcoal/50">Direct dispatch line</p>
                </div>

                <div className="bg-brand-cream-light p-6 rounded-2xl border border-brand-cream-dark/60 space-y-3">
                  <div className="h-10 w-10 bg-brand-green-soft text-brand-green rounded-full flex items-center justify-center mx-auto">
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <h4 className="text-xs font-bold text-brand-green-dark">WhatsApp Support</h4>
                  <span className="text-xs font-mono font-semibold block text-brand-brown">+91 94455 00888</span>
                  <p className="text-[10px] text-brand-charcoal/50">Route delivery alerts</p>
                </div>

                <div className="bg-brand-cream-light p-6 rounded-2xl border border-brand-cream-dark/60 space-y-3">
                  <div className="h-10 w-10 bg-brand-green-soft text-brand-green rounded-full flex items-center justify-center mx-auto">
                    <Mail className="h-5 w-5" />
                  </div>
                  <h4 className="text-xs font-bold text-brand-green-dark">Email Help Desk</h4>
                  <span className="text-xs font-mono font-semibold block text-brand-brown select-all text-brand-brown">care@dairyluxe.com</span>
                  <p className="text-[10px] text-brand-charcoal/50">Billing & general queries</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB: PROFILE PAGE */}
          {activeTab === 'profile' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-slide-up">
              
              {/* Personal Information */}
              <form onSubmit={handleUpdateContact} className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-cream-dark shadow-sm space-y-4">
                <h3 className="text-lg font-display font-extrabold text-brand-green-dark border-b border-brand-cream-dark pb-3">Contact Settings</h3>
                
                {profileSuccessMsg && (
                  <div className="bg-brand-green-soft text-brand-green border border-brand-green/20 rounded-xl p-3 text-xs">
                    {profileSuccessMsg}
                  </div>
                )}

                {profileErrorMsg && (
                  <div className="bg-red-50 text-red-800 border border-red-200 rounded-xl p-3 text-xs">
                    {profileErrorMsg}
                  </div>
                )}

                <div>
                  <label className="block text-[10px] font-bold text-brand-charcoal uppercase tracking-wider mb-2">Registered Mobile</label>
                  <input
                    type="tel"
                    required
                    value={profileMobile}
                    onChange={(e) => setProfileMobile(e.target.value)}
                    className="w-full bg-brand-cream-light border border-brand-cream-dark focus:border-brand-green focus:ring-1 focus:ring-brand-green focus:outline-none rounded-xl px-3 py-2.5 text-xs text-brand-charcoal transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-brand-charcoal uppercase tracking-wider mb-2">Communication Address</label>
                  <textarea
                    required
                    rows={3}
                    value={profileAddress}
                    onChange={(e) => setProfileAddress(e.target.value)}
                    className="w-full bg-brand-cream-light border border-brand-cream-dark focus:border-brand-green focus:ring-1 focus:ring-brand-green focus:outline-none rounded-xl px-3 py-2.5 text-xs text-brand-charcoal transition-all"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="bg-brand-green text-brand-cream hover:bg-brand-green-light font-bold px-5 py-2.5 rounded-xl text-xs cursor-pointer transition-colors shadow-sm"
                  >
                    Save Contact Info
                  </button>
                </div>
              </form>

              {/* Password change */}
              <form onSubmit={handleChangePassword} className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-cream-dark shadow-sm space-y-4">
                <h3 className="text-lg font-display font-extrabold text-brand-green-dark border-b border-brand-cream-dark pb-3">Update Portal Password</h3>
                
                <div>
                  <label className="block text-[10px] font-bold text-brand-charcoal uppercase tracking-wider mb-2">Current Temporary Password</label>
                  <input
                    type="password"
                    required
                    value={passwordOld}
                    onChange={(e) => setPasswordOld(e.target.value)}
                    placeholder="e.g. customer123"
                    className="w-full bg-brand-cream-light border border-brand-cream-dark focus:border-brand-green focus:ring-1 focus:ring-brand-green focus:outline-none rounded-xl px-3 py-2.5 text-xs text-brand-charcoal transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-brand-charcoal uppercase tracking-wider mb-2">New Secure Password</label>
                  <input
                    type="password"
                    required
                    value={passwordNew}
                    onChange={(e) => setPasswordNew(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-brand-cream-light border border-brand-cream-dark focus:border-brand-green focus:ring-1 focus:ring-brand-green focus:outline-none rounded-xl px-3 py-2.5 text-xs text-brand-charcoal transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-brand-charcoal uppercase tracking-wider mb-2">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-brand-cream-light border border-brand-cream-dark focus:border-brand-green focus:ring-1 focus:ring-brand-green focus:outline-none rounded-xl px-3 py-2.5 text-xs text-brand-charcoal transition-all"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="bg-brand-green text-brand-cream hover:bg-brand-green-light font-bold px-5 py-2.5 rounded-xl text-xs cursor-pointer transition-colors shadow-sm"
                  >
                    Change Password
                  </button>
                </div>
              </form>

            </div>
          )}

        </div>
      </main>

    </div>
  );
};
