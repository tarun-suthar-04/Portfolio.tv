"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const frames = [
  { src: "/images/about-portrait-front.webp" },
  { src: "/images/about-portrait-left.webp" },
  { src: "/images/about-portrait-back.webp" },
  { src: "/images/about-portrait-right.webp" },
];

export function PortraitRotation() {
  const [frame, setFrame] = useState(0);
  const [motionAllowed, setMotionAllowed] = useState(false);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setMotionAllowed(!preference.matches);
    updatePreference();
    preference.addEventListener("change", updatePreference);
    frames.forEach(({ src }) => {
      const image = new window.Image();
      image.src = src;
    });
    return () => preference.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    if (!motionAllowed) return;
    const interval = window.setInterval(() => setFrame((current) => (current + 1) % frames.length), 300);
    return () => window.clearInterval(interval);
  }, [motionAllowed]);

  return (
    <figure className="about-portrait" role="img" aria-label="Four-view geometric portrait of Tarun Suthar">
      {frames.map((item, index) => (
        // All four local frames are preloaded and switched as discrete views.
        <Image
          key={item.src}
          src={item.src}
          width={1254}
          height={1254}
          sizes="(max-width: 700px) 170px, 250px"
          unoptimized
          alt=""
          aria-hidden="true"
          className={`about-portrait-frame${frame === index ? " is-visible" : ""}`}
          fetchPriority={index === 0 ? "high" : "auto"}
          loading={index === 0 ? "eager" : "lazy"}
          decoding="async"
        />
      ))}
    </figure>
  );
}
