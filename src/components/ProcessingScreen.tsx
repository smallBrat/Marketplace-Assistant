import React, { useEffect, useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Progress } from './ui/progress';
import { 
  ImageIcon, 
  Mic, 
  FileText, 
  BookOpen, 
  CheckCircle,
  Loader2 
} from 'lucide-react';

interface ProcessingScreenProps {
  productId: string;
  onComplete: (productId: string) => void;
}

interface ProcessingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  status: 'pending' | 'processing' | 'completed';
  progress: number;
}

export function ProcessingScreen({ productId, onComplete }: ProcessingScreenProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [overallProgress, setOverallProgress] = useState(0);

  const steps: ProcessingStep[] = [
    {
      id: 'enhance',
      title: 'Image Enhancement',
      description: 'Optimizing lighting and colors',
      icon: <ImageIcon className="w-6 h-6" />,
      status: 'pending',
      progress: 0
    },
    {
      id: 'transcribe',
      title: 'Voice-to-Text',
      description: 'Converting audio to keywords',
      icon: <Mic className="w-6 h-6" />,
      status: 'pending',
      progress: 0
    },
    {
      id: 'description',
      title: 'Product Description',
      description: 'Generating compelling copy',
      icon: <FileText className="w-6 h-6" />,
      status: 'pending',
      progress: 0
    },
    {
      id: 'story',
      title: 'Storytelling Creation',
      description: 'Crafting your brand story',
      icon: <BookOpen className="w-6 h-6" />,
      status: 'pending',
      progress: 0
    }
  ];

  const [processSteps, setProcessSteps] = useState(steps);

  useEffect(() => {
    console.log("🚀 Processing started for product:", productId);
    const timer = setInterval(() => {
    setProcessSteps(prev => {
      const updated = [...prev];
      
      if (currentStep < updated.length) {
        const current = updated[currentStep];
        
        if (current.status === 'pending') {
          current.status = 'processing';
        } else if (current.status === 'processing') {
          current.progress += 20;
          
          if (current.progress >= 100) {
            current.status = 'completed';
            current.progress = 100;
            
            if (currentStep < updated.length - 1) {
              setCurrentStep(currentStep + 1);
            } else {
              // All steps completed
              setOverallProgress(100);
              setTimeout(() => onComplete(productId), 1000);
            }
          }
        }
      }

      // Update overall progress using updated state
      const completedSteps = updated.filter(step => step.status === 'completed').length;
      const processingStep = updated.find(step => step.status === 'processing');
      const processingProgress = processingStep ? processingStep.progress / 100 : 0;
      setOverallProgress(((completedSteps + processingProgress) / updated.length) * 100);

      return updated;
    });
  }, 300);

    return () => clearInterval(timer);
  }, [currentStep, processSteps, onComplete, productId]);

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: 'var(--color-pastel-mint)' }}>
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl">🤖 AI is Working Its Magic</h1>
          <p className="text-muted-foreground">
            Please wait while we process your product information
          </p>
          
          {/* Overall Progress */}
          <div className="space-y-2">
            <Progress value={overallProgress} className="h-3" />
            <p className="text-sm text-muted-foreground">
              {Math.round(overallProgress)}% Complete
            </p>
          </div>
        </div>

        {/* Processing Steps */}
        <div className="space-y-4">
          {processSteps.map((step, index) => (
            <Card 
              key={step.id}
              className={`transition-all duration-300 ${
                step.status === 'processing' 
                  ? 'ring-2 ring-primary shadow-lg' 
                  : step.status === 'completed'
                  ? 'bg-green-50 border-green-200'
                  : 'opacity-70'
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  {/* Icon */}
                  <div 
                    className={`p-3 rounded-full ${
                      step.status === 'completed'
                        ? 'bg-green-100 text-green-600'
                        : step.status === 'processing'
                        ? 'bg-primary/10 text-primary'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {step.status === 'completed' ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : step.status === 'processing' ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      step.icon
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className={`font-medium ${
                        step.status === 'completed' ? 'text-green-700' : ''
                      }`}>
                        {step.title}
                      </h3>
                      {step.status === 'completed' && (
                        <span className="text-sm text-green-600">✓ Done</span>
                      )}
                    </div>
                    
                    <p className="text-sm text-muted-foreground">
                      {step.description}
                    </p>

                    {/* Step Progress */}
                    {step.status === 'processing' && (
                      <Progress value={step.progress} className="h-2" />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Fun Animation */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Creating something amazing for you...</span>
          </div>
        </div>
      </div>
    </div>
  );
}