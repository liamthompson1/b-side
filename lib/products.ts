export type Product = {
  id: string;
  brand: string;
  name: string;
  price: number;
  category: "guitars" | "keys" | "drums" | "studio";
  styles: string[];
  level: ("beginner" | "intermediate" | "advanced")[];
  description: string;
  image: string;
  youtubeId?: string;
  stars: number;
  isNew?: boolean;
};

export const products: Product[] = [
  {
    id: "fender-am-pro-ii-strat-sunburst",
    brand: "Fender",
    name: "American Professional II Stratocaster — Sunburst",
    price: 1499,
    category: "guitars",
    styles: ["rock", "blues", "pop", "funk", "country"],
    level: ["intermediate", "advanced"],
    description:
      "The benchmark electric guitar. Deep C neck, V-Mod II pickups, and a rolled fingerboard edge that makes this feel like it's been played for decades.",
    image:
      "https://images.unsplash.com/photo-1510915361869-0191d45b0516?w=600&h=400&fit=crop&auto=format",
    youtubeId: "rQzaFwcVjkQ",
    stars: 5,
    isNew: true,
  },
  {
    id: "gibson-les-paul-standard-50s",
    brand: "Gibson",
    name: "Les Paul Standard '50s — Heritage Cherry",
    price: 1349,
    category: "guitars",
    styles: ["rock", "blues", "metal", "classic rock"],
    level: ["intermediate", "advanced"],
    description:
      "The original rock'n'roll machine. Burstbucker pickups, weight-relieved mahogany body, and that unmistakable sustain.",
    image:
      "https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?w=600&h=400&fit=crop&auto=format",
    youtubeId: "2UphAzryVpY",
    stars: 5,
    isNew: false,
  },
  {
    id: "martin-d-18",
    brand: "Martin",
    name: "D-18 — Natural",
    price: 1299,
    category: "guitars",
    styles: ["folk", "country", "singer-songwriter", "bluegrass"],
    level: ["intermediate", "advanced"],
    description:
      "The most recorded acoustic guitar in history. Sitka spruce top, mahogany back and sides — pure, balanced projection that improves with age.",
    image:
      "https://images.unsplash.com/photo-1525201548942-d8732f6617a0?w=600&h=400&fit=crop&auto=format",
    youtubeId: "FGK3dXBsHMo",
    stars: 5,
    isNew: true,
  },
  {
    id: "taylor-314ce",
    brand: "Taylor",
    name: "314ce — Natural",
    price: 1199,
    category: "guitars",
    styles: ["pop", "folk", "fingerpicking", "singer-songwriter"],
    level: ["intermediate", "advanced"],
    description:
      "Taylor's most versatile performer. Grand Auditorium body, Sitka spruce top, sapele back and sides, and ES2 electronics built into the neck block.",
    image:
      "https://images.unsplash.com/photo-1510299574604-e5960e2ac0ce?w=600&h=400&fit=crop&auto=format",
    youtubeId: "UCgYbHRpQ2g",
    stars: 5,
    isNew: false,
  },
  {
    id: "prs-se-custom-24",
    brand: "PRS",
    name: "SE Custom 24 — Whale Blue",
    price: 699,
    category: "guitars",
    styles: ["rock", "metal", "blues", "jazz"],
    level: ["beginner", "intermediate"],
    description:
      "PRS quality at an accessible price. 85/15 'S' pickups, 24-fret wide-thin neck, and stunning flamed maple veneer top.",
    image:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=400&fit=crop&auto=format",
    youtubeId: "RMfeYitdO-c",
    stars: 4,
    isNew: false,
  },
  {
    id: "fender-player-telecaster",
    brand: "Fender",
    name: "Player Telecaster — Butterscotch",
    price: 649,
    category: "guitars",
    styles: ["country", "rock", "blues", "indie"],
    level: ["beginner", "intermediate"],
    description:
      "The Tele that started it all — simplified. Player Series alnico pickups, modern C neck, and that unmistakable twang.",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop&auto=format",
    youtubeId: "gHMOaHObsm4",
    stars: 4,
    isNew: false,
  },
  {
    id: "gibson-sg-standard",
    brand: "Gibson",
    name: "SG Standard '61 — Vintage Cherry",
    price: 1199,
    category: "guitars",
    styles: ["rock", "metal", "blues", "psychedelic"],
    level: ["intermediate", "advanced"],
    description:
      "The lightest, fastest Gibson ever made. Twin-cutaway mahogany, 57 Classic pickups, and the feel of every great British invasion record.",
    image:
      "https://images.unsplash.com/photo-1516924962500-2b4b3b99ea02?w=600&h=400&fit=crop&auto=format",
    youtubeId: "GibyTCUCwJQ",
    stars: 5,
    isNew: false,
  },
  {
    id: "epiphone-es-335",
    brand: "Epiphone",
    name: "ES-335 — Cherry",
    price: 549,
    category: "guitars",
    styles: ["jazz", "blues", "rock", "soul"],
    level: ["beginner", "intermediate"],
    description:
      "The semi-hollow that launched a thousand genres. Inspired by the Gibson original with Alnico Classic PRO humbuckers and a bound rosewood fingerboard.",
    image:
      "https://images.unsplash.com/photo-1609557927087-f9cf8e88de18?w=600&h=400&fit=crop&auto=format",
    youtubeId: "9RHFFeQ2uuw",
    stars: 4,
    isNew: true,
  },
  {
    id: "gretsch-g5422tg",
    brand: "Gretsch",
    name: "G5422TG Electromatic — Black",
    price: 699,
    category: "guitars",
    styles: ["rockabilly", "country", "jazz", "indie"],
    level: ["intermediate"],
    description:
      "That Gretsch sound without the Gretsch price. Hollow body, Filter'Tron pickups, and a Bigsby B60 vibrato — everything Keith Richards, Eddie Cochran, or Chet Atkins needed.",
    image:
      "https://images.unsplash.com/photo-1571019613914-85f342c6a11e?w=600&h=400&fit=crop&auto=format",
    youtubeId: "uT3SBzmDxGk",
    stars: 4,
    isNew: false,
  },
  {
    id: "fender-vintera-60s-jazzmaster",
    brand: "Fender",
    name: "Vintera '60s Jazzmaster — Surf Green",
    price: 899,
    category: "guitars",
    styles: ["indie", "shoegaze", "surf", "alternative"],
    level: ["intermediate"],
    description:
      "Offset heaven. Period-correct Jazzmaster pickups, adjustable floating tremolo, and that surf-green that looks like summer 1965.",
    image:
      "https://images.unsplash.com/photo-1506477331477-33d5d8b3dc85?w=600&h=400&fit=crop&auto=format",
    youtubeId: "SqpJGhLM9mc",
    stars: 4,
    isNew: true,
  },
  {
    id: "rickenbacker-360",
    brand: "Rickenbacker",
    name: "360 — Jetglo",
    price: 1499,
    category: "guitars",
    styles: ["indie", "britpop", "rock", "jangle pop"],
    level: ["advanced"],
    description:
      "The jangle guitar. Semi-hollow 360 body with that iconic through-neck and Rickenbacker's signature dual truss-rod. The Byrds, Tom Petty, Paul Weller.",
    image:
      "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600&h=400&fit=crop&auto=format",
    youtubeId: "AZQ0U0TGgls",
    stars: 5,
    isNew: false,
  },
  {
    id: "yamaha-pacifica-612v",
    brand: "Yamaha",
    name: "Pacifica 612V — Indigo Blue",
    price: 699,
    category: "guitars",
    styles: ["rock", "pop", "blues", "versatile"],
    level: ["beginner", "intermediate"],
    description:
      "The most consistently excellent guitar at this price. Flamed maple top, HSS pickup configuration, and build quality that punches two price points above.",
    image:
      "https://images.unsplash.com/photo-1510915361869-0191d45b0516?w=600&h=400&fit=crop&auto=format&crop=top",
    youtubeId: "vXoFwA54amo",
    stars: 5,
    isNew: false,
  },
];

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getProductsByIds(ids: string[]): Product[] {
  return ids
    .map((id) => getProductById(id))
    .filter((p): p is Product => p !== undefined);
}
