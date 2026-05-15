import { Metadata } from 'next';
import AffiliateDashboard from '@/components/affiliate/AffiliateDashboard';

export const metadata: Metadata = {
  title: 'Programme d\'affiliation | SCORBIO',
  description: 'Rejoignez le programme d\'affiliation SCORBIO et gagnez des commissions sur chaque vente.',
};

export default function AffiliePage() {
  return <AffiliateDashboard />;
}
