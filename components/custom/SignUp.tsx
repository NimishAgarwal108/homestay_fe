"use client";
import { Typography } from '@/components/Typography';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Lock, Mail, Mountain, Phone, User } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { useState } from 'react';

interface SignUpPageProps {
  onNavigate: (page: string) => void;
}

function SignUp() {
  const router=useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50 to-orange-50 flex items-center justify-center p-4 py-12 relative overflow-hidden">
      <div className="absolute top-10 left-10 w-96 h-96 bg-orange-200/30 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-amber-200/20 rounded-full blur-3xl" />
      
      <Card className="w-full max-w-2xl shadow-2xl relative z-10 border-2 border-amber-100 bg-white/90 backdrop-blur-md">
        <CardHeader className="space-y-4 pb-8">
          <div className="flex justify-center mb-2">
            <div className="w-20 h-20 bg-gradient-to-br from-amber-600 via-orange-600 to-amber-700 rounded-full flex items-center justify-center shadow-lg">
              <Mountain className="w-11 h-11 text-white" />
            </div>
          </div>
          
          <Typography variant="h2" textColor="primary" weight="bold" align="center">
            Create Your Account
          </Typography>
          
          <CardDescription className="text-center">
            <Typography variant="muted" textColor="secondary" align="center">
              Join Aamantran Home Stay and start your journey to tranquility
            </Typography>
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-5">
            <div className="grid md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="name">
                  <Typography variant="label" textColor="secondary" weight="semibold">
                    Full Name
                  </Typography>
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-600" />
                  <Input
                    id="name"
                    placeholder="John Doe"
                    className="pl-11 h-12 border-2 border-amber-100"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">
                  <Typography variant="label" textColor="secondary" weight="semibold">
                    Email Address
                  </Typography>
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-600" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    className="pl-11 h-12 border-2 border-amber-100"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">
                <Typography variant="label" textColor="secondary" weight="semibold">
                  Phone Number
                </Typography>
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-600" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  className="pl-11 h-12 border-2 border-amber-100"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="password">
                  <Typography variant="label" textColor="secondary" weight="semibold">
                    Password
                  </Typography>
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-600" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create password"
                    className="pl-11 pr-11 h-12 border-2 border-amber-100"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">
                  <Typography variant="label" textColor="secondary" weight="semibold">
                    Confirm Password
                  </Typography>
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-600" />
                  <Input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm password"
                    className="pl-11 pr-11 h-12 border-2 border-amber-100"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <input 
                type="checkbox" 
                className="w-5 h-5 mt-0.5 rounded border-2 border-amber-300 text-amber-600"
                checked={formData.agreeToTerms}
                onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
              />
              <Typography variant="small" textColor="secondary">
                I agree to the Terms of Service and Privacy Policy
              </Typography>
            </div>

            <Button 
              className="w-full h-12 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
            >
              Create Account
            </Button>

            <div className="text-center">
              <Typography variant="paragraph" textColor="secondary">
                Already have an account?{' '}
                <button
                  onClick={() => router.push('/:login')}
                  className="text-amber-700 hover:text-amber-800 font-semibold"
                >
                  Sign In
                </button>
              </Typography>
            </div>

            <Button
              variant="outline"
              className="w-full h-12 border-2 border-amber-300 text-amber-900 hover:bg-amber-50"
              onClick={() => router.push("/")}
            >
              <Mountain className="w-5 h-5 mr-2" />
              Back to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
export default SignUp;