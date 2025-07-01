import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import './App.css';
import LandingPage from './pages/LandingPage';
import Upskilling from './pages/Upskilling';
import Pricing from './components/LandingPage/Pricing';
import Pricing_1_1 from './pages/Counselling';
import SanskritiChat from './pages/SanskritiChat';
import SchoolAssessment from './components/SchoolAssessment';
import CollegeAssessment from './components/CollegeAssessment';
import GenerateReport from './components/GenerateReport';
import CareerReport from './pages/CareerReport';
import CareerSelection from './pages/CareerSelection';
import FutureMeStepper from './pages/FutureMeStepper';
import FutureMeCard from './pages/FutureMeCard';
import ProfilePage from './pages/ProfilePage';
import SanskritiWelcome from './pages/SanskritiWelcome';
import UpskillingWelcome from './pages/UpskillingWelcome';
import SetupPage from './pages/SetupPage';
import SyllabusPage from './pages/SyllabusPage';
import AdaptiveTestPage from './pages/AdaptiveTestPage';
import ChapterReviewPage from './pages/ChapterReviewPage';
import AnalyticsPage from './pages/AnalyticsPage';
import Home from './pages/CollegeHome'
import CollegeExplore from './pages/CollegeExplore'
import Compare from './pages/Compare'
import { hasAnyCompletedSetup, migrateOldData } from './services/storageService';
import { useEffect, useState } from 'react';
import CollegeSearchWelcome from './pages/CollegeSearchWelcome';
import ExamAIWelcome from "./pages/ExamAIWelcome"

// V2 Components - NEW
import PersonalityTest from './components/PersonalityTest';
import AptitudeTest from './components/AptitudeTest';
import IntelligenceTest from './components/IntelligenceTest';
import IndependentTestReport from './components/IndependentTestReport';

// V2 Pages - NEW
import SavedPersonalityTest from './pages/SavedPersonalityTest';
import SavedAptitudeTest from './pages/SavedAptitudeTest';
import SavedIntelligenceTest from './pages/SavedIntelligenceTest';
const CareerPaths = () => <div className="p-8"><h1 className="text-2xl font-bold">Career Paths Page</h1><p>This page is under construction.</p></div>;
const Assessments = () => <div className="p-8"><h1 className="text-2xl font-bold">Assessments Page</h1><p>This page is under construction.</p></div>;
const Resources = () => <div className="p-8"><h1 className="text-2xl font-bold">Resources Page</h1><p>This page is under construction.</p></div>;
const Mentors = () => <div className="p-8"><h1 className="text-2xl font-bold">Explore Mentors Page</h1><p>This page is under construction.</p></div>;

