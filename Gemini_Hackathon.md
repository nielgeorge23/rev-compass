At its simplest:

**RevCompass looks at denied and underpaid claims, figures out which ones are actually the same problem, recommends what the provider should do about them, and learns which actions actually recover money.**

The important shift is that today a revenue cycle team often works **claim by claim**. RevCompass tries to work **problem by problem**.

## 1. Start with the real-world problem

Imagine a hospital submits 10,000 claims to an insurer like BCBS.

A few weeks later:

- 8,500 get paid correctly
- 600 are denied
- 300 are underpaid
- the rest have other issues

Today, the hospital may receive something like:

Claim 123 → CO-50 / medical necessity
Claim 456 → CO-50 / medical necessity
Claim 789 → CO-50 / medical necessity

The system knows **what reason code came back**.

But that doesn't necessarily tell the team:

- Why is BCBS suddenly denying these?
- Are all these denials actually caused by the same issue?
- Is this a hospital process problem or a payer behavior change?
- Should we appeal them?
- Should we correct and resubmit them?
- Are some not worth touching?
- How much money is attached to the pattern?
- Is this happening more often than it used to?

That is the gap RevCompass is trying to fill.

## 2. The easiest way to think about RevCompass

Think of RevCompass as an **AI investigator + decision engine sitting above Epic**.

Epic and other systems already produce the claims, payments, denials and contractual variance information.

RevCompass is **not trying to recreate Epic**.

Instead, Epic might tell us:

"These 247 claims have a payment variance."

RevCompass asks:

**"Why do these 247 claims look alike, what is probably happening, and what should we do about them?"**

That distinction is extremely important.

## 3. "The package, not the claim, is the unit of work"

This is probably the single most important concept in the entire idea.

Suppose there are **183 spinal surgery claims denied by BCBS**.

Today:

Claim 1 → analyst investigates
Claim 2 → analyst investigates
Claim 3 → analyst investigates
...
Claim 183 → analyst investigates

RevCompass might discover:

**163 of those claims have the same underlying pattern.**

For example:

**BCBS + spinal fusion + CPT XYZ + claims submitted since June + same denial code + same policy language**

RevCompass creates one package:

**Pattern #27: BCBS spinal fusion medical-necessity denials**

- Claims affected: 163
- Total exposure: $1.7M
- Estimated recoverable: $1.1M
- Probable cause: documentation requirement changed
- Recommended action: appeal using supporting evidence XYZ
- Confidence: 91%

Now the revenue cycle team isn't solving 163 independent mysteries.

It is solving **one problem affecting 163 claims**.

That's what your line means:

**"The package, not the claim, is the unit of work."**

## 4. What exactly are the three engines?

There are really three related questions RevCompass answers.

### Engine 1 — Payer Behavior Fingerprint

**Question: "Is this payer behaving differently than it normally does?"**

Every payer develops a historical behavioral profile.

For example:

**BCBS fingerprint**

Historically:

- 4% denial rate for a procedure
- average 22 days to payment
- 62% of appealed denials overturned
- 2% downgrade rate
- mostly CARC X/Y/Z

Then suddenly:

- denial rate becomes **12%**
- payments take **34 days**
- a new denial reason appears
- appeal overturn rate drops

RevCompass says:

**Something has changed.**

That is payer drift.

The fingerprint is essentially:

**"What does normal look like for this payer?"**

Once you know normal, you can identify abnormal behavior.

## 5. Why call it a "fingerprint"?

Because different payers behave differently.

For exactly the same procedure:

| Metric | Payer A | Payer B |
|---|---|---|
| Denial rate | 3% | 9% |
| Avg. days to pay | 18 | 31 |
| Appeal success | 70% | 25% |
| Common denial | Authorization | Medical necessity |

So you don't necessarily want one universal rule saying:

"Medical necessity denials should always be appealed."

For Payer A, appeals may usually succeed.

For Payer B, they may almost never succeed unless a specific condition exists.

RevCompass learns those differences.

Hence:

**Payer behavioral fingerprint.**

## 6. Engine 2 — Denial Disposition

This is probably the engine you should actually demonstrate in the hackathon MVP.

It answers:

**What should we do with this denial?**

There are roughly three possible recommendations.

**Appeal**

The original claim may be correct, but the payer decision should be challenged.

Example:

BCBS says procedure was not medically necessary, but based on the relevant policy criteria and available claim context, similar historical appeals succeeded.

