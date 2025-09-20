import React, { useState, useEffect } from "react";
import { Menu, Moon, Sun, LogoSvg, X, Power, UserRound } from "@/assets";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { User } from "lucide-react";

function Header({ activeTab, setActiveTab }) {
  const { theme, setTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { user, requestLogout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navItems = ["Home", "Highlights", "Live Stream", "All Goals"];

  // Variants for motion
  const navVariants = {
    hidden: { opacity: 0, y: -20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
        ease: "easeOut",
      },
    },
  };

  const linkVariants = {
    hidden: { opacity: 0, y: -15 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-primary dark:bg-primary/65 backdrop-blur-sm border-b border-chart dark:border-input">
      <div className="flex items-center justify-between px-6 py-2 h-16">
        {/* Logo */}
        <div className="relative w-20 h-20">
          <Image
            src={LogoSvg}
            alt="Logo"
            fill
            sizes="80px"
            priority
            className="object-contain"
          />
        </div>

        {/* <div className="flex items-center">
          <Image src={LogoSvg} alt="Logo" width={80} height={80} />
        </div> */}

        {/* Desktop Navigation */}
        <div className="flex flex-row items-center justify-between space-x-3">
          <motion.nav
            variants={navVariants}
            initial="hidden"
            animate="show"
            className="hidden md:flex items-center space-x-8"
          >
            {navItems.map((item) => (
              <motion.div key={item} variants={linkVariants}>
                <nav
                  onClick={() => {
                    setActiveTab(item);

                    // Scroll to matchcards section
                    const section = document.getElementById("matchcards");
                    if (section) {
                      section.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      });
                    }
                  }}
                  className={`relative transition-colors ${
                    activeTab === item
                      ? "text-[#FFCB03] cursor-pointer after:absolute after:left-0 after:bottom-[-4px] after:h-[2px] after:w-full after:bg-white after:rounded-full"
                      : "text-white hover:text-purple-200 transition-colors cursor-pointer"
                  }`}
                >
                  {item}
                </nav>
              </motion.div>
            ))}
          </motion.nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {mounted && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="text-white hover:bg-white/10"
              >
                {theme === "dark" ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
              </Button>
            )}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="rounded-full bg-white text-primary p-2"
                >
                  <User className="w-5 h-5" />
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg py-2 z-50">
                    <Link
                      href="/dashboard"
                      className="flex gap-3 px-4 py-2 hover:bg-gray-100 text-black"
                    >
                      <UserRound className="w-6 h-6" />
                      Profile
                    </Link>
                    <button
                      onClick={() => requestLogout()}
                      className="flex gap-3 w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                    >
                      <Power className="w-6 h-6 text-red-600" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login">
                <Button className="bg-white hover:bg-hover-button text-primary font-semibold">
                  Login
                </Button>
              </Link>
            )}
            <Button
              variant="ghost"
              className="md:hidden text-white"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? (
                <X className="text-2xl font-bold" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed top-16 right-0 h-screen w-64 md:hidden bg-primary border-l border-chart dark:border-input px-6 py-5 space-y-6 shadow-lg z-50"
          >
            <nav className="flex flex-col space-y-6">
              {navItems.map((item) => (
                <motion.div key={item} variants={linkVariants}>
                  <nav
                    onClick={() => {
                      setActiveTab(item);

                      // Scroll to matchcards section
                      const section = document.getElementById("matchcards");
                      if (section) {
                        section.scrollIntoView({
                          behavior: "smooth",
                          block: "start",
                        });
                      }
                    }}
                    className={`relative transition-colors ${
                      activeTab === item
                        ? "text-[#FFCB03] cursor-pointer after:absolute after:left-0 after:bottom-[-4px] after:h-[2px] after:w-full after:bg-white after:rounded-full"
                        : "text-white cursor-pointer hover:text-purple-200 transition-colors"
                    }`}
                  >
                    {item}
                  </nav>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Header;
