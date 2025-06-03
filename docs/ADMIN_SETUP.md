# LittleFidan Admin Setup Guide

## 🚀 Quick Setup

### 1. Database Setup
First, run the SQL script in your Supabase SQL Editor:

```bash
# Go to your Supabase dashboard
# Navigate to SQL Editor
# Create new query
# Copy & paste contents of: scripts/setup-admin-tables.sql
# Run the query
```

### 2. Make Yourself Admin

#### Option A: Using the Make Admin Page
```bash
# Start your dev server
npm run dev

# Visit: http://localhost:3000/make-admin
# Click "Maak mij Admin"
```

#### Option B: Using Supabase Dashboard
```sql
-- In Supabase SQL Editor
UPDATE profiles 
SET is_admin = true 
WHERE email = 'your-email@example.com';
```

### 3. Access Admin Panel
```bash
# Visit: http://localhost:3000/admin
```

## 📊 Admin Features

### Dashboard
- Total revenue tracking
- Order statistics  
- Product inventory
- Customer growth metrics
- Real-time charts

### AI Generator
- Generate coloring pages
- Create worksheets
- Educational materials
- Islamic content
- Save as products

### Products Management
- Add/Edit/Delete products
- Manage inventory
- Set pricing
- Upload images
- Bundle creation

### Orders Management
- View all orders
- Update order status
- Customer details
- Payment tracking

### Categories
- Create categories
- Organize products
- Parent/child structure

### Content Planning
- Year-round planning
- Islamic calendar
- Bundle planning
- Publishing schedule

## 🔒 Security Features

1. **Server-side Authentication**
   - All admin routes protected
   - Automatic redirect if not admin

2. **Row Level Security (RLS)**
   - Database-level protection
   - Admin-only operations secured

3. **API Protection**
   - All admin APIs check permissions
   - Rate limiting on AI generation

## 🛠️ Troubleshooting

### "Not authorized" error
```sql
-- Check if user exists and is admin
SELECT * FROM profiles WHERE email = 'your-email@example.com';

-- If is_admin is false, update it:
UPDATE profiles SET is_admin = true WHERE email = 'your-email@example.com';
```

### Products not showing
```sql
-- Check if products table has required columns
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'products';

-- If missing columns, run setup script again
```

### Cannot upload images
```sql
-- Create storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('products', 'products', true);

-- Set storage policies
CREATE POLICY "Public can view product images"
ON storage.objects FOR SELECT
USING (bucket_id = 'products');

CREATE POLICY "Admins can upload product images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'products' AND auth.uid() IN (
  SELECT id FROM profiles WHERE is_admin = true
));
```

### Orders page error
```sql
-- Ensure orders table has all columns
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS order_number text,
ADD COLUMN IF NOT EXISTS customer_name text,
ADD COLUMN IF NOT EXISTS payment_status text DEFAULT 'pending';
```

## 📱 Mobile Admin Access

The admin panel is fully responsive:
- Sidebar collapses on mobile
- Touch-friendly controls
- Optimized tables for small screens

## 🎨 Customization

### Adding Menu Items
Edit `/app/admin/layout-client.tsx`:

```typescript
const menuItems = [
  // ... existing items
  { name: 'New Feature', href: '/admin/new-feature', icon: IconName },
]
```

### Custom Colors
The admin uses LittleFidan brand colors:
- Amber/Rose gradient for headers
- Gray-based UI for clarity
- Status colors for feedback

## 🚦 Status Indicators

- **Green**: Active/Success
- **Yellow**: Pending/Warning  
- **Red**: Error/Out of stock
- **Gray**: Draft/Inactive

## 📈 Best Practices

1. **Regular Backups**
   - Export data weekly
   - Save AI generated content

2. **Monitor Usage**
   - Check AI generation limits
   - Track storage usage

3. **Security**
   - Rotate API keys regularly
   - Review admin access monthly

## 🆘 Need Help?

1. Check browser console for errors
2. Review Supabase logs
3. Ensure all migrations ran
4. Verify environment variables

For issues, create an issue on GitHub with:
- Error message
- Browser console screenshot
- Steps to reproduce