'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (searchParams.get('registered') === 'true') {
      setTimeout(() => {
        setSuccessMsg('Account created successfully. Please sign in.');
      }, 0);
    }
  }, [searchParams]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const { data, error: supabaseError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (supabaseError) {
        setError(supabaseError.message);
      } else if (data.user) {
        router.push('/explore');
        router.refresh();
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="-mt-20 bg-[#f5f6f7] font-body text-on-surface antialiased overflow-x-hidden min-h-screen flex flex-col relative">
  
      <header className="absolute top-0 left-0 w-full z-50 flex justify-between items-center px-8 md:px-12 py-8 pointer-events-none">
        {/* Logo Kiri - Berwarna Hijau #006941 */}
        <Link 
          href="/" 
          className="text-2xl font-black tracking-tighter !text-[#006941] pointer-events-auto"
          style={{ color: "#006941" }}
        >
          Recipeat
        </Link>
        {/* Bagian kanan atas dibiarkan kosong sesuai permintaan */}
      </header>

      <main className="flex-grow flex flex-col md:flex-row h-screen">
        
        {/* Panel Visual Kiri */}
        <section className="hidden md:block md:w-1/2 lg:w-3/5 h-screen sticky top-0 overflow-hidden bg-slate-900">
          <div className="relative h-full w-full">
            {/* Gambar Latar (Sayuran Segar) */}
            <Image
              src="/sayurlogin.png" 
              alt="Fresh culinary ingredients"
              fill
              priority 
              className="object-cover z-0"
            />
            
            {/* Overlay Gradien Hitam di Bawah */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10"></div>
            
            {/* Teks Slogan */}
            <div className="absolute bottom-16 left-12 max-w-md z-20">
              <p className="text-white/90 font-medium tracking-widest uppercase text-sm mb-4">
                The Culinary Curator
              </p>
              <h2 className="text-white text-5xl font-extrabold tracking-tight leading-tight">
                Crafting meals as<br/>vibrant as your life.
              </h2>
            </div>
          </div>
        </section>

        {/* Panel Interaksi Kanan (Formulir) */}
        <section className="w-full md:w-1/2 lg:w-2/5 flex items-center justify-center p-6 md:p-12 lg:p-20 bg-[#f5f6f7] overflow-y-auto">
          <div className="w-full max-w-md space-y-10">
            
            {/* Logo untuk Mobile (Hanya muncul di layar kecil) */}
            <div className="md:hidden text-2xl font-black tracking-tighter !text-[#006941] mb-8" style={{ color: "#006941" }}>
              Recipeat
            </div>

            {/* Greeting */}
            <div className="space-y-4">
              <h1 className="text-4xl font-headline font-extrabold text-[#2c2f30] tracking-tight">
                Welcome back
              </h1>
              <p className="text-slate-500 font-medium">
                Step back into your kitchen curator.
              </p>
            </div>

            {/* Error & Success Messages */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                {error}
              </div>
            )}
            {successMsg && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm">
                {successMsg}
              </div>
            )}

            {/* Form Login */}
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-4">
                {/* Input Email */}
                <div className="space-y-2">
                  <label
                    className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1"
                    htmlFor="email"
                  >
                    Email Address
                  </label>
                  <input
                    className="w-full px-5 py-4 bg-white rounded-xl text-slate-800 border-none focus:ring-2 focus:ring-[#006941] shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)] transition-all placeholder:text-slate-400"
                    id="email"
                    name="email"
                    placeholder="chef@recipeat.com"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                {/* Input Password */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center ml-1">
                    <label
                      className="text-xs font-bold uppercase tracking-widest text-slate-500"
                      htmlFor="password"
                    >
                      Password
                    </label>
                    <Link
                      className="text-xs font-semibold text-[#8c4a00] hover:text-[#7b4000] transition-colors"
                      href="/forgot-password" 
                    >
                      Forgot Password?
                    </Link>
                  </div>
                  <input
                    className="w-full px-5 py-4 bg-white rounded-xl text-slate-800 border-none focus:ring-2 focus:ring-[#006941] shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)] transition-all placeholder:text-slate-400"
                    id="password"
                    name="password"
                    placeholder="••••••••"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
              {/* Tombol Sign In */}
              <button
                className="w-full py-4 bg-[#006941] hover:bg-[#004b2d] text-white font-headline font-bold text-lg rounded-full shadow-lg active:scale-[0.98] transition-all disabled:opacity-70 flex justify-center items-center"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></span>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            {/* Link ke Halaman Pendaftaran */}
            <div className="pt-6 text-center">
              <p className="text-slate-500 text-sm font-medium">
                New to the table?{' '}
                <Link
                  className="text-[#006941] font-bold ml-1 hover:underline underline-offset-4 decoration-[#006941]/30"
                  href="/signup"
                >
                  Sign Up
                </Link>
              </p>
            </div>
            
          </div>
        </section>
      </main>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#f5f6f7]">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-[#006941] border-t-transparent"></div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}