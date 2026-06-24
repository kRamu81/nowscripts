import React from "react";
import { QRCodeSVG } from "qrcode.react";
import { HRSignature } from "../../assets/certificate-assets";

export interface CertificateData {
  candidateName: string;
  email: string;
  internshipTitle: string;
  startDate: string;
  endDate: string;
  issueDate: string;
  mentorName: string;
  department?: string;
  projectUndertaken?: string;
  rolesAndResponsibilities?: string;
  location?: string;
  certificateId: string;
  verificationNumber: string;
  templateType: string;
  companyName: string;
}

export const CertificateTemplate = React.forwardRef<HTMLDivElement, { data: CertificateData }>(({ data }, ref) => {
  const isCompletionLetter = data.templateType === "Internship Completion Letter" || data.templateType === "Offer Letter";
  
  // Format dates cleanly (e.g., "June 23, 2026")
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "N/A";
    try {
      return new Date(dateStr).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
    } catch {
      return dateStr;
    }
  };

  const formatMonthYear = (dateStr: string) => {
    if (!dateStr) return "N/A";
    try {
      return new Date(dateStr).toLocaleDateString("en-US", { month: "long", year: "numeric" });
    } catch {
      return dateStr;
    }
  };

  return (
    <div 
      ref={ref}
      // A4 dimensions at 96 DPI
      className="bg-white relative mx-auto text-black font-sans"
      style={{ width: "794px", height: "1123px", padding: "60px 80px", boxSizing: "border-box" }}
    >
      {/* Header with Logo */}
      <div className="flex justify-end mb-4">
        <img src="/certificate-logo.jpg" alt="NowScripts Logo" className="h-[45px] object-contain mix-blend-multiply" />
      </div>

      <div className="text-center mb-10">
        <span className="text-[#1a56db] underline text-xl decoration-1 underline-offset-4">
          {data.companyName}
        </span>
      </div>

      <h1 className="text-[34px] font-bold text-center text-black mb-10 tracking-tight">
        {data.templateType}
      </h1>

      {/* Date */}
      <div className="text-right mb-6">
        <p className="font-bold text-black text-[17px]">{formatDate(data.issueDate)}</p>
      </div>

      {/* Name and ID Block */}
      <div className="mb-10 text-left">
        <h2 className="text-[20px] font-bold text-black mb-1">Name: {data.candidateName || "[Candidate Name]"}</h2>
        <p className="text-gray-600 text-[15px]">
          Certificate ID: <span className="font-semibold text-gray-800">{data.certificateId || "[Auto-Generated]"}</span> · {data.location || "Full-time Remote"}
        </p>
      </div>

      {/* Main Paragraph */}
      <div className="text-[17px] leading-[1.7] text-black space-y-6 min-h-[180px]">
        {isCompletionLetter ? (
          <>
            {data.templateType === "Offer Letter" ? (
              <p>
                We are pleased to offer you the position of an intern at our organization from <strong>{formatMonthYear(data.startDate)}</strong> to <strong>{formatMonthYear(data.endDate)}</strong> as part of the <strong>{data.internshipTitle || "[Internship Program]"}</strong>, under the mentorship of <strong>{data.mentorName || "[Mentor Name]"}</strong>.
              </p>
            ) : (
              <p>
                This is to certify that <strong>{data.candidateName || "[Candidate Name]"}</strong> was an intern in our organization from <strong>{formatMonthYear(data.startDate)}</strong> to <strong>{formatMonthYear(data.endDate)}</strong> as part of the <strong>{data.internshipTitle || "[Internship Program]"}</strong>, under the mentorship of <strong>{data.mentorName || "[Mentor Name]"}</strong> and has successfully completed the internship.
              </p>
            )}
            
            {data.projectUndertaken && (
              <div className="mt-6">
                <p className="mb-2">Project undertaken:</p>
                <ol className="list-decimal pl-10">
                  <li className="font-bold pl-2">{data.projectUndertaken}</li>
                </ol>
              </div>
            )}
            
            {data.rolesAndResponsibilities && (
              <div className="mt-6">
                <p className="mb-2">Intern Role's and Responsibilities:</p>
                <ul className="list-disc pl-10">
                  <li className="pl-2">{data.rolesAndResponsibilities}</li>
                </ul>
              </div>
            )}
            
            <p className="mt-8">We wish you all the best for your future endeavors.</p>
          </>
        ) : (
           // General Certificate Text
           <>
            <p className="text-center italic text-xl text-gray-600 my-8">This certifies that</p>
            <p className="text-center text-3xl font-bold text-[#0F172A] mb-8">{data.candidateName || "[Candidate Name]"}</p>
            <p className="text-center">
              has successfully completed the <strong>{data.internshipTitle || "[Internship Program]"}</strong> from <strong>{formatMonthYear(data.startDate)}</strong> to <strong>{formatMonthYear(data.endDate)}</strong>.
            </p>
            {data.projectUndertaken && (
              <p className="text-center mt-4">
                Outstanding contribution on: <strong>{data.projectUndertaken}</strong>
              </p>
            )}
           </>
        )}
      </div>

      {/* Signatures & Stamp */}
      <div className="mt-14 space-y-1">
        <p className="text-[17px] text-black">Sincere Regards</p>
        <p className="text-[17px] text-black">For {data.companyName}</p>
        
        <div className="mt-6 mb-4">
          <img src="/certificate-stamp.jpg" alt="NowScripts Stamp" className="h-[120px] w-[120px] object-contain mix-blend-multiply" />
        </div>

        <p className="text-[17px] text-black">HR Department</p>
        <p className="text-[17px] font-bold text-black">Senior Director – HR Shared Service</p>
      </div>

      {/* Footer Branding and Verification */}
      <div className="absolute bottom-[60px] left-[80px] right-[80px] flex justify-between items-end border-t border-gray-200 pt-6">
        <div className="w-full flex justify-between text-[13px] text-gray-500 items-center">
          <span className="flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
            https://nowscript.in/
          </span>
          <span className="flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
            Remote
          </span>
          <span className="flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
            hr@nowscripts.com
          </span>
        </div>
      </div>
    </div>
  );
});
