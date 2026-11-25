// ScoutCare PH — Emergency Assistance (SOS) ViewModel (Philippines Only)
const EmergencyVM = {
  isStrobeActive: false,
  strobeInterval: null,
  currentCoords: null,
  locationError: null,

  init() {
    this.render();
    window.scoutState.subscribe(() => {
      if (window.App && window.App.currentView === 'emergency') {
        this.render();
      }
    });
  },

  fetchLocation() {
    if (!navigator.geolocation) {
      this.locationError = 'Geolocation is not supported by your device.';
      this.render();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        this.currentCoords = {
          lat: pos.coords.latitude.toFixed(6),
          lng: pos.coords.longitude.toFixed(6),
          accuracy: Math.round(pos.coords.accuracy),
          altitude: pos.coords.altitude ? Math.round(pos.coords.altitude) + 'm' : 'N/A'
        };
        this.locationError = null;
        this.render();
      },
      (err) => {
        this.locationError = `Location unavailable: ${err.message}. Enable device GPS.`;
        this.render();
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  },

  render() {
    const container = document.getElementById('emergency-view');
    if (!container) return;

    const user = window.scoutState.getState().currentUser;

    container.innerHTML = `
      <div class="emergency-screen-banner">
        <div class="emergency-pulsing-icon">🚨</div>
        <h1 class="emergency-screen-title">${window.I18n ? window.I18n.t('emergency_title') : 'EMERGENCY ASSISTANCE (SOS)'}</h1>
        <p class="emergency-screen-sub">🇵🇭 Philippine Emergency Hotlines & Offline DRABC Protocol. Stay calm.</p>
      </div>

      <!-- Philippine Quick Emergency Dials -->
      <div class="sos-quick-calls-grid">
        <a href="tel:911" class="sos-call-card sos-911">
          <div class="call-icon">📞</div>
          <div class="call-details">
            <span class="call-number">CALL 911</span>
            <span class="call-label">National Emergency Hotline</span>
          </div>
        </a>

        <a href="tel:143" class="sos-call-card sos-poison">
          <div class="call-icon">➕</div>
          <div class="call-details">
            <span class="call-number">Red Cross 143</span>
            <span class="call-label">Philippine Red Cross (24/7)</span>
          </div>
        </a>

        <a href="tel:1555" class="sos-call-card sos-doh">
          <div class="call-icon">🏥</div>
          <div class="call-details">
            <span class="call-number">DOH 1555</span>
            <span class="call-label">Dept. of Health / Poison Info</span>
          </div>
        </a>

        <a href="tel:8911" class="sos-call-card sos-ndrrmc">
          <div class="call-icon">⛈️</div>
          <div class="call-details">
            <span class="call-number">NDRRMC 8911</span>
            <span class="call-label">Disaster & Rescue Response</span>
          </div>
        </a>

        <a href="tel:${user.guardianPhone || '09171234567'}" class="sos-call-card sos-guardian">
          <div class="call-icon">🛡️</div>
          <div class="call-details">
            <span class="call-number">${user.guardianName || 'Guardian'}</span>
            <span class="call-label">${user.guardianPhone || '09171234567'}</span>
          </div>
        </a>

        <a href="tel:09281234567" class="sos-call-card sos-leader">
          <div class="call-icon">🧭</div>
          <div class="call-details">
            <span class="call-number">Kuya Roel (SM)</span>
            <span class="call-label">09281234567 (Troop 101-BSP)</span>
          </div>
        </a>
      </div>

      <!-- OVERDOSE CAUTION #5: Overdose Signs & Action Emergency Card -->
      <div class="sos-solid-card sos-overdose-card">
        <h3>💊 SUSPECTED MEDICINE OVERDOSE / SOBRANG DOSIS</h3>
        <p><strong>Signs to Watch For:</strong> Extreme drowsiness or confusion, repeated vomiting, slow/difficult breathing, irregular heartbeat, or unresponsiveness.</p>
        <p style="margin-top:6px;"><strong>Immediate Action:</strong></p>
        <ul style="padding-left:1.2rem; margin-top:4px; font-size:0.88rem;">
          <li>Call <strong>911</strong> or <strong>DOH 1555</strong> / <strong>Red Cross 143</strong> immediately.</li>
          <li><strong>DO NOT</strong> give any more medicine or food.</li>
          <li><strong>DO NOT</strong> force vomiting unless instructed by medical personnel.</li>
          <li>Keep the medicine bottle/blister pack ready to show paramedics.</li>
        </ul>
      </div>

      <!-- GPS Distress Coordinates & Tools -->
      <div class="sos-solid-card">
        <h3>📍 GPS Distress Coordinates & Field Signals</h3>
        <p style="opacity:0.85; font-size:0.85rem;">Share exact location with 911, Red Cross 143, or Scoutmaster.</p>

        <div class="coords-display-box" style="margin-top:10px;">
          ${this.currentCoords ? `
            <div class="coords-values">
              <div><strong>Latitude:</strong> ${this.currentCoords.lat}° N</div>
              <div><strong>Longitude:</strong> ${this.currentCoords.lng}° E</div>
              <div><strong>Accuracy:</strong> ±${this.currentCoords.accuracy}m | <strong>Alt:</strong> ${this.currentCoords.altitude}</div>
            </div>
            <div class="coords-actions" style="margin-top:8px; display:flex; gap:8px; flex-wrap:wrap;">
              <button class="btn btn-outline-light" onclick="EmergencyVM.copyCoordinates()">📋 Copy GPS</button>
              <button class="btn btn-warning" onclick="EmergencyVM.shareLocationSms()">📱 SMS Location</button>
            </div>
          ` : `
            <div>
              <p style="margin-bottom:8px;">${this.locationError || 'GPS coordinates not yet acquired.'}</p>
              <button class="btn btn-warning" onclick="EmergencyVM.fetchLocation()">📡 Acquire GPS Coordinates</button>
            </div>
          `}
        </div>

        <div class="distress-tools-row" style="margin-top:12px; display:flex; flex-direction:column; gap:8px;">
          <button class="btn btn-warning" onclick="EmergencyVM.triggerWhistleDistress()">
            🔊 Sound 3 Whistle Blasts (Scout Distress Signal)
          </button>
          <button class="btn btn-outline-light" onclick="EmergencyVM.toggleStrobe()">
            🔦 ${this.isStrobeActive ? 'Stop Emergency Strobe' : 'Activate Visual SOS Strobe'}
          </button>
        </div>
      </div>

      <!-- DRABC Primary Survey Offline Guide -->
      <div class="sos-solid-card">
        <span class="badge-tag" style="background:#FFF; color:#991B1B;">First 60 Seconds</span>
        <h2 style="margin-top:4px;">DRABC Primary Assessment</h2>
        <div class="drabc-steps" style="margin-top:8px;">
          <div class="drabc-item">
            <div class="drabc-letter">D</div>
            <div class="drabc-info" style="color:#FFF;">
              <h4 style="color:#FCD116;">DANGER (Kaligtasan sa Lugar)</h4>
              <p style="color:rgba(255,255,255,0.9);">Check for landslides, flash floods, fallen power lines, snakes, or traffic before approaching.</p>
            </div>
          </div>
          <div class="drabc-item">
            <div class="drabc-letter">R</div>
            <div class="drabc-info">
              <h4 style="color:#FCD116;">RESPONSE (Malay)</h4>
              <p style="color:rgba(255,255,255,0.9);">Tap shoulders gently and ask loudly: <em>"Ayos ka lang ba? / Are you OK?"</em></p>
            </div>
          </div>
          <div class="drabc-item">
            <div class="drabc-letter">A</div>
            <div class="drabc-info">
              <h4 style="color:#FCD116;">AIRWAY (Daanan ng Hangin)</h4>
              <p style="color:rgba(255,255,255,0.9);">Gently perform Head-Tilt Chin-Lift if unresponsive. Check mouth for visible blockage.</p>
            </div>
          </div>
          <div class="drabc-item">
            <div class="drabc-letter">B</div>
            <div class="drabc-info">
              <h4 style="color:#FCD116;">BREATHING (Paghinga)</h4>
              <p style="color:rgba(255,255,255,0.9);">Check chest rise for 5–10 seconds. If not breathing normally, call 911 and begin trained CPR.</p>
            </div>
          </div>
          <div class="drabc-item">
            <div class="drabc-letter">C</div>
            <div class="drabc-info">
              <h4 style="color:#FCD116;">CIRCULATION (Pagdurugo)</h4>
              <p style="color:rgba(255,255,255,0.9);">Control heavy bleeding immediately with firm direct pressure using sterile gauze.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Other PH Hotlines -->
      <div class="sos-solid-card">
        <h3>🇵🇭 Additional Philippine Hotlines</h3>
        <ul style="padding-left:1.2rem; font-size:0.88rem; margin-top:6px;">
          <li><strong>PNP (Police):</strong> 117 or 911</li>
          <li><strong>BFP (Fire):</strong> 160 or 911</li>
          <li><strong>PGH Manila Emergency:</strong> (02) 8527-0000</li>
        </ul>
      </div>
    `;
  },

  triggerWhistleDistress() {
    if (window.AudioEngine) window.AudioEngine.playScoutDistressWhistle();
    if (window.App) window.App.showToast('Sounding 3-blast international Scout distress whistle!', 'warning');
  },

  toggleStrobe() {
    this.isStrobeActive = !this.isStrobeActive;
    const strobeOverlay = document.getElementById('strobe-screen-overlay');
    if (this.isStrobeActive) {
      strobeOverlay.style.display = 'block';
      let flash = false;
      this.strobeInterval = setInterval(() => {
        strobeOverlay.style.background = flash ? '#FFFFFF' : '#DC2626';
        flash = !flash;
      }, 250);
    } else {
      clearInterval(this.strobeInterval);
      if (strobeOverlay) strobeOverlay.style.display = 'none';
    }
    this.render();
  },

  copyCoordinates() {
    if (!this.currentCoords) return;
    const text = `SCOUT PH DISTRESS: Lat ${this.currentCoords.lat}, Lng ${this.currentCoords.lng} (±${this.currentCoords.accuracy}m)`;
    navigator.clipboard.writeText(text).then(() => {
      if (window.App) window.App.showToast('Copied GPS coordinates!', 'success');
    });
  },

  shareLocationSms() {
    if (!this.currentCoords) return;
    const body = encodeURIComponent(`SCOUTCARE PH SOS: Scout needs assistance. GPS: Lat ${this.currentCoords.lat}, Lng ${this.currentCoords.lng} (±${this.currentCoords.accuracy}m).`);
    window.location.href = `sms:?&body=${body}`;
  }
};

window.EmergencyVM = EmergencyVM;
window.EmergencyModule = EmergencyVM;
