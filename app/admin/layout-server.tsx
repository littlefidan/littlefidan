import { checkAdminAuth } from '@/lib/auth/admin-check'
import AdminLayoutClient from './layout-client'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Server-side admin check
  await checkAdminAuth()
  
  return <AdminLayoutClient>{children}</AdminLayoutClient>
}