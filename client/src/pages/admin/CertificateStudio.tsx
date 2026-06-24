import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { url } from "../../baseUrl";
import { useAppContext } from "../../App";
import { ArrowLeft, Save, Download, FileText, CheckCircle } from "lucide-react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { CertificateTemplate, CertificateData } from "../../components/admin/CertificateTemplates";

const INTERNSHIP_PROGRAMS = [
  "ServiceNow Fundamentals Internship",
  "ServiceNow Administration Internship",
  "ServiceNow Developer Internship",
  "ITSM Internship",
  "ServiceNow CSA Preparation Internship",
  "Technical Content Writing Internship",
  "Community Management Internship",
  "Frontend Development Internship"
];

const TEMPLATE_TYPES = [
  "Offer Letter",
  "Internship Completion Letter",
  "Internship Certificate",
  "Experience Letter",
  "Appreciation Certificate",
  "Training Completion Certificate"
];

export default function CertificateStudio() {
  const navigate = useNavigate();
  const { handleToast, hideNavbar } = useAppContext();
  const queryClient = useQueryClient();
  const certificateRef = useRef<HTMLDivElement>(null);

  const [isGenerating, setIsGenerating] = useState(false);
  const [savedCertId, setSavedCertId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<CertificateData>({
    candidateName: "",
    email: "",
    internshipTitle: INTERNSHIP_PROGRAMS[0],
    templateType: TEMPLATE_TYPES[0],
    department: "ServiceNow Development",
    projectUndertaken: "",
    rolesAndResponsibilities: "",
    location: "Full-time Remote",
    companyName: "NowScripts Private Limited",
    issueDate: new Date().toISOString().split('T')[0],
    startDate: "",
    endDate: "",
    mentorName: "",
    certificateId: "",
    verificationNumber: "",
  });

  useEffect(() => {
    hideNavbar(true);
    return () => hideNavbar(false);
  }, []);

  const createMutation = useMutation({
    mutationFn: async (newCert: any) => {
      const token = localStorage.getItem("token");
      return axios.post(`${url}/certificate/create`, newCert, {
        headers: { Authorization: `Bearer ${token}` }
      });
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries(["adminCertificates"]);
      handleToast("Certificate saved to database!");
      setSavedCertId(res.data.certificateId);
      // Update form with the generated IDs from the server so the PDF includes them
      setFormData(prev => ({
        ...prev,
        certificateId: res.data.certificateId,
        verificationNumber: res.data.verificationNumber
      }));
    },
    onError: (err: any) => {
      handleToast(err.response?.data?.message || "Failed to save certificate");
    }
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.candidateName || !formData.email || !formData.startDate || !formData.endDate) {
      return handleToast("Please fill all required fields");
    }
    createMutation.mutate(formData);
  };

  const generatePDF = async () => {
    if (!certificateRef.current) return;
    
    setIsGenerating(true);
    try {
      // Small delay to ensure any React re-renders (like ID injection) are painted
      await new Promise(resolve => setTimeout(resolve, 500));

      const canvas = await html2canvas(certificateRef.current, {
        scale: 2, // higher resolution
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff"
      });
      
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [794, 1123] // A4 size in pixels at 96dpi
      });
      
      pdf.addImage(imgData, "PNG", 0, 0, 794, 1123);
      pdf.save(`NowScripts_Certificate_${formData.candidateName.replace(/\s+/g, '_') || "Draft"}.pdf`);
      handleToast("PDF Downloaded successfully!");
    } catch (error) {
      console.error("PDF Generation failed", error);
      handleToast("Failed to generate PDF");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // If they change data after saving, clear the saved state so they know it's un-synced
    if (savedCertId) setSavedCertId(null);
  };

  return (
    <div className="h-screen w-full bg-[#0F172A] flex flex-col overflow-hidden font-sans">
      {/* Top Navbar */}
      <div className="h-16 bg-[#1E293B] border-b border-[rgba(255,255,255,0.1)] flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/admin/certificates')}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 text-white font-bold text-lg">
            <FileText className="w-5 h-5 text-now-primary" />
            Certificate Studio
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={handleSave}
            disabled={createMutation.isLoading || !!savedCertId}
            className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors ${
              savedCertId 
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 cursor-default"
                : "bg-[#334155] text-white hover:bg-[#475569]"
            }`}
          >
            {savedCertId ? <><CheckCircle className="w-4 h-4" /> Saved</> : <><Save className="w-4 h-4" /> Save to Database</>}
          </button>
          <button 
            onClick={generatePDF}
            disabled={isGenerating}
            className="px-5 py-2 bg-now-primary text-black font-bold rounded-lg hover:bg-now-accent transition-colors flex items-center gap-2 disabled:opacity-70"
          >
            <Download className="w-4 h-4" /> 
            {isGenerating ? "Generating..." : "Download PDF"}
          </button>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Panel: Form */}
        <div className="w-[450px] bg-[#1E293B] border-r border-[rgba(255,255,255,0.1)] overflow-y-auto p-6 custom-scrollbar shrink-0">
          <form className="space-y-6">
            
            <div className="space-y-4">
              <h3 className="text-white font-bold uppercase tracking-wider text-sm border-b border-[rgba(255,255,255,0.1)] pb-2">Document Settings</h3>
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">Template Type</label>
                <select name="templateType" value={formData.templateType} onChange={handleChange} className="w-full px-3 py-2 bg-[#0F172A] border border-[rgba(255,255,255,0.1)] rounded text-white focus:outline-none focus:border-now-primary text-sm">
                  {TEMPLATE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">Internship Program</label>
                <select name="internshipTitle" value={formData.internshipTitle} onChange={handleChange} className="w-full px-3 py-2 bg-[#0F172A] border border-[rgba(255,255,255,0.1)] rounded text-white focus:outline-none focus:border-now-primary text-sm">
                  {INTERNSHIP_PROGRAMS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-white font-bold uppercase tracking-wider text-sm border-b border-[rgba(255,255,255,0.1)] pb-2">Candidate Details</h3>
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">Candidate Name *</label>
                <input type="text" name="candidateName" value={formData.candidateName} onChange={handleChange} placeholder="e.g. Kalluri Prathap" className="w-full px-3 py-2 bg-[#0F172A] border border-[rgba(255,255,255,0.1)] rounded text-white focus:outline-none focus:border-now-primary text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">Email Address *</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="e.g. name@example.com" className="w-full px-3 py-2 bg-[#0F172A] border border-[rgba(255,255,255,0.1)] rounded text-white focus:outline-none focus:border-now-primary text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">Department</label>
                <input type="text" name="department" value={formData.department} onChange={handleChange} placeholder="e.g. ServiceNow Development" className="w-full px-3 py-2 bg-[#0F172A] border border-[rgba(255,255,255,0.1)] rounded text-white focus:outline-none focus:border-now-primary text-sm" />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-white font-bold uppercase tracking-wider text-sm border-b border-[rgba(255,255,255,0.1)] pb-2">Timeline & Execution</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">Start Date *</label>
                  <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} className="w-full px-3 py-2 bg-[#0F172A] border border-[rgba(255,255,255,0.1)] rounded text-white focus:outline-none focus:border-now-primary text-sm [color-scheme:dark]" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">End Date *</label>
                  <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} className="w-full px-3 py-2 bg-[#0F172A] border border-[rgba(255,255,255,0.1)] rounded text-white focus:outline-none focus:border-now-primary text-sm [color-scheme:dark]" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">Project Undertaken</label>
                <textarea name="projectUndertaken" value={formData.projectUndertaken} onChange={handleChange} rows={2} placeholder="e.g. Development of content writing modules and learning materials..." className="w-full px-3 py-2 bg-[#0F172A] border border-[rgba(255,255,255,0.1)] rounded text-white focus:outline-none focus:border-now-primary text-sm resize-none"></textarea>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">Intern Role's and Responsibilities</label>
                <textarea name="rolesAndResponsibilities" value={formData.rolesAndResponsibilities} onChange={handleChange} rows={2} placeholder="e.g. Assisting in full-stack development tasks..." className="w-full px-3 py-2 bg-[#0F172A] border border-[rgba(255,255,255,0.1)] rounded text-white focus:outline-none focus:border-now-primary text-sm resize-none"></textarea>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">Mentor Name *</label>
                <input type="text" name="mentorName" value={formData.mentorName} onChange={handleChange} placeholder="e.g. NowScripts Private Limited" className="w-full px-3 py-2 bg-[#0F172A] border border-[rgba(255,255,255,0.1)] rounded text-white focus:outline-none focus:border-now-primary text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">Issue Date</label>
                  <input type="date" name="issueDate" value={formData.issueDate} onChange={handleChange} className="w-full px-3 py-2 bg-[#0F172A] border border-[rgba(255,255,255,0.1)] rounded text-white focus:outline-none focus:border-now-primary text-sm [color-scheme:dark]" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">Location</label>
                  <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="e.g. Full-time Remote" className="w-full px-3 py-2 bg-[#0F172A] border border-[rgba(255,255,255,0.1)] rounded text-white focus:outline-none focus:border-now-primary text-sm" />
                </div>
              </div>
            </div>

            {/* Hint Box */}
            <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg mt-6">
              <p className="text-xs text-blue-300 leading-relaxed">
                <strong>Tip:</strong> The live preview updates instantly. Save the certificate to generate official IDs and Verification URLs before downloading the PDF.
              </p>
            </div>
          </form>
        </div>

        {/* Right Panel: Live Preview */}
        <div className="flex-1 bg-gray-300 overflow-y-auto flex items-center justify-center p-8 custom-scrollbar">
          {/* Wrapper to scale the A4 component to fit the screen nicely */}
          <div className="shadow-2xl transition-all duration-300 ease-in-out hover:scale-[1.02] transform-gpu">
             <CertificateTemplate ref={certificateRef} data={formData} />
          </div>
        </div>

      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
      `}} />
    </div>
  );
}