function App() {
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check setup completion on mount and when storage changes
  useEffect(() => {
    const checkSetup = () => {
      // Migrate old single-subject data to new multi-subject structure
      const migrationSuccess = migrateOldData();
      if (migrationSuccess) {
        console.log('Successfully migrated old data to multi-subject structure');
      }

      // Check if user has any completed setups (multi-subject aware)
      const setupComplete = hasAnyCompletedSetup();
      setIsSetupComplete(setupComplete);
      setLoading(false);
    };

    checkSetup();

    // Listen for storage changes (when setup is completed or subjects are added)
    const handleStorageChange = (e) => {
      // Only check for changes related to our app
      if (e.key && (
        e.key.startsWith('examAI_') ||
        e.key === 'examAI_syllabusPlans' ||
        e.key === 'examAI_currentPlan'
      )) {
        checkSetup();
      }
    };

    // Add storage event listener
    window.addEventListener('storage', handleStorageChange);

    // Check periodically for storage updates (since we're using localStorage extensively)
    const interval = setInterval(checkSetup, 2000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
          <p className="text-white">Loading Guidopia...</p>
          <p className="text-gray-400 text-sm mt-1">Initializing your study environment</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/counselling" element={<Pricing_1_1 />} />
        <Route path="/college-search-welcome" element={
          <Layout>
            <CollegeSearchWelcome />
          </Layout>
        } />
        <Route path="/exam-ai-welcome" element={
          <Layout>
            <ExamAIWelcome />
          </Layout>
        } />
        <Route path="/college-search" element={
          <Layout>
            <Home />
          </Layout>
        } />
        <Route path="/explore" element={
          <Layout>
            <CollegeExplore />
          </Layout>
        } />
        <Route path="/compare" element={
          <Layout>
            <Compare />
          </Layout>
        } />
        {/* ✅ WELCOME PAGES - NO ProtectedRoute (they handle their own access control) */}
        <Route path="/career-selection" element={
          <Layout>
            <CareerSelection />
          </Layout>
        } />
        <Route path="/upskilling-welcome" element={
          <Layout>
            <UpskillingWelcome />
          </Layout>
        } />
        <Route path="/sanskriti" element={
          <Layout>
            <SanskritiWelcome />
          </Layout>
        } />

        {/* --- Integrated ExamAI routes under Layout --- */}
        <Route path="/setup" element={
          <Layout>
            <SetupPage />
          </Layout>
        } />
        <Route path="/syllabus" element={
          <Layout>
            {isSetupComplete ? <SyllabusPage /> : <Navigate to="/setup" replace />}
          </Layout>
        } />
        <Route path="/test/:chapterName" element={
          <Layout>
            {isSetupComplete ? <AdaptiveTestPage /> : <Navigate to="/setup" replace />}
          </Layout>
        } />
        <Route path="/revision/:chapterName" element={
          <Layout>
            {isSetupComplete ? <ChapterReviewPage /> : <Navigate to="/setup" replace />}
          </Layout>
        } />
        <Route path="/analytics" element={
          <Layout>
            {isSetupComplete ? <AnalyticsPage /> : <Navigate to="/setup" replace />}
          </Layout>
        } />
        {/* Root route for ExamAI - Smart redirection */}
        <Route path="/exam-ai" element={
          <Navigate to={isSetupComplete ? "/syllabus" : "/exam-ai-welcome"} replace />
        } />


        <Route path="/school-assessment" element={
          <ProtectedRoute>

            <SchoolAssessment />

          </ProtectedRoute>
        } />
        <Route path="/college-assessment" element={
          <ProtectedRoute>

            <CollegeAssessment />

          </ProtectedRoute>
        } />
        <Route path="/personality-test" element={<PersonalityTest />} />
        <Route path="/aptitude-test" element={<AptitudeTest />} />
        <Route path="/intelligence-test" element={<IntelligenceTest />} />
        <Route path="/independent-test-report" element={<IndependentTestReport />} />

        {/* V2 Saved Test Pages - NEW */}
        <Route path="/saved-personality-test" element={<SavedPersonalityTest />} />
        <Route path="/saved-aptitude-test" element={<SavedAptitudeTest />} />
        <Route path="/saved-intelligence-test" element={<SavedIntelligenceTest />} />

        {/* ✅ PROTECTED ROUTES - Keep ProtectedRoute for actual features */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Layout>

              <Dashboard />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/upskilling" element={
          <ProtectedRoute>
            <Layout>
              <Upskilling />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/sanskriti-chat" element={
          <ProtectedRoute>
            <Layout>
              <SanskritiChat />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/assessments" element={
          <ProtectedRoute>
            <Layout>
              <Assessments />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/resources" element={
          <ProtectedRoute>
            <Layout>
              <Resources />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/mentors" element={
          <ProtectedRoute>
            <Layout>
              <Mentors />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/school-assessment" element={
          <ProtectedRoute>

            <SchoolAssessment />

          </ProtectedRoute>
        } />
        <Route path="/college-assessment" element={
          <ProtectedRoute>

            <CollegeAssessment />

          </ProtectedRoute>
        } />
        <Route path="/generate-report" element={
          <ProtectedRoute>
         
              <GenerateReport />
          
          </ProtectedRoute>
        } />
        <Route path="/career-report" element={
          <ProtectedRoute>
          
              <CareerReport />
           
          </ProtectedRoute>
        } />
        <Route path="/future-me" element={
          <ProtectedRoute>
            <Layout>
              <FutureMeStepper />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/future-me-card" element={
          <ProtectedRoute>
            <Layout>
              <FutureMeCard />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;