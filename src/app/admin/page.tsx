import { Metadata } from 'next';
import AdminDashboard from '@/components/admin/AdminDashboard';

export const metadata: Metadata = {
  title: 'Administration | SCORBIO',
  description: 'Tableau de bord administratif SCORBIO',
};

export default function AdminPage() {
  return <AdminDashboard />;
}
