import React from "react";
import Header from "../../components/Header";
import Hero from "../../components/Hero";
import Feature from "../../components/Feature";
// import Analytics from "../../components/Analytics"; // Removed generic stats
import Footer from "../../components/Footer";
import ArticlesSection from "../../components/ArticlesSection";
import CategoryGrid from "../../components/CategoryGrid";
import LatestJobsCarousel from "../../components/LatestJobsCarousel";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <CategoryGrid />
      <LatestJobsCarousel />
      <div className="py-8">
        <Feature />
      </div>
      <ArticlesSection />
      <Footer />
    </div>
  );
};

export default LandingPage;

