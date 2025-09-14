"use client";

import { use } from "react";
import { useVideoContext } from "@/context/VideoContext";
import { VideoPage } from "@/components/video-overlay";

export default function VideoRoute({ params }) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;

  const { selectedVideo, videoCache } = useVideoContext();

  const rawVideo =
    selectedVideo?.id.toString() === id
      ? selectedVideo
      : videoCache[id] || null;

  if (!rawVideo) return <p className="text-center py-10">Video not found</p>;

  const video = {
    ...rawVideo,
    id: rawVideo.id,
    match_id: rawVideo.match_id,
  };

  return (
    <VideoPage
      videoTitle={video.title}
      videoCategory={video.category}
      videoUrl={video.video_url}
      videoId={video.id}
      videoMatchId={video.match_id}
    />
  );
}
