import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const outDir = path.resolve("public/s6");
fs.mkdirSync(outDir, { recursive: true });

const pages = [
  {
    file: "contents.png",
    kicker: "RMW Roadbook",
    title: "Contents",
    lines: [
      "02  How we think",
      "04  Ideas that travel",
      "06  One agency, three engines",
      "08  Selected work",
      "10  Campaign craft",
      "12  The road ahead",
    ],
  },
  {
    file: "manifesto.png",
    kicker: "Route 00",
    title: "Ideas that\ntravel",
    body: "We turn business problems into ideas that move — from brand and campaign to media, digital, film, 3D and AI. This roadbook is a sample of that journey.",
  },
  {
    file: "insight.png",
    kicker: "KM 0",
    title: "Insight",
    body: "Understand the business, the audience, and the core opportunity before anything is built. The first mile decides the destination.",
  },
  {
    file: "idea.png",
    kicker: "KM 02",
    title: "Idea",
    body: "Turn the insight into strategy, creative direction and communication people remember. One idea, many roads.",
  },
  {
    file: "impact.png",
    kicker: "Destination",
    title: "Impact",
    body: "Take the idea through production, digital and media, and measure what it actually moved. Craft without a result is just decoration.",
  },
  {
    file: "quote.png",
    kicker: "Creative OK Please",
    title: "No empty\npromises.",
    body: "Eighteen years in brand building. Ninety people in one room. India to the world.",
  },
  {
    file: "thanks.png",
    kicker: "End of this stretch",
    title: "Keep going.",
    body: "The next brief is already on the road. Start a project with Ritz Media World.",
  },
  {
    file: "work-index.png",
    kicker: "Selected work",
    title: "On the\nboard",
    body: "Campaigns, films, identities and digital systems. A sample of ideas that left the studio and travelled.",
  },
];

function escapeXml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function titleLines(title) {
  return title.split("\n").map((line, index) => {
    return `<text x="96" y="${340 + index * 92}" font-family="Georgia, serif" font-size="78" font-weight="700" fill="#14151c">${escapeXml(line)}</text>`;
  }).join("");
}

function bodyBlock(body) {
  if (!body) return "";
  const words = body.split(" ");
  const lines = [];
  let current = "";
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > 34) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }
  if (current) lines.push(current);
  return lines
    .map(
      (line, index) =>
        `<text x="96" y="${560 + index * 42}" font-family="Georgia, serif" font-size="28" fill="#3b3d46">${escapeXml(line)}</text>`,
    )
    .join("");
}

function listBlock(lines) {
  if (!lines) return "";
  return lines
    .map(
      (line, index) =>
        `<text x="96" y="${420 + index * 64}" font-family="Georgia, serif" font-size="32" fill="#14151c">${escapeXml(line)}</text>`,
    )
    .join("");
}

for (const page of pages) {
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="1600" viewBox="0 0 1200 1600" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="1600" fill="#f7f1e8"/>
  <rect x="0" y="0" width="18" height="1600" fill="#e53e2a"/>
  <rect x="48" y="64" width="1104" height="8" fill="#cbb489"/>
  <text x="96" y="160" font-family="Georgia, serif" font-size="22" letter-spacing="4" fill="#8a6a32">${escapeXml(page.kicker.toUpperCase())}</text>
  ${titleLines(page.title)}
  ${page.lines ? listBlock(page.lines) : bodyBlock(page.body)}
  <text x="96" y="1508" font-family="Georgia, serif" font-size="18" fill="#8a6a32">RITZ MEDIA WORLD</text>
  <rect x="48" y="1528" width="1104" height="8" fill="#cbb489"/>
</svg>`;

  await sharp(Buffer.from(svg)).png().toFile(path.join(outDir, page.file));
}

console.log("wrote", pages.length, "pages");
