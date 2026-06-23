import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Load Environment Variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Supabase Client with Robust Diagnostic Check
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;
const supabasePublishableKey = process.env.SUPABASE_PUBLISHABLE_KEY;

let supabase = null;
let isDbConfigured = false;

// Check if credentials are valid and unmasked
const isUrlPlaceholder = !supabaseUrl || supabaseUrl === 'https://your-project-ref.supabase.co';
const isSecretMasked = !supabaseSecretKey || supabaseSecretKey.includes('***');

if (supabaseUrl && !isUrlPlaceholder && supabaseSecretKey && !isSecretMasked) {
  try {
    supabase = createClient(supabaseUrl, supabaseSecretKey);
    isDbConfigured = true;
    console.log('✅ Supabase client successfully initialized with your credentials.');
  } catch (error) {
    console.error('❌ Error initializing Supabase client:', error.message);
  }
} else {
  console.warn('⚠️  Supabase environment credentials status:');
  console.warn('   - SUPABASE_URL:', isUrlPlaceholder ? '[Placeholder URL]' : 'Configured');
  console.warn('   - SUPABASE_SECRET_KEY:', isSecretMasked ? '[Masked/Incomplete]' : 'Configured');
  console.warn('👉 Please update server/.env with valid, unmasked Supabase project credentials to connect to a live database.');
}

// Health Check / Home Route
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'DairyLuxe Backend Server is running.',
    database_connected: isDbConfigured,
    port: PORT
  });
});

// Diagnostic Config Route
app.get('/api/config-check', (req, res) => {
  res.json({
    configured: isDbConfigured,
    supabase_url: supabaseUrl,
    publishable_key_provided: !!supabasePublishableKey,
    secret_key_provided: !!supabaseSecretKey,
    is_masked: supabaseSecretKey ? supabaseSecretKey.includes('***') : false,
    guidance: isDbConfigured 
      ? 'Database connection is configured.' 
      : 'Please modify server/.env with your valid, unmasked Supabase URL and Secret Key.'
  });
});

// ====================================================================
// Column Mapping Utilities (camelCase JS <=> snake_case PostgreSQL)
// ====================================================================

function mapDbToFrontend(obj, mappings) {
  if (!obj) return obj;
  const result = { ...obj };
  for (const [dbKey, frontendKey] of Object.entries(mappings)) {
    if (dbKey in result) {
      result[frontendKey] = result[dbKey];
      delete result[dbKey];
    }
  }
  return result;
}

function mapFrontendToDb(obj, mappings) {
  if (!obj) return obj;
  const result = { ...obj };
  for (const [dbKey, frontendKey] of Object.entries(mappings)) {
    if (frontendKey in result) {
      result[dbKey] = result[frontendKey];
      delete result[frontendKey];
    }
  }
  return result;
}

const partnerAppMappings = {
  full_name: 'fullName',
  farming_experience: 'farmingExperience',
  why_join: 'whyJoin',
  submitted_at: 'submittedAt',
  generated_id: 'generatedId',
  temp_password: 'tempPassword'
};

const subAppMappings = {
  full_name: 'fullName',
  delivery_time: 'deliveryTime',
  submitted_at: 'submittedAt',
  generated_id: 'generatedId',
  temp_password: 'tempPassword'
};

const partnerMappings = {
  application_id: 'applicationId',
  why_join: 'whyJoin',
  created_at: 'createdAt',
  collection_slot: 'collectionSlot'
};

const customerMappings = {
  application_id: 'applicationId',
  delivery_time: 'deliveryTime',
  created_at: 'createdAt'
};

const cowMappings = {
  tag_id: 'tagId',
  partner_id: 'partnerId',
  age_years: 'ageYears',
  daily_yield_liters: 'dailyYieldLiters',
  health_status: 'healthStatus',
  lactation_stage: 'lactationStage'
};

const subRequestMappings = {
  customer_id: 'customerId',
  customer_name: 'customerName',
  submitted_at: 'submittedAt'
};

const bulkOrderMappings = {
  business_name: 'businessName',
  contact_person: 'contactPerson',
  submitted_at: 'submittedAt'
};

const orderMappings = {
  customer_name: 'customerName',
  product_name: 'productName'
};

const workerMappings = {
  created_at: 'createdAt'
};

