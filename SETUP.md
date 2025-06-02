# LittleFidan Platform Setup Guide

## Prerequisites

- Node.js 18+ installed
- Supabase account
- Payment provider account (Mollie - optional for now)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/littlefidan/littlefidan.git
cd littlefidan-platform
```

2. Install dependencies:
```bash
npm install
```

3. Copy environment variables:
```bash
cp .env.local.example .env.local
```

4. Update `.env.local` with your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Database Setup

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Run the migration files in order:

```sql
-- Run each file in the supabase/migrations folder:
-- 001_initial_schema.sql
-- 002_admin_tables.sql
-- 003_bundle_support.sql
-- 004_storage_buckets.sql
```

## Storage Bucket Setup

The platform uses Supabase Storage for PDF files. The bucket is created automatically by the migration, but you need to verify it:

1. Go to Supabase Dashboard > Storage
2. Verify that the `product-files` bucket exists
3. If not, create it manually:
   - Name: `product-files`
   - Public: Yes (files are still protected by access control)

## Admin User Setup

1. Create a new user account through the signup page
2. In Supabase SQL Editor, run:

```sql
UPDATE public.profiles 
SET is_admin = true 
WHERE email = 'your-admin-email@example.com';
```

## Running the Application

```bash
# Development
npm run dev

# Build for production
npm run build

# Start production server
npm run start
```

## Features Status

### ✅ Completed
- User authentication (login, signup, password reset)
- Product listing with real Supabase data
- Product detail pages
- Category pages
- Shopping cart functionality
- Wishlist functionality
- Admin panel (products, categories, orders, files, settings)
- File download with access control
- API routes for products, orders, search
- Terms of Service and Privacy Policy pages

### ⏳ Pending (Requires Configuration)
- Email notifications (requires email service setup)
- Payment processing (requires Mollie API key)
- Instagram feed integration (requires Instagram API)

## Testing the Platform

1. **Admin Features:**
   - Login with admin account
   - Navigate to `/admin`
   - Create categories and products
   - Upload PDF files

2. **Customer Features:**
   - Browse products at `/products`
   - View product details
   - Add to cart (payment integration pending)
   - Download free products

## Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Environment Variables for Production

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SITE_URL=https://yourdomain.com

# Optional (for full functionality)
MOLLIE_API_KEY=
INSTAGRAM_CLIENT_ID=
INSTAGRAM_CLIENT_SECRET=
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
```

## Troubleshooting

### Common Issues

1. **"Table not found" errors**
   - Make sure all migrations have been run in order
   - Check Supabase dashboard to verify tables exist

2. **File upload not working**
   - Verify the storage bucket exists
   - Check RLS policies are enabled
   - Ensure user is admin

3. **Downloads not working**
   - Verify product_files table has data
   - Check file paths in storage bucket
   - Ensure user has purchase record for paid products

## Support

For issues or questions, please open an issue on GitHub or contact support@littlefidan.nl