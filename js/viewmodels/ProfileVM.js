// ScoutCare PH — Redesigned Profile & Settings ViewModel
const ProfileVM = {
  activeTab: 'profile', // 'profile' | 'settings'

  init() {
    this.render();
    window.scoutState.subscribe(() => {
      if (window.App && window.App.currentView === 'profile') {
        this.render();
      }
    });
  },

  setTab(tab) {
    this.activeTab = tab;
    this.render();
  },

  render() {
    const container = document.getElementById('profile-view');
    if (!container) return;

    const state = window.scoutState.getState();
    const user = state.currentUser;
    const settings = state.settings;

    container.innerHTML = `
      <div class="screen-header">
        <div class="screen-title-group">
          <span class="badge-tag">Account & Preferences</span>
          <h1 class="screen-title">${window.I18n ? window.I18n.t('profile') : 'Profile & Settings'}</h1>
          <p class="screen-subtitle">Manage your BSP profile, theme, Filipino/English language, and notifications.</p>
        </div>
      </div>

      <div class="pill-group">
        <button class="pill-btn ${this.activeTab === 'profile' ? 'active' : ''}" onclick="ProfileVM.setTab('profile')">
          ⚜️ My Profile
        </button>
        <button class="pill-btn ${this.activeTab === 'settings' ? 'active' : ''}" onclick="ProfileVM.setTab('settings')">
          ⚙️ ${window.I18n ? window.I18n.t('settings') : 'Settings'}
        </button>
      </div>

      ${this.activeTab === 'profile' ? this.renderProfileTab(user) : this.renderSettingsTab(user, settings)}
    `;
  },

  renderProfileTab(user) {
    return `
      <div class="glass-card profile-hero-card">
        <div class="profile-avatar-large" onclick="ProfileVM.openEditProfileModal()">${user.avatar || '⚜️'}</div>
        <div class="profile-hero-info">
          <h2>${user.name}</h2>
          <div class="profile-badges-row">
            <span class="role-badge-tag">${user.role.toUpperCase()}</span>
            <span class="badge-tag">${user.rank || 'Scout'}</span>
          </div>
          <p class="text-muted">@${user.username || 'scout_ph'} • ${user.troop}</p>
        </div>
      </div>

      <div class="glass-card">
        <div class="card-header-flex">
          <h3>📋 Scout & Contact Information</h3>
          <button class="btn btn-sm btn-primary" onclick="ProfileVM.openEditProfileModal()">✏️ Edit Profile</button>
        </div>

        <div class="profile-details-grid">
          <div class="detail-row">
            <span class="detail-label">Full Name</span>
            <span class="detail-val">${user.name}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Username</span>
            <span class="detail-val">@${user.username || 'juandelacruz_bsp'}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Email</span>
            <span class="detail-val">${user.email || 'Not set'}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Phone (PH)</span>
            <span class="detail-val">${user.phone || '09171234567'}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Troop / Council</span>
            <span class="detail-val">${user.troop}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Patrol</span>
            <span class="detail-val">${user.patrol}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">BSP Rank</span>
            <span class="detail-val">${user.rank}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Blood Type</span>
            <span class="detail-val">${user.bloodType || 'Unknown'}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Known Allergies</span>
            <span class="detail-val text-warning">${user.allergies || 'None reported'}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Emergency Contact</span>
            <span class="detail-val">${user.guardianName || 'Guardian'} (${user.guardianPhone || user.phone})</span>
          </div>
        </div>

        <div style="margin-top: 1rem; display: flex; gap: 0.5rem; flex-wrap: wrap;">
          <button class="btn btn-outline" onclick="App.openRoleModal()">👥 Switch Role (Scout / Guardian / Leader)</button>
          <button class="btn btn-outline" onclick="ProfileVM.openPasswordModal()">🔐 Change PIN / Password</button>
        </div>
      </div>
    `;
  },

  renderSettingsTab(user, settings) {
    return `
      <!-- Appearance -->
      <div class="glass-card">
        <h3>🎨 Appearance</h3>
        <div class="preference-row">
          <div>
            <strong>Theme Mode</strong>
            <p class="text-muted">Glassmorphism optimized for outdoor & night campouts.</p>
          </div>
          <select class="input-field compact-select" onchange="ProfileVM.updateSetting('theme', this.value)">
            <option value="dark" ${settings.theme === 'dark' ? 'selected' : ''}>🌙 Dark Forest (Recommended)</option>
            <option value="light" ${settings.theme === 'light' ? 'selected' : ''}>☀️ Light Forest</option>
            <option value="system" ${settings.theme === 'system' ? 'selected' : ''}>📱 System Default</option>
          </select>
        </div>
      </div>

      <!-- Application Settings -->
      <div class="glass-card">
        <h3>🌐 Application Settings</h3>

        <div class="preference-row">
          <div>
            <strong>${window.I18n ? window.I18n.t('language_label') : 'Language'}</strong>
            <p class="text-muted">Switch between English and Filipino (Tagalog).</p>
          </div>
          <select class="input-field compact-select" onchange="ProfileVM.changeLanguage(this.value)">
            <option value="en" ${settings.language === 'en' ? 'selected' : ''}>🇺🇸/🇵🇭 English</option>
            <option value="fil" ${settings.language === 'fil' ? 'selected' : ''}>🇵🇭 Filipino / Tagalog</option>
          </select>
        </div>

        <div class="preference-row">
          <div>
            <strong>Default Start Screen</strong>
            <p class="text-muted">Choose which screen opens when launching ScoutCare.</p>
          </div>
          <select class="input-field compact-select" onchange="ProfileVM.updateSetting('defaultDashboard', this.value)">
            <option value="dashboard" ${settings.defaultDashboard === 'dashboard' ? 'selected' : ''}>Camping Prep Dashboard</option>
            <option value="kit" ${settings.defaultDashboard === 'kit' ? 'selected' : ''}>First Aid Kit</option>
            <option value="medicines" ${settings.defaultDashboard === 'medicines' ? 'selected' : ''}>Medicine Reminders</option>
            <option value="todo" ${settings.defaultDashboard === 'todo' ? 'selected' : ''}>Camping To-Do List</option>
          </select>
        </div>

        <div class="preference-row">
          <div>
            <strong>Date Format</strong>
            <p class="text-muted">Display format for expiration & camp dates.</p>
          </div>
          <select class="input-field compact-select" onchange="ProfileVM.updateSetting('dateFormat', this.value)">
            <option value="YYYY-MM-DD" ${settings.dateFormat === 'YYYY-MM-DD' ? 'selected' : ''}>YYYY-MM-DD</option>
            <option value="MM/DD/YYYY" ${settings.dateFormat === 'MM/DD/YYYY' ? 'selected' : ''}>MM/DD/YYYY</option>
            <option value="DD/MM/YYYY" ${settings.dateFormat === 'DD/MM/YYYY' ? 'selected' : ''}>DD/MM/YYYY</option>
          </select>
        </div>
      </div>

      <!-- Notifications -->
      <div class="glass-card">
        <h3>🔔 Notification Preferences</h3>

        <div class="preference-row">
          <div><strong>Camping Reminders</strong><p class="text-muted">Upcoming campout countdown alerts.</p></div>
          <input type="checkbox" class="toggle-check" ${settings.notifyCampReminders ? 'checked' : ''} onchange="ProfileVM.updateSetting('notifyCampReminders', this.checked)">
        </div>
        <div class="preference-row">
          <div><strong>Task Deadline Reminders</strong><p class="text-muted">To-do checklist due dates.</p></div>
          <input type="checkbox" class="toggle-check" ${settings.notifyTaskDeadlines ? 'checked' : ''} onchange="ProfileVM.updateSetting('notifyTaskDeadlines', this.checked)">
        </div>
        <div class="preference-row">
          <div><strong>Medicine Expiration Alerts</strong><p class="text-muted">Warn before kit items or meds expire.</p></div>
          <input type="checkbox" class="toggle-check" ${settings.notifyMedExpiration ? 'checked' : ''} onchange="ProfileVM.updateSetting('notifyMedExpiration', this.checked)">
        </div>
        <div class="preference-row">
          <div><strong>Missing Equipment Reminders</strong><p class="text-muted">Alerts for Ten Essentials & kit shortages.</p></div>
          <input type="checkbox" class="toggle-check" ${settings.notifyMissingEquip ? 'checked' : ''} onchange="ProfileVM.updateSetting('notifyMissingEquip', this.checked)">
        </div>
        <div class="preference-row">
          <div><strong>Training Reminders</strong><p class="text-muted">First aid lesson & quiz reminders.</p></div>
          <input type="checkbox" class="toggle-check" ${settings.notifyTraining ? 'checked' : ''} onchange="ProfileVM.updateSetting('notifyTraining', this.checked)">
        </div>

        <div class="preference-row" style="border-bottom:none; padding-top:0.8rem;">
          <div><strong>Test Audio Alerts</strong></div>
          <div style="display:flex; gap:6px;">
            <button class="btn btn-sm btn-outline" onclick="AudioEngine.playChime()">🔔 Chime</button>
            <button class="btn btn-sm btn-warning" onclick="AudioEngine.playScoutDistressWhistle()">🔊 Whistle</button>
          </div>
        </div>
      </div>

      <!-- Privacy & Security -->
      <div class="glass-card">
        <h3>🔒 Privacy & Security</h3>
        <div class="preference-row">
          <div>
            <strong>Mask Medicine Names on Lock Screen</strong>
            <p class="text-muted">Protects minor medical privacy on notifications.</p>
          </div>
          <input type="checkbox" class="toggle-check" ${settings.maskMedicineNamesOnLockScreen ? 'checked' : ''} onchange="ProfileVM.updateSetting('maskMedicineNamesOnLockScreen', this.checked)">
        </div>
        <div class="preference-row">
          <div>
            <strong>PIN Lock Protection</strong>
            <p class="text-muted">Require Guardian PIN before editing prescriptions.</p>
          </div>
          <input type="checkbox" class="toggle-check" ${settings.pinLockEnabled ? 'checked' : ''} onchange="ProfileVM.updateSetting('pinLockEnabled', this.checked)">
        </div>

        <div class="backup-actions-grid" style="margin-top:0.8rem;">
          <button class="btn btn-outline" onclick="App.openRoleModal()">🚪 ${window.I18n ? window.I18n.t('logout') : 'Switch / Log Out'}</button>
          <button class="btn btn-outline-danger" onclick="ProfileVM.confirmDeleteAccount()">🗑️ Delete Local Account Data</button>
        </div>
      </div>

      <!-- Backup & Automated Tests -->
      <div class="glass-card">
        <h3>💾 Offline Backup & Diagnostics</h3>
        <div class="backup-actions-grid" style="margin-top:0.6rem;">
          <button class="btn btn-primary" onclick="App.exportData()">📤 Export Backup (JSON)</button>
          <label class="btn btn-secondary file-input-label">
            📥 Import Backup (JSON)
            <input type="file" accept=".json" style="display:none;" onchange="App.importData(event)">
          </label>
          <button class="btn btn-outline-danger" onclick="App.confirmResetData()">🔄 Reset Sample Data</button>
          <button class="btn btn-outline" onclick="window.TestSuite.showTestModal()">🧪 Run Automated Tests</button>
        </div>
      </div>
    `;
  },

  updateSetting(key, value) {
    window.scoutState.updateSettings({ [key]: value });
    if (key === 'theme' && window.App) {
      window.App.applyTheme();
    }
    if (window.App) window.App.showToast('Setting saved.', 'success');
  },

  changeLanguage(lang) {
    window.scoutState.updateSettings({ language: lang });
    if (window.App) {
      window.App.updateStaticLabels();
      window.App.showToast(lang === 'fil' ? 'Wika: Filipino' : 'Language: English', 'info');
    }
    this.render();
  },

  openEditProfileModal() {
    const user = window.scoutState.getState().currentUser;
    const avatars = ['⚜️', '🏕️', '🧭', '🛡️', '🎒', '🩺', '⛰️', '🦅', '🔥', '🌿', '🇵🇭', '⭐'];
    const ranks = window.BSP_RANKS || ['Scout Candidate', 'Tenderfoot Scout', 'Second Class Scout', 'First Class Scout', 'Star Scout', 'Life Scout', 'Eagle Scout'];

    const modalHtml = `
      <div class="modal-overlay" id="profile-modal">
        <div class="modal-card glass-modal">
          <div class="modal-header">
            <h3>✏️ Edit Scout Profile</h3>
            <button class="modal-close" onclick="ProfileVM.closeModal('profile-modal')">✕</button>
          </div>
          <form onsubmit="ProfileVM.handleProfileSave(event)">
            <div class="form-group">
              <label class="form-label">Select Avatar</label>
              <div class="avatar-picker-row">
                ${avatars.map(av => `
                  <button type="button" class="avatar-pick-btn ${user.avatar === av ? 'selected' : ''}" onclick="ProfileVM.selectAvatar('${av}', this)">${av}</button>
                `).join('')}
              </div>
              <input type="hidden" id="prof-avatar" value="${user.avatar || '⚜️'}">
            </div>

            <div class="form-row-2">
              <div class="form-group">
                <label class="form-label">Full Name *</label>
                <input type="text" id="prof-name" class="input-field" required value="${user.name}">
              </div>
              <div class="form-group">
                <label class="form-label">Username</label>
                <input type="text" id="prof-username" class="input-field" value="${user.username || ''}">
              </div>
            </div>

            <div class="form-row-2">
              <div class="form-group">
                <label class="form-label">Email Address</label>
                <input type="email" id="prof-email" class="input-field" value="${user.email || ''}">
              </div>
              <div class="form-group">
                <label class="form-label">Phone (PH 09XX)</label>
                <input type="tel" id="prof-phone" class="input-field" value="${user.phone || ''}">
              </div>
            </div>

            <div class="form-row-2">
              <div class="form-group">
                <label class="form-label">Troop / Council</label>
                <input type="text" id="prof-troop" class="input-field" value="${user.troop || ''}">
              </div>
              <div class="form-group">
                <label class="form-label">BSP Rank</label>
                <select id="prof-rank" class="input-field">
                  ${ranks.map(r => `<option value="${r}" ${user.rank === r ? 'selected' : ''}>${r}</option>`).join('')}
                  <option value="Authorized Caregiver" ${user.rank === 'Authorized Caregiver' ? 'selected' : ''}>Authorized Caregiver</option>
                  <option value="Senior Scoutmaster" ${user.rank === 'Senior Scoutmaster' ? 'selected' : ''}>Senior Scoutmaster</option>
                </select>
              </div>
            </div>

            <div class="form-row-2">
              <div class="form-group">
                <label class="form-label">Blood Type</label>
                <input type="text" id="prof-blood" class="input-field" value="${user.bloodType || ''}">
              </div>
              <div class="form-group">
                <label class="form-label">Known Allergies</label>
                <input type="text" id="prof-allergies" class="input-field" value="${user.allergies || ''}">
              </div>
            </div>

            <div class="modal-footer">
              <button type="button" class="btn btn-outline" onclick="ProfileVM.closeModal('profile-modal')">Cancel</button>
              <button type="submit" class="btn btn-primary">Save Profile</button>
            </div>
          </form>
        </div>
      </div>
    `;
    document.getElementById('modal-container').innerHTML = modalHtml;
  },

  selectAvatar(av, btn) {
    document.getElementById('prof-avatar').value = av;
    document.querySelectorAll('.avatar-pick-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
  },

  handleProfileSave(event) {
    event.preventDefault();
    window.scoutState.updateProfile({
      avatar: document.getElementById('prof-avatar').value,
      name: document.getElementById('prof-name').value.trim(),
      username: document.getElementById('prof-username').value.trim(),
      email: document.getElementById('prof-email').value.trim(),
      phone: document.getElementById('prof-phone').value.trim(),
      troop: document.getElementById('prof-troop').value.trim(),
      rank: document.getElementById('prof-rank').value,
      bloodType: document.getElementById('prof-blood').value.trim(),
      allergies: document.getElementById('prof-allergies').value.trim()
    });
    this.closeModal('profile-modal');
    if (window.App) window.App.showToast('Profile updated!', 'success');
  },

  openPasswordModal() {
    const modalHtml = `
      <div class="modal-overlay" id="pw-modal">
        <div class="modal-card glass-modal">
          <div class="modal-header">
            <h3>🔐 Change Security PIN</h3>
            <button class="modal-close" onclick="ProfileVM.closeModal('pw-modal')">✕</button>
          </div>
          <form onsubmit="ProfileVM.handlePinSave(event)">
            <div class="form-group">
              <label class="form-label">New 4-Digit Security PIN *</label>
              <input type="password" id="new-pin" class="input-field" required minlength="4" maxlength="8" placeholder="Enter new PIN">
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-outline" onclick="ProfileVM.closeModal('pw-modal')">Cancel</button>
              <button type="submit" class="btn btn-primary">Update PIN</button>
            </div>
          </form>
        </div>
      </div>
    `;
    document.getElementById('modal-container').innerHTML = modalHtml;
  },

  handlePinSave(event) {
    event.preventDefault();
    const pin = document.getElementById('new-pin').value.trim();
    window.scoutState.updateProfile({ guardianPin: pin });
    this.closeModal('pw-modal');
    if (window.App) window.App.showToast('Security PIN updated!', 'success');
  },

  confirmDeleteAccount() {
    if (confirm('WARNING: This will erase all your local ScoutCare data and reset to defaults. Continue?')) {
      if (window.StorageService) window.StorageService.clear();
      window.scoutState.resetToDefault();
      if (window.App) {
        window.App.showToast('Local account data cleared and reset.', 'info');
        window.App.navigateTo('welcome');
      }
    }
  },

  closeModal(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
  }
};

window.ProfileVM = ProfileVM;
