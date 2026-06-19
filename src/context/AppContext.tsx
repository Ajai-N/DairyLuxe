import React, { createContext, useContext, useState, useEffect } from 'react';

// ==========================================
// Interfaces
// ==========================================

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
}

export interface SubscriptionCustomer {
  id: string; // SUB1001, etc.
  applicationId: string;
  name: string;
  mobile: string;
  address: string;
  quantity: number;
  deliveryTime: 'Morning' | 'Evening';
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
  deliveryTime: 'Morning' | 'Evening';
  status: 'Pending' | 'Approved' | 'Rejected';
  submittedAt: string;
  generatedId?: string;
  tempPassword?: string;
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
  currentUser: { id: string; role: 'admin' | 'partner' | 'customer'; name: string } | null;
  
  // Auth Functions
  signIn: (id: string, password: string) => { success: boolean; error?: string; role?: string };
  signOut: () => void;
  
  // Partner Applications
  submitPartnerApp: (app: Omit<PartnerApplication, 'id' | 'status' | 'submittedAt'>) => void;
  approvePartnerApp: (id: string) => { partnerId: string; tempPass: string } | null;
  rejectPartnerApp: (id: string) => void;
  
  // Subscription Applications
  submitSubscriptionApp: (app: Omit<SubscriptionApplication, 'id' | 'status' | 'submittedAt'>) => void;
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
  submitBulkOrder: (order: Omit<BulkOrder, 'id' | 'status' | 'amount' | 'submittedAt'>) => void;
  updateOrderStatus: (id: string, status: Order['status']) => void;
  updateBulkOrderStatus: (id: string, status: BulkOrder['status']) => void;
  createOrder: (order: Omit<Order, 'id' | 'date'>) => void;
  
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

const DEFAULT_PARTNERS: Partner[] = [
  {
    id: 'PRT1001',
    applicationId: 'APP_PRT_1',
    name: 'Ramesh Kumar',
    mobile: '9876543210',
    address: '42, West Street, Othakkalmandapam',
    village: 'Othakkalmandapam',
    district: 'Coimbatore',
    experience: '12 Years in dairy farming with 8 cows.',
    whyJoin: 'To bypass middlemen and receive a stable monthly payment for my family.',
    status: 'Active',
    createdAt: '2026-03-12'
  },
  {
    id: 'PRT1002',
    applicationId: 'APP_PRT_2',
    name: 'Anitha Selvam',
    mobile: '8765432109',
    address: '15, Temple Lane, Melur',
    village: 'Melur',
    district: 'Madurai',
    experience: '8 Years managing a small family farm.',
    whyJoin: 'Wants support for cattle feed and veterinary care to grow the yield.',
    status: 'Active',
    createdAt: '2026-04-05'
  }
];

const DEFAULT_CUSTOMERS: SubscriptionCustomer[] = [
  {
    id: 'SUB1001',
    applicationId: 'APP_SUB_1',
    name: 'Priya Rajan',
    mobile: '9443210987',
    address: 'Flat 4B, Harmony Apartments, Peelamedu, Coimbatore',
    quantity: 2,
    deliveryTime: 'Morning',
    status: 'Active',
    createdAt: '2026-05-01'
  },
  {
    id: 'SUB1002',
    applicationId: 'APP_SUB_2',
    name: 'David Wilson',
    mobile: '9001234567',
    address: '102, Garden Avenue, R.S. Puram, Coimbatore',
    quantity: 1,
    deliveryTime: 'Evening',
    status: 'Active',
    createdAt: '2026-05-18'
  }
];

const DEFAULT_PARTNER_APPS: PartnerApplication[] = [
  {
    id: 'APP_PRT_3',
    fullName: 'Sundar Lingam',
    mobile: '9123456780',
    address: 'North Car Street, Thiruparankundram',
    village: 'Thiruparankundram',
    district: 'Madurai',
    farmingExperience: '5 years of cattle rearing, owns 4 crossbreed cows.',
    whyJoin: 'Interested in the transparent testing of fat content and timely payments.',
    status: 'Pending',
    submittedAt: '2026-06-18'
  },
  {
    id: 'APP_PRT_4',
    fullName: 'Meenakshi Sundaram',
    mobile: '8877665544',
    address: 'VGP Nagar, Thanjavur Road',
    village: 'Vallam',
    district: 'Thanjavur',
    farmingExperience: '15 years of agricultural and livestock management.',
    whyJoin: 'To connect with a ethical brand that respects the work of rural farmers.',
    status: 'Pending',
    submittedAt: '2026-06-19'
  }
];

const DEFAULT_SUB_APPS: SubscriptionApplication[] = [
  {
    id: 'APP_SUB_3',
    fullName: 'Siddharth Roy',
    mobile: '9988776655',
    address: 'Sector 5, HSR Layout, Bengaluru',
    quantity: 3,
    deliveryTime: 'Morning',
    status: 'Pending',
    submittedAt: '2026-06-18'
  },
  {
    id: 'APP_SUB_4',
    fullName: 'Kavitha Patel',
    mobile: '7766554433',
    address: 'Block C-903, Sky Villa Heights, Indiranagar',
    quantity: 1.5,
    deliveryTime: 'Morning',
    status: 'Pending',
    submittedAt: '2026-06-20'
  }
];

const DEFAULT_BULK_ORDERS: BulkOrder[] = [
  {
    id: 'BLK1001',
    businessName: 'Hotel Saravana Bhavan',
    contactPerson: 'Muthvel K.',
    phone: '9550011223',
    requirements: 'Raw Milk (50 Litres daily) & Thick Curd (20kg daily)',
    quantity: '70 units daily',
    message: 'We require high-fat milk for our traditional filter coffee and restaurant curds.',
    status: 'Processing',
    amount: 18500,
    submittedAt: '2026-06-15'
  },
  {
    id: 'BLK1002',
    businessName: 'The Bake House Cafe',
    contactPerson: 'Sarah Abraham',
    phone: '8220033445',
    requirements: 'Creamery Butter (15kg weekly)',
    quantity: '30 units weekly',
    message: 'Need salt-free butter for pastry baking. Looking for long-term contract.',
    status: 'Pending',
    amount: 7200,
    submittedAt: '2026-06-19'
  }
];

const DEFAULT_ORDERS: Order[] = [
  {
    id: 'ORD1001',
    customerName: 'Priya Rajan (SUB1001)',
    productName: 'Raw Milk (Subscription)',
    quantity: 2,
    amount: 130,
    status: 'Delivered',
    date: '2026-06-19'
  },
  {
    id: 'ORD1002',
    customerName: 'David Wilson (SUB1002)',
    productName: 'Raw Milk (Subscription)',
    quantity: 1,
    amount: 65,
    status: 'Delivered',
    date: '2026-06-19'
  },
  {
    id: 'ORD1003',
    customerName: 'Anil Kumar Cafe',
    productName: 'Thick Curd (Bulk)',
    quantity: 10,
    amount: 700,
    status: 'Delivered',
    date: '2026-06-18'
  },
  {
    id: 'ORD1004',
    customerName: 'Priya Rajan (SUB1001)',
    productName: 'Raw Milk (Subscription)',
    quantity: 2,
    amount: 130,
    status: 'Delivered',
    date: '2026-06-20'
  },
  {
    id: 'ORD1005',
    customerName: 'Adyar Ananda Bhavan',
    productName: 'Saffron Badam Milk (Catering)',
    quantity: 100,
    amount: 6000,
    status: 'Processing',
    date: '2026-06-20'
  }
];

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
  
