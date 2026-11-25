// ScoutCare PH — YouTube Learning Resources ViewModel
const LearningVM = {
  activeCategory: 'All',

  resources: [
    // Philippine Scout Training (Direct Verified Video Links)
    {
      id: 'vid-ph-1',
      title: 'Basic First Aid and Bandaging',
      category: 'Philippine Scout Training',
      description: 'First aid and bandaging demonstrations, including injuries, burns, and triangular sling techniques.',
      url: 'https://www.youtube.com/watch?v=ANnqhzc51v8',
      isDirectVideo: true,
      topics: 'Bandaging, Burns, Slings'
    },
    {
      id: 'vid-ph-2',
      title: 'Scout First Aid Kit Preparation',
      category: 'Philippine Scout Training',
      description: 'Learn how to prepare, organize, and maintain a Scout first aid kit for troop campouts.',
      url: 'https://www.youtube.com/watch?v=yRBZFj7aE04',
      isDirectVideo: true,
      topics: 'Kit Organization, Supplies'
    },
    // First Aid Kit - Basic First Aid
    {
      id: 'vid-fa-1',
      title: 'Basic First Aid Kit for Camping',
      category: 'First Aid Kit — Basic First Aid',
      description: 'Overview of essential camping wound care, blister pads, and hygiene supplies.',
      url: 'https://www.youtube.com/results?search_query=basic+first+aid+kit+camping+lesson',
      isDirectVideo: false,
      topics: 'Preparing a first aid kit, Camping injuries'
    },
    {
      id: 'vid-fa-2',
      title: 'First Aid Basics for Scouts',
      category: 'First Aid Kit — Basic First Aid',
      description: 'Foundational scouting lessons on cuts, scrapes, minor burns, and sprains.',
      url: 'https://www.youtube.com/results?search_query=Boy+Scouts+first+aid+basics+lesson',
      isDirectVideo: false,
      topics: 'Minor cuts, Scrapes, Blisters, Burns'
    },
    {
      id: 'vid-fa-3',
      title: 'First Aid – Wound Care and Bandaging',
      category: 'First Aid Kit — Basic First Aid',
      description: 'Step-by-step wound cleaning, sterile dressing placement, and roller bandaging.',
      url: 'https://www.youtube.com/results?search_query=basic+first+aid+wound+care+bandaging',
      isDirectVideo: false,
      topics: 'Wound care, Bandaging'
    },
    // CPR - Cardiopulmonary Resuscitation
    {
      id: 'vid-cpr-1',
      title: 'CPR for Beginners (Adult Demonstration)',
      category: 'CPR — Cardiopulmonary Resuscitation',
      description: 'Recognizing an unresponsive person, calling emergency services (911/143), and chest compressions.',
      url: 'https://www.youtube.com/results?search_query=CPR+for+beginners+adult+demonstration',
      isDirectVideo: false,
      topics: 'Unresponsive assessment, CPR basics'
    },
    {
      id: 'vid-cpr-2',
      title: 'CPR Training — Red Cross',
      category: 'CPR — Cardiopulmonary Resuscitation',
      description: 'Educational CPR training demonstrations from recognized Red Cross instructors.',
      url: 'https://www.youtube.com/results?search_query=American+Red+Cross+CPR+training+video',
      isDirectVideo: false,
      topics: 'Emergency response, Rescue breathing'
    },
    {
      id: 'vid-cpr-3',
      title: 'CPR and AED Demonstration',
      category: 'CPR — Cardiopulmonary Resuscitation',
      description: 'How to power on and follow Automated External Defibrillator (AED) voice prompts safely.',
      url: 'https://www.youtube.com/results?search_query=CPR+AED+demonstration+training',
      isDirectVideo: false,
      topics: 'AED basics, Calling EMS'
    },
    // Camping Ten Essentials
    {
      id: 'vid-ten-1',
      title: 'Camping Ten Essentials Explained',
      category: 'Camping Ten Essentials',
      description: 'Detailed walkthrough of navigation, hydration, shelter, and lighting gear.',
      url: 'https://www.youtube.com/results?search_query=10+essentials+of+camping+scouting+lesson',
      isDirectVideo: false,
      topics: 'Navigation, Water, Shelter'
    },
    {
      id: 'vid-ten-2',
      title: 'Scout Camping Essentials & Outdoor Survival',
      category: 'Camping Ten Essentials',
      description: 'Practical packing strategies for scouts preparing for overnight wilderness treks.',
      url: 'https://www.youtube.com/results?search_query=Boy+Scout+camping+ten+essentials+lesson',
      isDirectVideo: false,
      topics: 'Packing, Survival skills'
    },
    // Searchable PH Scout & Disaster Preparedness Topics
    {
      id: 'vid-ph-search-1',
      title: 'Boy Scouts of the Philippines First Aid & Bandaging',
      category: 'Philippine Scout Training',
      description: 'Search educational YouTube demonstrations on BSP first aid and scout bandaging techniques.',
      url: 'https://www.youtube.com/results?search_query=Boy+Scouts+of+the+Philippines+First+Aid+bandaging',
      isDirectVideo: false,
      topics: 'PH Scout Bandaging, Slings'
    },
    {
      id: 'vid-ph-search-2',
      title: 'Philippine Scout CPR & Emergency Carrying Techniques',
      category: 'Philippine Scout Training',
      description: 'Search training videos on Philippine CPR awareness and two-person/blanket carrying techniques.',
      url: 'https://www.youtube.com/results?search_query=Philippine+Red+Cross+CPR+emergency+carrying+techniques',
      isDirectVideo: false,
      topics: 'Carrying Techniques, CPR'
    },
    {
      id: 'vid-ph-search-3',
      title: 'Emergency Signaling, Disaster Preparedness & Survival',
      category: 'Philippine Scout Training',
      description: 'Search resources on whistle signaling, typhoon disaster preparedness, and tropical camping survival.',
      url: 'https://www.youtube.com/results?search_query=Philippines+disaster+preparedness+outdoor+safety+scouting',
      isDirectVideo: false,
      topics: 'Signaling, Typhoon & Disaster Prep'
    }
  ],

  init() {
    this.render();
    window.scoutState.subscribe(() => {
      if (window.App && window.App.currentView === 'videos') {
        this.render();
      }
    });
  },

  setCategory(cat) {
    this.activeCategory = cat;
    this.render();
  },

  toggleWatched(id) {
    window.scoutState.toggleVideoWatched(id);
  },

  render() {
    const container = document.getElementById('videos-view');
    if (!container) return;

    const watched = window.scoutState.getState().watchedVideos || [];
    const total = this.resources.length;
    const watchedCount = this.resources.filter(r => watched.includes(r.id)).length;
    const pct = Math.round((watchedCount / total) * 100);

    const categories = [
      'All',
      'Philippine Scout Training',
      'First Aid Kit — Basic First Aid',
      'CPR — Cardiopulmonary Resuscitation',
      'Camping Ten Essentials'
    ];

    const filtered = this.resources.filter(r => this.activeCategory === 'All' || r.category === this.activeCategory);

    container.innerHTML = `
      <div class="screen-header">
        <div class="screen-title-group">
          <span class="badge-tag">Video Training Library</span>
          <h1 class="screen-title">Learning Resources</h1>
          <p class="screen-subtitle">Curated YouTube training videos & searchable educational resources.</p>
        </div>
      </div>

      <!-- Progress -->
      <div class="glass-card">
        <div class="summary-top">
          <div>
            <h3>Video Learning Progress</h3>
            <p class="text-muted"><strong>${watchedCount}</strong> of <strong>${total}</strong> resources watched</p>
          </div>
          <div class="packed-percent-badge">${pct}%</div>
        </div>
        <div class="progress-bar-track">
          <div class="progress-bar-fill" style="width: ${pct}%;"></div>
        </div>
      </div>

      <!-- Mandatory CPR Hands-On Disclaimer -->
      <div class="alert-box alert-warning">
        <span>❤️</span>
        <div>
          <strong>CPR Training Safety Disclaimer:</strong> CPR should be practiced through qualified instruction and hands-on training using a CPR manikin (e.g., Philippine Red Cross). These YouTube links are educational references only—not a substitute for certified training.
        </div>
      </div>

      <!-- Category Tabs -->
      <div class="category-tabs-scroll">
        ${categories.map(cat => `
          <button class="category-tab ${this.activeCategory === cat ? 'active' : ''}" onclick="LearningVM.setCategory('${cat}')">
            ${cat}
          </button>
        `).join('')}
      </div>

      <!-- Video Cards -->
      <div class="videos-cards-stack">
        ${filtered.map(vid => {
          const isWatched = watched.includes(vid.id);
          return `
            <div class="glass-card video-resource-card ${isWatched ? 'item-packed-glass' : ''}">
              <div class="video-card-top">
                <span class="category-pill">${vid.category}</span>
                <button class="btn btn-sm ${isWatched ? 'btn-success' : 'btn-outline'}" onclick="LearningVM.toggleWatched('${vid.id}')">
                  ${isWatched ? '✅ Watched' : '⬜ Mark Watched'}
                </button>
              </div>
              <h3 class="video-title">${vid.title}</h3>
              <p class="video-desc">${vid.description}</p>
              <div class="video-topics"><small class="text-muted">Topics: ${vid.topics}</small></div>
              <div class="video-card-footer">
                <a href="${vid.url}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">
                  ▶️ ${vid.isDirectVideo ? 'Watch on YouTube' : 'Search on YouTube'} ↗
                </a>
                <small class="text-muted">${vid.isDirectVideo ? 'Direct video link' : 'Opens YouTube search in browser'}</small>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }
};

window.LearningVM = LearningVM;
