// ScoutCare PH — Central Model Layer (MVVM State Management)
const BSP_RANKS = [
  'Scout Candidate',
  'Tenderfoot Scout',
  'Second Class Scout',
  'First Class Scout',
  'Star Scout',
  'Life Scout',
  'Eagle Scout'
];

const PH_CAMPING_LOCATIONS = [
  { name: 'Mt. Batulao, Batangas', notes: 'Open trail, high heat/sun exposure, bring extra water & SPF 30+.' },
  { name: 'Mt. Pulag, Benguet', notes: 'Cold high-altitude climate, hypothermia risk, bring thermal layers & Mylar blanket.' },
  { name: 'Mt. Apo, Davao', notes: 'Humid rainforest, leech exposure, heavy rain gear & water purification needed.' },
  { name: 'Hundred Islands, Pangasinan', notes: 'Coastal camp, jellyfish/sea urchin risk, sun protection & hydration critical.' },
  { name: 'Baguio Camp John Hay / Burnham', notes: 'Cool pine forest, occasional rain, standard troop campout.' },
  { name: 'Tanay / Sierra Madre Foothills, Rizal', notes: 'Tropical forest, mosquitoes/dengue prevention, rainy afternoon squalls.' }
];

const DEFAULT_TODOS = [
  // 1. First Aid Preparation (13)
  { id: 'td-fa-1', category: 'First Aid Preparation', title: 'Prepare the First Aid Kit', completed: true, priority: 'High', assignee: 'Self', deadline: '2026-12-02', notes: 'Inspect all pouches before packing.' },
  { id: 'td-fa-2', category: 'First Aid Preparation', title: 'Buy missing wound-care supplies', completed: false, priority: 'High', assignee: 'Guardian', deadline: '2026-12-03', notes: 'Check Shopping List in Kit tab.' },
  { id: 'td-fa-3', category: 'First Aid Preparation', title: 'Review medicine inventory', completed: false, priority: 'High', assignee: 'Guardian', deadline: '2026-12-03', notes: 'Confirm Camp Medical Officer approval.' },
  { id: 'td-fa-4', category: 'First Aid Preparation', title: 'Check expiration dates', completed: false, priority: 'High', assignee: 'Self', deadline: '2026-12-02', notes: 'Replace any expired Betadine or Biogesic.' },
  { id: 'td-fa-5', category: 'First Aid Preparation', title: 'Prepare personal medicines', completed: true, priority: 'High', assignee: 'Guardian', deadline: '2026-12-04', notes: 'Salbutamol inhaler & Allerta.' },
  { id: 'td-fa-6', category: 'First Aid Preparation', title: 'Prepare emergency contact list', completed: true, priority: 'High', assignee: 'Guardian', deadline: '2026-12-01', notes: 'Include 911, Red Cross 143, and parent mobile.' },
  { id: 'td-fa-7', category: 'First Aid Preparation', title: 'Check allergies and medical information', completed: true, priority: 'High', assignee: 'Guardian', deadline: '2026-12-01', notes: 'Sulfa drugs & shellfish allergy noted.' },
  { id: 'td-fa-8', category: 'First Aid Preparation', title: 'Prepare CPR face shield', completed: true, priority: 'Medium', assignee: 'Self', deadline: '2026-12-02', notes: '' },
  { id: 'td-fa-9', category: 'First Aid Preparation', title: 'Prepare mosquito repellent (DEET)', completed: false, priority: 'High', assignee: 'Self', deadline: '2026-12-03', notes: 'Essential for dengue prevention.' },
  { id: 'td-fa-10', category: 'First Aid Preparation', title: 'Prepare sunscreen SPF 30+', completed: true, priority: 'Medium', assignee: 'Self', deadline: '2026-12-03', notes: '' },
  { id: 'td-fa-11', category: 'First Aid Preparation', title: 'Prepare Oral Rehydration Salts (ORS)', completed: false, priority: 'High', assignee: 'Guardian', deadline: '2026-12-03', notes: 'Hydrite sachets for tropical heat.' },
  { id: 'td-fa-12', category: 'First Aid Preparation', title: 'Prepare digital thermometer', completed: true, priority: 'Medium', assignee: 'Self', deadline: '2026-12-03', notes: '' },
  { id: 'td-fa-13', category: 'First Aid Preparation', title: 'Prepare emergency Mylar blanket', completed: true, priority: 'Medium', assignee: 'Self', deadline: '2026-12-03', notes: '' },

  // 2. Camping Equipment (20)
  { id: 'td-eq-1', category: 'Camping Equipment', title: 'Backpack (water-resistant / rain cover)', completed: true, priority: 'High', assignee: 'Self', deadline: '2026-12-04', notes: '' },
  { id: 'td-eq-2', category: 'Camping Equipment', title: 'Tent (stakes & rainfly checked)', completed: true, priority: 'High', assignee: 'Leader', deadline: '2026-12-04', notes: 'Patrol tent inspection.' },
  { id: 'td-eq-3', category: 'Camping Equipment', title: 'Sleeping bag or blanket', completed: true, priority: 'Medium', assignee: 'Self', deadline: '2026-12-04', notes: '' },
  { id: 'td-eq-4', category: 'Camping Equipment', title: 'Sleeping mat / ground pad', completed: false, priority: 'Medium', assignee: 'Self', deadline: '2026-12-04', notes: '' },
  { id: 'td-eq-5', category: 'Camping Equipment', title: 'Raincoat / Rain poncho', completed: true, priority: 'High', assignee: 'Self', deadline: '2026-12-04', notes: 'PH afternoon squalls.' },
  { id: 'td-eq-6', category: 'Camping Equipment', title: 'Extra clothing (quick-dry shirts)', completed: true, priority: 'Medium', assignee: 'Self', deadline: '2026-12-04', notes: '' },
  { id: 'td-eq-7', category: 'Camping Equipment', title: 'Extra socks (at least 3 pairs)', completed: false, priority: 'Medium', assignee: 'Self', deadline: '2026-12-04', notes: 'Prevents blisters.' },
  { id: 'td-eq-8', category: 'Camping Equipment', title: 'Flashlight or headlamp', completed: true, priority: 'High', assignee: 'Self', deadline: '2026-12-04', notes: '' },
  { id: 'td-eq-9', category: 'Camping Equipment', title: 'Extra batteries', completed: false, priority: 'Medium', assignee: 'Self', deadline: '2026-12-04', notes: '' },
  { id: 'td-eq-10', category: 'Camping Equipment', title: 'Emergency whistle', completed: true, priority: 'High', assignee: 'Self', deadline: '2026-12-04', notes: '' },
  { id: 'td-eq-11', category: 'Camping Equipment', title: 'Water bottle (at least 2 Liters)', completed: true, priority: 'High', assignee: 'Self', deadline: '2026-12-04', notes: '' },
  { id: 'td-eq-12', category: 'Camping Equipment', title: 'Mess kit', completed: true, priority: 'Medium', assignee: 'Self', deadline: '2026-12-04', notes: '' },
  { id: 'td-eq-13', category: 'Camping Equipment', title: 'Eating utensils (spoon, fork)', completed: true, priority: 'Medium', assignee: 'Self', deadline: '2026-12-04', notes: '' },
  { id: 'td-eq-14', category: 'Camping Equipment', title: 'Toiletries (soap, toothbrush, tissue)', completed: false, priority: 'Medium', assignee: 'Self', deadline: '2026-12-04', notes: '' },
  { id: 'td-eq-15', category: 'Camping Equipment', title: 'Quick-dry towel', completed: true, priority: 'Low', assignee: 'Self', deadline: '2026-12-04', notes: '' },
  { id: 'td-eq-16', category: 'Camping Equipment', title: 'BSP Scout uniform & neckerchief', completed: true, priority: 'High', assignee: 'Self', deadline: '2026-12-04', notes: '' },
  { id: 'td-eq-17', category: 'Camping Equipment', title: 'Scout notebook', completed: true, priority: 'Low', assignee: 'Self', deadline: '2026-12-04', notes: '' },
  { id: 'td-eq-18', category: 'Camping Equipment', title: 'Pen / pencil', completed: true, priority: 'Low', assignee: 'Self', deadline: '2026-12-04', notes: '' },
  { id: 'td-eq-19', category: 'Camping Equipment', title: 'Trash bags (Leave No Trace)', completed: false, priority: 'Medium', assignee: 'Self', deadline: '2026-12-04', notes: '' },
  { id: 'td-eq-20', category: 'Camping Equipment', title: 'Emergency shelter tarp & paracord', completed: false, priority: 'Medium', assignee: 'Leader', deadline: '2026-12-04', notes: '' },

  // 3. Food and Water (8)
  { id: 'td-fw-1', category: 'Food and Water', title: 'Prepare patrol meals menu', completed: true, priority: 'High', assignee: 'Leader', deadline: '2026-12-03', notes: '' },
  { id: 'td-fw-2', category: 'Food and Water', title: 'Prepare emergency trail snacks', completed: false, priority: 'Medium', assignee: 'Self', deadline: '2026-12-04', notes: 'Trail mix, crackers, energy bars.' },
  { id: 'td-fw-3', category: 'Food and Water', title: 'Prepare clean drinking water', completed: false, priority: 'High', assignee: 'Self', deadline: '2026-12-05', notes: 'Fill bottles morning of departure.' },
  { id: 'td-fw-4', category: 'Food and Water', title: 'Prepare water purification supplies', completed: true, priority: 'High', assignee: 'Leader', deadline: '2026-12-04', notes: 'Purification tablets / filter.' },
  { id: 'td-fw-5', category: 'Food and Water', title: 'Check food storage containers', completed: true, priority: 'Medium', assignee: 'Self', deadline: '2026-12-04', notes: 'Airtight & insect-proof.' },
  { id: 'td-fw-6', category: 'Food and Water', title: 'Pack insulated food coolers', completed: false, priority: 'Medium', assignee: 'Leader', deadline: '2026-12-05', notes: 'Prevent spoilage in PH heat.' },
  { id: 'td-fw-7', category: 'Food and Water', title: 'Prepare cooking equipment & stove', completed: true, priority: 'High', assignee: 'Leader', deadline: '2026-12-04', notes: '' },
  { id: 'td-fw-8', category: 'Food and Water', title: 'Prepare safe food-handling supplies', completed: false, priority: 'Medium', assignee: 'Leader', deadline: '2026-12-04', notes: 'Soap, sanitizer, clean sponge.' },

  // 4. Scout Training and Preparation (11)
  { id: 'td-tr-1', category: 'Scout Training and Preparation', title: 'Review First Aid lessons', completed: true, priority: 'High', assignee: 'Self', deadline: '2026-12-03', notes: '' },
  { id: 'td-tr-2', category: 'Scout Training and Preparation', title: 'Review CPR & AED awareness', completed: false, priority: 'High', assignee: 'Self', deadline: '2026-12-03', notes: '' },
  { id: 'td-tr-3', category: 'Scout Training and Preparation', title: 'Review Camping Ten Essentials', completed: true, priority: 'High', assignee: 'Self', deadline: '2026-12-02', notes: '' },
  { id: 'td-tr-4', category: 'Scout Training and Preparation', title: 'Practice bandaging & triangular sling', completed: false, priority: 'Medium', assignee: 'Self', deadline: '2026-12-03', notes: '' },
  { id: 'td-tr-5', category: 'Scout Training and Preparation', title: 'Practice emergency whistle signaling (3 blasts)', completed: true, priority: 'Medium', assignee: 'Self', deadline: '2026-12-02', notes: '' },
  { id: 'td-tr-6', category: 'Scout Training and Preparation', title: 'Learn proper DRABC emergency response', completed: false, priority: 'High', assignee: 'Self', deadline: '2026-12-03', notes: '' },
  { id: 'td-tr-7', category: 'Scout Training and Preparation', title: 'Review heat-related illness prevention', completed: false, priority: 'High', assignee: 'Self', deadline: '2026-12-03', notes: 'Check PH Heat Index.' },
  { id: 'td-tr-8', category: 'Scout Training and Preparation', title: 'Review water & leptospirosis safety', completed: false, priority: 'High', assignee: 'Self', deadline: '2026-12-03', notes: '' },
  { id: 'td-tr-9', category: 'Scout Training and Preparation', title: 'Review campsite safety & buddy system', completed: true, priority: 'Medium', assignee: 'Self', deadline: '2026-12-03', notes: '' },
  { id: 'td-tr-10', category: 'Scout Training and Preparation', title: 'Check camping location & PAGASA weather', completed: false, priority: 'High', assignee: 'Leader', deadline: '2026-12-04', notes: '' },
  { id: 'td-tr-11', category: 'Scout Training and Preparation', title: 'Review emergency evacuation plan', completed: false, priority: 'High', assignee: 'Leader', deadline: '2026-12-04', notes: '' }
];

