import { useState } from "react";
import { generateQuiz, evaluateQuiz } from "../api"; // Assuming api.js is in ../api

// Using a base style for the quiz card, similar to dashboard cards/panels
const quizCardBaseClasses = "bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 p-6 md:p-8 rounded-xl text-white";

export default function Quiz({ moduleName, onComplete }) {
  const [quiz, setQuiz] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const startQuiz = async () => {
    setIsLoading(true);
    setResult(null); // Clear previous results
    setUserAnswers({}); // Clear previous answers
    try {
      const quizData = await generateQuiz(moduleName);
      setQuiz(quizData);
    } catch (error) {
      console.error("Error starting quiz:", error);
      // Optionally, set an error state to display to the user
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerChange = (questionIndex, answer) => {
    setUserAnswers({
      ...userAnswers,
      [questionIndex]: answer,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!quiz || !quiz.questions || Object.keys(userAnswers).length !== quiz.questions.length) {
      alert("Please answer all questions before submitting.");
      return;
    }
    
    setIsSubmitting(true);
    try {
      const evaluation = await evaluateQuiz(
        moduleName,
        quiz.questions,
        userAnswers
      );
      setResult(evaluation);
      
      // Score parsing logic remains, ensure `evaluateQuiz` format is consistent
      const scoreMatch = typeof evaluation === 'string' ? evaluation.match(/Score: (\d+)\/\d+/) : null; 
      // Made regex slightly more generic for total questions, assuming 5 is not hardcoded in API response for total.
      // If total is always 5, /Score: (\d+)\/5/ is fine.
      const score = scoreMatch ? parseInt(scoreMatch[1]) : 0;
      
      if (onComplete && typeof onComplete === "function") {
        onComplete(score);
      }
    } catch (error) {
      console.error("Error submitting quiz:", error);
      // Optionally, set an error state to display to the user
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetQuiz = () => {
    setQuiz(null);
    setUserAnswers({});
    setResult(null);
    // Note: This doesn't call onComplete with a 'close' or 'cancel' signal.
    // If LearningPath needs to know the quiz was closed without completion,
    // onComplete might need an argument or a different callback.
    // For now, it just resets the quiz state.
  };

  if (isLoading) {
    return (
      <div className={`${quizCardBaseClasses} text-center`}>
        <div className="flex flex-col items-center justify-center py-8">
          <div className="w-12 h-12 border-t-4 border-b-4 border-cyan-500 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-400">Generating quiz questions...</p>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className={`${quizCardBaseClasses} text-center`}>
        <h3 className="text-xl font-semibold text-white mb-4">Module Quiz</h3>
        <p className="text-gray-400 mb-6">
          Test your knowledge of <span className="font-medium text-gray-300">{moduleName}</span> with a short quiz.
        </p>
        <button
          onClick={startQuiz}
          className="bg-gradient-to-r from-cyan-500 to-cyan-400 text-black font-semibold py-2.5 px-6 rounded-lg hover:from-cyan-400 hover:to-cyan-300 transition-all duration-200"
        >
          Start Quiz
        </button>
      </div>
    );
  }

  if (result) {
    const scoreMatch = typeof result === 'string' ? result.match(/Score: (\d+)\/(\d+)/) : null;
    const score = scoreMatch ? parseInt(scoreMatch[1]) : 0;
    const totalQuestions = scoreMatch ? parseInt(scoreMatch[2]) : (quiz?.questions?.length || 5); // Fallback for total

    let scoreColorClass = "text-red-400";
    let borderColorClass = "border-red-500/50";
    if (totalQuestions > 0) {
        const percentage = (score / totalQuestions) * 100;
        if (percentage >= 80) {
            scoreColorClass = "text-green-400";
            borderColorClass = "border-green-500/50";
        } else if (percentage >= 50) {
            scoreColorClass = "text-yellow-400";
            borderColorClass = "border-yellow-500/50";
        }
    }
    
    return (
      <div className={quizCardBaseClasses}>
        <h3 className="text-xl font-semibold text-white mb-6 text-center">Quiz Results</h3>
        
        <div className="flex items-center justify-center mb-8">
          <div className={`w-28 h-28 bg-gray-700/50 rounded-full flex items-center justify-center border-2 ${borderColorClass}`}>
            <span className={`text-4xl font-bold ${scoreColorClass}`}>{score}</span>
            <span className={`text-xl ${scoreColorClass}/70`}>/{totalQuestions}</span>
          </div>
        </div>
        
        <div className={`p-4 mb-6 border rounded-lg ${borderColorClass} bg-gray-700/30`}>
          <pre className="whitespace-pre-wrap text-gray-300 text-sm leading-relaxed">{result}</pre>
        </div>
        
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
          <button
            onClick={resetQuiz} // This effectively closes if onComplete isn't used for navigation
            className="w-full sm:w-auto flex-1 bg-gray-700 hover:bg-gray-600/70 text-gray-300 font-medium py-2.5 px-6 rounded-lg transition-colors duration-200"
          >
            Close
          </button>
          <button
            onClick={startQuiz} // Retriggers fetch for new questions
            className="w-full sm:w-auto flex-1 bg-gradient-to-r from-cyan-500 to-cyan-400 text-black font-semibold py-2.5 px-6 rounded-lg hover:from-cyan-400 hover:to-cyan-300 transition-all duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={quizCardBaseClasses}>
      <h3 className="text-xl font-semibold text-white mb-6">
        Quiz: <span className="font-bold text-gray-300">{moduleName}</span>
      </h3>

      <form onSubmit={handleSubmit}>
        {quiz.questions.map((question, qIndex) => (
          <div key={qIndex} className="mb-6 border-b border-gray-700/50 pb-6 last:border-b-0 last:pb-0 last:mb-0">
            <p className="font-medium text-gray-200 mb-4">
              {qIndex + 1}. {question.question}
            </p>
            <div className="space-y-3 ml-1"> {/* Adjusted margin */}
              {question.options && typeof question.options === 'object' ? 
                Object.entries(question.options).map(([optionKey, optionText]) => (
                <label
                  key={optionKey}
                  className={`flex items-start p-3.5 rounded-lg cursor-pointer group transition-all duration-150 border ${
                    userAnswers[qIndex] === optionKey 
                      ? "bg-gray-700/40 border-cyan-500/60 ring-1 ring-cyan-500/50" 
                      : "border-gray-700/60 hover:bg-gray-700/30 hover:border-gray-600/80"
                  }`}
                >
                  <input
                    type="radio"
                    name={`question-${qIndex}`}
                    value={optionKey}
                    checked={userAnswers[qIndex] === optionKey}
                    onChange={() => handleAnswerChange(qIndex, optionKey)}
                    className="mt-1 mr-3 h-4 w-4 flex-shrink-0 text-cyan-500 focus:ring-cyan-500/70 focus:ring-offset-gray-800 border-gray-600 bg-gray-700 accent-cyan-500"
                  />
                  <span className={`text-sm ${userAnswers[qIndex] === optionKey ? "text-cyan-300" : "text-gray-300 group-hover:text-gray-200"}`}>
                    <span className="font-semibold">{optionKey.toUpperCase()}.</span> {optionText}
                  </span>
                </label>
              )) : <p className="text-sm text-yellow-400">No options available for this question.</p>}
            </div>
          </div>
        ))}

        <div className="flex flex-col sm:flex-row justify-between gap-4 pt-6 mt-4 border-t border-gray-700/50">
          <button
            type="button"
            onClick={resetQuiz}
            className="w-full sm:w-auto bg-gray-700 hover:bg-gray-600/70 text-gray-300 font-medium py-2.5 px-6 rounded-lg transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || (quiz?.questions && Object.keys(userAnswers).length !== quiz.questions.length)}
            className="w-full sm:w-auto bg-gradient-to-r from-cyan-500 to-cyan-400 text-black font-semibold py-2.5 px-6 rounded-lg hover:from-cyan-400 hover:to-cyan-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Submitting..." : "Submit Answers"}
          </button>
        </div>
      </form>
    </div>
  );
}