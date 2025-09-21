"use client";

import { useState } from "react";
import FilterTab from "@/components/dashboard/FilterTab";
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
import { Button } from "@/components/ui/button";

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

  const useHook = hooksMap[type];
  if (!useHook) throw new Error(`Invalid type: ${type}`);

  const { videos, loading, error, totalPages, deleteVideo } = useHook(
    user?.subscriber_id,
    page
  );

  const [filteredVideos, setFilteredVideos] = useState(null);

  // true if user has applied a filter
  const hasFiltered = filteredVideos !== null;
  const videosToShow = hasFiltered ? filteredVideos : videos;

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
    <div className="relative z-10 flex flex-col justify-between w-full p-6 space-y-3">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between mb-5">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          {title}
        </h1>
        <div className="flex items-center gap-3">
          <FilterTab
            videos={videos}
            onFilterChange={(payload) => {
              if (!payload) {
                setFilteredVideos(null);
                return;
              }

              const filtered = videos.filter((v) => {
                const matchesQuery =
                  payload.q &&
                  (v.title?.toLowerCase().includes(payload.q.toLowerCase()) ||
                    v.league?.toLowerCase().includes(payload.q.toLowerCase()) ||
                    v.country
                      ?.toLowerCase()
                      .includes(payload.q.toLowerCase()) ||
                    v.category
                      ?.toLowerCase()
                      .includes(payload.q.toLowerCase()));

                const matchesLeague =
                  payload.league && v.leagueId === payload.league; // Assuming payload.league is id
                const matchesTeam = payload.team && v.teamId === payload.team; // Assuming payload.team is id
                const matchesCategory =
                  payload.category && v.category === payload.category;

                return (
                  (!payload.q || matchesQuery) &&
                  (!payload.league || matchesLeague) &&
                  (!payload.team || matchesTeam) &&
                  (!payload.category || matchesCategory)
                );
              });

              setFilteredVideos(filtered);
            }}
          />

          {/* Clear button */}
          {hasFiltered && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFilteredVideos(null)}
            >
              Clear
            </Button>
          )}
          {/* <FilterTab /> */}
        </div>
      </div>

      {/* Video Grid */}
      {loading && (
        <p className="text-center text-gray-500">Loading highlights...</p>
      )}
      {error && <p className="text-center text-red-500">{error}</p>}

      {!loading && !error && videosToShow.length === 0 && hasFiltered && (
        <p className="text-center text-gray-500">No results found.</p>
      )}

      {!loading && !error && videosToShow.length === 0 && !hasFiltered && (
        <p className="text-center text-gray-500">No highlights available.</p>
      )}

      {!loading && !error && videosToShow.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {videosToShow.map((video) => (
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
