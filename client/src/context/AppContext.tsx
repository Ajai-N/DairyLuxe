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
  currentUser: { id: string; role: 'admin' | 'partner' | 'customer'; name: string } | null;
  
  // Auth Functions
  signIn: (id: string, password: string) => { success: boolean; error?: string; role?: string };
  signOut: () => void;
  
  // Partner Applications
  submitPartnerApp: (app: Omit<PartnerApplication, 'id' | 'status' | 'submittedAt'>) => string;
  approvePartnerApp: (id: string) => { partnerId: string; tempPass: string } | null;
  rejectPartnerApp: (id: string) => void;
  
  // Subscription Applications
  submitSubscriptionApp: (app: Omit<SubscriptionApplication, 'id' | 'status' | 'submittedAt'>) => string;
  approveSubscriptionApp: (id: string) => { customerId: string; tempPass: string } | null;
  rejectSubscriptionApp: (id: string) => void;

  // Partner Management
  updatePartner: (partner: Partner) => void;
  togglePartnerStatus: (id: string) => void;

  // Customer Management
  updateCustomer: (customer: SubscriptionCustomer) => void;
  toggleCustomerStatus: (id: string) => void;

  // Product Management
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;

  // Order Management
  submitBulkOrder: (order: Omit<BulkOrder, 'id' | 'status' | 'amount' | 'submittedAt'> & { amount?: number }) => void;
  updateOrderStatus: (id: string, status: Order['status']) => void;
  updateBulkOrderStatus: (id: string, status: BulkOrder['status']) => void;
  createOrder: (order: Omit<Order, 'id' | 'date'>) => void;
  
  // Announcements Management
  addAnnouncement: (title: string, content: string, category: Announcement['category']) => void;
  deleteAnnouncement: (id: string) => void;

  // Subscription Request Management
  submitSubscriptionRequest: (req: Omit<SubscriptionRequest, 'id' | 'status' | 'submittedAt'>) => void;
  approveSubscriptionRequest: (id: string) => void;
  rejectSubscriptionRequest: (id: string) => void;

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

// ==========================================
// Provider Component
// ==========================================

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [customers, setCustomers] = useState<SubscriptionCustomer[]>([]);
  const [partnerApplications, setPartnerApplications] = useState<PartnerApplication[]>([]);
  const [subscriptionApplications, setSubscriptionApplications] = useState<SubscriptionApplication[]>([]);
  const [bulkOrders, setBulkOrders] = useState<BulkOrder[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [subscriptionRequests, setSubscriptionRequests] = useState<SubscriptionRequest[]>([]);
  
  const [currentUser, setCurrentUser] = useState<AppContextType['currentUser']>(null);

  // Load from local storage on mount
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

    setPartners(getOrSet('dl_partners', DEFAULT_PARTNERS));
    setCustomers(getOrSet('dl_customers', DEFAULT_CUSTOMERS));
    const loadedPartnerApps = getOrSet('dl_partner_apps', DEFAULT_PARTNER_APPS);
    setPartnerApplications(loadedPartnerApps);
    const loadedSubApps = getOrSet('dl_sub_apps', DEFAULT_SUB_APPS);
    setSubscriptionApplications(loadedSubApps);
    setBulkOrders(getOrSet('dl_bulk_orders', DEFAULT_BULK_ORDERS));
    setProducts(getOrSet('dl_products', DEFAULT_PRODUCTS));
    setOrders(getOrSet('dl_orders', DEFAULT_ORDERS));
    setAnnouncements(getOrSet('dl_announcements', DEFAULT_ANNOUNCEMENTS));
    setSubscriptionRequests(getOrSet('dl_sub_requests', []));
    
    const storedUser = sessionStorage.getItem('dl_current_user');
    if (storedUser) {
      try {
        let user = JSON.parse(storedUser);
        if (user.role === 'partner') {
          const app = loadedPartnerApps.find(a => a.id.toLowerCase() === user.id.toLowerCase());
          if (app && app.status === 'Approved' && app.generatedId) {
            user = { ...user, id: app.generatedId, name: app.fullName };
            sessionStorage.setItem('dl_current_user', JSON.stringify(user));
          }
        } else if (user.role === 'customer') {
          const app = loadedSubApps.find(a => a.id.toLowerCase() === user.id.toLowerCase());
          if (app && app.status === 'Approved' && app.generatedId) {
            user = { ...user, id: app.generatedId, name: app.fullName };
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

    // Create an automatic greeting order
    createOrder({
      customerName: `${newCustomer.name} (${newCustomer.id})`,
      productName: 'Raw Milk (Subscription Setup)',
      quantity: newCustomer.quantity,
      amount: newCustomer.quantity * 65,
      status: 'Pending'
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
  };

  // Partner Management
  const updatePartner = (updatedPartner: Partner) => {
    const updated = partners.map(p => p.id === updatedPartner.id ? updatedPartner : p);
    setPartners(updated);
    sync('dl_partners', updated);
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
  };

  // Customer Management
  const updateCustomer = (updatedCust: SubscriptionCustomer) => {
    const updated = customers.map(c => c.id === updatedCust.id ? updatedCust : c);
    setCustomers(updated);
    sync('dl_customers', updated);
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
  };

  // Product Management
  const addProduct = (p: Omit<Product, 'id'>) => {
    const newProd = { ...p, id: `prod-${Date.now()}` };
    const updated = [...products, newProd];
    setProducts(updated);
    sync('dl_products', updated);
  };

  const updateProduct = (updatedProd: Product) => {
    const updated = products.map(p => p.id === updatedProd.id ? updatedProd : p);
    setProducts(updated);
    sync('dl_products', updated);
  };

  const deleteProduct = (id: string) => {
    const updated = products.filter(p => p.id !== id);
    setProducts(updated);
    sync('dl_products', updated);
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
  };

  const updateBulkOrderStatus = (id: string, status: BulkOrder['status']) => {
    const updated = bulkOrders.map(b => b.id === id ? { ...b, status } : b);
    setBulkOrders(updated);
    sync('dl_bulk_orders', updated);
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
  };

  const deleteAnnouncement = (id: string) => {
    const updated = announcements.filter(a => a.id !== id);
    setAnnouncements(updated);
    sync('dl_announcements', updated);
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
  };

  const approveSubscriptionRequest = (id: string) => {
    const req = subscriptionRequests.find(r => r.id === id);
    if (!req) return;

    // Apply change to customer details
    const updatedCustomers = customers.map(cust => {
      if (cust.id === req.customerId) {
        if (req.type === 'Quantity Change') {
          const qty = parseFloat(req.details.replace(/[^0-9.]/g, ''));
          return { ...cust, quantity: isNaN(qty) ? cust.quantity : qty };
        } else if (req.type === 'Address Change') {
          return { ...cust, address: req.details };
        } else if (req.type === 'Pause') {
          return { ...cust, status: 'Inactive' as const };
        } else if (req.type === 'Resume') {
          return { ...cust, status: 'Active' as const };
        }
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
  };

  const rejectSubscriptionRequest = (id: string) => {
    const updatedRequests = subscriptionRequests.map(r => 
      r.id === id ? { ...r, status: 'Rejected' as const } : r
    );
    setSubscriptionRequests(updatedRequests);
    sync('dl_sub_requests', updatedRequests);
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
