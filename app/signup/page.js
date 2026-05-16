'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle2, Mail, Lock, ArrowRight, User } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

export default function SignUpPage() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '', terms: false });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState('');

  const getSignupErrorMessage = (err) => {
    if (!err) return 'Failed to create account';
    
    // Safely extract message whether it's an Error object or a string
    const message = typeof err === 'string' ? err : (err.message || '');
    const normalizedMessage = String(message).toLowerCase();

    if (
      normalizedMessage.includes('rate limit') ||
      normalizedMessage.includes('too many requests') ||
      normalizedMessage.includes('email rate limit')
    ) {
      return 'Email rate limit exceeded. Please try again later.';
    }

    return message || 'Failed to create account. Please try again.';
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!formData.terms) {
      setError('Please accept the Terms of Service and Privacy Policy');
      setLoading(false);
      return;
    }

    try {
      const { error: supabaseError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.username,
          },
        },
      });

      if (supabaseError) {
        throw new Error(supabaseError.message);
      }

      setVerificationEmail(formData.email);
    } catch (err) {
      setError(getSignupErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  if (verificationEmail) {
    return (
      <div className="bg-[#f5f6f7] font-body text-on-surface antialiased overflow-x-hidden min-h-screen flex flex-col relative">
        <header className="absolute top-0 left-0 w-full z-50 flex justify-between items-center px-8 md:px-12 py-8 pointer-events-none">
          <Link
            href="/"
            className="text-2xl font-black tracking-tighter !text-[#006941] pointer-events-auto"
            style={{ color: '#006941' }}
          >
            Recipeat
          </Link>
        </header>

        <main className="flex-grow flex flex-col md:flex-row h-screen">
          <section className="relative hidden md:block md:w-1/2 lg:w-3/5 h-screen overflow-hidden bg-slate-900">
            <Image
              src="/sayursignup.png"
              alt="Fresh organic kale and ingredients"
              fill
              priority
              className="object-cover z-0 opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-[#f5f6f7]/20 z-10"></div>

            <div className="absolute bottom-12 left-8 right-8 md:bottom-24 md:left-16 md:max-w-md z-20">
              <div className="bg-white/70 backdrop-blur-xl p-8 rounded-2xl border border-white/40 shadow-2xl">
                <h2 className="font-headline font-extrabold text-3xl md:text-4xl text-[#006941] tracking-tight leading-tight">
                  Your account is almost ready.
                </h2>
                <p className="mt-4 text-slate-700 font-medium text-lg leading-relaxed">
                  Confirm your email to unlock personalized meal plans and smart ingredient tracking.
                </p>
                <div className="mt-6 flex gap-2">
                  <div className="h-1.5 w-12 bg-[#006941] rounded-full"></div>
                  <div className="h-1.5 w-4 bg-[#006941]/30 rounded-full"></div>
                  <div className="h-1.5 w-4 bg-[#006941]/30 rounded-full"></div>
                </div>
              </div>
            </div>
          </section>

          <section className="w-full md:w-1/2 lg:w-2/5 flex items-center justify-center p-6 md:p-12 lg:p-24 bg-[#f5f6f7] overflow-y-auto">
            <div className="w-full max-w-md space-y-8 pt-24 pb-12">
              <div className="md:hidden mb-8 text-center">
                <span className="text-3xl font-black !text-[#006941] font-headline" style={{ color: '#006941' }}>
                  Recipeat
                </span>
              </div>

              <div className="space-y-4 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#e9f9ef] text-[#006941] shadow-sm">
                  <CheckCircle2 size={32} />
                </div>
                <div className="space-y-2">
                  <h1 className="font-headline font-bold text-4xl text-[#2c2f30] tracking-tight">
                    Check your email
                  </h1>
                  <p className="text-slate-500 font-medium">
                    We sent a verification link to {verificationEmail}. Click it to finish creating your account.
                  </p>
                </div>
              </div>

              <div className="rounded-3xl border border-[#d9e8dd] bg-white p-6 md:p-8 shadow-[0_30px_60px_rgba(44,47,48,0.08)] space-y-5">
                <div className="flex items-start gap-4 rounded-2xl bg-[#f3fcf3] p-4 text-left">
                  <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#006941] shadow-sm">
                    <Mail size={18} />
                  </div>
                  <div className="space-y-1">
                    <p className="font-semibold text-[#2c2f30]">Verification email sent</p>
                    <p className="text-sm leading-6 text-slate-600">
                      If it does not arrive in a minute, check your spam or promotions folder.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/login"
                    className="inline-flex flex-1 items-center justify-center rounded-xl bg-[#006941] px-5 py-3.5 font-headline font-bold text-white transition-all hover:bg-[#004b2d]"
                  >
                    Go to Sign In
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setVerificationEmail('');
                      setError('');
                    }}
                    className="inline-flex flex-1 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3.5 font-headline font-bold text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-50"
                  >
                    Use different email
                  </button>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="bg-[#f5f6f7] font-body text-on-surface antialiased overflow-x-hidden min-h-screen flex flex-col relative">
      <header className="absolute top-0 left-0 w-full z-50 flex justify-between items-center px-8 md:px-12 py-8 pointer-events-none">
        <Link
          href="/"
          className="text-2xl font-black tracking-tighter !text-[#006941] pointer-events-auto"
          style={{ color: '#006941' }}
        >
          Recipeat
        </Link>
      </header>

      <main className="flex-grow flex flex-col md:flex-row h-screen">
        <section className="relative hidden md:block md:w-1/2 lg:w-3/5 h-screen overflow-hidden bg-slate-900">
          <Image
            src="/sayursignup.png"
            alt="Fresh organic kale and ingredients"
            fill
            priority
            className="object-cover z-0 opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-[#f5f6f7]/20 z-10"></div>

          <div className="absolute bottom-12 left-8 right-8 md:bottom-24 md:left-16 md:max-w-md z-20">
            <div className="bg-white/70 backdrop-blur-xl p-8 rounded-2xl border border-white/40 shadow-2xl">
              <h2 className="font-headline font-extrabold text-3xl md:text-4xl text-[#006941] tracking-tight leading-tight">
                Join the Culinary Curator community.
              </h2>
              <p className="mt-4 text-slate-700 font-medium text-lg leading-relaxed">
                Unlock personalized meal plans and smart ingredient tracking.
              </p>
              <div className="mt-6 flex gap-2">
                <div className="h-1.5 w-12 bg-[#006941] rounded-full"></div>
                <div className="h-1.5 w-4 bg-[#006941]/30 rounded-full"></div>
                <div className="h-1.5 w-4 bg-[#006941]/30 rounded-full"></div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full md:w-1/2 lg:w-2/5 flex items-center justify-center p-6 md:p-12 lg:p-24 bg-[#f5f6f7] overflow-y-auto">
          <div className="w-full max-w-md space-y-8 pt-24 pb-12">
            <div className="md:hidden mb-8 text-center">
              <span className="text-3xl font-black !text-[#006941] font-headline" style={{ color: '#006941' }}>
                Recipeat
              </span>
            </div>

            <div className="space-y-2 mb-10">
              <h1 className="font-headline font-bold text-4xl text-[#2c2f30] tracking-tight">Create Account</h1>
              <p className="text-slate-500 font-medium">Start your fresh culinary journey today</p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label className="block font-label text-sm font-semibold text-slate-600 ml-1" htmlFor="username">
                  Username
                </label>
                <div className="relative">
                  <input
                    className="w-full bg-white border-none rounded-xl py-4 px-5 text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-[#006941] shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)] transition-all"
                    id="username"
                    name="username"
                    placeholder="chef_curator"
                    type="text"
                    value={formData.username}
                    onChange={handleChange}
                    autoComplete="username"
                    required
                  />
                  <User className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block font-label text-sm font-semibold text-slate-600 ml-1" htmlFor="email">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    className="w-full bg-white border-none rounded-xl py-4 px-5 text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-[#006941] shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)] transition-all"
                    id="email"
                    name="email"
                    placeholder="you@kitchen.com"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="email"
                    required
                  />
                  <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block font-label text-sm font-semibold text-slate-600 ml-1" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <input
                    className="w-full bg-white border-none rounded-xl py-4 px-5 text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-[#006941] shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)] transition-all"
                    id="password"
                    name="password"
                    placeholder="••••••••"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                    required
                  />
                  <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                </div>
              </div>

              <div className="flex items-start gap-3 py-2">
                <div className="relative flex items-center h-5">
                  <input
                    className="h-5 w-5 rounded border-slate-300 text-[#006941] focus:ring-[#006941]/20 transition-all cursor-pointer"
                    id="terms"
                    name="terms"
                    type="checkbox"
                    checked={formData.terms}
                    onChange={handleChange}
                  />
                </div>
                <label className="text-sm text-slate-600 leading-tight" htmlFor="terms">
                  I agree to the <Link href="#" className="text-[#006941] font-semibold hover:underline">Terms of Service</Link> and <Link href="#" className="text-[#006941] font-semibold hover:underline">Privacy Policy</Link>
                </label>
              </div>

              <button
                className="w-full py-4 bg-gradient-to-r from-[#006941] to-[#004b2d] text-white font-headline font-bold text-lg rounded-xl shadow-lg hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></span>
                    Creating...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="text-white group-hover:translate-x-1 transition-transform" size={20} />
                  </>
                )}
              </button>
            </form>

            <div className="mt-12 text-center">
              <p className="text-slate-500 font-medium">
                Already have an account?
                <Link className="text-[#006941] font-bold hover:text-[#004b2d] transition-colors ml-2" href="/login">
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}