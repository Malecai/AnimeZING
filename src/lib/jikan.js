/**
 * Multi-API Anime Fetcher with Fallback Chain
 * - Primary: AniList (GraphQL v2)
 * - Secondary: Kitsu (JSON:API v3)
 * - Tertiary: Jikan v4 (MyAnimeList Proxy)
 */

const GENRES_LIST = [
  { mal_id: 1, name: "Action", kitsuSlug: "action" },
  { mal_id: 2, name: "Adventure", kitsuSlug: "adventure" },
  { mal_id: 4, name: "Comedy", kitsuSlug: "comedy" },
  { mal_id: 8, name: "Drama", kitsuSlug: "drama" },
  { mal_id: 10, name: "Fantasy", kitsuSlug: "fantasy" },
  { mal_id: 14, name: "Horror", kitsuSlug: "horror" },
  { mal_id: 22, name: "Romance", kitsuSlug: "romance" },
  { mal_id: 24, name: "Sci-Fi", kitsuSlug: "science-fiction" },
  { mal_id: 36, name: "Slice of Life", kitsuSlug: "slice-of-life" },
  { mal_id: 37, name: "Supernatural", kitsuSlug: "supernatural" },
  { mal_id: 41, name: "Thriller", kitsuSlug: "thriller" },
];

function resolveGenre(genreInput) {
  if (!genreInput) return null;
  return GENRES_LIST.find(
    (g) =>
      String(g.mal_id) === String(genreInput) ||
      g.name.toLowerCase() === String(genreInput).toLowerCase()
  );
}

function cleanSynopsis(text) {
  if (!text) return "No description available.";
  return text.replace(/<[^>]*>?/gm, "").trim();
}

// ---------------------------------------------------------------------------
// 1. AniList Provider
// ---------------------------------------------------------------------------
async function fetchFromAniList({ query = "", genre = "", page = 1, limit = 12 }) {
  const gqlQuery = `
    query ($page: Int, $perPage: Int, $search: String, $genre: String) {
      Page(page: $page, perPage: $perPage) {
        pageInfo {
          currentPage
          hasNextPage
          lastPage
        }
        media(search: $search, genre: $genre, type: ANIME, sort: POPULARITY_DESC) {
          id
          title { english romaji userPreferred }
          coverImage { large extraLarge }
          episodes
          averageScore
          format
          description
          genres
        }
      }
    }
  `;

  const matchedGenre = resolveGenre(genre);

  const variables = {
    page: Number(page),
    perPage: Number(limit),
    search: query.trim() || undefined,
    genre: matchedGenre ? matchedGenre.name : undefined,
  };

  const response = await fetch("https://graphql.anilist.co", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ query: gqlQuery, variables }),
  });

  if (!response.ok) throw new Error(`AniList API status: ${response.status}`);

  const json = await response.json();
  const pageData = json.data?.Page;

  if (!pageData) throw new Error("Invalid structure returned by AniList");

  return {
    data: pageData.media.map((item) => ({
      mal_id: item.id,
      title: item.title?.english || item.title?.userPreferred || item.title?.romaji || "Unknown Title",
      images: {
        jpg: {
          image_url: item.coverImage?.large || item.coverImage?.extraLarge || "",
          large_image_url: item.coverImage?.extraLarge || item.coverImage?.large || "",
        },
      },
      score: item.averageScore ? (item.averageScore / 10).toFixed(1) : null,
      episodes: item.episodes || null,
      type: item.format || "TV",
      synopsis: cleanSynopsis(item.description),
      genres: (item.genres || []).map((g) => ({ mal_id: g, name: g })),
    })),
    pagination: {
      current_page: pageData.pageInfo.currentPage,
      has_next_page: pageData.pageInfo.hasNextPage,
      last_visible_page: pageData.pageInfo.lastPage,
    },
  };
}

async function fetchAniListById(id) {
  const gqlQuery = `
    query ($id: Int) {
      Media(id: $id, type: ANIME) {
        id
        title { english romaji userPreferred }
        coverImage { extraLarge large }
        bannerImage
        episodes
        averageScore
        format
        status
        seasonYear
        description
        genres
      }
    }
  `;

  const response = await fetch("https://graphql.anilist.co", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ query: gqlQuery, variables: { id: Number(id) } }),
  });

  if (!response.ok) throw new Error(`AniList API status: ${response.status}`);

  const json = await response.json();
  const item = json.data?.Media;
  if (!item) throw new Error("Anime not found on AniList");

  return {
    data: {
      mal_id: item.id,
      title: item.title?.english || item.title?.userPreferred || item.title?.romaji || "Unknown Title",
      images: {
        jpg: {
          image_url: item.coverImage?.large || "",
          large_image_url: item.coverImage?.extraLarge || item.coverImage?.large || "",
        },
      },
      banner_image: item.bannerImage,
      score: item.averageScore ? (item.averageScore / 10).toFixed(1) : null,
      episodes: item.episodes || null,
      type: item.format || "TV",
      status: item.status || "Unknown",
      year: item.seasonYear || null,
      synopsis: cleanSynopsis(item.description),
      genres: (item.genres || []).map((g) => ({ mal_id: g, name: g })),
    },
  };
}

