'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowRight } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call for password reset
    setTimeout(() => {
      setLoading(false);
      setIsSubmitted(true);
    }, 1500);
  };

  return (
    <div className="bg-[#f5f6f7] min-h-screen flex flex-col pt-24 font-body text-[#2c2f30]">
      <main className="flex-grow flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white p-8 md:p-10 rounded-[2rem] shadow-sm border border-slate-100">
          
          <div className="text-center mb-8">
            <h1 className="text-3xl font-headline font-extrabold tracking-tight text-[#006941] mb-3">
              Reset Password
            </h1>
            <p className="text-slate-500 font-medium">
              {isSubmitted 
                ? "Check your email for reset instructions."
                : "Enter your email address and we'll send you a link to reset your password."}
            </p>
          </div>

          {isSubmitted ? (
            <div className="space-y-6">
              <div className="bg-[#f3fcf3] text-[#006941] p-4 rounded-xl border border-[#caffdc] text-center font-medium">
                Reset link sent to <strong>{email}</strong>
              </div>
              <Link 
                href="/login"
                className="w-full py-4 bg-[#e6e8ea] hover:bg-[#dadddf] text-[#2c2f30] font-headline font-bold text-lg rounded-full transition-all flex justify-center items-center"
              >
                Return to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="block font-label text-sm font-semibold text-slate-600 ml-1" htmlFor="email">
                  Email Address
                </label>
                <div className="relative">
                  <input 
                    className="w-full bg-[#f5f6f7] border-none rounded-xl py-4 px-5 text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-[#006941] transition-all" 
                    id="email" 
                    type="email"
                    placeholder="chef@recipeat.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                </div>
              </div>

              <button 
                className="w-full py-4 bg-[#006941] hover:bg-[#004b2d] text-white font-headline font-bold text-lg rounded-full shadow-lg hover:shadow-xl active:scale-[0.98] transition-all flex justify-center items-center gap-2 group disabled:opacity-70" 
                type="submit"
                disabled={loading || !email}
              >
                {loading ? (
                  <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></span>
                ) : (
                  <>
                    Send Reset Link
                    <ArrowRight className="text-white group-hover:translate-x-1 transition-transform" size={20} />
                  </>
                )}
              </button>
              
              <div className="pt-4 text-center">
                <Link className="text-[#006941] font-semibold hover:underline" href="/login">
                  Wait, I remember my password
                </Link>
              </div>
            </form>
          )}

        </div>
      </main>
    </div>
  );
}
