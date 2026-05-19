"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { useRouter } from "next/navigation";

export default function UserRecipeRating({ recipeId }) {
  const router = useRouter();
  const [rating, setRating] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  useEffect(() => {
    // Fungsi untuk mengambil data rating berdasarkan recipeId dan session user aktif
    const fetchRating = async () => {
      try {
        const response = await fetch(`/api/ratings/${recipeId}`);
        const data = await response.json();
        setRating(data.rating !== null ? data.rating : null); // Mengatur nilai rating (1-5), atau null
      } catch (error) {
        console.error("Error fetching rating:", error);
        setRating(null);
      } finally {
        setLoading(false);
      }
    };

    fetchRating();
  }, [recipeId]);

  const handleRating = async (score) => {
    if (submitting) return;
    setSubmitting(true);
    
    // Optimistic update
    const previousRating = rating;
    setRating(score);

    try {
      const res = await fetch(`/api/ratings/${recipeId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ score }),
      });

      if (!res.ok) {
        throw new Error("Failed to submit rating");
      }
      
      router.refresh();
    } catch (error) {
      console.error("Error submitting rating:", error);
      // Revert if failed
      setRating(previousRating);
    } finally {
      setSubmitting(false);
    }
  };

  // Tampilan skeleton loading saat mengambil data
  if (loading) {
    return <div className="h-6 w-32 animate-pulse rounded-md bg-slate-200" />;
  }

  // Menentukan rating yang akan ditampilkan (prioritas hover saat interaksi)
  const displayRating = hoverRating > 0 ? hoverRating : rating || 0;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, index) => {
          const starValue = index + 1;
          const isFilled = starValue <= displayRating;
          
          return (
            <button
              key={index}
              type="button"
              disabled={submitting}
              onMouseEnter={() => setHoverRating(starValue)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => handleRating(starValue)}
              className={`transition-all duration-200 focus:outline-none ${
                submitting ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:scale-110"
              }`}
              aria-label={`Rate ${starValue} stars`}
            >
              <Star
                className={`h-5 w-5 md:h-6 md:w-6 transition-colors ${
                  isFilled
                    ? "fill-amber-400 text-amber-400"
                    : "fill-transparent text-slate-300"
                }`}
              />
            </button>
          );
        })}
        {rating && (
          <span className="ml-2 text-sm font-bold text-amber-600">
            {rating}/5
          </span>
        )}
      </div>
      
      {!rating && !hoverRating && (
        <span className="text-xs font-medium text-slate-400">
          Belum ada rating dari Anda. Klik bintang untuk menilai!
        </span>
      )}
    </div>
  );
}
