import React, { useState, useEffect } from 'react';
import { Menu, X, Compass } from 'lucide-react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const handleGetStarted = () => {
    window.location.href = '/login';
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${isScrolled || isMobileMenuOpen
        ? 'bg-black/95 backdrop-blur-xl border-b border-white/10 shadow-xl'
        : 'bg-transparent'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="/" className="flex items-center space-x-3 group">
              <div className="flex items-center gap-3 font-bold text-2xl">
                <div className="w-10 h-10 flex items-center justify-center relative hover:rotate-180 transition-transform duration-700">
                  <div className="absolute inset-0 bg-gradient-to-r from-white to-gray-300 rounded-full" />
                  <Compass className="text-black w-6 h-6 relative z-10" />
                </div>
                <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Guidopia
                </span>
              </div>
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {['Features', 'How It Works', 'Success Stories', 'FAQ', 'Pricing'].map((item) => {
              const href = item === 'Pricing' ? '/pricing' : `#${item.toLowerCase().replace(' ', '-')}`;
              return (
                <a
                  key={item}
                  href={href}
                  className="relative text-gray-400 hover:text-white transition-all duration-300 group py-2 px-4 font-medium hover:scale-105"
                >
                  <span className="relative z-10">{item}</span>
                  <div className="absolute inset-0 bg-white/[0.06] rounded-lg opacity-0 group-hover:opacity-100 backdrop-blur-sm transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-1/2 w-0 h-[2px] bg-white group-hover:w-full group-hover:left-0 transition-all duration-300" />
                </a>
              );
            })}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:flex items-center">
            <button
              onClick={handleGetStarted}
              className="group relative overflow-hidden px-8 py-3 bg-white text-black font-semibold rounded-xl transition-all duration-300 border border-white/20 hover:scale-105 hover:shadow-lg hover:shadow-white/20"
            >
              <span className="relative z-10">Get Started</span>
              <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-white opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-300" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-3 text-gray-400 hover:text-white hover:bg-white/[0.08] rounded-xl transition-all duration-300 hover:scale-105"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-black/98 backdrop-blur-xl border-b border-white/10">
          <div className="px-4 py-6 space-y-4">
            {['Features', 'How It Works', 'Success Stories', 'FAQ', 'Pricing'].map((item) => {
              const href = item === 'Pricing' ? '/pricing' : `#${item.toLowerCase().replace(' ', '-')}`;
              return (
                <a
                  key={item}
                  href={href}
                  className="block w-full text-left py-4 px-6 text-gray-300 hover:bg-white/[0.08] hover:text-white rounded-xl transition-all duration-300 hover:translate-x-2"
                  onClick={closeMobileMenu}
                >
                  {item}
                </a>
              );
            })}

            <div className="border-t border-white/10 pt-6 mt-6">
              <button
                onClick={() => {
                  closeMobileMenu();
                  handleGetStarted();
                }}
                className="block w-full text-center px-8 py-4 bg-white text-black font-semibold rounded-xl transition-all duration-300 hover:scale-105"
              >
                Get Started Free
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;