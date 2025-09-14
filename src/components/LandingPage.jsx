"use client";
import React, { useState } from "react";
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

  return (
    <div className="min-h-screen dark:from-gray-900 dark:via-gray-800 dark:to-black">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="pt-16">
        <FadeInSection>
          <HeroSection />
        </FadeInSection>
        <FadeInSection>
          <FilterHomepage
            className="absolute"
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />
        </FadeInSection>
        <FadeInSection>
          <Matchcards activeTab={activeTab} filter={activeFilter} />
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
