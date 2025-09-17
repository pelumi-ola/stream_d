"use client";
import React, { useState, useEffect } from "react";
import HeroSection from "@/components/LandingPageCom/HeroSlider";
import FilterHomepage from "@/components/LandingPageCom/Filter-homepage";
import Matchcards from "@/components/LandingPageCom/Matchcards";
import StreamAndHighlights from "@/components/LandingPageCom/StreamdFeatures";
import About from "@/components/LandingPageCom/About";
import Header from "@/components/LandingPageCom/Header";
import Footer from "@/components/LandingPageCom/Footer";
import FadeInSection from "@/components/ui/FadeInSection";

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState("Home");
  const [activeFilter, setActiveFilter] = useState(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [activeFilter, activeTab]);

  return (
    <div className="min-h-screen dark:from-gray-900 dark:via-gray-800 dark:to-black">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="pt-16">
        <FadeInSection>
          <HeroSection />
        </FadeInSection>
        <FadeInSection>
          <FilterHomepage
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />
        </FadeInSection>
        <FadeInSection>
          <Matchcards
            activeTab={activeTab}
            filter={activeFilter}
            page={page}
            setPage={setPage}
          />
        </FadeInSection>
        <FadeInSection>
          <StreamAndHighlights />
        </FadeInSection>
        <FadeInSection>
          <About />
        </FadeInSection>
      </main>
      <Footer />
    </div>
  );
}
