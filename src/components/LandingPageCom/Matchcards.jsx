import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import HighlightsPagination from "./Pagination-homepage";
import { useSearchParams, useRouter } from "next/navigation";
import { FootballIcon, CardImg } from "@/assets";
import Image from "next/image";
import { SubscriptionModal } from "@/components/LandingPageCom/subscription-modal";
import { useVideos } from "@/hooks/useVideos";
import { useAuth } from "@/context/AuthContext";
import { useVideoContext } from "@/context/VideoContext";
import { usePathname } from "next/navigation";

function Matchcards({ activeTab, filter, page, setPage }) {
  const [error, setError] = useState();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const { setSelectedVideo } = useVideoContext();
  const pathname = usePathname();

  const [subscriptionModal, setSubscriptionModal] = useState({
    isOpen: false,
    videoType: "highlight",
  });

  // const initialPage = Number(searchParams.get("page")) || 1;
  // const [page, setPage] = useState(initialPage);
  const pageSize = 16;

  // 🔹 Use the upgraded hook (handles /videos + /search)
  const {
    videos,
    metadata,
    loading,
    error: fetchError,
    isSearchMode,
  } = useVideos(activeTab, page, pageSize, filter);

  useEffect(() => {
    if (fetchError) setError(fetchError);
  }, [fetchError]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page);
    router.replace(`?${params.toString()}`, { scroll: false });
  }, [page, router, searchParams]);

  const handleVideoClick = (video) => {
    console.log("Selecting video:", video);
    if (user) {
      setSelectedVideo(video, pathname);
    } else {
      setSubscriptionModal({ isOpen: true, videoType: video.category });
    }
  };

  const getPageTitle = () => {
    if (activeTab === "Highlights") return "Highlights";
    if (activeTab === "Live Stream") return "Live Stream";
    if (activeTab === "All Goals") return "All Goals";
    return null;
  };

  const pageTitle = getPageTitle();

  return (
    <>
      <section id="matchcards" className="">
        {pageTitle && (
          <div className="text-head max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="flex items-center justify-between hover:bg-hover-button dark:hover:bg-hover-button dark:bg-hover cursor-pointer rounded-lg shadow-lg h-13 w-60 mb-10"
            >
              <h2 className="text-lg text-center font-bold text-chart flex items-center">
                <div className="relative w-20 h-20">
                  <Image
                    src={FootballIcon}
                    alt="Logo"
                    fill
                    sizes="60px"
                    priority
                    className="object-contain"
                  />
                </div>
                {/* <Image
                  src={FootballIcon}
                  alt="football Icon"
                  width={60}
                  height={60}
                  priority
                /> */}
                {pageTitle}
              </h2>
            </motion.div>
          </div>
        )}

        {loading && <p className="text-center text-gray-500">Loading...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {!loading && videos.length === 0 && (
          <p className="text-center text-gray-500 text-lg font-semibold">
            No results found
          </p>
        )}

        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 md:px-8 px-3 gap-6 mb-8"
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: {
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
        >
          {loading
            ? Array.from({ length: pageSize }).map((_, i) => (
                <div
                  key={i}
                  className="bg-gray-200 h-48 rounded-lg animate-pulse"
                />
              ))
            : videos.map((video) => (
                <motion.div
                  key={video.id}
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    show: { opacity: 1, y: 0 },
                  }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  whileHover={{
                    scale: 1.05,
                    y: -5,
                    boxShadow: "0px 8px 25px rgba(0,0,0,0.2)",
                  }}
                  whileTap={{ scale: 0.97 }}
                  className="bg-white dark:bg-gray-300 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                  onClick={() => handleVideoClick(video)}
                >
                  <div className="aspect-video relative">
                    <Image
                      src={video.thumbnail || CardImg}
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
                      src={video.thumbnail || CardImg}
                      alt={video.title}
                      fill
                      sizes="100vw"
                      className="object-cover rounded-lg"
                    />
                    <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-semibold">
                      {video.category.toUpperCase()}
                    </div>
                  </div> */}
                  <div className="md:p-4 p-2">
                    <h4 className="font-semibold text-chart-1 dark:text-[#F60005] mb-1">
                      {video.league}
                    </h4>
                    <p className="text-md text-destructive font-bold dark:text-[#8F0606]">
                      {video.title}
                    </p>
                    <p className="text-md text-destructive font-bold dark:text-[#8F0606]">
                      {video.country}
                    </p>
                  </div>
                </motion.div>
              ))}
        </motion.div>
        <HighlightsPagination metadata={metadata} onPageChange={setPage} />
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

export default Matchcards;
