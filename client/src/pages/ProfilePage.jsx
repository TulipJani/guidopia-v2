import React, { useState, useEffect } from 'react';
import { User, Award, BookOpen, Target, TrendingUp, Calendar, Phone, Mail } from 'lucide-react';
import { generateLearningPath } from '../api';
import LearningPath from '../components/LearningPath';

// Add this at the top of the ProfilePage component, after useState declarations
const SOCIAL_PLATFORMS = [
  { name: 'LinkedIn', icon: <svg className='w-5 h-5 text-blue-500' fill='currentColor' viewBox='0 0 24 24'><path d='M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.29c-.97 0-1.75-.79-1.75-1.75s.78-1.75 1.75-1.75 1.75.79 1.75 1.75-.78 1.75-1.75 1.75zm15.5 10.29h-3v-4.5c0-1.08-.02-2.47-1.5-2.47-1.5 0-1.73 1.17-1.73 2.39v4.58h-3v-9h2.89v1.23h.04c.4-.75 1.38-1.54 2.84-1.54 3.04 0 3.6 2 3.6 4.59v4.72z'/></svg> },
  { name: 'GitHub', icon: <svg className='w-5 h-5 text-gray-300' fill='currentColor' viewBox='0 0 24 24'><path d='M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.53-1.34-1.3-1.7-1.7-1.7-1.06-.72.08-.71.08-.71 1.17.08 1.78 1.2 1.78 1.2 1.04 1.78 2.73 1.27 3.4.97.11-.75.41-1.27.74-1.56-2.56-.29-5.26-1.28-5.26-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .98-.31 3.2 1.18a11.1 11.1 0 012.92-.39c.99.01 1.99.13 2.92.39 2.22-1.49 3.2-1.18 3.2-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.43-2.7 5.41-5.27 5.7.42.36.79 1.09.79 2.2 0 1.59-.01 2.87-.01 3.26 0 .31.21.68.8.56C20.71 21.39 24 17.08 24 12c0-6.27-5.23-11.5-12-11.5z'/></svg> },
  { name: 'Twitter', icon: <svg className='w-5 h-5 text-sky-400' fill='currentColor' viewBox='0 0 24 24'><path d='M24 4.56c-.89.39-1.85.65-2.86.77a4.93 4.93 0 002.16-2.72c-.95.56-2 .97-3.13 1.19a4.92 4.92 0 00-8.39 4.48A13.97 13.97 0 013.15 3.15a4.92 4.92 0 001.52 6.57c-.8-.02-1.56-.25-2.22-.62v.06a4.93 4.93 0 003.95 4.83c-.39.11-.8.17-1.22.17-.3 0-.58-.03-.86-.08a4.93 4.93 0 004.6 3.42A9.87 9.87 0 012 19.54a13.94 13.94 0 007.56 2.22c9.05 0 14-7.5 14-14 0-.21 0-.42-.02-.63A9.93 9.93 0 0024 4.56z'/></svg> },
  { name: 'Facebook', icon: <svg className='w-5 h-5 text-blue-600' fill='currentColor' viewBox='0 0 24 24'><path d='M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.325 24h11.495v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.405 24 24 23.408 24 22.674V1.326C24 .592 23.405 0 22.675 0'/></svg> },
  { name: 'Instagram', icon: <svg className='w-5 h-5 text-pink-400' fill='currentColor' viewBox='0 0 24 24'><path d='M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.974.974 1.246 2.241 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.974.974-2.241 1.246-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.974-.974-1.246-2.241-1.308-3.608C2.175 15.647 2.163 15.267 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608.974-.974 2.241-1.246 3.608-1.308C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.332.013 7.052.072 5.771.131 4.659.425 3.678 1.406c-.98.98-1.274 2.092-1.334 3.374C2.013 8.332 2 8.741 2 12c0 3.259.013 3.668.072 4.948.06 1.282.354 2.394 1.334 3.374.98.98 2.092 1.274 3.374 1.334C8.332 23.987 8.741 24 12 24s3.668-.013 4.948-.072c1.282-.06 2.394-.354 3.374-1.334.98-.98 1.274-2.092 1.334-3.374.059-1.28.072-1.689.072-4.948 0-3.259-.013-3.668-.072-4.948-.06-1.282-.354-2.394-1.334-3.374-.98-.98-2.092-1.274-3.374-1.334C15.668.013 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm0 10.162a3.999 3.999 0 110-7.998 3.999 3.999 0 010 7.998zm6.406-11.845a1.44 1.44 0 11-2.88 0 1.44 1.44 0 012.88 0z'/></svg> },
];

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [editingAbout, setEditingAbout] = useState(false);
  const [aboutDraft, setAboutDraft] = useState('');
  const [editingProfilePic, setEditingProfilePic] = useState(false);
  const [profilePicDraft, setProfilePicDraft] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [editingSocialLinks, setEditingSocialLinks] = useState(false);
  const [socialLinksDraft, setSocialLinksDraft] = useState([]);
  const [editingFutureRole, setEditingFutureRole] = useState(false);
  const [futureRoleDraft, setFutureRoleDraft] = useState('');
  const [editingExperience, setEditingExperience] = useState(false);
  const [experienceDraft, setExperienceDraft] = useState([]);
  const fileInputRef = React.useRef(null);
  const [addPlatform, setAddPlatform] = useState('');
  const [addUrl, setAddUrl] = useState('');

  // Auto-detect platform from URL
  useEffect(() => {
    if (!addUrl) return;
    const url = addUrl.toLowerCase();
    const found = SOCIAL_PLATFORMS.find(p => url.includes(p.name.toLowerCase()));
    if (found && (!addPlatform || addPlatform.toLowerCase() === found.name.toLowerCase())) {
      setAddPlatform(found.name);
    }
  }, [addUrl]);

  const panelClasses = "bg-gray-900/20 backdrop-blur-sm border border-gray-800/30 p-4 sm:p-6 lg:p-8 shadow-lg rounded-lg sm:rounded-2xl relative overflow-hidden";

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      await handleImageFile(file);
    }
  };

  const handleImageFile = async (file) => {
    setUploadError('');
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setUploadError('Please upload an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image size should be less than 5MB');
      return;
    }

    try {
      const reader = new FileReader();
      reader.onload = ev => setProfilePicDraft(ev.target.result);
      reader.readAsDataURL(file);
    } catch (err) {
      setUploadError('Failed to read image file');
    }
  };

  const handleSaveProfilePic = async () => {
    if (!profilePicDraft) return;
    setIsUploading(true);
    setUploadError('');
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ profilePic: profilePicDraft })
      });
      if (!res.ok) throw new Error('Failed to update profile picture');
      setProfile(prev => ({ ...prev, profilePic: profilePicDraft }));
      setEditingProfilePic(false);
      setProfilePicDraft(profilePicDraft);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      setUploadError('Failed to update profile picture. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  // Social Links Management
  const handleAddSocialLink = () => {
    if (socialLinksDraft.length < 5) {
      setSocialLinksDraft([...socialLinksDraft, { platform: '', url: '' }]);
    }
  };

  const handleRemoveSocialLink = (index) => {
    setSocialLinksDraft(socialLinksDraft.filter((_, i) => i !== index));
  };

  const handleUpdateSocialLink = (index, field, value) => {
    const updated = [...socialLinksDraft];
    updated[index] = { ...updated[index], [field]: value };
    setSocialLinksDraft(updated);
  };

  const handleSaveSocialLinks = async () => {
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ socialLinks: socialLinksDraft })
      });
      if (!res.ok) throw new Error('Failed to update social links');
      setProfile(prev => ({ ...prev, socialLinks: socialLinksDraft }));
      setEditingSocialLinks(false);
    } catch (err) {
      alert('Failed to update social links. Please try again.');
    }
  };

  // Future Role Management
  const handleSaveFutureRole = async () => {
    try {
      const res = await fetch('/api/futureme/role', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ futureRole: futureRoleDraft })
      });
      if (!res.ok) throw new Error('Failed to update future role');
      setProfile(prev => ({
        ...prev,
        futureMeCard: { ...prev.futureMeCard, futureRole: futureRoleDraft }
      }));
      setEditingFutureRole(false);
    } catch (err) {
      alert('Failed to update future role. Please try again.');
    }
  };

  // Experience Management
  const handleAddExperience = () => {
    if (experienceDraft.length < 3) {
      setExperienceDraft([...experienceDraft, {
        title: '',
        company: '',
        description: '',
        startDate: '',
        endDate: '',
        current: false
      }]);
    }
  };

  const handleRemoveExperience = (index) => {
    setExperienceDraft(experienceDraft.filter((_, i) => i !== index));
  };

  const handleUpdateExperience = (index, field, value) => {
    const updated = [...experienceDraft];
    updated[index] = { ...updated[index], [field]: value };
    setExperienceDraft(updated);
  };

  const handleSaveExperience = async () => {
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ experience: experienceDraft })
      });
      if (!res.ok) throw new Error('Failed to update experience');
      setProfile(prev => ({ ...prev, experience: experienceDraft }));
      setEditingExperience(false);
    } catch (err) {
      alert('Failed to update experience. Please try again.');
    }
  };

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        // Fetch user profile with populated onboarding and futureMeCard
        const userResponse = await fetch('/api/user/profile', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!userResponse.ok) {
          throw new Error('Failed to fetch user profile');
        }
        
        const userData = await userResponse.json();

        // Combine all data
        const profileData = {
          ...userData
        };

        setProfile(profileData);
        if (profileData.about) setAboutDraft(profileData.about);
        if (profileData.profilePic !== undefined) setProfilePicDraft(profileData.profilePic);
        if (profileData.socialLinks) setSocialLinksDraft([...profileData.socialLinks]);
        if (profileData.experience) setExperienceDraft([...profileData.experience]);
        if (profileData.futureMeCard?.futureRole) setFutureRoleDraft(profileData.futureMeCard.futureRole);

      } catch (err) {
        setError(`Failed to fetch profile data: ${err.message}`);
        console.error('Profile fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  // Helper to detect platform from URL
  const detectPlatform = (url) => {
    if (!url) return null;
    const lower = url.toLowerCase();
    const found = SOCIAL_PLATFORMS.find(p => lower.includes(p.name.toLowerCase()));
    return found ? found.name : null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-600/20 border border-red-600/30 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-red-400 mb-2">Error Loading Profile</h2>
            <p className="text-gray-300">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="bg-yellow-600/20 border border-yellow-600/30 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-yellow-400 mb-2">No Profile Data</h2>
            <p className="text-gray-300">Unable to load profile information.</p>
          </div>
        </div>
      </div>
    );
  }

  // Extract data from the fetched profile
  const onboardingData = profile.onboarding || {};
  const futureMeCardData = profile.futureMeCard || {};
  const purchaseData = profile.purchases || [];

  // Calculate profile completion based on actual schema fields
  const calculateProfileCompletion = (profile) => {
    let completedFields = 0;
    const totalFields = 15; // Adjusted total fields after removing sections

    // User schema fields
    if (profile.name) completedFields++;
    if (profile.email) completedFields++;
    if (profile.about) completedFields++;
    if (profile.age) completedFields++;
    if (profile.gender) completedFields++;
    if (profile.phone) completedFields++;
    
    // User profile activity fields
    if (profile.socialLinks?.length > 0) completedFields++;
    if (profile.personalityType) completedFields++;
    if (profile.onboardingComplete) completedFields++;
    
    // Onboarding fields
    if (onboardingData.phoneNumber) completedFields++;
    if (onboardingData.studentType) completedFields++;
    if (onboardingData.joiningReason) completedFields++;
    if (onboardingData.motivation) completedFields++;
    
    // Student type specific fields
    if (onboardingData.studentType === 'school') {
      if (onboardingData.schoolClass) completedFields++;
      if (onboardingData.strongestAreas?.length > 0) completedFields++;
      if (onboardingData.futureExcitement) completedFields++;
    } else if (onboardingData.studentType === 'college') {
      if (onboardingData.collegeDegree) completedFields++;
      if (onboardingData.strengths?.length > 0) completedFields++;
      if (onboardingData.lifestyle) completedFields++;
    }

    return Math.round((completedFields / totalFields) * 100);
  };

  const profileCompletionPercentage = calculateProfileCompletion(profile);

  // Helper Components
  const ProgressBar = ({ progress, className = "" }) => (
    <div className={`w-full bg-gray-700/50 rounded-full h-2.5 ${className}`}>
      <div
        className="h-2.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );

  const StatCard = ({ icon: Icon, label, value, color = "cyan" }) => (
    <div className="bg-gray-800/40 p-4 rounded-lg border border-gray-700/50">
      <div className="flex items-center mb-2">
        <Icon className={`h-5 w-5 text-${color}-400 mr-2`} />
        <span className="text-gray-400 text-sm">{label}</span>
      </div>
      <p className="text-white text-lg font-semibold">{value}</p>
    </div>
  );

  // Get education details based on schema
  const getEducationDetails = () => {
    if (onboardingData.studentType === 'college') {
      const degree = onboardingData.collegeDegree || 'Degree';
      const year = onboardingData.collegeYear || '';
      return {
        level: 'College',
        details: year ? `${degree} - ${year} Year` : degree,
        specialization: onboardingData.otherDegree || ''
      };
    } else if (onboardingData.studentType === 'school') {
      const schoolClass = onboardingData.schoolClass || '';
      const stream = onboardingData.schoolStream || '';
      return {
        level: 'School',
        details: stream ? `Class ${schoolClass} - ${stream}` : `Class ${schoolClass}`,
        specialization: ''
      };
    }
    return { level: '', details: 'Student', specialization: '' };
  };

  const education = getEducationDetails();

  // Get active subscriptions based on Purchase schema
  const activeSubscriptions = purchaseData.filter(purchase => {
    return purchase.status === 'completed' && new Date(purchase.expiresAt) > new Date();
  });

  // Handle navigation back to dashboard
  const handleBackToDashboard = () => {
    // In a real app, this would use React Router
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-black text-white px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-semibold text-white">Profile</h1>
        <button 
          onClick={handleBackToDashboard}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200 flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
          </svg>
          Dashboard
        </button>
      </div>

      {/* Profile Header */}
      <div className={`${panelClasses} mb-6`}>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="relative">
            {editingProfilePic ? (
              <div className="w-full max-w-md mx-auto">
                {/* Preview Section */}
                <div className="mb-4 relative">
                  <img
                    src={profilePicDraft || profile.profilePic || 'https://via.placeholder.com/120'}
                    alt="Profile Preview"
                    className="w-32 h-32 rounded-full mx-auto border-4 border-gray-700 shadow-lg object-cover"
                  />
                  {profilePicDraft && (
                    <button
                      aria-label="Remove selected image"
                      onClick={() => {
                        setProfilePicDraft('');
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                      className="absolute top-0 right-1/2 translate-x-16 -translate-y-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1"
                      title="Remove image"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>

                {/* Upload Section */}
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center mb-4 transition-colors ${
                    isDragging
                      ? 'border-cyan-500 bg-cyan-500/10'
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                  onDragEnter={handleDragEnter}
                  onDragOver={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <div className="space-y-2">
                    <svg
                      className={`w-10 h-10 mx-auto mb-2 transition-colors ${
                        isDragging ? 'text-cyan-500' : 'text-gray-400'
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <p className="text-gray-300">Drag and drop your image here, or</p>
                    <button
                      aria-label="Browse to choose a file"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-cyan-400 hover:text-cyan-300 font-medium"
                    >
                      Browse to choose a file
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) handleImageFile(file);
                      }}
                    />
                    <p className="text-gray-400 text-sm">
                      Supported formats: JPG, PNG, GIF (max 5MB)
                    </p>
                  </div>
                </div>

                {/* Error Message */}
                {uploadError && (
                  <div className="mb-4 text-red-400 text-sm text-center">
                    {uploadError}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-center space-x-3">
                  <button
                    aria-label="Save profile picture"
                    className={`px-4 py-2 rounded-md font-semibold transition-all duration-200 ${
                      isUploading || !profilePicDraft
                        ? 'bg-cyan-600/50 cursor-not-allowed'
                        : 'bg-cyan-600 hover:bg-cyan-700'
                    } text-white min-w-[80px]`}
                    onClick={handleSaveProfilePic}
                    disabled={isUploading || !profilePicDraft}
                  >
                    {isUploading ? (
                      <div className="flex items-center justify-center">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      </div>
                    ) : (
                      'Save'
                    )}
                  </button>
                  <button
                    aria-label="Cancel profile picture editing"
                    className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md font-medium transition-colors"
                    onClick={() => {
                      setProfilePicDraft(profile.profilePic || '');
                      setEditingProfilePic(false);
                      setUploadError('');
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <img
                  src={profile.profilePic || 'https://via.placeholder.com/120'}
                alt="Profile" 
                  className="w-28 h-28 rounded-full border-4 border-gray-700 shadow-lg object-cover"
                />
                <button
                  className="absolute bottom-2 right-2 bg-cyan-600 hover:bg-cyan-700 text-white text-xs px-2 py-1 rounded-full font-semibold"
                  onClick={() => setEditingProfilePic(true)}
                >
                  Edit
                </button>
              </>
            )}
            <div className="absolute -bottom-2 -right-2 bg-cyan-500 text-black text-xs font-bold px-2 py-1 rounded-full">
              {profileCompletionPercentage}%
            </div>
          </div>
          
          <div className="flex-1">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">{profile.name || 'User'}</h2>
            <p className="text-gray-400 mb-2">{education.details}</p>
            
            <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-4">
              {profile.age && <span className="flex items-center"><User className="h-4 w-4 mr-1" /> {profile.age} years</span>}
              {profile.gender && <span>{profile.gender}</span>}
              {onboardingData.phoneNumber && (
                <span className="flex items-center">
                  <Phone className="h-4 w-4 mr-1" /> 
                  {onboardingData.phoneNumber}
                </span>
              )}
              {profile.email && <span className="flex items-center"><Mail className="h-4 w-4 mr-1" /> {profile.email}</span>}
            </div>

            {futureMeCardData.tagline && (
              <p className="text-cyan-400 italic mb-4">"{futureMeCardData.tagline}"</p>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 mb-6 bg-gray-800/30 p-1 rounded-lg">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'preferences', label: 'Preferences' },
          { id: 'career', label: 'Career' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2 px-4 rounded-md transition-colors duration-200 ${
              activeTab === tab.id
                ? 'bg-cyan-500 text-black font-semibold'
                : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* About Section */}
          <div className={panelClasses}>
            <h3 className="text-xl font-semibold mb-4 text-white">About Me</h3>
            {editingAbout ? (
              <>
                <textarea
                  className="w-full bg-gray-800/40 border border-gray-700 rounded-lg p-3 text-white mb-2"
                  rows={4}
                  value={aboutDraft}
                  onChange={e => setAboutDraft(e.target.value)}
                  placeholder="Write something about yourself..."
                />
                <div className="flex gap-2">
                  <button
                    className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-md font-semibold"
                    onClick={async () => {
                      try {
                        const res = await fetch('/api/user/profile', {
                          method: 'PUT',
                          headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`,
                            'Content-Type': 'application/json'
                          },
                          body: JSON.stringify({ about: aboutDraft })
                        });
                        if (!res.ok) throw new Error('Failed to update About Me');
                        const data = await res.json();
                        setProfile(prev => ({ ...prev, about: aboutDraft }));
                        setEditingAbout(false);
                      } catch (err) {
                        alert('Failed to update About Me.');
                      }
                    }}
                  >
                    Save
                  </button>
                  <button
                    className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
                    onClick={() => {
                      setAboutDraft(profile.about || '');
                      setEditingAbout(false);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-start justify-between gap-2">
                <p className="text-gray-300 mb-4 flex-1">
              {profile.about || 'Add a description about yourself to let others know more about you.'}
            </p>
                <button
                  className="ml-2 bg-cyan-700 hover:bg-cyan-800 text-white px-3 py-1 rounded-md text-xs font-semibold h-fit"
                  onClick={() => setEditingAbout(true)}
                >
                  {profile.about ? 'Edit' : 'Add'}
                </button>
              </div>
            )}
            
            {futureMeCardData.mindset && (
              <>
                <h4 className="font-semibold text-lg mb-2 text-white">Mindset</h4>
                <p className="text-gray-300 mb-4">{futureMeCardData.mindset}</p>
              </>
            )}

            {onboardingData.motivation && (
              <>
                <h4 className="font-semibold text-lg mb-2 text-white">Motivation</h4>
                <p className="text-gray-300 mb-4">{onboardingData.motivation}</p>
              </>
            )}

            {onboardingData.futureExcitement && (
              <>
                <h4 className="font-semibold text-lg mb-2 text-white">What Excites Me About the Future</h4>
                <p className="text-gray-300 mb-4">{onboardingData.futureExcitement}</p>
              </>
            )}

            {onboardingData.joiningReason && (
              <>
                <h4 className="font-semibold text-lg mb-2 text-white">Why I Joined</h4>
                <p className="text-gray-300 mb-2">{onboardingData.joiningReason}</p>
                {onboardingData.otherReason && (
                  <p className="text-gray-400 text-sm mb-4 italic">Additional reason: {onboardingData.otherReason}</p>
                )}
              </>
            )}

            {/* Social Links Section - Cleanest UI */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-lg text-white">Social Links</h4>
              </div>
              {/* Chips for current links */}
              <div className="flex flex-wrap gap-2 mb-4">
                {profile.socialLinks && profile.socialLinks.length > 0 ? (
                  profile.socialLinks.map((link, idx) => {
                    const platformName = link.platform || detectPlatform(link.url);
                    const platformOption = SOCIAL_PLATFORMS.find(p => p.name === platformName);
                    const icon = platformOption ? platformOption.icon : null;
                    return (
                      <span key={idx} className="inline-flex items-center bg-gray-800 text-white rounded-full px-3 py-1 text-sm font-medium shadow-sm">
                        {icon && <span className="mr-1">{icon}</span>}
                        {platformName ? (
                          <>
                            {platformName}
                            <span className="mx-1 text-gray-400">|</span>
                            <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline max-w-[120px] truncate">{link.url}</a>
                          </>
                        ) : (
                          <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline max-w-[160px] truncate">{link.url}</a>
                        )}
                        <button
                          onClick={async () => {
                            const updated = profile.socialLinks.filter((_, i) => i !== idx);
                            setProfile(prev => ({ ...prev, socialLinks: updated }));
                            await fetch('/api/user/profile', {
                              method: 'PUT',
                              headers: {
                                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                                'Content-Type': 'application/json'
                              },
                              body: JSON.stringify({ socialLinks: updated })
                            });
                          }}
                          className="ml-2 text-gray-400 hover:text-red-500 focus:outline-none"
                          title="Remove"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      </span>
                    );
                  })
                ) : (
                  <span className="text-gray-400 text-sm">No social links added yet</span>
                )}
              </div>
              <div className="border-t border-gray-800 my-4"></div>
              {/* Add new link row */}
              <form
                className="flex flex-col sm:flex-row items-center gap-2"
                onSubmit={async e => {
                  e.preventDefault();
                  if (!/^https?:\/\//.test(addUrl)) return;
                  const platform = detectPlatform(addUrl);
                  const newLink = platform ? { url: addUrl, platform } : { url: addUrl };
                  const newLinks = [...(profile.socialLinks || []), newLink];
                  setProfile(prev => ({ ...prev, socialLinks: newLinks }));
                  setAddUrl('');
                  await fetch('/api/user/profile', {
                    method: 'PUT',
                    headers: {
                      'Authorization': `Bearer ${localStorage.getItem('token')}`,
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ socialLinks: newLinks })
                  });
                }}
              >
                <input
                  type="url"
                  placeholder="Paste your profile URL (e.g. https://linkedin.com/in/...)"
                  value={addUrl}
                  onChange={e => setAddUrl(e.target.value)}
                  className="flex-1 bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm"
                />
                <button
                  type="submit"
                  className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded font-semibold disabled:opacity-60"
                  disabled={!/^https?:\/\//.test(addUrl)}
                >
                  Add
                </button>
              </form>
              {addUrl && !/^https?:\/\//.test(addUrl) && (
                <div className="text-xs text-red-400 mt-1 ml-1">Enter a valid URL (must start with http:// or https://)</div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'preferences' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Student Profile & Preferences */}
          <div className={panelClasses}>
            <h3 className="text-xl font-semibold mb-4 text-white">Student Profile & Preferences</h3>
            
            <div className="space-y-4">
              {/* Basic Student Information */}
              <div className="bg-gray-800/30 p-4 rounded-lg">
                <h4 className="font-semibold text-white mb-3">Basic Information</h4>
                <div className="grid grid-cols-1 gap-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Student Type:</span>
                    <span className="text-gray-300 capitalize">{onboardingData.studentType || 'Not specified'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Phone Number:</span>
                    <span className="text-gray-300">{onboardingData.phoneNumber || 'Not provided'}</span>
                  </div>
                  
                  {/* School specific basic info */}
                  {onboardingData.studentType === 'school' && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Class:</span>
                        <span className="text-gray-300">{onboardingData.schoolClass || 'Not specified'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Stream:</span>
                        <span className="text-gray-300">{onboardingData.schoolStream || 'Not specified'}</span>
                      </div>
                    </>
                  )}
                  
                  {/* College specific basic info */}
                  {onboardingData.studentType === 'college' && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Degree:</span>
                        <span className="text-gray-300">{onboardingData.collegeDegree || 'Not specified'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Year:</span>
                        <span className="text-gray-300">{onboardingData.collegeYear || 'Not specified'}</span>
                      </div>
                      {onboardingData.otherDegree && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Additional Degree:</span>
                          <span className="text-gray-300">{onboardingData.otherDegree}</span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* School Student Specific Data */}
              {onboardingData.studentType === 'school' && (
                <>
                  <div className="bg-gray-800/30 p-4 rounded-lg">
                    <h4 className="font-semibold text-white mb-3">Academic Strengths</h4>
                    {onboardingData.strongestAreas && onboardingData.strongestAreas.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {onboardingData.strongestAreas.map((area, index) => (
                          <span
                            key={index}
                            className="bg-green-600/30 text-green-300 px-3 py-1 rounded-full text-sm font-medium"
                          >
                            {area}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-400 text-sm">No academic strengths specified yet</p>
                    )}
                  </div>

                  <div className="bg-gray-800/30 p-4 rounded-lg">
                    <h4 className="font-semibold text-white mb-3">Preferred Learning Formats</h4>
                    {onboardingData.learningFormats && onboardingData.learningFormats.length > 0 ? (
                      <div className="space-y-2">
                        {onboardingData.learningFormats.map((format, index) => (
                          <div key={index} className="flex items-center">
                            <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                            <span className="text-gray-300">{format}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-400 text-sm">No learning formats specified yet</p>
                    )}
                  </div>
                </>
              )}

              {/* College Student Specific Data */}
              {onboardingData.studentType === 'college' && (
                <>
                  <div className="bg-gray-800/30 p-4 rounded-lg">
                    <h4 className="font-semibold text-white mb-3">Personal Strengths</h4>
                    {onboardingData.strengths && onboardingData.strengths.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {onboardingData.strengths.map((strength, index) => (
                          <span
                            key={index}
                            className="bg-orange-600/30 text-orange-300 px-3 py-1 rounded-full text-sm font-medium"
                          >
                            {strength}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-400 text-sm">No personal strengths specified yet</p>
                    )}
                  </div>

                  <div className="bg-gray-800/30 p-4 rounded-lg">
                    <h4 className="font-semibold text-white mb-3">Learning Preferences</h4>
                    {onboardingData.learningPreference && onboardingData.learningPreference.length > 0 ? (
                      <div className="space-y-2">
                        {onboardingData.learningPreference.map((pref, index) => (
                          <div key={index} className="flex items-center">
                            <div className="w-2 h-2 bg-teal-400 rounded-full mr-3"></div>
                            <span className="text-gray-300">{pref}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-400 text-sm">No learning preferences specified yet</p>
                    )}
                  </div>

                  <div className="bg-gray-800/30 p-4 rounded-lg">
                    <h4 className="font-semibold text-white mb-2">Lifestyle Preference</h4>
                    <p className="text-gray-300">{onboardingData.lifestyle || 'No lifestyle preference specified yet'}</p>
                  </div>
                </>
              )}

            

              <div className="bg-gray-800/30 p-4 rounded-lg">
                <h4 className="font-semibold text-white mb-3">Industry Interests</h4>
                {onboardingData.industries && onboardingData.industries.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {onboardingData.industries.map((industry, index) => (
                      <span
                        key={index}
                        className="bg-blue-600/30 text-blue-300 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {industry}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm">No industry interests specified yet</p>
                )}
              </div>
            </div>
          </div>

          {/* Motivations & Journey */}
          <div className={panelClasses}>
            <h3 className="text-xl font-semibold mb-4 text-white">Motivations & Journey</h3>
            
            <div className="space-y-4">
              {/* Joining Reason */}
              <div className="bg-gray-800/30 p-4 rounded-lg">
                <h4 className="font-semibold text-white mb-2 flex items-center">
                  <Target className="h-5 w-5 mr-2 text-cyan-400" />
                  Why I Joined
                </h4>
                {onboardingData.joiningReason ? (
                  <>
                    <p className="text-gray-300 mb-2">{onboardingData.joiningReason}</p>
                    {onboardingData.otherReason && (
                      <p className="text-gray-400 text-sm italic">Additional: {onboardingData.otherReason}</p>
                    )}
                  </>
                ) : (
                  <p className="text-gray-400 text-sm">No joining reason specified yet</p>
                )}
              </div>

              {/* Motivation */}
              <div className="bg-gray-800/30 p-4 rounded-lg">
                <h4 className="font-semibold text-white mb-2 flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-green-400" />
                  My Motivation
                </h4>
                {onboardingData.motivation ? (
                  <p className="text-gray-300">{onboardingData.motivation}</p>
                ) : (
                  <p className="text-gray-400 text-sm">No motivation specified yet</p>
                )}
              </div>

              {/* Future Excitement - Only for school students */}
              {onboardingData.studentType === 'school' && (
                <div className="bg-gray-800/30 p-4 rounded-lg">
                  <h4 className="font-semibold text-white mb-2 flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-purple-400" />
                    Future Excitement
                  </h4>
                  {onboardingData.futureExcitement ? (
                    <p className="text-gray-300">{onboardingData.futureExcitement}</p>
                  ) : (
                    <p className="text-gray-400 text-sm">No future excitement specified yet</p>
                  )}
                </div>
              )}

              {/* Onboarding Completion Status */}
              <div className="bg-gray-800/30 p-4 rounded-lg">
                <h4 className="font-semibold text-white mb-3">Onboarding Journey</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Onboarding Complete:</span>
                    <span className={`px-2 py-1 rounded text-sm ${
                      profile.onboardingComplete 
                        ? 'bg-green-600/30 text-green-300' 
                        : 'bg-yellow-600/30 text-yellow-300'
                    }`}>
                      {profile.onboardingComplete ? 'Complete' : 'In Progress'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Completed On:</span>
                    <span className="text-gray-300">
                      {onboardingData.completedAt 
                        ? new Date(onboardingData.completedAt).toLocaleDateString()
                        : 'Not completed'
                      }
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Member Since:</span>
                    <span className="text-gray-300">
                      {new Date(profile.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Student Type:</span>
                    <span className="text-gray-300 capitalize">{onboardingData.studentType || 'Not specified'}</span>
                  </div>
                </div>
              </div>

              {/* Profile Enhancement Tips - Dynamic based on missing data */}
              <div className="bg-blue-600/10 border border-blue-600/30 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-300 mb-2">Profile Enhancement Tips</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  {!profile.about && <li>• Add an "About Me" section to tell others about yourself</li>}
                  {!futureMeCardData.personalityType && <li>• Complete personality assessment for better recommendations</li>}
                  {(!profile.socialLinks || profile.socialLinks.length === 0) && <li>• Add social media links to connect with others</li>}
                  {!onboardingData.motivation && <li>• Share your motivation to inspire others</li>}
                  {!onboardingData.joiningReason && <li>• Tell us why you joined our platform</li>}
                  {onboardingData.studentType === 'school' && !onboardingData.futureExcitement && <li>• Share what excites you about the future</li>}
                  {onboardingData.studentType === 'school' && (!onboardingData.strongestAreas || onboardingData.strongestAreas.length === 0) && <li>• Add your strongest academic areas</li>}
                  {onboardingData.studentType === 'college' && !onboardingData.lifestyle && <li>• Add your lifestyle preferences</li>}
                  {onboardingData.studentType === 'college' && (!onboardingData.strengths || onboardingData.strengths.length === 0) && <li>• Add your personal strengths</li>}
                </ul>
              </div>

              {/* Data Summary */}
              <div className="bg-gray-700/30 p-4 rounded-lg">
                <h4 className="font-semibold text-white mb-3">Profile Data Summary</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Fields Completed:</span>
                    <p className="text-gray-300">{profileCompletionPercentage}%</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Last Updated:</span>
                    <p className="text-gray-300">
                      {onboardingData.completedAt 
                        ? new Date(onboardingData.completedAt).toLocaleDateString()
                        : 'Not available'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'career' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Future Role & Personality */}
          <div className={panelClasses}>
            <h3 className="text-xl font-semibold mb-4 text-white">Career Profile</h3>
            {(!futureMeCardData || Object.keys(futureMeCardData).length === 0) ? (
              <div className="flex flex-col items-center justify-center h-full py-8">
                <p className="text-gray-400 mb-4 text-center">No career profile found. Generate your Future Me Card to see personalized career insights!</p>
                <button
                  className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-2 rounded-md font-semibold transition-colors"
                  onClick={async () => {
                    try {
                      const res = await fetch('/api/futureme/generate', {
                        method: 'POST',
                        headers: {
                          'Authorization': `Bearer ${localStorage.getItem('token')}`,
                          'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(onboardingData)
                      });
                      
                      if (!res.ok) {
                        throw new Error('Failed to generate Future Me Card');
                      }
                      
                      const data = await res.json();
                      if (data.success && data.user) {
                        // Update the entire profile state with the new user data
                        setProfile(data.user);
                      } else {
                        throw new Error('Invalid response format');
                      }
                    } catch (err) {
                      console.error('Error:', err);
                      alert('Failed to generate Future Me Card. Please try again.');
                    }
                  }}
                >
                  Generate My Future Me Card
                </button>
              </div>
            ) : (
              <>
                {/* Editable Future Role */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-lg text-white">Future Target Role</h4>
                    <button
                      onClick={() => setEditingFutureRole(true)}
                      className="bg-cyan-700 hover:bg-cyan-800 text-white px-3 py-1 rounded-md text-xs font-semibold"
                    >
                      Edit
                    </button>
                  </div>
                  
                  {editingFutureRole ? (
                    <div className="bg-gray-800/30 p-4 rounded-lg">
                      <input
                        type="text"
                        value={futureRoleDraft}
                        onChange={(e) => setFutureRoleDraft(e.target.value)}
                        placeholder="Enter your future role..."
                        className="w-full bg-gray-700/50 border border-gray-600 rounded px-3 py-2 text-white mb-3"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={handleSaveFutureRole}
                          className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded text-sm"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setFutureRoleDraft(futureMeCardData.futureRole || '');
                            setEditingFutureRole(false);
                          }}
                          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-cyan-400 text-lg">{futureMeCardData.futureRole || 'No future role set'}</p>
                  )}
                </div>

                {futureMeCardData.personalityType && (
              <div className="mb-4">
                <h4 className="font-semibold text-lg mb-2 text-white">Personality Type</h4>
                    <p className="text-gray-300">{futureMeCardData.personalityType}</p>
              </div>
            )}
            {futureMeCardData.salary && (
              <div className="mb-4">
                <h4 className="font-semibold text-lg mb-2 text-white">Expected Salary</h4>
                <p className="text-green-400">{futureMeCardData.salary}</p>
              </div>
            )}
                {futureMeCardData.keySkills && futureMeCardData.keySkills.length > 0 && (
              <div className="mb-4">
                <h4 className="font-semibold text-lg mb-2 text-white">Key Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {futureMeCardData.keySkills.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-cyan-600/30 text-cyan-300 px-3 py-1 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
                {futureMeCardData.tags && futureMeCardData.tags.length > 0 && (
              <div>
                <h4 className="font-semibold text-lg mb-2 text-white">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {futureMeCardData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-purple-600/30 text-purple-300 px-3 py-1 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
                )}
                {futureMeCardData.tagline && (
                  <div className="mt-4">
                    <p className="text-cyan-400 italic">"{futureMeCardData.tagline}"</p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Experience Section */}
          <div className={panelClasses}>
            <h3 className="text-xl font-semibold mb-4 text-white">Experience</h3>
            
            {editingExperience ? (
              <div className="space-y-4">
                {experienceDraft.map((exp, index) => (
                  <div key={index} className="bg-gray-800/30 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-semibold text-white">Experience {index + 1}</h4>
                      <button
                        onClick={() => handleRemoveExperience(index)}
                        className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs"
                      >
                        Remove
                      </button>
                    </div>
                    
                    <div className="space-y-3">
                      <input
                        type="text"
                        placeholder="Job Title"
                        value={exp.title}
                        onChange={(e) => handleUpdateExperience(index, 'title', e.target.value)}
                        className="w-full bg-gray-700/50 border border-gray-600 rounded px-3 py-2 text-white text-sm"
                      />
                      
                      <input
                        type="text"
                        placeholder="Company"
                        value={exp.company}
                        onChange={(e) => handleUpdateExperience(index, 'company', e.target.value)}
                        className="w-full bg-gray-700/50 border border-gray-600 rounded px-3 py-2 text-white text-sm"
                      />
                      
                      <textarea
                        placeholder="Description"
                        value={exp.description}
                        onChange={(e) => handleUpdateExperience(index, 'description', e.target.value)}
                        rows={3}
                        className="w-full bg-gray-700/50 border border-gray-600 rounded px-3 py-2 text-white text-sm"
                      />
                      
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="Start Date (e.g., Jan 2023)"
                          value={exp.startDate}
                          onChange={(e) => handleUpdateExperience(index, 'startDate', e.target.value)}
                          className="bg-gray-700/50 border border-gray-600 rounded px-3 py-2 text-white text-sm"
                        />
                        
                        <input
                          type="text"
                          placeholder="End Date (e.g., Present)"
                          value={exp.endDate}
                          onChange={(e) => handleUpdateExperience(index, 'endDate', e.target.value)}
                          disabled={exp.current}
                          className={`bg-gray-700/50 border border-gray-600 rounded px-3 py-2 text-white text-sm ${
                            exp.current ? 'opacity-50' : ''
                          }`}
                        />
                      </div>
                      
                      <label className="flex items-center text-sm text-gray-300">
                        <input
                          type="checkbox"
                          checked={exp.current}
                          onChange={(e) => handleUpdateExperience(index, 'current', e.target.checked)}
                          className="mr-2"
                        />
                        Currently working here
                      </label>
                    </div>
                  </div>
                ))}
                
                {experienceDraft.length < 3 && (
                  <button
                    onClick={handleAddExperience}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold"
                  >
                    Add Experience
                  </button>
                )}
                
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveExperience}
                    className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white py-2 rounded text-sm"
                  >
                    Save Experience
                  </button>
                  <button
                    onClick={() => {
                      setExperienceDraft(profile.experience || []);
                      setEditingExperience(false);
                    }}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-white">Work Experience</h4>
                  <button
                    onClick={() => setEditingExperience(true)}
                    className="bg-cyan-700 hover:bg-cyan-800 text-white px-3 py-1 rounded-md text-xs font-semibold"
                  >
                    {profile.experience && profile.experience.length > 0 ? 'Edit' : 'Add'}
                  </button>
                </div>
                
                {profile.experience && profile.experience.length > 0 ? (
                  <div className="space-y-4">
                    {profile.experience.map((exp, index) => (
                      <div key={index} className="bg-gray-800/30 p-4 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <h5 className="font-semibold text-white">{exp.title}</h5>
                          <span className="text-gray-400 text-sm">
                            {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                          </span>
                        </div>
                        <p className="text-cyan-400 text-sm mb-2">{exp.company}</p>
                        {exp.description && (
                          <p className="text-gray-300 text-sm">{exp.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-center py-8">No experience added yet. Add your work experience to showcase your background!</p>
                )}
              </div>
            )}
          </div>

          {/* Recommendations */}
          <div className={panelClasses}>
            <h3 className="text-xl font-semibold mb-4 text-white">Recommendations</h3>
            {(!futureMeCardData || Object.keys(futureMeCardData).length === 0) ? (
              <p className="text-gray-400 text-center">No recommendations available. Generate your Future Me Card to get personalized suggestions!</p>
            ) : (
              <>
                {futureMeCardData.careerRecommendations && futureMeCardData.careerRecommendations.length > 0 && (
              <div className="mb-4">
                <h4 className="font-semibold text-lg mb-2 text-white">Career Recommendations</h4>
                <ul className="space-y-2">
                      {futureMeCardData.careerRecommendations.map((rec, index) => (
                    <li key={index} className="text-gray-300 flex items-start">
                      <span className="text-green-400 mr-2">✓</span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}
                {futureMeCardData.skillRecommendations && futureMeCardData.skillRecommendations.length > 0 && (
              <div className="mb-4">
                <h4 className="font-semibold text-lg mb-2 text-white">Skill Recommendations</h4>
                <ul className="space-y-2">
                      {futureMeCardData.skillRecommendations.map((rec, index) => (
                    <li key={index} className="text-gray-300 flex items-start">
                      <span className="text-blue-400 mr-2">→</span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}
                {futureMeCardData.mentors && futureMeCardData.mentors.length > 0 && (
              <div className="mb-4">
                <h4 className="font-semibold text-lg mb-2 text-white">Recommended Mentors</h4>
                <ul className="space-y-1">
                  {futureMeCardData.mentors.map((mentor, index) => (
                    <li key={index} className="text-gray-300">{mentor}</li>
                  ))}
                </ul>
              </div>
            )}
            {futureMeCardData.cta && (
              <div className="bg-cyan-600/10 border border-cyan-600/30 p-4 rounded-lg">
                <h4 className="font-semibold text-cyan-300 mb-2">Call to Action</h4>
                <p className="text-gray-300">{futureMeCardData.cta}</p>
              </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;