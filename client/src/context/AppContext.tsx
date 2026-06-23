import React, { createContext, useContext, useState, useEffect } from 'react';

// ==========================================
// Interfaces
// ==========================================

export interface CowDetail {
  tagId: string;
  breed: string;
  ageYears: number;
  dailyYieldLiters: number;
  healthStatus: 'Healthy' | 'Under Treatment' | 'Excellent';
  lactationStage: 'Lactating' | 'Dry';
}

export interface Partner {
  id: string; // PRT1001, etc.
  applicationId: string;
  name: string;
  mobile: string;
  address: string;
  village: string;
  district: string;
  experience: string;
  whyJoin: string;
  status: 'Active' | 'Inactive';
  createdAt: string;
  cows?: CowDetail[];
  collectionSlot?: 'Morning' | 'Evening' | 'Both';
}

export interface SubscriptionCustomer {
  id: string; // SUB1001, etc.
  applicationId: string;
  name: string;
  mobile: string;
  address: string;
  quantity: number;
  deliveryTime: 'Morning' | 'Evening' | 'Both';
  status: 'Active' | 'Inactive';
  createdAt: string;
}

export interface PartnerApplication {
  id: string; // APP_PRT_xxx
  fullName: string;
  mobile: string;
  address: string;
  village: string;
  district: string;
  farmingExperience: string;
  whyJoin: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  submittedAt: string;
  generatedId?: string;
  tempPassword?: string;
}

export interface SubscriptionApplication {
  id: string; // APP_SUB_xxx
  fullName: string;
  mobile: string;
  address: string;
  quantity: number;
  deliveryTime: 'Morning' | 'Evening' | 'Both';
  status: 'Pending' | 'Approved' | 'Rejected';
  submittedAt: string;
  generatedId?: string;
  tempPassword?: string;
}

export interface SubscriptionRequest {
  id: string; // REQ1001, etc.
  customerId: string;
  customerName: string;
  type: 'Quantity Change' | 'Address Change' | 'Pause' | 'Resume';
  details: string; // e.g., "Change quantity to 3 Litres"
  status: 'Pending' | 'Approved' | 'Rejected';
  submittedAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: 'Training' | 'Veterinary Camp' | 'Company Update' | 'Opportunity' | 'General';
  date: string;
}

export interface BulkOrder {
  id: string; // BLK1001, etc.
  businessName: string;
  contactPerson: string;
  phone: string;
  requirements: string;
  quantity: string;
  message: string;
  status: 'Pending' | 'Processing' | 'Delivered' | 'Cancelled';
  amount: number;
  submittedAt: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  unit: string;
  image: string;
  available: boolean;
  benefits: string[];
  hidden?: boolean;
}

export interface Order {
  id: string; // ORD1001, etc.
  customerName: string;
  productName: string;
  quantity: number;
  amount: number;
  status: 'Pending' | 'Processing' | 'Delivered' | 'Cancelled';
  date: string;
}

export interface Worker {
  id: string; // WRK1001, etc.
  name: string;
  mobile: string;
  status: 'Active' | 'Inactive';
  createdAt: string;
}

export interface MilkRecord {
  id: string; // RECxxxx
  workerId: string;
  workerName: string;
  targetId: string;
  targetName: string;
  targetType: 'partner' | 'customer';
  quantity: number;
  date: string; // YYYY-MM-DD
  slot: 'Morning' | 'Evening';
  createdAt?: string;
}

export interface DashboardStats {
  totalPartners: number;
  totalCustomers: number;
  pendingApplications: number;
  totalOrders: number;
  monthlyRevenue: number;
}

interface AppContextType {
  partners: Partner[];
  customers: SubscriptionCustomer[];
  partnerApplications: PartnerApplication[];
  subscriptionApplications: SubscriptionApplication[];
  bulkOrders: BulkOrder[];
  products: Product[];
  orders: Order[];
  announcements: Announcement[];
  subscriptionRequests: SubscriptionRequest[];
  workers: Worker[];
  milkRecords: MilkRecord[];
  currentUser: { id: string; role: 'admin' | 'partner' | 'customer' | 'worker'; name: string } | null;
  
  // Auth Functions
  signIn: (id: string, password: string) => { success: boolean; error?: string; role?: string };
  signOut: () => void;
  
  // Partner Applications
  submitPartnerApp: (app: Omit<PartnerApplication, 'id' | 'status' | 'submittedAt'>) => any;
  approvePartnerApp: (id: string) => any;
  rejectPartnerApp: (id: string) => any;
  
  // Subscription Applications
  submitSubscriptionApp: (app: Omit<SubscriptionApplication, 'id' | 'status' | 'submittedAt'>) => any;
  approveSubscriptionApp: (id: string) => any;
  rejectSubscriptionApp: (id: string) => any;
 
  // Partner Management
  updatePartner: (partner: Partner) => any;
  togglePartnerStatus: (id: string) => any;
 