const DEFAULT_STATE = {
  currentUser: {
    id: 'scout-1',
    name: 'Juan dela Cruz',
    username: 'juandelacruz_bsp',
    email: 'juan.delacruz@scoutph.org',
    phone: '09171234567',
    role: 'scout', // 'scout' | 'guardian' | 'leader'
    troop: 'Troop 101-BSP, Quezon City Council',
    patrol: 'Kalayaan Patrol',
    rank: 'Second Class Scout',
    guardianId: 'guardian-1',
    guardianName: 'Maria dela Cruz',
    guardianPhone: '09171234567',
    guardianPin: '2468',
    emergencyContactPhone: '09171234567',
    medOfficerName: 'Dr. Elena Reyes (Camp Medical Officer)',
    allergies: 'Sulfa drugs, Shellfish',
    bloodType: 'B+',
    avatar: '⚜️'
  },
  users: [
    {
      id: 'scout-1',
      name: 'Juan dela Cruz',
      username: 'juandelacruz_bsp',
      email: 'juan.delacruz@scoutph.org',
      phone: '09171234567',
      role: 'scout',
      troop: 'Troop 101-BSP, Quezon City Council',
      patrol: 'Kalayaan Patrol',
      rank: 'Second Class Scout',
      guardianId: 'guardian-1',
      guardianName: 'Maria dela Cruz',
      guardianPhone: '09171234567',
      guardianPin: '2468',
      emergencyContactPhone: '09171234567',
      medOfficerName: 'Dr. Elena Reyes (Camp Medical Officer)',
      allergies: 'Sulfa drugs, Shellfish',
      bloodType: 'B+',
      avatar: '⚜️'
    },
    {
      id: 'guardian-1',
      name: 'Maria dela Cruz',
      username: 'mariadelacruz',
      email: 'maria.delacruz@gmail.com',
      phone: '09171234567',
      role: 'guardian',
      troop: 'Troop 101-BSP Parents Committee',
      patrol: 'Parent / Legal Guardian',
      rank: 'Authorized Caregiver',
      guardianCode: 'BSP-1014',
      guardianPin: '2468',
      linkedScouts: ['scout-1'],
      avatar: '🛡️'
    },
    {
      id: 'leader-1',
      name: 'Kuya Roel Santos',
      username: 'kuyaroel_sm',
      email: 'roel.santos@scoutph.org',
      phone: '09281234567',
      role: 'leader',
      troop: 'Troop 101-BSP, Quezon City Council',
      patrol: 'Troop Committee',
      rank: 'Senior Scoutmaster',
      leaderPin: '1936', // BSP Chartered 1936
      avatar: '🧭'
    }
  ],
  campoutInfo: {
    title: 'Tanay Sierra Madre Weekend Camp',
    date: '2026-12-06',
    location: 'Tanay / Sierra Madre Foothills, Rizal',
    pagasaSignal: 0 // 0 = No signal, 1..4 = Signal #
  },
  kitItems: [
    // A. Wound Care and Bandaging
    {
      id: 'kit-ph-1',
      name: 'Adhesive Bandages (Band-Aid / Nexcare Assorted)',
      category: 'Wound Care and Bandaging',
      requiredQuantity: 30,
      quantity: 25,
      minQuantity: 20,
      unit: 'pcs',
      expiryDate: '2028-06-30',
      location: 'Front Zipper Pouch',
      purpose: 'Protects minor cuts, scrapes, and blisters from tropical dirt and bacteria.',
      howToUse: 'Clean wound with saline or potable water, pat dry, and apply without touching the sterile pad.',
      purchased: false,
      preset: 'all'
    },
    {
      id: 'kit-ph-2',
      name: 'Sterile Gauze Pads (3x3 inch)',
      category: 'Wound Care and Bandaging',
      requiredQuantity: 10,
      quantity: 8,
      minQuantity: 6,
      unit: 'packs',
      expiryDate: '2028-05-15',
      location: 'Main Medical Compartment',
      purpose: 'Absorbs blood and covers medium abrasions and lacerations.',
      howToUse: 'Place directly over wound, apply steady pressure if bleeding, secure with tape or roller gauze.',
      purchased: false,
      preset: 'all'
    },
    {
      id: 'kit-ph-3',
      name: 'Sterile Dressing Pads (4x4 inch)',
      category: 'Wound Care and Bandaging',
      requiredQuantity: 6,
      quantity: 4,
      minQuantity: 4,
      unit: 'packs',
      expiryDate: '2028-04-20',
      location: 'Main Medical Compartment',
      purpose: 'Covers larger trail wounds and cushions injured tissue.',
      howToUse: 'Apply sterile side down and wrap gently with roller gauze.',
      purchased: false,
      preset: 'camping'
    },
    {
      id: 'kit-ph-4',
      name: 'Medical Adhesive Tape (Micropore)',
      category: 'Wound Care and Bandaging',
      requiredQuantity: 2,
      quantity: 2,
      minQuantity: 1,
      unit: 'rolls',
      expiryDate: '2028-01-01',
      location: 'Side Mesh Pocket',
      purpose: 'Hypoallergenic tape to secure gauze pads and bandages.',
      howToUse: 'Apply to clean, dry skin around dressing edges.',
      purchased: false,
      preset: 'all'
    },
    {
      id: 'kit-ph-5',
      name: 'Roller Gauze Bandages (2-inch & 3-inch)',
      category: 'Wound Care and Bandaging',
      requiredQuantity: 4,
      quantity: 3,
      minQuantity: 2,
      unit: 'rolls',
      expiryDate: '2028-08-10',
      location: 'Main Medical Compartment',
      purpose: 'Secures dressings on limbs and provides mild compression.',
      howToUse: 'Wrap spirally with 50% overlap; check fingers/toes for warmth to ensure it is not too tight.',
      purchased: false,
      preset: 'camping'
    },
    {
      id: 'kit-ph-6',
      name: 'Triangular Bandage / Cravat (with Pins)',
      category: 'Wound Care and Bandaging',
      requiredQuantity: 2,
      quantity: 2,
      minQuantity: 2,
      unit: 'pcs',
      expiryDate: '2032-01-01',
      location: 'Main Medical Compartment',
      purpose: 'Essential BSP bandaging tool for arm slings, head wraps, and immobilizing splints.',
      howToUse: 'Fold into broad or narrow cravat; tie with a proper square knot.',
      purchased: false,
      preset: 'all'
    },
    {
      id: 'kit-ph-7',
      name: 'Elastic Bandage (ACE-type Support Wrap)',
      category: 'Wound Care and Bandaging',
      requiredQuantity: 2,
      quantity: 1,
      minQuantity: 2,
      unit: 'rolls',
      expiryDate: '2029-05-01',
      location: 'Main Medical Compartment',
      purpose: 'Provides compression for ankle/wrist sprains (R.I.C.E. method).',
      howToUse: 'Wrap snugly from distal (toes/fingers) toward heart. Loosen if numbness occurs.',
      purchased: false,
      preset: 'camping'
    },
    {
      id: 'kit-ph-8',
      name: 'Antiseptic Wipes (70% Isopropyl Alcohol Swabs)',
      category: 'Wound Care and Bandaging',
      requiredQuantity: 20,
      quantity: 14,
      minQuantity: 15,
      unit: 'packs',
      expiryDate: '2026-12-10', // Expiring soon!
      location: 'Front Zipper Pouch',
      purpose: 'Cleanses intact skin around minor cuts and disinfects tweezers/shears.',
      howToUse: 'Wipe intact skin around wound or clean tool tips. Avoid pouring alcohol directly inside deep open wounds.',
      purchased: false,
      preset: 'all'
    },
    {
      id: 'kit-ph-9',
      name: 'Povidone-Iodine Solution (Betadine 10%)',
      category: 'Wound Care and Bandaging',
      requiredQuantity: 1,
      quantity: 1,
      minQuantity: 1,
      unit: 'bottle (15mL)',
      expiryDate: '2026-10-15', // EXPIRED!
      location: 'Wound Care Pouch',
      purpose: 'Standard Philippine antiseptic for minor cuts, scrapes, and leech bite sites.',
      howToUse: 'After washing wound with clean water/saline, apply a small amount gently around/over minor abrasion.',
      purchased: false,
      preset: 'all'
    },
    {
      id: 'kit-ph-10',
      name: 'Wound-Cleaning Saline Solution (NaCl 0.9%)',
      category: 'Wound Care and Bandaging',
      requiredQuantity: 5,
      quantity: 0, // MISSING!
      minQuantity: 3,
      unit: 'sachets',
      expiryDate: '2027-09-01',
      location: 'Wound Care Pouch',
      purpose: 'Sterile isotonic rinse for flushing dirt from cuts, scrapes, or eyes safely.',
      howToUse: 'Twist open sachet and gently irrigate wound to flush away soil and debris.',
      purchased: false,
      preset: 'all'
    },
    {
      id: 'kit-ph-11',
      name: 'Blunt-Tip Scissors / Bandage Shears',
      category: 'Wound Care and Bandaging',
      requiredQuantity: 1,
      quantity: 1,
      minQuantity: 1,
      unit: 'pc',
      expiryDate: '',
      location: 'Tool Loops',
      purpose: 'Safely cuts gauze, tape, or clothing away from an injury without puncturing skin.',
      howToUse: 'Keep flat blunt edge against skin when cutting fabric or dressings.',
      purchased: false,
      preset: 'all'
    },
    {
      id: 'kit-ph-12',
      name: 'Fine-Tip Tweezers',
      category: 'Wound Care and Bandaging',
      requiredQuantity: 1,
      quantity: 1,
      minQuantity: 1,
      unit: 'pc',
      expiryDate: '',
      location: 'Tool Loops',
      purpose: 'Removes superficial wood/bamboo splinters and attached ticks.',
      howToUse: 'Clean tip with alcohol swab, grasp splinter/tick close to skin, pull straight out steadily.',
      purchased: false,
      preset: 'all'
    },
    {
      id: 'kit-ph-13',
      name: 'Disposable Nitrile Gloves (Latex-Free)',
      category: 'Wound Care and Bandaging',
      requiredQuantity: 4,
      quantity: 4,
      minQuantity: 4,
      unit: 'pairs',
      expiryDate: '2028-03-01',
      location: 'Top Quick-Access Flap',
      purpose: 'Protects scout first-aider and patient from bloodborne infection.',
      howToUse: 'Put on before touching any blood or open wound. Dispose inside-out in sealed bag.',
      purchased: false,
      preset: 'all'
    },
    {
      id: 'kit-ph-14',
      name: 'CPR Face Shield / Breathing Barrier',
      category: 'Wound Care and Bandaging',
      requiredQuantity: 1,
      quantity: 1,
      minQuantity: 1,
      unit: 'pc',
      expiryDate: '2029-12-31',
      location: 'Top Quick-Access Flap',
      purpose: 'One-way valve barrier for safe rescue breathing during trained CPR.',
      howToUse: 'Place barrier over patient mouth/nose per qualified CPR training.',
      purchased: false,
      preset: 'camping'
    },
    {
      id: 'kit-ph-15',
      name: 'Blister Treatment Supplies (Moleskin / Foam)',
      category: 'Wound Care and Bandaging',
      requiredQuantity: 4,
      quantity: 3,
      minQuantity: 2,
      unit: 'sheets',
      expiryDate: '2029-01-01',
      location: 'Inner Sleeve',
      purpose: 'Cushions foot hot-spots and blisters during long Philippine trail hikes.',
      howToUse: 'Cut a doughnut hole around the blister so friction is absorbed around it.',
      purchased: false,
      preset: 'day_hike'
    },

    // B. Medicines and Basic Health Supplies (Camp Medical Officer Supervised)
    {
      id: 'kit-ph-16',
      name: 'Paracetamol 500mg (Biogesic / Tempra)',
      category: 'Medicines and Health Supplies',
      requiredQuantity: 10,
      quantity: 10,
      minQuantity: 6,
      unit: 'tablets',
      expiryDate: '2027-11-30',
      location: 'Locked Med Organizer',
      purpose: 'For mild fever or mild pain relief (supervised).',
      howToUse: 'Administer only with Camp Medical Officer / Guardian consent per age/weight.',
      isMedicine: true,
      intendedUse: 'Mild fever or minor headache/pain relief',
      storageInstructions: 'Store at room temperature below 30°C, away from moisture.',
      ageRestrictions: 'Ages 12+ for 500mg tablet; use pediatric syrup for younger scouts.',
      allergyWarnings: 'Do not use if allergic to paracetamol or with liver disease.',
      parentConsent: 'Approved (Signed)',
      medOfficerApproval: 'Approved by Dr. Elena Reyes',
      maxDailyDose: 'Max 4,000mg/day (adults); follow pediatric label strictly',
      minHoursBetweenDoses: '4 to 6 hours minimum',
      notes: 'NEVER use Aspirin for children/adolescents. NEVER double dose.',
      purchased: false,
      preset: 'all'
    },
    {
      id: 'kit-ph-17',
      name: 'Oral Rehydration Salts (Hydrite / Oranz)',
      category: 'Medicines and Health Supplies',
      requiredQuantity: 6,
      quantity: 0, // MISSING!
      minQuantity: 4,
      unit: 'sachets',
      expiryDate: '2027-08-15',
      location: 'Locked Med Organizer',
      purpose: 'Replaces lost fluids and electrolytes from heat sweating or mild diarrhea.',
      howToUse: 'Dissolve 1 sachet completely in clean potable water per package volume (usually 200mL or 1L).',
      isMedicine: true,
      intendedUse: 'Dehydration associated with fluid loss or heavy tropical sweating',
      storageInstructions: 'Keep sachets dry in sealed zip bag.',
      ageRestrictions: 'Safe for all ages when mixed strictly per package instructions.',
      allergyWarnings: 'None common; check flavorings if sensitive.',
      parentConsent: 'Approved (Signed)',
      medOfficerApproval: 'Approved by Dr. Elena Reyes',
      maxDailyDose: 'Sip steadily as needed for hydration',
      minHoursBetweenDoses: 'Continuous small sips',
      notes: 'Must be mixed with clean, purified drinking water only.',
      purchased: false,
      preset: 'all'
    },
    {
      id: 'kit-ph-18',
      name: 'Cetirizine 10mg (Allerta / Zyrtec)',
      category: 'Medicines and Health Supplies',
      requiredQuantity: 6,
      quantity: 4,
      minQuantity: 4,
      unit: 'tablets',
      expiryDate: '2027-04-01',
      location: 'Locked Med Organizer',
      purpose: 'Relieves mild seasonal allergies, itchy hives, or sneezing.',
      howToUse: 'Only given with parent consent and Camp Medical Officer review.',
      isMedicine: true,
      intendedUse: 'Mild allergy symptoms (rhinitis, mild hives)',
      storageInstructions: 'Store below 30°C in original blister pack.',
      ageRestrictions: 'Ages 6+ (10mg once daily for 12+; consult doctor for 6-11).',
      allergyWarnings: 'May cause mild drowsiness. Not a substitute for EpiPen in anaphylaxis!',
      parentConsent: 'Approved (Signed)',
      medOfficerApproval: 'Approved by Dr. Elena Reyes',
      maxDailyDose: '1 tablet (10mg) per 24 hours',
      minHoursBetweenDoses: '24 hours',
      notes: 'For severe breathing trouble or throat swelling, call 911 immediately.',
      purchased: false,
      preset: 'camping'
    },
    {
      id: 'kit-ph-19',
      name: 'Antacid Tablets (Kremil-S / Mylanta)',
      category: 'Medicines and Health Supplies',
      requiredQuantity: 6,
      quantity: 6,
      minQuantity: 4,
      unit: 'tablets',
      expiryDate: '2027-09-20',
      location: 'Locked Med Organizer',
      purpose: 'Relieves occasional mild hyperacidity or heartburn.',
      howToUse: 'Chew thoroughly before swallowing as approved by Med Officer.',
      isMedicine: true,
      intendedUse: 'Occasional acidity or heartburn',
      storageInstructions: 'Keep dry in blister foil.',
      ageRestrictions: 'Ages 12+ per label; consult Med Officer for younger scouts.',
      allergyWarnings: 'Check aluminum/magnesium sensitivity or kidney issues.',
      parentConsent: 'Approved (Signed)',
      medOfficerApproval: 'Approved by Dr. Elena Reyes',
      maxDailyDose: 'Per label / Med Officer limit',
      minHoursBetweenDoses: '4 hours',
      notes: 'Severe abdominal pain requires medical evaluation, not antacids.',
      purchased: false,
      preset: 'camping'
    },
    {
      id: 'kit-ph-20',
      name: 'Motion Sickness Tablet (Bonamine / Meclizine)',
      category: 'Medicines and Health Supplies',
      requiredQuantity: 4,
      quantity: 2,
      minQuantity: 2,
      unit: 'tablets',
      expiryDate: '2027-07-01',
      location: 'Locked Med Organizer',
      purpose: 'Helps prevent travel motion sickness during mountain bus/jeepney rides.',
      howToUse: 'Administer 1 hour before travel only if parent consent is on file.',
      isMedicine: true,
      intendedUse: 'Travel-related motion sickness / dizziness',
      storageInstructions: 'Store at room temperature.',
      ageRestrictions: 'Ages 12+ per standard label; pediatric review for under 12.',
      allergyWarnings: 'Causes drowsiness — do not climb or handle sharp tools while drowsy.',
      parentConsent: 'Pending Review',
      medOfficerApproval: 'Approved by Dr. Elena Reyes',
      maxDailyDose: 'Per label instructions',
      minHoursBetweenDoses: '24 hours',
      notes: 'Verify individual scout consent before trip departure.',
      purchased: false,
      preset: 'camping'
    },
    {
      id: 'kit-ph-21',
      name: 'Calamine Lotion',
      category: 'Medicines and Health Supplies',
      requiredQuantity: 1,
      quantity: 1,
      minQuantity: 1,
      unit: 'bottle (60mL)',
      expiryDate: '2027-10-15',
      location: 'Topical Pouch',
      purpose: 'Soothes minor skin itching from mosquito bites or mild plant rashes.',
      howToUse: 'Shake well. Dab gently on clean intact skin with cotton ball. External use only.',
      isMedicine: true,
      intendedUse: 'Minor skin itching & insect bites',
      storageInstructions: 'Keep bottle tightly capped, away from heat.',
      ageRestrictions: 'Safe for all ages (external skin use only).',
      allergyWarnings: 'Do not apply to open weeping wounds or eyes.',
      parentConsent: 'Approved (Signed)',
      medOfficerApproval: 'Approved by Dr. Elena Reyes',
      maxDailyDose: 'Apply up to 3–4 times daily externally',
      minHoursBetweenDoses: '4 hours',
      notes: 'For external use only.',
      purchased: false,
      preset: 'all'
    },
    {
      id: 'kit-ph-22',
      name: 'Hydrocortisone Cream 1%',
      category: 'Medicines and Health Supplies',
      requiredQuantity: 1,
      quantity: 1,
      minQuantity: 1,
      unit: 'tube (5g)',
      expiryDate: '2027-05-01',
      location: 'Topical Pouch',
      purpose: 'Reduces localized itching and mild redness from insect bites or contact rash.',
      howToUse: 'Wash area with soap and water first, apply thin film per label/Med Officer.',
      isMedicine: true,
      intendedUse: 'Minor localized skin irritation',
      storageInstructions: 'Store below 25°C; do not freeze.',
      ageRestrictions: 'Use only per age label (typically 2+ / 12+ depending on brand).',
      allergyWarnings: 'Do not apply to broken/infected skin or face.',
      parentConsent: 'Approved (Signed)',
      medOfficerApproval: 'Approved by Dr. Elena Reyes',
      maxDailyDose: 'Thin layer max 2–3x daily',
      minHoursBetweenDoses: '6 hours',
      notes: 'External use only.',
      purchased: false,
      preset: 'camping'
    },

    // C. Philippine Outdoor & Tropical Camping Safety
    {
      id: 'kit-ph-23',
      name: 'Mosquito Repellent Lotion (DEET ≥10% / Off!)',
      category: 'Philippine Outdoor & Tropical Supplies',
      requiredQuantity: 2,
      quantity: 1,
      minQuantity: 2,
      unit: 'bottles',
      expiryDate: '2028-02-01',
      location: 'Outer Side Pocket',
      purpose: 'Protects scouts against Dengue, Chikungunya, and mosquito bites at dusk/dawn.',
      howToUse: 'Apply thin layer on exposed arms and legs. Avoid eyes, mouth, and cuts.',
      purchased: false,
      preset: 'all'
    },
    {
      id: 'kit-ph-24',
      name: 'Sunscreen SPF 30+ (Water-Resistant)',
      category: 'Philippine Outdoor & Tropical Supplies',
      requiredQuantity: 2,
      quantity: 2,
      minQuantity: 1,
      unit: 'bottles',
      expiryDate: '2027-12-01',
      location: 'Outer Side Pocket',
      purpose: 'Prevents severe tropical sunburn during open trail hikes and island camps.',
      howToUse: 'Apply 15 minutes before sun exposure; reapply every 2 hours or after swimming.',
      purchased: false,
      preset: 'all'
    },
    {
      id: 'kit-ph-25',
      name: 'Digital Thermometer',
      category: 'Philippine Outdoor & Tropical Supplies',
      requiredQuantity: 1,
      quantity: 1,
      minQuantity: 1,
      unit: 'pc',
      expiryDate: '',
      location: 'Locked Med Organizer',
      purpose: 'Checks body temperature accurately for fever, dengue monitoring, or heat illness.',
      howToUse: 'Clean probe with alcohol swab before and after each use.',
      purchased: false,
      preset: 'camping'
    },
    {
      id: 'kit-ph-26',
      name: 'Instant Cold Pack (Chemical)',
      category: 'Philippine Outdoor & Tropical Supplies',
      requiredQuantity: 3,
      quantity: 2,
      minQuantity: 2,
      unit: 'packs',
      expiryDate: '2028-04-15',
      location: 'Main Medical Compartment',
      purpose: 'Cools sprains, bumps, or helps cool neck/armpits in heat exhaustion.',
      howToUse: 'Squeeze to pop inner bag, shake, and wrap in thin cloth before applying to skin.',
      purchased: false,
      preset: 'camping'
    },
    {
      id: 'kit-ph-27',
      name: 'Emergency Mylar Blanket',
      category: 'Philippine Outdoor & Tropical Supplies',
      requiredQuantity: 2,
      quantity: 2,
      minQuantity: 2,
      unit: 'sheets',
      expiryDate: '2032-01-01',
      location: 'Base Layer Pocket',
      purpose: 'Retains body heat during rainy mountain nights, shock, or hypothermia.',
      howToUse: 'Wrap snugly around scout over dry clothing.',
      purchased: false,
      preset: 'all'
    },
    {
      id: 'kit-ph-28',
      name: 'Hand Sanitizer (70% Ethyl Alcohol)',
      category: 'Philippine Outdoor & Tropical Supplies',
      requiredQuantity: 2,
      quantity: 2,
      minQuantity: 1,
      unit: 'bottles',
      expiryDate: '2028-01-20',
      location: 'Front Zipper Pouch',
      purpose: 'Sanitizes hands before meals and before handling first-aid dressings.',
      howToUse: 'Rub thoroughly over all hand surfaces until dry.',
      purchased: false,
      preset: 'all'
    },
    {
      id: 'kit-ph-29',
      name: 'Water Purification Tablets',
      category: 'Philippine Outdoor & Tropical Supplies',
      requiredQuantity: 1,
      quantity: 0, // MISSING!
      minQuantity: 1,
      unit: 'pack (50 tabs)',
      expiryDate: '2028-09-01',
      location: 'Emergency Pouch',
      purpose: 'Disinfects emergency water sources to prevent waterborne stomach illness.',
      howToUse: 'Follow exact tablet-to-liter wait time (usually 30 minutes) before drinking.',
      purchased: false,
      preset: 'camping'
    },
    {
      id: 'kit-ph-30',
      name: 'Emergency Pealess Whistle',
      category: 'Philippine Outdoor & Tropical Supplies',
      requiredQuantity: 1,
      quantity: 1,
      minQuantity: 1,
      unit: 'pc',
      expiryDate: '',
      location: 'Lanyard / Top Flap',
      purpose: 'Signals distress (3 loud blasts) without losing your voice in dense forest.',
      howToUse: 'Blow 3 distinct blasts in an emergency; repeat after pause.',
      purchased: false,
      preset: 'all'
    }
  ],
  medicines: [
    {
      id: 'med-ph-1',
      scoutId: 'scout-1',
      name: 'Salbutamol Inhaler (Ventolin HFA 100mcg)',
      dosage: '2 inhalations (puffs)',
      prescriber: 'Dr. Reyes, Philippine Heart Center',
      instructions: 'Inhale 2 puffs 15 minutes before strenuous trail hike or upon wheezing. Rinse mouth after use.',
      frequency: 'twice_daily',
      scheduleTimes: ['08:00', '20:00'],
      daysOfWeek: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      startDate: '2026-10-01',
      endDate: '2027-10-01',
      active: true,
      refillDate: '2026-12-02',
      withFood: false,
      maxDailyDose: 'Max 8 puffs in 24 hours unless directed by ER physician',
      minHoursBetweenDoses: '4 hours minimum between routine puffs',
      storageWarning: 'Keep below 30°C; do not leave in direct sun or hot tent.',
      notes: 'Self-carry authorized by Maria dela Cruz & Dr. Reyes. Stored in front pocket of daypack.'
    },
    {
      id: 'med-ph-2',
      scoutId: 'scout-1',
      name: 'Cetirizine 10mg (Allerta)',
      dosage: '1 tablet (10 mg)',
      prescriber: 'Dr. Santos, Ospital ng Maynila',
      instructions: 'Take 1 tablet each evening with a full glass of clean water for seasonal allergies.',
      frequency: 'once_daily',
      scheduleTimes: ['21:00'],
      daysOfWeek: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      startDate: '2026-11-01',
      endDate: '2026-12-31',
      active: true,
      refillDate: '2026-12-10',
      withFood: false,
      maxDailyDose: '1 tablet (10mg) per 24 hours — NEVER take two!',
      minHoursBetweenDoses: '24 hours',
      storageWarning: 'Store in cool dry medical locker.',
      notes: 'Supervised by Kuya Roel / Camp Medical Officer.'
    },
    {
      id: 'med-ph-3',
      scoutId: 'scout-1',
      name: 'Amoxicillin Capsule 500mg (Prescribed Course)',
      dosage: '1 capsule (500 mg)',
      prescriber: 'Dr. Cruz, Makati Medical Center',
      instructions: 'Take 1 capsule 3 times daily with meals. Complete the full 7-day prescribed course.',
      frequency: 'thrice_daily',
      scheduleTimes: ['08:00', '13:00', '20:00'],
      daysOfWeek: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      startDate: '2026-11-22',
      endDate: '2026-11-29',
      active: true,
      refillDate: '',
      withFood: true,
      maxDailyDose: '3 capsules (1,500mg) per 24 hours',
      minHoursBetweenDoses: '8 hours',
      storageWarning: 'Keep away from heat & humidity. Never share prescribed antibiotics.',
      notes: 'Personal doctor prescription for Juan only — NOT a troop shared supply.'
    }
  ],
  doseLogs: [
    {
      id: 'dose-log-ph-1',
      medicineId: 'med-ph-1',
      scoutId: 'scout-1',
      medicineName: 'Salbutamol Inhaler (Ventolin)',
      scheduledTime: '2026-11-25 08:00',
      recordedTime: '2026-11-25 08:04',
      status: 'taken',
      notes: 'Taken before morning troop warm-up.',
      confirmedBy: 'scout'
    },
    {
      id: 'dose-log-ph-2',
      medicineId: 'med-ph-3',
      scoutId: 'scout-1',
      medicineName: 'Amoxicillin Capsule 500mg',
      scheduledTime: '2026-11-25 08:00',
      recordedTime: '2026-11-25 08:10',
      status: 'taken',
      notes: 'Taken after pandesal & egg breakfast.',
      confirmedBy: 'guardian'
    },
    {
      id: 'dose-log-ph-3',
      medicineId: 'med-ph-2',
      scoutId: 'scout-1',
      medicineName: 'Cetirizine 10mg (Allerta)',
      scheduledTime: '2026-11-24 21:00',
      recordedTime: '2026-11-24 21:05',
      status: 'taken',
      notes: 'Taken with water before lights-out.',
      confirmedBy: 'scout'
    }
  ],
  todos: DEFAULT_TODOS,
  watchedVideos: ['vid-ph-1'],
  checklists: [
    { id: 'c-1', name: 'Navigation — Topographic Map & Compass', category: 'Navigation', packed: true, essential: true, desc: 'Do not rely solely on phone signal in Sierra Madre or mountain trails.' },
    { id: 'c-2', name: 'Sun Protection — SPF 30+, Hat & Sunglasses', category: 'Safety', packed: true, essential: true, desc: 'Critical for intense tropical Philippine UV exposure.' },
    { id: 'c-3', name: 'Extra Clothing — Rain Poncho, Dry Jacket, Extra Socks', category: 'Clothing', packed: true, essential: true, desc: 'Stay dry during sudden Philippine monsoon/afternoon squalls.' },
    { id: 'c-4', name: 'Lighting — Headlamp / Flashlight + Extra Batteries', category: 'Tools', packed: true, essential: true, desc: 'Hands-free lighting around campsite at night.' },
    { id: 'c-5', name: 'First Aid Kit — Inspected PH Kit + Personal Meds', category: 'Safety', packed: true, essential: true, desc: 'ScoutCare PH kit verified with Betadine, Hydrite ORS, and DEET.' },
    { id: 'c-6', name: 'Fire — Waterproof Matches & Adult-Supervised Starter', category: 'Emergency', packed: false, essential: true, desc: 'Used only with adult leader supervision and safe clearing.' },
    { id: 'c-7', name: 'Repair Kit / Tools — Multi-tool, Paracord, Duct Tape', category: 'Tools', packed: true, essential: true, desc: 'For fixing torn tent straps or broken pack buckles.' },
    { id: 'c-8', name: 'Extra Food — High-Energy Trail Snacks', category: 'Sustenance', packed: true, essential: true, desc: 'Nuts, crackers, dried mangoes for emergency energy.' },
    { id: 'c-9', name: 'Extra Water — 2L+ Potable Water & Purification Tabs', category: 'Sustenance', packed: false, essential: true, desc: 'Tropical heat requires frequent hydration to prevent heatstroke.' },
    { id: 'c-10', name: 'Emergency Shelter — Tent, Tarp, or Mylar Blanket', category: 'Emergency', packed: true, essential: true, desc: 'Protects against sudden heavy rain and cold mountain wind.' }
  ],
  incidentReports: [
    {
      id: 'inc-ph-1',
      scoutName: 'Juan dela Cruz',
      leaderName: 'Kuya Roel Santos (Scoutmaster)',
      incidentDate: '2026-11-14 14:20',
      location: 'Tanay Trail — River Crossing',
      incidentType: 'Minor Abrasion & Scrape',
      severity: 'Low',
      description: 'Scout slipped on wet mossy rock near stream crossing and scraped left knee.',
      firstAidApplied: 'Flushed scrape with clean saline sachet, cleaned surrounding skin with alcohol swab, applied Betadine 10% gently, and covered with sterile 3x3 gauze and Micropore tape.',
      parentNotified: true,
      parentContactTime: '2026-11-14 15:00 via SMS',
      outcome: 'Scout rested 15 minutes and resumed hike safely. Monitored for clean healing.',
      notes: 'Reminded patrol to wear proper gripping footwear on wet river rocks.'
    }
  ],
  learningProgress: {
    completedLessons: ['lesson-1', 'lesson-4'],
    quizScores: {
      'lesson-1': 100,
      'lesson-4': 90
    },
    earnedBadges: ['badge-1', 'badge-4']
  },
  settings: {
    language: 'en', // 'en' | 'fil'
    theme: 'dark', // 'dark' | 'light' | 'system'
    defaultDashboard: 'dashboard',
    dateFormat: 'YYYY-MM-DD',
    notificationsEnabled: true,
    notifyCampReminders: true,
    notifyTaskDeadlines: true,
    notifyMedExpiration: true,
    notifyMissingEquip: true,
    notifyTraining: true,
    notificationSound: 'chime',
    maskMedicineNamesOnLockScreen: true,
    pinLockEnabled: false,
    privacyMode: 'strict'
  }
};

