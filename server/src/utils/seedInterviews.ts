import mongoose from "mongoose";
import { config } from "dotenv";
import InterviewExperience from "../models/InterviewExperience";
import User from "../models/user";

config();

const companies = ["Infosys", "Deloitte", "TCS", "Accenture", "Cognizant", "Wipro", "Capgemini", "IBM", "HCL", "EY", "PwC", "ServiceNow", "LTIMindtree", "DXC", "NTT DATA", "KPMG"];
const roles = ["ServiceNow Developer", "ServiceNow Administrator", "ServiceNow Technical Consultant", "ServiceNow Architect"];
const locations = ["Bengaluru", "Hyderabad", "Pune", "Chennai", "Noida", "Mumbai", "Remote"];
const difficulties = ["Easy", "Medium", "Hard"] as const;
const results = ["Selected", "Rejected", "Waiting", "Offer Received"] as const;
const experiences = ["Fresher", "1-2 Years", "2-3 Years", "3-5 Years", "5+ Years"];

const sampleTechQuestions = [
  { question: "Difference between Client Script and UI Policy?", answer: "Client Scripts are custom JavaScript code that run in the browser on form events. UI Policies are declarative rules to control field visibility, mandatory, and read-only states on forms without scripting.", topic: "Client Scripts", difficulty: "Easy" as const },
  { question: "What is a Business Rule?", answer: "Server-side script that runs when a record is displayed, inserted, updated, or deleted.", topic: "Business Rules", difficulty: "Easy" as const },
  { question: "Explain the difference between After and Async Business Rules.", answer: "After runs immediately after the database write, synchronously. Async is queued by the scheduler to run in the background without blocking the user.", topic: "Business Rules", difficulty: "Medium" as const },
  { question: "How do you optimize a slow GlideRecord query?", answer: "Use addQuery() instead of iterating over all records, avoid using getRowCount() unless necessary, use GlideAggregate for counting/aggregating, and ensure appropriate indexes are available.", topic: "GlideRecord", difficulty: "Medium" as const },
  { question: "What is Domain Separation?", answer: "A way to separate data, processes, and administrative tasks into logical groupings called domains.", topic: "Architecture", difficulty: "Hard" as const },
  { question: "Explain IntegrationHub vs legacy REST Messages.", answer: "IntegrationHub uses Flow Designer spokes for a low-code approach and easier maintenance, whereas legacy REST messages require writing script logic.", topic: "Integrations", difficulty: "Medium" as const },
  { question: "What are Transform Maps?", answer: "A set of field maps that determine the relationships between fields in an import set and fields in an existing ServiceNow table.", topic: "Data Management", difficulty: "Medium" as const }
];

const sampleScenarioQuestions = [
  { question: "An Incident is not updating after saving. What will you do?", answer: "Check for recursive Business Rules, check system logs for script errors, verify if any before business rule is aborting the action (setAbortAction), and check ACLs.", topic: "Troubleshooting", difficulty: "Medium" as const },
  { question: "A Flow Designer flow failed midway. How will you debug?", answer: "Open the flow context execution details, check the steps that ran successfully, identify the step that caused the error, and inspect the runtime values of the data pills.", topic: "Flow Designer", difficulty: "Medium" as const },
  { question: "Business Rule recursion is happening. How will you fix it?", answer: "Use current.setWorkflow(false) to prevent other business rules from running, or refine the business rule conditions to ensure it only triggers when necessary.", topic: "Business Rules", difficulty: "Hard" as const }
];

const sampleHRQuestions = [
  { question: "Tell me about yourself.", topic: "General", difficulty: "Easy" as const },
  { question: "Why ServiceNow?", topic: "General", difficulty: "Easy" as const },
  { question: "What is your greatest strength and weakness?", topic: "General", difficulty: "Easy" as const },
  { question: "Describe a time you faced a difficult technical challenge.", topic: "Behavioral", difficulty: "Medium" as const },
  { question: "Where do you see yourself in 3 years?", topic: "General", difficulty: "Easy" as const }
];

const getRandomElement = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const getRandomSubset = <T>(arr: T[], count: number): T[] => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const generateRandomExperience = (authorId: mongoose.Types.ObjectId) => {
  const company = getRandomElement(companies);
  const role = getRandomElement(roles);
  const diff = getRandomElement(difficulties as unknown as string[]) as "Easy"|"Medium"|"Hard";
  
  return {
    title: `${role} Interview Experience at ${company}`,
    company,
    role,
    experienceLevel: getRandomElement(experiences),
    location: getRandomElement(locations),
    interviewDate: new Date(Date.now() - Math.random() * 10000000000),
    difficulty: diff,
    overallRating: Math.floor(Math.random() * 3) + 3, // 3 to 5
    result: getRandomElement(results as unknown as string[]) as any,
    rounds: [
      {
        name: "Technical Round 1",
        duration: "45 Minutes",
        questionsAsked: "Core ServiceNow concepts, ITSM, Client Scripts, Business Rules.",
        candidateExperience: "The interviewer was friendly and focused heavily on practical scenarios.",
        tips: "Brush up on Business Rule timings and GlideRecord queries."
      },
      {
        name: "Managerial Round",
        duration: "30 Minutes",
        questionsAsked: "Past project experience, handling tough clients, Agile methodology.",
        candidateExperience: "Standard behavioral and project-focused questions.",
        tips: "Be ready to explain your resume in detail."
      }
    ],
    technicalQuestions: getRandomSubset(sampleTechQuestions, 3),
    scenarioQuestions: getRandomSubset(sampleScenarioQuestions, 1),
    hrQuestions: getRandomSubset(sampleHRQuestions, 2),
    codingQuestions: [],
    preparationTips: "I used the NowScripts platform and ServiceNow developer documentation heavily. Practicing mock interviews also helped.",
    resources: "NowScripts, ServiceNow Docs, NowLearning",
    mistakes: "I initially struggled with explaining Domain Separation clearly. Don't skip advanced topics if you are applying for senior roles.",
    overallExperience: "Overall a smooth process. They focused a lot on practical knowledge rather than just textbook definitions.",
    tags: [role, company, "ITSM", "ServiceNow"],
    author: authorId,
    likes: [],
    bookmarks: [],
    views: Math.floor(Math.random() * 500),
    comments: [],
    status: "Approved" // Approve by default for seed data
  };
};

export const seedInterviews = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.log("MONGO_URI is not defined.");
      return;
    }
    
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for seeding...");

    // Find admin or any user to assign as author
    let adminUser = await User.findOne({ role: "Super Admin" });
    if (!adminUser) {
        adminUser = await User.findOne({});
    }
    if (!adminUser) {
        console.log("No users found in the database. Please run main seeder first.");
        return;
    }

    console.log("Clearing existing interview experiences...");
    await InterviewExperience.deleteMany({});

    const experiencesToInsert = [];
    for (let i = 0; i < 25; i++) {
      experiencesToInsert.push(generateRandomExperience(adminUser._id));
    }

    await InterviewExperience.insertMany(experiencesToInsert);
    console.log("Successfully seeded 25 interview experiences!");

  } catch (error) {
    console.error("Error seeding data:", error);
  } finally {
    mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }
};

if (require.main === module) {
  seedInterviews();
}