const milkRecordMappings = {
  worker_id: 'workerId',
  worker_name: 'workerName',
  target_id: 'targetId',
  target_name: 'targetName',
  target_type: 'targetType',
  created_at: 'createdAt'
};


// ====================================================================
// REST API Routes
// ====================================================================

// --- 1. Products Table CRUD ---
app.get('/api/products', async (req, res) => {
  if (isDbConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('id');
      if (error) throw error;
      return res.json({ success: true, products: data });
    } catch (err) {
      console.error('Error fetching products:', err.message);
      return res.status(500).json({ success: false, error: err.message });
    }
  }
  return res.json({ success: true, simulated: true, products: [] });
});

app.post('/api/products', async (req, res) => {
  if (isDbConfigured && supabase) {
    try {
      const product = req.body;
      const { data, error } = await supabase
        .from('products')
        .insert([product])
        .select();
      if (error) throw error;
      return res.status(201).json({ success: true, product: data[0] });
    } catch (err) {
      console.error('Error creating product:', err.message);
      return res.status(500).json({ success: false, error: err.message });
    }
  }
  return res.status(201).json({ success: true, simulated: true, product: req.body });
});

app.put('/api/products/:id', async (req, res) => {
  if (isDbConfigured && supabase) {
    try {
      const product = req.body;
      const { data, error } = await supabase
        .from('products')
        .update(product)
        .eq('id', req.params.id)
        .select();
      if (error) throw error;
      return res.json({ success: true, product: data[0] });
    } catch (err) {
      console.error('Error updating product:', err.message);
      return res.status(500).json({ success: false, error: err.message });
    }
  }
  return res.json({ success: true, simulated: true, product: req.body });
});

app.delete('/api/products/:id', async (req, res) => {
  if (isDbConfigured && supabase) {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', req.params.id);
      if (error) throw error;
      return res.json({ success: true });
    } catch (err) {
      console.error('Error deleting product:', err.message);
      return res.status(500).json({ success: false, error: err.message });
    }
  }
  return res.json({ success: true, simulated: true });
});

// --- 2. Partner Applications CRUD ---
app.get('/api/partner-applications', async (req, res) => {
  if (isDbConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('partner_applications')
        .select('*')
        .order('submitted_at', { ascending: false });
      if (error) throw error;
      const apps = data.map(d => mapDbToFrontend(d, partnerAppMappings));
      return res.json({ success: true, applications: apps });
    } catch (err) {
      console.error('Error fetching partner applications:', err.message);
      return res.status(500).json({ success: false, error: err.message });
    }
  }
  return res.json({ success: true, simulated: true, applications: [] });
});

app.post('/api/partner-applications', async (req, res) => {
  const body = mapFrontendToDb(req.body, partnerAppMappings);
  if (isDbConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('partner_applications')
        .insert([body])
        .select();
      if (error) throw error;
      return res.status(201).json({ success: true, application: mapDbToFrontend(data[0], partnerAppMappings) });
    } catch (err) {
      console.error('Error creating partner application:', err.message);
      return res.status(500).json({ success: false, error: err.message });
    }
  }
  return res.status(201).json({ success: true, simulated: true, application: req.body });
});

app.put('/api/partner-applications/:id', async (req, res) => {
  const body = mapFrontendToDb(req.body, partnerAppMappings);
  if (isDbConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('partner_applications')
        .update(body)
        .eq('id', req.params.id)
        .select();
      if (error) throw error;
      return res.json({ success: true, application: mapDbToFrontend(data[0], partnerAppMappings) });
    } catch (err) {
      console.error('Error updating partner application:', err.message);
      return res.status(500).json({ success: false, error: err.message });
    }
  }
  return res.json({ success: true, simulated: true, application: req.body });
});

// --- 3. Subscription Applications CRUD ---
app.get('/api/subscription-applications', async (req, res) => {
  if (isDbConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('subscription_applications')
        .select('*')
        .order('submitted_at', { ascending: false });
      if (error) throw error;
      const apps = data.map(d => mapDbToFrontend(d, subAppMappings));
      return res.json({ success: true, applications: apps });
    } catch (err) {
      console.error('Error fetching subscription applications:', err.message);
      return res.status(500).json({ success: false, error: err.message });
    }
  }
  return res.json({ success: true, simulated: true, applications: [] });
});

