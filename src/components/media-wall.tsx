"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useCallback } from "react";
import type { MediaItem, Project } from "@/data/projects";

type WallItem = { project: Project; media: MediaItem; key: string };

function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// ─── Video Tile (Intersection-aware auto-play) ────────────────────────────────
function VideoPreview({ item }: { item: MediaItem }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) return;
    let inView = false;

    const pause = () => { el.pause(); };
    const play = () => {
      if (!inView || document.visibilityState !== "visible" || prefersReducedMotion()) {
        pause();
        return;
      }
      void el.play().catch(pause);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        if (inView) {
          play();
        } else {
          pause();
        }
      },
      { threshold: 0.25 }
    );

    const onVisibilityChange = () => {
      if (document.visibilityState !== "visible") pause();
      else if (inView) play();
    };

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMq = () => (mq.matches ? pause() : inView && play());

    observer.observe(el);
    document.addEventListener("visibilitychange", onVisibilityChange);
    mq.addEventListener("change", onMq);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      mq.removeEventListener("change", onMq);
      pause();
    };
  }, []);

  return (
    <video
      ref={ref}
      className="wall-video"
      src={item.src}
      poster={item.poster}
      muted
      loop
      playsInline
      preload="none"
      width={item.width}
      height={item.height}
      aria-hidden="true"
    />
  );
}

// ─── Individual Media Tile ────────────────────────────────────────────────────
function MediaTile({
  project,
  media,
  index,
  duplicate = false,
  priority = false,
  onTileClick,
}: WallItem & {
  index: number;
  duplicate?: boolean;
  priority?: boolean;
  onTileClick?: (e: React.MouseEvent) => void;
}) {
  return (
    <Link
      className={`media-tile media-tile-${index % 5}`}
      href={`/projects/${project.slug}`}
      aria-label={`Open ${project.title}, ${project.category}`}
      aria-hidden={duplicate || undefined}
      tabIndex={duplicate ? -1 : undefined}
      prefetch={false}
      onClick={onTileClick}
    >
      {media.type === "video" ? (
        <VideoPreview item={media} />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className="wall-image"
          src={media.src}
          alt={duplicate ? "" : media.alt}
          loading={priority ? "eager" : "lazy"}
          decoding={priority ? "sync" : "async"}
          fetchPriority={priority ? "high" : undefined}
          width={media.width}
          height={media.height}
          style={{ aspectRatio: `${media.width} / ${media.height}` }}
        />
      )}
      <span className="tile-caption">
        <span>{project.title}</span>
        <span>{project.category}</span>
      </span>
    </Link>
  );
}