Recommendation:

**Appeal**

**Correct / resubmit**

The payer may be right that something about the claim submission was wrong.

Example:

Denied because authorization number was missing from the claim.

You don't need a legal-style appeal.

You need to fix the claim.

Recommendation:

**Correct and resubmit**

**Write off / do not pursue**

Suppose:

- claim = $90
- analyst effort = $45
- historical probability of recovery = 3%

It doesn't make economic sense to spend significant human time chasing it.

Recommendation:

**Do not pursue / write off according to policy**

That doesn't mean AI autonomously writes off the claim.

A human still approves the recommendation.

## 7. Where does "expected recovery value" come in?

This makes the solution much stronger than merely saying:

"Appeal this denial."

Imagine two claims.

**Claim A**

- balance: $100,000
- probability of successful recovery: 80%

Expected recovery:

**$80,000**

**Claim B**

- balance: $2,000
- probability of successful recovery: 20%

Expected recovery:

**$400**

Obviously, Claim A should receive more attention.

Very simplistically:

**Expected recovery = recoverable amount × probability of recovery**

You can make that more sophisticated later by including:

- effort required
- appeal cost
- filing deadline
- payer behavior
- historical overturn probability

So ultimately RevCompass could rank work approximately as:

**Economic priority = Expected recovery − Cost/effort to pursue**

The AI doesn't need to calculate those numbers itself.

Your deterministic analytics layer does.

## 8. Why "deterministic tools do the math"?

This is another important design decision.

You don't want Gemini being asked:

"There are 2,437 claims averaging $8,213.47. What's the total exposure?"

An LLM **can** calculate things, but you don't want financially important numbers depending on probabilistic language-model reasoning.

Instead:

**Code / analytics calculates**

- number of claims
- total dollars
- denial rates
- historical success rates
- trends
- exposure
- recovery probability
- days to payment

**Gemini reasons over**

- payer policy documents
- contracts
- reason-code descriptions
- SOPs
- patterns in the data
- why the pattern may exist
- what evidence supports the recommended action

So the division is:

**Machines/code calculate.**

**Gemini interprets and reasons.**

That's a very defensible architecture.

## 9. Engine 3 — Underpayment / Contract Variance

This is similar, but the claim wasn't fully denied.

Suppose the hospital expected:

$12,000

The payer paid:

$9,000

So Epic or another contract-management tool already identifies:

**$3,000 variance**

RevCompass does **not** need to recreate the entire contract calculation.

Instead it receives:

- Expected reimbursement = $12K
- Actual payment = $9K
- Variance = $3K

And asks:

**Why might this variance exist, are other claims showing the same pattern, and should we recover it?**

It might discover:

412 orthopedic claims from Payer X have been reimbursed using an outdated rate since July.

Then:

- Claims: 412
- Exposure: $620K
- Root-cause hypothesis: outdated contractual rate
- Evidence: contract amendment effective July 1
- Recommended action: package for payer escalation/recovery

Again:

**One package instead of 412 investigations.**

## 10. What does "cross-source evidence fusion" really mean?

This sounds complicated but the idea is simple.

Today, evidence lives in different places.

For one denial, an analyst may need to look at:

- claim
- remit
- CARC/RARC
- payer policy
- contract
- previous appeals
- workflow information
- maybe later clinical documentation

RevCompass brings those pieces together.

For example:

**Claim says**

CPT 22612 — spinal fusion

**Remit says**

CO-50 — not medically necessary

**Payer policy says**

Conservative therapy required before procedure

**Historical outcomes say**

Similar claims with criterion XYZ present have 78% appeal success

**RevCompass concludes**

**Likely winnable medical-necessity denial. Recommend appeal.**

That's what "evidence fusion" means.

## 11. And every recommendation is cited

This matters hugely.

You don't want the tool saying:

"Appeal this."

You want:

**Recommendation: Appeal**

**Why:** Claim denied for medical necessity. BCBS policy requires criteria A/B/C. Historical claims with this combination have achieved a 74% overturn rate.

**Evidence:**

- Remit 835 — CARC 50
- BCBS Medical Policy §4.2
- Historical appeal cohort — 84 similar claims

**Confidence: 87%**

Now an analyst can validate it.

That makes the solution much more credible than a black-box AI.

## 12. What does the confidence score mean?

It means:

**How strongly does the available evidence support this recommendation?**

For example:

**94% confidence**

