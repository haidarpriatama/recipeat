'use client';

import React, { useState } from 'react';
import Image from 'next/image';

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80";

export default function SafeImage({ src, alt, ...props }) {
  const [imgSrc, setImgSrc] = useState(src || FALLBACK_IMAGE);

  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt || "Recipe Image"}
      onError={() => {
        if (imgSrc !== FALLBACK_IMAGE) {
          setImgSrc(FALLBACK_IMAGE);
        }
      }}
    />
  );
}
