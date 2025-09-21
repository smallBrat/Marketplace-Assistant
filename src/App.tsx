import React, { useState } from 'react';
import { SignUpScreen } from './components/01_SignUpScreen';
import { SignInScreen } from './components/02_SignInScreen';
import { DashboardScreen } from './components/03_DashboardScreen';
import { HomeScreen } from './components/04_HomeScreen';
import { MyProductsScreen } from './components/05_MyProductsScreen';
import { InsightsScreen } from './components/06_InsightsScreen';
import { SettingsScreen } from './components/07_SettingsScreen';
import { CommunityScreen } from './components/08_CommunityScreen';
import { OrdersScreen } from './components/09_OrdersScreen';
import { InputScreen } from './components/InputScreen';
import { ProcessingScreen } from './components/ProcessingScreen';
import { OutputScreen } from './components/OutputScreen';
import { ReviewScreen } from './components/ReviewScreen';
import { ExportScreen } from './components/ExportScreen';
import { Card, CardContent } from './components/ui/card';
import { Badge } from './components/ui/badge';
import { 
  Upload,
  Cpu,
  Eye,
  Edit,
  Download,
  ArrowLeft
} from 'lucide-react';
import { Button } from './components/ui/button';

type Screen = 'signup' | 'signin' | 'dashboard' | 'home' | 'products' | 'analytics' | 'community' | 'orders' | 'settings' | 'input' | 'processing' | 'output' | 'review' | 'export';

interface Step {
  id: Screen;
  title: string;
  icon: React.ReactNode;
  description: string;
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('signup');
  const [productId, setProductId] = useState<string | null>(null);
  const [productData, setProductData] = useState<any>(null); // Store product data for review
  // Add refreshKey for HomeScreen to force product re-fetch
  const [homeRefreshKey, setHomeRefreshKey] = useState<number>(0);

  // Debug: Log current screen on every render
  console.log('[App] Current screen:', currentScreen);

  const steps: Step[] = [
    {
      id: 'input',
      title: 'Upload',
      icon: <Upload className="w-4 h-4" />,
      description: 'Add your product'
    },
    {
      id: 'processing',
      title: 'AI Processing',
      icon: <Cpu className="w-4 h-4" />,
      description: 'AI magic happens'
    },
    {
      id: 'output',
      title: 'Results',
      icon: <Eye className="w-4 h-4" />,
      description: 'View AI output'
    },
    {
      id: 'review',
      title: 'Review',
      icon: <Edit className="w-4 h-4" />,
      description: 'Edit & refine'
    },
    {
      id: 'export',
      title: 'Export',
      icon: <Download className="w-4 h-4" />,
      description: 'Ready to publish'
    }
  ];

  const getCurrentStepIndex = () => {
    return steps.findIndex(step => step.id === currentScreen);
  };


  // Product workflow handlers
  const handleInputNext = (id: string) => {
    setProductId(id);
    setCurrentScreen('processing');
  };

  const handleProcessingComplete = (id: string) => {
    setProductId(id);
    setCurrentScreen('output');
  };

  const handleOutputNext = (product: any) => {
    // Save product data for review
    setProductData(product);
    console.log('[App] handleOutputNext called, navigating to review');
    setCurrentScreen('review');
  };

  const handleReviewNext = () => {
    setCurrentScreen('export');
  };

  // For non-product workflow
  const handleNext = () => {
    const currentIndex = getCurrentStepIndex();
    if (currentIndex < steps.length - 1) {
      setCurrentScreen(steps[currentIndex + 1].id);
    }
  };

  const handleBack = () => {
    const currentIndex = getCurrentStepIndex();
    if (currentIndex > 0) {
      setCurrentScreen(steps[currentIndex - 1].id);
    }
  };