app.post('/api/subscription-applications', async (req, res) => {
  const body = mapFrontendToDb(req.body, subAppMappings);
  if (isDbConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('subscription_applications')
        .insert([body])
        .select();
      if (error) throw error;
      return res.status(201).json({ success: true, application: mapDbToFrontend(data[0], subAppMappings) });
    } catch (err) {
      console.error('Error creating subscription application:', err.message);
      return res.status(500).json({ success: false, error: err.message });
    }
  }
  return res.status(201).json({ success: true, simulated: true, application: req.body });
});

app.put('/api/subscription-applications/:id', async (req, res) => {
  const body = mapFrontendToDb(req.body, subAppMappings);
  if (isDbConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('subscription_applications')
        .update(body)
        .eq('id', req.params.id)
        .select();
      if (error) throw error;
      return res.json({ success: true, application: mapDbToFrontend(data[0], subAppMappings) });
    } catch (err) {
      console.error('Error updating subscription application:', err.message);
      return res.status(500).json({ success: false, error: err.message });
    }
  }
  return res.json({ success: true, simulated: true, application: req.body });
});

// --- 4. Partners & Cows CRUD ---
app.get('/api/partners', async (req, res) => {
  if (isDbConfigured && supabase) {
    try {
      const { data: partnersData, error: pError } = await supabase
        .from('partners')
        .select('*')
        .order('created_at', { ascending: false });
      if (pError) throw pError;

      const { data: cowsData, error: cError } = await supabase
        .from('cows')
        .select('*');
      if (cError) throw cError;

      const mappedCows = cowsData.map(c => mapDbToFrontend(c, cowMappings));

      const partnersList = partnersData.map(p => {
        const frontendPartner = mapDbToFrontend(p, partnerMappings);
        frontendPartner.cows = mappedCows.filter(c => c.partnerId === p.id);
        return frontendPartner;
      });

      return res.json({ success: true, partners: partnersList });
    } catch (err) {
      console.error('Error fetching partners:', err.message);
      return res.status(500).json({ success: false, error: err.message });
    }
  }
  return res.json({ success: true, simulated: true, partners: [] });
});

app.post('/api/partners', async (req, res) => {
  const { cows, ...rest } = req.body;
  const partnerRow = mapFrontendToDb(rest, partnerMappings);
  if (isDbConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('partners')
        .insert([partnerRow])
        .select();
      if (error) throw error;

      const partnerId = data[0].id;

      if (cows && cows.length > 0) {
        const cowsRows = cows.map(c => {
          const mapped = mapFrontendToDb(c, cowMappings);
          mapped.partner_id = partnerId;
          return mapped;
        });
        const { error: cError } = await supabase.from('cows').insert(cowsRows);
        if (cError) throw cError;
      }

      const result = mapDbToFrontend(data[0], partnerMappings);
      result.cows = cows || [];
      return res.status(201).json({ success: true, partner: result });
    } catch (err) {
      console.error('Error creating partner:', err.message);
      return res.status(500).json({ success: false, error: err.message });
    }
  }
  return res.status(201).json({ success: true, simulated: true, partner: req.body });
});

app.put('/api/partners/:id', async (req, res) => {
  const { cows, ...rest } = req.body;
  const partnerId = req.params.id;
  const partnerRow = mapFrontendToDb(rest, partnerMappings);
  if (isDbConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('partners')
        .update(partnerRow)
        .eq('id', partnerId)
        .select();
      if (error) throw error;

      if (cows) {
        await supabase.from('cows').delete().eq('partner_id', partnerId);
        if (cows.length > 0) {
          const cowsRows = cows.map(c => {
            const mapped = mapFrontendToDb(c, cowMappings);
            mapped.partner_id = partnerId;
            return mapped;
          });
          const { error: cError } = await supabase.from('cows').insert(cowsRows);
          if (cError) throw cError;
        }
      }

      const result = mapDbToFrontend(data[0], partnerMappings);
      result.cows = cows || [];
      return res.json({ success: true, partner: result });
    } catch (err) {
      console.error('Error updating partner:', err.message);
      return res.status(500).json({ success: false, error: err.message });
    }
  }
  return res.json({ success: true, simulated: true, partner: req.body });
});

