import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import {
  LayoutDashboard,
  Package,
  FolderOpen,
  Image,
  Star,
  PlayCircle,
  Images,
  Layout as LayoutIcon,
  Building2,
  LogOut
} from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Produtos', href: '/produtos', icon: Package },
  { name: 'Categorias', href: '/categorias', icon: FolderOpen },
  { name: 'Banners', href: '/banners', icon: Image },
  { name: 'Ofertas Semanais', href: '/ofertas', icon: Star },
  { name: 'Logística', href: '/carrossel', icon: PlayCircle },
  { name: 'Galeria de Imagens', href: '/galeria', icon: Images },
  { name: 'Seções da Empresa', href: '/secoes-empresa', icon: Building2 },
  { name: 'Banner de Serviços', href: '/banner-servicos', icon: LayoutIcon },
  { name: 'Imagens Abaixo do Banner', href: '/imagens-abaixo-banner', icon: Images },
];

const Layout = ({ children }: LayoutProps) => {
  const { signOut, user } = useAuth();
  const location = useLocation();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg">
        <div className="flex h-16 items-center justify-center border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">Admin - Azul Grupo Soares</h1>
        </div>
        
        <nav className="mt-5 px-2">
          <ul className="space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      isActive
                        ? 'bg-primary text-white'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <item.icon
                      className={`mr-3 h-5 w-5 ${
                        isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-500'
                      }`}
                    />
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600 truncate">
              {user?.email}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="text-gray-500 hover:text-gray-700"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="pl-64">
        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;