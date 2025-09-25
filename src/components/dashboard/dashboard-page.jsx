"use client";
import { useState, useMemo, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { IoIosCheckbox, ChevronLeft, ChevronRight } from "@/assets";
import { VideoCard } from "@/lib/VideosCard";
import {
  useAllVideos,
  useRecentHighlights,
  useCountryVideos,
  useLeagueVideos,
} from "@/hooks/useVideosData";
import { motion } from "framer-motion";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { ChevronsUpDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { VideoPage } from "@/components/video-overlay";
import { useVideoContext } from "@/context/VideoContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { usePathname } from "next/navigation";
import { SuccessModal } from "@/components/success-modal";
import Link from "next/link";
import { TableSkeleton } from "../ui/table-skeleton";
import { formatRemaining } from "@/lib/formatDate";

const gridVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function DashboardPage() {
  const { user, logout, timeLeft } = useAuth();
  const router = useRouter();
  const { selectedVideo, setSelectedVideo } = useVideoContext();
  const [selectedCountry, setSelectedCountry] = useState();
  const [countryPage, setCountryPage] = useState(1);
  const [selectedLeague, setSelectedLeague] = useState(null);
  const pathname = usePathname();

  // console.log("User in Dashboard:", user);

  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    if (timeLeft === 60) {
      setShowWarning(true);
    }
  }, [timeLeft]);

  // 🔹 Fetch all videos (for leagues + countries)
  const { videos: allVideos, loading: loadingAll } = useAllVideos();
  const [recentPage, setRecentPage] = useState(1);

  // 🔹 Fetch recent highlights from /videos/recent
  const {
    videos: recentHighlights,
    loading: loadingRecent,
    totalPages: recentTotalPages,
  } = useRecentHighlights(recentPage, 5);

  const { videos: countryVideos, totalPages: countryPages } = useCountryVideos(
    allVideos,
    selectedCountry,
    countryPage,
    6
  );
  const loadingCountry = loadingAll || !selectedCountry;
  const [leaguePage, setLeaguePage] = useState(1);

  const { videos: leagueVideos, totalPages: leaguePages } = useLeagueVideos(
    allVideos,
    selectedLeague,
    leaguePage,
    6
  );

  // 🔹 Extract leagues & countries
  const leagues = useMemo(() => {
    const grouped = {};
    allVideos.forEach((v) => {
      if (!grouped[v.league]) grouped[v.league] = [];
      grouped[v.league].push(v);
    });
    return grouped;
  }, [allVideos]);

  const countries = useMemo(
    () => [...new Set(allVideos.map((v) => v.country))],
    [allVideos]
  );

  useEffect(() => {
    if (countries.length > 0 && !selectedCountry) {
      setSelectedCountry(countries[0]);
    }
  }, [countries, selectedCountry]);

  useEffect(() => {
    const leagueNames = Object.keys(leagues);
    if (leagueNames.length > 0 && !selectedLeague) {
      setSelectedLeague(leagueNames[0]);
    }
  }, [leagues, selectedLeague]);

  if (selectedVideo) {
    return (
      <VideoPage
        videoTitle={selectedVideo.title}
        videoCategory={selectedVideo.category}
        videoUrl={selectedVideo.video_url}
        videoId={selectedVideo.id}
        videoMatchId={selectedVideo.match_id}
      />
    );
  }

  if (!allVideos.length && !recentHighlights.length && !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="">
      <div className="flex justify-between mt-3 px-3">
        <h3 className="text-xl font-semibold mr-auto">Dashboard</h3>
      </div>

      <div className="p-6 space-y-10">
        {recentHighlights[0] && (
          <div className="relative w-full h-64 rounded-2xl overflow-hidden shadow-lg">
            <Image
              src={recentHighlights[0].thumbnail}
              alt={recentHighlights[0].title}
              fill
              sizes="100vw"
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
              <h2 className="text-2xl font-bold">
                {recentHighlights[0].title}
              </h2>
              <p className="text-sm">
                {recentHighlights[0].league} • {recentHighlights[0].country}
              </p>
              <Button
                className="mt-3 bg-primary hover:bg-purple-700 w-40"
                onClick={() => setSelectedVideo(recentHighlights[0], pathname)}
              >
                Watch Highlight
              </Button>
            </div>
          </div>
        )}

        {/* Recent Highlights */}
        <section className="mt-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">Recent Highlights</h3>

            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-white bg-primary rounded-full shadow-lg hover:bg-white/10 dark:hover:bg-gray-800/50"
                onClick={() => setRecentPage((p) => Math.max(p - 1, 1))}
                disabled={recentPage === 1}
              >
                <ChevronLeft className="w-6 h-6" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-white bg-primary rounded-full shadow-lg hover:bg-white/10 dark:hover:bg-gray-800/50"
                onClick={() =>
                  setRecentPage((p) => Math.min(p + 1, recentTotalPages))
                }
                disabled={recentPage === recentTotalPages}
              >
                <ChevronRight className="w-6 h-6" />
              </Button>
            </div>
          </div>

          <motion.div
            key={recentPage}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
            variants={gridVariants}
            initial="hidden"
            animate="show"
          >
            {recentHighlights.slice(1).map((video) => (
              <motion.div
                key={`recent-${video.id}`}
                variants={cardVariants}
                transition={{ duration: 0.6, ease: "easeOut" }}
                whileHover={{
                  scale: 1.05,
                  y: -5,
                  boxShadow: "0px 8px 25px rgba(0,0,0,0.2)",
                }}
                whileTap={{ scale: 0.97 }}
                className="cursor-pointer"
                onClick={() => setSelectedVideo(video, pathname)}
              >
                <VideoCard video={video} />
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* League Spotlight */}
        <section className="mt-10">
          <h3 className="text-xl font-semibold mb-4">League Spotlight</h3>

          <div className="mb-6">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className="w-42 md:w-64 justify-between"
                >
                  {selectedLeague || "Select a league"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full md:w-64 max-h-60 overflow-y-auto p-0">
                <Command>
                  <CommandInput placeholder="Search league..." />
                  <CommandEmpty>No league found.</CommandEmpty>
                  <CommandGroup>
                    {Object.keys(leagues).map((league) => (
                      <CommandItem
                        key={league}
                        onSelect={() => setSelectedLeague(league)}
                        className="cursor-pointer"
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedLeague === league
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {league}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {selectedLeague ? (
            <div className="overflow-hidden rounded-2xl shadow-md border border-gray-200">
              <Table className="[&>*]:divide-y-0">
                <TableHeader className="bg-primary/10">
                  <TableRow>
                    <TableHead className="hidden md:table-cell text-primary font-semibold">
                      Images
                    </TableHead>
                    <TableHead className="text-primary font-semibold">
                      Title
                    </TableHead>
                    <TableHead className="text-primary font-semibold">
                      League
                    </TableHead>
                    <TableHead className="text-primary font-semibold">
                      Country
                    </TableHead>
                    <TableHead className="text-primary font-semibold">
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leagueVideos.map((video) => (
                    <TableRow
                      key={`league-${video.id}`}
                      className="hover:bg-hover transition-colors cursor-pointer"
                      onClick={() => setSelectedVideo(video, pathname)}
                    >
                      <TableCell className="md:w-32 hidden md:table-cell ">
                        <div className="relative md:h-20 md:w-32 rounded-lg overflow-hidden">
                          <Image
                            src={video.thumbnail}
                            alt={video.title}
                            fill
                            priority
                            sizes="(min-width: 768px) 128px, 100vw"
                            className="object-cover"
                          />
                        </div>

                        {/* <div className="relative md:h-20 md:w-32 rounded-lg overflow-hidden">
                          <Image
                            src={video.thumbnail}
                            alt={video.title}
                            fill
                            className="object-cover"
                          />
                        </div> */}
                      </TableCell>
                      <TableCell className="font-medium text-chart-text whitespace-normal break-words">
                        {video.title}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600 whitespace-normal break-words">
                        {video.league}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600 whitespace-normal break-words">
                        {video.country}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-primary border-primary hover:bg-hover-button"
                        >
                          Watch
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* ✅ Pagination under league table */}
              {leaguePages > 1 && (
                <div className="flex justify-center items-center gap-4 py-4 border-t bg-white">
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={leaguePage === 1}
                    onClick={() => setLeaguePage((p) => Math.max(p - 1, 1))}
                    className="rounded-full bg-primary text-white hover:bg-primary/80"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </Button>
                  <span className="text-sm dark:text-black font-medium">
                    Page {leaguePage} of {leaguePages}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={leaguePage === leaguePages}
                    onClick={() =>
                      setLeaguePage((p) => Math.min(p + 1, leaguePages))
                    }
                    className="rounded-full bg-primary text-white hover:bg-primary/80"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <TableSkeleton />
          )}
        </section>

        <section className="mt-10">
          <h3 className="text-xl font-semibold mb-4">Country Highlights</h3>
          <div className="mb-6">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className="w-40 md:w-64 justify-between"
                >
                  {selectedCountry || "Select a country"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full md:w-64 max-h-60 overflow-y-auto p-0">
                <Command>
                  <CommandInput placeholder="Search country..." />
                  <CommandEmpty>No country found.</CommandEmpty>
                  <CommandGroup>
                    {countries.map((c) => (
                      <CommandItem
                        key={c}
                        onSelect={() => {
                          setSelectedCountry(c);
                          setCountryPage(1);
                        }}
                        className="cursor-pointer"
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedCountry === c ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {c}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div className="overflow-hidden rounded-2xl shadow-md border border-gray-200">
            <h4 className="text-lg font-bold px-4 py-3 text-primary bg-primary/5">
              Highlights from {selectedCountry}
            </h4>

            {countryVideos.length > 0 ? (
              <>
                <Table className="[&>*]:divide-y-0">
                  <TableHeader className="bg-primary/10">
                    <TableRow>
                      <TableHead className="hidden md:table-cell text-primary font-semibold">
                        Images
                      </TableHead>
                      <TableHead className="text-primary font-semibold">
                        Title
                      </TableHead>
                      <TableHead className="text-primary font-semibold">
                        League
                      </TableHead>
                      <TableHead className="text-primary font-semibold">
                        Country
                      </TableHead>
                      <TableHead className="text-primary font-semibold">
                        Action
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {countryVideos.map((video) => (
                      <TableRow
                        key={`country-${video.id}`}
                        className="hover:bg-hover transition-colors cursor-pointer"
                        onClick={() => setSelectedVideo(video, pathname)}
                      >
                        <TableCell className="md:w-32 hidden md:table-cell ">
                          <div className="relative md:h-20 md:w-32 rounded-lg overflow-hidden">
                            <Image
                              src={video.thumbnail}
                              alt={video.title}
                              fill
                              priority
                              sizes="(min-width: 768px) 128px, 100vw"
                              className="object-cover"
                            />
                          </div>

                          {/* <div className="relative md:h-20 md:w-32 rounded-lg overflow-hidden">
                            <Image
                              src={video.thumbnail}
                              alt={video.title}
                              fill
                              className="object-cover"
                            />
                          </div> */}
                        </TableCell>
                        <TableCell className="font-medium text-chart-text whitespace-normal break-words">
                          {video.title}
                        </TableCell>
                        <TableCell className="text-sm text-gray-600 whitespace-normal break-words">
                          {video.league}
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {video.country}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-primary border-primary hover:bg-hover-button"
                          >
                            Watch
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* ✅ Pagination directly under the table */}
                {countryPages > 1 && (
                  <div className="flex justify-center items-center gap-4 py-4 border-t bg-white">
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={countryPage === 1}
                      onClick={() => setCountryPage((p) => Math.max(p - 1, 1))}
                      className="rounded-full bg-primary text-white hover:bg-primary/80"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </Button>
                    <span className="text-sm dark:text-black font-medium">
                      Page {countryPage} of {countryPages}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={countryPage === countryPages}
                      onClick={() =>
                        setCountryPage((p) => Math.min(p + 1, countryPages))
                      }
                      className="rounded-full bg-primary text-white hover:bg-primary/80"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <TableSkeleton />
            )}
          </div>
        </section>

        {/* Subscription Info */}
        <section className="mt-10">
          <h3 className="text-xl font-semibold mb-4">Your Subscription</h3>
          {user && (
            <Card className="p-6 rounded-2xl shadow-lg bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-bold text-primary">
                  Subscription Details
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    user.status?.toLowerCase() === "active"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {user.status}
                </span>
              </div>

              <div className="space-y-3 text-sm">
                <p className="flex items-center gap-2">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">
                    📱 MSISDN:
                  </span>
                  <span className="text-gray-900 dark:text-white">
                    {user.msisdn}
                  </span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">
                    ⏰ Start:
                  </span>
                  <span className="text-gray-900 dark:text-white">
                    {new Date(user.start_time).toLocaleString()}
                  </span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">
                    🛑 End:
                  </span>
                  <span className="text-gray-900 dark:text-white">
                    {new Date(user.end_time).toLocaleString()}
                  </span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">
                    ⏳ Remaining:
                  </span>
                  <span className="text-gray-900 dark:text-white">
                    {formatRemaining(timeLeft)}
                  </span>
                </p>
              </div>

              <div className="mt-6 flex justify-end">
                <Link href="/login">
                  <Button className="bg-primary text-white rounded-full shadow-md hover:bg-primary/80">
                    Get Started
                  </Button>
                </Link>
              </div>
            </Card>
          )}
        </section>
      </div>

      <SuccessModal
        isOpen={showWarning}
        onClose={() => setShowWarning(false)}
        title="Session Expiring Soon"
        message="Your session will expire in 1 minute. Please resubscribe to continue uninterrupted."
        type="error"
        buttons={[
          {
            label: "Okay",
            variant: "primary",
            action: () => setShowWarning(false),
          },
        ]}
      />
    </div>
  );
}
