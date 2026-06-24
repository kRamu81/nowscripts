import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, Check } from "lucide-react";
import { httpRequest } from "../../interceptor/axiosInterceptor";
import { url } from "../../baseUrl";
import { toast } from "react-hot-toast";

interface EditProfileModalProps {
  profile: any;
  onClose: () => void;
  refetch: () => void;
}

export default function EditProfileModal({ profile, onClose, refetch }: EditProfileModalProps) {
  const [formData, setFormData] = useState({
    name: profile.name || "",
    username: profile.username || "",
    bio: profile.bio || "",
    location: profile.location || "",
    college: profile.college || "",
    currentRole: profile.currentRole || "",
    currentLearningTrack: profile.currentLearningTrack || "",
    aboutMe: profile.aboutMe || "",
    skills: profile.skills ? profile.skills.join(", ") : "",
    socialLinks: {
      github: profile.socialLinks?.github || "",
      linkedin: profile.socialLinks?.linkedin || "",
      portfolio: profile.socialLinks?.portfolio || "",
      website: profile.socialLinks?.website || "",
    },
    servicenow: {
      csaStatus: profile.servicenow?.csaStatus || "Not Started",
      cadStatus: profile.servicenow?.cadStatus || "Not Started",
      itsmStatus: profile.servicenow?.itsmStatus || "Not Started",
      currentCertificationGoal: profile.servicenow?.currentCertificationGoal || "",
      currentModule: profile.servicenow?.currentModule || "",
      learningProgress: profile.servicenow?.learningProgress || 0,
    },
    privacy: {
      isPublicProfile: profile.privacy?.isPublicProfile ?? true,
      showCertifications: profile.privacy?.showCertifications ?? true,
      showLearningProgress: profile.privacy?.showLearningProgress ?? true,
      showActivityFeed: profile.privacy?.showActivityFeed ?? true,
      showEmail: profile.privacy?.showEmail ?? false,
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(profile.avatar || "");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNestedChange = (section: 'socialLinks' | 'servicenow' | 'privacy', field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      let avatarUrl = avatarPreview;
      
      // If there's a new avatar file, convert it to base64
      if (avatarFile) {
        avatarUrl = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(avatarFile);
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = (error) => reject(error);
        });
      }

      const payload = {
        ...formData,
        avatar: avatarUrl,
        skills: formData.skills.split(',').map((s: string) => s.trim()).filter((s: string) => s)
      };

      await httpRequest.put(`${url}/user/myprofile`, payload);
      toast.success("Profile updated successfully!");
      refetch();
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 dark:bg-black/70 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white dark:bg-[#0F172A] w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Profile Information</h2>
            <button 
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-8">
            
            {/* Avatar Section */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">Photo</label>
              <div className="flex items-center gap-6">
                <img 
                  src={avatarPreview || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(formData.name)}`} 
                  alt="Avatar preview" 
                  className="w-24 h-24 rounded-full object-cover border border-slate-200 dark:border-slate-800"
                />
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full font-medium transition-colors text-sm">
                      <Upload className="w-4 h-4" /> Upload Image
                      <input type="file" accept="image/png, image/jpeg, image/webp" className="hidden" onChange={handleAvatarChange} />
                    </label>
                    <button type="button" onClick={() => setAvatarPreview(`https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(formData.name + Math.random().toString())}`)} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full font-medium transition-colors text-sm">
                      Generate Random Avatar
                    </button>
                    <button type="button" onClick={() => setAvatarPreview(`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(formData.name)}`)} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full font-medium transition-colors text-sm">
                      Use Initials Avatar
                    </button>
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400">Recommended: Square JPG, PNG, or WEBP, at least 1,000 pixels per side. Max 5MB.</span>
                </div>
              </div>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Name</label>
                <input 
                  type="text" name="name" value={formData.name} onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-now-primary/50"
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Username</label>
                <input 
                  type="text" name="username" value={formData.username} onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-now-primary/50"
                  placeholder="username"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Short Bio</label>
                <input 
                  type="text" name="bio" value={formData.bio} onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-now-primary/50"
                  placeholder="A short tagline about yourself"
                  maxLength={160}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Location</label>
                <input 
                  type="text" name="location" value={formData.location} onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-now-primary/50"
                  placeholder="City, Country"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">College/University</label>
                <input 
                  type="text" name="college" value={formData.college} onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-now-primary/50"
                  placeholder="Where you studied"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Current Role</label>
                <input 
                  type="text" name="currentRole" value={formData.currentRole} onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-now-primary/50"
                  placeholder="e.g. Junior Developer"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Learning Track</label>
                <input 
                  type="text" name="currentLearningTrack" value={formData.currentLearningTrack} onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-now-primary/50"
                  placeholder="e.g. ServiceNow Developer"
                />
              </div>
            </div>

            {/* About Me & Skills */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">About Me</label>
                <textarea 
                  name="aboutMe" value={formData.aboutMe} onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-now-primary/50 resize-none"
                  placeholder="Tell us about your background, goals, and journey..."
                  maxLength={1000}
                ></textarea>
                <div className="text-right text-xs text-slate-500 mt-1">{formData.aboutMe.length}/1000</div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Skills (comma separated)</label>
                <input 
                  type="text" name="skills" value={formData.skills} onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-now-primary/50"
                  placeholder="ServiceNow, JavaScript, ITSM, Flow Designer"
                />
              </div>
            </div>

            {/* ServiceNow Progress */}
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4 border-b border-slate-200 dark:border-slate-800 pb-2">ServiceNow Progress</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">CSA Status</label>
                  <select 
                    value={formData.servicenow.csaStatus} onChange={(e) => handleNestedChange('servicenow', 'csaStatus', e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none"
                  >
                    <option value="Not Started">Not Started</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Certified">Certified</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">CAD Status</label>
                  <select 
                    value={formData.servicenow.cadStatus} onChange={(e) => handleNestedChange('servicenow', 'cadStatus', e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none"
                  >
                    <option value="Not Started">Not Started</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Certified">Certified</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">ITSM Status</label>
                  <select 
                    value={formData.servicenow.itsmStatus} onChange={(e) => handleNestedChange('servicenow', 'itsmStatus', e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none"
                  >
                    <option value="Not Started">Not Started</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Certified">Certified</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Current Certification Goal</label>
                  <input 
                    type="text" value={formData.servicenow.currentCertificationGoal} onChange={(e) => handleNestedChange('servicenow', 'currentCertificationGoal', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-slate-900 dark:text-slate-100 focus:outline-none"
                    placeholder="e.g. CSA"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Current Module Studying</label>
                  <input 
                    type="text" value={formData.servicenow.currentModule} onChange={(e) => handleNestedChange('servicenow', 'currentModule', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-slate-900 dark:text-slate-100 focus:outline-none"
                    placeholder="e.g. Scheduled Jobs"
                  />
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4 border-b border-slate-200 dark:border-slate-800 pb-2">Social Links</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">GitHub URL</label>
                  <input 
                    type="url" value={formData.socialLinks.github} onChange={(e) => handleNestedChange('socialLinks', 'github', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-now-primary/50"
                    placeholder="https://github.com/..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">LinkedIn URL</label>
                  <input 
                    type="url" value={formData.socialLinks.linkedin} onChange={(e) => handleNestedChange('socialLinks', 'linkedin', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-now-primary/50"
                    placeholder="https://linkedin.com/in/..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Portfolio</label>
                  <input 
                    type="url" value={formData.socialLinks.portfolio} onChange={(e) => handleNestedChange('socialLinks', 'portfolio', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-now-primary/50"
                    placeholder="https://myportfolio.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Website</label>
                  <input 
                    type="url" value={formData.socialLinks.website} onChange={(e) => handleNestedChange('socialLinks', 'website', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-now-primary/50"
                    placeholder="https://mywebsite.com"
                  />
                </div>
              </div>
            </div>

            {/* Privacy Settings */}
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4 border-b border-slate-200 dark:border-slate-800 pb-2">Privacy</h3>
              <div className="space-y-3">
                {Object.entries(formData.privacy).map(([key, value]) => (
                  <label key={key} className="flex items-center gap-3 cursor-pointer">
                    <div className="relative inline-block w-10 h-6">
                      <input 
                        type="checkbox" 
                        className="opacity-0 w-0 h-0 peer" 
                        checked={value}
                        onChange={(e) => handleNestedChange('privacy', key, e.target.checked)}
                      />
                      <span className="absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-slate-300 dark:bg-slate-700 rounded-full transition-colors duration-200 ease-in-out peer-checked:bg-now-primary"></span>
                      <span className={`absolute left-1 bottom-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ease-in-out ${value ? 'translate-x-4' : ''}`}></span>
                    </div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </span>
                  </label>
                ))}
              </div>
            </div>

          </div>

          <div className="p-6 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3 bg-slate-50 dark:bg-[#0F172A]">
            <button 
              onClick={onClose}
              disabled={isLoading}
              className="px-6 py-2.5 rounded-full font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              disabled={isLoading}
              className="px-6 py-2.5 rounded-full font-medium bg-now-primary text-white hover:bg-now-primary/90 transition-colors flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...
                </>
              ) : (
                <>Save Changes</>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
