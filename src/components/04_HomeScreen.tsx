import { useEffect, useState } from "react";
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
  Clock,
  Star,
  Users,
  DollarSign,
  Activity,
  Lightbulb,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface HomeScreenProps {
  onAddProduct: () => void;
  onNavigate: (screen: string) => void;
  refreshKey?: number | string;
}

interface ActivityItem {
  id: string;
  action: string;
  item: string;
  timestamp: string;
  type: 'added' | 'sold' | 'viewed' | 'liked';
}

interface Tip {
  id: string;
  title: string;
  description: string;
  category: string;
}

export function HomeScreen({ onAddProduct, onNavigate, refreshKey }: HomeScreenProps) {

  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [artisanName, setArtisanName] = useState<string>("");
  const [artisanInitials, setArtisanInitials] = useState<string>("");
  const [products, setProducts] = useState<Array<{id: string, title: string, image: string, description: string, backstory?: string}>>([]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    let email = "";
    if (storedUser) {
      const user = JSON.parse(storedUser);
      email = user.email || "";
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
    if (email) {
      fetch(`http://localhost:8000/api/v1/?email=${email}`)
        .then(res => res.json())
        .then(data => {
          setProducts(data);
        })
        .catch(err => {
          console.error("Failed to fetch products:", err);
        });
    }
  }, [refreshKey]);

  // Optionally, you can add stats based on products.length, etc.

  // Remove placeholder recentActivity

  const tips: Tip[] = [
    {
      id: '1',
      title: 'Optimize Your Product Photos',
      description: 'Use natural lighting and show multiple angles. Products with 3+ photos get 40% more views.',
      category: 'Photography'
    },
    {
      id: '2',
      title: 'Write Compelling Descriptions',
      description: 'Include the story behind your piece, materials used, and dimensions. Personal stories increase engagement by 60%.',
      category: 'Writing'
    },
    {
      id: '3',
      title: 'Price Competitively',
      description: 'Research similar items in your category. Consider your time, materials, and skill level when pricing.',
      category: 'Pricing'
    },
    {
      id: '4',
      title: 'Use Relevant Keywords',
      description: 'Include terms customers search for: "handmade", "artisan", "custom", and material names.',
      category: 'SEO'
    },
    {
      id: '5',
      title: 'Respond to Inquiries Quickly',
      description: 'Fast responses increase sales probability by 50%. Aim to reply within 24 hours.',
      category: 'Customer Service'
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'added': return <Plus className="w-4 h-4 text-green-600" />;
      case 'sold': return <ShoppingCart className="w-4 h-4 text-primary" />;
      case 'viewed': return <Eye className="w-4 h-4 text-blue-600" />;
      case 'liked': return <Heart className="w-4 h-4 text-red-500" />;
      default: return <Activity className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'added': return 'bg-green-50 border-green-200';
      case 'sold': return 'bg-purple-50 border-purple-200';
      case 'viewed': return 'bg-blue-50 border-blue-200';
      case 'liked': return 'bg-red-50 border-red-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const nextTip = () => {
    setCurrentTipIndex((prev) => (prev + 1) % tips.length);
  };

  const prevTip = () => {
    setCurrentTipIndex((prev) => (prev - 1 + tips.length) % tips.length);
  };

  const menuItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'products', label: 'My Products', icon: Package },
    { id: 'add-product', label: 'Add New Product', icon: Plus },
    { id: 'analytics', label: 'Insights & Analytics', icon: BarChart3 },
    { id: 'community', label: 'Community', icon: Users },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const handleMenuClick = (menuId: string) => {
    if (menuId === 'add-product') {
      onAddProduct();
    } else {
      onNavigate(menuId);
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
                const isActive = item.id === 'home';
                return (
                  <button
                    key={item.id}
                    onClick={() => handleMenuClick(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      isActive
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
        <div className="flex-1 p-6 flex flex-col min-h-screen">
          {/* Greeting */}
          <div className="mb-8">
            <h1 className="text-3xl mb-2">Welcome back, {artisanName}! 👋</h1>
            <p className="text-muted-foreground">
              Here's your artisan dashboard overview for today.
            </p>
          </div>

          {/* Main two-column section */}
          <div className="flex flex-1 gap-8">
            {/* Products Section - left */}
            <div className="flex-1 space-y-6">
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
                {products.length === 0 ? (
                  <p className="text-muted-foreground">No products found. Add your first product!</p>
                ) : (
                  products.map((product) => (
                    <Card key={product.id} className="shadow-sm hover:shadow-md transition-shadow">
                      <div className="relative">
                        <ImageWithFallback
                          src={product.image}
                          alt={product.title}
                          className="w-full h-48 object-cover rounded-t-lg"
                        />
                      </div>
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div>
                            <h3 className="font-semibold">{product.title}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {product.description}
                            </p>
                            {product.backstory && (
                              <p className="text-xs text-muted-foreground mt-2">{product.backstory}</p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>

            {/* Tips for Artisans - right */}
            <div className="w-full max-w-md space-y-6">
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-secondary" />
                    Tips for Artisans
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <div className="bg-gradient-to-br from-secondary/10 to-primary/10 p-6 rounded-lg">
                      <div className="flex items-start justify-between mb-4">
                        <Badge variant="secondary" className="mb-2">
                          {tips[currentTipIndex].category}
                        </Badge>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={prevTip}
                            className="w-8 h-8 p-0"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={nextTip}
                            className="w-8 h-8 p-0"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <h4 className="font-semibold mb-2">{tips[currentTipIndex].title}</h4>
                      <p className="text-sm text-muted-foreground">{tips[currentTipIndex].description}</p>
                    </div>
                    {/* Tip Indicators */}
                    <div className="flex justify-center gap-2 mt-4">
                      {tips.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentTipIndex(index)}
                          className={`w-2 h-2 rounded-full transition-colors ${
                            index === currentTipIndex ? 'bg-primary' : 'bg-muted'
                          }`}
                          title={`Go to tip ${index + 1}`}
                          aria-label={`Go to tip ${index + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* CTA Section at the very bottom */}
          <div className="w-full mt-12">
            <Card className="border-2 border-dashed border-primary/30 bg-primary/5">
              <CardContent className="p-8 text-center">
                <div className="space-y-4">
                  <div className="text-4xl">✨</div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Ready to add your next masterpiece?</h3>
                    <p className="text-muted-foreground">
                      Let our AI help you create compelling listings that showcase your craftsmanship.
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