app.put('/api/partners/:id/toggle', async (req, res) => {
  const partnerId = req.params.id;
  if (isDbConfigured && supabase) {
    try {
      const { data: current, error: getErr } = await supabase
        .from('partners')
        .select('status')
        .eq('id', partnerId)
        .single();
      if (getErr) throw getErr;

      const newStatus = current.status === 'Active' ? 'Inactive' : 'Active';
      const { data, error } = await supabase
        .from('partners')
        .update({ status: newStatus })
        .eq('id', partnerId)
        .select();
      if (error) throw error;

      return res.json({ success: true, partner: mapDbToFrontend(data[0], partnerMappings) });
    } catch (err) {
      console.error('Error toggling partner status:', err.message);
      return res.status(500).json({ success: false, error: err.message });
    }
  }
  return res.json({ success: true, simulated: true });
});

// --- 5. Subscription Customers CRUD ---
app.get('/api/customers', async (req, res) => {
  if (isDbConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('subscription_customers')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      const custs = data.map(d => mapDbToFrontend(d, customerMappings));
      return res.json({ success: true, customers: custs });
    } catch (err) {
      console.error('Error fetching customers:', err.message);
      return res.status(500).json({ success: false, error: err.message });
    }
  }
  return res.json({ success: true, simulated: true, customers: [] });
});

app.post('/api/customers', async (req, res) => {
  const body = mapFrontendToDb(req.body, customerMappings);
  if (isDbConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('subscription_customers')
        .insert([body])
        .select();
      if (error) throw error;
      return res.status(201).json({ success: true, customer: mapDbToFrontend(data[0], customerMappings) });
    } catch (err) {
      console.error('Error creating customer:', err.message);
      return res.status(500).json({ success: false, error: err.message });
    }
  }
  return res.status(201).json({ success: true, simulated: true, customer: req.body });
});

app.put('/api/customers/:id', async (req, res) => {
  const body = mapFrontendToDb(req.body, customerMappings);
  if (isDbConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('subscription_customers')
        .update(body)
        .eq('id', req.params.id)
        .select();
      if (error) throw error;
      return res.json({ success: true, customer: mapDbToFrontend(data[0], customerMappings) });
    } catch (err) {
      console.error('Error updating customer:', err.message);
      return res.status(500).json({ success: false, error: err.message });
    }
  }
  return res.json({ success: true, simulated: true, customer: req.body });
});

app.put('/api/customers/:id/toggle', async (req, res) => {
  const customerId = req.params.id;
  if (isDbConfigured && supabase) {
    try {
      const { data: current, error: getErr } = await supabase
        .from('subscription_customers')
        .select('status')
        .eq('id', customerId)
        .single();
      if (getErr) throw getErr;

      const newStatus = current.status === 'Active' ? 'Inactive' : 'Active';
      const { data, error } = await supabase
        .from('subscription_customers')
        .update({ status: newStatus })
        .eq('id', customerId)
        .select();
      if (error) throw error;

      return res.json({ success: true, customer: mapDbToFrontend(data[0], customerMappings) });
    } catch (err) {
      console.error('Error toggling customer status:', err.message);
      return res.status(500).json({ success: false, error: err.message });
    }
  }
  return res.json({ success: true, simulated: true });
});

// --- 6. Bulk Orders CRUD ---
app.get('/api/bulk-orders', async (req, res) => {
  if (isDbConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('bulk_orders')
        .select('*')
        .order('submitted_at', { ascending: false });
      if (error) throw error;
      const orders = data.map(d => mapDbToFrontend(d, bulkOrderMappings));
      return res.json({ success: true, bulkOrders: orders });
    } catch (err) {
      console.error('Error fetching bulk orders:', err.message);
      return res.status(500).json({ success: false, error: err.message });
    }
  }
  return res.json({ success: true, simulated: true, bulkOrders: [] });
});

app.post('/api/bulk-orders', async (req, res) => {
  const body = mapFrontendToDb(req.body, bulkOrderMappings);
  if (isDbConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('bulk_orders')
        .insert([body])
        .select();
      if (error) throw error;
      return res.status(201).json({ success: true, bulkOrder: mapDbToFrontend(data[0], bulkOrderMappings) });
    } catch (err) {
      console.error('Error creating bulk order:', err.message);
      return res.status(500).json({ success: false, error: err.message });
    }
  }
  return res.status(201).json({ success: true, simulated: true, bulkOrder: req.body });
});

