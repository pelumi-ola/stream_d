"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Filter, ChevronDown, ChevronRight } from "@/assets";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fetchFromApi } from "@/lib/api";

function FilterHomepage({ onFilterChange }) {
  const [activeTab, setActiveTab] = useState("home");
  const [showFilter, setShowFilter] = useState(false);
  const [openSections, setOpenSections] = useState({});
  const [mainSuggestions, setMainSuggestions] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const mainSearchRef = useRef(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState({
    league: null, // { id, name }
    team: null, // { id, name }
    category: null,
  });

  const [suggestions, setSuggestions] = useState({ league: [], team: [] });
  const [filterInputs, setFilterInputs] = useState({ league: "", team: "" });

  const toggleSection = (section) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // 🔹 Handle typing for league/team filters
  const handleInputChange = async (type, value) => {
    setFilterInputs((prev) => ({ ...prev, [type]: value }));
    if (!value.trim()) {
      setSuggestions((prev) => ({ ...prev, [type]: [] }));
      return;
    }

    try {
      const res = await fetchFromApi({
        endpoint: "/filter-options",
        params: { type, query: value },
      });

      if (res?.options) {
        setSuggestions((prev) => ({ ...prev, [type]: res.options }));
      }
    } catch (err) {
      console.error("Failed to fetch suggestions:", err);
    }
  };

  // 🔹 Select from suggestion
  const handleSelectSuggestion = (type, option) => {
    setSelectedFilters((prev) => ({ ...prev, [type]: option }));
    setFilterInputs((prev) => ({ ...prev, [type]: "" }));
    setSuggestions((prev) => ({ ...prev, [type]: [] }));
  };

  // 🔹 Validate custom entry
  const handleCustomOption = async (type, value) => {
    if (!value.trim()) return;

    try {
      const res = await fetchFromApi({
        endpoint: "/filter-options",
        params: { type, query: value },
      });

      if (res?.options?.length) {
        const match = res.options.find(
          (opt) => opt.name.toLowerCase() === value.toLowerCase()
        );
        if (match) {
          handleSelectSuggestion(type, match);
          return;
        }
      }
      toast.error("Not found. Kindly select from suggestions.");
    } catch (err) {
      console.error("Validation error:", err);
    }
  };

  // 🔹 Highlight typed part in suggestion
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

  // 🔹 Execute search
  const executeSearch = async (e) => {
    if (e) e.preventDefault();

    const payload = {
      ...(searchQuery.trim() && { q: searchQuery.trim() }),
      ...(selectedFilters.league && { league: selectedFilters.league.id }),
      ...(selectedFilters.team && { team: selectedFilters.team.id }),
      ...(selectedFilters.category && { category: selectedFilters.category }),
    };

    await onFilterChange(Object.keys(payload).length > 0 ? payload : null);
    setShowFilter(false);
  };

  // 🔹 Main search input suggestions
  const handleMainSearchChange = async (value) => {
    setSearchQuery(value);
    if (!value.trim()) {
      setMainSuggestions([]);
      return;
    }

    try {
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

      const opts = [...(leagueRes?.options || []), ...(teamRes?.options || [])];

      setMainSuggestions(opts.length > 0 ? opts : []);
      setHighlightedIndex(-1);
    } catch {
      setMainSuggestions([]);
    }
  };

  const handleMainKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      executeSearch();
    }
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
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        mainSearchRef.current &&
        !mainSearchRef.current.contains(event.target)
      ) {
        setMainSuggestions([]); // close dropdown
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <motion.section
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative z-50 bg-white/10 dark:bg-gray-900/50 drop-shadow-lg border-y border-white/20 dark:border-gray-700/30"
    >
      <div className="flex md:flex-row flex-col space-y-5 items-center justify-between lg:max-w-7xl lg:mx-auto px-6 lg:px-8 py-7">
        {/* Date Tabs */}
        <div className="flex items-center space-x-2 toggle-items toggle-filter">
          {["Yesterday", "Today", "Tomorrow", "View All"].map((tab) => (
            <Button
              key={tab}
              variant={activeTab === tab.toLowerCase() ? "default" : "ghost"}
              className={`${
                activeTab === tab.toLowerCase()
                  ? "bg-purple-600 rounded-full text-white"
                  : "bg-ring text-primary rounded-full"
              }`}
              onClick={() => {
                setActiveTab(tab.toLowerCase());
                onFilterChange(tab === "View All" ? null : tab.toLowerCase());
              }}
            >
              {tab}
            </Button>
          ))}
        </div>

        {/* Search & Filter */}
        <div className="flex items-center mb-3">
          {/* 🔹 Main Search Input */}
          <div ref={mainSearchRef} className="relative search-input">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => handleMainSearchChange(e.target.value)}
              onKeyDown={handleMainKeyDown}
              placeholder="Search by team, league, or country"
              className="pl-10 bg-ring rounded-full border-primary"
            />
            {mainSuggestions.length > 0 && (
              <div className="absolute left-0 mt-1 bg-white dark:bg-gray-800 border rounded-md shadow-md max-h-40 overflow-y-auto w-full z-50">
                {mainSuggestions.map((opt, idx) => (
                  <div
                    key={opt.id}
                    className={`p-2 text-sm cursor-pointer ${
                      idx === highlightedIndex
                        ? "bg-purple-100"
                        : "hover:bg-gray-200"
                    }`}
                    onClick={() => {
                      setSearchQuery(opt.name);
                      setMainSuggestions([]);
                      onFilterChange({ q: opt.id }); // send ID directly
                    }}
                  >
                    {renderHighlighted(opt.name, searchQuery)}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 🔹 Filter Drawer */}
          <div className="relative">
            <Button variant="ghost" onClick={() => setShowFilter(!showFilter)}>
              <Filter className="w-10 h-10" /> Filter
            </Button>

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

                {/* League Filter */}
                <div className="mb-3 border-b">
                  <button
                    className="flex justify-between items-center w-full py-2 font-semibold"
                    onClick={() => toggleSection("league")}
                  >
                    League
                    {openSections.league ? (
                      <ChevronDown size={18} />
                    ) : (
                      <ChevronRight size={18} />
                    )}
                  </button>
                  {openSections.league && (
                    <div className="pl-4 pb-2 space-y-2">
                      <div className="relative mt-2">
                        <div className="flex items-center space-x-2">
                          <Input
                            placeholder="Add League"
                            className="text-sm"
                            value={filterInputs.league}
                            onChange={(e) =>
                              handleInputChange("league", e.target.value)
                            }
                            onKeyDown={(e) =>
                              e.key === "Enter" &&
                              handleCustomOption("league", filterInputs.league)
                            }
                          />
                          <Button
                            className="bg-purple-600 text-white px-2 py-1"
                            onClick={() =>
                              handleCustomOption("league", filterInputs.league)
                            }
                          >
                            <Search className="w-4 h-4" />
                          </Button>
                        </div>

                        {/* Suggestions dropdown */}
                        {filterInputs.league.trim() &&
                          suggestions.league?.length > 0 && (
                            <div className="absolute bg-white dark:bg-gray-800 border rounded-md mt-1 shadow-md max-h-40 overflow-y-auto w-full z-50">
                              {suggestions.league.map((opt) => (
                                <div
                                  key={opt.id}
                                  className="p-2 cursor-pointer text-sm hover:bg-gray-200"
                                  onClick={() =>
                                    handleSelectSuggestion("league", opt)
                                  }
                                >
                                  {renderHighlighted(
                                    opt.name,
                                    filterInputs.league
                                  )}
                                </div>
                              ))}
                            </div>
                          )}

                        {/* Selected League like category */}
                        {selectedFilters.league && (
                          <label className="flex items-center space-x-2 text-sm cursor-pointer mt-3">
                            <input
                              type="checkbox"
                              className="accent-purple-600 w-4 h-4"
                              checked={!!selectedFilters.league}
                              onChange={() =>
                                setSelectedFilters((prev) => ({
                                  ...prev,
                                  league: prev.league
                                    ? null
                                    : selectedFilters.league,
                                }))
                              }
                            />
                            <span>{selectedFilters.league.name}</span>
                          </label>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Team Filter */}
                <div className="mb-3 border-b">
                  <button
                    className="flex justify-between items-center w-full py-2 font-semibold"
                    onClick={() => toggleSection("team")}
                  >
                    Team
                    {openSections.team ? (
                      <ChevronDown size={18} />
                    ) : (
                      <ChevronRight size={18} />
                    )}
                  </button>
                  {openSections.team && (
                    <div className="pl-4 pb-2 space-y-2">
                      <div className="relative mt-2">
                        <div className="flex items-center space-x-2">
                          <Input
                            placeholder="Add Team"
                            className="text-sm"
                            value={filterInputs.team}
                            onChange={(e) =>
                              handleInputChange("team", e.target.value)
                            }
                            onKeyDown={(e) =>
                              e.key === "Enter" &&
                              handleCustomOption("team", filterInputs.team)
                            }
                          />
                          <Button
                            className="bg-purple-600 text-white px-2 py-1"
                            onClick={() =>
                              handleCustomOption("team", filterInputs.team)
                            }
                          >
                            <Search className="w-4 h-4" />
                          </Button>
                        </div>

                        {/* Suggestions dropdown */}
                        {filterInputs.team.trim() &&
                          suggestions.team?.length > 0 && (
                            <div className="absolute bg-white dark:bg-gray-800 border rounded-md mt-1 shadow-md max-h-40 overflow-y-auto w-full z-50">
                              {suggestions.team.map((opt) => (
                                <div
                                  key={opt.id}
                                  className="p-2 cursor-pointer text-sm hover:bg-gray-200"
                                  onClick={() =>
                                    handleSelectSuggestion("team", opt)
                                  }
                                >
                                  {renderHighlighted(
                                    opt.name,
                                    filterInputs.team
                                  )}
                                </div>
                              ))}
                            </div>
                          )}

                        {/* Selected Team like category */}
                        {selectedFilters.team && (
                          <label className="flex items-center space-x-2 text-sm cursor-pointer mt-3">
                            <input
                              type="checkbox"
                              className="accent-purple-600 w-4 h-4"
                              checked={!!selectedFilters.team}
                              onChange={() =>
                                setSelectedFilters((prev) => ({
                                  ...prev,
                                  team: prev.team ? null : selectedFilters.team,
                                }))
                              }
                            />
                            <span>{selectedFilters.team.name}</span>
                          </label>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Category Filter */}
                <div className="mb-3 border-b">
                  <button
                    className="flex justify-between items-center w-full py-2 font-semibold"
                    onClick={() => toggleSection("category")}
                  >
                    Category
                    {openSections.category ? (
                      <ChevronDown size={18} />
                    ) : (
                      <ChevronRight size={18} />
                    )}
                  </button>
                  {openSections.category && (
                    <div className="pl-4 pb-2 space-y-2">
                      {["Highlights", "Live Stream", "All Goals"].map((cat) => (
                        <label
                          key={cat}
                          className="flex items-center space-x-2 text-sm cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            className="accent-purple-600 w-4 h-4"
                            checked={selectedFilters.category === cat}
                            onChange={() =>
                              setSelectedFilters((prev) => ({
                                ...prev,
                                category: prev.category === cat ? null : cat,
                              }))
                            }
                          />
                          <span>{cat}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

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
