import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  User,
  Mail,
  Lock,
  MapPin,
  Palette,
  Clock,
  ArrowRight,
  UserPlus
} from 'lucide-react';

interface SignUpScreenProps {
  onNext: () => void;
  onSignIn: () => void;
}

export function SignUpScreen({ onNext, onSignIn }: SignUpScreenProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: '',
    gender: '',
    city: '',
    state: '',
    country: '',
    craftCategory: '',
    experience: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string) => {
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

    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
    
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    
    if (!formData.age) newErrors.age = 'Age is required';
    else if (parseInt(formData.age) < 13) newErrors.age = 'Must be at least 13 years old';
    
    if (!formData.gender) newErrors.gender = 'Please select your gender';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.country.trim()) newErrors.country = 'Country is required';
    if (!formData.craftCategory) newErrors.craftCategory = 'Please select your primary craft';
    if (!formData.experience) newErrors.experience = 'Years of experience is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (validateForm()) {
    try {
      const payload = {
        full_name: formData.fullName,
        email: formData.email,
        password: formData.password,
        confirm_password: formData.confirmPassword,
        age: parseInt(formData.age),
        gender: formData.gender,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        primary_craft: formData.craftCategory,   // backend expects this
        experience: formData.experience,
      };

      const response = await fetch("http://localhost:8000/api/v1/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("✅ User created:", data);
        onNext();
      } else {
        const errorData = await response.json();
        console.error("❌ Signup failed:", errorData);
        alert(errorData.detail || "Signup failed. Try again.");
      }
    } catch (err) {
      console.error("⚠️ Network error:", err);
      alert("Network error. Please try again later.");
    }
  }
};



  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: 'var(--color-pastel-lavender)' }}>
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="text-4xl mb-4">🎨</div>
          <h1 className="text-3xl">Create Your Artisan Account</h1>
          <p className="text-muted-foreground">
            Join our community of talented artisans and showcase your creations to the world
          </p>
        </div>

        {/* Sign Up Form */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-primary" />
              Account Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Full Name
                  </Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    placeholder="Enter your full name"
                    className={`rounded-xl ${errors.fullName ? 'border-destructive' : ''}`}
                  />
                  {errors.fullName && <p className="text-sm text-destructive">{errors.fullName}</p>}
                </div>

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
                  />
                  {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                </div>
              </div>

              {/* Password Fields */}
              <div className="grid gap-4 md:grid-cols-2">
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
                    placeholder="Create a secure password"
                    className={`rounded-xl ${errors.password ? 'border-destructive' : ''}`}
                  />
                  {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Confirm Password
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    placeholder="Repeat your password"
                    className={`rounded-xl ${errors.confirmPassword ? 'border-destructive' : ''}`}
                  />
                  {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword}</p>}
                </div>
              </div>

              {/* Personal Details */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    min="13"
                    max="120"
                    value={formData.age}
                    onChange={(e) => handleInputChange('age', e.target.value)}
                    placeholder="Your age"
                    className={`rounded-xl ${errors.age ? 'border-destructive' : ''}`}
                  />
                  {errors.age && <p className="text-sm text-destructive">{errors.age}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                    <SelectTrigger className={`rounded-xl ${errors.gender ? 'border-destructive' : ''}`}>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.gender && <p className="text-sm text-destructive">{errors.gender}</p>}
                </div>
              </div>

              {/* Location */}
              <div className="space-y-4">
                <Label className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Location
                </Label>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Input
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      placeholder="City"
                      className={`rounded-xl ${errors.city ? 'border-destructive' : ''}`}
                    />
                    {errors.city && <p className="text-sm text-destructive">{errors.city}</p>}
                  </div>
                  <div className="space-y-2">
                    <Input
                      value={formData.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      placeholder="State/Province"
                      className={`rounded-xl ${errors.state ? 'border-destructive' : ''}`}
                    />
                    {errors.state && <p className="text-sm text-destructive">{errors.state}</p>}
                  </div>
                  <div className="space-y-2">
                    <Input
                      value={formData.country}
                      onChange={(e) => handleInputChange('country', e.target.value)}
                      placeholder="Country"
                      className={`rounded-xl ${errors.country ? 'border-destructive' : ''}`}
                    />
                    {errors.country && <p className="text-sm text-destructive">{errors.country}</p>}
                  </div>
                </div>
              </div>

              {/* Craft Information */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="craftCategory" className="flex items-center gap-2">
                    <Palette className="w-4 h-4" />
                    Primary Craft Category
                  </Label>
                  <Select value={formData.craftCategory} onValueChange={(value) => handleInputChange('craftCategory', value)}>
                    <SelectTrigger className={`rounded-xl ${errors.craftCategory ? 'border-destructive' : ''}`}>
                      <SelectValue placeholder="Select your primary craft" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pottery">Pottery</SelectItem>
                      <SelectItem value="textiles">Textiles</SelectItem>
                      <SelectItem value="jewelry">Jewelry</SelectItem>
                      <SelectItem value="woodwork">Woodwork</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.craftCategory && <p className="text-sm text-destructive">{errors.craftCategory}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience" className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Years of Experience
                  </Label>
                  <Input
                    id="experience"
                    type="number"
                    min="0"
                    max="50"
                    value={formData.experience}
                    onChange={(e) => handleInputChange('experience', e.target.value)}
                    placeholder="Years"
                    className={`rounded-xl ${errors.experience ? 'border-destructive' : ''}`}
                  />
                  {errors.experience && <p className="text-sm text-destructive">{errors.experience}</p>}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  size="lg"
                  className="w-full rounded-xl py-6"
                >
                  Create Account
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Sign In Link */}
        <div className="text-center">
          <p className="text-muted-foreground">
            Already have an account?{' '}
            <button
              onClick={onSignIn}
              className="text-primary hover:underline font-medium"
            >
              Sign In
            </button>
          </p>
        </div>

        {/* Terms Notice */}
        <div className="text-center text-sm text-muted-foreground max-w-md mx-auto">
          <p>
            By creating an account, you agree to our Terms of Service and Privacy Policy. 
            We're committed to protecting your personal information and craft details.
          </p>
        </div>
      </div>
    </div>
  );
}