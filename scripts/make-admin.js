const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables')
  console.error('Make sure you have NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your .env.local file')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function makeUserAdmin(email) {
  try {
    // First, find the user by email
    const { data: users, error: userError } = await supabase.auth.admin.listUsers()
    
    if (userError) {
      console.error('❌ Error fetching users:', userError)
      return
    }

    const user = users.users.find(u => u.email === email)
    
    if (!user) {
      console.error(`❌ No user found with email: ${email}`)
      console.log('\nAvailable users:')
      users.users.forEach(u => {
        console.log(`  - ${u.email}`)
      })
      return
    }

    // Update the profile to set is_admin = true
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ is_admin: true })
      .eq('id', user.id)

    if (updateError) {
      console.error('❌ Error updating profile:', updateError)
      return
    }

    console.log(`✅ Successfully made ${email} an admin!`)
    console.log(`   User ID: ${user.id}`)
    
    // Verify the change
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, email, is_admin')
      .eq('id', user.id)
      .single()

    if (profile && !profileError) {
      console.log(`   Verified: is_admin = ${profile.is_admin}`)
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error)
  }
}

// Get email from command line arguments
const email = process.argv[2]

if (!email) {
  console.log('Usage: node scripts/make-admin.js <email>')
  console.log('Example: node scripts/make-admin.js admin@example.com')
  process.exit(1)
}

console.log(`\n🔧 Making user admin: ${email}\n`)
makeUserAdmin(email)