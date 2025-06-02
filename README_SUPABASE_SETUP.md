# Supabase Setup Instructions for LittleFidan

Follow these steps to set up your Supabase database for LittleFidan:

## 1. Database Migration

### Option A: Using Supabase Dashboard
1. Go to your Supabase project dashboard
2. Navigate to "SQL Editor" in the left sidebar
3. Click "New Query"
4. Copy the entire contents of `/supabase/migrations/001_initial_schema.sql`
5. Paste it into the query editor
6. Click "Run" to execute the migration

### Option B: Using Supabase CLI
```bash
# Install Supabase CLI if you haven't already
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```

## 2. Make Yourself Admin

1. Go to Supabase Dashboard → Authentication → Users
2. Find your user account and copy the user ID
3. Go to Table Editor → profiles table
4. Find your profile row (matching the user ID)
5. Click Edit and set `is_admin` to `true`
6. Save the changes

## 3. Storage Buckets Setup

Create the following storage buckets in your Supabase project:

1. Go to Storage in your Supabase dashboard
2. Create these buckets:
   - `products` - For product images (public)
   - `downloads` - For PDF files (authenticated)
   - `avatars` - For user avatars (public)

### Set bucket policies:

For `products` bucket:
```sql
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'products');
CREATE POLICY "Admin Insert" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'products' AND EXISTS (
  SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true
));
CREATE POLICY "Admin Update" ON storage.objects FOR UPDATE USING (bucket_id = 'products' AND EXISTS (
  SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true
));
CREATE POLICY "Admin Delete" ON storage.objects FOR DELETE USING (bucket_id = 'products' AND EXISTS (
  SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true
));
```

For `downloads` bucket:
```sql
CREATE POLICY "Authenticated Access" ON storage.objects FOR SELECT USING (bucket_id = 'downloads' AND auth.role() = 'authenticated');
CREATE POLICY "Admin Insert" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'downloads' AND EXISTS (
  SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true
));
CREATE POLICY "Admin Update" ON storage.objects FOR UPDATE USING (bucket_id = 'downloads' AND EXISTS (
  SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true
));
CREATE POLICY "Admin Delete" ON storage.objects FOR DELETE USING (bucket_id = 'downloads' AND EXISTS (
  SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true
));
```

## 4. Enable Authentication Providers

1. Go to Authentication → Providers
2. Enable Email authentication (already enabled by default)
3. Optionally enable:
   - Google OAuth for social login
   - Magic Link for passwordless login

## 5. Configure Email Templates

1. Go to Authentication → Email Templates
2. Customize the templates to match LittleFidan branding
3. Important templates to customize:
   - Confirm signup
   - Reset password
   - Magic link

## 6. Environment Variables

Make sure your `.env.local` file has these variables:
```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## 7. Test Your Setup

1. Sign up for a new account on your site
2. Check if the profile is created in the profiles table
3. Make yourself admin as described in step 2
4. Try accessing `/admin` - you should see the admin panel
5. Try creating a product in the admin panel

## Troubleshooting

### If migrations fail:
- Check for any existing tables that might conflict
- Make sure UUID extension is enabled
- Run the migration in smaller chunks if needed

### If authentication doesn't work:
- Verify your environment variables are correct
- Check that your Supabase URL doesn't have a trailing slash
- Ensure the anon key is the correct one (not the service role key)

### If admin access doesn't work:
- Verify you set is_admin = true for your user
- Check the RLS policies are properly created
- Try refreshing your authentication token by logging out and in

## Next Steps

After setup is complete:
1. Start adding products through the admin panel
2. Upload PDF files for downloads
3. Configure your payment settings
4. Set up email notifications
5. Add your Instagram API credentials for social integration