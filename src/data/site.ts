import media from "./media.json";
export { streamPlayerUrl } from "@/lib/stream";

export const site = {
  name: "XRISH CREATIVES",
  facebook: "https://www.facebook.com/xrishcreatives",
  instagram: "https://www.instagram.com/xrishcreatives/",
  tiktok: "https://www.tiktok.com/@xrishcreatives",
  url: (
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.URL ||
    "https://xrishcreatives.com"
  ).replace(/\/$/, ""),
};

// Stream playback identifiers are public. Account API credentials remain server-only.
export const streamCustomerCode = "18nmsvzvjt4m41a5";

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
      id: "1T2JLzFtIdo-iFNTVo2jPT4YmZRsi27DI",
      title: "C&E EDConnect 2026",
      poster: "/films/ce-edconnect-2026-poster.jpg",
      preview: "/films/ce-edconnect-2026-preview.mp4",
      streamVideoId: "5bcbbafd2f55350ff7b05da4dc25d43a",
    },
    {
      id: "1B2JNzDVtbN2yLdbpMlDGV_owS5f2a-ej",
      title: "CE Logic NatCon",
      poster: "/films/ce-logic-natcon-poster.jpg",
      preview: "/films/ce-logic-natcon-preview.mp4",
      streamVideoId: "918e874f902cb4dce13b23aec48302a2",
    },
    {
      id: "11ztYxUgP6KjbkIEHMuRmHcvp4RSiIKws",
      title: "Nippon Paint",
      poster: "/films/nippon-paint-poster.jpg",
      preview: "/films/nippon-paint-preview.mp4",
      streamVideoId: "f88019a5ad0aa3a911177f1f248a8798",
    },
    {
      id: "14dkonuawsUyhOREORoNLCm7VaX39OJaV",
      title: "BNI Hinirang — Chartering & Launch",
      poster: "/films/bni-hinirang-poster.jpg",
      preview: "/films/bni-hinirang-preview.mp4",
      streamVideoId: "57cfa170c31e68770b18a501a07dbf3d",
    },
  ],
  graduation: [
    {
      id: "12034kz466i4nRlzF8TXXJK1FTs42691S",
      title: "PUP Sto. Tomas — Commencement Exercises",
      poster: "/films/pup-sto-tomas-commencement-poster.jpg",
      preview: "/films/pup-sto-tomas-commencement-preview.mp4",
      streamVideoId: "29dcc83e594acf31837495a7cbc2363d",
    },
    {
      id: "1gsIWbWPwhcIYc_Gw-PVr5SdkgNFiKtaw",
      title: "PUP 31st Recognition",
      poster: "/films/pup-31st-recognition-poster.jpg",
      preview: "/films/pup-31st-recognition-preview.mp4",
      streamVideoId: "8d81b4067a726b3894ff79cb63ccc368",
    },
    {
      id: "14wPm5A805qgQQfxkNy4QLBEAd1UaY8QA",
      title: "PUP 30th Commencement",
      poster: "/films/pup-30th-commencement-poster.jpg",
      preview: "/films/pup-30th-commencement-preview.mp4",
      streamVideoId: "6fbac06f7300792374310d0c3e5c048f",
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
  {
    slug: "cherrielle-in-color",
    title: "Cherrielle, in color.",
    subtitle: "Portraits & celebration",
    description:
      "Warm afternoon light, quiet portraits, and a red gown that changed the whole frame. Cherrielle's celebration, from the details to everyone gathered around her.",
    cover: frame(
      "cherrielle-08096",
      "Cherrielle turning on a staircase in a sweeping red gown",
      "50% 57%",
    ),
    gallery: [
      frame("cherrielle-08096", "Cherrielle in a sweeping red gown on a staircase"),
      frame("cherrielle-07806", "Cherrielle in pink framed by green leaves"),
      frame("cherrielle-07346", "Cherrielle in warm light with a rainbow flare"),
      frame("cherrielle-08025", "A close portrait of Cherrielle outdoors"),
      frame("cherrielle-08108", "Cherrielle in red looking back toward the camera"),
      frame("cherrielle-09211", "Cherrielle with family and friends at her celebration"),
    ],
  },
];

export const contactSheet: Frame[] = [
  frame(
    "pat05482",
    "Angel having her makeup finished before her portrait session",
    "0% 50%",
  ),
  frame("khatrina-06737", "Fingers resting on a bright sunflower"),
  frame("2", "A portrait against a vivid yellow background"),
  frame("snp01339", "A quiet close-up in a pink gown", "50% 12%"),
  frame("3", "A red-lit portrait in silhouette", "65% 50%"),
  frame("khatrina-07544", "Khatrina under the evening lights", "55% 50%"),
  frame("stn06964", "A celebration portrait among golden lights and flowers"),
  frame(
    "amber-01094",
    "Amber reflected in a dark arched mirror wearing a red gown",
    "75% 50%",
  ),
];

export const eventTypes = [
  "Debut",
  "Predebut",
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
  streamVideoId: string;
};

export const previewFilms: PreviewFilm[] = [
  {
    slug: "mirielle",
    title: "Mirielle",
    category: "Predebut",
    description: "A predebut portrait in motion.",
    src: "/films/mirielle.mp4",
    poster: "/films/mirielle-poster.jpg",
    streamVideoId: "c6198ca7b49e6f7f81384bcf5a270de0",
  },
  {
    slug: "angel",
    title: "Angel",
    category: "Predebut",
    description: "A predebut portrait, shaped in the moment.",
    src: "/films/angel.mp4",
    poster: "/films/angel-poster.jpg",
    streamVideoId: "780f3d685a6c1a8b620486e78b738662",
  },
  {
    slug: "janelle",
    title: "Janelle",
    category: "Predebut",
    description: "A predebut film with room to play.",
    src: "/films/janelle.mp4",
    poster: "/films/janelle-poster.jpg",
    streamVideoId: "3c0989c17f02d7b810b216636d567dc3",
  },
  {
    slug: "khatrina",
    title: "Khatrina",
    category: "Portrait Film",
    description: "Late light, open gardens, and an evening portrait.",
    src: "/films/khatrina.mp4",
    poster: "/films/khatrina-poster.jpg",
    streamVideoId: "e02911b66deea1666ca2de75b3953cc5",
  },
];

export const debutFilms: PreviewFilm[] = [
  {
    slug: "angel-debut-sde",
    title: "Angel — Debut SDE",
    category: "Same Day Edit",
    description: "The celebration, cut while the day was still unfolding.",
    src: "/films/angel-debut-sde-preview.mp4",
    poster: "/films/angel-debut-sde-poster.jpg",
    streamVideoId: "40c454046d0f8bec8c91e48f6f0cd646",
  },
  {
    slug: "khatrina-debut-sde",
    title: "Khatrina — Debut SDE",
    category: "Same Day Edit",
    description: "A look back at Khatrina's debut, shown on the same day.",
    src: "/films/khatrina-debut-sde-preview.mp4",
    poster: "/films/khatrina-debut-sde-poster.jpg",
    streamVideoId: "ed21b04fca4f6e601c8b6cea19054d39",
  },
];

export const reactionFilms: PreviewFilm[] = [
  {
    slug: "cherrielle-reaction",
    title: "Cherrielle — the first watch",
    category: "Debut",
    description: "Her same-day film, and the moment she saw it with everyone.",
    src: "/films/cherrielle-reaction-preview.mp4",
    poster: "/films/cherrielle-reaction-poster.jpg",
    streamVideoId: "97f751185389ada0d9d0da08adf4085f",
  },
  {
    slug: "khatrina-reaction",
    title: "Khatrina — the first watch",
    category: "Debut",
    description: "The film and the reaction it brought back into the room.",
    src: "/films/khatrina-reaction-preview.mp4",
    poster: "/films/khatrina-reaction-poster.jpg",
    streamVideoId: "d212f41cbaf1803b266d17be399f2b06",
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
    title: "Angel — Predebut Film",
    category: "Predebut",
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
