import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function checkAndFixSchema() {
  console.log('Checking and fixing database schema...')

  try {
    // Check if products table has required columns
    const { data: columns, error: columnsError } = await supabase
      .rpc('get_table_columns', { table_name: 'products' })
    
    if (columnsError) {
      console.log('Creating function to get table columns...')
      await supabase.rpc('execute_sql', {
        sql: `
          CREATE OR REPLACE FUNCTION get_table_columns(table_name text)
          RETURNS TABLE(column_name text, data_type text)
          AS $$
          BEGIN
            RETURN QUERY
            SELECT 
              c.column_name::text,
              c.data_type::text
            FROM information_schema.columns c
            WHERE c.table_schema = 'public' 
              AND c.table_name = get_table_columns.table_name;
          END;
          $$ LANGUAGE plpgsql;
        `
      })
    }

    // Add missing columns to products table
    const alterStatements = [
      `ALTER TABLE products ADD COLUMN IF NOT EXISTS stock INTEGER DEFAULT 0;`,
      `ALTER TABLE products ADD COLUMN IF NOT EXISTS image_url TEXT;`,
      `ALTER TABLE products ADD COLUMN IF NOT EXISTS sale_price DECIMAL(10,2);`,
      `ALTER TABLE products ADD COLUMN IF NOT EXISTS product_type TEXT DEFAULT 'single' CHECK (product_type IN ('single', 'bundle'));`,
      `ALTER TABLE products ADD COLUMN IF NOT EXISTS access_type TEXT DEFAULT 'paid' CHECK (access_type IN ('free', 'paid', 'mixed'));`
    ]

    for (const statement of alterStatements) {
      try {
        const { error } = await supabase.rpc('execute_sql', { sql: statement })
        if (error) {
          console.error(`Error executing: ${statement}`, error)
        } else {
          console.log(`✓ Executed: ${statement}`)
        }
      } catch (err) {
        console.error(`Failed to execute: ${statement}`, err)
      }
    }

    // Fix orders table structure
    const orderAlterStatements = [
      `ALTER TABLE orders ADD COLUMN IF NOT EXISTS order_number TEXT;`,
      `ALTER TABLE orders ADD COLUMN IF NOT EXISTS user_email TEXT;`,
      `ALTER TABLE orders ADD COLUMN IF NOT EXISTS total_amount DECIMAL(10,2);`,
      `ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_address JSONB;`,
      
      // Update order_number for existing records
      `UPDATE orders SET order_number = 'ORD-' || SUBSTRING(id::text, 1, 8) WHERE order_number IS NULL;`,
      `UPDATE orders SET user_email = customer_email WHERE user_email IS NULL;`,
      `UPDATE orders SET total_amount = total WHERE total_amount IS NULL;`,
      
      // Make order_number unique
      `ALTER TABLE orders ADD CONSTRAINT orders_order_number_unique UNIQUE (order_number);`
    ]

    for (const statement of orderAlterStatements) {
      try {
        const { error } = await supabase.rpc('execute_sql', { sql: statement })
        if (error && !error.message?.includes('already exists')) {
          console.error(`Error executing: ${statement}`, error)
        } else {
          console.log(`✓ Executed: ${statement}`)
        }
      } catch (err) {
        console.error(`Failed to execute: ${statement}`, err)
      }
    }

    // Ensure profiles table has is_admin column
    const profileStatement = `ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;`
    try {
      const { error } = await supabase.rpc('execute_sql', { sql: profileStatement })
      if (error) {
        console.error('Error adding is_admin column:', error)
      } else {
        console.log('✓ Added is_admin column to profiles table')
      }
    } catch (err) {
      console.error('Failed to add is_admin column:', err)
    }

    // Create execute_sql function if it doesn't exist
    const createExecuteSqlFunction = `
      CREATE OR REPLACE FUNCTION execute_sql(sql text)
      RETURNS void AS $$
      BEGIN
        EXECUTE sql;
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER;
    `
    
    try {
      await supabase.rpc('query', { query: createExecuteSqlFunction })
      console.log('✓ Created execute_sql function')
    } catch (err) {
      console.log('execute_sql function might already exist')
    }

    console.log('\n✅ Schema check and fix completed!')

  } catch (error) {
    console.error('Error during schema check:', error)
  }
}

// Run the fix
checkAndFixSchema()