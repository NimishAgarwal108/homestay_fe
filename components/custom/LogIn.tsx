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
  const router = useRouter();
  const [formData, setFormData] = useState({ 
    email: '', 
    password: '',
    rememberMe: false 
  });
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#BFC7DE]/50 via-[#C9A177]/30 to-[#BFC7DE]/50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-10 md:top-20 right-10 md:right-20 w-64 md:w-96 h-64 md:h-96 bg-[#7570BC]/20 rounded-full blur-3xl" />
      <div className="absolute bottom-10 md:bottom-20 left-10 md:left-20 w-56 md:w-80 h-56 md:h-80 bg-[#C9A177]/20 rounded-full blur-3xl" />
      
      <Card className="w-full max-w-md md:max-w-lg shadow-2xl relative z-10 border-2 border-[#BFC7DE] bg-white/80 backdrop-blur-md p-4 md:p-6">
        <CardHeader className="space-y-4 pb-6 md:pb-8">
          <div className="flex justify-center mb-2">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-[#7570BC] via-[#BFC7DE] to-[#C9A177] rounded-full flex items-center justify-center shadow-lg">
              <Mountain className="w-9 h-9 md:w-11 md:h-11 text-white" />
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
          <div className="space-y-4 md:space-y-6">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">
                <Typography variant="label" textColor="secondary" weight="semibold">
                  Email Address
                </Typography>
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#7570BC]" />
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  className="pl-11 h-12 border-2 border-[#BFC7DE] focus:border-[#7570BC]"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">
                <Typography variant="label" textColor="secondary" weight="semibold">
                  Password
                </Typography>
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#7570BC]" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="pl-11 pr-11 h-12 border-2 border-[#BFC7DE] focus:border-[#7570BC]"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7570BC]"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember Me / Forgot Password */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-0">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 rounded border-2 border-[#BFC7DE] text-[#7570BC]"
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
                className="hover:text-[#C59594]"
              >
                Forgot password?
              </Typography>
            </div>

            {/* Sign In */}
            <Button 
              className="w-full h-12 bg-[#7570BC] hover:bg-[#C59594] text-white transition-all"
            >
              Sign In
            </Button>

            {/* Create Account */}
            <div className="text-center">
              <Typography variant="paragraph" textColor="secondary">
                Don't have an account?{' '}
                <button
                  onClick={() => router.push('/SignUp')}
                  className="text-[#7570BC] hover:text-[#C59594] font-semibold"
                >
                  Create Account
                </button>
              </Typography>
            </div>

            {/* Back to Home */}
            <Button
              variant="outline"
              className="w-full h-12 border-2 border-[#BFC7DE] text-[#7570BC] hover:bg-[#BFC7DE]/20"
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
