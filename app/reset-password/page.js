'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

function ResetPasswordForm() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: password
      });

      if (updateError) throw updateError;

      setIsSubmitted(true);
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (err) {
      console.error('Password update error:', err);
      setError(err.message || 'Failed to update password. Link may have expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#f5f6f7] min-h-screen flex flex-col pt-24 font-body text-[#2c2f30]">
      <main className="flex-grow flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white p-8 md:p-10 rounded-[2rem] shadow-sm border border-slate-100">
          
          <div className="text-center mb-8">
            <h1 className="text-3xl font-headline font-extrabold tracking-tight text-[#006941] mb-3">
              New Password
            </h1>
            <p className="text-slate-500 font-medium">
              {isSubmitted 
                ? "Your password has been reset successfully."
                : "Please enter your new password below."}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              {error}
            </div>
          )}

          {isSubmitted ? (
            <div className="space-y-6 text-center">
              <div className="flex justify-center mb-4">
                <CheckCircle2 size={64} className="text-[#006941]" />
              </div>
              <p className="text-slate-600">Redirecting you to login...</p>
              <Link 
                href="/login"
                className="w-full py-4 bg-[#006941] text-white font-headline font-bold text-lg rounded-full transition-all flex justify-center items-center"
              >
                Go to Login Now
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block font-label text-sm font-semibold text-slate-600 ml-1" htmlFor="password">
                    New Password
                  </label>
                  <div className="relative">
                    <input 
                      className="w-full bg-[#f5f6f7] border-none rounded-xl py-4 px-5 text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-[#006941] transition-all" 
                      id="password" 
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block font-label text-sm font-semibold text-slate-600 ml-1" htmlFor="confirmPassword">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input 
                      className="w-full bg-[#f5f6f7] border-none rounded-xl py-4 px-5 text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-[#006941] transition-all" 
                      id="confirmPassword" 
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                    <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  </div>
                </div>
              </div>

              <button 
                className="w-full py-4 bg-[#006941] hover:bg-[#004b2d] text-white font-headline font-bold text-lg rounded-full shadow-lg hover:shadow-xl active:scale-[0.98] transition-all flex justify-center items-center gap-2 group disabled:opacity-70" 
                type="submit"
                disabled={loading || !password}
              >
                {loading ? (
                  <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></span>
                ) : (
                  <>
                    Reset Password
                    <ArrowRight className="text-white group-hover:translate-x-1 transition-transform" size={20} />
                  </>
                )}
              </button>
            </form>
          )}

        </div>
      </main>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
