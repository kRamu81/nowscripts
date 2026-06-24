import axios from "axios";

async function test() {
  try {
    const res = await axios.post("http://localhost:5000/certificate/create", {
      candidateName: "Test Name",
      email: "test@example.com",
      internshipTitle: "ServiceNow Fundamentals Internship",
      companyName: "NowScripts Private Limited",
      issueDate: "2026-06-24",
      startDate: "2026-06-01",
      endDate: "2026-06-30",
      mentorName: "Mentor Test",
      templateType: "Internship Completion Letter",
      department: "Dev",
      projectUndertaken: "None",
      rolesAndResponsibilities: "Testing",
      location: "Remote"
    }, {
      // Need a valid token... wait, this is hard without a token.
    });
    console.log(res.data);
  } catch (error) {
    console.error(error.response?.data || error.message);
  }
}

test();
