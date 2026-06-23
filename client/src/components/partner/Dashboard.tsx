import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useNavigation } from '../../context/NavigationContext';
import { 
  LayoutDashboard, FileText, LogOut, Home, Landmark, 
  CheckSquare, MessageSquare, PhoneCall, User, Award, Heart, 
  HelpCircle, Sparkles, CheckCircle2, Activity, ShieldCheck, Mail, Droplet
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { 
    currentUser, 
    signOut, 
    partners, 
    partnerApplications, 
    announcements, 
    updatePartner,
    milkRecords
  } = useApp();
  const { navigateTo } = useNavigation();

  // Active tab state
  const [activeTab, setActiveTab] = useState<'home' | 'details' | 'sourcingLogs' | 'program' | 'benefits' | 'compensation' | 'guidelines' | 'announcements' | 'training' | 'support' | 'profile'>('home');

  // Guidelines checkbox state (persisted locally)
  const [agreedGuidelines, setAgreedGuidelines] = useState(false);

  // Profile forms state
  const [profileMobile, setProfileMobile] = useState('');
  const [profileAddress, setProfileAddress] = useState('');
  const [passwordOld, setPasswordOld] = useState('');
  const [passwordNew, setPasswordNew] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [profileSuccessMsg, setProfileSuccessMsg] = useState('');
  const [profileErrorMsg, setProfileErrorMsg] = useState('');

  // Find Partner details (either approved partner profile or pending application info)
  const partnerProfile = partners.find(p => p.id === currentUser?.id);
  const partnerApp = partnerApplications.find(a => a.id === currentUser?.id);

  // Settle status
  let status: 'Pending Review' | 'Approved' | 'Active' | 'Suspended' = 'Pending Review';
  let name = currentUser?.name || '';
  let id = currentUser?.id || '';
  let joinDate = 'N/A';
  let address = '';
  let mobile = '';
  let village = '';
  let district = '';
  let experience = '';
  let collectionSlot = 'Both';

  if (partnerProfile) {
    name = partnerProfile.name;
    id = partnerProfile.id;
    joinDate = partnerProfile.createdAt;
    address = partnerProfile.address;
    mobile = partnerProfile.mobile;
    village = partnerProfile.village;
    district = partnerProfile.district;
    experience = partnerProfile.experience;
    status = partnerProfile.status === 'Active' ? 'Active' : 'Suspended';
    collectionSlot = partnerProfile.collectionSlot || 'Both';
  } else if (partnerApp) {
    name = partnerApp.fullName;
    id = partnerApp.id;
    joinDate = partnerApp.submittedAt;
    address = partnerApp.address;
    mobile = partnerApp.mobile;
    village = partnerApp.village;
    district = partnerApp.district;
    experience = partnerApp.farmingExperience;
    status = partnerApp.status === 'Approved' ? 'Approved' : 'Pending Review';
  }

  // Pre-load profile details
  useEffect(() => {
    if (partnerProfile) {
      setProfileMobile(partnerProfile.mobile);
      setProfileAddress(partnerProfile.address);
    } else if (partnerApp) {
      setProfileMobile(partnerApp.mobile);
      setProfileAddress(partnerApp.address);
    }
    
    // Check if agreed already
    const agreed = localStorage.getItem(`agreed_guidelines_${id}`);
    if (agreed === 'true') {
      setAgreedGuidelines(true);
    }
  }, [partnerProfile, partnerApp, id]);

  const handleLogout = () => {
    signOut();
    navigateTo('home');
  };

  const handleUpdateContact = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSuccessMsg('');
    setProfileErrorMsg('');

    if (!profileMobile.trim() || !profileAddress.trim()) {
      setProfileErrorMsg('Contact fields cannot be left blank.');
      return;
    }

    if (partnerProfile) {
      const updated = {
        ...partnerProfile,
        mobile: profileMobile,
        address: profileAddress
      };
      updatePartner(updated);
      setProfileSuccessMsg('Contact information updated successfully.');
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

    if (passwordOld !== 'partner123') {
      setProfileErrorMsg('Incorrect current password.');
      return;
    }

    setProfileSuccessMsg('Password updated successfully! (Demo simulated)');
    setPasswordOld('');
    setPasswordNew('');
    setPasswordConfirm('');
  };

  const handleAgreeCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setAgreedGuidelines(checked);
    localStorage.setItem(`agreed_guidelines_${id}`, checked ? 'true' : 'false');
  };

  // Cows List
  const cowsList = partnerProfile?.cows || [];

  const menuItems = [
    { name: 'Dashboard Home', icon: <LayoutDashboard className="h-5 w-5" />, key: 'home' as const },
    { name: 'Partner Profile', icon: <User className="h-5 w-5" />, key: 'details' as const },
    { name: 'Milk Sourcing Logs', icon: <Droplet className="h-5 w-5" />, key: 'sourcingLogs' as const },
    { name: 'Assigned Program & Cattle', icon: <Activity className="h-5 w-5" />, key: 'program' as const },
    { name: 'Compensation & Payouts', icon: <FileText className="h-5 w-5" />, key: 'compensation' as const },
    { name: 'Partner Benefits', icon: <Award className="h-5 w-5" />, key: 'benefits' as const },
    { name: 'Company Rules', icon: <CheckSquare className="h-5 w-5" />, key: 'guidelines' as const },
    { name: 'Announcements', icon: <MessageSquare className="h-5 w-5" />, key: 'announcements' as const },
    { name: 'Training Resources', icon: <Sparkles className="h-5 w-5" />, key: 'training' as const },
    { name: 'Support Center', icon: <PhoneCall className="h-5 w-5" />, key: 'support' as const },
    { name: 'Portal Settings', icon: <User className="h-5 w-5" />, key: 'profile' as const },
  ];

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
              <span className="block text-[9px] uppercase font-bold tracking-widest text-brand-accent-gold -mt-1">Partner Portal</span>
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
            <span className="block text-[10px] uppercase font-bold text-brand-accent-gold tracking-widest">Sourcing Partner</span>
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

      {/* Main Panel Content Sourcing */}
      <main className="flex-1 lg:pl-72 flex flex-col min-h-screen">
        
        {/* Top Header Bar */}
        <header className="bg-white border-b border-brand-cream-dark py-5 px-6 sm:px-8 flex justify-between items-center">
          <h2 className="font-display font-extrabold text-xl text-brand-green-dark">
            {activeTab === 'home' && 'Partner Dashboard Home'}
            {activeTab === 'details' && 'Partner Sourcing Profile'}
            {activeTab === 'sourcingLogs' && 'Raw Milk Sourcing Logs'}
            {activeTab === 'program' && 'Assigned Program & Cattle Details'}
            {activeTab === 'benefits' && 'DairyLuxe Partner Benefits'}
            {activeTab === 'compensation' && 'Compensation & Payout Slabs'}
            {activeTab === 'guidelines' && 'Rules, Guidelines & Safety'}
            {activeTab === 'announcements' && 'Company Announcements'}
            {activeTab === 'training' && 'Training & Sourcing Resources'}
            {activeTab === 'support' && 'Supervisor & Veterinary Support'}
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
              
              {/* Custom Welcome Message */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-cream-dark shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-2">
                  <h3 className="text-2xl font-display font-extrabold text-brand-green-dark">Welcome back, {name}!</h3>
                  <p className="text-xs text-brand-charcoal/60">
                    Partner ID: <strong className="font-mono text-brand-brown">{id}</strong> | Sourcing Status: <strong className="text-brand-green">{status}</strong>
                  </p>
                  <p className="text-xs text-brand-charcoal/40">Enrollment Join Date: {joinDate}</p>
                </div>
                <div className="bg-brand-green-soft p-4 rounded-2xl border border-brand-green/10 flex items-center gap-3">
                  <Sparkles className="h-6 w-6 text-brand-green" />
                  <span className="text-[11px] font-bold text-brand-green-dark tracking-wide uppercase">Local Hub: {village || 'Sourcing'}</span>
                </div>
              </div>

              {/* Status banner logic */}
              {status === 'Pending Review' && (
                <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6 text-amber-900 space-y-2.5 animate-slide-up">
                  <div className="flex items-center gap-2">
                    <HelpCircle className="h-6 w-6 text-amber-700" />
                    <h4 className="font-display font-extrabold text-base">Application Under Sourcing Review</h4>
                  </div>
                  <p className="text-xs leading-relaxed font-semibold">
                    Your application is currently under review. Our regional dairy officer will visit your village sourcing point to inspect cattle housing and health conditions soon.
                  </p>
                </div>
              )}

              {status === 'Approved' && (
                <div className="bg-blue-50 border border-blue-200 rounded-3xl p-6 text-blue-950 space-y-2.5 animate-slide-up">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-6 w-6 text-blue-600" />
                    <h4 className="font-display font-extrabold text-base">Partnership Approved!</h4>
                  </div>
                  <p className="text-xs leading-relaxed font-semibold">
                    Welcome to DairyLuxe. Your partnership has been approved. A supervisor will visit to setup your digital weighing scales and computer fat testing kits.
                  </p>
                </div>
              )}

              {status === 'Active' && (
                <div className="bg-brand-green-soft border border-brand-green/20 rounded-3xl p-6 text-brand-green-dark space-y-2.5 animate-slide-up">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-6 w-6 text-brand-green" />
                    <h4 className="font-display font-extrabold text-base">Partnership Active</h4>
                  </div>
                  <p className="text-xs leading-relaxed">
                    Your sourcing partnership is currently active and in good standing. Clean milk collections occur daily in the morning and evening slots.
                  </p>
                </div>
              )}

              {/* Dashboard Slabs Overview */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-brand-cream-dark shadow-sm space-y-2 cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab('program')}>
                  <span className="text-[10px] font-bold text-brand-charcoal/40 uppercase tracking-widest block">Assigned Program</span>
                  <span className="text-2xl font-display font-black text-brand-green-dark">
                    {status === 'Pending Review' ? '0 Cattle' : '1 Bull, 6 Cows'}
                  </span>
                  <span className="text-[10px] text-brand-brown-light font-bold block mt-2">View assigned group & program details &rarr;</span>
                </div>
                
                <div className="bg-white p-6 rounded-2xl border border-brand-cream-dark shadow-sm space-y-2 cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab('compensation')}>
                  <span className="text-[10px] font-bold text-brand-charcoal/40 uppercase tracking-widest block">Milk Sourcing Price</span>
                  <span className="text-2xl font-display font-black text-brand-green-dark">₹42 - ₹54 / Litre</span>
                  <span className="text-[10px] text-brand-brown-light font-bold block mt-2">Based on computerized fat & SNF testing</span>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-brand-cream-dark shadow-sm space-y-2 cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab('announcements')}>
                  <span className="text-[10px] font-bold text-brand-charcoal/40 uppercase tracking-widest block">Recent Notice</span>
                  <span className="text-sm font-semibold text-brand-charcoal block truncate">
                    {announcements.length > 0 ? announcements[0].title : 'No notices'}
                  </span>
                  <span className="text-[10px] text-brand-brown-light font-bold block mt-2">View announcements Board &rarr;</span>
                </div>
              </div>

              {/* Guidelines Quick Checklist */}
              <div className="bg-brand-cream p-6 rounded-2xl border border-brand-cream-dark space-y-4">
                <h4 className="font-display font-extrabold text-sm text-brand-brown">Guidelines Checklist</h4>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="checkbox-agreement"
                    checked={agreedGuidelines}
                    onChange={handleAgreeCheckbox}
                    className="h-4.5 w-4.5 text-brand-green border-brand-cream-dark rounded focus:ring-brand-green bg-white cursor-pointer"
                  />
                  <label htmlFor="checkbox-agreement" className="text-xs text-brand-charcoal/80 select-none cursor-pointer">
                    I agree to follow DairyLuxe partnership guidelines.
                  </label>
                </div>
              </div>

            </div>
          )}

          {/* TAB: MILK SOURCING LOGS */}
          {activeTab === 'sourcingLogs' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-cream-dark shadow-sm space-y-6 animate-slide-up">
              <div>
                <h3 className="text-lg font-display font-extrabold text-brand-green-dark border-b border-brand-cream-dark pb-3">Raw Milk Sourcing History</h3>
                <p className="text-xs text-brand-charcoal/50 mt-1">This panel displays all computerized collections logged at the local node by our company workers.</p>
              </div>

              {milkRecords.filter(r => r.targetId === id && r.targetType === 'partner').length === 0 ? (
                <div className="p-12 text-center text-xs text-brand-charcoal/40">
                  No milk collection transactions have been recorded for your partner ID yet.
                </div>
              ) : (
                <div className="overflow-x-auto text-xs">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-brand-gray-light text-brand-charcoal/60 border-b border-brand-cream-dark font-semibold">
                        <th className="p-4 pl-6">Record ID</th>
                        <th className="p-4">Milk Quantity</th>
                        <th className="p-4">Collection Slot</th>
                        <th className="p-4">Logged By (Worker Name)</th>
                        <th className="p-4 pr-6">Collection Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-cream-dark">
                      {milkRecords
                        .filter(r => r.targetId === id && r.targetType === 'partner')
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

          {/* TAB: PARTNERSHIP DETAILS */}
          {activeTab === 'details' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-cream-dark shadow-sm space-y-6 animate-slide-up">
              <h3 className="text-lg font-display font-extrabold text-brand-green-dark border-b border-brand-cream-dark pb-3">Partnership Registry Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
                <div className="space-y-4">
                  <div>
                    <span className="block text-[9px] uppercase font-bold text-brand-charcoal/40">Unique Partner ID</span>
                    <span className="font-mono font-bold text-sm text-brand-brown">{id}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] uppercase font-bold text-brand-charcoal/40">Full Sourcing Name</span>
                    <span className="font-semibold text-brand-charcoal text-sm">{name}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] uppercase font-bold text-brand-charcoal/40">Registered Mobile Number</span>
                    <span className="font-semibold text-brand-charcoal text-sm">{mobile}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] uppercase font-bold text-brand-charcoal/40">Milk Collection Slots</span>
                    <span className="font-semibold text-brand-charcoal text-sm uppercase">{collectionSlot} Collections</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <span className="block text-[9px] uppercase font-bold text-brand-charcoal/40">Sourcing Village Sourcing Point</span>
                    <span className="font-semibold text-brand-charcoal text-sm">{village || 'Unassigned'}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] uppercase font-bold text-brand-charcoal/40">District Sourcing Zone</span>
                    <span className="font-semibold text-brand-charcoal text-sm">{district || 'Unassigned'}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] uppercase font-bold text-brand-charcoal/40">Permanent Sourcing Address</span>
                    <span className="font-semibold text-brand-charcoal text-sm leading-relaxed">{address}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] uppercase font-bold text-brand-charcoal/40">Join / Submission Date</span>
                    <span className="font-semibold text-brand-charcoal text-sm">{joinDate}</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-brand-cream-dark pt-6 text-xs">
                <span className="block text-[9px] uppercase font-bold text-brand-brown-light tracking-wide mb-1">Livestock & Cattle Farming Experience Bio</span>
                <p className="text-brand-charcoal/80 bg-brand-cream-light p-4 rounded-xl border border-brand-cream-dark/60 leading-relaxed italic">
                  "{experience}"
                </p>
              </div>
            </div>
          )}

          {/* TAB: ASSIGNED PROGRAM & CATTLE */}
          {activeTab === 'program' && (
            <div className="space-y-8 animate-slide-up">
              
              {/* Program Overview Banner */}
              <div className="bg-gradient-to-br from-brand-green to-brand-green-dark text-brand-cream p-6 sm:p-8 rounded-3xl border border-brand-green-light/20 shadow-md space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-brand-cream-light text-brand-green rounded-full flex items-center justify-center shadow">
                    <Award className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-black text-lg tracking-wide uppercase text-brand-accent-gold">DairyLuxe Partner Program</h3>
                    <p className="text-xs text-brand-cream-dark">Sustainable Farming Livelihoods through Guided Dairy Sourcing</p>
                  </div>
                </div>
                <p className="text-xs leading-relaxed text-brand-cream-light max-w-3xl">
                  DairyLuxe partners are long-term farming companions who manage a standardized, company-assigned cattle group designed for continuous, high-quality milk production. We supply the cattle, veterinary care, marketing, and sales, while our partners provide the daily love and care required for ethical husbandry.
                </p>
              </div>

              {/* Core Program Commitments */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* What DairyLuxe Provides */}
                <div className="bg-white p-6 rounded-2xl border border-brand-cream-dark shadow-sm space-y-4">
                  <h4 className="font-display font-bold text-sm text-brand-green-dark border-b border-brand-cream pb-2 flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-brand-green" /> What DairyLuxe Provides
                  </h4>
                  <ul className="space-y-2.5 text-xs text-brand-charcoal/80">
                    <li className="flex items-start gap-2">
                      <span className="text-brand-green font-bold">&bull;</span>
                      <span><strong>Standard Cattle Group</strong>: 1 Breeding Bull + 6 Gir/Kankrej Dairy Cows assigned to your family.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-brand-green font-bold">&bull;</span>
                      <span><strong>Veterinary Guidance</strong>: Routine medical checkups, emergency clinic visits, and vaccinations.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-brand-green font-bold">&bull;</span>
                      <span><strong>Training & Support</strong>: Scientific feeding schedules, hygiene procedures, and milk handling courses.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-brand-green font-bold">&bull;</span>
                      <span><strong>Milk Collection & Processing</strong>: Convenient daily procurement centers right in your village cluster.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-brand-green font-bold">&bull;</span>
                      <span><strong>Marketing & Sales</strong>: Branding, packaging, and delivering premium products to high-paying customers.</span>
                    </li>
                  </ul>
                </div>

                {/* Sourcing Partner Responsibilities */}
                <div className="bg-white p-6 rounded-2xl border border-brand-cream-dark shadow-sm space-y-4">
                  <h4 className="font-display font-bold text-sm text-brand-brown border-b border-brand-cream pb-2 flex items-center gap-2">
                    <Heart className="h-5 w-5 text-brand-brown" /> Partner Responsibilities
                  </h4>
                  <ul className="space-y-2.5 text-xs text-brand-charcoal/80">
                    <li className="flex items-start gap-2">
                      <span className="text-brand-brown font-bold">&bull;</span>
                      <span><strong>Daily Animal Care</strong>: Ensuring proper feeding, clean water, and exercise for assigned cattle.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-brand-brown font-bold">&bull;</span>
                      <span><strong>Milking Cleanliness</strong>: Maintaining pristine sanitation of milking buckets, udders, and hands.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-brand-brown font-bold">&bull;</span>
                      <span><strong>Adherence to Guidelines</strong>: Strictly following DairyLuxe welfare standards and sourcing codes.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-brand-brown font-bold">&bull;</span>
                      <span><strong>Animal Welfare Priority</strong>: Zero tolerance for animal abuse or neglect. Supporting cattle health.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-brand-brown font-bold">&bull;</span>
                      <span><strong>Milk Quality Preservation</strong>: Maintaining pure milk content, avoiding water dilution, and timely collections.</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Breeding & Lactation Program Details */}
              <div className="bg-brand-cream/60 p-6 rounded-2xl border border-brand-cream-dark space-y-3">
                <h4 className="font-display font-extrabold text-sm text-brand-brown flex items-center gap-2">
                  <Activity className="h-5 w-5 text-brand-brown" /> Planned Breeding & Continuous Production Cycles
                </h4>
                <p className="text-xs text-brand-charcoal/80 leading-relaxed">
                  Your assigned cattle group includes <strong>1 Breeding Bull</strong> and <strong>6 Dairy Cows</strong>. This configuration is mathematically designed to support stable year-round milk output. By staggering breeding schedules under veterinary supervision, some cows will remain lactating while others transition to dry periods, ensuring a reliable monthly sourcing income for your rural household.
                </p>
              </div>

              {/* Read-Only Assigned Cattle Table */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-display font-extrabold text-base text-brand-green-dark">Assigned Cattle Group Inventory</h3>
                    <p className="text-[11px] text-brand-charcoal/40">These company-managed animals are permanently registered to your sourcing node</p>
                  </div>
                </div>

                {status === 'Pending Review' ? (
                  <div className="bg-white rounded-3xl p-10 border border-brand-cream-dark text-center space-y-4 shadow-sm">
                    <div className="h-16 w-16 bg-brand-cream-dark/40 rounded-full flex items-center justify-center text-brand-brown mx-auto">
                      <Activity className="h-8 w-8" />
                    </div>
                    <h4 className="font-display font-extrabold text-brand-green-dark">Cattle Records Locked</h4>
                    <p className="text-xs text-brand-charcoal/60 max-w-md mx-auto">
                      Cattle inventory lists will be unlocked and displayed here once your partnership application has been approved and audited by our supervisor.
                    </p>
                  </div>
                ) : cowsList.length === 0 ? (
                  <div className="bg-white rounded-3xl p-10 border border-brand-cream-dark text-center space-y-4 shadow-sm">
                    <h4 className="font-display font-extrabold text-brand-green-dark">No Cattle Sourced Yet</h4>
                    <p className="text-xs text-brand-charcoal/60">An assigned cattle group has not been registered to your profile. Please contact support.</p>
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl border border-brand-cream-dark shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-brand-gray-light text-brand-charcoal/60 border-b border-brand-cream-dark font-semibold uppercase tracking-wider">
                            <th className="p-4 pl-6">Cattle Tag ID</th>
                            <th className="p-4">Breed & Category</th>
                            <th className="p-4">Age (Years)</th>
                            <th className="p-4">Avg Daily Yield</th>
                            <th className="p-4">Lactation Stage</th>
                            <th className="p-4 pr-6">Health Condition</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-brand-cream-dark">
                          {cowsList.map((cow) => (
                            <tr key={cow.tagId} className="hover:bg-brand-cream/10 transition-colors">
                              <td className="p-4 pl-6 font-mono font-bold text-brand-brown">{cow.tagId}</td>
                              <td className="p-4 font-semibold text-brand-charcoal">
                                {cow.tagId.startsWith('BULL') ? (
                                  <span className="flex items-center gap-1">
                                    <span className="inline-block h-2 w-2 rounded-full bg-blue-500"></span>
                                    {cow.breed} (Sire)
                                  </span>
                                ) : (
                                  <span className="flex items-center gap-1">
                                    <span className="inline-block h-2 w-2 rounded-full bg-pink-500"></span>
                                    {cow.breed} (Dam)
                                  </span>
                                )}
                              </td>
                              <td className="p-4 text-brand-charcoal/70">{cow.ageYears} Yrs</td>
                              <td className="p-4 font-bold text-brand-green">
                                {cow.dailyYieldLiters > 0 ? `${cow.dailyYieldLiters} Litres` : '0 Litres (Bull)'}
                              </td>
                              <td className="p-4 font-medium text-brand-charcoal/60">
                                {cow.tagId.startsWith('BULL') ? 'Not Applicable' : cow.lactationStage}
                              </td>
                              <td className="p-4 pr-6">
                                <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold ${
                                  cow.healthStatus === 'Excellent' ? 'bg-brand-green-soft text-brand-green' :
                                  cow.healthStatus === 'Healthy' ? 'bg-blue-50 text-blue-800' :
                                  'bg-amber-50 text-amber-800'
                                }`}>
                                  {cow.healthStatus}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB: TRAINING RESOURCES */}
          {activeTab === 'training' && (
            <div className="space-y-6 animate-slide-up">
              <div>
                <h3 className="font-display font-extrabold text-base text-brand-green-dark">Training & Educational Resources</h3>
                <p className="text-[11px] text-brand-charcoal/40">Acquire scientific and practical skills to optimize dairy sourcing efficiency, cattle health, and milk quality.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    title: 'Scientific Cattle Feeding',
                    category: 'Nutrition',
                    desc: 'Maximize milk yield and sustain lactation cycles with balanced feed plans. Learn how to mix green grass fodder with mineral supplements, bypass fats, and clean grain concentrates.',
                    duration: '15 Mins Read'
                  },
                  {
                    title: 'Sanitized Milking Practices',
                    category: 'Hygiene',
                    desc: 'Maintain somatic cell count and raw milk purity. This resource covers stainless steel bucket sterilization, pre-milking udder washing with disinfectant solutions, and fast chilling methods.',
                    duration: '10 Mins Read'
                  },
                  {
                    title: 'Disease Diagnosis & Welfare',
                    category: 'Veterinary Care',
                    desc: 'Detect early symptoms of mastitis, foot-and-mouth infection, or milk fever. Learn proper ventilation setups, cattle bedding cleanliness standards, and quarantine protocols.',
                    duration: '20 Mins Read'
                  },
                  {
                    title: 'Fat & SNF Quality Enhancement',
                    category: 'Procurement Slabs',
                    desc: 'Understand how computerized fat testing instruments calculate your final price slab. Learn how feed combinations directly impact milk fat percentage and SNF (Solid-Not-Fat) density.',
                    duration: '12 Mins Read'
                  }
                ].map((item, idx) => (
                  <div key={idx} className="bg-white rounded-2xl border border-brand-cream-dark p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] font-bold text-brand-green bg-brand-green-soft px-2.5 py-0.5 rounded-full border border-brand-green/10 uppercase tracking-wider">
                          {item.category}
                        </span>
                        <span className="text-[10px] text-brand-charcoal/40 font-semibold">{item.duration}</span>
                      </div>
                      <h4 className="font-display font-bold text-sm text-brand-green-dark">{item.title}</h4>
                      <p className="text-xs text-brand-charcoal/70 leading-relaxed">{item.desc}</p>
                    </div>
                    <button
                      onClick={() => alert(`Opening "${item.title}" training curriculum... (Simulated training module)`)}
                      className="bg-brand-cream hover:bg-brand-cream-dark text-brand-green-dark border border-brand-cream-dark/60 font-bold py-2 rounded-xl text-xs mt-4 text-center cursor-pointer transition-colors"
                    >
                      Read Training Guide
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: BENEFITS */}
          {activeTab === 'benefits' && (
            <div className="space-y-6 animate-slide-up">
              <div>
                <h3 className="font-display font-extrabold text-base text-brand-green-dark">DairyLuxe Partnership Benefits</h3>
                <p className="text-[11px] text-brand-charcoal/40">Exclusive incentives and structural programs provided to our approved rural farmers</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  {
                    title: 'Stable Monthly Income',
                    icon: <Landmark className="h-6 w-6" />,
                    desc: 'Enjoy guaranteed monthly bank payouts calculated directly from your milk procurement volumes, protecting your family against crop failure and market drop.'
                  },
                  {
                    title: 'Performance-Based Bonuses',
                    icon: <Award className="h-6 w-6" />,
                    desc: 'Earn high price multipliers and financial bonuses for delivering high fat-content clean milk consistently every week.'
                  },
                  {
                    title: 'Veterinary Support',
                    icon: <Heart className="h-6 w-6" />,
                    desc: 'Access completely free monthly cattle checkups, vaccination supplies, de-worming drives, and emergency medical calls from our veterinary supervisors.'
                  },
                  {
                    title: 'Training & Guidance',
                    icon: <FileText className="h-6 w-6" />,
                    desc: 'Participate in scientific livestock management programs to optimize milk yields, maintain cattle hygiene, and process nutrient feed structures.'
                  },
                  {
                    title: 'Long-Term Partnership',
                    icon: <CheckCircle2 className="h-6 w-6" />,
                    desc: 'Grow together with long-term procurement security contracts. DairyLuxe guarantees to buy your entire year-round dairy production.'
                  },
                  {
                    title: 'Rural Entrepreneurship Opportunity',
                    icon: <Sparkles className="h-6 w-6" />,
                    desc: 'Receive cattle loans, automated milking kit subsidies, and financial literacy coaching to scale up your small farm into a rural business.'
                  }
                ].map((b, idx) => (
                  <div key={idx} className="bg-white p-6 rounded-2xl border border-brand-cream-dark shadow-sm space-y-3 flex items-start gap-4">
                    <div className="h-10 w-10 rounded-xl bg-brand-green-soft text-brand-green flex items-center justify-center flex-shrink-0">
                      {b.icon}
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-display font-bold text-sm text-brand-green-dark">{b.title}</h4>
                      <p className="text-xs text-brand-charcoal/70 leading-relaxed">{b.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: COMPENSATION */}
          {activeTab === 'compensation' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-cream-dark shadow-sm space-y-6 animate-slide-up">
              <div>
                <h3 className="font-display font-extrabold text-base text-brand-green-dark">Compensation & Payment Structures</h3>
                <p className="text-[11px] text-brand-charcoal/40">Secure, transparent, and direct payouts to your registered bank account</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-brand-cream-light p-5 rounded-2xl border border-brand-cream-dark/60 text-center space-y-1.5">
                  <span className="block text-[9px] uppercase font-bold text-brand-charcoal/40">Base Monthly Income</span>
                  <span className="text-xl font-display font-bold text-brand-brown">
                    {status === 'Active' ? '₹18,500' : 'N/A (Pending)'}
                  </span>
                  <span className="text-[9px] text-brand-charcoal/50 block">Accrued based on volume</span>
                </div>
                
                <div className="bg-brand-cream-light p-5 rounded-2xl border border-brand-cream-dark/60 text-center space-y-1.5">
                  <span className="block text-[9px] uppercase font-bold text-brand-charcoal/40">Bonus Eligibility Status</span>
                  <span className={`inline-block text-xs font-bold px-2 py-0.5 rounded ${
                    status === 'Active' ? 'bg-brand-green-soft text-brand-green' : 'bg-brand-cream-dark text-brand-charcoal/40'
                  }`}>
                    {status === 'Active' ? 'ELIGIBLE' : 'PENDING REVIEW'}
                  </span>
                  <span className="text-[9px] text-brand-charcoal/50 block">Quality testing metrics</span>
                </div>

                <div className="bg-brand-cream-light p-5 rounded-2xl border border-brand-cream-dark/60 text-center space-y-1.5">
                  <span className="block text-[9px] uppercase font-bold text-brand-charcoal/40">Last Payout Status</span>
                  <span className="text-sm font-semibold text-brand-charcoal">
                    {status === 'Active' ? 'Paid (₹18,500)' : 'N/A'}
                  </span>
                  <span className="text-[9px] text-brand-charcoal/50 block">Processed on 2026-06-05</span>
                </div>
              </div>

              <div className="bg-brand-green-soft/40 p-5 rounded-2xl border border-brand-green/10 flex items-start gap-3">
                <Activity className="h-5 w-5 text-brand-green flex-shrink-0 mt-0.5" />
                <p className="text-xs text-brand-green-dark leading-relaxed font-semibold">
                  "DairyLuxe provides performance-based incentives for quality, consistency, and responsible animal care."
                </p>
              </div>

              <div className="border-t border-brand-cream-dark pt-5">
                <h4 className="text-xs font-bold text-brand-charcoal uppercase tracking-wider mb-2">How Sourcing Price is Computed</h4>
                <p className="text-xs text-brand-charcoal/70 leading-relaxed">
                  Your final collection price per Litre is computed at the local weighing station using digital analysis of **Fat %** and **SNF %** (Solid-Not-Fat). High fat buffalo or A2 cow milk receives maximum price slabs. Payments are directly processed to your linked bank account on the 5th of every month.
                </p>
              </div>
            </div>
          )}

          {/* TAB: RULES & GUIDELINES */}
          {activeTab === 'guidelines' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-cream-dark shadow-sm space-y-6 animate-slide-up">
              <div>
                <h3 className="font-display font-extrabold text-base text-brand-green-dark">Company Rules & Guidelines</h3>
                <p className="text-[11px] text-brand-charcoal/40">Standards to maintain top quality procurement values and cattle health safety</p>
              </div>

              <div className="space-y-4">
                {[
                  'Maintain high animal welfare standards (clean housing, fresh water, responsible care).',
                  'Follow DairyLuxe quality requirements (cool raw milk collection parameters).',
                  'Strictly no milk adulteration (zero water dilution, urea, or preservative additives).',
                  'Maintain cleanliness and hygiene at the milking points and collection buckets.',
                  'Cooperate with regular cattle inspections and dairy farm audits by supervisors.',
                  'Follow partnership agreement policies, price slabs, and ethical collection conducts.'
                ].map((rule, idx) => (
                  <div key={idx} className="flex items-start gap-3.5 text-xs text-brand-charcoal/80 bg-brand-cream-light p-4 rounded-xl border border-brand-cream-dark/50">
                    <span className="h-6 w-6 bg-brand-green text-brand-cream text-xs font-extrabold rounded-full flex items-center justify-center flex-shrink-0">
                      {idx + 1}
                    </span>
                    <p className="leading-relaxed pt-0.5">{rule}</p>
                  </div>
                ))}
              </div>

              <div className="border-t border-brand-cream-dark pt-5 flex items-center gap-3">
                <input
                  type="checkbox"
                  id="tab-agreement-checkbox"
                  checked={agreedGuidelines}
                  onChange={handleAgreeCheckbox}
                  className="h-4.5 w-4.5 text-brand-green border-brand-cream-dark rounded focus:ring-brand-green bg-white cursor-pointer"
                />
                <label htmlFor="tab-agreement-checkbox" className="text-xs text-brand-charcoal font-semibold select-none cursor-pointer">
                  I agree to follow DairyLuxe partnership guidelines.
                </label>
              </div>
            </div>
          )}

          {/* TAB: ANNOUNCEMENTS */}
          {activeTab === 'announcements' && (
            <div className="space-y-6 animate-slide-up">
              <div>
                <h3 className="font-display font-extrabold text-base text-brand-green-dark">Announcements Board</h3>
                <p className="text-[11px] text-brand-charcoal/40">Official alerts, programs, and opportunities published by DairyLuxe Admin</p>
              </div>

              {announcements.length === 0 ? (
                <div className="bg-white rounded-3xl p-10 border border-brand-cream-dark text-center text-brand-charcoal/40 shadow-sm">
                  No notifications or announcements currently in archive.
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  {announcements.map((ann) => (
                    <div key={ann.id} className="bg-white p-6 rounded-2xl border border-brand-cream-dark shadow-sm space-y-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold uppercase mb-2 ${
                            ann.category === 'Training' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                            ann.category === 'Veterinary Camp' ? 'bg-brand-green-soft text-brand-green border border-brand-green/10' :
                            ann.category === 'Company Update' ? 'bg-amber-50 text-amber-800 border border-amber-100' :
                            'bg-brand-cream-dark text-brand-brown'
                          }`}>
                            {ann.category}
                          </span>
                          <h4 className="font-display font-extrabold text-base text-brand-green-dark">{ann.title}</h4>
                        </div>
                        <span className="text-[10px] text-brand-charcoal/40 font-semibold">{ann.date}</span>
                      </div>
                      
                      <p className="text-xs text-brand-charcoal/80 leading-relaxed">{ann.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: SUPPORT */}
          {activeTab === 'support' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-cream-dark shadow-sm space-y-6 animate-slide-up">
              <div>
                <h3 className="font-display font-extrabold text-base text-brand-green-dark">Regional Partner Support</h3>
                <p className="text-[11px] text-brand-charcoal/40">Connect directly with regional supervisors, veterinary doctors, or corporate managers</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                <div className="bg-brand-cream-light p-6 rounded-2xl border border-brand-cream-dark/60 space-y-3">
                  <div className="h-10 w-10 bg-brand-green-soft text-brand-green rounded-full flex items-center justify-center mx-auto">
                    <PhoneCall className="h-5 w-5" />
                  </div>
                  <h4 className="text-xs font-bold text-brand-green-dark">Customer Support</h4>
                  <span className="text-xs font-mono font-semibold block text-brand-brown">+91 98765 00123</span>
                  <p className="text-[10px] text-brand-charcoal/50">Milking & Weighing queries</p>
                </div>

                <div className="bg-brand-cream-light p-6 rounded-2xl border border-brand-cream-dark/60 space-y-3">
                  <div className="h-10 w-10 bg-brand-green-soft text-brand-green rounded-full flex items-center justify-center mx-auto">
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <h4 className="text-xs font-bold text-brand-green-dark">WhatsApp Support</h4>
                  <span className="text-xs font-mono font-semibold block text-brand-brown">+91 98765 00124</span>
                  <p className="text-[10px] text-brand-charcoal/50">Instant alert messages</p>
                </div>

                <div className="bg-brand-cream-light p-6 rounded-2xl border border-brand-cream-dark/60 space-y-3">
                  <div className="h-10 w-10 bg-brand-green-soft text-brand-green rounded-full flex items-center justify-center mx-auto">
                    <Mail className="h-5 w-5" />
                  </div>
                  <h4 className="text-xs font-bold text-brand-green-dark">Email Support</h4>
                  <span className="text-xs font-mono font-semibold block text-brand-brown select-all text-brand-brown">partner-support@dairyluxe.com</span>
                  <p className="text-[10px] text-brand-charcoal/50">Official invoice requests</p>
                </div>
              </div>

              <div className="border-t border-brand-cream-dark pt-5 space-y-3">
                <h4 className="text-xs font-bold text-brand-charcoal uppercase tracking-wider">Assigned Regional supervisor</h4>
                <div className="bg-brand-gray-light p-4 rounded-xl border border-brand-cream-dark/50 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div className="text-xs space-y-1">
                    <span className="font-bold text-brand-green-dark block">Selva Ganapathy (Sourcing Officer)</span>
                    <span className="text-brand-charcoal/60 block">Coimbatore Sourcing Cluster Hub</span>
                  </div>
                  <button
                    onClick={() => alert('Dialing regional supervisor at +91 94411 22334')}
                    className="bg-brand-green text-brand-cream hover:bg-brand-green-light font-bold px-4 py-2 rounded-xl text-[10px] uppercase cursor-pointer self-start sm:self-auto"
                  >
                    Call Supervisor
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB: PROFILE PAGE */}
          {activeTab === 'profile' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-slide-up">
              
              {/* Profile Details Edit */}
              <form onSubmit={handleUpdateContact} className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-cream-dark shadow-sm space-y-4">
                <h3 className="text-lg font-display font-extrabold text-brand-green-dark border-b border-brand-cream-dark pb-3">Personal & Contact Info</h3>
                
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
                  <label className="block text-[10px] font-bold text-brand-charcoal uppercase tracking-wider mb-2">Sourcing Address</label>
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
                    Save Sourcing Contact
                  </button>
                </div>
              </form>

              {/* Password Change */}
              <form onSubmit={handleChangePassword} className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-cream-dark shadow-sm space-y-4">
                <h3 className="text-lg font-display font-extrabold text-brand-green-dark border-b border-brand-cream-dark pb-3">Update Portal Password</h3>
                
                <div>
                  <label className="block text-[10px] font-bold text-brand-charcoal uppercase tracking-wider mb-2">Current Temporary Password</label>
                  <input
                    type="password"
                    required
                    value={passwordOld}
                    onChange={(e) => setPasswordOld(e.target.value)}
                    placeholder="e.g. partner123"
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
