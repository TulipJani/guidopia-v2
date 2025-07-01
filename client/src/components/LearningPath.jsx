import React, { useState, useEffect } from "react";
import Quiz from "./Quiz"; // Assuming Quiz.jsx is in the same directory or configured path
import {
  ChevronDown,
  Check,
  Clock,
  ArrowLeft,
  ExternalLink,
  ClipboardList,
  Lightbulb,
  FileText,
  CheckCircle2,
} from "lucide-react";

// Consistent panel styling from the dashboard context
const panelClasses = "bg-gray-900/20 backdrop-blur-sm border border-gray-800/30 p-6 md:p-8 shadow-lg rounded-2xl text-white";

// Style for the "Take Quiz" button (solid cyan, distinct from primary gradient)
const takeQuizButtonClasses = "bg-cyan-600 hover:bg-cyan-700 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors duration-200 inline-flex items-center justify-center text-sm";

// Style for the "Mark as Completed" button (secondary dark theme)
const markCompletedButtonClasses = "sm:mr-auto px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg flex items-center text-sm transition-colors";


export default function LearningPath({ skill, data }) {
  const [expandedModule, setExpandedModule] = useState(null);

  const [completedModules, setCompletedModules] = useState(() => {
    const saved = localStorage.getItem(`completedModules_${skill}`);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error("Error parsing completedModules from localStorage:", e); return {}; }
    }
    return {};
  });

  const [moduleScores, setModuleScores] = useState(() => {
    const saved = localStorage.getItem(`moduleScores_${skill}`);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error("Error parsing moduleScores from localStorage:", e); return {}; }
    }
    return {};
  });

  const [quizModule, setQuizModule] = useState(null);

  const [totalXP, setTotalXP] = useState(() => {
    const savedScores = localStorage.getItem(`moduleScores_${skill}`);
    const initialScores = savedScores ? (() => { try { return JSON.parse(savedScores); } catch (e) { return {}; } })() : {};
    return Object.values(initialScores).reduce((sum, score) => sum + (Number(score) || 0), 0);
  });

  useEffect(() => {
    localStorage.setItem(`completedModules_${skill}`, JSON.stringify(completedModules));
    localStorage.setItem(`moduleScores_${skill}`, JSON.stringify(moduleScores));
    // Update totalXP whenever moduleScores changes
    setTotalXP(Object.values(moduleScores).reduce((sum, score) => sum + (Number(score) || 0), 0));
  }, [completedModules, moduleScores, skill]);

  const toggleModule = (index) => {
    setExpandedModule(expandedModule === index ? null : index);
  };
  const handleQuizComplete = (moduleIndex, score) => {
    // Calculate XP based on score (each correct answer = 20 XP)
    const xp = score * 20;

    // Update module scores
    const updatedScores = { ...moduleScores, [moduleIndex]: xp };
    setModuleScores(updatedScores);

    const passingScore = 8; // 80% of 10 questions
    if (score >= passingScore) {
      setCompletedModules({ ...completedModules, [moduleIndex]: true });
    }

    // Close quiz
    setQuizModule(null);
  };

  const startQuiz = (moduleIndex) => {
    setQuizModule(moduleIndex);
  };
  const toggleCompleted = (moduleIndex) => {
    const isCompleted = completedModules[moduleIndex];

    if (isCompleted) {
      // Only allow unchecking if they want to retake quiz
      const updatedScores = { ...moduleScores };
      delete updatedScores[moduleIndex];
      setModuleScores(updatedScores);

      const updatedCompleted = { ...completedModules };
      delete updatedCompleted[moduleIndex];
      setCompletedModules(updatedCompleted);
    }
    // Remove the else block - no manual completion allowed
  };

  const getProgress = () => {
    if (!data || !data.modules || data.modules.length === 0) {
      return { percent: 0, completed: 0, total: 0 };
    }
    const completedCount = Object.values(completedModules).filter(Boolean).length;
    return {
      percent: data.modules.length > 0 ? (completedCount / data.modules.length) * 100 : 0,
      completed: completedCount,
      total: data.modules.length,
    };
  };

  const progress = getProgress();

  const formatResourceLink = (resource) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const match = resource.match(urlRegex);

    if (match && match.length > 0) {
      const url = match[0];
      const text = resource.replace(url, '').trim();
      return (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-cyan-400 hover:text-cyan-300 hover:underline flex items-center group"
        >
          {text || url}
          <ExternalLink className="h-3.5 w-3.5 ml-1.5 text-cyan-500/80 group-hover:text-cyan-400 transition-colors" />
        </a>
      );
    }
    return <span className="text-gray-300">{resource}</span>;
  };


  if (!data || !data.modules) {
    return (
      <div className={panelClasses}>
        <p className="text-gray-400 text-center">Learning path data is not available for "{skill}".</p>
      </div>
    );
  }


  if (quizModule !== null && data.modules[quizModule]) {
    return (
      <div className={panelClasses}>
        <button
          onClick={() => setQuizModule(null)}
          className="inline-flex items-center px-3 py-1.5 mb-6 text-cyan-400 border border-cyan-400/30 rounded-lg hover:bg-cyan-400/10 transition-colors duration-200 text-sm"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Learning Path
        </button>

        <Quiz
          moduleName={data.modules[quizModule].title}
          onComplete={(score) => handleQuizComplete(quizModule, score)}
        />
      </div>
    );
  } else if (quizModule !== null && !data.modules[quizModule]) {
    setQuizModule(null);
    return (
      <div className={panelClasses}>
        <p className="text-red-400">Error: Quiz data not found. Returning to learning path.</p>
      </div>
    );
  }

  return (
    <div className={panelClasses}>
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-4">
          <h2 className="text-3xl font-semibold text-white">
            {skill}
          </h2>
          <div className="flex items-center">
            <div className="bg-cyan-500/10 text-cyan-400 px-4 py-1.5 rounded-lg text-sm font-medium">
              {totalXP} XP earned
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex justify-between mb-2 text-sm">
            <span className="text-gray-400">Your progress</span>
            <span className="text-white font-medium">{progress.completed}/{progress.total} modules</span>
          </div>
          <div className="h-2.5 bg-gray-700/50 rounded-full overflow-hidden">
            <div
              className="h-full bg-cyan-500 rounded-full transition-all duration-500"
              style={{ width: `${progress.percent}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {data.modules.map((module, index) => (
          <div
            key={index}
            className={`border rounded-xl overflow-hidden transition-all duration-300 shadow-md hover:shadow-lg ${completedModules[index] ? "border-green-500/40 bg-green-500/5" : "border-gray-700/50 bg-gray-800/10"
              }`}
          >
            <div
              className={`p-4 flex items-center justify-between cursor-pointer ${completedModules[index] ? "hover:bg-green-500/10" : "hover:bg-gray-700/40"
                } transition-colors`}
              onClick={() => toggleModule(index)}
            >
              <div className="flex items-center flex-1 min-w-0">
                <div
                  className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center mr-3 text-sm font-semibold ${completedModules[index]
                    ? "bg-green-500/20 text-green-300"
                    : "bg-gray-700/50 text-gray-300"
                    }`}
                >
                  {completedModules[index] ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    index + 1
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-medium text-white truncate">{module.title}</h3>
                  {module.duration && (
                    <p className="text-gray-400 text-sm flex items-center">
                      <Clock className="h-4 w-4 mr-1.5 flex-shrink-0" />
                      {module.duration}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                {moduleScores[index] !== undefined && Number(moduleScores[index]) > 0 && (
                  <span className="bg-cyan-500/10 text-cyan-400 px-2.5 py-1 rounded-md text-xs font-medium">
                    {moduleScores[index]} XP
                  </span>
                )}

                {completedModules[index] && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleCompleted(index);
                    }}
                    className="p-2 rounded-md transition-colors text-green-400 hover:bg-green-500/20"
                    title="Reset progress (will require retaking quiz)"
                  >
                    <CheckCircle2 className="h-5 w-5" />
                  </button>
                )}
                {!completedModules[index] && (
                  <div className="p-2 rounded-md text-gray-600" title="Complete quiz with 80%+ score to unlock">
                    <CheckCircle2 className="h-5 w-5 opacity-30" />
                  </div>
                )}

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleModule(index);
                  }}
                  className="p-2 rounded-md text-gray-400 hover:bg-gray-700/60 hover:text-gray-300 transition-colors"
                  title={expandedModule === index ? "Collapse" : "Expand"}
                >
                  <ChevronDown
                    className={`h-5 w-5 transition-transform duration-300 ${expandedModule === index ? "transform rotate-180" : ""
                      }`}
                  />
                </button>
              </div>
            </div>

            {expandedModule === index && (
              <div className="p-5 border-t border-gray-700/50 bg-gray-800/20">
                {module.description && (
                  <div className="mb-6">
                    <div className="text-sm font-medium text-cyan-400 mb-2">Description</div>
                    <p className="text-gray-300 text-sm leading-relaxed">{module.description}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-6">
                  {module.objectives && module.objectives.length > 0 && (
                    <div>
                      <div className="text-sm font-medium text-cyan-400 mb-2">
                        Learning Objectives
                      </div>
                      <ul className="list-disc pl-5 space-y-1.5 text-sm">
                        {module.objectives.map((objective, i) => (
                          <li key={i} className="text-gray-300">
                            {objective}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {module.keyPoints && module.keyPoints.length > 0 && (
                    <div>
                      <div className="text-sm font-medium text-cyan-400 mb-2">
                        Key Points
                      </div>
                      <ul className="list-disc pl-5 space-y-1.5 text-sm">
                        {module.keyPoints.map((point, i) => (
                          <li key={i} className="text-gray-300">
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {module.practicalTask && (
                  <div className="mb-6 bg-yellow-500/10 p-4 rounded-lg border border-yellow-500/30">
                    <div className="text-sm font-medium text-yellow-300 mb-2 flex items-center">
                      <ClipboardList className="h-4 w-4 mr-2 flex-shrink-0" />
                      Practical Task
                    </div>
                    <p className="text-yellow-200/90 text-sm leading-relaxed">{module.practicalTask}</p>
                  </div>
                )}

                {module.resources && module.resources.length > 0 && (
                  <div className="mb-6">
                    <div className="text-sm font-medium text-cyan-400 mb-2">
                      Recommended Resources
                    </div>
                    <ul className="list-disc pl-5 space-y-2 text-sm">
                      {module.resources.map((resource, i) => (
                        <li key={i} className="text-gray-300">
                          {formatResourceLink(resource)}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {module.tips && module.tips.length > 0 && (
                  <div className="mb-6 bg-sky-500/10 p-4 rounded-lg border border-sky-500/30">
                    <div className="text-sm font-medium text-sky-300 mb-2 flex items-center">
                      <Lightbulb className="h-4 w-4 mr-2 flex-shrink-0" />
                      Pro Tips
                    </div>
                    <ul className="space-y-1.5 text-sm">
                      {module.tips.map((tip, i) => (
                        <li key={i} className="text-sky-200/90 flex items-start">
                          <span className="inline-block h-1.5 w-1.5 rounded-full bg-sky-400 mt-[6px] mr-2.5 flex-shrink-0"></span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* BUTTONS SECTION - MODIFIED AS PER REQUEST */}
                {/* BUTTONS SECTION - Quiz Required for Completion */}
                <div className="flex flex-col sm:flex-row gap-3 justify-end items-center pt-2 mt-4 border-t border-gray-700/50">
                  {completedModules[index] ? (
                    <div className="flex items-center text-green-400 mr-auto text-sm font-medium">
                      <CheckCircle2 className="h-5 w-5 mr-1.5" />
                      Module completed
                      {moduleScores[index] !== undefined && Number(moduleScores[index]) > 0 &&
                        ` (+${moduleScores[index]} XP)`}
                    </div>
                  ) : (
                    <div className="flex items-center text-amber-400 mr-auto text-sm font-medium">
                      <FileText className="h-4 w-4 mr-1.5" />
                      Complete quiz with 80%+ to unlock this module
                    </div>
                  )}

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      startQuiz(index);
                    }}
                    className={takeQuizButtonClasses}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    {completedModules[index] ? "Retake Quiz" : "Take Quiz"}
                  </button>

                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}