import axios from "axios";

const API_URL = "https://api.openai.com/v1/chat/completions";
const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

// Import new storage functions
import { planExists, saveSyllabusPlan, getSyllabusPlan } from '../services/storageService';

const syllabusGenerationPrompt = `
You are India's most knowledgeable exam preparation expert with expertise in ALL major competitive exams.

🚨 CRITICAL REQUIREMENT: ANALYZE TIME AVAILABLE AND SELECTED SUBJECTS TO RETURN APPROPRIATE CHAPTERS 🚨

SUBJECT FILTERING LOGIC:
- ONLY generate chapters for the SELECTED SUBJECTS mentioned in student setup
- If Physics selected: Include ONLY Physics chapters
- If Chemistry selected: Include ONLY Chemistry chapters  
- If Biology selected: Include ONLY Biology chapters
- If Mathematics selected: Include ONLY Mathematics chapters
- If multiple subjects selected: Include chapters from ALL selected subjects only
- NEVER include chapters from non-selected subjects

TIME-BASED CHAPTER LOGIC (EXACT MATCHING):
- "2 weeks" OR "1 month" OR "2 months": Return 10-15 MOST SCORING/IMPORTANT chapters from selected subjects
- "3 months" OR "4 months" OR "5 months": Return 20-25 IMPORTANT chapters from selected subjects  
- "6 months" OR "1 year": Return COMPLETE COMPREHENSIVE SYLLABUS from selected subjects (25-30)

🚨 CRITICAL: For limited time, prioritize HIGHEST SCORING and MOST IMPORTANT chapters first 🚨

EXAM-SPECIFIC EXPERTISE:
- JEE Main/Advanced: Physics, Chemistry, Mathematics chapters
- NEET: Physics, Chemistry, Biology (Botany & Zoology) chapters
- CUET: Subject-specific chapters based on chosen stream
- State CETs: State-specific syllabus patterns
- CLAT: Legal reasoning, Logical reasoning, English, GK chapters
- CAT: Quantitative Aptitude, VARC, DILR chapters
- GATE: Branch-specific technical chapters
- IMO: Advanced Mathematics chapters and problem-solving
- NSO: Physics, Chemistry, Biology olympiad-level chapters
- IOQM: Mathematics olympiad qualifier chapters
- NSEJS: Junior-level Physics, Chemistry, Biology chapters
- IBPS PO: Quantitative Aptitude, Reasoning, English, General Awareness
- NDA: Mathematics, General Ability Test, English chapters

PREPARATION LEVEL ANALYSIS:
- Level 1 (Just started): Focus on fundamental chapters first
- Level 2-3 (Moderate): Mix of basic and intermediate chapters
- Level 4-5 (Advanced): Include advanced and previous year focused chapters

🚨 RETURN CORRECT NUMBER OF CHAPTERS BASED ON EXACT TIME AVAILABLE 🚨

JSON FORMAT (return ONLY this structure):

[
  {
    "chapterName": "Specific chapter name",
    "subject": "Physics/Chemistry/Mathematics/Biology/English/etc",
    "difficulty": "Basic/Intermediate/Advanced",
    "importance": "High/Medium/Low",
    "weightage": "% weightage in exam",
    "estimatedHours": "Study hours needed",
    "status": "not-started",
    "levelsCleared": 0,
    "timeSpent": 0,
    "questionsCorrect": 0,
    "totalAttempts": 0,
    "lastAttempted": null,
    "description": "Brief why this chapter is important"
  }
]

🚨 JSON FORMATTING REQUIREMENTS 🚨:
- Start response with [ and end with ]
- Use double quotes for all strings
- Keep descriptions SHORT (max 15 words)
- No trailing commas
- No extra text before or after JSON
- Ensure valid JSON syntax throughout

CRITICAL INSTRUCTIONS:
- Analyze the specific exam mentioned and provide ONLY relevant chapters
- STRICTLY filter by selected subjects - NO chapters from non-selected subjects
- Match EXACT time available strings to determine chapter count
- "2 weeks/1 month/2 months" = 15-18 MOST SCORING chapters
- "3 months/4 months/5 months" = 22-25 IMPORTANT chapters
- "6 months/1 year" = COMPLETE COMPREHENSIVE SYLLABUS (30-35 chapters)
- Order chapters by importance/difficulty progression
- Ensure chapters are actually part of the specified exam syllabus
- RESPOND WITH ONLY VALID JSON ARRAY - NO MARKDOWN, NO EXTRA TEXT

🚨 FINAL REMINDER: Return ONLY valid JSON starting with [ and ending with ] 🚨
`;

