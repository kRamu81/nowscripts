import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { url } from "../../baseUrl";
import { useAppContext } from "../../App";
import { Search, Plus, Filter, Download, X, Check, AlertCircle, FileText } from "lucide-react";

interface Certificate {
  _id: string;
  certificateId: string;
  verificationNumber: string;
  candidateName: string;
  email: string;
  internshipTitle: string;
  companyName: string;
  issueDate: string;
  startDate: string;
  endDate: string;
  mentorName: string;
  status: "Active" | "Revoked" | "Expired";
  createdAt: string;
}

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

export default function AdminCertificates() {
  const { handleToast } = useAppContext();
  const queryClient = useQueryClient();

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    candidateName: "",
    email: "",
    internshipTitle: INTERNSHIP_PROGRAMS[0],
    companyName: "NowScripts Private Limited",
    issueDate: new Date().toISOString().split('T')[0],
    startDate: "",
    endDate: "",
    mentorName: "",
  });

  // Debounce Search
  useState(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(handler);
  });

  // Fetch Certificates
  const fetchCertificates = async (page: number, search: string, status: string) => {
    const params = new URLSearchParams({ page: page.toString(), limit: "10" });
    if (search) params.append("search", search);
    if (status !== "All") params.append("status", status);
    
    const token = localStorage.getItem("token");
    const response = await axios.get(`${url}/certificate/list?${params.toString()}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  };

  const { data, isLoading } = useQuery({
    queryKey: ["adminCertificates", currentPage, debouncedSearch, statusFilter],
    queryFn: () => fetchCertificates(currentPage, debouncedSearch, statusFilter),
    keepPreviousData: true,
  });

  const certificates = data?.certificates || [];
  const pagination = data?.pagination;

  // Mutations
  const createMutation = useMutation({
    mutationFn: async (newCert: any) => {
      const token = localStorage.getItem("token");
      return axios.post(`${url}/certificate/create`, newCert, {
        headers: { Authorization: `Bearer ${token}` }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["adminCertificates"]);
      handleToast("Certificate issued successfully");
      setIsModalOpen(false);
      // Reset form
      setFormData({
        ...formData,
        candidateName: "",
        email: "",
        startDate: "",
        endDate: "",
        mentorName: "",
      });
    },
    onError: (err: any) => {
      handleToast(err.response?.data?.message || "Failed to issue certificate");
    }
  });

  const revokeMutation = useMutation({
    mutationFn: async (id: string) => {
      const token = localStorage.getItem("token");
      return axios.patch(`${url}/certificate/revoke/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["adminCertificates"]);
      handleToast("Certificate revoked successfully");
    },
    onError: (err: any) => {
      handleToast(err.response?.data?.message || "Failed to revoke certificate");
    }
  });

  // Handlers
  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  const handleExportCSV = () => {
    if (!certificates.length) return handleToast("No data to export");
    
    const headers = ["Certificate ID", "Verification Number", "Candidate Name", "Email", "Internship Title", "Issue Date", "Status"];
    const csvContent = [
      headers.join(","),
      ...certificates.map((c: Certificate) => [
        c.certificateId,
        c.verificationNumber,
        `"${c.candidateName}"`,
        `"${c.email}"`,
        `"${c.internshipTitle}"`,
        new Date(c.issueDate).toLocaleDateString(),
        c.status
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const urlBlob = URL.createObjectURL(blob);
    link.setAttribute("href", urlBlob);
    link.setAttribute("download", `nowscripts_certificates_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] p-6 lg:p-10 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#0F172A] mb-2 flex items-center gap-2">
              <FileText className="w-8 h-8 text-now-primary" />
              Certificate Management
            </h1>
            <p className="text-[#64748B]">Issue, verify, and manage internship credentials.</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={handleExportCSV}
              className="px-4 py-2 bg-white border border-[#E2E8F0] text-[#475569] font-semibold rounded-lg shadow-sm hover:bg-gray-50 transition flex items-center gap-2"
            >
              <Download className="w-4 h-4" /> Export CSV
            </button>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="px-5 py-2 bg-now-primary text-white font-semibold rounded-lg shadow-sm hover:bg-now-accent transition flex items-center gap-2"
            >
              <Plus className="w-5 h-5" /> Issue Certificate
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-[#E2E8F0] mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by ID, Name, or Email..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-now-primary/50"
            />
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <Filter className="w-5 h-5 text-gray-400" />
            <select 
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              className="px-4 py-2 border border-[#E2E8F0] bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-now-primary/50 text-[#0F172A]"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Revoked">Revoked</option>
              <option value="Expired">Expired</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F1F5F9] border-b border-[#E2E8F0] text-[#475569] text-sm uppercase tracking-wider">
                  <th className="px-6 py-4 font-bold">Certificate ID</th>
                  <th className="px-6 py-4 font-bold">Candidate</th>
                  <th className="px-6 py-4 font-bold">Program</th>
                  <th className="px-6 py-4 font-bold">Issue Date</th>
                  <th className="px-6 py-4 font-bold">Status</th>
                  <th className="px-6 py-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-gray-500">Loading certificates...</td>
                  </tr>
                ) : certificates.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-gray-500">No certificates found.</td>
                  </tr>
                ) : (
                  certificates.map((cert: Certificate) => (
                    <tr key={cert._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-[#0F172A]">{cert.certificateId}</div>
                        <div className="text-xs text-[#64748B] font-mono">{cert.verificationNumber}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-[#0F172A]">{cert.candidateName}</div>
                        <div className="text-sm text-[#64748B]">{cert.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {cert.internshipTitle.replace(" Internship", "")}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-[#475569]">
                        {new Date(cert.issueDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        {cert.status === "Active" ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                            <Check className="w-3 h-3 mr-1" /> Active
                          </span>
                        ) : cert.status === "Revoked" ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                            <X className="w-3 h-3 mr-1" /> Revoked
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                            <AlertCircle className="w-3 h-3 mr-1" /> Expired
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-medium">
                        <a 
                          href={`/verify/${cert.certificateId}`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="text-now-primary hover:text-now-accent mr-4"
                        >
                          View
                        </a>
                        {cert.status === "Active" && (
                          <button 
                            onClick={() => {
                              if (window.confirm("Are you sure you want to revoke this certificate?")) {
                                revokeMutation.mutate(cert.certificateId);
                              }
                            }}
                            className="text-red-500 hover:text-red-700"
                          >
                            Revoke
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {pagination && pagination.pages > 1 && (
            <div className="px-6 py-4 border-t border-[#E2E8F0] flex items-center justify-between">
              <p className="text-sm text-[#64748B]">
                Showing page <span className="font-semibold text-[#0F172A]">{pagination.page}</span> of <span className="font-semibold text-[#0F172A]">{pagination.pages}</span>
              </p>
              <div className="flex gap-2">
                <button 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-[#E2E8F0] rounded-md text-sm font-medium text-[#475569] disabled:opacity-50 hover:bg-gray-50"
                >
                  Previous
                </button>
                <button 
                  onClick={() => setCurrentPage(p => Math.min(pagination.pages, p + 1))}
                  disabled={currentPage === pagination.pages}
                  className="px-3 py-1 border border-[#E2E8F0] rounded-md text-sm font-medium text-[#475569] disabled:opacity-50 hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal for Issue Certificate */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between bg-gray-50">
              <h2 className="text-xl font-bold text-[#0F172A]">Issue New Certificate</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <form id="issue-cert-form" onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-sm font-semibold text-[#475569] mb-1">Candidate Name</label>
                  <input required type="text" value={formData.candidateName} onChange={e => setFormData({...formData, candidateName: e.target.value})} className="w-full px-4 py-2 border border-[#E2E8F0] rounded-lg focus:ring-2 focus:ring-now-primary/50 focus:border-now-primary outline-none" />
                </div>
                
                <div className="col-span-1">
                  <label className="block text-sm font-semibold text-[#475569] mb-1">Email Address</label>
                  <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-2 border border-[#E2E8F0] rounded-lg focus:ring-2 focus:ring-now-primary/50 focus:border-now-primary outline-none" />
                </div>
                
                <div className="col-span-1">
                  <label className="block text-sm font-semibold text-[#475569] mb-1">Mentor Name</label>
                  <input required type="text" value={formData.mentorName} onChange={e => setFormData({...formData, mentorName: e.target.value})} className="w-full px-4 py-2 border border-[#E2E8F0] rounded-lg focus:ring-2 focus:ring-now-primary/50 focus:border-now-primary outline-none" />
                </div>

                <div className="col-span-1 md:col-span-2">
                  <label className="block text-sm font-semibold text-[#475569] mb-1">Internship Program</label>
                  <select required value={formData.internshipTitle} onChange={e => setFormData({...formData, internshipTitle: e.target.value})} className="w-full px-4 py-2 border border-[#E2E8F0] rounded-lg focus:ring-2 focus:ring-now-primary/50 focus:border-now-primary outline-none bg-white">
                    {INTERNSHIP_PROGRAMS.map(prog => (
                      <option key={prog} value={prog}>{prog}</option>
                    ))}
                  </select>
                </div>
                
                <div className="col-span-1">
                  <label className="block text-sm font-semibold text-[#475569] mb-1">Start Date</label>
                  <input required type="date" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} className="w-full px-4 py-2 border border-[#E2E8F0] rounded-lg focus:ring-2 focus:ring-now-primary/50 focus:border-now-primary outline-none" />
                </div>
                
                <div className="col-span-1">
                  <label className="block text-sm font-semibold text-[#475569] mb-1">End Date</label>
                  <input required type="date" value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} className="w-full px-4 py-2 border border-[#E2E8F0] rounded-lg focus:ring-2 focus:ring-now-primary/50 focus:border-now-primary outline-none" />
                </div>
              </form>
            </div>
            
            <div className="px-6 py-4 border-t border-[#E2E8F0] bg-gray-50 flex justify-end gap-3 mt-auto">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2 border border-[#E2E8F0] text-[#475569] font-semibold rounded-lg hover:bg-gray-100 transition">
                Cancel
              </button>
              <button type="submit" form="issue-cert-form" disabled={createMutation.isLoading} className="px-5 py-2 bg-now-primary text-white font-semibold rounded-lg hover:bg-now-accent transition disabled:opacity-70 flex items-center gap-2">
                {createMutation.isLoading ? "Issuing..." : "Issue Certificate"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
