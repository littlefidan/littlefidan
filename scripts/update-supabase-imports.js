const fs = require('fs');
const path = require('path');

// Function to update imports in a file
function updateFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Replace createServerComponentClient import
  if (content.includes("from '@supabase/auth-helpers-nextjs'")) {
    content = content.replace(
      /import\s*{\s*createServerComponentClient\s*}\s*from\s*['"]@supabase\/auth-helpers-nextjs['"]/g,
      "import { createServerClient } from '@supabase/ssr'"
    );
    modified = true;
  }

  // Replace createClientComponentClient import
  if (content.includes('createClientComponentClient')) {
    content = content.replace(
      /import\s*{\s*createClientComponentClient\s*}\s*from\s*['"]@supabase\/auth-helpers-nextjs['"]/g,
      "import { createBrowserClient } from '@supabase/ssr'"
    );
    content = content.replace(/createClientComponentClient/g, 'createBrowserClient');
    modified = true;
  }

  // Replace createServerComponentClient usage with proper async pattern
  if (content.includes('createServerComponentClient({ cookies })')) {
    // Skip if already updated
    if (!content.includes('await cookies()')) {
      const oldPattern = /const supabase = createServerComponentClient\({ cookies }\)/g;
      const newPattern = `const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          },
        },
      }
    )`;
      content = content.replace(oldPattern, newPattern);
      modified = true;
    }
  }

  // Replace createClientComponentClient() usage
  if (content.includes('createBrowserClient()')) {
    content = content.replace(
      /createBrowserClient\(\)/g,
      `createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )`
    );
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log(`Updated: ${filePath}`);
  }
}

// Files to update
const files = [
  'app/api/orders/route.ts',
  'app/api/webhooks/mollie/route.ts',
  'app/admin/products/page.tsx',
  'app/api/contact/route.ts',
  'app/admin/products/product-modal.tsx',
  'app/api/account/delete/route.ts',
  'app/api/orders/[id]/route.ts',
  'app/api/products/[id]/route.ts',
  'app/api/downloads/[id]/route.ts',
  'app/api/download/[id]/route.ts',
  'app/(public)/products/[slug]/page.tsx',
  'app/(public)/checkout/success/page.tsx',
  'app/(public)/category/[slug]/page.tsx',
  'app/api/search/route.ts',
  'app/(auth)/auth/confirm/page.tsx',
  'app/api/debug/profile/route.ts',
  'lib/auth/ensure-profile.ts',
  'app/(public)/instagram/page.tsx',
  'app/api/admin/upload/route.ts',
  'app/api/newsletter/route.ts',
  'app/admin/subscribers/page.tsx',
  'app/(public)/products/page.tsx',
  'app/api/products/route.ts',
  'app/(auth)/update-password/page.tsx',
  'app/(auth)/reset-password/page.tsx',
  'components/products/product-files.tsx',
  'components/admin/bundle-selector.tsx',
  'app/admin/settings/page.tsx',
  'app/admin/files/page.tsx',
  'app/admin/orders/page.tsx'
];

// Update all files
files.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  if (fs.existsSync(filePath)) {
    updateFile(filePath);
  } else {
    console.log(`File not found: ${filePath}`);
  }
});

console.log('Done updating Supabase imports!');