"use client";

import { useEffect, useMemo, useState } from "react";

const categories = [
  { name: "All Lessons", icon: "✦", color: "yellow" },
  { name: "ABC & Letters", icon: "Aa", color: "coral" },
  { name: "Numbers", icon: "123", color: "blue" },
  { name: "Shapes", icon: "△", color: "mint" },
  { name: "Colors", icon: "◯", color: "yellow" },
  { name: "Quizzes & Games", icon: "?", color: "purple" },
  { name: "Coloring Fun", icon: "✎", color: "pink" }
];

const fallbackVideos = [
  { id: "q_wgYl094Bk", title: "Guess the Correct Word Challenge", category: "Quizzes & Games", duration: "8:23", views: "529", tag: "Word Game" },
  { id: "By1EwoR7rKQ", title: "Can You Guess the Color & Fruit?", category: "Colors", duration: "9:59", views: "485", tag: "Fun Quiz" },
  { id: "VqQxroZenVg", title: "Learn 123 & ABC: Numbers 1 to 26", category: "Numbers", duration: "31:26", views: "1.7k", tag: "Popular" },
  { id: "UKwvacNbXv4", title: "Learn 123 & ABC: Numbers 1 to 20", category: "Numbers", duration: "20:23", views: "2.2k", tag: "Popular" },
  { id: "V_Na-BEaDfI", title: "Learn Numbers 11 to 20 & ABC Together", category: "Numbers", duration: "13:27", views: "1.1k", tag: "Counting" },
  { id: "zYVNafTVAFY", title: "ABC and Numbers 1 to 15", category: "ABC & Letters", duration: "13:16", views: "1.6k", tag: "Toddlers" },
  { id: "Qs1CiqWEWxE", title: "Learn Shapes with Fun Coloring Objects", category: "Shapes", duration: "13:47", views: "304", tag: "Shape Coloring" },
  { id: "vuOByboC8io", title: "Fun Colorful Shapes — Part 2", category: "Shapes", duration: "7:01", views: "318", tag: "Shapes" },
  { id: "_r5-WClUzZc", title: "Fun Colorful Shapes — Part 1", category: "Shapes", duration: "7:11", views: "523", tag: "Shapes" },
  { id: "KTlSCFUgxRc", title: "Learn Counting with ABC", category: "Numbers", duration: "6:25", views: "1.5k", tag: "Counting" },
  { id: "fbPaiVcPWbs", title: "Learn 2D & 3D Shapes with Colors", category: "Shapes", duration: "6:34", views: "361", tag: "2D & 3D" },
  { id: "kbEJwB78eBA", title: "ABC, Shapes, Numbers & Days Quiz", category: "Quizzes & Games", duration: "23:50", views: "225", tag: "Challenge" },
  { id: "dEmHa14NbSc", title: "ABC, Numbers & Body Parts Matching Game", category: "Quizzes & Games", duration: "19:33", views: "114", tag: "Matching" },
  { id: "nHNRnQ8rlhc", title: "Week Name Quiz: Guess the Next Day", category: "Quizzes & Games", duration: "5:40", views: "321", tag: "Weekdays" },
  { id: "o5oRHxkHAR0", title: "Learn & Color A to Z Alphabet", category: "Coloring Fun", duration: "17:34", views: "700", tag: "Coloring" },
  { id: "rPCdRORyN2k", title: "Learn & Color U to Z", category: "Coloring Fun", duration: "5:35", views: "768", tag: "Coloring" },
  { id: "-L8dI4C-L8s", title: "Match Body Parts Names", category: "Quizzes & Games", duration: "4:44", views: "76", tag: "Body Parts" },
  { id: "03yup9_x3e0", title: "Learn & Color N to T", category: "Coloring Fun", duration: "7:44", views: "938", tag: "Coloring" },
  { id: "JhUqMSii3NM", title: "Match Roman Numbers Challenge", category: "Numbers", duration: "6:37", views: "103", tag: "Roman Numbers" },
  { id: "NWMLCF2AhPU", title: "3-in-1 Colors, ABC & Shapes Challenge", category: "Quizzes & Games", duration: "19:10", views: "204", tag: "Challenge" },
  { id: "s9GmW2UzOUM", title: "Number Quiz Challenge", category: "Numbers", duration: "5:40", views: "172", tag: "Number Quiz" },
  { id: "J69-0sjiSqM", title: "H to M Coloring Adventure", category: "Coloring Fun", duration: "6:35", views: "801", tag: "Letters" },
  { id: "j1p_VqSgeag", title: "A to Z Tracing: Capital & Small Letters", category: "ABC & Letters", duration: "18:24", views: "659", tag: "Practice" },
  { id: "IzFQR9Uzmd4", title: "A to Z Alphabet Quiz", category: "ABC & Letters", duration: "6:13", views: "592", tag: "Quiz" },
  { id: "0lNUCi1Wnjc", title: "Color Quiz: Guess the Right Answer", category: "Colors", duration: "5:01", views: "558", tag: "Color Quiz" },
  { id: "ReML5R8ZaGo", title: "Learn Square, Circle, Triangle & More", category: "Shapes", duration: "17:46", views: "185", tag: "Shape Basics" },
  { id: "nAdtVvxBjsQ", title: "Match the Letters: English Worksheet", category: "ABC & Letters", duration: "20:11", views: "546", tag: "Matching" },
  { id: "PdhJgKd0jqg", title: "Write & Count Numbers 1 to 100", category: "Numbers", duration: "7:41", views: "132", tag: "Writing" },
  { id: "Dos2atfbgkc", title: "A is for What? A to Z Quiz", category: "ABC & Letters", duration: "4:40", views: "284", tag: "Word Quiz" },
  { id: "8TYXIZvbZx4", title: "Coloring 123 & ABC", category: "Coloring Fun", duration: "20:43", views: "103", tag: "Numbers & Letters" }
];

