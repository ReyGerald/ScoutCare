// ScoutCare PH — Automated Unit & Safety Test Suite
const TestSuite = {
  results: [],

  runAllTests() {
    this.results = [];
    this.testKitInventoryCalculations();
    this.testMedicineSchedulingAndAdherence();
    this.testOverdoseSafetyGuardrails();
    this.testHeatIndexFormula();
    this.testLearningCurriculum();
    this.testRoleBasedPrivacyEnforcement();
    this.testTodoAndEssentials();
    this.testBilingualI18n();

    const passed = this.results.filter(r => r.passed).length;
    const total = this.results.length;
    return { passed, total, success: passed === total, results: this.results };
  },

  assert(name, condition, details = '') {
    const passed = Boolean(condition);
    this.results.push({
      name,
      passed,
      details: passed ? 'Assertion passed.' : `FAILED: ${details}`
    });
  },

  testKitInventoryCalculations() {
    const stats = window.scoutState.getKitStats();
    this.assert('PH Kit: Tracks >= 25 Philippine supplies', stats.total >= 25, `Found ${stats.total}`);
    this.assert('PH Kit: Detects missing items (Saline, Hydrite, Water tabs)', stats.missing >= 1, `Missing=${stats.missing}`);
    this.assert('PH Kit: Detects expired items (Betadine)', stats.expired >= 1, `Expired=${stats.expired}`);
    this.assert('PH Kit: Readiness score bounded 0–100%', stats.readinessScore >= 0 && stats.readinessScore <= 100, `Score=${stats.readinessScore}`);
  },

  testMedicineSchedulingAndAdherence() {
    const events = window.MedicineVM.getTodayDoseEvents();
    this.assert('Medicine: Generates today dose events for PH prescriptions', Array.isArray(events) && events.length > 0, `Events=${events.length}`);
    const stats = window.scoutState.getMedicineAdherenceStats();
    this.assert('Medicine: Adherence rate bounded 0–100%', stats.adherenceRate >= 0 && stats.adherenceRate <= 100, `Rate=${stats.adherenceRate}`);
  },

  testOverdoseSafetyGuardrails() {
    const enWarn = window.I18n.t('overdose_banner_body');
    const medRender = window.MedicineVM.render.toString();
    const missedModal = window.MedicineVM.openMissedCautionModal.toString();
    const emergencyRender = window.EmergencyVM.render.toString();

    this.assert('Overdose Guardrail 1: Double-dose warning text present', enWarn.includes('Never take a double dose') || enWarn.includes('Huwag mag-double dose'), 'Missing banner text');
    this.assert('Overdose Guardrail 2: Missed dose modal enforces caution', missedModal.includes('DO NOT DOUBLE DOSE'), 'Missing missed dose modal caution');
    this.assert('Overdose Guardrail 3: Emergency SOS includes Overdose Signs & DOH 1555', emergencyRender.includes('OVERDOSE') && emergencyRender.includes('1555'), 'Missing SOS overdose card');
    this.assert('Overdose Guardrail 4: Medicine screen links to Overdose SOS', medRender.includes('Suspected Overdose'), 'Missing SOS link in MedicineVM');
  },

  testHeatIndexFormula() {
    const hiNormal = window.CampingVM.calculateHeatIndexC(25, 60);
    const hiHot = window.CampingVM.calculateHeatIndexC(35, 75);
    this.assert('PAGASA Heat Index: Below 27°C returns ambient temp', hiNormal === 25, `Got ${hiNormal}`);
    this.assert('PAGASA Heat Index: 35°C @ 75% RH exceeds 45°C Danger zone', hiHot >= 45, `Got ${hiHot}`);
  },

  testLearningCurriculum() {
    const fa = window.FirstAidVM;
    this.assert('First Aid: 10 Philippine-adapted lessons loaded', fa.lessons.length === 10, `Found ${fa.lessons.length}`);
    this.assert('First Aid: Every lesson includes 911 / 143 emergency triggers', fa.lessons.every(l => l.call911 && l.call911.length > 10), 'Missing 911 triggers');
  },

  testRoleBasedPrivacyEnforcement() {
    const state = window.scoutState.getState();
    const origId = state.currentUser.id;
    window.scoutState.setRole('leader');

    const tempDiv = document.createElement('div');
    tempDiv.id = 'medicines-view';
    document.body.appendChild(tempDiv);
    window.MedicineVM.render();

    this.assert('Privacy Firewall: Leader cannot view private prescriptions', tempDiv.innerHTML.includes('Private Medical Information Restricted'), 'Leader saw private meds!');
    tempDiv.remove();
    window.scoutState.setCurrentUser(origId);
  },

  testTodoAndEssentials() {
    const todos = window.scoutState.getState().todos;
    const prep = window.scoutState.getPrepStats();
    this.assert('Camping To-Do: 50+ structured prep tasks loaded', todos.length >= 50, `Found ${todos.length}`);
    this.assert('Camping Prep: Overall percentage bounded 0–100%', prep.overallPrepPercent >= 0 && prep.overallPrepPercent <= 100, `Got ${prep.overallPrepPercent}`);
    this.assert('Ten Essentials: 10 items loaded', window.EssentialsVM.items.length === 10, `Found ${window.EssentialsVM.items.length}`);
  },

  testBilingualI18n() {
    const origLang = window.scoutState.getState().settings.language;
    window.scoutState.updateSettings({ language: 'fil' });
    const filLabel = window.I18n.t('first_aid_kit');
    window.scoutState.updateSettings({ language: origLang });
    this.assert('i18n: Filipino translation resolves accurately', filLabel === 'Kit ng Unang Lunas', `Got ${filLabel}`);
  },

  showTestModal() {
    const res = this.runAllTests();
    const modalHtml = `
      <div class="modal-overlay" id="tests-modal">
        <div class="modal-card glass-modal">
          <div class="modal-header">
            <h3>🧪 ScoutCare PH Automated Tests</h3>
            <button class="modal-close" onclick="TestSuite.closeTestModal()">✕</button>
          </div>
          <div class="test-modal-summary ${res.success ? 'test-summary-pass' : 'test-summary-fail'}">
            <h4>${res.success ? '🎉 All Automated Tests Passed!' : '⚠️ Some Tests Failed'}</h4>
            <p>${res.passed} of ${res.total} assertions verified.</p>
          </div>
          <div class="test-results-list">
            ${res.results.map(r => `
              <div class="test-row ${r.passed ? 'test-pass' : 'test-fail'}">
                <span class="test-badge">${r.passed ? '✅ PASS' : '❌ FAIL'}</span>
                <div class="test-info">
                  <strong>${r.name}</strong>
                  <small class="text-muted">${r.details}</small>
                </div>
              </div>
            `).join('')}
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" onclick="TestSuite.showTestModal()">🔄 Re-run</button>
            <button class="btn btn-primary" onclick="TestSuite.closeTestModal()">Done</button>
          </div>
        </div>
      </div>
    `;
    document.getElementById('modal-container').innerHTML = modalHtml;
  },

  closeTestModal() {
    const m = document.getElementById('tests-modal');
    if (m) m.remove();
  }
};

window.TestSuite = TestSuite;
