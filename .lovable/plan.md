
# Plan: Add 10 New Blog Posts

## Overview
Add 10 new blog posts to `src/data/blogPosts.ts` covering a mix of negotiation tips, salary guides, and career advice. Each post will follow the existing format with SEO-optimized titles, meta descriptions, and high-quality content targeting relevant search keywords.

## New Blog Posts to Create

### Negotiation Tips (3 posts)

| # | Slug | Title | Target Keywords |
|---|------|-------|-----------------|
| 1 | `counter-offer-strategies` | How to Handle a Counter Offer (From Your Current Employer) | counter offer, job offer negotiation |
| 2 | `negotiating-job-offer-benefits` | Beyond Salary: Negotiating Benefits, PTO, and Perks | negotiate benefits, job offer negotiation |
| 3 | `first-job-salary-negotiation` | Salary Negotiation for Your First Job: A Beginner's Guide | first job salary, entry level negotiation |

### Salary Guides (4 posts)

| # | Slug | Title | Target Keywords |
|---|------|-------|-----------------|
| 4 | `product-manager-salary-guide-2025` | Product Manager Salary Guide 2025: What PMs Actually Earn | product manager salary, PM compensation |
| 5 | `data-scientist-salary-guide-2025` | Data Scientist Salary Guide 2025: Complete Compensation Breakdown | data scientist salary, data science pay |
| 6 | `marketing-manager-salary-guide-2025` | Marketing Manager Salary Guide 2025: Salary Ranges by Industry | marketing manager salary, marketing compensation |
| 7 | `startup-vs-big-tech-compensation` | Startup vs Big Tech: Which Actually Pays More? | startup salary, big tech compensation |

### Career Advice (3 posts)

| # | Slug | Title | Target Keywords |
|---|------|-------|-----------------|
| 8 | `when-to-leave-your-job` | 7 Signs It's Time to Leave Your Job | when to quit job, leave job signs |
| 9 | `promotion-vs-new-job` | Should You Wait for a Promotion or Find a New Job? | promotion vs new job, career advancement |
| 10 | `salary-transparency-conversation` | How to Talk About Salary With Coworkers (Without Making It Weird) | salary transparency, talk about pay |

---

## Post Structure

Each post will follow the existing format:
- **slug**: URL-friendly identifier
- **title**: SEO-optimized, clear value proposition
- **excerpt**: 1-2 sentence hook (for listing page)
- **content**: 800-1200 words in Markdown with H2/H3 headings, bullet points, and actionable advice
- **category**: "negotiation" | "salary-guides" | "career-advice"
- **publishedAt**: Dates spread across recent weeks
- **readTime**: Calculated based on content length (5-10 mins)
- **metaDescription**: 150-160 character SEO description

---

## Content Outline for Each Post

### 1. Counter Offer Strategies (negotiation, 7 min)
- Why employers make counter offers
- The hidden risks of accepting
- How to evaluate a counter offer objectively
- Script for declining professionally
- When it actually makes sense to stay

### 2. Negotiating Job Offer Benefits (negotiation, 6 min)
- Benefits that are often negotiable
- How to prioritize (PTO, remote work, signing bonus, etc.)
- Timing: when to bring up benefits
- Scripts for asking about each benefit type
- What to get in writing

### 3. First Job Salary Negotiation (negotiation, 6 min)
- Why entry-level candidates should still negotiate
- Research strategies for new grads
- Overcoming "I have no leverage" mindset
- Simple script for a first negotiation
- Common mistakes new grads make

### 4. Product Manager Salary Guide (salary-guides, 9 min)
- PM compensation by level (APM to VP)
- Company type impact (FAANG vs startup)
- Geographic variations
- Total comp breakdown (base, bonus, equity)
- PM specialization premiums (Growth, Platform, Technical)

### 5. Data Scientist Salary Guide (salary-guides, 9 min)
- DS compensation by level
- Industry variations (tech, finance, healthcare)
- Skills that command premiums (ML, MLOps, NLP)
- Research scientist vs applied scientist pay
- Remote data science salaries

### 6. Marketing Manager Salary Guide (salary-guides, 8 min)
- Marketing compensation by specialty
- Industry differences (tech, agency, CPG)
- Impact of company size
- CMO track vs IC track
- In-demand marketing skills

### 7. Startup vs Big Tech Compensation (salary-guides, 8 min)
- Base salary comparison
- Equity: RSUs vs options
- Risk-adjusted compensation calculation
- Career growth trade-offs
- How to evaluate startup equity realistically

### 8. When to Leave Your Job (career-advice, 6 min)
- 7 concrete warning signs
- Emotional vs logical decision making
- Financial preparation before quitting
- How to leave on good terms
- The cost of staying too long

### 9. Promotion vs New Job (career-advice, 7 min)
- Internal promotion statistics
- Salary increase: promotion vs job switch
- Factors favoring internal path
- Factors favoring external path
- How to pursue both simultaneously

### 10. Salary Transparency Conversation (career-advice, 5 min)
- Why salary transparency helps everyone
- How to bring it up naturally
- What to share and what to keep private
- Handling reluctant colleagues
- Legal protections for discussing pay

---

## Files to Modify

| File | Action |
|------|--------|
| `src/data/blogPosts.ts` | Add 10 new BlogPost objects to the blogPosts array |

---

## SEO Benefits

- Targets high-volume keywords for different professions (PM, Data Science, Marketing)
- Covers the full job search journey (negotiation, evaluation, transition)
- Adds depth to existing categories
- Provides internal linking opportunities between related posts
- Increases total content volume for search indexing
