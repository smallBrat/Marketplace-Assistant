import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { 
  Home,
  Package,
  Plus,
  BarChart3,
  Settings,
  Eye,
  Heart,
  ShoppingCart,
  TrendingUp,
  Edit,
  Star,
  Users,
  DollarSign,
  Activity
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface DashboardScreenProps {
  onAddProduct: () => void;
}

interface ProductCard {
  id: string;
  title: string;
  image: string;
  description: string;
  views: number;
  likes: number;
  status: 'active' | 'draft' | 'sold';
  price: string;
}

export function DashboardScreen({ onAddProduct }: DashboardScreenProps) {
  const [activeMenuItem, setActiveMenuItem] = useState('home');
  
  const [artisanName, setArtisanName] = useState("");
  const [artisanInitials, setArtisanInitials] = useState("");

  useEffect(() => {
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    const user = JSON.parse(storedUser);

    if (user.full_name) {
      setArtisanName(user.full_name);

      const initials = user.full_name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase();
      setArtisanInitials(initials);
    }
  }
}, []);


  const stats = [
    {
      title: 'Products Listed',
      value: '12',
      change: '+2 this month',
      icon: Package,
      color: 'text-primary'
    },
    {
      title: 'Total Views',
      value: '3,247',
      change: '+18% from last month',
      icon: Eye,
      color: 'text-blue-600'
    },
    {
      title: 'Sales This Month',
      value: '$1,284',
      change: '+12% from last month',
      icon: DollarSign,
      color: 'text-green-600'
    },
    {
      title: 'Engagement Score',
      value: '94%',
      change: '+5% improvement',
      icon: Activity,
      color: 'text-secondary'
    }
  ];

  const products: ProductCard[] = [
    {
      id: '1',
      title: 'Handcrafted Ceramic Bowl',
      image: 'https://images.unsplash.com/photo-1695740633675-d060b607f5c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYW5kbWFkZSUyMGNlcmFtaWMlMjBwb3R0ZXJ5fGVufDF8fHx8MTc1NjYxMzg5Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      description: 'Beautiful glazed ceramic bowl perfect for serving or decoration.',
      views: 324,
      likes: 47,
      status: 'active',
      price: '$45'
    },
    {
      id: '2',
      title: 'Sterling Silver Pendant',
      image: 'https://images.unsplash.com/photo-1715374033196-0ff662284a7e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYW5kbWFkZSUyMGpld2VscnklMjBjcmFmdHN8ZW58MXx8fHwxNzU2NjEzODk5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      description: 'Elegant handmade silver pendant with intricate detailing.',
      views: 187,
      likes: 23,
      status: 'active',
      price: '$89'
    },
    {
      id: '3',
      title: 'Wooden Cutting Board',
      image: 'https://images.unsplash.com/photo-1661873482206-4e2fa0ba455d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b29kZW4lMjBjcmFmdCUyMGhhbmRtYWRlfGVufDF8fHx8MTc1NjYxMzkwM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      description: 'Premium walnut cutting board with unique grain pattern.',
      views: 156,
      likes: 31,
      status: 'active',
      price: '$78'
    },
    {
      id: '4',
      title: 'Macrame Wall Hanging',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
      description: 'Boho-style macrame wall art, handwoven with natural cotton.',
      views: 203,
      likes: 35,
      status: 'draft',
      price: '$62'
    }
  ];

  const menuItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'products', label: 'My Products', icon: Package },
    { id: 'add-product', label: 'Add New Product', icon: Plus },
    { id: 'analytics', label: 'Insights & Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const handleMenuClick = (menuId: string) => {
    if (menuId === 'add-product') {
      onAddProduct();
    } else {
      setActiveMenuItem(menuId);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'sold': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Live';
      case 'draft': return 'Draft';
      case 'sold': return 'Sold';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-pastel-blue)' }}>
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg min-h-screen">
          <div className="p-6">
            {/* Logo/Brand */}
            <div className="flex items-center gap-3 mb-8">
              <div className="text-2xl">🎨</div>
              <div>
                <h2 className="font-semibold">Artisan Hub</h2>
                <p className="text-sm text-muted-foreground">Dashboard</p>
              </div>
            </div>

            {/* User Profile */}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 mb-6">
              <Avatar>
                <AvatarImage src="" />
                <AvatarFallback className="bg-primary text-white">{artisanInitials}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{artisanName}</p>
                <p className="text-sm text-muted-foreground">Pottery Artist</p>
              </div>
            </div>

            {/* Navigation Menu */}
            <nav className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleMenuClick(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeMenuItem === item.id
                        ? 'bg-primary text-white'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Greeting */}
          <div className="mb-8">
            <h1 className="text-3xl mb-2">Welcome back, {artisanName}! 👋</h1>
            <p className="text-muted-foreground">
              Here's what's happening with your artisan business today.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index} className="shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                        <p className="text-2xl font-semibold">{stat.value}</p>
                        <p className="text-xs text-green-600 mt-1">{stat.change}</p>
                      </div>
                      <div className={`p-3 rounded-full bg-muted ${stat.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Products Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold mb-2">Your Products</h2>
                <p className="text-muted-foreground">Manage your product listings and track performance</p>
              </div>
              <Button
                onClick={onAddProduct}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add New Product
              </Button>
            </div>

            {/* Product Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <Card key={product.id} className="shadow-sm hover:shadow-md transition-shadow">
                  <div className="relative">
                    <ImageWithFallback
                      src={product.image}
                      alt={product.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <Badge 
                      className={`absolute top-3 right-3 ${getStatusColor(product.status)}`}
                    >
                      {getStatusLabel(product.status)}
                    </Badge>
                  </div>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-semibold">{product.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {product.description}
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Eye className="w-4 h-4 text-muted-foreground" />
                            <span>{product.views}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Heart className="w-4 h-4 text-muted-foreground" />
                            <span>{product.likes}</span>
                          </div>
                        </div>
                        <span className="font-semibold text-primary">{product.price}</span>
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full flex items-center gap-2"
                      >
                        <Edit className="w-4 h-4" />
                        Edit Product
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* CTA Section */}
            <Card className="border-2 border-dashed border-primary/30 bg-primary/5">
              <CardContent className="p-8 text-center">
                <div className="space-y-4">
                  <div className="text-4xl">✨</div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Ready to showcase your next creation?</h3>
                    <p className="text-muted-foreground">
                      Use our AI-powered tools to create compelling product listings that sell.
                    </p>
                  </div>
                  <Button
                    size="lg"
                    onClick={onAddProduct}
                    className="px-8 py-4"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Add New Product
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}