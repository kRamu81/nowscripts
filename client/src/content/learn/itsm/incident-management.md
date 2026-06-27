---
title: "Incident Management"
description: "Restore service as quickly as possible."
---

# Incident Management

## What is an Incident?
An incident is defined as:
1. **Unplanned Interruption:** Any unexpected disruption to an IT service (e.g., email server outage, hardware failure).
2. **Reduction in Quality:**  A decrease in the quality of an IT service (e.g., slow internet due to router issues).
3. **Configuration Item Failure**: A failure to a Configuration Item.
4. **Proactive Incident Creation**: An incident may be raised proactively if a potential issue is identified *before* it impacts service (e.g., a technician notices a failing router).

## What is Incident Management?
Incident Management is the process of:
* **Restoring Services Quickly:**  Minimizing the impact of unplanned interruptions.
* **Investigating Root Causes:**  Identifying the underlying cause of incidents.
* **Resolving Incidents within SLAs:**  Meeting agreed-upon service level agreement (SLA) timelines.
* **Preventing Recurrence:**  Implementing solutions to prevent similar incidents from happening again.

**ServiceNow's Role:** ServiceNow facilitates the ITIL-based incident management process with automation, trend analysis, and predictive intelligence.

## Benefits of Incident Management
* **End-User Benefits:**
  * Rapid service restoration.
  * User-friendly service desk interactions (notifications, updates).
* **IT/Business Benefits:**
  * Faster service restoration.
  * Root cause identification to minimize recurrences.
  * Improved efficiency through the use of ServiceNow.

## Incident Management Process Steps
1. **Breakdown:**  A configuration item or IT service fails.
2. **Reporting:**  The incident is reported through various channels:
   * Phone call to the service desk.
   * Self-service portal.
   * System integrations.
3. **Managing:**
   * **Investigation:**  Determining the cause of the incident.
   * **Assignment:**  Assigning the incident to the appropriate team or individual.
   * **Assessment:**  Evaluating the incident and developing a resolution plan.
4. **Resolving:**  Implementing the solution to restore the service.  This may be a recurring process or a one-time fix.
5. **Closure**

## Key Roles in Incident Management (ITIL Roles)
* **ITIL:**  The basic role for help desk technicians and anyone involved in resolving incidents.  Allows users to open, update, and close incidents, problems, and changes.
* **ITIL_admin:**  An elevated role typically assigned to team leads or managers, providing additional permissions (e.g., deleting records, other administrative functions).
* **Major_incident_manager:**  Responsible for managing major incidents.  This includes:
  * Approving and owning major incidents.
  * Communicating with stakeholders.
  * Ensuring SLA compliance.
  * Involvement in the entire incident lifecycle.

## Incident States
Incident states are crucial for tracking progress and managing SLAs.
* **New:**  The initial state when an incident is created.
* **In Progress:**  The incident is assigned and being actively worked on.
* **On Hold:**  Work is temporarily suspended, often while waiting for information from the user or another team.  SLAs may be paused during this state (depending on company configuration).  Reasons for being on hold include:
  * Awaiting Caller
  * Awaiting Change
  * Awaiting Problem
  * Awaiting Vendor
* **Canceled:**  The incident is deemed invalid, a duplicate, or resolved without intervention.
* **Resolved:**  The issue has been addressed, and the service is restored.
* **Closed:**  The incident is formally closed after confirmation from the user (manual closure) or automatically after a set period (auto-closure).  The closure method depends on company policy.

## Incident Management Lifecycle (Stages)
1. **Creation and Classification:**
   * **Logging:**  Recording the incident (via call, portal, integration).
   * **Detailing:**  Providing specific information about the incident (description, affected service, configuration item).
   * **Classifying:**  Categorizing the incident (e.g., software, hardware, network).
   * **Assigning:**  Assigning the incident for investigation (service desk, L1 team, or automated assignment).
2. **Investigation and Diagnosis:**
   * **Locating Assignment Group:**  Identifying the appropriate team.
   * **Assigning to Individual:**  Assigning the incident to a specific team member.
   * **Investigating Symptoms:**  Analyzing the impact and symptoms of the incident.
   * **Diagnosing Cause:**  Determining the root cause.  This may involve creating incident tasks for other teams.
   * **Updating Status and Work Notes:**  Keeping the incident record up-to-date with progress and relevant information.
