import React from 'react';
import Navbar from '../components/LandingPage/Navbar';
import Hero from '../components/LandingPage/Hero';
import StatsBar from '../components/LandingPage/StatsBar';
import Features from '../components/LandingPage/Features';
import HowItWorks from '../components/LandingPage/HowItWorks';
import Testimonials from '../components/LandingPage/Testimonials';
import FAQ from '../components/LandingPage/FAQ';
import CTA from '../components/LandingPage/CTA';
import Footer from '../components/LandingPage/Footer';
import Pricing from '../components/LandingPage/Pricing';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-dark text-white">
      <Navbar />
      <main>
        <Hero />
        <StatsBar />
        <Features />
        <HowItWorks />
        <Testimonials />
        <Pricing />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;