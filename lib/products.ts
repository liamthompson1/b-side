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
  // ── ELECTRIC ─────────────────────────────────────────────────────────────
  {
    id: "fender-player-ii-strat-sunburst",
    brand: "Fender",
    name: "Player II Stratocaster — 3-Colour Sunburst",
    price: 699,
    category: "guitars",
    styles: ["rock", "blues", "pop", "funk", "indie"],
    level: ["beginner", "intermediate"],
    description:
      "Fender's most popular Strat, updated with a new neck profile and improved V-Mod II pickups. The go-to for players stepping up from a beginner guitar.",
    image:
      "https://images.unsplash.com/photo-1510915361869-0191d45b0516?w=600&h=400&fit=crop&auto=format",
    youtubeId: "rQzaFwcVjkQ",
    stars: 5,
    isNew: true,
  },
  {
    id: "fender-am-pro-ii-telecaster",
    brand: "Fender",
    name: "American Professional II Telecaster — Mystic Surf Green",
    price: 1449,
    category: "guitars",
    styles: ["country", "rock", "blues", "indie"],
    level: ["intermediate", "advanced"],
    description:
      "The Tele that working musicians reach for. V-Mod II pickups, a rolled fingerboard edge, and bone nut. Built to last a career.",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop&auto=format",
    youtubeId: "gHMOaHObsm4",
    stars: 5,
    isNew: false,
  },
  {
    id: "fender-vintera-ii-70s-telecaster-deluxe",
    brand: "Fender",
    name: "Vintera II '70s Telecaster Deluxe — Mocha",
    price: 999,
    category: "guitars",
    styles: ["rock", "indie", "alternative", "pop"],
    level: ["intermediate"],
    description:
      "The Tele with humbuckers — a forgotten Fender gem. Wide Range humbuckers give you warmth the standard Tele can't touch, in a maple-neck '70s body.",
    image:
      "https://images.unsplash.com/photo-1506477331477-33d5d8b3dc85?w=600&h=400&fit=crop&auto=format",
    youtubeId: "SqpJGhLM9mc",
    stars: 4,
    isNew: true,
  },
  {
    id: "gibson-les-paul-standard-50s",
    brand: "Gibson",
    name: "Les Paul Standard '50s — Heritage Cherry Sunburst",
    price: 2299,
    category: "guitars",
    styles: ["rock", "blues", "metal", "classic rock"],
    level: ["intermediate", "advanced"],
    description:
      "The original Les Paul. Burstbucker pickups, '50s-style wiring, and a weight-relieved mahogany body that resonates like nothing else. An investment piece.",
    image:
      "https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?w=600&h=400&fit=crop&auto=format",
    youtubeId: "2UphAzryVpY",
    stars: 5,
    isNew: false,
  },
  {
    id: "gibson-sg-standard-61",
    brand: "Gibson",
    name: "SG Standard '61 — Vintage Cherry",
    price: 1299,
    category: "guitars",
    styles: ["rock", "metal", "blues", "psychedelic"],
    level: ["intermediate", "advanced"],
    description:
      "Lighter and faster than a Les Paul. The guitar Angus Young, Tony Iommi, and Robby Krieger built careers on. Twin-cutaway mahogany and 57 Classic humbuckers.",
    image:
      "https://images.unsplash.com/photo-1516924962500-2b4b3b99ea02?w=600&h=400&fit=crop&auto=format",
    youtubeId: "GibyTCUCwJQ",
    stars: 5,
    isNew: false,
  },
  {
    id: "gibson-es-335-sixties-cherry",
    brand: "Gibson",
    name: "ES-335 — Sixties Cherry",
    price: 2999,
    category: "guitars",
    styles: ["jazz", "blues", "soul", "rock"],
    level: ["advanced"],
    description:
      "The semi-hollow that invented a genre. Warm at low volumes, screaming when pushed. Eric Clapton's Cream-era tone in a box.",
    image:
      "https://images.unsplash.com/photo-1609557927087-f9cf8e88de18?w=600&h=400&fit=crop&auto=format",
    youtubeId: "9RHFFeQ2uuw",
    stars: 5,
    isNew: false,
  },
  {
    id: "epiphone-les-paul-standard-50s",
    brand: "Epiphone",
    name: "Les Paul Standard '50s — Vintage Sunburst",
    price: 399,
    category: "guitars",
    styles: ["rock", "blues", "metal"],
    level: ["beginner", "intermediate"],
    description:
      "The most accessible Les Paul tone on the market. Alnico Classic PRO humbuckers and proper mahogany body — an Epiphone that doesn't feel like a compromise.",
    image:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=400&fit=crop&auto=format",
    youtubeId: "RMfeYitdO-c",
    stars: 4,
    isNew: false,
  },
  {
    id: "epiphone-es-339",
    brand: "Epiphone",
    name: "ES-339 — Cherry",
    price: 449,
    category: "guitars",
    styles: ["jazz", "blues", "rock", "indie"],
    level: ["beginner", "intermediate"],
    description:
      "Smaller-bodied semi-hollow that sits perfectly on stage. Alnico Classic PRO humbuckers and a shorter scale make this the most comfortable hollow-body at the price.",
    image:
      "https://images.unsplash.com/photo-1516924962500-2b4b3b99ea02?w=600&h=400&fit=crop&auto=format",
    youtubeId: "9RHFFeQ2uuw",
    stars: 4,
    isNew: true,
  },
  {
    id: "prs-se-custom-24",
    brand: "PRS",
    name: "SE Custom 24 — Whale Blue",
    price: 649,
    category: "guitars",
    styles: ["rock", "metal", "blues", "prog"],
    level: ["beginner", "intermediate"],
    description:
      "PRS quality at mid-range price. 85/15 'S' pickups, 24-fret wide-thin neck, and stunning flamed maple veneer top. Versatile enough for any genre.",
    image:
      "https://images.unsplash.com/photo-1510299574604-e5960e2ac0ce?w=600&h=400&fit=crop&auto=format",
    youtubeId: "RMfeYitdO-c",
    stars: 5,
    isNew: false,
  },
  {
    id: "prs-s2-mcarty-594-singlecut",
    brand: "PRS",
    name: "S2 McCarty 594 Singlecut — McCarty Sunburst",
    price: 1599,
    category: "guitars",
    styles: ["rock", "blues", "country", "vintage"],
    level: ["intermediate", "advanced"],
    description:
      "Where vintage vibe meets PRS build quality. 58/15 'S' pickups, Pattern Vintage neck, and push-pull coil-splits give this extraordinary range.",
    image:
      "https://images.unsplash.com/photo-1525201548942-d8732f6617a0?w=600&h=400&fit=crop&auto=format",
    youtubeId: "UCgYbHRpQ2g",
    stars: 5,
    isNew: false,
  },
  {
    id: "squier-classic-vibe-70s-strat",
    brand: "Squier",
    name: "Classic Vibe '70s Stratocaster — Black",
    price: 339,
    category: "guitars",
    styles: ["rock", "blues", "punk", "indie"],
    level: ["beginner"],
    description:
      "The best beginner guitar available. Large headstock, 3-single coil pickups, and Squier's best build quality. Countless pros keep one as a touring beater.",
    image:
      "https://images.unsplash.com/photo-1510915361869-0191d45b0516?w=600&h=400&fit=crop&auto=format&sat=-20",
    youtubeId: "rQzaFwcVjkQ",
    stars: 4,
    isNew: false,
  },
  {
    id: "gretsch-g5622t-electromatic",
    brand: "Gretsch",
    name: "G5622T Electromatic — Georgia Green",
    price: 699,
    category: "guitars",
    styles: ["rockabilly", "country", "jazz", "indie"],
    level: ["intermediate"],
    description:
      "That Gretsch sound at a price you can actually justify. Filter'Tron-style pickups, center-block construction, and a Bigsby B60 vibrato. Keith Richards approved.",
    image:
      "https://images.unsplash.com/photo-1571019613914-85f342c6a11e?w=600&h=400&fit=crop&auto=format",
    youtubeId: "uT3SBzmDxGk",
    stars: 4,
    isNew: false,
  },
  {
    id: "rickenbacker-330-jetglo",
    brand: "Rickenbacker",
    name: "330 — Jetglo",
    price: 1749,
    category: "guitars",
    styles: ["indie", "britpop", "rock", "jangle pop"],
    level: ["intermediate", "advanced"],
    description:
      "The jangle machine. Semi-hollow 330 body, through-neck construction, and Rickenbacker's dual truss-rod. Tom Petty, The Byrds, Paul Weller. Unmistakeable.",
    image:
      "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600&h=400&fit=crop&auto=format",
    youtubeId: "AZQ0U0TGgls",
    stars: 5,
    isNew: false,
  },
  {
    id: "fender-vintera-60s-jazzmaster",
    brand: "Fender",
    name: "Vintera '60s Jazzmaster — Surf Green",
    price: 849,
    category: "guitars",
    styles: ["indie", "shoegaze", "surf", "alternative"],
    level: ["intermediate"],
    description:
      "Offset perfection. Period-correct floating tremolo, rhythm circuit, and that surf green finish. My Bloody Valentine to Sonic Youth — this is the offset.",
    image:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=400&fit=crop&auto=format&hue=180",
    youtubeId: "SqpJGhLM9mc",
    stars: 4,
    isNew: true,
  },
  {
    id: "ibanez-az2204n-antique-white-blonde",
    brand: "Ibanez",
    name: "AZ2204N — Antique White Blonde",
    price: 899,
    category: "guitars",
    styles: ["rock", "prog", "jazz", "fusion"],
    level: ["intermediate", "advanced"],
    description:
      "Ibanez at their most sophisticated. Seymour Duncan Hyperion pickups, roasted maple neck, and Gotoh 510 locking trem. Players' guitar through and through.",
    image:
      "https://images.unsplash.com/photo-1516924962500-2b4b3b99ea02?w=600&h=400&fit=crop&auto=format&sat=30",
    youtubeId: "rQzaFwcVjkQ",
    stars: 5,
    isNew: false,
  },
  {
    id: "yamaha-pacifica-612vii",
    brand: "Yamaha",
    name: "Pacifica 612VII — Indigo Blue",
    price: 679,
    category: "guitars",
    styles: ["rock", "blues", "pop", "versatile"],
    level: ["beginner", "intermediate"],
    description:
      "The most consistent guitar at this price. Flamed maple top, HSH pickup configuration, and build quality that punches well above its weight. Studio and stage ready.",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop&auto=format&hue=240",
    youtubeId: "vXoFwA54amo",
    stars: 5,
    isNew: false,
  },
  // ── ACOUSTIC ─────────────────────────────────────────────────────────────
  {
    id: "martin-d-28-standard",
    brand: "Martin",
    name: "D-28 Standard — Natural",
    price: 1649,
    category: "guitars",
    styles: ["folk", "country", "bluegrass", "singer-songwriter"],
    level: ["intermediate", "advanced"],
    description:
      "The most recorded acoustic guitar in history. Sitka spruce top, East Indian rosewood back and sides. Pure, balanced projection that only improves with age.",
    image:
      "https://images.unsplash.com/photo-1525201548942-d8732f6617a0?w=600&h=400&fit=crop&auto=format",
    youtubeId: "FGK3dXBsHMo",
    stars: 5,
    isNew: false,
  },
  {
    id: "taylor-214ce-natural",
    brand: "Taylor",
    name: "214ce — Natural",
    price: 849,
    category: "guitars",
    styles: ["pop", "folk", "fingerpicking", "singer-songwriter"],
    level: ["intermediate"],
    description:
      "Taylor's best-selling acoustic. Grand Auditorium body with ES-B electronics make this equally at home on stage or in the living room. Effortless playability.",
    image:
      "https://images.unsplash.com/photo-1510299574604-e5960e2ac0ce?w=600&h=400&fit=crop&auto=format",
    youtubeId: "UCgYbHRpQ2g",
    stars: 5,
    isNew: false,
  },
  {
    id: "guild-d-40-traditional",
    brand: "Guild",
    name: "D-40 Traditional — Natural",
    price: 799,
    category: "guitars",
    styles: ["folk", "bluegrass", "country", "fingerpicking"],
    level: ["intermediate"],
    description:
      "Guild's finest dreadnought. Solid sitka spruce top, solid mahogany back and sides — the same recipe Richie Havens used at Woodstock. Punchy and alive.",
    image:
      "https://images.unsplash.com/photo-1510915361869-0191d45b0516?w=600&h=400&fit=crop&auto=format&brightness=0.8",
    youtubeId: "FGK3dXBsHMo",
    stars: 4,
    isNew: false,
  },
  {
    id: "taylor-314ce-natural",
    brand: "Taylor",
    name: "314ce — Natural",
    price: 1199,
    category: "guitars",
    styles: ["pop", "folk", "fingerpicking", "country"],
    level: ["intermediate", "advanced"],
    description:
      "Taylor's most versatile performer. Grand Auditorium body, Sitka spruce top, sapele back and sides. The Taylor that does everything well.",
    image:
      "https://images.unsplash.com/photo-1506477331477-33d5d8b3dc85?w=600&h=400&fit=crop&auto=format",
    youtubeId: "UCgYbHRpQ2g",
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
