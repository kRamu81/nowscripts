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
      className="bg-white relative mx-auto text-black font-sans flex flex-col"
      style={{ 
        width: "794px", 
        height: "1123px", 
        padding: "60px 80px", 
        boxSizing: "border-box",
        overflowWrap: "break-word",
        wordBreak: "break-word",
        whiteSpace: "normal"
      }}
    >
      {/* Header with Logo */}
      <div className="flex justify-end mb-[16px]">
        <img src="/certificate-logo.jpg" alt="NowScripts Logo" className="h-[45px] object-contain mix-blend-multiply" />
      </div>

      <div className="text-center mb-[40px]">
        <span className="text-[#1a56db] underline decoration-1 underline-offset-4" style={{ fontSize: "18px", lineHeight: "1.5" }}>
          {data.companyName}
        </span>
      </div>

      <h1 className="font-bold text-center text-black mb-[40px] tracking-tight" style={{ fontSize: "30px", lineHeight: "1.25" }}>
        {data.templateType}
      </h1>

      {/* Date */}
      <div className="text-right mb-[24px]">
        <p className="font-bold text-black" style={{ fontSize: "14px", lineHeight: "1.75" }}>{formatDate(data.issueDate)}</p>
      </div>

      {/* Name and ID Block */}
      <div className="mb-[40px] text-left">
        <h2 className="font-bold mb-[4px]" style={{ color: "#000000", fontSize: "20px", lineHeight: "1.25" }}>
          Name: {data.candidateName || "[Candidate Name]"}
        </h2>
        <p style={{ color: "#4B5563", fontSize: "14px", lineHeight: "1.75" }}>
          Certificate ID: <span className="font-semibold" style={{ color: "#1F2937" }}>{data.certificateId || "[Auto-Generated]"}</span> · {data.location || "Full-time Remote"}
        </p>
      </div>

      {/* Main Paragraph */}
      <div className="text-black flex flex-col gap-[24px]" style={{ fontSize: "14px", lineHeight: "1.75" }}>
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
              <div className="flex flex-col gap-[8px]">
                <p>Project undertaken:</p>
                <ol className="list-decimal pl-[40px]">
                  <li className="font-bold pl-[8px]">{data.projectUndertaken}</li>
                </ol>
              </div>
            )}
            
            {data.rolesAndResponsibilities && (
              <div className="flex flex-col gap-[8px]">
                <p>Intern Role's and Responsibilities:</p>
                <ul className="list-disc pl-[40px]">
                  <li className="pl-[8px]">{data.rolesAndResponsibilities}</li>
                </ul>
              </div>
            )}
            
            <p className="mt-[8px]">We wish you all the best for your future endeavors.</p>
          </>
        ) : (
           // General Certificate Text
           <div className="flex flex-col gap-[32px] items-center my-[32px]">
            <p className="italic text-gray-600" style={{ fontSize: "18px", lineHeight: "1.5" }}>This certifies that</p>
            <p className="font-bold text-[#0F172A]" style={{ fontSize: "30px", lineHeight: "1.25", textAlign: "center" }}>{data.candidateName || "[Candidate Name]"}</p>
            <p style={{ textAlign: "center", fontSize: "14px", lineHeight: "1.75" }}>
              has successfully completed the <strong>{data.internshipTitle || "[Internship Program]"}</strong> from <strong>{formatMonthYear(data.startDate)}</strong> to <strong>{formatMonthYear(data.endDate)}</strong>.
            </p>
            {data.projectUndertaken && (
              <p style={{ textAlign: "center", fontSize: "14px", lineHeight: "1.75" }}>
                Outstanding contribution on: <strong>{data.projectUndertaken}</strong>
              </p>
            )}
           </div>
        )}
      </div>

      {/* Signatures & Stamp */}
      <div className="mt-[56px] flex flex-col gap-[4px]">
        <p className="text-black" style={{ fontSize: "14px", lineHeight: "1.75" }}>Sincere Regards</p>
        <p className="text-black" style={{ fontSize: "14px", lineHeight: "1.75" }}>For {data.companyName}</p>
        
        <div className="mt-[24px] mb-[16px]">
          <img src="/certificate-stamp.jpg" alt="NowScripts Stamp" className="h-[120px] w-[120px] object-contain mix-blend-multiply" />
        </div>

        <p className="text-black" style={{ fontSize: "14px", lineHeight: "1.75" }}>HR Department</p>
        <p className="font-bold text-black" style={{ fontSize: "14px", lineHeight: "1.75" }}>Senior Director – HR Shared Service</p>
      </div>

      {/* Footer Branding and Verification */}
      <div className="mt-auto border-t border-gray-200 pt-[24px] w-full flex justify-between items-center text-gray-500" style={{ fontSize: "10px", lineHeight: "1.5" }}>
        <span className="flex items-center gap-[8px]">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
          https://nowscript.in/
        </span>
        <span className="flex items-center gap-[8px]">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
          Remote
        </span>
        <span className="flex items-center gap-[8px]">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
          hr@nowscripts.com
        </span>
      </div>
    </div>
  );
});
