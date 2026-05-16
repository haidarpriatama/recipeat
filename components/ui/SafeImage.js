"use client";

import Image from "next/image";
import { useState } from "react";
import { getSafeImageSrc } from "@/lib/images";
import { Image as ImageIcon } from "lucide-react";

export default function SafeImage({ src, alt, ...props }) {
  const [error, setError] = useState(false);
  const safeSrc = getSafeImageSrc(src, "");

  if (error || !safeSrc) {
    return (
      <div 
        className={`flex items-center justify-center bg-gray-200 text-gray-400 ${props.fill ? 'absolute inset-0 w-full h-full' : 'w-full h-full'} ${props.className || ''}`}
        style={props.style}
      >
        <ImageIcon size={props.fill ? 48 : 24} />
      </div>
    );
  }

  return (
    <Image
      {...props}
      src={safeSrc}
      alt={alt || "Image"}
      quality={props.quality ?? 70}
      onError={() => setError(true)}
    />
  );
}
