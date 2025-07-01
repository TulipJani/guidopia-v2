import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SubscriptionStatus from '../components/SubscriptionStatus';

// Shiny badge animation for "Free"

export default function Dashboard() {
  const [activeApp, setActiveApp] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleAppClick = (appName) => {
    setActiveApp(appName);
    console.log(`Active app set to: ${appName}. Navigation handled by Link component.`);
  };

  const panelClasses = "bg-gray-900/20 backdrop-blur-sm border border-gray-800/30 p-4 sm:p-6 lg:p-8 shadow-lg rounded-lg sm:rounded-2xl relative overflow-hidden";
  const careerApps = [
    {
      name: "Career Assessment",
      description: "Take a fun, insightful quiz to discover your unique strengths and get matched with careers that fit your personality and interests.",
      route: "/career-selection",
      icon: (
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-blue-600/10 text-blue-500">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6l4 2" />
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
          </svg>
        </span>
      )
    },
    {
      name: "Sanskriti",
      description: "Explore India's rich heritage, festivals, and traditions. Learn about your roots and celebrate culture in a fun, interactive way.",
      route: "/sanskriti",
      icon: (
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-yellow-500/10 text-yellow-500">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.364-6.364l-1.414 1.414M6.05 17.95l-1.414 1.414M17.95 17.95l-1.414-1.414M6.05 6.05L4.636 7.464" />
            <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2" />
          </svg>
        </span>
      )
    },
    {
      name: "Exam AI",
      description: "Get personalized tips, practice questions, and a study plan to help you prepare for your next big exam with confidence.",
      route: "/exam-ai",
      icon: (
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-pink-500/10 text-pink-500">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h8M8 14h4" />
          </svg>
        </span>
      )
    },
    {
      name: "College Search",
      description: "Find colleges that match your dreams. Filter by location, courses, and more to discover your perfect campus.",
      route: "/college-search-welcome",
      icon: (
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-green-500/10 text-green-500">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7l9-4 9 4-9 4-9-4zm0 0v6a9 9 0 009 9 9 9 0 009-9V7" />
          </svg>
        </span>
      )
    },
    {
      name: "Upskilling",
      description: "Learn new skills with bite-sized courses and challenges. Build your confidence and get ready for the future of work.",
      route: "/upskilling-welcome",
      icon: (
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-purple-500/10 text-purple-500">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v8m0 0l-3-3m3 3l3-3" />
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
          </svg>
        </span>
      )
    },
    {
      name: "Mentor Connect",
      description: "Chat with real professionals and mentors. Get advice, ask questions, and learn from people who’ve been there.",
      route: "/mentors",
      icon: (
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-orange-500/10 text-orange-500">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 20v-2a4 4 0 014-4h4a4 4 0 014 4v2" />
          </svg>
        </span>
      )
    },
    {
      name: "Future Me Card",
      description: "Create a digital card that captures your dreams, goals, and the person you want to become. See your future self come alive!",
      route: "/future-me",
      icon: (
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-cyan-500/10 text-cyan-500">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <rect x="5" y="5" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9h6v6H9z" />
          </svg>
        </span>
      )
    }
  ];

  // For badge logic
  const isFreeApp = (name) => name === "College Search" || name === "Exam AI";

  // Color ring logic for active app
  const getRingClass = (name) => {
    switch (name) {
      case "Career Assessment":
        return "ring-2 ring-blue-500/40";
      case "Sanskriti":
        return "ring-2 ring-yellow-400/40";
      case "Exam AI":
        return "ring-2 ring-pink-400/40";
      case "College Search":
        return "ring-2 ring-green-400/40";
      case "Upskilling":
        return "ring-2 ring-purple-400/40";
      case "Mentor Connect":
        return "ring-2 ring-orange-400/40";
      case "Future Me Card":
        return "ring-2 ring-cyan-400/40";
      default:
        return "";
    }
  };

  // Card hover border color
  const getHoverBorder = (name) => {
    switch (name) {
      case "Career Assessment":
        return "hover:border-blue-400/60";
      case "Sanskriti":
        return "hover:border-yellow-400/60";
      case "Exam AI":
        return "hover:border-pink-400/60";
      case "College Search":
        return "hover:border-green-400/60";
      case "Upskilling":
        return "hover:border-purple-400/60";
      case "Mentor Connect":
        return "hover:border-orange-400/60";
      case "Future Me Card":
        return "hover:border-cyan-400/60";
      default:
        return "";
    }
  };

  // Card icon hover bg
  const getIconHoverBg = (name) => {
    switch (name) {
      case "Career Assessment":
        return "group-hover:bg-blue-500/20";
      case "Sanskriti":
        return "group-hover:bg-yellow-400/20";
      case "Exam AI":
        return "group-hover:bg-pink-400/20";
      case "College Search":
        return "group-hover:bg-green-400/20";
      case "Upskilling":
        return "group-hover:bg-purple-400/20";
      case "Mentor Connect":
        return "group-hover:bg-orange-400/20";
      case "Future Me Card":
        return "group-hover:bg-cyan-400/20";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-black text-white px-4 sm:px-6 lg:px-8 py-20">
      {/* Welcome Panel */}
      <div className={`${panelClasses} relative`}>
        <div className="relative z-10 py-4 sm:py-6 lg:py-8">
          <div className="flex justify-between items-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-semibold mb-2 sm:mb-3 text-white">
              Career Dashboard
            </h1>
            <Link
              to="/profile"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200 flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Profile
            </Link>
          </div>

          <p className="text-sm sm:text-base text-gray-400">Everything you need to explore, plan, and grow your career journey.</p>
        </div>

        {/* Career Apps Grid */}
        <div>
          <h2 className="text-base sm:text-lg font-medium text-white mb-4 sm:mb-6">Career Apps</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {careerApps.map((app, idx) => (
              <Link
                key={app.name}
                to={app.route}
                onClick={() => handleAppClick(app.name)}
                className={`
                  group relative p-4 sm:p-6 bg-gray-800/20 border border-gray-700/30 rounded-lg sm:rounded-xl
                  block transition-all duration-200 text-left
                  ${getRingClass(activeApp === app.name ? app.name : "")}
                  ${getHoverBorder(app.name)}
                  hover:-translate-y-0.5 hover:bg-gray-800/30
                `}
                style={{ minHeight: "170px" }}
              >
                <div className={`mb-3 `}>
                  {app.icon}
                </div>
                <h3 className="font-semibold text-white mb-1.5 sm:mb-2 text-base flex items-center">
                  {app.name}
                </h3>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">{app.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Support Panel */}
      <div className={`${panelClasses} relative mt-6 sm:mt-8`}>
        <div className="relative z-10">

          <div className="flex flex-col lg:flex-row items-center justify-between gap-4 sm:gap-6">
            <div className="text-center lg:text-left flex-1">
              <div className="flex items-center justify-center lg:justify-start mb-3 sm:mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-lg sm:rounded-xl flex items-center justify-center mr-3 sm:mr-4">
                  <span className="text-xl sm:text-2xl">🚀</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white">
                  Need Career Guidance?
                </h3>
              </div>
              <p className="text-gray-400 text-base sm:text-lg leading-relaxed max-w-lg">
                Connect with our expert support team for personalized assistance and career insights tailored to your goals.
              </p>
              <div className="flex items-center justify-center lg:justify-start mt-3 sm:mt-4 space-x-4 sm:space-x-6 text-xs sm:text-sm text-gray-500">
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-1.5 sm:mr-2"></span>
                  24/7 Available
                </span>
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-1.5 sm:mr-2"></span>
                  Expert Mentors
                </span>
              </div>
            </div>
            <div className="flex-shrink-0 mt-4 lg:mt-0">
              <Link
                to="/mentors"
                className="py-3 px-6 sm:py-4 sm:px-8 bg-gradient-to-r from-cyan-500 to-cyan-400 text-black font-semibold rounded-lg sm:rounded-xl hover:from-cyan-400 hover:to-cyan-300 transition-all duration-200 inline-flex items-center text-sm sm:text-base"
                onClick={() => handleAppClick("Mentor Connect")}
              >
                Contact Support
                <svg className="w-4 h-4 sm:w-5 sm:h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <SubscriptionStatus />
    </div>
  );
}