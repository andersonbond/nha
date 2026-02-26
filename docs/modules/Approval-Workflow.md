# Approval Workflow

Approve or reject pending projects and programs.

## Description

The Approval Workflow module lists projects and programs that are pending approval. Authorized users can approve or reject each item; rejection can require a reason. Approved items are removed from the pending list and their status is updated in the system.

## Features

- **Pending projects** – List of projects with `approval_status = pending_approval`; show code, name, program, cost, region, etc.
- **Pending programs** – List of programs with `approval_status = pending_approval`; show program ID, MC ref, interest rate, max term.
- **Approve** – One-click approve for a project or program; updates status and removes from pending list.
- **Reject** – Reject with optional reason; updates status and removes from pending list.
- **Refresh** – Reload pending lists after actions.
