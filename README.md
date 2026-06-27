<div align="center">
  <img src="client/public/logo.png" alt="NowScripts Logo" width="100"/>
  <h1>NowScripts</h1>
  <p><em>"Developers Connect Together — Master ServiceNow, Transform IT Services"</em></p>

  [![Version](https://img.shields.io/badge/version-v1.0.0-blue.svg)](https://github.com/NowScripts)
  [![Status](https://img.shields.io/badge/status-Live-success.svg)](https://nowscripts.in)
  [![Website](https://img.shields.io/badge/website-nowscripts.in-green.svg)](https://nowscripts.in)
  [![LinkedIn](https://img.shields.io/badge/LinkedIn-NowScripts-blue.svg?logo=linkedin)](https://www.linkedin.com/company/nowscripts)
</div>

<br/>

## 📖 Table of Contents
- [About](#-about)
- [Features](#-features)
- [Pages & Modules](#-pages--modules)
- [Learning Roadmap](#-learning-roadmap)
- [Certification Paths](#-certification-paths)
- [Credential Verification](#-credential-verification)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Changelog v1.0](#-changelog-v10)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [Connect With Us](#-connect-with-us)
- [License](#-license)

---

## 🚀 About
**NowScripts** (nowscripts.in) is a premier dark-themed learning platform dedicated exclusively to ServiceNow professionals. Whether you are an aspiring administrator, an experienced developer, or an ITSM consultant, NowScripts provides structured learning paths, real-world project scenarios, certification resources, and a thriving community where developers connect together to master ServiceNow and transform IT services.

---

## ✨ Features

| Emoji | Feature Name | Description |
| :---: | :--- | :--- |
| 🛣️ | **Guided Roadmaps** | Step-by-step visual learning paths from beginner to advanced topics. |
| 📚 | **Interactive Learning** | In-depth modules on ITSM, CSM, ITOM, Scripting, and App Engine. |
| 🎯 | **Interview Prep** | Scenario-based questions, flashcards, and mock interview experiences. |
| 🎓 | **Certification Hub** | Resources and practice exams tailored for CSA, CAD, and CIS. |
| 🛡️ | **Credential Verify** | Authentic verification portals for certificates and internships. |
| 🤝 | **Community Forums** | Discuss solutions, share snippets, and network with other developers. |
| 💻 | **Real-World Projects** | Build your portfolio with hands-on, enterprise-grade project challenges. |
| 🌙 | **Premium Dark Theme** | A sleek, distraction-free environment built for late-night coding. |

---

## 🗺️ Pages & Modules

### Product
- **Home:** The main landing portal showcasing features and community highlights.
- **Learn:** Centralized dashboard for accessing all educational modules.
- **Roadmaps:** Interactive, winding visual learning paths.
- **Projects:** Hand-on scenarios to build real-world experience.
- **Interview Prep:** Curated questions to help you land your next ServiceNow role.
- **Certifications:** Study materials and guides for platform certifications.

### Resources
- **Community:** Forums for developer discussions and networking.
- **Blog:** Articles, tutorials, and ServiceNow release updates.
- **Help Center:** FAQs and support documentation.

### Verify Credentials
- **Verify Certificate:** Portal to validate NowScripts course completions.
- **Verify Internship:** Portal to authenticate internship completion letters.

### Company
- **About Us:** Our mission and the team behind NowScripts.
- **Contact Us:** Reach out for partnerships, support, or feedback.
- **Privacy Policy:** Data protection and user privacy guidelines.
- **Terms of Service:** Platform usage agreements and rules.

---

## 🛤️ Learning Roadmap

### 10-Module Learning Path
1. **ServiceNow Fundamentals**
2. **ITSM Module (Incident, Problem, Change)**
3. **Administration & Security**
4. **Service Catalog & Request Fulfillment**
5. **Client-Side Scripting (Client Scripts, UI Policies)**
6. **Server-Side Scripting (Business Rules, Script Includes)**
7. **Flow Designer & Integration Hub**
8. **Service Portal & UI Builder**
9. **ITOM & CMDB Basics**
10. **Custom Application Development (App Engine)**

### 6-Month Timeline

| Month | Focus Area | Goal |
| :---: | :--- | :--- |
| **Month 1** | Platform Basics & ITSM | Complete Fundamentals & get comfortable with the UI. |
| **Month 2** | Administration | Master users, roles, ACLs, and basic configurations. |
| **Month 3** | Client-Side Scripting | Write effective UI Policies and Client Scripts. |
| **Month 4** | Server-Side Scripting | Master Business Rules, Script Includes, and GlideRecord. |
| **Month 5** | Automations & Portal | Build flows in Flow Designer and customize Service Portal. |
| **Month 6** | Advanced & Certification| Custom apps, integrations, and prepare for CSA/CAD exams. |

---

## 🏅 Certification Paths

| Certification | Level | Description |
| :--- | :---: | :--- |
| **Certified System Administrator (CSA)** | Beginner | Validates foundational knowledge of the ServiceNow platform. |
| **Certified Application Developer (CAD)** | Intermediate | Proves ability to design and build custom applications. |
| **Certified Implementation Specialist (CIS)** | Advanced | Specialized tracks (ITSM, CSM, HRSD) for implementation. |
| **Advanced Modules** | Expert | Micro-certifications in Flow Designer, Service Portal, and APIs. |

---

## 🔒 Credential Verification
Validate the authenticity of NowScripts credentials using our secure verification portals:
- **Verify Certificate:** [nowscripts.in/verify](https://nowscripts.in/verify)
- **Verify Internship:** [nowscripts.in/verify-internship](https://nowscripts.in/verify-internship)

---

## 💻 Tech Stack

| Category | Technology |
| :--- | :--- |
| **Frontend Framework** | [React / Vite] |
| **Styling** | [Tailwind CSS] |
| **Backend API** | [Node.js / Express] |
| **Database** | [MongoDB] |
| **Hosting & Deployment**| [Vercel / AWS] |

---

## 🚀 Getting Started

To run the NowScripts platform locally, follow these steps:

```bash
# Clone the repository
git clone https://github.com/NowScripts/nowscripts.git

# Navigate into the project directory
cd nowscripts

# Install dependencies
npm install

# Start the development server
npm run dev
```

---

## 📂 Project Structure

```text
nowscripts/
├── client/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── UnAuthHome.tsx            # Home Page (Landing)
│   │   │   ├── LearnDashboard.tsx        # Learn Page
│   │   │   ├── RoadmapDashboard.tsx      # Roadmaps Page
│   │   │   ├── RoadmapViewer.tsx         # Roadmap Viewer
│   │   │   ├── InterviewPrepDashboard.tsx# Interview Prep Page
│   │   │   ├── CertificationCenter.tsx   # Certifications Page
│   │   │   ├── Home.tsx                  # Community Page
│   │   │   ├── VerifyCertificate.tsx     # Verify Certificate Page
│   │   │   ├── AboutUs.tsx               # About Us Page
│   │   │   ├── Post.tsx                  # Blog Post Page
│   │   │   ├── SignIn.tsx                # Auth Page
│   │   │   └── ...                       # (Projects, Help Center, Verify Internship, Contact Us, Privacy, TOS placeholders/routes)
│   │   ├── components/
│   │   ├── assets/
│   │   └── App.tsx                       # App Routing
│   └── package.json
└── README.md
```

---

## 📝 Changelog v1.0

### Added
- Complete UI/UX overhaul with a premium dark theme.
- Interactive winding "snake" Roadmap Viewer.
- Responsive mobile sidebars for Learn and Interview Prep dashboards.
- Authentic Certification Verification portal.
- ITSM learning modules populated with detailed markdown content.

### Fixed
- Mobile navigation menu rendering issue (`AnimatePresence` fragment bug).
- Desktop navigation visibility issues on tablet (`md`/`lg` breakpoints).

### Known Limitations
- Interview prep scenario questions are marked as "Coming Soon".
- Projects portal is currently under development.

---

## 📅 Roadmap

- [x] **v1.0 (Current):** Launch core learning modules, roadmaps, and UI overhaul.
- [ ] **v1.1 (Q3 2025):** Launch Hands-on Projects portal and expand Interview Prep scenarios.
- [ ] **v1.2 (Q4 2025):** Introduce advanced community features and peer-to-peer code reviews.
- [ ] **v2.0 (2026):** AI-powered learning assistant and interactive ServiceNow sandbox environments.

---

## 🤝 Contributing

We welcome contributions from the community! Follow these steps to contribute:

1. **Fork the repository:** Click the "Fork" button at the top right of this page.
2. **Clone your fork:** `git clone https://github.com/your-username/nowscripts.git`
3. **Create a branch:** `git checkout -b feature/your-feature-name`
4. **Make your changes & commit:** `git commit -m "Add some feature"`
5. **Push to the branch & create a Pull Request:** `git push origin feature/your-feature-name` and open a PR!

---

## 🌐 Connect With Us

| Platform | Link |
| :--- | :--- |
| **Website** | [nowscripts.in](https://nowscripts.in) |
| **LinkedIn** | [linkedin.com/company/nowscripts](https://www.linkedin.com/company/nowscripts) |
| **Twitter / X** | [@NowScripts](https://twitter.com/NowScripts) |
| **Facebook** | [facebook.com/NowScripts](https://facebook.com/NowScripts) |
| **Discord** | [Join our Developer Server](#) |

---

<div align="center">
  <p>Released under the <a href="LICENSE">MIT License</a>.</p>
  <p>Copyright © 2025 NowScripts. All rights reserved.</p>
</div>
