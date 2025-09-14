import {
  LayoutDashboard,
  MdOutlineAirplay,
  FaStar,
  FiPlayCircle,
} from "@/assets";

export const sidebarItems = [
  { icon: LayoutDashboard, title: "Dashboard", url: "/dashboard" },
  {
    icon: MdOutlineAirplay,
    title: "Loved Matches",
    url: "/dashboard/LovedMatches",
  },
  { icon: FaStar, title: "Favourite Match", url: "/dashboard/favourites" },
  { icon: FiPlayCircle, title: "Watch Later", url: "/dashboard/watch-later" },
];
