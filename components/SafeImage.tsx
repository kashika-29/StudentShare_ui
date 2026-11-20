'use client';

import { useState } from 'react';
import Image from 'next/image';

interface SafeImageProps {
  src: string;
  alt: string;
  fallback?: string;
  className?: string;
  fill?: boolean;
  sizes?: string;
  width?: number;
  height?: number;
  priority?: boolean;
}

/**
 * SafeImage component that handles invalid image URLs gracefully.
 * - Validates if URL is a direct image URL
 * - Falls back to placeholder on error
 * - Prevents crashes from invalid domains
 */
export default function SafeImage({
  src,
  alt,
  fallback,
  className,
  fill,
  sizes,
  width,
  height,
  priority = false,
}: SafeImageProps) {
  const [error, setError] = useState(false);
  const [isValid, setIsValid] = useState(false);

  // Check if URL is a direct image URL (has image extension)
  const isDirectImageUrl = (url: string): boolean => {
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname.toLowerCase();
      return (
        pathname.endsWith('.jpg') ||
        pathname.endsWith('.jpeg') ||
        pathname.endsWith('.png') ||
        pathname.endsWith('.gif') ||
        pathname.endsWith('.webp') ||
        pathname.endsWith('.svg') ||
        pathname.endsWith('.bmp')
      );
    } catch {
      return false;
    }
  };

  // Check if URL is a local public folder path
  const isLocalImage = (url: string): boolean => {
    return url.startsWith('/') && (url.endsWith('.jpg') || url.endsWith('.jpeg') || url.endsWith('.png') || url.endsWith('.gif') || url.endsWith('.webp') || url.endsWith('.svg'));
  };

  // Check if URL is from a configured domain (Unsplash)
  const isConfiguredDomain = (url: string): boolean => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname === 'images.unsplash.com';
    } catch {
      return false;
    }
  };

  // Determine the final image source
  // If src is empty or invalid, use fallback
  const hasValidSrc = src && src.trim() !== '';
  const imageSrc = (!hasValidSrc || error) ? fallback : src;

  // If there's no image source at all (no src and no fallback), render placeholder
  if (!imageSrc) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gray-100 ${className || ''}`}
        style={fill ? { position: 'absolute', inset: 0 } : {}}
      >
        <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span className="text-gray-500 text-xs font-medium">No image available</span>
      </div>
    );
  }

  // If it's a local image (from public folder), use regular img tag
  if (isLocalImage(imageSrc)) {
    return (
      <img
        src={imageSrc}
        alt={alt}
        className={className}
        style={fill ? { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' } : {}}
        onError={() => setError(true)}
        onLoad={() => setIsValid(true)}
      />
    );
  }

  // If it's a configured domain, use Next.js Image
  if (isConfiguredDomain(imageSrc)) {
    return (
      <Image
        src={imageSrc}
        alt={alt}
        className={className}
        fill={fill}
        sizes={sizes}
        width={width}
        height={height}
        priority={priority}
        onError={() => setError(true)}
      />
    );
  }

  // For other valid image URLs, use regular img tag with error handling
  if (isDirectImageUrl(imageSrc)) {
    return (
      <img
        src={imageSrc}
        alt={alt}
        className={className}
        style={fill ? { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' } : {}}
        onError={() => setError(true)}
        onLoad={() => setIsValid(true)}
      />
    );
  }

  // Fallback for invalid URLs
  return (
    <div
      className={`flex flex-col items-center justify-center bg-gray-100 ${className || ''}`}
      style={fill ? { position: 'absolute', inset: 0 } : {}}
    >
      <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      <span className="text-gray-500 text-xs font-medium">No image available</span>
    </div>
  );
}
