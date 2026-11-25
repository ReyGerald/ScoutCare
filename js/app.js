// ScoutCare PH — Core Application Controller & Router (MVVM)
const AudioEngine = {
  ctx: null,

  getContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  },

  playTone(freq, duration, type = 'sine', startTime = 0) {
    const ctx = this.getContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime + startTime);
    gain.gain.setValueAtTime(0.15, ctx.currentTime + startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime + startTime);
    osc.stop(ctx.currentTime + startTime + duration);
  },

  playChime() {
    this.playTone(587.33, 0.2, 'sine', 0);
    this.playTone(880.00, 0.4, 'sine', 0.15);
  },

  playSuccessFanfare() {
    [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
      this.playTone(freq, 0.3, 'triangle', idx * 0.12);
    });
  },

  playScoutDistressWhistle() {
    const ctx = this.getContext();
    if (!ctx) return;
    [0, 1.2, 2.4].forEach(startSec => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(2900, ctx.currentTime + startSec);
      osc.frequency.linearRampToValueAtTime(3100, ctx.currentTime + startSec + 0.8);
      gain.gain.setValueAtTime(0.4, ctx.currentTime + startSec);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + startSec + 0.8);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + startSec);
      osc.stop(ctx.currentTime + startSec + 0.8);
    });
  }
};

window.AudioEngine = AudioEngine;

