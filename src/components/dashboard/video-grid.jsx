"use client";
import { CardImg } from "@/assets";
import Image from "next/image";

const highlights = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  title: "Highlight",
  subtitle: "Congo - Sudan",
}));

export function VideoGrid() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {highlights.map((highlight) => (
        <div
          key={highlight.id}
          className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer"
        >
          <div className="relative">
            <Image
              height={500}
              width={500}
              src={CardImg}
              alt={highlight.title}
              className=""
            />
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
                <div className="w-0 h-0 border-l-[8px] border-l-red-600 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent ml-1"></div>
              </div>
            </div>
          </div>
          <div className="md:p-4 p-2">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {highlight.title}
            </h3>
            <p className="text-sm text-red-600 dark:text-red-400">
              {highlight.subtitle}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
