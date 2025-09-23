"use client";

import { useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { sidebarItems } from "@/lib/sidebarItems";
import { StreamdLogo, ChevronDown, TbLogout, ArrowLeft } from "@/assets";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "../ui/button";
import { useBestofStream } from "@/hooks/useVideos";
import { useVideoContext } from "@/context/VideoContext";
// import { useAuth } from "@/context/AuthContext";

export function AppSidebar() {
  // const { requestLogout } = useAuth();
  const pathname = usePathname();
  const [isLeagueOpen, setIsLeagueOpen] = useState(true);
  const [page] = useState(1);
  const { videos, loading, error } = useBestofStream(page, 5);
  const { setSelectedVideo } = useVideoContext();

  return (
    <Sidebar>
      <SidebarContent className="bg-white dark:bg-gray-800">
        <SidebarGroup>
          <SidebarGroupLabel>
            <Link href="/" className="flex gap-2 items-center p-3 mb-2">
              <div className="relative w-[60px] h-[60px]">
                <Image
                  src={StreamdLogo}
                  alt="Logo"
                  fill
                  priority
                  className="object-contain"
                  sizes="41px"
                />
              </div>

              {/* <Image src={StreamdLogo} alt="Logo" width={41} height={31} /> */}
              <span className="text-lg text-[#100F0F] dark:text-white">
                Stream D
              </span>
            </Link>
          </SidebarGroupLabel>
          <SidebarGroupContent className="border-t border-gray-200 dark:border-gray-700">
            <SidebarMenu className="mt-3">
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
                MENU
              </div>
              {sidebarItems.map((item) => {
                const isActive = pathname === item.url;

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link
                        href={item.url}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          isActive
                            ? "bg-purple-100 text-primary font-bold dark:bg-purple-900 dark:text-purple-300"
                            : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                        }`}
                      >
                        <item.icon
                          className={`w-5 h-5 ${
                            isActive
                              ? "text-primary font-bold dark:text-purple-300"
                              : "text-gray-500 dark:text-gray-400"
                          }`}
                        />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>

            <div className="mt-8">
              <button
                onClick={() => setIsLeagueOpen(!isLeagueOpen)}
                className="flex items-center justify-between w-full text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4"
              >
                Best of Stream D
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    isLeagueOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isLeagueOpen && (
                <>
                  {loading && (
                    <p className="text-sm text-gray-400 px-3">Loading...</p>
                  )}
                  {error && (
                    <p className="text-sm text-red-500 px-3">{error}</p>
                  )}

                  {!loading && !error && videos.length > 0 && (
                    <nav className="space-y-2 overflow-hidden">
                      {videos.map((video) => (
                        <Button
                          onClick={() => setSelectedVideo(video, pathname)}
                          key={video.id}
                          varient="outline"
                          className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg text-sm font-medium transition-colors text-gray-700 hover:bg-gray-100 dark:text-gray-700 dark:hover:bg-gray-700"
                        >
                          <div className="relative w-10 h-6">
                            <Image
                              src={video.thumbnail}
                              alt={video.title}
                              fill
                              priority
                              className="object-cover rounded"
                              sizes="40px"
                            />
                          </div>

                          {/* <Image
                            src={video.thumbnail}
                            alt={video.title}
                            width={40}
                            height={24}
                            className="rounded-full object-cover"
                          /> */}
                          {/* <span className="line-clamp-1 text-[12px]">
                            {video.title}
                          </span> */}
                          <span className="truncate text-[12px] min-w-0 max-w-[140px]">
                            {video.title}
                          </span>
                        </Button>
                      ))}

                      {/* ✅ See All link */}
                      <div className="flex justify-end">
                        <Link
                          href="/dashboard/bestofstream"
                          className="block text-center text-xs text-purple-600 dark:text-purple-400 mt-2 hover:underline"
                        >
                          See All →
                        </Link>
                      </div>
                    </nav>
                  )}
                </>
              )}
            </div>
          </SidebarGroupContent>
          {/* <div className="flex flex-row justify-end gap-2 pt-4 mt-3">
            <Link href="/">
              <Button
                variant="outline"
                className="w-20 justify-start gap-2 text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back
              </Button>
            </Link>

            <Button
              onClick={() => requestLogout()}
              variant="outline"
              className="w-25 justify-start gap-2 text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
            >
              <TbLogout className="w-4 h-4" />
              Logout
            </Button>
          </div> */}
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
