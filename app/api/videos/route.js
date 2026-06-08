import { NextResponse } from "next/server";
import {
  FEED_URL,
  VIDEO_PAGE_URL,
  categorize,
  cleanViews,
  collectLockups,
  extractInitialData,
  formatPublishedLabel,
  getXmlAttribute,
  getXmlTag
} from "../../../lib/youtube";

function parseFeed(xml) {
  return [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)]
    .map((match) => {
      const entry = match[1];
      const title = getXmlTag(entry, "title");
      const link = getXmlAttribute(entry, "link", "href");
      const published = getXmlTag(entry, "published");
      const views = getXmlAttribute(entry, "media:statistics", "views");

      return {
        id: getXmlTag(entry, "yt:videoId"),
        title,
        ...categorize(title),
        duration: "New",
        views: views || "0",
        published,
        publishedLabel: formatPublishedLabel(published),
        link
      };
    })
    .filter((video) =>
      video.id &&
      !video.link.includes("/shorts/") &&
      !/\b(live|livestream|streaming)\b/i.test(video.title)
    );
}

export async function GET() {
  try {
    const [pageResponse, feedResponse] = await Promise.all([
      fetch(VIDEO_PAGE_URL, { next: { revalidate: 300 } }),
      fetch(FEED_URL, { next: { revalidate: 300 } })
    ]);
    if (!pageResponse.ok) throw new Error(`YouTube videos page returned ${pageResponse.status}`);

    const pageVideos = collectLockups(extractInitialData(await pageResponse.text()), "LOCKUP_CONTENT_TYPE_VIDEO")
      .filter((video) => video.id && !/\b(live|livestream|streaming)\b/i.test(video.title))
      .map((video, index) => ({
        id: video.id,
        title: video.title,
        ...categorize(video.title),
        duration: video.duration || "New",
        views: cleanViews(video.meta[0]),
        publishedLabel: video.meta[1] || (index === 0 ? "Just added" : ""),
        link: `https://www.youtube.com/watch?v=${video.id}`
      }));
    const feedVideos = feedResponse.ok ? parseFeed(await feedResponse.text()) : [];

    const videosById = new Map();
    pageVideos.forEach((video, index) => videosById.set(video.id, { ...video, pageIndex: index }));
    feedVideos.forEach((video, index) => {
      const existing = videosById.get(video.id);
      videosById.set(video.id, {
        ...existing,
        ...video,
        duration: existing?.duration || video.duration,
        views: video.views || existing?.views || "0",
        pageIndex: existing?.pageIndex ?? 999 + index
      });
    });

    const videos = [...videosById.values()].sort((a, b) => {
      const aTime = a.published ? new Date(a.published).getTime() : 0;
      const bTime = b.published ? new Date(b.published).getTime() : 0;
      if (aTime || bTime) return bTime - aTime;
      return a.pageIndex - b.pageIndex;
    });

    return NextResponse.json(videos, {
      headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=1800" }
    });
  } catch {
    return NextResponse.json([], { status: 503 });
  }
}
