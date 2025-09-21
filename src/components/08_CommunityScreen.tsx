import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { 
  Home,
  Package,
  Plus,
  BarChart3,
  Settings,
  Users,
  ShoppingBag,
  Heart,
  MessageCircle,
  Share2,
  TrendingUp,
  Hash,
  MapPin,
  Clock,
  Camera,
  Star,
  Award,
  Flame
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface CommunityScreenProps {
  onAddProduct: () => void;
  onNavigate: (screen: string) => void;
}

interface Post {
  id: string;
  author: {
    name: string;
    username: string;
    avatar?: string;
    verified: boolean;
    location: string;
  };
  image: string;
  caption: string;
  hashtags: string[];
  likes: number;
  comments: number;
  shares: number;
  timestamp: string;
  liked: boolean;
}

interface TopArtisan {
  id: string;
  name: string;
  username: string;
  avatar?: string;
  followers: string;
  specialty: string;
  verified: boolean;
}

export function CommunityScreen({ onAddProduct, onNavigate }: CommunityScreenProps) {
  const [filterBy, setFilterBy] = useState('latest');
  const [newPost, setNewPost] = useState('');
  
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


  const posts: Post[] = [
    {
      id: '1',
      author: {
        name: 'Elena Rodriguez',
        username: '@elenapottery',
        verified: true,
        location: 'Taos, NM'
      },
      image: 'https://images.unsplash.com/photo-1695740633675-d060b607f5c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYW5kbWFkZSUyMHBvdHRlcnklMjBjZXJhbWljfGVufDF8fHx8MTc1NjYxNTYwMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      caption: 'Just finished this beautiful ceramic bowl inspired by desert sunsets 🌅 The glaze came out perfectly after three firings!',
      hashtags: ['#ceramics', '#pottery', '#handmade', '#desertsunset', '#artisan'],
      likes: 234,
      comments: 18,
      shares: 12,
      timestamp: '2 hours ago',
      liked: false
    },
    {
      id: '2',
      author: {
        name: 'Marcus Chen',
        username: '@marcusjewelry',
        verified: false,
        location: 'Portland, OR'
      },
      image: 'https://images.unsplash.com/photo-1752606301293-cd61d6153264?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqZXdlbHJ5JTIwY3JhZnRpbmclMjBhcnRpc2FufGVufDF8fHx8MTc1NjYxNTYwNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      caption: 'Working on a custom engagement ring commission. The precision required for this intricate setting is incredible! ✨',
      hashtags: ['#jewelry', '#engagement', '#custom', '#goldsmith', '#precision'],
      likes: 187,
      comments: 24,
      shares: 8,
      timestamp: '4 hours ago',
      liked: true
    },
    {
      id: '3',
      author: {
        name: 'Amy Thompson',
        username: '@amytextiles',
        verified: true,
        location: 'Asheville, NC'
      },
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
      caption: 'This macrame wall hanging took me three days to complete, but I love how the natural cotton rope creates such beautiful geometric patterns.',
      hashtags: ['#macrame', '#wallart', '#boho', '#handwoven', '#naturalfibers'],
      likes: 156,
      comments: 12,
      shares: 6,
      timestamp: '6 hours ago',
      liked: false
    },
    {
      id: '4',
      author: {
        name: 'David Kim',
        username: '@davidwood',
        verified: false,
        location: 'Seattle, WA'
      },
      image: 'https://images.unsplash.com/photo-1661873482206-4e2fa0ba455d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b29kZW4lMjBjcmFmdCUyMGhhbmRtYWRlfGVufDF8fHx8MTc1NjYxMzkwM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      caption: 'Finally finished this live-edge walnut dining table. The grain pattern on this piece is absolutely stunning! 🪵',
      hashtags: ['#woodworking', '#liveedge', '#walnut', '#furniture', '#sustainable'],
      likes: 298,
      comments: 31,
      shares: 19,
      timestamp: '8 hours ago',
      liked: true
    },
    {
      id: '5',
      author: {
        name: 'Sofia Martinez',
        username: '@sofiasilver',
        verified: true,
        location: 'Santa Fe, NM'
      },
      image: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=400&h=400&fit=crop',
      caption: 'Hand-forged sterling silver bracelet with traditional southwestern motifs. Each piece tells a story of our heritage.',
      hashtags: ['#silver', '#southwestern', '#heritage', '#handforged', '#storytelling'],
      likes: 203,
      comments: 15,
      shares: 11,
      timestamp: '1 day ago',
      liked: false
    }
  ];

  const topArtisans: TopArtisan[] = [
    {
      id: '1',
      name: 'Elena Rodriguez',
      username: '@elenapower',
      followers: '12.5K',
      specialty: 'Ceramics',
      verified: true
    },
    {
      id: '2',
      name: 'David Kim',
      username: '@davidwood',
      followers: '8.2K',
      specialty: 'Woodworking',
      verified: false
    },
    {
      id: '3',
      name: 'Sofia Martinez',
      username: '@sofiasilver',
      followers: '9.8K',
      specialty: 'Jewelry',
      verified: true
    },
    {
      id: '4',
      name: 'Amy Thompson',
      username: '@amytextiles',
      followers: '6.1K',
      specialty: 'Textiles',
      verified: true
    }
  ];

  const trendingHashtags = [
    { tag: '#handmade', posts: '2.3K' },
    { tag: '#ceramics', posts: '1.8K' },
    { tag: '#sustainable', posts: '1.5K' },
    { tag: '#artisan', posts: '1.2K' },
    { tag: '#custom', posts: '987' },
    { tag: '#pottery', posts: '856' },
    { tag: '#jewelry', posts: '743' },
    { tag: '#woodworking', posts: '692' }
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

  const handleLike = (postId: string) => {
    // In a real app, this would update the backend
    alert(`Liked post ${postId}`);
  };

  const handleComment = (postId: string) => {
    // In a real app, this would open a comment modal
    alert(`Comment on post ${postId}`);
  };

  const handleShare = (postId: string) => {
    // In a real app, this would open share options
    alert(`Share post ${postId}`);
  };

  const handlePost = () => {
    if (newPost.trim()) {
      alert('Post created successfully!');
      setNewPost('');
    }
  };

  const getFilterLabel = (filter: string) => {
    switch (filter) {
      case 'latest': return 'Latest';
      case 'liked': return 'Most Liked';
      case 'nearby': return 'Nearby';
      default: return 'Latest';
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-pastel-lavender)' }}>
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
                const isActive = item.id === 'community';
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
          {/* Left Column - Community Feed */}
          <div className="flex-1 p-6">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-3xl mb-2">Community Hub</h1>
              <p className="text-muted-foreground">
                Connect with fellow artisans, share your work, and get inspired.
              </p>
            </div>

            {/* Filter Bar */}
            <Card className="shadow-sm mb-6">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium">Filter by:</span>
                    <Select value={filterBy} onValueChange={setFilterBy}>
                      <SelectTrigger className="w-40 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="latest">Latest</SelectItem>
                        <SelectItem value="liked">Most Liked</SelectItem>
                        <SelectItem value="nearby">Nearby</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Flame className="w-3 h-3" />
                    {getFilterLabel(filterBy)}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Community Feed */}
            <div className="space-y-6">
              {posts.map((post) => (
                <Card key={post.id} className="shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-0">
                    {/* Post Header */}
                    <div className="p-4 border-b">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={post.author.avatar} />
                            <AvatarFallback className="bg-primary text-white">
                              {post.author.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{post.author.name}</span>
                              {post.author.verified && (
                                <Badge variant="secondary" className="px-1 py-0 text-xs">
                                  <Star className="w-3 h-3" />
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span>{post.author.username}</span>
                              <span>•</span>
                              <div className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {post.author.location}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          {post.timestamp}
                        </div>
                      </div>
                    </div>

                    {/* Post Image */}
                    <div className="relative">
                      <ImageWithFallback
                        src={post.image}
                        alt={post.caption}
                        className="w-full h-80 object-cover"
                      />
                    </div>

                    {/* Post Content */}
                    <div className="p-4">
                      <p className="text-sm mb-3">{post.caption}</p>
                      
                      {/* Hashtags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.hashtags.map((hashtag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {hashtag}
                          </Badge>
                        ))}
                      </div>

                      {/* Engagement */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                          <button
                            onClick={() => handleLike(post.id)}
                            className={`flex items-center gap-2 transition-colors ${
                              post.liked ? 'text-red-500' : 'text-muted-foreground hover:text-red-500'
                            }`}
                          >
                            <Heart className={`w-5 h-5 ${post.liked ? 'fill-current' : ''}`} />
                            <span className="text-sm">{post.likes}</span>
                          </button>
                          <button
                            onClick={() => handleComment(post.id)}
                            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                          >
                            <MessageCircle className="w-5 h-5" />
                            <span className="text-sm">{post.comments}</span>
                          </button>
                          <button
                            onClick={() => handleShare(post.id)}
                            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                          >
                            <Share2 className="w-5 h-5" />
                            <span className="text-sm">{post.shares}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="w-80 p-6 space-y-6">
            {/* Post Something */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="w-5 h-5 text-primary" />
                  Share Your Work
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="What are you working on today?"
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  className="rounded-xl min-h-[80px]"
                />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Camera className="w-4 h-4" />
                    </Button>
                    <span className="text-xs text-muted-foreground">Add photo</span>
                  </div>
                  <Button onClick={handlePost} disabled={!newPost.trim()}>
                    Post
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Top Artisans */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-secondary" />
                  Top Artisans
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {topArtisans.map((artisan) => (
                  <div key={artisan.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={artisan.avatar} />
                        <AvatarFallback className="bg-primary text-white text-sm">
                          {artisan.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-1">
                          <span className="font-medium text-sm">{artisan.name}</span>
                          {artisan.verified && (
                            <Star className="w-3 h-3 text-secondary" />
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {artisan.followers} • {artisan.specialty}
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Follow
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Trending Hashtags */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Hash className="w-5 h-5 text-primary" />
                  Trending Hashtags
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {trendingHashtags.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-green-600" />
                        <span className="font-medium text-sm">{item.tag}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{item.posts} posts</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}