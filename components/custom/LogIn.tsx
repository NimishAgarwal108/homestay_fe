"use client";
import { Typography } from '@/components/Typography';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Lock, Mail, Mountain } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';


function Login() {
  const router=useRouter();
  const [formData, setFormData] = useState({ 
    email: '', 
    password: '',
    rememberMe: false 
  });
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-stone-100 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-20 right-20 w-96 h-96 bg-amber-200/30 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-20 w-80 h-80 bg-orange-200/20 rounded-full blur-3xl" />
      
      <Card className="w-full max-w-md shadow-2xl relative z-10 border-2 border-amber-100 bg-white/90 backdrop-blur-md">
        <CardHeader className="space-y-4 pb-8">
          <div className="flex justify-center mb-2">
            <div className="w-20 h-20 bg-gradient-to-br from-amber-600 via-orange-600 to-amber-700 rounded-full flex items-center justify-center shadow-lg">
              <Mountain className="w-11 h-11 text-white" />
            </div>
          </div>
          
          <Typography variant="h2" textColor="primary" weight="bold" align="center">
            Welcome Back
          </Typography>
          
          <CardDescription className="text-center">
            <Typography variant="muted" textColor="secondary" align="center">
              Sign in to manage your bookings at Aamantran Home Stay
            </Typography>
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-6">
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
                  className="pl-11 h-12 border-2 border-amber-100 focus:border-amber-400"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

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
                  placeholder="Enter your password"
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

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 rounded border-2 border-amber-300 text-amber-600"
                  checked={formData.rememberMe}
                  onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                />
                <Typography variant="small" textColor="secondary">
                  Remember me
                </Typography>
              </label>
              
              <Typography 
                as="button"
                variant="small" 
                textColor="accent" 
                weight="semibold"
                className="hover:text-amber-800"
              >
                Forgot password?
              </Typography>
            </div>

            <Button 
              className="w-full h-12 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
            >
              Sign In
            </Button>

            <div className="text-center">
              <Typography variant="paragraph" textColor="secondary">
                Don't have an account?{' '}
                <button
                  onClick={() => router.push('/SignUp')}
                  className="text-amber-700 hover:text-amber-800 font-semibold"
                >
                  Create Account
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
export default Login;