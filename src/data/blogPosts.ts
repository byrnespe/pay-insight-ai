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

Salary is one component. If there's no flexibility on base pay, explore other options. Read our guide on [negotiating benefits, PTO, and perks](/blog/negotiating-job-offer-benefits) for detailed strategies on:

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

If you're unsure whether your current compensation is fair, [run a free salary analysis](/) to understand where you stand relative to market rates. You can also explore our [salary data by role and location](/salaries) for additional benchmarks.
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

If you suspect your compensation doesn't match your contribution, start by gathering data. [Check if you're underpaid with our free salary analysis tool](/) or browse [software engineer salaries by location](/salaries/software-engineer/san-francisco). You can also read about the [5 signs you're being underpaid](/blog/signs-you-are-underpaid) to identify whether it's time to negotiate.
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

A denied raise is a data point, not a verdict. Use it to gather information about your standing and your options. Try our [cost of staying calculator](/cost-of-staying) to see how much a salary gap costs you over time.

Whether you stay and work toward the next conversation or start exploring alternatives, make the decision intentionally. If you decide to try again, use our [raise request email templates](/blog/how-to-ask-for-raise-email-templates) to make your case effectively. Don't let frustration drive reactive choices, but don't let loyalty keep you in a situation that undervalues your contribution.
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

**What to do:** Calculate what your salary would be with 4% annual increases. Use our [cost of staying calculator](/cost-of-staying) to see how much that gap costs over time. If there's a significant difference, you have a starting point for conversation.

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

Recognizing the gap is the first step. [Run a free salary analysis](/) to see exactly where you stand, or check if unpaid overtime is reducing your effective pay with our [exploitation calculator](/exploitation-check). When you're ready to act, our guide on [how to negotiate your salary](/blog/how-to-negotiate-salary) walks you through the process step by step.
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

If you're asked to accept a pay cut for remote work, understand the policy, calculate the real impact, and make a case if the adjustment seems unfair. [Browse salary data by role and location](/salaries) to understand geographic differences, and read our guide on [negotiating benefits beyond salary](/blog/negotiating-job-offer-benefits) to maximize your total package. Your productivity isn't determined by your longitude.
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

Whatever format you choose, the fundamentals remain: [know your value](/) with data, present evidence, make a clear ask, and be prepared for any response. For a complete negotiation framework, see our [step-by-step salary negotiation guide](/blog/how-to-negotiate-salary). And if the answer is no, here's [what to do when your raise is denied](/blog/raise-denied-what-to-do-next).
    `
  },
  {
    slug: "counter-offer-strategies",
    title: "How to Handle a Counter Offer (From Your Current Employer)",
    excerpt: "When you resign and your employer makes a counter offer, here's how to evaluate it objectively and respond professionally.",
    category: "negotiation",
    publishedAt: "2025-01-20",
    readTime: 7,
    metaDescription: "Learn how to evaluate and respond to a counter offer from your current employer. Understand the risks, benefits, and make the right decision.",
    content: `
## Why Employers Make Counter Offers

When you hand in your resignation, a counter offer often follows. Understanding why helps you evaluate it clearly.

**The cost of replacement is high.** Recruiting, hiring, and training your replacement can cost 50-200% of your annual salary. A counter offer is often cheaper than starting over.

**Knowledge walks out the door.** You have institutional knowledge, relationships, and context that's hard to replace. Your departure creates immediate operational gaps.

**It's an emotional response.** Sometimes managers genuinely don't want to lose you. They may not have realized you were unhappy or underpaid.

**Timing is suspicious.** If they could pay you more all along, why did it take a resignation to unlock it?

## The Hidden Risks of Accepting

Statistics suggest that 50-80% of employees who accept counter offers leave within 18 months anyway. Here's why:

**The underlying issues remain.** You likely didn't resign just for money. Culture, growth opportunities, management problems—these don't change with a salary bump.

**Your loyalty is now questioned.** You've shown you were ready to leave. Some managers never forget this, even if they don't say it.

**You're now a flight risk.** When layoffs come, you may be first on the list. When promotions are decided, decision-makers remember you had one foot out the door.

**The new opportunity disappears.** You've declined an offer for something you thought was better. That bridge may be burned.

**The dynamics shift.** Your colleagues may resent that you got a raise by threatening to leave. Your manager may hold it against you.

## How to Evaluate a Counter Offer Objectively

Before deciding, work through these questions:

### 1. Why did I start looking in the first place?

Write down your original reasons for job searching. How many of them does this counter offer actually address?

- If it was purely compensation → A counter offer might work
- If it was growth, culture, management → Money probably won't fix it

### 2. What's the total package, not just salary?

Look beyond the base increase:
- Is there additional equity or bonus?
- Are they offering a promotion or title change?
- Are there commitments about future growth?
- Is anything in writing?

### 3. What would have to be true for me to stay happily?

Define your actual requirements for staying. Then honestly assess: is this counter offer meeting them, or just delaying your departure?

### 4. How do I feel about the other offer?

If you're relieved to have a reason to stay, that's data. If you're disappointed to miss the new opportunity, that's also data.

## Script for Declining Professionally

If you decide to decline the counter offer:

**Keep it simple and appreciative:**

"I really appreciate you putting this together, and I've thought carefully about it. I've decided to move forward with the other opportunity. This wasn't an easy decision—I've valued my time here and learned a lot. I want to make the transition as smooth as possible during my notice period."

**Don't over-explain.** You don't owe a detailed justification. Saying more often creates more friction.

**Don't negotiate the counter offer.** If you're leaving, negotiating sends mixed signals and wastes everyone's time.

## When It Actually Makes Sense to Stay

Counter offers aren't always traps. Consider accepting if:

- Your only issue was compensation and it's now genuinely addressed
- The offer includes concrete changes (new role, new team, new responsibilities)
- You have strong relationships and a clear growth path
- The new opportunity wasn't significantly better, just different
- You're getting commitments in writing, not just verbal promises

## Making the Decision

Create two columns: reasons to stay, reasons to go. Be honest.

Then imagine it's six months from now. In which scenario are you more likely to be satisfied?

If the counter offer is mostly about flattery and money, and the new opportunity represents genuine growth, the statistics suggest you'll be happier moving forward.

If you genuinely believe the counter offer addresses your core concerns and you prefer your current environment, staying can work.

## The Bottom Line

A counter offer is information about what your employer thinks you're worth—now that they're forced to show their hand. What you do with that information depends on why you were leaving in the first place. If you're unsure, our [red flags checklist](/red-flags) can help you evaluate whether the issues go deeper than pay.

Money can solve money problems. It rarely solves career problems. Read more about [when it's actually time to leave your job](/blog/when-to-leave-your-job) for a clearer framework.
    `
  },
  {
    slug: "negotiating-job-offer-benefits",
    title: "Beyond Salary: Negotiating Benefits, PTO, and Perks",
    excerpt: "Salary isn't the only thing on the table. Here's how to negotiate the full compensation package.",
    category: "negotiation",
    publishedAt: "2025-01-18",
    readTime: 6,
    metaDescription: "Learn how to negotiate benefits beyond salary including PTO, remote work, signing bonuses, and more. Get the full package you deserve.",
    content: `
## Why Benefits Negotiation Matters

When salary is fixed—whether due to budget constraints, pay bands, or company policy—benefits become your leverage point.

The right benefits can be worth thousands in real value:
- An extra week of PTO: $2,000-$5,000 in equivalent daily rate
- Remote work flexibility: $5,000-$15,000 in commuting and lifestyle costs
- Signing bonus: Immediate cash that doesn't affect ongoing budget

Companies often have more flexibility on benefits than base salary because they hit different budget lines.

## Benefits That Are Often Negotiable

### Signing Bonus
Usually the most flexible item. Companies can often find budget for a one-time payment when ongoing salary is constrained.

**How to ask:** "Is there flexibility on a signing bonus to help bridge the gap between the offer and my expectations?"

### PTO / Vacation Days
Many companies have standard policies but can make exceptions, especially for experienced hires.

**How to ask:** "I currently have X weeks of vacation. Is it possible to match that rather than starting at the standard accrual rate?"

### Remote Work / Flexibility
Post-pandemic, this has become a major negotiation point. Define what you want:
- Fully remote
- Hybrid schedule (which days, how often)
- Flexibility for specific circumstances (kids, caregiving)

**How to ask:** "Flexibility in where I work is important to me. Can we discuss the remote work policy for this role?"

### Start Date
Sometimes you need time between jobs. This is usually easy to negotiate.

**How to ask:** "Could we push the start date to [date]? I want to take some time to recharge before diving in."

### Professional Development Budget
Conferences, courses, certifications—these have clear value and are often easy to approve.

**How to ask:** "Is there a professional development budget for this role? I'd like to continue investing in my skills."

### Equity / Stock Options
At startups, equity is often more flexible than cash. At public companies, refresher grants can sometimes be negotiated.

**How to ask:** "Is there room to increase the equity grant? Given the level I'm coming in at, I'd expect to see more upside participation."

### Title
Titles cost companies nothing but can affect your future earning potential and opportunities.

**How to ask:** "Given my experience, would it be possible to come in at the Senior [Role] level instead of [Role]?"

### Earlier Review Date
If they can't increase the offer now, get a commitment for earlier review.

**How to ask:** "If the salary can't move now, can we schedule a compensation review in six months rather than waiting for the annual cycle?"

## How to Prioritize

Before negotiating, rank what matters most to you:

1. **Must-haves:** You won't accept without these
2. **Strong preferences:** You'll push for these but can compromise
3. **Nice-to-haves:** You'll ask, but won't walk away

This helps you trade strategically. "I understand the salary is firm. If we can get the signing bonus and an extra week of PTO, I'm ready to sign."

## Timing: When to Bring Up Benefits

**After the initial salary discussion, not before.** Let them make their best offer first.

**When salary negotiation stalls.** If they say "we can't go higher on base," that's your opening for benefits.

**Before you accept.** Once you sign, your leverage disappears.

## Scripts for Each Benefit Type

### Signing Bonus
"I'm excited about this role. The base is a bit below what I was targeting—would a signing bonus be possible to help close the gap?"

### PTO
"Vacation is important to me for maintaining productivity. I currently have four weeks—is matching that possible?"

### Remote Work
"I do my best work with schedule flexibility. Can we agree on a hybrid arrangement, perhaps three days remote?"

### Professional Development
"Continuing education is part of how I stay sharp. Is there budget allocated for conferences and courses?"

### Equity
"Given the growth potential here, I'd love more equity participation. Is the grant negotiable?"

## What to Get in Writing

Anything agreed upon should be in your offer letter:
- Signing bonus amount and payment timeline
- PTO days (especially if above standard)
- Remote work arrangement
- Professional development budget
- Title
- Review timeline

Verbal agreements are easily forgotten. If they won't put it in writing, question whether it's real.

## The Bottom Line

Salary is just one component of compensation. When it's fixed, shift your focus to the elements where companies have more flexibility.

Know your priorities, ask clearly, and get agreements in writing. For the complete negotiation playbook, see our [salary negotiation guide](/blog/how-to-negotiate-salary). And [check your market value](/) before any conversation so you're negotiating from a position of knowledge.
    `
  },
  {
    slug: "first-job-salary-negotiation",
    title: "Salary Negotiation for Your First Job: A Beginner's Guide",
    excerpt: "Think you can't negotiate as a new grad? Here's why you should—and exactly how to do it.",
    category: "negotiation",
    publishedAt: "2025-01-16",
    readTime: 6,
    metaDescription: "A beginner's guide to salary negotiation for new graduates. Learn why and how to negotiate your first job offer confidently.",
    content: `
## Why Entry-Level Candidates Should Still Negotiate

There's a common belief that new grads have no leverage. You need the job. You have no experience. What could you possibly negotiate?

Here's the reality: **most employers expect negotiation.** When they make an offer, there's usually room built in. By not negotiating, you're leaving money on the table that was allocated for you.

Even a small increase compounds over your career. A $5,000 bump in your first job affects every raise, bonus, and job change that follows.

## Overcoming the "I Have No Leverage" Mindset

You have more leverage than you think:

**They chose you.** Out of potentially hundreds of candidates, they want YOU. They've invested time in interviews, assessments, and decision-making. Starting the process over is expensive.

**They want you to say yes.** An offer sitting unsigned is stressful for hiring managers. They want to close this.

**Market data is on your side.** You may lack experience, but you have access to the same salary data as everyone else. Use it.

**The worst case is "no."** Offers are rarely rescinded for reasonable negotiation. They'll either say yes or explain why they can't.

## Research Strategies for New Grads

Without past salaries to anchor on, research is everything:

### Where to Look
- **Levels.fyi:** Best for tech roles, includes new grad offers
- **Glassdoor:** Broad coverage, filter by entry-level
- **Handshake:** If still in school, salary data from your university's placements
- **LinkedIn posts:** Many people share offer details publicly
- **University career services:** Often have salary surveys from recent grads

### What to Research
- Entry-level salaries at this specific company
- Salaries for this role at similar companies
- Geographic pay differences
- Total compensation (base + bonus + equity + benefits)

### Talk to People
- Recent grads in similar roles
- Upperclassmen who interned at the company
- Career center advisors
- Alumni in your target field

## Simple Script for Your First Negotiation

Keep it straightforward. You don't need to be aggressive or clever.

**When you receive the offer (verbally or in writing):**

"Thank you so much—I'm really excited about this opportunity. I'd like to take a day to review the details. When do you need my response by?"

**When you're ready to negotiate:**

"I've done some research on compensation for this role, and based on [market data / comparable offers / the responsibilities involved], I was hoping we could discuss the salary. Would [X] be possible?"

That's it. State your case simply. Then stop talking and wait for their response.

## What to Negotiate (Beyond Salary)

If salary is truly fixed, explore:

- **Signing bonus:** Often more flexible than base salary
- **Start date:** More time to relocate or take a break
- **PTO:** Match what competitors offer
- **Remote work options:** Even occasional flexibility helps
- **Relocation assistance:** If you're moving for the job
- **Professional development:** Conference budget, learning stipend
- **Earlier review date:** Commitment to revisit compensation in 6 months

## Common Mistakes New Grads Make

### Mistake 1: Not negotiating at all
The biggest mistake. You miss guaranteed money and set a lower baseline for your career.

### Mistake 2: Apologizing excessively
"I'm sorry to ask, but..." or "I know I'm new, but..." Stop. You're having a business conversation, not asking for charity.

### Mistake 3: Making it personal
"I need more money because my student loans are high." Your expenses aren't their problem. Focus on your market value.

### Mistake 4: Negotiating before you have an offer
Wait for the written offer. "What are your salary expectations?" is not an offer—it's a screening question.

### Mistake 5: Accepting immediately
Even if you love the offer, take time to review. "I'm thrilled. Can I take 24 hours to review everything?" This gives you space to think and negotiate.

### Mistake 6: Bluffing about other offers
Don't claim competing offers you don't have. If asked, be honest about your situation.

## What If They Say No?

It happens. Here's how to handle it:

**Understand why:** "Thanks for explaining. Is there anything that would make revisiting this possible in the future?"

**Ask about alternatives:** "If base salary is fixed, is there flexibility on [signing bonus/PTO/start date]?"

**Get a timeline:** "When is the next compensation review? What would I need to demonstrate?"

**Decide if it works:** A "no" on negotiation isn't necessarily a reason to decline. Evaluate the full offer.

## The Bottom Line

Negotiating your first salary feels scary because it's new. But the skills you build now—researching, asking, handling responses—will serve you throughout your career.

You have nothing to lose by asking professionally. And potentially thousands to gain. Use our [cost of staying calculator](/cost-of-staying) to see how much even a small gap compounds over time.

Start with research—[browse salaries by role and location](/salaries) to understand your market. Make a clear ask. See what happens.
    `
  },
  {
    slug: "product-manager-salary-guide-2025",
    title: "Product Manager Salary Guide 2025: What PMs Actually Earn",
    excerpt: "A comprehensive breakdown of PM compensation by level, company type, and specialization.",
    category: "salary-guides",
    publishedAt: "2025-01-22",
    readTime: 9,
    metaDescription: "2025 Product Manager salary guide with compensation data by level, company size, and specialization. Understand what PMs earn at every stage.",
    content: `
## Product Management Compensation Overview

Product management has become one of the most sought-after roles in tech, and compensation reflects that demand. However, PM pay varies dramatically based on level, company type, location, and specialization.

This guide breaks down what product managers actually earn in 2025.

## PM Compensation by Level

### Associate Product Manager (APM) / Entry-Level
- **Base salary:** $90,000 - $140,000
- **Total compensation:** $100,000 - $180,000

APM programs at top tech companies (Google, Facebook, Uber) offer premium pay. Entry-level PM roles at mid-sized companies typically pay $90-110k base.

### Product Manager (Mid-Level, 2-5 years)
- **Base salary:** $130,000 - $180,000
- **Total compensation:** $160,000 - $280,000

At this level, company type creates significant pay differences. A PM at a public tech company earns 30-50% more in total comp than one at a traditional company.

### Senior Product Manager (5-8 years)
- **Base salary:** $160,000 - $220,000
- **Total compensation:** $220,000 - $400,000

Equity becomes a major factor. At FAANG companies, RSUs can equal or exceed base salary.

### Group PM / Principal PM (8-12 years)
- **Base salary:** $200,000 - $280,000
- **Total compensation:** $350,000 - $600,000

These roles manage multiple PMs or own critical product areas. Compensation is often individually negotiated.

### Director of Product (10-15 years)
- **Base salary:** $250,000 - $350,000
- **Total compensation:** $450,000 - $800,000

Director-level PMs lead product organizations. At this level, interview performance and negotiation matter more than years of experience.

### VP of Product / CPO
- **Base salary:** $300,000 - $450,000+
- **Total compensation:** $600,000 - $1.5M+

Executive PM roles have highly variable compensation. Equity packages at high-growth companies can be worth millions.

## Company Type Impact

### Big Tech (FAANG/MAANG)
- Highest total compensation in the industry
- Significant equity grants (often 40-60% of total comp)
- Structured levels and transparent pay bands
- Rigorous interview processes

**Typical Senior PM total comp:** $350,000 - $500,000

### High-Growth Startups (Series C-E)
- Competitive base salaries
- Large equity grants with high risk/reward
- Faster advancement opportunities
- Less structured compensation bands

**Typical Senior PM total comp:** $250,000 - $400,000 (equity value speculative)

### Early-Stage Startups (Seed - Series B)
- Lower base salaries ($120k-$180k for senior roles)
- Heavy equity weighting
- Title inflation (Senior PM might be only PM)
- High risk, potential high reward

**Typical Senior PM total comp:** $180,000 - $300,000 (equity lottery ticket)

### Mid-Size Tech Companies
- Solid base salaries
- Moderate equity grants
- Often better work-life balance
- Less brand recognition for resume

**Typical Senior PM total comp:** $220,000 - $350,000

### Non-Tech Companies
- Generally lower compensation
- Little or no equity
- Product function may be less central
- Good work-life balance

**Typical Senior PM total comp:** $150,000 - $250,000

## Geographic Variations

### Premium Markets
- **San Francisco Bay Area:** Benchmark (100%)
- **Seattle:** 90-95% of SF rates
- **New York City:** 90-95% of SF rates

### Secondary Tech Hubs
- **Austin, Denver, Boston:** 75-85% of SF rates
- **Los Angeles, Chicago:** 70-80% of SF rates

### Remote Compensation
Policies vary by company:
- **Location-agnostic:** Pay SF rates regardless of location (Stripe, Gitlab model)
- **Cost-of-living adjusted:** 10-30% reduction for lower cost areas
- **Hybrid approaches:** Tiered by metro area

## Total Comp Breakdown

At established tech companies, PM compensation typically includes:

**Base Salary:** 50-60% of total comp
- Paid monthly or bi-weekly
- Most stable component

**Annual Bonus:** 10-20% of base
- Typically tied to company and individual performance
- More common at larger companies

**Equity (RSUs/Options):** 30-50% of total comp at senior levels
- RSUs at public companies = predictable value
- Options at startups = speculative value
- Usually 4-year vesting with 1-year cliff

**Benefits:** Variable
- Health insurance, 401k matching, etc.
- Can add $20,000-$40,000 in value

## PM Specialization Premiums

Some PM specializations command higher compensation:

### Technical PM / Platform PM
- **Premium:** +10-20%
- Requires stronger technical background
- Works closely with infrastructure teams

### Growth PM
- **Premium:** +10-15%
- Owns user acquisition, activation, retention
- Often has P&L responsibility

### Data/ML PM
- **Premium:** +15-25%
- Manages AI/ML products
- Requires statistical and technical fluency

### B2B/Enterprise PM
- **Premium:** +5-15%
- Longer sales cycles, complex stakeholders
- Often tied to larger deal sizes

## Signs You're Underpaid as a PM

- You haven't had a meaningful raise in 2+ years
- New hires at your level earn more
- Recruiters quote significantly higher ranges
- Your product scope has expanded without compensation adjustment
- Your company's equity has declined substantially

## How to Research PM Compensation

1. **Levels.fyi:** Best for tech company PM data
2. **Blind:** Anonymous forums with salary sharing
3. **Glassdoor:** Broad coverage, less reliable for total comp
4. **PM-specific communities:** Slack groups, LinkedIn groups
5. **Recruiter conversations:** They know current market rates

## The Bottom Line

PM compensation has a wide range depending on company type, level, and location. The biggest factor is typically company type—a senior PM at a FAANG company can earn 2x what the same role pays at a non-tech company.

If you're unsure where you stand, [run a salary analysis](/) or browse [product manager salaries by location](/salaries/product-manager/san-francisco). When you're ready to negotiate, our [salary negotiation guide](/blog/how-to-negotiate-salary) covers the complete process.
    `
  },
  {
    slug: "data-scientist-salary-guide-2025",
    title: "Data Scientist Salary Guide 2025: Complete Compensation Breakdown",
    excerpt: "What data scientists earn by level, industry, and specialization—with insights on the skills that command premium pay.",
    category: "salary-guides",
    publishedAt: "2025-01-24",
    readTime: 9,
    metaDescription: "2025 Data Scientist salary guide covering compensation by experience level, industry, and specialization. Know what data scientists earn.",
    content: `
## The Data Science Compensation Landscape

Data science compensation has matured significantly since the field's "sexiest job" hype. While still well-paid, salaries have normalized as supply has increased and roles have become more specialized.

This guide covers what data scientists actually earn in 2025.

## Compensation by Experience Level

### Entry-Level Data Scientist (0-2 years)
- **Base salary:** $85,000 - $130,000
- **Total compensation:** $90,000 - $160,000

New grad DS salaries vary widely. Tech companies pay at the high end; non-tech companies and agencies at the lower end.

### Mid-Level Data Scientist (2-5 years)
- **Base salary:** $120,000 - $175,000
- **Total compensation:** $140,000 - $250,000

This is where specialization starts to differentiate pay. ML engineers typically out-earn analysts at this stage.

### Senior Data Scientist (5-8 years)
- **Base salary:** $160,000 - $220,000
- **Total compensation:** $200,000 - $350,000

Senior DS roles often involve leading projects, mentoring juniors, and influencing strategy.

### Staff / Principal Data Scientist (8+ years)
- **Base salary:** $200,000 - $300,000
- **Total compensation:** $300,000 - $500,000

At this level, you're either a deep technical expert or transitioning toward management.

### Data Science Manager / Director
- **Base salary:** $220,000 - $320,000
- **Total compensation:** $350,000 - $600,000+

Managing data science teams, setting technical direction, interfacing with business leadership.

## Industry Variations

### Tech Companies
- **Compensation:** Highest in the field
- **Focus:** Product analytics, ML systems, recommendation engines
- **Equity:** Significant portion of total comp

Typical Senior DS total comp: $250,000 - $400,000

### Finance / Fintech
- **Compensation:** Very competitive, especially at trading firms
- **Focus:** Risk modeling, fraud detection, algorithmic trading
- **Bonus:** Often large performance-based bonuses

Typical Senior DS total comp: $250,000 - $450,000 (trading firms can go higher)

### Healthcare / Biotech
- **Compensation:** Moderate to high
- **Focus:** Clinical trials, drug discovery, patient outcomes
- **Specialization:** Often requires domain expertise

Typical Senior DS total comp: $180,000 - $300,000

### Retail / E-commerce
- **Compensation:** Moderate to high
- **Focus:** Demand forecasting, pricing, personalization
- **Scale:** Large data sets, real business impact

Typical Senior DS total comp: $180,000 - $320,000

### Consulting
- **Compensation:** Moderate base, variable bonus
- **Focus:** Varied projects across industries
- **Lifestyle:** More travel, less depth

Typical Senior DS total comp: $160,000 - $280,000

### Startups
- **Compensation:** Lower base, equity-heavy
- **Focus:** Wearing many hats, building from scratch
- **Risk:** High variance in outcomes

Typical Senior DS total comp: $150,000 - $280,000 (equity speculative)

## Skills That Command Premiums

### Machine Learning Engineering (+15-25%)
Building production ML systems—not just notebooks—commands premium pay. This includes:
- Model deployment and monitoring
- ML pipelines and infrastructure
- Real-time inference systems

### MLOps / ML Infrastructure (+10-20%)
Managing the infrastructure that supports ML at scale:
- Model versioning and experimentation
- Feature stores
- Automated training pipelines

### Deep Learning / AI (+15-30%)
Specialized neural network expertise:
- Computer vision
- Natural language processing
- Reinforcement learning
- Generative AI / LLMs

### Causal Inference (+10-15%)
Rigorous experimental design beyond A/B testing:
- Quasi-experimental methods
- Synthetic control
- Instrumental variables

### Domain Expertise (+10-20%)
Deep knowledge in high-value domains:
- Quantitative finance
- Clinical data / healthcare
- Advertising / marketing science

## Research Scientist vs Applied Scientist

### Research Scientist
- Focus on pushing technical boundaries
- Publish papers, attend conferences
- Often requires PhD
- Base: $150,000 - $250,000+
- More academic in culture

### Applied Scientist
- Focus on business impact with advanced methods
- Build production systems
- PhD preferred but not required
- Base: $140,000 - $230,000
- Closer to engineering culture

### Data Scientist (General)
- Broader focus: analytics, modeling, insights
- Mix of methods and business translation
- Often MS or BS with experience
- Base: $100,000 - $200,000
- Varies most by company type

## Remote Data Science Salaries

Data science is highly remote-friendly. Compensation policies vary:

**Location-agnostic:** 
- Pay top-tier rates regardless of location
- Companies: Stripe, GitLab, some startups

**Tiered by market:**
- Adjust based on cost of living
- Often 10-30% reduction for non-hub locations

**Hybrid policies:**
- Full pay for office days, adjusted for remote
- Increasingly common approach

## Geographic Variations

### Top-Paying Markets
- San Francisco Bay Area: Benchmark (100%)
- Seattle: 90-95%
- New York City: 90-100% (especially finance)

### Secondary Markets
- Boston: 85-90%
- Austin, Denver: 80-85%
- Los Angeles, Chicago: 75-85%

### Emerging Hubs
- Miami, Raleigh, Phoenix: 70-80%
- Strong remote job markets

## Signs You're Underpaid as a Data Scientist

- Your skills have advanced but compensation hasn't
- Recruiters consistently quote 20%+ higher ranges
- Junior colleagues are being hired at your salary
- You're doing ML engineering work with a DS title
- Your company's data science is now business-critical but pay is same as when it was experimental

## How to Level Up Your DS Compensation

1. **Specialize:** Pick a high-value niche and go deep
2. **Build systems, not just models:** Production ML skills pay more
3. **Quantify impact:** Track revenue, efficiency, outcomes you've driven
4. **Publish or present:** Build external credibility
5. **Consider industry:** Finance and big tech pay more
6. **Negotiate:** Most offers have room

## The Bottom Line

Data science compensation is increasingly stratified. Generalists at non-tech companies earn less than before, while specialists in ML engineering, deep learning, and domain experts at top companies earn more.

Know what your skills are worth. [Check data scientist salaries by location](/salaries/data-scientist/san-francisco) and [run a free salary analysis](/) to see where you stand. Don't assume your company is paying you market rate—[here are the signs you might be underpaid](/blog/signs-you-are-underpaid).
    `
  },
  {
    slug: "marketing-manager-salary-guide-2025",
    title: "Marketing Manager Salary Guide 2025: Salary Ranges by Industry",
    excerpt: "What marketing managers earn across industries, specialties, and company sizes—with insights on the highest-paying paths.",
    category: "salary-guides",
    publishedAt: "2025-01-25",
    readTime: 8,
    metaDescription: "2025 Marketing Manager salary guide with compensation data by industry, specialty, and company size. Understand marketing career paths and pay.",
    content: `
## Marketing Compensation Overview

Marketing manager salaries vary more than most professions based on industry, specialty, and company size. A marketing manager at a Fortune 500 tech company can earn 2-3x what the same title pays at a small agency.

This guide breaks down what marketing professionals actually earn in 2025.

## Compensation by Experience Level

### Marketing Coordinator / Associate (0-2 years)
- **Base salary:** $45,000 - $70,000
- **Total compensation:** $48,000 - $80,000

Entry-level roles focused on execution and support. Higher pay in tech and major metros.

### Marketing Manager (2-5 years)
- **Base salary:** $70,000 - $110,000
- **Total compensation:** $80,000 - $140,000

Owns campaigns, channels, or segments. Beginning to manage budgets and possibly people.

### Senior Marketing Manager (5-8 years)
- **Base salary:** $100,000 - $160,000
- **Total compensation:** $120,000 - $200,000

Leads major initiatives, manages teams or significant budgets. Strategic input on direction.

### Director of Marketing (8-12 years)
- **Base salary:** $140,000 - $220,000
- **Total compensation:** $170,000 - $300,000

Owns a function (brand, growth, product marketing) or manages the department.

### VP of Marketing / CMO
- **Base salary:** $200,000 - $400,000+
- **Total compensation:** $250,000 - $800,000+

Executive leadership. Equity becomes significant at this level, especially in tech.

## Marketing Compensation by Specialty

### Performance / Growth Marketing
- **Premium:** +15-25% over generalist roles
- High demand for ROI-driven marketers
- Often includes bonus tied to metrics

### Product Marketing
- **Premium:** +10-20%
- Strong in tech companies
- Requires both marketing and product skills

### Brand Marketing
- **Compensation:** Industry average
- Higher pay at major CPG and luxury brands
- Creative skills valued

### Content Marketing
- **Compensation:** Slightly below average
- Higher pay for those who can demonstrate ROI
- Strong demand but lots of supply

### Marketing Operations / Analytics
- **Premium:** +10-20%
- Technical marketing skills in demand
- Data fluency commands higher pay

### Demand Generation (B2B)
- **Premium:** +10-15%
- Directly tied to pipeline and revenue
- Strong in SaaS and enterprise

## Industry Differences

### Tech / SaaS
- **Compensation:** Highest in marketing
- Equity often part of package
- Fast career progression
- High emphasis on metrics

Senior Marketing Manager: $140,000 - $220,000 total comp

### Finance / Fintech
- **Compensation:** High, bonus-heavy
- Conservative culture
- Compliance constraints
- Large budgets

Senior Marketing Manager: $130,000 - $200,000 total comp

### Consumer Packaged Goods (CPG)
- **Compensation:** Moderate to high
- Strong brand marketing culture
- Structured career paths
- Traditional marketing approach

Senior Marketing Manager: $110,000 - $170,000 total comp

### Agency
- **Compensation:** Lower than in-house
- Variety of work and clients
- Long hours common
- Faster early-career learning

Senior Marketing Manager: $90,000 - $140,000 total comp

### Healthcare / Pharma
- **Compensation:** Moderate to high
- Regulatory constraints
- Long campaign cycles
- Stable employment

Senior Marketing Manager: $110,000 - $160,000 total comp

### Retail / E-commerce
- **Compensation:** Moderate
- Heavy on promotions and performance
- Seasonal intensity
- Strong analytics focus

Senior Marketing Manager: $100,000 - $160,000 total comp

## Impact of Company Size

### Enterprise / Fortune 500
- Higher base salaries
- More structured levels and bands
- Larger teams, more specialization
- Slower career progression

### Mid-Size (200-2000 employees)
- Competitive salaries
- More ownership and variety
- Growing teams
- Balance of structure and flexibility

### Startup (Under 200)
- Variable base salaries
- Equity potential
- Generalist roles, high ownership
- Risk and reward

### Small Business / Agency
- Lower base salaries
- Learning opportunities
- Client variety
- Limited upward mobility

## CMO Track vs Individual Contributor Track

### Management Track
- Higher total compensation at senior levels
- Manage people and budgets
- Less hands-on work
- Political navigation required

**Director of Marketing:** $170,000 - $250,000
**VP Marketing:** $250,000 - $450,000
**CMO:** $350,000 - $800,000+

### IC / Expert Track
- Deep specialization
- Often caps out below exec comp
- Continued hands-on work
- Fewer available senior positions

**Principal/Staff Marketer:** $150,000 - $250,000

## In-Demand Marketing Skills

Skills that command pay premiums:

1. **Marketing analytics and attribution:** +10-20%
2. **Marketing automation platforms:** +5-15%
3. **SQL and data skills:** +10-15%
4. **Performance marketing (paid ads):** +10-20%
5. **Account-based marketing (B2B):** +10-15%

## Geographic Variations

### Top Markets
- San Francisco: +30-40% above national average
- New York: +20-30%
- Boston: +15-20%

### Mid-Tier Markets
- Chicago, LA, Seattle, Austin: +5-15%

### Remote Work Impact
Marketing has become more remote-friendly. Many companies adjust pay by location; some pay location-agnostic rates.

## The Bottom Line

Marketing compensation varies enormously. Industry and specialty matter more than years of experience in determining pay.

If you want to maximize marketing compensation:
- Work in tech or finance
- Specialize in growth, product marketing, or marketing ops
- Build data and analytics skills
- Target companies that value marketing strategically

Know what your combination of skills, industry, and location is worth—[browse marketing manager salaries by city](/salaries/marketing-manager/san-francisco) and [run a salary analysis](/) to benchmark yourself. Then [negotiate accordingly](/blog/how-to-negotiate-salary).
    `
  },
  {
    slug: "startup-vs-big-tech-compensation",
    title: "Startup vs Big Tech: Which Actually Pays More?",
    excerpt: "A realistic comparison of compensation at startups and large tech companies, including how to evaluate equity properly.",
    category: "salary-guides",
    publishedAt: "2025-01-26",
    readTime: 8,
    metaDescription: "Compare startup and big tech compensation realistically. Learn how to evaluate equity, understand risk-adjusted pay, and make smart career decisions.",
    content: `
## The Compensation Question

"Should I join a startup or big tech?" is often framed as a money question. But comparing compensation across company types is tricky—especially when equity is involved.

This guide helps you compare realistically.

## Base Salary Comparison

### Big Tech (FAANG/MAANG)
- **Entry level:** $120,000 - $150,000
- **Mid level:** $160,000 - $200,000
- **Senior:** $200,000 - $280,000
- **Staff+:** $250,000 - $400,000

Base salaries at big tech are structured into bands. They're high, consistent, and predictable.

### High-Growth Startups (Series C+)
- **Entry level:** $100,000 - $140,000
- **Mid level:** $130,000 - $180,000
- **Senior:** $160,000 - $220,000
- **Staff+:** $200,000 - $280,000

Well-funded startups can approach big tech base salaries, but rarely match them.

### Early-Stage Startups (Seed - Series B)
- **Entry level:** $80,000 - $120,000
- **Mid level:** $100,000 - $150,000
- **Senior:** $130,000 - $180,000
- **Staff+:** $160,000 - $220,000

Early startups offer lower base salaries. The pitch is "equity will make up for it."

## Equity: The Complicating Factor

### RSUs at Public Companies

RSUs (Restricted Stock Units) at public tech companies are:
- **Liquid:** You can sell when they vest
- **Predictable:** Value tied to current stock price
- **Taxable as income:** When they vest

A senior engineer at Google might get $150,000-$300,000 in annual RSU value. This is real, spendable money.

### Stock Options at Startups

Stock options at startups are:
- **Illiquid:** Can't sell until exit (IPO or acquisition)
- **Speculative:** Worth nothing until the company succeeds
- **Complex:** Strike price, vesting, exercise windows, dilution

A senior engineer at a Series A startup might get options worth "$400,000" at current valuation. But that number assumes:
- The company reaches a successful exit
- Your shares aren't diluted to nothing
- You can actually sell them

## How to Calculate Risk-Adjusted Compensation

Most startup equity ends up worthless. Here's a realistic framework:

### Expected Value Calculation

Instead of using the paper value, estimate probability-weighted outcomes:

**Startup equity offered:** $200,000 (at current valuation)

**Scenarios:**
- 70% chance: Company fails, equity worth $0
- 20% chance: Modest exit, equity worth $50,000
- 8% chance: Good exit, equity worth $200,000
- 2% chance: Great exit, equity worth $1,000,000

**Expected value:** (0.7 × $0) + (0.2 × $50k) + (0.08 × $200k) + (0.02 × $1M) = $46,000

That "$200,000" in equity is probabilistically worth ~$46,000.

### Comparing Total Comp

**Big Tech Offer:**
- Base: $200,000
- Bonus: $30,000
- RSUs: $150,000/year (liquid)
- **Total comp:** $380,000

**Startup Offer:**
- Base: $160,000
- Bonus: $0
- Options: $200,000/year (on paper) → ~$46,000 (expected value)
- **Total comp (risk-adjusted):** $206,000

The startup offer is worth roughly half as much in expected value.

## When Startups Actually Pay More

Startups CAN outpay big tech in specific scenarios:

### 1. Very Early Employee
If you're employee #5-20 at a company that succeeds, your equity could be worth millions. But this is rare—maybe 1-2% of startups.

### 2. Second-Time Founder or Exec
Startup executive packages can be enormous. A VP at a well-funded startup might get 1-2% of the company.

### 3. Already Wealthy
If you don't need the cash and can truly bet on optionality, startup equity makes more sense.

### 4. Unicorn or Pre-IPO
Late-stage companies with clear IPO paths have more valuable equity, though less upside.

## Career Growth Trade-Offs

### Big Tech Advantages
- Mentorship and learning from experts
- Structured career progression
- Brand name on resume
- Predictable income for financial planning
- Work-life balance (usually)

### Startup Advantages
- Faster title progression
- More ownership and impact
- Broader skill development
- Potential for outsized outcome
- More direct accountability

## Questions to Ask About Startup Equity

Before accepting startup equity as compensation:

1. **What's the current valuation?**
2. **What's my percentage ownership?** (Not just number of shares)
3. **What's the liquidation preference?** (Investors often get paid first)
4. **What's the vesting schedule?** (Standard: 4 years, 1-year cliff)
5. **What's the strike price?** (For options)
6. **What happens to my equity if I leave?** (Post-termination exercise window)
7. **How much dilution should I expect?** (Future funding rounds reduce your %)
8. **What are the likely exit scenarios?**

## How to Decide

### Choose Big Tech If:
- You have financial obligations (mortgage, family, debt)
- You value predictability and stability
- You want structured learning and mentorship
- You're early in your career and need resume building
- You want to maximize guaranteed compensation

### Choose Startups If:
- You're financially stable and can absorb risk
- You're energized by ambiguity and ownership
- You've already done big tech and want something different
- You have specific skills that make equity more likely to pay off
- You understand the equity is probably worth zero

## The Bottom Line

On an expected-value basis, big tech almost always pays more. The "startup pays off big" stories are survivorship bias—you don't hear about the 90% that didn't work out. For detailed numbers, see our [software engineer salary guide](/blog/software-engineer-salary-guide-2025).

If you choose a startup, do it for the experience, the ownership, and the learning. If the equity pays off, that's a bonus. But don't count on it as compensation. Whichever path you choose, [check your market value](/) to make sure you're not leaving money on the table.
    `
  },
  {
    slug: "when-to-leave-your-job",
    title: "7 Signs It's Time to Leave Your Job",
    excerpt: "Concrete warning signs that it might be time to move on, plus how to make the decision rationally.",
    category: "career-advice",
    publishedAt: "2025-01-27",
    readTime: 6,
    metaDescription: "Recognize the warning signs that it's time to leave your job. Learn how to evaluate your situation objectively and make the right career decision.",
    content: `
## Making the Decision Clearly

Knowing when to leave a job is hard. Emotions run high. Uncertainty looms. The devil you know feels safer than the unknown.

This guide offers concrete signals to watch for—and a framework for deciding rationally.

## Sign 1: You've Stopped Learning

When was the last time you learned something new at work? Not a new process or policy, but a genuinely new skill or way of thinking?

**Warning signals:**
- Your work has become purely repetitive
- You're the most experienced person in the room
- You're not growing in any dimension
- New challenges feel like more of the same

**Why it matters:** Careers are long. Staying where you're not learning means falling behind. Today's comfort becomes tomorrow's career risk.

## Sign 2: Your Compensation Has Stagnated

If your pay hasn't increased meaningfully in 2-3 years, you're effectively taking a pay cut (inflation) while the market moves on without you.

**Warning signals:**
- Annual "raises" are 0-2%
- Your total comp is below market rate
- New hires at your level earn more
- Requests for raises are deflected indefinitely

**Why it matters:** Compensation gaps compound. Use our [cost of staying calculator](/cost-of-staying) to see the real numbers. The longer you wait, the further behind you fall—and the more catching up you need when you eventually move.

## Sign 3: The Company's Direction Is Unclear or Concerning

Is the company growing? Stable? Struggling? Your job security and growth opportunities depend on the answer.

**Warning signals:**
- Leadership frequently changes strategies
- Good people are leaving without being replaced
- Revenue or funding concerns are whispered about
- Layoffs seem possible or have already happened
- The product isn't gaining traction

**Why it matters:** It's better to leave on your timeline than to be forced out on theirs. A struggling company also limits your opportunities internally.

## Sign 4: You're Not Valued or Recognized

Recognition isn't just about feeling good—it signals where you stand and whether you have a future.

**Warning signals:**
- Your contributions go unacknowledged
- You're passed over for opportunities you've earned
- Feedback is absent or purely negative
- You're excluded from important decisions
- Promises about growth or promotion keep slipping

**Why it matters:** If you're not valued now, why would that change? The people who succeed are usually the ones who are already being invested in.

## Sign 5: The Culture Is Toxic

Culture problems rarely fix themselves. What you tolerate becomes your normal.

**Warning signals:**
- Management through fear or blame
- Persistent interpersonal conflicts
- Unethical behavior is tolerated or rewarded
- Work-life boundaries are systematically violated
- High turnover, especially among good performers

**Why it matters:** Toxic environments don't just make you unhappy—they can damage your health, relationships, and sense of what's normal in a workplace.

## Sign 6: You're Chronically Stressed or Burned Out

Some stress is normal. Chronic, unrelenting stress is a sign something is structurally wrong.

**Warning signals:**
- You dread work most days
- Anxiety persists on evenings and weekends
- Physical symptoms appear (sleep issues, fatigue)
- You're less effective despite working harder
- You've stopped caring about quality

**Why it matters:** Burnout doesn't resolve with vacation. If the job is the cause, only leaving fixes it. And working burned out damages your performance and reputation.

## Sign 7: Your Gut Says It's Time

Sometimes you know before you can articulate why. Intuition is information.

**Warning signals:**
- You keep thinking "I should leave"
- You fantasize about other jobs or quitting
- You feel relief when imagining a new job
- You've been making excuses to stay

**Why it matters:** That voice doesn't go away. It usually gets louder until you listen.

## Emotional vs Logical Decision Making

Deciding to leave based purely on emotion leads to reactive choices. So does ignoring emotions entirely.

**Balance the equation:**

1. **Name the emotions:** Are you frustrated? Bored? Resentful? Scared?

2. **Look for patterns:** Is this a bad week or a bad year? Has anything changed, or is this ongoing?

3. **List the facts:** Write down concrete evidence, not just feelings.

4. **Consider the alternative:** What would need to be true to stay happily?

## Financial Preparation Before Quitting

Don't leave without a plan:

- **Emergency fund:** 3-6 months of expenses minimum
- **Healthcare:** Know your COBRA or marketplace options
- **Outstanding compensation:** Bonuses, equity vesting, 401k matching
- **Job search timeline:** Average time to land in your field

Leaving is much less stressful when you're financially prepared.

## How to Leave on Good Terms

Even when you're frustrated:

- Give appropriate notice (usually 2 weeks, more for senior roles)
- Help with transition documentation
- Don't badmouth anyone
- Stay professional through your last day
- Maintain relationships—you'll likely cross paths again

## The Cost of Staying Too Long

There's risk in leaving. But there's also risk in staying:

- Skills become stale
- Compensation falls behind
- You miss opportunities during the job market window
- Burnout makes you less effective
- Your reputation is tied to a struggling company or team

Staying too long is an active choice with real consequences.

## The Bottom Line

If you're seeing multiple signs on this list, that's meaningful data. Take our [company red flags checklist](/red-flags) for a more detailed assessment, or use the [cost of staying calculator](/cost-of-staying) to see what staying is costing you financially.

The question isn't whether to eventually leave—it's whether you're staying intentionally or just by default. If you're torn, read our guide on [whether to wait for a promotion or find a new job](/blog/promotion-vs-new-job). Make an active choice.
    `
  },
  {
    slug: "promotion-vs-new-job",
    title: "Should You Wait for a Promotion or Find a New Job?",
    excerpt: "A data-driven look at internal promotion vs external moves, and how to decide which path is right for you.",
    category: "career-advice",
    publishedAt: "2025-01-28",
    readTime: 7,
    metaDescription: "Compare staying for a promotion vs leaving for a new job. Understand salary increases, timelines, and career impact to make the right choice.",
    content: `
## The Classic Career Dilemma

You want to advance. You want more money. You have two paths: wait for promotion at your current company, or leave for a better opportunity elsewhere.

The right answer depends on your specific situation. Here's how to think it through.

## Internal Promotion Statistics

Let's start with reality:

- **Average time to promotion:** 2-3 years in most companies
- **Typical promotion raise:** 10-15%
- **Employees who believe they're on track for promotion:** ~50%
- **Employees who actually get promoted each year:** ~15-20%

There's often a gap between expectations and outcomes. People wait for promotions that never come.

## Salary Increase: Promotion vs Job Switch

### Average Salary Increase by Path

**Internal promotion:** 10-15% raise

**Lateral external move:** 10-20% raise

**External move with level-up:** 15-30%+ raise

The math typically favors external moves for compensation. Companies are often willing to pay market rate to attract new talent while paying below market to retain existing employees.

### Why the Gap Exists

**Internal:** Your salary is anchored to what you were paid when you started. Raises are often percentage-based on current salary.

**External:** Your salary is anchored to what the market will bear. You're negotiating fresh with no history weighing you down.

## Factors Favoring the Internal Path

### 1. You're On a Clear, Tracked Path
Some companies have transparent promotion criteria and timelines. If you know exactly what's required and when decisions are made, staying can work.

**Signs you're on track:**
- Your manager explicitly discusses promotion timeline
- You have a development plan with clear goals
- You're getting stretch assignments that prepare you for the next level
- Others in your situation have been promoted

### 2. Your Company Has Strong Brand Value
If you're at a company with a respected name (major tech, top consulting firms, etc.), the promotion comes with resume value that pays dividends later.

### 3. You're Building Rare Expertise
Some positions give you access to unique problems, systems, or domains that you can't easily access elsewhere. The experience may be worth more than immediate pay.

### 4. You Have Unvested Equity
If you have substantial equity vesting soon, leaving means leaving money on the table. Calculate the actual value before deciding.

### 5. You Genuinely Like It There
Career isn't only about compensation. If you enjoy the work, trust your manager, and see a future—that's worth something.

## Factors Favoring the External Path

### 1. Your Salary Is Below Market
If you're significantly underpaid (20%+), an external move is often the fastest way to catch up. Internal raises rarely close large gaps.

### 2. Promotions Keep Getting Delayed
If you've been told "next cycle" multiple times, actions speak louder than words. The promotion may never come.

### 3. The Company Isn't Growing
Promotions require headcount and budget. At struggling or stagnant companies, there may not be roles to promote into.

### 4. Your Manager Isn't Advocating for You
Promotion requires sponsorship. If your manager isn't actively pushing for your advancement, someone else's manager is—and they'll get the slot.

### 5. You've Maxed Your Learning
If there's no new challenge in sight, external moves offer faster growth through new problems and environments.

## How to Pursue Both Simultaneously

You don't have to choose immediately. You can explore options while still pursuing internal advancement.

### At Work:
- Have explicit conversations about promotion timeline and requirements
- Document your achievements and get feedback
- Ask for stretch assignments that demonstrate next-level capability
- Build relationships with decision-makers

### Externally:
- Keep your resume updated
- Take occasional recruiter calls to understand your market value
- Build relationships that could lead to opportunities
- Interview selectively (even if not ready to move) to practice and learn

### The Key Rule:
Don't threaten to leave for leverage. Either be genuine about your internal path, or be genuine about leaving. Bluffing destroys trust and rarely works.

## When Internal Moves Make Sense

Sometimes the best opportunity is internal—but at a different team or function.

**Advantages of internal moves:**
- Keep your vesting schedules and tenure
- Leverage your reputation and network
- Skip external interview processes
- Faster ramp-up in new role

**Good internal move scenarios:**
- Moving to a higher-visibility team
- Switching to a growing part of the company
- Following a great manager to their new team
- Getting exposure to different skills or problems

## Making the Decision

Create a simple framework:

### If you stay:
- What's the realistic timeline to promotion?
- What's the likely salary increase?
- What's the probability it actually happens?
- What's the opportunity cost of waiting?

### If you leave:
- What's available in the market?
- What salary range could you command?
- What would you learn in a new environment?
- What are the risks of a new situation?

Multiply outcomes by probabilities. Compare the paths.

## Red Flags: You Should Probably Leave

- Promotion has been promised but delayed 2+ times
- Your manager doesn't know or won't say what promotion requires
- Good performers around you are leaving
- The company is struggling financially
- You're being managed out but not told directly

## Green Flags: You Should Probably Stay

- You have a written development plan with clear milestones
- Your manager actively sponsors you for opportunities
- Recent promotions at your level happened on reasonable timelines
- You're learning and engaged
- The compensation gap isn't dramatic

## The Bottom Line

Most data suggests external moves accelerate careers faster than internal promotion—especially for compensation. But that doesn't mean it's always the right choice. Use our [cost of staying calculator](/cost-of-staying) to quantify what waiting is costing you.

Evaluate your specific situation honestly. [Check if you're underpaid](/) compared to market rates. Then read our [salary negotiation guide](/blog/how-to-negotiate-salary) whether you're negotiating a promotion or a new offer. Make an active decision based on evidence, not hope.
    `
  },
  {
    slug: "salary-transparency-conversation",
    title: "How to Talk About Salary With Coworkers (Without Making It Weird)",
    excerpt: "Salary transparency benefits everyone, but the conversation can feel awkward. Here's how to approach it.",
    category: "career-advice",
    publishedAt: "2025-01-29",
    readTime: 5,
    metaDescription: "Learn how to talk about salary with coworkers professionally. Tips for navigating pay transparency conversations at work.",
    content: `
## Why Salary Transparency Helps Everyone

Pay secrecy primarily benefits employers. When employees don't know what others earn, they can't identify unfair pay practices, negotiate effectively, or advocate for equity.

Research consistently shows:
- Pay transparency reduces wage gaps (gender, race)
- Transparent companies have higher employee satisfaction
- Workers with salary information negotiate better outcomes

Talking about pay isn't greedy or unprofessional—it's how you level the information playing field.

## How to Bring It Up Naturally

The biggest barrier is starting the conversation. Here are natural entry points:

### During Performance Review Season
"Hey, I'm prepping for my review. Would you be open to sharing what salary range you were able to negotiate? I'm trying to understand what's realistic."

### When Someone Gets a New Job
"Congrats on the new role! If you're comfortable sharing, I'm curious what the comp looks like compared to what we make here."

### When a Peer Is Promoted
"That's exciting! I've been thinking about what promotion looks like here—would you be open to sharing what the bump was?"

### When Discussing Market Rates
"I was looking at salary data for our roles and was surprised by the ranges. What's your sense of how we compare?"

### When Trust Is Established
"I've been thinking about being more open about compensation. Would you be interested in sharing numbers? I think it helps both of us."

## What to Share and What to Keep Private

### Consider Sharing:
- Base salary (or at least a range)
- Bonus structure and typical payouts
- Equity grants and vesting
- Benefits you've negotiated
- Raises and promotion bumps (percentages work if numbers feel too personal)

### You Can Keep Private:
- Specific financial obligations or debt
- Spouse's income or household finances
- Anything you're not comfortable with

You don't have to share everything. Even ranges or percentages help colleagues calibrate.

## How to Ask Without Being Awkward

**Lead with vulnerability:**
"I'll go first—I make around $X. I'm sharing because I think transparency helps everyone."

**Ask about ranges, not exact numbers:**
"Are you comfortable sharing what range you're in? Even rough buckets help."

**Offer value exchange:**
"If you're open to it, I'd share mine too. I think it helps both of us understand the landscape."

**Make it about fairness:**
"I'm trying to figure out if we're being paid fairly. Would you be willing to compare notes?"

**Acknowledge the discomfort:**
"I know this can feel weird to talk about, but I think it's important. No pressure if you'd rather not."

## Handling Reluctant Colleagues

Not everyone will want to share. That's okay.

**If they decline:**
"Totally understand. No pressure at all."

**Don't push:** Respecting boundaries builds trust. They may come around later.

**Look for other sources:** Levels.fyi, Glassdoor, recruiters, other colleagues. One "no" isn't the end.

### Why People Decline:
- Fear of judgment (making too much or too little)
- Concern about workplace dynamics
- Cultural or personal discomfort
- Uncertainty about the rules

These are all valid. Focus on willing participants.

## Legal Protections for Discussing Pay

In the United States, employees have legal protections to discuss wages:

**National Labor Relations Act (NLRA):**
Protects most private-sector employees' right to discuss pay with coworkers. Employers cannot legally:
- Prohibit salary discussions
- Punish employees for sharing pay information
- Create policies that ban pay discussions

**State Laws:**
Many states (California, Colorado, New York, etc.) have additional pay transparency laws requiring salary ranges in job postings and prohibiting retaliation.

**Exceptions:**
- Managers may have limited protections depending on their role
- Certain industries have specific rules
- This isn't legal advice—know your jurisdiction

### If You're Worried About Retaliation:
- Know your rights
- Document any concerning responses
- Consult HR or an employment attorney if needed
- Consider anonymous forums if workplace feels unsafe

## Best Practices for the Conversation

**Be matter-of-fact:** Treat it as normal professional information exchange.

**Don't compare in a judgmental way:** "That's way too much/little" makes people regret sharing.

**Use the information constructively:** The point is to inform negotiations and identify inequities—not to gossip.

**Keep confidences:** If someone shares with you, don't broadcast without permission.

**Include context:** Salary without context (location, experience, role specifics) can be misleading.

## What to Do With the Information

Once you have pay data:

**If you're underpaid:**
- Document the data
- Prepare a case based on market rates and contributions
- Request a compensation review

**If you're overpaid:**
- Great! But consider that others may be underpaid
- You can still advocate for equity

**If there are gaps by gender/race:**
- This may indicate systemic issues
- Consider whether to raise with HR or management
- Document patterns

## The Bottom Line

Salary transparency is a skill, not a violation of etiquette. The more openly we discuss pay, the harder it becomes for companies to underpay.

Start with trusted colleagues. Lead with your own information. Respect boundaries. Use what you learn to ensure you—and others—are paid fairly. [Browse salary data by role and location](/salaries) for additional benchmarks, and [run a free salary analysis](/) when you're ready to take action.
    `
  },

  // ─── 10 NEW SEO POSTS ───────────────────────────────────────────────────────

  {
    slug: "nurse-salary-guide-2025",
    title: "Nurse Salary Guide 2025: RN, NP & Travel Nurse Pay",
    excerpt: "From registered nurses to nurse practitioners and travel nurses, here's exactly what nurses earn in 2025 — and how to negotiate more.",
    category: "salary-guides",
    publishedAt: "2026-02-03",
    readTime: 7,
    metaDescription: "Nurse salary guide 2025: RN, NP, and travel nurse pay by specialty and location. Learn what nurses earn and how to negotiate a higher salary.",
    content: `
## What Nurses Earn in 2025

Nursing is one of the largest and most in-demand professions in the US, yet many nurses don't realize how much pay varies by specialty, setting, and state — or that they have real leverage to negotiate.

Explore city-specific benchmarks: [Registered Nurse salary in New York](/salaries/registered-nurse/new-york) · [RN salary in Los Angeles](/salaries/registered-nurse/los-angeles) · [Travel Nurse salary in San Francisco](/salaries/travel-nurse/san-francisco) · [Nurse Practitioner salary in Chicago](/salaries/nurse-practitioner/chicago)

Here's a breakdown of median annual salaries in 2025:

| Role | Median Salary |
|------|--------------|
| Registered Nurse (RN) | $82,000 |
| Nurse Practitioner (NP) | $124,000 |
| Certified Registered Nurse Anesthetist (CRNA) | $214,000 |
| Travel Nurse | $95,000–$130,000 |
| Licensed Practical Nurse (LPN) | $54,000 |

These figures vary significantly by state, employer type (hospital vs. clinic vs. agency), and specialty.

## RN Salaries by State

Geography is one of the biggest drivers of nurse pay:

- **California**: $130,000+ median (highest in the country)
- **Hawaii**: $113,000
- **Oregon**: $104,000
- **Washington**: $95,000
- **New York**: $91,000
- **Texas**: $75,000
- **Mississippi**: $61,000 (lowest)

High cost-of-living states typically pay more, but travel nursing can let you capture both high pay and favorable tax situations.

## Travel Nurse Pay: A Special Case

Travel nurses earn dramatically more than staff nurses because they fill urgent short-term shortages. A typical travel nurse package includes:

- **Taxable hourly rate**: $30–$50/hour
- **Tax-free housing stipend**: $1,000–$2,000/month
- **Tax-free meals/incidentals**: $300–$600/week
- **Sign-on bonuses**: $1,000–$5,000

The all-in value often reaches $95,000–$130,000 annually — before considering the tax advantages of stipends. See how travel nurse pay breaks down by market: [Travel Nurse salary in Dallas](/salaries/travel-nurse/dallas) · [Travel Nurse salary in Seattle](/salaries/travel-nurse/seattle) · [Travel Nurse salary in Austin](/salaries/travel-nurse/austin)

### Is Travel Nursing Right for You?

Travel nursing works best if you have 1–2 years of experience, are flexible about location, and want to maximize earnings quickly. The downsides include no job security between contracts and potential housing challenges.

## Nurse Practitioner Salaries by Specialty

NPs earn significantly more than RNs due to their advanced practice licensure:

- **Psychiatric-Mental Health NP**: $135,000
- **Acute Care NP**: $128,000
- **Family Nurse Practitioner (FNP)**: $118,000
- **Pediatric NP**: $112,000
- **Women's Health NP**: $110,000

Psychiatric NPs are in the highest demand right now given the mental health crisis — a strong specialization for income growth.

## How to Negotiate Your Nursing Salary

Many nurses accept the first offer without negotiating. That's a mistake.

**Before any negotiation:**
1. Research your market rate by specialty and location (use [our salary browser](/salaries) to benchmark)
2. Know your certifications and specializations — each adds negotiating leverage
3. Quantify your impact: patient satisfaction scores, charge experience, preceptor roles

**What to say:**
"Based on my [X years] of experience in [specialty] and the current market for [RN/NP] in this area, I was expecting compensation closer to $[target]. Is there flexibility there?"

**What nurses often overlook when negotiating:**
- Shift differentials (nights/weekends can add $5,000–$15,000/year)
- Sign-on bonuses (especially at hospitals)
- Student loan repayment programs
- Continuing education reimbursement

Use our [exploitation check tool](/exploitation-check) to see if your current pay is in line with market rates for your specialty.

## Are Nurses Underpaid?

Given the critical nature of nursing work, many argue nurses are chronically underpaid relative to their responsibility. The data backs this up — hospitals with unionized nurses consistently pay 10–15% more than non-union counterparts.

If you're feeling underpaid, the first step is data. [Run a free salary analysis](/) to benchmark your pay against nurses in your role, location, and experience level. Then negotiate with confidence.
    `
  },

  {
    slug: "teacher-salary-guide-2025",
    title: "Teacher Salary Guide 2025: What Educators Actually Earn",
    excerpt: "Teaching salaries vary widely by state, district, and years of experience. Here's what educators actually earn in 2025 — and how to maximize your income.",
    category: "salary-guides",
    publishedAt: "2026-02-06",
    readTime: 6,
    metaDescription: "Teacher salary guide 2025: average pay by state, grade level, and experience. Learn how to negotiate a raise and what educators earn with a master's degree.",
    content: `
## What Teachers Earn in 2025

Teaching remains one of the most discussed — and most underpaid — professions in the United States. But within the profession, pay varies enormously by state, district, grade level, and education level.

Explore teacher pay by city: [Teacher salary in New York](/salaries/teacher/new-york) · [Teacher salary in Chicago](/salaries/teacher/chicago) · [Teacher salary in Los Angeles](/salaries/teacher/los-angeles) · [Teacher salary in Austin](/salaries/teacher/austin)

Here's the national picture for 2025:

| Role | Median Salary |
|------|--------------|
| Elementary School Teacher | $63,000 |
| Middle School Teacher | $65,000 |
| High School Teacher | $68,000 |
| Special Education Teacher | $65,000 |
| Instructional Coordinator | $72,000 |
| School Principal | $100,000 |

These are medians — experienced teachers in high-paying states earn significantly more.

## Teacher Salaries by State

State matters enormously for teacher pay:

**Top-Paying States:**
- California: $95,000+
- New York: $92,000
- Massachusetts: $88,000
- Connecticut: $86,000
- New Jersey: $76,000

**Lower-Paying States:**
- Mississippi: $46,000
- West Virginia: $48,000
- South Dakota: $49,000
- Oklahoma: $50,000
- Louisiana: $51,000

The gap between the best and worst states is nearly $50,000 — a massive difference for the same role.

## How Experience and Education Affect Teacher Pay

Most teacher pay is determined by a salary schedule — a published grid where rows are years of experience and columns are education level.

**A typical structure looks like this:**

- **Bachelor's degree, Year 1**: $42,000–$55,000
- **Bachelor's degree, Year 10**: $55,000–$68,000
- **Master's degree, Year 1**: $47,000–$60,000
- **Master's degree, Year 10**: $62,000–$78,000
- **Doctorate, Year 10+**: Up to $85,000

A master's degree typically adds $3,000–$8,000 per year — often paying for itself within 3–5 years.

## Additional Income Sources for Teachers

Base salary doesn't tell the whole story. Many teachers supplement their income through:

- **Extracurricular stipends**: Coaching, theater, yearbook ($1,500–$6,000/year)
- **Department chair or mentor roles**: $2,000–$5,000/year
- **Summer school or tutoring**: $25–$75/hour
- **Online tutoring platforms**: Flexible, $20–$80/hour
- **Curriculum writing**: Districts and publishers pay $30–$60/hour

These additions can meaningfully change your effective annual compensation.

## How to Negotiate as a Teacher

Unlike private-sector roles, most teacher salaries follow a fixed schedule — but that doesn't mean you have no leverage.

**Where you do have negotiating room:**
- **Starting step placement**: If you have prior teaching experience, military service, or relevant industry experience, ask to start at a higher step on the salary schedule
- **Position-based stipends**: Negotiate which extracurriculars you take on, as some pay substantially more than others
- **Moving to a higher-paying district**: Research neighboring districts — pay differences of $10,000–$20,000 for the same role are common

**What to say when advocating for higher step placement:**
"Given my [X years] of prior teaching experience in [subject], I'd like to discuss step placement. I believe starting at step [X] better reflects my background."

Run our [exploitation check](/exploitation-check) to see how your district pay compares to similar districts in your state.

## The Bigger Picture: Are Teachers Underpaid?

Yes, by most measures. When you account for advanced degrees, hours worked outside of contract time, and the critical nature of the role, teachers are systemically underpaid relative to other professions requiring similar education.

The best financial strategies for teachers: maximize step advancement, pursue master's degrees where ROI is positive, and don't leave stipend opportunities on the table. [Browse salary data by role and location](/salaries) to benchmark your compensation against educators in your area.
    `
  },

  {
    slug: "ux-designer-salary-guide-2025",
    title: "UX Designer Salary Guide 2025: What Designers Earn",
    excerpt: "UX and product designer salaries have evolved significantly. Here's what designers at every level earn in 2025, plus how to negotiate your next raise.",
    category: "salary-guides",
    publishedAt: "2026-02-10",
    readTime: 7,
    metaDescription: "UX designer salary guide 2025: what UI/UX and product designers earn by level, company, and location. Includes negotiation tips and total comp breakdown.",
    content: `
## UX Designer Salaries in 2025

UX design has matured from a niche discipline into a core business function. As a result, salaries have risen substantially — though wide variation exists by level, company type, and location.

Explore UX designer pay by city: [UX Designer salary in San Francisco](/salaries/ux-designer/san-francisco) · [Senior UX Designer salary in New York](/salaries/senior-ux-designer/new-york) · [UX Designer salary in Seattle](/salaries/ux-designer/seattle) · [Senior UX Designer salary in Austin](/salaries/senior-ux-designer/austin)

**Median annual salaries by level:**

| Level | Total Compensation |
|-------|-------------------|
| Junior UX Designer | $70,000–$90,000 |
| Mid-Level UX Designer | $95,000–$130,000 |
| Senior UX Designer | $130,000–$170,000 |
| Staff / Principal Designer | $170,000–$220,000 |
| Design Manager | $150,000–$200,000 |
| Head of Design / VP Design | $200,000–$300,000+ |

Tech companies pay significantly more than agencies or nonprofits at every level.

## UX vs. UI vs. Product Designer: What's the Pay Difference?

These titles are often used interchangeably, but there are meaningful differences:

- **UX Designer**: Focuses on user research, information architecture, and flows. Median ~$110,000
- **UI Designer**: Focuses on visual design and interface polish. Median ~$95,000
- **Product Designer**: The industry's preferred catch-all title — combines UX + UI. Median ~$125,000
- **UX Researcher**: Specialized in qualitative and quantitative research. Median ~$118,000

Product Designer is now the dominant title at top tech companies, and commands a premium over "UX Designer" for the same level of work.

## Salary by Company Type

Company type is the biggest variable after experience:

**FAANG / Top Tech (Google, Meta, Apple, Netflix, Amazon):**
- Mid-level: $160,000–$210,000 total comp
- Senior: $220,000–$300,000 total comp
- Equity is a significant portion

**Growth-Stage Startups:**
- Mid-level: $120,000–$160,000 base + equity upside
- Senior: $160,000–$200,000 base + meaningful equity

**Agencies / Consulting:**
- Mid-level: $80,000–$110,000
- Senior: $100,000–$140,000 (less equity, more variety)

**In-House at Non-Tech Companies:**
- Mid-level: $85,000–$115,000
- Senior: $115,000–$145,000

If maximizing salary is your goal, targeting product companies (especially tech) over agencies or in-house roles at non-tech companies is the clearest lever. For additional context, explore [startup vs. big tech compensation tradeoffs](/blog/startup-vs-big-tech-compensation).

## How to Negotiate a UX Designer Salary

Design roles are highly negotiable — companies need great designers and often undershoot their opening offers intentionally.

**Before the conversation:**
- Research market rates for your specific title and level (use [our salary browser](/salaries))
- Build a portfolio section that quantifies business impact (e.g., "Redesigned checkout flow, increasing conversion by 18%")
- Know what you bring beyond craft: research, systems, stakeholder management

**What to say:**
"I've done some market research and for a [senior product designer] with my background in [domain], I'm seeing $[X]–$[Y] in the market. I'd like to be at the upper end of that range — is there flexibility?"

**What to negotiate beyond base:**
- Equity refresh grants (critical at startups)
- Design tool budgets
- Conference and education stipends
- Remote work flexibility

If you're unsure whether your current pay is competitive, [run a free salary check](/) and compare against market benchmarks for your level and location.

## The Market for UX Design in 2025

The design job market tightened in 2023–2024 as tech companies reduced headcount. However, demand remains strong at product-led companies, and AI tooling is creating new hybrid roles (AI + Design) that command premium salaries.

Designers who can demonstrate measurable business impact — not just beautiful interfaces — are the ones commanding top compensation in 2025.
    `
  },

  {
    slug: "how-to-negotiate-a-job-offer",
    title: "How to Negotiate a Job Offer (Without Losing It)",
    excerpt: "Most people accept the first offer. Here's exactly how to negotiate a job offer confidently — including what to say, what to ask for, and what never to do.",
    category: "negotiation",
    publishedAt: "2026-02-13",
    readTime: 8,
    metaDescription: "How to negotiate a job offer step-by-step. Scripts, timing, and tactics to get more money without risking the offer. Real examples included.",
    content: `
## The Fear That Costs You Money

Most candidates accept job offers without negotiating. The fear? Losing the offer. The reality? That almost never happens.

Employers expect negotiation. A 2024 survey found that 85% of hiring managers said they had room to negotiate their initial offer — and 73% said a candidate had never lost an offer simply by asking professionally.

The cost of not negotiating is immediate and compounding. A $5,000 gap at your starting salary becomes $50,000+ over 10 years when you factor in future raises built on that base.

## Step 1: Always Get the Offer in Writing First

Before negotiating anything, make sure you have a written offer — even a detailed email. This confirms the company is serious and gives you a document to reference.

Once you have it, you can say: "Thank you so much — I'm very excited about this opportunity. I'd like to take a day or two to review the details. Can I get back to you by [date]?"

Taking 24–48 hours signals seriousness and gives you time to prepare.

## Step 2: Research Before You Respond

Your counter needs to be anchored in market data, not gut feelings.

**Where to research:**
- [Browse salary data by role and location](/salaries) on this site
- Glassdoor and Levels.fyi for tech roles
- LinkedIn Salary Insights
- Recruiter conversations at peer companies

Look for the range, not just a number. If the market is $100,000–$130,000 and they offered $105,000, you know there's room.

## Step 3: Make Your Counter

Call, don't email. Negotiations over the phone build rapport and move faster.

**The script:**
"I've given this a lot of thought and I'm genuinely excited about this role. Based on my research and my [X years of experience / specific skills], I was hoping we could get to $[target]. Is that possible?"

Then **stop talking**. Silence is your ally here.

**Key rules:**
- Counter with a specific number, not a range (if you say $110,000–$120,000, they hear $110,000)
- Ask for 10–20% above the offer if you have the market data to support it
- Stay warm and enthusiastic — this isn't adversarial

## Step 4: Don't Stop at Base Salary

If they can't move on salary, ask about everything else:

- **Sign-on bonus**: Often paid from a different budget than base salary
- **Equity / RSUs**: Request more shares or a higher grant value
- **Start date**: Starting later preserves more of your current year's bonus
- **Remote work flexibility**: Can save $10,000+/year in commuting costs
- **Title**: A higher title affects your trajectory and future compensation
- **Benefits**: Additional PTO, professional development budget, gym allowance

The total package matters as much as base. Use the framework from [negotiating job offer benefits](/blog/negotiating-job-offer-benefits) to build your full counter.

## Step 5: Handle the Common Pushbacks

**"The salary is fixed / non-negotiable"**
Almost nothing is truly fixed. Respond: "I understand. Is there flexibility on the signing bonus or equity instead?"

**"That's above our budget for this role"**
"I appreciate your transparency. What would I need to demonstrate in the first 90 days to warrant a salary review at [target]?"

**"We need an answer today"**
Don't be rushed into a decision you haven't prepared for. "I'm very interested — could I have until tomorrow morning? I want to make sure I'm fully committed before accepting."

## What Never to Do

- Never give your current salary first (illegal in many states to even ask)
- Never accept verbally before reviewing the full written offer
- Never apologize for negotiating
- Never negotiate via email for the first counter — too easy to ignore or misread tone

If you're unsure whether the offer is fair, [run a free salary analysis](/) to benchmark it against market data before responding.

## The Bottom Line

Negotiating a job offer is expected, professional, and almost risk-free when done respectfully. The candidate who negotiates and the candidate who doesn't do the same job — but the one who negotiated earns more, potentially forever.
    `
  },

  {
    slug: "average-salary-by-age",
    title: "Average Salary by Age in the US: Are You On Track?",
    excerpt: "Wondering if your salary is normal for your age? Here's what Americans actually earn at 25, 30, 40, and 50 — and what moves the needle most.",
    category: "salary-guides",
    publishedAt: "2026-02-17",
    readTime: 6,
    metaDescription: "Average US salary by age group in 2025. See what people earn at 25, 30, 40, and 50 and find out if you're on track — or falling behind.",
    content: `
## What Americans Earn at Every Age

Salary naturally grows with experience, but how quickly depends heavily on industry, career moves, and negotiation. Here's what median weekly earnings look like by age group, based on Bureau of Labor Statistics data:

| Age Group | Median Weekly Earnings | Median Annual Equivalent |
|-----------|----------------------|------------------------|
| 16–24 | $720 | $37,440 |
| 25–34 | $1,040 | $54,080 |
| 35–44 | $1,250 | $65,000 |
| 45–54 | $1,270 | $66,040 |
| 55–64 | $1,210 | $62,920 |
| 65+ | $1,050 | $54,600 |

**Key insight**: Salary growth is fastest between ages 25 and 35. After 45, median pay actually begins to plateau or slightly decline for many workers — often because wage growth at established employers stalls.

## Are You On Track at 25?

At 25, the median American earns about $54,000. But "on track" depends entirely on your field.

- **Tech / Finance**: $80,000–$110,000 is normal at 25 in major cities
- **Healthcare**: $55,000–$80,000 depending on role
- **Education**: $40,000–$55,000 for entry-level teachers
- **Marketing / Sales**: $50,000–$70,000

If you're in tech or finance and earning below $75,000 in a major market at 25, it's worth investigating whether you're underpaid — especially if you're at a company that's slow to give raises. [Run a free salary analysis](/) to find out.

## At 30: The Most Important Salary Window

Your early 30s are when the gap between those who negotiate and those who don't becomes visible.

The BLS median at 30 is roughly $60,000. But:
- People who've switched jobs 1–2 times typically earn $10,000–$20,000 more than peers who stayed put
- Those in tech or finance in major metros often earn $100,000–$150,000+
- Those in non-negotiating-friendly cultures (government, education) often earn near the median

If you feel stuck below market at 30, read [promotion vs. a new job](/blog/promotion-vs-new-job) — the data strongly favors external moves for salary growth.

## At 40: The Peak Earning Zone

For most professionals, the late 30s through mid-40s are peak earning years. The median at 40–44 is $65,000 nationally, but top performers in competitive fields earn $150,000–$300,000+.

At 40, the biggest lever is often switching companies rather than waiting for internal promotions. Companies increasingly pay more for external hires than they'll give to loyal long-tenured employees.

Signs you might be underpaid at 40:
- You haven't had a raise above inflation in 3+ years
- New hires at your level earn more than you
- You haven't negotiated in your last 2 job changes

Use our [exploitation check](/exploitation-check) to identify whether your employer has fallen behind market rates.

## At 50: Protecting What You've Built

Median earnings begin to plateau after 50 for many workers. This isn't inevitable, but it's common — especially in fields where new skills are constantly required.

Strategies that work at 50+:
- Leverage depth of expertise and institutional knowledge in negotiations
- Target roles where experience is a premium (consulting, advisory, executive)
- Watch for ageism in hiring and counter it with clear, quantified impact statements

## The Biggest Predictor of Salary Growth

It's not age — it's job changes. Workers who switch employers every 3–5 years consistently out-earn those who stay at the same company, because external hiring often resets your pay to current market.

[Browse salaries by role and location](/salaries) to see what the market currently pays for your title — then compare it to what you're making.
    `
  },

  {
    slug: "cost-of-living-salary-adjustment",
    title: "How to Negotiate a Cost of Living Salary Adjustment",
    excerpt: "If your salary hasn't kept up with inflation or you're relocating to a higher cost-of-living city, here's exactly how to make the case for a COLA raise.",
    category: "negotiation",
    publishedAt: "2026-02-20",
    readTime: 6,
    metaDescription: "How to negotiate a cost of living salary adjustment or COLA raise. Scripts, data sources, and strategies to get your pay to keep pace with inflation.",
    content: `
## What Is a Cost of Living Adjustment?

A cost of living adjustment (COLA) is a salary increase designed to maintain your purchasing power when living costs rise — whether due to general inflation or because you're moving to a more expensive location.

COLAs are standard practice at some employers (especially government and unionized workplaces) but rare at many private companies, where inflation catch-ups only happen during formal review cycles — if at all.

After years of elevated inflation, many workers are overdue for a real conversation about whether their salary still reflects the cost of their lives.

## Signs You Need a COLA Conversation

- Your rent or mortgage has increased significantly in the past 2 years
- Grocery, gas, and healthcare costs have meaningfully reduced your take-home purchasing power
- You received a 2–3% annual raise but actual inflation ran higher
- You relocated to a higher cost-of-living city without a corresponding pay adjustment

The [cost of staying calculator](/cost-of-staying) can help you quantify exactly how much purchasing power you've lost since your last raise.

## Building Your Case with Data

A COLA request lives or dies on data. Come prepared with:

**1. Inflation data**
The Bureau of Labor Statistics CPI data shows cumulative inflation. If inflation ran 4% last year and you got a 2% raise, you have a documented 2% gap to present.

**2. Specific cost increases**
Pull actual numbers: "My rent increased $400/month. My health insurance premium went up $150/month. These two items alone represent $6,600 more per year in expenses."

**3. Local cost of living comparisons**
If you relocated, use cost of living index data (Numbeo, NerdWallet, ERI) to show the exact premium of your new city. Moving from Atlanta to San Francisco, for example, can mean 40–60% higher living costs.

**4. Market rate data**
Pair your COLA argument with market data — if the market also moved up for your role, you have two compelling reasons to increase pay. [Browse salary benchmarks](/benchmarks) for your industry.

## The Script for Requesting a COLA Raise

**For inflation:**
"I'd like to discuss my compensation. Over the past two years, inflation has outpaced my raises by approximately [X]%. Given the rising costs of [housing / healthcare / living expenses], I'd like to discuss bringing my salary in line with both the market and the current cost of living. I'm looking for an adjustment to $[target]."

**For relocation:**
"As we discussed, I'll be based in [new city], where cost of living is approximately [X]% higher than [previous city]. I'd like to discuss a corresponding adjustment to my base salary to reflect that difference. Based on my research, a fair adjustment would bring me to $[target]."

## What to Expect

Unlike merit raises, COLA requests are framed as maintaining the status quo rather than arguing for more. This framing often lands better with managers who feel awkward about rewarding performance.

Still, not every employer will grant it. If they refuse:

1. Ask for a formal timeline: "When is the next scheduled compensation review?"
2. Document the conversation and revisit it
3. Use it as data in your decision about whether to stay — the [cost of staying calculator](/cost-of-staying) can help you model the long-term cost of staying underpaid

If they say no and the math no longer works for your life, that's valuable information. A job change often corrects the problem immediately.
    `
  },

  {
    slug: "linkedin-salary-insights-guide",
    title: "How to Use LinkedIn Salary Insights to Research Your Pay",
    excerpt: "LinkedIn Salary is a powerful but underused tool for benchmarking your compensation. Here's how to get the most accurate data from it — and what to do with what you find.",
    category: "career-advice",
    publishedAt: "2026-02-24",
    readTime: 5,
    metaDescription: "How to use LinkedIn Salary Insights to research your pay in 2025. Tips for filtering data, interpreting results, and combining it with other salary tools.",
    content: `
## What Is LinkedIn Salary Insights?

LinkedIn Salary is a compensation research tool built into LinkedIn Premium. It shows median pay for specific job titles, filtered by location, years of experience, education level, and company size.

The data comes from LinkedIn members who voluntarily share their salary information, giving it a real-world, self-reported quality that differs from some other databases.

## How to Access LinkedIn Salary

1. Go to LinkedIn.com
2. Click "Jobs" in the top navigation
3. Select "Salary" from the Jobs dropdown
4. Enter your job title and location

You need a **LinkedIn Premium** subscription to see detailed salary breakdowns. Basic (free) users see limited ranges.

If you don't want to pay for Premium, pair LinkedIn Salary data with free tools like Glassdoor, Payscale, and [our salary browser](/salaries) for a comprehensive picture.

## How to Get the Most Accurate Data

LinkedIn Salary is only as useful as how you filter it. Here's how to sharpen the data:

**Filter by:**
- **Exact job title**: "Senior Product Manager" returns different data than "Product Manager" — be specific
- **Location**: City-level data is more accurate than regional
- **Years of experience**: A 2-year and a 10-year PM have very different markets
- **Education level**: Some roles show meaningful pay premiums for advanced degrees
- **Company size**: Enterprise vs. startup pay gaps are often 20–30%

**What to look for:**
- The median (50th percentile) is your baseline
- The 75th–90th percentile range shows what top earners make — this is your aspirational target
- Note how much location changes the number

## Limitations of LinkedIn Salary Data

LinkedIn's data has real blind spots:

- **Skews toward LinkedIn-active professionals**: Roles with low LinkedIn usage (trades, education, healthcare) may be underrepresented
- **Self-reported bias**: People often round up or misreport titles
- **No equity or bonus data by default**: Total compensation is often much higher than base salary — especially in tech
- **Lags the market**: Job posting salary ranges sometimes reflect current supply and demand better

Always cross-reference with at least 2–3 other sources. For tech roles, [Levels.fyi](https://levels.fyi) is the gold standard for total compensation. For broad role benchmarking, [run a salary analysis](/) on this site.

## What to Do With What You Find

Once you have a benchmark, you're ready to act.

**If you're below the median:**
You likely have a case for a raise. Document your research, frame your request around market data, and request a meeting. [Our salary negotiation guide](/blog/how-to-negotiate-salary) walks through exactly how to do this.

**If you're at the median:**
You're fairly paid at a baseline level, but there may still be room to push to the 75th percentile if your performance justifies it.

**If you're above the median:**
Your total comp is likely competitive. Focus on other dimensions — equity, flexibility, career trajectory.

**Always check your exploitation risk:**
High base salary doesn't mean you're not underpaid in other ways. Use the [exploitation check tool](/exploitation-check) to assess your full compensation picture, including hours, stress, and benefits relative to market.

## Combining LinkedIn Salary With Other Tools

No single data source is complete. The most accurate picture comes from layering:

| Tool | Best For |
|------|---------|
| LinkedIn Salary | Broad role benchmarks |
| Levels.fyi | Tech total compensation |
| Glassdoor | Company-specific ranges |
| Payscale | Traditional / non-tech roles |
| Underpaid ([try it free](/)) | Personalized AI salary analysis |

Using 3–4 sources together gives you a defensible, data-rich foundation for any salary conversation.
    `
  },

  {
    slug: "how-to-read-a-pay-stub",
    title: "How to Read Your Pay Stub: Every Line Explained",
    excerpt: "Your pay stub contains critical information most people never look at. Here's exactly what every section means — and what to check for errors.",
    category: "career-advice",
    publishedAt: "2026-02-27",
    readTime: 5,
    metaDescription: "How to read a pay stub: every line explained. Understand gross pay, deductions, taxes, and net pay — and know what errors to watch for on your paycheck.",
    content: `
## Why Your Pay Stub Matters

Most employees glance at their net pay and move on. That's a mistake. Your pay stub contains critical information about your compensation, benefits, and tax situation — and payroll errors are more common than most people realize.

Understanding your pay stub takes 5 minutes and can save you money, prevent tax problems, and help you verify you're being paid correctly.

## The Anatomy of a Pay Stub

### 1. Employee & Employer Information

At the top of most pay stubs you'll find:
- Your name, address, and employee ID
- Your employer's name and address
- Pay period dates (e.g., "Feb 1 – Feb 15")
- Pay date (when the money hits your account)

Verify your name and address are correct — errors here can affect W-2 forms and tax filings.

### 2. Earnings Section

This shows all the money you earned before deductions.

**Gross Pay**: Your total earnings before anything is taken out. For salaried workers, this should match your annual salary ÷ number of pay periods.

**Common earnings line items:**
- **Regular pay**: Standard hours or salary
- **Overtime**: Hours over 40/week, paid at 1.5x (must be shown separately)
- **Holiday pay**: Often shown separately
- **Bonus / Commission**: Variable pay earned this period
- **PTO Payout**: Paid time off taken or cashed out

**Check this**: If you're hourly, multiply your hours worked by your hourly rate and verify it matches "Regular Pay." Errors here are common.

### 3. Deductions Section

This is where money comes out. Deductions are either **pre-tax** (reduce your taxable income) or **post-tax** (come out after taxes).

**Pre-tax deductions:**
- **401(k) / 403(b)**: Your retirement contributions
- **Health insurance premium**: Your share of medical/dental/vision
- **HSA / FSA contributions**: Healthcare savings accounts
- **Commuter benefits**: Transit or parking

**Post-tax deductions:**
- **Roth 401(k)**: Contributed after tax, grows tax-free
- **Life insurance** (above IRS limits)
- **Wage garnishments**: Court-ordered deductions (child support, debt)

**Check this**: Ensure your 401(k) contribution percentage matches what you elected. Also verify your health insurance deduction matches what HR told you when you enrolled.

### 4. Taxes Section

Federal and state taxes are usually broken out separately.

**Federal taxes:**
- **Federal Income Tax**: Withheld based on your W-4 elections and income
- **Social Security (OASDI)**: 6.2% of gross pay (up to the annual wage base)
- **Medicare**: 1.45% of gross pay (+ 0.9% if you earn over $200,000)

**State taxes:**
- **State Income Tax**: Varies by state (0% in TX, FL, WA, NV; up to 13.3% in CA)
- **State Disability Insurance (SDI)**: In some states (CA, NY, NJ)
- **Local taxes**: Some cities (NYC, Philadelphia) have local income taxes

**Check this**: If you moved states recently, verify the correct state tax is being withheld. Tax errors across state lines are common and painful to fix.

### 5. Year-to-Date (YTD) Totals

Most pay stubs show YTD columns alongside the current period. This helps you:
- Track total earnings for tax purposes
- Verify 401(k) contributions stay within IRS limits ($23,000 in 2025)
- Confirm Social Security isn't over-withheld (stops at the wage base)

### 6. Net Pay

This is your take-home: Gross Pay minus all deductions and taxes. It should match what's deposited into your bank account.

If your net pay feels low, start with your pre-tax deductions — a high 401(k) contribution or expensive health plan is usually the explanation.

## Common Pay Stub Errors to Watch For

- **Wrong pay rate**: Especially after a raise — verify the new rate is applied
- **Missing overtime**: If you worked over 40 hours, overtime must be paid
- **Incorrect 401(k) match**: Employer matching should appear if you're eligible
- **Wrong tax withholding state**: Common after remote work relocation
- **Missing PTO balance**: Many stubs show your remaining PTO — check it's accurate

If you find an error, contact HR or payroll immediately. Corrections to tax withholding require a new W-4 form.

Understanding your pay stub is the first step toward fully understanding your compensation. The next step is knowing whether that compensation is fair — [run a free salary analysis](/) to benchmark your pay against the market.
    `
  },

  {
    slug: "equity-compensation-explained",
    title: "Equity Compensation Explained: RSUs, Options & Vesting",
    excerpt: "RSUs, stock options, vesting schedules, cliffs — equity compensation is confusing by design. Here's a plain-English breakdown of everything you need to know.",
    category: "salary-guides",
    publishedAt: "2026-03-03",
    readTime: 9,
    metaDescription: "Equity compensation explained: RSUs vs stock options, vesting schedules, cliffs, and how to evaluate equity in a job offer. Plain-English guide for 2025.",
    content: `
## Why Equity Compensation Is Confusing (and Why That's a Problem)

At many tech and startup companies, equity isn't a bonus — it's a significant portion of total compensation. But most employees don't fully understand what they've been granted, when it vests, or what it's actually worth.

This confusion costs people real money. Employees leave before vesting. They accept offers without negotiating equity. They misunderstand tax implications at exercise or sale.

This guide cuts through the jargon.

## The Two Main Types of Equity

### 1. Restricted Stock Units (RSUs)

RSUs are the most common form of equity at public companies (Google, Meta, Amazon, Apple, Microsoft, etc.).

**How they work:**
- The company grants you a number of shares
- Those shares vest over a schedule (typically 4 years)
- When shares vest, you receive actual stock — taxed as ordinary income at the fair market value on the vest date
- You can immediately sell the shares or hold them

**Example:**
You're granted 1,000 RSUs at a $100/share price. Over 4 years, 250 shares vest each year. When year-1 shares vest and stock is at $120, you receive $30,000 worth of income — taxed as ordinary income.

**RSU tax trap**: Many employees don't set aside money for taxes when RSUs vest. Employers typically withhold a flat 22% for federal taxes, but if you're in a higher bracket, you'll owe more at tax time.

### 2. Stock Options

Options are more common at pre-IPO startups and give you the **right to purchase** shares at a fixed price (the "strike price" or "exercise price").

**Two types:**
- **Incentive Stock Options (ISOs)**: Tax-advantaged but complex; primarily for employees
- **Non-Qualified Stock Options (NSOs/NQSOs)**: Taxed as ordinary income on the spread at exercise

**How options work:**
You're granted 10,000 options with a strike price of $5/share. If the company's value grows and shares are later worth $25, your options are worth $200,000 ($25 - $5 × 10,000). If the company never grows beyond $5, your options are worthless.

Options carry risk that RSUs don't — they can expire worthless.

## Vesting Schedules: The Timeline That Controls Your Equity

Vesting determines when you actually own your equity.

**Standard 4-year schedule:**
- Most common in tech: 4-year total vesting period
- **Cliff**: No equity for the first year; if you leave before 12 months, you get nothing
- After the cliff: Monthly or quarterly vesting for years 2–4

**Example (1-year cliff, monthly vesting after):**
- Month 12: 25% vests all at once (the cliff)
- Months 13–48: ~2% vests each month
- Month 48: Fully vested

**Front-loaded schedules:**
Some companies (notably Amazon) use front-loaded vesting: 5% year 1, 15% year 2, 40% year 3, 40% year 4. This is designed to reduce turnover in years 3–4.

**Accelerated vesting:**
Some offers include "acceleration" clauses — your equity vests faster if the company is acquired (single-trigger) or if you're laid off after an acquisition (double-trigger). Always ask if this is included.

## How to Evaluate Equity in a Job Offer

### For public company RSUs:
1. Take the number of shares × current stock price = grant value
2. Divide by 4 (years) to get annual equity compensation
3. Add to base salary and bonus for true total comp

If offered 500 RSUs at $200/share = $100,000 total grant = ~$25,000/year in equity. That's material.

### For startup options:
This is harder. Key questions to ask:
- What's the current fair market value (FMV) per share?
- What's the last preferred share price (from investors)?
- What's the total number of fully diluted shares? (Your ownership percentage = your shares ÷ total shares)
- Is there a preference stack? (How much do investors get paid before common shareholders?)

For startups, a 0.1% stake at a $100M valuation = $100,000 in value — but only if a liquidity event happens at or above that valuation. Many don't.

## Negotiating Equity

Most candidates don't negotiate equity. They should.

**At public companies:**
"Can we increase the RSU grant? I was expecting total comp closer to $[target] and a larger equity component would help bridge the gap."

**At startups:**
"Can you help me understand what this option grant represents as a percentage of fully diluted shares? Given the risk profile, I'd like to discuss whether we can get closer to [X]%."

Also negotiate: shorter cliff (6 months instead of 12), accelerated vesting on acquisition, and refresher grants.

For a full picture of how equity fits into your total compensation, see our [startup vs. big tech compensation comparison](/blog/startup-vs-big-tech-compensation) and [run a salary analysis](/) to benchmark your full package.

## Tax Basics You Must Know

- **RSUs**: Taxed as ordinary income when they vest; capital gains (short or long-term) when you sell
- **ISOs**: No tax at exercise (for regular income tax purposes); potential AMT implications; long-term capital gains if held properly
- **NSOs**: Taxed as ordinary income on the spread at exercise; capital gains on subsequent appreciation

Consult a tax professional before exercising options, especially ISOs — the AMT implications can be significant.

## The Bottom Line

Equity is real money, but only if you understand it. Know your vesting schedule, understand the type of equity you hold, and negotiate it just as aggressively as you negotiate base salary.
    `
  },

  {
    slug: "job-hopping-salary-strategy",
    title: "Job Hopping for Salary: The Data-Driven Case for Switching Jobs",
    excerpt: "Staying loyal to one employer for years often costs you — data shows job switchers earn significantly more. Here's how to use job hopping as a deliberate salary strategy.",
    category: "career-advice",
    publishedAt: "2026-03-06",
    readTime: 7,
    metaDescription: "The data-driven case for job hopping to increase your salary. How often to switch jobs, what to say about it, and how much more job switchers actually earn.",
    content: `
## The Loyalty Penalty

Here's an uncomfortable truth: staying at the same employer for 5+ years often costs you money.

A widely-cited analysis by Forbes found that employees who stayed at the same company received average annual raises of 3%. Employees who switched jobs received average raises of 10–20% with each move. Over a decade, the compounding difference is enormous.

The loyalty penalty exists because:
1. Internal raises are usually constrained by budget and precedent
2. External hiring budgets are set to market, not to your history
3. Companies pay new hires what it takes to attract them — often more than they pay existing employees for the same role

## The Data on Job Switching and Salary

- **Job switchers earn 10–30% more** per move, on average, than they would have received from a merit raise
- **The sweet spot for switching** is every 2–4 years — long enough to build meaningful skills and context, short enough to avoid large pay gaps
- **After 5 years without a switch**, the average employee is statistically likely to be underpaid vs. market by 15–25%

Use the [exploitation check tool](/exploitation-check) to quickly see how your tenure compares to your pay trajectory and whether you're falling behind market.

## Why Employers Pay More for External Hires

Companies are willing to pay external hires more because:
- They're competing against other offers (market pressure)
- The hiring budget is different from the raise budget
- They don't know your historical salary (in states with salary history bans)
- External hires are seen as "investments" while existing employees are seen as "costs"

This isn't fair — but it's predictable, and you can use it.

## How Often Should You Switch Jobs?

The research suggests:

- **Less than 1 year**: Looks bad on a resume and signals commitment issues — avoid unless the situation is toxic
- **1–2 years**: Acceptable in early career and in high-turnover industries (startups, agency work)
- **2–4 years**: The sweet spot — enough time to build real accomplishments and relationships, short enough to capture market rates
- **5+ years**: You've likely left significant money on the table. A strong external move can often correct 2–3 years of undermarket pay in one move

## What to Say About Frequent Job Changes

The biggest fear around job hopping is how it looks. Here's how to address it confidently:

**In interviews:**
"I've been deliberate about each move — each role expanded my scope and pushed me into new challenges. I'm looking to stay somewhere longer now that I've found an organization with [the right characteristics you're selling]."

Interviewers respect intentional career management. What they don't respect is inability to explain the pattern.

**On your resume:**
- Contract roles should be labeled "(Contract)"
- Combine short stints at the same company into one block
- Lead with accomplishments at each stop — results matter more than tenure

## Building a Job-Hopping Strategy (Without Burning Bridges)

**The 2-4 year framework:**
1. Join a role at strong market compensation
2. Execute quickly, build a visible track record
3. At year 2, begin passive job searching to gauge market
4. At year 3–4, actively pursue if internal trajectory is limited
5. Negotiate aggressively at new company, locking in a market-rate reset

**What to negotiate at each new job:**
- Base salary 10–20% above your current
- Sign-on bonus to cover unvested equity you're leaving
- Accelerated vesting schedule (to reduce "golden handcuffs")

For a framework on when leaving vs. staying makes more financial sense, read [when to leave your job](/blog/when-to-leave-your-job) and [promotion vs. new job](/blog/promotion-vs-new-job).

## The Compounding Effect

Let's model two engineers starting at $100,000:

**Engineer A (stays put, 3% annual raises):**
- Year 5: $116,000
- Year 10: $134,000

**Engineer B (switches every 3 years, 15% average bump):**
- Year 3: $115,000 (after switch)
- Year 6: $132,000 (after second switch)
- Year 9: $152,000 (after third switch)
- Year 10: ~$157,000

By year 10, Engineer B earns $23,000 more per year — and their career progression has opened doors Engineer A's hasn't.

## The Risks to Manage

Job hopping isn't without risk:
- Less security during probationary periods
- Potential loss of unvested equity
- Need to rebuild relationships and context each time
- Some industries and companies still value tenure

The solution is to be deliberate, not impulsive. Each move should have a clear rationale and measurable improvement in compensation, scope, or trajectory.

If you're on the fence about your next move, [run a free salary analysis](/) to benchmark your current pay — and use the [cost of staying calculator](/cost-of-staying) to quantify exactly what staying another year might cost you.
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
