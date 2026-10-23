export type MediaItem = {
  src: string;
  type: "image" | "video";
  alt: string;
  poster?: string;
  width: number;
  height: number;
};

export type Project = {
  id: string;
  slug: string;
  title: string;
  category: string;
  categorySlug?: string;
  cover: MediaItem;
  media: MediaItem[];
  order: number;
  year?: string | number;
  description?: string;
  credits?: Array<{ role: string; name: string }>;
  featured?: boolean;
};

const dimensions: Record<string, [number, number]> = {
  "1772129884292.png": [761, 761], "1772130231801.png": [768, 768], "1773916150411.png": [1024, 1024],
  "1775335855551.png": [1024, 1024], "1776536050115.png": [1024, 1024], "1776538127630.png": [1024, 1024],
  "2.png": [1080, 1080], "CDS27.jpg": [3264, 3264], "file_00000000284082108c14e84fe0dde428.png": [1086, 1448],
  "file_00000000381c820799ceebeff4158b0b.png": [1536, 1024], "my asus.jpg": [512, 512],
  "Picsart_22-08-08_14-03-01-899.jpg": [1949, 2436], "Picsart_23-06-10_23-16-11-794.jpg": [2242, 2791],
  "gemini_generated_video_469a15c3.mp4": [1280, 720], "gemini_generated_video_be44981f.mp4": [1280, 720],
  "gemini_generated_video_dff85001.mp4": [1280, 720], "gemini_generated_video_be44981f.jpg": [1280, 720],
  "gemini_generated_video_469a15c3-poster.jpg": [1280, 720], "gemini_generated_video_dff85001-poster.jpg": [1280, 720],
  "Product_video_rotating_blouse_202606121755-poster.jpg": [1080, 1920], "Product_video_rotating_blouse_202606121808-poster.jpg": [720, 960],
  "Product_video_rotating_blouse_202606121755.mp4": [1080, 1920], "Product_video_rotating_blouse_202606121808.mp4": [720, 960],
};

const image = (file: string, alt: string): MediaItem => {
  const [width, height] = dimensions[file] ?? [1200, 800];
  return { src: `/media/${file}`, type: "image", alt, width, height };
};
const video = (file: string, alt: string, poster?: string): MediaItem => {
  const [width, height] = dimensions[file] ?? [1280, 720];
  return { src: `/media/${file}`, type: "video", alt, poster: poster ? `/media/${poster}` : undefined, width, height };
};

export const projects: Project[] = [
  {
    id: "01", slug: "garment-studies", title: "Garment studies", category: "Commercials", order: 1, featured: true,
    // Description: suggested editorial copy — INFO.md §6. Year / client / credits unconfirmed; omitted.
    description: "A visual exploration of fashion, garment details, silhouettes, textures, and commercial imagery. Focused on visual composition, material presentation, and creating compelling fashion-led frames.",
    cover: image("1772129884292.png", "Pink embroidered blouse on a mannequin"),
    media: [
      image("1772129884292.png", "Pink embroidered blouse, front detail"),
      image("1772130231801.png", "Pink blouse with red lacing, back view"),
      image("1773916150411.png", "Red embroidered blouse on a mannequin, front view"),
      image("1775335855551.png", "Purple blouse with embroidery on a mannequin"),
      image("1776536050115.png", "Green blouse with gold buttons on a mannequin"),
      image("1776538127630.png", "Embroidered brown dress, full length"),
      video("Product_video_rotating_blouse_202606121755.mp4", "360-degree rotating view of an embroidered green blouse", "Product_video_rotating_blouse_202606121755-poster.jpg"),
      video("Product_video_rotating_blouse_202606121808.mp4", "Rotating product shot of an embroidered blouse on a mannequin", "Product_video_rotating_blouse_202606121808-poster.jpg"),
    ],
  },
  {
    id: "02", slug: "moving-image", title: "Moving image", category: "Stories", order: 2, featured: true,
    // Description: suggested editorial copy — INFO.md §6. Year / client / credits unconfirmed; omitted.
    description: "An exploration of moving images, visual rhythm, motion, framing, and atmosphere through short-form video experiments and cinematic visual sequences.",
    cover: video("gemini_generated_video_be44981f.mp4", "AI-generated cinematic short film sequence", "gemini_generated_video_be44981f.jpg"),
    media: [
      video("gemini_generated_video_469a15c3.mp4", "AI-generated moving image — visual rhythm and motion study", "gemini_generated_video_469a15c3-poster.jpg"),
      video("gemini_generated_video_be44981f.mp4", "AI-generated cinematic short film sequence", "gemini_generated_video_be44981f.jpg"),
      video("gemini_generated_video_dff85001.mp4", "AI-generated atmospheric video experiment", "gemini_generated_video_dff85001-poster.jpg"),
    ],
  },
  {
    id: "03", slug: "image-making", title: "Image making", category: "Personal", order: 3, featured: true,
    // Description: suggested editorial copy — INFO.md §6. Year / client / credits unconfirmed; omitted.
    description: "A collection of visual experiments exploring AI-assisted imagery, portraits, graphic compositions, editorial posters, color, and digital image-making.",
    cover: image("file_00000000381c820799ceebeff4158b0b.png", "Illustrated portrait in warm tones"),
    media: [
      image("file_00000000381c820799ceebeff4158b0b.png", "Illustrated portrait in warm tones"),
      image("file_00000000284082108c14e84fe0dde428.png", "Illustrated figure study with gestural lines"),
      image("2.png", "Bold typographic poster — red and white composition"),
      image("CDS27.jpg", "Graphic identity artwork in yellow and red"),
      image("Picsart_23-06-10_23-16-11-794.jpg", "Digital illustrated portrait with graphic elements"),
      image("Picsart_22-08-08_14-03-01-899.jpg", "Illustrated editorial portrait in red tones"),
      image("my asus.jpg", "Digital portrait composition"),
    ],
  },
];

export const categories = ["Stories", "Commercials", "Personal"] as const;
export const projectBySlug = (slug: string) => projects.find((project) => project.slug === slug);
