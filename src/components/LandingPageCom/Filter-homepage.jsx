"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, ChevronDown, ChevronRight } from "@/assets";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { fetchFromApi } from "@/lib/api";

function FilterHomepage({ onFilterChange }) {
  const [activeTab, setActiveTab] = useState("home");
  const [showFilter, setShowFilter] = useState(false);
  const [openSections, setOpenSections] = useState({});
  const [date, setDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [mainSuggestions, setMainSuggestions] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  // 🔹 State for search + filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState({
    league: [],
    team: [],
    match_status: [],
    category: [],
    date: [],
  });

  // 🔹 Autosuggestions
  const [suggestions, setSuggestions] = useState({
    league: [],
    team: [],
  });

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // 🔹 Single-select checkboxes
  const handleCheckboxChange = (section, value) => {
    setSelectedFilters((prev) => {
      const exists = prev[section.toLowerCase()]?.includes(value);
      return {
        ...prev,
        [section.toLowerCase()]: exists ? [] : [value], // single-select only
      };
    });
  };

  // State
  const [filterInputs, setFilterInputs] = useState({
    league: "",
    team: "",
  });

  // Update input value + fetch suggestions
  const handleInputChange = async (type, value) => {
    setFilterInputs((prev) => ({ ...prev, [type.toLowerCase()]: value }));

    if (!value.trim()) {
      setSuggestions((prev) => ({ ...prev, [type.toLowerCase()]: [] }));
      return;
    }

    try {
      const res = await fetchFromApi({
        endpoint: "/filter-options",
        params: { type: type.toLowerCase(), query: value },
      });

      if (res?.options) {
        let opts = res.options.map((opt) => opt.name);

        // Prioritize exact and "starts with" matches first
        const query = value.toLowerCase();
        opts.sort((a, b) => {
          const aLower = a.toLowerCase();
          const bLower = b.toLowerCase();
          if (aLower === query) return -1; // exact match goes top
          if (bLower === query) return 1;
          if (aLower.startsWith(query) && !bLower.startsWith(query)) return -1;
          if (bLower.startsWith(query) && !aLower.startsWith(query)) return 1;
          return aLower.localeCompare(bLower); // fallback alphabetical
        });

        setSuggestions((prev) => ({
          ...prev,
          [type.toLowerCase()]: opts,
        }));
      }
    } catch (err) {
      console.error("Failed to fetch suggestions:", err);
    }
  };

  // Confirm selection (from suggestion OR custom input)
  const handleCustomOption = async (type, value) => {
    if (!value.trim()) return;

    try {
      const res = await fetchFromApi({
        endpoint: "/filter-options",
        params: { type: type.toLowerCase(), value },
      });

      // Always allow custom or valid values
      if (res?.available || !res?.available) {
        setSelectedFilters((prev) => {
          const updated = { ...prev, [type.toLowerCase()]: [value] };

          // 🔹 Auto-check if value is in the hardcoded options
          const section = filters.find(
            (f) => f.title.toLowerCase() === type.toLowerCase()
          );
          if (section && section.options.includes(value)) {
            // keep it in sync with checkbox state
            updated[type.toLowerCase()] = [value];
          }

          return updated;
        });

        // Reset suggestions + input
        setSuggestions((prev) => ({ ...prev, [type.toLowerCase()]: [] }));
        setFilterInputs((prev) => ({ ...prev, [type.toLowerCase()]: "" }));
      }
    } catch (err) {
      console.error("Filter option check failed:", err);
    }
  };

  // Render highlighted suggestion
  const renderHighlighted = (text, query) => {
    const idx = text.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1) return text;

    return (
      <>
        {text.slice(0, idx)}
        <span className="font-semibold text-purple-600">
          {text.slice(idx, idx + query.length)}
        </span>
        {text.slice(idx + query.length)}
      </>
    );
  };

  // 🔹 Execute search (either input or button)
  const executeSearch = async () => {
    const filtersToSend = {
      query: searchQuery || undefined,
      ...selectedFilters,
      date: date ? date.toISOString().split("T")[0] : undefined,
    };

    // Wait for results from parent
    const result = await onFilterChange(filtersToSend);

    if (!result || result.length === 0) {
      // Show "No results found" in both input + filter box
      setSuggestions({
        league: ["No results found"],
        team: ["No results found"],
      });
    }

    // Reset filters & inputs
    setSearchQuery("");
    setSelectedFilters({
      league: [],
      team: [],
      match_status: [],
      category: [],
      date: [],
    });
    setFilterInputs({ league: "", team: "" });
    setDate(new Date());
    setShowFilter(false);
    setMainSuggestions([]);
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
        "Manchester United",
        "Arsenal",
        "Chelsea",
        "Valencia Spain",
        "North Texas",
      ],
      search: true,
    },
    {
      title: "Match Status",
      options: ["Upcoming", "Finished", "Live"],
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

  const handleMainSearchChange = async (value) => {
    setSearchQuery(value);

    if (!value.trim()) {
      setMainSuggestions([]);
      return;
    }

    try {
      // fetch league + team in parallel
      const [leagueRes, teamRes] = await Promise.all([
        fetchFromApi({
          endpoint: "/filter-options",
          params: { type: "league", query: value },
        }),
        fetchFromApi({
          endpoint: "/filter-options",
          params: { type: "team", query: value },
        }),
      ]);

      let opts = [
        ...(leagueRes?.options?.map((opt) => opt.name) || []),
        ...(teamRes?.options?.map((opt) => opt.name) || []),
      ];

      if (opts.length === 0) {
        setMainSuggestions(["No results found"]);
        return;
      }

      // sorting: exact > startsWith > alphabetic
      const query = value.toLowerCase();
      opts.sort((a, b) => {
        const aLower = a.toLowerCase();
        const bLower = b.toLowerCase();
        if (aLower === query) return -1;
        if (bLower === query) return 1;
        if (aLower.startsWith(query) && !bLower.startsWith(query)) return -1;
        if (bLower.startsWith(query) && !aLower.startsWith(query)) return 1;
        return aLower.localeCompare(bLower);
      });

      setMainSuggestions(opts);
      setHighlightedIndex(-1);
    } catch (err) {
      console.error("Main search suggestions failed:", err);
      setMainSuggestions(["No results found"]);
    }
  };

  const handleMainKeyDown = (e) => {
    if (mainSuggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < mainSuggestions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev > 0 ? prev - 1 : mainSuggestions.length - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlightedIndex >= 0) {
        const selected = mainSuggestions[highlightedIndex];
        if (selected !== "No results found") {
          setSearchQuery(selected);
          setMainSuggestions([]);
          setHighlightedIndex(-1);
          executeSearch();
        }
      } else {
        executeSearch();
      }
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative z-50 bg-white/10 dark:bg-gray-900/50 drop-shadow-lg border-y border-white/20 dark:border-gray-700/30"
    >
      <div className="flex md:flex-row flex-col space-y-5 items-center justify-between lg:max-w-7xl lg:mx-auto px-6 lg:px-8 py-7">
        <div className="flex items-center space-x-2 toggle-items toggle-filter">
          {["Yesterday", "Today", "Tomorrow", "View All"].map((tab) => (
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

        <div className="flex items-center mb-3">
          <div className="relative search-input">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              value={searchQuery}
              onChange={(e) => handleMainSearchChange(e.target.value)}
              onKeyDown={(e) => handleMainKeyDown(e)}
              placeholder="Search by team, league, or country"
              className="pl-10 bg-ring rounded-full dark:bg-ring dark:text-black border-primary dark:border-primary focus:border-primary text-black placeholder:text-gray-500"
            />

            {/* Suggestion dropdown for main search */}
            {mainSuggestions.length > 0 && (
              <div className="absolute left-0 mt-1 bg-white dark:bg-gray-800 border rounded-md shadow-md max-h-40 overflow-y-auto z-50 w-full">
                {mainSuggestions.map((sug, index) =>
                  sug === "No results found" ? (
                    <div key={sug} className="p-2 text-gray-500 text-sm italic">
                      {sug}
                    </div>
                  ) : (
                    <div
                      key={sug}
                      className={`p-2 cursor-pointer text-sm ${
                        index === highlightedIndex
                          ? "bg-purple-100 dark:bg-gray-700"
                          : "hover:bg-gray-200 dark:hover:bg-gray-600"
                      }`}
                      onClick={() => {
                        setSearchQuery(sug);
                        setMainSuggestions([]);
                        executeSearch();
                      }}
                    >
                      {renderHighlighted(sug, searchQuery)}
                    </div>
                  )
                )}
              </div>
            )}
          </div>
          <div className="relative">
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
                                    ? date
                                        .toISOString()
                                        .split("T")[0]
                                        .replace(/-/g, "/") // YYYY/MM/DD
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
                                }}
                                className="rounded-md border"
                              />
                            )}
                          </>
                        ) : (
                          <>
                            {/* Combined options: hardcoded + custom */}
                            {[
                              ...(section.options || []),
                              ...(selectedFilters[
                                section.title.toLowerCase()
                              ]?.filter(
                                (val) => !section.options.includes(val)
                              ) || []),
                            ].map((opt) => (
                              <label
                                key={opt}
                                className="flex items-center space-x-2 text-sm cursor-pointer"
                              >
                                <input
                                  type="checkbox"
                                  className="accent-purple-600 w-4 h-4"
                                  checked={
                                    selectedFilters[
                                      section.title.toLowerCase()
                                    ]?.includes(opt) || false
                                  }
                                  onChange={() =>
                                    handleCheckboxChange(section.title, opt)
                                  }
                                />
                                <span>{opt}</span>
                              </label>
                            ))}

                            {/* Searchable Input + Suggestions at the bottom */}
                            <div className="relative mt-2">
                              <div className="flex items-center space-x-2">
                                <Input
                                  placeholder={`Add ${section.title}`}
                                  className="text-sm"
                                  value={
                                    filterInputs[section.title.toLowerCase()] ||
                                    ""
                                  }
                                  onChange={(e) =>
                                    handleInputChange(
                                      section.title,
                                      e.target.value
                                    )
                                  }
                                  onKeyDown={(e) =>
                                    e.key === "Enter" &&
                                    handleCustomOption(
                                      section.title,
                                      filterInputs[section.title.toLowerCase()]
                                    )
                                  }
                                />
                                <Button
                                  className="bg-purple-600 text-white px-2 py-1"
                                  onClick={() =>
                                    handleCustomOption(
                                      section.title,
                                      filterInputs[section.title.toLowerCase()]
                                    )
                                  }
                                >
                                  <Search className="w-4 h-4" />
                                </Button>
                              </div>

                              {/* Suggestion Dropdown */}
                              {filterInputs[
                                section.title.toLowerCase()
                              ]?.trim() &&
                                suggestions[section.title.toLowerCase()]
                                  ?.length > 0 && (
                                  <div className="absolute bg-white dark:bg-gray-800 border rounded-md mt-1 shadow-md max-h-40 overflow-y-auto z-50 w-full">
                                    {suggestions[
                                      section.title.toLowerCase()
                                    ].map((sug) =>
                                      sug === "No results found" ? (
                                        <div
                                          key={sug}
                                          className="p-2 text-gray-500 text-sm italic"
                                        >
                                          {sug}
                                        </div>
                                      ) : (
                                        <div
                                          key={sug}
                                          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer text-sm"
                                          onClick={() =>
                                            handleCustomOption(
                                              section.title,
                                              sug
                                            )
                                          }
                                        >
                                          {renderHighlighted(
                                            sug,
                                            filterInputs[
                                              section.title.toLowerCase()
                                            ] || ""
                                          )}
                                        </div>
                                      )
                                    )}
                                  </div>
                                )}
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                ))}

                <div className="pt-3 mt-3 flex justify-end">
                  <Button
                    className="bg-primary text-white px-4 py-2 rounded-lg"
                    onClick={executeSearch}
                  >
                    <Search className="w-4 h-4 mr-2" /> Search
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.section>
  );
}

export default FilterHomepage;
