import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { 
  Mail,
  Lock,
  LogIn,
  ArrowRight
} from 'lucide-react';

interface SignInScreenProps {
  onNext: () => void;
  onSignUp: () => void;
}

export function SignInScreen({ onNext, onSignUp }: SignInScreenProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (validateForm()) {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:8000/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        throw new Error("Invalid credentials");
      }

      const data = await response.json();
      console.log("✅ Logged in:", data);

      // Save full user object in localStorage
      localStorage.setItem("user", JSON.stringify(data.user));

      // ✅ Also save the email separately for Dashboard
      if (data.user?.email) {
        localStorage.setItem("userEmail", data.user.email);
      }

      onNext(); // go to dashboard
    } catch (err: any) {
      alert(err.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  }
};




  const handleForgotPassword = () => {
    alert('Password reset functionality would be implemented here. Check your email for reset instructions.');
  };

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: 'var(--color-pastel-mint)' }}>
      <div className="max-w-md mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="text-4xl mb-4">🎨</div>
          <h1 className="text-3xl">Welcome Back</h1>
          <p className="text-muted-foreground">
            Sign in to continue your artisan journey
          </p>
        </div>

        {/* Sign In Form */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LogIn className="w-5 h-5 text-primary" />
              Sign In to Your Account
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="your.email@example.com"
                  className={`rounded-xl ${errors.email ? 'border-destructive' : ''}`}
                  disabled={isLoading}
                />
                {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Enter your password"
                  className={`rounded-xl ${errors.password ? 'border-destructive' : ''}`}
                  disabled={isLoading}
                />
                {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="rememberMe"
                    checked={formData.rememberMe}
                    onCheckedChange={(checked) => handleInputChange('rememberMe', !!checked)}
                    disabled={isLoading}
                  />
                  <Label
                    htmlFor="rememberMe"
                    className="text-sm font-normal cursor-pointer"
                  >
                    Remember me
                  </Label>
                </div>
                
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm text-primary hover:underline"
                  disabled={isLoading}
                >
                  Forgot Password?
                </button>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <Button
                  type="submit"
                  size="lg"
                  className="w-full rounded-xl py-6"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Signing In...
                    </>
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Sign Up Link */}
        <div className="text-center">
          <p className="text-muted-foreground">
            New here?{' '}
            <button
              onClick={onSignUp}
              className="text-primary hover:underline font-medium"
              disabled={isLoading}
            >
              Create an Account
            </button>
          </p>
        </div>

        {/* Demo Credentials Notice */}
        <Card className="border-secondary/20" style={{ backgroundColor: 'var(--color-pastel-yellow)' }}>
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="text-2xl">💡</div>
              <div className="space-y-2">
                <h4 className="font-medium text-secondary">Demo Mode</h4>
                <p className="text-sm text-secondary/80">
                  This is a prototype. Enter any email and password to continue to the dashboard.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <div className="text-center text-sm text-muted-foreground">
          <p>
            Your account is protected with industry-standard security. 
            We never share your personal information.
          </p>
        </div>
      </div>
    </div>
  );
}