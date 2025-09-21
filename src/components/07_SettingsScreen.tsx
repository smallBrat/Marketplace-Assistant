import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Home,
  Package,
  Plus,
  BarChart3,
  Settings,
  User,
  Bell,
  Shield,
  Save,
  Trash2,
  Camera,
  Mail,
  Phone,
  MapPin,
  Palette,
  Heart,
  AlertTriangle,
  Users,
  ShoppingBag
} from 'lucide-react';

interface SettingsScreenProps {
  onAddProduct: () => void;
  onNavigate: (screen: string) => void;
}

export function SettingsScreen({ onAddProduct, onNavigate }: SettingsScreenProps) {
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


  const [profileData, setProfileData] = useState({
    fullName: 'Sarah Martinez',
    email: 'sarah.martinez@email.com',
    phone: '+1 (555) 123-4567',
    city: 'Santa Fe',
    state: 'New Mexico',
    country: 'United States',
    craftCategory: 'pottery',
    bio: 'Passionate pottery artist with 8 years of experience creating functional and decorative ceramics. I draw inspiration from southwestern landscapes and traditional techniques passed down through generations.',
    inspiration: 'Nature, southwestern landscapes, and ancient pottery traditions',
    craftingStyle: 'Hand-thrown ceramics with glazes inspired by desert sunsets',
    materialsUsed: 'Stoneware clay, natural glazes, locally sourced materials',
    websiteUrl: 'https://sarahceramics.com',
    instagramHandle: '@sarahceramics'
  });

  const [notifications, setNotifications] = useState({
    emailMarketing: true,
    emailOrders: true,
    emailMessages: true,
    smsMarketing: false,
    smsOrders: true,
    smsMessages: false,
    browserNotifications: true
  });

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

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

  const handleProfileChange = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
    setHasUnsavedChanges(true);
  };

  const handleNotificationChange = (setting: string, enabled: boolean) => {
    setNotifications(prev => ({
      ...prev,
      [setting]: enabled
    }));
    setHasUnsavedChanges(true);
  };

  const handleSaveChanges = () => {
    // In a real app, this would save to the backend
    alert('Settings saved successfully!');
    setHasUnsavedChanges(false);
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      alert('Account deletion initiated. You will receive a confirmation email.');
    }
  };

  const handleChangePassword = () => {
    alert('Password change functionality would open a secure modal or redirect to a password change page.');
  };

  const craftCategories = [
    { value: 'pottery', label: 'Pottery' },
    { value: 'jewelry', label: 'Jewelry' },
    { value: 'textiles', label: 'Textiles' },
    { value: 'woodwork', label: 'Woodwork' },
    { value: 'metalwork', label: 'Metalwork' },
    { value: 'glasswork', label: 'Glasswork' },
    { value: 'leatherwork', label: 'Leatherwork' },
    { value: 'other', label: 'Other' }
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-pastel-mint)' }}>
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
                const isActive = item.id === 'settings';
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
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl mb-2">Account Settings</h1>
                <p className="text-muted-foreground">
                  Manage your profile, preferences, and account security.
                </p>
              </div>
              {hasUnsavedChanges && (
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                  Unsaved Changes
                </Badge>
              )}
            </div>
          </div>

          {/* Settings Tabs */}
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="personalization" className="flex items-center gap-2">
                <Heart className="w-4 h-4" />
                Personalization
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Bell className="w-4 h-4" />
                Notifications
              </TabsTrigger>
            </TabsList>

            {/* Profile Settings Tab */}
            <TabsContent value="profile" className="space-y-6">
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5 text-primary" />
                    Profile Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Profile Photo */}
                  <div className="flex items-center gap-4">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-primary text-white text-xl">{artisanInitials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <Button variant="outline" size="sm" className="flex items-center gap-2">
                        <Camera className="w-4 h-4" />
                        Change Photo
                      </Button>
                      <p className="text-xs text-muted-foreground mt-1">
                        JPG, PNG or GIF. Max size 5MB.
                      </p>
                    </div>
                  </div>

                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        value={profileData.fullName}
                        onChange={(e) => handleProfileChange('fullName', e.target.value)}
                        className="rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) => handleProfileChange('email', e.target.value)}
                        className="rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={profileData.phone}
                        onChange={(e) => handleProfileChange('phone', e.target.value)}
                        className="rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="craftCategory">Primary Craft Category</Label>
                      <Select 
                        value={profileData.craftCategory} 
                        onValueChange={(value) => handleProfileChange('craftCategory', value)}
                      >
                        <SelectTrigger className="rounded-xl">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {craftCategories.map((category) => (
                            <SelectItem key={category.value} value={category.value}>
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="space-y-4">
                    <Label className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Location
                    </Label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Input
                        placeholder="City"
                        value={profileData.city}
                        onChange={(e) => handleProfileChange('city', e.target.value)}
                        className="rounded-xl"
                      />
                      <Input
                        placeholder="State/Province"
                        value={profileData.state}
                        onChange={(e) => handleProfileChange('state', e.target.value)}
                        className="rounded-xl"
                      />
                      <Input
                        placeholder="Country"
                        value={profileData.country}
                        onChange={(e) => handleProfileChange('country', e.target.value)}
                        className="rounded-xl"
                      />
                    </div>
                  </div>

                  {/* Bio */}
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={profileData.bio}
                      onChange={(e) => handleProfileChange('bio', e.target.value)}
                      placeholder="Tell your story as an artisan..."
                      className="rounded-xl min-h-[100px]"
                    />
                  </div>

                  {/* Social Links */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="website">Website URL</Label>
                      <Input
                        id="website"
                        value={profileData.websiteUrl}
                        onChange={(e) => handleProfileChange('websiteUrl', e.target.value)}
                        placeholder="https://yourwebsite.com"
                        className="rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="instagram">Instagram Handle</Label>
                      <Input
                        id="instagram"
                        value={profileData.instagramHandle}
                        onChange={(e) => handleProfileChange('instagramHandle', e.target.value)}
                        placeholder="@yourusername"
                        className="rounded-xl"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Security Section */}
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-primary" />
                    Security
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Password</h4>
                        <p className="text-sm text-muted-foreground">Last updated 3 months ago</p>
                      </div>
                      <Button variant="outline" onClick={handleChangePassword}>
                        Change Password
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Personalization Tab */}
            <TabsContent value="personalization" className="space-y-6">
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="w-5 h-5 text-primary" />
                    Craft Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="inspiration">Inspiration</Label>
                    <Textarea
                      id="inspiration"
                      value={profileData.inspiration}
                      onChange={(e) => handleProfileChange('inspiration', e.target.value)}
                      placeholder="What inspires your work?"
                      className="rounded-xl"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="craftingStyle">Crafting Style</Label>
                    <Textarea
                      id="craftingStyle"
                      value={profileData.craftingStyle}
                      onChange={(e) => handleProfileChange('craftingStyle', e.target.value)}
                      placeholder="Describe your unique style and techniques..."
                      className="rounded-xl"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="materials">Materials Used</Label>
                    <Textarea
                      id="materials"
                      value={profileData.materialsUsed}
                      onChange={(e) => handleProfileChange('materialsUsed', e.target.value)}
                      placeholder="List the materials you typically work with..."
                      className="rounded-xl"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications" className="space-y-6">
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="w-5 h-5 text-primary" />
                    Email Notifications
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Marketing emails</h4>
                      <p className="text-sm text-muted-foreground">Tips, product updates, and promotions</p>
                    </div>
                    <Switch
                      checked={notifications.emailMarketing}
                      onCheckedChange={(checked) => handleNotificationChange('emailMarketing', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Order updates</h4>
                      <p className="text-sm text-muted-foreground">Sales confirmations and shipping notifications</p>
                    </div>
                    <Switch
                      checked={notifications.emailOrders}
                      onCheckedChange={(checked) => handleNotificationChange('emailOrders', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Customer messages</h4>
                      <p className="text-sm text-muted-foreground">Inquiries and comments from customers</p>
                    </div>
                    <Switch
                      checked={notifications.emailMessages}
                      onCheckedChange={(checked) => handleNotificationChange('emailMessages', checked)}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="w-5 h-5 text-primary" />
                    SMS Notifications
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Marketing SMS</h4>
                      <p className="text-sm text-muted-foreground">Special offers and announcements</p>
                    </div>
                    <Switch
                      checked={notifications.smsMarketing}
                      onCheckedChange={(checked) => handleNotificationChange('smsMarketing', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Order updates</h4>
                      <p className="text-sm text-muted-foreground">Important order status changes</p>
                    </div>
                    <Switch
                      checked={notifications.smsOrders}
                      onCheckedChange={(checked) => handleNotificationChange('smsOrders', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Customer messages</h4>
                      <p className="text-sm text-muted-foreground">Urgent customer inquiries</p>
                    </div>
                    <Switch
                      checked={notifications.smsMessages}
                      onCheckedChange={(checked) => handleNotificationChange('smsMessages', checked)}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5 text-primary" />
                    Browser Notifications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Push notifications</h4>
                      <p className="text-sm text-muted-foreground">Real-time updates when browsing</p>
                    </div>
                    <Switch
                      checked={notifications.browserNotifications}
                      onCheckedChange={(checked) => handleNotificationChange('browserNotifications', checked)}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-8 border-t">
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              className="flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete Account
            </Button>
            
            <Button
              onClick={handleSaveChanges}
              disabled={!hasUnsavedChanges}
              className="flex items-center gap-2 px-8"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </Button>
          </div>

          {/* Account Deletion Warning */}
          <Card className="mt-6 border-destructive/20 bg-destructive/5">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-destructive mt-0.5" />
                <div>
                  <h4 className="font-medium text-destructive">Account Deletion</h4>
                  <p className="text-sm text-destructive/80 mt-1">
                    Deleting your account will permanently remove all your products, analytics data, and customer information. This action cannot be undone.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}