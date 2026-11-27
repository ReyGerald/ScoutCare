# 🇵🇭 ScoutCare PH — Philippine Boy Scout Camping & First-Aid App

**ScoutCare PH** is a mobile-first, offline-capable Progressive Web Application (PWA) designed specifically for **Boy Scouts camping in the Philippines**. Built with a **Glassmorphism** outdoor UI and an **MVVM-inspired Clean Architecture** (Vanilla ES6+ JavaScript, zero build dependencies), it equips Scouts, Parents/Guardians, and Scoutmasters to stay *"Laging Handa"* (Be Prepared).

---

## 🌟 Key Features

### 1. ⛺ Camping Preparation Dashboard
- **Preparation Overview**: Tracks total tasks, completed tasks, remaining tasks, and overall preparation percentage.
- **Readiness Breakdown**: Visual progress bars for First Aid Kit readiness, Camping Equipment readiness, and First-Aid Lessons completed.
- **Campout Countdown & PAGASA Signal**: Live countdown to the upcoming campout date with PAGASA Tropical Cyclone Wind Signal (Signals 1–4) advisories.
- **Important Reminders**: Surfaces expired kit items, shopping list shortages, and high-priority incomplete tasks.

### 2. 🩹 Philippine First-Aid Kit & Inventory System
- **Philippine Boy Scout Kit**:
  - *Wound Care & Bandaging*: Band-Aid/Nexcare, sterile gauze 3×3 & 4×4, Micropore tape, roller gauze, triangular cravats, elastic bandage, 70% isopropyl alcohol swabs, **Povidone-Iodine (Betadine 10%)**, **NaCl 0.9% wound saline**, blunt-tip shears, tweezers, nitrile gloves, CPR face shield, moleskin.
  - *Medicines & Health Supplies (Camp Medical Officer Supervised)*: **Paracetamol (Biogesic/Tempra)**, **ORS (Hydrite/Oranz)**, **Cetirizine (Allerta)**, **Antacid (Kremil-S)**, **Motion Sickness (Bonamine)**, **Calamine Lotion**, **Hydrocortisone 1%**. Includes storage instructions, age limits, allergy warnings, parent consent, and medical officer approval status. *(Explicitly excludes Aspirin for minors and routine antibiotics.)*
  - *Philippine Outdoor & Tropical Supplies*: DEET mosquito repellent, SPF 30+ sunscreen, digital thermometer, instant cold pack, Mylar blanket, 70% hand sanitizer, water purification tablets, emergency whistle.
- **Inventory & Shopping List**: Search, category filter, sort by expiration date, status badges (*Missing, Need to Buy, Available, Complete, Expiring Soon, Expired*), and an automated **Shopping List** with one-tap **Mark Purchased**.

### 3. 💊 Medicine Reminders & Overdose Caution System
- **5-Point Overdose / "Too Much Dose" Guardrails**:
  1. Bilingual top safety banner (*"Never take a double dose / Huwag mag-double dose"*).
  2. Missed dose confirmation modal warning against doubling up.
  3. Skip dose form warning to alert guardians/leaders if feeling unwell.
  4. Per-medicine maximum daily dose & minimum hours between doses.
  5. Dedicated **Suspected Overdose** SOS card with signs & DOH 1555 / Red Cross 143 actions.
- **Privacy Firewall**: Scoutmasters cannot view private prescription schedules or dose logs.

### 4. 🌡️ Philippine Camp Safety & Heat Index
- **PAGASA Heat Index Calculator**: Computes real Heat Index (°C) from air temperature and relative humidity with Caution / Extreme Caution / Danger / Extreme Danger color bands.
- **Philippine Hazard Cards**: Dengue & mosquitoes, Leptospirosis, Rabies (15-min soap wash + hospital PEP), Leech (*limatik*) exposure, Jellyfish stings, Snakebite safety, Thunderstorm 30-30 rule, and Food/Water safety.

### 5. ✅ Camping To-Do List & Ten Essentials
- **52 Preset Tasks** across 4 categories (*First Aid Preparation, Camping Equipment, Food and Water, Scout Training and Preparation*) with Add/Edit/Delete, deadlines, assignees, notes, and auto-save.
- **Camping Ten Essentials**: Dedicated illustrated cards tailored for Philippine mountains, forests, and coastal camps.

### 6. ▶️ First-Aid Lessons & YouTube Learning Resources
- **10 Offline Lessons & Quizzes**: Cuts, Severe Bleeding, Burns, Nosebleeds, Sprains/Fractures, Heatstroke, Hypothermia, Choking, Bites/Stings/Rabies, and CPR/AED Awareness.
- **YouTube Training Library**: Curated video cards with watched tracking and a clear disclaimer that CPR must be practiced hands-on with a qualified instructor using a CPR manikin.

