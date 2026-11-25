// ScoutCare PH — Kit Inventory ViewModel
const KitVM = {
  activeTab: 'inventory', // 'inventory' | 'shopping'
  activeCategory: 'All',
  filterStatus: 'all',
  sortBy: 'default', // 'default' | 'expiry_asc'
  searchQuery: '',

  init() {
    this.render();
    window.scoutState.subscribe(() => {
      if (window.App && window.App.currentView && window.App.currentView.startsWith('kit')) {
        this.render();
      }
    });
  },

  setTab(tab) {
    this.activeTab = tab;
    this.render();
  },

  setCategory(category) {
    this.activeCategory = category;
    this.render();
  },

  setFilterStatus(status) {
    this.filterStatus = status;
    this.render();
  },

  setSortBy(sort) {
    this.sortBy = sort;
    this.render();
  },

  setSearch(query) {
    this.searchQuery = (query || '').toLowerCase().trim();
    this.render();
  },

  getFilteredItems() {
    const items = [...window.scoutState.getState().kitItems];

    let filtered = items.filter(item => {
      if (this.activeCategory !== 'All' && item.category !== this.activeCategory) {
        return false;
      }
      if (this.searchQuery) {
        const q = this.searchQuery;
        const match =
          item.name.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          (item.purpose || '').toLowerCase().includes(q) ||
          (item.intendedUse || '').toLowerCase().includes(q);
        if (!match) return false;
      }
      if (this.filterStatus !== 'all') {
        const status = window.scoutState.getItemStatus(item);
        if (status !== this.filterStatus) return false;
      }
      return true;
    });

    if (this.sortBy === 'expiry_asc') {
      filtered.sort((a, b) => {
        if (!a.expiryDate && !b.expiryDate) return 0;
        if (!a.expiryDate) return 1;
        if (!b.expiryDate) return -1;
        return new Date(a.expiryDate) - new Date(b.expiryDate);
      });
    }

    return filtered;
  },

  render() {
    const container = document.getElementById('kit-inventory-view');
    if (!container) return;

    const stats = window.scoutState.getKitStats();
    const filteredItems = this.getFilteredItems();

    let gaugeColor = '#34C759';
    let gaugeLabel = 'Camp Ready';
    if (stats.readinessScore < 70) {
      gaugeColor = '#EF4444';
      gaugeLabel = 'Needs Attention';
    } else if (stats.readinessScore < 88) {
      gaugeColor = '#F59E0B';
      gaugeLabel = 'Partially Ready';
    }

    container.innerHTML = `
      <div class="screen-header">
        <div class="screen-title-group">
          <span class="badge-tag">🇵🇭 BSP First Aid Standard</span>
          <h1 class="screen-title">${window.I18n ? window.I18n.t('first_aid_kit') : 'First Aid Kit'}</h1>
          <p class="screen-subtitle">Philippine tropical camping supplies, medical officer review & shopping list.</p>
        </div>
        <button class="btn btn-primary" onclick="KitVM.openAddModal()">
          ➕ ${window.I18n ? window.I18n.t('add_item') : 'Add Item'}
        </button>
      </div>

      <!-- Readiness Banner -->
      <div class="glass-card kit-readiness-banner">
        <div class="readiness-meter">
          <div class="readiness-circle" style="background: conic-gradient(${gaugeColor} ${stats.readinessScore * 3.6}deg, rgba(255,255,255,0.15) 0deg);">
            <div class="readiness-inner">
              <span class="readiness-val">${stats.readinessScore}%</span>
              <span class="readiness-tag">Ready</span>
            </div>
          </div>
        </div>
        <div class="readiness-info">
          <div class="readiness-status-badge" style="background: ${gaugeColor}25; color: ${gaugeColor}; border: 1px solid ${gaugeColor}60;">
            ${gaugeLabel}
          </div>
          <h3>${stats.total} Philippine Camping Supplies</h3>
          <div class="readiness-alert-chips">
            <button class="chip-alert ${stats.expired > 0 ? 'chip-expired' : ''}" onclick="KitVM.setFilterStatus('${this.filterStatus === 'Expired' ? 'all' : 'Expired'}')">
              <strong>${stats.expired}</strong> Expired
            </button>
            <button class="chip-alert ${stats.expiringSoon > 0 ? 'chip-expiring' : ''}" onclick="KitVM.setFilterStatus('${this.filterStatus === 'Expiring Soon' ? 'all' : 'Expiring Soon'}')">
              <strong>${stats.expiringSoon}</strong> Expiring Soon
            </button>
            <button class="chip-alert ${stats.needToBuy > 0 ? 'chip-low' : ''}" onclick="KitVM.setFilterStatus('${this.filterStatus === 'Need to Buy' ? 'all' : 'Need to Buy'}')">
              <strong>${stats.needToBuy}</strong> Need to Buy
            </button>
            <button class="chip-alert ${stats.missing > 0 ? 'chip-missing' : ''}" onclick="KitVM.setFilterStatus('${this.filterStatus === 'Missing' ? 'all' : 'Missing'}')">
              <strong>${stats.missing}</strong> Missing
            </button>
          </div>
        </div>
      </div>

      <!-- Tab Switcher: Inventory vs Shopping List -->
      <div class="pill-group">
        <button class="pill-btn ${this.activeTab === 'inventory' ? 'active' : ''}" onclick="KitVM.setTab('inventory')">
          🎒 Inventory (${stats.total})
        </button>
        <button class="pill-btn ${this.activeTab === 'shopping' ? 'active' : ''}" onclick="KitVM.setTab('shopping')">
          🛒 ${window.I18n ? window.I18n.t('shopping_list') : 'Shopping List'} (${stats.shoppingCount})
        </button>
      </div>

      ${this.activeTab === 'shopping' ? this.renderShoppingList() : this.renderInventoryTab(filteredItems)}
    `;
  },

  renderInventoryTab(filteredItems) {
    return `
      <!-- Medical Officer Advisory -->
      <div class="alert-box alert-warning">
        <span>⚕️</span>
        <div>
          <strong>Camp Medical Officer Policy:</strong> Medicine selection must be reviewed by the Camp Medical Officer or licensed healthcare professional according to Scouts' ages, allergies, and parental consent. <strong>No Aspirin for minors; no routine antibiotics.</strong>
        </div>
      </div>

      <!-- Search and Sort -->
      <div class="kit-controls-bar">
        <div class="search-and-actions">
          <div class="search-input-wrapper">
            <span class="search-icon">🔍</span>
            <input type="text" class="input-field" placeholder="Search Betadine, Biogesic, Hydrite, DEET..." value="${this.searchQuery}" oninput="KitVM.setSearch(this.value)">
            ${this.searchQuery ? `<button class="btn-clear" onclick="KitVM.setSearch('')">✕</button>` : ''}
          </div>
          <select class="input-field sort-select" onchange="KitVM.setSortBy(this.value)">
            <option value="default" ${this.sortBy === 'default' ? 'selected' : ''}>Sort: Default</option>
            <option value="expiry_asc" ${this.sortBy === 'expiry_asc' ? 'selected' : ''}>Sort: Expiration (Soonest)</option>
          </select>
        </div>
      </div>

      <!-- Category Tabs -->
      <div class="category-tabs-scroll">
        ${['All', 'Wound Care and Bandaging', 'Medicines and Health Supplies', 'Philippine Outdoor & Tropical Supplies'].map(cat => `
          <button class="category-tab ${this.activeCategory === cat ? 'active' : ''}" onclick="KitVM.setCategory('${cat}')">
            ${cat === 'All' ? 'All Categories' : cat}
          </button>
        `).join('')}
      </div>

      <!-- Items List -->
      <div class="kit-items-grid">
        ${filteredItems.length === 0 ? `
          <div class="glass-card empty-state-box">
            <div class="empty-icon">🎒</div>
            <h3>No Supplies Found</h3>
            <p>Adjust your search, category, or status filter.</p>
            <button class="btn btn-outline" onclick="KitVM.resetFilters()">Clear Filters</button>
          </div>
        ` : filteredItems.map(item => this.renderItemCard(item)).join('')}
      </div>
    `;
  },

  renderItemCard(item) {
    const status = window.scoutState.getItemStatus(item);
    const req = item.requiredQuantity || item.minQuantity || 1;
    const shortage = Math.max(0, req - item.quantity);

    let statusClass = 'status-ok';
    let cardHighlight = '';
    if (status === 'Expired') { statusClass = 'status-expired'; cardHighlight = 'card-expired'; }
    else if (status === 'Missing') { statusClass = 'status-missing'; cardHighlight = 'card-missing'; }
    else if (status === 'Need to Buy') { statusClass = 'status-low'; cardHighlight = 'card-low'; }
    else if (status === 'Expiring Soon') { statusClass = 'status-expiring'; cardHighlight = 'card-low'; }

    return `
      <div class="glass-card kit-item-card ${cardHighlight}">
        <div class="kit-item-header">
          <span class="kit-item-cat">${item.category}</span>
          <span class="status-pill ${statusClass}">${status}</span>
        </div>

        <h4 class="kit-item-name">${item.name}</h4>

        <div class="kit-item-meta-row">
          <div><strong>Available:</strong> ${item.quantity} / ${req} ${item.unit}</div>
          ${shortage > 0 ? `<div class="text-danger"><strong>Shortage:</strong> ${shortage} ${item.unit}</div>` : ''}
          ${item.expiryDate ? `<div><strong>Exp:</strong> <span class="${status === 'Expired' ? 'text-danger font-bold' : ''}">${item.expiryDate}</span></div>` : ''}
          <div><strong>Location:</strong> ${item.location || 'Main Kit'}</div>
        </div>

        <div class="kit-purpose-box">
          <div><strong>Purpose:</strong> ${item.purpose || item.intendedUse || 'First aid supply'}</div>
          ${item.howToUse ? `<div class="how-to-use-text"><strong>Safe Use:</strong> ${item.howToUse}</div>` : ''}
          ${item.isMedicine ? `
            <div class="med-audit-meta">
              <div><strong>Storage:</strong> ${item.storageInstructions || 'Room temp'}</div>
              <div><strong>Age Limit:</strong> ${item.ageRestrictions || 'Check label'}</div>
              <div><strong>Allergy Warning:</strong> ${item.allergyWarnings || 'None noted'}</div>
              <div><strong>Parent Consent:</strong> ${item.parentConsent || 'Required'} • <strong>Med Officer:</strong> ${item.medOfficerApproval || 'Pending'}</div>
              ${item.maxDailyDose ? `<div class="text-warning"><strong>⚠️ Max Dose:</strong> ${item.maxDailyDose}</div>` : ''}
            </div>
          ` : ''}
          ${item.notes ? `<div class="text-muted" style="margin-top:4px;"><small>Note: ${item.notes}</small></div>` : ''}
        </div>

        <div class="kit-item-actions">
          <div class="quantity-stepper">
            <button class="step-btn" aria-label="Decrease" onclick="KitVM.stepQuantity('${item.id}', -1)">−</button>
            <span class="step-val">${item.quantity}</span>
            <button class="step-btn" aria-label="Increase" onclick="KitVM.stepQuantity('${item.id}', 1)">+</button>
          </div>
          <div class="btn-group-right">
            <button class="btn btn-sm btn-outline" onclick="KitVM.openEditModal('${item.id}')">Edit</button>
            <button class="btn btn-sm btn-icon-danger" aria-label="Delete" onclick="KitVM.confirmDelete('${item.id}', '${item.name.replace(/'/g, "\\'")}')">🗑️</button>
          </div>
        </div>
      </div>
    `;
  },

  renderShoppingList() {
    const items = window.scoutState.getState().kitItems;
    const needed = items.filter(item => {
      const s = window.scoutState.getItemStatus(item);
      return s === 'Missing' || s === 'Need to Buy' || s === 'Expired';
    });

    if (needed.length === 0) {
      return `
        <div class="glass-card empty-state-box">
          <div class="empty-icon">🎉</div>
          <h3>Shopping List Complete!</h3>
          <p>All Philippine first-aid supplies and medicines are stocked and unexpired.</p>
        </div>
      `;
    }

    return `
      <div class="glass-card">
        <div class="card-header-flex">
          <div>
            <h3>🛒 Automated Replenishment Shopping List</h3>
            <p class="text-muted">Items below are Missing, Short, or Expired. Tap "Mark Purchased" to restock automatically.</p>
          </div>
          <button class="btn btn-sm btn-outline" onclick="window.print()">🖨️ Print</button>
        </div>

        <div class="shopping-list-cards">
          ${needed.map(item => {
            const status = window.scoutState.getItemStatus(item);
            const req = item.requiredQuantity || item.minQuantity || 1;
            const buyQty = status === 'Expired' ? req : Math.max(1, req - item.quantity);

            return `
              <div class="shopping-row">
                <div class="shopping-info">
                  <span class="status-pill ${status === 'Expired' ? 'status-expired' : status === 'Missing' ? 'status-missing' : 'status-low'}">${status}</span>
                  <strong>${item.name}</strong>
                  <small class="text-muted">Buy: ${buyQty} ${item.unit} • ${item.category}</small>
                </div>
                <button class="btn btn-sm btn-success" onclick="KitVM.markPurchased('${item.id}')">
                  ✅ ${window.I18n ? window.I18n.t('mark_purchased') : 'Mark Purchased'}
                </button>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  },

  markPurchased(id) {
    window.scoutState.markItemPurchased(id);
    if (window.App) window.App.showToast('Item marked as purchased and inventory updated!', 'success');
  },

  stepQuantity(id, delta) {
    const item = window.scoutState.getState().kitItems.find(i => i.id === id);
    if (!item) return;
    const newQty = Math.max(0, item.quantity + delta);
    window.scoutState.updateKitItem(id, { quantity: newQty });
    if (window.App) window.App.showToast(`Updated ${item.name} to ${newQty} ${item.unit}.`, 'info');
  },

  resetFilters() {
    this.activeCategory = 'All';
    this.filterStatus = 'all';
    this.sortBy = 'default';
    this.searchQuery = '';
    this.render();
  },

  openAddModal() {
    this.openEditModal(null);
  },

  openEditModal(itemId) {
    const isEdit = !!itemId;
    const item = isEdit
      ? window.scoutState.getState().kitItems.find(i => i.id === itemId)
      : {
          name: '',
          category: this.activeCategory !== 'All' ? this.activeCategory : 'Wound Care and Bandaging',
          requiredQuantity: 2,
          quantity: 0,
          unit: 'pcs',
          expiryDate: '',
          location: 'Main Medical Compartment',
          purpose: '',
          howToUse: '',
          notes: ''
        };

    const modalHtml = `
      <div class="modal-overlay" id="kit-modal">
        <div class="modal-card glass-modal">
          <div class="modal-header">
            <h3>${isEdit ? 'Edit Supply Item' : 'Add First-Aid Supply'}</h3>
            <button class="modal-close" onclick="KitVM.closeModal()">✕</button>
          </div>
          <form onsubmit="KitVM.handleFormSubmit(event, '${itemId || ''}')">
            <div class="form-group">
              <label class="form-label">Item Name *</label>
              <input type="text" id="supply-name" class="input-field" required placeholder="e.g. Betadine 10% Solution" value="${item.name}">
            </div>

            <div class="form-group">
              <label class="form-label">Category *</label>
              <select id="supply-category" class="input-field" required>
                ${['Wound Care and Bandaging', 'Medicines and Health Supplies', 'Philippine Outdoor & Tropical Supplies'].map(c => `
                  <option value="${c}" ${item.category === c ? 'selected' : ''}>${c}</option>
                `).join('')}
              </select>
            </div>

            <div class="form-row-3">
              <div class="form-group">
                <label class="form-label">Required Qty *</label>
                <input type="number" id="supply-req-qty" class="input-field" required min="1" value="${item.requiredQuantity || item.minQuantity || 1}">
              </div>
              <div class="form-group">
                <label class="form-label">Available Qty *</label>
                <input type="number" id="supply-qty" class="input-field" required min="0" value="${item.quantity}">
              </div>
              <div class="form-group">
                <label class="form-label">Unit</label>
                <input type="text" id="supply-unit" class="input-field" value="${item.unit || 'pcs'}">
              </div>
            </div>

            <div class="form-row-2">
              <div class="form-group">
                <label class="form-label">Expiration Date</label>
                <input type="date" id="supply-expiry" class="input-field" value="${item.expiryDate || ''}">
              </div>
              <div class="form-group">
                <label class="form-label">Storage Location</label>
                <input type="text" id="supply-location" class="input-field" value="${item.location || ''}">
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Purpose / Intended Use</label>
              <textarea id="supply-purpose" class="input-field" rows="2">${item.purpose || item.intendedUse || ''}</textarea>
            </div>

            <div class="form-group">
              <label class="form-label">Notes</label>
              <input type="text" id="supply-notes" class="input-field" value="${item.notes || ''}">
            </div>

            <div class="modal-footer">
              <button type="button" class="btn btn-outline" onclick="KitVM.closeModal()">Cancel</button>
              <button type="submit" class="btn btn-primary">${isEdit ? 'Save Changes' : 'Add Supply'}</button>
            </div>
          </form>
        </div>
      </div>
    `;

    document.getElementById('modal-container').innerHTML = modalHtml;
  },

  handleFormSubmit(event, itemId) {
    event.preventDefault();
    const name = document.getElementById('supply-name').value.trim();
    const category = document.getElementById('supply-category').value;
    const requiredQuantity = parseInt(document.getElementById('supply-req-qty').value, 10) || 1;
    const quantity = parseInt(document.getElementById('supply-qty').value, 10) || 0;
    const unit = document.getElementById('supply-unit').value.trim() || 'pcs';
    const expiryDate = document.getElementById('supply-expiry').value;
    const location = document.getElementById('supply-location').value.trim();
    const purpose = document.getElementById('supply-purpose').value.trim();
    const notes = document.getElementById('supply-notes').value.trim();

    if (!name) return;

    const payload = {
      name,
      category,
      requiredQuantity,
      minQuantity: requiredQuantity,
      quantity,
      unit,
      expiryDate,
      location,
      purpose,
      notes,
      isMedicine: category === 'Medicines and Health Supplies'
    };

    if (itemId) {
      window.scoutState.updateKitItem(itemId, payload);
      if (window.App) window.App.showToast(`Updated ${name}!`, 'success');
    } else {
      window.scoutState.addKitItem(payload);
      if (window.App) window.App.showToast(`Added ${name} to kit!`, 'success');
    }

    this.closeModal();
  },

  confirmDelete(id, name) {
    if (confirm(`Remove "${name}" from your First-Aid Kit?`)) {
      window.scoutState.deleteKitItem(id);
      if (window.App) window.App.showToast(`Removed ${name}.`, 'info');
    }
  },

  closeModal() {
    const modal = document.getElementById('kit-modal');
    if (modal) modal.remove();
  }
};

window.KitVM = KitVM;
window.KitModule = KitVM;
