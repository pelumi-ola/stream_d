"use client";

import React, { useState } from "react";
import { Sun, Moon } from "lucide-react";
// import { Search, Settings, Bell, Sun, Moon } from "lucide-react";
// import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { TbLogout, ArrowLeft } from "@/assets";

export function DashboardHeader() {
  const { theme, setTheme } = useTheme();
  const { user, requestLogout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="flex flex-row px-4 py-2 justify-between items-center border-b border-gray-200 dark:border-gray-700">
      <div className="text-lg font-medium text-gray-700 dark:text-gray-200">
        {user?.msisdn
          ? `Welcome back, +${user.msisdn.replace(
              /(\d{3})(\d+)(\d{2})$/,
              "$1****$3"
            )}`
          : "Welcome to Stream D"}
      </div>

      <div className="flex flex-row gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="mt-3"
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
          {user && (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="rounded-full bg-white text-primary p-2"
              >
                <User className="w-5 h-5" />
              </button>
              {dropdownOpen && (
                <div className="flex flex-col gap-3 px-3 absolute right-0 mt-2 w-40 bg-white border border-hover-button dark:bg-gray-700 rounded-xl shadow-lg py-3 z-50">
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
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