const questionsGenerationPrompt = `
Generate 25 adaptive multiple-choice questions for [CHAPTER_NAME] of [EXAM_NAME].

Return ONLY valid JSON in this exact format:

{
  "chapterName": "[CHAPTER_NAME]",
  "examName": "[EXAM_NAME]",
  "totalQuestions": 25,
  "levels": [
    {
      "level": 1,
      "difficulty": "Basic",
      "questions": [
        {
          "id": 1,
          "question": "What is the basic definition?",
          "options": {
            "A": "Option A",
            "B": "Option B",
            "C": "Option C",
            "D": "Option D"
          },
          "correctAnswer": "A",
          "explanation": "Simple explanation here"
        },
        {
          "id": 2,
          "question": "Second question?",
          "options": {
            "A": "Option A",
            "B": "Option B",
            "C": "Option C",
            "D": "Option D"
          },
          "correctAnswer": "B",
          "explanation": "Explanation for second question"
        },
        {
          "id": 3,
          "question": "Third question?",
          "options": {
            "A": "Option A",
            "B": "Option B",
            "C": "Option C",
            "D": "Option D"
          },
          "correctAnswer": "C",
          "explanation": "Explanation for third question"
        },
        {
          "id": 4,
          "question": "Fourth question?",
          "options": {
            "A": "Option A",
            "B": "Option B",
            "C": "Option C",
            "D": "Option D"
          },
          "correctAnswer": "D",
          "explanation": "Explanation for fourth question"
        },
        {
          "id": 5,
          "question": "Fifth question?",
          "options": {
            "A": "Option A",
            "B": "Option B",
            "C": "Option C",
            "D": "Option D"
          },
          "correctAnswer": "A",
          "explanation": "Explanation for fifth question"
        }
      ]
    }
  ]
}

RULES:
- Level 1: Basic definitions (5 questions, ids 1-5)
- Level 2: Applications (5 questions, ids 6-10) 
- Level 3: Conceptual (5 questions, ids 11-15)
- Level 4: Mixed concepts (5 questions, ids 16-20)
- Level 5: Advanced (5 questions, ids 21-25)
- Return ONLY valid JSON, no extra text
- Each level must have exactly 5 questions`;

