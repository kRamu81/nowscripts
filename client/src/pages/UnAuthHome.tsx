import { useEffect, lazy, Suspense } from "react";
import { useAppContext } from "../App";
import Hero from "../components/Hero";
import { StatsCounters } from "../components/landing/StatsCounters";
import { LearningPathsV2 } from "../components/landing/LearningPathsV2";
import { ProjectsShowcaseV2 } from "../components/landing/ProjectsShowcaseV2";

// Lazy-loaded components below the fold for better Lighthouse scores
const WhatMakesNowScriptsDifferent = lazy(() => import("../components/landing/WhatMakesNowScriptsDifferent").then(module => ({ default: module.WhatMakesNowScriptsDifferent })));
const PlatformShowcase = lazy(() => import("../components/landing/PlatformShowcase").then(module => ({ default: module.PlatformShowcase })));
const CompanyDemand = lazy(() => import("../components/landing/CompanyDemand").then(module => ({ default: module.CompanyDemand })));
const CertificationTimeline = lazy(() => import("../components/landing/CertificationTimeline").then(module => ({ default: module.CertificationTimeline })));
const TestimonialsV2 = lazy(() => import("../components/landing/TestimonialsV2").then(module => ({ default: module.TestimonialsV2 })));
const SuccessStories = lazy(() => import("../components/landing/SuccessStories").then(module => ({ default: module.SuccessStories })));
const CommunitySection = lazy(() => import("../components/landing/CommunitySection").then(module => ({ default: module.CommunitySection })));
const FAQSectionV2 = lazy(() => import("../components/landing/FAQSectionV2").then(module => ({ default: module.FAQSectionV2 })));
const FinalCTA = lazy(() => import("../components/landing/FinalCTA").then(module => ({ default: module.FinalCTA })));
const FooterV2 = lazy(() => import("../components/landing/FooterV2").then(module => ({ default: module.FooterV2 })));

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
      <StatsCounters />
      <LearningPathsV2 />
      <ProjectsShowcaseV2 />
      
      <Suspense fallback={<SectionSkeleton />}>
        <WhatMakesNowScriptsDifferent />
        <PlatformShowcase />
        <CompanyDemand />
        <CertificationTimeline />
        <TestimonialsV2 />
        <SuccessStories />
        <CommunitySection />
        <FAQSectionV2 />
        <FinalCTA />
        <FooterV2 />
      </Suspense>
    </div>
  );
}