const App = {
  currentView: 'dashboard',
  isMobileFrame: window.innerWidth >= 520,

  init() {
    console.log('🇵🇭 Initializing ScoutCare PH...');
    this.applyTheme();
    this.setupEventListeners();
    this.updateClock();
    setInterval(() => this.updateClock(), 30000);

    // Initialize all ViewModels
    window.DashboardVM.init();
    window.KitVM.init();
    window.FirstAidVM.init();
    window.MedicineVM.init();
    window.EmergencyVM.init();
    window.CampingVM.init();
    window.TodoVM.init();
    window.EssentialsVM.init();
    window.LearningVM.init();
    window.IncidentsVM.init();
    window.ProfileVM.init();

    this.updateStaticLabels();

    const defaultStart = window.scoutState.getState().settings?.defaultDashboard || 'dashboard';
    const hash = window.location.hash.replace('#', '') || defaultStart;
    this.navigateTo(hash);

    if ('serviceWorker' in navigator && (window.location.protocol === 'http:' || window.location.protocol === 'https:')) {
      navigator.serviceWorker.register('./sw.js').catch(err => {
        console.log('SW notice:', err.message);
      });
    }
  },

  applyTheme() {
    const theme = window.scoutState.getState().settings?.theme || 'dark';
    let resolved = theme;
    if (theme === 'system') {
      resolved = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    }
    document.documentElement.setAttribute('data-theme', resolved);
  },

  updateStaticLabels() {
    if (!window.I18n) return;
    const map = {
      'nav-lbl-home': 'nav_home',
      'nav-lbl-firstaid': 'nav_firstaid',
      'nav-lbl-kit': 'nav_kit',
      'nav-lbl-medicines': 'nav_medicines',
      'nav-lbl-profile': 'nav_profile'
    };
    Object.entries(map).forEach(([id, key]) => {
      const el = document.getElementById(id);
      if (el) el.innerText = window.I18n.t(key);
    });

    const langBtn = document.getElementById('lang-toggle-btn');
    if (langBtn) {
      langBtn.innerText = window.I18n.getLang() === 'fil' ? '🌐 FIL' : '🌐 ENG';
    }
  },

  setupEventListeners() {
    window.addEventListener('hashchange', () => {
      const hash = window.location.hash.replace('#', '') || 'dashboard';
      this.navigateTo(hash, false);
    });

    document.addEventListener('click', () => {
      AudioEngine.getContext();
    }, { once: true });
  },

  updateClock() {
    const el = document.getElementById('phone-clock');
    if (!el) return;
    const now = new Date();
    el.innerText = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  },

  navigateTo(viewId, updateHash = true) {
    this.currentView = viewId;
    if (updateHash) window.location.hash = viewId;

    document.querySelectorAll('.view-screen').forEach(v => v.classList.remove('active'));

    const routeMap = {
      'welcome': 'welcome-view',
      'onboarding': 'welcome-view',
      'roles': 'roles-view',
      'dashboard': 'dashboard-view',
      'leader-dashboard': 'dashboard-view',
      'kit': 'kit-inventory-view',
      'kit-alerts': 'kit-inventory-view',
      'firstaid': 'first-aid-view',
      'firstaid-quiz': 'first-aid-view',
      'medicines': 'medicines-view',
      'medicines-schedule': 'medicines-view',
      'medicines-history': 'medicines-view',
      'emergency': 'emergency-view',
      'sos': 'emergency-view',
      'camping': 'camping-view',
      'todo': 'todo-view',
      'essentials': 'essentials-view',
      'videos': 'videos-view',
      'incidents': 'incidents-view',
      'profile': 'profile-view'
    };

    const targetId = routeMap[viewId] || 'dashboard-view';
    const targetEl = document.getElementById(targetId);
    if (targetEl) targetEl.classList.add('active');

    this.updateBottomNav(viewId);

    const viewport = document.getElementById('phone-scroll-content');
    if (viewport) viewport.scrollTop = 0;

    if (viewId === 'dashboard' || viewId === 'leader-dashboard') window.DashboardVM.render();
    if (viewId === 'kit' || viewId === 'kit-alerts') window.KitVM.render();
    if (viewId === 'firstaid' || viewId === 'firstaid-quiz') window.FirstAidVM.render();
    if (viewId.startsWith('medicine')) window.MedicineVM.render();
    if (viewId === 'emergency' || viewId === 'sos') window.EmergencyVM.render();
    if (viewId === 'camping') window.CampingVM.render();
    if (viewId === 'todo') window.TodoVM.render();
    if (viewId === 'essentials') window.EssentialsVM.render();
    if (viewId === 'videos') window.LearningVM.render();
    if (viewId === 'incidents') window.IncidentsVM.render();
    if (viewId === 'profile') window.ProfileVM.render();
  },

  updateBottomNav(viewId) {
    document.querySelectorAll('.bottom-nav-item').forEach(item => item.classList.remove('active'));
    let activeNav = 'home';
    if (['dashboard', 'todo', 'essentials', 'camping', 'videos', 'incidents', 'welcome', 'roles'].includes(viewId)) activeNav = 'home';
    else if (viewId.startsWith('firstaid')) activeNav = 'firstaid';
    else if (viewId.startsWith('kit')) activeNav = 'kit';
    else if (viewId.startsWith('medicine')) activeNav = 'medicines';
    else if (viewId === 'profile') activeNav = 'profile';

    const item = document.querySelector(`.bottom-nav-item[data-nav="${activeNav}"]`);
    if (item) item.classList.add('active');
  },

  toggleMobileFrame() {
    this.isMobileFrame = !this.isMobileFrame;
    const frame = document.getElementById('device-frame-wrapper');
    const btn = document.getElementById('toggle-frame-btn');
    if (this.isMobileFrame) {
      frame.classList.add('mobile-frame-mode');
      frame.classList.remove('fullscreen-mode');
      if (btn) btn.innerHTML = '🖥️ Fullscreen View';
    } else {
      frame.classList.remove('mobile-frame-mode');
      frame.classList.add('fullscreen-mode');
      if (btn) btn.innerHTML = '📱 Mobile Frame';
    }
  },

  showToast(message, type = 'info', duration = 3800) {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    const icon = type === 'success' ? '✅' : type === 'warning' ? '⚠️' : type === 'danger' ? '🚨' : 'ℹ️';
    toast.innerHTML = `<span>${icon}</span><span class="toast-text">${message}</span><button class="toast-close" onclick="this.parentElement.remove()">✕</button>`;
    container.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('fade-out');
      setTimeout(() => toast.remove(), 350);
    }, duration);
  },

  openRoleModal() {
    const state = window.scoutState.getState();
    const current = state.currentUser;
    const modalHtml = `
      <div class="modal-overlay" id="role-modal">
        <div class="modal-card glass-modal">
          <div class="modal-header">
            <h3>👥 Switch BSP Role</h3>
            <button class="modal-close" onclick="App.closeModal('role-modal')">✕</button>
          </div>
          <div class="role-cards-grid">
            ${state.users.map(u => `
              <div class="role-select-card ${u.id === current.id ? 'active-role' : ''}" onclick="App.switchUserAccount('${u.id}')">
                <div class="role-card-avatar">${u.avatar}</div>
                <div class="role-card-info">
                  <h4>${u.name} ${u.id === current.id ? '(Current)' : ''}</h4>
                  <span class="role-badge-tag">${u.role.toUpperCase()}</span>
                  <p class="text-muted">${u.troop} • ${u.rank}</p>
                </div>
              </div>
            `).join('')}
          </div>
          <div class="modal-footer">
            <button class="btn btn-outline" onclick="App.closeModal('role-modal')">Close</button>
          </div>
        </div>
      </div>
    `;
    document.getElementById('modal-container').innerHTML = modalHtml;
  },

  switchUserAccount(userId) {
    window.scoutState.setCurrentUser(userId);
    const user = window.scoutState.getState().currentUser;
    this.showToast(`Switched to ${user.name} (${user.role.toUpperCase()})`, 'success');
    this.closeModal('role-modal');
    this.navigateTo('dashboard');
  },

  closeModal(modalId) {
    const m = document.getElementById(modalId);
    if (m) m.remove();
  },

  exportData() {
    const jsonStr = window.scoutState.exportStateJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ScoutCarePH-Backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    this.showToast('Backup exported!', 'success');
  },

  importData(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      if (window.scoutState.importStateJson(e.target.result)) {
        this.showToast('Restored from backup!', 'success');
        this.navigateTo('dashboard');
      } else {
        alert('Invalid ScoutCare PH JSON backup file.');
      }
    };
    reader.readAsText(file);
  },

  confirmResetData() {
    if (confirm('Reset all ScoutCare PH data to default troop sample?')) {
      window.scoutState.resetToDefault();
      this.showToast('Reset to Philippine troop defaults.', 'info');
      this.navigateTo('dashboard');
    }
  }
};

window.App = App;

document.addEventListener('DOMContentLoaded', () => {
  window.App.init();
});
