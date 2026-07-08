// components/ProfileImage.tsx
"use client";

import Image from 'next/image';
import { useState } from 'react';

interface ProfileImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
  placeholderSrc?: string;
}

export default function ProfileImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  placeholderSrc,
}: ProfileImageProps) {
  const [imgSrc, setImgSrc] = useState(src);

  const handleError = () => {
    if (placeholderSrc) {
      setImgSrc(placeholderSrc);
    }
  };

  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
      onError={handleError}
      unoptimized={process.env.NODE_ENV === 'development'} // optional – avoid optimization issues
    />
  );
}