class StateManager {
  constructor() {
    this.state = this.loadState();
    this.listeners = [];
  }

  loadState() {
    const saved = window.StorageService ? window.StorageService.load() : null;
    if (saved) {
      return {
        ...JSON.parse(JSON.stringify(DEFAULT_STATE)),
        ...saved,
        currentUser: { ...DEFAULT_STATE.currentUser, ...(saved.currentUser || {}) },
        campoutInfo: { ...DEFAULT_STATE.campoutInfo, ...(saved.campoutInfo || {}) },
        settings: { ...DEFAULT_STATE.settings, ...(saved.settings || {}) }
      };
    }
    return JSON.parse(JSON.stringify(DEFAULT_STATE));
  }

  saveState() {
    if (window.StorageService) {
      window.StorageService.save(this.state);
    }
    this.notifyListeners();
  }

  getState() {
    return this.state;
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notifyListeners() {
    for (const listener of this.listeners) {
      try {
        listener(this.state);
      } catch (err) {
        console.error('State subscriber error:', err);
      }
    }
  }

  // User & Profile operations
  setCurrentUser(userId) {
    const user = this.state.users.find(u => u.id === userId);
    if (user) {
      this.state.currentUser = { ...user };
      this.saveState();
    }
  }

  setRole(role) {
    const target = this.state.users.find(u => u.role === role);
    if (target) {
      this.state.currentUser = { ...target };
      this.saveState();
    }
  }

  updateProfile(profileData) {
    this.state.currentUser = { ...this.state.currentUser, ...profileData };
    const idx = this.state.users.findIndex(u => u.id === this.state.currentUser.id);
    if (idx !== -1) {
      this.state.users[idx] = { ...this.state.currentUser };
    }
    this.saveState();
  }

  updateSettings(settingsPatch) {
    this.state.settings = { ...this.state.settings, ...settingsPatch };
    this.saveState();
  }

  updateCampoutInfo(infoPatch) {
    this.state.campoutInfo = { ...this.state.campoutInfo, ...infoPatch };
    this.saveState();
  }

  // Kit Item Status Evaluator
  getItemStatus(item) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const thirtyDays = new Date(today);
    thirtyDays.setDate(today.getDate() + 30);

    if (item.expiryDate) {
      const exp = new Date(item.expiryDate);
      if (exp < today) return 'Expired';
      if (exp <= thirtyDays) return 'Expiring Soon';
    }
    if (item.quantity <= 0) return 'Missing';
    const req = item.requiredQuantity || item.minQuantity || 1;
    if (item.quantity < req) return 'Need to Buy';
    if (item.quantity >= req) return 'Complete';
    return 'Available';
  }

