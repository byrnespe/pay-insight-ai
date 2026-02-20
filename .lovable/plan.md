
# Plan: Add 10 New SEO-Optimized Blog Posts

## Goal
Add 10 new blog posts to `src/data/blogPosts.ts` targeting high-search-volume keywords that are not yet covered, and add their URLs to `public/sitemap.xml`.

## Keyword Strategy

The existing 16 posts cover: general negotiation, SE/PM/data/marketing salary guides, counter offers, benefits negotiation, first-job negotiation, startup vs big tech, when to leave, promotion vs new job, and salary transparency.

The new posts target adjacent high-volume gaps:

| # | Slug | Title | Target Keywords | Category |
|---|------|-------|-----------------|----------|
| 1 | `nurse-salary-guide-2025` | Nurse Salary Guide 2025: RN, NP & Travel Nurse Pay | nurse salary, RN salary, travel nurse pay | salary-guides |
| 2 | `teacher-salary-guide-2025` | Teacher Salary Guide 2025: What Educators Actually Earn | teacher salary, educator pay, teacher raise | salary-guides |
| 3 | `ux-designer-salary-guide-2025` | UX Designer Salary Guide 2025: What Designers Earn in 2025 | UX designer salary, UI/UX pay, product designer salary | salary-guides |
| 4 | `how-to-negotiate-a-job-offer` | How to Negotiate a Job Offer (Without Losing It) | how to negotiate a job offer, negotiate job offer | negotiation |
| 5 | `average-salary-by-age` | Average Salary by Age in the US: Are You On Track? | average salary by age, salary by age 30 40 50 | salary-guides |
| 6 | `cost-of-living-salary-adjustment` | How to Negotiate a Cost of Living Salary Adjustment | cost of living salary increase, COLA raise | negotiation |
| 7 | `linkedin-salary-insights-guide` | How to Use LinkedIn Salary Insights to Research Your Pay | LinkedIn salary insights, salary research tools | career-advice |
| 8 | `how-to-read-a-pay-stub` | How to Read Your Pay Stub: Every Line Explained | how to read a pay stub, pay stub explained | career-advice |
| 9 | `equity-compensation-explained` | Equity Compensation Explained: RSUs, Options & Vesting | equity compensation, RSU vs stock options, vesting schedule | salary-guides |
| 10 | `job-hopping-salary-strategy` | Job Hopping for Salary: The Data-Driven Case for Switching Jobs | job hopping salary increase, switching jobs for more money | career-advice |

## Why These Topics Win Traffic

- **Nurse & Teacher salary guides**: Massive search volume from non-tech workers — an underserved audience on the site
- **Average salary by age**: One of the most-searched salary queries on Google ("am I earning enough at 30?")
- **How to negotiate a job offer**: Extremely high commercial intent — people searching this are mid-process and ready to act
- **Cost of living adjustment**: Highly relevant post-2024 with inflation concerns still top of mind
- **Equity compensation explained**: RSUs/options are confusing to most workers; this fills a real knowledge gap
- **LinkedIn salary insights**: Targets people already in research mode, driving them to the tool
- **How to read a pay stub**: Evergreen, high-volume, zero competition from existing posts
- **Job hopping salary strategy**: Data-driven framing appeals to searchers wanting validation

## Content Structure Per Post

Each post will follow the established format:
- 800–1,200 words in Markdown with H2/H3 headings and bullet points
- 2–3 internal links to related posts and tool pages (/, /cost-of-staying, /exploitation-check, /salaries, /benchmarks)
- `metaDescription`: 150–160 characters for SERP display
- `readTime`: Calculated at ~200 words/minute
- `publishedAt`: Dates spread across Feb–March 2026

## Files to Modify

| File | Change |
|------|--------|
| `src/data/blogPosts.ts` | Append 10 new `BlogPost` objects to the `blogPosts` array (before the closing `]`) |
| `public/sitemap.xml` | Add 10 new `<url>` entries in the Blog Posts section with `priority 0.7` and `changefreq monthly` |

## Internal Link Distribution Plan

Each new post will link to 2–3 of the following destinations to pass authority:

- `/` — Salary analysis tool (main CTA)
- `/cost-of-staying` — Cost of Staying calculator
- `/exploitation-check` — Exploitation Check tool
- `/salaries` — Salary browser
- `/benchmarks` — Industry benchmarks
- Existing blog posts (e.g., `/blog/how-to-negotiate-salary`, `/blog/startup-vs-big-tech-compensation`, `/blog/negotiating-job-offer-benefits`)

This creates a tighter internal link graph connecting the new posts to existing high-authority pages.
