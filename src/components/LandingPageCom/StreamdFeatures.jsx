import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, sectionCard } from "@/assets";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { SubscriptionModal } from "@/components/LandingPageCom/subscription-modal";
import {
  useExtendedHighlights,
  useRecentHighlights,
  useBestofStream,
} from "@/hooks/useVideos";
import { formatMatchDate } from "@/lib/formatDate";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useVideoContext } from "@/context/VideoContext";
import { usePathname } from "next/navigation";

// Variants
const gridVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0 },
};

export default function StreamAndHighlights() {
  const [extendedPage, setExtendedPage] = useState(1);
  const [recentPage, setRecentPage] = useState(1);
  const [bestofStreamPage, setBestofStreamPage] = useState(1);
  const { user } = useAuth();
  const router = useRouter();
  const { setSelectedVideo } = useVideoContext();
  const pathname = usePathname();

  // const PAGE_SIZE = 4;
  // 🔹 fetch extended highlights
  const {
    videos: extendedHighlights,
    loading: highlightsLoading,
    error: highlightsError,
    totalPages: extendedTotalPages,
  } = useExtendedHighlights(extendedPage);

  // 🔹 fetch recent highlights
  const {
    videos: recentHighlights,
    loading: recentHighlightsLoading,
    error: recentHighlightsError,
    totalPages: recentTotalPages,
  } = useRecentHighlights(recentPage);

  // 🔹 fetch best of stream highlights
  const {
    videos: bestofStream,
    loading: bestofStreamLoading,
    error: bestofStreamError,
    totalPages: bestofStreamTotalPages,
  } = useBestofStream(bestofStreamPage, 4);

  const [subscriptionModal, setSubscriptionModal] = useState({
    isOpen: false,
    videoType: "highlight",
  });

  // 🔹 extended handlers
  const handleExtendedNext = () => {
    setExtendedPage((prev) => (prev < extendedTotalPages ? prev + 1 : prev));
  };
  const handleExtendedPrev = () => {
    setExtendedPage((prev) => (prev > 1 ? prev - 1 : prev));
  };

  // 🔹 recent handlers
  const handleRecentNext = () => {
    setRecentPage((prev) => (prev < recentTotalPages ? prev + 1 : prev));
  };
  const handleRecentPrev = () => {
    setRecentPage((prev) => (prev > 1 ? prev - 1 : prev));
  };

  // 🔹best of stream d handlers
  // 🔹best of stream d handlers
  const handleBestofStreamNext = () => {
    setBestofStreamPage((prev) =>
      prev < bestofStreamTotalPages ? prev + 1 : prev
    );
  };

  const handleBestofStreamPrev = () => {
    setBestofStreamPage((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const handleVideoClick = (video) => {
    console.log("Selecting video:", video);
    if (user) {
      setSelectedVideo(video, pathname); // context handles route vs inline update
    } else {
      setSubscriptionModal({ isOpen: true, videoType: video.category });
    }
  };

  // const handleVideoClick = (video) => {
  //   if (user) {
  //     setSelectedVideo(video, pathname);
  //     router.push(`/video/${video.id}`);
  //   } else {
  //     setSubscriptionModal({ isOpen: true, videoType: video.category });
  //   }
  // };

  return (
    <>
      {/* Extended Highlights */}
      <section
        id="StreamD"
        className="py-8 mt-10 md:mt-18 bg-white/5 dark:bg-gray-900/50 backdrop-blur-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-foreground">
              Watch Extended Highlight
            </h2>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-white bg-primary rounded-full shadow-lg hover:bg-yellow-600 dark:hover:bg-gray-800/50"
                onClick={handleExtendedPrev}
              >
                <ChevronLeft className="w-6 h-6" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-white bg-primary rounded-full shadow-lg hover:bg-white/10 dark:hover:bg-gray-800/50"
                onClick={handleExtendedNext}
              >
                <ChevronRight className="w-6 h-6" />
              </Button>
            </div>
          </div>

          {/* Motion Grid */}
          <motion.div
            key={extendedPage}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6"
            variants={gridVariants}
            initial="hidden"
            animate="show"
          >
            {highlightsLoading && (
              <p className="col-span-4 text-center text-white">Loading...</p>
            )}
            {highlightsError && (
              <p className="col-span-4 text-center text-red-500">
                {highlightsError}
              </p>
            )}

            {highlightsLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-gray-200/20 dark:bg-gray-700 h-48 rounded-lg animate-pulse col-span-1"
                  />
                ))
              : !highlightsError &&
                extendedHighlights.map((video) => (
                  <motion.div
                    key={video.id}
                    variants={cardVariants}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    whileHover={{
                      scale: 1.05,
                      y: -5,
                      boxShadow: "0px 8px 25px rgba(0,0,0,0.2)",
                    }}
                    whileTap={{ scale: 0.97 }}
                    className="cursor-pointer"
                    onClick={() => handleVideoClick(video)}
                  >
                    <div className="aspect-video relative">
                      <Image
                        src={video.thumbnail || sectionCard}
                        alt={video.title}
                        fill
                        priority
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover rounded-md shadow-lg"
                      />
                    </div>

                    {/* <div className="aspect-video relative">
                      <Image
                        src={video.thumbnail || sectionCard}
                        alt={video.title}
                        fill
                        sizes="100vw"
                        className="object-cover rounded-md shadow-lg"
                      />
                    </div> */}
                    <div className="mt-1 p-2 bg-black/58 dark:bg-gray-800 border-2 border-primary rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                      <h3 className="font-semibold text-sm text-white">
                        {video.title}
                      </h3>
                      <p className="text-sm text-white">{video.country}</p>
                      <p className="flex mt-1 justify-end text-sm font-bold text-chart-5 text-wrap dark:text-[#F60005]">
                        {video.match_date
                          ? formatMatchDate(video.match_date)
                          : ""}
                      </p>
                    </div>
                  </motion.div>
                ))}
          </motion.div>
        </div>
      </section>

      {/* Recent Highlights */}
      <section
        id="StreamD"
        className="py-8 mt-10 md:mt-18 bg-white/5 dark:bg-gray-900/50 backdrop-blur-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-foreground">
              Recent Football Highlight
            </h2>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-white bg-primary rounded-full shadow-lg hover:bg-yellow-600 dark:hover:bg-gray-800/50"
                onClick={handleRecentPrev}
              >
                <ChevronLeft className="w-6 h-6" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-white bg-primary rounded-full shadow-lg hover:bg-white/10 dark:hover:bg-gray-800/50"
                onClick={handleRecentNext}
              >
                <ChevronRight className="w-6 h-6" />
              </Button>
            </div>
          </div>

          {/* Motion Grid */}
          <motion.div
            key={recentPage}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6"
            variants={gridVariants}
            initial="hidden"
            animate="show"
          >
            {recentHighlightsLoading && (
              <p className="col-span-4 text-center text-white">Loading...</p>
            )}
            {recentHighlightsError && (
              <p className="col-span-4 text-center text-red-500">
                {recentHighlightsError}
              </p>
            )}

            {recentHighlightsLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-gray-200/20 dark:bg-gray-700 h-48 rounded-lg animate-pulse col-span-1"
                  />
                ))
              : !recentHighlightsError &&
                recentHighlights.map((video) => (
                  <motion.div
                    key={video.id}
                    variants={cardVariants}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    whileHover={{
                      scale: 1.05,
                      y: -5,
                      boxShadow: "0px 8px 25px rgba(0,0,0,0.2)",
                    }}
                    whileTap={{ scale: 0.97 }}
                    className="cursor-pointer"
                    onClick={() => handleVideoClick(video)}
                  >
                    <div className="aspect-video relative">
                      <Image
                        src={video.thumbnail || sectionCard}
                        alt={video.title}
                        fill
                        priority
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover rounded-md shadow-lg"
                      />
                    </div>

                    {/* <div className="aspect-video relative">
                      <Image
                        src={video.thumbnail || sectionCard}
                        alt={video.title}
                        fill
                        sizes="100vw"
                        className="object-cover rounded-md shadow-lg"
                      />
                    </div> */}
                    <div className=" mt-1 p-2 bg-black/58 dark:bg-gray-800 border-2 border-primary rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                      <h3 className="font-semibold text-sm text-white">
                        {video.title}
                      </h3>
                      <p className="text-sm text-white">
                        {video.country || "unknown"}
                      </p>
                      <p className="flex mt-1 justify-end text-sm font-bold text-chart-5 dark:text-[#F60005]">
                        {video.match_date
                          ? formatMatchDate(video.match_date)
                          : ""}
                      </p>
                    </div>
                  </motion.div>
                ))}
          </motion.div>
        </div>
      </section>

      {/* Best of Stream D */}
      <section
        id="StreamD"
        className="py-8 mt-10 md:mt-18 bg-white/5 dark:bg-gray-900/50 backdrop-blur-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-foreground">
              Best Of Stream D
            </h2>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-white bg-primary rounded-full shadow-lg hover:bg-yellow-600 dark:hover:bg-gray-800/50"
                onClick={handleBestofStreamPrev}
              >
                <ChevronLeft className="w-6 h-6" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-white bg-primary rounded-full shadow-lg hover:bg-white/10 dark:hover:bg-gray-800/50"
                onClick={handleBestofStreamNext}
              >
                <ChevronRight className="w-6 h-6" />
              </Button>
            </div>
          </div>

          {/* Motion Grid */}
          <motion.div
            key={bestofStreamPage}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6"
            variants={gridVariants}
            initial="hidden"
            animate="show"
          >
            {bestofStreamLoading && (
              <p className="col-span-4 text-center text-white">Loading...</p>
            )}
            {bestofStreamError && (
              <p className="col-span-4 text-center text-red-500">
                {bestofStreamError}
              </p>
            )}

            {bestofStreamLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-gray-200/20 dark:bg-gray-700 h-48 rounded-lg animate-pulse col-span-1"
                  />
                ))
              : !bestofStreamError &&
                bestofStream.map((video) => (
                  <motion.div
                    key={video.id}
                    variants={cardVariants}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    whileHover={{
                      scale: 1.05,
                      y: -5,
                      boxShadow: "0px 8px 25px rgba(0,0,0,0.2)",
                    }}
                    whileTap={{ scale: 0.97 }}
                    className="cursor-pointer"
                    onClick={() => handleVideoClick(video)}
                  >
                    <div className="aspect-video relative">
                      <Image
                        src={video.thumbnail || sectionCard}
                        alt={video.title}
                        fill
                        priority
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover rounded-md shadow-lg"
                      />
                    </div>

                    {/* <div className="aspect-video relative">
                      <Image
                        src={video.thumbnail || sectionCard}
                        alt={video.title}
                        fill
                        sizes="100vw"
                        className="object-cover rounded-md shadow-lg"
                      />
                    </div> */}
                    <div className=" mt-1 p-2 bg-black/58 dark:bg-gray-800 border-2 border-primary rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                      <h3 className="font-semibold text-sm text-white">
                        {video.title}
                      </h3>
                      <p className="text-sm text-white">
                        {video.country || "unknown"}
                      </p>
                      <p className="flex mt-1 justify-end text-sm font-bold text-chart-5 dark:text-[#F60005]">
                        {video.match_date
                          ? formatMatchDate(video.match_date)
                          : ""}
                      </p>
                    </div>
                  </motion.div>
                ))}
          </motion.div>
        </div>
      </section>

      {!user && (
        <SubscriptionModal
          isOpen={subscriptionModal.isOpen}
          onClose={() =>
            setSubscriptionModal({ isOpen: false, videoType: "highlight" })
          }
          videoType={subscriptionModal.videoType}
        />
      )}
    </>
  );
}
