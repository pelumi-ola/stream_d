"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

const VideoContext = createContext();

export function VideoProvider({ children }) {
  const [videoCache, setVideoCache] = useState({});
  const [selectedVideo, setSelectedVideoState] = useState(null);
  const [history, setHistory] = useState([]);
  const [fromPath, setFromPath] = useState("/");
  const pathname = usePathname();
  const router = useRouter();

  // derived: are we inside dashboard?
  const inDashboard = pathname.startsWith("/dashboard");

  // Load from localStorage
  useEffect(() => {
    const storedCache = localStorage.getItem("videoCache");
    const storedSelected = localStorage.getItem("selectedVideo");
    const storedHistory = localStorage.getItem("videoHistory");
    const storedFromPath = localStorage.getItem("videoFromPath");

    if (storedCache) setVideoCache(JSON.parse(storedCache));

    if (storedSelected) {
      const parsed = JSON.parse(storedSelected);
      setSelectedVideoState({
        ...parsed,
        match_id: parsed.match_id ?? parsed.matchId ?? null,
      });
    }
    // if (storedSelected) setSelectedVideoState(JSON.parse(storedSelected));
    if (storedHistory) setHistory(JSON.parse(storedHistory));
    if (storedFromPath) setFromPath(storedFromPath);
  }, []);

  // Persist changes
  useEffect(() => {
    localStorage.setItem("videoCache", JSON.stringify(videoCache));
  }, [videoCache]);

  useEffect(() => {
    if (selectedVideo) {
      localStorage.setItem("selectedVideo", JSON.stringify(selectedVideo));
    } else {
      localStorage.removeItem("selectedVideo");
    }
  }, [selectedVideo]);

  useEffect(() => {
    localStorage.setItem("videoHistory", JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem("videoFromPath", fromPath);
  }, [fromPath]);

  // 🔹 Reset when navigating home
  useEffect(() => {
    if (pathname === "/") {
      setSelectedVideoState(null);
      setHistory([]);
      setVideoCache({});
      localStorage.clear();
    }
  }, [pathname]);

  /**
   * Add a video to context + handle navigation depending on mode
   */
  const setSelectedVideo = (video, originPath = pathname) => {
    if (!video?.id) {
      console.warn("Invalid video:", video);
      return;
    }

    const normalizedVideo = {
      ...video,
      id: video.id,
      match_id: video.match_id,
    };

    if (!normalizedVideo.match_id) {
      console.warn("⚠️ Missing match_id in video:", video);
    }

    setVideoCache((prev) => ({
      ...prev,
      [normalizedVideo.id]: normalizedVideo,
    }));

    if (selectedVideo) {
      setHistory((prev) => [...prev, selectedVideo.id]);
    }

    setSelectedVideoState(normalizedVideo);
    setFromPath(originPath);

    if (!inDashboard) {
      router.push(`/video/${normalizedVideo.id}`);
    }
  };

  /**
   * Navigate back in video history
   */

  const goBackVideo = () => {
    if (history.length > 0) {
      const prevHistory = [...history];
      const lastId = prevHistory.pop();
      setHistory(prevHistory);

      const previousVideo = videoCache[lastId];
      if (previousVideo) {
        setSelectedVideoState(previousVideo);
        if (!inDashboard) {
          router.push(`/video/${previousVideo.id}`);
        }
        return true;
      }
    }
    return false;
  };

  /**
   * Handle full back navigation (history, dashboard, or home)
   */
  const backFromVideo = () => {
    const hasPrev = goBackVideo();
    if (hasPrev) return;

    if (inDashboard) {
      setSelectedVideoState(null);
      return;
    }

    setSelectedVideoState(null);
    router.push("/");
  };

  const handleBack = () => {
    const prevVideo = goBackVideo();

    if (prevVideo) {
      // Already handled by goBackVideo
      return;
    }

    // If came from dashboard
    if (fromPath?.startsWith("/dashboard")) {
      setSelectedVideoState(null);
      router.push(fromPath);
      return;
    }

    // Default: clear and go home
    setSelectedVideoState(null);
    router.push("/");
  };

  return (
    <VideoContext.Provider
      value={{
        selectedVideo,
        setSelectedVideo,
        videoCache,
        history,
        goBackVideo,
        fromPath,
        inDashboard,
        handleBack,
        backFromVideo,
      }}
    >
      {children}
    </VideoContext.Provider>
  );
}

export function useVideoContext() {
  return useContext(VideoContext);
}
