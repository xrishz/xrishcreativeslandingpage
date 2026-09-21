import media from "./media.json";
export { streamPlayerUrl } from "@/lib/stream";

export const site = {
  name: "XRISH CREATIVES",
  facebook: "https://www.facebook.com/xrishcreatives",
  url: (process.env.NEXT_PUBLIC_SITE_URL || process.env.URL)?.replace(/\/$/, ""),
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

export const heroPortrait = frame(
  "mirielle-50",
  "Mirielle seated in a green dress beneath trees in Laguna",
  "50% 57%",
);

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
  "Debut",
  "Predebut",
  "Weddings",
  "Corporate Events",
  "Graduations",
];

export type Reel = {
  title: string;
  category: "Predebut" | "Graduation" | "Debut";
  url: string;
  embeddable: boolean;
};

export const reels: Reel[] = [
  {
    title: "Mirielle — Pre-debut Film",
    category: "Predebut",
    url: "https://www.facebook.com/reel/1032666439513604",
    embeddable: true,
  },
  {
    title: "Angel — Debut Same Day Edit",
    category: "Debut",
    url: "https://www.facebook.com/reel/4579322825726121",
    embeddable: true,
  },
];

export const testimonials = [
  {
    name: "Janelle Angeles",
    quote: [
      "Andami pong nagandahan sa sde, including mee. super ganda po huhu thank you so much po",
    ],
  },
  {
    name: "Cherreille Gonzales",
    quote: [
      "Thank you so much po! I had fun filming with you all po and I am glad na kayo po ang pinili kong photo and video",
    ],
  },
  {
    name: "Lara Jabagat",
    quote: [
      "I chose XRISH CREATIVES as my photographer because as I was browsing through my social medias, I saw their works and immediately knew I would love to work with them because their works neatly matched my preferences. I felt light and at ease during the entire shoot because the photographers were nice and very down to earth. They can balance professionalism and humor!",
      "My favorite part of the experience was working them for about 6-7 hours. Because I got comfortable and able to express myself throughout the shoot (parang nakikipag hangout lang rin ako sa friends ko hihi) I would even recommend them because I really felt comfortable considering they are just few years older than me so I feel like I’m just hanging with my Ate’s and Kuya’s Alongside with that, their works are amazing and it is worth giving a shot!",
    ],
  },
] as const;

// Public playback identifiers only. Never put a Cloudflare API token here.
export type Film = {
  slug: string;
  title: string;
  poster: Frame;
  provider: "cloudflare-stream";
  videoId?: string;
  customerCode?: string;
  duration?: string;
};
export const films: Film[] = [
  {
    slug: "full-predebut-film",
    title: "Full Pre-debut Film",
    provider: "cloudflare-stream",
    poster: frame(
      "stn06964",
      "A portrait beneath golden lights and flowers, used as the upcoming film poster",
    ),
    videoId: process.env.NEXT_PUBLIC_PREDEBUT_STREAM_VIDEO_ID,
    customerCode: process.env.NEXT_PUBLIC_CLOUDFLARE_STREAM_CUSTOMER_CODE,
  },
];
