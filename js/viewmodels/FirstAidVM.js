// ScoutCare PH — First-Aid Learning Center & Quiz ViewModel
const FirstAidVM = {
  activeTab: 'lessons', // 'lessons', 'quiz', 'badges'
  selectedLessonId: 'lesson-1',
  quizLessonId: null,
  quizUserAnswers: {},
  quizSubmitted: false,

  lessons: [
    {
      id: 'lesson-1',
      title: 'Cuts, Scrapes & Abrasions',
      category: 'Wound Care',
      severity: 'Mild to Moderate',
      badge: '🩹',
      readTime: '3 min',
      summary: 'Clean, disinfect with saline/Betadine, and dress minor wounds in tropical trail conditions.',
      call911: 'Bleeding does not stop after 10 minutes of direct pressure; deep gaping wound; foreign object embedded; signs of infection (red streaks, pus, fever).',
      steps: [
        { num: 1, title: 'Put On Nitrile Gloves', desc: 'Always protect yourself against bloodborne pathogens before treating another scout.', tip: 'Use latex-free nitrile gloves.' },
        { num: 2, title: 'Control Bleeding', desc: 'Apply gentle, steady direct pressure with sterile gauze until oozing stops.', tip: 'Add more gauze on top if soaked.' },
        { num: 3, title: 'Clean the Wound', desc: 'Flush with sterile saline (NaCl 0.9%) or clean potable water. Wash surrounding skin with soap.', tip: 'Do NOT pour 70% alcohol directly inside an open wound.' },
        { num: 4, title: 'Apply Betadine & Dress', desc: 'Apply Povidone-Iodine (Betadine) gently to minor abrasions, then cover with a sterile adhesive bandage.', tip: 'Keep clean and dry; change daily or if wet from rain.' }
      ],
      dos: ['Wash hands before and after care.', 'Keep wounds covered in muddy/rainy trails (prevents Leptospirosis).'],
      donts: ['Do not blow on the wound.', 'Do not leave open cuts uncovered in floodwater.'],
      scoutMeritReq: 'BSP First Aid Skill: Proper care for minor cuts and abrasions.'
    },
    {
      id: 'lesson-2',
      title: 'Severe Bleeding Control',
      category: 'Emergency Response',
      severity: 'Critical',
      badge: '🩸',
      readTime: '5 min',
      summary: 'Control heavy bleeding using firm direct pressure, pressure dressings, and tourniquet precautions.',
      call911: 'Call 911 or Red Cross 143 immediately for spurting blood, rapidly pooling blood, or uncontrolled bleeding.',
      steps: [
        { num: 1, title: 'Scene Safety & Gloves', desc: 'Ensure scene is safe from falling rocks, traffic, or floodwaters and put on gloves.', tip: 'Call adult leader and bring the troop kit.' },
        { num: 2, title: 'Firm Direct Pressure', desc: 'Press down firmly with both hands using sterile dressing pads directly over the bleeding source.', tip: 'Do not peek underneath to check.' },
        { num: 3, title: 'Wrap Pressure Bandage', desc: 'Wrap tightly with roller gauze or elastic bandage. Check fingers/toes for warmth.', tip: 'If blood soaks through, add another pad on top.' },
        { num: 4, title: 'Tourniquet (Life-Threatening Limb Bleed)', desc: 'Only if limb bleeding is life-threatening and direct pressure fails, apply a commercial tourniquet 2–3 inches above the wound (never on a joint).', tip: 'Write the exact time applied on the patient’s forehead or tape.' }
      ],
      dos: ['Call 911 / Red Cross 143 immediately.', 'Keep patient lying down and warm with Mylar blanket.'],
      donts: ['NEVER loosen or remove a tourniquet once applied.', 'Do not apply tourniquets over knees or elbows.'],
      scoutMeritReq: 'BSP First Aid Skill: Controlling severe bleeding.'
    },
    {
      id: 'lesson-3',
      title: 'Burns & Scalds',
      category: 'Thermal Injuries',
      severity: 'Moderate to Critical',
      badge: '🔥',
      readTime: '4 min',
      summary: 'Safe care for campfire burns, boiling water scalds, and severe tropical sunburn.',
      call911: 'Burn larger than palm; burn on face, neck, hands, feet, or groin; charred/white 3rd-degree skin; electrical or chemical burns.',
      steps: [
        { num: 1, title: 'Cool with Clean Running Water', desc: 'Cool the burned area under clean cool (not ice-cold) water for 10–15 minutes.', tip: 'Stops deeper thermal tissue damage.' },
        { num: 2, title: 'Remove Jewelry & Tight Items', desc: 'Gently remove watches, rings, or belts near the burn before swelling starts.', tip: 'If cloth is stuck to skin, DO NOT pull it off.' },
        { num: 3, title: 'Cover Loosely', desc: 'Cover loosely with sterile non-stick gauze or clean plastic wrap.', tip: 'Do not wrap tightly.' },
        { num: 4, title: 'Hydrate & Monitor', desc: 'Give small sips of water if alert. Seek medical evaluation for blistered burns.', tip: 'Never put butter, toothpaste, oil, or soy sauce on burns!' }
      ],
      dos: ['Cool with clean water for 10–15 mins.', 'Keep blisters intact.'],
      donts: ['NEVER apply ice, butter, or toothpaste.', 'NEVER pop burn blisters.'],
      scoutMeritReq: 'BSP First Aid Skill: Treating 1st, 2nd, and 3rd-degree burns.'
    },
    {
      id: 'lesson-4',
      title: 'Nosebleeds (Balinguyngoy)',
      category: 'Wound Care',
      severity: 'Mild to Moderate',
      badge: '👃',
      readTime: '3 min',
      summary: 'Proper sitting position and pinching technique for trail nosebleeds caused by tropical heat.',
      call911: 'Bleeding lasts past 20 minutes of continuous pinching; caused by head trauma; scout feels dizzy or faint.',
      steps: [
        { num: 1, title: 'Sit Upright & Lean Forward', desc: 'Have scout sit calmly and lean head slightly forward.', tip: 'Leaning forward prevents blood from going down the throat.' },
        { num: 2, title: 'Pinch Soft Part of Nose', desc: 'Pinch soft nostrils firmly against the nasal bridge for 10 full minutes without peeking.', tip: 'Time it with a watch.' },
        { num: 3, title: 'Breathe Through Mouth', desc: 'Have scout breathe calmly through the mouth and spit out any pooled blood.', tip: 'Swallowing blood causes nausea.' },
        { num: 4, title: 'Cool Compress', desc: 'Apply a wrapped cold pack to the bridge of the nose or back of neck.', tip: 'Do not blow nose for 2 hours after bleeding stops.' }
      ],
      dos: ['Lean forward, pinch continuously for 10 mins.'],
      donts: ['DO NOT tilt head backward.', 'Do not stuff rough tissue inside nostrils.'],
      scoutMeritReq: 'BSP First Aid Skill: Proper nosebleed management.'
    },
    {
      id: 'lesson-5',
      title: 'Sprains, Strains & Fractures',
      category: 'Musculoskeletal',
      severity: 'Moderate',
      badge: '🦴',
      readTime: '4 min',
      summary: 'Managing rolled ankles on steep trails using R.I.C.E. and safe immobilization.',
      call911: 'Bone protruding through skin; limb looks deformed, cold, or numb; inability to bear weight.',
      steps: [
        { num: 1, title: 'Rest the Limb', desc: 'Stop hiking immediately and have the scout sit safely.', tip: 'Never force a scout to walk on a suspected fracture.' },
        { num: 2, title: 'Ice / Cold Pack', desc: 'Apply wrapped instant cold pack for 15–20 minutes.', tip: 'Always place cloth between cold pack and skin.' },
        { num: 3, title: 'Compression', desc: 'Wrap snugly with an elastic bandage from toes/fingers upward.', tip: 'Check toes/fingers to ensure circulation is normal.' },
        { num: 4, title: 'Elevate & Splint', desc: 'Elevate above heart level. Splint suspected fractures in the position found using padded splints or triangular slings.', tip: 'Never try to straighten a bent bone.' }
      ],
      dos: ['Follow R.I.C.E.: Rest, Ice, Compression, Elevation.'],
      donts: ['Never massage or pull a suspected fracture back into place.'],
      scoutMeritReq: 'BSP First Aid Skill: R.I.C.E. and triangular bandage sling.'
    },
    {
      id: 'lesson-6',
      title: 'Heat Exhaustion vs. Heatstroke',
      category: 'Tropical Hazards',
      severity: 'Critical',
      badge: '☀️',
      readTime: '4 min',
      summary: 'Critical Philippine summer safety: recognizing heat exhaustion vs. life-threatening heatstroke.',
      call911: 'CALL 911 / 143 IMMEDIATELY for HEATSTROKE: Confusion, slurred speech, fainting, hot red dry skin, or seizures.',
      steps: [
        { num: 1, title: 'Recognize the Difference', desc: 'Heat Exhaustion: Heavy sweating, pale clammy skin, dizziness. Heatstroke: Confusion, fainting, hot red skin (LIFE-THREATENING).', tip: 'Check the PAGASA Heat Index before every hike!' },
        { num: 2, title: 'Move to Shade', desc: 'Move scout into cool shade, remove heavy pack and outer layers.', tip: 'Fan continuously.' },
        { num: 3, title: 'Rapid Cooling', desc: 'Wet clothes with cool water. Place wet towels or wrapped cold packs on neck, armpits, and groin.', tip: 'For heatstroke, cool aggressively while waiting for EMS.' },
        { num: 4, title: 'Hydrate (Only If Alert)', desc: 'For heat exhaustion, give slow sips of Hydrite ORS or cool water.', tip: 'NEVER give fluids to an unconscious or confused person.' }
      ],
      dos: ['Move to shade immediately.', 'Use ORS (Hydrite) for alert heat exhaustion.'],
      donts: ['Never pour water into the mouth of an unconscious scout.'],
      scoutMeritReq: 'BSP First Aid Skill: Heat illness recognition and prevention.'
    },
    {
      id: 'lesson-7',
      title: 'Hypothermia & Rain Chill',
      category: 'Mountain & Rain Safety',
      severity: 'Critical',
      badge: '❄️',
      readTime: '4 min',
      summary: 'Recognizing and warming chilled scouts during rainy mountain camps (e.g. Mt. Pulag or typhoon squalls).',
      call911: 'Shivering stops while still cold; extreme drowsiness or slurred speech; slow breathing; unconsciousness.',
      steps: [
        { num: 1, title: 'Spot the "Umbles"', desc: 'Watch for shivering, mumbling, fumbling hands, stumbling, and grumbling.', tip: 'Rain + wind in PH mountains can cause hypothermia even at 12–15°C.' },
        { num: 2, title: 'Dry Shelter & Layers', desc: 'Move inside tent out of rain/wind. Replace wet clothes with dry layers.', tip: 'Insulate scout from cold ground with a sleeping mat.' },
        { num: 3, title: 'Mylar Blanket & Sleeping Bag', desc: 'Wrap scout in sleeping bag and reflective Mylar emergency blanket.', tip: 'Cover head with a dry beanie or towel.' },
        { num: 4, title: 'Warm Sweet Drinks (If Alert)', desc: 'Give warm water, soup, or hot Milo/tea if fully alert.', tip: 'Avoid caffeine or alcohol.' }
      ],
      dos: ['Handle gently.', 'Get out of wet clothing quickly.'],
      donts: ['Do not rub cold limbs vigorously.'],
      scoutMeritReq: 'BSP First Aid Skill: Cold weather & rain exposure care.'
    },
    {
      id: 'lesson-8',
      title: 'Choking & Airway Obstruction',
      category: 'Emergency Response',
      severity: 'Critical',
      badge: '🗣️',
      readTime: '3 min',
      summary: 'Recognizing universal choking sign and assisting a conscious choking person.',
      call911: 'Call 911 / Red Cross 143 immediately if victim cannot cough, breathe, speak, or becomes unresponsive.',
      steps: [
        { num: 1, title: 'Check Airway', desc: 'Ask "Are you choking?" If they can cough forcefully, encourage coughing. If silent/clutching throat, act fast.', tip: 'Do not slap back if coughing strongly.' },
        { num: 2, title: '5 Back Blows', desc: 'Support chest, lean forward, give 5 firm blows between shoulder blades with heel of hand.', tip: 'Check if object clears after each blow.' },
        { num: 3, title: '5 Abdominal Thrusts', desc: 'Stand behind, place fist just above navel, thrust inward and upward 5 times.', tip: 'Alternate 5 back blows and 5 thrusts.' },
        { num: 4, title: 'If Unresponsive', desc: 'Lower carefully to ground, call 911, and begin trained CPR.', tip: 'Look inside mouth before breaths; only remove object if clearly visible.' }
      ],
      dos: ['Alternate back blows and abdominal thrusts if unable to breathe.'],
      donts: ['Never do blind finger sweeps in the throat.'],
      scoutMeritReq: 'BSP First Aid Skill: Choking emergency response.'
    },
    {
      id: 'lesson-9',
      title: 'Bites, Stings, Ticks & Leeches',
      category: 'Tropical Hazards',
      severity: 'Moderate to Critical',
      badge: '🐝',
      readTime: '4 min',
      summary: 'Safe PH field care for bee stings, ticks, limatik (leeches), dog/bat bites (rabies), and snakebites.',
      call911: 'CALL 911 IMMEDIATELY for ANAPHYLAXIS (throat swelling, wheezing, hives), any venomous snakebite, or rush to hospital for Rabies PEP after any dog/bat bite.',
      steps: [
        { num: 1, title: 'Bee & Wasp Stings', desc: 'Scrape stinger sideways with a card edge. Wash with soap, apply wrapped cold pack and Calamine.', tip: 'Watch for severe allergy (anaphylaxis).' },
        { num: 2, title: 'Tick & Leech (Limatik) Removal', desc: 'For ticks: pull straight up with fine tweezers. For leeches: slide a flat card gently to detach—never burn or force-pull near eyes. Clean with Betadine.', tip: 'Never smother ticks with oil or match heat.' },
        { num: 3, title: 'Dog / Bat Bite (Rabies Protocol)', desc: 'Wash wound immediately with soap and running water for 15 full minutes, apply Betadine, and go to an Animal Bite Center / hospital for PEP vaccine.', tip: 'Philippines is rabies-endemic—NEVER skip hospital evaluation.' },
        { num: 4, title: 'Venomous Snakebite Rules', desc: 'Keep scout calm and still, immobilize limb at/below heart level, remove rings, and evacuate to hospital immediately.', tip: 'NEVER cut, suck venom, apply ice, or use a tourniquet!' }
      ],
      dos: ['Wash animal bites 15 mins with soap & water + go to hospital.', 'Keep snakebite victim calm and still.'],
      donts: ['NEVER cut or suck a snakebite.', 'NEVER ignore a dog or bat scratch/bite.'],
      scoutMeritReq: 'BSP First Aid Skill: Tropical bites, stings, and rabies prevention.'
    },
    {
      id: 'lesson-10',
      title: 'CPR & AED Awareness',
      category: 'Emergency Response',
      severity: 'Critical',
      badge: '❤️',
      readTime: '5 min',
      summary: 'Awareness of Hands-Only CPR (100–120 bpm) and AED usage. Must be practiced hands-on with qualified instructors.',
      call911: 'CALL 911 / Red Cross 143 IMMEDIATELY when a person collapses unresponsive and is not breathing normally.',
      steps: [
        { num: 1, title: 'Check Scene & Responsiveness', desc: 'Verify scene safety. Tap shoulders and shout "Ayos ka lang ba? / Are you OK?" Check breathing max 10 seconds.', tip: 'Gasping is NOT normal breathing.' },
        { num: 2, title: 'Call 911 / 143 & Get AED', desc: 'Point to a scout: "Call 911 / 143!" Point to another: "Bring the AED!"', tip: 'Put phone on speaker.' },
        { num: 3, title: 'Chest Compressions (100–120/min)', desc: 'Place heel of hand in center of chest, push hard and fast (at least 2 inches deep) allowing full chest recoil.', tip: 'Practice rhythm using a certified CPR manikin in Red Cross training.' },
        { num: 4, title: 'Follow AED Voice Prompts', desc: 'Power on AED, dry chest, place pads per diagram, and ensure nobody touches the patient during analysis/shock.', tip: 'Resume compressions immediately after shock.' }
      ],
      dos: ['Get hands-on certification with Philippine Red Cross using a CPR manikin.'],
      donts: ['Do not touch patient while AED is analyzing or shocking.'],
      scoutMeritReq: 'BSP First Aid Skill: CPR & AED Awareness (Requires hands-on manikin practice).'
    }
  ],

  quizzes: {
    'lesson-1': [
      { q: 'Which antiseptic is standard in Philippine Scout kits for minor cuts after rinsing with saline?', options: ['Pouring 70% alcohol inside deep wounds', 'Povidone-Iodine (Betadine)', 'Butter or cooking oil', 'Dirty creek water'], answer: 1, rationale: 'After flushing dirt with saline/clean water, Betadine is the standard PH antiseptic for minor abrasions.' },
      { q: 'Why should cuts on Philippine trails be kept covered with waterproof dressings?', options: ['To hide the scar', 'To prevent dirt & floodwater bacteria like Leptospirosis from entering', 'To make it itch less', 'No reason'], answer: 1, rationale: 'Covering cuts protects against soil and floodwater bacteria such as Leptospirosis.' }
    ],
    'lesson-2': [
      { q: 'What is the first life-saving step for severe bleeding?', options: ['Apply firm, continuous direct pressure with sterile gauze', 'Wash with soap for 5 minutes', 'Elevate only', 'Loosen shoes'], answer: 0, rationale: 'Firm direct pressure halts severe bleeding immediately.' }
    ],
    'lesson-3': [
      { q: 'What should you apply to a fresh campfire burn?', options: ['Toothpaste', 'Butter', 'Cool clean running water for 10–15 minutes', 'Direct ice cubes'], answer: 2, rationale: 'Cool running water safely stops thermal damage. Toothpaste and butter trap heat.' }
    ],
    'lesson-4': [
      { q: 'How should a scout sit during a nosebleed?', options: ['Lean slightly forward and pinch soft nostrils for 10 mins', 'Tilt head far back', 'Lie flat on back', 'Run around'], answer: 0, rationale: 'Leaning forward prevents blood from draining down the throat.' }
    ],
    'lesson-5': [
      { q: 'What does R.I.C.E. stand for?', options: ['Run, Ice, Check, Eat', 'Rest, Ice, Compression, Elevation', 'Roll, Immobilize, Clean, Exit', 'None'], answer: 1, rationale: 'R.I.C.E. = Rest, Ice (wrapped), Compression, Elevation.' }
    ],
    'lesson-6': [
      { q: 'Which sign indicates life-threatening HEATSTROKE?', options: ['Mild thirst', 'Confusion, slurred speech, fainting, hot red skin', 'Sweating normally', 'Sore calves'], answer: 1, rationale: 'Heatstroke affects the brain (confusion/fainting) and requires calling 911 / 143 immediately.' }
    ],
    'lesson-7': [
      { q: 'What helps prevent hypothermia during rainy mountain camps like Mt. Pulag?', options: ['Cotton shirts only', 'Getting into dry shelter, dry layers, and a Mylar emergency blanket', 'Cold shower', 'Rubbing skin hard'], answer: 1, rationale: 'Dry layers + Mylar blanket retain body heat.' }
    ],
    'lesson-8': [
      { q: 'If a choking scout is coughing forcefully, what should you do?', options: ['Encourage them to keep coughing', 'Perform blind finger sweep', 'Give water', 'Do nothing'], answer: 0, rationale: 'A forceful cough clears the airway naturally.' }
    ],
    'lesson-9': [
      { q: 'What is the CRITICAL first step after any dog or bat bite in the Philippines?', options: ['Apply garlic to the wound', 'Wash with soap & running water for 15 mins and go to a hospital for Rabies PEP', 'Cut and suck the wound', 'Ignore if small'], answer: 1, rationale: 'Immediate 15-minute soap/water wash + hospital Rabies PEP prevents fatal rabies.' }
    ],
    'lesson-10': [
      { q: 'Where should scouts practice actual CPR chest compressions?', options: ['On sleeping patrol mates', 'Through qualified hands-on training using a CPR manikin (e.g. Philippine Red Cross)', 'Only by watching videos', 'On a pillow'], answer: 1, rationale: 'Hands-on training with a qualified instructor and CPR manikin builds safe, accurate compression technique.' }
    ]
  },

  badges: [
    { id: 'badge-1', title: 'Tenderfoot First Aider', icon: '🩺', description: 'Completed your first first-aid lesson and quiz.', requirement: 'Complete 1 lesson' },
    { id: 'badge-2', title: 'Laging Handa Scout', icon: '🛡️', description: 'Completed 3+ Philippine first-aid modules.', requirement: 'Complete 3 lessons' },
    { id: 'badge-3', title: 'First Aid Merit Badge', icon: '⚜️', description: 'Passed all 10 emergency lessons with 80%+.', requirement: 'Master all 10 lessons' },
    { id: 'badge-4', title: 'Kit Inspector', icon: '🎒', description: 'Achieved 90%+ PH First-Aid Kit readiness.', requirement: 'Kit Readiness >= 90%' },
    { id: 'badge-5', title: 'Medicine Safety Hero', icon: '⏰', description: 'Maintained 90%+ adherence with safe dosing.', requirement: 'Med Adherence >= 90%' }
  ],

  init() {
    this.render();
    window.scoutState.subscribe(() => {
      if (window.App && window.App.currentView && window.App.currentView.startsWith('firstaid')) {
        this.render();
      }
    });
  },

  setActiveTab(tab) {
    this.activeTab = tab;
    this.render();
  },

  selectLesson(id) {
    this.selectedLessonId = id;
    this.render();
  },

  startQuiz(lessonId) {
    this.quizLessonId = lessonId;
    this.quizUserAnswers = {};
    this.quizSubmitted = false;
    this.activeTab = 'quiz';
    this.render();
  },

  selectQuizAnswer(qIdx, optIdx) {
    this.quizUserAnswers[qIdx] = optIdx;
    this.render();
  },

  submitQuiz() {
    const questions = this.quizzes[this.quizLessonId] || [];
    let correct = 0;
    questions.forEach((q, idx) => {
      if (this.quizUserAnswers[idx] === q.answer) correct++;
    });
    const score = questions.length > 0 ? Math.round((correct / questions.length) * 100) : 100;
    this.quizSubmitted = true;
    window.scoutState.recordQuizScore(this.quizLessonId, score);
    if (window.AudioEngine) {
      if (score >= 80) window.AudioEngine.playSuccessFanfare();
      else window.AudioEngine.playChime();
    }
    this.render();
  },

  render() {
    const container = document.getElementById('first-aid-view');
    if (!container) return;

    const progress = window.scoutState.getState().learningProgress || {};
    const completed = progress.completedLessons || [];
    const scores = progress.quizScores || {};
    const earnedBadges = progress.earnedBadges || [];

    container.innerHTML = `
      <div class="screen-header">
        <div class="screen-title-group">
          <span class="badge-tag">🇵🇭 BSP First Aid Training</span>
          <h1 class="screen-title">${window.I18n ? window.I18n.t('lessons') : 'First-Aid Lessons'}</h1>
          <p class="screen-subtitle">Offline tropical first-aid guides, quizzes, and scout badges.</p>
        </div>
        <button class="btn btn-sm btn-outline" onclick="App.navigateTo('videos')">▶️ YouTube Videos</button>
      </div>

      <div class="pill-group">
        <button class="pill-btn ${this.activeTab === 'lessons' ? 'active' : ''}" onclick="FirstAidVM.setActiveTab('lessons')">
          📖 Lessons (${completed.length}/10)
        </button>
        <button class="pill-btn ${this.activeTab === 'quiz' ? 'active' : ''}" onclick="FirstAidVM.setActiveTab('quiz')">
          ✍️ Quizzes
        </button>
        <button class="pill-btn ${this.activeTab === 'badges' ? 'active' : ''}" onclick="FirstAidVM.setActiveTab('badges')">
          🏅 Badges (${earnedBadges.length}/${this.badges.length})
        </button>
      </div>

      ${this.activeTab === 'lessons' ? this.renderLessonsView(completed, scores) : this.activeTab === 'quiz' ? this.renderQuizView(scores) : this.renderBadgesView(earnedBadges)}
    `;
  },

  renderLessonsView(completed, scores) {
    const lesson = this.lessons.find(l => l.id === this.selectedLessonId) || this.lessons[0];
    const score = scores[lesson.id];

    return `
      <div class="lessons-layout">
        <div class="glass-card" style="padding:0.75rem;">
          <label class="form-label">Select Emergency Lesson:</label>
          <select class="input-field" onchange="FirstAidVM.selectLesson(this.value)">
            ${this.lessons.map(l => `
              <option value="${l.id}" ${l.id === lesson.id ? 'selected' : ''}>
                ${completed.includes(l.id) ? '✅' : '📖'} ${l.badge} ${l.title} (${l.readTime})
              </option>
            `).join('')}
          </select>
        </div>

        <div class="glass-card lesson-detail-content">
          <div class="lesson-header-banner">
            <div class="lesson-badge-large">${lesson.badge}</div>
            <div class="lesson-title-meta">
              <span class="category-pill">${lesson.category}</span>
              <h2>${lesson.title}</h2>
              <p class="text-muted">${lesson.summary}</p>
            </div>
          </div>

          <div class="alert-box alert-emergency">
            <span>🚨</span>
            <div>
              <strong>WHEN TO CALL 911 / RED CROSS 143 IMMEDIATELY:</strong>
              <p>${lesson.call911}</p>
            </div>
          </div>

          <h3 style="margin:0.8rem 0 0.5rem;">Step-by-Step Protocol</h3>
          ${lesson.steps.map(s => `
            <div class="step-card">
              <div class="step-number-circle">${s.num}</div>
              <div class="step-content">
                <h4>${s.title}</h4>
                <p>${s.desc}</p>
                <div class="step-tip-callout">💡 <strong>Scout Tip:</strong> ${s.tip}</div>
              </div>
            </div>
          `).join('')}

          <div class="dos-and-donts-grid">
            <div class="dos-box">
              <h4>✅ DO:</h4>
              <ul>${lesson.dos.map(d => `<li>${d}</li>`).join('')}</ul>
            </div>
            <div class="donts-box">
              <h4>❌ DO NOT:</h4>
              <ul>${lesson.donts.map(d => `<li>${d}</li>`).join('')}</ul>
            </div>
          </div>

          <div style="margin-top:1rem;">
            <button class="btn btn-primary" style="width:100%;" onclick="FirstAidVM.startQuiz('${lesson.id}')">
              ${score !== undefined ? `Retake Quiz (Last: ${score}%)` : 'Take Lesson Quiz ✍️'}
            </button>
          </div>
        </div>
      </div>
    `;
  },

  renderQuizView() {
    const lessonId = this.quizLessonId || this.selectedLessonId || 'lesson-1';
    const lesson = this.lessons.find(l => l.id === lessonId);
    const questions = this.quizzes[lessonId] || [];

    let correctCount = 0;
    if (this.quizSubmitted) {
      questions.forEach((q, idx) => {
        if (this.quizUserAnswers[idx] === q.answer) correctCount++;
      });
    }
    const score = this.quizSubmitted && questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : null;

    return `
      <div class="glass-card">
        <div class="form-group">
          <label class="form-label">Select Quiz Topic:</label>
          <select class="input-field" onchange="FirstAidVM.startQuiz(this.value)">
            ${this.lessons.map(l => `<option value="${l.id}" ${l.id === lessonId ? 'selected' : ''}>${l.badge} ${l.title}</option>`).join('')}
          </select>
        </div>

        ${this.quizSubmitted ? `
          <div class="quiz-score-banner ${score >= 80 ? 'score-passed' : 'score-failed'}">
            <div class="score-number">${score}%</div>
            <div>
              <h3>${score >= 80 ? '🎉 Laging Handa! Passed!' : '⚠️ Review & Try Again'}</h3>
            </div>
          </div>
        ` : ''}

        ${questions.map((q, qIdx) => {
          const userAns = this.quizUserAnswers[qIdx];
          return `
            <div class="question-block" style="margin-bottom:1rem;">
              <p class="question-text"><strong>Q${qIdx + 1}:</strong> ${q.q}</p>
              ${q.options.map((opt, oIdx) => {
                let cls = '';
                if (this.quizSubmitted) {
                  if (oIdx === q.answer) cls = 'option-correct';
                  else if (userAns === oIdx) cls = 'option-incorrect';
                } else if (userAns === oIdx) cls = 'option-selected';

                return `
                  <div class="quiz-option ${cls}" onclick="${this.quizSubmitted ? '' : `FirstAidVM.selectQuizAnswer(${qIdx}, ${oIdx})`}">
                    <span>${userAns === oIdx ? '●' : '○'}</span>
                    <span>${opt}</span>
                  </div>
                `;
              }).join('')}
              ${this.quizSubmitted ? `<div class="rationale-box">💡 ${q.rationale}</div>` : ''}
            </div>
          `;
        }).join('')}

        ${!this.quizSubmitted ? `
          <button class="btn btn-primary" style="width:100%;" onclick="FirstAidVM.submitQuiz()">Submit Quiz</button>
        ` : `
          <button class="btn btn-outline" style="width:100%;" onclick="FirstAidVM.startQuiz('${lessonId}')">Retake Quiz</button>
        `}
      </div>
    `;
  },

  renderBadgesView(earnedBadges) {
    return `
      <div class="badges-grid">
        ${this.badges.map(b => {
          const unlocked = earnedBadges.includes(b.id);
          return `
            <div class="glass-card badge-card ${unlocked ? 'badge-unlocked' : 'badge-locked'}">
              <div class="badge-big-icon">${b.icon}</div>
              <h4>${b.title}</h4>
              <p class="badge-desc">${b.description}</p>
              <small class="text-muted">${unlocked ? '✅ Earned' : '🔒 ' + b.requirement}</small>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }
};

window.FirstAidVM = FirstAidVM;
window.FirstAidModule = FirstAidVM;
