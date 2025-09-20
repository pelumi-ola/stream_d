"use client";
// hooks/useVideosData.js
import { useState, useEffect, useMemo } from "react";
import { fetchFromApi } from "@/lib/api";
import { z } from "zod";
import { useUserInteractions } from "./userInteractions";

const VideoSchema = z.object({
  id: z.number(),
  match_id: z.number(),
  title: z.string(),
  category: z.string(),
  match_date: z.string(),
  thumbnail: z.string(),
  league: z.string(),
  video_url: z.string(),
  country: z.string(),
});

/**
 * Fetch ALL videos (auto-paginate until done)
 */
export function useAllVideos() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function loadAll() {
      setLoading(true);
      setError(null);

      try {
        const pageSize = 100;
        let page = 1;
        let all = [];
        let totalPages = 1;

        do {
          const res = await fetchFromApi({
            endpoint: "/videos",
            params: { page, pageSize },
            schema: z.object({
              data: z.array(VideoSchema),
              metadata: z
                .object({
                  total: z.number().optional(),
                  total_pages: z.number().optional(),
                })
                .optional(),
            }),
          });

          if (res?.data) {
            all = [...all, ...res.data];
            totalPages = res.metadata?.total_pages ?? 1;
          }
          page++;
        } while (page <= totalPages);

        if (mounted) setVideos(all);
      } catch (err) {
        console.error("useAllVideos error:", err);
        if (mounted) setError("Failed to fetch all videos");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadAll();
    return () => {
      mounted = false;
    };
  }, []);

  return { videos, loading, error };
}

/**
 * Fetch RECENT highlights from dedicated endpoint
 */
/**
 * Fetch RECENT highlights with pagination
 */
export function useRecentHighlights(page = 1, pageSize = 4) {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    let mounted = true;

    async function loadRecent() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetchFromApi({
          endpoint: "/videos/recent",
          params: { page, pageSize },
          schema: z.object({
            data: z.array(VideoSchema),
            metadata: z
              .object({
                total: z.number().optional(),
                total_pages: z.number().optional(),
              })
              .optional(),
          }),
        });

        if (mounted && res?.data) {
          setVideos(res.data);
          setTotalPages(res.metadata?.total_pages ?? 1);
        }
      } catch (err) {
        console.error("useRecentHighlights error:", err);
        if (mounted) setError("Failed to fetch recent highlights");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadRecent();
    return () => {
      mounted = false;
    };
  }, [page, pageSize]);

  return { videos, loading, error, totalPages };
}

/**
 * Country Videos — filter from in-memory allVideos
 */
export function useCountryVideos(allVideos, country, page = 1, pageSize = 6) {
  return useMemo(() => {
    if (!country || !allVideos.length) {
      return { videos: [], totalPages: 1 };
    }

    const filtered = allVideos.filter((v) => v.country === country);
    const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
    const start = (page - 1) * pageSize;
    const end = start + pageSize;

    return {
      videos: filtered.slice(start, end),
      totalPages,
    };
  }, [allVideos, country, page, pageSize]);
}

/**
 * League Videos — filter from in-memory allVideos
 */
export function useLeagueVideos(allVideos, league, page = 1, pageSize = 6) {
  return useMemo(() => {
    if (!league || !allVideos.length) {
      return { videos: [], totalPages: 1 };
    }

    const filtered = allVideos.filter((v) => v.league === league);
    const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
    const start = (page - 1) * pageSize;
    const end = start + pageSize;

    return {
      videos: filtered.slice(start, end),
      totalPages,
    };
  }, [allVideos, league, page, pageSize]);
}

const BestofStreamVideoSchema = z.object({
  id: z.number(),
  match_id: z.number(),
  title: z.string(),
  category: z.string(),
  match_date: z.string(),
  thumbnail: z.string(),
  league: z.string(),
  video_url: z.string(),
  country: z.string(),
  total: z.number(),
});

// 🔹 Schema for the whole response
const BestofStreamResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object({
    type: z.string(),
    best_matches: z.array(BestofStreamVideoSchema),
  }),
});

