---
title: "CMDB Basics"
description: "Introduction to Configuration Items."
---

# CMDB Basics (Configuration Management Database)

## Introduction
Configuration Management is the process of identifying, controlling, and tracking all Configuration Items (CIs) in the IT environment, and their relationships. This provides an accurate, up-to-date view of the IT infrastructure.

## Key Concepts
* **Configuration Item (CI):**  Any component that needs to be managed in order to deliver IT services.  This includes hardware (servers, laptops, network devices), software (applications, operating systems), services, documentation, and even people (in some cases).
* **Configuration Management Database (CMDB):**  The database that stores information about CIs and their relationships.
* **CI Attributes:**  Properties of a CI (e.g., serial number, IP address, operating system version).
* **CI Relationships:**  Connections between CIs (e.g., a server *runs* an application, an application *depends on* a database).
* **Discovery:**  Automated tools that scan the network and identify CIs, populating the CMDB.
* **Baseline:**  A snapshot of the CMDB at a particular point in time, used for comparison and change tracking.

## Process Flow (Simplified)
1. **Identification:** CIs are identified and defined.
2. **Control:**  Changes to CIs are managed through Change Management.
3. **Status Accounting:**  The current status of CIs is tracked (e.g., "In Production," "In Maintenance," "Retired").
4. **Verification & Audit:**  Regular audits are performed to ensure the accuracy of the CMDB.

## Example
* **CI:** A web server (hardware CI).
* **Attributes:**  Server name, IP address, operating system, installed software, location, owner.
* **Relationships:**
  * The web server *hosts* a web application (software CI).
  * The web application *depends on* a database server (hardware CI).
  * The web server is *connected to* a network switch (hardware CI).
* **Discovery:** ServiceNow Discovery automatically finds the web server on the network and populates its attributes and relationships in the CMDB.
* **Change Management:**  If the web server's operating system needs to be upgraded, a change request is created, referencing the CI record in the CMDB.

## ServiceNow Features
* CMDB.
* Discovery.
* Service Mapping (visual representation of CI relationships).
* Dependency Views.
* Integration with other modules (Incident, Problem, Change, Request).
* Reporting and dashboards.

## Why is a CMDB Important?
A well-maintained CMDB is critical for ITSM:
* **Incident Management:** Helps quickly identify the root cause by showing what services depend on a broken CI.
* **Problem Management:** Facilitates trend analysis across identical hardware or software versions.
* **Change Management:** Allows CAB members to assess risk by visualizing impact analysis through Dependency Views.
