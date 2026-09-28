# RevCompass — Narrator Script for Text-to-Speech

Plain spoken prose for TTS tools. Remove `[pause]` markers if your engine reads them aloud; use blank lines or the tool’s pause feature instead.

**Demo URL:** https://agent-workflow-mockup.vercel.app  
**Password (all accounts):** revcompass123

**Structure:** 10s tool intro → 38s business problem (HTML deck) → 12s solution bridge → view-by-view walkthrough

---

## Part A — Tool intro (~10 seconds)

This is RevCompass, a pattern-level revenue integrity workspace. It helps teams detect payer drift, decide cohorts once, and track resolution from director to analyst.

---

## Part B1 — Business problem (~38 seconds)

Open the problem intro deck in your browser. Local path: public slash problem-intro dot html. Production URL: agent-workflow-mockup dot vercel dot app slash problem-intro dot html. Press Play and let the deck auto-advance through nine scenes.

[pause]

Scene one. Hundreds of variances surface as individual claim-level work items. Every month, claims arrive with denial and underpayment signals, each treated as its own work item.

Scene two. Look-alike claims still arrive as separate cases. The same payer, procedure, and denial pattern can repeat dozens of times without being grouped.

Scene three. Two examples of the same problem. A payer denial rate triples on spinal surgery. Or the same three-thousand-dollar underpayment repeats four hundred times. Epic flags the variance. It does not tell you the pattern or the action.

Scene four. To understand one variance, an analyst hops across Epic, remits, payer policy, contracts, and appeal history, structured and unstructured, with no single connected view.

Scene five. Manual review samples thirty to fifty accounts. It may spot an issue, but it cannot show how widespread the pattern is or how much exposure it represents.

Scene six. One pattern becomes hundreds of separate investigations. Duplicate research, appeals, and write-offs on the same root cause.

Scene seven. The real problem is not finding a variance. It is knowing which claims belong together and acting at population scale.

Scene eight. The cost: duplicate effort, delayed recovery, low-value appeals, missed winnable claims, and payer drift detected too late.

Scene nine. What if the unit of work were the cohort, not the individual claim? Group like claims. Understand the pattern. Decide the right action once.

[pause]

---

## Part B2 — Solution bridge (~12 seconds)

That is what RevCompass does. It sits above Epic, not instead of it. Variance flags stay EHR-sourced. The platform clusters similar issues into cohorts, with one recommendation each: appeal, resubmit, write-off, escalate, or prevent. Payer fingerprints catch drift. Disposition and contract engines drive the recommendation. A manager human gate approves once. Analysts execute. Directors and managers see progress roll up.

Next, we will walk the product view by view.

[pause]

---

## Part C — View-by-view walkthrough

Open the RevCompass demo in your browser. Sign in with any demo account. The password for all accounts is: revcompass123.

[pause]

This is the home page.

You’ll see open exposure across active cohorts, expected resolution value, drift alerts, and how many cohorts need manual review.

The main work happens under Cohorts in the left navigation. RevCompass works at the cohort level, not claim by claim. Each cohort is a group of similar variances with one recommendation for the whole group.

Everything in this environment uses synthetic demo data for payers like BCBS, Aetna, UHC, and Cigna. It’s built for workshops and client conversations.

[pause]

Next, open Payer fingerprints.

This is a living baseline for each payer: denial rates, downgrade rates, overturn history, measured over a trailing window.

Select BCBS. You’ll see a drift alert. For example, spinal fusion denials jumping after a policy change.

Now select Aetna. Another drift alert might show a DRG downgrade rate climbing in weeks, not months.

The point of drift detection is to catch a shifting payer pattern before denial volume becomes a wave.

If a drift alert links to a cohort, you can jump straight from monitoring into the work that was opened against that signal.

[pause]

Sign out using the profile menu in the top right. Sign back in as the director, Steve Kerr.

Directors don’t approve individual claims. They assign ownership and monitor backlog, service levels, and resolution progress across the portfolio.

Open Cohorts. You’re now on the director dashboard.