  addKitItem(item) {
    const newItem = {
      id: 'kit-ph-' + Date.now(),
      preset: 'all',
      purchased: false,
      requiredQuantity: item.requiredQuantity || item.minQuantity || 1,
      ...item
    };
    this.state.kitItems.push(newItem);
    this.saveState();
    return newItem;
  }

  updateKitItem(id, itemData) {
    const index = this.state.kitItems.findIndex(i => i.id === id);
    if (index !== -1) {
      this.state.kitItems[index] = { ...this.state.kitItems[index], ...itemData };
      this.saveState();
      return this.state.kitItems[index];
    }
    return null;
  }

  deleteKitItem(id) {
    this.state.kitItems = this.state.kitItems.filter(i => i.id !== id);
    this.saveState();
  }

  markItemPurchased(id) {
    const item = this.state.kitItems.find(i => i.id === id);
    if (!item) return;
    const req = item.requiredQuantity || item.minQuantity || 1;
    item.quantity = Math.max(item.quantity, req);
    item.purchased = true;
    // If it was expired, bump expiry date by 1 year upon fresh purchase
    if (this.getItemStatus(item) === 'Expired') {
      const nextYear = new Date();
      nextYear.setFullYear(nextYear.getFullYear() + 1);
      item.expiryDate = nextYear.toISOString().split('T')[0];
    }
    this.saveState();
  }