  // Customer Management
  updateCustomer: (customer: SubscriptionCustomer) => any;
  toggleCustomerStatus: (id: string) => any;

  // Worker Management
  addWorker: (worker: Omit<Worker, 'id' | 'status' | 'createdAt'>) => any;
  updateWorker: (worker: Worker) => any;
  toggleWorkerStatus: (id: string) => any;

  // Milk Records Management
  addMilkRecord: (record: Omit<MilkRecord, 'id' | 'createdAt'>) => any;
 
  // Product Management
  addProduct: (product: Omit<Product, 'id'>) => any;
  updateProduct: (product: Product) => any;
  deleteProduct: (id: string) => any;
 
  // Order Management
  submitBulkOrder: (order: Omit<BulkOrder, 'id' | 'status' | 'amount' | 'submittedAt'> & { amount?: number }) => any;
  updateOrderStatus: (id: string, status: Order['status']) => any;
  updateBulkOrderStatus: (id: string, status: BulkOrder['status']) => any;
  createOrder: (order: Omit<Order, 'id' | 'date'>) => any;
  
  // Announcements Management
  addAnnouncement: (title: string, content: string, category: Announcement['category']) => any;
  deleteAnnouncement: (id: string) => any;
 
  // Subscription Request Management
  submitSubscriptionRequest: (req: Omit<SubscriptionRequest, 'id' | 'status' | 'submittedAt'>) => any;
  approveSubscriptionRequest: (id: string) => any;
  rejectSubscriptionRequest: (id: string) => any;
 
  // Dashboard Analytics
  getDashboardStats: () => DashboardStats;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// ==========================================
// Default Mock Data
// ==========================================

const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Raw Milk',
    description: 'Fresh, organic, unpasteurized A2 cow milk sourced straight from rural farming families.',
    price: 65,
    unit: 'Litre',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80&w=600',
    available: true,
    benefits: ['100% natural and preservative-free', 'Rich in essential calcium and vitamins', 'Supports village livelihoods']
  },
  {
    id: 'prod-2',
    name: 'Creamery Butter',
    description: 'Slow-churned, rich golden country butter processed using traditional methods.',
    price: 240,
    unit: '500g',
    image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&q=80&w=600',
    available: true,
    benefits: ['Rich, natural creamy flavor', 'No artificial colors or hydrogenated oils', 'High energy healthy fats']
  },
  {
    id: 'prod-3',
    name: 'Thick Curd',
    description: 'Creamy, probiotic-rich set curd prepared with high-fat fresh milk.',
    price: 70,
    unit: '1kg',
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&q=80&w=600',
    available: true,
    benefits: ['Aids in digestion & gut health', 'High source of protein and calcium', 'Velvety traditional set texture']
  },
  {
    id: 'prod-4',
    name: 'Spiced Buttermilk',
    description: 'Traditional summer cooling beverage spiced with ginger, curry leaves, and green chilies.',
    price: 30,
    unit: '500ml',
    image: 'https://images.unsplash.com/photo-1541658016709-82535e94bc69?auto=format&fit=crop&q=80&w=600',
    available: true,
    benefits: ['Extremely refreshing & hydrating', 'Zero artificial flavors', 'Low fat and calorie count']
  },
  {
    id: 'prod-5',
    name: 'Organic Rose Milk',
    description: 'Chilled premium milk sweetened with pure organic rose extract and beet juice color.',
    price: 50,
    unit: '300ml',
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&q=80&w=600',
    available: true,
    benefits: ['Soothes the body, natural cooling agent', 'Prepared with fresh whole milk', 'Fabulous kid-friendly option']
  },
  {
    id: 'prod-6',
    name: 'Saffron Badam Milk',
    description: 'Nutritious milk brewed with ground almonds, premium saffron strands, and cardamom.',
    price: 60,
    unit: '300ml',
    image: 'https://images.unsplash.com/photo-1568644365101-5373b94be313?auto=format&fit=crop&q=80&w=600',
    available: true,
    benefits: ['Brain booster & energy drink', 'Loaded with almond flakes', 'Can be enjoyed hot or cold']
  }
];

const DEFAULT_PARTNERS: Partner[] = [];
const DEFAULT_CUSTOMERS: SubscriptionCustomer[] = [];
const DEFAULT_PARTNER_APPS: PartnerApplication[] = [];
const DEFAULT_SUB_APPS: SubscriptionApplication[] = [];
const DEFAULT_BULK_ORDERS: BulkOrder[] = [];
const DEFAULT_ORDERS: Order[] = [];
const DEFAULT_ANNOUNCEMENTS: Announcement[] = [];
const DEFAULT_WORKERS: Worker[] = [
  { id: 'WRK1001', name: 'John Worker', mobile: '9999888877', status: 'Active', createdAt: '2026-06-23' }
];
const DEFAULT_MILK_RECORDS: MilkRecord[] = [
  { id: 'REC0001', workerId: 'WRK1001', workerName: 'John Worker', targetId: 'PRT1001', targetName: 'Ramesh Patel', targetType: 'partner', quantity: 15.0, date: '2026-06-22', slot: 'Morning' },
  { id: 'REC0002', workerId: 'WRK1001', workerName: 'John Worker', targetId: 'SUB1001', targetName: 'Anjali Sharma', targetType: 'customer', quantity: 2.0, date: '2026-06-22', slot: 'Morning' }
];

