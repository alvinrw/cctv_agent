# PAMAgents v4.2 Final Locked Implementation Plan

This is the locked development candidate. It incorporates the final two strategic revisions and scale telemetry:
1. **Business Value Banner** on the Home page (under the Prompt Hero).
2. **Agent Lifecycle tracker** (Policy Created → Agent Deployed → Monitoring Active → Violation Detected → Validation Pending → Closed) consistently visible on Policy Studio, Validation Center, and Investigation Workspace.
3. **Updated scale telemetry** referencing "250 Existing Cameras Across Site / 25 Connected in Demo".

---

## Proposed Changes

### Core Pages & Layout

#### [MODIFY] [Dashboard.jsx](file:///c:/Local%20D/Galeri%20Belajar/Project/AstraNauts/cctv_agent/src/pages/Dashboard.jsx)
- **Side Menu Mapping**:
  - SYSTEM CONFIGURATION will feature two child menu items:
    - **Camera Mapping** (infra tab subview set to 'cameras')
    - **Geofence Mapping** (infra tab subview set to 'geofences')
- **State Synchronization**: Pass `infraSubTab` and `setInfraSubTab` states.

---

### Sub-Components

#### [MODIFY] [HomeTab.jsx](file:///c:/Local%20D/Galeri%20Belajar/Project/AstraNauts/cctv_agent/src/components/dashboard/HomeTab.jsx)
- **Business Value Banner (NEW)**:
  - Add directly beneath the Hero Prompt block.
  - Title: **Operational Impact Summary**
  - Content:
    - 5 Active AI Agents
    - Monitoring 25 Connected Cameras (from 250 Existing Cameras Across Site)
    - Protecting 10 Critical Zones
    - Estimated Detection Time: `15 Minutes → <30 Seconds`
    - Estimated Evidence Retrieval Time: `2 Hours → <1 Minute`
- **Existing Infrastructure Utilization**:
  - Display:
    - **250 Existing Cameras Across Site** (25 connected in demo)
    - **5 Active AI Agents**
    - **0 Additional Camera Required** (100% Existing Infrastructure Reused)

#### [MODIFY] [PolicyStudioTab.jsx](file:///c:/Local%20D/Galeri%20Belajar/Project/AstraNauts/cctv_agent/src/components/dashboard/PolicyStudioTab.jsx)
- **Agent Lifecycle Tracker**:
  - Render a visual tracker horizontal indicator:
    - `Policy Created ✓` (Active)
    - `Agent Deployed`
    - `Monitoring Active`
    - `Violation Detected`
    - `Validation Pending`
    - `Closed`
- **Agent Deployment Preview**:
  - Show the estimated business impact card.
  - Position the `[ Deploy Agent ]` button.

#### [MODIFY] [ValidationCenterTab.jsx](file:///c:/Local%20D/Galeri%20Belajar/Project/AstraNauts/cctv_agent/src/components/dashboard/ValidationCenterTab.jsx)
- **Agent Lifecycle Tracker**:
  - Render a visual tracker indicator sync'd with the current status (e.g. `Policy Created ✓` → `Agent Deployed ✓` → `Monitoring Active ✓` → `Violation Detected ✓` → `Validation Pending ✓`).
- **Validation CTA Buttons by Priority**:
  - High Priority: **"Validate & Dispatch"** and **"Mark False Positive"**.
  - Medium Priority: **"Validate"** and **"Dismiss"**.
  - Add **"Why This Matters"** consequence block for High Priority incidents.
- **Operational Response Matrix**:
  - Render response matrix table.

#### [MODIFY] [InvestigationCenterTab.jsx](file:///c:/Local%20D/Galeri%20Belajar/Project/AstraNauts/cctv_agent/src/components/dashboard/InvestigationCenterTab.jsx)
- **Agent Lifecycle Tracker**:
  - Render visual tracker showing the completed flow (e.g. up to `Closed` or `Validation Pending`).
- **Terminology**:
  - Rename to "Ask Operations Copilot".

#### [MODIFY] [AnalyticsTab.jsx](file:///c:/Local%20D/Galeri%20Belajar/Project/AstraNauts/cctv_agent/src/components/dashboard/AnalyticsTab.jsx)
- **Safety Risk Distribution**:
  - Horizontal stacked progress distribution bar.
- **Agent Effectiveness Ranking**:
  - List ranking agents: Crane Zone Safety Agent (92%), PPE Compliance Agent (89%), Haul Road Monitoring Agent (84%), Workshop Safety Agent (81%).

#### [MODIFY] [InfrastructureTab.jsx](file:///c:/Local%20D/Galeri%20Belajar/Project/AstraNauts/cctv_agent/src/components/dashboard/InfrastructureTab.jsx)
- Sync active tab with props.

---

## Verification Plan

### Compilation Check
- Run `npm run build` to verify standard Vite build.
- Run `npm run lint` to verify ESLint compliance.
