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

- **Authentication:** email sign-in with role toggle; eco profile tracks streak, badges, and ecoScore that updates when actions are logged.
- **EcoScan:** capture scanned items with packaging/origin chips, Cloudflare R2-backed receipt uploads, expiry prediction, and carbon impact; barcode/QR capture via Expo Barcode Scanner; writes to EcoCart and generates reminders.
- **EcoCart:** impact timeline with category filters, severity breakdown, and per-category totals across food, travel, energy, and waste.
- **EcoMiles:** transport logger with pre-set modes, distance-based CO₂ math, savings vs. car, auto-distance from GPS start/stop, map preview of start/end, and recent travel history.
- **EcoWatt:** appliance presets, runtime inputs, automatic carbon estimation, tailored tips, bill uploads to R2 for verification, and history for energy actions.
- **EcoPlate:** delivery/food tracker with packaging type chips, delivery distance impact math, alternatives, and history.
- **EcoCycle:** waste management with disposal/reminder chips, penalty-aware logging, mix breakdown, and timeline view.
- **EcoScore & Rewards:** dynamic ecoScore calculation, badge derivation (Zero Waste, Local Shopper, Eco Hero, Transit Champ), leaderboard, and streak handling inside the state store.
- **Community & Events:** event listing with completion actions to earn points and badges plus a snapshot of open events and badge count.
- **Alerts & Nudges:** consolidated alert feed with severity levels covering expiry, travel savings, and eco-tips.

### Tech stack alignment
- **Frontend:** Expo React Native with React Navigation, Zustand state, Expo Barcode Scanner for device captures.
- **Backend:** Django + DRF with JWT auth, PostgreSQL (Insforge-ready), Cloudflare R2 for receipts/media, Cloudflare Workers/API gateway edge, Celery + Cloudflare Cron for reminders and scoring, Requestly/Kiro for debugging, and hosting via DigitalOcean or Railway.

### Backend implementation (Django + DRF)

- **Auth:** JWT via `djangorestframework-simplejwt` with register/login/refresh and profile update endpoints.
- **Eco actions:** `EcoAction` model captures category, carbon footprint, savings, packaging, origin, disposal, expiry, receipts, and reminders. Badge derivation and ecoScore updates occur on create.
- **Reminders & alerts:** `Reminder` model links to actions with severity and delivery flags; Celery now emails due reminders so alerts reach users in addition to in-app flags.
- **Impact & score:** `/api/impact/` returns totals, category breakdown, severity counts, active reminders, and awarded badges.
- **Community:** `CommunityEvent` model with join/complete actions, host/participant tracking, points, and leaderboard feed via `/api/leaderboard/`.
- **Media:** `/api/uploads/receipt/` streams files directly into Cloudflare R2 using `boto3` so receipts/bills can be stored with EcoScan and EcoWatt entries.
- **Automation:** Celery workers (brokered by Redis) now ship with periodic beat schedules to send reminders and recompute scores/badges. Cloudflare Cron can ping these tasks in production.
- **PostgreSQL-first:** `DATABASE_URL` now defaults to the Insforge cluster (`dgztdaj5.us-west.database.insforge.app:5432/insforge`) with SSL required, and the custom user authenticates by unique email to match the mobile login flow.

### API surface (authenticated unless noted)
- `POST /api/auth/register/` (open) – create an account with role selection.
- `POST /api/auth/login/` & `POST /api/auth/refresh/` – obtain/refresh JWT tokens (email + password).
- `GET/PATCH /api/auth/profile/` – fetch or update profile meta/badges.
- `GET/POST /api/actions/` – list or log EcoScan/EcoCart/EcoMiles/EcoWatt/EcoPlate/EcoCycle actions.
- `GET/POST /api/reminders/` – manage expiry and nudge reminders.
- `GET /api/impact/` – totals, breakdown, severity, badges, reminders.
- `GET/POST /api/events/` & `POST /api/events/{id}/join/` & `POST /api/events/{id}/complete/` – community participation and rewards.
- `GET /api/leaderboard/` – top eco performers.
- `POST /api/uploads/receipt/` – upload receipts/bills to Cloudflare R2 and receive a URL for action logging.

### Running the backend locally
1. `cd backend`
2. `python -m venv .venv && source .venv/bin/activate`
3. `pip install -r requirements.txt`
4. Copy `.env.example` to `.env` and update Postgres/R2/Redis credentials (Insforge-ready).
5. `python manage.py migrate`
6. `python manage.py runserver 0.0.0.0:8000`
7. (optional) `celery -A ecosphere worker -B --loglevel=INFO` to process reminders and score recomputation.

#### Using Docker Compose for infrastructure (Postgres + Redis)
1. From the repo root: `docker compose up -d` (brings up Postgres and Redis with persisted volumes if you prefer local services).
2. For Insforge, export `DATABASE_URL=postgres://postgres:579eb4a662f601c461659893ccf99e21@dgztdaj5.us-west.database.insforge.app:5432/insforge?sslmode=require` and keep `CELERY_BROKER_URL=redis://localhost:6379/0` (or your managed Redis URL). SSL is required by Insforge.
3. Run migrations and start the Django server + Celery worker as above; the services will bind to either the compose network or the Insforge/Postgres endpoint.

### Running the mobile app
1. Install dependencies: `npm install`
2. Set `EXPO_PUBLIC_API_URL=http://localhost:8000` (or your deployed API gateway) so the client calls the Django backend.
3. Run the app with Expo: `npm start` (or `npm run android` / `npm run ios` / `npm run web`).

> Note: Icons are placeholders; replace the files in `assets/` with your own branding.
