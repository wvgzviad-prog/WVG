import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/session.server';
import AdminDashboard from './AdminDashboard';

export default async function AdminPage() {
  try {
    const session = await requireAdmin();
    return <AdminDashboard username={session.username ?? 'admin'} />;
  } catch {
    redirect('/admin/login');
  }
}
