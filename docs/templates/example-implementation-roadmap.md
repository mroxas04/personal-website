# AI Implementation Roadmap — Fictional Example

> This example is entirely fictional. “Northstar Home Services” and every person, number, workflow, and system below were invented to test the roadmap format.  
> Organization: Northstar Home Services  
> Opportunity: Faster first-pass routing for inbound service requests  
> Session date: 2026-09-10  
> Prepared by: Matthew Roxas  
> Decision owner: Customer Operations Director  
> Next checkpoint: 2026-10-09

## Executive summary

Northstar's coordinators manually read and route every web request, creating delays during seasonal peaks. The recommended pilot uses AI to propose a category, urgency flag, and draft reply for 100 non-emergency web submissions; a coordinator must approve every result before it enters the scheduling workflow. The pilot excludes phone calls, emergency dispatch, automated booking, and messages containing payment information. After 100 requests, the Customer Operations Director will proceed, revise, pause, or stop based on routing accuracy, response time, corrections, and safety exceptions.

## 1. Opportunity and desired outcome

### Current problem

Two coordinators manually review a shared inbox, interpret free-text requests, ask for missing details, and route each request to one of four service queues. At seasonal peaks, new web requests may wait several business hours before first review.

### Desired outcome

Give coordinators a reliable first-pass suggestion that reduces repetitive reading and drafting while keeping routing and customer communication under human control.

### Decision this roadmap supports

Should Northstar invest in a production-ready, AI-assisted intake workflow for non-emergency web requests?

### Why now

Request volume is expected to increase during the next seasonal peak, and coordinators report that first-pass classification prevents them from handling higher-value exceptions.

## 2. Current-state workflow

| Step | Owner | Input | Action | Output | Friction or risk |
| --- | --- | --- | --- | --- | --- |
| 1 | Customer coordinator | Web-form email | Read request and identify service type | Informal category | Categories vary by coordinator |
| 2 | Customer coordinator | Request details | Determine urgency and ask for missing context | Draft response | Safety language can be inconsistent |
| 3 | Customer coordinator | Categorized request | Copy details into scheduling queue | Routed request | Duplicate entry and occasional misrouting |

### Baseline

Northstar has not established a reliable baseline. For the two weeks before the pilot, it will measure median time to first review, routing corrections, and the percentage of requests requiring a follow-up for missing information.

## 3. People and decision ownership

| Role or group | Relationship to the workflow | Need or concern | Decision responsibility |
| --- | --- | --- | --- |
| Customer coordinators | Review and route requests | Faster triage without losing control | Review every pilot output and log corrections |
| Service managers | Receive routed requests | Correct queues and useful context | Validate routing categories and exception rules |
| Customers | Submit requests | Timely, appropriate response | Provide user-experience feedback through normal channels |
| IT lead | Supports systems and access | Secure, maintainable integration | Approve pilot data flow and access |

**Decision owner:** Customer Operations Director

**Pilot owner:** Customer Operations Manager

## 4. Smallest useful pilot

### Pilot statement

For two customer coordinators handling non-emergency web requests, test whether an AI-generated category, urgency flag, and reply draft can reduce median time to first review by 30% while maintaining human approval and avoiding unsafe automated guidance.

### In scope

- 100 non-emergency requests submitted through the public web form
- Four existing service categories
- A suggested category, urgency flag, missing-information note, and reply draft
- Coordinator review and approval before any routing or response

### Out of scope

- Phone calls, SMS, emergency dispatch, and after-hours escalation
- Automated booking, routing, or customer messaging
- Payment information, health details, or attachments
- Replacement of the existing scheduling system

### Proposed flow

1. An eligible web request enters a temporary pilot queue.
2. The system proposes a category, urgency flag, missing-information note, and draft response.
3. A coordinator reviews and may correct, approve, or reject each field.
4. The coordinator manually sends the approved response and routes the request through the existing process.
5. The pilot log records review time, corrections, rejections, and exception type without storing unnecessary message content.

### Decision gate

After 100 eligible requests or four weeks, whichever comes first, the Customer Operations Director will proceed, revise, pause, or stop the pilot using the evidence below.