app.put('/api/bulk-orders/:id', async (req, res) => {
  const body = mapFrontendToDb(req.body, bulkOrderMappings);
  if (isDbConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('bulk_orders')
        .update(body)
        .eq('id', req.params.id)
        .select();
      if (error) throw error;
      return res.json({ success: true, bulkOrder: mapDbToFrontend(data[0], bulkOrderMappings) });
    } catch (err) {
      console.error('Error updating bulk order:', err.message);
      return res.status(500).json({ success: false, error: err.message });
    }
  }
  return res.json({ success: true, simulated: true, bulkOrder: req.body });
});

// --- 7. General Orders CRUD ---
app.get('/api/orders', async (req, res) => {
  if (isDbConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('date', { ascending: false });
      if (error) throw error;
      const ords = data.map(d => mapDbToFrontend(d, orderMappings));
      return res.json({ success: true, orders: ords });
    } catch (err) {
      console.error('Error fetching orders:', err.message);
      return res.status(500).json({ success: false, error: err.message });
    }
  }
  return res.json({ success: true, simulated: true, orders: [] });
});

app.post('/api/orders', async (req, res) => {
  const body = mapFrontendToDb(req.body, orderMappings);
  if (isDbConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .insert([body])
        .select();
      if (error) throw error;
      return res.status(201).json({ success: true, order: mapDbToFrontend(data[0], orderMappings) });
    } catch (err) {
      console.error('Error creating order:', err.message);
      return res.status(500).json({ success: false, error: err.message });
    }
  }
  return res.status(201).json({ success: true, simulated: true, order: req.body });
});

app.put('/api/orders/:id', async (req, res) => {
  const body = mapFrontendToDb(req.body, orderMappings);
  if (isDbConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .update(body)
        .eq('id', req.params.id)
        .select();
      if (error) throw error;
      return res.json({ success: true, order: mapDbToFrontend(data[0], orderMappings) });
    } catch (err) {
      console.error('Error updating order:', err.message);
      return res.status(500).json({ success: false, error: err.message });
    }
  }
  return res.json({ success: true, simulated: true, order: req.body });
});

// --- 8. Announcements CRUD ---
app.get('/api/announcements', async (req, res) => {
  if (isDbConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .order('date', { ascending: false });
      if (error) throw error;
      return res.json({ success: true, announcements: data });
    } catch (err) {
      console.error('Error fetching announcements:', err.message);
      return res.status(500).json({ success: false, error: err.message });
    }
  }
  return res.json({ success: true, simulated: true, announcements: [] });
});

app.post('/api/announcements', async (req, res) => {
  if (isDbConfigured && supabase) {
    try {
      const ann = req.body;
      const { data, error } = await supabase
        .from('announcements')
        .insert([ann])
        .select();
      if (error) throw error;
      return res.status(201).json({ success: true, announcement: data[0] });
    } catch (err) {
      console.error('Error creating announcement:', err.message);
      return res.status(500).json({ success: false, error: err.message });
    }
  }
  return res.status(201).json({ success: true, simulated: true, announcement: req.body });
});

app.delete('/api/announcements/:id', async (req, res) => {
  if (isDbConfigured && supabase) {
    try {
      const { error } = await supabase
        .from('announcements')
        .delete()
        .eq('id', req.params.id);
      if (error) throw error;
      return res.json({ success: true });
    } catch (err) {
      console.error('Error deleting announcement:', err.message);
      return res.status(500).json({ success: false, error: err.message });
    }
  }
  return res.json({ success: true, simulated: true });
});

// --- 9. Subscription Requests CRUD ---
app.get('/api/subscription-requests', async (req, res) => {
  if (isDbConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('subscription_requests')
        .select('*')
        .order('submitted_at', { ascending: false });
      if (error) throw error;
      const reqs = data.map(d => mapDbToFrontend(d, subRequestMappings));
      return res.json({ success: true, subscriptionRequests: reqs });
    } catch (err) {
      console.error('Error fetching sub requests:', err.message);
      return res.status(500).json({ success: false, error: err.message });
    }
  }
  return res.json({ success: true, simulated: true, subscriptionRequests: [] });
});

app.post('/api/subscription-requests', async (req, res) => {
  const body = mapFrontendToDb(req.body, subRequestMappings);
  if (isDbConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('subscription_requests')
        .insert([body])
        .select();
      if (error) throw error;
      return res.status(201).json({ success: true, subscriptionRequest: mapDbToFrontend(data[0], subRequestMappings) });
    } catch (err) {
      console.error('Error creating sub request:', err.message);
      return res.status(500).json({ success: false, error: err.message });
    }
  }
  return res.status(201).json({ success: true, simulated: true, subscriptionRequest: req.body });
});

