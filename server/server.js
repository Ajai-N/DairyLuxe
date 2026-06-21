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

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 DairyLuxe server running on http://localhost:${PORT}`);
});
