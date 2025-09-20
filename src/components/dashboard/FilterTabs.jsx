"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

function FilterTabs({ onFilterChange }) {
  // Default should be "view all" since that's your neutral state
  const [activeTab, setActiveTab] = useState("view all");

  return (
    <motion.section
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative z-50 bg-white/10 dark:bg-gray-900/50 drop-shadow-lg border-y border-white/20 dark:border-gray-700/30"
    >
      <div className="flex md:flex-row flex-col space-y-5 items-center md:gap-10 justify-between lg:max-w-7xl lg:mx-auto px-6 lg:px-8 py-7">
        <div className="flex items-center space-x-2 toggle-items">
          {["Yesterday", "Today", "View All"].map((tab) => {
            const tabKey = tab.toLowerCase();
            const isActive = activeTab === tabKey;

            return (
              <Button
                key={tab}
                variant={isActive ? "default" : "ghost"}
                className={`${
                  isActive
                    ? "bg-purple-600 lg:w-30 rounded-full text-white cursor-pointer"
                    : "bg-ring text-primary lg:w-30 w-20 hover:bg-hover-button hover:text-primary cursor-pointer dark:hover:bg-gray-800/50 rounded-full"
                }`}
                onClick={() => {
                  if (tab === "View All") {
                    setActiveTab("view all");
                    onFilterChange(null); // resets filter
                  } else {
                    setActiveTab(tabKey);
                    onFilterChange(tabKey);
                  }
                }}
              >
                {tab}
              </Button>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
}

export default FilterTabs;
