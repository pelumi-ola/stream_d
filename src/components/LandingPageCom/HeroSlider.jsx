"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Banner1 } from "@/assets";
import { useRecentHighlights } from "@/hooks/useVideos";
import { useVideoContext } from "@/context/VideoContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isManual, setIsManual] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const { videos: recentHighlights } = useRecentHighlights(1, 6);
  const { setSelectedVideo } = useVideoContext();
  const { user } = useAuth();
  const router = useRouter();

  // 🔹 Slides: static first + dynamic from backend
  const dynamicSlides = recentHighlights.map((video) => ({
    id: video.id,
    image: video.thumbnail,
    text: video.title.toUpperCase(),
    buttonText: "Watch Now",
    video,
  }));

  const slides = [
    {
      id: "static-1",
      image: Banner1,
      text: "Enjoy high quality football highlights, live scores and live matches from leagues worldwide!",
      buttonText: "Get Started",
      url: "/login",
    },
    ...dynamicSlides,
  ];

  const nextSlide = () => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % slides.length);
    setIsManual(true);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
    setIsManual(true);
  };

  // 🔹 Auto slide
  useEffect(() => {
    if (isManual) return;

    const timer = setInterval(() => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [isManual, slides.length]);

  // 🔹 Handle button click
  const handleButtonClick = (slide) => {
    if (slide.video) {
      if (user) {
        setSelectedVideo(slide.video);
        router.push(`/video/${slide.video.id}`);
      } else {
        router.push("/login");
      }
    } else {
      router.push(slide.url);
    }
  };

  if (!slides.length) return null;

  return (
    <section
      className="relative flex items-center h-[700px] bg-primary overflow-hidden"
      style={{ backgroundColor: "#6f30a0" }}
    >
      {/* Background Image */}
      <div className="absolute inset-0 pointer-events-none">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={slides[current].id}
            custom={direction}
            initial={{ opacity: 0, x: direction > 0 ? 100 : -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction > 0 ? -100 : 100 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0"
          >
            <Image
              src={slides[current].image}
              alt={slides[current].text}
              fill
              className="object-cover brightness-110"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#6f30a0]/40 via-[#6f30a0]/20 to-transparent" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full lg:w-[45vw] px-18 mb-25 space-y-8">
        <h1 className="text-5xl lg:text-6xl font-bold text-white drop-shadow-lg mb-10">
          Stream-D
        </h1>
        <motion.p
          key={slides[current].id + "-text"}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.6 }}
          className={`text-xl leading-relaxed drop-shadow-md ${
            slides[current].video
              ? "text-primary bg-hover-button rounded-lg p-5 font-bold"
              : "text-purple-100"
          }`}
        >
          {slides[current].text}
        </motion.p>

        <Button
          onClick={() => handleButtonClick(slides[current])}
          className={`font-semibold px-10 py-7 mt-5 text-lg rounded-2xl shadow-lg transition-colors
    ${
      slides[current].buttonText === "Watch Now"
        ? "bg-primary text-white hover:bg-primary/90"
        : "bg-white text-primary hover:bg-hover-button"
    }`}
        >
          {slides[current].buttonText}
        </Button>
      </div>

      {/* Arrows */}
      <button
        onClick={prevSlide}
        className="absolute z-20 cursor-pointer lg:left-2 bottom-1/2 mb-10 -translate-y-1/2 bg-black/60 lg:bg-black/10 hover:bg-white/40 p-3 rounded-full text-white"
      >
        <ChevronLeft size={28} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute z-20 cursor-pointer lg:right-5 right-3 bottom-1/2 mb-10 -translate-y-1/2 bg-black/60 lg:bg-black/10 hover:bg-white/40 p-3 rounded-full text-white"
      >
        <ChevronRight size={28} />
      </button>

      {/* Dot Indicators with Hover Previews */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-4">
        {slides.map((slide, index) => (
          <div
            key={index}
            className="relative flex justify-center"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {/* Dot */}
            <span
              className={`w-3 h-3 rounded-full cursor-pointer transition-all duration-300 ${
                current === index ? "bg-white scale-125" : "bg-black/40"
              }`}
              onClick={() => {
                setCurrent(index);
                setIsManual(true);
              }}
            />

            {/* Thumbnail Preview */}
            {hoveredIndex === index && (
              <div className="absolute right-6 top-1/2 -translate-y-1/2 w-32 h-20 bg-black/80 rounded-md shadow-lg overflow-hidden border border-white/20 z-50">
                <Image
                  src={slide.image}
                  alt={slide.text}
                  width={128}
                  height={80}
                  priority
                  className="object-cover w-full h-full"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs px-1 py-0.5 truncate">
                  {slide.text}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
