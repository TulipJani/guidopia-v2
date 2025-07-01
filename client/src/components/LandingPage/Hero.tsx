import React from 'react';

const Hero = () => {
  const handleGetStarted = () => {
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen  bg-black relative overflow-hidden flex items-center justify-center">
      {/* Background */}
      <div className="fixed inset-0 z-0">


        {/* Gradient overlays */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-white/[0.08] via-gray-500/[0.04] to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-white/[0.06] via-gray-400/[0.03] to-transparent rounded-full blur-3xl" />
      </div>

      {/* Hero Content */}
      <div className="max-w-6xl mt-10 lg:mt-20 mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        {/* Badge */}
        <div className="inline-flex items-center justify-center py-3 px-6 mb-12 text-sm bg-white/[0.08] text-gray-300 border border-white/[0.15] rounded-full backdrop-blur-sm">
          <span className="font-medium">Where Confusion Meets Clarity</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-8xl font-black tracking-tight leading-[0.85] mb-8">
          <span className="block bg-gradient-to-b from-white via-gray-100 to-gray-400 bg-clip-text text-transparent">
            From Lost to
          </span>
          <span className="block bg-gradient-to-b from-white to-gray-300 bg-clip-text text-transparent">
            Limitless
          </span>
        </h1>

        {/* Description */}
        <div className="max-w-4xl mx-auto space-y-6 mb-5">
          <p className="text-xl md:text-xl text-gray-300 leading-relaxed font-light">
            <span className="text-white font-semibold">Stop wandering</span> through endless career options.{' '}
            <span className="text-gray-100 font-medium">Guidopia transforms your confusion into confidence</span> with AI-powered insights.
          </p>

          <p className="text-lg md:text-lg text-gray-400 leading-relaxed font-light">
            We reveal your <span className="text-gray-200 font-semibold">true potential</span> because your dream career isn't just waiting to be found—{' '}
            <span className="text-white font-semibold italic">it's waiting to be built.</span>
          </p>
        </div>

        {/* CTA Button */}
        <button
          onClick={handleGetStarted}
          className="group relative px-12 py-4 bg-white text-black text-lg font-bold rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-white/20 border border-white/20"
        >
          <span className="relative z-10">Start Your Journey</span>
          <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-white opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300" />
        </button>

        {/* Secondary CTA */}
        <p className="mt-6 text-gray-500 text-sm">
          Discover your path in under 5 minutes • No credit card required
        </p>
      </div>

      {/* Subtle decorative elements */}
      <div className="absolute bottom-20 right-20 w-4 h-4 bg-white/[0.15] rounded-full blur-sm" />
      <div className="absolute top-32 left-20 w-2 h-2 bg-white/[0.12] rounded-full blur-sm" />
      <div className="absolute top-1/2 right-32 w-3 h-3 bg-white/[0.10] rounded-full blur-sm" />
    </div>
  );
};

export default Hero;