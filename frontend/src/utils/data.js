import { Search, Users, FileText, MessageSquare, BarChart3, Shield, Clock, Award, Briefcase, Building2, LayoutDashboard, Plus } from "lucide-react";

export const jobSeekerFeatures = [
  {
    icon: Search,
    title: "landing.features.smartMatch.title",
    description: "landing.features.smartMatch.desc",
  },
  {
    icon: FileText,
    title: "landing.features.resumeBuilder.title",
    description: "landing.features.resumeBuilder.desc",
  },
  {
    icon: MessageSquare,
    title: "landing.features.directComm.title",
    description: "landing.features.directComm.desc",
  },
  {
    icon: Award,
    title: "landing.features.skillAssess.title",
    description: "landing.features.skillAssess.desc",
  },
];

export const employerFeatures = [
  {
    icon: Users,
    title: "landing.features.talentPool.title",
    description: "landing.features.talentPool.desc",
  },
  {
    icon: BarChart3,
    title: "landing.features.analytics.title",
    description: "landing.features.analytics.desc",
  },
  {
    icon: Shield,
    title: "landing.features.verified.title",
    description: "landing.features.verified.desc",
  },
  {
    icon: Clock,
    title: "landing.features.quickHire.title",
    description: "landing.features.quickHire.desc",
  },
];

// Navigation items configuration
// Mapped to existing keys in your translation.json "nav" section
export const NAVIGATION_MENU = [
  { id: "employer-dashboard", name: "nav.dashboard", icon: LayoutDashboard },
  { id: "post-job", name: "employer.postJob", icon: Plus }, // Use employer specific key or generic nav
  { id: "manage-jobs", name: "employer.manageJobs", icon: Briefcase },
  { id: "company-profile", name: "employer.companyProfile", icon: Building2 },
];

// Categories
// Note: You might want to add a "categories" section to your JSON later. 
// For now, I kept them as is, but you can wrap them in t() in your component like: t(`categories.${category.value}`)
export const CATEGORIES = [
  { value: "Engineering", label: "Engineering" },
  { value: "Design", label: "Design" },
  { value: "Marketing", label: "Marketing" },
  { value: "Sales", label: "Sales" },
  { value: "IT & Software", label: "IT & Software" },
  { value: "Customer-service", label: "Customer Service" },
  { value: "Product", label: "Product" },
  { value: "Operations", label: "Operations" },
  { value: "Finance", label: "Finance" },
  { value: "HR", label: "Human Resources" },
  { value: "Other", label: "Other" },
];

// Mapped to existing keys in your translation.json "job.types" section
export const JOB_TYPES = [
  { value: "Remote", label: "job.types.remote" },
  { value: "Full-Time", label: "job.types.fullTime" },
  { value: "Part-Time", label: "job.types.partTime" },
  { value: "Contract", label: "job.types.contract" },
  { value: "Internship", label: "job.types.internship" },
];

export const SALARY_RANGES = ["Less than Rp 3.000.000", "Rp 3.000.000 - Rp 7.000.000", "More than Rp 7.000.000"];