app.put('/api/subscription-requests/:id', async (req, res) => {
  const body = mapFrontendToDb(req.body, subRequestMappings);
  if (isDbConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('subscription_requests')
        .update(body)
        .eq('id', req.params.id)
        .select();
      if (error) throw error;
      return res.json({ success: true, subscriptionRequest: mapDbToFrontend(data[0], subRequestMappings) });
    } catch (err) {
      console.error('Error updating sub request:', err.message);
      return res.status(500).json({ success: false, error: err.message });
    }
  }
  return res.json({ success: true, simulated: true, subscriptionRequest: req.body });
});

// --- 10. Workers CRUD ---
app.get('/api/workers', async (req, res) => {
  if (isDbConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('workers')
        .select('*')
        .order('id');
      if (error) throw error;
      const wrks = data.map(d => mapDbToFrontend(d, workerMappings));
      return res.json({ success: true, workers: wrks });
    } catch (err) {
      console.error('Error fetching workers:', err.message);
      return res.status(500).json({ success: false, error: err.message });
    }
  }
  return res.json({ success: true, simulated: true, workers: [] });
});

app.post('/api/workers', async (req, res) => {
  const body = mapFrontendToDb(req.body, workerMappings);
  if (isDbConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('workers')
        .insert([body])
        .select();
      if (error) throw error;
      return res.status(201).json({ success: true, worker: mapDbToFrontend(data[0], workerMappings) });
    } catch (err) {
      console.error('Error creating worker:', err.message);
      return res.status(500).json({ success: false, error: err.message });
    }
  }
  return res.status(201).json({ success: true, simulated: true, worker: req.body });
});

app.put('/api/workers/:id', async (req, res) => {
  const body = mapFrontendToDb(req.body, workerMappings);
  if (isDbConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('workers')
        .update(body)
        .eq('id', req.params.id)
        .select();
      if (error) throw error;
      return res.json({ success: true, worker: mapDbToFrontend(data[0], workerMappings) });
    } catch (err) {
      console.error('Error updating worker:', err.message);
      return res.status(500).json({ success: false, error: err.message });
    }
  }
  return res.json({ success: true, simulated: true, worker: req.body });
});

app.put('/api/workers/:id/toggle', async (req, res) => {
  const workerId = req.params.id;
  if (isDbConfigured && supabase) {
    try {
      const { data: current, error: getErr } = await supabase
        .from('workers')
        .select('status')
        .eq('id', workerId)
        .single();
      if (getErr) throw getErr;

      const newStatus = current.status === 'Active' ? 'Inactive' : 'Active';
      const { data, error } = await supabase
        .from('workers')
        .update({ status: newStatus })
        .eq('id', workerId)
        .select();
      if (error) throw error;

      return res.json({ success: true, worker: mapDbToFrontend(data[0], workerMappings) });
    } catch (err) {
      console.error('Error toggling worker status:', err.message);
      return res.status(500).json({ success: false, error: err.message });
    }
  }
  return res.json({ success: true, simulated: true });
});

// --- 11. Milk Records CRUD ---
app.get('/api/milk-records', async (req, res) => {
  if (isDbConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('milk_records')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      const recs = data.map(d => mapDbToFrontend(d, milkRecordMappings));
      return res.json({ success: true, milkRecords: recs });
    } catch (err) {
      console.error('Error fetching milk records:', err.message);
      return res.status(500).json({ success: false, error: err.message });
    }
  }
  return res.json({ success: true, simulated: true, milkRecords: [] });
});

app.post('/api/milk-records', async (req, res) => {
  const body = mapFrontendToDb(req.body, milkRecordMappings);
  if (isDbConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('milk_records')
        .insert([body])
        .select();
      if (error) throw error;
      return res.status(201).json({ success: true, milkRecord: mapDbToFrontend(data[0], milkRecordMappings) });
    } catch (err) {
      console.error('Error creating milk record:', err.message);
      return res.status(500).json({ success: false, error: err.message });
    }
  }
  return res.status(201).json({ success: true, simulated: true, milkRecord: req.body });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 DairyLuxe server running on http://localhost:${PORT}`);
});

