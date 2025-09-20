"use client";

import { useState, useMemo } from "react";
// import FilterTabs from "@/components/dashboard/FilterTabs";
import { VideosGrid } from "@/lib/VideosGrid";
import { Pagination } from "@/components/dashboard/pagination";
import {
  useFavoriteVideos,
  useLovedVideos,
  useWatchLaterVideos,
} from "@/hooks/useVideosData";
import { useAuth } from "@/context/AuthContext";
import { usePathname } from "next/navigation";
import { VideoPage } from "@/components/video-overlay";
import { useVideoContext } from "@/context/VideoContext";

const hooksMap = {
  favorite: useFavoriteVideos,
  love: useLovedVideos,
  watchLater: useWatchLaterVideos,
};

export default function SavedVideosPage({ type, title }) {
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const { selectedVideo, setSelectedVideo } = useVideoContext();
  const pathname = usePathname();
  // const [filter, setFilter] = useState(null);

  const useHook = hooksMap[type];
  if (!useHook) throw new Error(`Invalid type: ${type}`);

  const { videos, loading, error, totalPages, deleteVideo } = useHook(
    user?.subscriber_id,
    page
  );

  // 👇 Apply filter logic
  // const filteredVideos = useMemo(() => {
  //   if (!filter) return videos;

  //   const today = new Date();
  //   const yesterday = new Date();
  //   yesterday.setDate(today.getDate() - 1);

  //   return videos.filter((video) => {
  //     // assume video has a saved_at or created_at field
  //     const savedDate = new Date(video.created_at);

  //     const isToday = savedDate.toDateString() === today.toDateString();
  //     const isYesterday = savedDate.toDateString() === yesterday.toDateString();

  //     if (filter === "today") return isToday;
  //     if (filter === "yesterday") return isYesterday;
  //     return true;
  //   });
  // }, [videos, filter]);

  if (selectedVideo) {
    return (
      <VideoPage
        videoTitle={videos.title}
        videoCategory={videos.category}
        videoUrl={videos.video_url}
        videoId={videos.id}
        videoMatchId={videos.match_id}
      />
    );
  }

  return (
    <div className="relative z-50 flex flex-col justify-between w-full p-6 space-y-3">
      {/* Header */}
      <div className="flex flex-col justify-between mb-5">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          {title}
        </h1>
        {/* <FilterTabs onFilterChange={setFilter} /> */}
      </div>

      {/* States */}
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Video grid */}
      {videos.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">
          No saved videos found.
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {videos.map((video) => (
            <VideosGrid
              key={video.id}
              video={video}
              onDelete={deleteVideo}
              onClick={() => setSelectedVideo(video, pathname)}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
