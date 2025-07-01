import axios from "axios";

const API_URL = "https://api.openai.com/v1/chat/completions";
const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

const learningPathPrompt = `
You are an expert curriculum designer specializing in creating structured learning paths. Your task is to generate a comprehensive learning path for any given skill with exactly 10 modules.

For each module, provide:
1. Title - A clear, concise title that describes the module content
2. Description - A detailed explanation of what will be covered (3-4 sentences)
3. Learning Objectives - 3-4 specific, measurable outcomes
4. Resources - Recommend 3-4 high-quality learning resources (specific courses on platforms like Coursera, Udemy, or YouTube channels with actual URLs)
5. Duration - Realistic time estimate to complete the module
6. Key Points - 4-5 important concepts or takeaways from this module
7. Practical Task - A concrete task the learner should perform to apply knowledge
8. Tips - 2-3 tips for success in this module

Guidelines:
- Start with fundamentals and progressively increase complexity
- Include practical exercises and hands-on projects
- Focus on industry-relevant skills and best practices
- Ensure logical progression between modules
- Include both theoretical knowledge and practical application
- Recommend only well-known, reputable learning resources with actual links
- Avoid placeholder links - use real URLs to actual courses, videos, and articles

Format the response as a JSON object with exactly 10 modules following this structure:
{
  "modules": [
    {
      "title": "string",
      "description": "string",
      "objectives": ["string", "string", "string", "string"],
      "resources": ["string with URL", "string with URL", "string with URL", "string with URL"],
      "duration": "string",
      "keyPoints": ["string", "string", "string", "string", "string"],
      "practicalTask": "string",
      "tips": ["string", "string", "string"]
    }
  ]
}
`;
const quizPrompt = `
You are an expert quiz creator. Generate 10 multiple-choice questions for a specific module in a learning path.
Each question should:
- Be relevant to the module topic
- Have 4 options (A, B, C, D)
- Have only one correct answer
- Test understanding, not just memorization
- Vary in difficulty (include easy, medium, and challenging questions)
- Cover different aspects of the module content

Format the response as a JSON object:
{
  "questions": [
    {
      "question": "string",
      "options": {
        "A": "string",
        "B": "string",
        "C": "string",
        "D": "string"
      },
      "correctAnswer": "A|B|C|D",
      "explanation": "Brief explanation of why the answer is correct"
    }
  ]
}
`;

export const generateLearningPath = async (skill) => {
  try {
    const response = await axios.post(
      API_URL,
      {
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: learningPathPrompt },
          {
            role: "user",
            content: `Generate a structured learning path for: ${skill}`,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const content = response.data.choices[0].message.content;
    return JSON.parse(content);
  } catch (error) {
    console.error("Error generating learning path:", error);
    throw error;
  }
};

export const generateQuiz = async (moduleName) => {
  try {
    const response = await axios.post(
      API_URL,
      {
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: quizPrompt },
          {
            role: "user",
            content: `Generate a quiz for the module: ${moduleName}`,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return JSON.parse(response.data.choices[0].message.content);
  } catch (error) {
    console.error("Error generating quiz:", error);
    throw error;
  }
};

export const evaluateQuiz = async (moduleName, questions, userAnswers) => {
  try {
    const response = await axios.post(
      API_URL,
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `You are a quiz evaluator. Evaluate the answers and return in this format:
            Score: X/10 (X correct out of 10)
            
            Feedback:
            [For each incorrect answer, provide:
            - Question number
            - The user's incorrect answer
            - The correct answer
            - A brief explanation why]
            
            If all answers are correct, include an encouraging message.`,
          },
          {
            role: "user",
            content: `Evaluate quiz answers for ${moduleName}:\n${JSON.stringify(
              {
                questions,
                userAnswers,
              }
            )}`,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("Error evaluating quiz:", error);
    throw error;
  }
};

export const getRecommendedResources = async (skill) => {
  try {
    const response = await axios.post(
      API_URL,
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `You are a career guide specialized in helping people find learning resources. Provide a list of 5 high-quality, free resources for learning a specific skill. Include actual URLs to real resources like YouTube channels, free courses, documentation, open-source projects, etc. 
            
Format the response as a JSON array of objects:
[
  {
    "title": "Resource name",
    "type": "Video|Course|Documentation|Tool|Book",
    "url": "actual URL to the resource",
    "description": "Brief description of what this resource offers"
  }
]`,
          },
          {
            role: "user",
            content: `Find free learning resources for: ${skill}`,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return JSON.parse(response.data.choices[0].message.content);
  } catch (error) {
    console.error("Error getting resources:", error);
    throw error;
  }
};