Use the monitoring cards at the top to filter the worklist: pending human approval, cohorts pending more than seven days, or past target deadline.

Notice the banner about variance flags sourced from Epic and the EHR. Denial and underpayment flags are pulled from your EHR. They are not calculated or invented by RevCompass.

The same banner explains that one claim can belong to multiple cohorts when more than one variance issue exists on that claim.

In the ownership table, assign each cohort to a functional manager. For example, assign the BCBS cohort to Draymond Green.

Open a cohort to see detail: evidence, confidence, and claim resolution progress once analysts are working assigned claims.

Directors see organization-wide and per-cohort resolution progress: resolved, in progress, and not started.

[pause]

Sign out again. Sign in as the manager, Draymond Green.

Managers only see cohorts they own. Their job is to review evidence at the human gate, approve the cohort, then distribute claim ranges to analysts.

Open Cohorts. Select a cohort such as the BCBS spinal fusion cluster, code RC-00271, or the Aetna DRG downgrade cluster, RC-00428.

Scroll through root cause, evidence, and confidence. RevCompass has already grouped similar claims, cited policy and remit evidence, and scored confidence.

If confidence is below threshold, the cohort stays under Needs manual review. The manager can still override with written justification.

At the human gate, approve the cohort. That approval unlocks claim-level assignment. Until approval, distribution stays locked.

In the distribution panel, add claim ranges and assign them to analysts. For example, assign claims one through eighty to Stephen Curry, and eighty-one through one sixty-three to Klay Thompson.

As analysts update resolution status, the manager sees read-only team progress on those assigned claims.

[pause]

Sign out. Sign in as an analyst, Stephen Curry.

Analysts only see cohorts and claims that were assigned to them.

Open Cohorts. The worklist is scoped to assigned work. Metrics show assigned cohorts, assigned claims, and resolution progress.

The EHR notice reminds analysts that variance flags originate in Epic, not in RevCompass.

Open an assigned cohort. In the human gate section, the analyst sees who approved the cohort and who assigned their claims, including the manager’s name and title.

In the claims table, update resolution on individual claims: not started, in review, pending documentation, escalated, or resolved.

Denied and underpaid statuses are marked as sourced from Epic and the EHR.

[pause]

Sign back in as the manager or director.

Open the same cohort. Claim progress percentages and counts have updated based on the analyst’s work. No separate spreadsheet is required.

Optionally, visit Outcomes for closed-loop learning on predicted versus actual results.

[pause]

RevCompass connects payer drift, to cohort decision, to human approval, to claim assignment, to resolution tracking.

The cohort is the decision unit. The EHR remains the source of truth for variances. And each role sees exactly what they need: directors monitor and assign ownership, managers approve and distribute work, analysts resolve assigned claims.

Thank you for watching this RevCompass demonstration.

---

## 45-second version

This is RevCompass. Hospitals lose on patterns, not single claims. The problem intro shows why: scattered signals, fragmented evidence, claim-by-claim duplication. RevCompass sits above Epic, clusters EHR-sourced variances into cohorts, and recommends appeal, resubmit, write-off, escalate, or prevent. Fingerprints detect drift. Managers approve once. Analysts resolve assigned claims. Everyone sees progress roll up.

---

## TTS tips

- Remove all `[pause]` lines if the engine reads them literally; use blank lines or the tool’s “add pause” feature instead.
- Part A is about 25 words. Part B1 is about 220 words across nine scenes. Part B2 is about 75 words. Together about one minute before the demo walkthrough.
- Sync TTS to the problem intro deck: scene durations are roughly 4, 4.5, 6.5, 5, 4, 4, 5, 2.5, and 2.5 seconds. Record the deck separately and lay narration under it, or pace each scene block to match.
- For emails, some engines read `@` badly — use “Steve Kerr, director account” instead of the full address if needed.
- Say cohort codes slowly once if the voice garbles them (for example, “R C zero zero two seven one”).
- Target roughly 150–160 words per minute for a seven-to-eight-minute full read.