## 5. Data and systems

| Requirement | Current source or system | Access/quality note | Owner | Needed before pilot? |
| --- | --- | --- | --- | --- |
| Web request fields | Existing web form | Free text varies widely | Customer Operations Manager | Yes |
| Service categories | Scheduling handbook | Definitions overlap | Service managers | Yes |
| Pilot workspace | Approved internal tool | Access not yet configured | IT lead | Yes |
| Outcome log | New pilot sheet | Must avoid full message copies | Pilot owner | Yes |

### Data boundaries

- **Allowed:** Service type, general request description, city/ZIP, preferred contact channel, and coordinator corrections
- **Prohibited:** Payment-card data, account credentials, health information, attachments, and requests marked emergency
- **Retention:** Pilot inputs and outputs retained for 30 days after the decision gate
- **Deletion:** IT lead deletes the pilot workspace export and confirms deletion in the decision record

## 6. Human judgment and escalation

| Situation | Required human action | Escalation owner | System must not do |
| --- | --- | --- | --- |
| Low-confidence or ambiguous category | Choose the category manually | Customer Operations Manager | Route automatically |
| Possible gas leak, electrical danger, fire, or medical risk | Stop pilot processing and use the existing emergency script | Service manager | Draft diagnostic or safety instructions |
| Hostile, threatening, or legally sensitive request | Escalate under the current policy | Customer Operations Director | Respond automatically |

### Non-negotiable human decisions

- Whether a request requires emergency or safety escalation
- Which service queue receives the request
- Whether and what to send to the customer

## 7. Risks, assumptions, and dependencies

| Item | Type | Likelihood/impact | Mitigation or test | Owner |
| --- | --- | --- | --- | --- |
| Historical categories are inconsistent | Risk | Medium/Medium | Managers approve a four-category rubric before testing | Service managers |
| Coordinators will correct suggestions consistently | Assumption | Medium/High | Train on a shared correction guide and audit 20 samples | Pilot owner |
| Approved pilot workspace is available | Dependency | Medium/High | IT approval is a start gate | IT lead |
| Urgent language may be missed | Risk | Low/High | Human review of every request; emergency keyword stop rule | Customer Operations Director |

## 8. Success measures

| Measure | Baseline | Pilot target | How measured | Review cadence | Owner |
| --- | --- | --- | --- | --- | --- |
| Median time to first review | Establish over two weeks | 30% lower | Form timestamp to first coordinator action | Weekly | Pilot owner |
| Correct initial service category | Establish over two weeks | At least 90% before coordinator correction | Compare suggestion with approved category | Weekly | Service managers |
| Unsafe automated actions | 0 | 0 | Review exceptions and activity log | Every request | Pilot owner |
| Coordinator-reported usefulness | Not established | At least 4/5 average | Weekly two-question pulse | Weekly | Customer Operations Manager |

## 9. Delivery plan

| Phase | Action | Owner | Target date | Completion evidence |
| --- | --- | --- | --- | --- |
| Prepare | Measure baseline and approve category rubric | Customer Operations Manager | 2026-09-25 | Baseline summary and signed-off rubric |
| Prepare | Approve pilot workspace and data boundary | IT lead | 2026-09-25 | Access approval recorded |
| Pilot | Process up to 100 eligible requests with human review | Pilot owner | 2026-10-07 | Sanitized outcome log |
| Review | Evaluate results and record proceed/revise/pause/stop decision | Customer Operations Director | 2026-10-09 | Signed decision record |

## 10. Immediate next action

**Action:** Produce the four-category routing rubric and label 20 fictional or fully sanitized sample requests.

**Owner:** Customer Operations Manager

**Target date:** 2026-09-18

**Completion evidence:** Service managers approve the rubric and resolve disagreements in the 20-sample review.

## Open questions

- Can the approved pilot workspace process request text under Northstar's data policy?
- Which phrases must always trigger the existing emergency process?
- How will seasonal volume affect the baseline comparison?

## Scope boundary

This fictional roadmap illustrates direction based on a short working session. A real engagement would require verification with the people responsible for the workflow, security review of the selected systems, and separately scoped implementation work.
