

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Plus, Home, Package, BarChart3, Settings, Users, ShoppingBag } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface MyProductsScreenProps {
  onAddProduct: () => void;
  onNavigate: (screen: string) => void;
}

interface Product {
  id: string;
  title: string;
  image: string;
  description: string;
  backstory?: string;
}

export function MyProductsScreen({ onAddProduct, onNavigate }: MyProductsScreenProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [artisanName, setArtisanName] = useState<string>("");
  const [artisanInitials, setArtisanInitials] = useState<string>("");

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
  }, []);

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
                <p className="text-sm text-muted-foreground">Artisan</p>
              </div>
            </div>

            {/* Navigation Menu */}
            <nav className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = item.id === 'products';
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
          {/* Back Button removed as requested */}
          <h2 className="text-2xl font-semibold mb-4">My Products</h2>
          {products.length === 0 ? (
            <p>No products found.</p>
          ) : (
            <div className="flex flex-wrap gap-8">
              {products.map(product => (
                <Card key={product.id} className="w-[720px] h-[240px] flex items-center p-4">
                  <CardContent className="flex h-full p-0 w-full">
                    {/* 1: Product Image */}
                    <div className="flex-shrink-0 flex items-center justify-center w-1/3 h-full">
                      <ImageWithFallback 
                        src={product.image} 
                        alt={product.title} 
                        style={{ width: "200px", height: "200px", objectFit: "cover", borderRadius: "14px" }} 
                      />
                    </div>
                    {/* 2: Title & Description */}
                    <div className="flex flex-col justify-center w-1/3 h-full px-8">
                      <h3 className="font-semibold text-xl mb-2 whitespace-normal break-words">{product.title}</h3>
                      <p className="text-muted-foreground text-base max-w-[220px] whitespace-pre-line break-words overflow-hidden" style={{wordBreak: 'break-word'}}>{product.description}</p>
                    </div>
                    {/* 3: Backstory */}
                    <div className="flex flex-col justify-center w-1/3 h-full pl-8">
                      {product.backstory && (
                        <span className="text-lg text-muted-foreground font-semibold break-words">{product.backstory}</span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          <Button onClick={onAddProduct} className="mt-8 w-fit">
            <Plus /> Add Product
          </Button>
        </div>
      </div>
    </div>
  );
}