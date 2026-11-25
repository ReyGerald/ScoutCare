// ScoutCare PH — Bilingual Localization Engine (English & Filipino/Tagalog)
const I18N_DICTIONARY = {
  en: {
    app_name: 'ScoutCare PH',
    app_motto: 'Laging Handa • Be Prepared',
    nav_home: 'Home',
    nav_firstaid: 'First Aid',
    nav_kit: 'Kit',
    nav_medicines: 'Medicines',
    nav_profile: 'Profile',
    nav_camping: 'Camp Prep',
    nav_todo: 'To-Do',
    nav_essentials: '10 Essentials',
    nav_videos: 'Videos',
    sos_btn: 'SOS',
    emergency_title: 'EMERGENCY ASSISTANCE (SOS)',
    call_911: 'Call 911',
    consult_doctor: 'Consult a Doctor / Medical Officer',
    kit_readiness: 'Kit Readiness',
    first_aid_kit: 'First Aid Kit',
    medicine_reminders: 'Medicine Reminders',
    mark_taken: 'Mark as Taken',
    mark_skipped: 'Skip Dose',
    missed_dose: 'Missed Dose',
    camping_checklist: 'Camping Preparation',
    home_dashboard: 'Camping Prep Dashboard',
    lessons: 'First-Aid Lessons',
    profile: 'Profile & Settings',
    settings: 'Settings',
    search: 'Search...',
    add_item: 'Add Item',
    delete: 'Delete',
    edit: 'Edit',
    save: 'Save',
    cancel: 'Cancel',
    warning: 'Warning',
    danger: 'Danger',
    overdose_banner_title: 'DOSAGE & OVERDOSE SAFETY WARNING',
    overdose_banner_body: 'Never take a double dose if you miss one. Too much medicine can be harmful or dangerous. Always consult your parent, guardian, or Camp Medical Officer.',
    overdose_missed_alert: 'DO NOT take two doses at the same time to make up for this missed dose. Taking too much medicine is dangerous.',
    shopping_list: 'Shopping List',
    mark_purchased: 'Mark Purchased',
    total_tasks: 'Total Tasks',
    completed_tasks: 'Completed',
    remaining_tasks: 'Remaining',
    overall_prep: 'Overall Prep',
    logout: 'Switch / Log Out',
    language_label: 'Language'
  },
  fil: {
    app_name: 'ScoutCare PH',
    app_motto: 'Laging Handa • Be Prepared',
    nav_home: 'Home',
    nav_firstaid: 'Unang Lunas',
    nav_kit: 'Kit',
    nav_medicines: 'Gamot',
    nav_profile: 'Profile',
    nav_camping: 'Kamping',
    nav_todo: 'Gawain',
    nav_essentials: '10 Gamit',
    nav_videos: 'Mga Video',
    sos_btn: 'SOS',
    emergency_title: 'EMERHENSIYA AT TULONG (SOS)',
    call_911: 'Tumawag ng 911',
    consult_doctor: 'Kumonsulta sa Doktor / Medical Officer',
    kit_readiness: 'Kahandaan ng Kit',
    first_aid_kit: 'Kit ng Unang Lunas',
    medicine_reminders: 'Paalala ng Gamot',
    mark_taken: 'Nainom na',
    mark_skipped: 'Hindi nainom',
    missed_dose: 'Napalampas na Dosis',
    camping_checklist: 'Paghahanda sa Kamping',
    home_dashboard: 'Pangunahing Dashboard',
    lessons: 'Mga Aralin sa Unang Lunas',
    profile: 'Aking Impormasyon at Settings',
    settings: 'Mga Setting',
    search: 'Maghanap...',
    add_item: 'Magdagdag ng Aytem',
    delete: 'Burahin',
    edit: 'I-edit',
    save: 'I-save',
    cancel: 'Kanselahin',
    warning: 'Babala',
    danger: 'Panganib',
    overdose_banner_title: 'BABALA SA DOSIS AT SOBRANG PAG-INOM',
    overdose_banner_body: 'Huwag mag-double dose kung napalampas ang isang inumin. Ang sobrang dosis ng gamot ay mapanganib. Kumonsulta agad sa iyong magulang, guardian, o Camp Medical Officer.',
    overdose_missed_alert: 'HUWAG uminom ng dalawang dosis nang sabay para bawiin ang napalampas na inumin. Mapanganib ang sobrang gamot.',
    shopping_list: 'Listahan ng Bibilhin',
    mark_purchased: 'Nabili na',
    total_tasks: 'Kabuuang Gawain',
    completed_tasks: 'Tapos na',
    remaining_tasks: 'Natitira',
    overall_prep: 'Kabuuang Kahandaan',
    logout: 'Magpalit ng Account',
    language_label: 'Wika'
  }
};

const I18n = {
  getLang() {
    if (window.scoutState) {
      return window.scoutState.getState().settings?.language || 'en';
    }
    return 'en';
  },

  t(key) {
    const lang = this.getLang();
    const dict = I18N_DICTIONARY[lang] || I18N_DICTIONARY.en;
    return dict[key] || I18N_DICTIONARY.en[key] || key;
  },

  toggleLanguage() {
    const current = this.getLang();
    const next = current === 'en' ? 'fil' : 'en';
    window.scoutState.updateSettings({ language: next });
    if (window.App) {
      window.App.updateStaticLabels();
      window.App.showToast(
        next === 'fil' ? 'Wika ay pinalitan sa Filipino.' : 'Language switched to English.',
        'info'
      );
    }
  }
};

window.I18n = I18n;
