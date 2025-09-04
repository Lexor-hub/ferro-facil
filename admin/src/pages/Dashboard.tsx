import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Package, FolderOpen, Image, Star } from 'lucide-react';

interface Stats {
  totalProducts: number;
  activeProducts: number;
  totalCategories: number;
  activeBanners: number;
  activeOffers: number;
}

const Dashboard = () => {
  const [stats, setStats] = useState<Stats>({
    totalProducts: 0,
    activeProducts: 0,
    totalCategories: 0,
    activeBanners: 0,
    activeOffers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [
        { count: totalProducts },
        { count: activeProducts },
        { count: totalCategories },
        { count: activeBanners },
        { count: activeOffers },
      ] = await Promise.all([
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('products').select('*', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('categories').select('*', { count: 'exact', head: true }),
        supabase.from('banners').select('*', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('weekly_specials').select('*', { count: 'exact', head: true }).eq('is_active', true),
      ]);

      setStats({
        totalProducts: totalProducts || 0,
        activeProducts: activeProducts || 0,
        totalCategories: totalCategories || 0,
        activeBanners: activeBanners || 0,
        activeOffers: activeOffers || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total de Produtos',
      value: stats.totalProducts,
      icon: Package,
      color: 'text-blue-600',
    },
    {
      title: 'Produtos Ativos',
      value: stats.activeProducts,
      icon: Package,
      color: 'text-green-600',
    },
    {
      title: 'Categorias',
      value: stats.totalCategories,
      icon: FolderOpen,
      color: 'text-purple-600',
    },
    {
      title: 'Banners Ativos',
      value: stats.activeBanners,
      icon: Image,
      color: 'text-orange-600',
    },
    {
      title: 'Ofertas Ativas',
      value: stats.activeOffers,
      icon: Star,
      color: 'text-yellow-600',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Visão geral do sistema</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {statCards.map((card, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;