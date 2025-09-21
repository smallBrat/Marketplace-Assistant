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
  TrendingUp,
  TrendingDown,
  Eye,
  Heart,
  ShoppingCart,
  DollarSign,
  Users,
  Calendar,
  Target,
  Lightbulb,
  Star,
  Activity,
  ShoppingBag
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface InsightsScreenProps {
  onAddProduct: () => void;
  onNavigate: (screen: string) => void;
}

interface ViewsData {
  date: string;
  views: number;
  name: string;
}

interface SalesData {
  product: string;
  sales: number;
  revenue: number;
}

interface EngagementItem {
  id: string;
  title: string;
  metric: string;
  value: string;
  trend: 'up' | 'down' | 'stable';
  recommendation: string;
}

export function InsightsScreen({ onAddProduct, onNavigate }: InsightsScreenProps) {
  const [artisanName, setArtisanName] = useState<string>("");
const [artisanInitials, setArtisanInitials] = useState<string>("");

// fetch artisan data from backend using email in localStorage  
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


  const summaryStats = [
    {
      title: 'Monthly Views',
      value: '2,847',
      change: '+18.2%',
      trend: 'up' as const,
      icon: Eye,
      color: 'text-blue-600'
    },
    {
      title: 'Total Sales',
      value: '$3,421',
      change: '+12.5%',
      trend: 'up' as const,
      icon: DollarSign,
      color: 'text-green-600'
    },
    {
      title: 'Top Product',
      value: 'Ceramic Bowl',
      change: '324 views',
      trend: 'stable' as const,
      icon: Star,
      color: 'text-secondary'
    },
    {
      title: 'Conversion Rate',
      value: '4.2%',
      change: '-2.1%',
      trend: 'down' as const,
      icon: Target,
      color: 'text-red-600'
    }
  ];

  const viewsData: ViewsData[] = [
    { date: '2024-01-01', views: 45, name: 'Jan 1' },
    { date: '2024-01-03', views: 52, name: 'Jan 3' },
    { date: '2024-01-05', views: 78, name: 'Jan 5' },
    { date: '2024-01-07', views: 65, name: 'Jan 7' },
    { date: '2024-01-09', views: 89, name: 'Jan 9' },
    { date: '2024-01-11', views: 95, name: 'Jan 11' },
    { date: '2024-01-13', views: 112, name: 'Jan 13' },
    { date: '2024-01-15', views: 134, name: 'Jan 15' },
    { date: '2024-01-17', views: 98, name: 'Jan 17' },
    { date: '2024-01-19', views: 145, name: 'Jan 19' },
    { date: '2024-01-21', views: 167, name: 'Jan 21' },
    { date: '2024-01-23', views: 189, name: 'Jan 23' },
    { date: '2024-01-25', views: 156, name: 'Jan 25' },
    { date: '2024-01-27', views: 178, name: 'Jan 27' },
    { date: '2024-01-29', views: 203, name: 'Jan 29' },
    { date: '2024-01-31', views: 234, name: 'Jan 31' }
  ];

  const salesData: SalesData[] = [
    { product: 'Ceramic Bowl', sales: 8, revenue: 360 },
    { product: 'Silver Pendant', sales: 5, revenue: 445 },
    { product: 'Cutting Board', sales: 3, revenue: 234 },
    { product: 'Macrame Art', sales: 4, revenue: 248 },
    { product: 'Coffee Mugs', sales: 6, revenue: 312 },
    { product: 'Copper Bracelet', sales: 7, revenue: 238 }
  ];

  const engagementHighlights: EngagementItem[] = [
    {
      id: '1',
      title: 'Best Performing Product',
      metric: 'Ceramic Bowl',
      value: '324 views, 47 likes',
      trend: 'up',
      recommendation: 'Create similar pottery pieces to capitalize on this success.'
    },
    {
      id: '2',
      title: 'Pricing Sweet Spot',
      metric: '$45-$89 range',
      value: '68% of sales',
      trend: 'stable',
      recommendation: 'Consider pricing new items in this successful range.'
    },
    {
      id: '3',
      title: 'Engagement Peak',
      metric: 'Weekend uploads',
      value: '40% more views',
      trend: 'up',
      recommendation: 'Schedule new product launches for Saturday/Sunday.'
    },
    {
      id: '4',
      title: 'Photography Impact',
      metric: 'Natural lighting',
      value: '2.3x more likes',
      trend: 'up',
      recommendation: 'Continue using natural light for all product photos.'
    }
  ];

  const menuItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'products', label: 'My Products', icon: Package },
    { id: 'add-product', label: 'Add New Product', icon: Plus },
    { id: 'analytics', label: 'Insights & Analytics', icon: BarChart3 },
    { id: 'community', label: 'Community', icon: Users },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const handleMenuClick = (menuId: string) => {
    if (menuId === 'add-product') {
      onAddProduct();
    } else {
      onNavigate(menuId);
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-600" />;
      default: return <Activity className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-pastel-yellow)' }}>
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
                const isActive = item.id === 'analytics';
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
        <div className="flex-1 p-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl mb-2">Product Insights & Analytics</h1>
            <p className="text-muted-foreground">
              Track your performance and discover opportunities to grow your craft business.
            </p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {summaryStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index} className="shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                        <p className="text-2xl font-semibold">{stat.value}</p>
                        <div className={`flex items-center gap-1 mt-1 ${getTrendColor(stat.trend)}`}>
                          {getTrendIcon(stat.trend)}
                          <span className="text-xs">{stat.change}</span>
                        </div>
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

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Views Over Time Chart */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5 text-blue-600" />
                  Views Over Time (Last 30 Days)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={viewsData}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis 
                        dataKey="name" 
                        fontSize={12}
                        tick={{ fill: 'var(--color-muted-foreground)' }}
                      />
                      <YAxis 
                        fontSize={12}
                        tick={{ fill: 'var(--color-muted-foreground)' }}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'var(--color-card)',
                          border: '1px solid var(--color-border)',
                          borderRadius: '8px'
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="views" 
                        stroke="var(--color-primary)" 
                        strokeWidth={2}
                        dot={{ fill: 'var(--color-primary)', strokeWidth: 2 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Sales by Product Chart */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-green-600" />
                  Sales by Product
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={salesData}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis 
                        dataKey="product" 
                        fontSize={12}
                        tick={{ fill: 'var(--color-muted-foreground)' }}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis 
                        fontSize={12}
                        tick={{ fill: 'var(--color-muted-foreground)' }}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'var(--color-card)',
                          border: '1px solid var(--color-border)',
                          borderRadius: '8px'
                        }}
                        formatter={(value, name) => [value, name === 'sales' ? 'Units Sold' : 'Revenue ($)']}
                      />
                      <Bar dataKey="sales" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Engagement Highlights */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-secondary" />
                AI-Driven Engagement Highlights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {engagementHighlights.map((item) => (
                  <div key={item.id} className="bg-gradient-to-br from-primary/5 to-secondary/5 p-4 rounded-lg border">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-sm">{item.title}</h4>
                        <p className="text-primary font-medium">{item.metric}</p>
                      </div>
                      {getTrendIcon(item.trend)}
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{item.value}</p>
                    <div className="bg-white p-3 rounded border-l-4 border-l-secondary">
                      <p className="text-sm">
                        <span className="font-medium text-secondary">💡 Recommendation:</span> {item.recommendation}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Performance Summary */}
          <Card className="mt-8 border-2 border-dashed border-primary/30 bg-primary/5">
            <CardContent className="p-8 text-center">
              <div className="space-y-4">
                <div className="text-4xl">📊</div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Ready to boost your performance?</h3>
                  <p className="text-muted-foreground">
                    Based on your analytics, adding more pottery pieces could increase your sales by 25%.
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
  );
}