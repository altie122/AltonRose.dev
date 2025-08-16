import { useEffect, useRef } from "react";

interface OKLCHColor {
  l: number;
  c: number;
  h: number;
}

export function ColorCycler() {
  const animationFrameRef = useRef<number | null>(null);
  const hueRef = useRef<number>(0);

  useEffect(() => {
    const updateColor = () => {
      hueRef.current = (hueRef.current + 0.5) % 360;

      const oklchColor: OKLCHColor = {
        l: 1,
        c: 0.5,
        h: hueRef.current,
      };

      const root = document.documentElement;
      root.style.setProperty(
        "--cursorGlow",
        `oklch(${oklchColor.l * 100}% ${oklchColor.c} ${oklchColor.h}deg)`
      );

      animationFrameRef.current = requestAnimationFrame(updateColor);
    };

    animationFrameRef.current = requestAnimationFrame(updateColor);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return null;
}
