---
title: "Change Management"
description: "Change models, types, and risk assessment."
---

# Change Management

## Introduction
This module covers ServiceNow Change Management, explaining how to use, administer, and develop within the application. It's suitable for ITIL users, ServiceNow administrators, and developers.

## What is Change & Change Management?
* **Change:** Addition, modification, or removal of any authorized, planned, or supported service/component that could affect IT services.  Think of adding/removing features in ServiceNow itself.
* **Change Management:** Standard procedures and practices for managing change requests effectively, minimizing risk and impact on business operations.  It helps manage the risks associated with implementing changes.

## Change Management Process (Activities)
The process follows a sequence:
1. **Create and Log:** A change request is created.
2. **Review:** Change is reviewed and prioritized.
3. **Evaluation:** Impact, risk, and benefits are assessed.
4. **Approvals:** Authorization is required before implementation.
5. **Implementation:** Change is implemented as per schedule.
6. **Validation:** Verification that the change was implemented correctly and without negative consequences.

## Change Management Application in ServiceNow
ServiceNow provides a Change Management application to automate and track this process. It offers a systematic approach to control the lifecycle of changes.
* **Accessing the Application:**  Type "change" in the application navigator.
* **Modules:**
  * **Create New:** Opens a new change request form.
  * **Open:** Lists open change records.
  * **Closed:** Lists closed change records.
  * **All:** Lists all change records.
  * **Overview:** Dashboard with change metrics.
  * **Standard Change:** Configuration for standard changes.
  * **Change Advisory Board (CAB):** CAB Workbench and related options.
  * **Schedules:** Change schedules (maintenance, blackout, default).
  * **Change Policy:** Change approval policies and definitions.
  * **Administration:** Configuration options (properties, risk conditions, etc.).
  * **ATF Suites:** Automated Testing Framework test cases.

## Change Management Plugins
Various plugins enable features:
* **Change Management Core, ITSM Roles, Business Stakeholder, State Model, Collision Detector, Risk Calculator, Change Schedule, Risk Assessment, Standard Change Catalog, Bulk CI Changes, Mass Update CI, Approval Policy, CAB Workbench.**
* Many are activated by default (e.g., in New York release).
* Some (e.g., Mass Update CI, Risk Assessment) might need manual activation.
* Access the plugin via typing "plugins" in application navigator.

## Change Types
ServiceNow supports three change types (aligned with ITIL):
1. **Standard Change:**
   * Pre-authorized, low-risk, follows specified procedures.
   * Frequently implemented, repeatable steps.
   * No CAB approval required.
   * Uses pre-approved templates.
   * Simplified workflow (auto-approval, scheduled, implement, review).
2. **Emergency Change:**
   * Implemented ASAP to resolve high-priority issues.
   * Bypasses some approvals, moves directly to CAB authorization.
   * Often "post" changes (record created after implementation).
   * Example: Adding database space to fix a production outage.
   * Workflow includes CAB approval, but fewer steps than normal changes.
3. **Normal Change:**
   * Doesn't fall under standard or emergency.
   * Follows the complete change lifecycle (two levels of approval).
   * Planned, may have impact.
   * Requires assessment, approvals, and often presented in CAB meetings.
   * Defined maintenance window.
   * Workflow involves more activities and a full lifecycle.

## Change Form and Fields
The change request form captures details:
* **Top Section:** Process flow (New, Assess, Authorize, Scheduled, Implement, Review, Closed, Canceled).
* **Key Fields:**
  * Number, Reported by, Category, Service, Configuration Item, Priority, Risk, Impact, Type, State, Conflict Status, Assignment Group, Assigned To, Short Description, Description.
* **Planning Section:** Justification, Implementation Plan, Risk and Impact Analysis, Backout Plan, Test Plan.
* **Schedule Section:** Planned Start/End Date/Time, CAB Required, CAB Date, Actual Start/End Date, CAB Delegate, CAB Recommendation.
* **Conflicts Section:** Shows conflicting changes (e.g., multiple changes to the same CI at the same time).
* **Notes Section:** ITIL notes, work notes, watch lists.
* **Closure Information Section:** Closure Code, Close Notes.

## ServiceNow Change Process Flow (States)
1. **New:** Default state for a new change.
2. **Assess:** Quality, impact, and risk are assessed.
3. **Authorize:** Change is under approval.
4. **Scheduled:** Change is approved, awaiting implementation.
5. **Implement:** Change is being implemented.
6. **Review:** Results of the implemented change are reviewed.
7. **Closed:** Change is complete.
8. **Canceled:** Change is canceled.

## Change Creation
Ways to create change records:
* **New Option:** From the "Change" application.
* **Incident/Problem Records:** Right-click, "Create Normal/Standard/Emergency Change."
* **CI:** From a Configuration Item, "Add to New/Existing Change Request."
* **Standard Change Catalog:** Select a pre-approved template.
* **Copy Existing Change:** Right-click, "Copy Change."

## Creating and Processing Changes (Demo Walkthrough)
The text provides a detailed walkthrough of creating each change type (Normal, Emergency, Standard):
* **Normal Change:**
  * Fill out the form, set a future schedule.
  * Request approval (goes to assignment group and CAB approvers).
  * Impersonate approvers to approve.
  * Move through states (Scheduled, Implement).
  * Close tasks (implementation, post-implementation testing).
  * Close the change (select closure code and notes).
* **Emergency Change:**
  * Similar to normal, but bypasses some approvals (goes directly to CAB).
  * Faster workflow.
* **Standard Change:**
  * Select from pre-approved templates.
  * Some fields are pre-populated and read-only.
  * No approvals required (moves directly to Scheduled, then Implement).

The demo highlights the differences in workflow and approval processes for each change type. It emphasizes the out-of-the-box nature of the workflows and the possibility of customization, while recommending sticking to the standard processes as much as possible.
