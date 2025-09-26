"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Heart, Bookmark } from "lucide-react";
import { useVideoContext } from "@/context/VideoContext";
import { useUserInteractionsContext } from "@/context/UserInteractionsContext";
import RelatedMatches from "@/components/relatedVideos";
import { useAuth } from "@/context/AuthContext";

export function VideoPage({
  videoTitle,
  videoCategory,
  videoUrl,
  videoId,
  videoMatchId,
}) {
  const { selectedVideo, handleBack } = useVideoContext();
  const matchId = videoMatchId ?? selectedVideo?.match_id ?? null;
  const { user } = useAuth();
  const {
    isFavorite,
    isWatchLater,
    isLoved,
    toggleInteraction,
    loadAllInteractions,
    loaded,
  } = useUserInteractionsContext();

  // console.log(
  //   "VideoPage: id=",
  //   videoId ?? selectedVideo?.id,
  //   "match_id=",
  //   matchId,
  //   "subscriber_id=",
  //   user?.subscriber_id
  // );

  // 🔹 Load all user interactions when the video page mounts
  useEffect(() => {
    if (user?.subscriber_id && !loaded) {
      loadAllInteractions(user.subscriber_id);
    }
  }, [user?.subscriber_id, loaded, loadAllInteractions]);

  const handleInteraction = (type) => {
    if (!user?.subscriber_id) return;
    if (!matchId) return;
    toggleInteraction(type, matchId, user.subscriber_id);
  };

  if (!videoUrl && !selectedVideo?.url) {
    return <p className="text-center py-10">No video found</p>;
  }

  // const handleInteraction = (type) => {
  //   if (!user?.subscriber_id) return;
  //   toggleInteraction(type, videoMatchId, user.subscriber_id);
  // };

  // if (!videoUrl) return <p className="text-center py-10">No video found</p>;

  return (
    <div className="min-h-screen bg-hover-button dark:bg-black overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between md:px-4 md:py-2 p-2 bg-gradient-to-b from-primary to-transparent">
        <Button
          variant="ghost"
          onClick={handleBack}
          className="text-white hover:bg-white/10"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </Button>
        <h2 className="text-white font-semibold">
          {videoTitle ?? selectedVideo?.title}
        </h2>
        <span className="text-sm text-gray-300">
          {" "}
          {videoCategory ?? selectedVideo?.category}
        </span>
      </div>

      <div className="md:p-6 p-3">
        <div className="w-full">
          <iframe
            src={videoUrl ?? selectedVideo?.url}
            style={{ border: "0" }}
            allow="autoplay; encrypted-media"
            allowFullScreen
            className="w-full rounded-b-xl aspect-video md:h-[500px] md:aspect-auto"
          />
        </div>

        {/* Actions */}
        <div className="flex flex-row justify-between space-x-3 bg-white dark:bg-gray-900 rounded-md mt-3 px-6">
          <div className="space-x-3 flex">
            {/* Favorite */}
            <Button
              variant="ghost"
              className="hover:bg-white/20 rounded-full flex items-center gap-2"
              onClick={() => handleInteraction("favorite")}
            >
              {isFavorite(videoMatchId ?? matchId) ? (
                <Bookmark className="w-5 h-5 text-primary fill-current" />
              ) : (
                <Bookmark className="w-5 h-5 text-gray-500" />
              )}
              <span
                className={`text-sm ${
                  isFavorite(videoMatchId ?? matchId)
                    ? "text-primary font-medium"
                    : "text-gray-600"
                }`}
              >
                Save to Favourite
              </span>
            </Button>

            {/* Watch Later */}
            <Button
              variant="ghost"
              className="hover:bg-white/20 rounded-full flex items-center gap-2"
              onClick={() => handleInteraction("watchLater")}
            >
              {isWatchLater(videoMatchId ?? matchId) ? (
                <Bookmark className="w-5 h-5 text-primary fill-current" />
              ) : (
                <Bookmark className="w-5 h-5 text-gray-500" />
              )}
              <span
                className={`text-sm ${
                  isWatchLater(videoMatchId ?? matchId)
                    ? "text-primary font-medium"
                    : "text-gray-600"
                }`}
              >
                Watch Later
              </span>
            </Button>
          </div>

          {/* Love */}
          <div className="space-x-3 flex">
            <Button
              variant="ghost"
              className="hover:bg-white/20 rounded-full flex items-center gap-2"
              onClick={() => handleInteraction("love")}
            >
              {isLoved(videoMatchId ?? matchId) ? (
                <Heart className="w-5 h-5 text-red-500 fill-red-500" />
              ) : (
                <Heart className="w-5 h-5 text-gray-500" />
              )}
              <span
                className={`text-sm ${
                  isLoved(videoMatchId ?? matchId)
                    ? "text-red-500 font-medium"
                    : "text-gray-600"
                }`}
              >
                Love
              </span>
            </Button>
          </div>
        </div>

        {/* Related Matches */}
        <RelatedMatches videoId={videoId} />
      </div>
    </div>
  );
}