const learningPaths = [
  { title: "Start with ABC", copy: "Letters, sounds, tracing and simple word games.", color: "coral", icon: "A" },
  { title: "Count with Me", copy: "Build confidence with numbers from 1 to 100.", color: "blue", icon: "12" },
  { title: "Discover Shapes", copy: "Recognize colorful 2D and 3D shapes.", color: "mint", icon: "△" }
];

function VideoCard({ video, onPlay }) {
  return (
    <button className="video-card" onClick={() => onPlay(video)} aria-label={`Play ${video.title}`}>
      <span className="thumb-wrap">
        <img src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`} alt="" />
        <span className="play">▶</span>
        <span className="duration">{video.duration}</span>
      </span>
      <span className="video-copy">
        <span className="eyebrow">{video.tag}</span>
        <strong>{video.title}</strong>
        <span className="meta">{video.category} · {video.views} views</span>
      </span>
    </button>
  );
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All Lessons");
  const [activeVideo, setActiveVideo] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [videos, setVideos] = useState(fallbackVideos);
  const [playlists, setPlaylists] = useState([]);
  const [showAllCollections, setShowAllCollections] = useState(false);
  const [showMoreTopVideos, setShowMoreTopVideos] = useState(false);
  const [activeSection, setActiveSection] = useState("learn");

  useEffect(() => {
    let active = true;

    async function refreshVideos() {
      try {
        const [videoResponse, playlistResponse] = await Promise.all([
          fetch("/api/videos?v=3"),
          fetch("/api/playlists?v=1")
        ]);
        if (!videoResponse.ok) throw new Error("Channel catalogue unavailable");
        const feedVideos = await videoResponse.json();
        const channelPlaylists = playlistResponse.ok ? await playlistResponse.json() : [];
        if (!active || !feedVideos.length) return;

        const feedIds = new Set(feedVideos.map((video) => video.id));
        setVideos([...feedVideos, ...fallbackVideos.filter((video) => !feedIds.has(video.id))]);
        setPlaylists(channelPlaylists);
      } catch {
        // Keep the saved catalogue if YouTube is temporarily unavailable.
      }
    }

    refreshVideos();
    return () => { active = false; };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveSection(visible.target.id);
      },
      { rootMargin: "-95px 0px -55% 0px", threshold: [0.05, 0.2, 0.4] }
    );

    ["learn", "top-videos", "collections", "library", "live"].forEach((id) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return videos.filter((video) => {
      const inCategory = category === "All Lessons" || video.category === category || video.categories?.includes(category);
      const inSearch = !q || `${video.title} ${video.category} ${video.tag}`.toLowerCase().includes(q);
      return inCategory && inSearch;
    });
  }, [query, category, videos]);

  const latestVideo = videos[0];
  const topVideos = useMemo(() => {
    function parseViews(value = "0") {
      const normalized = String(value).toLowerCase().replaceAll(",", "").trim();
      const count = Number.parseFloat(normalized) || 0;
      if (normalized.endsWith("m")) return count * 1000000;
      if (normalized.endsWith("k")) return count * 1000;
      return count;
    }

    return [...videos]
      .sort((a, b) => parseViews(b.views) - parseViews(a.views))
      .slice(0, 18);
  }, [videos]);

  function chooseCategory(name) {
    setCategory(name);
    document.getElementById("library")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <main>
      <div className="learning-doodles doodles-left" aria-hidden="true">
        <span className="doodle star-doodle">★</span>
        <span className="doodle pencil-doodle">✎</span>
        <span className="doodle letter-doodle">A</span>
        <span className="doodle cloud-doodle">☁</span>
        <span className="doodle number-doodle">123</span>
        <span className="doodle book-doodle">▰</span>
      </div>
      <div className="learning-doodles doodles-right" aria-hidden="true">
        <span className="doodle shape-doodle">△</span>
        <span className="doodle star-doodle">✦</span>
        <span className="doodle book-doodle">▰</span>
        <span className="doodle letter-doodle">B</span>
        <span className="doodle cloud-doodle">☁</span>
        <span className="doodle number-doodle">10</span>
      </div>
      <div className="learning-doodles doodles-center" aria-hidden="true">
        <span className="doodle star-doodle">★</span>
        <span className="doodle letter-doodle">C</span>
        <span className="doodle cloud-doodle">☁</span>
        <span className="doodle shape-doodle">○</span>
        <span className="doodle number-doodle">7</span>
        <span className="doodle pencil-doodle">✎</span>
        <span className="doodle book-doodle">▰</span>
        <span className="doodle star-doodle">✦</span>
      </div>
      <header>
        <a className="brand" href="#">
          <img src="/rainbow-story-logo.svg" alt="Rainbow Story For Kids" />
        </a>
        <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)}>☰</button>
        <nav className={menuOpen ? "open" : ""}>
          <a className={activeSection === "learn" ? "active" : ""} href="#learn">Learn</a>
          <a className={activeSection === "top-videos" ? "active" : ""} href="#top-videos">Top Videos</a>
          <a className={activeSection === "collections" ? "active" : ""} href="#collections">Collections</a>
          <a className={activeSection === "library" ? "active" : ""} href="#library">Explore Videos</a>
          <a className={`live-link ${activeSection === "live" ? "active" : ""}`} href="#live"><span></span> Live Learning</a>
        </nav>
        <a className="subscribe" href="https://www.youtube.com/@RainbowStoryForKids?sub_confirmation=1" target="_blank">Subscribe ↗</a>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <span className="hero-kicker">Safe, simple & full of wonder</span>
          <h1>Little lessons.<br /><em>Big discoveries.</em></h1>
          <p>Find the perfect learning adventure for curious young minds. Explore letters, numbers, colors, shapes and more.</p>
          <label className="search-box">
            <span>⌕</span>
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="What would you like to learn?" />
            <button onClick={() => document.getElementById("library")?.scrollIntoView({ behavior: "smooth" })}>Let's go</button>
          </label>
          <div className="quick-links">
            <span>Popular:</span>
            <button onClick={() => chooseCategory("ABC & Letters")}>ABC</button>
            <button onClick={() => chooseCategory("Numbers")}>Counting</button>
            <button onClick={() => chooseCategory("Shapes")}>Shapes</button>
          </div>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="sun">✦</div>
          <div className="cloud cloud-one"></div>
          <div className="cloud cloud-two"></div>
          <div className="arch arch-1"></div>
          <div className="arch arch-2"></div>
          <div className="arch arch-3"></div>
          <div className="arch arch-4"></div>
          <div className="hero-shape star">★</div>
          <div className="hero-shape circle">3</div>
          <div className="hero-shape block">A</div>
          <div className="hero-shape pencil">✎</div>
          <div className="ground"></div>
        </div>
      </section>

      <section className="category-strip" id="learn">
        {categories.slice(1).map((item) => (
          <button key={item.name} className={`category-tile ${item.color}`} onClick={() => chooseCategory(item.name)}>
            <span>{item.icon}</span>
            <strong>{item.name}</strong>
            <small>Explore lessons →</small>
          </button>
        ))}
      </section>

      {latestVideo && (
        <section className="latest-section">
          <button className="latest-card" onClick={() => setActiveVideo(latestVideo)} aria-label={`Play latest lesson: ${latestVideo.title}`}>
            <span className="latest-image">
              <span className="latest-image-backdrop" style={{ backgroundImage: `url(https://i.ytimg.com/vi/${latestVideo.id}/hqdefault.jpg)` }}></span>
              <img src={`https://i.ytimg.com/vi/${latestVideo.id}/hqdefault.jpg`} alt="" />
              <span className="latest-play">▶</span>
            </span>
            <span className="latest-copy">
              <span className="latest-label"><i></i> Just added</span>
              <span className="section-kicker">Latest lesson</span>
              <strong>{latestVideo.title}</strong>
              <span className="latest-description">Start with the newest colorful learning adventure from Rainbow Story For Kids.</span>
              <span className="latest-meta">{latestVideo.category} · {latestVideo.views} views {latestVideo.publishedLabel ? `· ${latestVideo.publishedLabel}` : ""}</span>
              <span className="latest-action">Watch latest lesson →</span>
            </span>
          </button>
        </section>
      )}

      <section className="paths">
        <div className="section-heading">
          <div><span className="section-kicker">Made for growing minds</span><h2>Choose a learning path</h2></div>
        </div>
        <div className="path-grid">
          {learningPaths.map((path) => (
            <button className={`path-card ${path.color}`} key={path.title} onClick={() => chooseCategory(path.title.includes("ABC") ? "ABC & Letters" : path.title.includes("Count") ? "Numbers" : "Shapes")}>
              <span className="path-icon">{path.icon}</span>
              <span><strong>{path.title}</strong><small>{path.copy}</small></span>
              <b>→</b>
            </button>
          ))}
        </div>
      </section>

      <section className="top-videos" id="top-videos">
        <div className="section-heading">
          <div><span className="section-kicker">Loved by young learners</span><h2>Top Videos</h2></div>
        </div>
        <div className="video-grid top-video-grid">
          {topVideos.slice(0, showMoreTopVideos ? 18 : 9).map((video, index) => (
            <div className="ranked-video" key={video.id}>
              <span className="rank-badge">#{index + 1}</span>
              <VideoCard video={video} onPlay={setActiveVideo} />
            </div>
          ))}
        </div>
        {topVideos.length > 9 && (
          <button className="collections-toggle" onClick={() => setShowMoreTopVideos(!showMoreTopVideos)}>
            {showMoreTopVideos ? "Show fewer top videos ↑" : "Show more top videos ↓"}
          </button>
        )}
      </section>

      <section className="collections" id="collections">
        <div className="section-heading">
          <div><span className="section-kicker">Explore your way</span><h2>Learning Collections</h2></div>
        </div>
        <div className="collection-grid">
          {[...playlists].reverse().slice(0, showAllCollections ? playlists.length : 8).map((playlist, index) => (
            <a className={`collection-card collection-${index % 6}`} href={playlist.link} target="_blank" key={playlist.id}>
              <span className="collection-thumb">
                {playlist.firstVideoId && <img src={`https://i.ytimg.com/vi/${playlist.firstVideoId}/hqdefault.jpg`} alt="" />}
                <i>▶</i>
              </span>
              <span className="collection-copy">
                <small>{playlist.updated || "Learning collection"}</small>
                <strong>{playlist.title}</strong>
                <span>Explore collection →</span>
              </span>
            </a>
          ))}
        </div>
        {playlists.length > 8 && (
          <button className="collections-toggle" onClick={() => setShowAllCollections(!showAllCollections)}>
            {showAllCollections ? "Show fewer collections ↑" : `Show all ${playlists.length} collections ↓`}
          </button>
        )}
        {!playlists.length && <p className="collections-loading">Loading learning collections…</p>}
      </section>

      <section className="library" id="library">
        <div className="section-heading">
          <div><span className="section-kicker">Watch, play, learn</span><h2>Explore the learning library</h2></div>
        </div>
        <div className="library-toolbar">
          <div className="chips">
            {categories.map((item) => <button key={item.name} onClick={() => setCategory(item.name)} className={category === item.name ? "active" : ""}>{item.name}</button>)}
          </div>
          <label className="mini-search">⌕ <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search lessons" /></label>
        </div>
        <div className="video-grid">
          {filtered.map((video) => <VideoCard key={video.id} video={video} onPlay={setActiveVideo} />)}
        </div>
        {!filtered.length && <div className="empty"><span>✦</span><h3>No lessons found yet</h3><p>Try another word or learning topic.</p></div>}
      </section>

      <section className="live-section" id="live">
        <div className="live-badge"><span></span> Separate live space</div>
        <div className="live-copy">
          <span className="section-kicker">Live learning</span>
          <h2>Join a lesson as it happens.</h2>
          <p>Live sessions stay in their own dedicated space, so the main learning library remains calm, focused and easy to explore.</p>
          <div className="live-actions">
            <a href="https://www.youtube.com/@RainbowStoryForKids/streams" target="_blank">View live schedule ↗</a>
            <a className="ghost" href="https://www.youtube.com/@RainbowStoryForKids/streams" target="_blank">Past live sessions</a>
          </div>
        </div>
        <div className="live-card">
          <span className="live-label"><i></i> Live when scheduled</span>
          <div className="live-illustration"><span>ABC</span><b>123</b><i>?</i></div>
          <strong>Learning together, in real time</strong>
          <small>Upcoming sessions will appear on the channel.</small>
        </div>
      </section>

      <section className="grownups" id="parents">
        <div><span className="section-kicker">For parents & teachers</span><h2>Learning time you can feel good about.</h2></div>
        <div className="grownup-points">
          <p><span>✓</span><strong>Organized by skill</strong><small>Find age-friendly lessons without endless scrolling.</small></p>
          <p><span>✓</span><strong>Focused experience</strong><small>Live sessions stay out of everyday recommendations.</small></p>
          <p><span>✓</span><strong>Free on YouTube</strong><small>Every lesson opens through the official channel.</small></p>
        </div>
      </section>

      <footer>
        <a className="brand" href="#"><img src="/rainbow-story-logo.svg" alt="Rainbow Story For Kids" /></a>
        <p>Learn something colorful every day.</p>
        <a href="https://www.youtube.com/@RainbowStoryForKids" target="_blank">Visit YouTube Channel ↗</a>
      </footer>

      {activeVideo && (
        <div className="modal" role="dialog" aria-modal="true" onClick={() => setActiveVideo(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="close" onClick={() => setActiveVideo(null)}>×</button>
            <div className="player"><iframe src={`https://www.youtube-nocookie.com/embed/${activeVideo.id}?autoplay=1`} title={activeVideo.title} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen /></div>
            <span className="eyebrow">{activeVideo.category}</span>
            <h3>{activeVideo.title}</h3>
            <a href={`https://www.youtube.com/watch?v=${activeVideo.id}`} target="_blank">Open on YouTube ↗</a>
          </div>
        </div>
      )}
    </main>
  );
}
