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

export const dynamic = "force-dynamic";

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
    const [feedResult, pageResult] = await Promise.allSettled([
      fetch(FEED_URL, { cache: "no-store" }),
      fetch(VIDEO_PAGE_URL, { cache: "no-store" })
    ]);

    const feedResponse = feedResult.status === "fulfilled" ? feedResult.value : null;
    if (!feedResponse?.ok) throw new Error(`YouTube RSS feed unavailable`);
    const feedVideos = parseFeed(await feedResponse.text());

    let pageVideos = [];
    const pageResponse = pageResult.status === "fulfilled" ? pageResult.value : null;
    if (pageResponse?.ok) {
      pageVideos = collectLockups(extractInitialData(await pageResponse.text()), "LOCKUP_CONTENT_TYPE_VIDEO")
        .filter((video) => video.id && !/\b(live|livestream|streaming)\b/i.test(video.title))
        .map((video, index) => ({
          id: video.id,
          title: video.title,
          ...categorize(video.title),
          duration: video.duration || "New",
          views: cleanViews(video.meta[0]),
          publishedLabel: video.meta[1] || (index === 0 ? "Just added" : ""),
          link: `https://www.youtube.com/watch?v=${video.id}`,
          pageIndex: index
        }));
    }

    const videosById = new Map();
    feedVideos.forEach((video, index) => {
      videosById.set(video.id, {
        ...video,
        pageIndex: index
      });
    });
    pageVideos.forEach((video) => {
      const existing = videosById.get(video.id);
      videosById.set(video.id, {
        ...video,
        ...existing,
        duration: video.duration || existing?.duration || "New",
        views: existing?.views || video.views || "0",
        publishedLabel: existing?.publishedLabel || video.publishedLabel,
        pageIndex: existing?.pageIndex ?? 999 + video.pageIndex
      });
    });

    const videos = [...videosById.values()].sort((a, b) => {
      const aTime = a.published ? new Date(a.published).getTime() : 0;
      const bTime = b.published ? new Date(b.published).getTime() : 0;
      if (aTime || bTime) return bTime - aTime;
      return a.pageIndex - b.pageIndex;
    });

    return NextResponse.json(videos, {
      headers: { "Cache-Control": "no-store, max-age=0" }
    });
  } catch {
    return NextResponse.json([], { status: 503 });
  }
}
