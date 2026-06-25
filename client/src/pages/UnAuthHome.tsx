import { useEffect, lazy, Suspense } from "react";
import { useAppContext } from "../App";
import Hero from "../components/Hero";

// Lazy-loaded components below the fold for better Lighthouse scores
const WhatMakesNowScriptsDifferent = lazy(() => import("../components/landing/WhatMakesNowScriptsDifferent").then(module => ({ default: module.WhatMakesNowScriptsDifferent })));
const PlatformShowcase = lazy(() => import("../components/landing/PlatformShowcase").then(module => ({ default: module.PlatformShowcase })));
const SuccessStories = lazy(() => import("../components/landing/SuccessStories").then(module => ({ default: module.SuccessStories })));
const TestimonialsV2 = lazy(() => import("../components/landing/TestimonialsV2").then(module => ({ default: module.TestimonialsV2 })));
const ServiceNowPulse = lazy(() => import("../components/landing/ServiceNowPulse").then(module => ({ default: module.ServiceNowPulse })));
const ProjectsShowcaseV2 = lazy(() => import("../components/landing/ProjectsShowcaseV2").then(module => ({ default: module.ProjectsShowcaseV2 })));
const CommunitySection = lazy(() => import("../components/landing/CommunitySection").then(module => ({ default: module.CommunitySection })));
const CertificationTimeline = lazy(() => import("../components/landing/CertificationTimeline").then(module => ({ default: module.CertificationTimeline })));
const FAQSectionV2 = lazy(() => import("../components/landing/FAQSectionV2").then(module => ({ default: module.FAQSectionV2 })));
const FinalCTA = lazy(() => import("../components/landing/FinalCTA").then(module => ({ default: module.FinalCTA })));
const FooterV2 = lazy(() => import("../components/landing/FooterV2").then(module => ({ default: module.FooterV2 })));
const InterviewExperiencesShowcase = lazy(() => import("../components/landing/InterviewExperiencesShowcase").then(module => ({ default: module.InterviewExperiencesShowcase })));

// Loading skeleton for lazy components
const SectionSkeleton = () => (
  <div className="w-full h-96 flex items-center justify-center bg-[#020617]">
    <div className="w-12 h-12 border-4 border-now-primary/30 border-t-now-primary rounded-full animate-spin"></div>
  </div>
);

export default function UnAuthHome() {
  const { hideNavbar } = useAppContext();
  
  useEffect(() => {
    hideNavbar(true);
    document.title = "NowScripts - ServiceNow Learning";
    return () => hideNavbar(false);
  }, []);

  return (
    <div className="bg-[#020617] min-h-screen text-white font-sans selection:bg-[#00E5FF] selection:text-black overflow-x-hidden">
      <Hero />
      
      <Suspense fallback={<SectionSkeleton />}>
        <WhatMakesNowScriptsDifferent />
        <PlatformShowcase />
        <SuccessStories />
        <TestimonialsV2 />
        <ServiceNowPulse />
        <ProjectsShowcaseV2 />
        <InterviewExperiencesShowcase />
        <CommunitySection />
        <CertificationTimeline />
        <FAQSectionV2 />
        <FinalCTA />
        <FooterV2 />
      </Suspense>
    </div>
  );
}
