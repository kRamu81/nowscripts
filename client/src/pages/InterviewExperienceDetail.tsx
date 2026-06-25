import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../contexts/Auth";
import axios from "axios";
import { url } from "../baseUrl";
import { ArrowLeft, Briefcase, MapPin, Calendar, Star, Clock, CheckCircle2, XCircle, ThumbsUp, Bookmark, MessageSquare, AlertCircle, Award, BookOpen, Share2, Eye } from "lucide-react";
import { format } from "date-fns";
import toast from "react-hot-toast";

export default function InterviewExperienceDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [experience, setExperience] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExperience();
    
    // Increment view count
    if (id) {
       axios.post(`${url}/interviews/${id}/view`).catch(e => console.error(e));
    }
  }, [id]);

  const fetchExperience = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${url}/interviews/${id}`);
      setExperience(res.data);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to load experience");
    } finally {
      setLoading(false);
    }
  };

  const toggleLike = async () => {
    if (!user) return toast.error("Please login to like this experience");
    try {
      const res = await axios.post(`${url}/interviews/${id}/like`);
      setExperience(res.data);
    } catch (err) {
      toast.error("Action failed");
    }
  };

  const toggleBookmark = async () => {
    if (!user) return toast.error("Please login to bookmark this experience");
    try {
      const res = await axios.post(`${url}/interviews/${id}/bookmark`);
      setExperience(res.data);
    } catch (err) {
      toast.error("Action failed");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#F8FAFC]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#4f46e5]"></div>
      </div>
    );
  }

  if (!experience) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-[#F8FAFC]">
        <AlertCircle className="w-16 h-16 text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800">Experience not found</h2>
        <Link to="/interviews" className="mt-4 text-indigo-600 hover:underline">Back to all experiences</Link>
      </div>
    );
  }

  const isLiked = user && experience.likes?.includes(user._id);
  const isBookmarked = user && experience.bookmarks?.includes(user._id);

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation */}
        <Link to="/interviews" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 font-medium transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Interviews
        </Link>

        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
              <div className="flex items-start gap-5">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center text-2xl md:text-3xl font-bold text-indigo-700 uppercase flex-shrink-0">
                  {experience.company?.substring(0, 2) || "N/A"}
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{experience.title}</h1>
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-gray-600">
                    <span className="flex items-center gap-2 font-medium text-gray-900"><Briefcase className="w-4 h-4 text-gray-400" /> {experience.role}</span>
                    {experience.location && <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-gray-400" /> {experience.location}</span>}
                    {experience.interviewDate && <span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-gray-400" /> {format(new Date(experience.interviewDate), 'MMMM yyyy')}</span>}
                    {experience.experienceLevel && <span className="flex items-center gap-2"><Award className="w-4 h-4 text-gray-400" /> {experience.experienceLevel}</span>}
                  </div>
                </div>
              </div>

              <div className="flex md:flex-col items-center md:items-end gap-3 flex-wrap">
                {experience.result === "Selected" && <span className="flex items-center gap-1.5 text-sm font-semibold text-green-700 bg-green-50 px-3 py-1.5 rounded-full"><CheckCircle2 className="w-4 h-4"/> Selected</span>}
                {experience.result === "Offer Received" && <span className="flex items-center gap-1.5 text-sm font-semibold text-green-700 bg-green-50 px-3 py-1.5 rounded-full"><CheckCircle2 className="w-4 h-4"/> Offer Received</span>}
                {experience.result === "Rejected" && <span className="flex items-center gap-1.5 text-sm font-semibold text-red-700 bg-red-50 px-3 py-1.5 rounded-full"><XCircle className="w-4 h-4"/> Rejected</span>}
                {experience.result === "Waiting" && <span className="flex items-center gap-1.5 text-sm font-semibold text-yellow-700 bg-yellow-50 px-3 py-1.5 rounded-full"><Clock className="w-4 h-4"/> Waiting</span>}
                
                <div className="flex items-center gap-1 text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-5 h-5 ${i < experience.overallRating ? 'fill-current' : 'text-gray-200'}`} />
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50/80 border-t border-gray-100 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
             <div className="flex items-center gap-4 text-sm text-gray-500">
               <span className="flex items-center gap-1.5"><Eye className="w-4 h-4" /> {experience.views} Views</span>
               <span className="flex items-center gap-1.5"><MessageSquare className="w-4 h-4" /> {experience.comments?.length || 0} Comments</span>
             </div>

             <div className="flex items-center gap-3">
                <button onClick={toggleLike} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isLiked ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'}`}>
                   <ThumbsUp className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} /> {experience.likes?.length || 0}
                </button>
                <button onClick={toggleBookmark} className={`flex items-center justify-center w-10 h-10 rounded-lg transition-colors ${isBookmarked ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'}`}>
                   <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                </button>
                <button className="flex items-center justify-center w-10 h-10 rounded-lg bg-white text-gray-500 border border-gray-200 hover:bg-gray-50 transition-colors">
                   <Share2 className="w-4 h-4" />
                </button>
             </div>
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Rounds Section */}
            {experience.rounds && experience.rounds.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center"><Briefcase className="w-4 h-4" /></div>
                  Interview Rounds
                </h2>
                <div className="space-y-4">
                  {experience.rounds.map((round: any, idx: number) => (
                    <div key={idx} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                      <div className="flex items-start justify-between mb-3">
                         <h3 className="text-lg font-bold text-gray-900">Round {idx + 1}: {round.name}</h3>
                         {round.duration && <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">{round.duration}</span>}
                      </div>
                      <div className="space-y-3 text-sm text-gray-700">
                         {round.questionsAsked && (
                           <div><span className="font-semibold text-gray-900 block mb-1">What was asked:</span>{round.questionsAsked}</div>
                         )}
                         {round.candidateExperience && (
                           <div><span className="font-semibold text-gray-900 block mb-1">Experience:</span>{round.candidateExperience}</div>
                         )}
                         {round.tips && (
                           <div className="bg-amber-50 p-3 rounded-lg border border-amber-100 mt-2 text-amber-800">
                             <span className="font-semibold block mb-1">Tip:</span>{round.tips}
                           </div>
                         )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Technical Questions */}
            {experience.technicalQuestions && experience.technicalQuestions.length > 0 && (
              <QuestionSection title="Technical Questions" questions={experience.technicalQuestions} icon={<Clock className="w-4 h-4" />} color="blue" />
            )}

            {/* Scenario Questions */}
            {experience.scenarioQuestions && experience.scenarioQuestions.length > 0 && (
              <QuestionSection title="Scenario-Based Questions" questions={experience.scenarioQuestions} icon={<Briefcase className="w-4 h-4" />} color="purple" />
            )}

            {/* HR Questions */}
            {experience.hrQuestions && experience.hrQuestions.length > 0 && (
              <QuestionSection title="HR Questions" questions={experience.hrQuestions} icon={<MessageSquare className="w-4 h-4" />} color="green" />
            )}

          </div>

          {/* Sidebar Column */}
          <div className="space-y-6">
             
             {/* Summary Card */}
             <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
               <h3 className="font-bold text-gray-900 mb-4">Experience Overview</h3>
               {experience.overallExperience && (
                 <p className="text-sm text-gray-600 leading-relaxed mb-6 italic">"{experience.overallExperience}"</p>
               )}
               
               <div className="space-y-4">
                 <div>
                   <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">Difficulty Level</span>
                   <div className="w-full bg-gray-100 rounded-full h-2">
                     <div className={`h-2 rounded-full ${experience.difficulty === 'Hard' ? 'bg-red-500 w-full' : experience.difficulty === 'Medium' ? 'bg-orange-400 w-2/3' : 'bg-green-500 w-1/3'}`}></div>
                   </div>
                   <span className="text-sm font-medium mt-1 block text-right text-gray-700">{experience.difficulty}</span>
                 </div>
               </div>
             </div>

             {/* Preparation Info */}
             {(experience.preparationTips || experience.resources || experience.mistakes) && (
               <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                 <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-indigo-500" />
                    Preparation Strategy
                 </h3>
                 
                 <div className="space-y-5">
                   {experience.preparationTips && (
                     <div>
                       <h4 className="text-sm font-semibold text-gray-900 mb-1">Tips & Strategy</h4>
                       <p className="text-sm text-gray-600 leading-relaxed">{experience.preparationTips}</p>
                     </div>
                   )}
                   {experience.resources && (
                     <div>
                       <h4 className="text-sm font-semibold text-gray-900 mb-1">Resources Used</h4>
                       <p className="text-sm text-gray-600 leading-relaxed">{experience.resources}</p>
                     </div>
                   )}
                   {experience.mistakes && (
                     <div>
                       <h4 className="text-sm font-semibold text-red-700 mb-1">Mistakes to Avoid</h4>
                       <p className="text-sm text-red-600/80 leading-relaxed bg-red-50 p-3 rounded-lg border border-red-100">{experience.mistakes}</p>
                     </div>
                   )}
                 </div>
               </div>
             )}

             {/* Tags */}
             {experience.tags && experience.tags.length > 0 && (
               <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                 <h3 className="font-bold text-gray-900 mb-3">Tags</h3>
                 <div className="flex flex-wrap gap-2">
                   {experience.tags.map((tag: string, i: number) => (
                     <span key={i} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-md text-xs font-medium">
                       {tag}
                     </span>
                   ))}
                 </div>
               </div>
             )}

          </div>

        </div>
      </div>
    </div>
  );
}

function QuestionSection({ title, questions, icon, color }: any) {
  const colorMap: Record<string, string> = {
    blue: "bg-blue-100 text-blue-600",
    purple: "bg-purple-100 text-purple-600",
    green: "bg-green-100 text-green-600",
  };

  return (
    <section>
      <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${colorMap[color]}`}>{icon}</div>
        {title}
      </h2>
      <div className="space-y-4">
        {questions.map((q: any, idx: number) => (
          <div key={idx} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="p-5">
               <div className="flex items-start justify-between gap-4 mb-3">
                  <h4 className="text-base font-semibold text-gray-900 leading-snug">Q: {q.question}</h4>
                  {q.difficulty && (
                    <span className={`flex-shrink-0 text-[11px] font-bold uppercase px-2 py-0.5 rounded ${
                      q.difficulty === 'Hard' ? 'bg-red-50 text-red-700' : 
                      q.difficulty === 'Medium' ? 'bg-orange-50 text-orange-700' : 'bg-green-50 text-green-700'
                    }`}>{q.difficulty}</span>
                  )}
               </div>
               
               {q.answer && (
                 <div className="mt-4 pt-4 border-t border-gray-100">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Answer / Suggestion</span>
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{q.answer}</p>
                 </div>
               )}
               {q.topic && (
                 <div className="mt-3 inline-block bg-gray-50 border border-gray-200 text-gray-500 text-xs px-2 py-1 rounded">
                    Topic: {q.topic}
                 </div>
               )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
