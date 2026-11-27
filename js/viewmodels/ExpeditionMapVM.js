// ScoutCare PH — Visayas Camping & Jamboree Expedition Planner ViewModel (MVVM)
// Comprehensive interactive map with 100% offline fallback and one-tap campout synchronization

const ExpeditionMapVM = {
  activeTab: 'map', // 'map' | 'directory' | 'jamboree' | 'calculator' | 'permits'
  selectedProvince: 'all',
  selectedType: 'all',
  searchQuery: '',
  selectedDestinationId: 'bohol-rajah-sikatuna',
  mapInstance: null,
  mapMarkers: [],
  isOfflineMode: !navigator.onLine,
  transportInputs: {
    scoutsCount: 24,
    leadersCount: 4,
    daysCount: 3,
    busFareOneWay: 180,
    vanRentPerDay: 4200,
    elfTruckFlat: 5000,
    ferryTicketPerHead: 300,
    useVan: true,
    useElfTruck: true,
    useFerry: false
  },

  init() {
    window.addEventListener('online', () => {
      this.isOfflineMode = false;
      this.render();
    });
    window.addEventListener('offline', () => {
      this.isOfflineMode = true;
      this.render();
    });
  },

  setTab(tab) {
    this.activeTab = tab;
    this.render();
  },

  setProvince(prov) {
    this.selectedProvince = prov;
    this.render();
  },

  setType(type) {
    this.selectedType = type;
    this.render();
  },

  setSearch(q) {
    this.searchQuery = q;
    this.render();
  },

  selectDestination(id) {
    this.selectedDestinationId = id;
    this.render();
    if (this.activeTab === 'map' && this.mapInstance && window.L) {
      const dest = window.VisayasDirectory.getDestinationById(id);
      if (dest) {
        this.mapInstance.setView([dest.coordinates.lat, dest.coordinates.lng], 13);
      }
    }
    // Scroll selected card into view if in directory mode
    const el = document.getElementById(`dest-card-${id}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  },

  setAsUpcomingCampout(id) {
    const dest = window.VisayasDirectory.getDestinationById(id);
    if (!dest) return;

    const state = window.scoutState.getState();
    state.campoutInfo.name = dest.name;
    state.campoutInfo.location = `${dest.municipality}, ${dest.province}`;
    state.campoutInfo.hazards = dest.hazards || [];

    // Auto-add customized destination preparation tasks if not already present
    const existingTitles = new Set((state.todoTasks || []).map(t => t.text.toLowerCase()));
    const customTasks = [
      { text: `Obtain ${dest.clearanceType}-Clearance for ${dest.name}`, category: "prep", priority: "high" },
      { text: `Pre-register with ${dest.medical.mdrrmoOffice} (${dest.medical.mdrrmoContact})`, category: "safety", priority: "high" },
      { text: `Map evacuation route to ${dest.medical.nearestHospital} (${dest.medical.distanceKm} km, ~${dest.medical.drivingMins} mins)`, category: "safety", priority: "high" },
      { text: `Check water potability requirement (${dest.waterPotability})`, category: "equipment", priority: "medium" }
    ];

    if (dest.signalStrength === 'none') {
      customTasks.push({ text: `Pack VHF two-way radios & test batteries (Dead Zone Alert)`, category: "equipment", priority: "high" });
    }

    customTasks.forEach(task => {
      if (!existingTitles.has(task.text.toLowerCase())) {
        state.todoTasks.push({
          id: `task-sync-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          text: task.text,
          category: task.category,
          priority: task.priority,
          completed: false
        });
      }
    });

    window.scoutState.save();
    window.DashboardVM.render();

    // Play celebration audio feedback
    if (window.AudioEngine) window.AudioEngine.playSuccessFanfare();

    // Show toast confirmation
    window.App.showToast(`⛺ "${dest.name}" is now set as your Upcoming Campout! Synchronized with Dashboard & Checklist.`);
    this.render();
  },

  calculateTransportBudget() {
    const p = this.transportInputs;
    const totalPax = Number(p.scoutsCount) + Number(p.leadersCount);
    const vanCount = Math.ceil(totalPax / 14);

    let busTotal = totalPax * Number(p.busFareOneWay) * 2; // round trip
    let vanTotal = p.useVan ? (vanCount * Number(p.vanRentPerDay) * Number(p.daysCount)) : 0;
    let elfTotal = p.useElfTruck ? Number(p.elfTruckFlat) : 0;
    let ferryTotal = p.useFerry ? (totalPax * Number(p.ferryTicketPerHead) * 2) : 0;

    let grandTotal = (p.useVan ? vanTotal : busTotal) + elfTotal + ferryTotal;
    let costPerScout = p.scoutsCount > 0 ? Math.ceil(grandTotal / p.scoutsCount) : 0;

    return {
      totalPax,
      vanCount,
      busTotal,
      vanTotal,
      elfTotal,
      ferryTotal,
      grandTotal,
      costPerScout
    };
  },

  updateTransportInput(field, val) {
    this.transportInputs[field] = val;
    this.render();
  },

  exportDirectoryCSV() {
    const list = window.VisayasDirectory.getAllDestinations();
    const headers = [
      "Province", "Destination Name", "Municipality", "Category", "Capacity", 
      "Signal Strength", "Water Potability", "Clearance Type", "Nearest Hospital", 
      "Hospital Level", "Distance (km)", "Drive Time (mins)", "MDRRMO Contact", "Suitability Score"
    ];

    const rows = list.map(d => [
      `"${d.province}"`,
      `"${d.name.replace(/"/g, '""')}"`,
      `"${d.municipality}"`,
      `"${d.type}"`,
      `"${d.capacity}"`,
      `"${d.signalStrength.toUpperCase()}"`,
      `"${d.waterPotability.replace(/"/g, '""')}"`,
      `"${d.clearanceType}"`,
      `"${d.medical.nearestHospital.replace(/"/g, '""')}"`,
      `"${d.medical.hospitalLevel}"`,
      d.medical.distanceKm,
      d.medical.drivingMins,
      `"${d.medical.mdrrmoContact}"`,
      d.suitabilityScore
    ]);

    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `ScoutCare_PH_Visayas_Destinations_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.App.showToast("📄 Visayas Destinations Directory exported to CSV!");
  },

  render() {
    const container = document.getElementById('expedition-view');
    if (!container) return;

    const currentCampoutName = window.scoutState.getState().campoutInfo?.name || '';
    const filteredDestinations = window.VisayasDirectory.filterDestinations(
      this.selectedProvince,
      this.selectedType,
      this.searchQuery
    );

    const activeDest = window.VisayasDirectory.getDestinationById(this.selectedDestinationId) || filteredDestinations[0] || VISAYAS_DESTINATIONS[0];
    const isCurrentCampout = currentCampoutName.toLowerCase() === activeDest.name.toLowerCase();

    container.innerHTML = `
      <!-- Expedition Top Bar -->
      <div class="screen-header mb-3">
        <div class="screen-title-group">
          <span class="badge-tag">BSP Visayas Region</span>
          <h1 class="screen-title">⚜️ Visayas Scout Expedition Map</h1>
          <p class="screen-subtitle">48 Main Destinations • 30 Jamboree Candidates • 100% Offline Emergency Directory</p>
        </div>
        <div class="screen-header-actions">
          <button class="btn btn-sm btn-outline-light" onclick="ExpeditionMapVM.exportDirectoryCSV()" title="Export Directory to CSV">
            📥 CSV Export
          </button>
        </div>
      </div>

      <!-- Offline Status Banner -->
      ${this.isOfflineMode ? `
        <div class="offline-callout-banner glass-card mb-3">
          <div class="callout-icon">📡</div>
          <div class="callout-body">
            <strong>OFFLINE FIELD MODE ACTIVE</strong>
            <p>No cellular data connection detected. Map tiles are safely bypassed; all 78 destinations, emergency numbers, and hospital evacuation routes remain 100% accessible!</p>
          </div>
        </div>
      ` : ''}

      <!-- Expedition Navigation Tabs -->
      <div class="expedition-tabs mb-3">
        <button class="exp-tab-btn ${this.activeTab === 'map' ? 'active' : ''}" onclick="ExpeditionMapVM.setTab('map')">
          🗺️ Interactive Map
        </button>
        <button class="exp-tab-btn ${this.activeTab === 'directory' ? 'active' : ''}" onclick="ExpeditionMapVM.setTab('directory')">
          📋 48 Destinations (${filteredDestinations.length})
        </button>
        <button class="exp-tab-btn ${this.activeTab === 'jamboree' ? 'active' : ''}" onclick="ExpeditionMapVM.setTab('jamboree')">
          🏕️ 30 Jamboree Venues
        </button>
        <button class="exp-tab-btn ${this.activeTab === 'calculator' ? 'active' : ''}" onclick="ExpeditionMapVM.setTab('calculator')">
          🚌 Transport Calculator
        </button>
        <button class="exp-tab-btn ${this.activeTab === 'permits' ? 'active' : ''}" onclick="ExpeditionMapVM.setTab('permits')">
          📜 Permits & Clearances
        </button>
      </div>

      <!-- Search & Province Filter Bar -->
      <div class="glass-card expedition-filters-card mb-3">
        <div class="search-input-group">
          <span class="search-icon">🔍</span>
          <input type="text" class="input-field" placeholder="Search campsites, peaks, falls, hospitals..." 
            value="${this.searchQuery}" oninput="ExpeditionMapVM.setSearch(this.value)">
          ${this.searchQuery ? `<button class="btn-clear-search" onclick="ExpeditionMapVM.setSearch('')">✕</button>` : ''}
        </div>

        <div class="filters-row mt-2">
          <div class="filter-col">
            <label class="filter-lbl">Province:</label>
            <select class="input-select" onchange="ExpeditionMapVM.setProvince(this.value)">
              <option value="all" ${this.selectedProvince === 'all' ? 'selected' : ''}>All 6 Provinces (Visayas)</option>
              <option value="Cebu" ${this.selectedProvince === 'Cebu' ? 'selected' : ''}>Cebu (8)</option>
              <option value="Bohol" ${this.selectedProvince === 'Bohol' ? 'selected' : ''}>Bohol (8)</option>
              <option value="Antique" ${this.selectedProvince === 'Antique' ? 'selected' : ''}>Antique (8)</option>
              <option value="Negros Oriental" ${this.selectedProvince === 'Negros Oriental' ? 'selected' : ''}>Negros Oriental (8)</option>
              <option value="Siquijor" ${this.selectedProvince === 'Siquijor' ? 'selected' : ''}>Siquijor (8)</option>
              <option value="Samar" ${this.selectedProvince === 'Samar' ? 'selected' : ''}>Samar (8)</option>
            </select>
          </div>

          <div class="filter-col">
            <label class="filter-lbl">Category:</label>
            <select class="input-select" onchange="ExpeditionMapVM.setType(this.value)">
              <option value="all" ${this.selectedType === 'all' ? 'selected' : ''}>All Categories</option>
              <option value="Scout Camp" ${this.selectedType === 'Scout Camp' ? 'selected' : ''}>Scout Camps</option>
              <option value="Mountain" ${this.selectedType === 'Mountain' ? 'selected' : ''}>Mountains & Peaks</option>
              <option value="Beach" ${this.selectedType === 'Beach' ? 'selected' : ''}>Beaches & Coastal</option>
              <option value="River" ${this.selectedType === 'River' ? 'selected' : ''}>Rivers & Springs</option>
              <option value="Forest" ${this.selectedType === 'Forest' ? 'selected' : ''}>Forest Reserves</option>
              <option value="Waterfall" ${this.selectedType === 'Waterfall' ? 'selected' : ''}>Waterfalls & Canyons</option>
              <option value="Island" ${this.selectedType === 'Island' ? 'selected' : ''}>Islands & Sandbars</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Tab Content Area -->
      ${this.renderTabContent(activeDest, isCurrentCampout, filteredDestinations)}
    `;

    // If map tab is selected, trigger map initialization / vector render
    if (this.activeTab === 'map') {
      setTimeout(() => this.setupMapOrFallback(filteredDestinations), 50);
    }
  },

  renderTabContent(activeDest, isCurrentCampout, filteredDestinations) {
    if (this.activeTab === 'map') {
      return this.renderMapTab(activeDest, isCurrentCampout, filteredDestinations);
    } else if (this.activeTab === 'directory') {
      return this.renderDirectoryTab(filteredDestinations, activeDest);
    } else if (this.activeTab === 'jamboree') {
      return this.renderJamboreeTab();
    } else if (this.activeTab === 'calculator') {
      return this.renderCalculatorTab();
    } else if (this.activeTab === 'permits') {
      return this.renderPermitsTab();
    }
    return '';
  },

  renderMapTab(activeDest, isCurrentCampout, filteredDestinations) {
    return `
      <div class="expedition-map-layout">
        <!-- Interactive Map Container -->
        <div class="glass-card map-frame-container mb-3">
          <div class="map-view-header">
            <span class="map-status-pill">
              ${this.isOfflineMode ? '🔴 Offline Vector Fallback' : '🟢 Interactive Geographic Map'}
            </span>
            <span class="map-count-pill">${filteredDestinations.length} Sites Pinned</span>
          </div>

          <!-- Leaflet / Vector SVG Container -->
          <div id="visayas-leaflet-map" class="map-viewport"></div>
        </div>

        <!-- Selected Destination Detail Spotlight Card -->
        ${this.renderDestinationSpotlightCard(activeDest, isCurrentCampout)}
      </div>
    `;
  },

  renderDestinationSpotlightCard(dest, isCurrentCampout) {
    if (!dest) return '';

    const signalBadge = {
      full: '<span class="badge-signal full">🟢 Full 4G/5G</span>',
      intermittent: '<span class="badge-signal intermittent">🟡 Intermittent SMS</span>',
      none: '<span class="badge-signal none">🔴 Dead Zone (VHF Radio Required)</span>'
    }[dest.signalStrength] || '';

    const clearanceBadge = {
      A: '<span class="clearance-tag badge-a">Clearance [A]: BSP/GSP Council</span>',
      B: '<span class="clearance-tag badge-b">Clearance [B]: LGU & DepEd</span>',
      C: '<span class="clearance-tag badge-c">Clearance [C]: DENR / PAMB Protected Area</span>',
      D: '<span class="clearance-tag badge-d">Clearance [D]: Private / Barangay</span>'
    }[dest.clearanceType] || '';

    return `
      <div class="glass-card dest-spotlight-card mb-3" id="dest-card-${dest.id}">
        <div class="spotlight-top">
          <div class="spotlight-headline">
            <div class="badge-row mb-1">
              <span class="spotlight-prov-badge">${dest.province.toUpperCase()}</span>
              <span class="spotlight-type-badge">${dest.type}</span>
              ${signalBadge}
            </div>
            <h2 class="spotlight-title">${dest.name}</h2>
            <p class="spotlight-location">📍 ${dest.municipality}, ${dest.province} • Capacity: <strong>${dest.capacity}</strong></p>
          </div>
          <div class="spotlight-score-circle" title="Jamboree Suitability Score">
            <span class="score-num">${dest.suitabilityScore}</span>
            <span class="score-lbl">Score</span>
          </div>
        </div>

        <!-- One-Tap Action: Set as My Upcoming Campout -->
        <div class="spotlight-actions-bar mb-3">
          ${isCurrentCampout ? `
            <button class="btn btn-campout-active btn-lg w-100" disabled>
              ✅ CURRENTLY SET AS UPCOMING CAMPOUT
            </button>
          ` : `
            <button class="btn btn-primary btn-lg w-100" onclick="ExpeditionMapVM.setAsUpcomingCampout('${dest.id}')">
              ⛺ Set as My Upcoming Campout (Sync to Dashboard)
            </button>
          `}
        </div>

        <p class="spotlight-desc">${dest.description}</p>

        <!-- Facilities & Potability -->
        <div class="spotlight-details-grid mb-3">
          <div class="detail-box">
            <div class="detail-lbl">🚰 Water Potability:</div>
            <div class="detail-val">${dest.waterPotability}</div>
          </div>
          <div class="detail-box">
            <div class="detail-lbl">🏕️ Facilities Available:</div>
            <div class="facilities-pills">
              <span class="fac-pill ${dest.facilities.toilets ? 'yes' : 'no'}">${dest.facilities.toilets ? '✅ Toilets' : '❌ No Toilets'}</span>
              <span class="fac-pill ${dest.facilities.showers ? 'yes' : 'no'}">${dest.facilities.showers ? '✅ Showers' : '❌ No Showers'}</span>
              <span class="fac-pill ${dest.facilities.electricity ? 'yes' : 'no'}">${dest.facilities.electricity ? '✅ Electricity' : '❌ No Power'}</span>
              <span class="fac-pill ${dest.facilities.potableWater ? 'yes' : 'no'}">${dest.facilities.potableWater ? '✅ Potable Water' : '❌ Carry Water'}</span>
            </div>
          </div>
        </div>

        <!-- Clearance & Permits -->
        <div class="spotlight-permits-box glass-inset mb-3">
          <div class="d-flex align-items-center justify-content-between mb-1">
            <strong>📜 Required Clearance:</strong>
            ${clearanceBadge}
          </div>
          <p class="text-sm">${dest.clearanceDetails}</p>
        </div>

        <!-- Medical & Emergency Evacuation Box -->
        <div class="spotlight-medical-box glass-card-crimson mb-3">
          <div class="medical-header mb-1">
            <span class="medical-icon">🏥</span>
            <strong>Nearest Hospital & Medical Evacuation Route:</strong>
          </div>
          <div class="hospital-info">
            <div class="hosp-name"><strong>${dest.medical.nearestHospital}</strong> (${dest.medical.hospitalLevel})</div>
            <div class="hosp-metrics">
              <span class="metric-pill">🚗 ${dest.medical.distanceKm} km</span>
              <span class="metric-pill">⏱️ ~${dest.medical.drivingMins} mins road travel</span>
            </div>
          </div>
          <div class="mdrrmo-row mt-2">
            <span>🚨 <strong>${dest.medical.mdrrmoOffice}:</strong></span>
            <a href="tel:${dest.medical.mdrrmoContact.replace(/[^0-9]/g, '')}" class="btn btn-sm btn-outline-crimson">
              📞 ${dest.medical.mdrrmoContact}
            </a>
          </div>
        </div>

        <!-- Transport Estimates Box -->
        <div class="spotlight-transport-box glass-inset">
          <strong>🚐 Transportation Cost Estimates:</strong>
          <div class="transport-grid mt-1">
            <span>Bus: ~₱${dest.transportEstimates.busPerHead}/head</span>
            <span>Van Rental: ~₱${dest.transportEstimates.vanRentalPerDay}/day</span>
            ${dest.transportEstimates.ferryPerHead > 0 ? `<span>Ferry/Boat: ~₱${dest.transportEstimates.ferryPerHead}/head</span>` : '<span>Ferry: N/A (Mainland)</span>'}
            ${dest.transportEstimates.roroElfTruck > 0 ? `<span>RoRo Truck: ~₱${dest.transportEstimates.roroElfTruck}</span>` : '<span>Truck: Land Route</span>'}
          </div>
        </div>
      </div>
    `;
  },

  renderDirectoryTab(filteredDestinations, activeDest) {
    const currentCampoutName = window.scoutState.getState().campoutInfo?.name || '';

    return `
      <div class="destinations-directory-list">
        <div class="directory-summary-bar mb-2">
          <span>Showing <strong>${filteredDestinations.length}</strong> camping destinations in Visayas</span>
        </div>

        <div class="cards-grid">
          ${filteredDestinations.map(dest => {
            const isSelected = activeDest && activeDest.id === dest.id;
            const isCampout = currentCampoutName.toLowerCase() === dest.name.toLowerCase();

            return `
              <div class="glass-card dest-card ${isSelected ? 'active-selection' : ''}" onclick="ExpeditionMapVM.selectDestination('${dest.id}')">
                <div class="dest-card-header">
                  <div>
                    <span class="dest-prov-pill">${dest.province}</span>
                    <span class="dest-type-pill">${dest.type}</span>
                    <h3 class="dest-card-title">${dest.name}</h3>
                    <p class="dest-card-loc">📍 ${dest.municipality}</p>
                  </div>
                  <div class="dest-card-score">
                    <span class="score-val">${dest.suitabilityScore}</span>
                    <span class="score-tag">Score</span>
                  </div>
                </div>

                <p class="dest-card-desc text-muted mb-2">${dest.description.slice(0, 110)}...</p>

                <div class="dest-card-meta mb-2">
                  <span class="meta-tag">🏥 ${dest.medical.distanceKm} km to Hospital</span>
                  <span class="meta-tag">⏱️ ~${dest.medical.drivingMins} min</span>
                  <span class="meta-tag">${dest.signalStrength === 'full' ? '🟢 4G/5G' : dest.signalStrength === 'intermittent' ? '🟡 2G/SMS' : '🔴 Radio'}</span>
                </div>

                <div class="dest-card-actions">
                  <button class="btn btn-sm btn-outline-light" onclick="event.stopPropagation(); ExpeditionMapVM.selectDestination('${dest.id}'); ExpeditionMapVM.setTab('map')">
                    🗺️ View on Map
                  </button>
                  ${isCampout ? `
                    <button class="btn btn-sm btn-campout-active" disabled>
                      ✅ Upcoming Campout
                    </button>
                  ` : `
                    <button class="btn btn-sm btn-primary" onclick="event.stopPropagation(); ExpeditionMapVM.setAsUpcomingCampout('${dest.id}')">
                      ⛺ Set as Campout
                    </button>
                  `}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  },

  renderJamboreeTab() {
    const venues = window.VisayasDirectory.getAllCandidateVenues();
    return `
      <div class="jamboree-venues-view">
        <div class="glass-card mb-3">
          <h2>🏕️ 30 Candidate Scout Jamboree Venues (Visayas)</h2>
          <p class="text-muted">Evaluated for large troop gatherings, council camporees, and regional jamborees (500 to 5,000+ Scouts) based on terrain, water security, road access for 40-seater buses, and hospital proximity.</p>
        </div>

        <div class="jamboree-grid">
          ${venues.map((v, i) => `
            <div class="glass-card jamboree-card">
              <div class="jamboree-card-top">
                <span class="badge-tag">#${i + 1} • ${v.province}</span>
                <span class="suitability-pill">Score: <strong>${v.suitabilityScore}/100</strong></span>
              </div>
              <h3 class="jamboree-name mt-1">${v.name}</h3>
              <p class="jamboree-loc">📍 ${v.municipality}, ${v.province}</p>
              
              <div class="jamboree-details mt-2">
                <div class="j-row">👥 <strong>Capacity:</strong> ${v.capacity}</div>
                <div class="j-row">🚌 <strong>Bus Access:</strong> ${v.busAccess}</div>
                <div class="j-row">🚰 <strong>Water Source:</strong> ${v.waterAccess}</div>
                <div class="j-row">⚡ <strong>Power:</strong> ${v.electricGrid}</div>
                <div class="j-row">🏥 <strong>Hospital:</strong> ${v.nearestHospital}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  renderCalculatorTab() {
    const b = this.calculateTransportBudget();
    const p = this.transportInputs;

    return `
      <div class="glass-card calculator-card">
        <h2>🚌 Visayas Scout Expedition Transportation Calculator</h2>
        <p class="text-muted">Estimate group travel expenses for buses, 14-seater van convoys, equipment trucks, and RoRo ferry tickets across the Visayas.</p>

        <div class="calculator-form mt-3">
          <div class="calc-row">
            <div class="calc-field">
              <label>Number of Scouts:</label>
              <input type="number" class="input-field" value="${p.scoutsCount}" min="1" max="500" 
                oninput="ExpeditionMapVM.updateTransportInput('scoutsCount', this.value)">
            </div>
            <div class="calc-field">
              <label>Number of Adult Leaders:</label>
              <input type="number" class="input-field" value="${p.leadersCount}" min="1" max="50" 
                oninput="ExpeditionMapVM.updateTransportInput('leadersCount', this.value)">
            </div>
            <div class="calc-field">
              <label>Camp Duration (Days):</label>
              <input type="number" class="input-field" value="${p.daysCount}" min="1" max="14" 
                oninput="ExpeditionMapVM.updateTransportInput('daysCount', this.value)">
            </div>
          </div>

          <div class="calc-row mt-2">
            <div class="calc-field">
              <label>Public Bus Fare (One-way / person):</label>
              <input type="number" class="input-field" value="${p.busFareOneWay}" 
                oninput="ExpeditionMapVM.updateTransportInput('busFareOneWay', this.value)">
            </div>
            <div class="calc-field">
              <label>Van Rental (Daily rate / 14 pax):</label>
              <input type="number" class="input-field" value="${p.vanRentPerDay}" 
                oninput="ExpeditionMapVM.updateTransportInput('vanRentPerDay', this.value)">
            </div>
            <div class="calc-field">
              <label>RoRo / Ferry Ticket (One-way / pax):</label>
              <input type="number" class="input-field" value="${p.ferryTicketPerHead}" 
                oninput="ExpeditionMapVM.updateTransportInput('ferryTicketPerHead', this.value)">
            </div>
          </div>

          <div class="calc-checkboxes mt-2">
            <label class="checkbox-lbl">
              <input type="checkbox" ${p.useVan ? 'checked' : ''} 
                onchange="ExpeditionMapVM.updateTransportInput('useVan', this.checked)">
              Use Private Vans (${b.vanCount} van(s) needed for ${b.totalPax} pax)
            </label>
            <label class="checkbox-lbl">
              <input type="checkbox" ${p.useElfTruck ? 'checked' : ''} 
                onchange="ExpeditionMapVM.updateTransportInput('useElfTruck', this.checked)">
              Include Equipment Truck (₱${p.elfTruckFlat} flat)
            </label>
            <label class="checkbox-lbl">
              <input type="checkbox" ${p.useFerry ? 'checked' : ''} 
                onchange="ExpeditionMapVM.updateTransportInput('useFerry', this.checked)">
              Include Island Ferry / RoRo Crossings
            </label>
          </div>
        </div>

        <!-- Budget Result Summary Card -->
        <div class="calc-result-box glass-inset mt-3">
          <div class="result-headline">
            <div>
              <span class="text-muted">Total Expedition Transport Budget:</span>
              <h1 class="grand-total-val text-primary">₱${b.grandTotal.toLocaleString()}</h1>
            </div>
            <div class="text-right">
              <span class="text-muted">Estimated Cost per Scout:</span>
              <h2 class="per-scout-val text-warning">₱${b.costPerScout.toLocaleString()}</h2>
            </div>
          </div>

          <div class="result-breakdown mt-2">
            <div class="breakdown-item">
              <span>Vehicles (${p.useVan ? `${b.vanCount} Van(s)` : 'Ceres Public Bus'}):</span>
              <strong>₱${(p.useVan ? b.vanTotal : b.busTotal).toLocaleString()}</strong>
            </div>
            ${p.useElfTruck ? `
              <div class="breakdown-item">
                <span>Troop Equipment / Cookset Truck:</span>
                <strong>₱${b.elfTotal.toLocaleString()}</strong>
              </div>
            ` : ''}
            ${p.useFerry ? `
              <div class="breakdown-item">
                <span>Inter-Island Ferry Tickets (Round Trip):</span>
                <strong>₱${b.ferryTotal.toLocaleString()}</strong>
              </div>
            ` : ''}
          </div>
        </div>
      </div>
    `;
  },

  renderPermitsTab() {
    return `
      <div class="glass-card permits-guide-card">
        <h2>📜 Philippine Camping Permits & Government Clearances Guide</h2>
        <p class="text-muted">Every scout troop camping in the Philippines must comply with official BSP guidelines, Department of Education travel safety orders, and municipal ordinances.</p>

        <div class="permits-grid mt-3">
          <div class="permit-card glass-inset">
            <div class="permit-header badge-a">
              <span class="permit-code">[A]</span>
              <h3>BSP / GSP Council Clearance</h3>
            </div>
            <ul>
              <li><strong>Council Permit to Camp:</strong> Filed with Local Council HQ at least 15 days prior.</li>
              <li><strong>Parent / Guardian Consent Waivers:</strong> Signed medical consent forms for every scout minor.</li>
              <li><strong>Troop Insurance & Roster:</strong> Verified BSP membership and scout accident insurance.</li>
              <li><strong>Scoutmaster Safety Certification:</strong> Wood Badge or Certified Unit Leader in charge.</li>
            </ul>
          </div>

          <div class="permit-card glass-inset">
            <div class="permit-header badge-b">
              <span class="permit-code">[B]</span>
              <h3>LGU & DepEd Clearances</h3>
            </div>
            <ul>
              <li><strong>DepEd Travel Order:</strong> Required for school-based troops under DepEd safety advisories.</li>
              <li><strong>Mayor's Office Courtesy Notification:</strong> Written notice of troop presence in municipality.</li>
              <li><strong>MDRRMO Coordination:</strong> Pre-entry notification with local rescue hotlines logged.</li>
              <li><strong>Philippine National Police (PNP):</strong> Courtesy blotter log for troop security.</li>
            </ul>
          </div>

          <div class="permit-card glass-inset">
            <div class="permit-header badge-c">
              <span class="permit-code">[C]</span>
              <h3>DENR / PAMB Protected Areas</h3>
            </div>
            <ul>
              <li><strong>Protected Area Permit (SAPA):</strong> Issued by Protected Area Superintendent (PASu).</li>
              <li><strong>Leave No Trace (LNT) Orientation:</strong> Mandatory trash carry-in/carry-out pledge.</li>
              <li><strong>Solid Waste Bond:</strong> Refundable eco-deposit at ranger stations.</li>
              <li><strong>Accredited Community Guides:</strong> 1 guide per 5–7 scouts on national park trails.</li>
            </ul>
          </div>

          <div class="permit-card glass-inset">
            <div class="permit-header badge-d">
              <span class="permit-code">[D]</span>
              <h3>Barangay & Private Landowners</h3>
            </div>
            <ul>
              <li><strong>Barangay Entry & Environmental Fee:</strong> Official municipal receipt registration.</li>
              <li><strong>Landowner Campcraft Written Clearance:</strong> Authorization for ground fires or tent pegs.</li>
              <li><strong>Water Source Usage Etiquette:</strong> Respect community springs; zero soap in natural waters.</li>
              <li><strong>Indigenous People (IP) FPIC:</strong> Free, Prior, and Informed Consent where ancestral domains exist.</li>
            </ul>
          </div>
        </div>
      </div>
    `;
  },

  setupMapOrFallback(destinations) {
    const mapContainer = document.getElementById('visayas-leaflet-map');
    if (!mapContainer) return;

    // Check if Leaflet is available and online
    if (window.L && !this.isOfflineMode) {
      try {
        if (!this.mapInstance) {
          this.mapInstance = window.L.map('visayas-leaflet-map', {
            center: [10.1500, 123.8500],
            zoom: 7,
            minZoom: 6,
            maxZoom: 15
          });

          window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors | BSP ScoutCare PH',
            maxZoom: 18
          }).addTo(this.mapInstance);
        }

        // Clear previous markers
        this.mapMarkers.forEach(m => this.mapInstance.removeLayer(m));
        this.mapMarkers = [];

        // Add markers
        destinations.forEach(dest => {
          const marker = window.L.marker([dest.coordinates.lat, dest.coordinates.lng])
            .addTo(this.mapInstance)
            .bindPopup(`
              <div style="font-family: system-ui; min-width: 180px;">
                <strong>${dest.name}</strong><br>
                <small>📍 ${dest.municipality}, ${dest.province}</small><br>
                <span style="font-size: 11px; color: #10b981;">🏥 ${dest.medical.distanceKm} km to Hospital</span><br>
                <button onclick="ExpeditionMapVM.selectDestination('${dest.id}')" style="margin-top: 6px; padding: 4px 8px; background: #059669; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 11px;">
                  View Destination Details
                </button>
              </div>
            `);

          marker.on('click', () => {
            this.selectDestination(dest.id);
          });

          this.mapMarkers.push(marker);
        });

        return;
      } catch (err) {
        console.warn('Leaflet tile layer failed, falling back to offline vector map:', err);
      }
    }

    // Graceful Offline Interactive Vector Map (Zero dependencies, 100% reliable)
    this.renderOfflineVectorMap(mapContainer, destinations);
  },

  renderOfflineVectorMap(container, destinations) {
    // Beautiful interactive SVG map of the Visayas archipelago with clickable province regions and destination pins
    container.innerHTML = `
      <div class="vector-visayas-map">
        <svg viewBox="0 0 800 600" class="visayas-svg-viewport">
          <defs>
            <linearGradient id="seaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#0a2e24"/>
              <stop offset="100%" stop-color="#061c16"/>
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur"/>
              <feComposite in="SourceGraphic" in2="blur" operator="over"/>
            </filter>
          </defs>

          <!-- Sea Backdrop -->
          <rect width="800" height="600" fill="url(#seaGrad)" rx="12"/>

          <!-- Grid Coordinates -->
          <g stroke="rgba(255,255,255,0.05)" stroke-width="1">
            <line x1="0" y1="150" x2="800" y2="150"/>
            <line x1="0" y1="300" x2="800" y2="300"/>
            <line x1="0" y1="450" x2="800" y2="450"/>
            <line x1="200" y1="0" x2="200" y2="600"/>
            <line x1="400" y1="0" x2="400" y2="600"/>
            <line x1="600" y1="0" x2="600" y2="600"/>
          </g>

          <!-- Island Masses (Visayas Stylized Geo-Polygons) -->
          <!-- Panay / Antique -->
          <path d="M 120 180 L 160 140 L 230 150 L 220 280 L 140 290 Z" fill="#1b4d3e" stroke="#2d6a4f" stroke-width="2" class="island-path" onclick="ExpeditionMapVM.setProvince('Antique')"/>
          <text x="140" y="220" fill="#a7f3d0" font-size="12" font-weight="bold">ANTIQUE / PANAY</text>

          <!-- Negros Oriental -->
          <path d="M 230 290 L 290 280 L 270 460 L 210 470 Z" fill="#1b4d3e" stroke="#2d6a4f" stroke-width="2" class="island-path" onclick="ExpeditionMapVM.setProvince('Negros Oriental')"/>
          <text x="220" y="380" fill="#a7f3d0" font-size="12" font-weight="bold">NEGROS ORIENTAL</text>

          <!-- Cebu Island -->
          <path d="M 330 180 L 370 160 L 360 380 L 310 420 L 330 290 Z" fill="#245c4b" stroke="#34d399" stroke-width="2" class="island-path" onclick="ExpeditionMapVM.setProvince('Cebu')"/>
          <text x="350" y="270" fill="#6ee7b7" font-size="13" font-weight="bold">CEBU</text>

          <!-- Bohol Island -->
          <path d="M 380 340 L 460 330 L 480 390 L 420 420 Z" fill="#245c4b" stroke="#34d399" stroke-width="2" class="island-path" onclick="ExpeditionMapVM.setProvince('Bohol')"/>
          <text x="410" y="375" fill="#fef08a" font-size="13" font-weight="bold">BOHOL</text>

          <!-- Siquijor Island -->
          <circle cx="320" cy="480" r="24" fill="#2d6a4f" stroke="#a7f3d0" stroke-width="2" class="island-path" onclick="ExpeditionMapVM.setProvince('Siquijor')"/>
          <text x="290" y="485" fill="#fef08a" font-size="11" font-weight="bold">SIQUIJOR</text>

          <!-- Samar Island -->
          <path d="M 520 120 L 620 90 L 660 220 L 590 300 L 530 250 Z" fill="#1b4d3e" stroke="#2d6a4f" stroke-width="2" class="island-path" onclick="ExpeditionMapVM.setProvince('Samar')"/>
          <text x="560" y="190" fill="#a7f3d0" font-size="13" font-weight="bold">SAMAR</text>

          <!-- Interactive Destination Markers on Vector Map -->
          ${destinations.map(dest => {
            // Project lat/lng into SVG coordinates (Rough Visayas bounding box: Lat 9-13, Lng 121-126)
            const minLat = 9.0, maxLat = 12.8;
            const minLng = 121.5, maxLng = 125.8;

            const x = Math.max(50, Math.min(750, ((dest.coordinates.lng - minLng) / (maxLng - minLng)) * 700 + 50));
            const y = Math.max(50, Math.min(550, 600 - (((dest.coordinates.lat - minLat) / (maxLat - minLat)) * 500 + 50)));

            const isSelected = this.selectedDestinationId === dest.id;
            const color = isSelected ? '#f59e0b' : '#10b981';

            return `
              <g class="svg-map-pin" onclick="ExpeditionMapVM.selectDestination('${dest.id}')" style="cursor: pointer;">
                <circle cx="${x}" cy="${y}" r="${isSelected ? 8 : 5}" fill="${color}" stroke="#ffffff" stroke-width="1.5" filter="${isSelected ? 'url(#glow)' : ''}"/>
                ${isSelected ? `
                  <text x="${x}" y="${y - 12}" fill="#f59e0b" font-size="11" font-weight="bold" text-anchor="middle" stroke="#000" stroke-width="2" paint-order="stroke fill">
                    ${dest.name}
                  </text>
                ` : ''}
              </g>
            `;
          }).join('')}
        </svg>

        <div class="vector-map-overlay-footer">
          <span>💡 Tap any island or pin to inspect destinations & medical evacuation plans.</span>
        </div>
      </div>
    `;
  }
};

window.ExpeditionMapVM = ExpeditionMapVM;