// ==========================================
// Provider Component
// ==========================================

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const apiBase = 'http://localhost:5001/api';
  const [partners, setPartners] = useState<Partner[]>([]);
  const [customers, setCustomers] = useState<SubscriptionCustomer[]>([]);
  const [partnerApplications, setPartnerApplications] = useState<PartnerApplication[]>([]);
  const [subscriptionApplications, setSubscriptionApplications] = useState<SubscriptionApplication[]>([]);
  const [bulkOrders, setBulkOrders] = useState<BulkOrder[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [subscriptionRequests, setSubscriptionRequests] = useState<SubscriptionRequest[]>([]);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [milkRecords, setMilkRecords] = useState<MilkRecord[]>([]);
  
  const [currentUser, setCurrentUser] = useState<AppContextType['currentUser']>(null);

  // Load from local storage and backend server on mount
  useEffect(() => {
    const getOrSet = <T,>(key: string, defaultValue: T): T => {
      const cleanKey = key.replace('dl_', 'dl_clean_');
      const stored = localStorage.getItem(cleanKey);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          // fallback
        }
      }
      localStorage.setItem(cleanKey, JSON.stringify(defaultValue));
      return defaultValue;
    };

    // 1. Initialise local storage fallbacks
    const localPartners = getOrSet('dl_partners', DEFAULT_PARTNERS);
    const localCustomers = getOrSet('dl_customers', DEFAULT_CUSTOMERS);
    const localPartnerApps = getOrSet('dl_partner_apps', DEFAULT_PARTNER_APPS);
    const localSubApps = getOrSet('dl_sub_apps', DEFAULT_SUB_APPS);
    const localBulkOrders = getOrSet('dl_bulk_orders', DEFAULT_BULK_ORDERS);
    const localProducts = getOrSet('dl_products', DEFAULT_PRODUCTS);
    const localOrders = getOrSet('dl_orders', DEFAULT_ORDERS);
    const localAnnouncements = getOrSet('dl_announcements', DEFAULT_ANNOUNCEMENTS);
    const localSubRequests = getOrSet('dl_sub_requests', []);
    const localWorkers = getOrSet('dl_workers', DEFAULT_WORKERS);
    const localMilkRecords = getOrSet('dl_milk_records', DEFAULT_MILK_RECORDS);

    setPartners(localPartners);
    setCustomers(localCustomers);
    setPartnerApplications(localPartnerApps);
    setSubscriptionApplications(localSubApps);
    setBulkOrders(localBulkOrders);
    setProducts(localProducts);
    setOrders(localOrders);
    setAnnouncements(localAnnouncements);
    setSubscriptionRequests(localSubRequests);
    setWorkers(localWorkers);
    setMilkRecords(localMilkRecords);

    // 2. Fetch from backend API
    const fetchEntity = async (endpoint: string, setter: (data: any) => void) => {
      try {
        const res = await fetch(`${apiBase}/${endpoint}`);
        const data = await res.json();
        if (data.success) {
          const camelKey = endpoint.replace(/-([a-z])/g, g => g[1].toUpperCase());
          if (data[camelKey] && data[camelKey].length > 0) {
            setter(data[camelKey]);
          } else if (data.applications && data.applications.length > 0) {
            setter(data.applications);
          }
        }
      } catch (err) {
        // Silent fallback to local storage
      }
    };

    fetchEntity('products', setProducts);
    fetchEntity('partner-applications', setPartnerApplications);
    fetchEntity('subscription-applications', setSubscriptionApplications);
    fetchEntity('partners', setPartners);
    fetchEntity('customers', setCustomers);
    fetchEntity('bulk-orders', setBulkOrders);
    fetchEntity('orders', setOrders);
    fetchEntity('announcements', setAnnouncements);
    fetchEntity('subscription-requests', setSubscriptionRequests);
    fetchEntity('workers', setWorkers);
    fetchEntity('milk-records', setMilkRecords);

    const storedUser = sessionStorage.getItem('dl_current_user');
    if (storedUser) {
      try {
        let user = JSON.parse(storedUser);
        if (user.role === 'partner') {
          const app = localPartnerApps.find(a => a.id.toLowerCase() === user.id.toLowerCase());
          if (app && app.status === 'Approved' && app.generatedId) {
            user = { ...user, id: app.generatedId, name: app.fullName };
            sessionStorage.setItem('dl_current_user', JSON.stringify(user));
          }
        } else if (user.role === 'customer') {
          const app = localSubApps.find(a => a.id.toLowerCase() === user.id.toLowerCase());
          if (app && app.status === 'Approved' && app.generatedId) {
            user = { ...user, id: app.generatedId, name: app.fullName };
            sessionStorage.setItem('dl_current_user', JSON.stringify(user));
          }
        } else if (user.role === 'worker') {
          const activeWrk = localWorkers.find(w => w.id.toLowerCase() === user.id.toLowerCase());
          if (activeWrk) {
            user = { ...user, name: activeWrk.name };
            sessionStorage.setItem('dl_current_user', JSON.stringify(user));
          }
        }
        setCurrentUser(user);
      } catch {
        // fallback
      }
    }
  }, []);

  // Sync to local storage
  const sync = (key: string, data: any) => {
    const cleanKey = key.replace('dl_', 'dl_clean_');
    localStorage.setItem(cleanKey, JSON.stringify(data));
  };

  // Sign In function
  const signIn = (id: string, pass: string) => {
    const trimmedId = id.trim().toLowerCase();
    const rawId = id.trim();
    
    // Admin check
    if (trimmedId === 'admin') {
      if (pass === 'admin123') {
        const user = { id: 'admin', role: 'admin' as const, name: 'System Administrator' };
        setCurrentUser(user);
        sessionStorage.setItem('dl_current_user', JSON.stringify(user));
        return { success: true, role: 'admin' };
      } else {
        return { success: false, error: 'Incorrect password. Please re-check your credentials.' };
      }
    }

    // Partner Check (match by ID or mobile number)
    const activePartner = partners.find(
      p => p.id.toLowerCase() === trimmedId || p.mobile === rawId
    );
    if (activePartner) {
      if (pass === 'partner123') {
        const user = { id: activePartner.id, role: 'partner' as const, name: activePartner.name };
        setCurrentUser(user);
        sessionStorage.setItem('dl_current_user', JSON.stringify(user));
        return { success: true, role: 'partner' };
      } else {
        return { success: false, error: 'Incorrect password. Please re-check your credentials.' };
      }
    }

    // Customer Check (match by ID or mobile number)
    const activeCust = customers.find(
      c => c.id.toLowerCase() === trimmedId || c.mobile === rawId
    );
    if (activeCust) {
      if (pass === 'customer123') {
        const user = { id: activeCust.id, role: 'customer' as const, name: activeCust.name };
        setCurrentUser(user);
        sessionStorage.setItem('dl_current_user', JSON.stringify(user));
        return { success: true, role: 'customer' };
      } else {
        return { success: false, error: 'Incorrect password. Please re-check your credentials.' };
      }
    }

    // Worker Check (match by ID or mobile number)
    const activeWorker = workers.find(
      w => w.id.toLowerCase() === trimmedId || w.mobile === rawId
    );
    if (activeWorker) {
      if (activeWorker.status !== 'Active') {
        return { success: false, error: 'Worker account is currently suspended/inactive.' };
      }
      if (pass === 'worker123') {
        const user = { id: activeWorker.id, role: 'worker' as const, name: activeWorker.name };
        setCurrentUser(user);
        sessionStorage.setItem('dl_current_user', JSON.stringify(user));
        return { success: true, role: 'worker' };
      } else {
        return { success: false, error: 'Incorrect password. Please re-check your credentials.' };
      }
    }

    // Check if user is in applications list but not active yet
    const pendingPartnerApp = partnerApplications.find(
      app => app.id.toLowerCase() === trimmedId || 
             app.mobile === rawId || 
             (app.generatedId && app.generatedId.toLowerCase() === trimmedId)
    );

    const pendingSubApp = subscriptionApplications.find(
      app => app.id.toLowerCase() === trimmedId || 
             app.mobile === rawId || 
             (app.generatedId && app.generatedId.toLowerCase() === trimmedId)
    );

    const application = pendingPartnerApp || pendingSubApp;
    if (application) {
      if (application.status === 'Pending') {
        return {
          success: false,
          error: 'Application is pending approval. Once approved, your login ID and password will be sent via SMS.'
        };
      } else if (application.status === 'Rejected') {
        return {
          success: false,
          error: 'Your application has been rejected. Please apply again or contact support.'
        };
      } else if (application.status === 'Approved') {
        return {
          success: false,
          error: 'Incorrect password. Please re-check your credentials.'
        };
      }
    }

    // Unregistered/unrecognized account
    return {
      success: false,
      error: 'Account not found. Please re-check your credentials, or apply for subscription/partner credentials first.'
    };
  };

  const signOut = () => {
    setCurrentUser(null);
    sessionStorage.removeItem('dl_current_user');
  };

  // Submit Partner Application
  const submitPartnerApp = (app: Omit<PartnerApplication, 'id' | 'status' | 'submittedAt'>) => {
    const tempId = `APP_PRT_${Date.now().toString().slice(-5)}`;
    const newApp: PartnerApplication = {
      ...app,
      id: tempId,
      status: 'Pending',
      submittedAt: new Date().toISOString().split('T')[0]
    };
    const updated = [newApp, ...partnerApplications];
    setPartnerApplications(updated);
    sync('dl_partner_apps', updated);

    fetch(`${apiBase}/partner-applications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newApp)
    }).catch(err => {
      console.error('Failed to sync partner application to backend:', err);
    });

    return tempId;
  };

  // Approve Partner App
  const approvePartnerApp = (id: string) => {
    let generatedId = '';
    const tempPass = 'partner123'; // Standard simulated temporary password
    
    const updatedApps = partnerApplications.map(app => {
      if (app.id === id) {
        // Find next Partner ID serial
        const serial = partners.length + 1001;
        generatedId = `PRT${serial}`;
        
        return {
          ...app,
          status: 'Approved' as const,
          generatedId,
          tempPassword: tempPass
        };
      }
      return app;
    });

    const approvedApp = partnerApplications.find(app => app.id === id);
    if (!approvedApp) return null;

    // Create active partner profile
    const newPartner: Partner = {
      id: generatedId,
      applicationId: approvedApp.id,
      name: approvedApp.fullName,
      mobile: approvedApp.mobile,
      address: approvedApp.address,
      village: approvedApp.village,
      district: approvedApp.district,
      experience: approvedApp.farmingExperience,
      whyJoin: approvedApp.whyJoin,
      status: 'Active',
      createdAt: new Date().toISOString().split('T')[0],
      collectionSlot: 'Both',
      cows: [
        { tagId: `BULL-${generatedId}`, breed: 'Gir Breeding Bull', ageYears: 4, dailyYieldLiters: 0, healthStatus: 'Excellent', lactationStage: 'Dry' },
        { tagId: `COW-${generatedId}-01`, breed: 'Gir', ageYears: 4, dailyYieldLiters: 13, healthStatus: 'Healthy', lactationStage: 'Lactating' },
        { tagId: `COW-${generatedId}-02`, breed: 'Kankrej', ageYears: 5, dailyYieldLiters: 14, healthStatus: 'Excellent', lactationStage: 'Lactating' },
        { tagId: `COW-${generatedId}-03`, breed: 'Gir', ageYears: 3, dailyYieldLiters: 12, healthStatus: 'Healthy', lactationStage: 'Dry' },
        { tagId: `COW-${generatedId}-04`, breed: 'Kankrej', ageYears: 4, dailyYieldLiters: 13, healthStatus: 'Healthy', lactationStage: 'Lactating' },
        { tagId: `COW-${generatedId}-05`, breed: 'Gir', ageYears: 5, dailyYieldLiters: 11, healthStatus: 'Healthy', lactationStage: 'Lactating' },
        { tagId: `COW-${generatedId}-06`, breed: 'Kankrej', ageYears: 4, dailyYieldLiters: 12, healthStatus: 'Excellent', lactationStage: 'Lactating' }
      ]
    };

    const updatedPartners = [...partners, newPartner];
    setPartners(updatedPartners);
    sync('dl_partners', updatedPartners);

    setPartnerApplications(updatedApps);
    sync('dl_partner_apps', updatedApps);

    // Sync to backend DB
    fetch(`${apiBase}/partner-applications/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: 'Approved',
        generatedId,
        tempPassword: tempPass
      })
    }).then(() => {
      return fetch(`${apiBase}/partners`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPartner)
      });
    }).catch(err => {
      console.error('Failed to sync partner approval to backend:', err);
    });

    return { partnerId: generatedId, tempPass };
  };

  // Reject Partner App
  const rejectPartnerApp = (id: string) => {
    const updatedApps = partnerApplications.map(app => {
      if (app.id === id) {
        return { ...app, status: 'Rejected' as const };
      }
      return app;
    });
    setPartnerApplications(updatedApps);
    sync('dl_partner_apps', updatedApps);

    fetch(`${apiBase}/partner-applications/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'Rejected' })
    }).catch(err => {
      console.error('Failed to sync partner rejection to backend:', err);
    });
  };

  // Submit Subscription Application
  const submitSubscriptionApp = (app: Omit<SubscriptionApplication, 'id' | 'status' | 'submittedAt'>) => {
    const tempId = `APP_SUB_${Date.now().toString().slice(-5)}`;
    const newApp: SubscriptionApplication = {
      ...app,
      id: tempId,
      status: 'Pending',
      submittedAt: new Date().toISOString().split('T')[0]
    };
    const updated = [newApp, ...subscriptionApplications];
    setSubscriptionApplications(updated);
    sync('dl_sub_apps', updated);

    fetch(`${apiBase}/subscription-applications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newApp)
    }).catch(err => {
      console.error('Failed to sync subscription application to backend:', err);
    });

    return tempId;
  };

  // Approve Subscription App
  const approveSubscriptionApp = (id: string) => {
    let generatedId = '';
    const tempPass = 'customer123';
    
    const updatedApps = subscriptionApplications.map(app => {
      if (app.id === id) {
        const serial = customers.length + 1001;
        generatedId = `SUB${serial}`;
        return {
          ...app,
          status: 'Approved' as const,
          generatedId,
          tempPassword: tempPass
        };
      }
      return app;
    });

    const approvedApp = subscriptionApplications.find(app => app.id === id);
    if (!approvedApp) return null;

    const newCustomer: SubscriptionCustomer = {
      id: generatedId,
      applicationId: approvedApp.id,
      name: approvedApp.fullName,
      mobile: approvedApp.mobile,
      address: approvedApp.address,
      quantity: approvedApp.quantity,
      deliveryTime: approvedApp.deliveryTime,
      status: 'Active',
      createdAt: new Date().toISOString().split('T')[0]
    };

    const updatedCust = [...customers, newCustomer];
    setCustomers(updatedCust);
    sync('dl_customers', updatedCust);

    setSubscriptionApplications(updatedApps);
    sync('dl_sub_apps', updatedApps);

    // Create an automatic greeting order (which handles its own backend POST)
    createOrder({
      customerName: `${newCustomer.name} (${newCustomer.id})`,
      productName: 'Raw Milk (Subscription Setup)',
      quantity: newCustomer.quantity,
      amount: newCustomer.quantity * 65,
      status: 'Pending'
    });

    // Sync to backend DB
    fetch(`${apiBase}/subscription-applications/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: 'Approved',
        generatedId,
        tempPassword: tempPass
      })
    }).then(() => {
      return fetch(`${apiBase}/customers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCustomer)
      });
    }).catch(err => {
      console.error('Failed to sync subscription approval to backend:', err);
    });

    return { customerId: generatedId, tempPass };
  };

  // Reject Subscription App
  const rejectSubscriptionApp = (id: string) => {
    const updatedApps = subscriptionApplications.map(app => {
      if (app.id === id) {
        return { ...app, status: 'Rejected' as const };
      }
      return app;
    });
    setSubscriptionApplications(updatedApps);
    sync('dl_sub_apps', updatedApps);

    fetch(`${apiBase}/subscription-applications/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'Rejected' })
    }).catch(err => {
      console.error('Failed to sync subscription rejection to backend:', err);
    });
  };

  // Partner Management
  const updatePartner = (updatedPartner: Partner) => {
    const updated = partners.map(p => p.id === updatedPartner.id ? updatedPartner : p);
    setPartners(updated);
    sync('dl_partners', updated);

    fetch(`${apiBase}/partners/${updatedPartner.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedPartner)
    }).catch(err => {
      console.error('Failed to update partner on backend:', err);
    });
  };

  const togglePartnerStatus = (id: string) => {
    const updated = partners.map(p => {
      if (p.id === id) {
        return { ...p, status: (p.status === 'Active' ? 'Inactive' : 'Active') as 'Active' | 'Inactive' };
      }
      return p;
    });
    setPartners(updated);
    sync('dl_partners', updated);

    fetch(`${apiBase}/partners/${id}/toggle`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' }
    }).catch(err => {
      console.error('Failed to toggle partner status on backend:', err);
    });
  };

  // Customer Management
  const updateCustomer = (updatedCust: SubscriptionCustomer) => {
    const updated = customers.map(c => c.id === updatedCust.id ? updatedCust : c);
    setCustomers(updated);
    sync('dl_customers', updated);

    fetch(`${apiBase}/customers/${updatedCust.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedCust)
    }).catch(err => {
      console.error('Failed to update customer on backend:', err);
    });
  };

  const toggleCustomerStatus = (id: string) => {
    const updated = customers.map(c => {
      if (c.id === id) {
        return { ...c, status: (c.status === 'Active' ? 'Inactive' : 'Active') as 'Active' | 'Inactive' };
      }
      return c;
    });
    setCustomers(updated);
    sync('dl_customers', updated);

    fetch(`${apiBase}/customers/${id}/toggle`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' }
    }).catch(err => {
      console.error('Failed to toggle customer status on backend:', err);
    });
  };

  // Worker Management
  const addWorker = (w: Omit<Worker, 'id' | 'status' | 'createdAt'>) => {
    const nextSerial = workers.length + 1001;
    const newWorker: Worker = {
      ...w,
      id: `WRK${nextSerial}`,
      status: 'Active',
      createdAt: new Date().toISOString().split('T')[0]
    };
    const updated = [...workers, newWorker];
    setWorkers(updated);
    sync('dl_workers', updated);

    fetch(`${apiBase}/workers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newWorker)
    }).catch(err => {
      console.error('Failed to sync worker to backend:', err);
    });
  };

  const updateWorker = (w: Worker) => {
    const updated = workers.map(item => item.id === w.id ? w : item);
    setWorkers(updated);
    sync('dl_workers', updated);

    fetch(`${apiBase}/workers/${w.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(w)
    }).catch(err => {
      console.error('Failed to update worker on backend:', err);
    });
  };

  const toggleWorkerStatus = (id: string) => {
    const updated = workers.map(w => {
      if (w.id === id) {
        return { ...w, status: (w.status === 'Active' ? 'Inactive' : 'Active') as 'Active' | 'Inactive' };
      }
      return w;
    });
    setWorkers(updated);
    sync('dl_workers', updated);

    fetch(`${apiBase}/workers/${id}/toggle`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' }
    }).catch(err => {
      console.error('Failed to toggle worker status on backend:', err);
    });
  };

  // Milk Records Management
  const addMilkRecord = (rec: Omit<MilkRecord, 'id' | 'createdAt'>) => {
    const newRecord: MilkRecord = {
      ...rec,
      id: `REC${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString()
    };
    const updated = [newRecord, ...milkRecords];
    setMilkRecords(updated);
    sync('dl_milk_records', updated);

    fetch(`${apiBase}/milk-records`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newRecord)
    }).catch(err => {
      console.error('Failed to sync milk record to backend:', err);
    });
  };

  // Product Management
  const addProduct = (p: Omit<Product, 'id'>) => {
    const newProd = { ...p, id: `prod-${Date.now()}` };
    const updated = [...products, newProd];
    setProducts(updated);
    sync('dl_products', updated);

    fetch(`${apiBase}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProd)
    }).catch(err => {
      console.error('Failed to add product on backend:', err);
    });
  };

  const updateProduct = (updatedProd: Product) => {
    const updated = products.map(p => p.id === updatedProd.id ? updatedProd : p);
    setProducts(updated);
    sync('dl_products', updated);

    fetch(`${apiBase}/products/${updatedProd.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedProd)
    }).catch(err => {
      console.error('Failed to update product on backend:', err);
    });
  };

  const deleteProduct = (id: string) => {
    const updated = products.filter(p => p.id !== id);
    setProducts(updated);
    sync('dl_products', updated);

    fetch(`${apiBase}/products/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    }).catch(err => {
      console.error('Failed to delete product on backend:', err);
    });
  };

  // Bulk Orders & General Orders
  const submitBulkOrder = (order: Omit<BulkOrder, 'id' | 'status' | 'amount' | 'submittedAt'> & { amount?: number }) => {
    const newOrder: BulkOrder = {
      ...order,
      id: `BLK${bulkOrders.length + 1001}`,
      status: 'Pending',
      amount: order.amount ?? (parseFloat(order.quantity) * 150 || 5000), // Estimate price roughly based on volume if not calculated
      submittedAt: new Date().toISOString().split('T')[0]
    };
    const updated = [newOrder, ...bulkOrders];
    setBulkOrders(updated);
    sync('dl_bulk_orders', updated);

    fetch(`${apiBase}/bulk-orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newOrder)
    }).catch(err => {
      console.error('Failed to sync bulk order to backend:', err);
    });
    
    // Mirror bulk order in the general order history
    createOrder({
      customerName: `${order.businessName} (Bulk)`,
      productName: order.requirements,
      quantity: parseFloat(order.quantity) || 1,
      amount: newOrder.amount,
      status: 'Pending'
    });
  };

  const updateOrderStatus = (id: string, status: Order['status']) => {
    const updated = orders.map(o => o.id === id ? { ...o, status } : o);
    setOrders(updated);
    sync('dl_orders', updated);

    const updatedOrder = updated.find(o => o.id === id);
    if (updatedOrder) {
      fetch(`${apiBase}/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedOrder)
      }).catch(err => {
        console.error('Failed to update order status on backend:', err);
      });
    }
  };

  const updateBulkOrderStatus = (id: string, status: BulkOrder['status']) => {
    const updated = bulkOrders.map(b => b.id === id ? { ...b, status } : b);
    setBulkOrders(updated);
    sync('dl_bulk_orders', updated);

    const updatedBulkOrder = updated.find(b => b.id === id);
    if (updatedBulkOrder) {
      fetch(`${apiBase}/bulk-orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedBulkOrder)
      }).catch(err => {
        console.error('Failed to update bulk order status on backend:', err);
      });
    }
  };

  const createOrder = (order: Omit<Order, 'id' | 'date'>) => {
    const newOrder: Order = {
      ...order,
      id: `ORD${orders.length + 1001}`,
      date: new Date().toISOString().split('T')[0]
    };
    const updated = [newOrder, ...orders];
    setOrders(updated);
    sync('dl_orders', updated);

    fetch(`${apiBase}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newOrder)
    }).catch(err => {
      console.error('Failed to sync general order to backend:', err);
    });
  };

  // Announcements Management
  const addAnnouncement = (title: string, content: string, category: Announcement['category']) => {
    const newAnn: Announcement = {
      id: `ANN${Date.now()}`,
      title,
      content,
      category,
      date: new Date().toISOString().split('T')[0]
    };
    const updated = [newAnn, ...announcements];
    setAnnouncements(updated);
    sync('dl_announcements', updated);

    fetch(`${apiBase}/announcements`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newAnn)
    }).catch(err => {
      console.error('Failed to add announcement on backend:', err);
    });
  };

  const deleteAnnouncement = (id: string) => {
    const updated = announcements.filter(a => a.id !== id);
    setAnnouncements(updated);
    sync('dl_announcements', updated);

    fetch(`${apiBase}/announcements/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    }).catch(err => {
      console.error('Failed to delete announcement on backend:', err);
    });
  };

  // Subscription Requests Management
  const submitSubscriptionRequest = (req: Omit<SubscriptionRequest, 'id' | 'status' | 'submittedAt'>) => {
    const newReq: SubscriptionRequest = {
      ...req,
      id: `REQ${Date.now()}`,
      status: 'Pending',
      submittedAt: new Date().toISOString().split('T')[0]
    };
    const updated = [newReq, ...subscriptionRequests];
    setSubscriptionRequests(updated);
    sync('dl_sub_requests', updated);

    fetch(`${apiBase}/subscription-requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newReq)
    }).catch(err => {
      console.error('Failed to sync subscription request to backend:', err);
    });
  };

  const approveSubscriptionRequest = (id: string) => {
    const req = subscriptionRequests.find(r => r.id === id);
    if (!req) return;

    // Apply change to customer details
    let updatedCustObj: SubscriptionCustomer | undefined;
    const updatedCustomers = customers.map(cust => {
      if (cust.id === req.customerId) {
        const newCust = { ...cust };
        if (req.type === 'Quantity Change') {
          const qty = parseFloat(req.details.replace(/[^0-9.]/g, ''));
          newCust.quantity = isNaN(qty) ? cust.quantity : qty;
        } else if (req.type === 'Address Change') {
          newCust.address = req.details;
        } else if (req.type === 'Pause') {
          newCust.status = 'Inactive' as const;
        } else if (req.type === 'Resume') {
          newCust.status = 'Active' as const;
        }
        updatedCustObj = newCust;
        return newCust;
      }
      return cust;
    });

    setCustomers(updatedCustomers);
    sync('dl_customers', updatedCustomers);

    const updatedRequests = subscriptionRequests.map(r => 
      r.id === id ? { ...r, status: 'Approved' as const } : r
    );
    setSubscriptionRequests(updatedRequests);
    sync('dl_sub_requests', updatedRequests);

    // Sync to backend DB
    fetch(`${apiBase}/subscription-requests/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'Approved' })
    }).then(() => {
      if (updatedCustObj) {
        return fetch(`${apiBase}/customers/${updatedCustObj.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedCustObj)
        });
      }
    }).catch(err => {
      console.error('Failed to sync subscription request approval to backend:', err);
    });
  };

  const rejectSubscriptionRequest = (id: string) => {
    const updatedRequests = subscriptionRequests.map(r => 
      r.id === id ? { ...r, status: 'Rejected' as const } : r
    );
    setSubscriptionRequests(updatedRequests);
    sync('dl_sub_requests', updatedRequests);

    fetch(`${apiBase}/subscription-requests/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'Rejected' })
    }).catch(err => {
      console.error('Failed to sync subscription request rejection to backend:', err);
    });
  };

  // Get aggregated dashboard stats
  const getDashboardStats = () => {
    const totalPartners = partners.filter(p => p.status === 'Active').length;
    const totalCustomers = customers.filter(c => c.status === 'Active').length;
    
    const pendingP = partnerApplications.filter(a => a.status === 'Pending').length;
    const pendingS = subscriptionApplications.filter(a => a.status === 'Pending').length;
    const pendingB = bulkOrders.filter(o => o.status === 'Pending').length;
    const pendingApplications = pendingP + pendingS + pendingB;

    const totalOrders = orders.length;


    // Sum delivered/processing order values
    const monthlyRevenue = orders
      .filter(o => o.status === 'Delivered' || o.status === 'Processing')
      .reduce((sum, o) => sum + o.amount, 0);

    return {
      totalPartners,
      totalCustomers,
      pendingApplications,
      totalOrders,
      monthlyRevenue
    };
  };

  return (
    <AppContext.Provider value={{
      partners,
      customers,
      partnerApplications,
      subscriptionApplications,
      bulkOrders,
      products,
      orders,
      announcements,
      subscriptionRequests,
      workers,
      milkRecords,
      currentUser,
      signIn,
      signOut,
      submitPartnerApp,
      approvePartnerApp,
      rejectPartnerApp,
      submitSubscriptionApp,
      approveSubscriptionApp,
      rejectSubscriptionApp,
      updatePartner,
      togglePartnerStatus,
      updateCustomer,
      toggleCustomerStatus,
      addWorker,
      updateWorker,
      toggleWorkerStatus,
      addMilkRecord,
      addProduct,
      updateProduct,
      deleteProduct,
      submitBulkOrder,
      updateOrderStatus,
      updateBulkOrderStatus,
      createOrder,
      addAnnouncement,
      deleteAnnouncement,
      submitSubscriptionRequest,
      approveSubscriptionRequest,
      rejectSubscriptionRequest,
      getDashboardStats
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
