import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { sendMessage } from "../services/chatbot";
import {
  ArrowUp,
  User,
  GraduationCap,
  ArrowLeft,
  Brain,
  Target,
  BookOpen,
  TrendingUp,
} from "lucide-react";

const SanskritiChat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const messagesEndRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const hasInitialized = useRef(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    // Handle initial message from welcome page - only once
    if (location.state?.initialMessage && !hasInitialized.current) {
      hasInitialized.current = true;
      handleSubmit(location.state.initialMessage);
      // Clear the state to prevent re-sending on refresh
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const formatMessageContent = (content) => {
    const lines = content.split('\n');
    const formattedElements = [];
    let currentParagraph = [];

    lines.forEach((line) => {
      const trimmedLine = line.trim();

      if (!trimmedLine) {
        if (currentParagraph.length > 0) {
          formattedElements.push(
            <div key={formattedElements.length} className="mb-3 leading-relaxed">
              {currentParagraph.join(' ')}
            </div>
          );
          currentParagraph = [];
        }
        return;
      }

      if (trimmedLine.endsWith(':') && trimmedLine.length < 80) {
        if (currentParagraph.length > 0) {
          formattedElements.push(
            <div key={formattedElements.length} className="mb-3 leading-relaxed">
              {currentParagraph.join(' ')}
            </div>
          );
          currentParagraph = [];
        }
        formattedElements.push(
          <div key={formattedElements.length} className="font-semibold text-blue-300 mb-2 mt-4">
            {trimmedLine}
          </div>
        );
        return;
      }

      if (/^\d+\.\s/.test(trimmedLine)) {
        if (currentParagraph.length > 0) {
          formattedElements.push(
            <div key={formattedElements.length} className="mb-3 leading-relaxed">
              {currentParagraph.join(' ')}
            </div>
          );
          currentParagraph = [];
        }
        formattedElements.push(
          <div key={formattedElements.length} className="mb-2 pl-4">
            {trimmedLine}
          </div>
        );
        return;
      }

      if (trimmedLine.startsWith('- ')) {
        if (currentParagraph.length > 0) {
          formattedElements.push(
            <div key={formattedElements.length} className="mb-3 leading-relaxed">
              {currentParagraph.join(' ')}
            </div>
          );
          currentParagraph = [];
        }
        formattedElements.push(
          <div key={formattedElements.length} className="mb-2 pl-4">
            • {trimmedLine.substring(2)}
          </div>
        );
        return;
      }
      currentParagraph.push(trimmedLine);
    });

    if (currentParagraph.length > 0) {
      formattedElements.push(
        <div key={formattedElements.length} className="mb-3 leading-relaxed">
          {currentParagraph.join(' ')}
        </div>
      );
    }
    return formattedElements;
  };

  const handleSubmit = async (messageText = null, e = null) => {
    if (e) e.preventDefault();

    const textToSend = messageText || input;
    if (!textToSend.trim()) return;

    const userMessage = { role: "user", content: textToSend };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Convert messages to format expected by the sendMessage function
      const historyForAPI = messages.map(msg => ({
        role: msg.role,
        content: msg.content,
      }));

      const response = await sendMessage(textToSend, historyForAPI);
      const botMessage = { role: "assistant", content: response };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I'm sorry, I encountered an error processing your request. Please try again or check your connection.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const goBackToWelcome = () => {
    navigate('/dashboard');
  };

  return (
    <div className="h-screen bg-black mt-10 text-white flex flex-col relative">
      {/* Mobile Fixed Header - Only show on mobile */}
      <header className="md:hidden fixed top-20 left-0 right-0 z-50 bg-black/95 backdrop-blur-sm border-b border-white/10">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={goBackToWelcome}
                className="group flex items-center text-white/60 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" />
                <span className="text-sm font-medium">Back</span>
              </button>
              <div className="w-px h-6 bg-white/20"></div>
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <GraduationCap className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h1 className="text-base font-semibold">Sanskriti AI</h1>
                  <p className="text-xs text-white/50">Online & Ready</p>
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-sm text-white/60">
                {currentTime.toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric'
                })}
              </div>
              <div className="text-xs text-white/40">
                {currentTime.toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Desktop Header - Only show on desktop, not fixed */}
      <header className="hidden md:block bg-black border-b border-white/10">
        <div className="px-6 py-5">
          <div className="flex items-center justify-between max-w-5xl mx-auto">
            <div className="flex items-center space-x-4">
              <button
                onClick={goBackToWelcome}
                className="group flex items-center text-white/60 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" />
                <span className="text-sm font-medium">Back to Dashboard</span>
              </button>
              <div className="w-px h-6 bg-white/20"></div>
              <div className="flex items-center space-x-4">
                <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20">
                  <GraduationCap className="w-7 h-7 text-blue-400" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">Sanskriti AI</h1>
                  <p className="text-sm text-white/50">Your Career Guidance Assistant</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-8">
              <div className="text-center">
                <div className="text-lg font-bold text-white">{messages.length}</div>
                <div className="text-xs text-white/50 uppercase tracking-wider">Messages</div>
              </div>
              <div className="w-px h-8 bg-white/20"></div>
              <div className="text-center">
                <div className="text-lg font-bold text-blue-400">Live</div>
                <div className="text-xs text-white/50 uppercase tracking-wider">Session</div>
              </div>
              <div className="w-px h-8 bg-white/20"></div>
              <div className="text-right">
                <div className="text-sm text-white/60">
                  {currentTime.toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric'
                  })}
                </div>
                <div className="text-xs text-white/40">
                  {currentTime.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto pt-20 md:pt-0 pb-32 md:pb-28">
        <div className="px-4 md:px-6 py-6 max-w-5xl mx-auto">
          {messages.length === 0 && !isLoading && (
            <div className="text-center py-8 md:py-16">
              <div className="bg-gradient-to-br from-slate-900/90 to-black/90 rounded-2xl p-6 md:p-10 backdrop-blur-sm border border-blue-400/20 max-w-2xl md:max-w-4xl mx-auto">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-lg shadow-blue-400/40">
                  <Brain className="w-6 h-6 md:w-8 md:h-8 text-white" />
                </div>
                <h3 className="text-xl md:text-3xl font-bold mb-3 md:mb-4">Ready to Guide Your Future</h3>
                <p className="text-sm md:text-base text-white/70 leading-relaxed mb-6 md:mb-8 max-w-md md:max-w-2xl mx-auto">
                  I'm here to help guide your career journey. Ask me anything about education, career paths, skill development, or your future goals.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mb-6 md:mb-8 max-w-3xl mx-auto">
                  <div className="text-center p-4 md:p-6 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                    <Target className="w-6 h-6 md:w-8 md:h-8 text-blue-400 mx-auto mb-3" />
                    <h4 className="text-white font-semibold text-sm md:text-base mb-2">Career Planning</h4>
                    <p className="text-white/60 text-xs md:text-sm">Strategic guidance for your future</p>
                  </div>
                  <div className="text-center p-4 md:p-6 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                    <BookOpen className="w-6 h-6 md:w-8 md:h-8 text-cyan-400 mx-auto mb-3" />
                    <h4 className="text-white font-semibold text-sm md:text-base mb-2">Education Advice</h4>
                    <p className="text-white/60 text-xs md:text-sm">Course and college selection</p>
                  </div>
                  <div className="text-center p-4 md:p-6 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                    <TrendingUp className="w-6 h-6 md:w-8 md:h-8 text-emerald-400 mx-auto mb-3" />
                    <h4 className="text-white font-semibold text-sm md:text-base mb-2">Future Trends</h4>
                    <p className="text-white/60 text-xs md:text-sm">Industry insights and forecasts</p>
                  </div>
                </div>

                <div className="flex flex-wrap justify-center gap-2 md:gap-3">
                  <button
                    onClick={() => handleSubmit("I'm confused about choosing between engineering and medical. Can you help?")}
                    className="px-4 py-2 md:px-6 md:py-3 text-xs md:text-sm bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 rounded-full text-blue-200 hover:text-blue-100 transition-all hover:scale-105"
                  >
                    Engineering vs Medical
                  </button>
                  <button
                    onClick={() => handleSubmit("What career options do I have after 12th commerce?")}
                    className="px-4 py-2 md:px-6 md:py-3 text-xs md:text-sm bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/30 rounded-full text-cyan-200 hover:text-cyan-100 transition-all hover:scale-105"
                  >
                    After 12th Commerce
                  </button>
                  <button
                    onClick={() => handleSubmit("I want to study abroad. What should I prepare for?")}
                    className="px-4 py-2 md:px-6 md:py-3 text-xs md:text-sm bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/30 rounded-full text-emerald-200 hover:text-emerald-100 transition-all hover:scale-105"
                  >
                    Study Abroad
                  </button>
                </div>
              </div>
            </div>
          )}

          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex mb-4 md:mb-6 ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-sm md:max-w-3xl rounded-xl md:rounded-2xl p-4 md:p-6 ${message.role === "user"
                  ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white border border-blue-400/30 shadow-lg shadow-blue-500/20"
                  : "bg-gradient-to-br from-slate-900/90 to-black/90 text-white border border-white/10 backdrop-blur-sm shadow-lg"
                  }`}
              >
                <div className="flex items-start gap-3 md:gap-4">
                  {message.role === "user" ? (
                    <div className="w-6 h-6 md:w-8 md:h-8 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 border border-white/20">
                      <User className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 shadow-lg shadow-blue-400/40">
                      <Brain className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" />
                    </div>
                  )}
                  <div className="flex-1">
                    {message.role === "assistant" ? (
                      <div className="text-white/90 text-sm md:text-base leading-relaxed">
                        {formatMessageContent(message.content)}
                      </div>
                    ) : (
                      <p className="whitespace-pre-wrap leading-relaxed text-white/95 text-sm md:text-base">{message.content}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start mb-4 md:mb-6">
              <div className="bg-gradient-to-br from-slate-900/90 to-black/90 rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/10 backdrop-blur-sm shadow-lg">
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg shadow-blue-400/40">
                    <Brain className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" />
                  </div>
                  <div className="flex space-x-1 md:space-x-2">
                    <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-blue-400 animate-bounce"></div>
                    <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-blue-300 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Fixed Input - Responsive */}
      <div className="fixed bottom-0 left-0 right-0 md:left-64 lg:left-72 z-50 bg-black/95 backdrop-blur-sm border-t border-white/10">
        <div className="px-3 md:px-4 lg:px-6 py-2.5 md:py-2 max-w-none md:max-w-4xl lg:max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-slate-900/90 to-black/90 rounded-xl md:rounded-2xl border border-white/10 backdrop-blur-sm overflow-hidden">
            <div className="flex items-center p-2 md:p-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSubmit(null, e)}
                className="flex-1 bg-transparent text-white px-3 py-2 md:px-3 md:py-1 focus:outline-none placeholder-white/40 text-lg md:text-base lg:text-lg"
                placeholder="Ask about your education or career..."
                disabled={isLoading}
              />
              <button
                onClick={(e) => handleSubmit(null, e)}
                disabled={!input.trim() || isLoading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:opacity-50 text-white rounded-lg md:rounded-xl p-2.5 md:p-2 lg:p-2.5 transition-all hover:scale-105 hover:shadow-lg hover:shadow-blue-600/30 disabled:hover:scale-100 mr-2 md:mr-1"
              >
                <ArrowUp className="w-6 h-6 md:w-5 md:h-5 lg:w-6 lg:h-6" />
              </button>
            </div>
          </div>
          <div className="text-center mt-2 md:mt-1.5 text-sm md:text-sm text-white/40">
            Press Enter to send • Sanskriti AI is here to help with your career decisions
          </div>
        </div>
      </div>
    </div>
  );
};

export default SanskritiChat;