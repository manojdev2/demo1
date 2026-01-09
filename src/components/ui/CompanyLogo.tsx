"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useToast } from "./use-toast";

interface CompanyLogoProps {
  src: string | null | undefined;
  alt?: string;
  width?: number;
  height?: number;
  className?: string;
  fallbackSrc?: string;
}

export function CompanyLogo({
  src,
  alt = "Company logo",
  width = 32,
  height = 32,
  className = "",
  fallbackSrc = "/images/Anentaa -logo.svg",
}: CompanyLogoProps) {
  const [imageSrc, setImageSrc] = useState<string>(src || fallbackSrc);
  const [hasError, setHasError] = useState<boolean>(false);
  const [hasShownToast, setHasShownToast] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    if (src && src !== fallbackSrc) {
      setImageSrc(src);
      setHasError(false);
      setHasShownToast(false);
    } else {
      setImageSrc(fallbackSrc);
    }
  }, [src, fallbackSrc]);

  const handleImageError = () => {
    if (!hasError && src && src !== fallbackSrc && !hasShownToast) {
      setHasError(true);
      setImageSrc(fallbackSrc);
      setHasShownToast(true);
      toast({
        variant: "destructive",
        title: "Image Load Failed",
        description: "The company logo could not be loaded. Using default logo instead.",
      });
    } else if (!hasError) {
      setHasError(true);
      setImageSrc(fallbackSrc);
    }
  };

  return (
    <Image
      alt={alt}
      className={className}
      height={height}
      src={imageSrc}
      width={width}
      onError={handleImageError}
      unoptimized={imageSrc.startsWith("http")}
    />
  );
}

