import React, { useEffect, useRef } from "react";
import katex from "katex";

interface LatexMathProps {
  math: string;
  block?: boolean;
  className?: string;
}

export const LatexMath: React.FC<LatexMathProps> = ({ math, block = false, className = "" }) => {
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (containerRef.current && math) {
      try {
        katex.render(math, containerRef.current, {
          displayMode: block,
          throwOnError: false,
          output: "htmlAndMathml",
        });
      } catch (e) {
        containerRef.current.textContent = math;
      }
    }
  }, [math, block]);

  return (
    <span
      ref={containerRef}
      className={`inline-block ${block ? "my-2 text-center overflow-x-auto max-w-full py-1" : ""} ${className}`}
    />
  );
};
