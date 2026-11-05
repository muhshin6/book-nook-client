"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

interface Slide {
  overline: string;
  titleLines: string[];
  subtitle: string;
  ctaText: string;
  ctaHref: string;
  image: string;
}

const slides: Slide[] = [
  {
    overline: "BOOKNOOK",
    titleLines: ["Your", "neighbourhood", "library, online"],
    subtitle:
      "Find a book that someone nearby already loved, and borrow it for a week.",
    ctaText: "Browse Books",
    ctaHref: "/books",
    image: "/hero-bookshelf.jpg",
  },
  {
    overline: "BOOKNOOK",
    titleLines: ["Share stories,", "connect with", "local readers"],
    subtitle:
      "Exchange your favorite reads with people nearby and build a closer neighborhood reading circle.",
    ctaText: "Browse Books",
    ctaHref: "/books",
    image: "/hero-bookshelf-2.jpg",
  },
  {
    overline: "BOOKNOOK",
    titleLines: ["Give every", "paperback a", "second life"],
    subtitle:
      "Borrow instead of buying new copies. Keep physical books circulating in your local community.",
    ctaText: "Browse Books",
    ctaHref: "/books",
    image: "/hero-bookshelf-3.jpg",
  },
];

export function Banner() {
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [isPaused, setIsPaused] = React.useState(false);
  const prefersReducedMotion = useReducedMotion();
  const shouldAutoAdvance = !isPaused && !prefersReducedMotion;

  React.useEffect(() => {
    if (!shouldAutoAdvance) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 7000);

    return () => clearInterval(timer);
  }, [shouldAutoAdvance]);

  const slide = slides[currentSlide];

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured book themes"
      className="relative min-h-[calc(80vh-2rem)] flex items-center overflow-hidden bg-[#f4f7f4] dark:bg-[#0a110e]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
    >
      <AnimatePresence initial={false} mode="sync">
        <motion.div
          key={currentSlide}
          initial={{ x: "100%" }}
          animate={{ x: "0%" }}
          exit={{ x: "-100%" }}
          transition={{
            duration: prefersReducedMotion ? 0 : 0.8,
            ease: "easeInOut",
          }}
          className="absolute inset-0"
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src={slide.image}
              alt="Cozy library bookshelves"
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />

            {/* Overlays */}
            <div className="absolute inset-0 bg-linear-to-r from-[#fbfdfb]/95 via-[#fbfdfb]/85 to-[#fbfdfb]/60 dark:from-[#070e0a]/95 dark:via-[#070e0a]/80 dark:to-[#070e0a]/45" />

            <div className="absolute inset-0 bg-linear-to-t from-[#fbfdfb] via-transparent to-[#fbfdfb]/60 dark:from-[#0a110e] dark:via-transparent dark:to-[#0a110e]/60" />

            <div className="absolute inset-0 bg-black/5 dark:bg-black/20" />
          </div>

          {/* Main Content */}
          <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full py-16 lg:py-24 min-h-[calc(100vh-4rem)] flex items-center">
            <div className="max-w-2xl">
              <span className="text-xs font-semibold tracking-[0.25em] text-[#b87333] dark:text-[#c88d5e] uppercase">
                {slide.overline}
              </span>

              <h1 className="mt-4 font-serif text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-[#102418] dark:text-white leading-[1.08]">
                {slide.titleLines.map((line, idx) => (
                  <span key={idx} className="block">
                    {line}
                  </span>
                ))}
              </h1>

              <p className="mt-6 text-sm sm:text-base text-zinc-700 dark:text-zinc-300 max-w-lg leading-relaxed">
                {slide.subtitle}
              </p>

              <div className="mt-8">
                <Link
                  href={slide.ctaHref}
                  className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-[#22844c] hover:bg-[#1a6e3e] text-white dark:bg-[#94d5a5] dark:hover:bg-[#a6e2b5] dark:text-[#0a1910] text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow active:scale-[0.98]"
                >
                  {slide.ctaText}
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Carousel Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setCurrentSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={index === currentSlide ? "true" : undefined}
            className={`rounded-full transition-all duration-300 focus:outline-none ${
              index === currentSlide
                ? "w-2.5 h-2.5 bg-[#ea580c] ring-2 ring-[#ea580c]/30"
                : "w-2 h-2 bg-zinc-400 hover:bg-zinc-600 dark:bg-zinc-600/80 dark:hover:bg-zinc-400"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
