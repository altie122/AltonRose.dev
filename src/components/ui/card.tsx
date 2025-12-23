import * as React from "react";

import { cn } from "@/lib";
import { motion, type HTMLMotionProps } from "motion/react";
import { useRef, useState } from "react";
import { useReducedMotionState } from "../reduced-motion-dialog";

function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot='card'
      className={cn(
        "text-card-foreground flex flex-col gap-6 rounded-xl border p-4 backdrop-blur-sm transition-colors duration-300 bg-black/10 shadow-xl",
        className
      )}
      {...props}
    />
  );
}

function LinkedCard({ className, ...props }: React.ComponentProps<"a">) {
  const [prefersReducedMotion] = useReducedMotionState();
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!cardRef.current) return;

    const { left, top, width, height } =
      cardRef.current.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;

    setTilt({
      x: -y * 15,
      y: x * 15,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  if (
    prefersReducedMotion === "less-motion" ||
    prefersReducedMotion === "no-motion" ||
    prefersReducedMotion === "no-motion-unchecked"
  ) {
    return (
      <a
        data-slot='card'
        {...props}
        className={cn(
          "text-card-foreground flex flex-col gap-6 rounded-xl border p-4 backdrop-blur-sm transition-colors duration-300 bg-black/10 shadow-xl",
          className
        )}
      />
    );
  }

  return (
    <div ref={cardRef}>
      <motion.a
        data-slot='card'
        {...(props as HTMLMotionProps<"a">)}
        className={cn(
          "text-card-foreground flex flex-col gap-6 rounded-xl border p-4 backdrop-blur-sm transition-colors duration-300 bg-black/10 shadow-xl",
          className
        )}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transition: "transform 0.1s ease-out",
        }}
      />
    </div>
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot='card-header'
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      )}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot='card-title'
      className={cn("leading-none font-semibold", className)}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot='card-description'
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot='card-action'
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot='card-content' className={cn("", className)} {...props} />
  );
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot='card-footer'
      className={cn("flex items-center [.border-t]:pt-6", className)}
      {...props}
    />
  );
}

export {
  Card,
  LinkedCard,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
};
