#!/bin/bash

echo "🚀 LittleFidan Admin Quick Setup"
echo "================================"
echo ""
echo "📋 Stap 1: Database Setup"
echo "1. Ga naar je Supabase dashboard"
echo "2. Open de SQL Editor"
echo "3. Kopieer de inhoud van scripts/setup-admin-tables.sql"
echo "4. Plak en run de query"
echo ""
echo "✅ Druk op Enter wanneer klaar..."
read

echo ""
echo "👤 Stap 2: Maak jezelf Admin"
echo "Wat is je email adres?"
read EMAIL

echo ""
echo "Kopieer deze SQL query naar Supabase SQL Editor:"
echo ""
echo "UPDATE profiles SET is_admin = true WHERE email = '$EMAIL';"
echo ""
echo "✅ Druk op Enter wanneer klaar..."
read

echo ""
echo "🎉 Setup Compleet!"
echo ""
echo "Je kunt nu inloggen op:"
echo "http://localhost:3000/admin"
echo ""
echo "Problemen? Check docs/ADMIN_SETUP.md"