### 7. 🗺️ Visayas Scout Camping & Jamboree Expedition Planner
- **48 Main Destinations Across 6 Provinces**: Cebu (8), Bohol (8), Antique (8), Negros Oriental (8), Siquijor (8), and Samar (8).
- **30 Candidate Scout Jamboree Venues**: 15 Bohol, 8 Cebu, 7 Other Visayas evaluated for 500 to 5,000+ Scouts.
- **100% Offline Graceful Fallback**: Interactive vector SVG map and directory book that operate seamlessly with zero cell service in remote mountain valleys.
- **One-Tap "Set as My Upcoming Campout"**: Instantly synchronizes destination, municipal hazard alerts, and tailored checklists to the Camping Prep Dashboard.
- **Philippine Permits & Clearances Guide**: Clearances [A] BSP/GSP Council, [B] LGU & DepEd, [C] DENR/PAMB, and [D] Landowners.
- **Medical Evacuation Directory**: Nearest Level 1/2/3 hospital distance (km) and driving time, plus MDRRMO contacts.
- **Transportation Budget Calculator**: Ceres bus, 14-seater van convoys, equipment elf trucks, and RoRo ferry expenses.

### 8. 🌐 Bilingual (English / Filipino) & Mobile-First
- **ENG ↔ FIL Toggle**: Instant switching between English and Filipino/Tagalog across key navigation and safety warnings.
- **Android Mobile Compatibility**: Native full-viewport layout on phones (`320px–520px`), `44px+` touch targets, `15px+` readable typography, and zero horizontal overflow.

---

## 🏗️ Project Architecture (MVVM-Inspired Clean Architecture)

```
ScoutCare/
├── index.html
├── styles.css              # Glassmorphism UI + Light/Dark/System themes
├── manifest.json           # PWA manifest (en-PH)
├── sw.js                   # Offline Service Worker
├── vercel.json             # Vercel static deployment config
├── .gitignore
├── README.md
└── js/
    ├── storage.js          # StorageService (LocalStorage persistence)
    ├── i18n.js             # English & Filipino localization dictionary
    ├── state.js            # Model layer (StateManager & PH seed data)
    ├── app.js              # Core Router, AudioEngine, Theme & Toast controller
    ├── tests.js            # Automated Unit & Safety Test Suite
    └── viewmodels/
        ├── DashboardVM.js  # Camping Prep Dashboard
        ├── KitVM.js        # First-Aid Kit Inventory & Shopping List
        ├── FirstAidVM.js   # 10 Offline Lessons, Quizzes & Badges
        ├── MedicineVM.js   # Medicine Reminders & Overdose Guardrails
        ├── EmergencyVM.js  # PH SOS (911, 143, 1555, 8911) & DRABC
        ├── CampingVM.js    # PAGASA Signals, Heat Index & PH Hazards
        ├── TodoVM.js       # 4-Category Camping To-Do List
        ├── EssentialsVM.js # Camping Ten Essentials
        ├── LearningVM.js   # YouTube Learning Resources
        ├── IncidentsVM.js  # Incident Report Form & Log
        └── ProfileVM.js    # Redesigned Profile & Settings
```

---

## 🚀 Running Locally

1. **Windows One-Click**: Double-click `start.bat` to launch the built-in PowerShell server at `http://localhost:8080/`.
2. **PowerShell**:
   ```powershell
   cd c:\Users\Gerald\Desktop\ScoutCare
   powershell -ExecutionPolicy Bypass -File .\server.ps1
   ```
3. **Direct Browser**: Open `index.html` in Chrome, Brave, or Edge.

---

## 🐙 GitHub & ▲ Vercel Deployment

### Push Updates to GitHub
```bash
cd c:\Users\Gerald\Desktop\ScoutCare
git add .
git commit -m "feat: Visayas Scout Expedition Map & 78 Destinations Planner"
git push origin main
```

### Deploy to Vercel
1. Go to [vercel.com](https://vercel.com) → **Add New Project** → Import your `ReyGerald/ScoutCare` repository.
2. **Framework Preset**: `Other` (Pure HTML/CSS/JS — no build command needed).
3. Click **Deploy**. Vercel will host your website publicly with free SSL and PWA offline support!

---

## ⚖️ Medical & Scouting Disclaimers
- **Educational & Reminder Tool Only**: ScoutCare PH does not diagnose conditions, prescribe medicines, or replace professional healthcare. Always consult a parent, guardian, Camp Medical Officer, or licensed physician.
- **No Unverified Official Claims**: Training links and first-aid guides are provided as educational references and do not substitute for hands-on certification (e.g., Philippine Red Cross CPR manikin training).
