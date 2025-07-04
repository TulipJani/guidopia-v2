import { useState, useEffect } from "react";
import { generateLearningPath, getRecommendedResources } from "../api"; // Assuming api.js is in ../api
import LearningPath from "../components/LearningPath"; // Assuming LearningPath.js is in ../components
import { MessageCircle, Search } from "lucide-react"; // For Counseling CTA button icon & Search

export default function Upskilling() {
  const [selectedSkill, setSelectedSkill] = useState(() => {
    const saved = localStorage.getItem("selectedSkill");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error parsing selectedSkill from localStorage:", e);
        localStorage.removeItem("selectedSkill");
        return null;
      }
    }
    return null;
  });

  const [learningPathData, setLearningPathData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [freeResources, setFreeResources] = useState(null);
  const [isLoadingResources, setIsLoadingResources] = useState(false);
  const [profile, setProfile] = useState(null);

  const popularSkills = [
    // Core Web Development & Frontend
    { name: "React Development", category: "Frontend" },
    { name: "Vue.js Development", category: "Frontend" },
    { name: "Angular Development", category: "Frontend" },
    { name: "Svelte Development", category: "Frontend" },
    { name: "Next.js Development", category: "Frontend" },
    { name: "Nuxt.js Development", category: "Frontend" },
    { name: "TypeScript Development", category: "Frontend" },
    { name: "JavaScript ES6+", category: "Frontend" },
    { name: "HTML5 & CSS3", category: "Frontend" },
    { name: "Sass/SCSS", category: "Frontend" },
    { name: "Tailwind CSS", category: "Frontend" },
    { name: "Bootstrap Framework", category: "Frontend" },
    { name: "Webpack Configuration", category: "Frontend" },
    { name: "Vite Build Tool", category: "Frontend" },
    { name: "Progressive Web Apps (PWA)", category: "Frontend" },
    { name: "Web Components", category: "Frontend" },
    { name: "JAMstack Development", category: "Frontend" },
    { name: "Static Site Generation", category: "Frontend" },
    { name: "Server-Side Rendering (SSR)", category: "Frontend" },
    { name: "Web Performance Optimization", category: "Frontend" },
    { name: "Web Accessibility (a11y)", category: "Frontend" },
    { name: "Cross-Browser Compatibility", category: "Frontend" },
    { name: "Responsive Web Design", category: "Frontend" },
    { name: "Web Assembly (WASM)", category: "Frontend" },
    { name: "Micro-Frontend Architecture", category: "Frontend" },

    // Backend Development & APIs
    { name: "Node.js Development", category: "Backend" },
    { name: "Express.js Framework", category: "Backend" },
    { name: "Python Flask", category: "Backend" },
    { name: "Python Django", category: "Backend" },
    { name: "FastAPI Development", category: "Backend" },
    { name: "Ruby on Rails", category: "Backend" },
    { name: "PHP Laravel", category: "Backend" },
    { name: "Java Spring Boot", category: "Backend" },
    { name: "C# .NET Core", category: "Backend" },
    { name: "Go (Golang) Development", category: "Backend" },
    { name: "Rust Programming", category: "Backend" },
    { name: "Kotlin Backend", category: "Backend" },
    { name: "Scala Development", category: "Backend" },
    { name: "RESTful API Design", category: "Backend" },
    { name: "GraphQL Development", category: "Backend" },
    { name: "gRPC Development", category: "Backend" },
    { name: "Microservices Architecture", category: "Backend" },
    { name: "Serverless Computing", category: "Backend" },
    { name: "Event-Driven Architecture", category: "Backend" },
    { name: "API Gateway Design", category: "Backend" },
    { name: "Message Queue Systems", category: "Backend" },
    { name: "Real-time Communication", category: "Backend" },
    { name: "WebSocket Development", category: "Backend" },
    { name: "Background Job Processing", category: "Backend" },
    { name: "Caching Strategies", category: "Backend" },

    // Mobile Development
    { name: "React Native Development", category: "Mobile" },
    { name: "Flutter Development", category: "Mobile" },
    { name: "iOS Swift Development", category: "Mobile" },
    { name: "Android Kotlin Development", category: "Mobile" },
    { name: "Xamarin Development", category: "Mobile" },
    { name: "Ionic Framework", category: "Mobile" },
    { name: "PhoneGap/Cordova", category: "Mobile" },
    { name: "Native Mobile UI/UX", category: "Mobile" },
    { name: "Mobile App Testing", category: "Mobile" },
    { name: "App Store Optimization", category: "Mobile" },
    { name: "Mobile Security", category: "Mobile" },
    { name: "Push Notifications", category: "Mobile" },
    { name: "Mobile Analytics", category: "Mobile" },
    { name: "Offline-First Development", category: "Mobile" },
    { name: "Mobile Device APIs", category: "Mobile" },
    { name: "Wearable App Development", category: "Mobile" },
    { name: "AR Mobile Apps", category: "Mobile" },
    { name: "Mobile Payment Integration", category: "Mobile" },
    { name: "Cross-Platform Development", category: "Mobile" },
    { name: "Mobile Performance Optimization", category: "Mobile" },

    // Database & Data Management
    { name: "SQL Database Design", category: "Database" },
    { name: "PostgreSQL Administration", category: "Database" },
    { name: "MySQL Development", category: "Database" },
    { name: "MongoDB Development", category: "Database" },
    { name: "Redis Caching", category: "Database" },
    { name: "Elasticsearch", category: "Database" },
    { name: "Neo4j Graph Database", category: "Database" },
    { name: "Cassandra Database", category: "Database" },
    { name: "DynamoDB", category: "Database" },
    { name: "Firebase Firestore", category: "Database" },
    { name: "Supabase Development", category: "Database" },
    { name: "Database Performance Tuning", category: "Database" },
    { name: "Data Modeling", category: "Database" },
    { name: "Database Migration", category: "Database" },
    { name: "ACID Transactions", category: "Database" },
    { name: "NoSQL Database Design", category: "Database" },
    { name: "Time-Series Databases", category: "Database" },
    { name: "In-Memory Databases", category: "Database" },
    { name: "Database Sharding", category: "Database" },
    { name: "Data Warehousing", category: "Database" },

    // Cloud Computing & Infrastructure
    { name: "Amazon Web Services (AWS)", category: "Cloud" },
    { name: "Microsoft Azure", category: "Cloud" },
    { name: "Google Cloud Platform (GCP)", category: "Cloud" },
    { name: "Digital Ocean", category: "Cloud" },
    { name: "Heroku Deployment", category: "Cloud" },
    { name: "Vercel Deployment", category: "Cloud" },
    { name: "Netlify Hosting", category: "Cloud" },
    { name: "Cloudflare Services", category: "Cloud" },
    { name: "AWS Lambda", category: "Cloud" },
    { name: "AWS EC2", category: "Cloud" },
    { name: "AWS S3", category: "Cloud" },
    { name: "AWS RDS", category: "Cloud" },
    { name: "Azure Functions", category: "Cloud" },
    { name: "Google Cloud Functions", category: "Cloud" },
    { name: "Cloud Storage Solutions", category: "Cloud" },
    { name: "Content Delivery Networks", category: "Cloud" },
    { name: "Load Balancing", category: "Cloud" },
    { name: "Auto-scaling", category: "Cloud" },
    { name: "Cloud Monitoring", category: "Cloud" },
    { name: "Multi-Cloud Strategy", category: "Cloud" },
    { name: "Hybrid Cloud Solutions", category: "Cloud" },
    { name: "Cloud Cost Optimization", category: "Cloud" },
    { name: "Cloud Migration", category: "Cloud" },
    { name: "Infrastructure as Code (IaC)", category: "Cloud" },
    { name: "Cloud Native Development", category: "Cloud" },

    // DevOps & Infrastructure
    { name: "Docker Containerization", category: "DevOps" },
    { name: "Kubernetes Orchestration", category: "DevOps" },
    { name: "Jenkins CI/CD", category: "DevOps" },
    { name: "GitHub Actions", category: "DevOps" },
    { name: "GitLab CI/CD", category: "DevOps" },
    { name: "Terraform", category: "DevOps" },
    { name: "Ansible Automation", category: "DevOps" },
    { name: "Chef Configuration", category: "DevOps" },
    { name: "Puppet Automation", category: "DevOps" },
    { name: "Vagrant Development", category: "DevOps" },
    { name: "Prometheus Monitoring", category: "DevOps" },
    { name: "Grafana Dashboards", category: "DevOps" },
    { name: "ELK Stack (Elasticsearch, Logstash, Kibana)", category: "DevOps" },
    { name: "Linux System Administration", category: "DevOps" },
    { name: "Bash Scripting", category: "DevOps" },
    { name: "Nginx Configuration", category: "DevOps" },
    { name: "Apache Web Server", category: "DevOps" },
    { name: "Reverse Proxy Setup", category: "DevOps" },
    { name: "Blue-Green Deployment", category: "DevOps" },
    { name: "Canary Deployment", category: "DevOps" },
    { name: "GitOps", category: "DevOps" },
    { name: "Container Security", category: "DevOps" },
    { name: "Service Mesh (Istio)", category: "DevOps" },
    { name: "Observability", category: "DevOps" },
    { name: "Site Reliability Engineering", category: "DevOps" },

    // Artificial Intelligence & Machine Learning
    { name: "Python for AI/ML", category: "AI/ML" },
    { name: "TensorFlow Development", category: "AI/ML" },
    { name: "PyTorch Development", category: "AI/ML" },
    { name: "Scikit-learn", category: "AI/ML" },
    { name: "Keras Framework", category: "AI/ML" },
    { name: "Pandas Data Analysis", category: "AI/ML" },
    { name: "NumPy Computations", category: "AI/ML" },
    { name: "Matplotlib Visualization", category: "AI/ML" },
    { name: "Jupyter Notebooks", category: "AI/ML" },
    { name: "Google Colab", category: "AI/ML" },
    { name: "Deep Learning", category: "AI/ML" },
    { name: "Neural Networks", category: "AI/ML" },
    { name: "Convolutional Neural Networks", category: "AI/ML" },
    { name: "Recurrent Neural Networks", category: "AI/ML" },
    { name: "Transformer Models", category: "AI/ML" },
    { name: "BERT & GPT Models", category: "AI/ML" },
    { name: "Large Language Models (LLMs)", category: "AI/ML" },
    { name: "Prompt Engineering", category: "AI/ML" },
    { name: "Fine-tuning Models", category: "AI/ML" },
    { name: "Model Deployment", category: "AI/ML" },
    { name: "MLOps", category: "AI/ML" },
    { name: "Model Versioning", category: "AI/ML" },
    { name: "A/B Testing for ML", category: "AI/ML" },
    { name: "Computer Vision", category: "AI/ML" },
    { name: "OpenCV", category: "AI/ML" },
    { name: "Natural Language Processing", category: "AI/ML" },
    { name: "Speech Recognition", category: "AI/ML" },
    { name: "Text-to-Speech", category: "AI/ML" },
    { name: "Reinforcement Learning", category: "AI/ML" },
    { name: "Generative AI", category: "AI/ML" },
    { name: "Stable Diffusion", category: "AI/ML" },
    { name: "DALL-E Integration", category: "AI/ML" },
    { name: "ChatGPT API Integration", category: "AI/ML" },
    { name: "AI Ethics", category: "AI/ML" },
    { name: "Bias Detection in AI", category: "AI/ML" },
    { name: "Explainable AI", category: "AI/ML" },
    { name: "Edge AI", category: "AI/ML" },
    { name: "Federated Learning", category: "AI/ML" },
    { name: "AutoML", category: "AI/ML" },
    { name: "AI Model Optimization", category: "AI/ML" },

    // Data Science & Analytics
    { name: "Data Analysis", category: "Data Science" },
    { name: "Statistical Analysis", category: "Data Science" },
    { name: "Data Visualization", category: "Data Science" },
    { name: "Tableau Development", category: "Data Science" },
    { name: "Power BI", category: "Data Science" },
    { name: "D3.js Visualization", category: "Data Science" },
    { name: "R Programming", category: "Data Science" },
    { name: "Julia Programming", category: "Data Science" },
    { name: "SPSS Analysis", category: "Data Science" },
    { name: "SAS Programming", category: "Data Science" },
    { name: "Apache Spark", category: "Data Science" },
    { name: "Hadoop Ecosystem", category: "Data Science" },
    { name: "Data Mining", category: "Data Science" },
    { name: "Predictive Analytics", category: "Data Science" },
    { name: "Time Series Analysis", category: "Data Science" },
    { name: "Cluster Analysis", category: "Data Science" },
    { name: "Feature Engineering", category: "Data Science" },
    { name: "Data Cleaning", category: "Data Science" },
    { name: "ETL Processes", category: "Data Science" },
    { name: "Data Pipeline Design", category: "Data Science" },
    { name: "Business Intelligence", category: "Data Science" },
    { name: "Data Warehousing", category: "Data Science" },
    { name: "Real-time Analytics", category: "Data Science" },
    { name: "Customer Analytics", category: "Data Science" },
    { name: "Marketing Analytics", category: "Data Science" },
    { name: "Web Analytics", category: "Data Science" },
    { name: "Social Media Analytics", category: "Data Science" },
    { name: "A/B Testing", category: "Data Science" },
    { name: "Experimental Design", category: "Data Science" },
    { name: "Data Storytelling", category: "Data Science" },

    // Cybersecurity & Privacy
    { name: "Ethical Hacking", category: "Cybersecurity" },
    { name: "Penetration Testing", category: "Cybersecurity" },
    { name: "Network Security", category: "Cybersecurity" },
    { name: "Web Application Security", category: "Cybersecurity" },
    { name: "Mobile Security", category: "Cybersecurity" },
    { name: "Cloud Security", category: "Cybersecurity" },
    { name: "Incident Response", category: "Cybersecurity" },
    { name: "Digital Forensics", category: "Cybersecurity" },
    { name: "Malware Analysis", category: "Cybersecurity" },
    { name: "Threat Intelligence", category: "Cybersecurity" },
    { name: "Risk Assessment", category: "Cybersecurity" },
    { name: "Compliance Management", category: "Cybersecurity" },
    { name: "GDPR Compliance", category: "Cybersecurity" },
    { name: "SOC Analysis", category: "Cybersecurity" },
    { name: "SIEM Tools", category: "Cybersecurity" },
    { name: "Vulnerability Assessment", category: "Cybersecurity" },
    { name: "Security Auditing", category: "Cybersecurity" },
    { name: "Cryptography", category: "Cybersecurity" },
    { name: "Zero Trust Security", category: "Cybersecurity" },
    { name: "Identity Management", category: "Cybersecurity" },
    { name: "Multi-Factor Authentication", category: "Cybersecurity" },
    { name: "Secure Coding Practices", category: "Cybersecurity" },
    { name: "API Security", category: "Cybersecurity" },
    { name: "Container Security", category: "Cybersecurity" },
    { name: "IoT Security", category: "Cybersecurity" },

    // UI/UX Design & Product Design
    { name: "User Experience (UX) Design", category: "Design" },
    { name: "User Interface (UI) Design", category: "Design" },
    { name: "Product Design", category: "Design" },
    { name: "Interaction Design", category: "Design" },
    { name: "Service Design", category: "Design" },
    { name: "Design Systems", category: "Design" },
    { name: "Information Architecture", category: "Design" },
    { name: "Wireframing", category: "Design" },
    { name: "Prototyping", category: "Design" },
    { name: "User Research", category: "Design" },
    { name: "Usability Testing", category: "Design" },
    { name: "A/B Testing Design", category: "Design" },
    { name: "Accessibility Design", category: "Design" },
    { name: "Design Thinking", category: "Design" },
    { name: "Human-Computer Interaction", category: "Design" },
    { name: "Figma Design", category: "Design" },
    { name: "Sketch Design", category: "Design" },
    { name: "Adobe XD", category: "Design" },
    { name: "InVision Prototyping", category: "Design" },
    { name: "Principle Animation", category: "Design" },
    { name: "Framer Design", category: "Design" },
    { name: "Webflow Design", category: "Design" },
    { name: "Adobe Creative Suite", category: "Design" },
    { name: "Photoshop Design", category: "Design" },
    { name: "Illustrator Design", category: "Design" },
    { name: "After Effects", category: "Design" },
    { name: "Cinema 4D", category: "Design" },
    { name: "Blender 3D", category: "Design" },
    { name: "Unity UI Design", category: "Design" },
    { name: "Game UI/UX", category: "Design" },

    // Digital Marketing & Growth
    { name: "Digital Marketing Strategy", category: "Marketing" },
    { name: "Search Engine Optimization (SEO)", category: "Marketing" },
    { name: "Search Engine Marketing (SEM)", category: "Marketing" },
    { name: "Google Ads", category: "Marketing" },
    { name: "Facebook Advertising", category: "Marketing" },
    { name: "Instagram Marketing", category: "Marketing" },
    { name: "LinkedIn Marketing", category: "Marketing" },
    { name: "TikTok Marketing", category: "Marketing" },
    { name: "YouTube Marketing", category: "Marketing" },
    { name: "Content Marketing", category: "Marketing" },
    { name: "Email Marketing", category: "Marketing" },
    { name: "Marketing Automation", category: "Marketing" },
    { name: "Growth Hacking", category: "Marketing" },
    { name: "Conversion Rate Optimization", category: "Marketing" },
    { name: "Affiliate Marketing", category: "Marketing" },
    { name: "Influencer Marketing", category: "Marketing" },
    { name: "Programmatic Advertising", category: "Marketing" },
    { name: "Retargeting Campaigns", category: "Marketing" },
    { name: "Customer Journey Mapping", category: "Marketing" },
    { name: "Marketing Analytics", category: "Marketing" },
    { name: "Google Analytics", category: "Marketing" },
    { name: "Facebook Pixel", category: "Marketing" },
    { name: "Tag Manager", category: "Marketing" },
    { name: "Mixpanel Analytics", category: "Marketing" },
    { name: "Hotjar User Behavior", category: "Marketing" },
    { name: "Customer Acquisition", category: "Marketing" },
    { name: "Customer Retention", category: "Marketing" },
    { name: "Product Marketing", category: "Marketing" },
    { name: "Brand Strategy", category: "Marketing" },
    { name: "Community Management", category: "Marketing" },

    // Content Creation & Communication
    { name: "Content Writing", category: "Content" },
    { name: "Copywriting", category: "Content" },
    { name: "Technical Writing", category: "Content" },
    { name: "UX Writing", category: "Content" },
    { name: "Blog Writing", category: "Content" },
    { name: "Social Media Content", category: "Content" },
    { name: "Email Copy", category: "Content" },
    { name: "Sales Copy", category: "Content" },
    { name: "Video Scripting", category: "Content" },
    { name: "Podcast Production", category: "Content" },
    { name: "Video Production", category: "Content" },
    { name: "Video Editing", category: "Content" },
    { name: "Motion Graphics", category: "Content" },
    { name: "Audio Editing", category: "Content" },
    { name: "Photography", category: "Content" },
    { name: "Stock Photography", category: "Content" },
    { name: "Graphic Design", category: "Content" },
    { name: "Infographic Design", category: "Content" },
    { name: "Presentation Design", category: "Content" },
    { name: "SEO Writing", category: "Content" },
    { name: "Content Strategy", category: "Content" },
    { name: "Content Management", category: "Content" },
    { name: "WordPress Development", category: "Content" },
    { name: "Webinar Hosting", category: "Content" },
    { name: "Live Streaming", category: "Content" },
    { name: "Course Creation", category: "Content" },
    { name: "E-learning Development", category: "Content" },
    { name: "Translation Services", category: "Content" },
    { name: "Localization", category: "Content" },
    { name: "Brand Voice Development", category: "Content" },

    // Project Management & Business
    { name: "Project Management", category: "Management" },
    { name: "Agile Methodology", category: "Management" },
    { name: "Scrum Framework", category: "Management" },
    { name: "Kanban Method", category: "Management" },
    { name: "Lean Startup", category: "Management" },
    { name: "Product Management", category: "Management" },
    { name: "Product Owner Role", category: "Management" },
    { name: "Stakeholder Management", category: "Management" },
    { name: "Risk Management", category: "Management" },
    { name: "Change Management", category: "Management" },
    { name: "Team Leadership", category: "Management" },
    { name: "Remote Team Management", category: "Management" },
    { name: "Cross-functional Teams", category: "Management" },
    { name: "OKRs (Objectives & Key Results)", category: "Management" },
    { name: "KPI Management", category: "Management" },
    { name: "Business Analysis", category: "Management" },
    { name: "Requirements Gathering", category: "Management" },
    { name: "Process Improvement", category: "Management" },
    { name: "Quality Assurance", category: "Management" },
    { name: "Vendor Management", category: "Management" },
    { name: "Budget Management", category: "Management" },
    { name: "Resource Planning", category: "Management" },
    { name: "Timeline Management", category: "Management" },
    { name: "Client Relations", category: "Management" },
    { name: "Strategic Planning", category: "Management" },

    // Emerging Technologies
    { name: "Blockchain Development", category: "Emerging Tech" },
    { name: "Smart Contract Development", category: "Emerging Tech" },
    { name: "Ethereum Development", category: "Emerging Tech" },
    { name: "Solidity Programming", category: "Emerging Tech" },
    { name: "DeFi Development", category: "Emerging Tech" },
    { name: "NFT Development", category: "Emerging Tech" },
    { name: "Web3 Development", category: "Emerging Tech" },
    { name: "Cryptocurrency Trading", category: "Emerging Tech" },
    { name: "Crypto Analytics", category: "Emerging Tech" },
    { name: "Metaverse Development", category: "Emerging Tech" },
    { name: "Virtual Reality (VR)", category: "Emerging Tech" },
    { name: "Augmented Reality (AR)", category: "Emerging Tech" },
    { name: "Mixed Reality (MR)", category: "Emerging Tech" },
    { name: "Unity 3D Development", category: "Emerging Tech" },
    { name: "Unreal Engine", category: "Emerging Tech" },
    { name: "AR Kit Development", category: "Emerging Tech" },
    { name: "ARCore Development", category: "Emerging Tech" },
    { name: "WebXR Development", category: "Emerging Tech" },
    { name: "Internet of Things (IoT)", category: "Emerging Tech" },
    { name: "IoT Device Programming", category: "Emerging Tech" },
    { name: "Arduino Programming", category: "Emerging Tech" },
    { name: "Raspberry Pi", category: "Emerging Tech" },
    { name: "Edge Computing", category: "Emerging Tech" },
    { name: "5G Technology", category: "Emerging Tech" },
    { name: "Quantum Computing", category: "Emerging Tech" },
    { name: "Quantum Programming", category: "Emerging Tech" },
    { name: "Robotics Programming", category: "Emerging Tech" },
    { name: "Drone Technology", category: "Emerging Tech" },
    { name: "Autonomous Vehicles", category: "Emerging Tech" },
    { name: "Smart City Technology", category: "Emerging Tech" },

    // FinTech & Financial Technology
    { name: "Financial Technology (FinTech)", category: "FinTech" },
    { name: "Payment Gateway Integration", category: "FinTech" },
    { name: "Digital Wallets", category: "FinTech" },
    { name: "Mobile Banking", category: "FinTech" },
    { name: "Robo-Advisors", category: "FinTech" },
    { name: "Algorithmic Trading", category: "FinTech" },
    { name: "High-Frequency Trading", category: "FinTech" },
    { name: "Credit Scoring Models", category: "FinTech" },
    { name: "Risk Analytics", category: "FinTech" },
    { name: "Fraud Detection", category: "FinTech" },
    { name: "Regulatory Technology (RegTech)", category: "FinTech" },
    { name: "Know Your Customer (KYC)", category: "FinTech" },
    { name: "Anti-Money Laundering (AML)", category: "FinTech" },
    { name: "Open Banking", category: "FinTech" },
    { name: "API Banking", category: "FinTech" },
    { name: "Cryptocurrency Development", category: "FinTech" },
    { name: "Stablecoin Development", category: "FinTech" },
    { name: "Central Bank Digital Currency", category: "FinTech" },
    { name: "Peer-to-Peer Lending", category: "FinTech" },
    { name: "Crowdfunding Platforms", category: "FinTech" },
    { name: "InsurTech", category: "FinTech" },
    { name: "WealthTech", category: "FinTech" },
    { name: "Trading Platforms", category: "FinTech" },
    { name: "Financial APIs", category: "FinTech" },
    { name: "Quantitative Finance", category: "FinTech" },

    // Health Tech & Biotech
    { name: "Health Technology", category: "HealthTech" },
    { name: "Telemedicine", category: "HealthTech" },
    { name: "Medical Device Software", category: "HealthTech" },
    { name: "Electronic Health Records", category: "HealthTech" },
    { name: "Health Information Systems", category: "HealthTech" },
    { name: "Medical Imaging", category: "HealthTech" },
    { name: "Bioinformatics", category: "HealthTech" },
    { name: "Genomics Data Analysis", category: "HealthTech" },
    { name: "Clinical Trial Software", category: "HealthTech" },
    { name: "Medical AI/ML", category: "HealthTech" },
    { name: "Drug Discovery AI", category: "HealthTech" },
    { name: "Digital Therapeutics", category: "HealthTech" },
    { name: "Wearable Health Tech", category: "HealthTech" },
    { name: "Health Monitoring Apps", category: "HealthTech" },
    { name: "Mental Health Apps", category: "HealthTech" },
    { name: "Fitness Technology", category: "HealthTech" },
    { name: "Nutrition Technology", category: "HealthTech" },
    { name: "Medical Chatbots", category: "HealthTech" },
    { name: "Health Data Privacy", category: "HealthTech" },
    { name: "HIPAA Compliance", category: "HealthTech" },
    { name: "Medical IoT", category: "HealthTech" },
    { name: "Remote Patient Monitoring", category: "HealthTech" },
    { name: "Personalized Medicine", category: "HealthTech" },
    { name: "Health Analytics", category: "HealthTech" },
    { name: "Clinical Decision Support", category: "HealthTech" },

    // Green Tech & Sustainability
    { name: "Green Technology", category: "GreenTech" },
    { name: "Renewable Energy Tech", category: "GreenTech" },
    { name: "Solar Technology", category: "GreenTech" },
    { name: "Wind Energy Technology", category: "GreenTech" },
    { name: "Energy Storage Systems", category: "GreenTech" },
    { name: "Smart Grid Technology", category: "GreenTech" },
    { name: "Electric Vehicle Tech", category: "GreenTech" },
    { name: "Carbon Footprint Analysis", category: "GreenTech" },
    { name: "Environmental Monitoring", category: "GreenTech" },
    { name: "Waste Management Tech", category: "GreenTech" },
    { name: "Water Conservation Tech", category: "GreenTech" },
    { name: "Sustainable Agriculture", category: "GreenTech" },
    { name: "Precision Agriculture", category: "GreenTech" },
    { name: "Climate Data Analysis", category: "GreenTech" },
    { name: "Energy Efficiency", category: "GreenTech" },
    { name: "Green Building Technology", category: "GreenTech" },
    { name: "Circular Economy Tech", category: "GreenTech" },
    { name: "ESG Technology", category: "GreenTech" },
    { name: "Sustainability Reporting", category: "GreenTech" },
    { name: "Green Finance Tech", category: "GreenTech" },
    { name: "Carbon Trading Platforms", category: "GreenTech" },
    { name: "Life Cycle Assessment", category: "GreenTech" },
    { name: "Clean Energy Software", category: "GreenTech" },
    { name: "Environmental Compliance", category: "GreenTech" },
    { name: "Green Supply Chain", category: "GreenTech" },

    // Gaming & Entertainment Tech
    { name: "Game Development", category: "Gaming" },
    { name: "Unity Game Engine", category: "Gaming" },
    { name: "Unreal Engine Development", category: "Gaming" },
    { name: "Mobile Game Development", category: "Gaming" },
    { name: "PC Game Development", category: "Gaming" },
    { name: "Console Game Development", category: "Gaming" },
    { name: "Indie Game Development", category: "Gaming" },
    { name: "Game Design", category: "Gaming" },
    { name: "Level Design", category: "Gaming" },
    { name: "Character Design", category: "Gaming" },
    { name: "Game Art", category: "Gaming" },
    { name: "3D Modeling for Games", category: "Gaming" },
    { name: "Game Animation", category: "Gaming" },
    { name: "Game Physics", category: "Gaming" },
    { name: "Game AI Programming", category: "Gaming" },
    { name: "Multiplayer Game Development", category: "Gaming" },
    { name: "VR Game Development", category: "Gaming" },
    { name: "AR Game Development", category: "Gaming" },
    { name: "Game Testing", category: "Gaming" },
    { name: "Game Analytics", category: "Gaming" },
    { name: "Game Monetization", category: "Gaming" },
    { name: "Esports Technology", category: "Gaming" },
    { name: "Game Streaming Tech", category: "Gaming" },
    { name: "Cloud Gaming", category: "Gaming" },
    { name: "Game Server Development", category: "Gaming" },
    { name: "Game Marketing", category: "Gaming" },
    { name: "Interactive Media", category: "Gaming" },
    { name: "Entertainment Software", category: "Gaming" },
    { name: "Streaming Platforms", category: "Gaming" },
    { name: "Content Creation Tools", category: "Gaming" },

    // Education Technology
    { name: "Educational Technology (EdTech)", category: "EdTech" },
    { name: "E-Learning Platforms", category: "EdTech" },
    { name: "Learning Management Systems", category: "EdTech" },
    { name: "Online Course Creation", category: "EdTech" },
    { name: "Adaptive Learning", category: "EdTech" },
    { name: "Personalized Learning", category: "EdTech" },
    { name: "AI in Education", category: "EdTech" },
    { name: "Educational Games", category: "EdTech" },
    { name: "Virtual Classrooms", category: "EdTech" },
    { name: "AR/VR in Education", category: "EdTech" },
    { name: "Student Analytics", category: "EdTech" },
    { name: "Assessment Technology", category: "EdTech" },
    { name: "Proctoring Software", category: "EdTech" },
    { name: "Educational Apps", category: "EdTech" },
    { name: "Language Learning Apps", category: "EdTech" },
    { name: "STEM Education Tools", category: "EdTech" },
    { name: "Coding Education", category: "EdTech" },
    { name: "Digital Literacy", category: "EdTech" },
    { name: "Microlearning", category: "EdTech" },
    { name: "Educational Content Management", category: "EdTech" },
    { name: "Student Information Systems", category: "EdTech" },
    { name: "Parent-Teacher Communication", category: "EdTech" },
    { name: "Educational Accessibility", category: "EdTech" },
    { name: "Remote Learning Tools", category: "EdTech" },
    { name: "Skill Assessment Platforms", category: "EdTech" },

    // Social Impact Technology
    { name: "Social Impact Technology", category: "Social Impact" },
    { name: "Civic Technology", category: "Social Impact" },
    { name: "Digital Democracy", category: "Social Impact" },
    { name: "Government Technology", category: "Social Impact" },
    { name: "Public Service Technology", category: "Social Impact" },
    { name: "NGO Technology Solutions", category: "Social Impact" },
    { name: "Disaster Response Technology", category: "Social Impact" },
    { name: "Emergency Management Systems", category: "Social Impact" },
    { name: "Humanitarian Technology", category: "Social Impact" },
    { name: "Digital Inclusion", category: "Social Impact" },
    { name: "Accessibility Technology", category: "Social Impact" },
    { name: "Assistive Technology", category: "Social Impact" },
    { name: "Social Enterprise Tech", category: "Social Impact" },
    { name: "Community Platform Development", category: "Social Impact" },
    { name: "Volunteer Management Systems", category: "Social Impact" },
    { name: "Donation Platforms", category: "Social Impact" },
    { name: "Transparency Technology", category: "Social Impact" },
    { name: "Open Government Data", category: "Social Impact" },
    { name: "Digital Rights", category: "Social Impact" },
    { name: "Privacy Technology", category: "Social Impact" },
    { name: "Anti-Discrimination Tech", category: "Social Impact" },
    { name: "Refugee Technology", category: "Social Impact" },
    { name: "Rural Technology Solutions", category: "Social Impact" },
    { name: "Digital Divide Solutions", category: "Social Impact" },
    { name: "Human Rights Technology", category: "Social Impact" },

    // Specialized Programming Languages
    { name: "Python Programming", category: "Programming" },
    { name: "JavaScript Programming", category: "Programming" },
    { name: "Java Programming", category: "Programming" },
    { name: "C++ Programming", category: "Programming" },
    { name: "C# Programming", category: "Programming" },
    { name: "C Programming", category: "Programming" },
    { name: "Rust Programming", category: "Programming" },
    { name: "Go Programming", category: "Programming" },
    { name: "Swift Programming", category: "Programming" },
    { name: "Kotlin Programming", category: "Programming" },
    { name: "Scala Programming", category: "Programming" },
    { name: "R Programming", category: "Programming" },
    { name: "MATLAB Programming", category: "Programming" },
    { name: "Julia Programming", category: "Programming" },
    { name: "Dart Programming", category: "Programming" },
    { name: "Haskell Programming", category: "Programming" },
    { name: "Clojure Programming", category: "Programming" },
    { name: "Erlang Programming", category: "Programming" },
    { name: "Elixir Programming", category: "Programming" },
    { name: "F# Programming", category: "Programming" },
    { name: "Assembly Language", category: "Programming" },
    { name: "Lua Programming", category: "Programming" },
    { name: "Ruby Programming", category: "Programming" },
    { name: "PHP Programming", category: "Programming" },
    { name: "Perl Programming", category: "Programming" },

    // Testing & Quality Assurance
    { name: "Software Testing", category: "Testing" },
    { name: "Test Automation", category: "Testing" },
    { name: "Selenium Testing", category: "Testing" },
    { name: "Cypress Testing", category: "Testing" },
    { name: "Jest Testing", category: "Testing" },
    { name: "Unit Testing", category: "Testing" },
    { name: "Integration Testing", category: "Testing" },
    { name: "End-to-End Testing", category: "Testing" },
    { name: "Performance Testing", category: "Testing" },
    { name: "Load Testing", category: "Testing" },
    { name: "Security Testing", category: "Testing" },
    { name: "Mobile App Testing", category: "Testing" },
    { name: "API Testing", category: "Testing" },
    { name: "Database Testing", category: "Testing" },
    { name: "User Acceptance Testing", category: "Testing" },
    { name: "Regression Testing", category: "Testing" },
    { name: "Cross-Browser Testing", category: "Testing" },
    { name: "Accessibility Testing", category: "Testing" },
    { name: "Test-Driven Development", category: "Testing" },
    { name: "Behavior-Driven Development", category: "Testing" },
    { name: "Test Case Design", category: "Testing" },
    { name: "Bug Tracking", category: "Testing" },
    { name: "Quality Metrics", category: "Testing" },
    { name: "Manual Testing", category: "Testing" },
    { name: "Exploratory Testing", category: "Testing" },

    // Sales & Customer Success
    { name: "Sales Technology", category: "Sales" },
    { name: "CRM Systems", category: "Sales" },
    { name: "Salesforce Administration", category: "Sales" },
    { name: "HubSpot Management", category: "Sales" },
    { name: "Sales Automation", category: "Sales" },
    { name: "Lead Generation", category: "Sales" },
    { name: "Prospecting Tools", category: "Sales" },
    { name: "Sales Analytics", category: "Sales" },
    { name: "Pipeline Management", category: "Sales" },
    { name: "Sales Forecasting", category: "Sales" },
    { name: "Customer Success", category: "Sales" },
    { name: "Onboarding Automation", category: "Sales" },
    { name: "Churn Prevention", category: "Sales" },
    { name: "Customer Health Scoring", category: "Sales" },
    { name: "Account Management", category: "Sales" },
    { name: "Territory Management", category: "Sales" },
    { name: "Quota Management", category: "Sales" },
    { name: "Commission Tracking", category: "Sales" },
    { name: "Sales Training Technology", category: "Sales" },
    { name: "Sales Enablement", category: "Sales" },
    { name: "Competitive Intelligence", category: "Sales" },
    { name: "Proposal Automation", category: "Sales" },
    { name: "Contract Management", category: "Sales" },
    { name: "Revenue Operations", category: "Sales" },
    { name: "Customer Feedback Systems", category: "Sales" },
  ];

  useEffect(() => {
    if (selectedSkill) {
      localStorage.setItem("selectedSkill", JSON.stringify(selectedSkill));
    } else {
      localStorage.removeItem("selectedSkill");
    }
  }, [selectedSkill]);

  useEffect(() => {
    if (selectedSkill) {
      let pathNeedsFetching = true;
      let resourcesNeedFetching = true;
      setLearningPathData(null);
      setFreeResources(null);

      // Check for cached learning path data
      const savedPathString = localStorage.getItem(`learningPath_${selectedSkill}`);
      if (savedPathString) {
        try {
          const parsedPath = JSON.parse(savedPathString);
          setLearningPathData(parsedPath);
          pathNeedsFetching = false;
        } catch (e) {
          console.error(`Error parsing learning path for '${selectedSkill}' from localStorage:`, e);
          localStorage.removeItem(`learningPath_${selectedSkill}`);
        }
      }

      // Check for cached resources
      const savedResourcesString = localStorage.getItem(`resources_${selectedSkill}`);
      if (savedResourcesString) {
        try {
          const parsedResources = JSON.parse(savedResourcesString);
          setFreeResources(parsedResources);
          resourcesNeedFetching = false;
        } catch (e) {
          console.error(`Error parsing resources for '${selectedSkill}' from localStorage:`, e);
          localStorage.removeItem(`resources_${selectedSkill}`);
        }
      }

      // Only fetch if we don't have cached data
      if (pathNeedsFetching) {
        const fetchLearningPath = async () => {
          setIsLoading(true);
          try {
            const data = await generateLearningPath(selectedSkill);
            if (data) {
              setLearningPathData(data);
              // Store in localStorage immediately after successful fetch
              localStorage.setItem(`learningPath_${selectedSkill}`, JSON.stringify(data));
            }
          } catch (error) {
            console.error(`Error fetching learning path for '${selectedSkill}':`, error);
            setLearningPathData(null);
          } finally {
            setIsLoading(false);
          }
        };
        fetchLearningPath();
      }

      // Only fetch if we don't have cached data
      if (resourcesNeedFetching) {
        const fetchResources = async () => {
          setIsLoadingResources(true);
          try {
            const resources = await getRecommendedResources(selectedSkill);
            if (resources) {
              setFreeResources(resources);
              // Store in localStorage immediately after successful fetch
              localStorage.setItem(`resources_${selectedSkill}`, JSON.stringify(resources));
            }
          } catch (error) {
            console.error(`Error fetching resources for '${selectedSkill}':`, error);
            setFreeResources(null);
          } finally {
            setIsLoadingResources(false);
          }
        };
        fetchResources();
      }
    } else {
      setLearningPathData(null);
      setFreeResources(null);
      setIsLoading(false);
      setIsLoadingResources(false);
    }
  }, [selectedSkill]);

  useEffect(() => {
    // Fetch user profile to check existing skills
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/user/profile', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
        }
      } catch (error) {
        console.error("Failed to fetch user profile", error);
      }
    };
    fetchProfile();
  }, []);

  const handleSkillSelect = async (skillName) => {
    if (selectedSkill === skillName) return;
    
    // Save the skill to the user's profile
    if (profile && !profile.skillsInProgress.some(s => s.name === skillName)) {
      const updatedSkills = [...profile.skillsInProgress, { name: skillName, progress: 0 }];
      try {
        await fetch('/api/user/profile', {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ skillsInProgress: updatedSkills })
        });
        // Update local profile state
        setProfile(prev => ({ ...prev, skillsInProgress: updatedSkills }));
      } catch (error) {
        console.error("Failed to update profile with new skill", error);
      }
    }

    setSelectedSkill(skillName);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    setSelectedSkill(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      handleSkillSelect(searchTerm.trim());
    }
  };

  const filteredSkills = popularSkills.filter((skill) =>
    skill.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const panelClasses = "bg-gray-900/20 backdrop-blur-sm border border-gray-800/30 p-6 md:p-8 shadow-lg rounded-2xl relative overflow-hidden";

  // Updated card classes for better fit in masonry, subtle hover, and active state
  const skillCardClasses = (skillName) => `
    p-5 bg-gray-800/40 border border-gray-700/60 rounded-xl 
    transition-all duration-300 ease-in-out text-left block 
    hover:border-cyan-500/70 hover:shadow-cyan-500/10 hover:shadow-lg hover:-translate-y-1
    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black
    ${selectedSkill === skillName ? 'ring-2 ring-cyan-500 border-cyan-500/80 shadow-cyan-500/20 shadow-lg' : ''}
  `;


  return (
    <div className="min-h-screen mt-10 bg-black text-white p-4 sm:p-6 space-y-8">
      {!selectedSkill ? (
        <div className="space-y-8">
          <div className={`${panelClasses}`}>
            <div className="mb-8">
              <h1 className="text-3xl sm:text-4xl font-semibold mb-3 text-white">
                Upskill Your Career
              </h1>
              <p className="text-gray-400 text-base sm:text-lg">
                Explore in-demand skills and launch your personalized learning journey.
              </p>
            </div>
            <div className="relative z-10">
              <h2 className="text-xl font-medium text-white mb-4">
                What skill would you like to master?
              </h2>
              <form onSubmit={handleSearchSubmit} className="mb-10">
                <div className="relative max-w-xl">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    placeholder="Search skills like 'Prompt Engineering', 'AI Ethics'..."
                    className="w-full py-3.5 pl-4 pr-12 bg-gray-800/50 border border-gray-700/50 text-white rounded-xl text-sm focus:border-cyan-600/70 focus:ring-1 focus:ring-cyan-600/70 focus:outline-none placeholder:text-gray-500 transition-colors duration-200"
                    onKeyPress={(e) => e.key === 'Enter' && handleSearchSubmit()}
                  />
                  <button
                    type="submit"
                    aria-label="Search skills"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-cyan-400 transition-colors duration-200 p-1.5 rounded-md"
                  >
                    <Search className="h-5 w-5" />
                  </button>
                </div>
              </form>

              {/* Pinterest-style Skill Feed */}
              <div className="columns-2 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 space-y-4">
                {(filteredSkills.length > 0 ? filteredSkills : popularSkills).map((skill) => (
                  <button
                    key={skill.name}
                    onClick={() => handleSkillSelect(skill.name)}
                    className={`break-inside-avoid-column w-full ${skillCardClasses(skill.name)}`}
                  >
                    <h4 className="font-semibold text-base text-white mb-1.5 line-clamp-2">{skill.name}</h4>
                    <p className="text-xs text-cyan-400/80 bg-cyan-500/10 px-2 py-0.5 rounded-full inline-block">
                      {skill.category}
                    </p>
                  </button>
                ))}
              </div>
              {filteredSkills.length === 0 && searchTerm && (
                <p className="text-center text-gray-500 mt-10">No skills found matching "{searchTerm}". Try a different search.</p>
              )}
            </div>
          </div>

          <div className={`${panelClasses}`}>
            <div className="relative z-10">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                <div className="text-center lg:text-left flex-1">
                  <div className="flex items-center justify-center lg:justify-start mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-xl flex items-center justify-center mr-4">
                      <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"> {/* Using existing SVG for consistency with dashboard */}
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-white">
                      Need Personalized Guidance?
                    </h3>
                  </div>
                  <p className="text-gray-400 text-lg leading-relaxed max-w-lg">
                    Get a 1-on-1 session with industry experts and mentors to create a custom learning roadmap.
                  </p>
                  <div className="flex items-center justify-center lg:justify-start mt-4 space-x-6 text-sm text-gray-500">
                    <span className="flex items-center">
                      <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                      Expert Mentors
                    </span>
                    <span className="flex items-center">
                      <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                      Custom Roadmap
                    </span>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <button
                    className="py-3.5 px-7 bg-gradient-to-r from-cyan-500 to-cyan-400 text-black font-semibold rounded-xl hover:from-cyan-400 hover:to-cyan-300 transition-all duration-200 inline-flex items-center text-base"
                  >
                    Schedule Counseling
                    <MessageCircle className="w-5 h-5 ml-2" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="my-10">
          <button
            onClick={handleBack}
            className="inline-flex items-center px-4 py-2 text-cyan-400 border border-cyan-400/30  rounded-xl hover:bg-cyan-400/10 transition-colors duration-200"
          >
            <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Skill Selection
          </button>

          {isLoading && !learningPathData ? (
            <div className={`${panelClasses}`}>
              <div className="relative z-10 flex flex-col items-center justify-center py-12">
                <div className="w-8 h-8 border-2 border-gray-700 border-t-cyan-400 rounded-full animate-spin"></div>
                <p className="text-gray-400 mt-4">Hold on! Creating a learning path...</p>
                <div className="flex items-center mt-3 space-x-1">
                  <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          ) : learningPathData ? (
            <>
              <LearningPath skill={selectedSkill} data={learningPathData} />

              {isLoadingResources && !freeResources ? (
                <div className={`${panelClasses}`}>
                  <div className="relative z-10 flex flex-col items-center justify-center py-12">
                    <div className="w-8 h-8 border-2 border-gray-700 border-t-green-400 rounded-full animate-spin"></div>
                    <p className="text-gray-400 mt-4">Fetching recommended resources...</p>
                  </div>
                </div>
              ) : freeResources && freeResources.length > 0 ? (
                <div className={`${panelClasses}`}>
                  <div className="relative z-10">
                    <h2 className="text-lg font-medium text-white mb-6">
                      Free Resources for {selectedSkill}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {freeResources.map((resource, index) => (
                        <a
                          key={index}
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-6 bg-gray-800/20 border border-gray-700/30 rounded-xl hover:border-gray-600/50 hover:-translate-y-0.5 hover:bg-gray-800/30 transition-all duration-200 block"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <span className="px-2 py-1 bg-cyan-400/10 text-cyan-400 text-xs font-medium border border-cyan-400/30 rounded-md">
                              {resource.type}
                            </span>
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </div>
                          <h3 className="font-medium text-white mb-2">{resource.title}</h3>
                          <p className="text-sm text-gray-400 leading-relaxed">{resource.description}</p>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              ) : !isLoadingResources ? (
                <div className={`${panelClasses}`}>
                  <div className="relative z-10 py-8 text-center">
                    <p className="text-gray-400">No free resources found for {selectedSkill} at the moment.</p>
                  </div>
                </div>
              ) : null}
            </>
          ) : !isLoading ? (
            <div className={`${panelClasses}`}>
              <div className="relative z-10 py-8 text-center">
                <p className="text-gray-400">Could not load learning path for {selectedSkill}. Please try again or select a different skill.</p>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}