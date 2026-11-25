// ScoutCare PH — Camping Preparation To-Do List ViewModel
const TodoVM = {
  activeCategory: 'All',
  searchQuery: '',

  init() {
    this.render();
    window.scoutState.subscribe(() => {
      if (window.App && window.App.currentView === 'todo') {
        this.render();
      }
    });
  },

  setCategory(cat) {
    this.activeCategory = cat;
    this.render();
  },

  setSearch(q) {
    this.searchQuery = (q || '').toLowerCase().trim();
    this.render();
  },

  render() {
    const container = document.getElementById('todo-view');
    if (!container) return;

    const todos = window.scoutState.getState().todos || [];
    const total = todos.length;
    const completed = todos.filter(t => t.completed).length;
    const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

    const categories = [
      'All',
      'First Aid Preparation',
      'Camping Equipment',
      'Food and Water',
      'Scout Training and Preparation'
    ];

    const filtered = todos.filter(t => {
      if (this.activeCategory !== 'All' && t.category !== this.activeCategory) return false;
      if (this.searchQuery && !t.title.toLowerCase().includes(this.searchQuery)) return false;
      return true;
    });

    container.innerHTML = `
      <div class="screen-header">
        <div class="screen-title-group">
          <span class="badge-tag">Camp Prep Checklist</span>
          <h1 class="screen-title">${window.I18n ? window.I18n.t('camping_checklist') : 'Camping Preparation'}</h1>
          <p class="screen-subtitle">Track First Aid, Equipment, Food/Water, and Scout Training tasks.</p>
        </div>
        <button class="btn btn-primary" onclick="TodoVM.openAddModal()">➕ Add Task</button>
      </div>

      <!-- Progress Card -->
      <div class="glass-card">
        <div class="summary-top">
          <div>
            <h3>Overall To-Do Progress</h3>
            <p class="text-muted"><strong>${completed}</strong> of <strong>${total}</strong> tasks completed (${total - completed} remaining)</p>
          </div>
          <div class="packed-percent-badge">${pct}%</div>
        </div>
        <div class="progress-bar-track">
          <div class="progress-bar-fill" style="width: ${pct}%;"></div>
        </div>
        <div class="summary-footer">
          <span class="text-muted">Auto-saved locally</span>
          <button class="btn btn-sm btn-outline-danger" onclick="TodoVM.confirmReset()">🔄 Reset All</button>
        </div>
      </div>

      <!-- Search -->
      <div class="search-input-wrapper" style="margin-bottom: 0.75rem;">
        <span class="search-icon">🔍</span>
        <input type="text" class="input-field" placeholder="Search tasks (e.g., Betadine, Tent, CPR)..." value="${this.searchQuery}" oninput="TodoVM.setSearch(this.value)">
      </div>

      <!-- Category Tabs -->
      <div class="category-tabs-scroll">
        ${categories.map(cat => `
          <button class="category-tab ${this.activeCategory === cat ? 'active' : ''}" onclick="TodoVM.setCategory('${cat}')">
            ${cat}
          </button>
        `).join('')}
      </div>

      <!-- Tasks List -->
      <div class="todo-list-stack">
        ${filtered.length === 0 ? `
          <div class="glass-card empty-state-box">
            <p>No tasks match your filter.</p>
          </div>
        ` : filtered.map(t => `
          <div class="glass-card todo-item-card ${t.completed ? 'todo-done' : ''}">
            <div class="todo-main-row">
              <button class="todo-checkbox-btn" aria-label="Toggle task" onclick="TodoVM.toggleTask('${t.id}')">
                ${t.completed ? '☑️' : '⬜'}
              </button>
              <div class="todo-content" onclick="TodoVM.toggleTask('${t.id}')">
                <div class="todo-title">${t.title}</div>
                <div class="todo-meta">
                  <span class="category-pill">${t.category}</span>
                  ${t.priority ? `<span class="status-pill ${t.priority === 'High' ? 'status-missing' : 'status-low'}">${t.priority}</span>` : ''}
                  ${t.assignee ? `<span class="text-muted">👤 ${t.assignee}</span>` : ''}
                  ${t.deadline ? `<span class="text-muted">📅 ${t.deadline}</span>` : ''}
                </div>
                ${t.notes ? `<div class="todo-notes"><small>${t.notes}</small></div>` : ''}
              </div>
              <div class="todo-actions">
                <button class="btn btn-sm btn-outline" onclick="TodoVM.openEditModal('${t.id}')">✏️</button>
                <button class="btn btn-sm btn-icon-danger" onclick="TodoVM.deleteTask('${t.id}')">🗑️</button>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  },

  toggleTask(id) {
    window.scoutState.toggleTodo(id);
  },

  deleteTask(id) {
    if (confirm('Delete this preparation task?')) {
      window.scoutState.deleteTodo(id);
      if (window.App) window.App.showToast('Task deleted.', 'info');
    }
  },

  confirmReset() {
    if (confirm('Are you sure you want to uncheck ALL camping preparation tasks?')) {
      window.scoutState.resetTodos();
      if (window.App) window.App.showToast('All tasks reset to incomplete.', 'info');
    }
  },

  openAddModal() {
    this.openEditModal(null);
  },

  openEditModal(todoId) {
    const isEdit = !!todoId;
    const t = isEdit
      ? window.scoutState.getState().todos.find(x => x.id === todoId)
      : {
          title: '',
          category: this.activeCategory !== 'All' ? this.activeCategory : 'Camping Equipment',
          priority: 'Medium',
          assignee: 'Self',
          deadline: window.scoutState.getState().campoutInfo?.date || '2026-12-05',
          notes: ''
        };

    const modalHtml = `
      <div class="modal-overlay" id="todo-modal">
        <div class="modal-card glass-modal">
          <div class="modal-header">
            <h3>${isEdit ? 'Edit Preparation Task' : 'Add Custom Preparation Task'}</h3>
            <button class="modal-close" onclick="TodoVM.closeModal()">✕</button>
          </div>
          <form onsubmit="TodoVM.handleSubmit(event, '${todoId || ''}')">
            <div class="form-group">
              <label class="form-label">Task Title *</label>
              <input type="text" id="td-title" class="input-field" required placeholder="e.g. Pack waterproof dry bag" value="${t.title}">
            </div>

            <div class="form-row-2">
              <div class="form-group">
                <label class="form-label">Category *</label>
                <select id="td-category" class="input-field">
                  ${['First Aid Preparation', 'Camping Equipment', 'Food and Water', 'Scout Training and Preparation'].map(c => `
                    <option value="${c}" ${t.category === c ? 'selected' : ''}>${c}</option>
                  `).join('')}
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Priority</label>
                <select id="td-priority" class="input-field">
                  <option value="High" ${t.priority === 'High' ? 'selected' : ''}>High</option>
                  <option value="Medium" ${t.priority === 'Medium' ? 'selected' : ''}>Medium</option>
                  <option value="Low" ${t.priority === 'Low' ? 'selected' : ''}>Low</option>
                </select>
              </div>
            </div>

            <div class="form-row-2">
              <div class="form-group">
                <label class="form-label">Assign To</label>
                <select id="td-assignee" class="input-field">
                  <option value="Self" ${t.assignee === 'Self' ? 'selected' : ''}>Self (Scout)</option>
                  <option value="Guardian" ${t.assignee === 'Guardian' ? 'selected' : ''}>Parent / Guardian</option>
                  <option value="Leader" ${t.assignee === 'Leader' ? 'selected' : ''}>Scout Leader / Patrol</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Deadline</label>
                <input type="date" id="td-deadline" class="input-field" value="${t.deadline || ''}">
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Notes</label>
              <input type="text" id="td-notes" class="input-field" placeholder="Optional details..." value="${t.notes || ''}">
            </div>

            <div class="modal-footer">
              <button type="button" class="btn btn-outline" onclick="TodoVM.closeModal()">Cancel</button>
              <button type="submit" class="btn btn-primary">${isEdit ? 'Save Task' : 'Add Task'}</button>
            </div>
          </form>
        </div>
      </div>
    `;

    document.getElementById('modal-container').innerHTML = modalHtml;
  },

  handleSubmit(event, todoId) {
    event.preventDefault();
    const payload = {
      title: document.getElementById('td-title').value.trim(),
      category: document.getElementById('td-category').value,
      priority: document.getElementById('td-priority').value,
      assignee: document.getElementById('td-assignee').value,
      deadline: document.getElementById('td-deadline').value,
      notes: document.getElementById('td-notes').value.trim()
    };

    if (!payload.title) return;

    if (todoId) {
      window.scoutState.updateTodo(todoId, payload);
      if (window.App) window.App.showToast('Task updated!', 'success');
    } else {
      window.scoutState.addTodo(payload);
      if (window.App) window.App.showToast('Custom task added!', 'success');
    }

    this.closeModal();
  },

  closeModal() {
    const m = document.getElementById('todo-modal');
    if (m) m.remove();
  }
};

window.TodoVM = TodoVM;
