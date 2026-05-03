"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Clock,
  Heart,
  Mail,
  Save,
  Star,
  User,
} from "lucide-react";
import SiteFooter from "@/components/layout/SiteFooter";
import { footerContent } from "@/components/content/landingContent";
import { supabase } from "@/lib/supabaseClient";

// --------------- Favourite recipe data ---------------
const FAVORITE_RECIPES = [
  {
    id: 1,
    title: "Artisan Avocado Toast",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBYunktJJg0jp7YCZQB5UjqMPUICaqCLwp0oGsuy88pIquqnFhEieOLNGBsRP2L84XnrBOqAblatTzOPgAsxO2x5HA6B439DnvE6VjRBfRmY7G3CfYHnp2Cjd9ICjuvA53hten6NsXhmIP4G80xGJwFsmgeWDHyG-6dV1QuCOhhWcXuGc1b100IOE7Xpuoq_yF23TTGQsh3vkVLCZbH_fwXOZ7LwddJmBeLVCw3sGvOyNC-0EjrH1QPmRP5EK8Y7yEwiznSw9d8MjbP",
    alt: "Artisan sourdough avocado toast with microgreens",
    rating: "4.9",
    time: "15 min",
    tags: ["Breakfast", "Quick"],
  },
  {
    id: 2,
    title: "Harvest Buddha Bowl",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAUKwD8esOKMs8ahlQdlALQFLlAt945U4zm14pi_fNCi16zq43Uhyqf7uRRZuhO0W-GYsZRVkejR0tLly3BNhtnYBwwQ-1ttyD-037FkzJvvk9LQ2Ae5xsiyKoIcNKlbA2fBya7nbPZ-ecSDcFMnqzLI1vhvqyfh0gD1tVkSY0VinnJoIIZKClM3cf5nGnaQeYzpE3Zstp5mt1FNNTO_BkVX0Cu5vPXgvntOi2rdatyTng0DreYrV6HL2kxiqqFoN_FWSlkyoLhzD9B",
    alt: "Vegan buddha bowl with quinoa and roasted sweet potatoes",
    rating: "4.8",
    time: "35 min",
    tags: ["Vegan", "Healthy"],
  },
  {
    id: 3,
    title: "Rustic Pesto Pasta",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBbQ36MCUhr_uC15qV9qFzh6cH-tg_8lPKLNNoCcnUaoKnvoL17h-nRUNWMYYfE96RxhAC1WCpgNHunHCY6KDrv_4McGEk8jUDK3-QarYofNY26gABBKjy8pVGB3AKbg6JyJ9mE4hT5KPV088zYXdrLjxQrmPLcadwXL6wx4r3TUYIymJfPXHIE8CUbvM78PtK3IrC89Ne3_WWlx3qxeVg4X47jRHluePllPlj4TPstMxjc6iQD9pbBDKyfoRXY_mg2tVnWqqJSsmTO",
    alt: "Fresh basil pesto pasta with cherry tomatoes",
    rating: "5.0",
    time: "25 min",
    tags: ["Comfort Food", "Dinner"],
  },
];

const AVATAR_URL =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBBgil31kVK_AuFTC6fWU7FOCH9iz0_hqgfgxzAhxE3o5I0k0JqTIqHmew7S3xoYB7v9wibwNlmoJYF5guu-vFSGLCTed_U1D3PHURjtR5BGHtWXEOG2Yfx7G64dvQfHEdEL51afvX5Ikbq2FnLN_DcEa9OklYAo5ELC35jEDdWA_unZywmpNKxS6TT_QcLSSikv77IZQwyLLEvYfNAV6l1UP5NtN_xt9Uud_0PbVOn01WSCuf4yrYkuR_1RQwsB1acoCOybIYQviQI";

