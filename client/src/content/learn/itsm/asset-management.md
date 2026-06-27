---
title: "Asset Management"
description: "Hardware and software asset tracking."
---

# Asset Management

## Introduction
ServiceNow IT Asset Management (ITAM) focuses on tracking the financial, contractual, and physical lifecycle of an IT asset. While CMDB tracks operational information and relationships (Configuration Items), Asset Management focuses on cost, ownership, and contracts. 

## Key Concepts
* **Asset:** Any piece of IT equipment, software, or license that has financial value and needs to be tracked.
* **Hardware Asset Management (HAM):** Managing physical assets like laptops, servers, routers, and monitors throughout their lifecycle.
* **Software Asset Management (SAM):** Managing software licenses, entitlements, and usage to optimize spend and maintain compliance.
* **Asset Lifecycle:** The stages an asset goes through: Procurement -> Receiving -> Deployment -> Maintenance -> Retirement/Disposal.
* **Model Categories:** Used to classify assets and determine whether an asset should also have a corresponding Configuration Item (CI) in the CMDB.

## Asset vs. Configuration Item (CI)
* **Asset:** Focuses on the financial side (e.g., purchase date, cost, warranty expiration, vendor, assigned user).
* **CI:** Focuses on the operational side (e.g., IP address, OS version, up/down status, relationships to other CIs).
* **The Connection:** In ServiceNow, when you create an Asset of a specific category (e.g., a Server), the system can automatically create a corresponding CI record, linking the two. Updates to specific fields (like State or Assigned To) can sync between the Asset and CI records.

## Process Flow (Simplified Lifecycle)
1. **Request & Procurement:** A user requests a new laptop via the Service Catalog. It goes through approval and procurement (purchasing).
2. **Receiving:** The laptop arrives at the IT stockroom. It is received in ServiceNow and an Asset record is generated (State: In Stock).
3. **Deployment:** The laptop is configured and handed over to the user. The Asset record is updated (State: In Use, Assigned To: User). A corresponding CI record tracks its operational status.
4. **Maintenance & Upgrades:** The asset is monitored, and repairs or upgrades are documented.
5. **Retirement:** The laptop reaches the end of its useful life. The data is wiped, and the hardware is disposed of. The Asset record is updated (State: Retired).

## ServiceNow ITAM Features
* **Asset Workspace:** A centralized dashboard for asset managers to view the health, lifecycle, and financial metrics of assets.
* **Hardware Model Normalization:** Standardizes manufacturer names and model numbers using the ServiceNow content library.
* **Stockrooms:** Managing inventory levels across different physical locations.
* **Contract Management:** Tracking lease, warranty, and maintenance contracts linked to assets.
* **Mobile App:** Scanning barcodes and updating asset records directly from a mobile device.

## Business Benefits
* **Cost Savings:** Avoiding unnecessary hardware purchases by reusing stockroom inventory and reclaiming unused software licenses.
* **Compliance:** Ensuring software usage does not exceed purchased license entitlements (avoiding vendor audit fines).
* **Visibility:** Knowing exactly what assets the organization owns, where they are, and who is using them.
