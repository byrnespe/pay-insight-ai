// Job titles and locations for programmatic SEO pages
// These generate /salaries/[job-slug]/[location-slug] URLs

export interface JobTitle {
  slug: string;
  name: string;
  industry: string;
  level: "entry" | "mid" | "senior" | "lead" | "director";
  keywords: string[];
}

export interface LocationData {
  slug: string;
  name: string;
  benchmarkId: string; // Maps to locations array in industryBenchmarks.ts
}

export const jobTitles: JobTitle[] = [
  // Technology
  { slug: "software-engineer", name: "Software Engineer", industry: "technology", level: "mid", keywords: ["developer", "programmer", "coder"] },
  { slug: "senior-software-engineer", name: "Senior Software Engineer", industry: "technology", level: "senior", keywords: ["senior developer", "senior programmer"] },
  { slug: "staff-engineer", name: "Staff Engineer", industry: "technology", level: "lead", keywords: ["staff software engineer", "principal engineer"] },
  { slug: "engineering-manager", name: "Engineering Manager", industry: "technology", level: "director", keywords: ["eng manager", "dev manager"] },
  { slug: "frontend-developer", name: "Frontend Developer", industry: "technology", level: "mid", keywords: ["front-end", "react developer", "ui developer"] },
  { slug: "backend-developer", name: "Backend Developer", industry: "technology", level: "mid", keywords: ["back-end", "server developer", "api developer"] },
  { slug: "full-stack-developer", name: "Full Stack Developer", industry: "technology", level: "mid", keywords: ["fullstack", "web developer"] },
  { slug: "devops-engineer", name: "DevOps Engineer", industry: "technology", level: "mid", keywords: ["site reliability", "sre", "platform engineer"] },
  { slug: "data-engineer", name: "Data Engineer", industry: "technology", level: "mid", keywords: ["data pipeline", "etl developer"] },
  { slug: "data-scientist", name: "Data Scientist", industry: "technology", level: "mid", keywords: ["ml engineer", "machine learning"] },
  { slug: "senior-data-scientist", name: "Senior Data Scientist", industry: "technology", level: "senior", keywords: ["lead data scientist"] },
  { slug: "machine-learning-engineer", name: "Machine Learning Engineer", industry: "technology", level: "senior", keywords: ["ml engineer", "ai engineer"] },
  { slug: "product-manager", name: "Product Manager", industry: "technology", level: "mid", keywords: ["pm", "product owner"] },
  { slug: "senior-product-manager", name: "Senior Product Manager", industry: "technology", level: "senior", keywords: ["senior pm"] },
  { slug: "product-director", name: "Product Director", industry: "technology", level: "director", keywords: ["director of product", "vp product"] },
  { slug: "ux-designer", name: "UX Designer", industry: "technology", level: "mid", keywords: ["user experience", "product designer"] },
  { slug: "ui-designer", name: "UI Designer", industry: "technology", level: "mid", keywords: ["visual designer", "interface designer"] },
  { slug: "qa-engineer", name: "QA Engineer", industry: "technology", level: "mid", keywords: ["quality assurance", "test engineer", "sdet"] },
  { slug: "security-engineer", name: "Security Engineer", industry: "technology", level: "senior", keywords: ["cybersecurity", "infosec"] },
  { slug: "cloud-architect", name: "Cloud Architect", industry: "technology", level: "lead", keywords: ["solutions architect", "aws architect"] },
  { slug: "junior-developer", name: "Junior Developer", industry: "technology", level: "entry", keywords: ["entry level developer", "associate developer"] },
  { slug: "tech-lead", name: "Tech Lead", industry: "technology", level: "lead", keywords: ["technical lead", "team lead"] },
  { slug: "cto", name: "CTO", industry: "technology", level: "director", keywords: ["chief technology officer", "vp engineering"] },
  { slug: "mobile-developer", name: "Mobile Developer", industry: "technology", level: "mid", keywords: ["ios developer", "android developer", "app developer"] },
  { slug: "systems-engineer", name: "Systems Engineer", industry: "technology", level: "mid", keywords: ["infrastructure engineer", "it engineer"] },

  // Finance
  { slug: "financial-analyst", name: "Financial Analyst", industry: "finance", level: "entry", keywords: ["finance analyst", "fp&a analyst"] },
  { slug: "senior-financial-analyst", name: "Senior Financial Analyst", industry: "finance", level: "mid", keywords: ["senior finance analyst"] },
  { slug: "investment-banker", name: "Investment Banker", industry: "finance", level: "mid", keywords: ["ib analyst", "investment banking"] },
  { slug: "investment-banking-associate", name: "Investment Banking Associate", industry: "finance", level: "senior", keywords: ["ib associate"] },
  { slug: "private-equity-associate", name: "Private Equity Associate", industry: "finance", level: "senior", keywords: ["pe associate"] },
  { slug: "hedge-fund-analyst", name: "Hedge Fund Analyst", industry: "finance", level: "mid", keywords: ["fund analyst"] },
  { slug: "quantitative-analyst", name: "Quantitative Analyst", industry: "finance", level: "senior", keywords: ["quant", "quantitative trader"] },
  { slug: "risk-analyst", name: "Risk Analyst", industry: "finance", level: "mid", keywords: ["risk manager"] },
  { slug: "compliance-officer", name: "Compliance Officer", industry: "finance", level: "senior", keywords: ["compliance manager"] },
  { slug: "accountant", name: "Accountant", industry: "finance", level: "entry", keywords: ["staff accountant", "cpa"] },
  { slug: "senior-accountant", name: "Senior Accountant", industry: "finance", level: "mid", keywords: ["accounting manager"] },
  { slug: "controller", name: "Controller", industry: "finance", level: "director", keywords: ["financial controller", "assistant controller"] },
  { slug: "cfo", name: "CFO", industry: "finance", level: "director", keywords: ["chief financial officer", "vp finance"] },

  // Marketing
  { slug: "marketing-manager", name: "Marketing Manager", industry: "marketing", level: "mid", keywords: ["marketing lead"] },
  { slug: "senior-marketing-manager", name: "Senior Marketing Manager", industry: "marketing", level: "senior", keywords: ["marketing director"] },
  { slug: "digital-marketing-manager", name: "Digital Marketing Manager", industry: "marketing", level: "mid", keywords: ["online marketing manager"] },
  { slug: "content-marketing-manager", name: "Content Marketing Manager", industry: "marketing", level: "mid", keywords: ["content strategist"] },
  { slug: "seo-manager", name: "SEO Manager", industry: "marketing", level: "mid", keywords: ["search marketing manager", "seo specialist"] },
  { slug: "social-media-manager", name: "Social Media Manager", industry: "marketing", level: "mid", keywords: ["social media coordinator"] },
  { slug: "growth-marketing-manager", name: "Growth Marketing Manager", industry: "marketing", level: "senior", keywords: ["growth hacker", "growth lead"] },
  { slug: "brand-manager", name: "Brand Manager", industry: "marketing", level: "mid", keywords: ["brand marketing manager"] },
  { slug: "marketing-coordinator", name: "Marketing Coordinator", industry: "marketing", level: "entry", keywords: ["marketing assistant"] },
  { slug: "cmo", name: "CMO", industry: "marketing", level: "director", keywords: ["chief marketing officer", "vp marketing"] },

  // Healthcare
  { slug: "healthcare-administrator", name: "Healthcare Administrator", industry: "healthcare", level: "mid", keywords: ["hospital administrator", "health admin"] },
  { slug: "clinical-operations-manager", name: "Clinical Operations Manager", industry: "healthcare", level: "senior", keywords: ["clinical manager"] },
  { slug: "healthcare-analyst", name: "Healthcare Analyst", industry: "healthcare", level: "entry", keywords: ["health data analyst"] },
  { slug: "medical-director", name: "Medical Director", industry: "healthcare", level: "director", keywords: ["clinical director"] },
  { slug: "health-informatics-specialist", name: "Health Informatics Specialist", industry: "healthcare", level: "mid", keywords: ["health it specialist"] },

  // Consulting
  { slug: "management-consultant", name: "Management Consultant", industry: "consulting", level: "mid", keywords: ["strategy consultant", "business consultant"] },
  { slug: "senior-consultant", name: "Senior Consultant", industry: "consulting", level: "senior", keywords: ["lead consultant"] },
  { slug: "consulting-manager", name: "Consulting Manager", industry: "consulting", level: "lead", keywords: ["engagement manager"] },
  { slug: "partner", name: "Partner", industry: "consulting", level: "director", keywords: ["consulting partner", "managing director"] },

  // Sales
  { slug: "sales-representative", name: "Sales Representative", industry: "sales", level: "entry", keywords: ["sales rep", "account executive"] },
  { slug: "account-executive", name: "Account Executive", industry: "sales", level: "mid", keywords: ["ae", "sales executive"] },
  { slug: "senior-account-executive", name: "Senior Account Executive", industry: "sales", level: "senior", keywords: ["enterprise ae"] },
  { slug: "sales-manager", name: "Sales Manager", industry: "sales", level: "lead", keywords: ["sales team lead"] },
  { slug: "sales-director", name: "Sales Director", industry: "sales", level: "director", keywords: ["vp sales", "head of sales"] },

  // Human Resources
  { slug: "hr-manager", name: "HR Manager", industry: "hr", level: "mid", keywords: ["human resources manager"] },
  { slug: "recruiter", name: "Recruiter", industry: "hr", level: "entry", keywords: ["talent acquisition", "hr recruiter"] },
  { slug: "senior-recruiter", name: "Senior Recruiter", industry: "hr", level: "mid", keywords: ["lead recruiter", "talent acquisition specialist"] },
  { slug: "hr-director", name: "HR Director", industry: "hr", level: "director", keywords: ["vp hr", "chief people officer"] },
  { slug: "compensation-analyst", name: "Compensation Analyst", industry: "hr", level: "mid", keywords: ["comp analyst", "total rewards analyst"] },
];