  getKitStats() {
    const items = this.state.kitItems;
    const total = items.length;
    let missing = 0;
    let needToBuy = 0;
    let expired = 0;
    let expiringSoon = 0;
    let complete = 0;

    for (const item of items) {
      const status = this.getItemStatus(item);
      if (status === 'Expired') expired++;
      else if (status === 'Expiring Soon') expiringSoon++;
      else if (status === 'Missing') missing++;
      else if (status === 'Need to Buy') needToBuy++;
      else complete++;
    }

    let readinessScore = 100;
    if (total > 0) {
      readinessScore -= (missing * 10);
      readinessScore -= (expired * 12);
      readinessScore -= (needToBuy * 4);
      readinessScore -= (expiringSoon * 2);
      if (readinessScore < 0) readinessScore = 0;
    }

    return {
      total,
      missing,
      lowStock: needToBuy,
      needToBuy,
      expired,
      expiringSoon,
      complete,
      shoppingCount: missing + needToBuy + expired,
      readinessScore: Math.round(readinessScore)
    };
  }

  // Medicine operations
  addMedicine(medicineData) {
    const newMed = {
      id: 'med-ph-' + Date.now(),
      scoutId: this.state.currentUser.id,
      active: true,
      ...medicineData
    };
    this.state.medicines.push(newMed);
    this.saveState();
    return newMed;
  }

