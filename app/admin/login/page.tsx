'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Eye, EyeOff, Loader2, MapPin, Lock, Mail } from 'lucide-react';

export const dynamic = 'force-dynamic';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: LoginForm) => {
    setAuthError(null);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });
      if (error) {
        setAuthError(error.message === 'Invalid login credentials'
          ? 'Incorrect email or password. Please try again.'
          : error.message
        );
        return;
      }
      router.push('/admin/dashboard');
      router.refresh();
    } catch {
      setAuthError('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel — brand */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-gradient-to-br from-teal-950 via-teal-800 to-teal-700 p-12 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-teal-600/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-12 w-80 h-80 bg-saffron-500/20 rounded-full blur-3xl" />

        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-saffron-500 rounded-full flex items-center justify-center">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-display text-xl font-bold">
              Anant Anand
            </span>
          </div>
        </div>

        <div className="relative z-10">
          <h1 className="font-display text-5xl font-bold text-white leading-tight mb-4">
            Tour Package
            <br />
            Admin Portal
          </h1>
          <p className="font-devanagari text-2xl text-teal-200 mb-4">
            अनंत आनंद टूर पैकेजेस
          </p>
          <p className="text-teal-300 text-base leading-relaxed max-w-sm">
            Manage your tours, blog posts, enquiries, and site settings — all in
            one place. Designed for the non-technical owner.
          </p>
        </div>

        <div className="relative z-10 flex gap-6 text-sm text-teal-400">
          <div>
            <div className="font-display text-2xl font-bold text-white">500+</div>
            <div>Happy Families</div>
          </div>
          <div>
            <div className="font-display text-2xl font-bold text-white">50+</div>
            <div>Tours Available</div>
          </div>
          <div>
            <div className="font-display text-2xl font-bold text-white">10+</div>
            <div>Years Experience</div>
          </div>
        </div>
      </div>

      {/* Right panel — login form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-cream-50 min-h-screen">
        <div className="w-full max-w-md">
          {/* Mobile brand */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="w-10 h-10 bg-teal-700 rounded-full flex items-center justify-center">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <span className="font-display text-xl font-bold text-teal-900">
              Anant Anand Admin
            </span>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-teal-50 rounded-2xl mb-4">
                <Lock className="w-7 h-7 text-teal-700" />
              </div>
              <h2 className="font-display text-2xl font-bold text-gray-900">
                Welcome back
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                Sign in to your admin panel
              </p>
            </div>

            {/* Error banner */}
            {authError && (
              <div
                role="alert"
                className="mb-6 px-4 py-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3"
              >
                <div className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5">⚠</div>
                <p className="text-sm text-red-700">{authError}</p>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
              {/* Email */}
              <div>
                <label htmlFor="admin-email" className="label">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    id="admin-email"
                    type="email"
                    autoComplete="email"
                    placeholder="admin@example.com"
                    {...register('email')}
                    className="input-field pl-10"
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                  />
                </div>
                {errors.email && (
                  <p id="email-error" className="error-text">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label htmlFor="admin-password" className="label">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    id="admin-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    {...register('password')}
                    className="input-field pl-10 pr-10"
                    aria-invalid={!!errors.password}
                    aria-describedby={errors.password ? 'password-error' : undefined}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p id="password-error" className="error-text">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                id="login-submit"
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full mt-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Signing in…
                  </>
                ) : (
                  'Sign In to Admin Panel'
                )}
              </button>
            </form>

            <p className="text-center text-xs text-gray-400 mt-6">
              Restricted access • Anant Anand Tour Packages Admin Portal
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