// ---------------------------------------------------------------------------
// 2. Kitsu Provider
// ---------------------------------------------------------------------------
async function fetchFromKitsu({ query = "", genre = "", page = 1, limit = 12 }) {
  const offset = (page - 1) * limit;
  const params = new URLSearchParams({
    "page[limit]": String(limit),
    "page[offset]": String(offset),
    sort: "-userCount",
  });

  if (query.trim()) params.set("filter[text]", query.trim());

  const matchedGenre = resolveGenre(genre);
  if (matchedGenre) {
    params.set("filter[categories]", matchedGenre.kitsuSlug);
  }

  const response = await fetch(`https://kitsu.io/api/edge/anime?${params.toString()}`);

  if (!response.ok) throw new Error(`Kitsu API status: ${response.status}`);

  const json = await response.json();

  return {
    data: (json.data || []).map((item) => {
      const attr = item.attributes || {};
      return {
        mal_id: item.id,
        title: attr.canonicalTitle || attr.titles?.en || attr.titles?.en_jp || "Unknown Title",
        images: {
          jpg: {
            image_url: attr.posterImage?.medium || attr.posterImage?.small || "",
            large_image_url: attr.posterImage?.large || attr.posterImage?.original || "",
          },
        },
        score: attr.averageRating ? (parseFloat(attr.averageRating) / 10).toFixed(1) : null,
        episodes: attr.episodeCount || null,
        type: attr.subtype ? attr.subtype.toUpperCase() : "TV",
        synopsis: cleanSynopsis(attr.synopsis),
        genres: matchedGenre ? [{ mal_id: matchedGenre.mal_id, name: matchedGenre.name }] : [],
      };
    }),
    pagination: {
      current_page: Number(page),
      has_next_page: !!json.links?.next,
      last_visible_page: json.meta?.count ? Math.ceil(json.meta.count / limit) : Number(page),
    },
  };
}

async function fetchKitsuById(id) {
  const response = await fetch(`https://kitsu.io/api/edge/anime/${id}`);

  if (!response.ok) throw new Error(`Kitsu API status: ${response.status}`);

  const json = await response.json();
  const item = json.data;
  if (!item) throw new Error("Anime not found on Kitsu");

  const attr = item.attributes || {};
  return {
    data: {
      mal_id: item.id,
      title: attr.canonicalTitle || attr.titles?.en || attr.titles?.en_jp || "Unknown Title",
      images: {
        jpg: {
          image_url: attr.posterImage?.medium || "",
          large_image_url: attr.posterImage?.large || attr.posterImage?.original || "",
        },
      },
      banner_image: attr.coverImage?.large || attr.coverImage?.original || null,
      score: attr.averageRating ? (parseFloat(attr.averageRating) / 10).toFixed(1) : null,
      episodes: attr.episodeCount || null,
      type: attr.subtype ? attr.subtype.toUpperCase() : "TV",
      status: attr.status || "Unknown",
      year: attr.startDate ? new Date(attr.startDate).getFullYear() : null,
      synopsis: cleanSynopsis(attr.synopsis),
      genres: [],
    },
  };
}

// ---------------------------------------------------------------------------
// 3. Jikan v4 Provider
// ---------------------------------------------------------------------------
async function fetchFromJikan({ query = "", genre = "", page = 1, limit = 12 }) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    order_by: "popularity",
    sort: "asc",
  });

  if (query.trim()) params.set("q", query.trim());
  
  const matchedGenre = resolveGenre(genre);
  if (matchedGenre) {
    params.set("genres", String(matchedGenre.mal_id));
  } else if (genre) {
    params.set("genres", String(genre));
  }

  const response = await fetch(`https://api.jikan.moe/v4/anime?${params.toString()}`);

  if (!response.ok) throw new Error(`Jikan API status: ${response.status}`);

  const json = await response.json();

  return {
    ...json,
    data: (json.data || []).map((item) => ({
      ...item,
      score: item.score ? Number(item.score).toFixed(1) : null,
      synopsis: cleanSynopsis(item.synopsis),
    })),
  };
}

async function fetchJikanById(id) {
  const response = await fetch(`https://api.jikan.moe/v4/anime/${id}`);

  if (!response.ok) throw new Error(`Jikan API status: ${response.status}`);

  const json = await response.json();
  const item = json.data;
  if (!item) throw new Error("Anime not found on Jikan");

  return {
    data: {
      ...item,
      score: item.score ? Number(item.score).toFixed(1) : null,
      synopsis: cleanSynopsis(item.synopsis),
    },
  };
}

// ---------------------------------------------------------------------------
// Fallback Chain Runner
// ---------------------------------------------------------------------------
async function runWithFallback(apiTasks) {
  let lastError = null;

  for (const { name, task } of apiTasks) {
    try {
      const data = await task();
      return data;
    } catch (err) {
      console.warn(`[AnimeZING] Provider '${name}' failed. Trying next backup...`, err);
      lastError = err;
    }
  }

  throw new Error(`All backup anime APIs failed. Last error: ${lastError?.message || "Unknown error"}`);
}

// ---------------------------------------------------------------------------
// Exported API Interface
// ---------------------------------------------------------------------------

export function fetchTopAnime(limit = 8) {
  return runWithFallback([
    { name: "AniList", task: () => fetchFromAniList({ page: 1, limit }) },
    { name: "Kitsu", task: () => fetchFromKitsu({ page: 1, limit }) },
    { name: "Jikan", task: () => fetchFromJikan({ page: 1, limit }) },
  ]);
}

export function fetchAnime({ query = "", genre = "", page = 1, limit = 12 } = {}) {
  return runWithFallback([
    { name: "AniList", task: () => fetchFromAniList({ query, genre, page, limit }) },
    { name: "Kitsu", task: () => fetchFromKitsu({ query, genre, page, limit }) },
    { name: "Jikan", task: () => fetchFromJikan({ query, genre, page, limit }) },
  ]);
}

export function fetchAnimeById(id) {
  return runWithFallback([
    { name: "AniList", task: () => fetchAniListById(id) },
    { name: "Kitsu", task: () => fetchKitsuById(id) },
    { name: "Jikan", task: () => fetchJikanById(id) },
  ]);
}

export async function fetchGenres() {
  return {
    data: GENRES_LIST,
  };
}
