---
title: "Request Management"
description: "Service catalogs and request fulfillment."
---

# ServiceNow Request Management and Service Catalog

## Introduction
This module covers Request Management within ServiceNow, using the example of an employee requesting a laptop.

## What is Request Management?
* **Request:** A formal ask for something (e.g., a laptop, software, access).  It's different from an Incident (which is about something broken).
* **Request Management:** The process of handling these requests through a defined system (like a company portal).
* **Key Concepts:**
  * **Request (REQ):**  The overall request (e.g., "I need a laptop").  This is the top-level record.
  * **Requested Item (RITM):**  A specific item within the request (e.g., "Dell Laptop Model X").  There can be multiple RITMs under one REQ.
  * **Task (SCTASK):**  Work assigned to fulfill a specific part of the RITM (e.g., "Configure laptop," "Ship laptop").
  * **Fulfillment:**  Providing the requested service or item.  This is the key difference from Incident Management (which focuses on *resolution*).

## Service Portal
* The user-facing interface where end-users can submit requests.
* It's like a menu of available services and items.

## Service Catalog Structure
* **Catalog:** The overall collection of available services and items.  Think of it like a restaurant's entire menu. There can be multiple catalogs (e.g., "Service Catalog," "Technical Catalog").
* **Category:**  A grouping of related items within a catalog (e.g., "Hardware," "Software," "Desktops," "Laptops").  Like sections in a menu (Appetizers, Main Courses).
* **Catalog Item:**  A specific, requestable item (e.g., "Dell Latitude 5530 Laptop").  Like a specific dish on the menu.

## Creating a Catalog Item (Demo)
The video demonstrates creating a catalog item for "Admin Training":
1. **Maintain Catalogs:**
   * Create a new Catalog (e.g., "Training").  This involves setting a title, manager, description, etc.
   * Associate the Catalog with a Service Portal (so it's visible to users).
2. **Maintain Categories:**
   * Create a new Category (e.g., "Admin Training") within the "Training" Catalog.
   * Add an image to the Category (for visual appeal on the portal).
3. **Maintain Items:**
   * Create a new Catalog Item (e.g., "ServiceNow Admin Training").
   * Specify the Catalog and Category.
   * Add a short description, description, and potentially a picture.
4. **Variables:**
   * Add variables to gather information from the user (e.g., "Preferred Training Date," "Skill Level" (Beginner, Advanced)).
   * Variable Types: Multiple Choice, Select Box, Single Line Text, etc.
   * Variable Order:  Determines the order in which variables appear on the form.
5. **Price**
   * If the item has a price, it can be set, otherwise the price can be set to zero.
6. **Process Engine (Workflow):**
   * *Crucially*, a workflow is attached to the catalog item to define the fulfillment process.  This is what happens *after* the user submits the request.

## Workflow (Demo)
The video demonstrates creating a workflow for the "ServiceNow Admin Training" item:
1. **Workflow Editor:**
   * Access the Workflow Editor (search for "Workflow Editor" in the navigator).
   * Create a new workflow.
   * Specify the table: `sc_req_item` (Requested Item). This is *essential* – the workflow runs on the RITM record.
2. **Workflow Activities:**
   * **Approval - User:**  Adds an approval step.  The demo sets the approver to "System Administrator."
   * **Catalog Task:**  Creates a task (SCTASK) to be completed as part of fulfillment (e.g., "Schedule Training," "Provide Training Materials").
3. **Workflow Logic:**
   * Connect the activities (Begin -> Approval -> Task -> End).
   * Conditions can be added (e.g., only require approval if the request is over a certain amount).
4. **Publish:**  *Crucially*, the workflow must be *published* to be active.

## Request Fulfillment Process (Demo)
The video shows the end-to-end process:
1. **User Submits Request:**  The user goes to the Service Portal, finds the "ServiceNow Admin Training" item, fills out the variables, and submits the request.
2. **Request and RITM Creation:**  A Request (REQ) and Requested Item (RITM) are created.
3. **Approval:**  The workflow triggers an approval request to the System Administrator.
4. **Task Creation:**  Once approved, the workflow creates a Catalog Task (SCTASK).
5. **Task Completion:**  The assigned person completes the task (e.g., schedules the training).
6. **Request Fulfillment:**  Once all tasks are complete, the request is considered fulfilled.
7. **Closure:** The RITM and REQ are closed.

## Key Points and Best Practices
* **Workflow Association:**  Every catalog item *must* have a workflow to define the fulfillment process.  Without a workflow, the request will just sit there.
* **Table Selection:**  When creating a workflow, ensure it's associated with the `sc_req_item` table.
* **Publish Workflow:**  Workflows must be published to be active.
* **Variable Order:**  Carefully consider the order of variables on the catalog item form.
* **Testing:**  Thoroughly test the catalog item and workflow to ensure it functions as expected.
* **User Experience:**  Design the Service Catalog to be user-friendly and intuitive.
* **Request vs. Incident:** Always keep in mind that a *request* is for something new, while an *incident* is for something broken.
* **Default Workflow**: ServiceNow comes with a default workflow, which can be used, or custom workflows can be created.
