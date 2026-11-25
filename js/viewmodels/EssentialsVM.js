// ScoutCare PH — Dedicated Camping Ten Essentials ViewModel
const EssentialsVM = {
  items: [
    {
      num: 1,
      checklistId: 'c-1',
      icon: '🧭',
      title: 'Navigation (Map & Compass)',
      description: 'Topographic trail map, baseplate compass, and pre-downloaded offline trail route.',
      whyImportant: 'Dense Philippine mountain forests (Sierra Madre, Mt. Apo, Cordillera) frequently lose cellular signal and GPS accuracy.',
      prepTip: 'Keep your paper map inside a waterproof zip bag.',
      safetyTip: 'Never separate from your patrol buddy; orient your map before every trail junction.'
    },
    {
      num: 2,
      checklistId: 'c-2',
      icon: '☀️',
      title: 'Sun Protection',
      description: 'Water-resistant Sunscreen SPF 30+, wide-brim scout hat, and UV-blocking sunglasses.',
      whyImportant: 'Tropical Philippine UV levels regularly reach Extreme (11+) on open ridges and beaches.',
      prepTip: 'Apply sunscreen 15 minutes before stepping onto the trail.',
      safetyTip: 'Reapply every 2 hours or immediately after heavy sweating or swimming.'
    },
    {
      num: 3,
      checklistId: 'c-3',
      icon: '🧥',
      title: 'Extra Clothing & Rain Gear',
      description: 'Raincoat/poncho, quick-dry spare shirts, extra wool/synthetic socks, and warm layer for mountains.',
      whyImportant: 'Sudden tropical squalls can soak hikers quickly, while high-altitude camps like Mt. Pulag drop below 10°C.',
      prepTip: 'Pack spare clothes inside a waterproof dry bag or double-lined plastic bag.',
      safetyTip: 'Avoid heavy cotton clothes that hold moisture and cause rapid chilling.'
    },
    {
      num: 4,
      checklistId: 'c-4',
      icon: '🔦',
      title: 'Lighting (Flashlight / Headlamp)',
      description: 'LED headlamp or flashlight with fresh batteries and spare power cells.',
      whyImportant: 'Philippine sunsets happen quickly (~5:45–6:15 PM year-round) and forest trails become pitch dark.',
      prepTip: 'Test batteries at home and lock the power switch in your pack so it does not drain.',
      safetyTip: 'Use red-light mode inside tents at night to preserve night vision and avoid blinding patrol mates.'
    },
    {
      num: 5,
      checklistId: 'c-5',
      icon: '🩹',
      title: 'First Aid Kit',
      description: 'ScoutCare PH kit with Betadine, bandages, Hydrite ORS, DEET, and personal rescue meds.',
      whyImportant: 'Immediate care prevents small trail cuts, blisters, and insect bites from becoming serious infections.',
      prepTip: 'Inspect expiration dates 1 week before campout using the Kit Inventory tab.',
      safetyTip: 'Always wear disposable nitrile gloves before treating another scout’s bleeding wound.'
    },
    {
      num: 6,
      checklistId: 'c-6',
      icon: '🔥',
      title: 'Fire (Adult-Supervised)',
      description: 'Waterproof matches, lighter, or fire-starter kept in a sealed container.',
      whyImportant: 'Emergency warmth, boiling water if purification tablets run out, and cooking.',
      prepTip: 'Store matches in a waterproof film canister or zip bag.',
      safetyTip: 'Scouts must ONLY build fires in designated rings under direct Scoutmaster supervision.'
    },
    {
      num: 7,
      checklistId: 'c-7',
      icon: '🛠️',
      title: 'Repair Kit & Tools',
      description: 'Multi-tool or scout knife (with Whittling/Totin’ Chip), paracord, and small roll of duct tape.',
      whyImportant: 'Fixes torn tent rainflies, broken backpack straps, or loose camp stoves in the field.',
      prepTip: 'Wrap 1–2 meters of duct tape around your water bottle to save space.',
      safetyTip: 'Keep blades closed and sharp; never walk with an open pocketknife.'
    },
    {
      num: 8,
      checklistId: 'c-8',
      icon: '🥜',
      title: 'Extra Food',
      description: 'Non-perishable high-calorie trail snacks (trail mix, nuts, crackers, dried fruit).',
      whyImportant: 'Maintains energy during steep climbs or unexpected trail delays.',
      prepTip: 'Pack an extra day’s worth of dry snacks that will not spoil in tropical heat.',
      safetyTip: 'Store all food in sealed containers away from tents to avoid ants, rats, and wildlife.'
    },
    {
      num: 9,
      checklistId: 'c-9',
      icon: '💧',
      title: 'Extra Water & Purification',
      description: 'At least 2 Liters of clean drinking water plus water purification tablets or filter.',
      whyImportant: 'High Philippine heat index accelerates dehydration and heatstroke risk.',
      prepTip: 'Fill all water bottles completely before leaving the jump-off point.',
      safetyTip: 'Never drink untreated river or spring water—always boil or purify to prevent stomach illness.'
    },
    {
      num: 10,
      checklistId: 'c-10',
      icon: '⛺',
      title: 'Emergency Shelter',
      description: 'Tent with rainfly, lightweight tarp, or compact Mylar emergency blanket.',
      whyImportant: 'Protects scouts from sudden typhoon-season downpours, wind, and hypothermia.',
      prepTip: 'Always pack a lightweight Mylar blanket even on day hikes.',
      safetyTip: 'Never pitch tents in dry riverbeds or under dead, overhanging tree branches.'
    }
  ],

  init() {
    this.render();
    window.scoutState.subscribe(() => {
      if (window.App && window.App.currentView === 'essentials') {
        this.render();
      }
    });
  },

  render() {
    const container = document.getElementById('essentials-view');
    if (!container) return;

    const checklists = window.scoutState.getState().checklists || [];
    const packedCount = checklists.filter(c => c.packed).length;
    const pct = checklists.length > 0 ? Math.round((packedCount / checklists.length) * 100) : 0;

    container.innerHTML = `
      <div class="screen-header">
        <div class="screen-title-group">
          <span class="badge-tag">BSP Outdoor Standard</span>
          <h1 class="screen-title">Camping Ten Essentials</h1>
          <p class="screen-subtitle">Essential survival & safety gear tailored for Philippine outdoor scouting.</p>
        </div>
      </div>

      <div class="glass-card">
        <div class="summary-top">
          <div>
            <h3>Ten Essentials Packed</h3>
            <p class="text-muted"><strong>${packedCount}</strong> of <strong>10</strong> essentials packed in your bag</p>
          </div>
          <div class="packed-percent-badge">${pct}%</div>
        </div>
        <div class="progress-bar-track">
          <div class="progress-bar-fill" style="width: ${pct}%;"></div>
        </div>
        <div class="summary-footer">
          <span class="text-muted">Tap any card's checkbox to mark packed</span>
          <button class="btn btn-sm btn-outline" onclick="EssentialsVM.reset()">Reset</button>
        </div>
      </div>

      <div class="essentials-cards-stack">
        ${this.items.map(item => {
          const checkObj = checklists.find(c => c.id === item.checklistId);
          const isPacked = checkObj ? checkObj.packed : false;

          return `
            <div class="glass-card essential-detail-card ${isPacked ? 'item-packed-glass' : ''}">
              <div class="essential-top-row">
                <div class="essential-icon-badge">${item.icon}</div>
                <div class="essential-title-col">
                  <span class="badge-tag">Essential #${item.num}</span>
                  <h3>${item.title}</h3>
                </div>
                <button class="todo-checkbox-btn" onclick="EssentialsVM.togglePacked('${item.checklistId}')">
                  ${isPacked ? '☑️' : '⬜'}
                </button>
              </div>

              <p class="essential-desc">${item.description}</p>

              <div class="essential-tips-grid">
                <div class="tip-mini-box">
                  <strong>🇵🇭 Why Important:</strong> ${item.whyImportant}
                </div>
                <div class="tip-mini-box">
                  <strong>🎒 Prep Tip:</strong> ${item.prepTip}
                </div>
                <div class="tip-mini-box">
                  <strong>🛡️ Safety Tip:</strong> ${item.safetyTip}
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  },

  togglePacked(id) {
    window.scoutState.toggleChecklistItem(id);
  },

  reset() {
    if (confirm('Reset all Ten Essentials packing checkboxes?')) {
      window.scoutState.resetChecklist();
    }
  }
};

window.EssentialsVM = EssentialsVM;
