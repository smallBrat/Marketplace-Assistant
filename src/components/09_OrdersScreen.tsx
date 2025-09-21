import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { 
  Home,
  Package,
  Plus,
  BarChart3,
  Settings,
  Users,
  ShoppingBag,
  Search,
  Filter,
  Eye,
  Edit,
  Truck,
  Clock,
  CheckCircle,
  AlertCircle,
  DollarSign,
  Calendar,
  User,
  Package2
} from 'lucide-react';

interface OrdersScreenProps {
  onAddProduct: () => void;
  onNavigate: (screen: string) => void;
}

interface Order {
  id: string;
  orderId: string;
  productName: string;
  productImage: string;
  buyerName: string;
  buyerEmail: string;
  quantity: number;
  price: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  orderDate: string;
  shippingAddress: string;
  estimatedDelivery?: string;
}

export function OrdersScreen({ onAddProduct, onNavigate }: OrdersScreenProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
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


  const orders: Order[] = [
    {
      id: '1',
      orderId: 'ORD-2024-001',
      productName: 'Handcrafted Ceramic Bowl',
      productImage: 'https://images.unsplash.com/photo-1695740633675-d060b607f5c4?w=400&h=400&fit=crop',
      buyerName: 'Jennifer Wilson',
      buyerEmail: 'jennifer.wilson@email.com',
      quantity: 2,
      price: 45,
      total: 90,
      status: 'shipped',
      orderDate: '2024-01-15',
      shippingAddress: '123 Oak Street, Portland, OR 97201',
      estimatedDelivery: '2024-01-20'
    },
    {
      id: '2',
      orderId: 'ORD-2024-002',
      productName: 'Sterling Silver Pendant',
      productImage: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=400&h=400&fit=crop',
      buyerName: 'Michael Brown',
      buyerEmail: 'michael.brown@email.com',
      quantity: 1,
      price: 89,
      total: 89,
      status: 'pending',
      orderDate: '2024-01-18',
      shippingAddress: '456 Pine Avenue, Seattle, WA 98101'
    },
    {
      id: '3',
      orderId: 'ORD-2024-003',
      productName: 'Ceramic Coffee Mug Set',
      productImage: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=400&fit=crop',
      buyerName: 'Sarah Davis',
      buyerEmail: 'sarah.davis@email.com',
      quantity: 1,
      price: 52,
      total: 52,
      status: 'delivered',
      orderDate: '2024-01-10',
      shippingAddress: '789 Maple Drive, Denver, CO 80202'
    },
    {
      id: '4',
      orderId: 'ORD-2024-004',
      productName: 'Macrame Wall Hanging',
      productImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
      buyerName: 'David Kim',
      buyerEmail: 'david.kim@email.com',
      quantity: 1,
      price: 62,
      total: 62,
      status: 'processing',
      orderDate: '2024-01-16',
      shippingAddress: '321 Cedar Lane, Austin, TX 73301'
    },
    {
      id: '5',
      orderId: 'ORD-2024-005',
      productName: 'Hand-forged Copper Bracelet',
      productImage: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=400&h=400&fit=crop',
      buyerName: 'Lisa Johnson',
      buyerEmail: 'lisa.johnson@email.com',
      quantity: 3,
      price: 34,
      total: 102,
      status: 'pending',
      orderDate: '2024-01-19',
      shippingAddress: '654 Birch Street, San Francisco, CA 94102'
    },
    {
      id: '6',
      orderId: 'ORD-2024-006',
      productName: 'Woven Basket Set',
      productImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',
      buyerName: 'Robert Taylor',
      buyerEmail: 'robert.taylor@email.com',
      quantity: 1,
      price: 95,
      total: 95,
      status: 'shipped',
      orderDate: '2024-01-12',
      shippingAddress: '987 Elm Road, Chicago, IL 60601',
      estimatedDelivery: '2024-01-22'
    }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Orders' },
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' }
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

  // Filter orders based on search and status
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.buyerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Pending
          </Badge>
        );
      case 'processing':
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800 flex items-center gap-1">
            <Package2 className="w-3 h-3" />
            Processing
          </Badge>
        );
      case 'shipped':
        return (
          <Badge variant="secondary" className="bg-purple-100 text-purple-800 flex items-center gap-1">
            <Truck className="w-3 h-3" />
            Shipped
          </Badge>
        );
      case 'delivered':
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800 flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            Delivered
          </Badge>
        );
      case 'cancelled':
        return (
          <Badge variant="secondary" className="bg-red-100 text-red-800 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            Cancelled
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleUpdateStatus = (orderId: string) => {
    alert(`Update status for order ${orderId} - This would open a status update modal`);
  };

  const handleViewDetails = (orderId: string) => {
    alert(`View details for order ${orderId} - This would open a detailed order view`);
  };

  // Calculate quick stats
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const completedOrders = orders.filter(o => o.status === 'delivered').length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

  const quickStats = [
    {
      title: 'Total Orders',
      value: totalOrders.toString(),
      icon: ShoppingBag,
      color: 'text-primary'
    },
    {
      title: 'Pending Orders',
      value: pendingOrders.toString(),
      icon: Clock,
      color: 'text-yellow-600'
    },
    {
      title: 'Completed Orders',
      value: completedOrders.toString(),
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      title: 'Total Revenue',
      value: `$${totalRevenue}`,
      icon: DollarSign,
      color: 'text-blue-600'
    }
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-pastel-pink)' }}>
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
                const isActive = item.id === 'orders';
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
        <div className="flex-1 flex">
          {/* Orders Table */}
          <div className="flex-1 p-6">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl mb-2">My Orders</h1>
              <p className="text-muted-foreground">
                Manage your order fulfillment and track customer purchases.
              </p>
            </div>

            {/* Search and Filter Controls */}
            <Card className="mb-6 shadow-sm">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        placeholder="Search orders, products, or customers..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 rounded-xl"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Filter className="w-4 h-4 text-muted-foreground" />
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-48 rounded-xl">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="mt-4 text-sm text-muted-foreground">
                  Showing {filteredOrders.length} of {orders.length} orders
                </div>
              </CardContent>
            </Card>

            {/* Orders Table */}
            <Card className="shadow-sm">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{order.orderId}</div>
                            {order.estimatedDelivery && (
                              <div className="text-xs text-muted-foreground flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                Est. {order.estimatedDelivery}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted">
                              <img
                                src={order.productImage}
                                alt={order.productName}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <div className="font-medium line-clamp-1">{order.productName}</div>
                              <div className="text-sm text-muted-foreground">${order.price} each</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{order.buyerName}</div>
                            <div className="text-sm text-muted-foreground">{order.buyerEmail}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="font-mono">
                            {order.quantity}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">${order.total}</div>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(order.status)}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">{order.orderDate}</div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewDetails(order.orderId)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUpdateStatus(order.orderId)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {filteredOrders.length === 0 && (
              <Card className="mt-6 p-8 text-center">
                <div className="space-y-4">
                  <div className="text-4xl">📦</div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">No orders found</h3>
                    <p className="text-muted-foreground">
                      {searchTerm || statusFilter !== 'all' 
                        ? 'Try adjusting your search or filter criteria.'
                        : 'You haven\'t received any orders yet.'}
                    </p>
                  </div>
                  <Button onClick={onAddProduct}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Product
                  </Button>
                </div>
              </Card>
            )}
          </div>

          {/* Right Sidebar - Quick Stats */}
          <div className="w-80 p-6 space-y-6">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {quickStats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full bg-white ${stat.color}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">{stat.title}</p>
                          <p className="font-semibold">{stat.value}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3 p-2 rounded border-l-4 border-l-green-500 bg-green-50">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <div>
                    <p className="text-sm font-medium">Order delivered</p>
                    <p className="text-xs text-muted-foreground">ORD-2024-003 to Sarah Davis</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2 rounded border-l-4 border-l-purple-500 bg-purple-50">
                  <Truck className="w-4 h-4 text-purple-600" />
                  <div>
                    <p className="text-sm font-medium">Order shipped</p>
                    <p className="text-xs text-muted-foreground">ORD-2024-001 to Jennifer Wilson</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2 rounded border-l-4 border-l-yellow-500 bg-yellow-50">
                  <Clock className="w-4 h-4 text-yellow-600" />
                  <div>
                    <p className="text-sm font-medium">New order received</p>
                    <p className="text-xs text-muted-foreground">ORD-2024-005 from Lisa Johnson</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Need Help */}
            <Card className="shadow-sm border-2 border-dashed border-primary/30 bg-primary/5">
              <CardContent className="p-6 text-center">
                <div className="space-y-3">
                  <div className="text-3xl">💡</div>
                  <div>
                    <h4 className="font-semibold mb-1">Need Help?</h4>
                    <p className="text-sm text-muted-foreground">
                      Learn best practices for order fulfillment and customer service.
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    View Guide
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