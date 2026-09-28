import media from "./media.json";
export { streamPlayerUrl } from "@/lib/stream";

export const site = {
  name: "XRISH CREATIVES",
  facebook: "https://www.facebook.com/xrishcreatives",
  url: (
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.URL ||
    "https://xrish-creatives-portfolio.netlify.app"
  ).replace(/\/$/, ""),
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

export const experiencePhotos = {
  lead: frame(
    "stn06826",
    "A woman in a flowing pink gown on a garden bridge surrounded by trees",
    "50% 52%",
  ),
  candid: frame(
    "khatrina-07544",
    "Khatrina smiling beneath warm evening lights",
    "50% 42%",
  ),
  detail: frame(
    "khatrina-06737",
    "A hand resting gently on the petals of a sunflower",
  ),
};

export const driveFilms = {
  corporate: [
    {
      id: "1XLKA9FRPGei4L4iz4WNxLoG86p4hIOp4",
      title: "Corporate Event Film 01",
    },
    {
      id: "1Bp_mM1BoQxZMqmUeWNeSG75C0xQK2LOZ",
      title: "Corporate Event Film 02",
    },
    {
      id: "1lxFGs7u_uV8RYVtOICCw4cMVLkEMUmtE",
      title: "Corporate Event Film 03",
    },
  ],
  graduation: [
    {
      id: "1Xx-_JJw9JQcVl5MD2rfdmbjGbPzizFgv",
      title: "Graduation Film",
    },
  ],
} as const;

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
      frame(
        "stn07143",
        "A celebrant seen from behind beneath dramatic golden stage lights",
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
  frame(
    "pat05482",
    "Angel having her makeup finished before her debut celebration",
  ),
  frame("khatrina-06737", "Fingers resting on a bright sunflower"),
  frame("2", "A portrait against a vivid yellow background"),
  frame("snp01339", "A quiet close-up in a pink gown"),
  frame("3", "A red-lit portrait in silhouette"),
  frame("khatrina-07544", "Khatrina under the evening lights"),
  frame("stn06964", "A celebration portrait among golden lights and flowers"),
  frame(
    "amber-01094",
    "Amber reflected in a dark arched mirror wearing a red gown",
  ),
];

export const eventTypes = [
  "Debut",
  "Predebut",
  "Weddings",
  "Corporate Events",
  "Graduations",
];

export type PreviewFilm = {
  slug: string;
  title: string;
  category: "Debut" | "Predebut" | "Same Day Edit" | "Portrait Film";
  description: string;
  src: string;
  poster: string;
};

export const previewFilms: PreviewFilm[] = [
  {
    slug: "mirielle",
    title: "Mirielle",
    category: "Predebut",
    description: "A predebut portrait in motion.",
    src: "/films/mirielle.mp4",
    poster: "/films/mirielle-poster.jpg",
  },
  {
    slug: "angel",
    title: "Angel",
    category: "Debut",
    description: "A debut story, shaped as it happened.",
    src: "/films/angel.mp4",
    poster: "/films/angel-poster.jpg",
  },
  {
    slug: "janelle",
    title: "Janelle",
    category: "Same Day Edit",
    description: "The celebration, returned to the room while it is still unfolding.",
    src: "/films/janelle.mp4",
    poster: "/films/janelle-poster.jpg",
  },
  {
    slug: "khatrina",
    title: "Khatrina",
    category: "Portrait Film",
    description: "Late light, open gardens, and an evening portrait.",
    src: "/films/khatrina.mp4",
    poster: "/films/khatrina-poster.jpg",
  },
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
      "Andami pong nagandahan sa SDE, including me. Super ganda po. Huhu, thank you so much po!",
    ],
  },
  {
    name: "Cherreille Gonzales",
    quote: [
      "Thank you so much po! I had fun filming with you all po, and I’m glad na kayo po ang pinili ko for photo and video.",
    ],
  },
  {
    name: "Lara Jabagat",
    quote: [
      "I chose XRISH CREATIVES after seeing their work on social media and knowing their style matched mine. During our shoot, I felt comfortable expressing myself because the team was kind, down-to-earth, and balanced professionalism with humor. Parang nakikipag-hangout lang ako sa friends ko! Their work is amazing, and I would gladly recommend them.",
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
