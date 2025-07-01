import { useState, useEffect, useRef } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import CounselingButton from "./CounselingButton";

// Shiny badge animation for "Free"
const ShinyBadge = ({ children }) => (
  <span className="relative inline-block ml-2 align-middle">
    <span className="relative z-10 px-2 py-0.5 text-xs font-bold uppercase rounded bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 text-white shadow-md overflow-hidden">
      <span className="relative z-20">{children}</span>
      <span
        className="absolute left-0 top-0 w-full h-full opacity-40 pointer-events-none"
        style={{
          background:
            "linear-gradient(120deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.7) 50%, rgba(255,255,255,0.2) 100%)",
          animation: "shiny-badge-move 2s linear infinite"
        }}
      />
    </span>
    <style>
      {`
        @keyframes shiny-badge-move {
          0% { background-position: -100px 0; }
          100% { background-position: 200px 0; }
        }
      `}
    </style>
  </span>
);


export default function Layout({ children }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeApp, setActiveApp] = useState(null);
  const mobileMenuRef = useRef(null);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  const handleAppClick = (appName) => {
    setActiveApp(appName);
    // Navigation logic can be handled by NavLink
  };

  const careerApps = [
    {
      name: "Dashboard",
      description: "Overview & stats",
      route: "/dashboard",
      icon: (
        <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    {
      name: "Career Assessment",
      description: "Discover your strengths and ideal career paths",
      route: "/career-selection",
      icon: (
        <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    {
      name: "Sanskriti",
      description: "Cultural learning and heritage exploration",
      route: "/sanskriti",
      icon: (
        <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      )
    },
    {
      name: "Exam AI",
      description: "Discover your strengths and ideal career paths",
      route: "/exam-ai",
      icon: (
        <div className="text-2xl font-bold text-cyan-300">?</div>
      ),
    },
    {
      name: "Upskilling",
      description: "Learn new skills and advance your career",
      route: "/upskilling-welcome",
      icon: (
        <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    },
    {
      name: "College Search",
      description: "Visualize and plan your future career",
      route: "/college-search-welcome",
      icon: (
        <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
    },
    {
      name: "Future Me Card",
      description: "Visualize and plan your future career",
      route: "/future-me",
      icon: (
        <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      )
    }
    // Add any remaining apps here if needed
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // New: Card grid for apps
  function AppCard({ app, active, onClick }) {
    return (
      <Link
        to={app.route}
        onClick={() => onClick(app.name)}
        className={`
          group relative overflow-hidden flex items-center gap-4 px-5 py-3 rounded-lg
          ${active
            ? 'bg-gradient-to-br from-cyan-900/60 to-blue-900/40 border-2 border-cyan-400/40 shadow-xl'
            : 'bg-gray-900/70 border border-gray-800/60 hover:border-cyan-400/30 hover:bg-cyan-900/10'
          }
          transition-all duration-200 cursor-pointer whitespace-nowrap
        `}
        style={{ textDecoration: 'none' }}
      >
        <div className={`
          flex items-center justify-center w-12 h-12 rounded-xl
          ${active
            ? 'bg-gradient-to-br from-cyan-500/20 to-blue-500/20'
            : 'bg-gray-800/60 group-hover:bg-cyan-900/10'
          }
          transition-all
        `}>
          {app.icon}
        </div>
        <div className="flex flex-col flex-1 min-w-0 ml-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-lg text-white truncate">{app.name}</span>

          </div>
        </div>
        {active && (
          <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
        )}
      </Link>
    );
  }

  // Mobile version of AppCard
  function AppCardMobile({ app, active, onClick }) {
    return (
      <Link
        to={app.route}
        onClick={() => {
          onClick(app.name);
          setIsMobileMenuOpen(false);
        }}
        className={`
          group relative flex flex-col items-start gap-2 p-4 rounded-xl 
          ${active
            ? 'bg-gradient-to-br from-cyan-900/40 to-blue-900/30 border border-cyan-400/40 shadow-lg'
            : 'bg-gradient-to-br from-gray-900/60 to-gray-800/60 border border-gray-700/40 hover:border-cyan-400/30 hover:bg-cyan-900/10'
          }
          transition-all duration-300 ease-in-out cursor-pointer min-h-[100px]
        `}
      >
        <div className={`
          flex items-center justify-center w-10 h-10 rounded-lg 
          ${active
            ? 'bg-gradient-to-br from-cyan-500/20 to-blue-500/20 shadow-md'
            : 'bg-gray-800/60 group-hover:bg-cyan-900/20'
          }
          transition-all duration-300
        `}>
          {app.icon}
        </div>
        <div className="flex flex-col flex-1 min-w-0">
          <div className="flex items-center">
            <span className="font-semibold text-sm truncate text-white">{app.name}</span>
            {(app.badge === "Free") && <ShinyBadge>Free</ShinyBadge>}
          </div>
          <span className="text-xs text-gray-400 mt-1">{app.description}</span>
        </div>
        {active && (
          <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-cyan-400"></div>
        )}
      </Link>
    );
  }

  return (
    <div className="min-h-screen  bg-black text-white flex flex-col">
      {/* Header */}
      <header className="bg-black backdrop-blur-xl border-b border-gray-600/50 px-6 md:px-8 py-4 flex items-center justify-between fixed top-0 left-0 right-0 z-30 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-transparent to-purple-500/5"></div>

        <div className="md:hidden relative z-10">
          <button
            onClick={toggleMobileMenu}
            className="p-3 text-gray-300 hover:text-cyan-300 hover:bg-gray-800/50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400/30"
            aria-label="Open menu"
          >
            {isMobileMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
        <Link to="/dashboard" className="flex items-center relative z-10 group">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10  flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-compass text-[#64FFDA] w-8 h-8 transform group-hover:rotate-180 transition-all duration-500"><path d="m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z"></path><circle cx="12" cy="12" r="10"></circle></svg>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-cyan-300 bg-clip-text text-transparent">
              GUIDOPIA
            </h1>
          </div>
        </Link>

        <div className="flex items-center relative z-10">
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm font-semibold bg-gradient-to-r from-red-500/20 to-blue-500/20 text-red-300 border border-red-400/30 backdrop-blur-sm hidden md:block hover:bg-red-500/30 hover:text-red-200 transition-colors"
          >
            LOGOUT
          </button>
        </div>
      </header>

      <div className="flex flex-1 relative">
        {/* Sidebar - Desktop */}
        <aside className="hidden md:block w-80 bg-black backdrop-blur-xl border-r border-gray-600/50 fixed left-0 top-0 h-full z-20 overflow-auto scrollbar-hide">
          <div className="h-fit p-10 bg-black backdrop-blur-xl border-gray-600/50"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/3 via-transparent to-purple-500/3"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-500/10 to-transparent blur-2xl"></div>
          <nav className="p-6 relative z-10">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-300 uppercase tracking-wider mb-4 px-2">
                Career Hub
              </h3>
            </div>
            {/* App grid */}
            <div className="grid grid-cols-1 gap-4">
              {careerApps.map((app, idx) => (
                <AppCard
                  key={app.route}
                  app={app}
                  active={activeApp === app.name || app.route === window.location.pathname}
                  onClick={handleAppClick}
                />
              ))}
            </div>
            {/* Support Section */}
            <div className="pt-8 mt-8 border-t border-gray-600/50">
              <div className="p-4 bg-gradient-to-br from-gray-800/40 to-gray-700/30 border border-gray-600/30 rounded-lg">
                <h4 className="font-semibold text-white mb-2">Need Guidance?</h4>
                <p className="text-xs text-gray-400 mb-3">Book a 1:1 counseling session</p>
                <CounselingButton className="w-full py-2 px-4 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-400/30 hover:bg-gradient-to-r hover:from-cyan-500/30 hover:to-blue-500/30 transition-all duration-300 text-sm font-medium rounded-lg">
                  Book Counseling
                </CounselingButton>
              </div>
            </div>
          </nav>
        </aside>

        {/* Mobile Menu */}
        <motion.div
          ref={mobileMenuRef}
          className={`md:hidden fixed inset-0 bg-black/80 backdrop-blur-sm z-40 transition-all duration-300 ${isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            }`}
        >
          <motion.div
            className="bg-black backdrop-blur-xl w-3/4 max-w-xs h-full shadow-2xl z-50 overflow-y-auto border-r border-gray-600/50 relative"
            initial={{ x: "-100%" }}
            animate={{ x: isMobileMenuOpen ? "0%" : "-100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5"></div>

            <div className="p-4 flex justify-between items-center border-b border-gray-600/50 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-compass text-[#64FFDA] w-6 h-6">
                    <path d="m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z"></path>
                    <circle cx="12" cy="12" r="10"></circle>
                  </svg>
                </div>
                <span className="font-bold text-lg bg-gradient-to-r from-cyan-400 to-cyan-300 bg-clip-text text-transparent">
                  Guidopia
                </span>
              </div>
              <button
                onClick={toggleMobileMenu}
                className="p-2 text-gray-300 hover:text-cyan-300 hover:bg-gray-800/50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400/30"
                aria-label="Close menu"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <nav className="p-6 relative z-10">
              <div className="mb-4">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">
                  Career Hub
                </h3>
              </div>
              {/* App grid for mobile */}
              <div className="grid grid-cols-1 gap-3">
                {careerApps.map((app, idx) => (
                  <AppCardMobile
                    key={app.route}
                    app={app}
                    active={activeApp === app.name || app.route === window.location.pathname}
                    onClick={handleAppClick}
                  />
                ))}
              </div>
            </nav>
          </motion.div>
        </motion.div>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto text-white relative md:ml-80">
          <div className="relative z-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}