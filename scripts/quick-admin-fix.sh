#!/bin/bash

echo "🔧 LittleFidan Admin Panel Quick Fix"
echo "===================================="
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "❌ Error: .env.local file not found!"
    echo "Please create .env.local with your Supabase credentials first."
    exit 1
fi

echo "📋 Instructions:"
echo ""
echo "1. First, run this SQL in your Supabase SQL Editor:"
echo "   Copy everything from: scripts/setup-admin-tables.sql"
echo ""
echo "2. Then make yourself an admin by running:"
echo "   node scripts/make-admin.js your-email@example.com"
echo ""
echo "3. Start the dev server:"
echo "   npm run dev"
echo ""
echo "4. Visit http://localhost:3000/admin"
echo ""
echo "✅ That's it! Your admin panel should now be working."
echo ""
echo "If you still have issues, check docs/ADMIN_SETUP.md for troubleshooting."