import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import { 
  ImageIcon, 
  FileText, 
  BookOpen, 
  ArrowRight,
  Sparkles,
  Download 
} from 'lucide-react';
import { useEffect, useState } from "react";

interface OutputScreenProps {
  onNext: (product: any) => void;
  productId: string;
}

export function OutputScreen({ onNext, productId }: OutputScreenProps) {
  const [product, setProduct] = useState<any>(null);

  // Debug: log image URL when product is loaded
  useEffect(() => {
    if (product && product.image) {
      console.log('[OutputScreen] Displaying image:', product.image);
    }
  }, [product]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/v1/${productId}`);
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        console.error('Failed to fetch product:', err);
      }
    };
    fetchProduct();
  }, [productId]);

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: 'var(--color-pastel-peach)' }}>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-primary" />
            <h1 className="text-3xl">Your AI-Generated Package</h1>
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <p className="text-muted-foreground">
            Review your enhanced product materials below
          </p>
          <Badge variant="secondary" className="bg-green-100 text-green-700">
            ✅ Processing Complete
          </Badge>
        </div>

        {/* Results Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {product && (
            <>
              {/* Enhanced Image */}
              <Card className="lg:row-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-primary" />
                    Enhanced Product Image
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="relative">
                    <img
                      src={product.image}
                      alt="Enhanced product"
                      className="w-full h-64 lg:h-96 object-cover rounded-lg shadow-md"
                    />
                    <div className="absolute top-2 right-2">
                      <Button size="sm" variant="outline" className="bg-white/90">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div 
                    className="p-3 rounded-lg text-sm"
                    style={{ backgroundColor: 'var(--color-pastel-yellow)' }}
                  >
                    <p>
                      <strong>AI Enhancements:</strong> Improved lighting, color saturation, 
                      and background optimization for marketplace appeal.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Product Description */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    Product Description
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-64 pr-4">
                    <div className="whitespace-pre-line text-sm leading-relaxed">
                      {product.description}
                    </div>
                  </ScrollArea>
                  <div className="mt-4 flex gap-2">
                    <Badge variant="outline">SEO Optimized</Badge>
                    <Badge variant="outline">Marketplace Ready</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Brand Story */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-primary" />
                    Brand Storytelling
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-64 pr-4">
                    <div className="whitespace-pre-line text-sm leading-relaxed">
                      {product.backstory}
                    </div>
                  </ScrollArea>
                  <div className="mt-4 flex gap-2">
                    <Badge variant="outline">Emotional Connection</Badge>
                    <Badge variant="outline">Brand Building</Badge>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* AI Stats */}
        <Card className="border-primary/20">
          <CardContent className="p-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div 
                className="p-4 rounded-lg"
                style={{ backgroundColor: 'var(--color-pastel-blue)' }}
              >
                <div className="text-2xl font-bold text-primary">98%</div>
                <div className="text-sm text-muted-foreground">Quality Score</div>
              </div>
              <div 
                className="p-4 rounded-lg"
                style={{ backgroundColor: 'var(--color-pastel-pink)' }}
              >
                <div className="text-2xl font-bold text-primary">156</div>
                <div className="text-sm text-muted-foreground">Keywords Used</div>
              </div>
              <div 
                className="p-4 rounded-lg"
                style={{ backgroundColor: 'var(--color-pastel-yellow)' }}
              >
                <div className="text-2xl font-bold text-primary">8.9</div>
                <div className="text-sm text-muted-foreground">Engagement Score</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Continue Button */}
        <div className="flex justify-center">
          <Button
            onClick={() => {
              console.log('[OutputScreen] Continue button clicked!');
              if (product) onNext(product);
            }}
            className="px-8 py-3"
          >
            Review & Edit
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}