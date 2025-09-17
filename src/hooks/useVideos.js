// hooks/useVideos.js
import { useState, useEffect } from "react";
import { fetchFromApi } from "@/lib/api";
import { z } from "zod";

// 🔹 Fetch videos by tab/category
export function useVideos(activeTab, page, pageSize = 16, filter = null) {
  const [videos, setVideos] = useState([]);
  const [metadata, setMetadata] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Keep track if we're in search mode
  const [isSearchMode, setIsSearchMode] = useState(false);

  const getCategoryName = () => {
    if (activeTab === "Highlights") return "Highlights";
    if (activeTab === "Live Stream") return "Live Stream";
    if (activeTab === "All Goals") return "All Goals";
    return null;
  };

  useEffect(() => {
    async function loadVideos() {
      setLoading(true);
      setError(null);

      try {
        let endpoint = "";
        let params = { page, pageSize };

        // 🔹 Case 1: Search mode (filter object)
        if (filter && typeof filter === "object") {
          setIsSearchMode(true);
          endpoint = "/search";

          // Send all provided filters, including main query
          params = {
            limit: pageSize,
            offset: (page - 1) * pageSize,
            ...filter, // q, league, team, category
          };
        } else {
          setIsSearchMode(false);
          const categoryName = getCategoryName();
          const isDateFilter =
            filter &&
            typeof filter === "string" &&
            ["today", "yesterday", "tomorrow"].includes(filter.toLowerCase());

          if (categoryName) {
            endpoint = isDateFilter
              ? `/videos/category/${categoryName}/date`
              : `/videos/category/${categoryName}`;

            if (isDateFilter) {
              params.day = filter.toLowerCase();
            }
          } else {
            endpoint = "/videos";
            if (isDateFilter) params.day = filter.toLowerCase();
          }
        }

        const res = await fetchFromApi({ endpoint, params });

        if (res?.data?.length) {
          setVideos(res.data);
          setMetadata(res.metadata || null);
        } else {
          setVideos([]);
          setMetadata(null);
        }
      } catch (err) {
        console.error("useVideos error:", err);
        setError("Failed to fetch videos");
        setVideos([]);
        setMetadata(null);
      } finally {
        setLoading(false);
      }
    }

    loadVideos();
  }, [activeTab, page, pageSize, filter]);

  return {
    videos,
    loading,
    error,
    metadata,
    totalPages: metadata?.total_pages ?? 1,
    isSearchMode,
  };
}

// 🔹 Fetch Extended Highlights explicitly
export function useExtendedHighlights(page, pageSize = 4) {
  const [videos, setVideos] = useState([]);
  const [metadata, setMetadata] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadVideos() {
      setLoading(true);
      try {
        const res = await fetchFromApi({
          endpoint: `/videos/category/Extended Highlights`,
          params: { page, pageSize },
        });

        if (res?.data) {
          setVideos(res.data);
          setMetadata(res.metadata || null);
        } else {
          setVideos([]);
          setMetadata(null);
        }
      } catch (err) {
        console.error("useExtendedHighlights error:", err);
        setError("Failed to fetch extended highlights");
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
    metadata,
    totalPages: metadata?.total_pages ?? 1,
  };
}

// 🔹 Fetch Recent Highlights explicitly
export function useRecentHighlights(page, pageSize = 4) {
  const [videos, setVideos] = useState([]);
  const [metadata, setMetadata] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadVideos() {
      setLoading(true);
      try {
        const res = await fetchFromApi({
          endpoint: `/videos/recent`,
          params: { page, pageSize },
        });

        if (res?.data) {
          setVideos(res.data);
          setMetadata(res.metadata || null);
        } else {
          setVideos([]);
          setMetadata(null);
        }
      } catch (err) {
        console.error("useRecentHighlights error:", err);
        setError("Failed to fetch recent highlights");
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
    metadata,
    totalPages: metadata?.total_pages ?? 1,
  };
}

const OtherVideoSchema = z.object({
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

// 🔹 Fetch Related Matches by videoId
export function useRelatedVideos(videoId, limit = 8) {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!videoId) return;

    async function loadRelatedVideos() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetchFromApi({
          endpoint: `/videos/${videoId}/related`,
          params: { limit },
          schema: z.object({ data: z.array(OtherVideoSchema) }),
        });

        if (res?.data) {
          setVideos(res.data);
        } else {
          setVideos([]);
        }
      } catch (err) {
        console.error("useRelatedVideos error:", err);
        setError("Failed to fetch related videos");
      } finally {
        setLoading(false);
      }
    }

    loadRelatedVideos();
  }, [videoId, limit]);

  return { videos, loading, error };
}
