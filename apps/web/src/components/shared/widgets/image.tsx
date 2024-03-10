"use client";
import { type StaticImageData, type ImageLoaderProps } from "next/image";
import React from "react";
import { cn } from "~/lib/utils";
import NextImage from "next/image";
import { type PlaceholderValue } from "next/dist/shared/lib/get-img-props";
interface CustomImageProps
  extends Omit<ImageLoaderProps, "src" | "alt" | "width" | "height"> {
  src: string | StaticImageData;
  alt: string;
  className?: string;
  onLoad?: (event: React.SyntheticEvent<HTMLImageElement, Event>) => void;
  loading?: "eager" | "lazy";
  width?: number | `${number}` | undefined;
  height?: number | `${number}` | undefined;
  priority?: boolean;
  placeholder?: PlaceholderValue | undefined;
  blurDataURL?: string | undefined;
  unoptimized?: boolean | undefined;
  layout?: string | undefined;
  objectFit?: string | undefined;
  objectPosition?: string | undefined;
  lazyBoundary?: string | undefined;
  lazyRoot?: string | undefined;
}
export default function Image({
  src,
  alt,
  className,
  onLoad,
  ...props
}: CustomImageProps): JSX.Element {
  const handleLoad = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const image = event.currentTarget;
    image.classList.remove("opacity-0");
    if (onLoad) {
      onLoad(event);
    }
  };

  return (
    <NextImage
      {...props}
      src={src}
      alt={alt}
      onLoad={handleLoad}
      className={cn(className, "opacity-0 transition-opacity duration-500")}
    />
  );
}