  updateMedicine(id, medData) {
    const idx = this.state.medicines.findIndex(m => m.id === id);
    if (idx !== -1) {
      this.state.medicines[idx] = { ...this.state.medicines[idx], ...medData };
      this.saveState();
      return this.state.medicines[idx];
    }
    return null;
  }

  deleteMedicine(id) {
    this.state.medicines = this.state.medicines.filter(m => m.id !== id);
    this.saveState();
  }

  logDose(doseData) {
    const now = new Date();
    const phTime = new Date(now.getTime() + (8 * 60 * 60 * 1000)).toISOString().replace('T', ' ').substring(0, 16);
    const newLog = {
      id: 'dose-log-ph-' + Date.now(),
      recordedTime: phTime,
      confirmedBy: this.state.currentUser.role,
      ...doseData
    };
    this.state.doseLogs.unshift(newLog);
    this.saveState();
    return newLog;
  }

  getMedicineAdherenceStats() {
    const logs = this.state.doseLogs || [];
    const taken = logs.filter(l => l.status === 'taken').length;
    const skipped = logs.filter(l => l.status === 'skipped').length;
    const missed = logs.filter(l => l.status === 'missed').length;
    const total = taken + skipped + missed;
    const adherenceRate = total > 0 ? Math.round((taken / total) * 100) : 100;

    return {
      totalLogs: total,
      taken,
      skipped,
      missed,
      adherenceRate
    };
  }

