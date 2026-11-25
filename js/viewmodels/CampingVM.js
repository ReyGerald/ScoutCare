// ScoutCare PH — Camping & Tropical Safety ViewModel (PAGASA Signal & PH Heat Index)
const CampingVM = {
  tempC: 33,
  humidityPct: 70,

  init() {
    this.render();
    window.scoutState.subscribe(() => {
      if (window.App && window.App.currentView === 'camping') {
        this.render();
      }
    });
  },

  // Official PAGASA / NOAA Heat Index Formula in °C
  calculateHeatIndexC(T, RH) {
    if (T < 27) return T;
    const hi =
      -8.78469475556 +
      1.61139411 * T +
      2.33854883889 * RH -
      0.14611605 * T * RH -
      0.012308094 * T * T -
      0.0164248277778 * RH * RH +
      0.002211732 * T * T * RH +
      0.00072546 * T * RH * RH -
      0.000003582 * T * T * RH * RH;
    return Math.round(hi * 10) / 10;
  },

  getHeatIndexBand(hi) {
    if (hi >= 52) {
      return { level: 'EXTREME DANGER', color: '#A855F7', advice: 'Heat stroke imminent! STOP all outdoor hiking immediately and cool down in shade.' };
    } else if (hi >= 42) {
      return { level: 'DANGER', color: '#EF4444', advice: 'Heat cramps & heat exhaustion likely; heat stroke probable with continued activity.' };
    } else if (hi >= 33) {
      return { level: 'EXTREME CAUTION', color: '#F97316', advice: 'Heat cramps and exhaustion possible. Drink Hydrite/water every 15–20 mins and rest in shade.' };
    } else if (hi >= 27) {
      return { level: 'CAUTION', color: '#FACC15', advice: 'Fatigue possible with prolonged exposure. Wear hat, sunscreen, and hydrate regularly.' };
    }
    return { level: 'NORMAL', color: '#34C759', advice: 'Comfortable Philippine trail temperature. Still carry at least 2L water.' };
  },

  getPagasaSignalInfo(signal) {
    const s = parseInt(signal, 10) || 0;
    if (s === 1) return { color: '#FACC15', title: 'Signal No. 1 (30–60 kph)', msg: 'High winds possible — secure tent guy lines, check rain ponchos, monitor PAGASA updates.' };
    if (s === 2) return { color: '#F97316', title: 'Signal No. 2 (61–120 kph)', msg: 'Moderate to heavy winds & flood risk — strongly consider postponing outdoor campout.' };
    if (s === 3) return { color: '#EF4444', title: 'Signal No. 3 (121–185 kph)', msg: 'DANGEROUS CONDITIONS — Cancel campout immediately and seek sturdy concrete shelter.' };
    if (s === 4) return { color: '#A855F7', title: 'Signal No. 4 (185+ kph)', msg: 'EXTREME TYPHOON DANGER — Evacuate immediately. Do NOT proceed with camping.' };
    return { color: '#34C759', title: 'No Tropical Cyclone Wind Signal', msg: 'Monitor local PAGASA forecasts for sudden afternoon tropical thunderstorms.' };
  },

  render() {
    const container = document.getElementById('camping-view');
    if (!container) return;

    const state = window.scoutState.getState();
    const campout = state.campoutInfo || {};
    const hi = this.calculateHeatIndexC(this.tempC, this.humidityPct);
    const hiBand = this.getHeatIndexBand(hi);
    const sigInfo = this.getPagasaSignalInfo(campout.pagasaSignal);
    const selectedLoc = (window.PH_CAMPING_LOCATIONS || []).find(l => l.name === campout.location);

    container.innerHTML = `
      <div class="screen-header">
        <div class="screen-title-group">
          <span class="badge-tag">🇵🇭 Tropical Trail & Weather</span>
          <h1 class="screen-title">Philippine Camp Safety</h1>
          <p class="screen-subtitle">PAGASA Heat Index calculator, Typhoon Signal alerts, and PH hazard guides.</p>
        </div>
      </div>

      <!-- Upcoming Campout Location & PAGASA Signal Card -->
      <div class="glass-card">
        <h3>⛈️ PAGASA Weather & Destination Check</h3>
        <div class="form-row-2" style="margin-top:8px;">
          <div class="form-group">
            <label class="form-label">PH Camping Destination</label>
            <select class="input-field" onchange="CampingVM.updateLocation(this.value)">
              ${(window.PH_CAMPING_LOCATIONS || []).map(loc => `
                <option value="${loc.name}" ${campout.location === loc.name ? 'selected' : ''}>${loc.name}</option>
              `).join('')}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">PAGASA Wind Signal</label>
            <select class="input-field" onchange="CampingVM.updateSignal(this.value)">
              <option value="0" ${campout.pagasaSignal == 0 ? 'selected' : ''}>No Signal (Normal)</option>
              <option value="1" ${campout.pagasaSignal == 1 ? 'selected' : ''}>Signal No. 1</option>
              <option value="2" ${campout.pagasaSignal == 2 ? 'selected' : ''}>Signal No. 2</option>
              <option value="3" ${campout.pagasaSignal == 3 ? 'selected' : ''}>Signal No. 3</option>
              <option value="4" ${campout.pagasaSignal == 4 ? 'selected' : ''}>Signal No. 4</option>
            </select>
          </div>
        </div>

        ${selectedLoc ? `
          <div class="alert-box alert-info" style="margin-top:6px;">
            <span>📍</span>
            <div><strong>Terrain Advisory:</strong> ${selectedLoc.notes}</div>
          </div>
        ` : ''}

        <div class="alert-box" style="background: ${sigInfo.color}22; border-left: 4px solid ${sigInfo.color}; color: #FFF;">
          <span>🌪️</span>
          <div>
            <strong>${sigInfo.title}:</strong>
            <p>${sigInfo.msg}</p>
          </div>
        </div>
      </div>

      <!-- PAGASA Heat Index Calculator -->
      <div class="glass-card">
        <h3>🌡️ PAGASA Heat Index Calculator</h3>
        <p class="text-muted">High Philippine humidity makes the air feel much hotter than the thermometer shows.</p>

        <div class="calc-inputs-grid" style="margin-top:10px;">
          <div class="form-group">
            <label class="form-label">Air Temperature (°C):</label>
            <div class="range-with-val">
              <input type="range" min="24" max="42" step="1" value="${this.tempC}" oninput="CampingVM.updateTemp(this.value)">
              <span class="range-display-val">${this.tempC}°C</span>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Relative Humidity (%):</label>
            <div class="range-with-val">
              <input type="range" min="30" max="95" step="5" value="${this.humidityPct}" oninput="CampingVM.updateHumidity(this.value)">
              <span class="range-display-val">${this.humidityPct}%</span>
            </div>
          </div>
        </div>

        <div class="heat-index-result" style="border-left: 5px solid ${hiBand.color}; background: ${hiBand.color}20;">
          <div class="hi-number" style="color: ${hiBand.color};">${hi}°C</div>
          <div>
            <span class="status-pill" style="background:${hiBand.color}; color:#000;">${hiBand.level}</span>
            <p style="margin-top:4px; font-size:0.85rem;">${hiBand.advice}</p>
          </div>
        </div>
      </div>

      <!-- Philippine Outdoor Hazard Quick-Reference Cards -->
      <div class="glass-card">
        <h3>🇵🇭 Philippine Outdoor Hazard Guide</h3>
        <p class="text-muted">Safe, evidence-based responses for Philippine tropical camping conditions.</p>

        <div class="hazards-grid" style="margin-top:10px;">
          <div class="hazard-box">
            <h4>🦟 Dengue & Mosquitoes</h4>
            <p>Apply DEET repellent at dusk/dawn, wear long sleeves, sleep under nets, and remove stagnant water. Watch for fever 3–7 days post-camp.</p>
          </div>

          <div class="hazard-box">
            <h4>🌧️ Leptospirosis Prevention</h4>
            <p>Do NOT walk barefoot in floodwater or muddy camp trails after heavy rain. Cover all cuts with waterproof dressings.</p>
          </div>

          <div class="hazard-box">
            <h4>🐕 Rabies (Dog / Bat Bites)</h4>
            <p>The Philippines is rabies-endemic. Wash any bite immediately with soap and running water for 15 minutes, apply Betadine, and rush to a hospital for PEP vaccine.</p>
          </div>

          <div class="hazard-box">
            <h4>🪱 Leech (Limatik) Exposure</h4>
            <p>Do NOT burn or force-pull if near eyes. Slide a flat card/fingernail gently to detach. Clean bite with Betadine and cover with bandage.</p>
          </div>

          <div class="hazard-box">
            <h4>🪼 Jellyfish / Sea Urchin</h4>
            <p>Rinse jellyfish stings with <strong>seawater</strong> (NEVER fresh water). Remove tentacles with a card/stick. Vinegar if available. Do not rub.</p>
          </div>

          <div class="hazard-box">
            <h4>🐍 Snakebite Safety</h4>
            <p>Keep scout calm and still; immobilize limb. <strong>DO NOT cut, suck venom, apply ice, or apply a tourniquet.</strong> Call 911 / Red Cross 143 immediately.</p>
          </div>

          <div class="hazard-box">
            <h4>⚡ Thunderstorm 30-30 Rule</h4>
            <p>If thunder follows lightning within 30 seconds, seek shelter inside a sturdy building (never under lone trees). Wait 30 minutes after last thunder.</p>
          </div>

          <div class="hazard-box">
            <h4>💧 Food & Water Safety</h4>
            <p>Boil or purify creek water before drinking. Keep food sealed in coolers to prevent spoilage in tropical heat. Use Hydrite ORS for mild dehydration.</p>
          </div>
        </div>
      </div>
    `;
  },

  updateTemp(val) {
    this.tempC = parseInt(val, 10);
    this.render();
  },

  updateHumidity(val) {
    this.humidityPct = parseInt(val, 10);
    this.render();
  },

  updateLocation(loc) {
    window.scoutState.updateCampoutInfo({ location: loc });
  },

  updateSignal(sig) {
    window.scoutState.updateCampoutInfo({ pagasaSignal: parseInt(sig, 10) });
  }
};

window.CampingVM = CampingVM;
window.CampingModule = CampingVM;