  const handleComplete = () => {
    // Return to home after completing the product upload flow
    setCurrentScreen('home');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'signup':
        return (
          <SignUpScreen 
            onNext={() => setCurrentScreen('signin')} 
            onSignIn={() => setCurrentScreen('signin')}
          />
        );
      case 'signin':
        return (
          <SignInScreen 
            onNext={() => setCurrentScreen('home')} 
            onSignUp={() => setCurrentScreen('signup')}
          />
        );
      case 'dashboard':
        return (
          <DashboardScreen 
            onAddProduct={() => setCurrentScreen('input')}
          />
        );
      case 'home':
        return (
          <HomeScreen 
            onAddProduct={() => setCurrentScreen('input')}
            onNavigate={(screen: string) => {
              // If navigating to home, increment refreshKey
              if (screen === 'home') {
                setHomeRefreshKey(prev => prev + 1);
              }
              setCurrentScreen(screen as Screen);
            }}
            refreshKey={homeRefreshKey}
          />
        );
      case 'products':
        return (
          <MyProductsScreen 
            onAddProduct={() => setCurrentScreen('input')}
            onNavigate={(screen: string) => {
              // If navigating back to home from products, increment refreshKey
              if (screen === 'home') {
                setHomeRefreshKey(prev => prev + 1);
              }
              setCurrentScreen(screen as Screen);
            }}
          />
        );
      case 'analytics':
        return (
          <InsightsScreen 
            onAddProduct={() => setCurrentScreen('input')}
            onNavigate={(screen: string) => setCurrentScreen(screen as Screen)}
          />
        );
      case 'community':
        return (
          <CommunityScreen 
            onAddProduct={() => setCurrentScreen('input')}
            onNavigate={(screen: string) => setCurrentScreen(screen as Screen)}
          />
        );
      case 'orders':
        return (
          <OrdersScreen 
            onAddProduct={() => setCurrentScreen('input')}
            onNavigate={(screen: string) => setCurrentScreen(screen as Screen)}
          />
        );
      case 'settings':
        return (
          <SettingsScreen 
            onAddProduct={() => setCurrentScreen('input')}
            onNavigate={(screen: string) => setCurrentScreen(screen as Screen)}
          />
        );
      case 'input':
        return <InputScreen onNext={handleInputNext} />;
      case 'processing':
        return productId ? <ProcessingScreen productId={productId} onComplete={handleProcessingComplete} /> : null;
      case 'output':
        return productId ? <OutputScreen productId={productId} onNext={(product) => handleOutputNext(product)} /> : null;
      case 'review':
        return productData ? <ReviewScreen onNext={handleReviewNext} product={productData} /> : null;
      case 'export':
        return productData && productId ? (
          <ExportScreen
            onComplete={handleComplete}
            productId={productId}
            newTitle={productData.title}
            newDescription={productData.description}
            newBackstory={productData.backstory}
            newImage={productData.image}
          />
        ) : null;
      default:
        return (
          <SignUpScreen 
            onNext={() => setCurrentScreen('signin')} 
            onSignIn={() => setCurrentScreen('signin')}
          />
        );
    }
  };

  // Only show progress header and footer for product upload workflow
  const isProductWorkflow = ['input', 'processing', 'output', 'review', 'export'].includes(currentScreen);

  return (
    <div className="min-h-screen">
      {/* Progress Header - Only for product upload workflow */}
      {isProductWorkflow && (
        <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b">
          <div className="max-w-6xl mx-auto p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="text-2xl">🎨</div>
                <div>
                  <h1 className="font-semibold">AI Marketplace Assistant</h1>
                  <p className="text-sm text-muted-foreground">For Local Artisans</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                {getCurrentStepIndex() > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleBack}
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </Button>
                )}
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentScreen('home')}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Dashboard
                </Button>
              </div>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center justify-between">
              {steps.map((step, index) => {
                const currentIndex = getCurrentStepIndex();
                const isActive = index === currentIndex;
                const isCompleted = index < currentIndex;
                const isUpcoming = index > currentIndex;

                return (
                  <div key={step.id} className="flex items-center flex-1">
                    <div className="flex flex-col items-center">
                      {/* Step Circle */}
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                          isCompleted
                            ? 'bg-green-500 text-white'
                            : isActive
                            ? 'bg-primary text-white shadow-lg scale-110'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {isCompleted ? (
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          step.icon
                        )}
                      </div>

                      {/* Step Info */}
                      <div className="mt-2 text-center">
                        <div className={`text-sm font-medium ${
                          isActive ? 'text-primary' : isCompleted ? 'text-green-600' : 'text-muted-foreground'
                        }`}>
                          {step.title}
                        </div>
                        <div className="text-xs text-muted-foreground hidden sm:block">
                          {step.description}
                        </div>
                      </div>
                    </div>

                    {/* Connector Line */}
                    {index < steps.length - 1 && (
                      <div className="flex-1 h-0.5 mx-4 relative">
                        <div className="absolute inset-0 bg-muted rounded-full" />
                        <div 
                          className={`absolute inset-0 bg-primary rounded-full transition-all duration-500 ${
                            index < currentIndex ? 'w-full' : 'w-0'
                          }`}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Current Step Info */}
            <div className="mt-4 text-center">
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                Step {getCurrentStepIndex() + 1} of {steps.length}: {steps[getCurrentStepIndex()].title}
              </Badge>
            </div>
          </div>
        </div>
      )}

      {/* Screen Content */}
      <div className="transition-all duration-300">
        {renderScreen()}
      </div>

      {/* Footer - Only for product upload workflow */}
      {isProductWorkflow && (
        <footer className="bg-white border-t p-6 text-center text-sm text-muted-foreground">
          <p>Built with ❤️ for artisans • Powered by AI • Made with Figma Make</p>
        </footer>
      )}
    </div>
  );
}