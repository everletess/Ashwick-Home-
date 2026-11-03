"use client";

import { useEffect, useState } from "react";
import { Photo } from "@/components/photo";

/**
 * The hero's second and third photos fade in over the first. They mount only after the page has loaded, so they never
 * compete with the first photo (the largest thing on the page) for bandwidth.
 */
export function HeroSlides() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const go = () => setTimeout(() => setReady(true), 1500);
    if (document.readyState === "complete") go();
    else window.addEventListener("load", go, { once: true });
    return () => window.removeEventListener("load", go);
  }, []);
  if (!ready) return null;
  return (
    <>
      <Photo src="mattress-meadow" label="A cutaway of the Ashbury in Sorrel in a meadow, showing the wool, horsehair and pocket coils inside" className="hero-img hero-slide hero-slide-2" fill />
      <Photo src="hero-bedroom" label="A sunlit bedroom with an upholstered bed in rust linen bedding and a pair of textured cream wingback chairs" className="hero-img hero-slide hero-slide-3" fill />
    </>
  );
}
