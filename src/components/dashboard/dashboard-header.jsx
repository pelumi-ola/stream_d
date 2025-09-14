"use client";

import { Search, Settings, Bell, Sun, Moon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { User } from "lucide-react";

export function DashboardHeader() {
  const { theme, setTheme } = useTheme();

  return (
    <header className="flex flex-row p-4 justify-between items-center border-b border-gray-200 dark:border-gray-700">
      <div className="flex relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Type to search..."
          className="md:w-[300px] pl-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
        />
      </div>

      <div className="flex flex-row gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? (
            <Sun className="w-4 h-4" />
          ) : (
            <Moon className="w-4 h-4" />
          )}
        </Button>

        {/* <Button variant="ghost" size="icon">
          <Settings className="w-4 h-4" />
        </Button>

        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-4 h-4" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
        </Button> */}

        <div className="rounded-full bg-hover-button text-primary p-2">
          <User className="w-5 h-5" />
        </div>
      </div>
    </header>
  );
}
