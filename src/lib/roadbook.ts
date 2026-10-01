export type RoadbookCover = {
  kind: "cover";
  src: string;
  title: string;
};

export type RoadbookStory = {
  kind: "story";
  kicker: string;
  title: string;
  body: string;
  lines?: readonly string[];
};

export type RoadbookPlate = {
  kind: "plate";
  src: string;
  title: string;
  caption: string;
};

export type RoadbookPage = RoadbookCover | RoadbookStory | RoadbookPlate;

/* First and last pages are the hard covers. Interior pages pair as spreads:
   story on the left, the creative that belongs to that mile on the right. */
export const roadbookPages: readonly RoadbookPage[] = [
  { kind: "cover", src: "/s6/cover.png", title: "RMW Roadbook" },
  {
    kind: "story",
    kicker: "The journey",
    title: "Ideas that travel",
    body: "Ritz Media World started as a brand studio and grew into one road: insight, idea, then the work people actually meet. Turn the page.",
    lines: [
      "2008  Foundation",
      "The road  Insight, idea, impact",
      "The engines  Digital, creative, print",
      "The work  Campaigns that left the studio",
      "Today  Film, 3D and AI in the same room",
    ],
  },
  {
    kind: "plate",
    src: "/s6/truck.png",
    title: "On the road",
    caption: "The work does not stay in the studio. It goes out and travels.",
  },
  {
    kind: "story",
    kicker: "2008 · Delhi NCR",
    title: "Foundation",
    body: "Ritz Media World opens to reimagine brand communication for India’s growth markets. The brief was simple and hard: make ideas people remember, then prove they moved something.",
  },
  {
    kind: "plate",
    src: "/s6/engines.png",
    title: "Three engines",
    caption: "One agency. Digital, creative and print, in the same room.",
  },
  {
    kind: "story",
    kicker: "KM 0",
    title: "Insight",
    body: "Every project starts the same way. Understand the business, the audience, and the real opportunity before a line is written or a frame is built. The first mile decides the destination.",
  },
  {
    kind: "plate",
    src: "/s6/belonging.png",
    title: "A bloom of belonging",
    caption: "A brand idea made visible — something people can feel, not only read.",
  },
  {
    kind: "story",
    kicker: "KM 02",
    title: "Idea",
    body: "The insight becomes a direction: a line, a world, a way of speaking. Strategy and craft stay together so the idea does not get lost on the way to the screen, the street, or the page.",
  },
  {
    kind: "plate",
    src: "/s6/renox-legacy.jpg",
    title: "A legacy",
    caption: "Real estate, told as a place people can already imagine living in.",
  },
  {
    kind: "story",
    kicker: "Destination",
    title: "Impact",
    body: "Production, media and digital carry the idea the rest of the way. We measure what it moved. Craft without a result is decoration. Eighteen years on, that rule still holds.",
  },
  {
    kind: "plate",
    src: "/s6/forestwalk.jpg",
    title: "Forestwalk",
    caption: "A world built for the campaign, then used again across sales and digital.",
  },
  {
    kind: "story",
    kicker: "Today",
    title: "One connected studio",
    body: "Brand, campaign, media, digital, film, 3D and AI now run as one system. Ninety people. India to the world. No empty promises — Creative OK Please.",
    lines: ["18+ years in brand building", "90+ people in one studio"],
  },
  {
    kind: "plate",
    src: "/s6/navrang-square.jpg",
    title: "Navrang Square",
    caption: "A place, a name, and a picture that can hold both.",
  },
  {
    kind: "story",
    kicker: "End of this stretch",
    title: "Keep going",
    body: "The next brief is already on the road. This book is a sample of the journey — the rest is the work still leaving the studio.",
  },
  {
    kind: "story",
    kicker: "Ritz Media World",
    title: "Creative OK Please",
    body: "From a Delhi studio in 2008 to campaigns that travel. If the idea is right, we say so — and then we build it.",
    lines: ["Insight", "Idea", "Impact"],
  },
  { kind: "cover", src: "/s6/back.png", title: "Creative OK Please" },
];
