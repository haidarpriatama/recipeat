"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Clock, Mail, Save, User } from "lucide-react";
import FavoriteButton from "@/components/RecipeCard/FavoriteButton";
import SiteFooter from "@/components/layout/SiteFooter";
import { footerContent } from "@/components/content/landingContent";
import { updateProfileAction } from "./actions";

export default function ProfileContent({ favorites = [], favoriteCount = 0, ratingCount = 0, user }) {
  const router = useRouter();
  const displayName = user?.name || user?.email || "Guest";
  const username = user?.username || displayName.split(" ")[0]?.toLowerCase() || "guest";
  const avatarUrl = user?.image || null;
  const initials = displayName
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const [formData, setFormData] = useState({
    username,
    fullName: displayName,
    email: user?.email || "",
  });
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (isSaving) return;

    setIsSaving(true);
    setSaveError("");

    try {
      await updateProfileAction({
        username: formData.username,
        fullName: formData.fullName,
      });
      setSaved(true);
      router.refresh();
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      setSaveError(error?.message || "Failed to save profile");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-[#f5f6f7] pt-8 pb-12">
        <main className="max-w-7xl mx-auto px-4 md:px-6 flex flex-col gap-8 lg:gap-10">

          {/* ── Hero Grid: Profile Card + Settings Form ── */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">

            {/* Profile Card */}
            <div className="lg:col-span-4 bg-white rounded-[2rem] shadow-sm border border-slate-100 p-8 flex flex-col items-center text-center relative overflow-hidden group transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-[#006941]/5 to-transparent pointer-events-none rounded-[2rem]" />

              {/* Avatar */}
              <div className="relative mb-6 flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-[#006941] text-white shadow-lg z-10">
                {avatarUrl ? (
                  <Image
                    src={avatarUrl}
                    alt="Profile avatar"
                    fill
                    sizes="128px"
                    className="object-cover"
                  />
                ) : (
                  <span className="text-3xl font-bold">{initials}</span>
                )}
              </div>

              <h1 className="font-headline text-2xl font-bold text-[#2c2f30] mb-1 z-10">
                {formData.fullName}
              </h1>
              <p className="text-slate-500 mb-6 z-10 font-medium">
                @{formData.username}
              </p>

              {/* Stats */}
              <div className="flex gap-4 w-full z-10 mt-auto">
                <div className="flex-1 bg-[#eff1f2] rounded-xl p-3">
                  <p className="font-headline font-bold text-[#006941] text-xl">{ratingCount}</p>
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mt-0.5">
                    Ratings
                  </p>
                </div>
                <div className="flex-1 bg-[#eff1f2] rounded-xl p-3">
                  <p className="font-headline font-bold text-[#006941] text-xl">{favoriteCount}</p>
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mt-0.5">
                    Saved
                  </p>
                </div>
              </div>
            </div>

            {/* Account Settings Form */}
            <div className="lg:col-span-8 bg-[#e6e8ea] rounded-[2rem] p-8 lg:p-10 h-full flex flex-col">
              <h2 className="font-headline text-2xl font-extrabold tracking-tight text-[#2c2f30] mb-8">
                Account Settings
              </h2>

              <form
                className="space-y-6 flex flex-col flex-1"
                onSubmit={handleSave}
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
                      readOnly
                      className="w-full bg-white rounded-xl border-none py-3 pl-11 pr-4 text-[#2c2f30] shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] focus:ring-2 focus:ring-[#7bfeb8] outline-none font-body text-sm transition-all"
                    />
                  </div>
                </div>

                {/* Save button */}
                <div className="mt-auto pt-6 flex justify-end">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex items-center gap-2 bg-[#006941] text-white font-headline font-bold py-3.5 px-8 rounded-xl shadow-lg hover:bg-[#005c38] hover:shadow-xl transition-all duration-300 active:scale-95"
                  >
                    <Save size={16} />
                    {isSaving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
                  </button>
                </div>
                {saveError ? <p className="text-sm font-medium text-[#b31b25]">{saveError}</p> : null}
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

            {favorites.length === 0 ? (
              <div className="rounded-[1.5rem] border border-slate-100 bg-white p-10 text-center text-slate-500">
                No favorites yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {favorites.map((recipe) => (
                  <article
                    key={recipe.id}
                    className="bg-white rounded-[1.5rem] p-4 shadow-sm hover:shadow-xl flex flex-col gap-5 group cursor-pointer transition-all duration-300 hover:-translate-y-2 border border-slate-100"
                  >
                    <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-slate-100">
                      <Link href={`/recipes/${recipe.id}`} className="block h-full">
                        <Image
                          src={recipe.image}
                          alt={recipe.alt}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        />
                      </Link>
                      <FavoriteButton
                        recipeId={recipe.id}
                        initialFavorited={true}
                        className="absolute top-3 right-3"
                      />
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

                      <Link href={`/recipes/${recipe.id}`}>
                        <h3 className="font-headline font-bold text-xl leading-tight text-slate-800 group-hover:text-[#006941] transition-colors">
                          {recipe.title}
                        </h3>
                      </Link>

                      <div className="mt-auto flex items-center justify-end text-slate-500 text-sm pt-2">
                        <div className="flex items-center gap-1 font-medium">
                          <Clock size={16} />
                          <span>{recipe.time}</span>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
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
