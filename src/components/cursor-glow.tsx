"use client";
import { useState, useEffect, type CSSProperties } from "react";
import { useMousePosition } from "@/hooks/use-mouse-position";

interface CursorGlowProps {
  glowColor?: string;
  glowSize?: string;
  blurAmount?: string;
  lerpFactor?: number;
}

export function CursorGlow({
  glowColor = "rgba(255, 0, 0, 0.4)",
  glowSize = "200px",
  blurAmount = "100px",
  lerpFactor = 0.1, // A value between 0 and 1. Lower means slower/more lag.
}: CursorGlowProps) {
  const { x: mouseX, y: mouseY } = useMousePosition();
  const [currentGlowX, setCurrentGlowX] = useState(0);
  const [currentGlowY, setCurrentGlowY] = useState(0);

  useEffect(() => {
    let animationFrameId: number;

    const animateGlow = () => {
      const parsedGlowSize = parseFloat(glowSize);
      const targetGlowX = mouseX - parsedGlowSize / 2;
      const targetGlowY = mouseY - parsedGlowSize / 2;

      const newGlowX = currentGlowX + (targetGlowX - currentGlowX) * lerpFactor;
      const newGlowY = currentGlowY + (targetGlowY - currentGlowY) * lerpFactor;

      const threshold = 0.1;
      if (
        Math.abs(newGlowX - currentGlowX) > threshold ||
        Math.abs(newGlowY - currentGlowY) > threshold ||
        (Math.abs(targetGlowX - currentGlowX) < threshold &&
          Math.abs(targetGlowY - currentGlowY) < threshold)
      ) {
        setCurrentGlowX(newGlowX);
        setCurrentGlowY(newGlowY);
      }

      animationFrameId = requestAnimationFrame(animateGlow);
    };

    animationFrameId = requestAnimationFrame(animateGlow);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [mouseX, mouseY, lerpFactor, glowSize, currentGlowX, currentGlowY]);

  const glowStyle: CSSProperties = {
    backgroundColor: glowColor,
    filter: `blur(${blurAmount})`,
    transform: `translate(${currentGlowX}px, ${currentGlowY}px)`,
    height: glowSize,
    width: glowSize,
  };

  return (
    <div
      className='fixed left-0 top-0 rounded-full pointer-events-none will-change-transform'
      style={glowStyle}
    />
  );
}
