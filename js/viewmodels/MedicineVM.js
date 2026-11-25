// ScoutCare PH — Medicine Reminder ViewModel (with 5-Point Overdose Caution System)
const MedicineVM = {
  activeTab: 'today', // 'today', 'schedules', 'history'

  init() {
    this.render();
    window.scoutState.subscribe(() => {
      if (window.App && window.App.currentView && window.App.currentView.startsWith('medicine')) {
        this.render();
      }
    });
    this.startReminderChecker();
  },

  setActiveTab(tab) {
    this.activeTab = tab;
    this.render();
  },

  getTodayDoseEvents() {
    const state = window.scoutState.getState();
    const medicines = state.medicines.filter(m => m.active);
    const logs = state.doseLogs || [];
    const now = new Date();
    const phNow = new Date(now.getTime() + (8 * 60 * 60 * 1000));
    const todayStr = phNow.toISOString().split('T')[0];
    const currentMinutesOfDay = now.getHours() * 60 + now.getMinutes();

    const events = [];

    medicines.forEach(med => {
      (med.scheduleTimes || []).forEach(time => {
        const [h, m] = time.split(':').map(Number);
        const doseMinutes = h * 60 + m;
        const scheduledTimeStr = `${todayStr} ${time}`;

        const existingLog = logs.find(l => l.medicineId === med.id && l.scheduledTime === scheduledTimeStr);

        let status = 'upcoming';
        if (existingLog) {
          status = existingLog.status;
        } else if (currentMinutesOfDay > doseMinutes + 60) {
          status = 'missed';
        } else if (currentMinutesOfDay >= doseMinutes - 15) {
          status = 'due_now';
        }

        events.push({
          medicineId: med.id,
          medicineName: med.name,
          dosage: med.dosage,
          instructions: med.instructions,
          prescriber: med.prescriber,
          maxDailyDose: med.maxDailyDose,
          minHoursBetweenDoses: med.minHoursBetweenDoses,
          storageWarning: med.storageWarning,
          scheduledTime: scheduledTimeStr,
          timeOnly: time,
          withFood: med.withFood,
          status,
          log: existingLog || null
        });
      });
    });

    events.sort((a, b) => a.timeOnly.localeCompare(b.timeOnly));
    return events;
  },

  render() {
    const container = document.getElementById('medicines-view');
    if (!container) return;

    const currentUser = window.scoutState.getState().currentUser;
    const isLeader = currentUser.role === 'leader';

    // Strict Privacy Firewall: Leaders cannot view private medicine schedules
    if (isLeader) {
      container.innerHTML = `
        <div class="screen-header">
          <div class="screen-title-group">
            <span class="badge-tag">Privacy Firewall</span>
            <h1 class="screen-title">Scout Health & Medication Safety</h1>
          </div>
        </div>
        <div class="glass-card privacy-lock-card">
          <div class="privacy-lock-icon">🔒</div>
          <h3>Private Medical Information Restricted</h3>
          <p>Under BSP youth protection and health privacy guidelines, specific prescription medicine names and daily dosing logs are restricted to the Scout and their Parent/Guardian.</p>
          <div class="alert-box alert-info">
            <strong>Leader Medical Roster:</strong> To view troop campout clearances, allergies, or to log incidents, visit the <strong>Dashboard</strong>.
          </div>
          <button class="btn btn-primary" onclick="App.navigateTo('dashboard')">Go to Leader Dashboard →</button>
        </div>
      `;
      return;
    }

    const todayEvents = this.getTodayDoseEvents();
    const adherenceStats = window.scoutState.getMedicineAdherenceStats();

    container.innerHTML = `
      <div class="screen-header">
        <div class="screen-title-group">
          <span class="badge-tag">🇵🇭 Supervised Prescription Schedule</span>
          <h1 class="screen-title">${window.I18n ? window.I18n.t('medicine_reminders') : 'Medicine Reminders'}</h1>
          <p class="screen-subtitle">Physician-prescribed reminders with overdose prevention guardrails.</p>
        </div>
        <button class="btn btn-primary" onclick="MedicineVM.openAddMedicineModal()">
          ➕ Add Medicine
        </button>
      </div>

      <!-- OVERDOSE CAUTION #1: Top Bilingual Safety Banner -->
      <div class="medical-safety-banner">
        <div class="safety-icon">⚠️</div>
        <div class="safety-content">
          <strong>${window.I18n ? window.I18n.t('overdose_banner_title') : 'DOSAGE & OVERDOSE SAFETY WARNING'}:</strong>
          <p>${window.I18n ? window.I18n.t('overdose_banner_body') : 'Never take a double dose if you miss one. Too much medicine can be harmful or dangerous.'}</p>
          <div style="margin-top:6px;">
            <button class="btn btn-sm btn-outline-danger" onclick="App.navigateTo('emergency')">
              🚨 Suspected Overdose? View SOS Signs (DOH 1555 / Red Cross 143)
            </button>
          </div>
        </div>
      </div>

      <!-- Adherence Stats -->
      <div class="glass-card adherence-stats-card">
        <div class="adherence-main-stat">
          <div class="stat-circle">
            <span class="stat-number">${adherenceStats.adherenceRate}%</span>
            <span class="stat-label">Adherence</span>
          </div>
        </div>
        <div class="adherence-details">
          <h4>7-Day Medication Adherence</h4>
          <p class="text-muted">Stay healthy on Philippine trails. Never share prescription medicines.</p>
          <div class="adherence-chips">
            <span class="badge-chip chip-taken">✅ ${adherenceStats.taken} Taken</span>
            <span class="badge-chip chip-skipped">⏸️ ${adherenceStats.skipped} Skipped</span>
            <span class="badge-chip chip-missed">❌ ${adherenceStats.missed} Missed</span>
          </div>
        </div>
      </div>

      <!-- Tab Bar -->
      <div class="pill-group">
        <button class="pill-btn ${this.activeTab === 'today' ? 'active' : ''}" onclick="MedicineVM.setActiveTab('today')">
          📅 Today (${todayEvents.length})
        </button>
        <button class="pill-btn ${this.activeTab === 'schedules' ? 'active' : ''}" onclick="MedicineVM.setActiveTab('schedules')">
          💊 Prescriptions
        </button>
        <button class="pill-btn ${this.activeTab === 'history' ? 'active' : ''}" onclick="MedicineVM.setActiveTab('history')">
          📜 Dose History
        </button>
      </div>

      ${this.renderActiveTabContent(todayEvents)}
    `;
  },

  renderActiveTabContent(todayEvents) {
    if (this.activeTab === 'today') return this.renderTodayScheduleView(todayEvents);
    if (this.activeTab === 'schedules') return this.renderActivePrescriptionsView();
    return this.renderDoseHistoryView();
  },

  renderTodayScheduleView(events) {
    if (events.length === 0) {
      return `
        <div class="glass-card empty-state-box">
          <div class="empty-icon">🎉</div>
          <h3>No Scheduled Doses Today</h3>
          <p>Always keep approved rescue inhalers or emergency devices accessible in your daypack.</p>
        </div>
      `;
    }

    return `
      <div class="today-doses-list">
        ${events.map(ev => {
          let statusBadge = '';
          let cardClass = '';

          if (ev.status === 'taken') {
            statusBadge = `<span class="status-pill status-taken">✅ Taken at ${ev.log ? ev.log.recordedTime.split(' ')[1] : ''}</span>`;
            cardClass = 'dose-card-taken';
          } else if (ev.status === 'skipped') {
            statusBadge = `<span class="status-pill status-skipped">⏸️ Skipped</span>`;
            cardClass = 'dose-card-skipped';
          } else if (ev.status === 'missed') {
            statusBadge = `<span class="status-pill status-missed">⚠️ Missed</span>`;
            cardClass = 'dose-card-missed';
          } else if (ev.status === 'due_now') {
            statusBadge = `<span class="status-pill status-due">⏰ DUE NOW</span>`;
            cardClass = 'dose-card-due';
          } else {
            statusBadge = `<span class="status-pill status-upcoming">Upcoming ${ev.timeOnly}</span>`;
          }

          return `
            <div class="glass-card dose-item-card ${cardClass}">
              <div class="dose-card-header">
                <div class="dose-time-pill">🕒 ${ev.timeOnly}</div>
                <div>${statusBadge}</div>
              </div>

              <div class="dose-med-title-row">
                <h3 class="dose-med-name">${ev.medicineName}</h3>
                <span class="dose-dosage-tag">${ev.dosage}</span>
              </div>

              <div class="dose-instructions-box">
                <p><strong>Instructions:</strong> ${ev.instructions}</p>
                <div class="dose-meta-inline">
                  <span class="meta-tag">${ev.withFood ? '🍽️ With food' : '💧 With water'}</span>
                  <span class="meta-tag">👨‍⚕️ ${ev.prescriber || 'Physician'}</span>
                </div>
                <!-- OVERDOSE CAUTION #4: Per-medicine max daily dose & interval -->
                ${ev.maxDailyDose ? `
                  <div class="overdose-med-limit">
                    <strong>🛑 Max Limit:</strong> ${ev.maxDailyDose} ${ev.minHoursBetweenDoses ? `• Min gap: ${ev.minHoursBetweenDoses}` : ''}
                  </div>
                ` : ''}
              </div>

              <div class="dose-card-footer">
                ${ev.status === 'taken' ? `
                  <div class="dose-confirmed-badge">
                    Confirmed by ${ev.log?.confirmedBy === 'guardian' ? 'Parent/Guardian' : 'Scout'}.
                  </div>
                ` : `
                  <div class="dose-action-buttons">
                    <button class="btn btn-success" onclick="MedicineVM.markDoseTaken('${ev.medicineId}', '${ev.medicineName.replace(/'/g, "\\'")}', '${ev.scheduledTime}')">
                      ✅ ${window.I18n ? window.I18n.t('mark_taken') : 'Mark as Taken'}
                    </button>
                    <button class="btn btn-outline-warning" onclick="MedicineVM.openSkipModal('${ev.medicineId}', '${ev.medicineName.replace(/'/g, "\\'")}', '${ev.scheduledTime}')">
                      ⏸️ ${window.I18n ? window.I18n.t('mark_skipped') : 'Skip Dose'}
                    </button>
                    ${ev.status === 'missed' ? `
                      <button class="btn btn-outline-danger" onclick="MedicineVM.openMissedCautionModal('${ev.medicineId}', '${ev.medicineName.replace(/'/g, "\\'")}', '${ev.scheduledTime}')">
                        ❌ Log Missed
                      </button>
                    ` : ''}
                  </div>
                `}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  },

  renderActivePrescriptionsView() {
    const medicines = window.scoutState.getState().medicines || [];
    return `
      <div class="prescriptions-list">
        ${medicines.map(med => `
          <div class="glass-card prescription-card">
            <div class="presc-header">
              <div>
                <h3>${med.name}</h3>
                <span class="text-muted">Prescribed by ${med.prescriber || 'Doctor'}</span>
              </div>
              <span class="status-pill ${med.active ? 'status-ok' : 'status-skipped'}">${med.active ? 'Active' : 'Done'}</span>
            </div>
            <div class="presc-body">
              <p><strong>Dosage:</strong> ${med.dosage}</p>
              <p><strong>Instructions:</strong> ${med.instructions}</p>
              <p><strong>Schedule:</strong> ${(med.scheduleTimes || []).join(', ')}</p>
              ${med.maxDailyDose ? `<p class="text-warning"><strong>🛑 Max Daily Dose:</strong> ${med.maxDailyDose} (Min gap: ${med.minHoursBetweenDoses || 'per label'})</p>` : ''}
              ${med.storageWarning ? `<p><strong>🌡️ Storage:</strong> ${med.storageWarning}</p>` : ''}
              ${med.notes ? `<p class="text-muted"><small>${med.notes}</small></p>` : ''}
            </div>
            <div class="presc-footer">
              <button class="btn btn-sm btn-outline" onclick="MedicineVM.openEditMedicineModal('${med.id}')">Edit</button>
              <button class="btn btn-sm btn-icon-danger" onclick="MedicineVM.deletePrescription('${med.id}', '${med.name.replace(/'/g, "\\'")}')">🗑️</button>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  },

  renderDoseHistoryView() {
    const logs = window.scoutState.getState().doseLogs || [];
    return `
      <div class="glass-card">
        <h3>📜 Medication Dose Audit Trail</h3>
        <p class="text-muted">Timestamped record for Parent/Guardian and Camp Medical Officer review.</p>
        <div class="history-cards-stack">
          ${logs.length === 0 ? '<p>No doses logged yet.</p>' : logs.map(l => `
            <div class="history-card-row">
              <div class="history-top">
                <strong>${l.medicineName}</strong>
                <span class="status-pill ${l.status === 'taken' ? 'status-taken' : l.status === 'skipped' ? 'status-skipped' : 'status-missed'}">${l.status.toUpperCase()}</span>
              </div>
              <div class="history-meta">
                <span>Scheduled: ${l.scheduledTime}</span> • <span>Recorded: ${l.recordedTime}</span>
              </div>
              <div class="history-meta">
                <span>By: ${l.confirmedBy === 'guardian' ? '🛡️ Guardian' : '⚜️ Scout'}</span>
                ${l.notes ? ` • <em>${l.notes}</em>` : ''}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  markDoseTaken(medicineId, medicineName, scheduledTime) {
    window.scoutState.logDose({
      medicineId,
      medicineName,
      scheduledTime,
      status: 'taken',
      notes: 'Confirmed on-time dose.'
    });
    if (window.AudioEngine) window.AudioEngine.playChime();
    if (window.App) window.App.showToast(`Logged ${medicineName} as Taken!`, 'success');
  },

  // OVERDOSE CAUTION #2: Missed Dose Popup Warning
  openMissedCautionModal(medicineId, medicineName, scheduledTime) {
    const modalHtml = `
      <div class="modal-overlay" id="missed-modal">
        <div class="modal-card glass-modal">
          <div class="modal-header">
            <h3>⚠️ ${window.I18n ? window.I18n.t('missed_dose') : 'Missed Dose'}</h3>
            <button class="modal-close" onclick="MedicineVM.closeModal('missed-modal')">✕</button>
          </div>
          <div class="alert-box alert-emergency">
            <div>
              <strong>🛑 DO NOT DOUBLE DOSE / HUWAG MAG-DOUBLE DOSE!</strong>
              <p style="margin-top:4px;">${window.I18n ? window.I18n.t('overdose_missed_alert') : 'DO NOT take two doses at the same time to make up for this missed dose.'}</p>
              <p style="margin-top:4px;"><small>Consult your Nanay/Tatay, Guardian, or Camp Medical Officer (Dr. Reyes) before taking the next scheduled dose.</small></p>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-outline" onclick="MedicineVM.closeModal('missed-modal')">Cancel</button>
            <button class="btn btn-danger" onclick="MedicineVM.confirmMissedDose('${medicineId}', '${medicineName.replace(/'/g, "\\'")}', '${scheduledTime}')">
              I Understand — Record Missed Dose
            </button>
          </div>
        </div>
      </div>
    `;
    document.getElementById('modal-container').innerHTML = modalHtml;
  },

  confirmMissedDose(medicineId, medicineName, scheduledTime) {
    window.scoutState.logDose({
      medicineId,
      medicineName,
      scheduledTime,
      status: 'missed',
      notes: 'Missed dose logged; reminded NOT to double dose.'
    });
    this.closeModal('missed-modal');
    if (window.App) window.App.showToast('Missed dose logged. Never double dose!', 'warning');
  },

  // OVERDOSE CAUTION #3: Skip Dose Form Warning
  openSkipModal(medicineId, medicineName, scheduledTime) {
    const modalHtml = `
      <div class="modal-overlay" id="skip-modal">
        <div class="modal-card glass-modal">
          <div class="modal-header">
            <h3>Record Skipped Dose</h3>
            <button class="modal-close" onclick="MedicineVM.closeModal('skip-modal')">✕</button>
          </div>
          <div class="alert-box alert-warning">
            <span>⚠️</span>
            <div>
              <strong>Safety Reminder:</strong> Never take two doses at once later! If you are skipping because you feel sick, dizzy, or had an allergic reaction, tell your Guardian or Kuya/Ate Leader immediately.
            </div>
          </div>
          <form onsubmit="MedicineVM.handleSkipSubmit(event, '${medicineId}', '${medicineName.replace(/'/g, "\\'")}', '${scheduledTime}')">
            <div class="form-group">
              <label class="form-label">Reason for skipping ${medicineName}: *</label>
              <select id="skip-reason" class="input-field" required>
                <option value="Doctor / Guardian directed to pause">Doctor / Guardian directed to pause</option>
                <option value="Experiencing nausea, dizziness, or reaction">Experiencing nausea, dizziness, or reaction</option>
                <option value="As-needed dose not required">As-needed dose not required</option>
                <option value="Forgot / away from camp locker">Forgot / away from camp locker</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Notes</label>
              <input type="text" id="skip-notes" class="input-field" placeholder="Optional details...">
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-outline" onclick="MedicineVM.closeModal('skip-modal')">Cancel</button>
              <button type="submit" class="btn btn-warning">Confirm Skipped Dose</button>
            </div>
          </form>
        </div>
      </div>
    `;
    document.getElementById('modal-container').innerHTML = modalHtml;
  },

  handleSkipSubmit(event, medicineId, medicineName, scheduledTime) {
    event.preventDefault();
    const reason = document.getElementById('skip-reason').value;
    const notes = document.getElementById('skip-notes').value.trim();
    window.scoutState.logDose({
      medicineId,
      medicineName,
      scheduledTime,
      status: 'skipped',
      notes: notes ? `${reason} (${notes})` : reason
    });
    this.closeModal('skip-modal');
    if (window.App) window.App.showToast(`Recorded skipped dose for ${medicineName}.`, 'info');
  },

  openAddMedicineModal() {
    this.openEditMedicineModal(null);
  },

  openEditMedicineModal(medId) {
    const isEdit = !!medId;
    const med = isEdit
      ? window.scoutState.getState().medicines.find(m => m.id === medId)
      : {
          name: '',
          dosage: '',
          prescriber: '',
          instructions: '',
          scheduleTimes: ['08:00', '20:00'],
          startDate: new Date().toISOString().split('T')[0],
          endDate: '',
          maxDailyDose: '',
          minHoursBetweenDoses: '',
          storageWarning: '',
          withFood: true,
          notes: ''
        };

    const modalHtml = `
      <div class="modal-overlay" id="med-modal">
        <div class="modal-card glass-modal">
          <div class="modal-header">
            <h3>${isEdit ? 'Edit Prescribed Medicine' : 'Add Prescribed Medicine'}</h3>
            <button class="modal-close" onclick="MedicineVM.closeModal('med-modal')">✕</button>
          </div>
          <form onsubmit="MedicineVM.handleMedSubmit(event, '${medId || ''}')">
            <div class="form-group">
              <label class="form-label">Medicine Name (e.g. Salbutamol, Allerta) *</label>
              <input type="text" id="med-name" class="input-field" required value="${med.name}">
            </div>
            <div class="form-row-2">
              <div class="form-group">
                <label class="form-label">Dosage *</label>
                <input type="text" id="med-dosage" class="input-field" required placeholder="1 tablet, 2 puffs" value="${med.dosage}">
              </div>
              <div class="form-group">
                <label class="form-label">Prescribing Doctor</label>
                <input type="text" id="med-prescriber" class="input-field" placeholder="Dr. Santos" value="${med.prescriber || ''}">
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Prescribed Instructions *</label>
              <textarea id="med-instructions" class="input-field" rows="2" required>${med.instructions || ''}</textarea>
            </div>
            <div class="form-row-2">
              <div class="form-group">
                <label class="form-label">Max Daily Dose (Safety Limit)</label>
                <input type="text" id="med-maxdose" class="input-field" placeholder="e.g. Max 1 tablet / 24h" value="${med.maxDailyDose || ''}">
              </div>
              <div class="form-group">
                <label class="form-label">Min Hours Between Doses</label>
                <input type="text" id="med-mingap" class="input-field" placeholder="e.g. 6 hours" value="${med.minHoursBetweenDoses || ''}">
              </div>
            </div>
            <div class="form-row-2">
              <div class="form-group">
                <label class="form-label">Times (24h, comma-separated) *</label>
                <input type="text" id="med-times" class="input-field" required value="${(med.scheduleTimes || []).join(', ')}">
              </div>
              <div class="form-group">
                <label class="form-label">Take with Food?</label>
                <select id="med-withfood" class="input-field">
                  <option value="true" ${med.withFood ? 'selected' : ''}>Yes, with meals</option>
                  <option value="false" ${!med.withFood ? 'selected' : ''}>With water</option>
                </select>
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Storage Warning (PH Tropical Heat)</label>
              <input type="text" id="med-storage" class="input-field" placeholder="Keep below 30°C" value="${med.storageWarning || ''}">
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-outline" onclick="MedicineVM.closeModal('med-modal')">Cancel</button>
              <button type="submit" class="btn btn-primary">${isEdit ? 'Save' : 'Add Schedule'}</button>
            </div>
          </form>
        </div>
      </div>
    `;
    document.getElementById('modal-container').innerHTML = modalHtml;
  },

  handleMedSubmit(event, medId) {
    event.preventDefault();
    const name = document.getElementById('med-name').value.trim();
    const dosage = document.getElementById('med-dosage').value.trim();
    const prescriber = document.getElementById('med-prescriber').value.trim();
    const instructions = document.getElementById('med-instructions').value.trim();
    const maxDailyDose = document.getElementById('med-maxdose').value.trim();
    const minHoursBetweenDoses = document.getElementById('med-mingap').value.trim();
    const storageWarning = document.getElementById('med-storage').value.trim();
    const withFood = document.getElementById('med-withfood').value === 'true';
    const timesRaw = document.getElementById('med-times').value;

    const scheduleTimes = timesRaw.split(',')
      .map(t => t.trim())
      .filter(t => /^\d{1,2}:\d{2}$/.test(t))
      .map(t => {
        const [h, m] = t.split(':');
        return `${h.padStart(2, '0')}:${m.padStart(2, '0')}`;
      });

    if (scheduleTimes.length === 0) {
      alert('Enter at least one valid HH:MM time.');
      return;
    }

    const payload = {
      name,
      dosage,
      prescriber,
      instructions,
      maxDailyDose,
      minHoursBetweenDoses,
      storageWarning,
      withFood,
      scheduleTimes,
      daysOfWeek: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    };

    if (medId) {
      window.scoutState.updateMedicine(medId, payload);
      if (window.App) window.App.showToast(`Updated ${name}.`, 'success');
    } else {
      window.scoutState.addMedicine(payload);
      if (window.App) window.App.showToast(`Scheduled ${name}!`, 'success');
    }
    this.closeModal('med-modal');
  },

  deletePrescription(id, name) {
    if (confirm(`Remove ${name} from active prescriptions?`)) {
      window.scoutState.deleteMedicine(id);
      if (window.App) window.App.showToast(`Removed ${name}.`, 'info');
    }
  },

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.remove();
  },

  startReminderChecker() {
    setInterval(() => this.checkDoseAlarms(), 60000);
  },

  checkDoseAlarms() {
    const now = new Date();
    const currentTimeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const events = this.getTodayDoseEvents();
    const matchingDue = events.find(ev => ev.timeOnly === currentTimeStr && ev.status === 'due_now');

    if (matchingDue && window.App) {
      if (window.AudioEngine) window.AudioEngine.playChime();
      window.App.showToast(`⏰ Reminder: Dose scheduled for ${matchingDue.medicineName}.`, 'warning', 8000);
    }
  }
};

window.MedicineVM = MedicineVM;
window.MedicineModule = MedicineVM;
