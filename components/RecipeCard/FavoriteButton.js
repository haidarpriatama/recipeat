"use client";

import { useState } from 'react';
import { Heart } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function FavoriteButton({ recipeId, initialFavorited = false, className = "" }) {
  const [isFavorited, setIsFavorited] = useState(initialFavorited);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const toggleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsLoading(true);
    try {
      const res = await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipeId }),
      });

      if (res.status === 401) {
        router.push('/login');
        return;
      }

      if (res.ok) {
        const data = await res.json();
        setIsFavorited(data.favorited);
        router.refresh(); // Refresh server components to update favorite state elsewhere
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={toggleFavorite}
      disabled={isLoading}
      className={`flex h-10 w-10 items-center justify-center rounded-full bg-white/90 backdrop-blur transition-all hover:bg-white hover:scale-110 active:scale-95 disabled:opacity-50 ${
        isFavorited ? "text-red-500" : "text-[#757778]"
      } ${className}`}
      aria-label="Toggle favorite"
    >
      <Heart 
        className={`h-5 w-5 transition-colors ${isFavorited ? "fill-current" : ""}`} 
      />
    </button>
  );
}
