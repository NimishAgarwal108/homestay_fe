"use client";
import { Typography } from '@/components/Typography';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Lock, Mail, Mountain, Phone, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

function SignUp() {
  const router = useRouter();
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
    <div className="min-h-screen bg-gradient-to-br from-[#BFC7DE]/50 via-[#C9A177]/30 to-[#BFC7DE]/50 flex items-center justify-center p-4 py-12 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-10 left-10 w-64 md:w-96 h-64 md:h-96 bg-[#C59594]/20 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-56 md:w-80 h-56 md:h-80 bg-[#7570BC]/20 rounded-full blur-3xl" />

      <Card className="w-full max-w-lg md:max-w-2xl shadow-2xl relative z-10 border-2 border-[#BFC7DE] bg-white/80 backdrop-blur-md p-4 md:p-6">
        <CardHeader className="space-y-4 pb-6 md:pb-8">
          <div className="flex justify-center mb-2">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-[#7570BC] via-[#C9A177] to-[#C59594] rounded-full flex items-center justify-center shadow-lg">
              <Mountain className="w-9 h-9 md:w-11 md:h-11 text-white" />
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
          <div className="space-y-4 md:space-y-5">
            {/* Name & Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
              <div className="space-y-2">
                <Label htmlFor="name">
                  <Typography variant="label" textColor="secondary" weight="semibold">
                    Full Name
                  </Typography>
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#7570BC]" />
                  <Input
                    id="name"
                    placeholder="John Doe"
                    className="pl-11 h-12 border-2 border-[#BFC7DE] focus:border-[#7570BC]"
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
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone">
                <Typography variant="label" textColor="secondary" weight="semibold">
                  Phone Number
                </Typography>
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#7570BC]" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  className="pl-11 h-12 border-2 border-[#BFC7DE] focus:border-[#7570BC]"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>

            {/* Password & Confirm */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
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
                    placeholder="Create password"
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

              <div className="space-y-2">
                <Label htmlFor="confirm-password">
                  <Typography variant="label" textColor="secondary" weight="semibold">
                    Confirm Password
                  </Typography>
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#7570BC]" />
                  <Input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm password"
                    className="pl-11 pr-11 h-12 border-2 border-[#BFC7DE] focus:border-[#7570BC]"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7570BC]"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Terms */}
            <div className="flex items-start gap-3">
              <input 
                type="checkbox" 
                className="w-5 h-5 mt-0.5 rounded border-2 border-[#BFC7DE] text-[#7570BC]"
                checked={formData.agreeToTerms}
                onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
              />
              <Typography variant="small" textColor="secondary">
                I agree to the Terms of Service and Privacy Policy
              </Typography>
            </div>

            {/* Buttons */}
            <Button 
              className="w-full h-12 bg-[#7570BC] hover:bg-[#C59594] text-white transition-all"
            >
              Create Account
            </Button>

            <div className="text-center">
              <Typography variant="paragraph" textColor="secondary">
                Already have an account?{' '}
                <button
                  onClick={() => router.push('/login')}
                  className="text-[#7570BC] hover:text-[#C59594] font-semibold"
                >
                  Sign In
                </button>
              </Typography>
            </div>

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

export default SignUp;
