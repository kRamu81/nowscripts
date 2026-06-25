import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/Auth";
import axios from "axios";
import { url } from "../baseUrl";
import { ArrowLeft, ArrowRight, Check, Plus, Trash2, Building2, Briefcase, MapPin, Calendar, BookOpen, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";

const STEPS = ["Basic Info", "Rounds", "Questions & Prep", "Review"];

export default function SubmitInterviewExperience() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    company: "",
    role: "",
    experienceLevel: "Freshers",
    location: "",
    difficulty: "Medium",
    result: "Selected",
    overallRating: 4,
    rounds: [{ name: "Technical Round", duration: "", questionsAsked: "", candidateExperience: "", tips: "" }],
    technicalQuestions: [{ question: "", answer: "", difficulty: "Medium" }],
    hrQuestions: [{ question: "", answer: "", difficulty: "Easy" }],
    scenarioQuestions: [{ question: "", answer: "", difficulty: "Hard" }],
    preparationTips: "",
    resources: "",
    mistakes: "",
    overallExperience: "",
    tags: [] as string[]
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoundChange = (index: number, field: string, value: string) => {
    const updatedRounds = [...formData.rounds];
    updatedRounds[index] = { ...updatedRounds[index], [field]: value };
    setFormData({ ...formData, rounds: updatedRounds });
  };

  const addRound = () => {
    setFormData({ ...formData, rounds: [...formData.rounds, { name: "", duration: "", questionsAsked: "", candidateExperience: "", tips: "" }] });
  };

  const removeRound = (index: number) => {
    setFormData({ ...formData, rounds: formData.rounds.filter((_, i) => i !== index) });
  };

  const handleQuestionChange = (type: "technicalQuestions" | "hrQuestions" | "scenarioQuestions", index: number, field: string, value: string) => {
    const updated = [...formData[type]];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, [type]: updated });
  };

  const addQuestion = (type: "technicalQuestions" | "hrQuestions" | "scenarioQuestions") => {
    setFormData({ ...formData, [type]: [...formData[type], { question: "", answer: "", difficulty: "Medium" }] });
  };

  const removeQuestion = (type: "technicalQuestions" | "hrQuestions" | "scenarioQuestions", index: number) => {
    setFormData({ ...formData, [type]: formData[type].filter((_, i) => i !== index) });
  };

  const handleSubmit = async () => {
    if (!user) return toast.error("You must be logged in to submit an experience");
    
    // Generate title and tags if not provided
    const payload = {
      ...formData,
      title: formData.title || `${formData.role} Interview at ${formData.company}`,
      tags: [formData.company, formData.role, formData.experienceLevel],
      // Filter out empty questions
      technicalQuestions: formData.technicalQuestions.filter(q => q.question.trim()),
      hrQuestions: formData.hrQuestions.filter(q => q.question.trim()),
      scenarioQuestions: formData.scenarioQuestions.filter(q => q.question.trim()),
    };

    try {
      setSubmitting(true);
      await axios.post(`${url}/interviews`, payload);
      toast.success("Interview experience submitted successfully! It is pending admin approval.");
      navigate("/interviews");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to submit experience");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        
        <div className="flex items-center gap-4 mb-8">
          <Link to="/interviews" className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-500">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Share Your Interview Experience</h1>
            <p className="text-sm text-gray-500">Help the community by sharing your journey.</p>
          </div>
        </div>

        {/* Stepper */}
        <div className="mb-8">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 -z-10 rounded-full"></div>
            <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-indigo-600 -z-10 rounded-full transition-all duration-300" style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}></div>
            
            {STEPS.map((step, idx) => {
              const stepNum = idx + 1;
              const isActive = currentStep === stepNum;
              const isPast = currentStep > stepNum;
              return (
                <div key={stepNum} className="flex flex-col items-center gap-2 bg-[#F8FAFC] px-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors ${
                    isActive ? 'bg-indigo-600 border-indigo-600 text-white' : 
                    isPast ? 'bg-indigo-600 border-indigo-600 text-white' : 
                    'bg-white border-gray-300 text-gray-400'
                  }`}>
                    {isPast ? <Check className="w-4 h-4" /> : stepNum}
                  </div>
                  <span className={`text-xs font-medium hidden sm:block ${isActive || isPast ? 'text-gray-900' : 'text-gray-400'}`}>{step}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8 mb-6">
          
          {/* Step 1 */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900 border-b pb-2 mb-4">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company Name *</label>
                  <input required name="company" value={formData.company} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all" placeholder="e.g. ServiceNow, Deloitte" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role Applied For *</label>
                  <input required name="role" value={formData.role} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all" placeholder="e.g. ServiceNow Developer" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Experience Level *</label>
                  <select name="experienceLevel" value={formData.experienceLevel} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all">
                    <option value="Freshers">Freshers</option>
                    <option value="0-1 Years">0-1 Years</option>
                    <option value="1-2 Years">1-2 Years</option>
                    <option value="2-3 Years">2-3 Years</option>
                    <option value="3-5 Years">3-5 Years</option>
                    <option value="5+ Years">5+ Years</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input name="location" value={formData.location} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all" placeholder="e.g. Remote, Bangalore" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Overall Difficulty *</label>
                  <select name="difficulty" value={formData.difficulty} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all">
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Interview Result *</label>
                  <select name="result" value={formData.result} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all">
                    <option value="Selected">Selected</option>
                    <option value="Offer Received">Offer Received</option>
                    <option value="Waiting">Waiting</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 2 */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b pb-2 mb-4">
                <h2 className="text-xl font-bold text-gray-900">Interview Rounds</h2>
                <button onClick={addRound} className="flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-lg">
                  <Plus className="w-4 h-4" /> Add Round
                </button>
              </div>

              {formData.rounds.map((round, idx) => (
                <div key={idx} className="bg-gray-50 p-5 rounded-xl border border-gray-200 relative">
                   <div className="absolute top-4 right-4 flex gap-2">
                     {formData.rounds.length > 1 && (
                       <button onClick={() => removeRound(idx)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-md">
                         <Trash2 className="w-4 h-4" />
                       </button>
                     )}
                   </div>
                   
                   <h3 className="font-bold text-gray-900 mb-4">Round {idx + 1}</h3>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                     <div>
                       <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wider">Round Name *</label>
                       <input required value={round.name} onChange={(e) => handleRoundChange(idx, "name", e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500" placeholder="e.g. Technical Round 1" />
                     </div>
                     <div>
                       <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wider">Duration</label>
                       <input value={round.duration} onChange={(e) => handleRoundChange(idx, "duration", e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500" placeholder="e.g. 45 Mins" />
                     </div>
                   </div>
                   
                   <div className="space-y-4">
                     <div>
                       <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wider">What was asked? (Summary)</label>
                       <textarea value={round.questionsAsked} onChange={(e) => handleRoundChange(idx, "questionsAsked", e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 min-h-[80px]" placeholder="Briefly describe what was discussed..." />
                     </div>
                     <div>
                       <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wider">Tips for this round</label>
                       <input value={round.tips} onChange={(e) => handleRoundChange(idx, "tips", e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500" placeholder="e.g. Focus heavily on GlideRecord queries" />
                     </div>
                   </div>
                </div>
              ))}
            </div>
          )}

          {/* Step 3 */}
          {currentStep === 3 && (
            <div className="space-y-8">
              
              {/* Specific Questions Component - Keep it brief for this demo */}
              <div>
                 <div className="flex items-center justify-between border-b pb-2 mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Specific Questions Asked</h2>
                  <button onClick={() => addQuestion("technicalQuestions")} className="flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-lg">
                    <Plus className="w-4 h-4" /> Add Question
                  </button>
                </div>
                <p className="text-sm text-gray-500 mb-4">Share 1-2 specific questions you remember (Optional).</p>
                
                {formData.technicalQuestions.map((q, idx) => (
                  <div key={idx} className="flex gap-4 items-start mb-4">
                    <div className="flex-1 space-y-2">
                       <input value={q.question} onChange={(e) => handleQuestionChange("technicalQuestions", idx, "question", e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm" placeholder="Question asked..." />
                       <textarea value={q.answer} onChange={(e) => handleQuestionChange("technicalQuestions", idx, "answer", e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm min-h-[60px]" placeholder="Your answer or approach..." />
                    </div>
                    {formData.technicalQuestions.length > 1 && (
                      <button onClick={() => removeQuestion("technicalQuestions", idx)} className="mt-1 p-2 text-red-500 hover:bg-red-50 rounded-md">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Prep & Mistakes */}
              <div className="pt-4 border-t">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Preparation & Tips</h2>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Preparation Strategy & Resources</label>
                    <textarea name="resources" value={formData.resources} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm min-h-[100px] focus:ring-2 focus:ring-indigo-500" placeholder="What resources did you use? How did you prepare?" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mistakes to Avoid</label>
                    <textarea name="mistakes" value={formData.mistakes} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm min-h-[80px] focus:ring-2 focus:ring-indigo-500" placeholder="Any pitfalls or things you wish you knew?" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Overall Experience Summary</label>
                    <textarea name="overallExperience" value={formData.overallExperience} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm min-h-[80px] focus:ring-2 focus:ring-indigo-500" placeholder="Summarize your overall interview experience..." />
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* Step 4 */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Ready to Submit!</h2>
                <p className="text-gray-500 mt-2">Please review your information below. Note that all submissions are reviewed by an Admin before being published publicly to ensure quality.</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h3 className="font-bold text-lg mb-4">Summary</h3>
                <ul className="space-y-3 text-sm text-gray-700">
                  <li className="flex gap-2"><strong className="w-32">Company:</strong> {formData.company || "Not provided"}</li>
                  <li className="flex gap-2"><strong className="w-32">Role:</strong> {formData.role || "Not provided"}</li>
                  <li className="flex gap-2"><strong className="w-32">Result:</strong> <span className="font-semibold text-indigo-600">{formData.result}</span></li>
                  <li className="flex gap-2"><strong className="w-32">Total Rounds:</strong> {formData.rounds.length}</li>
                  <li className="flex gap-2"><strong className="w-32">Difficulty:</strong> {formData.difficulty}</li>
                </ul>
              </div>
            </div>
          )}

        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
            className={`px-5 py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2 ${currentStep === 1 ? 'invisible' : ''}`}
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          
          {currentStep < STEPS.length ? (
            <button
              onClick={() => {
                // Basic validation
                if (currentStep === 1 && (!formData.company || !formData.role)) {
                  return toast.error("Please fill required fields (Company, Role)");
                }
                setCurrentStep(prev => prev + 1);
              }}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium flex items-center gap-2 transition-colors"
            >
              Continue <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="px-6 py-2.5 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-lg font-bold flex items-center gap-2 transition-colors"
            >
              {submitting ? "Submitting..." : "Submit Experience"} <Check className="w-5 h-5" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
