// ScoutCare PH — Incident Reporting ViewModel
const IncidentsVM = {
  init() {
    this.render();
    window.scoutState.subscribe(() => {
      if (window.App && window.App.currentView === 'incidents') {
        this.render();
      }
    });
  },

  render() {
    const container = document.getElementById('incidents-view');
    if (!container) return;

    const reports = window.scoutState.getState().incidentReports || [];

    container.innerHTML = `
      <div class="screen-header">
        <div class="screen-title-group">
          <span class="badge-tag">BSP Safety Log</span>
          <h1 class="screen-title">Incident Reports</h1>
          <p class="screen-subtitle">Document field first-aid treatments and parent notifications.</p>
        </div>
        <button class="btn btn-primary" onclick="IncidentsVM.openNewReportModal()">
          ➕ Log Incident
        </button>
      </div>

      <div class="incidents-container">
        ${reports.length === 0 ? `
          <div class="glass-card empty-state-box">
            <div class="empty-icon">🛡️</div>
            <h3>No Incidents Logged</h3>
            <p>Record any first-aid treatment given during troop campouts.</p>
          </div>
        ` : reports.map(r => `
          <div class="glass-card incident-card">
            <div class="incident-card-top">
              <div>
                <span class="status-pill ${r.severity === 'Critical' ? 'status-missing' : r.severity === 'Moderate' ? 'status-low' : 'status-ok'}">
                  ${r.severity || 'Low'} Severity
                </span>
                <h3 class="inc-title">${r.incidentType}</h3>
                <span class="text-muted">📅 ${r.incidentDate} • 📍 ${r.location}</span>
              </div>
              <div class="inc-reporter-badge">
                <small class="text-muted">Logged by</small>
                <strong>${r.leaderName}</strong>
              </div>
            </div>

            <div class="inc-card-body">
              <p><strong>Scout:</strong> ${r.scoutName}</p>
              <p><strong>Description:</strong> ${r.description}</p>
              <div class="first-aid-applied-box">
                <strong>🩹 First Aid Applied:</strong>
                <p>${r.firstAidApplied}</p>
              </div>
              <p><strong>Parent Notified:</strong> ${r.parentNotified ? `✅ Yes (${r.parentContactTime || 'Logged'})` : '❌ Pending'}</p>
              <p><strong>Outcome:</strong> ${r.outcome}</p>
            </div>

            <div class="inc-card-footer">
              <button class="btn btn-sm btn-outline" onclick="window.print()">🖨️ Print</button>
              <button class="btn btn-sm btn-outline" onclick="IncidentsVM.exportSingleReport('${r.id}')">📤 Export TXT</button>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  },

  openNewReportModal() {
    const user = window.scoutState.getState().currentUser;
    const now = new Date();
    const phNow = new Date(now.getTime() + (8 * 60 * 60 * 1000)).toISOString().replace('T', ' ').substring(0, 16);

    const modalHtml = `
      <div class="modal-overlay" id="incident-modal">
        <div class="modal-card glass-modal">
          <div class="modal-header">
            <h3>📝 Log BSP First-Aid Incident</h3>
            <button class="modal-close" onclick="IncidentsVM.closeModal()">✕</button>
          </div>
          <form onsubmit="IncidentsVM.handleSubmit(event)">
            <div class="form-row-2">
              <div class="form-group">
                <label class="form-label">Scout Name *</label>
                <input type="text" id="inc-scout" class="input-field" required value="Juan dela Cruz">
              </div>
              <div class="form-group">
                <label class="form-label">Reporting Leader *</label>
                <input type="text" id="inc-leader" class="input-field" required value="${user.role === 'leader' ? user.name : 'Kuya Roel Santos'}">
              </div>
            </div>

            <div class="form-row-2">
              <div class="form-group">
                <label class="form-label">Date & Time (PH) *</label>
                <input type="text" id="inc-date" class="input-field" required value="${phNow}">
              </div>
              <div class="form-group">
                <label class="form-label">Location *</label>
                <input type="text" id="inc-location" class="input-field" required value="${window.scoutState.getState().campoutInfo?.location || 'Tanay Camp'}">
              </div>
            </div>

            <div class="form-row-2">
              <div class="form-group">
                <label class="form-label">Incident Type *</label>
                <select id="inc-type" class="input-field" required>
                  <option value="Minor Abrasion & Scrape">Minor Abrasion & Scrape</option>
                  <option value="Blister / Foot Hot-Spot">Blister / Foot Hot-Spot</option>
                  <option value="Leech (Limatik) Bite">Leech (Limatik) Bite</option>
                  <option value="Heat Exhaustion / Cramps">Heat Exhaustion / Cramps</option>
                  <option value="Sprain / Ankle Strain">Sprain / Ankle Strain</option>
                  <option value="Thermal Burn">Thermal Burn</option>
                  <option value="Insect Sting / Allergy">Insect Sting / Allergy</option>
                  <option value="Nosebleed">Nosebleed</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Severity *</label>
                <select id="inc-severity" class="input-field" required>
                  <option value="Low">Low (Handled in field)</option>
                  <option value="Moderate">Moderate (Rest & monitor)</option>
                  <option value="Critical">Critical (911 / Red Cross 143)</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Description *</label>
              <textarea id="inc-desc" class="input-field" rows="2" required placeholder="What happened?"></textarea>
            </div>

            <div class="form-group">
              <label class="form-label">First Aid Applied *</label>
              <textarea id="inc-treatment" class="input-field" rows="2" required placeholder="e.g. Rinsed with saline, applied Betadine, covered with sterile gauze..."></textarea>
            </div>

            <div class="form-row-2">
              <div class="form-group">
                <label class="form-label">Parent / Guardian Notified?</label>
                <select id="inc-parent-notified" class="input-field">
                  <option value="true">Yes, notified</option>
                  <option value="false">Pending</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Outcome</label>
                <input type="text" id="inc-outcome" class="input-field" value="Scout rested and returned safely.">
              </div>
            </div>

            <div class="modal-footer">
              <button type="button" class="btn btn-outline" onclick="IncidentsVM.closeModal()">Cancel</button>
              <button type="submit" class="btn btn-primary">Save Incident Report</button>
            </div>
          </form>
        </div>
      </div>
    `;
    document.getElementById('modal-container').innerHTML = modalHtml;
  },

  handleSubmit(event) {
    event.preventDefault();
    window.scoutState.addIncidentReport({
      scoutName: document.getElementById('inc-scout').value.trim(),
      leaderName: document.getElementById('inc-leader').value.trim(),
      incidentDate: document.getElementById('inc-date').value.trim(),
      location: document.getElementById('inc-location').value.trim(),
      incidentType: document.getElementById('inc-type').value,
      severity: document.getElementById('inc-severity').value,
      description: document.getElementById('inc-desc').value.trim(),
      firstAidApplied: document.getElementById('inc-treatment').value.trim(),
      parentNotified: document.getElementById('inc-parent-notified').value === 'true',
      parentContactTime: 'Logged at time of report',
      outcome: document.getElementById('inc-outcome').value.trim()
    });
    this.closeModal();
    if (window.App) window.App.showToast('Incident report saved!', 'success');
  },

  closeModal() {
    const m = document.getElementById('incident-modal');
    if (m) m.remove();
  },

  exportSingleReport(id) {
    const r = window.scoutState.getState().incidentReports.find(i => i.id === id);
    if (!r) return;
    const text = `SCOUTCARE PH INCIDENT REPORT\nID: ${r.id}\nDate: ${r.incidentDate}\nLocation: ${r.location}\nScout: ${r.scoutName}\nLeader: ${r.leaderName}\nType: ${r.incidentType} (${r.severity})\nDescription: ${r.description}\nTreatment: ${r.firstAidApplied}\nParent Notified: ${r.parentNotified ? 'Yes' : 'No'}\nOutcome: ${r.outcome}\n`;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ScoutCarePH-Incident-${r.scoutName.replace(/\s+/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }
};

window.IncidentsVM = IncidentsVM;
window.IncidentsModule = IncidentsVM;
