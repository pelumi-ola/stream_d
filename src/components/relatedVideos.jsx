import React from "react";
import Image from "next/image";
import { useRelatedVideos } from "@/hooks/useVideos";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useVideoContext } from "@/context/VideoContext";

function RelatedVideos({ videoId }) {
  const { user } = useAuth();
  const { videos: relatedVideos, loading: relatedLoading } =
    useRelatedVideos(videoId);
  const router = useRouter();
  const { setSelectedVideo } = useVideoContext();
  const pathname = usePathname();

  const handleVideoClick = (video) => {
    if (user) {
      setSelectedVideo(video);
    }
  };

  //   const handleVideoClick = (video) => {
  //     console.log("Selecting video:", video);
  //     if (user) {
  //       setSelectedVideo(video, pathname);
  //       router.push(`/video/${video.id}`);
  //     }
  //   };

  return (
    <div className="bg-white dark:bg-gray-900 md:p-6 p-2 mt-4 rounded-md">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Related Matches
      </h3>

      {relatedLoading ? (
        <p className="text-gray-500">Loading...</p>
      ) : relatedVideos.length === 0 ? (
        <p className="text-gray-500">No related matches found</p>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 md:px-8 px-3 gap-6 mb-8">
          {relatedVideos.map((video) => (
            <div
              key={video.id}
              className="bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden cursor-pointer"
              onClick={() => handleVideoClick(video)}
            >
              <div className="aspect-video relative">
                <Image
                  src={video.thumbnail}
                  alt={video.title}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover rounded-lg"
                />
                <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-semibold">
                  {video.category.toUpperCase()}
                </div>
              </div>
              {/* <div className="aspect-video relative">
                <Image
                  src={video.thumbnail}
                  fill
                  alt={video.title}
                  className="object-cover"
                />
                <div className="absolute top-1 left-1 bg-red-600 text-white px-1 py-0.5 rounded text-xs font-semibold">
                  {video.category}
                </div>
              </div> */}
              <div className="p-2">
                <h4 className="font-semibold text-xs text-gray-900 dark:text-white truncate">
                  {video.title}
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {video.league || "Unknown League"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RelatedVideos;
