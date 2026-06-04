import { NextResponse } from "next/server";
import { categorize, cleanViews, collectLockups, extractInitialData, VIDEO_PAGE_URL } from "../../../lib/youtube";

export async function GET() {
  try {
    const response = await fetch(VIDEO_PAGE_URL, { next: { revalidate: 1800 } });
    if (!response.ok) throw new Error(`YouTube videos page returned ${response.status}`);

    const videos = collectLockups(extractInitialData(await response.text()), "LOCKUP_CONTENT_TYPE_VIDEO")
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

    return NextResponse.json(videos, {
      headers: { "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=86400" }
    });
  } catch {
    return NextResponse.json([], { status: 503 });
  }
}
