const CHANNEL_HANDLE = "@RainbowStoryForKids";
const CHANNEL_ID = "UCOA_Qi1HLQCAkf5gPR1jyRg";

export const VIDEO_PAGE_URL = `https://www.youtube.com/${CHANNEL_HANDLE}/videos`;
export const PLAYLIST_PAGE_URL = `https://www.youtube.com/${CHANNEL_HANDLE}/playlists`;
export const FEED_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;

export function categorize(title) {
  const value = title.toLowerCase();
  const categories = [];

  if (/(abc|abcd|alphabet|letter|phonics|word|spelling|english|a to z|a–z|[a-z] is for|tracing)/.test(value)) categories.push("ABC & Letters");
  if (/(number|count|roman|123|math|multiplication|table)/.test(value)) categories.push("Numbers");
  if (/(shape|circle|square|triangle|rectangle|oval|diamond|cube|cuboid|sphere|cylinder|cone|pyramid|pentagon|trapezium)/.test(value)) categories.push("Shapes");
  if (/(color|colour|rainbow)/.test(value) && !/(coloring|colouring)/.test(value)) categories.push("Colors");
  if (/(quiz|challenge|guess|match|puzzle|game|body part|week|day)/.test(value)) categories.push("Quizzes & Games");
  if (/(coloring|colouring|draw|art|sketch|paint)/.test(value)) categories.push("Coloring Fun");

  if (!categories.length) categories.push("ABC & Letters");

  const priority = ["ABC & Letters", "Numbers", "Shapes", "Colors", "Quizzes & Games", "Coloring Fun"];
  categories.sort((a, b) => priority.indexOf(a) - priority.indexOf(b));
  const category = categories[0];

  return {
    categories,
    category,
    tag: category === "Quizzes & Games" ? "Challenge" : category.replace(" & Letters", "").replace(" Fun", "")
  };
}

export function extractInitialData(html) {
  const marker = "var ytInitialData = ";
  const start = html.indexOf(marker);
  if (start < 0) throw new Error("YouTube initial data not found");

  const jsonStart = start + marker.length;
  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let index = jsonStart; index < html.length; index += 1) {
    const character = html[index];
    if (inString) {
      if (escaped) escaped = false;
      else if (character === "\\") escaped = true;
      else if (character === '"') inString = false;
    } else if (character === '"') {
      inString = true;
    } else if (character === "{") {
      depth += 1;
    } else if (character === "}" && --depth === 0) {
      return JSON.parse(html.slice(jsonStart, index + 1));
    }
  }

  throw new Error("YouTube initial data was incomplete");
}

export function collectLockups(data, contentType) {
  const results = [];

  function walk(value) {
    if (!value || typeof value !== "object") return;

    const lockup = value.lockupViewModel;
    if (lockup?.contentType === contentType) {
      const metadata = lockup.metadata?.lockupMetadataViewModel;
      const meta = metadata?.metadata?.contentMetadataViewModel?.metadataRows
        ?.flatMap((row) => row.metadataParts || [])
        .map((part) => part.text?.content)
        .filter(Boolean) || [];

      results.push({
        id: lockup.contentId,
        title: metadata?.title?.content || "",
        meta,
        url: lockup.rendererContext?.commandContext?.onTap?.innertubeCommand?.commandMetadata?.webCommandMetadata?.url || "",
        duration: lockup.contentImage?.thumbnailViewModel?.overlays?.[0]?.thumbnailBottomOverlayViewModel?.badges?.[0]?.thumbnailBadgeViewModel?.text || ""
      });
    }

    Object.values(value).forEach(walk);
  }

  walk(data);
  return [...new Map(results.map((item) => [item.id, item])).values()];
}

export function cleanViews(value = "") {
  return value.replace(/\s*views?$/i, "").replace(/^No$/, "0");
}

export function decodeXml(value = "") {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
}

export function getXmlTag(entry, tag) {
  const match = entry.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`));
  return decodeXml(match?.[1]?.trim() || "");
}

export function getXmlAttribute(entry, tag, attribute) {
  const match = entry.match(new RegExp(`<${tag}[^>]*${attribute}="([^"]+)"[^>]*/?>`));
  return decodeXml(match?.[1] || "");
}

export function formatPublishedLabel(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const hours = Math.max(0, Math.floor((Date.now() - date.getTime()) / 3600000));
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;

  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
