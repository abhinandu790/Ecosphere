# EcoSphere X – Full Project Prompt

This repository stores the clean, ready-to-paste Codex / AI Builder prompt for the EcoSphere X sustainability and carbon-footprint tracking platform.

## Prompt

Build a full-stack web application called **EcoSphere X**, a sustainability and carbon-footprint tracking platform.

### Core Objective
Create a system that helps users track, understand, and reduce their carbon footprint through daily activities such as shopping, travel, energy use, food consumption, and waste management — with rewards and insights that encourage long-term sustainable habits.

### Core Features
1. **User System**
   - Authentication (JWT)
   - User profiles with eco-score, history, and badges
   - Role support: user, admin

2. **EcoScan (Core Module)**
   - Barcode / QR scan (products)
   - Manual upload of receipts
   - Detect product category, packaging type, local vs imported, and estimated carbon footprint
   - Predict expiry date (based on category)
   - Add to personal EcoCart timeline

3. **EcoCart (Impact Timeline)**
   - Chronological list of all eco actions
   - Shows carbon impact per item
   - Categorized by food, travel, energy, waste
   - Visual indicators (Low / Medium / High impact)

4. **EcoMiles – Transportation Tracking**
   - Log travel method: walking, cycling, bus, metro, car, EV
   - Distance-based carbon calculation
   - Optional map integration
   - Weekly and monthly reduction insights

5. **EcoWatt – Home Energy Tracker**
   - User inputs appliances + usage hours
   - Upload electricity bill for verification
   - Carbon estimation per appliance
   - Suggestions to reduce energy use

6. **EcoPlate – Food & Delivery Impact**
   - Track packaged food & online orders
   - Detect packaging type and delivery distance
   - Estimate CO₂ footprint
   - Suggest eco-friendly alternatives

7. **EcoCycle – Waste Management**
   - Expiry reminders (7d / 3d / expiry)
   - Disposal options: recycled, reused, composted, landfill
   - Score logic based on responsible disposal
   - Penalty for ignored or wasted items

8. **EcoScore & Rewards**
   - Dynamic carbon score
   - Weekly & monthly leaderboards
   - Badges (Zero Waste, Local Shopper, Eco Hero)
   - Reward system for consistency

9. **Community & Events**
   - Join local eco groups
   - Participate in cleanup drives
   - Earn group-based points
   - Community ranking dashboard

10. **Eco Alerts & Nudges**
    - Smart reminders (expiry, travel, waste)
    - Personalized behavior nudges
    - Sustainability tips based on history

### Architecture & Tech Stack
- **Frontend:** React / React Native (Expo), Tailwind / NativeWind UI, Zustand or Redux Toolkit, barcode scanner (Expo Camera), charts & dashboards
- **Backend:** Django + Django REST Framework, JWT authentication, carbon calculation engine, role-based access control
- **Database:** PostgreSQL (main), Redis (caching & queues)
- **Storage & Infra:** Cloudflare R2 (images, receipts), Cloudflare Workers (edge APIs), cron jobs for reminders & scoring

### Key Outcomes
- Converts sustainability into daily habits
- Makes carbon impact measurable and rewarding
- Encourages long-term behavioral change
- Scalable for campuses, cities, and enterprises

### Instruction to AI
Build this system modularly. Start with authentication → EcoScan → EcoScore → Dashboard → Community. Focus on clean APIs, reusable components, and scalable architecture.

If you need supplementary materials (short one-line prompt, database schema, API route structure, system architecture diagram, or a pitch-ready 1-page version), request them as needed.

## Mobile app implementation

This repository now includes a React Native (Expo) mobile application that implements the modules described above:

- **Authentication:** simple email-based sign-in with role toggle and JWT-ready flow placeholder.
- **EcoScan:** form to add scanned items with packaging/origin, expiry prediction, and carbon impact; writes to EcoCart and creates alerts.
- **EcoCart:** timeline of all eco actions with impact categories and badges for low/medium/high impact.
- **EcoMiles:** travel logger with distance-based CO₂ impact and savings vs. car.
- **EcoWatt:** appliance usage logger with carbon estimates and reduction suggestions.
- **EcoPlate:** delivery/food impact tracker with packaging types, delivery distance, and greener alternatives.
- **EcoCycle:** waste management with reminders, disposal options, penalties, and timeline.
- **EcoScore & Rewards:** dynamic ecoScore calculation, badges, leaderboard, and streak handling inside the state store.
- **Community & Events:** event listing and completion to earn points and badges.
- **Alerts & Nudges:** consolidated alert feed with severity levels.

### Getting started
1. Install dependencies: `npm install`
2. Run the app with Expo: `npm start` (or `npm run android` / `npm run ios` / `npm run web`).

> Note: Icons are placeholders; replace the files in `assets/` with your own branding.
