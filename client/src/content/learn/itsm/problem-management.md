---
title: "Problem Management"
description: "Root cause analysis and known errors."
---

# Problem Management

## What is a Problem?
A problem is the underlying cause of one or more incidents.  The root cause is often unknown when the problem is initially created.

## What is Problem Management?
Problem Management is responsible for:
* **Investigating:**  Determining the root cause of incidents.
* **Resolving:**  Implementing solutions to prevent future incidents.
* **Minimizing Impact:**  Reducing the impact of incidents that cannot be prevented.

## Problem States
* **New:**  The initial state when a problem is created.
* **Assess:**  The problem is being evaluated.
* **Duplicate/Canceled:**  The problem is deemed a duplicate or invalid during assessment.
* **Root Cause Analysis (RCA):**  The root cause is being actively investigated.
* **Accepted Risk:**  The problem is acknowledged, but a fix is not feasible or too risky.  A workaround may be in place.  This often leads to a "Known Error" record.
* **Fix in Progress:**  A solution is being implemented. This might involve a change request.
* **Resolved:** The root cause has been addressed.
* **Closed**: The problem has been fixed.

## Problem Management Lifecycle (Stages)
1. **Detection and Logging:**
   * **Reactive:**  Identifying a problem based on multiple related incidents.
   * **Proactive:**  Identifying a potential problem before it causes widespread incidents.
   * **Creating Record:**  Creating a new problem record.
   * **Prioritizing/Categorizing:**  Setting priority and category.
2. **Investigation and Diagnosis:**
   * **Conducting RCA:**  Performing root cause analysis.
   * **Problem Tasks:**  Creating problem tasks for other teams if necessary.
   * **Documenting:**  Recording the root cause, workaround, and fix.
3. **Resolution and Closure:**
   * **Confirming Workaround:**  Verifying that the workaround (if any) is effective.
   * **Confirming Fix:**  Verifying that the permanent fix resolves the issue.
   * **Implementing Change:**  Using change management to implement the fix if required.
   * **Closing Problem:**  Closing the problem record (manually or automatically).

## Problem Management Pictorial Representation
This section describes a diagram illustrating the problem management process.
* **Problem Creation:**  Problems can originate from:
  * Incident Management
  * Event Management
  * Technical Support
  * Development Code Review
* **Logging/Categorization/Prioritization**
* **Known Error Check:**  Determining if the problem is already a known error.
* **Diagnosis:**
  * **Workaround Availability:**  A workaround is crucial for creating a known error or proceeding with resolution.
* **Resolution:** Review and closure.

## ServiceNow Problem Management Demo

### List View
Similar to the Incident list view, the Problem list view offers filtering, sorting, grouping, and exporting capabilities.

### Form View (Creating a New Problem)
* **Fields:**
  * **First Reported By:**  May be linked to an incident.
  * **Category/Subcategory:**  Classify the problem.
  * **Configuration Item:**  Specify the affected CI.
  * **Problem Statement/Description:**  Describe the problem.
  * **Assignment Group/Assigned To:**  Assign the problem.
  * **Related Incidents:**  Link related incidents.
  * **Problem Tasks / Change Requests:** Create or associate related records.
* **Sections:** Notes, Analysis Information, Resolution Information.

### Working on a Problem (Impersonation)
* **Assigning:**  Assign the problem to a group and individual.
* **Marking Duplicate:**  Mark the problem as a duplicate of an existing problem.
* **Confirming:** Confirm that the issue is indeed a problem
* **Accepting Risk:**  Acknowledge the problem, but choose not to fix it (creating a known error).
* **Creating Problem Tasks:**  Assign tasks to other teams for investigation.
* **Starting Fix:** Initiate the fix process.
* **Re-analyze**
* **Resolving:**  Document the cause and fix, and mark the problem as resolved.
* **Complete**

### Creating a Problem from an Incident
Demonstrates creating a problem directly from an incident record (right-click -> Create Problem).

### Problem Data Structure
* **Task Table (Parent):**  The base table.
* **Problem Table (Child):**  Inherits fields from Task and adds problem-specific fields (Cause Notes, Fixed Notes, Workaround, etc.).
* **Problem Task Table (Child):**  Used for assigning sub-tasks.  One problem can have multiple problem tasks.
