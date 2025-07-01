import React from 'react';
import GoogleLoginButton from '../components/GoogleLoginButton';
import { Link, useLocation } from 'react-router-dom';

const PRIMARY_COLOR = '#3fe3c1';

export default function Login() {
  const location = useLocation();
  const isOnboarding = location.pathname === '/onboarding';

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-gray-950 via-black to-gray-900">
      {/* Logo only, clickable, using Link */}
      <div className="fixed top-0 left-0 w-full z-50 px-4 sm:px-6 lg:px-8 pt-4">
        <div className="max-w-7xl mx-auto">
          <Link to="/" className="flex items-center space-x-3 group w-fit">
            <div className="flex items-center gap-3 font-bold text-2xl">
              <div className="w-10 h-10 flex items-center justify-center relative hover:rotate-180 transition-transform duration-700">
                <div className="absolute inset-0 bg-gradient-to-r from-white to-gray-300 rounded-full" />
                {/* Compass icon from lucide-react replaced with SVG for SSR safety */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="black"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-black w-6 h-6 relative z-10"
                >
                  <path d="m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z"></path>
                  <circle cx="12" cy="12" r="10"></circle>
                </svg>
              </div>
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Guidopia
              </span>
            </div>
          </Link>
        </div>
      </div>

      {/* Main content below logo */}
      <div className="flex flex-row-reverse min-h-screen w-full pt-20">
        {/* Enhanced Left Panel */}
        <div className="hidden md:flex md:w-[42%] bg-gradient-to-br from-gray-900/90 to-gray-800/50 backdrop-blur-xl text-white flex-col justify-center px-12 lg:px-16 border-r border-gray-700/30 relative overflow-hidden">
          {/* Background decorations */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-cyan-500/10 to-transparent     blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-purple-500/10 to-transparent     blur-3xl"></div>
          
          <div className="relative z-10">
            {/* Logo (hidden on left panel since it's at the top now) */}
            <div className="flex items-center gap-3 font-bold text-xl mb-8 invisible">
              <div className="w-8 h-8 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-compass text-[#64FFDA] w-8 h-8 transform group-hover:rotate-180 transition-all duration-500"><path d="m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z"></path><circle cx="12" cy="12" r="10"></circle></svg>              
              </div>
              <span className="bg-gradient-to-r from-cyan-400 to-cyan-300 bg-clip-text text-transparent">Guidopia</span>
            </div>
            
            <p className="text-gray-400 mb-3 text-sm font-medium tracking-wide uppercase">Welcome to the Future</p>
            <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
                Kickstart Your
              </span>
              <br />
              <span className="bg-gradient-to-r from-cyan-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent">
                Career Journey
              </span>
            </h1>
            <div className="space-y-3 text-gray-300">
              <p className="flex items-center text-base">
                <span className="w-2 h-2     bg-cyan-400 mr-3 animate-pulse"></span>
                Find your perfect career path
              </p>
              <p className="flex items-center text-base">
                <span className="w-2 h-2     bg-cyan-400 mr-3 animate-pulse delay-100"></span>
                Get your first internship
              </p>
              <p className="flex items-center text-base">
                <span className="w-2 h-2     bg-cyan-400 mr-3 animate-pulse delay-200"></span>
                Transform your future
              </p>
            </div>
          </div>
          
          {/* Floating elements */}
          <div className="absolute bottom-8 right-8 w-16 h-16 bg-gradient-to-r from-cyan-500/10 to-purple-500/10     blur-xl animate-pulse"></div>
        </div>

        {/* Enhanced Right Panel */}
        <div className="w-full md:w-[58%] bg-gradient-to-br from-black via-gray-950 to-gray-900 flex items-center justify-center p-8 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-tl from-cyan-500/3 via-transparent to-transparent"></div>
          <div className="absolute top-20 right-20 w-8 h-8 bg-gradient-to-r from-purple-500/20 to-pink-500/20     blur-lg animate-bounce" style={{animationDelay: '1s'}}></div>
          
          <div className="max-w-md w-full relative z-10">
            <div className="text-center mb-12 animate-in fade-in duration-500">
              <h2 className="text-3xl font-bold mb-3">
                <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Welcome Back
                </span>
              </h2>
              <p className="text-gray-400">Sign in to continue your journey towards success.</p>
            </div>

            <div className="space-y-8 animate-in fade-in duration-700 delay-200">
              {/* Enhanced Google Login Button Container */}
              <div className="w-full">
                <div className="p-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20    ">
                  <div className="bg-gradient-to-br from-gray-900/70 to-gray-800/50 backdrop-blur-sm     border border-gray-700/50">
                    <GoogleLoginButton />
                  </div>
                </div>
              </div>

              {/* Enhanced Sign Up Section */}
              <div className="text-center pt-6 border-t border-gray-800/50">
                <p className="text-sm text-gray-400 mb-4">
                  Don't have an account yet?
                </p>
                <Link
                  to="/onboarding"
                  className={`
                    relative inline-flex items-center px-8 py-4 font-semibold transition-all duration-300 ease-out
                    bg-gradient-to-br from-gray-800/60 to-gray-700/40 backdrop-blur-sm
                    border border-gray-600/50 text-white
                    hover:border-cyan-400/60 hover:text-cyan-300 hover:shadow-lg hover:shadow-gray-900/20 hover:scale-105
                    focus:outline-none focus:ring-2 focus:ring-cyan-400/30 focus:border-cyan-400
                        group overflow-hidden
                    ${isOnboarding ? 'border-cyan-400 text-cyan-300 shadow-lg shadow-cyan-500/20' : ''}
                  `}
                >
                  <span className="relative z-10 flex items-center">
                    Create Account
                    <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300    "></div>
                </Link>
              </div>

              {/* Additional Help Section */}
              <div className="text-center pt-4">
                <p className="text-xs text-gray-500 mb-3">Need help getting started?</p>
                <button className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors duration-300 font-medium">
                  Contact Support →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}