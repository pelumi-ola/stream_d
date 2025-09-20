"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Pagination } from "@/components/dashboard/pagination";
import { VideoCard } from "@/lib/VideosCard";
import { useBestofStream } from "@/hooks/useVideosData";
import VideoRoute from "@/app/video/[id]/page";
import { useVideoContext } from "@/context/VideoContext";

export default function BestofstreamPage() {
  const [page, setPage] = useState(1);
  const pageSize = 12;
  const { selectedVideo, setSelectedVideo } = useVideoContext();
  const pathname = usePathname();

  // ✅ Fetch videos
  const { videos, loading, error, totalPages } = useBestofStream(
    page,
    pageSize
  );

  if (selectedVideo) {
    return <VideoRoute params={{ id: selectedVideo.id.toString() }} />;
  }

  return (
    <div className="w-full p-6 space-y-3">
      {/* Header */}
      <div className="flex flex-row justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          🏆 Best Of Stream D
        </h1>
      </div>

      {/* Video Grid */}
      {loading && (
        <p className="text-center text-gray-500">Loading highlights...</p>
      )}
      {error && <p className="text-center text-red-500">{error}</p>}

      {!loading && !error && videos.length === 0 && (
        <p className="text-center text-gray-500">No highlights available.</p>
      )}

      {!loading && !error && videos.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {videos.map((video) => (
            <VideoCard
              key={video.id}
              video={video}
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
