"use client";
import { useState, useEffect, useRef } from 'react';

interface MousePosition {
  x: number;
  y: number;
}

export function useMousePosition(): MousePosition {
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 });
  const animationFrameRef = useRef<number | null>(null);
  const lastMousePosRef = useRef<MousePosition>({ x: 0, y: 0 });

  useEffect(() => {
    const updateMousePosition = (ev: MouseEvent) => {
      lastMousePosRef.current = { x: ev.clientX, y: ev.clientY };
      if (!animationFrameRef.current) {
        animationFrameRef.current = requestAnimationFrame(() => {
          setMousePosition(lastMousePosRef.current);
          animationFrameRef.current = null;
        });
      }
    };

    window.addEventListener('mousemove', updateMousePosition);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return mousePosition;
}