  // To-Do List Operations
  addTodo(todoData) {
    const newTodo = {
      id: 'td-' + Date.now(),
      completed: false,
      priority: 'Medium',
      assignee: 'Self',
      notes: '',
      ...todoData
    };
    this.state.todos.unshift(newTodo);
    this.saveState();
    return newTodo;
  }

  toggleTodo(id) {
    const t = this.state.todos.find(item => item.id === id);
    if (t) {
      t.completed = !t.completed;
      this.saveState();
    }
  }

  updateTodo(id, patch) {
    const idx = this.state.todos.findIndex(item => item.id === id);
    if (idx !== -1) {
      this.state.todos[idx] = { ...this.state.todos[idx], ...patch };
      this.saveState();
    }
  }

  deleteTodo(id) {
    this.state.todos = this.state.todos.filter(item => item.id !== id);
    this.saveState();
  }

  resetTodos() {
    this.state.todos.forEach(t => { t.completed = false; });
    this.saveState();
  }

  // Comprehensive Camping Prep Dashboard Stats
  getPrepStats() {
    const todos = this.state.todos || [];
    const totalTasks = todos.length;
    const completedTasks = todos.filter(t => t.completed).length;
    const remainingTasks = totalTasks - completedTasks;
    const todoPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const equipTodos = todos.filter(t => t.category === 'Camping Equipment');
    const equipCompleted = equipTodos.filter(t => t.completed).length;
    const equipmentReadiness = equipTodos.length > 0 ? Math.round((equipCompleted / equipTodos.length) * 100) : 100;

    const kitStats = this.getKitStats();
    const lessonsCompleted = (this.state.learningProgress?.completedLessons || []).length;
    const lessonsPercent = Math.round((lessonsCompleted / 10) * 100);

    // Overall weighted preparation percentage
    const overallPrepPercent = Math.round((todoPercent * 0.5) + (kitStats.readinessScore * 0.35) + (lessonsPercent * 0.15));

    // Days until campout
    const campDate = new Date(this.state.campoutInfo?.date || '2026-12-06');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffDays = Math.ceil((campDate - today) / (1000 * 60 * 60 * 24));

    return {
      totalTasks,
      completedTasks,
      remainingTasks,
      todoPercent,
      equipmentReadiness,
      kitReadiness: kitStats.readinessScore,
      lessonsCompleted,
      overallPrepPercent,
      daysToCampout: diffDays
    };
  }

