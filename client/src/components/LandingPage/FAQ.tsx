import React, { useState } from 'react';
import { ChevronDown, HelpCircle, MessageSquare } from 'lucide-react';

interface FAQData {
  question: string;
  answer: string;
}

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer, isOpen, onClick }) => {
  return (
    <div className="group bg-white/[0.05] backdrop-blur-sm border border-white/[0.12] rounded-2xl overflow-hidden hover:bg-white/[0.08] transition-all duration-300 relative">
      <button
        className="flex justify-between items-center w-full p-6 text-left focus:outline-none focus:ring-2 focus:ring-white/[0.20] focus:ring-inset relative z-10"
        onClick={onClick}
        aria-expanded={isOpen}
      >
        <span className="text-lg font-semibold bg-gradient-to-b from-white to-gray-300 bg-clip-text text-transparent group-hover:from-white group-hover:to-gray-200 transition-all duration-300 pr-8">
          {question}
        </span>
        <ChevronDown
          className={`flex-shrink-0 w-6 h-6 text-gray-400 group-hover:text-white transform transition-all duration-300 ${isOpen ? 'rotate-180 text-white' : 'rotate-0'
            }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out relative z-10 ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
      >
        <div className="px-6 pb-6">
          <div className="text-gray-400 leading-relaxed border-t border-white/[0.10] pt-4 font-light">
            {answer}
          </div>
        </div>
      </div>

      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-white/[0.01] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
    </div>
  );
};

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs: FAQData[] = [
    {
      question: "How does Guidopia's AI career matching actually work?",
      answer: "Our advanced AI algorithms analyze multiple data points including your skills, interests, personality traits, values, and cultural background through our comprehensive assessment. We then match this profile against our database of thousands of career paths, current market trends, and success patterns to provide highly personalized recommendations that align with both your strengths and market opportunities."
    },
    {
      question: "What makes Sanskriti AI™ different from other career tools?",
      answer: "Sanskriti AI™ is our unique cultural intelligence module that considers how your cultural background, values, and personal context influence career fit and workplace compatibility. Unlike traditional assessments that only look at skills and interests, we understand that cultural alignment is crucial for long-term career satisfaction and success."
    },
    {
      question: "How long does the career assessment take and what does it include?",
      answer: "Our comprehensive assessment typically takes 15-20 minutes and includes multiple components: skills evaluation, interest mapping, personality assessment, values alignment, and cultural fit analysis. The AI adapts questions based on your responses to provide the most accurate results while keeping the process efficient and engaging."
    },
    {
      question: "Is Guidopia suitable for both students and working professionals?",
      answer: "Absolutely! Guidopia is designed for anyone at any stage of their career journey - from high school students exploring options to university students planning their future, and working professionals considering career changes or advancement. Our AI adapts recommendations based on your current situation and experience level."
    },
    {
      question: "What kind of support and resources do I get with my roadmap?",
      answer: "Your personalized roadmap includes step-by-step learning paths, recommended courses and certifications, skill development priorities, networking strategies, and timeline guidance. Premium users also get access to our mentor network, progress tracking tools, and regular roadmap updates based on market changes."
    },
    {
      question: "How much does Guidopia cost and what's included in each plan?",
      answer: "We offer a free tier that includes basic career assessment and general recommendations. Our Premium plans start at $29/month and include advanced AI insights, detailed roadmaps, mentor access, and comprehensive resources. Enterprise plans are available for institutions. Visit our pricing page for detailed comparisons."
    },
    {
      question: "How accurate are the career recommendations and success rates?",
      answer: "Our AI has a 94% accuracy rate in career matching, with over 10,000 successful career transitions. We continuously improve our algorithms based on user feedback and outcome data. Most users report finding their ideal career path within 6 months of following their Guidopia roadmap."
    },
    {
      question: "Can I update my assessment results or get new recommendations?",
      answer: "Yes! We recommend retaking assessments every 6-12 months as your skills and interests evolve. You can also update your profile anytime, and our AI will automatically adjust your recommendations. Your roadmap is dynamic and updates based on your progress and changing market conditions."
    }
  ];

  return (
    <section id="faq" className="py-20 lg:py-28 bg-black relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 z-0">
       

        {/* Gradient overlays */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-white/[0.06] via-gray-500/[0.03] to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-gradient-to-tr from-white/[0.05] via-gray-400/[0.02] to-transparent rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-16 lg:mb-20">
          <div className="inline-flex items-center justify-center py-3 px-6 mb-8 text-sm bg-white/[0.08] text-gray-300 border border-white/[0.15] rounded-full backdrop-blur-sm">
            <HelpCircle className="w-4 h-4 mr-2" />
            <span className="font-medium">Got Questions?</span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight mb-6">
            <span className="block bg-gradient-to-b from-white via-gray-100 to-gray-400 bg-clip-text text-transparent">
              Frequently Asked
            </span>
            <span className="block bg-gradient-to-b from-white to-gray-300 bg-clip-text text-transparent">
              Questions
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-400 leading-relaxed font-light max-w-3xl mx-auto">
            Find answers to common questions about Guidopia's AI-powered career guidance platform and how it can transform your professional journey.
          </p>
        </div>

        <div className="space-y-6 mb-16">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              onClick={() => handleToggle(index)}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <div className="bg-white/[0.05] backdrop-blur-sm border border-white/[0.12] rounded-2xl p-8 relative overflow-hidden hover:bg-white/[0.08] transition-all duration-300 max-w-2xl mx-auto">
            <div className="relative z-10">
              <div className="flex items-center justify-center mb-6">
                <div className="w-12 h-12 bg-white/[0.10] border border-white/[0.15] rounded-2xl flex items-center justify-center mr-4">
                  <MessageSquare className="w-6 h-6 text-gray-300" />
                </div>
                <h3 className="text-2xl font-bold bg-gradient-to-b from-white to-gray-300 bg-clip-text text-transparent">Still have questions?</h3>
              </div>
              <p className="text-gray-400 mb-8 max-w-md mx-auto font-light leading-relaxed">
                Our support team is here to help you succeed. Get personalized assistance with your career journey.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button className="group relative px-8 py-3 bg-white text-black font-semibold rounded-2xl hover:scale-105 hover:shadow-2xl hover:shadow-white/20 border border-white/20 transition-all duration-300">
                  <span className="relative z-10">Contact Support</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-white opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300" />
                </button>
                <button className="group relative px-8 py-3 bg-white/[0.08] backdrop-blur-sm text-white border border-white/[0.15] font-semibold rounded-2xl hover:bg-white/[0.12] hover:scale-105 transition-all duration-300">
                  <span className="relative z-10">Try Free Assessment</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/[0.05] to-white/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subtle decorative elements */}
      <div className="absolute bottom-32 left-20 w-3 h-3 bg-white/[0.12] rounded-full blur-sm" />
      <div className="absolute top-40 right-24 w-2 h-2 bg-white/[0.10] rounded-full blur-sm" />
      <div className="absolute top-2/3 left-32 w-4 h-4 bg-white/[0.08] rounded-full blur-sm" />
      <div className="absolute bottom-1/4 right-16 w-2 h-2 bg-white/[0.15] rounded-full blur-sm" />
    </section>
  );
};

export default FAQ;