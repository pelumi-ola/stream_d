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

function Matchcards({ activeTab, filter }) {
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

  const handleVideoClick = (video) => {
    console.log("Selecting video:", video);
    if (user) {
      setSelectedVideo(video, pathname);
    } else {
      setSubscriptionModal({ isOpen: true, videoType: video.category });
    }
  };

  // const handleVideoClick = (video) => {
  //   console.log("Selecting video:", video);
  //   if (user) {
  //     setSelectedVideo(video, pathname);
  //     router.push(`/video/${video.id}`);
  //   } else {
  //     setSubscriptionModal({ isOpen: true, videoType: video.category });
  //   }
  // };

  const initialPage = Number(searchParams.get("page")) || 1;
  const [page, setPage] = useState(initialPage);

  const pageSize = 16;

  const { videos, metadata, loading } = useVideos(
    activeTab,
    page,
    pageSize,
    filter
  );

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page);
    router.replace(`?${params.toString()}`, { scroll: false });
  }, [page, router, searchParams]);

  const getPageTitle = () => {
    if (activeTab === "Highlights") return "Highlights";
    if (activeTab === "Live Stream") return "Live Stream";
    if (activeTab === "All Goals") return "All Goals";
    return null;
  };

  const pageTitle = getPageTitle();

  return (
    <>
      <section id="highlights" className="">
        {pageTitle && (
          <div className="text-head max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="flex items-center justify-between hover:bg-hover-button dark:hover:bg-hover-button dark:bg-hover cursor-pointer rounded-lg shadow-lg h-13 w-60 mb-10"
            >
              <h2 className="text-lg text-center font-bold text-chart flex items-center">
                <Image
                  src={FootballIcon}
                  alt="football Icon"
                  width={60}
                  height={60}
                />
                {pageTitle}
              </h2>
            </motion.div>
          </div>
        )}

        {loading && <p className="text-center text-gray-500">Loading...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {!loading && videos.length === 0 && activeTab === "All Goals" && (
          <p className="text-center text-gray-500 text-lg font-semibold">
            Coming Soon
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
                      className="object-cover rounded-lg"
                    />
                    <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-semibold">
                      {video.category.toUpperCase()}
                    </div>
                  </div>
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