const revisionContentPrompt = `
You are an expert educator creating comprehensive CHAPTER REVISION NOTES for competitive exam preparation.

🚨 CRITICAL MISSION: Generate ONLY the MOST IMPORTANT content for exam success. Quality over quantity! 🚨

STRICT CONTENT REQUIREMENTS:
- Provide EXACTLY 8 MOST IMPORTANT core theory topics per chapter (ONLY the concepts that are MOST LIKELY to appear in exams)
- Include EXACTLY 6 MOST IMPORTANT formulas/key points per chapter (ONLY the ones students MUST know for exams)
- Focus ONLY on high-weightage, exam-critical content
- Put ALL information in the explanation field (when to use, memory tips, etc.)
- NO filler content - every single item must be exam-essential

JSON FORMAT (return ONLY this structure):

{
  "chapterName": "[CHAPTER_NAME]",
  "examName": "[EXAM_NAME]",
  "revision": {
    "introduction": {
      "overview": "Complete 4-5 sentence overview focusing on WHY this chapter is crucial for exam success",
      "examImportance": "Specific exam importance: exact weightage, most common question types, scoring potential, and difficulty level"
    },
    "coreTheory": [
      {
        "topic": "MOST IMPORTANT Topic/Concept Name (must be exam-critical)",
        "definition": "Clear, precise definition that students can remember and reproduce in exams",
        "explanation": "Detailed explanation including: when this appears in exams, common question patterns, memory tricks, and why it's important for scoring",
        "keyPoints": [
          "Most important exam point 1 about this topic",
          "Most important exam point 2 about this topic", 
          "Most important exam point 3 about this topic"
        ],
        "examples": [
          "Most relevant exam-style example 1",
          "Most relevant exam-style example 2"
        ]
      }
    ],
    "importantFormulas": [
      {
        "name": "MOST IMPORTANT Formula/Rule Name (must be exam-critical)",
        "formula": "Mathematical formula (if applicable, otherwise null)",
        "keyPoint": "Key rule/principle (for non-mathematical subjects)",
        "explanation": "Complete explanation including: WHY this formula is crucial for exams, most common question types using this formula, memory tricks, step-by-step application method, common mistakes to avoid, and exactly when to use it - ALL IN ONE COMPREHENSIVE FIELD"
      }
    ],
    "quickReference": {
      "quickFormulas": [
        {
          "formula": "Most important quick formula (if applicable)",
          "point": "Most important quick point (for non-math subjects)",
          "use": "When to use this in exams - be specific"
        }
      ],
      "summaryPoints": [
        "Most critical exam takeaway 1 of the chapter",
        "Most critical exam takeaway 2 of the chapter",
        "Most critical exam takeaway 3 of the chapter"
      ]
    }
  }
}

SPECIFIC SUBJECT INSTRUCTIONS:

🧮 MATHEMATICS/PHYSICS/CHEMISTRY:
- Include EXACTLY 6 most exam-important formulas with units and conditions
- Focus on formulas that appear in 70%+ of exams
- Put derivation hints, applications, and memory tricks in explanation

🧬 BIOLOGY:
- Include EXACTLY 8 most exam-important biological processes, systems, or classifications
- Focus on topics with highest exam weightage
- Put examples, memory tricks, and applications in explanation

📚 ENGLISH/LANGUAGES:
- Include EXACTLY 8 most exam-important grammar rules, literary devices, or language concepts
- Focus on rules that appear most frequently in exams
- Put usage examples and error corrections in explanation

📖 OTHER SUBJECTS:
- Include EXACTLY 8 most exam-important frameworks, principles, or concepts
- Focus on highest weightage topics
- Put applications and examples in explanation

🚨 MANDATORY REQUIREMENTS - NO EXCEPTIONS:
- Generate EXACTLY 8 MOST IMPORTANT core theory topics (not random topics)
- Generate EXACTLY 6 MOST IMPORTANT formulas/key points (not random formulas)
- Every single item must be EXAM-CRITICAL and HIGH-WEIGHTAGE
- Focus on content that gives maximum scoring potential
- NO filler content whatsoever

RESPOND WITH ONLY THE JSON OBJECT - NO OTHER TEXT

🚨 FINAL REMINDER: Generate EXACTLY 8 most important core concepts and EXACTLY 6 most important formulas - ONLY the MOST IMPORTANT, EXAM-CRITICAL content that students MUST know to score well! 🚨
`;

// ===============================
// ENHANCED MULTI-SUBJECT FUNCTIONS
// ===============================

