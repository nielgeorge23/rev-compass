# RevCompass — Video Walkthrough Script

**Suggested length:** ~8 minutes (full) · 3–4 minutes (highlight reel)  
**Demo URL:** https://agent-workflow-mockup.vercel.app  
**Password (all accounts):** `revcompass123`

**Structure:** 10s tool intro → 38s problem intro (HTML deck) → 12s solution bridge → view-by-view walkthrough

---

## Part A — Tool intro (0:00–0:10)

**[Screen: Title card — RevCompass logo + “Delivered by PwC”]**  
*Or: frozen frame on login page before clicking in.*

**Narrator:**  
This is **RevCompass** — a pattern-level revenue integrity workspace that helps teams detect payer drift, decide cohorts once, and track resolution from director to analyst.

---

## Part B1 — Business problem (0:10–0:48)

**[Screen: Open `problem-intro.html` fullscreen — local: `public/problem-intro.html` · production: https://agent-workflow-mockup.vercel.app/problem-intro.html]**

**[Press Play on the deck control bar. Narrate to scene transitions; deck auto-advances ~38s total.]**

| Scene | ~Duration | On screen | Narrator |
|-------|-----------|-----------|----------|
| **1** | 4s | Hundreds of variances surface as individual claim-level work items; counter splits denials vs underpayments | Every month, hundreds of claims surface with denial and underpayment signals — each one treated as its own work item. |
| **2** | 4.5s | Look-alike claims scattered in a grid; pattern chip highlights Aetna · spinal · CO-50 | Look-alike claims still treated seperately. The same payer, procedure, and denial pattern can repeat dozens of times without being grouped. |
| **3** | 6.5s | Two examples: Aetna denial rate 4% → 12%; BCBS $3K underpayment × 412 claims | Two examples of the same problem:Instead of this we should increasing denial rate for one payer on spinal surgery can affect multiple spinal surgery cases or Underpayment related to authorization can repeat multiple times. The source system flags the individual variance; the challenge is connecting repeated signals across the population and determining the right response. |
| **4** | 5s | Analyst journey across Epic claim, 835 remit, policy portal, contract repo, appeal tracker, SOP |To understand the root cause, even for a experienced analyst take hours, hopes between Epic, remits, payer policy, contracts, and appeal history and final call is still based on human judgement |
| **5** | 4s | Claim field with small manual sample highlighted | Manual review samples thirty to fifty accounts. It may spot an issue, but it can’t show how widespread the pattern is or how much exposure it represents resulting in repetition of same behavior. |
| **6** | 4s | 163 claims → 163 work items; analyst hours counter | One pattern becomes hundreds of separate investigations — duplicate research, appeals, and write-offs on the same root cause causijng FTEs to work extra time without any good output |
| **7** | 5s | Scattered dots regroup into cohort labels (Aetna spinal, BCBS orthopedic, etc.) | The real problem isn’t finding a variance —but understanding the systemic issue and acting at population scale. |
| **8** | 2.5s | Economic consequences list | The cost: duplicate effort, delayed recovery, low-value appeals, missed winnable claims, and payer drift detected too late. |
| **9** | 2.5s | Closing — “What if the unit of work were the cohort?” | What if the unit of work were the **cohort** — not the individual claim? Group like claims. Understand the pattern. Decide the right action once. |

---

## Part B2 — Solution bridge (0:48–1:00)

**[Screen: Optional quick cut to Structure view or `architecture.html` — or stay on closing frame of problem intro, then cut to app]**

**Narrator:**  
That’s what RevCompass does. It sits above Epic, not instead of it. Variance flags stay EHR-sourced. The platform clusters similar issues into cohorts —identifies next best action: Appeal, write-off, resubmit. Payer fingerprints identifies historical behavior, catch drift; disposition and contract engines drive the recommendation. A manager human gate approves once; analysts execute; directors and managers see progress roll up.

**[Transition: cut to login → sign in, or Home]**

---

## Part C — View-by-view walkthrough

### 1. Home — The starting point (1:00–1:45)

**[Screen: Home as any user — sign in first if starting from login]**

**Narrator:**  
You see open exposure across active cohorts, expected resolution value, drift alerts, and how many cohorts need manual review.

**[Point to “Resolution cohorts” card]**

The main work happens in **Cohorts** — not claim-by-claim queues, but grouped variances with one recommendation per cohort. That’s the unit of work.

**[Optional: briefly scroll Reference / synthetic demo banner]**

Everything here is synthetic demo data for BCBS, Aetna, UHC, and Cigna — safe for workshops and client conversations.

---

### 2. Payer fingerprints — Why drift matters (1:45–2:45)

**[Nav: Payer fingerprints]**

**Narrator:**  
Before we open a cohort, let’s see *why* it exists. **Payer fingerprints** are a living baseline: denial rates, downgrade rates, overturn history — measured on a trailing window per payer.

**[Select BCBS, then Aetna]**

When behavior shifts materially, RevCompass raises a **drift alert** — for example, BCBS spinal fusion denials jumping after a policy change, or Aetna’s DRG downgrade rate climbing in weeks, not months. The goal is to catch the wave *before* volume builds.

**[Click “View cohort →” on a drift alert if shown]**

Each alert links to the cohort opened against that signal — so monitoring and execution stay connected.

---

### 3. Director — Ownership and oversight (2:45–4:00)

**[Sign out → log in as `steve.kerr@pwc.com`]**

**Narrator:**  
RevCompass allows multiple roles  across leadership, managers and supervisors or analysts to view claim cohorts at one place, assign owners and trace the issue till resolution. Directors don’t approve individual claims. They **assign ownership** and monitor backlog, SLAs, and resolution progress across the portfolio.

**[Nav: Cohorts — Director dashboard loads]**

**[Point to monitoring cards: pending approval, stale, overdue]**

These cards filter the ownership worklist — cohorts waiting on human gate approval, sitting too long, or past target deadline.

**[Point to “Variance flags sourced from Epic / EHR” banner]**

Denial and underpayment flags are **pulled from the EHR** — they’re not invented by the tool. And a single claim can appear in **multiple cohorts** when it has more than one variance issue.

**[In the table, assign or confirm owner — e.g. Draymond Green on BCBS cohort RC-00271]**

The director assigns each cohort to a functional manager. That manager owns the human gate and downstream claim assignment.

**[Open cohort detail, scroll claim resolution summary if assignments exist]**

Once analysts are working claims, directors see **organization-wide and per-cohort resolution progress** — resolved, in progress, not started — without touching operational approvals.

---

### 4. Manager — Approve, then distribute (4:00–5:45)

**[Sign out → log in as `draymond.green@pwc.com`]**

**Narrator:**  
Managers see only **cohorts they own**. Their job at the human gate: confirm evidence and disposition, **approve the cohort**, then **split claim ranges** across analysts.

**[Nav: Cohorts]**

**[Open BCBS spinal fusion cohort RC-00271 — or Aetna RC-00428]**

**[Scroll: root cause, evidence, confidence breakdown]**

RevCompass has already clustered similar claims, cited policy and remit evidence, and scored confidence. Low-confidence cohorts stay in the worklist under **Needs manual review**; managers can override with justification.

**[Human gate → Approve cohort]**

Approval of a cohort unlocks **claim-level assignment**. Until then, distribution is locked — by design.

**[Claim distribution panel → Add range → assign claims to Steph Curry and/or Klay Thompson]**

The manager assigns **ranges** — for example, claims 1–80 to one analyst, 81–163 to another — not one claim at a time.

**[Point to Team resolution progress panel and claims table with assignee column]**

As analysts update status, the manager sees **read-only resolution progress** on assigned claims.

---

### 5. Analyst — Assigned work only (5:45–7:00)

**[Sign out → log in as `steph.curry@pwc.com`]**

**Narrator:**  
Analysts don’t see the full portfolio — only **cohorts and claims assigned to them**.

**[Nav: Cohorts]**

**[Point to banner, metrics, resolution progress summary]**

The worklist is scoped to their assignments. The **Epic / EHR** notice reminds them variance flags come from the source system.

**[Open assigned cohort → Human gate section]**

In the human gate, they see **who approved the cohort and assigned their claims** — the manager’s name and role — so accountability is clear.

**[Claims table → change Resolution dropdown on a few claims: In review → Resolved]**

Each claim has a **resolution** dropdown: not started, in review, pending documentation, escalated, resolved. That’s operational truth for the manager and director dashboards.

**[Optional: open claim drilldown — note Epic/EHR badge on Denied/Underpaid]**

---

### 6. Close the loop (7:00–7:45)

**[Sign back in as Draymond or Steve Kerr]**

**Narrator:**  
Switch back to manager or director — the same cohort now shows updated **claim progress** percentages and counts. No separate spreadsheet; the workflow is in one place.

**[Optional: Outcomes]** — closed-loop learning: predicted vs actual win rates, resolved value.

---

## Closing (7:45–8:15)

**[Screen: Home or Cohorts hero]**

**Narrator:**  
RevCompass connects **payer drift** → **cohort decision** → **human approval** → **claim assignment** → **resolution tracking**. The cohort is the decision unit; the EHR remains the source of truth for variances; and every role sees exactly what they need — no more, no less.

**[End card: RevCompass · Delivered by PwC · demo URL]**

---

## Production notes

| Item | Detail |
|------|--------|
| **Opening visuals** | Title card (10s) → `/problem-intro.html` fullscreen with Play (38s) → solution bridge (12s) → login/Home |
| **Problem intro URL** | Local: `public/problem-intro.html` · Prod: https://agent-workflow-mockup.vercel.app/problem-intro.html |
| **Best demo cohorts** | RC-00271 (BCBS drift) · RC-00428 (Aetna DRG downgrade) |
| **Role switch** | Profile menu → Sign out → pick next demo account on login |
| **Terms to use on camera** | **Cohort** (not package) · **Resolution** (not recovery) · **Epic/EHR-sourced flags** |
| **Highlight reel cuts** | Intro + problem intro (scenes 1–3, 9) + bridge → Fingerprints drift → Director assign → Manager approve + assign → Analyst resolve |
| **B-roll ideas** | Split-screen Epic work queue vs RevCompass cohort; org chart Director → Manager → Analyst |

### Demo accounts

| Role | Email | Name |
|------|-------|------|
| Director | `steve.kerr@pwc.com` | Steve Kerr |
| Manager | `draymond.green@pwc.com` | Draymond Green |
| Analyst | `steph.curry@pwc.com` | Stephen Wardell Curry |
| Analyst | `klay.thompson@pwc.com` | Klay Thompson |

---

## 30-second elevator version

> “Claims arrive from Epic with denial and underpayment flags. RevCompass groups them into cohorts when payers drift or patterns repeat. Directors assign owners; managers approve once per cohort and split work to analysts; analysts resolve claims and update progress. Everyone sees the same picture — from drift alert to resolved value.”