export const salaryLocations: LocationData[] = [
  // US Major Cities
  { slug: "san-francisco", name: "San Francisco", benchmarkId: "sf" },
  { slug: "new-york", name: "New York City", benchmarkId: "nyc" },
  { slug: "seattle", name: "Seattle", benchmarkId: "seattle" },
  { slug: "austin", name: "Austin", benchmarkId: "austin" },
  { slug: "chicago", name: "Chicago", benchmarkId: "chicago" },
  { slug: "boston", name: "Boston", benchmarkId: "chicago" }, // Uses Chicago modifier
  { slug: "denver", name: "Denver", benchmarkId: "austin" }, // Uses Austin modifier
  { slug: "los-angeles", name: "Los Angeles", benchmarkId: "sf" },
  { slug: "miami", name: "Miami", benchmarkId: "other_us" },
  { slug: "atlanta", name: "Atlanta", benchmarkId: "other_us" },
  { slug: "dallas", name: "Dallas", benchmarkId: "austin" },
  { slug: "remote", name: "Remote (US)", benchmarkId: "remote_us" },
  
  // International
  { slug: "london", name: "London, UK", benchmarkId: "london" },
  { slug: "toronto", name: "Toronto", benchmarkId: "toronto" },
  { slug: "berlin", name: "Berlin", benchmarkId: "berlin" },
  { slug: "sydney", name: "Sydney", benchmarkId: "sydney" },
  { slug: "amsterdam", name: "Amsterdam", benchmarkId: "amsterdam" },
  { slug: "singapore", name: "Singapore", benchmarkId: "singapore" },
];

// Generate all URL combinations for sitemap
export const generateAllSalaryPageUrls = (): string[] => {
  const urls: string[] = [];
  for (const job of jobTitles) {
    for (const location of salaryLocations) {
      urls.push(`/salaries/${job.slug}/${location.slug}`);
    }
  }
  return urls;
};

// Get job and location by slugs
export const getJobBySlug = (slug: string): JobTitle | undefined => {
  return jobTitles.find((job) => job.slug === slug);
};

export const getLocationBySlug = (slug: string): LocationData | undefined => {
  return salaryLocations.find((loc) => loc.slug === slug);
};
