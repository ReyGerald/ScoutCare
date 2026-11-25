// ScoutCare PH — Storage Service Layer (LocalStorage Persistence)
const StorageService = {
  STORAGE_KEY: 'scoutcare_ph_state_v2',

  load(defaultState) {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (err) {
      console.error('StorageService load error:', err);
    }
    return null;
  },

  save(state) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(state));
      return true;
    } catch (err) {
      console.error('StorageService save error:', err);
      return false;
    }
  },

  clear() {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
      return true;
    } catch (err) {
      console.error('StorageService clear error:', err);
      return false;
    }
  }
};

window.StorageService = StorageService;
