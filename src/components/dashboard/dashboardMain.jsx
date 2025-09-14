"use client";

import { useVideoContext } from "@/context/VideoContext";
import { VideoPage } from "@/components/video-overlay";

export function DashboardMain({ children }) {
  const { selectedVideo } = useVideoContext();

  return (
    <div className="flex-1 overflow-y-auto">
      {selectedVideo ? (
        <VideoPage
          videoTitle={selectedVideo.title}
          videoCategory={selectedVideo.category}
          videoUrl={selectedVideo.video_url}
          videoId={selectedVideo.id}
        />
      ) : (
        children
      )}
    </div>
  );
}
