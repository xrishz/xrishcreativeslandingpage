import media from "./media.json";

export const site = {
  name: "XRISH CREATIVES",
  facebook: "https://www.facebook.com/xrishcreatives",
  url: process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, ""),
};

export function photo(name: string) {
  const item = media.find((image) => image.src === `/portfolio/${name}.webp`);
  if (!item) throw new Error(`Unknown portfolio image: ${name}`);
  return item;
}

export type Frame = {
  image: ReturnType<typeof photo>;
  alt: string;
  position?: string;
};
export type Story = {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  cover: Frame;
  gallery: Frame[];
};
const frame = (name: string, alt: string, position?: string): Frame => ({
  image: photo(name),
  alt,
  position,
});

export const stories: Story[] = [
  {
    slug: "in-full-bloom",
    title: "In full bloom.",
    subtitle: "Portraits & celebrations",
    description:
      "Soft light. A little anticipation. A moment that belongs entirely to you. A collection of portraits from the XRISH archive.",
    cover: frame(
      "stn06826",
      "A woman in a flowing pink gown on a garden bridge, framed by green trees",
      "50% 53%",
    ),
    gallery: [
      frame("stn06826", "A pink gown on an ornate bridge in a lush garden"),
      frame(
        "stn06660",
        "An impressionistic portrait of a woman in pink moving through a green garden",
      ),
      frame(
        "stn06964",
        "A woman beneath golden lights and a canopy of flowers",
      ),
    ],
  },
  {
    slug: "khatrina-after-hours",
    title: "Khatrina, after hours.",
    subtitle: "A portrait session",
    description:
      "The light changes. The feeling follows. Khatrina, photographed in the last warmth of the day and the glow of the evening.",
    cover: frame(
      "khatrina-07643",
      "Khatrina wearing black beside a warmly lit wooden railing",
    ),
    gallery: [
      frame("khatrina-07643", "Khatrina beside a wooden railing at night"),
      frame(
        "khatrina-07544",
        "Khatrina lit by warm light with one hand resting on her head",
      ),
      frame(
        "khatrina-07671-1-",
        "Khatrina on a red bridge against the night sky",
      ),
      frame(
        "khatrina-06737",
        "A hand gently holding the petals of a sunflower",
      ),
    ],
  },
  {
    slug: "a-little-dreamlike",
    title: "A little dreamlike.",
    subtitle: "Celebration portraits",
    description:
      "A room full of flowers. A dress made for the moment. Photographs that hold on to how it felt.",
    cover: frame(
      "snp01320",
      "A woman in a pink gown sitting among pastel flowers",
    ),
    gallery: [
      frame("snp01320", "A woman in a pink gown surrounded by pastel flowers"),
      frame("snp01339", "A close portrait in a pink dress with floral details"),
      frame(
        "snp00769",
        "An abstract portrait with amber light and a flowing dress",
      ),
    ],
  },
];

export const contactSheet: Frame[] = [
  frame("khatrina-06737", "Fingers resting on a bright sunflower"),
  frame("2", "A portrait against a vivid yellow background"),
  frame("snp01339", "A quiet close-up in a pink gown"),
  frame("3", "A red-lit portrait in silhouette"),
  frame("khatrina-07544", "Khatrina under the evening lights"),
  frame("stn06964", "A celebration portrait among golden lights and flowers"),
];

export const eventTypes = [
  "Debuts",
  "Weddings",
  "Birthdays & kiddie parties",
  "Christenings",
  "Graduations",
  "Corporate events",
  "Pre-event sessions",
];

// Add only owner-approved, real film files. The viewer initializes media on demand.
export type Film = {
  title: string;
  poster: Frame;
  src: string;
  captions?: string;
  duration?: string;
};
export const films: Film[] = [];
