import React, { useState, forwardRef } from "react";
import { cn } from "@/lib/utils/tw";
import { Spinner } from "@/components/ui/spinner";

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
}

export const Image = forwardRef<HTMLImageElement, ImageProps>(
  ({ src, alt, className, ...props }, ref) => {
    const [isLoading, setIsLoading] = useState(true);

    return (
      <div className={cn("relative", className)}>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Spinner size="lg" />
          </div>
        )}
        <img
          ref={ref}
          src={src}
          alt={alt}
          onLoad={() => setIsLoading(false)}
          className={cn("w-full h-full object-cover", {
            "opacity-0": isLoading,
          })}
          {...props}
        />
      </div>
    );
  },
);

Image.displayName = "Image";
