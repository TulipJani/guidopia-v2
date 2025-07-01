import React from 'react';
import { Star, Quote } from 'lucide-react';

const testimonialsData = [
  {
    quote: "Guidopia's AI-powered assessment was incredibly accurate. The personalized roadmap helped me transition from marketing to software development and land my dream job at a top tech company in just 6 months!",
    name: 'Alex Johnson',
    title: 'Software Developer at TechCorp',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=126&h=126&dpr=1',
    rating: 5,
    skills: ['React', 'Python', 'Career Transition']
  },
  {
    quote: "The career assessment pinpointed UX design as my perfect fit. The detailed learning path and skill recommendations helped me build an impressive portfolio that got me hired at a leading design agency.",
    name: 'Sophia Lee',
    title: 'Senior UX Designer at DesignStudio',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=126&h=126&dpr=1',
    rating: 5,
    skills: ['UX Design', 'Figma', 'User Research']
  },
  {
    quote: "As a career switcher, I was completely lost. Guidopia's cultural intelligence analysis and personalized guidance led me to data science - the perfect match for my analytical mindset and values.",
    name: 'Marcus Williams',
    title: 'Data Scientist at Analytics Pro',
    avatar: 'https://images.pexels.com/photos/937481/pexels-photo-937481.jpeg?auto=compress&cs=tinysrgb&w=126&h=126&dpr=1',
    rating: 5,
    skills: ['Python', 'Machine Learning', 'SQL']
  },
  {
    quote: "The market intelligence insights were invaluable. Guidopia helped me identify emerging trends in digital marketing, upskill accordingly, and secure a promotion with a 40% salary increase.",
    name: 'Priya Sharma',
    title: 'Digital Marketing Manager at GrowthCo',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=126&h=126&dpr=1',
    rating: 5,
    skills: ['SEO', 'Content Strategy', 'Analytics']
  },
  {
    quote: "Guidopia's mentorship network connected me with industry experts who provided crucial guidance. The platform demystified the path to becoming a product manager and accelerated my career growth.",
    name: 'Chen Wei',
    title: 'Product Manager at InnovateTech',
    avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=126&h=126&dpr=1',
    rating: 5,
    skills: ['Product Strategy', 'Agile', 'User Analytics']
  },
  {
    quote: "The structured learning path was exactly what I needed. Guidopia helped me pivot from finance to cloud engineering with a clear roadmap and the confidence to make the transition successfully.",
    name: 'Fatima Khan',
    title: 'Cloud Engineer at CloudScale',
    avatar: 'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=126&h=126&dpr=1',
    rating: 5,
    skills: ['AWS', 'DevOps', 'Kubernetes']
  },
];

const Testimonials = () => {
  return (
    <section id="testimonials" className="py-20 lg:py-28 bg-black relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 z-0">
      

        {/* Gradient overlays */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-white/[0.06] via-gray-500/[0.03] to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-white/[0.05] via-gray-400/[0.02] to-transparent rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-16 lg:mb-20">
          <div className="inline-flex items-center justify-center py-3 px-6 mb-8 text-sm bg-white/[0.08] text-gray-300 border border-white/[0.15] rounded-full backdrop-blur-sm">
            <span className="font-medium">Success Stories</span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight mb-6">
            <span className="block bg-gradient-to-b from-white via-gray-100 to-gray-400 bg-clip-text text-transparent">
              Real People,
            </span>
            <span className="block bg-gradient-to-b from-white to-gray-300 bg-clip-text text-transparent">
              Real Results
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-400 leading-relaxed font-light max-w-3xl mx-auto">
            Discover how Guidopia has empowered thousands of students and professionals to transform their careers and achieve their goals.
          </p>
        </div>

        {/* Testimonial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {testimonialsData.map((testimonial, index) => (
            <div
              key={index}
              className="group relative bg-white/[0.05] backdrop-blur-sm border border-white/[0.12] p-8 rounded-2xl hover:scale-105 transition-all duration-300 ease-out overflow-hidden hover:bg-white/[0.08] hover:shadow-2xl hover:shadow-white/10"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Quote icon */}
              <Quote className="w-8 h-8 text-white/[0.20] mb-6 transform scale-x-[-1]" />

              {/* Rating */}
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-white/[0.60] fill-current" />
                ))}
              </div>

              {/* Testimonial content */}
              <blockquote className="text-gray-400 leading-relaxed mb-6 group-hover:text-gray-300 transition-colors duration-300 font-light">
                <p>"{testimonial.quote}"</p>
              </blockquote>

              {/* Skills tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {testimonial.skills.map((skill, skillIndex) => (
                  <span
                    key={skillIndex}
                    className="px-3 py-1 text-xs font-medium bg-white/[0.08] text-gray-400 border border-white/[0.15] rounded-full backdrop-blur-sm group-hover:bg-white/[0.12] group-hover:text-gray-300 transition-all duration-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {/* Author info */}
              <div className="flex items-center pt-6 border-t border-white/[0.10]">
                <div className="relative">
                  <img
                    className="w-12 h-12 rounded-full object-cover border-2 border-white/[0.15] group-hover:border-white/[0.25] transition-all duration-300"
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    loading="lazy"
                    width={48}
                    height={48}
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white/[0.60] rounded-full border-2 border-black"></div>
                </div>
                <div className="ml-4">
                  <div className="font-semibold bg-gradient-to-b from-white to-gray-300 bg-clip-text text-transparent group-hover:from-white group-hover:to-gray-200 transition-all duration-300">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-500 group-hover:text-gray-400 transition-colors duration-300">
                    {testimonial.title}
                  </div>
                </div>
              </div>

              {/* Hover effect overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-white/[0.01] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
            </div>
          ))}
        </div>

        {/* Bottom stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-16 border-t border-white/[0.10]">
          <div className="text-center">
            <div className="text-3xl font-bold bg-gradient-to-b from-white to-gray-300 bg-clip-text text-transparent">
              94%
            </div>
            <div className="text-sm text-gray-500 mt-1">Success Rate</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold bg-gradient-to-b from-white to-gray-300 bg-clip-text text-transparent">
              10K+
            </div>
            <div className="text-sm text-gray-500 mt-1">Lives Changed</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold bg-gradient-to-b from-white to-gray-300 bg-clip-text text-transparent">
              6 Months
            </div>
            <div className="text-sm text-gray-500 mt-1">Avg. Time to Success</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold bg-gradient-to-b from-white to-gray-300 bg-clip-text text-transparent">
              40%
            </div>
            <div className="text-sm text-gray-500 mt-1">Avg. Salary Increase</div>
          </div>
        </div>
      </div>

      {/* Subtle decorative elements */}
      <div className="absolute bottom-40 right-20 w-3 h-3 bg-white/[0.12] rounded-full blur-sm" />
      <div className="absolute top-32 left-24 w-2 h-2 bg-white/[0.10] rounded-full blur-sm" />
      <div className="absolute top-2/3 right-32 w-4 h-4 bg-white/[0.08] rounded-full blur-sm" />
      <div className="absolute bottom-1/3 left-16 w-2 h-2 bg-white/[0.15] rounded-full blur-sm" />
    </section>
  );
};

export default Testimonials;