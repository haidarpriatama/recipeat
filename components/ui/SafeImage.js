"use client";

import Image from "next/image";
import { DEFAULT_RECIPE_IMAGE, getSafeImageSrc } from "@/lib/images";

export default function SafeImage({ src, alt, onError, ...props }) {
  const fallbackImage = props.fallbackSrc || DEFAULT_RECIPE_IMAGE;
  const safeSrc = getSafeImageSrc(src, fallbackImage);

  return (
    <Image
      {...props}
      src={safeSrc}
      alt={alt || "Recipe Image"}
      quality={props.quality ?? 70}
      onError={onError}
    />
  );
}