- highly similar historical claims
- clear payer policy
- consistent denial reason
- strong historical appeal performance

**54% confidence**

- sparse historical data
- ambiguous policy
- mixed outcomes
- incomplete claim context

Low-confidence cases can automatically go to:

**Human review required**

High-confidence cases can go into a faster review queue.

## 13. Where does the human fit?

This is a **human-in-the-loop system**.

RevCompass recommends:

Appeal 163 claims.

A human sees:

- Why
- Evidence
- Dollars
- Claims
- Confidence

Then confirms:

**Approve package**

Only then does downstream action occur.

That protects against hallucination and makes adoption much easier.

## 14. The learning loop is another major differentiator

Suppose RevCompass recommends:

Appeal these 100 claims.

Later:

- 82 paid
- 10 denied again
- 8 still pending

RevCompass learns:

This pattern has an 82% recovery rate.

Next time the same pattern occurs, that evidence strengthens the recommendation.

But suppose only 5 out of 100 succeed.

Then the system learns:

Our hypothesis was wrong.

That's what you mean by:

**"confirm or kill the pattern."**

Instead of AI continuously claiming something is a root cause, reality validates it.

That is a very strong concept.

## 15. What is "causal clustering"?

You discussed this earlier, and this is where it fits.

Basic clustering would say:

These claims look statistically similar.

But that's not enough.

You want something closer to:

**These claims appear to have the same underlying operational cause.**

For example:

You have 900 denials with CARC 50.

Basic reporting says:

900 medical-necessity denials.

RevCompass could discover:

**Cluster A — 420 claims**

BCBS + spinal procedures + after June 1

Probable cause: payer policy changed

**Cluster B — 280 claims**

United + imaging + Location X

Probable cause: authorization workflow failure at Location X

**Cluster C — 200 claims**

Aetna + procedure Y

Probable cause: coding/documentation issue

Same CARC.

**Three completely different problems.**

That is why stopping at CARC/RARC is insufficient.

## 16. That's also where "root cause" becomes important

A denial reason isn't necessarily the root cause.

Example:

**Reason code:** Missing authorization

But why was authorization missing?

Potential root causes:

- scheduler forgot to initiate it
- payer portal failure
- authorization expired
- wrong CPT submitted during authorization
- case changed after scheduling
- interface did not transmit authorization number

RevCompass eventually tries to move from:

**What denial code happened?**

to:

**What actually caused the pattern?**

For the MVP, though, don't overpromise perfect causal inference.

It is safer to describe it as:

**Evidence-backed root-cause hypothesis / pattern attribution**

until outcomes confirm it.

## 17. One end-to-end example

This is probably the easiest scenario around which to build your demo.

Imagine RevCompass receives:

**1,842 denied claims**

The screen says:

**Step 1 — Detect pattern**

RevCompass finds:

**Pattern detected: BCBS orthopedic medical-necessity denials**

- 243 claims
- $1.8M exposure
- denial rate increased from 4.2% → 11.7%
- increase began June 3

That's the **payer fingerprint**.

**Step 2 — Investigate**

Gemini reviews:

- denial codes
- payer policy
- historical outcomes
- claim metadata

It finds:

BCBS updated policy wording on May 28.

That's the **reasoning layer**.

**Step 3 — Recommend disposition**

Historical data shows:

claims meeting criteria XYZ have 79% overturn rate.

Recommendation:

**Appeal package**

Expected recovery: ~$1.1M

Confidence: 89%

That's the **disposition engine**.

**Step 4 — Package claims**

Instead of:

analyst working 243 claims separately

RevCompass creates:

**BCBS Orthopedic Policy Change — Recovery Package #001**

containing all 243 claims and the supporting evidence.

**Step 5 — Human validates**

Analyst clicks:

**Approve recommendation**

**Step 6 — Outcomes return**

Eventually:

- 176 paid
- 31 denied
- 36 pending

RevCompass updates:

Appeal success rate = 85% of resolved claims

The payer fingerprint and future recommendation become better.

That's your whole idea in one workflow.

## 18. What does RevCompass NOT do?

You should be able to explain this confidently because judges will almost certainly ask.

It is **not**:

**A new EHR.**

It sits above systems like Epic.

**A contract modeling engine.**

It can consume an expected-vs-actual variance produced by existing contract systems.

**An autonomous claims bot.**

It recommends; a human approves.

**A simple denial dashboard.**

Dashboards tell you what happened. RevCompass recommends what to do.

