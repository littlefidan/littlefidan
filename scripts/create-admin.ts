import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

async function createAdminUser() {
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })

  // Create admin user
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: 'admin@littlefidan.nl',
    password: 'Admin@123!',
    email_confirm: true
  })

  if (authError) {
    console.error('Error creating admin user:', authError)
    return
  }

  console.log('Admin user created:', authData.user?.email)

  // Update profile to make admin
  if (authData.user) {
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ 
        is_admin: true,
        full_name: 'LittleFidan Admin'
      })
      .eq('id', authData.user.id)

    if (profileError) {
      console.error('Error updating profile:', profileError)
      return
    }

    console.log('Admin profile updated successfully!')
    console.log('Login with:')
    console.log('Email: admin@littlefidan.nl')
    console.log('Password: Admin@123!')
  }
}

// Run if called directly
if (require.main === module) {
  createAdminUser()
}