// Function 1: Generate Syllabus Chapters with Plan Management
export const generateSyllabusChapters = async (userSetup) => {
    try {
        const { examName, subjectFocus } = userSetup;
        const subject = subjectFocus[0]; // Single subject selection

        // Check if plan already exists
        if (planExists(examName, subject)) {
            console.log(`Plan already exists for ${examName} - ${subject}, returning cached data`);
            const existingPlan = getSyllabusPlan(examName, subject);
            return existingPlan.chapters;
        }

        console.log(`Generating new plan for ${examName} - ${subject}`);

        // Generate cache key for API call
        const cacheKey = `syllabus_${examName}_${userSetup.timeAvailable}_${userSetup.prepLevel}_${subject}`;
        const cachedData = localStorage.getItem(cacheKey);

        if (cachedData) {
            console.log("Found cached API data, using it");
            const chapters = JSON.parse(cachedData);
            // Save as new plan
            saveSyllabusPlan(examName, subject, chapters, userSetup);
            return chapters;
        }

        const setupText = `
    STUDENT SETUP PROFILE:
    Exam Name: ${examName}
    Preparation Level: Level ${userSetup.prepLevel} (${getPrepLevelDescription(userSetup.prepLevel)})
    Time Available: ${userSetup.timeAvailable}
    Selected Subject: ${subject}
    
    CRITICAL ANALYSIS REQUIRED:
    1. Identify the specific exam syllabus for "${examName}"
    2. STRICTLY generate chapters for ONLY this subject: ${subject}
    3. Based on time available "${userSetup.timeAvailable}" determine chapter count:
       - "2 weeks" OR "1 month" OR "2 months": Return 10-15 MOST SCORING chapters
       - "3 months" OR "4 months" OR "5 months": Return 20-25 IMPORTANT chapters
       - "6 months" OR "1 year": Return 25-35 chapters (COMPLETE COMPREHENSIVE SYLLABUS)
    4. Consider preparation level for chapter ordering and difficulty
    
    🚨 MANDATORY: Return appropriate number of chapters for ${subject} ONLY 🚨
    `;

        const response = await axios.post(
            API_URL,
            {
                model: "gpt-4o-mini",
                messages: [
                    {
                        role: "system",
                        content: syllabusGenerationPrompt,
                    },
                    {
                        role: "user",
                        content: `Generate syllabus chapters based on this setup:\n${setupText}`,
                    },
                ],
                temperature: 0.3,
                max_tokens: 8000,
            },
            {
                headers: {
                    Authorization: `Bearer ${API_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );

        const content = response.data.choices[0].message.content;
        let chapters = parseJSONResponse(content);

        if (!Array.isArray(chapters) || chapters.length === 0) {
            throw new Error("Invalid response format from API");
        }

        // Cache the API response
        localStorage.setItem(cacheKey, JSON.stringify(chapters));

        // Save as new plan
        saveSyllabusPlan(examName, subject, chapters, userSetup);

        return chapters;

    } catch (error) {
        console.error("Error generating syllabus chapters:", error);
        throw error;
    }
};

// Function 2: Generate Questions for Chapter (Subject-aware caching)
export const generateChapterQuestions = async (chapterName, examName, subject) => {
    try {
        // Enhanced cache key with subject
        const cacheKey = `questions_${chapterName}_${examName}_${subject}`;
        const cachedData = localStorage.getItem(cacheKey);
        if (cachedData) {
            return JSON.parse(cachedData);
        }

        const questionsPrompt = questionsGenerationPrompt
            .replace(/\[CHAPTER_NAME\]/g, chapterName)
            .replace(/\[EXAM_NAME\]/g, examName);

        const response = await axios.post(
            API_URL,
            {
                model: "gpt-3.5-turbo-16k",
                messages: [
                    {
                        role: "system",
                        content: questionsPrompt,
                    },
                    {
                        role: "user",
                        content: `Generate exactly 25 questions (5 levels × 5 questions each) for "${chapterName}" of "${examName}" focusing on ${subject}. Return only valid JSON.`,
                    },
                ],
                temperature: 0.3,
                max_tokens: 4000,
            },
            {
                headers: {
                    Authorization: `Bearer ${API_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );

        const content = response.data.choices[0].message.content;
        console.log("Raw AI response:", content.substring(0, 200) + "...");

        let questions = parseJSONResponse(content);

        // Validate structure
        if (!questions || !questions.levels || questions.levels.length !== 5) {
            console.error("Invalid questions structure:", questions);
            throw new Error("AI returned invalid question format");
        }

        // Validate each level has 5 questions
        for (let i = 0; i < questions.levels.length; i++) {
            const level = questions.levels[i];
            if (!level.questions || level.questions.length !== 5) {
                console.error(`Level ${i + 1} has ${level.questions?.length || 0} questions, expected 5`);
                throw new Error(`Level ${i + 1} has incorrect number of questions`);
            }
        }

        // Cache the questions with subject-specific key
        localStorage.setItem(cacheKey, JSON.stringify(questions));
        return questions;

    } catch (error) {
        console.error("Error generating chapter questions:", error);
        throw error;
    }
};

// Function 3: Generate Chapter Revision Content (Subject-aware caching)
export const generateChapterRevision = async (chapterName, examName, subject) => {
    try {
        // Enhanced cache key with subject
        const cacheKey = `revision_${chapterName}_${examName}_${subject}`;
        const cachedData = localStorage.getItem(cacheKey);
        if (cachedData) {
            return JSON.parse(cachedData);
        }

        const revisionPrompt = revisionContentPrompt
            .replace(/\[CHAPTER_NAME\]/g, chapterName)
            .replace(/\[EXAM_NAME\]/g, examName);

        const response = await axios.post(
            API_URL,
            {
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: revisionPrompt,
                    },
                    {
                        role: "user",
                        content: `Create COMPREHENSIVE CHAPTER REVISION with EXACTLY 8 most important core concepts and EXACTLY 6 most important formulas/key points. Chapter: "${chapterName}" of exam "${examName}" for subject "${subject}". Include ONLY exam-critical, high-weightage content - no filler!`,
                    },
                ],
                temperature: 0.3,
                max_tokens: 4000,
            },
            {
                headers: {
                    Authorization: `Bearer ${API_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );

        const content = response.data.choices[0].message.content;
        let revision = parseJSONResponse(content);

        if (!revision || !revision.revision || !revision.revision.introduction) {
            throw new Error("Invalid revision format from API");
        }

        // Cache with subject-specific key
        localStorage.setItem(cacheKey, JSON.stringify(revision));
        return revision;

    } catch (error) {
        console.error("Error generating chapter revision:", error);
        throw error;
    }
};

// ===============================
// HELPER FUNCTIONS
// ===============================

// Enhanced JSON parsing with multiple strategies
const parseJSONResponse = (content) => {
    try {
        // Strategy 1: Direct JSON parse
        return JSON.parse(content);
    } catch (directParseError) {
        console.log("Direct parse failed, trying extraction...");

        try {
            // Strategy 2: Remove markdown code blocks and extra text
            let cleanedContent = content
                .replace(/```json/g, '')
                .replace(/```/g, '')
                .replace(/^[^{[]*/, '') // Remove text before first { or [
                .replace(/[^}\]]*$/, '') // Remove text after last } or ]
                .trim();

            return JSON.parse(cleanedContent);
        } catch (cleanParseError) {
            console.log("Clean parse failed, trying regex extraction...");

            try {
                // Strategy 3: Extract JSON using regex
                const jsonRegex = /\{[\s\S]*\}|\[[\s\S]*\]/;
                const match = content.match(jsonRegex);

                if (match) {
                    return JSON.parse(match[0]);
                }

                throw new Error("No JSON found in response");
            } catch (regexParseError) {
                console.error("All parsing strategies failed");
                console.error("Original content:", content);
                throw new Error("Failed to parse JSON response from AI");
            }
        }
    }
};

// Get preparation level description
const getPrepLevelDescription = (level) => {
    const descriptions = {
        1: "Just started preparation",
        2: "Basic concepts covered",
        3: "Intermediate level preparation",
        4: "Advanced preparation",
        5: "Exam ready"
    };
    return descriptions[level] || "Unknown level";
};

// ===============================
// UPDATED DATA PERSISTENCE FUNCTIONS
// ===============================

// Get saved syllabus (for current plan)
export const getSavedSyllabus = () => {
    try {
        const currentPlan = getSyllabusPlan();
        return currentPlan || null;
    } catch (error) {
        return null;
    }
};

// Get saved questions with subject awareness
export const getSavedQuestions = (chapterName, examName, subject) => {
    try {
        const cacheKey = `questions_${chapterName}_${examName}_${subject}`;
        const data = localStorage.getItem(cacheKey);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        return null;
    }
};

// Get saved revision with subject awareness
export const getSavedRevision = (chapterName, examName, subject) => {
    try {
        const cacheKey = `revision_${chapterName}_${examName}_${subject}`;
        const data = localStorage.getItem(cacheKey);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        return null;
    }
};

// Clear all cached data for specific subject
export const clearSubjectCache = (examName, subject) => {
    try {
        const prefix = `${examName}_${subject}`;
        Object.keys(localStorage).forEach(key => {
            if (key.includes(prefix) &&
                (key.startsWith('questions_') ||
                    key.startsWith('revision_') ||
                    key.startsWith('syllabus_'))) {
                localStorage.removeItem(key);
            }
        });
        return true;
    } catch (error) {
        console.error("Error clearing subject cache:", error);
        return false;
    }
};

// Clear all cached data (updated for multi-subject)
export const clearAllCache = () => {
    try {
        // Clear all AI cache
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith('questions_') ||
                key.startsWith('revision_') ||
                key.startsWith('syllabus_')) {
                localStorage.removeItem(key);
            }
        });

        return true;
    } catch (error) {
        console.error("Error clearing cache:", error);
        return false;
    }
};