3. **Resolution and Closure:**
   * **Restoring Service:**  Implementing the solution.
   * **Updating Incident Activity:**  Documenting actions taken by the technician.
   * **Communicating Resolution:**  Notifying the end-user.
   * **Closing Incident:**  Manually or automatically closing the incident.

## ServiceNow Incident Management Demo
This section covers a demonstration of the ServiceNow interface for Incident Management.

### List View
* **Navigation:**  Filter Navigator -> Incident -> All.
* **Elements:**
  * **Incident Number:**  Unique identifier.
  * **Opened:**  Date and time the incident was created.
  * **Short Description:**  Brief summary of the issue.
  * **Caller:**  The user who reported the incident.
  * **Priority:**  The priority level (e.g., Critical, High, Medium, Low).
  * **State:**  The current state of the incident (New, In Progress, etc.).
  * **Category:**  The type of incident (e.g., Software, Hardware).
  * **Assignment Group:**  The team assigned to the incident.
  * **Assigned To:**  The individual assigned to the incident.
* **Filtering:**
  * **Search Box:**  Search for specific text within fields.
  * **Condition Builder:**  Create complex filters using multiple criteria (e.g., Short Description contains "email" AND Priority is Critical).
  * **Right-Click Filtering:**  "Show Matching" or "Filter Out" based on a selected value.
* **Editing:**  Double-click on certain fields to modify them directly in the list view.
* **Grouping:**  Right-click on a field (e.g., State) and select "Group By" to see incidents grouped by that field.
* **Exporting:**  Right-click and select "Export" to export the list in various formats (XLS, CSV, XML, JSON, PDF).
* **Visual Task Board:**  Right-click and select "Show Visual Task Board" to view incidents in a Kanban board format.
* **Sorting:**  Click on column headers or use the Condition Builder to sort the list.
* **Pagination**: Navigate between multiple pages.

### Form View (Creating a New Incident)
* **Navigation:**  Click "New" in the list view or "Create New" in the Incident menu.
* **Fields:**
  * **Caller:**  Select the user reporting the incident.
  * **Category/Subcategory:**  Classify the incident (dependent fields).
  * **Service/Service Offering:**  Specify the affected service.
  * **Short Description/Description:**  Provide details about the issue.
  * **Impact/Urgency:**  Determine the priority (priority is often calculated automatically).
  * **State:**  Initially set to "New."
  * **Contact Type:**  How the incident was reported (Email, Phone, Self-Service, Walk-in).
  * **Assignment Group/Assigned To:** Assign the incident.
  * **Work Notes:**  Internal notes for technicians (not visible to the customer).
  * **Additional Comments:**  Notes visible to the customer.
  * **Watch List/Work Notes List:**  Add users to receive notifications.
* **Related Lists:**
  * **Task SLAs:**  Show SLAs associated with the incident.
  * **Affected CIs:**  List configuration items impacted by the incident.
  * **Incident Tasks**: Child tasks of the incident.
* **Sections:** Notes, Related Records, Resolution information.

### Working on an Incident (Impersonation)
The demo shows impersonating a user (Incident Manager) to demonstrate the workflow.
* **Assigning:**  Assign the incident to a group and individual.
* **Investigating:**  Update work notes with investigation details.
* **Resolving:**
  * Update the state to "Resolved."
  * Provide resolution notes.
  * Set the resolution code (Solved Remotely, Solved by Workaround, etc.).
* **Closure**: Incident is closed manually or automatically.

### Incident Data Structure
* **Task Table (Parent):**  The base table for incidents and other tasks.  Contains common fields like Number, State, Short Description, etc.
* **Incident Table (Child):**  Inherits fields from the Task table and adds incident-specific fields (Caller, Category, etc.).
* **Incident Task Table (Child):**  Used for assigning sub-tasks to different teams.  One incident can have multiple incident tasks.
* **Data Types**: String, Integer, Reference, HTML, etc.