// 🔹 Fetch Best of stream d explicitly
export function useBestofStream(page, pageSize = 4) {
  const [videos, setVideos] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadVideos() {
      setLoading(true);
      try {
        const res = await fetchFromApi({
          endpoint: `/interactions/top`,
          schema: BestofStreamResponseSchema,
        });

        if (res?.data?.best_matches) {
          const allVideos = res.data.best_matches;

          // slice for current page
          const start = (page - 1) * pageSize;
          const end = start + pageSize;

          setVideos(allVideos.slice(start, end));
          setTotalPages(Math.ceil(allVideos.length / pageSize));
        } else {
          setVideos([]);
          setTotalPages(1);
        }
      } catch (err) {
        console.error("use Best of Stream-d error:", err);
        setError("Failed to fetch Best of Stream-d");
      } finally {
        setLoading(false);
      }
    }
    loadVideos();
  }, [page, pageSize]);

  return {
    videos,
    loading,
    error,
    totalPages,
  };
}

/**
 * Generic hook to fetch videos by interaction type
 */
function useInteractionVideos(type, subscriber_id, page = 1, pageSize = 12) {
  const {
    [type]: interactions,
    fetchInteractions,
    removeInteraction,
    loading: interactionsLoading,
  } = useUserInteractions();

  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Step 1: load interactions (requires subscriber_id)
  useEffect(() => {
    if (subscriber_id) {
      fetchInteractions(type, subscriber_id);
    }
  }, [type, subscriber_id, fetchInteractions]);

  // Step 2: hydrate match_ids -> videos
  useEffect(() => {
    async function loadVideos() {
      if (!interactions?.length || !subscriber_id) {
        setVideos([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const start = (page - 1) * pageSize;
        const end = start + pageSize;
        const currentSlice = interactions.slice(start, end);

        const all = await Promise.all(
          currentSlice.map(async (i) => {
            if (!i?.match_id) {
              throw new Error("Invalid interaction: missing match_id");
            }

            try {
              const res = await fetchFromApi({
                endpoint: `/videos/${i.match_id}?subscriber_id=${subscriber_id}`,
                schema: z.object({ data: VideoSchema }),
              });
              return {
                ...res.data,
                match_id: i.match_id,
                subscriber_id,
                // created_at: i.created_at,
              };
            } catch {
              // fallback → return placeholder with subscriber_id + match_id
              return {
                id: i.match_id,
                match_id: i.match_id,
                subscriber_id,
                title: "Saved Match",
                category: "",
                thumbnail: "",
                league: "",
                video_url: "",
                country: "",
                match_date: "",
                // created_at: i.created_at,
              };
            }
          })
        );
        setVideos(all);
      } catch (err) {
        console.error(`❌ Failed to fetch ${type} videos`, err);
        setError(`Failed to fetch ${type} videos`);
      } finally {
        setLoading(false);
      }
    }

    loadVideos();
  }, [interactions, subscriber_id, type, page, pageSize]);

  const totalPages = Math.max(
    1,
    Math.ceil((interactions?.length || 0) / pageSize)
  );

  // Delete interaction (requires subscriber_id + match_id)
  const deleteVideo = (matchId, subscriber_id_override) => {
    const sid = subscriber_id_override || subscriber_id;
    if (!sid || !matchId) {
      console.error("❌ Missing subscriber_id or match_id for delete");
      return;
    }
    removeInteraction(type, matchId, sid);
  };

  return {
    videos,
    loading: loading || interactionsLoading,
    error,
    totalPages,
    deleteVideo,
  };
}

// ----------------------
// Specific Hooks
// ----------------------
export function useFavoriteVideos(subscriber_id, page) {
  return useInteractionVideos("favorite", subscriber_id, page);
}

export function useLovedVideos(subscriber_id, page) {
  return useInteractionVideos("love", subscriber_id, page);
}

export function useWatchLaterVideos(subscriber_id, page) {
  return useInteractionVideos("watchLater", subscriber_id, page);
}
