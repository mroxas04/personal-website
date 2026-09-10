# AI Implementation Roadmap

> Confidential working document  
> Organization: [Organization]  
> Opportunity: [Short opportunity name]  
> Session date: [YYYY-MM-DD]  
> Prepared by: Matthew Roxas  
> Decision owner: [Name or role]  
> Next checkpoint: [YYYY-MM-DD]

## Executive summary

[In three to five sentences, state the desired outcome, the recommended smallest useful pilot, the most important constraint, and the decision needed next. Write this section last.]

## 1. Opportunity and desired outcome

### Current problem

[Describe the observable problem in the existing workflow. Avoid defining the problem as “we do not have AI.”]

### Desired outcome

[Describe what should be meaningfully different for the organization or user.]

### Decision this roadmap supports

[State the decision someone should be able to make after reading this roadmap.]

### Why now

[Name the evidence, deadline, repeated friction, or strategic reason that makes this worth considering now.]

## 2. Current-state workflow

| Step | Owner | Input | Action | Output | Friction or risk |
| --- | --- | --- | --- | --- | --- |
| 1 | [Role] | [Input] | [Current action] | [Output] | [Observed problem] |
| 2 | [Role] | [Input] | [Current action] | [Output] | [Observed problem] |

### Baseline

[Record what is known about current volume, time, quality, cost, errors, or experience. If no baseline exists, say how it will be measured before the pilot.]

## 3. People and decision ownership

| Role or group | Relationship to the workflow | Need or concern | Decision responsibility |
| --- | --- | --- | --- |
| [Primary user] | [How they participate] | [What matters to them] | [Decision, review, or input] |
| [Affected stakeholder] | [How they are affected] | [Risk or desired outcome] | [Decision, review, or input] |

**Decision owner:** [One role accountable for the proceed/pause/stop decision]

**Pilot owner:** [One role accountable for running the pilot]

## 4. Smallest useful pilot

### Pilot statement

For [specific users or workflow], test whether [bounded AI-supported action] can improve [measurable outcome] while [human control or safety condition remains true].

### In scope

- [One bounded use case]
- [Named users, location, data set, or volume]
- [Expected human review]

### Out of scope

- [Adjacent workflow not included]
- [Autonomous action the pilot will not take]
- [Data, integration, or user group deferred]

### Proposed flow

1. [Input enters the pilot.]
2. [The system performs a bounded action.]
3. [A person reviews, corrects, approves, or escalates.]
4. [The approved result enters the existing workflow.]
5. [Outcome and exception data are captured.]

### Decision gate

At [time, volume, or date], the decision owner will **proceed**, **revise**, **pause**, or **stop** the pilot using the success and safety evidence below.

## 5. Data and systems

| Requirement | Current source or system | Access/quality note | Owner | Needed before pilot? |
| --- | --- | --- | --- | --- |
| [Data or system] | [Source] | [Known limitation] | [Role] | Yes/No |

### Data boundaries

- **Allowed:** [Minimum data the pilot needs]
- **Prohibited:** [Secrets, sensitive fields, or data not approved for the pilot]
- **Retention:** [How long pilot inputs and outputs are kept]
- **Deletion:** [Who can delete pilot data and how]

Never place credentials, confidential data, or customer records in this repository or a public task.

## 6. Human judgment and escalation

| Situation | Required human action | Escalation owner | System must not do |
| --- | --- | --- | --- |
| [Low-confidence or ambiguous result] | [Review/correct] | [Role] | [Forbidden autonomous action] |
| [Safety, legal, financial, or reputational risk] | [Stop/escalate] | [Role] | [Forbidden autonomous action] |

### Non-negotiable human decisions

- [Decision that remains human-owned]
- [Decision that remains human-owned]

## 7. Risks, assumptions, and dependencies

| Item | Type | Likelihood/impact | Mitigation or test | Owner |
| --- | --- | --- | --- | --- |
| [Risk or assumption] | Risk/Assumption/Dependency | [Low/Medium/High] | [Mitigation or evidence needed] | [Role] |

## 8. Success measures

| Measure | Baseline | Pilot target | How measured | Review cadence | Owner |
| --- | --- | --- | --- | --- | --- |
| [Outcome measure] | [Known or to establish] | [Target] | [Method] | [Cadence] | [Role] |
| [Quality/safety measure] | [Known or to establish] | [Target or limit] | [Method] | [Cadence] | [Role] |

Include at least one outcome measure and one quality or safety measure. A target is a pilot decision rule, not a public performance promise.

## 9. Delivery plan

| Phase | Action | Owner | Target date | Completion evidence |
| --- | --- | --- | --- | --- |
| Prepare | [Establish baseline, access, or examples] | [Role] | [Date] | [Evidence] |
| Pilot | [Run the bounded workflow] | [Role] | [Date] | [Evidence] |
| Review | [Evaluate outcome and exceptions] | [Role] | [Date] | [Decision record] |

## 10. Immediate next action

**Action:** [One concrete action]

**Owner:** [One person or role]

**Target date:** [YYYY-MM-DD]

**Completion evidence:** [Observable proof that the action occurred]

## Open questions

- [Question that could materially change the recommendation]
- [Evidence that must be gathered]

## Scope boundary

This roadmap captures direction based on the information available during the session. It is not a security assessment, legal opinion, guaranteed implementation estimate, or substitute for discovery with the people responsible for the affected workflow. Research, implementation, procurement, and ongoing advising require separate scope when needed.
