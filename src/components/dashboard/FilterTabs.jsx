"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, ChevronDown, ChevronRight } from "@/assets";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";

function FilterTabs({ onFilterChange }) {
  const [activeTab, setActiveTab] = useState("home");
  const [showFilter, setShowFilter] = useState(false);
  const [openSections, setOpenSections] = useState({});
  const [date, setDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const filters = [
    {
      title: "League",
      options: [
        "Premier League",
        "UEFA Champions League",
        "La Liga",
        "Serie A",
        "Bundesliga",
      ],
      search: true,
    },
    {
      title: "Team",
      options: [
        "Manchester United Vs Chelsea",
        "Real Madrid Vs Serie A",
        "Placeholder Vs Placeholder",
      ],
      search: true,
    },
    {
      title: "Match Status",
      options: ["Today", "Yesterday", "Past Match"],
    },
    {
      title: "Category",
      options: ["Highlights", "Live Stream", "All Goals"],
    },
    {
      title: "Date",
      options: [],
    },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative z-50 bg-white/10 dark:bg-gray-900/50 drop-shadow-lg border-y border-white/20 dark:border-gray-700/30"
    >
      <div className="flex md:flex-row flex-col space-y-5 items-center md:gap-10 justify-between lg:max-w-7xl lg:mx-auto px-6 lg:px-8 py-7">
        <div className="flex items-center space-x-2 toggle-items">
          {["Yesterday", "Today", "View All"].map((tab) => (
            <Button
              key={tab}
              variant={activeTab === tab.toLowerCase() ? "default" : "ghost"}
              className={`${
                activeTab === tab.toLowerCase()
                  ? "bg-purple-600 lg:w-30 rounded-full text-white cursor-pointer"
                  : "bg-ring text-primary lg:w-30 w-20 hover:bg-hover-button hover:text-primary cursor-pointer dark:hover:bg-gray-800/50 rounded-full"
              }`}
              onClick={() => {
                if (tab === "View All") {
                  // reset to category only (no date filter)
                  setActiveTab("view all");
                  onFilterChange(null);
                } else {
                  setActiveTab(tab.toLowerCase());
                  onFilterChange(tab.toLowerCase());
                }
              }}
            >
              {tab}
            </Button>
          ))}
        </div>

                 <div className="relative mb-3">
            <Button
              variant="ghost"
              className="text-black cursor-pointer hover:bg-white/10 dark:hover:bg-[#1E2939] dark:text-hover"
              onClick={() => setShowFilter(!showFilter)}
            >
              <Filter className="text-sidebar-ring dark:text-hover w-10 h-10" />
              Filter
            </Button>

            {/* Filter Card */}
            {showFilter && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute right-0 mt-2 bg-white dark:bg-gray-800 border rounded-lg shadow-md p-4 md:w-[300px] z-50"
              >
                <h3 className="font-bold text-lg border-b pb-2 mb-2">
                  Filter By:
                </h3>
                {filters.map((section) => (
                  <div
                    key={section.title}
                    className="mb-3 border-b last:border-none"
                  >
                    <button
                      className="flex justify-between items-center w-full py-2 font-semibold"
                      onClick={() => toggleSection(section.title)}
                    >
                      {section.title}
                      {openSections[section.title] ? (
                        <ChevronDown size={18} />
                      ) : (
                        <ChevronRight size={18} />
                      )}
                    </button>

                    {/* Section Options */}
                    {openSections[section.title] && (
                      <div className="pl-4 pb-2 space-y-2">
                        {section.title === "Date" ? (
                          <>
                            {!showCalendar && (
                              <Input
                                readOnly
                                value={
                                  date
                                    ? date.toLocaleDateString()
                                    : "Pick a date"
                                }
                                onClick={() => setShowCalendar(true)}
                                className="cursor-pointer"
                              />
                            )}

                            {showCalendar && (
                              <Calendar
                                mode="single"
                                selected={date}
                                onSelect={(d) => {
                                  setDate(d);
                                  setShowCalendar(false);
                                  onFilterChange({ type: "date", value: d });
                                }}
                                className="rounded-md border"
                              />
                            )}
                          </>
                        ) : (
                          <>
                            {section.options.map((opt) => (
                              <label
                                key={opt}
                                className="flex items-center space-x-2 text-sm cursor-pointer"
                              >
                                <input
                                  type="checkbox"
                                  className="accent-purple-600 w-4 h-4"
                                />
                                <span>{opt}</span>
                              </label>
                            ))}
                            {section.search && (
                              <div className="flex items-center space-x-2 mt-2">
                                <Input
                                  placeholder="input favourite"
                                  className="text-sm"
                                />
                                <Button className="bg-purple-600 text-white px-2 py-1">
                                  <Search className="w-4 h-4" />
                                </Button>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </motion.div>
            )}
          </div>

      </div>
    </motion.section>
  );
}

export default FilterTabs;
