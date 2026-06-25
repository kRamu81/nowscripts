import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Eye, EyeOff, ShieldCheck, ArrowRight, Loader2, MailCheck, KeyRound } from "lucide-react";
import { useAuthModal } from "../contexts/AuthModalContext";
import { useAuth } from "../contexts/Auth";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useGoogleLogin } from '@react-oauth/google';
import { url } from "../baseUrl";

export function AuthModal() {
  const { isOpen, view, closeModal, setView } = useAuthModal();
  const { handleUser } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
      setTimeout(() => {
        if (inputRef.current) inputRef.current.focus();
      }, 100);
    } else {
      document.body.style.overflow = "unset";
      setName("");
      setEmail("");
      setPassword("");
      setOtp("");
      setShowPassword(false);
      setSubmitted(false);
      setError(null);
      setSuccessMsg(null);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, closeModal, view]);

  const handleGoogleAuth = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await axios.post(`${url}/auth/google/direct`, {
          access_token: tokenResponse.access_token
        });
        
        if (res.data.access_token) {
          localStorage.setItem("access_token", JSON.stringify(res.data.access_token));
          localStorage.setItem("refresh_token", JSON.stringify(res.data.refresh_token));
          handleUser(res.data);
          closeModal();
          
          const redirectPath = localStorage.getItem("redirect_after_login") || "/";
          localStorage.removeItem("redirect_after_login");
          if (window.location.pathname !== redirectPath) {
            navigate(redirectPath);
          }
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Google authentication failed");
        console.error("Google authentication failed", err);
      }
    },
    onError: () => {
      setError("Google Login Failed");
      console.error("Google Login Failed");
    }
  });

  const validatePassword = (pass: string) => {
    const minLength = 8;
    const hasUpper = /[A-Z]/.test(pass);
    const hasLower = /[a-z]/.test(pass);
    const hasNumber = /[0-9]/.test(pass);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pass);
    return pass.length >= minLength && hasUpper && hasLower && hasNumber && hasSpecial;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setError(null);
    setSuccessMsg(null);

    try {
      if (view === "login") {
        if (!email || !password) return;
        setIsLoading(true);
        const res = await axios.post(`${url}/auth/login`, { email, password });
        localStorage.setItem("access_token", JSON.stringify(res.data.access_token));
        localStorage.setItem("refresh_token", JSON.stringify(res.data.refresh_token));
        handleUser(res.data);
        closeModal();
      } else if (view === "signup") {
        if (!name || !email || !password) return;
        if (!validatePassword(password)) {
          setError("Password must be at least 8 characters and contain uppercase, lowercase, number, and special character.");
          return;
        }
        setIsLoading(true);
        const res = await axios.post(`${url}/auth/register`, { name, email, password });
        localStorage.setItem("access_token", JSON.stringify(res.data.access_token));
        localStorage.setItem("refresh_token", JSON.stringify(res.data.refresh_token));
        handleUser(res.data);
        closeModal();
      } else if (view === "forgot_password") {
        if (!email) return;
        setIsLoading(true);
        await axios.post(`${url}/auth/forgot-password`, { email });
        setSuccessMsg("OTP sent to your email!");
        setTimeout(() => setView("verify_otp"), 2000);
      } else if (view === "verify_otp") {
        if (!email || !otp) return;
        setIsLoading(true);
        const res = await axios.post(`${url}/auth/verify-otp`, { email, otp });
        setSuccessMsg("OTP Verified!");
        setTimeout(() => setView("reset_password"), 1500);
      } else if (view === "reset_password") {
        if (!password) return;
        if (!validatePassword(password)) {
          setError("Password must be at least 8 characters and contain uppercase, lowercase, number, and special character.");
          return;
        }
        setIsLoading(true);
        await axios.post(`${url}/auth/reset-password`, { email, otp, password });
        setSuccessMsg("Password reset successfully! You can now log in.");
        setTimeout(() => setView("login"), 2000);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderContent = () => {
    switch (view) {
      case "forgot_password":
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <h2 className="text-[24px] font-bold text-gray-900 mb-2">Reset Password</h2>
            <p className="text-gray-500 mb-6 text-[14px]">Enter your email address and we'll send you a 6-digit code to reset your password.</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input ref={inputRef} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" className="w-full h-[48px] bg-white/50 border border-gray-300 rounded-md px-4 text-[15px] text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              <button disabled={isLoading} type="submit" className="w-full h-[48px] bg-[#4f46e5] hover:bg-[#4338ca] text-white font-bold rounded-md flex items-center justify-center gap-2 transition-all">
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Send Reset Code"}
              </button>
            </form>
            <button onClick={() => setView("login")} className="mt-6 text-sm text-gray-600 hover:text-gray-900 mx-auto block">Back to Login</button>
          </motion.div>
        );
      case "verify_otp":
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="flex justify-center mb-4"><MailCheck className="w-12 h-12 text-indigo-500" /></div>
            <h2 className="text-[24px] font-bold text-gray-900 mb-2 text-center">Enter Verification Code</h2>
            <p className="text-gray-500 mb-6 text-[14px] text-center">We've sent a code to <span className="font-semibold text-gray-800">{email}</span></p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input ref={inputRef} type="text" maxLength={6} value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="6-digit code" className="w-full h-[48px] bg-white/50 border border-gray-300 rounded-md px-4 text-center text-xl tracking-[0.5em] font-semibold text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              <button disabled={isLoading} type="submit" className="w-full h-[48px] bg-[#4f46e5] hover:bg-[#4338ca] text-white font-bold rounded-md flex items-center justify-center transition-all">
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify Code"}
              </button>
            </form>
          </motion.div>
        );
      case "reset_password":
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="flex justify-center mb-4"><KeyRound className="w-12 h-12 text-indigo-500" /></div>
            <h2 className="text-[24px] font-bold text-gray-900 mb-6 text-center">Create New Password</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <input ref={inputRef} type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="New Password" className="w-full h-[48px] bg-white/50 border border-gray-300 rounded-md pl-4 pr-12 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <button disabled={isLoading} type="submit" className="w-full h-[48px] bg-[#4f46e5] hover:bg-[#4338ca] text-white font-bold rounded-md flex items-center justify-center transition-all">
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Reset Password"}
              </button>
            </form>
          </motion.div>
        );
      default:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="mb-6">
              <h2 className="text-[24px] font-bold text-gray-900">{view === "login" ? "Welcome back" : "Create an Account"}</h2>
              <p className="text-gray-500 text-[14px] mt-1">{view === "login" ? "Enter your credentials to access your account." : "Join us to manage your learning and certifications."}</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {view === "signup" && (
                <input ref={inputRef} type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full Name" className="w-full h-[48px] bg-white/50 border border-gray-300 rounded-md px-4 text-[15px] text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              )}
              <input ref={view === "login" ? inputRef : null} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" className="w-full h-[48px] bg-white/50 border border-gray-300 rounded-md px-4 text-[15px] text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              <div>
                <div className="relative">
                  <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full h-[48px] bg-white/50 border border-gray-300 rounded-md pl-4 pr-12 text-[15px] text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {view === "login" && (
                  <div className="flex justify-end mt-2">
                    <button type="button" onClick={() => setView("forgot_password")} className="text-[13px] text-indigo-600 font-medium hover:underline">Forgot password?</button>
                  </div>
                )}
              </div>
              <button disabled={isLoading} type="submit" className="w-full h-[48px] bg-[#4f46e5] hover:bg-[#4338ca] text-white text-[16px] font-bold rounded-md flex items-center justify-center transition-all mt-2">
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : view === "login" ? "Log in" : "Create Account"}
              </button>
            </form>
            <div className="flex items-center gap-3 my-6">
              <div className="h-[1px] bg-gray-200 flex-1"></div>
              <span className="text-gray-500 text-[13px] font-medium uppercase tracking-wider">Or continue with</span>
              <div className="h-[1px] bg-gray-200 flex-1"></div>
            </div>
            <button
                type="button"
                onClick={() => handleGoogleAuth()}
                className="w-full bg-white border border-slate-200 text-slate-700 py-2.5 px-4 rounded-lg font-medium hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 mb-4"
              ><img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" /> Google
            </button>
            <div className="text-center mt-8 text-[14px] text-gray-600">
              {view === "login" ? (
                <>Don't have an account? <button onClick={() => setView("signup")} className="text-indigo-600 font-bold hover:underline">Sign up</button></>
              ) : (
                <>Already have an account? <button onClick={() => setView("login")} className="text-indigo-600 font-bold hover:underline">Log in</button></>
              )}
            </div>
          </motion.div>
        );
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeModal} className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-[100]" />
          <div className="fixed inset-0 flex items-center justify-center z-[101] pointer-events-none px-4">
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} transition={{ type: "spring", duration: 0.5, bounce: 0 }} className="relative w-full max-w-[420px] pointer-events-auto">
              {/* Glassmorphic Container */}
              <div className="w-full bg-white/80 backdrop-blur-xl border border-white/40 rounded-2xl p-8 shadow-[0_8px_32px_rgba(0,0,0,0.08)] relative overflow-hidden">
                {/* Decorative background gradient blobs */}
                <div className="absolute top-[-50%] left-[-10%] w-[200px] h-[200px] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-[-50%] right-[-10%] w-[250px] h-[250px] bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
                
                <button onClick={closeModal} className="absolute top-5 right-5 text-gray-400 hover:text-gray-800 transition-colors z-10 bg-white/50 rounded-full p-1">
                  <X className="w-5 h-5" />
                </button>

                <AnimatePresence mode="wait">
                  {error && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 text-[13px] rounded-lg">
                      {error}
                    </motion.div>
                  )}
                  {successMsg && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="mb-4 p-3 bg-green-50 border border-green-100 text-green-600 text-[13px] rounded-lg flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4" /> {successMsg}
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence mode="wait" custom={view}>
                  {renderContent()}
                </AnimatePresence>

              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
