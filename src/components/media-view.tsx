import type { MediaItem } from "@/data/projects";

export function MediaView({ item, className = "" }: { item: MediaItem; className?: string }) {
  if (item.type === "video") {
    return <video className={`media-video ${className}`} controls playsInline preload="none" poster={item.poster} aria-label={item.alt} width={item.width} height={item.height}>
      <source src={item.src} type="video/mp4" />
      Your browser does not support this video.
    </video>;
  }
  // Preserve the original ratio of each supplied still in the project sequence.
  // eslint-disable-next-line @next/next/no-img-element
  return <img className={`media-image ${className}`} src={item.src} alt={item.alt} loading="lazy" width={item.width} height={item.height} />;
}