  // Ten Essentials Checklist
  toggleChecklistItem(id) {
    const item = this.state.checklists.find(c => c.id === id);
    if (item) {
      item.packed = !item.packed;
      this.saveState();
    }
  }

  resetChecklist() {
    this.state.checklists.forEach(item => { item.packed = false; });
    this.saveState();
  }

  // YouTube Watched Toggle
  toggleVideoWatched(videoId) {
    if (!this.state.watchedVideos) this.state.watchedVideos = [];
    if (this.state.watchedVideos.includes(videoId)) {
      this.state.watchedVideos = this.state.watchedVideos.filter(v => v !== videoId);
    } else {
      this.state.watchedVideos.push(videoId);
    }
    this.saveState();
  }

  // Learning & Quiz
  recordQuizScore(lessonId, score) {
    if (!this.state.learningProgress.quizScores) {
      this.state.learningProgress.quizScores = {};
    }
    this.state.learningProgress.quizScores[lessonId] = score;

    if (!this.state.learningProgress.completedLessons.includes(lessonId)) {
      this.state.learningProgress.completedLessons.push(lessonId);
    }

    this.evaluateBadges();
    this.saveState();
  }

  evaluateBadges() {
    const completedCount = this.state.learningProgress.completedLessons.length;
    const scores = Object.values(this.state.learningProgress.quizScores || {});
    const earned = this.state.learningProgress.earnedBadges || [];

    if (completedCount >= 1 && !earned.includes('badge-1')) earned.push('badge-1');
    if (completedCount >= 3 && !earned.includes('badge-2')) earned.push('badge-2');
    if (completedCount >= 10 && !earned.includes('badge-3')) {
      if (scores.every(s => s >= 80)) earned.push('badge-3');
    }
    const stats = this.getKitStats();
    if (stats.readinessScore >= 90 && !earned.includes('badge-4')) earned.push('badge-4');

    const medStats = this.getMedicineAdherenceStats();
    if (medStats.totalLogs >= 3 && medStats.adherenceRate >= 90 && !earned.includes('badge-5')) earned.push('badge-5');

    this.state.learningProgress.earnedBadges = earned;
  }

  // Incident Reports
  addIncidentReport(report) {
    const now = new Date();
    const phTime = new Date(now.getTime() + (8 * 60 * 60 * 1000)).toISOString().replace('T', ' ').substring(0, 16);
    const newReport = {
      id: 'inc-ph-' + Date.now(),
      incidentDate: phTime,
      ...report
    };
    this.state.incidentReports.unshift(newReport);
    this.saveState();
    return newReport;
  }

  // Backup and Reset
  exportStateJson() {
    return JSON.stringify(this.state, null, 2);
  }

  importStateJson(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.kitItems && parsed.medicines) {
        this.state = parsed;
        this.saveState();
        return true;
      }
    } catch (e) {
      console.error('Invalid JSON for state import:', e);
    }
    return false;
  }

  resetToDefault() {
    this.state = JSON.parse(JSON.stringify(DEFAULT_STATE));
    this.saveState();
  }
}

window.BSP_RANKS = BSP_RANKS;
window.PH_CAMPING_LOCATIONS = PH_CAMPING_LOCATIONS;
window.scoutState = new StateManager();
