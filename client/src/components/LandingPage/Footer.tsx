import React from 'react';
import { Twitter, Linkedin, Github, Mail, MapPin, Phone, ArrowRight } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerNav = {
    product: [
      { name: 'AI College Assessment', href: '/career-selection' },
      { name: 'Personalized Roadmaps', href: '/roadmaps' },
      { name: 'Skill Gap Analysis', href: '/assessments' },
      { name: 'Sanskriti AI™', href: '/sanskriti' },
      { name: 'Mentorship Network', href: '/mentors' },
    ],
    company: [
      { name: 'About Guidopia', href: '/about' },
      { name: 'Success Stories', href: '/testimonials' },
      { name: 'Career Blog', href: '/blog' },
      { name: 'Join Our Team', href: '/careers' },
      { name: 'Press & Media', href: '/press' },
    ],
    resources: [
      { name: 'Career Guides', href: '/resources' },
      { name: 'Industry Reports', href: '/research' },
      { name: 'Help Center', href: '/support' },
      { name: 'API Documentation', href: '/docs' },
      { name: 'Community Forum', href: '/community' },
    ],
    legal: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Cookie Policy', href: '/cookies' },
      { name: 'Data Security', href: '/security' },
      { name: 'Accessibility', href: '/accessibility' },
    ],
  };

  const socialLinks = [
    { name: 'Twitter', href: 'https://twitter.com/guidopia', icon: Twitter },
    { name: 'LinkedIn', href: 'https://linkedin.com/company/guidopia', icon: Linkedin },
    { name: 'GitHub', href: 'https://github.com/guidopia', icon: Github },
    { name: 'Email', href: 'mailto:hello@guidopia.com', icon: Mail },
  ];

  return (
    <footer className="bg-black border-t border-white/[0.10] relative overflow-hidden" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">Footer</h2>

      {/* Background */}
      <div className="absolute inset-0 z-0">
      
        {/* Gradient overlays */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-br from-white/[0.04] via-gray-500/[0.02] to-transparent rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8 relative z-10">
        {/* Top section */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 mb-16">
          {/* Company info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-black">
                  <path d="m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z"></path>
                  <circle cx="12" cy="12" r="10"></circle>
                </svg>
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-b from-white to-gray-300 bg-clip-text text-transparent">
                GUIDOPIA
              </h3>
            </div>
            <p className="text-gray-400 leading-relaxed mb-6 max-w-md font-light">
              Empowering the next generation with AI-powered career intelligence, personalized guidance, and expert mentorship to navigate their professional journey with confidence.
            </p>

            {/* Contact info */}
            <div className="space-y-3 text-sm">
              <div className="flex items-center text-gray-400">
                <MapPin className="w-4 h-4 mr-3 text-gray-300" />
                San Francisco, CA & Remote Worldwide
              </div>
              <div className="flex items-center text-gray-400">
                <Mail className="w-4 h-4 mr-3 text-gray-300" />
                hello@guidopia.com
              </div>
              <div className="flex items-center text-gray-400">
                <Phone className="w-4 h-4 mr-3 text-gray-300" />
                +1 (555) 123-GUID
              </div>
            </div>
          </div>

          {/* Link Columns */}
          <div>
            <h4 className="text-sm font-semibold leading-6 bg-gradient-to-b from-white to-gray-300 bg-clip-text text-transparent mb-6">Platform</h4>
            <ul role="list" className="space-y-4">
              {footerNav.product.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="text-sm leading-6 text-gray-500 hover:text-gray-300 transition-colors duration-300 group flex items-center font-light"
                  >
                    <span className="w-0 h-0.5 bg-white group-hover:w-4 transition-all duration-300 mr-0 group-hover:mr-2"></span>
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold leading-6 bg-gradient-to-b from-white to-gray-300 bg-clip-text text-transparent mb-6">Company</h4>
            <ul role="list" className="space-y-4">
              {footerNav.company.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="text-sm leading-6 text-gray-500 hover:text-gray-300 transition-colors duration-300 group flex items-center font-light"
                  >
                    <span className="w-0 h-0.5 bg-white group-hover:w-4 transition-all duration-300 mr-0 group-hover:mr-2"></span>
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold leading-6 bg-gradient-to-b from-white to-gray-300 bg-clip-text text-transparent mb-6">Resources</h4>
            <ul role="list" className="space-y-4">
              {footerNav.resources.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="text-sm leading-6 text-gray-500 hover:text-gray-300 transition-colors duration-300 group flex items-center font-light"
                  >
                    <span className="w-0 h-0.5 bg-white group-hover:w-4 transition-all duration-300 mr-0 group-hover:mr-2"></span>
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter signup */}
        <div className="mb-16 bg-white/[0.05] backdrop-blur-sm border border-white/[0.12] rounded-2xl p-8 relative overflow-hidden hover:bg-white/[0.08] transition-all duration-300">
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="text-center lg:text-left">
              <h4 className="text-xl font-bold bg-gradient-to-b from-white to-gray-300 bg-clip-text text-transparent mb-2">Stay Updated</h4>
              <p className="text-gray-400 font-light">Get the latest career insights, industry trends, and platform updates.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-3 bg-white/[0.08] backdrop-blur-sm border border-white/[0.15] text-white placeholder:text-gray-500 rounded-2xl focus:border-white/[0.25] focus:ring-2 focus:ring-white/[0.15] outline-none transition-all duration-300 flex-1 min-w-[250px]"
              />
              <button className="group relative px-8 py-3 bg-white text-black font-bold rounded-2xl hover:scale-105 hover:shadow-2xl hover:shadow-white/20 border border-white/20 transition-all duration-300 whitespace-nowrap">
                <span className="relative z-10 flex items-center">
                  Subscribe
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-white opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300" />
              </button>
            </div>
          </div>

          {/* Hover effect overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-white/[0.01] opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-white/[0.10] pt-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            {/* Social links */}
            <div className="flex space-x-4 order-2 lg:order-1">
              {socialLinks.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="group p-3 bg-white/[0.08] backdrop-blur-sm border border-white/[0.15] rounded-xl hover:bg-white/[0.12] hover:scale-110 transition-all duration-300"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="sr-only">{item.name}</span>
                  <item.icon className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors duration-300" />
                </a>
              ))}
            </div>

            {/* Legal links and copyright */}
            <div className="flex flex-col sm:flex-row items-center gap-6 text-sm text-gray-500 order-1 lg:order-2">
              <div className="flex flex-wrap items-center gap-6">
                {footerNav.legal.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="hover:text-gray-300 transition-colors duration-300 font-light"
                  >
                    {item.name}
                  </a>
                ))}
              </div>
              <div className="border-l border-white/[0.10] pl-6 ml-6 hidden sm:block font-light">
                © {currentYear} Guidopia, Inc. All rights reserved.
              </div>
              <div className="sm:hidden font-light">
                © {currentYear} Guidopia, Inc. All rights reserved.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subtle decorative elements */}
      <div className="absolute bottom-20 right-20 w-3 h-3 bg-white/[0.12] rounded-full blur-sm" />
      <div className="absolute top-32 left-24 w-2 h-2 bg-white/[0.10] rounded-full blur-sm" />
      <div className="absolute bottom-1/2 right-32 w-4 h-4 bg-white/[0.08] rounded-full blur-sm" />
    </footer>
  );
};

export default Footer;