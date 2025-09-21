import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  ShoppingBag,
  Camera,
  Copy,
  Download,
  CheckCircle,
  ExternalLink,
  Hash,
  FileText
} from 'lucide-react';

export interface ExportScreenProps {
  onComplete: () => void;
  productId: string;
  newTitle: string;
  newDescription: string;
  newBackstory: string;
  newImage: string;

}

export function ExportScreen({ onComplete, productId, newTitle, newDescription, newBackstory, newImage }: ExportScreenProps) {
  const [selectedExports, setSelectedExports] = useState<string[]>([]);
  const [isExporting, setIsExporting] = useState(false);

  const exportOptions = [
    {
      id: 'amazon',
      title: 'Amazon Product Listing',
      description: 'Complete product page with title, description, and bullet points',
  icon: <ShoppingBag className="w-8 h-8" />,
      color: 'bg-orange-100 text-orange-600',
      features: ['SEO optimized title', 'Bullet point features', 'Enhanced images', 'A+ content ready']
    },
    {
      id: 'etsy',
      title: 'Etsy Product Card',
      description: 'Handcraft-focused listing with story and artisan details',
  icon: <FileText className="w-8 h-8" />,
      color: 'bg-pink-100 text-pink-600',
      features: ['Handmade emphasis', 'Story integration', 'Tag suggestions', 'SEO keywords']
    },
    {
      id: 'instagram',
      title: 'Instagram Caption + Hashtags',
      description: 'Social media ready post with engaging captions',
  icon: <Camera className="w-8 h-8" />,
      color: 'bg-purple-100 text-purple-600',
      features: ['Engaging captions', 'Trending hashtags', 'Story highlights', 'Brand voice']
    },
    {
      id: 'clipboard',
      title: 'Copy to Clipboard',
      description: 'Raw text format for any platform or custom use',
  icon: <Copy className="w-8 h-8" />,
      color: 'bg-gray-100 text-gray-600',
      features: ['Plain text format', 'Universal compatibility', 'Easy to modify', 'Instant access']
    }
  ];

  const handleExportToggle = (exportId: string) => {
    setSelectedExports(prev => 
      prev.includes(exportId)
        ? prev.filter(id => id !== exportId)
        : [...prev, exportId]
    );
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      // Send update request to backend
      const response = await fetch(`http://localhost:8000/api/v1/${productId}/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newTitle,
          description: newDescription,
          backstory: newBackstory,
          image: newImage,
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to update product');
      }
      setIsExporting(false);
      alert('Product exported and updated successfully!');
    } catch (err) {
      setIsExporting(false);
      alert('Error exporting product: ' + err);
    }
  };

  const handleFinish = () => {
    onComplete();
  };

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: 'var(--color-pastel-pink)' }}>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl">🚀 Export Your Content</h1>
          <p className="text-muted-foreground">
            Choose your preferred formats and platforms
          </p>
          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
            Select one or more export options
          </Badge>
        </div>

        {/* Export Options Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {exportOptions.map((option) => (
            <Card 
              key={option.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                selectedExports.includes(option.id)
                  ? 'ring-2 ring-primary shadow-lg scale-105'
                  : 'hover:scale-102'
              }`}
              onClick={() => handleExportToggle(option.id)}
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg ${option.color}`}>
                      {option.icon}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{option.title}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {option.description}
                      </p>
                    </div>
                  </div>
                  {selectedExports.includes(option.id) && (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <h4 className="font-medium text-sm">What's included:</h4>
                  <div className="flex flex-wrap gap-2">
                    {option.features.map((feature) => (
                      <Badge 
                        key={feature} 
                        variant="outline" 
                        className="text-xs"
                      >
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Preview Section */}
        {selectedExports.length > 0 && (
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Hash className="w-5 h-5" />
                Export Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {selectedExports.map((exportId) => {
                  const option = exportOptions.find(opt => opt.id === exportId);
                  return (
                    <div 
                      key={exportId}
                      className="p-4 rounded-lg border bg-muted/50"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`p-2 rounded ${option?.color}`}>{option?.icon}</div>
                        <span className="font-medium text-sm">{option?.title}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Ready to export
                      </p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col items-center space-y-4">
          {selectedExports.length > 0 && (
            <Button
              onClick={handleExport}
              disabled={isExporting}
              size="lg"
              className="px-8 py-4"
            >
              {isExporting ? (
                <>
                  <div className="w-4 h-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5 mr-2" />
                  Export Selected ({selectedExports.length})
                </>
              )}
            </Button>
          )}

          {/* Success State */}
          <Card 
            className="w-full max-w-2xl border-green-200 bg-green-50"
          >
            <CardContent className="p-6 text-center">
              <div className="space-y-4">
                <CheckCircle className="w-16 h-16 text-green-600 mx-auto" />
                <div>
                  <h3 className="text-lg font-medium text-green-800">
                    ✅ Ready to Publish!
                  </h3>
                  <p className="text-green-700 mt-2">
                    Your AI-generated content is ready for the marketplace. 
                    Export your preferred formats and start selling!
                  </p>
                </div>
                
                <div className="flex flex-wrap justify-center gap-3 mt-6">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-green-300 text-green-700 hover:bg-green-100"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Visit Marketplace
                  </Button>
                  
                  <Button
                    onClick={handleFinish}
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Create Another Product
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tips */}
        <Card className="border-primary/20" style={{ backgroundColor: 'var(--color-pastel-blue)' }}>
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="text-2xl">🎯</div>
              <div className="space-y-2">
                <h4 className="font-medium text-primary">Pro Tips</h4>
                <ul className="text-sm text-primary/80 space-y-1">
                  <li>• Amazon listings perform best with 5+ high-quality images</li>
                  <li>• Etsy buyers love authentic stories - emphasize your craft</li>
                  <li>• Instagram posts with 5-10 hashtags get the most engagement</li>
                  <li>• Always test different versions to see what works best</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}