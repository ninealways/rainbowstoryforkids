import { NextResponse } from "next/server";
import { collectLockups, extractInitialData, PLAYLIST_PAGE_URL } from "../../../lib/youtube";

export async function GET() {
  try {
    const response = await fetch(PLAYLIST_PAGE_URL, { next: { revalidate: 3600 } });
    if (!response.ok) throw new Error(`YouTube playlists page returned ${response.status}`);

    const playlists = collectLockups(extractInitialData(await response.text()), "LOCKUP_CONTENT_TYPE_PLAYLIST")
      .map((playlist) => {
        const firstVideoId = new URLSearchParams(playlist.url.split("?")[1] || "").get("v");
        return {
          id: playlist.id,
          title: playlist.title,
          updated: playlist.meta.find((item) => /^Updated/i.test(item)) || "",
          firstVideoId,
          link: `https://www.youtube.com/playlist?list=${playlist.id}`
        };
      });

    return NextResponse.json(playlists, {
      headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" }
    });
  } catch {
    return NextResponse.json([], { status: 503 });
  }
}