  const [currentUser, setCurrentUser] = useState<AppContextType['currentUser']>(null);

  // Load from local storage on mount
  useEffect(() => {
    const getOrSet = <T,>(key: string, defaultValue: T): T => {
      const stored = localStorage.getItem(key);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          // fallback
        }
      }
      localStorage.setItem(key, JSON.stringify(defaultValue));
      return defaultValue;
    };

    setPartners(getOrSet('dl_partners', DEFAULT_PARTNERS));
    setCustomers(getOrSet('dl_customers', DEFAULT_CUSTOMERS));
    setPartnerApplications(getOrSet('dl_partner_apps', DEFAULT_PARTNER_APPS));
    setSubscriptionApplications(getOrSet('dl_sub_apps', DEFAULT_SUB_APPS));
    setBulkOrders(getOrSet('dl_bulk_orders', DEFAULT_BULK_ORDERS));
    setProducts(getOrSet('dl_products', DEFAULT_PRODUCTS));
    setOrders(getOrSet('dl_orders', DEFAULT_ORDERS));
    
    const storedUser = sessionStorage.getItem('dl_current_user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  // Sync to local storage
  const sync = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  // Sign In function
  const signIn = (id: string, pass: string) => {
    const trimmedId = id.trim().toLowerCase();
    
    // Admin check
    if (trimmedId === 'admin' && pass === 'admin123') {
      const user = { id: 'admin', role: 'admin' as const, name: 'System Administrator' };
      setCurrentUser(user);
      sessionStorage.setItem('dl_current_user', JSON.stringify(user));
      return { success: true, role: 'admin' };
    }

    // Partner Check
    const activePartner = partners.find(p => p.id.toLowerCase() === trimmedId);
    if (activePartner && pass === 'partner123') {
      const user = { id: activePartner.id, role: 'partner' as const, name: activePartner.name };
      setCurrentUser(user);
      sessionStorage.setItem('dl_current_user', JSON.stringify(user));
      return { success: true, role: 'partner' };
    }

    // Customer Check
    const activeCust = customers.find(c => c.id.toLowerCase() === trimmedId);
    if (activeCust && pass === 'customer123') {
      const user = { id: activeCust.id, role: 'customer' as const, name: activeCust.name };
      setCurrentUser(user);
      sessionStorage.setItem('dl_current_user', JSON.stringify(user));
      return { success: true, role: 'customer' };
    }

    return { success: false, error: 'Invalid User ID or Password. Note: For approved members, default temporary password is "partner123" / "customer123".' };
  };

  const signOut = () => {
    setCurrentUser(null);
    sessionStorage.removeItem('dl_current_user');
  };

  // Submit Partner Application
  const submitPartnerApp = (app: Omit<PartnerApplication, 'id' | 'status' | 'submittedAt'>) => {
    const newApp: PartnerApplication = {
      ...app,
      id: `APP_PRT_${Date.now()}`,
      status: 'Pending',
      submittedAt: new Date().toISOString().split('T')[0]
    };
    const updated = [newApp, ...partnerApplications];
    setPartnerApplications(updated);
    sync('dl_partner_apps', updated);
  };

  // Approve Partner App
  const approvePartnerApp = (id: string) => {
    let generatedId = '';
    let tempPass = 'partner123'; // Standard simulated temporary password
    
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
      createdAt: new Date().toISOString().split('T')[0]
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
    const newApp: SubscriptionApplication = {
      ...app,
      id: `APP_SUB_${Date.now()}`,
      status: 'Pending',
      submittedAt: new Date().toISOString().split('T')[0]
    };
    const updated = [newApp, ...subscriptionApplications];
    setSubscriptionApplications(updated);
    sync('dl_sub_apps', updated);
  };

  // Approve Subscription App
  const approveSubscriptionApp = (id: string) => {
    let generatedId = '';
    let tempPass = 'customer123';
    
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
  const submitBulkOrder = (order: Omit<BulkOrder, 'id' | 'status' | 'amount' | 'submittedAt'>) => {
    const newOrder: BulkOrder = {
      ...order,
      id: `BLK${bulkOrders.length + 1001}`,
      status: 'Pending',
      amount: parseFloat(order.quantity) * 150 || 5000, // Estimate price roughly based on volume
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
