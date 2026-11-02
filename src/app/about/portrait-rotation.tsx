import Image from "next/image";

export function PortraitRotation() {
  return (
    <figure className="about-portrait" role="img" aria-label="Four-view geometric portrait of Tarun Suthar">
      <Image
        src="/images/about-head-rotation.svg"
        width={1254}
        height={1254}
        sizes="(max-width: 700px) 170px, 250px"
        unoptimized
        alt=""
        aria-hidden="true"
        className="about-portrait-image"
        fetchPriority="high"
      />
    </figure>
  );
}
