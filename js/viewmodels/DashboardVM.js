// ScoutCare PH — Camping Preparation Dashboard ViewModel
const DashboardVM = {
  init() {
    this.render();
    window.scoutState.subscribe(() => {
      if (window.App && (window.App.currentView === 'dashboard' || window.App.currentView === 'leader-dashboard')) {
        this.render();
      }
    });
  },

  render() {
    const container = document.getElementById('dashboard-view');
    if (!container) return;

    const state = window.scoutState.getState();
    const user = state.currentUser;
    const prep = window.scoutState.getPrepStats();
    const kitStats = window.scoutState.getKitStats();
    const adherence = window.scoutState.getMedicineAdherenceStats();
    const campout = state.campoutInfo || {};
    const urgentTodos = (state.todos || []).filter(t => !t.completed && t.priority === 'High').slice(0, 3);

    const isLeader = user.role === 'leader';
    const isGuardian = user.role === 'guardian';

    container.innerHTML = `
      <div class="screen-header">
        <div class="screen-title-group">
          <span class="badge-tag">🇵🇭 ${user.troop}</span>
          <h1 class="screen-title">${window.I18n ? window.I18n.t('home_dashboard') : 'Camping Prep Dashboard'}</h1>
          <p class="screen-subtitle">Mabuhay, <strong>${user.name}</strong> • ${user.rank} (${user.role.toUpperCase()})</p>
        </div>
        <button class="btn btn-sm btn-outline" onclick="App.openRoleModal()">Switch Role</button>
      </div>

      <!-- Upcoming Campout Countdown Banner -->
      <div class="glass-card campout-countdown-card">
        <div class="campout-top">
          <div>
            <span class="badge-tag" style="background:rgba(245,158,11,0.25); color:#FCD116;">⛺ Upcoming Campout</span>
            <h3>${campout.title || 'Troop Weekend Camp'}</h3>
            <p class="text-muted">📍 ${campout.location} • 📅 ${campout.date}</p>
          </div>
          <div class="countdown-box">
            <span class="countdown-num">${prep.daysToCampout >= 0 ? prep.daysToCampout : 0}</span>
            <span class="countdown-lbl">Days Left</span>
          </div>
        </div>
        <div class="campout-actions-row">
          <button class="btn btn-sm btn-outline" onclick="DashboardVM.openEditCampoutModal()">✏️ Set Camp Date</button>
          <button class="btn btn-sm btn-outline" onclick="App.navigateTo('camping')">⛈️ PAGASA Signal: ${campout.pagasaSignal > 0 ? 'Signal #' + campout.pagasaSignal : 'Normal'}</button>
        </div>
      </div>

      <!-- Overall Preparation Ring + Metrics -->
      <div class="glass-card prep-overview-card">
        <div class="prep-ring-col">
          <div class="readiness-circle" style="background: conic-gradient(#F59E0B ${prep.overallPrepPercent * 3.6}deg, rgba(255,255,255,0.15) 0deg);">
            <div class="readiness-inner">
              <span class="readiness-val">${prep.overallPrepPercent}%</span>
              <span class="readiness-tag">${window.I18n ? window.I18n.t('overall_prep') : 'Overall'}</span>
            </div>
          </div>
        </div>
        <div class="prep-stats-col">
          <div class="prep-stat-line">
            <span>${window.I18n ? window.I18n.t('total_tasks') : 'Total Tasks'}:</span>
            <strong>${prep.totalTasks}</strong>
          </div>
          <div class="prep-stat-line">
            <span>${window.I18n ? window.I18n.t('completed_tasks') : 'Completed'}:</span>
            <strong class="text-success">${prep.completedTasks}</strong>
          </div>
          <div class="prep-stat-line">
            <span>${window.I18n ? window.I18n.t('remaining_tasks') : 'Remaining'}:</span>
            <strong class="text-warning">${prep.remainingTasks}</strong>
          </div>
          <button class="btn btn-sm btn-primary" style="margin-top:8px; width:100%;" onclick="App.navigateTo('todo')">
            ✅ Open To-Do Checklist
          </button>
        </div>
      </div>

      <!-- Sub-Readiness Progress Bars -->
      <div class="glass-card">
        <h3>📊 Readiness Breakdown</h3>
        <div class="progress-item-row" onclick="App.navigateTo('kit')">
          <div class="prog-label"><span>🎒 First Aid Kit Readiness</span><strong>${prep.kitReadiness}%</strong></div>
          <div class="progress-bar-track"><div class="progress-bar-fill" style="width:${prep.kitReadiness}%;"></div></div>
        </div>
        <div class="progress-item-row" onclick="App.navigateTo('todo')">
          <div class="prog-label"><span>⛺ Camping Equipment Readiness</span><strong>${prep.equipmentReadiness}%</strong></div>
          <div class="progress-bar-track"><div class="progress-bar-fill" style="width:${prep.equipmentReadiness}%; background:#F59E0B;"></div></div>
        </div>
        <div class="progress-item-row" onclick="App.navigateTo('firstaid')">
          <div class="prog-label"><span>📖 First-Aid Lessons Completed</span><strong>${prep.lessonsCompleted}/10</strong></div>
          <div class="progress-bar-track"><div class="progress-bar-fill" style="width:${prep.lessonsCompleted * 10}%; background:#38BDF8;"></div></div>
        </div>
      </div>

      <!-- Important Reminders -->
      ${(kitStats.expired > 0 || kitStats.shoppingCount > 0 || urgentTodos.length > 0) ? `
        <div class="glass-card reminders-card">
          <h3>🔔 Important Reminders Before Camping</h3>
          <ul class="reminder-list">
            ${kitStats.expired > 0 ? `
              <li class="rem-danger" onclick="App.navigateTo('kit')">
                <span>🚨 <strong>${kitStats.expired} expired item(s)</strong> in your First-Aid Kit (e.g., Betadine). Tap to inspect!</span>
              </li>
            ` : ''}
            ${kitStats.shoppingCount > 0 ? `
              <li class="rem-warn" onclick="App.navigateTo('kit')">
                <span>🛒 <strong>${kitStats.shoppingCount} supply item(s)</strong> need to be bought or restocked.</span>
              </li>
            ` : ''}
            ${urgentTodos.map(t => `
              <li class="rem-info" onclick="App.navigateTo('todo')">
                <span>📌 <strong>To-Do:</strong> ${t.title} <small>(${t.category})</small></span>
              </li>
            `).join('')}
          </ul>
        </div>
      ` : ''}

      <!-- Quick Access Modules Grid -->
      <div class="dashboard-metrics-grid">
        <div class="glass-card metric-card" onclick="App.navigateTo('essentials')">
          <div class="metric-icon">🧭</div>
          <div class="metric-title">10 Essentials</div>
          <small class="text-muted">PH Survival Gear</small>
        </div>

        <div class="glass-card metric-card" onclick="App.navigateTo('camping')">
          <div class="metric-icon">🌡️</div>
          <div class="metric-title">Heat Index & Signal</div>
          <small class="text-muted">PAGASA Calculator</small>
        </div>

        <div class="glass-card metric-card" onclick="App.navigateTo('videos')">
          <div class="metric-icon">▶️</div>
          <div class="metric-title">YouTube Training</div>
          <small class="text-muted">${(state.watchedVideos || []).length} watched</small>
        </div>

        <div class="glass-card metric-card" onclick="App.navigateTo('incidents')">
          <div class="metric-icon">📝</div>
          <div class="metric-title">Incident Log</div>
          <small class="text-muted">${(state.incidentReports || []).length} logged</small>
        </div>
      </div>

      ${isGuardian ? this.renderGuardianOversightCard(user, adherence, kitStats) : ''}
      ${isLeader ? this.renderLeaderOversightCard(state, kitStats) : ''}
    `;
  },

  renderGuardianOversightCard(user, adherence, kitStats) {
    return `
      <div class="glass-card">
        <h3>🛡️ Parent / Guardian Supervision</h3>
        <p><strong>Supervised Scout:</strong> Juan dela Cruz (Troop 101-BSP)</p>
        <p><strong>Medicine Adherence:</strong> ${adherence.adherenceRate}% (${adherence.taken} taken) • <strong>Kit:</strong> ${kitStats.readinessScore}%</p>
        <div style="margin-top:8px; display:flex; gap:8px; flex-wrap:wrap;">
          <button class="btn btn-sm btn-primary" onclick="App.navigateTo('medicines')">Review Prescriptions 💊</button>
          <button class="btn btn-sm btn-outline" onclick="App.navigateTo('kit')">Check Medical Supplies</button>
        </div>
      </div>
    `;
  },

  renderLeaderOversightCard(state, kitStats) {
    return `
      <div class="glass-card">
        <h3>🧭 Scoutmaster Troop Safety Roster</h3>
        <p class="text-muted"><small>🔒 Health Privacy Firewall Active: Individual prescriptions are hidden from leaders; only critical allergies and emergency contacts appear.</small></p>
        <div class="roster-cards-mobile" style="margin-top:8px;">
          <div class="history-card-row">
            <strong>Juan dela Cruz</strong> — Kalayaan Patrol<br>
            <small>Allergies: <span class="text-warning">Sulfa drugs, Shellfish</span> • Contact: 09171234567</small>
          </div>
          <div class="history-card-row">
            <strong>Marco Bautista</strong> — Kalayaan Patrol<br>
            <small>Allergies: <span class="text-danger">Peanuts (EpiPen)</span> • Contact: 09189876543</small>
          </div>
        </div>
        <button class="btn btn-sm btn-primary" style="margin-top:8px;" onclick="App.navigateTo('incidents')">➕ Log Camp Incident</button>
      </div>
    `;
  },

  openEditCampoutModal() {
    const camp = window.scoutState.getState().campoutInfo || {};
    const modalHtml = `
      <div class="modal-overlay" id="campout-modal">
        <div class="modal-card glass-modal">
          <div class="modal-header">
            <h3>⛺ Set Upcoming Campout</h3>
            <button class="modal-close" onclick="DashboardVM.closeModal()">✕</button>
          </div>
          <form onsubmit="DashboardVM.handleCampoutSave(event)">
            <div class="form-group">
              <label class="form-label">Campout / Activity Title *</label>
              <input type="text" id="camp-title" class="input-field" required value="${camp.title || ''}">
            </div>
            <div class="form-group">
              <label class="form-label">Camping Date *</label>
              <input type="date" id="camp-date" class="input-field" required value="${camp.date || ''}">
            </div>
            <div class="form-group">
              <label class="form-label">Philippine Location</label>
              <select id="camp-loc" class="input-field">
                ${(window.PH_CAMPING_LOCATIONS || []).map(l => `<option value="${l.name}" ${camp.location === l.name ? 'selected' : ''}>${l.name}</option>`).join('')}
              </select>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-outline" onclick="DashboardVM.closeModal()">Cancel</button>
              <button type="submit" class="btn btn-primary">Save Campout</button>
            </div>
          </form>
        </div>
      </div>
    `;
    document.getElementById('modal-container').innerHTML = modalHtml;
  },

  handleCampoutSave(event) {
    event.preventDefault();
    window.scoutState.updateCampoutInfo({
      title: document.getElementById('camp-title').value.trim(),
      date: document.getElementById('camp-date').value,
      location: document.getElementById('camp-loc').value
    });
    this.closeModal();
    if (window.App) window.App.showToast('Upcoming campout updated!', 'success');
  },

  closeModal() {
    const m = document.getElementById('campout-modal');
    if (m) m.remove();
  }
};

window.DashboardVM = DashboardVM;
window.DashboardModule = DashboardVM;
