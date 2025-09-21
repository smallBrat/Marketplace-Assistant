import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { 
  Edit3, 
  Check, 
  RotateCcw, 
  ArrowRight,
  ImageIcon,
  Save
} from 'lucide-react';

interface ReviewScreenProps {
  onNext: () => void;
  product: any;
}

export function ReviewScreen({ onNext, product }: ReviewScreenProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [productTitle, setProductTitle] = useState(product?.title || "");
  const [productDescription, setProductDescription] = useState(product?.description || "");
  const [brandStory, setBrandStory] = useState(product?.backstory || product?.story || "");
  const [loading, setLoading] = useState(false);
  // Always use product.image, which backend sets to enhanced image URL
  const enhancedImage = product?.image || "";

  // Debug: log image URL when product is loaded
  if (enhancedImage) {
    console.log('[ReviewScreen] Displaying image:', enhancedImage);
  }

  const handleSave = async () => {
  setIsEditing(false);
  // Example: persist changes to backend
  await fetch("/api/saveProduct", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productTitle, productDescription, brandStory }),
  });
};

  const handleRegenerate = async () => {
    // Regenerate all content using backend (Vertex/Gemini)
    setLoading(true);
    try {
      // Call a backend endpoint to regenerate using the productId
      // We'll assume product.id is available (from Firestore)
      const res = await fetch(`http://localhost:8000/api/v1/${product.id}/regenerate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      if (!res.ok) throw new Error('Failed to regenerate product');
      const data = await res.json();
      setProductTitle(data.title || "");
      setProductDescription(data.description || "");
      setBrandStory(data.backstory || data.story || "");
    } catch (err) {
      alert('Failed to regenerate product: ' + (err as any)?.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8000/api/v1/${product.id}/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: productTitle,
          description: productDescription,
          backstory: brandStory,
          story: brandStory, // keep both for compatibility
          image: enhancedImage
        }),
      });
      if (!res.ok) throw new Error("Failed to update product");
      const data = await res.json();
      console.log("Product updated:", data);
      onNext(); // move to next screen
    } catch (error) {
      alert("Failed to update product: " + (error as any)?.message);
      console.error("Error updating product:", error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: 'var(--color-pastel-blue)' }}>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl">📝 Review & Edit Your Content</h1>
          <p className="text-muted-foreground">
            Make any adjustments to perfect your product listing
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-3">
          <Button
            variant={isEditing ? "default" : "outline"}
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-2"
          >
            {isEditing ? <Save className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
            {isEditing ? 'Save Changes' : 'Edit Content'}
          </Button>
          
          <Button
            variant="outline"
            onClick={handleRegenerate}
            className="flex items-center gap-2"
            disabled={loading}
          >
            <RotateCcw className={`w-4 h-4${loading ? ' animate-spin' : ''}`} />
            {loading ? 'Regenerating...' : 'Regenerate All'}
          </Button>
          
          <Button
            onClick={handleAccept}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
            disabled={loading}
          >
            <Check className="w-4 h-4" />
            {loading ? "Saving..." : "Accept & Continue"}
          </Button>
        </div>

        {/* Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Enhanced Image - Fixed */}
          <Card className="lg:row-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-primary" />
                Enhanced Image
              </CardTitle>
            </CardHeader>
            <CardContent>
              <img
                src={enhancedImage}
                alt="Enhanced product"
                className="w-full h-64 lg:h-80 object-cover rounded-lg shadow-md"
              />
              <div 
                className="mt-3 p-3 rounded-lg text-sm"
                style={{ backgroundColor: 'var(--color-pastel-mint)' }}
              >
                <p>
                  ✨ <strong>Locked:</strong> Image enhancement cannot be edited manually. 
                  Use "Regenerate All" to create a new version.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Product Title & Description */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Product Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Product Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Product Title</Label>
                {isEditing ? (
                  <Input
                    id="title"
                    value={productTitle}
                    onChange={(e) => setProductTitle(e.target.value)}
                    className="font-medium"
                  />
                ) : (
                  <div className="p-3 rounded-lg bg-muted">
                    <h3 className="font-medium">{productTitle}</h3>
                  </div>
                )}
              </div>

              {/* Product Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Product Description</Label>
                {isEditing ? (
                  <Textarea
                    id="description"
                    value={productDescription}
                    onChange={(e) => setProductDescription(e.target.value)}
                    rows={8}
                    className="resize-none"
                  />
                ) : (
                  <div className="p-3 rounded-lg bg-muted">
                    <div className="whitespace-pre-line text-sm leading-relaxed line-clamp-6">
                      {productDescription}
                    </div>
                    <Button variant="link" size="sm" onClick={() => setExpanded(!expanded)}>
                      {expanded ? "Show Less" : "Read More"}
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Brand Story */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Brand Story</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {isEditing ? (
                <Textarea
                  value={brandStory}
                  onChange={(e) => setBrandStory(e.target.value)}
                  rows={6}
                  className="resize-none"
                />
              ) : (
                <div className="p-4 rounded-lg bg-muted">
                  <div className="whitespace-pre-line text-sm leading-relaxed">
                    {brandStory}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Tips */}
        <Card className="border-yellow-200" style={{ backgroundColor: 'var(--color-pastel-yellow)' }}>
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="text-2xl">💡</div>
              <div className="space-y-2">
                <h4 className="font-medium text-accent">Editing Tips</h4>
                <ul className="text-sm text-accent/80 space-y-1">
                  <li>• Keep your product title under 60 characters for better SEO</li>
                  <li>• Include key features and benefits in your description</li>
                  <li>• Make your story personal and emotional to connect with buyers</li>
                  <li>• Use bullet points to highlight important features</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bottom Action */}
        {!isEditing && (
          <div className="flex justify-center">
            <Button
              onClick={handleAccept}
              size="lg"
              className="px-12 py-4"
            >
              Continue to Export Options
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}