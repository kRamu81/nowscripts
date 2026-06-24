const fs = require('fs');
const path = require('path');

const csaPath = 'C:/Users/hp/.gemini/antigravity/brain/efffd16c-212d-4474-b4f7-58a433db6d63/.system_generated/steps/5511/content.md';
const cadPath = 'C:/Users/hp/.gemini/antigravity/brain/efffd16c-212d-4474-b4f7-58a433db6d63/.system_generated/steps/5522/content.md';

const publicDir = path.join(__dirname, '../public/content/interview-prep');
const csaOutDir = path.join(publicDir, 'csa');
const cadOutDir = path.join(publicDir, 'cad');

if (!fs.existsSync(csaOutDir)) fs.mkdirSync(csaOutDir, { recursive: true });
if (!fs.existsSync(cadOutDir)) fs.mkdirSync(cadOutDir, { recursive: true });

function extractQuizData(filePath) {
  const rawPath = path.join(publicDir, filePath);
  if (!fs.existsSync(rawPath)) return [];
  const content = fs.readFileSync(rawPath, 'utf8');
  return JSON.parse(content);
}

const csaData = extractQuizData('csa_raw.json');
const cadData = extractQuizData('cad_raw.json');

console.log(`Extracted ${csaData.length} CSA questions and ${cadData.length} CAD questions.`);

// Categorization Logic
const csaModules = [
  "User Administration", "Lists & Forms", "Tables", "Reports", "Flow Designer", "Notifications",
  "Security", "CMDB", "Knowledge Management", "Service Catalog", "Change Management", "Incident Management", "Problem Management", "Platform Basics"
];

const csaKeywords = {
  "User Administration": ["user", "group", "role", "impersonate", "profile"],
  "Lists & Forms": ["list", "form", "view", "formatter", "field", "column"],
  "Tables": ["table", "dictionary", "schema", "database", "record"],
  "Reports": ["report", "metric", "dashboard", "gauge", "chart"],
  "Flow Designer": ["flow", "trigger", "action", "workflow"],
  "Notifications": ["notification", "email", "event"],
  "Security": ["acl", "security", "access control", "permission", "role"],
  "CMDB": ["cmdb", "configuration item", "ci", "discovery", "asset"],
  "Knowledge Management": ["knowledge", "kb", "article"],
  "Service Catalog": ["catalog", "request", "ritm", "order guide", "record producer"],
  "Change Management": ["change", "cab"],
  "Incident Management": ["incident", "problem"],
  "Problem Management": ["problem", "root cause"],
};

const cadModules = [
  "Client Scripts", "Business Rules", "Script Includes", "Glide APIs", "Flow Designer", "IntegrationHub",
  "UI Policies", "ACLs", "Application Development", "Scoped Applications", "Update Sets", "Source Control", "REST APIs", "Scripting"
];

const cadKeywords = {
  "Client Scripts": ["client script", "g_form", "g_user", "onsubmit", "onload", "onchange"],
  "Business Rules": ["business rule", "current", "previous", "before", "after", "async"],
  "Script Includes": ["script include", "glideajax"],
  "Glide APIs": ["glide", "gliderecord", "glidesystem"],
  "Flow Designer": ["flow designer", "action", "trigger"],
  "IntegrationHub": ["integrationhub", "spoke"],
  "UI Policies": ["ui policy", "ui policies", "mandatory", "read-only"],
  "ACLs": ["acl", "security", "access control"],
  "Application Development": ["application", "module", "studio"],
  "Scoped Applications": ["scoped", "scope"],
  "Update Sets": ["update set", "xml", "move"],
  "Source Control": ["source control", "git", "branch", "commit"],
  "REST APIs": ["rest", "api", "endpoint", "method", "get", "post"],
};

function categorize(questions, modulesList, keywordsMap, prefix) {
  const grouped = {};
  modulesList.forEach(m => grouped[m] = { name: m, questions: [] });
  
  questions.forEach((q, idx) => {
    let assigned = false;
    const text = (q.question_text || "").toLowerCase();
    
    for (const [moduleName, keywords] of Object.entries(keywordsMap)) {
      if (keywords.some(kw => text.includes(kw))) {
        grouped[moduleName].questions.push({ ...q, id: `${prefix}-${idx + 1}` });
        assigned = true;
        break;
      }
    }
    
    if (!assigned) {
      // default category is the last one in the list (Platform Basics / Scripting)
      grouped[modulesList[modulesList.length - 1]].questions.push({ ...q, id: `${prefix}-${idx + 1}` });
    }
  });

  return Object.values(grouped).filter(g => g.questions.length > 0);
}

const csaCategorized = categorize(csaData, csaModules, csaKeywords, "csa");
const cadCategorized = categorize(cadData, cadModules, cadKeywords, "cad");

fs.writeFileSync(path.join(csaOutDir, 'data.json'), JSON.stringify({
  title: "CSA Questions",
  modules: csaCategorized
}, null, 2));

fs.writeFileSync(path.join(cadOutDir, 'data.json'), JSON.stringify({
  title: "CAD Questions",
  modules: cadCategorized
}, null, 2));

const indexData = {
  categories: [
    { id: "scenario", title: "Scenario-Based Questions", status: "coming_soon" },
    { id: "csa", title: "CSA Questions", status: "active", dataFile: "/content/interview-prep/csa/data.json" },
    { id: "cad", title: "CAD Questions", status: "active", dataFile: "/content/interview-prep/cad/data.json" },
    { id: "hr", title: "HR Questions", status: "coming_soon" },
    { id: "experiences", title: "Real Interview Experiences", status: "coming_soon" },
    { id: "mock", title: "Mock Interviews", status: "coming_soon" }
  ]
};

fs.writeFileSync(path.join(publicDir, 'index.json'), JSON.stringify(indexData, null, 2));

console.log("Successfully created data.json and index.json");