// ─── Main Media Wall Component ────────────────────────────────────────────────
export function MediaWall({ projects, heading = "Selected work" }: { projects: Project[]; heading?: string }) {
  const wallRef = useRef<HTMLDivElement>(null);
  const trackARef = useRef<HTMLDivElement>(null);
  const trackBRef = useRef<HTMLDivElement>(null);
  const loopARef = useRef<HTMLDivElement>(null);
  const loopBRef = useRef<HTMLDivElement>(null);

  const [isGrabbing, setIsGrabbing] = useState(false);
  const isDraggingRef = useRef(false);
  const didDragRef = useRef(false);

  // Distribute items into 2 columns based on cumulative aspect ratios
  const columns: WallItem[][] = [[], []];
  const heights = [0, 0];
  const items = [...projects]
    .sort((a, b) => a.order - b.order)
    .flatMap((project) => project.media.map((media, i) => ({ project, media, key: `${project.id}-${i}` })));

  for (const item of items) {
    const col = heights[0] <= heights[1] ? 0 : 1;
    columns[col].push(item);
    heights[col] += item.media.height / item.media.width;
  }

  // Prevent link navigation if user dragged the wall
  const handleTileClick = useCallback((e: React.MouseEvent) => {
    if (didDragRef.current) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, []);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const wall = wallRef.current;
    const trackA = trackARef.current;
    const trackB = trackBRef.current;
    const loopA = loopARef.current;
    const loopB = loopBRef.current;

    if (!wall || !trackA || !trackB || !loopA || !loopB) return;

    let heightA = loopA.offsetHeight || 1;
    let heightB = loopB.offsetHeight || 1;

    // Keep heights fresh whenever contents or container resize
    const ro = new ResizeObserver(() => {
      if (loopA) heightA = loopA.offsetHeight || 1;
      if (loopB) heightB = loopB.offsetHeight || 1;
    });
    ro.observe(loopA);
    ro.observe(loopB);

    // Virtual scroll positions
    // Speed multipliers: Column A moves UP (speed 1.0), Column B moves DOWN (speed -0.8)
    const SPEED_A = 1.0;
    const SPEED_B = 0.8;

    let targetScroll = 0;
    let currentScroll = 0;
    let rafId = 0;

    const lerp = (start: number, end: number, factor: number) => start + (end - start) * factor;

    // Normalizes offset into range [-H, 0] so it loops seamlessly
    const getSeamlessOffset = (scrollOffset: number, loopHeight: number) => {
      const mod = scrollOffset % loopHeight;
      return mod <= 0 ? mod : mod - loopHeight;
    };

    const render = () => {
      // Silky smooth inertia (0.09 easing factor)
      currentScroll = lerp(currentScroll, targetScroll, 0.09);

      // Lane A moves UP as currentScroll increases (scroll down)
      // Base offset starts at -heightA, and shifts between -2*heightA and -heightA
      const offsetA = getSeamlessOffset(-currentScroll * SPEED_A, heightA);
      trackA.style.transform = `translate3d(0, ${-heightA + offsetA}px, 0)`;

      // Lane B moves DOWN (opposing direction!) as currentScroll increases
      // Base offset starts at -heightB, and shifts down between -heightB and 0
      const offsetB = getSeamlessOffset(currentScroll * SPEED_B, heightB);
      trackB.style.transform = `translate3d(0, ${-heightB + offsetB}px, 0)`;

      rafId = requestAnimationFrame(render);
    };

    // ─── Mouse Wheel / Touchpad Interaction ──────────────────────────────
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      // Handle line vs pixel scrolling (e.g. Firefox line mode)
      const delta = e.deltaMode === 1 ? e.deltaY * 33 : e.deltaY;
      targetScroll += delta * 1.1;
    };

    // ─── Mouse Drag Interaction ──────────────────────────────────────────
    let startY = 0;
    let lastY = 0;
    let lastTime = 0;
    let dragVelocity = 0;

    const onMouseDown = (e: MouseEvent) => {
      // Only left mouse button
      if (e.button !== 0) return;
      isDraggingRef.current = true;
      didDragRef.current = false;
      startY = e.clientY;
      lastY = e.clientY;
      lastTime = performance.now();
      dragVelocity = 0;
      setIsGrabbing(true);
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const dy = lastY - e.clientY;
      if (Math.abs(e.clientY - startY) > 5) {
        didDragRef.current = true;
      }
      const now = performance.now();
      const dt = Math.max(1, now - lastTime);
      dragVelocity = dy / dt;
      lastY = e.clientY;
      lastTime = now;

      targetScroll += dy * 1.3;
    };

    const onMouseUp = () => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;
      setIsGrabbing(false);
      // Release with momentum
      targetScroll += dragVelocity * 140;
      setTimeout(() => {
        didDragRef.current = false;
      }, 50);
    };

    // ─── Touch Interaction (Mobile & Tablet) ─────────────────────────────
    let touchStartY = 0;
    let touchLastY = 0;
    let touchLastTime = 0;
    let touchVelocity = 0;

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      touchStartY = e.touches[0].clientY;
      touchLastY = touchStartY;
      touchLastTime = performance.now();
      touchVelocity = 0;
      didDragRef.current = false;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      e.preventDefault();
      const clientY = e.touches[0].clientY;
      const dy = touchLastY - clientY;
      if (Math.abs(clientY - touchStartY) > 6) {
        didDragRef.current = true;
      }
      const now = performance.now();
      const dt = Math.max(1, now - touchLastTime);
      touchVelocity = dy / dt;
      touchLastY = clientY;
      touchLastTime = now;

      targetScroll += dy * 1.4;
    };

    const onTouchEnd = () => {
      targetScroll += touchVelocity * 160;
      setTimeout(() => {
        didDragRef.current = false;
      }, 50);
    };

    // ─── Keyboard Navigation ─────────────────────────────────────────────
    const onKeyDown = (e: KeyboardEvent) => {
      if (["ArrowDown", "PageDown", " "].includes(e.key)) {
        e.preventDefault();
        targetScroll += e.key === "PageDown" ? 450 : 120;
      } else if (["ArrowUp", "PageUp"].includes(e.key)) {
        e.preventDefault();
        targetScroll -= e.key === "PageUp" ? 450 : 120;
      }
    };

    wall.addEventListener("wheel", onWheel, { passive: false });
    wall.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    wall.addEventListener("touchstart", onTouchStart, { passive: true });
    wall.addEventListener("touchmove", onTouchMove, { passive: false });
    wall.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("keydown", onKeyDown);

    rafId = requestAnimationFrame(render);

    return () => {
      ro.disconnect();
      wall.removeEventListener("wheel", onWheel);
      wall.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      wall.removeEventListener("touchstart", onTouchStart);
      wall.removeEventListener("touchmove", onTouchMove);
      wall.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("keydown", onKeyDown);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <main className="wall-page" aria-label="Creative work archive">
      <h1 className="sr-only">{heading}</h1>
      <div className={`media-wall ${isGrabbing ? "is-grabbing" : ""}`} ref={wallRef}>
        {/* ─── Column 0 (Left - Scrolls UP on down-scroll) ─── */}
        <div className="media-lane" key="lane-0">
          <div className="media-track" ref={trackARef}>
            {/* Loop 0: Pre-scroll buffer */}
            <div className="track-loop" aria-hidden="true">
              {columns[0].map((item, index) => (
                <MediaTile {...item} index={index} duplicate key={`a-buf-${item.key}`} onTileClick={handleTileClick} />
              ))}
            </div>

            {/* Loop 1: Primary accessible content */}
            <div className="track-loop" ref={loopARef}>
              {columns[0].map((item, index) => (
                <MediaTile {...item} index={index} priority={index < 3} key={`a-main-${item.key}`} onTileClick={handleTileClick} />
              ))}
            </div>

            {/* Loop 2: Post-scroll buffer */}
            <div className="track-loop" aria-hidden="true">
              {columns[0].map((item, index) => (
                <MediaTile {...item} index={index} duplicate key={`a-ext-${item.key}`} onTileClick={handleTileClick} />
              ))}
            </div>
          </div>
        </div>

        {/* ─── Column 1 (Right - Scrolls DOWN on down-scroll: Opposing parallax!) ─── */}
        <div className="media-lane" key="lane-1">
          <div className="media-track" ref={trackBRef}>
            {/* Loop 0: Pre-scroll buffer */}
            <div className="track-loop" aria-hidden="true">
              {columns[1].map((item, index) => (
                <MediaTile {...item} index={index + 1} duplicate key={`b-buf-${item.key}`} onTileClick={handleTileClick} />
              ))}
            </div>

            {/* Loop 1: Primary accessible content */}
            <div className="track-loop" ref={loopBRef}>
              {columns[1].map((item, index) => (
                <MediaTile {...item} index={index + 1} priority={index < 3} key={`b-main-${item.key}`} onTileClick={handleTileClick} />
              ))}
            </div>

            {/* Loop 2: Post-scroll buffer */}
            <div className="track-loop" aria-hidden="true">
              {columns[1].map((item, index) => (
                <MediaTile {...item} index={index + 1} duplicate key={`b-ext-${item.key}`} onTileClick={handleTileClick} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
