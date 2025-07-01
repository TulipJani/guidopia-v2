import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  generateReport,
  generateCareerOpportunities,
  generateEducationalPathways,
  getSavedReport,
  getSavedCareerOpportunities,
  getSavedEducationalPathways
} from '../services/report';
import { Download, Home, Award, TrendingUp, Clock, Briefcase, GraduationCap, Bot, TrendingUp as SkillIcon, Sparkles, ArrowRight } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const GenerateReport = () => {
  const navigate = useNavigate();
  const [reportContent, setReportContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [assessmentData, setAssessmentData] = useState(null);
  const [activeTab, setActiveTab] = useState('summary');

  // States for recommendations data
  const [careerOpportunities, setCareerOpportunities] = useState('');
  const [educationalPathways, setEducationalPathways] = useState('');
  const [allContentLoaded, setAllContentLoaded] = useState(false);

  useEffect(() => {
    // Get assessment answers from sessionStorage
    const answers = JSON.parse(sessionStorage.getItem('assessmentAnswers') || 'null');
    const assessmentType = sessionStorage.getItem('assessmentType');

    if (answers && assessmentType) {
      setAssessmentData({ answers, type: assessmentType });
      // Auto-generate all content when component loads
      generateAllContent(answers);
    } else {
      // If no assessment data found, redirect to home
      setError('No assessment data found. Please complete an assessment first.');
      setTimeout(() => navigate('/'), 3000);
    }
  }, [navigate]);

  const generateAllContent = async (answers) => {
    if (!answers) {
      setError('No assessment data available. Please complete an assessment first.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Generate all content in parallel
      const [reportResult, careerOppsResult, educPathsResult] = await Promise.all([
        generateReport(answers),
        generateCareerOpportunities(answers),
        generateEducationalPathways(answers)
      ]);

      setReportContent(reportResult);
      setCareerOpportunities(careerOppsResult);
      setEducationalPathways(educPathsResult);
      setAllContentLoaded(true);
      setLoading(false);
    } catch (err) {
      setError(err.message || 'An error occurred while generating the report. Please try again.');
      setLoading(false);
    }
  };

  // Handle tab switching
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleExportPDF = async () => {
    if (!reportContent) {
      setError('Please wait for the report to be generated before exporting.');
      return;
    }

    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 15;
      const maxLineWidth = pageWidth - (margin * 2);
      let currentY = margin;

      // Add header
      pdf.setFontSize(18);
      pdf.setTextColor(40, 100, 180);
      pdf.text('Your Personalized Career Report', pageWidth / 2, currentY, { align: 'center' });
      currentY += 10;

      pdf.setFontSize(10);
      pdf.setTextColor(100, 100, 100);
      pdf.text(`Generated on ${new Date().toLocaleDateString()}`, pageWidth / 2, currentY, { align: 'center' });
      currentY += 20;

      // Function to add a new page if needed
      const checkPageBreak = (requiredSpace = 15) => {
        if (currentY + requiredSpace > pageHeight - margin) {
          pdf.addPage();
          currentY = margin + 10;
          return true;
        }
        return false;
      };

      // Function to add text with automatic wrapping
      const addText = (text, fontSize = 10, isBold = false, color = [0, 0, 0]) => {
        if (!text || text.trim() === '') return;

        pdf.setFontSize(fontSize);
        pdf.setFont(undefined, isBold ? 'bold' : 'normal');
        pdf.setTextColor(color[0], color[1], color[2]);

        const lines = pdf.splitTextToSize(text.trim(), maxLineWidth);

        for (const line of lines) {
          checkPageBreak();
          pdf.text(line, margin, currentY);
          currentY += fontSize * 0.35 + 3;
        }
        currentY += 4; // Extra spacing
      };

      // Simply split content into paragraphs and process each one
      const paragraphs = reportContent.split('\n\n').filter(p => p.trim());

      paragraphs.forEach((paragraph) => {
        const cleanParagraph = paragraph.trim();

        // Section headers (1., 2., 3., etc.)
        if (/^\d+\.\s/.test(cleanParagraph) && cleanParagraph.length < 100) {
          currentY += 5;
          addText(cleanParagraph, 14, true, [40, 100, 180]);
          currentY += 2;
        }
        // Career options (Option 1:, Option 2:, etc.)
        else if (/Option\s+\d+:/i.test(cleanParagraph)) {
          const lines = cleanParagraph.split('\n');
          const optionTitle = lines[0];

          currentY += 3;
          addText(optionTitle, 12, true, [40, 80, 160]);

          // Process bullet points for this option
          lines.slice(1).forEach(line => {
            if (line.trim().startsWith('-')) {
              const bulletText = line.trim().substring(1).trim();
              if (bulletText) {
                addText(`• ${bulletText}`, 9, false, [60, 60, 60]);
              }
            }
          });
        }
        // Regular paragraphs
        else if (cleanParagraph.length > 0) {
          // Handle bullet points
          if (cleanParagraph.includes('\n-')) {
            const bullets = cleanParagraph.split('\n').filter(line => line.trim().startsWith('-'));
            bullets.forEach(bullet => {
              const bulletText = bullet.trim().substring(1).trim();
              if (bulletText) {
                addText(`• ${bulletText}`, 9);
              }
            });
          }
          // Handle numbered lists in section 5
          else if (/^\d+\.\s/.test(cleanParagraph)) {
            addText(cleanParagraph, 10, true);
          }
          // Regular paragraph
          else {
            addText(cleanParagraph, 10);
          }
        }
      });

      // Add page numbers
      const totalPages = pdf.internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setTextColor(150, 150, 150);
        pdf.text(`Page ${i} of ${totalPages}`, pageWidth - margin, pageHeight - 8, { align: 'right' });
      }

      pdf.save('career-assessment-report.pdf');

    } catch (err) {
      console.error('PDF Export Error:', err);
      setError('Failed to export PDF. Please try again.');
    }
  };

  // COMPLETELY FIXED: Render College Recommendations with consistent parsing
  const renderCollegeRecommendationsSection = (content, index) => {
    // Clean and normalize the content first
    const normalizedContent = content
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .trim();

    // Split into individual lines and process
    const lines = normalizedContent.split('\n');
    const colleges = [];
    let currentCollege = null;
    let description = '';

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      if (!line) continue; // Skip empty lines

      // Check if line starts with a number (new college)
      const collegeMatch = line.match(/^(\d+)\.\s+(.+)/);

      if (collegeMatch) {
        // Save previous college if exists
        if (currentCollege) {
          colleges.push({
            name: currentCollege.name,
            type: currentCollege.type,
            description: description.trim()
          });
        }

        // Parse new college
        const collegeName = collegeMatch[2];

        // Extract college type if in parentheses
        const typeMatch = collegeName.match(/^([^(]+)\s*\(([^)]+)\)/);
        let name, type;

        if (typeMatch) {
          name = typeMatch[1].trim();
          type = typeMatch[2].trim();
        } else {
          // Check if there's a dash separator
          const dashMatch = collegeName.match(/^([^-]+)\s*-\s*(.+)/);
          if (dashMatch) {
            name = dashMatch[1].trim();
            description = dashMatch[2].trim();
            type = null;
          } else {
            name = collegeName.trim();
            type = null;
          }
        }

        currentCollege = { name, type };
        description = description || ''; // Reset description only if it wasn't pre-filled by a dash match
      } else if (currentCollege && line) {
        // This is part of the description for current college
        description += (description ? ' ' : '') + line;
      } else if (!currentCollege && line.length > 20) {
        // This might be intro text
        colleges.push({
          name: null,
          type: null,
          description: line,
          isIntro: true
        });
      }
    }

    // Don't forget the last college
    if (currentCollege) {
      colleges.push({
        name: currentCollege.name,
        type: currentCollege.type,
        description: description.trim()
      });
    }

    if (colleges.length === 0) {
      return renderGenericSection(content);
    }

    return (
      <div key={index} className="space-y-3">
        {colleges.map((college, collegeIndex) => {
          // Handle intro text
          if (college.isIntro) {
            return (
              <div key={collegeIndex} className="bg-green-50 p-3 sm:p-4 rounded-xl border border-green-200 mb-4">
                <p className="text-gray-700 text-sm leading-relaxed">
                  {college.description}
                </p>
              </div>
            );
          }

          // Handle regular colleges
          if (!college.name || college.name.length < 3) return null;

          return (
            <div key={collegeIndex} className="bg-white p-4 rounded-xl border border-green-200 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.01]">
              <div className="flex flex-col sm:flex-row items-start sm:justify-between gap-2 mb-2">
                <h6 className="font-semibold text-green-800 text-base leading-tight flex-1 sm:pr-3">
                  {college.name}
                </h6>
                {college.type && (
                  <span className={`self-start px-3 py-1 rounded-full text-xs font-medium shrink-0 ${college.type.toLowerCase().includes('government') || college.type.toLowerCase().includes('public')
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'bg-purple-100 text-purple-700 border border-purple-200'
                    }`}>
                    {college.type}
                  </span>
                )}
              </div>
              {college.description && (
                <p className="text-gray-600 text-sm leading-relaxed">
                  {college.description}
                </p>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const formatReportContent = (content) => {
    if (!content) return null;

    // Split content into sections by looking for numbered headers
    const sections = [];
    const lines = content.split('\n');
    let currentSection = null;
    let currentContent = [];

    lines.forEach(line => {
      const trimmedLine = line.trim();

      // Check if this line is a section header (starts with number and period)
      if (/^\d+\.\s+/.test(trimmedLine)) {
        // Save previous section if it exists
        if (currentSection) {
          sections.push({
            title: currentSection,
            content: currentContent.join('\n').trim()
          });
        }

        // Start new section
        currentSection = trimmedLine;
        currentContent = [];
      } else {
        // Add line to current section content
        currentContent.push(line);
      }
    });

    // Don't forget the last section
    if (currentSection) {
      sections.push({
        title: currentSection,
        content: currentContent.join('\n').trim()
      });
    }

    return (
      <div className="space-y-6 md:space-y-8">
        {sections.map((section, index) => {
          const sectionNumber = index + 1;
          const sectionTitle = section.title.replace(/^\d+\.\s+/, '');

          // Special handling for section 5 (Next Steps) - show sub-points properly
          if (sectionTitle.includes('Next Steps') || sectionTitle.includes('Immediate Actions')) {
            return (
              <div key={index} className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
                {/* Section Header */}
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-4 md:px-8 md:py-6">
                  <div className="flex items-center text-white">
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-2 md:p-3 mr-3 md:mr-4">
                      <span className="text-white font-bold text-lg md:text-xl">{sectionNumber}</span>
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold">{sectionTitle}</h2>
                  </div>
                </div>

                {/* Section Content - Enhanced for Next Steps */}
                <div className="p-4 md:p-8">
                  {renderNextStepsContent(section.content)}
                </div>
              </div>
            );
          }

          return (
            <div key={index} className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              {/* Enhanced Section Header */}
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-4 md:px-8 md:py-6">
                <div className="flex items-center text-white">
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-2 md:p-3 mr-3 md:mr-4">
                    <span className="text-white font-bold text-lg md:text-xl">{sectionNumber}</span>
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold">{sectionTitle}</h2>
                </div>
              </div>

              {/* Enhanced Section Content - PRESERVE ALL CONTENT */}
              <div className="p-4 md:p-8">
                <div className="prose prose-blue max-w-none">
                  {section.title.includes('2.') ?
                    renderCareerOptions(section.content) :
                    renderRegularContent(section.content)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // FIXED: Special renderer for Next Steps section - points 6-10 as bullets under section 5
  const renderNextStepsContent = (content) => {
    const lines = content.split('\n').filter(line => line.trim());
    const mainContent = [];
    let currentParagraph = '';

    for (let line of lines) {
      const trimmedLine = line.trim();

      // Check if this line starts with a number > 5 (these should be bullet points)
      const numberMatch = trimmedLine.match(/^(\d+)\.\s*(.+)/);
      if (numberMatch && parseInt(numberMatch[1]) > 5) {
        // Convert numbered points 6+ to bullet points
        if (currentParagraph) {
          mainContent.push(currentParagraph.trim());
          currentParagraph = '';
        }
        mainContent.push(`• ${numberMatch[2]}`);
      } else {
        // Regular content - accumulate into paragraph
        if (currentParagraph) {
          currentParagraph += ' ' + trimmedLine;
        } else {
          currentParagraph = trimmedLine;
        }
      }
    }

    // Don't forget the last paragraph
    if (currentParagraph) {
      mainContent.push(currentParagraph.trim());
    }

    return (
      <div className="space-y-4">
        {mainContent.map((content, index) => {
          const trimmedContent = content.trim();

          // Handle bullet points (converted from numbers 6+)
          if (trimmedContent.startsWith('•')) {
            return (
              <div key={index} className="flex items-start ml-2 sm:ml-4">
                <span className="text-purple-500 mr-3 mt-1 text-lg font-bold">•</span>
                <p className="text-gray-700 leading-relaxed flex-1">
                  {trimmedContent.substring(1).trim()}
                </p>
              </div>
            );
          }

          // Regular content
          return (
            <div key={index} className="bg-purple-50 rounded-lg p-3 sm:p-4 border border-purple-200">
              <p className="text-gray-800 leading-relaxed">
                {trimmedContent}
              </p>
            </div>
          );
        })}
      </div>
    );
  };

  const renderCareerOptions = (content) => {
    // Split content by "Option X:" to get individual career options
    const options = content.split(/(?=Option\s+\d+:)/i).filter(option => option.trim());

    return (
      <div className="space-y-6">
        {options.map((option, index) => {
          const trimmedOption = option.trim();
          if (!trimmedOption || !/Option\s+\d+:/i.test(trimmedOption)) return null;

          return (
            <div key={index} className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 sm:p-6 border border-blue-200 shadow-sm">
              {renderSingleCareerOption(trimmedOption)}
            </div>
          );
        })}
      </div>
    );
  };

  const renderSingleCareerOption = (optionContent) => {
    const lines = optionContent.split('\n');
    const titleLine = lines[0] || '';

    // Extract career title and option number
    const titleMatch = titleLine.match(/Option\s+(\d+):\s*(.+)/i);
    const optionNumber = titleMatch ? titleMatch[1] : '1';
    const careerTitle = titleMatch ? titleMatch[2].trim() : 'Career Option';

    // Get the bullet points (lines starting with -)
    const bulletPoints = lines.slice(1)
      .filter(line => line.trim().startsWith('-'))
      .map(line => line.trim().substring(1).trim());

    return (
      <div>
        <h4 className="text-lg md:text-xl font-bold text-blue-800 mb-6 flex items-center">
          <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm mr-4 font-bold">
            {optionNumber}
          </span>
          {careerTitle}
        </h4>

        <div className="space-y-4">
          {bulletPoints.map((point, idx) => {
            // Split bullet point into title and content
            const colonIndex = point.indexOf(':');
            if (colonIndex === -1) return null;

            const pointTitle = point.substring(0, colonIndex).trim();
            const pointContent = point.substring(colonIndex + 1).trim();

            const getIconForPoint = (title) => {
              const lowerTitle = title.toLowerCase();
              if (lowerTitle.includes('alignment') || lowerTitle.includes('profile')) return '🎯';
              if (lowerTitle.includes('day') || lowerTitle.includes('responsibilit') || lowerTitle.includes('activities')) return '💼';
              if (lowerTitle.includes('education') || lowerTitle.includes('path') || lowerTitle.includes('qualif')) return '🎓';
              if (lowerTitle.includes('growth') || lowerTitle.includes('salary') || lowerTitle.includes('career')) return '📈';
              if (lowerTitle.includes('market') || lowerTitle.includes('demand') || lowerTitle.includes('perfect')) return '🚀';
              return '📋';
            };

            return (
              <div key={idx} className="bg-white rounded-md p-3 sm:p-5 border border-blue-100 shadow-sm">
                <h5 className="font-semibold text-blue-700 mb-3 flex items-center text-sm">
                  <span className="mr-2 text-base">{getIconForPoint(pointTitle)}</span>
                  {pointTitle}
                </h5>
                <p className="text-gray-600 leading-relaxed text-sm">
                  {pointContent}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderRegularContent = (content) => {
    // Split content into paragraphs
    const paragraphs = content.split('\n\n').filter(p => p.trim());

    return (
      <div className="space-y-4">
        {paragraphs.map((paragraph, index) => {
          const trimmedParagraph = paragraph.trim();

          // Handle Month-based action plans
          if (/Month\s+\d+[-–]\d+:/i.test(trimmedParagraph)) {
            return (
              <div key={index} className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 sm:p-6 border border-blue-200">
                {trimmedParagraph.split('\n').map((line, lineIndex) => {
                  const trimmedLine = line.trim();
                  if (/Month\s+\d+[-–]\d+:/i.test(trimmedLine)) {
                    return (
                      <h4 key={lineIndex} className="font-bold text-blue-800 mb-3 text-base md:text-lg">
                        {trimmedLine}
                      </h4>
                    );
                  } else if (trimmedLine) {
                    return (
                      <p key={lineIndex} className="text-gray-700 leading-relaxed ml-2 sm:ml-4 mb-2">
                        {trimmedLine}
                      </p>
                    );
                  }
                  return null;
                })}
              </div>
            );
          }

          // Handle numbered action items (1., 2., 3., etc.) - Enhanced styling
          if (/^\d+\.\s/.test(trimmedParagraph)) {
            const number = trimmedParagraph.match(/^(\d+)\./)[1];
            const text = trimmedParagraph.replace(/^\d+\.\s*/, '');

            return (
              <div key={index} className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 sm:p-6 border border-green-200 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex items-start">
                  <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg mr-4 shadow-sm flex-shrink-0">
                    {number}
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-800 leading-relaxed font-medium text-base md:text-lg">
                      {text}
                    </p>
                  </div>
                </div>
              </div>
            );
          }

          // Handle bullet points
          if (trimmedParagraph.includes('\n-') || trimmedParagraph.startsWith('-')) {
            const bullets = trimmedParagraph.split('\n').filter(line => line.trim().startsWith('-'));
            return (
              <div key={index} className="bg-gray-50 rounded-xl p-4 sm:p-6 border border-gray-200">
                <div className="space-y-3">
                  {bullets.map((bullet, bulletIndex) => (
                    <div key={bulletIndex} className="flex items-start">
                      <span className="text-blue-500 mr-4 mt-1 text-xl font-bold">•</span>
                      <p className="text-gray-700 leading-relaxed flex-1">
                        {bullet.trim().substring(1).trim()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            );
          }

          // Regular paragraph - KEEP ALL CONTENT
          return (
            <div key={index} className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200 shadow-sm">
              <p className="text-gray-700 leading-relaxed text-justify">
                {trimmedParagraph}
              </p>
            </div>
          );
        })}
      </div>
    );
  };

  // IMPROVED: Enhanced formatRecommendationContent function
  const formatRecommendationContent = (content) => {
    if (!content) return null;

    // Normalize line breaks and clean up content
    const normalizedContent = content
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .replace(/\n{3,}/g, '\n\n') // Replace multiple line breaks with double
      .trim();

    // Split content into paragraphs and sections
    const lines = normalizedContent.split('\n');
    const sections = [];
    let currentSection = null;
    let currentContent = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // Skip empty lines
      if (!line) {
        if (currentContent.length > 0) {
          currentContent.push(''); // Keep paragraph breaks
        }
        continue;
      }

      // Check if this line is a main section header (ALL CAPS, possibly with colons)
      const isMainHeader = /^[A-Z\s&:()0-9-]+$/.test(line) &&
        line.length > 3 &&
        line.length < 80 &&
        !line.includes('.') &&
        !/^\d+\./.test(line);

      if (isMainHeader) {
        // Save previous section
        if (currentSection) {
          sections.push({
            type: 'section',
            title: currentSection,
            content: currentContent.join('\n').trim()
          });
        }

        // Start new section
        currentSection = line;
        currentContent = [];
      } else {
        // Add line to current content
        currentContent.push(line);
      }
    }

    // Don't forget the last section
    if (currentSection) {
      sections.push({
        type: 'section',
        title: currentSection,
        content: currentContent.join('\n').trim()
      });
    }

    // If no sections found, treat entire content as one section
    if (sections.length === 0) {
      sections.push({
        type: 'content',
        title: null,
        content: normalizedContent
      });
    }

    return (
      <div className="space-y-6">
        {sections.map((section, index) => {
          if (!section.content || section.content.trim() === '') {
            return null; // Skip empty sections
          }

          return (
            <div key={index}>
              {/* Section Header */}
              {section.title && (
                <h4 className="text-base md:text-lg font-bold text-gray-800 mb-4 border-b-2 border-gray-300 pb-2 bg-gray-50 p-2 sm:p-3 rounded-md">
                  {section.title}
                </h4>
              )}

              {/* Section Content */}
              <div className="space-y-4">
                {renderSectionContent(section.content, section.title)}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // NEW: Enhanced function to render section content based on its type
  const renderSectionContent = (content, sectionTitle) => {
    if (!content || content.trim() === '') {
      return (
        <div className="bg-yellow-50 p-3 rounded-md border border-yellow-200">
          <p className="text-gray-600 text-sm italic">Content for this section is being generated...</p>
        </div>
      );
    }

    const trimmedContent = content.trim();

    // Handle different types of content based on section title
    if (sectionTitle && sectionTitle.includes('COMPANIES')) {
      return renderCompaniesSection(trimmedContent);
    } else if (sectionTitle && sectionTitle.includes('COLLEGE')) {
      return renderCollegeRecommendationsSection(trimmedContent, 0);
    } else if (sectionTitle && sectionTitle.includes('CAREER EXPLORATION')) {
      return renderCareerExplorationSection(trimmedContent, 0);
    } else if (sectionTitle && sectionTitle.includes('STREAM SELECTION')) {
      return renderStreamSelectionSection(trimmedContent, 0);
    } else if (sectionTitle && (sectionTitle.includes('SALARY') || sectionTitle.includes('MARKET ANALYSIS'))) {
      return renderMarketAnalysisSection(trimmedContent);
    } else {
      return renderGenericSection(trimmedContent);
    }
  };

  // NEW: Render companies section with better formatting
  const renderCompaniesSection = (content) => {
    // Split by numbered items or company names
    const companies = content.split(/(?=\d+\.\s+[A-Z])/g).filter(item => item.trim());

    if (companies.length <= 1) {
      // If no clear company structure, treat as paragraph
      return renderGenericSection(content);
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        {companies.map((company, index) => {
          const trimmedCompany = company.trim();
          if (!trimmedCompany) return null;

          // Extract company name and description
          const match = trimmedCompany.match(/^\d+\.\s+([^:]+):\s*(.*)/s);
          if (!match) return null;

          const [, companyName, description] = match;

          return (
            <div key={index} className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-lg border border-blue-200 shadow-sm">
              <h5 className="font-bold text-blue-800 mb-2 text-xs sm:text-sm">
                {companyName.trim()}
              </h5>
              <p className="text-gray-700 text-[11px] leading-snug sm:text-xs sm:leading-relaxed">
                {description.trim()}
              </p>
            </div>
          );
        })}
      </div>
    );
  };

  // NEW: Render market analysis with structured format
  const renderMarketAnalysisSection = (content) => {
    const paragraphs = content.split('\n\n').filter(p => p.trim());

    return (
      <div className="space-y-3 sm:space-y-4">
        {paragraphs.map((paragraph, index) => {
          const trimmedParagraph = paragraph.trim();

          // Handle bullet points
          if (trimmedParagraph.includes('\n-') || trimmedParagraph.startsWith('-')) {
            const bullets = trimmedParagraph.split('\n').filter(line => line.trim().startsWith('-'));
            return (
              <div key={index} className="bg-blue-50 p-3 sm:p-4 rounded-lg border border-blue-200">
                <div className="space-y-2">
                  {bullets.map((bullet, bulletIndex) => (
                    <div key={bulletIndex} className="flex items-start">
                      <span className="text-blue-500 mr-3 mt-1 font-bold">•</span>
                      <p className="text-gray-700 leading-relaxed flex-1 text-sm">
                        {bullet.trim().substring(1).trim()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            );
          }

          // Regular paragraph with highlighting for important info
          return (
            <div key={index} className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200 shadow-sm">
              <p className="text-gray-700 leading-relaxed text-sm">
                {trimmedParagraph}
              </p>
            </div>
          );
        })}
      </div>
    );
  };

  // NEW: Generic section renderer for fallback
  const renderGenericSection = (content) => {
    const paragraphs = content.split('\n\n').filter(p => p.trim());

    return (
      <div className="space-y-3 sm:space-y-4">
        {paragraphs.map((paragraph, index) => {
          const trimmedParagraph = paragraph.trim();

          if (!trimmedParagraph) return null;

          // Handle numbered lists
          if (/^\d+\.\s/.test(trimmedParagraph)) {
            return (
              <div key={index} className="bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-200">
                <p className="text-gray-800 leading-relaxed text-sm font-medium">
                  {trimmedParagraph}
                </p>
              </div>
            );
          }

          // Handle bullet points
          if (trimmedParagraph.includes('\n-') || trimmedParagraph.startsWith('-')) {
            const bullets = trimmedParagraph.split('\n').filter(line => line.trim().startsWith('-'));
            return (
              <div key={index} className="space-y-2">
                {bullets.map((bullet, bulletIndex) => (
                  <div key={bulletIndex} className="bg-gray-50 p-3 rounded-md border border-gray-200 flex items-start">
                    <span className="text-blue-500 mr-3 mt-1 font-bold text-sm">•</span>
                    <p className="text-gray-700 leading-relaxed flex-1 text-sm">
                      {bullet.trim().substring(1).trim()}
                    </p>
                  </div>
                ))}
              </div>
            );
          }

          // Handle subsection headers (with colons)
          if (trimmedParagraph.includes(':') && trimmedParagraph.length < 100 && !trimmedParagraph.includes('.')) {
            return (
              <div key={index} className="mb-3">
                <h5 className="font-semibold text-gray-800 text-sm bg-blue-50 p-2 rounded border-l-4 border-blue-400">
                  {trimmedParagraph}
                </h5>
              </div>
            );
          }

          // Regular paragraph
          return (
            <div key={index} className="bg-blue-50 p-3 sm:p-4 rounded-lg border border-blue-200">
              <p className="text-gray-700 leading-relaxed text-sm">
                {trimmedParagraph}
              </p>
            </div>
          );
        })}
      </div>
    );
  };

  // UPDATED: Render Career Exploration as separate boxes
  const renderCareerExplorationSection = (content, index) => {
    // Split by numbered items (1. Engineering/Technology, 2. Creative Arts, etc.)
    const careerFields = content.split(/(?=\d+\.\s+[A-Z])/g).filter(field => field.trim());

    if (careerFields.length <= 1) {
      // If no clear structure, render as generic content
      return renderGenericSection(content);
    }

    return (
      <div key={index} className="space-y-3 sm:space-y-4">
        {careerFields.map((field, fieldIndex) => {
          const trimmedField = field.trim();
          if (!trimmedField) return null;

          // Extract career field number and title
          const match = trimmedField.match(/^(\d+)\.\s+([^:]+):\s*(.*)/s);
          if (!match) return null;

          const [, number, title, description] = match;

          return (
            <div key={fieldIndex} className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200 shadow-sm">
              <h5 className="font-bold text-blue-800 mb-3 flex items-center">
                <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 font-bold">
                  {number}
                </span>
                {title.trim()}
              </h5>
              <p className="text-gray-700 leading-relaxed text-sm">
                {description.trim()}
              </p>
            </div>
          );
        })}
      </div>
    );
  };

  // UPDATED: Render Stream Selection as separate stream boxes
  const renderStreamSelectionSection = (content, index) => {
    // Split by stream types (Science Stream:, Commerce Stream:, etc.)
    const streams = content.split(/(?=[A-Z][a-z]+\s+Stream:)/g).filter(stream => stream.trim());

    if (streams.length <= 1) {
      // If no clear stream structure, render as generic content
      return renderGenericSection(content);
    }

    return (
      <div key={index} className="space-y-3 sm:space-y-4">
        {streams.map((stream, streamIndex) => {
          const trimmedStream = stream.trim();
          if (!trimmedStream || trimmedStream === 'STREAM SELECTION IMPACT') return null;

          // Extract stream name and description
          const match = trimmedStream.match(/^([^:]+Stream):\s*(.*)/s);
          if (!match) return null;

          const [, streamName, description] = match;

          return (
            <div key={streamIndex} className="bg-gradient-to-r from-green-50 to-emerald-50 p-3 sm:p-4 rounded-lg border border-green-200 shadow-sm">
              <h5 className="font-bold text-green-800 mb-3 flex items-center text-sm sm:text-base">
                <span className="text-green-600 mr-2">📚</span>
                {streamName.trim()}
              </h5>
              <p className="text-gray-700 leading-relaxed text-sm">
                {description.trim()}
              </p>
            </div>
          );
        })}
      </div>
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 px-4 text-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-6"></div>
        <h2 className="text-xl md:text-2xl font-semibold text-gray-700 mb-2">Generating Your Career Report</h2>
        <p className="text-gray-500 max-w-sm md:max-w-md">
          Our AI is analyzing your responses to create a personalized report with all recommendations. This may take a moment...
        </p>
        <div className="mt-6 flex flex-col items-center">
          <div className="flex mb-2">
            <div className="h-2 w-6 bg-blue-200 rounded-full mx-1 animate-pulse"></div>
            <div className="h-2 w-6 bg-blue-300 rounded-full mx-1 animate-pulse delay-100"></div>
            <div className="h-2 w-6 bg-blue-400 rounded-full mx-1 animate-pulse delay-200"></div>
            <div className="h-2 w-6 bg-blue-500 rounded-full mx-1 animate-pulse delay-300"></div>
          </div>
          <p className="text-xs text-blue-500 font-medium">Processing insights & recommendations</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-[40vh] flex flex-col items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 p-4">
        <div className="bg-white border border-red-100 text-red-600 p-6 rounded-lg shadow-xl max-w-lg text-center">
          <svg className="h-12 w-12 md:h-16 md:w-16 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-lg md:text-xl font-semibold mb-4">Something went wrong</h2>
          <p className="text-sm md:text-base">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="mt-6 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition shadow-md text-sm"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  // Report display
  return (
    <div className="bg-gray-50 min-h-screen py-6 sm:py-10">
      <div className="max-w-6xl mx-auto px-2 sm:px-4">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Report Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-4 md:p-6 lg:p-8">
            <div className="flex flex-col md:flex-row gap-4 md:gap-2 items-start md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold mb-1 md:mb-2">Your Personalized Career Report</h1>
                <p className="text-blue-100 text-sm md:text-base">Based on your assessment completed on {new Date().toLocaleDateString()}</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto sm:space-x-3">
                <button
                  onClick={handleExportPDF}
                  className="bg-white text-blue-700 px-4 py-2 rounded-md hover:bg-blue-50 transition shadow-md flex items-center justify-center text-sm font-medium"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export as PDF
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="bg-blue-800 text-white px-4 py-2 rounded-md hover:bg-blue-900 transition shadow-md flex items-center justify-center text-sm font-medium"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Home
                </button>
              </div>
            </div>
          </div>

          {/* Report Navigation */}
          <div className="border-b border-gray-200 overflow-x-auto whitespace-nowrap">
            <nav className="flex px-2 sm:px-4 md:px-8">
              <button
                onClick={() => handleTabChange('summary')}
                className={`px-3 sm:px-6 py-3 sm:py-4 font-semibold text-sm border-b-2 transition-all duration-300 ${activeTab === 'summary'
                  ? 'border-blue-600 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                  }`}
              >
                <div className="flex items-center">
                  <Award className="h-4 w-4 mr-2" />
                  Career Profile
                </div>
              </button>
              <button
                onClick={() => handleTabChange('opportunities')}
                className={`px-3 sm:px-6 py-3 sm:py-4 font-semibold text-sm border-b-2 transition-all duration-300 ${activeTab === 'opportunities'
                  ? 'border-blue-600 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                  }`}
              >
                <div className="flex items-center">
                  <Briefcase className="h-4 w-4 mr-2" />
                  Market Insights
                </div>
              </button>
              <button
                onClick={() => handleTabChange('pathways')}
                className={`px-3 sm:px-6 py-3 sm:py-4 font-semibold text-sm border-b-2 transition-all duration-300 ${activeTab === 'pathways'
                  ? 'border-green-600 text-green-600 bg-green-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                  }`}
              >
                <div className="flex items-center">
                  <GraduationCap className="h-4 w-4 mr-2" />
                  Learning Paths
                </div>
              </button>
              <button
                onClick={() => handleTabChange('explore')}
                className={`px-3 sm:px-6 py-3 sm:py-4 font-semibold text-sm border-b-2 transition-all duration-300 relative ${activeTab === 'explore'
                  ? 'border-purple-600 text-purple-600 bg-purple-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                  }`}
              >
                <div className="flex items-center">
                  <Sparkles className="h-4 w-4 mr-2" />
                  AI Tools
                </div>
              </button>
            </nav>
          </div>

          {/* Report Content */}
          <div id="report-container" className="p-4 md:p-6 lg:p-8 bg-gradient-to-br from-blue-50 to-indigo-50">
            {activeTab === 'summary' && (
              <div className="space-y-6 md:space-y-8">
                {/* Enhanced Hero Section */}
                <div className="relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 opacity-10 rounded-2xl"></div>
                  <div className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-4 md:p-8 border border-blue-200">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 md:mb-8 gap-4">
                      <div className="flex items-center">
                        <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-3 md:p-4 mr-4 md:mr-6 shadow-lg">
                          <Award className="h-8 md:h-10 w-8 md:w-10 text-white" />
                        </div>
                        <div>
                          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">Your Career Profile</h2>
                          <p className="text-gray-600 text-base md:text-lg">Comprehensive analysis</p>
                        </div>
                      </div>
                      <div className="hidden md:block">
                        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/50 shadow-sm">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                            <div className="text-sm text-gray-500">Generated</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Status Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                      <div className="group bg-white/90 backdrop-blur-sm p-4 sm:p-6 rounded-xl border border-white/50 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105">
                        <div className="flex items-center justify-between mb-4">
                          <div className="bg-gradient-to-br from-emerald-400 to-green-500 p-3 rounded-xl shadow-sm group-hover:shadow-md transition-shadow">
                            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-emerald-600">100%</div>
                          </div>
                        </div>
                        <h3 className="font-semibold text-gray-800 mb-1">Assessment Complete</h3>
                        <p className="text-sm text-gray-600">All questions answered</p>
                        <div className="mt-4 w-full bg-emerald-100 rounded-full h-2">
                          <div className="bg-gradient-to-r from-emerald-400 to-green-500 h-2 rounded-full w-full"></div>
                        </div>
                      </div>

                      <div className="group bg-white/90 backdrop-blur-sm p-4 sm:p-6 rounded-xl border border-white/50 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105">
                        <div className="flex items-center justify-between mb-4">
                          <div className="bg-gradient-to-br from-blue-400 to-indigo-500 p-3 rounded-xl shadow-sm group-hover:shadow-md transition-shadow">
                            <TrendingUp className="h-6 w-6 text-white" />
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-blue-600">Ready</div>
                          </div>
                        </div>
                        <h3 className="font-semibold text-gray-800 mb-1">Career Insights</h3>
                        <p className="text-sm text-gray-600">Recommendations generated</p>
                        <div className="mt-4 w-full bg-blue-100 rounded-full h-2">
                          <div className="bg-gradient-to-r from-blue-400 to-indigo-500 h-2 rounded-full w-full"></div>
                        </div>
                      </div>

                      <div className="group bg-white/90 backdrop-blur-sm p-4 sm:p-6 rounded-xl border border-white/50 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105">
                        <div className="flex items-center justify-between mb-4">
                          <div className="bg-gradient-to-br from-purple-400 to-pink-500 p-3 rounded-xl shadow-sm group-hover:shadow-md transition-shadow">
                            <Sparkles className="h-6 w-6 text-white" />
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-purple-600">Active</div>
                          </div>
                        </div>
                        <h3 className="font-semibold text-gray-800 mb-1">AI Analysis</h3>
                        <p className="text-sm text-gray-600">Data processed</p>
                        <div className="mt-4 w-full bg-purple-100 rounded-full h-2">
                          <div className="bg-gradient-to-r from-purple-400 to-pink-500 h-2 rounded-full w-full"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {reportContent ? (
                  <div className="space-y-8">
                    {formatReportContent(reportContent)}
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden p-6 md:p-12 text-center">
                    <div className="max-w-md mx-auto">
                      <div className="w-12 h-12 border-4 border-blue-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-6"></div>
                      <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-3">Creating Your Personalized Report</h3>
                      <p className="text-gray-600 mb-6 text-sm md:text-base">Our AI is analyzing your responses. This may take a moment.</p>
                      <div className="flex justify-center space-x-2">
                        <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce"></div>
                        <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce [animation-delay:0.1s]"></div>
                        <div className="w-3 h-3 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'opportunities' && (
              <div className="space-y-8">
                <div className="bg-white rounded-2xl p-4 md:p-8 border border-gray-200 shadow-sm">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center mb-6 gap-4">
                    <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-4 shadow-lg">
                      <Briefcase className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">Market Insights</h2>
                      <p className="text-gray-600 text-base md:text-lg">Current opportunities and industry trends</p>
                    </div>
                  </div>

                  <div className="bg-blue-50/50 rounded-xl p-3 sm:p-6 border border-blue-100 shadow-sm">
                    {allContentLoaded ? (
                      formatRecommendationContent(careerOpportunities)
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12">
                        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-gray-600">Loading market insights...</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'pathways' && (
              <div className="space-y-8">
                <div className="bg-white rounded-2xl p-4 md:p-8 border border-gray-200 shadow-sm">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center mb-6 gap-4">
                    <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-4 shadow-lg">
                      <GraduationCap className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">Learning Paths</h2>
                      <p className="text-gray-600 text-base md:text-lg">Educational pathways and skill development</p>
                    </div>
                  </div>
                  <div className="bg-green-50/50 rounded-xl p-3 sm:p-6 border border-green-100 shadow-sm">
                    {allContentLoaded ? (
                      formatRecommendationContent(educationalPathways)
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12">
                        <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-gray-600">Loading learning pathways...</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'explore' && renderExploreContent()}

          </div>

          {/* Report Footer */}
          <div className="bg-gray-50 p-4 md:p-6 border-t border-gray-200">
            <div className="flex flex-col md:flex-row justify-between items-center text-gray-500 text-xs sm:text-sm text-center md:text-left">
              <p>Report generated on {new Date().toLocaleDateString()}</p>
              <p className="mt-2 md:mt-0">This report is an AI-generated guide based on your assessment responses.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};``

export default GenerateReport;