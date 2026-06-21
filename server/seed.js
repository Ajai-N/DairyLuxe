import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load Environment Variables
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

// Generate one random record for each entity
const randomId = () => Math.floor(1000 + Math.random() * 9000);
const dateNow = () => new Date().toISOString();

const mockData = {
  products: {
    id: `prod-${randomId()}`,
    name: 'Fresh Cow Milk (A2)',
    description: 'Fresh, raw A2 single-origin cow milk from Gir cows, delivered within 3 hours of milking.',
    price: 75.0,
    unit: 'Litre',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80&w=400',
    available: true,
    benefits: ['Rich in A2 Beta-Casein', 'Pure & Unprocessed', 'Sourced from grass-fed cattle'],
    hidden: false
  },
  partners: {
    id: `PRT${randomId()}`,
    application_id: `APP_PRT_${randomId()}`,
    name: 'Ramesh Patel',
    mobile: '9876543210',
    address: 'Sector 4, Village Chharodi',
    village: 'Chharodi',
    district: 'Ahmedabad',
    experience: '12 Years',
    why_join: 'To secure a stable price for fresh cow milk and help support rural development.',
    status: 'Active',
    created_at: dateNow(),
    collection_slot: 'Both'
  },
  cows: {
    tag_id: `COW-PRT-${randomId()}-01`,
    partner_id: `PRT_OWNER_ID`, // Will be set to the partner's generated ID
    breed: 'Gir',
    age_years: 4,
    daily_yield_liters: 14.5,
    health_status: 'Healthy',
    lactation_stage: 'Lactating'
  },
  subscription_customers: {
    id: `SUB${randomId()}`,
    application_id: `APP_SUB_${randomId()}`,
    name: 'Anjali Sharma',
    mobile: '9123456789',
    address: 'A-402, Green Valley Apartments, Satellite',
    quantity: 2.0,
    delivery_time: 'Morning',
    status: 'Active',
    created_at: dateNow()
  },
  partner_applications: {
    id: `APP_PRT_${randomId()}`,
    full_name: 'Suresh Kumar',
    mobile: '9988776655',
    address: 'Near Temple, Village Sanand',
    village: 'Sanand',
    district: 'Ahmedabad',
    farming_experience: '5 Years',
    why_join: 'I want to partner with a clean brand to distribute raw milk without middlemen.',
    status: 'Pending',
    submitted_at: dateNow(),
    generated_id: null,
    temp_password: null
  },
  subscription_applications: {
    id: `APP_SUB_${randomId()}`,
    full_name: 'Meera Deshmukh',
    mobile: '9898989898',
    address: 'Flat 12B, Skyline Residency, Gota',
    quantity: 1.5,
    delivery_time: 'Morning',
    status: 'Pending',
    submitted_at: dateNow(),
    generated_id: null,
    temp_password: null
  },
  subscription_requests: {
    id: `REQ${randomId()}`,
    customer_id: `SUB${randomId()}`,
    customer_name: 'Anjali Sharma',
    type: 'Quantity Change',
    details: 'Increase daily quantity from 2L to 3L starting next week',
    status: 'Pending',
    submitted_at: dateNow()
  },
  bulk_orders: {
    id: `BLK${randomId()}`,
    business_name: 'Sweet Delight Bakers',
    contact_person: 'Harish Shah',
    phone: '9000111222',
    requirements: 'Pure Cow Butter & Thick Curd',
    quantity: '50 kgs Butter, 100 kgs Curd',
    message: 'Need weekly supplies for baking operations. Please quote wholesale prices.',
    status: 'Pending',
    amount: 12500,
    submitted_at: dateNow()
  },
  orders: {
    id: `ORD${randomId()}`,
    customer_name: 'Anjali Sharma (SUB1001)',
    product_name: 'Raw Milk (Subscription)',
    quantity: 2,
    amount: 130,
    status: 'Pending',
    date: dateNow()
  },
  announcements: {
    id: `ANN${randomId()}`,
    title: 'Veterinary Camp in Chharodi',
    content: 'DairyLuxe is organizing a free cattle check-up and vaccination camp next Sunday from 8 AM to 2 PM.',
    category: 'Veterinary Camp',
    date: dateNow()
  }
};

// Set matching foreign key relationships
mockData.cows.partner_id = mockData.partners.id;

async function runSeed() {
  console.log('🌱 Starting database seeding script...');

  // Check for configuration validity
  const isSecretMasked = !supabaseSecretKey || supabaseSecretKey.includes('***');
  const isUrlPlaceholder = !supabaseUrl || supabaseUrl === 'https://your-project-ref.supabase.co';

  if (isSecretMasked || isUrlPlaceholder) {
    console.log('\n⚠️  CONNECTION NOTICE:');
    console.log(`   Because your Supabase URL ${isUrlPlaceholder ? '(Placeholder)' : ''} or Secret Key ${isSecretMasked ? '(Masked with ***)' : ''} is incomplete,`);
    console.log('   we cannot write directly to a live Supabase database over the internet.');
    console.log('   Instead, we are SIMULATING the seed insertion below.\n');
    console.log('   To seed your live Supabase database, please follow these steps:');
    console.log('   1. Paste the table schema in "schema.sql" into your Supabase Dashboard -> SQL Editor and run it.');
    console.log('   2. Replace the variables in your server/.env with unmasked, valid Supabase keys.');
    console.log('   3. Run "npm run seed" again.');
    console.log('\n--- SIMULATED RECORDS GENERATED FOR INSERTION ---');
    console.log(JSON.stringify(mockData, null, 2));
    console.log('--------------------------------------------------');
    console.log('\n✅ Mock seed generation complete. (Simulation Succeeded)');
    process.exit(0);
  }

  // Initialize actual Supabase client
  try {
    const supabase = createClient(supabaseUrl, supabaseSecretKey);
    console.log('✅ Connecting to Supabase project...');

    // In a real environment, we'd insert into each table sequentially
    const tableKeys = Object.keys(mockData);
    for (const table of tableKeys) {
      console.log(`⏳ Inserting 1 random record into table: "${table}"...`);
      const { data, error } = await supabase
        .from(table)
        .insert([mockData[table]])
        .select();

      if (error) {
        // If the table doesn't exist yet, it's a helpful hint to run schema.sql first
        if (error.code === '42P01') {
          console.error(`❌ Table "${table}" does not exist. Did you run the SQL schema in "schema.sql" first?`);
        } else {
          console.error(`❌ Error inserting into "${table}":`, error.message);
        }
      } else {
        console.log(`   └─ Success! Seeded record ID: ${data[0]?.id || data[0]?.tag_id}`);
      }
    }

    console.log('\n🎉 Live database seeding operation completed.');
  } catch (error) {
    console.error('❌ Failed to run live seed operation:', error.message);
  }
}

runSeed();
