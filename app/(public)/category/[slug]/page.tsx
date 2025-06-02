import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import ProductCard from '@/components/product-card'
import { ChevronRightIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  icon: string | null
}

interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  original_price: number | null
  images: string[]
  category: string
  product_type: string
  access_type: string
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const supabase = createServerComponentClient({ cookies })
  
  const { data: category } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', params.slug)
    .single()

  if (!category) {
    return {
      title: 'Categorie niet gevonden',
    }
  }

  return {
    title: `${category.name} - LittleFidan`,
    description: category.description || `Bekijk alle ${category.name} producten bij LittleFidan`,
  }
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const supabase = createServerComponentClient({ cookies })

  // Fetch category
  const { data: category, error: categoryError } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', params.slug)
    .single()

  if (categoryError || !category) {
    notFound()
  }

  // Fetch products in this category
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('*')
    .eq('category', category.slug)
    .eq('status', 'active')
    .order('created_at', { ascending: false })

  if (productsError) {
    console.error('Error fetching products:', productsError)
  }

  const productList = products || []

  return (
    <div className="min-h-screen bg-gradient-to-b from-mint-50 to-neutral-light">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex items-center space-x-2 text-sm">
          <Link href="/" className="text-neutral-medium hover:text-primary">
            Home
          </Link>
          <ChevronRightIcon className="h-4 w-4 text-neutral-medium" />
          <Link href="/products" className="text-neutral-medium hover:text-primary">
            Producten
          </Link>
          <ChevronRightIcon className="h-4 w-4 text-neutral-medium" />
          <span className="text-primary font-medium">{category.name}</span>
        </nav>
      </div>

      {/* Category Header */}
      <div className="bg-white shadow-sm border-b border-neutral-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            {category.icon && (
              <div className="text-6xl mb-4">{category.icon}</div>
            )}
            <h1 className="text-4xl font-serif text-primary mb-4">{category.name}</h1>
            {category.description && (
              <p className="text-lg text-neutral-medium max-w-2xl mx-auto">
                {category.description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {productList.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-neutral-medium">
              Er zijn momenteel geen producten in deze categorie.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center mt-4 text-primary hover:text-primary-dark"
            >
              Bekijk alle producten
              <ChevronRightIcon className="ml-1 h-4 w-4" />
            </Link>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-8">
              <p className="text-neutral-medium">
                {productList.length} {productList.length === 1 ? 'product' : 'producten'} gevonden
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {productList.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Related Categories */}
      <div className="bg-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-2xl font-serif text-primary mb-8">Andere Categorieën</h2>
          <CategoryList currentSlug={category.slug} />
        </div>
      </div>
    </div>
  )
}

async function CategoryList({ currentSlug }: { currentSlug: string }) {
  const supabase = createServerComponentClient({ cookies })
  
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .neq('slug', currentSlug)
    .order('sort_order', { ascending: true })

  if (!categories || categories.length === 0) {
    return null
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {categories.map((cat) => (
        <Link
          key={cat.id}
          href={`/category/${cat.slug}`}
          className="group text-center p-6 rounded-2xl bg-neutral-light hover:bg-mint-50 transition-all"
        >
          {cat.icon && (
            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
              {cat.icon}
            </div>
          )}
          <h3 className="font-medium text-primary group-hover:text-primary-dark">
            {cat.name}
          </h3>
        </Link>
      ))}
    </div>
  )
}