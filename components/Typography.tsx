"use client";

import { cn } from "@/lib/utils";
import React from "react";

/* =========================
   Typography Variants
========================= */

export const typographyVariants = {
  h1: "font-primary text-4xl md:text-5xl font-bold text-slate-800 leading-tight tracking-tight animate-fadeSlide",
  h2: "font-primary text-3xl font-semibold text-indigo-800 mt-6 mb-3 tracking-tight",
  h3: "font-primary text-xl font-semibold text-gray-600 mb-3",
  h4: "font-primary text-2xl font-bold text-slate-800 leading-tight tracking-tight",

  brand:
    "font-primary text-2xl font-bold text-indigo-600 tracking-wide hover:text-indigo-700 transition-all",

  nav: "font-secondary text-base font-medium text-gray-700 hover:text-indigo-600",
  navActive:
    "font-secondary text-base font-semibold text-indigo-600 border-b-2 border-indigo-600",

  body: "font-primary text-base text-gray-700 leading-relaxed",
  bodyMuted: "font-primary text-sm text-gray-500",

  paraPrimary:
    "font-primary text-base md:text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto",
  paraSecondary:
    "font-primary text-base text-gray-700 leading-relaxed opacity-90",
};

/* =========================
   Background Color Themes
========================= */

const bgThemes = {
  light: "bg-[#eff1ee]",
  dark: "bg-[#18465a] text-white",
  olive: "bg-[#63610c] text-white",
  sand: "bg-[#b58c5b] text-white",
};

/* =========================
   Types
========================= */

type TypographyVariant = keyof typeof typographyVariants;
type BgTheme = keyof typeof bgThemes;
type LayoutVariant = "one" | "two" | "three";

interface TypographyProps
  extends React.HTMLAttributes<HTMLElement> {
 as?: React.ElementType;
  variant?: TypographyVariant;
  bgTheme?: BgTheme;
  layout?: LayoutVariant;
  children: React.ReactNode;
}

/* =========================
   Layout Wrapper Styles
========================= */

const layoutStyles: Record<LayoutVariant, string> = {
  one: "py-12",
  two: "py-16 flex justify-center",
  three: "py-20 flex items-center justify-center",
};

/* =========================
   Typography Component
========================= */

export function Typography({
  as: Component = "span",
  variant = "body",
  bgTheme = "light",
  layout = "one",
  className,
  children,
  ...props
}: TypographyProps) {
  return (
    /* OUTER DIV */
    <div className={cn("w-full", bgThemes[bgTheme], layoutStyles[layout])}>
      {/* MIDDLE DIV */}
      <div className="container mx-auto px-4">
        {/* INNER DIV */}
        <div className="text-center">
          <Component
            className={cn(typographyVariants[variant], className)}
            {...props}
          >
            {children}
          </Component>
        </div>
      </div>
    </div>
  );
}