export default function ProfileContent() {
  const router = useRouter();

  // ── Auth guard: redirect to login if not logged in ──
  const [authChecked, setAuthChecked] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.replace("/login");
      } else {
        setUser(session.user);
        setAuthChecked(true);
        // Prefill name + email from Supabase user
        const meta = session.user.user_metadata;
        setFormData((prev) => ({
          ...prev,
          fullName: meta?.name || meta?.full_name || prev.fullName,
          email: session.user.email || prev.email,
        }));
      }
    });
  }, [router]);

  // Form state
  const [formData, setFormData] = useState({
    username: "sarahcooks",
    fullName: "Sarah Jenkins",
    email: "sarah.jenkins@example.com",
    bio: "Culinary enthusiast and amateur food photographer. Believes that every meal should be an occasion.",
  });
  const [saved, setSaved] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f6f7]">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-[#006941] border-t-transparent" />
      </div>
    );
  }

  const avatarUrl = user?.user_metadata?.avatar_url || AVATAR_URL;

  return (
    <>
      <div className="min-h-screen bg-[#f5f6f7] pt-8 pb-12">
        <main className="max-w-7xl mx-auto px-4 md:px-6 flex flex-col gap-12 lg:gap-16">

          {/* ── Hero Grid: Profile Card + Settings Form ── */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            {/* Profile Card */}
            <div className="lg:col-span-4 bg-white rounded-[2rem] shadow-sm border border-slate-100 p-8 flex flex-col items-center text-center relative overflow-hidden group transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-[#006941]/5 to-transparent pointer-events-none rounded-[2rem]" />

              {/* Avatar */}
              <div className="relative w-32 h-32 rounded-full overflow-hidden mb-6 border-4 border-white shadow-lg z-10">
                <Image
                  src={avatarUrl}
                  alt="Profile avatar"
                  fill
                  sizes="128px"
                  className="object-cover"
                />
              </div>

              <h1 className="font-headline text-2xl font-bold text-[#2c2f30] mb-1 z-10">
                {formData.fullName}
              </h1>
              <p className="text-slate-500 mb-4 z-10 font-medium">
                @{formData.username}
              </p>
              <p className="text-sm text-slate-500 leading-relaxed mb-6 z-10">
                {formData.bio}
              </p>

              {/* Stats */}
              <div className="flex gap-4 w-full z-10">
                <div className="flex-1 bg-[#eff1f2] rounded-xl p-3">
                  <p className="font-headline font-bold text-[#006941] text-xl">42</p>
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mt-0.5">
                    Recipes
                  </p>
                </div>
                <div className="flex-1 bg-[#eff1f2] rounded-xl p-3">
                  <p className="font-headline font-bold text-[#006941] text-xl">128</p>
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mt-0.5">
                    Saved
                  </p>
                </div>
              </div>
            </div>

            {/* Account Settings Form */}
            <div className="lg:col-span-8 bg-[#e6e8ea] rounded-[2rem] p-8 lg:p-10">
              <h2 className="font-headline text-2xl font-extrabold tracking-tight text-[#2c2f30] mb-8">
                Account Settings
              </h2>

              <form
                className="space-y-6"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSave();
                }}
              >
                {/* Username + Full Name row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-[#2c2f30]" htmlFor="username">
                      Username
                    </label>
                    <div className="relative">
                      <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        id="username"
                        type="text"
                        value={formData.username}
                        onChange={handleChange}
                        className="w-full bg-white rounded-xl border-none py-3 pl-11 pr-4 text-[#2c2f30] shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] focus:ring-2 focus:ring-[#7bfeb8] outline-none font-body text-sm transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-[#2c2f30]" htmlFor="fullName">
                      Full Name
                    </label>
                    <input
                      id="fullName"
                      type="text"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full bg-white rounded-xl border-none py-3 px-4 text-[#2c2f30] shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] focus:ring-2 focus:ring-[#7bfeb8] outline-none font-body text-sm transition-all"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#2c2f30]" htmlFor="email">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-white rounded-xl border-none py-3 pl-11 pr-4 text-[#2c2f30] shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] focus:ring-2 focus:ring-[#7bfeb8] outline-none font-body text-sm transition-all"
                    />
                  </div>
                </div>

                {/* Bio */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#2c2f30]" htmlFor="bio">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    rows={3}
                    value={formData.bio}
                    onChange={handleChange}
                    className="w-full bg-white rounded-xl border-none py-3 px-4 text-[#2c2f30] shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] focus:ring-2 focus:ring-[#7bfeb8] outline-none font-body text-sm resize-none transition-all"
                  />
                </div>

                {/* Save button */}
                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="flex items-center gap-2 bg-[#006941] text-white font-headline font-bold py-3.5 px-8 rounded-xl shadow-lg hover:bg-[#005c38] hover:shadow-xl transition-all duration-300 active:scale-95"
                  >
                    <Save size={16} />
                    {saved ? "Saved!" : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </section>

          {/* ── Favourite Recipes Section ── */}
          <section className="pb-8">
            <div className="flex justify-between items-end mb-8">
              <div>
                <h2 className="font-headline text-3xl font-extrabold tracking-tight text-[#2c2f30]">
                  Favorite Recipes
                </h2>
                <p className="text-slate-500 mt-2">
                  Your curated collection of culinary delights.
                </p>
              </div>

              <Link
                href="/favorites"
                className="hidden md:flex items-center gap-1 text-[#006941] font-semibold text-sm hover:text-[#004b2d] transition-colors"
              >
                View All <ArrowRight size={16} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {FAVORITE_RECIPES.map((recipe) => (
                <article
                  key={recipe.id}
                  className="bg-white rounded-[1.5rem] p-4 shadow-sm hover:shadow-xl flex flex-col gap-5 group cursor-pointer transition-all duration-300 hover:-translate-y-2 border border-slate-100"
                >
                  <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-slate-100">
                    <Image
                      src={recipe.image}
                      alt={recipe.alt}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <button className="absolute top-3 right-3 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-red-500 hover:bg-white transition-colors shadow-md">
                      <Heart size={18} fill="currentColor" />
                    </button>
                  </div>

                  <div className="flex flex-col flex-grow space-y-3 px-2">
                    <div className="flex flex-wrap gap-2">
                      {recipe.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-[#f3fcf3] text-[#006941] text-xs font-semibold rounded-lg"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <h3 className="font-headline font-bold text-xl leading-tight text-slate-800 group-hover:text-[#006941] transition-colors">
                      {recipe.title}
                    </h3>

                    <div className="mt-auto flex items-center justify-between text-slate-500 text-sm pt-2">
                      <div className="flex items-center gap-1 text-[#8c4a00]">
                        <Star size={16} fill="currentColor" />
                        <span className="font-bold">{recipe.rating}</span>
                      </div>
                      <div className="flex items-center gap-1 font-medium">
                        <Clock size={16} />
                        <span>{recipe.time}</span>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </main>
      </div>

      <SiteFooter
        brand={footerContent.brand}
        legalText={footerContent.legalText}
        socialItems={footerContent.socialItems}
        linkGroups={footerContent.linkGroups}
      />
    </>
  );
}
