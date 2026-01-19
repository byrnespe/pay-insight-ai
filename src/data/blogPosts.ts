export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: "negotiation" | "salary-guides" | "career-advice";
  publishedAt: string;
  readTime: number;
  metaDescription: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: "how-to-negotiate-salary",
    title: "How to Negotiate Your Salary: A Step-by-Step Guide",
    excerpt: "A practical framework for salary negotiations that focuses on preparation, timing, and clear communication.",
    category: "negotiation",
    publishedAt: "2025-01-15",
    readTime: 8,
    metaDescription: "Learn how to negotiate your salary with confidence. A step-by-step guide covering research, timing, scripting, and handling counteroffers.",
    content: `
## Why Salary Negotiation Matters

Most people leave money on the table by not negotiating. Research suggests that failing to negotiate your starting salary can cost you over $1 million in lifetime earnings. Yet many professionals skip this step entirely.

This isn't about being aggressive or demanding. It's about understanding your market value and communicating it clearly.

## Step 1: Research Your Market Value

Before any negotiation, you need data. Without it, you're guessing.

**Where to find salary data:**
- Industry salary surveys (Levels.fyi, Glassdoor, Payscale)
- Job postings with salary ranges
- Professional networks and colleagues
- Recruiter conversations

**What to research:**
- Base salary ranges for your role and level
- Total compensation (bonus, equity, benefits)
- Geographic pay differences
- Company size and funding stage impacts

Document everything. You'll reference this during negotiations.

## Step 2: Know Your Bottom Line

Before entering any conversation, define two numbers:

1. **Your target**: The number you'd be genuinely satisfied with
2. **Your walk-away point**: The minimum you'll accept

The gap between these gives you negotiating room. If an offer falls below your walk-away point, you need to be prepared to decline.

## Step 3: Timing Matters

**Best times to negotiate:**
- After receiving a written offer (not during interviews)
- During performance reviews with documented achievements
- After completing a major project
- When taking on significantly more responsibility

**Avoid negotiating when:**
- The company just announced layoffs
- Your performance has been questioned
- You have no alternative options

## Step 4: Script Your Opening

Don't wing it. Prepare exactly what you'll say.

**For a new offer:**
"Thank you for the offer. I'm excited about this opportunity. Based on my research and experience, I was expecting compensation closer to [target]. Is there flexibility on the base salary?"

**For a raise:**
"I'd like to discuss my compensation. Over the past year, I've [specific achievements]. Based on my contributions and market rates for this role, I believe an adjustment to [target] reflects my current value."

Keep it brief. State your case, then stop talking.

## Step 5: Handle the Response

**If they say yes:** Thank them and get it in writing.

**If they counter:** Consider the full package. Ask for time to think if needed. Don't accept or reject on the spot.

**If they say no:** Ask what would need to change for them to revisit compensation. Get a timeline for the next review.

## Step 6: Consider the Full Package

Salary is one component. If there's no flexibility on base pay, explore:

- Signing bonus
- Annual bonus structure
- Equity or stock options
- Additional PTO
- Remote work flexibility
- Professional development budget
- Earlier review date

Sometimes a company can't move on salary but has flexibility elsewhere.

## Common Mistakes to Avoid

**Negotiating too early**: Wait for a written offer before discussing numbers.

**Accepting immediately**: Even if you love the offer, ask for 24-48 hours to review.

**Making it personal**: Focus on market value and contributions, not personal expenses.

**Bluffing without backup**: Don't claim competing offers you don't have.

**Apologizing**: You're not asking for a favor. You're discussing fair compensation.

## What If You're Not Good at Negotiating?

Practice. Literally rehearse your script out loud. Have a friend play the hiring manager.

Write down your key points so you don't forget them under pressure.

Remember: the worst outcome is usually "no, but here's what we can do." Most offers aren't rescinded for reasonable negotiation.

## The Bottom Line

Negotiation is a normal part of compensation discussions. Companies expect it. The key is preparation: know your value, have data to support it, and communicate clearly.

If you're unsure whether your current compensation is fair, start by understanding where you stand relative to market rates.
    `
  },
  {
    slug: "software-engineer-salary-guide-2025",
    title: "Software Engineer Salary Guide 2025: What You Should Be Earning",
    excerpt: "A data-driven breakdown of software engineering compensation across levels, locations, and company types.",
    category: "salary-guides",
    publishedAt: "2025-01-10",
    readTime: 10,
    metaDescription: "2025 software engineer salary guide with compensation data by experience level, location, and company type. Understand what developers earn.",
    content: `
## The State of Software Engineering Compensation

Software engineering remains one of the highest-paid professions, but compensation varies dramatically based on experience, location, company type, and specialization.

This guide breaks down what software engineers are earning in 2025, based on industry data and market research.

## Compensation by Experience Level

### Entry Level (0-2 years)
- **Base salary range**: $70,000 - $130,000
- **Total compensation**: $75,000 - $160,000

At this level, the spread primarily depends on company type. A new grad at a FAANG company can earn 2x what they'd make at a small startup or agency.

### Mid-Level (3-5 years)
- **Base salary range**: $110,000 - $180,000
- **Total compensation**: $130,000 - $280,000

This is where specialization starts to matter. Engineers with in-demand skills (ML, distributed systems, security) command premiums.

### Senior (6-10 years)
- **Base salary range**: $150,000 - $250,000
- **Total compensation**: $200,000 - $450,000

At senior level, equity becomes a significant portion of compensation at tech companies. The gap between public companies and startups widens.

### Staff/Principal (10+ years)
- **Base salary range**: $200,000 - $350,000
- **Total compensation**: $350,000 - $800,000+

At this level, compensation is highly variable and often individually negotiated. Impact and scope matter more than years of experience.

## Geographic Variations

**Highest paying markets:**
- San Francisco Bay Area: +30-50% above national average
- Seattle: +20-40% above national average
- New York City: +20-35% above national average

**Remote work impact:**
Some companies pay "location-agnostic" rates (usually pegged to tier-1 markets). Others adjust pay based on cost of living. The difference can be 20-40%.

## Company Type Matters

**Big Tech (FAANG/MAANG):**
- Highest total compensation
- Significant equity component
- Structured levels and bands
- Competitive hiring process

**High-growth Startups:**
- Lower base, higher equity potential
- More responsibility earlier
- Equity value highly speculative
- Faster title progression

**Mid-size Tech Companies:**
- Competitive base salaries
- Smaller equity grants than big tech
- Often better work-life balance
- Less brand recognition

**Non-tech Companies:**
- Generally lower compensation
- Smaller or no equity component
- May offer better job security
- Technology often not the priority

## Specialization Premiums

Certain specializations command higher compensation:

- **Machine Learning/AI**: +15-30%
- **Security**: +10-25%
- **Distributed Systems**: +10-20%
- **Mobile (iOS/Android)**: +5-15%
- **DevOps/SRE**: +5-15%

These premiums vary by market conditions. Today's hot specialty may normalize tomorrow.

## Beyond Base Salary

Total compensation often includes:

**Annual Bonus:**
- 10-20% of base at most tech companies
- Can be higher at trading firms, finance

**Equity:**
- RSUs at public companies (liquid value)
- Stock options at startups (speculative value)
- Typically 4-year vesting with 1-year cliff

**Benefits:**
- Health insurance (varies in quality)
- 401k matching (0-6% typical)
- Unlimited PTO (often means less PTO taken)

## Signs You Might Be Underpaid

- You haven't had a meaningful raise in 2+ years
- New hires at your level are earning more
- Recruiters consistently quote higher ranges
- Your company's equity has lost significant value
- Your responsibilities have grown but compensation hasn't

## How to Research Your Worth

1. Check levels.fyi for crowdsourced compensation data
2. Talk to recruiters (they'll tell you market rates)
3. Network with peers at similar levels
4. Review job postings with salary transparency

## The Bottom Line

Software engineering compensation is influenced by many factors. Level and company type typically have the biggest impact, followed by location and specialization.

If you suspect your compensation doesn't match your contribution, start by gathering data. Understand what the market pays for your skills and experience. Then you can have an informed conversation about your worth.
    `
  },
  {
    slug: "raise-denied-what-to-do-next",
    title: "Your Raise Request Was Denied: What to Do Next",
    excerpt: "A practical guide for handling rejection and planning your next steps without burning bridges.",
    category: "negotiation",
    publishedAt: "2025-01-08",
    readTime: 6,
    metaDescription: "What to do when your raise request is denied. Practical steps for understanding why, planning next moves, and deciding whether to stay or leave.",
    content: `
## First: Don't React Immediately

Getting a "no" stings. But how you respond in this moment matters.

Take a breath. Thank them for the conversation. Ask for time to process. Don't make any statements about your future you might regret.

## Understand the "Why"

Not all denials are equal. Understanding the reason helps you decide next steps.

**Budget constraints:**
"We don't have budget right now" may be legitimate. Companies have compensation cycles and budget limitations.

**Questions to ask:**
- When is the next compensation review cycle?
- What would need to happen for this to be reconsidered?
- Can we schedule a follow-up in 3-6 months?

**Performance concerns:**
If the denial relates to your performance, you need clarity.

**Questions to ask:**
- What specific areas need improvement?
- What does success look like in this role?
- How will progress be measured?

**Structural limitations:**
Sometimes you've hit the ceiling for your role or level.

**Questions to ask:**
- What would promotion to the next level require?
- Is there a path to increased compensation in my current role?
- Are there other roles that might be a better fit?

## Document Everything

After the conversation, write down:
- The specific reason given
- Any commitments made (timeline for review, goals to meet)
- Your understanding of next steps

Send a brief email summarizing the conversation. This creates a record and confirms you're aligned.

## Evaluate Your Options

You have three paths forward:

### Option 1: Work the Plan

If you were given specific goals or a timeline, you can choose to pursue them. This makes sense when:
- The feedback seems fair and actionable
- You believe the commitment to revisit is genuine
- You value other aspects of the job enough to stay

Set a calendar reminder for the review date. Continue documenting your achievements.

### Option 2: Start Looking

Sometimes a denial is information about your future at this company. Consider job searching if:
- The reason given seems like a deflection
- You've heard similar promises before that weren't kept
- Your research shows you're significantly underpaid
- There's no clear path to the compensation you need

You don't have to quit. But knowing your options gives you leverage.

### Option 3: Ask for Alternatives

If salary isn't moving, explore other forms of value:
- Additional equity or bonus
- More flexible schedule
- Professional development budget
- Title change that improves future earnings
- Reduced workload to match current pay

Sometimes companies have more flexibility in these areas than base salary.

## What Not to Do

**Don't threaten to quit** unless you mean it. Empty threats damage your credibility.

**Don't badmouth to colleagues.** It rarely helps and often hurts.

**Don't immediately disengage.** Continue doing good work while you evaluate options.

**Don't assume it's permanent.** Circumstances change. A no today isn't always a no forever.

## When to Walk Away

Some situations warrant moving on:

- Repeated broken promises about compensation
- Being paid significantly below market with no path to correction
- Taking on more responsibility without corresponding pay
- Realizing the company doesn't value your role

Walking away isn't failure. Sometimes it's the clearest path to the compensation you deserve.

## The Bottom Line

A denied raise is a data point, not a verdict. Use it to gather information about your standing and your options.

Whether you stay and work toward the next conversation or start exploring alternatives, make the decision intentionally. Don't let frustration drive reactive choices, but don't let loyalty keep you in a situation that undervalues your contribution.
    `
  },
  {
    slug: "signs-you-are-underpaid",
    title: "5 Signs You're Being Underpaid (And What to Do About It)",
    excerpt: "How to recognize when your compensation doesn't match your value, and practical steps to address it.",
    category: "career-advice",
    publishedAt: "2025-01-05",
    readTime: 5,
    metaDescription: "Learn the warning signs that you're being underpaid at work. Recognize compensation gaps and understand your options for addressing them.",
    content: `
## The Problem With Not Knowing

Most people have no idea whether they're paid fairly. Salary discussions are often taboo, and companies benefit from this information asymmetry.

Here are five signs that suggest you might be underpaid—and what you can do about each one.

## Sign 1: You Haven't Had a Meaningful Raise in Years

Inflation alone means that flat compensation is effectively a pay cut. If your salary hasn't increased by at least 3-4% annually, your purchasing power is declining.

Beyond inflation, your value typically increases with experience. Two years in a role usually means more skill, more institutional knowledge, and more responsibility than when you started.

**What to do:** Calculate what your salary would be with 4% annual increases. Compare that to your current pay. If there's a significant gap, you have a starting point for conversation.

## Sign 2: New Hires at Your Level Earn More

Companies often pay market rates to attract new talent while existing employees remain at their original salary. This creates pay equity issues over time.

If you discover that a peer with similar experience was hired at a higher salary, that's a clear signal your pay hasn't kept pace with market rates.

**What to do:** Pay transparency laws in many states now require salary ranges in job postings. Check what your company is offering for roles similar to yours.

## Sign 3: Recruiters Quote Higher Numbers

If recruiters consistently reach out with opportunities paying 20%+ more than your current salary, the market is telling you something.

One data point is noise. But if multiple sources suggest your compensation is below market, take it seriously.

**What to do:** Take recruiter calls even if you're not actively looking. Ask about compensation ranges. This keeps you informed about your market value.

## Sign 4: Your Responsibilities Have Grown But Pay Hasn't

Scope creep is common. You take on a project, prove yourself, and suddenly that's just part of your job. Repeat this pattern and you may be doing a senior role at a junior salary.

**Questions to consider:**
- How does your current role compare to your job description?
- Are you managing people without a manager title?
- Have you absorbed work from departing colleagues?

**What to do:** Document the evolution of your role. List responsibilities you've added since your last compensation adjustment. This becomes evidence for your case.

## Sign 5: Your Company's Equity Has Lost Value

If a significant portion of your compensation was equity that's now worth less (or worthless), your actual compensation has dropped—even if your base salary stayed the same.

This is especially common at startups that raised at high valuations and have since corrected.

**What to do:** Calculate your total compensation based on current equity value, not grant-date value. If there's a significant gap, that's a legitimate topic for discussion.

## What To Do If You Recognize These Signs

### Step 1: Gather Data

Before any conversation, know the market rate for your role, level, and location. Use multiple sources:
- Levels.fyi, Glassdoor, Payscale
- Job postings with salary ranges
- Recruiter conversations
- Industry salary surveys

### Step 2: Document Your Value

List your contributions, achievements, and expanded responsibilities. Focus on impact:
- Projects completed
- Revenue influenced
- Problems solved
- Skills developed

### Step 3: Choose Your Approach

**Internal path:** Request a compensation review. Present your data and contributions. Ask for alignment with market rates.

**External path:** Start interviewing. Get competing offers. Use them as leverage or as your exit.

**Hybrid path:** Explore both. See what your company will do while understanding your alternatives.

## A Note on Perspective

Being underpaid isn't a moral failing or a reflection of your worth. It's usually the result of market dynamics, company policies, and the simple fact that employers don't voluntarily increase costs.

Recognizing the gap is the first step. What you do with that information is up to you.
    `
  },
  {
    slug: "remote-work-salary-negotiation",
    title: "Remote Work Salary Negotiation: Should You Accept a Pay Cut?",
    excerpt: "How to think about compensation when location is no longer tied to office, and when to push back on geographic adjustments.",
    category: "negotiation",
    publishedAt: "2025-01-02",
    readTime: 7,
    metaDescription: "Navigate remote work salary negotiations. Understand geographic pay policies, when to accept adjustments, and how to negotiate fair remote compensation.",
    content: `
## The Geographic Pay Question

Remote work has complicated compensation. If you can work from anywhere, should you be paid based on where you live or where the company is headquartered?

Companies have taken different approaches, and there's no universal right answer. But understanding the landscape helps you negotiate effectively.

## Common Company Approaches

### Location-Agnostic Pay

Some companies pay the same regardless of where you live. This is typically benchmarked to high-cost markets like San Francisco or New York.

**The upside:** Moving to a lower cost area means more purchasing power without a pay cut.

**The reality:** Fewer companies take this approach than before. It's expensive to maintain, and some have reversed course.

### Cost-of-Living Adjusted Pay

Many companies adjust compensation based on where you live. Move from San Francisco to Denver, and your salary might decrease 10-20%.

**The logic:** The company pays for the same "lifestyle" regardless of location. You can afford similar housing, food, and services.

**The counterargument:** Your output doesn't change based on your zip code. Why should your pay?

### Tiered Location Bands

Some companies create geographic tiers (e.g., Tier 1: Major metros, Tier 2: Mid-size cities, Tier 3: Everything else) with corresponding pay bands.

This is a middle ground—simpler than individual city adjustments but still location-dependent.

## When Pay Cuts Make Sense

There are situations where accepting geographic adjustment is reasonable:

**You initiated the move.** If you asked to relocate from the company's hub to a lower-cost area, some adjustment may be expected.

**The difference is modest.** A 5-10% adjustment might be offset by lower cost of living. Do the math on net purchasing power.

**The total package is still competitive.** If you're still at or above market rate for your new location, the adjustment may not matter.

**You gain other value.** Flexibility, lifestyle, family proximity—these have real worth even if they don't show up in your paycheck.

## When to Push Back

**You were hired remote.** If you were hired to work remotely, your compensation was set with that in mind. Retroactive adjustments are questionable.

**Your value hasn't changed.** You're doing the same work, producing the same output. The only thing that changed is your address.

**You're being adjusted below market.** If the "adjusted" rate is below what other companies pay for remote workers in your role, that's not adjustment—it's underpayment.

**The policy is inconsistent.** If some employees are location-adjusted and others aren't, question the policy.

## How to Negotiate Remote Compensation

### If You're Already Employed and Moving

Request a conversation before announcing your move. Understand the policy. If adjustment is proposed, negotiate.

**Potential arguments:**
- "My output and value remain the same regardless of location."
- "I'd like to discuss maintaining my current compensation given my track record."
- "What would it take to be approved for location-agnostic pay?"

### If You're Job Hunting

Ask about geographic pay policy early in the process. It affects whether an opportunity makes sense.

**Questions to ask:**
- "How does remote work factor into compensation?"
- "Are there geographic adjustments to the stated salary range?"
- "Is there flexibility in the location policy for strong candidates?"

### If You Have Leverage

Competing offers, strong performance, or in-demand skills give you negotiating power.

Use it: "I have another offer at X rate with no location adjustment. I'd prefer to stay, but I need compensation that reflects my market value."

## The Math That Matters

Don't just compare salaries. Compare purchasing power.

If a 15% pay cut comes with a 30% reduction in housing costs and no state income tax, you might come out ahead.

Calculate:
- Net income after taxes in each location
- Housing costs for comparable living situations
- Other major expenses (childcare, transportation, healthcare)

Then make an informed decision.

## The Bottom Line

Geographic pay policies are company choices, not laws of nature. They can be negotiated.

If you're asked to accept a pay cut for remote work, understand the policy, calculate the real impact, and make a case if the adjustment seems unfair. Your productivity isn't determined by your longitude.
    `
  },
  {
    slug: "how-to-ask-for-raise-email-templates",
    title: "How to Ask for a Raise Over Email (With Templates)",
    excerpt: "When and how to use email in salary discussions, plus templates you can adapt for different situations.",
    category: "negotiation",
    publishedAt: "2024-12-28",
    readTime: 6,
    metaDescription: "Learn when to ask for a raise via email and how to write an effective salary increase request. Includes templates for different scenarios.",
    content: `
## Should You Ask for a Raise Over Email?

Email is rarely ideal for the actual negotiation, but it's useful for:

- **Requesting a meeting** to discuss compensation
- **Following up** after a verbal conversation
- **Documenting** what was agreed
- **Initiating** when your manager is remote or difficult to schedule

The key is knowing when email serves you and when it limits you.

## When Email Works

**To request a meeting:**
Email is perfect for signaling you want to discuss compensation without surprising your manager in the hallway.

**When your manager is remote:**
If scheduling synchronous time is difficult, email can open the conversation. But aim for a video call for the actual discussion.

**To follow up:**
After a verbal conversation, email creates a paper trail of what was discussed and agreed.

**When you need time to articulate your case:**
Writing allows you to organize your thoughts and present them clearly.

## When to Avoid Email

**For the main negotiation:**
Back-and-forth negotiation is easier in real-time. Tone is clearer. Adjustments happen faster.

**When the relationship is strained:**
Email can escalate tension. Difficult conversations usually go better face-to-face.

**When you need to read reactions:**
Your manager's body language and tone tell you things email can't.

## Template 1: Requesting a Meeting

Subject: Request to discuss compensation

Hi [Manager's name],

I'd like to schedule time to discuss my compensation. I've been reflecting on my contributions over the past [time period] and believe a conversation is warranted.

Would you have 30 minutes this week or next? I'm happy to work around your schedule.

Thanks,
[Your name]

---

**Why this works:**
- Clear and direct
- Gives them time to prepare
- Doesn't ambush them with demands
- Shows flexibility on timing

## Template 2: Making Your Case (When Email Is Necessary)

Subject: Compensation discussion

Hi [Manager's name],

Thank you for the conversation about my role last [whenever]. I wanted to follow up with some thoughts on compensation.

Over the past [time period], I've:
- [Specific achievement with impact]
- [Specific achievement with impact]
- [Specific achievement with impact]

Based on my expanded responsibilities and market rates for this role, I'd like to discuss adjusting my salary to [target range or specific number].

I'd welcome the chance to talk this through. Would you have time this week?

Thanks,
[Your name]

---

**Why this works:**
- References previous conversation
- Provides specific evidence
- States a clear ask
- Invites further discussion

## Template 3: Following Up After a Verbal Discussion

Subject: Following up on our compensation conversation

Hi [Manager's name],

Thank you for meeting with me today to discuss compensation. I wanted to summarize my understanding:

- [What was discussed]
- [Any commitments made]
- [Timeline for next steps]

Please let me know if I've captured anything incorrectly.

I appreciate your time and consideration.

Thanks,
[Your name]

---

**Why this works:**
- Creates a written record
- Confirms mutual understanding
- Gives them a chance to correct misunderstandings
- Shows professionalism

## Template 4: After a Denial

Subject: Following up on compensation review

Hi [Manager's name],

Thank you for the honest conversation about compensation. I understand that [reason given for denial].

I'd like to understand what success looks like moving forward. Specifically:
- What goals or milestones would position me for a compensation review?
- What timeline makes sense to revisit this?

I remain committed to [team/company] and want to ensure we're aligned on the path forward.

Thanks,
[Your name]

---

**Why this works:**
- Accepts the outcome professionally
- Focuses on future, not past
- Gets specific commitments
- Maintains the relationship

## What to Avoid in Salary Emails

**Ultimatums:** "If I don't get a raise, I'll leave." (Unless you mean it and have options.)

**Comparisons to colleagues:** "I heard John makes more than me." (This creates problems for everyone.)

**Personal financial needs:** "I need more money for my mortgage." (Not relevant to your market value.)

**Excessive justification:** Keep it concise. Three strong points beat ten mediocre ones.

**Apologetic tone:** "I'm sorry to ask, but..." You're not asking for a favor.

## The Bottom Line

Email is a tool. Use it to prepare, document, and follow up—but aim for real conversation when possible.

Whatever format you choose, the fundamentals remain: know your value, present evidence, make a clear ask, and be prepared for any response.
    `
  }
];

export const categories = [
  { value: "all", label: "All Articles" },
  { value: "negotiation", label: "Negotiation Tips" },
  { value: "salary-guides", label: "Salary Guides" },
  { value: "career-advice", label: "Career Advice" }
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find(post => post.slug === slug);
}

export function getBlogPostsByCategory(category: string): BlogPost[] {
  if (category === "all") return blogPosts;
  return blogPosts.filter(post => post.category === category);
}

export function getRelatedPosts(currentSlug: string, limit: number = 3): BlogPost[] {
  const current = getBlogPost(currentSlug);
  if (!current) return blogPosts.slice(0, limit);
  
  return blogPosts
    .filter(post => post.slug !== currentSlug)
    .sort((a, b) => {
      // Prioritize same category
      if (a.category === current.category && b.category !== current.category) return -1;
      if (b.category === current.category && a.category !== current.category) return 1;
      return 0;
    })
    .slice(0, limit);
}
