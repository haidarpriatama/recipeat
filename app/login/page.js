import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function LoginPage() {
  return (
    <div className="-mt-20 bg-[#f5f6f7] font-body text-on-surface antialiased overflow-x-hidden min-h-screen flex flex-col relative">
  
      <header className="absolute top-0 left-0 w-full z-50 flex justify-between items-center px-8 md:px-12 py-8 pointer-events-none">
        {/* Logo Kiri - Berwarna Hijau #006941 */}
        <Link 
          href="/" 
          className="text-2xl font-black tracking-tighter text-[#006941] pointer-events-auto"
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
            <div className="md:hidden text-2xl font-black tracking-tighter text-[#006941] mb-8">
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

            {/* Form Login */}
            <form className="space-y-6">
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
                  />
                </div>
              </div>
              
              {/* Tombol Sign In */}
              <button
                className="w-full py-4 bg-[#006941] hover:bg-[#004b2d] text-white font-headline font-bold text-lg rounded-full shadow-lg active:scale-[0.98] transition-all"
                type="submit"
              >
                Sign In
              </button>
            </form>

            {/* Divider */}
            <div className="relative py-4 flex items-center gap-4">
              <div className="flex-grow h-px bg-slate-200"></div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                OR CONTINUE WITH
              </span>
              <div className="flex-grow h-px bg-slate-200"></div>
            </div>

            {/* Social Login (Hanya Google, Satu Kolom Penuh) */}
            <div className="grid grid-cols-1 gap-4"> 
              <button className="flex items-center justify-center gap-3 py-3 px-4 bg-white rounded-xl border border-slate-200 shadow-sm hover:bg-slate-50 transition-all active:scale-95">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  ></path>
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  ></path>
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                    fill="#FBBC05"
                  ></path>
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  ></path>
                </svg>
                <span className="text-sm font-semibold text-slate-700">
                  Google
                </span>
              </button>
            </div>

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