**A generic chatbot.**

It combines deterministic analytics, structured healthcare data and document reasoning.

**Just an appeal generator.**

Sometimes the right answer is resubmit, write off or prevent recurrence.

That last point is particularly important.

## 19. Why shouldn't this simply be an Epic feature?

This is another likely challenge.

Your answer is basically:

Epic is one source of operational data, but the decision requires information that may sit across:

Epic + remit + payer policy + contracts + historical outcomes + SOPs + other RCM platforms.

RevCompass therefore becomes a **decision/intelligence layer across those sources** rather than replacing any of them.

The differentiation is not:

"Epic can't show denials."

Of course it can.

It is:

**RevCompass synthesizes cross-source evidence and converts a population of variances into prioritized, outcome-validated actions.**

## 20. Why does payer fingerprint matter if disposition already works?

Because they solve different questions.

**Disposition engine asks:**

**What should I do with this claim/package?**

**Payer fingerprint asks:**

**Is something changing at this payer that I should know about?**

One is **reactive decisioning**.

The other is **early detection**.

For example, yesterday you had only 12 denials.

That may not trigger someone's attention.

But RevCompass sees:

Historically BCBS denial rate for this CPT = 2.1%.

Last two weeks = 7.9%.

So it raises an alert before you accumulate hundreds of denials.

That's powerful.

## 21. Why are you wisely limiting the MVP?

The full vision is pretty large.

You potentially have:

payer monitoring + denial RCA + disposition + underpayments + contracts + prevention + workflow integration + clinical documentation.

Trying to build all of that for a hackathon would weaken the demo.

Your MVP is much cleaner:

**Denial comes in → RevCompass identifies related claims → adds payer behavioral context → recommends disposition → packages claims → human validates → outcome tracked.**

Then you show:

**Near-term roadmap**

Underpayment intelligence

**Longer-term roadmap**

Clinical-note-grounded root cause and prevention

That's believable.

## 22. Why are you avoiding clinical notes for the MVP?

Because clinical notes contain PHI and create a much bigger security/compliance burden.

But for the MVP you can already demonstrate substantial value using things like:

- payer
- procedure / DRG / CPT
- CARC/RARC
- amount
- payment status
- dates
- appeal outcome
- payer policies
- contract language

So you are essentially saying:

**We don't need the hardest data problem to demonstrate the core intelligence.**

Then PHI-safe clinical reasoning becomes roadmap functionality.

Very sensible.

## 23. What exactly makes Gemini necessary?

This is worth being very precise on.

If everything were just:

denial rate ↑ 4% → 12%

you could build this in SQL or Power BI.

Gemini becomes useful because evidence also exists as **language**.

For example:

- payer policies
- contract clauses
- appeal notes
- SOPs
- policy updates

Gemini can reason across them.

Imagine asking:

"What changed in this payer's policy that could explain this emerging denial pattern?"

Traditional analytics struggles with that.

Gemini can compare the old policy, new policy and denial cohort, then explain the hypothesis.

So:

**Analytics finds the pattern.**

**Gemini helps explain the pattern.**

**Historical outcomes help decide what to do about the pattern.**

That is probably the cleanest explanation of the architecture.

## 24. If I compressed your entire idea into one diagram

It is essentially:

**Claims + Remits + Contracts + Payer Policies + Historical Outcomes**
↓
**RevCompass**
↓
**1. Detect unusual payer behavior**
↓
**2. Group similar variances into packages**
↓
**3. Explain likely root cause**
↓
**4. Recommend Appeal / Resubmit / Write-off**
↓
**5. Quantify exposure + expected recovery**
↓
**6. Human approves**
↓
**7. Track actual outcome**
↓
**8. Learn and improve future recommendations**

## 25. And the strongest one-line articulation

I would keep this in your head throughout the entire hackathon:

**RevCompass turns fragmented denial and underpayment data into pattern-level, evidence-backed recovery decisions — helping providers decide what to pursue, what not to pursue, and what systemic issue to fix.**

And the even more layman version:

**Instead of asking analysts to investigate 500 claims, RevCompass tells them that 400 of those claims are really the same problem, explains why, quantifies the money at risk, and recommends the best action.**

That second sentence is probably the mental model I would build the **entire 3-minute demo around**.

For Round 2 specifically, the smartest next step is to define the **exact MVP user journey/screens** before touching the deck or video, because the wireframe, presentation story, and walkthrough can then all tell the same story.
