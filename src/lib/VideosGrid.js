import { motion } from "framer-motion";
import Image from "next/image";
import { MdDeleteForever } from "@/assets";

export function VideosGrid({ video, onClick, onDelete }) {
  return (
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
      className="relative bg-white dark:bg-gray-300 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
      onClick={onClick}
    >
      {/* Thumbnail */}
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
          src={video.thumbnail}
          alt={video.title}
          fill
          className="object-cover rounded-lg"
        />
        <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-semibold">
          {video.category?.toUpperCase()}
        </div>
      </div> */}

      {/* Content */}
      <div className="p-4">
        <div className="flex flex-row justify-between items-center">
          <h4 className="font-semibold text-chart-1 dark:text-[#F60005] mb-1">
            {video.league}
          </h4>

          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(video.match_id);
              }}
              className="flex items-center text-red-600 hover:text-red-800"
            >
              <MdDeleteForever className="mr-1" size={20} />
              <span className="text-sm font-medium">Delete</span>
            </button>
          )}
        </div>

        <p className="text-md text-destructive font-bold dark:text-[#8F0606]">
          {video.title}
        </p>
        <p className="text-sm text-destructive text-end font-bold mt-3 dark:text-[#8F0606]">
          {video.country}
        </p>
      </div>
    </motion.div>
  );
}
