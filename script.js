/**
 * Password Manager Duplicate Cleaner & Universal Format Converter
 * Privacy-first, offline-capable, client-side only
 * Supports 40+ password manager and browser formats
 */

(function () {
  'use strict';

  // ===== STATE =====
  const state = {
    entries: [],
    duplicateGroups: [],
    formatsDetected: new Set(),
    encryptionEnabled: false,
    masterPassphrase: '',
    theme: localStorage.getItem('pwd-theme') || 'dark'
  };

  // ===== FORMAT DEFINITIONS (40+) =====
  const FORMATS = {
    'chrome-csv': { name: 'Chrome / Brave / Edge', headers: ['name', 'url', 'username', 'password'] },
    'firefox-csv': { name: 'Firefox', headers: ['hostname', 'httpRealm', 'formSubmitURL', 'usernameField', 'passwordField', 'username', 'password'] },
    'safari-csv': { name: 'Safari', headers: ['Title', 'URL', 'Username', 'Password', 'Notes', 'OTPAuth'] },
    'opera-csv': { name: 'Opera', headers: ['name', 'url', 'username', 'password'] },
    'vivaldi-csv': { name: 'Vivaldi', headers: ['name', 'url', 'username', 'password'] },
    'tor-csv': { name: 'Tor Browser', headers: ['hostname', 'username', 'password'] },
    'samsung-csv': { name: 'Samsung Internet', headers: ['name', 'url', 'username', 'password'] },
    'uc-csv': { name: 'UC Browser', headers: ['site', 'username', 'password'] },
    'yandex-csv': { name: 'Yandex Browser', headers: ['hostname', 'login', 'password'] },
    'duckduckgo-csv': { name: 'DuckDuckGo', headers: ['title', 'domain', 'username', 'password'] },
    'bitwarden-csv': { name: 'Bitwarden (CSV)', headers: ['folder', 'favorite', 'type', 'name', 'notes', 'fields', 'reprompt', 'login_uri', 'login_username', 'login_password', 'login_totp'] },
    'bitwarden-json': { name: 'Bitwarden (JSON)', headers: [] },
    'protonpass-json': { name: 'Proton Pass (JSON)', headers: [] },
    '1password-csv': { name: '1Password (CSV)', headers: ['Title', 'Username', 'Password', 'URL', 'Notes', 'Type'] },
    '1password-1pux': { name: '1Password (1PUX)', headers: [] },
    'lastpass-csv': { name: 'LastPass', headers: ['url', 'username', 'password', 'totp', 'extra', 'name', 'grouping', 'fav'] },
    'dashlane-csv': { name: 'Dashlane (CSV)', headers: ['username', 'username2', 'username3', 'password', 'name', 'website', 'category', 'note'] },
    'dashlane-json': { name: 'Dashlane (JSON)', headers: [] },
    'keeper-csv': { name: 'Keeper', headers: ['Folder', 'Title', 'Login', 'Password', 'web_address', 'Notes', 'custom fields'] },
    'nordpass-csv': { name: 'NordPass', headers: ['name', 'url', 'username', 'password', 'note'] },
    'roboform-csv': { name: 'RoboForm', headers: ['Name', 'Url', 'MatchUrl', 'Login', 'Pwd', 'Note'] },
    'keepass-csv': { name: 'KeePass (CSV)', headers: ['Group', 'Title', 'Username', 'Password', 'URL', 'Notes'] },
    'keepass-xml': { name: 'KeePass (XML)', headers: [] },
    'enpass-csv': { name: 'Enpass (CSV)', headers: ['Title', 'Username', 'Password', 'URL', 'Note'] },
    'enpass-json': { name: 'Enpass (JSON)', headers: [] },
    'zoho-csv': { name: 'Zoho Vault', headers: ['Folder Name', 'Account Name', 'User Name', 'Password', 'Website URL', 'Notes'] },
    'sticky-csv': { name: 'Sticky Password', headers: ['Title', 'Username', 'Password', 'URL', 'Notes'] },
    'logmeonce-csv': { name: 'LogMeOnce', headers: ['Title', 'URL', 'Username', 'Password'] },
    'remembear-csv': { name: 'RememBear', headers: ['Title', 'Username', 'Password', 'URL', 'Notes'] },
    'keeweb-json': { name: 'KeeWeb (JSON)', headers: [] },
    'buttercup-json': { name: 'Buttercup (JSON)', headers: [] },
    'lesspass-json': { name: 'LessPass (JSON)', headers: [] },
    'passbolt-json': { name: 'Passbolt (JSON)', headers: [] },
    'padloc-json': { name: 'Padloc (JSON)', headers: [] },
    'teampass-csv': { name: 'TeamPass', headers: ['Label', 'Login', 'Password', 'URL', 'Comment'] },
    'passwork-json': { name: 'Passwork (JSON)', headers: [] },
    'commonkey-csv': { name: 'CommonKey', headers: ['Name', 'URL', 'Username', 'Password'] },
    'myki-csv': { name: 'Myki', headers: ['name', 'url', 'username', 'password', 'note'] },
    'truekey-csv': { name: 'True Key', headers: ['Name', 'URL', 'Username', 'Password', 'Notes'] },
    'intuitive-csv': { name: 'Intuitive Password', headers: ['Title', 'Website', 'Username', 'Password', 'Notes'] },
    'passwordboss-csv': { name: 'Password Boss', headers: ['Name', 'Username', 'Password', 'URL', 'Notes'] },
    'splashid-csv': { name: 'SplashID', headers: ['Type', 'Field1', 'Field2', 'Field3', 'Field4', 'Field5', 'Field6', 'Notes'] },
    'msecure-csv': { name: 'mSecure', headers: ['Type', 'Name', 'Username', 'Password', 'URL', 'Notes'] },
    'datavault-csv': { name: 'DataVault', headers: ['Title', 'Username', 'Password', 'URL', 'Notes'] },
    'secrets-csv': { name: 'Secrets', headers: ['Name', 'URL', 'Username', 'Password', 'Notes'] },
    'codebook-csv': { name: 'Codebook', headers: ['Name', 'Username', 'Password', 'URL', 'Notes'] },
    'strongbox-csv': { name: 'Strongbox', headers: ['Title', 'Username', 'Password', 'URL', 'Notes', 'Group'] },
    'minimalist-json': { name: 'Minimalist (JSON)', headers: [] },
    'passky-json': { name: 'Passky (JSON)', headers: [] },
    'bitwardenrs-json': { name: 'Bitwarden_RS (JSON)', headers: [] },
    'keychain-csv': { name: 'Keychain (CSV)', headers: ['Title', 'URL', 'Username', 'Password', 'Notes'] },
    'generic-csv': { name: 'Generic CSV', headers: [] },
    'generic-json': { name: 'Generic JSON', headers: [] }
  };

  // ===== DOM REFERENCES =====
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  // ===== INIT =====
  function init() {
    applyTheme(state.theme);
    setupEventListeners();
    registerServiceWorker();
    setupInstallPrompt();
    loadFromStorage();
    updateStats();
  }

  // ===== THEME =====
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    state.theme = theme;
    localStorage.setItem('pwd-theme', theme);
    if ($('#sunIcon') && $('#moonIcon')) {
      $('#sunIcon').style.display = theme === 'light' ? 'block' : 'none';
      $('#moonIcon').style.display = theme === 'dark' ? 'block' : 'none';
    }
  }

  // ===== UNDO STATE =====
  let undoState = null;
  let undoTimer = null;
  let selectedEntryIndices = new Set();

  // ===== PASSWORD STRENGTH (COMMON PASSWORDS) =====
  const COMMON_PASSWORDS = new Set([
    'password','123456','12345678','qwerty','abc123','monkey','1234567','letmein',
    'trustno1','dragon','baseball','iloveyou','master','sunshine','ashley','bailey',
    'shadow','123123','654321','superman','qazwsx','michael','football','password1',
    'password123','welcome','login','princess','starwars','solo','passw0rd',
    'hello','charlie','donald','admin','111111','1234','12345','123456789',
    '000000','access','flower','hottie','loveme','zaq1zaq1','qwerty123'
  ]);

  // ===== EVENT LISTENERS =====
  function setupEventListeners() {
    // Theme toggle
    $('#themeToggle').addEventListener('click', () => {
      applyTheme(state.theme === 'dark' ? 'light' : 'dark');
    });

    // File upload
    const uploadArea = $('#uploadArea');
    const fileInput = $('#fileInput');

    uploadArea.addEventListener('dragover', (e) => {
      e.preventDefault();
      uploadArea.classList.add('dragover');
    });

    uploadArea.addEventListener('dragleave', () => {
      uploadArea.classList.remove('dragover');
    });

    uploadArea.addEventListener('drop', (e) => {
      e.preventDefault();
      uploadArea.classList.remove('dragover');
      handleFiles(e.dataTransfer.files);
    });

    fileInput.addEventListener('change', (e) => {
      handleFiles(e.target.files);
      fileInput.value = '';
    });

    // Buttons
    $('#loadSampleBtn').addEventListener('click', loadSampleData);
    $('#clearAllBtn').addEventListener('click', clearAllData);
    $('#findDuplicatesBtn').addEventListener('click', findDuplicates);
    $('#exportBtn').addEventListener('click', exportData);
    $('#deleteMarkedBtn').addEventListener('click', deleteMarked);

    // Encryption
    $('#encryptionCheckbox').addEventListener('change', (e) => {
      const panel = $('#encryptionPanel');
      panel.classList.toggle('active', e.target.checked);
      state.encryptionEnabled = e.target.checked;
    });

    $('#encryptSaveBtn').addEventListener('click', encryptAndSave);

    // Share buttons
    $('#shareWhatsApp').addEventListener('click', () => shareApp('whatsapp'));
    $('#shareTwitter').addEventListener('click', () => shareApp('twitter'));
    $('#shareLinkedIn').addEventListener('click', () => shareApp('linkedin'));
    $('#shareMore').addEventListener('click', () => shareApp('native'));

    // ===== NEW: Tab Navigation =====
    $$('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        $$('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const tab = btn.dataset.tab;
        $$('.tab-panel').forEach(p => p.style.display = 'none');
        // Show/hide main sections based on tab
        if (tab === 'workspace') {
          $('#searchSection').style.display = state.entries.length > 0 ? 'block' : 'none';
          $('#entriesSection').style.display = state.entries.length > 0 ? 'block' : 'none';
        } else {
          $('#searchSection').style.display = 'none';
          $('#entriesSection').style.display = 'none';
          const panel = $(`#${tab}Panel`);
          if (panel) panel.style.display = 'block';
        }
      });
    });

    // ===== NEW: Search & Filter =====
    if ($('#searchInput')) {
      $('#searchInput').addEventListener('input', debounce(filterEntries, 300));
      $('#filterSource').addEventListener('change', filterEntries);
      $('#filterStrength').addEventListener('change', filterEntries);
      $('#selectAllFilteredBtn').addEventListener('click', selectAllFiltered);
      $('#deleteSelectedBtn').addEventListener('click', deleteSelectedEntries);
      $('#autoCategorizeBtn').addEventListener('click', autoCategorize);
    }

    // ===== NEW: Undo =====
    if ($('#undoBtn')) {
      $('#undoBtn').addEventListener('click', performUndo);
    }

    // ===== NEW: Generator =====
    if ($('#generateBtn')) {
      $('#generateBtn').addEventListener('click', generatePasswords);
      $('#copyGenBtn').addEventListener('click', copyGeneratedPassword);
      $('#regenBtn').addEventListener('click', generatePasswords);
      $('#genLength').addEventListener('input', (e) => {
        $('#genLengthVal').textContent = e.target.value;
      });
    }

    // ===== NEW: Analyzer =====
    if ($('#analyzeBtn')) {
      $('#analyzeBtn').addEventListener('click', analyzePassword);
      $('#analyzeToggleVis').addEventListener('click', () => {
        const inp = $('#analyzeInput');
        inp.type = inp.type === 'password' ? 'text' : 'password';
      });
    }

    // ===== NEW: Health =====
    if ($('#analyzeHealthBtn')) {
      $('#analyzeHealthBtn').addEventListener('click', runHealthAnalysis);
    }

    // ===== NEW: Tools =====
    if ($('#backupBtn')) {
      $('#backupBtn').addEventListener('click', downloadBackup);
      $('#restoreBtn').addEventListener('click', () => $('#restoreFileInput').click());
      $('#restoreFileInput').addEventListener('change', restoreFromBackup);
      $('#smartMergeBtn').addEventListener('click', smartMergeEntries);
      $('#removeEmptyBtn').addEventListener('click', removeEmptyEntries);
      $('#normalizeUrlsBtn').addEventListener('click', normalizeAllUrls);
      $('#exportSelectedBtn').addEventListener('click', exportSelectedEntries);
    }

    // ===== NEW: Stats =====
    if ($('#refreshStatsBtn')) {
      $('#refreshStatsBtn').addEventListener('click', refreshDetailedStats);
    }

    // ===== NEW: Edit Modal =====
    if ($('#editSaveBtn')) {
      $('#editSaveBtn').addEventListener('click', saveEntryEdit);
      $('#editCancelBtn').addEventListener('click', closeEditModal);
      $('#editDeleteBtn').addEventListener('click', deleteEntryFromModal);
      $('#editModal').addEventListener('click', (e) => {
        if (e.target === $('#editModal')) closeEditModal();
      });
    }

    // ===== NEW: Keyboard Shortcuts =====
    document.addEventListener('keydown', handleKeyboardShortcut);
  }

  // ===== FILE READING =====
  function readFileContent(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }

  // ===== FORMAT DETECTION & PARSING =====
  function parseFileContent(content, ext, filename) {
    const fname = filename.toLowerCase();

    // JSON formats
    if (ext === 'json' || (ext === '1pux' && content.trim().startsWith('{'))) {
      return parseJSON(content, fname);
    }

    // XML formats
    if (ext === 'xml' || content.trim().startsWith('<?xml') || content.trim().startsWith('<KeePassFile')) {
      return parseXML(content);
    }

    // CSV formats
    return parseCSV(content, fname);
  }

  function parseCSV(content, filename) {
    const lines = parseCSVLines(content);
    if (lines.length < 2) return [];

    const headers = lines[0].map(h => h.toLowerCase().trim().replace(/"/g, ''));
    const entries = [];
    const format = detectCSVFormat(headers, filename);
    state.formatsDetected.add(format);

    for (let i = 1; i < lines.length; i++) {
      const row = lines[i];
      if (row.length < 2 || row.every(c => !c.trim())) continue;

      const entry = mapCSVEntry(headers, row, format, filename);
      if (entry && (entry.url || entry.username || entry.password)) {
        entries.push(entry);
      }
    }

    return entries;
  }

  function parseCSVLines(text) {
    const lines = [];
    let current = [];
    let inQuotes = false;
    let field = '';

    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      if (ch === '"') {
        if (inQuotes && i + 1 < text.length && text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (ch === ',' && !inQuotes) {
        current.push(field);
        field = '';
      } else if ((ch === '\n' || ch === '\r') && !inQuotes) {
        if (ch === '\r' && i + 1 < text.length && text[i + 1] === '\n') i++;
        current.push(field);
        field = '';
        if (current.length > 1 || (current.length === 1 && current[0].trim())) {
          lines.push(current);
        }
        current = [];
      } else {
        field += ch;
      }
    }
    current.push(field);
    if (current.length > 1 || (current.length === 1 && current[0].trim())) {
      lines.push(current);
    }
    return lines;
  }

  function detectCSVFormat(headers, filename) {
    const h = headers.join(',').toLowerCase();

    if (h.includes('login_uri') || h.includes('login_username')) return 'bitwarden-csv';
    if (h.includes('folder') && h.includes('favorite') && h.includes('type')) return 'bitwarden-csv';
    if (h.includes('hostname') && h.includes('httprealm')) return 'firefox-csv';
    if (h.includes('formsubmiturl')) return 'firefox-csv';
    if (h.includes('totp') && h.includes('extra') && h.includes('grouping')) return 'lastpass-csv';
    if (h.includes('username2') || h.includes('username3')) return 'dashlane-csv';
    if (h.includes('reprompt')) return 'bitwarden-csv';
    if (h.includes('matchurl')) return 'roboform-csv';
    if (h.includes('account name') && h.includes('folder name')) return 'zoho-csv';
    if (h.includes('custom fields')) return 'keeper-csv';
    if (h.includes('folder') && h.includes('title') && h.includes('username') && !h.includes('type')) return 'keepass-csv';
    if (filename.includes('1password') || filename.includes('1pu')) return '1password-csv';
    if (filename.includes('lastpass')) return 'lastpass-csv';
    if (filename.includes('bitwarden')) return 'bitwarden-csv';
    if (filename.includes('dashlane')) return 'dashlane-csv';
    if (filename.includes('keeper')) return 'keeper-csv';
    if (filename.includes('nordpass')) return 'nordpass-csv';
    if (filename.includes('roboform')) return 'roboform-csv';
    if (filename.includes('keepass')) return 'keepass-csv';
    if (filename.includes('enpass')) return 'enpass-csv';
    if (filename.includes('proton')) return 'protonpass-json';
    if (filename.includes('sticky')) return 'sticky-csv';
    if (filename.includes('remembear')) return 'remembear-csv';
    if (filename.includes('myki')) return 'myki-csv';
    if (filename.includes('strongbox')) return 'strongbox-csv';
    if (filename.includes('keychain')) return 'keychain-csv';
    if (filename.includes('samsung')) return 'samsung-csv';
    if (filename.includes('chrome') || filename.includes('google')) return 'chrome-csv';
    if (filename.includes('firefox') || filename.includes('mozilla')) return 'firefox-csv';
    if (filename.includes('safari')) return 'safari-csv';
    if (filename.includes('opera')) return 'opera-csv';
    if (filename.includes('vivaldi')) return 'vivaldi-csv';

    // Try to detect by header patterns
    if (h.includes('url') && h.includes('username') && h.includes('password')) return 'chrome-csv';
    if (h.includes('website') && h.includes('password')) return 'generic-csv';
    if (h.includes('hostname') && h.includes('password')) return 'generic-csv';

    return 'generic-csv';
  }

  function mapCSVEntry(headers, row, format, filename) {
    const get = (fieldNames) => {
      for (const fn of fieldNames) {
        const idx = headers.findIndex(h => h.includes(fn.toLowerCase()));
        if (idx !== -1 && row[idx] !== undefined) return row[idx].trim();
      }
      return '';
    };

    const entry = {
      source: format,
      name: '',
      url: '',
      username: '',
      password: '',
      notes: '',
      group: '',
      totp: ''
    };

    switch (format) {
      case 'bitwarden-csv':
        entry.name = get(['name']);
        entry.url = get(['login_uri', 'url', 'uri']);
        entry.username = get(['login_username', 'username']);
        entry.password = get(['login_password', 'password']);
        entry.notes = get(['notes']);
        entry.totp = get(['login_totp', 'totp']);
        entry.group = get(['folder']);
        break;
      case 'firefox-csv':
        entry.url = get(['hostname']);
        entry.username = get(['username']);
        entry.password = get(['password']);
        break;
      case 'lastpass-csv':
        entry.name = get(['name']);
        entry.url = get(['url']);
        entry.username = get(['username']);
        entry.password = get(['password']);
        entry.group = get(['grouping']);
        entry.totp = get(['totp']);
        entry.notes = get(['extra']);
        break;
      case '1password-csv':
        entry.name = get(['title', 'name']);
        entry.url = get(['url', 'website']);
        entry.username = get(['username', 'login']);
        entry.password = get(['password', 'pwd']);
        entry.notes = get(['notes']);
        break;
      case 'dashlane-csv':
        entry.name = get(['name', 'title']);
        entry.url = get(['website', 'url']);
        entry.username = get(['username']);
        entry.password = get(['password']);
        entry.group = get(['category']);
        entry.notes = get(['note']);
        break;
      case 'keeper-csv':
        entry.name = get(['title', 'name']);
        entry.url = get(['web_address', 'url', 'website']);
        entry.username = get(['login', 'username']);
        entry.password = get(['password', 'pwd']);
        entry.notes = get(['notes', 'comment']);
        entry.group = get(['folder']);
        break;
      case 'nordpass-csv':
        entry.name = get(['name', 'title']);
        entry.url = get(['url', 'website']);
        entry.username = get(['username', 'login']);
        entry.password = get(['password']);
        entry.notes = get(['note', 'notes']);
        break;
      case 'roboform-csv':
        entry.name = get(['name', 'title']);
        entry.url = get(['url', 'website']);
        entry.username = get(['login', 'username']);
        entry.password = get(['pwd', 'password']);
        entry.notes = get(['note', 'notes']);
        break;
      case 'keepass-csv':
        entry.name = get(['title', 'name']);
        entry.url = get(['url', 'website']);
        entry.username = get(['username', 'login']);
        entry.password = get(['password', 'pwd']);
        entry.notes = get(['notes', 'comment']);
        entry.group = get(['group']);
        break;
      case 'enpass-csv':
        entry.name = get(['title', 'name']);
        entry.url = get(['url', 'website']);
        entry.username = get(['username', 'login']);
        entry.password = get(['password']);
        entry.notes = get(['note', 'notes']);
        break;
      case 'zoho-csv':
        entry.name = get(['account name', 'name', 'title']);
        entry.url = get(['website url', 'url', 'website']);
        entry.username = get(['user name', 'username']);
        entry.password = get(['password']);
        entry.group = get(['folder name', 'folder']);
        entry.notes = get(['notes']);
        break;
      default:
        // Generic mapping - try common field names
        entry.name = get(['name', 'title', 'label', 'account name', 'entry']);
        entry.url = get(['url', 'website', 'uri', 'hostname', 'web_address', 'site', 'domain', 'login_uri', 'website url']);
        entry.username = get(['username', 'user', 'login', 'email', 'user name', 'login_username', 'account']);
        entry.password = get(['password', 'pass', 'pwd', 'login_password', 'secret']);
        entry.notes = get(['notes', 'note', 'comment', 'extra', 'description']);
        entry.group = get(['group', 'folder', 'category', 'grouping', 'folder name', 'type']);
        entry.totp = get(['totp', 'otp', 'login_totp', '2fa']);
        break;
    }

    entry.source = FORMATS[format]?.name || format;
    return entry;
  }

  function parseJSON(content, filename) {
    try {
      const data = JSON.parse(content);
      const entries = [];

      // Bitwarden JSON
      if (data.items && Array.isArray(data.items)) {
        state.formatsDetected.add('bitwarden-json');
        for (const item of data.items) {
          if (item.login) {
            entries.push({
              source: 'Bitwarden (JSON)',
              name: item.name || '',
              url: item.login.uris ? item.login.uris.map(u => u.uri).join(', ') : '',
              username: item.login.username || '',
              password: item.login.password || '',
              notes: item.notes || '',
              group: item.folderId || '',
              totp: item.login.totp || ''
            });
          }
        }
        return entries;
      }

      // Proton Pass JSON
      if (data.vaults || data.items) {
        state.formatsDetected.add('protonpass-json');
        const items = data.items || [];
        for (const vault of Object.values(data.vaults || {})) {
          for (const item of vault.items || items) {
            if (item.data && item.data.content) {
              entries.push({
                source: 'Proton Pass (JSON)',
                name: item.data.content.itemTitle || item.data.metadata.name || '',
                url: item.data.content.urls ? item.data.content.urls.join(', ') : '',
                username: item.data.content.username || '',
                password: item.data.content.password || '',
                notes: item.data.content.note || '',
                group: '',
                totp: item.data.content.totpUri || ''
              });
            } else if (item.login) {
              entries.push({
                source: 'Proton Pass (JSON)',
                name: item.name || '',
                url: item.login.uris ? item.login.uris.join(', ') : '',
                username: item.login.username || '',
                password: item.login.password || '',
                notes: item.notes || '',
                group: '',
                totp: ''
              });
            }
          }
        }
        return entries;
      }

      // Dashlane JSON
      if (data.AUTHENTIFIANT || data.credentials) {
        state.formatsDetected.add('dashlane-json');
        const creds = data.AUTHENTIFIANT || data.credentials || [];
        for (const cred of creds) {
          entries.push({
            source: 'Dashlane (JSON)',
            name: cred.title || cred.name || '',
            url: cred.url || cred.domain || '',
            username: cred.login || cred.username || '',
            password: cred.password || '',
            notes: cred.note || '',
            group: '',
            totp: ''
          });
        }
        return entries;
      }

      // Enpass JSON
      if (data.items && data.items.length > 0 && data.items[0].fields) {
        state.formatsDetected.add('enpass-json');
        for (const item of data.items) {
          const getFieldValue = (type) => {
            const field = (item.fields || []).find(f => f.type === type);
            return field ? field.value : '';
          };
          entries.push({
            source: 'Enpass (JSON)',
            name: item.title || '',
            url: getFieldValue('url') || getFieldValue('website'),
            username: getFieldValue('username') || getFieldValue('email'),
            password: getFieldValue('password'),
            notes: item.note || '',
            group: item.category || '',
            totp: getFieldValue('totp')
          });
        }
        return entries;
      }

      // KeeWeb JSON
      if (data.groups || (data.entries && Array.isArray(data.entries))) {
        state.formatsDetected.add('keeweb-json');
        const processGroup = (group) => {
          for (const entry of group.entries || []) {
            entries.push({
              source: 'KeeWeb (JSON)',
              name: entry.title || entry.Title || '',
              url: entry.url || entry.URL || '',
              username: entry.userName || entry.Username || '',
              password: entry.password || entry.Password || '',
              notes: entry.notes || entry.Notes || '',
              group: group.name || group.title || '',
              totp: ''
            });
          }
          for (const child of group.groups || []) {
            processGroup(child);
          }
        };
        for (const group of data.groups || []) processGroup(group);
        if (data.entries) {
          for (const e of data.entries) {
            entries.push({
              source: 'KeeWeb (JSON)',
              name: e.title || '',
              url: e.url || '',
              username: e.username || '',
              password: e.password || '',
              notes: e.notes || '',
              group: '',
              totp: ''
            });
          }
        }
        return entries;
      }

      // Passky JSON
      if (data.passwords && Array.isArray(data.passwords)) {
        state.formatsDetected.add('passky-json');
        for (const p of data.passwords) {
          entries.push({
            source: 'Passky (JSON)',
            name: p.name || p.website || '',
            url: p.website || p.url || '',
            username: p.username || '',
            password: p.password || '',
            notes: p.message || '',
            group: '',
            totp: ''
          });
        }
        return entries;
      }

      // Padloc JSON
      if (data.items) {
        state.formatsDetected.add('padloc-json');
        for (const item of data.items) {
          const fields = item.fields || [];
          entries.push({
            source: 'Padloc (JSON)',
            name: item.name || '',
            url: (fields.find(f => f.name === 'url' || f.name === 'website') || {}).value || '',
            username: (fields.find(f => f.name === 'username' || f.name === 'email') || {}).value || '',
            password: (fields.find(f => f.name === 'password') || {}).value || '',
            notes: item.notes || '',
            group: item.vault || item.category || '',
            totp: ''
          });
        }
        return entries;
      }

      // Passbolt JSON
      if (Array.isArray(data)) {
        const source = filename.includes('passbolt') ? 'Passbolt (JSON)' :
          filename.includes('buttercup') ? 'Buttercup (JSON)' :
            filename.includes('lesspass') ? 'LessPass (JSON)' :
              filename.includes('passwork') ? 'Passwork (JSON)' :
                filename.includes('minimalist') ? 'Minimalist (JSON)' :
                  'Generic (JSON)';

        state.formatsDetected.add(source.includes('Passbolt') ? 'passbolt-json' :
          source.includes('Buttercup') ? 'buttercup-json' :
            source.includes('LessPass') ? 'lesspass-json' :
              'generic-json');

        for (const item of data) {
          entries.push({
            source: source,
            name: item.name || item.title || item.label || '',
            url: item.url || item.uri || item.website || item.domain || '',
            username: item.username || item.login || item.email || '',
            password: item.password || item.secret || '',
            notes: item.description || item.notes || item.note || '',
            group: item.group || item.folder || item.category || '',
            totp: item.totp || item.otp || ''
          });
        }
        return entries;
      }

      // Buttercup JSON (archive format)
      if (data.groups) {
        state.formatsDetected.add('buttercup-json');
        const processGroup = (group) => {
          for (const entry of group.entries || []) {
            const props = entry.properties || {};
            entries.push({
              source: 'Buttercup (JSON)',
              name: props.title || props.Title || entry.title || '',
              url: props.url || props.URL || '',
              username: props.username || props.Username || '',
              password: props.password || props.Password || '',
              notes: props.notes || props.Notes || '',
              group: group.title || group.name || '',
              totp: ''
            });
          }
          for (const child of group.groups || []) processGroup(child);
        };
        for (const group of data.groups) processGroup(group);
        return entries;
      }

      // 1Password 1PUX
      if (data.accounts || data.exportData) {
        state.formatsDetected.add('1password-1pux');
        const accounts = data.accounts || [data.exportData];
        for (const account of accounts) {
          for (const vault of account.vaults || []) {
            for (const item of vault.items || []) {
              const fields = item.details ? item.details.loginFields || [] : [];
              entries.push({
                source: '1Password (1PUX)',
                name: item.overview ? item.overview.title : '',
                url: item.overview ? (item.overview.url || item.overview.urls ? item.overview.urls[0] : '') : '',
                username: (fields.find(f => f.designation === 'username') || {}).value || '',
                password: (fields.find(f => f.designation === 'password') || {}).value || '',
                notes: item.details ? item.details.notesPlain : '',
                group: vault.name || '',
                totp: ''
              });
            }
          }
        }
        return entries;
      }

      // Generic JSON fallback
      state.formatsDetected.add('generic-json');
      if (Array.isArray(data)) {
        for (const item of data) {
          entries.push({
            source: 'Generic (JSON)',
            name: item.name || item.title || '',
            url: item.url || item.website || '',
            username: item.username || item.login || '',
            password: item.password || '',
            notes: item.notes || '',
            group: item.group || '',
            totp: item.totp || ''
          });
        }
      }

      return entries;
    } catch (e) {
      throw new Error('Invalid JSON format: ' + e.message);
    }
  }

  function parseXML(content) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/xml');
    const entries = [];

    // KeePass XML
    const entries_el = doc.querySelectorAll('Entry');
    if (entries_el.length > 0) {
      state.formatsDetected.add('keepass-xml');
      entries_el.forEach(entry => {
        const strings = entry.querySelectorAll('String');
        const getVal = (key) => {
          const el = Array.from(strings).find(s => {
            const k = s.querySelector('Key');
            return k && k.textContent === key;
          });
          const v = el ? el.querySelector('Value') : null;
          return v ? v.textContent : '';
        };
        entries.push({
          source: 'KeePass (XML)',
          name: getVal('Title'),
          url: getVal('URL'),
          username: getVal('UserName'),
          password: getVal('Password'),
          notes: getVal('Notes'),
          group: '',
          totp: ''
        });
      });
    }

    return entries;
  }

  // ===== DUPLICATE DETECTION =====
  function findDuplicates() {
    if (state.entries.length === 0) {
      showToast('No entries to analyze. Import files first!', 'warning');
      return;
    }

    showProgress('Analyzing duplicates...', 0);
    const rule = $('#duplicateRule').value;
    const groups = new Map();

    const normalize = (str) => (str || '').toLowerCase().trim();
    const getDomain = (url) => {
      try {
        let u = url.trim();
        if (!u.includes('://')) u = 'https://' + u;
        return new URL(u).hostname.replace(/^www\./, '');
      } catch {
        return normalize(url).replace(/^www\./, '');
      }
    };

    const fuzzyDomain = (url) => {
      const domain = getDomain(url);
      // Remove subdomains and common suffixes
      const parts = domain.split('.');
      if (parts.length > 2) return parts.slice(-2).join('.');
      return domain;
    };

    for (let i = 0; i < state.entries.length; i++) {
      const entry = state.entries[i];
      let key = '';

      switch (rule) {
        case 'exact':
          key = `${normalize(entry.url)}|${normalize(entry.username)}|${normalize(entry.password)}`;
          break;
        case 'websiteUsername':
          key = `${normalize(entry.url)}|${normalize(entry.username)}`;
          break;
        case 'website':
          key = getDomain(entry.url);
          break;
        case 'fuzzy':
          key = fuzzyDomain(entry.url);
          break;
      }

      if (!key || key === '||' || key === '|') continue;

      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(i);
    }

    // Filter to only groups with duplicates
    state.duplicateGroups = [];
    for (const [key, indices] of groups) {
      if (indices.length > 1) {
        state.duplicateGroups.push({
          key,
          domain: getDomain(state.entries[indices[0]].url) || key,
          indices,
          entries: indices.map(i => ({ ...state.entries[i], originalIndex: i, marked: false }))
        });
      }
    }

    hideProgress();
    updateStats();
    renderDuplicateGroups();

    const dupCount = state.duplicateGroups.reduce((sum, g) => sum + g.entries.length - 1, 0);
    showToast(`Found ${dupCount} duplicates in ${state.duplicateGroups.length} groups`, dupCount > 0 ? 'warning' : 'success');
  }

  // ===== RENDER DUPLICATES =====
  function renderDuplicateGroups() {
    const container = $('#duplicateGroups');
    const section = $('#resultsSection');

    if (state.duplicateGroups.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          <h3>No Duplicates Found</h3>
          <p>Great news! Your passwords appear to be clean.</p>
        </div>
      `;
      section.style.display = 'block';
      return;
    }

    let html = '';
    state.duplicateGroups.forEach((group, gi) => {
      html += `
        <div class="duplicate-group glass-card mb-1 fade-in" data-group="${gi}">
          <div class="duplicate-group-header" onclick="toggleGroup(${gi})">
            <div class="group-info">
              <span class="group-badge">${group.entries.length} dupes</span>
              <span class="group-domain">${escapeHtml(group.domain)}</span>
              <span class="group-count">(${group.entries.length - 1} extra)</span>
            </div>
            <svg class="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
          </div>
          <div class="duplicate-group-body">
            <div class="group-actions">
              <button class="btn btn-sm btn-secondary" onclick="keepFirst(${gi})">Keep First</button>
              <button class="btn btn-sm btn-secondary" onclick="markExtras(${gi})">Mark Extras</button>
              <button class="btn btn-sm btn-secondary" onclick="selectAllInGroup(${gi})">Select All</button>
              <button class="btn btn-sm btn-secondary" onclick="deselectAllInGroup(${gi})">Deselect All</button>
            </div>`;

      group.entries.forEach((entry, ei) => {
        html += `
            <div class="entry-row ${ei > 0 ? 'highlight' : ''}">
              <input type="checkbox" class="entry-checkbox" data-group="${gi}" data-entry="${ei}" ${entry.marked ? 'checked' : ''} onchange="updateMarked(${gi}, ${ei}, this.checked)">
              <div>
                <span class="entry-source">${escapeHtml(entry.source)}</span>
                <div class="entry-url">${escapeHtml(truncate(entry.url, 50))}</div>
              </div>
              <div class="entry-user">${escapeHtml(entry.username)}</div>
              <div class="entry-password">
                <span class="masked" onclick="togglePassword(this)" data-pw="${escapeHtml(btoa(entry.password))}" style="cursor:pointer;">${'*'.repeat(Math.min(entry.password.length, 12))}</span>
              </div>
              <div class="entry-actions">
                <button class="btn-icon" style="width:30px;height:30px;" onclick="togglePassword(this.previousElementSibling)" title="Show/hide password">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                </button>
              </div>
            </div>`;
      });

      html += `</div></div>`;
    });

    container.innerHTML = html;
    section.style.display = 'block';
  }

  // ===== GROUP ACTIONS (exposed globally) =====
  window.toggleGroup = function (gi) {
    const group = $(`.duplicate-group[data-group="${gi}"]`);
    if (group) group.classList.toggle('open');
  };

  window.keepFirst = function (gi) {
    const group = state.duplicateGroups[gi];
    group.entries.forEach((e, i) => { e.marked = i > 0; });
    renderDuplicateGroups();
  };

  window.markExtras = function (gi) {
    keepFirst(gi);
  };

  window.selectAllInGroup = function (gi) {
    const group = state.duplicateGroups[gi];
    group.entries.forEach(e => { e.marked = true; });
    renderDuplicateGroups();
  };

  window.deselectAllInGroup = function (gi) {
    const group = state.duplicateGroups[gi];
    group.entries.forEach(e => { e.marked = false; });
    renderDuplicateGroups();
  };

  window.updateMarked = function (gi, ei, checked) {
    state.duplicateGroups[gi].entries[ei].marked = checked;
  };

  window.togglePassword = function (el) {
    if (!el) return;
    if (el.classList.contains('masked')) {
      try {
        const decoded = atob(el.dataset.pw);
        el.textContent = decoded;
        el.classList.remove('masked');
      } catch { el.textContent = '***'; }
    } else {
      const len = el.textContent.length;
      el.textContent = '*'.repeat(Math.min(len, 12));
      el.classList.add('masked');
    }
  };

  // ===== DELETE MARKED =====
  function deleteMarked() {
    if (state.duplicateGroups.length === 0) {
      showToast('No duplicates to process', 'warning');
      return;
    }

    const indicesToDelete = new Set();
    let deleteCount = 0;

    state.duplicateGroups.forEach(group => {
      group.entries.forEach(entry => {
        if (entry.marked) {
          indicesToDelete.add(entry.originalIndex);
          deleteCount++;
        }
      });
    });

    if (deleteCount === 0) {
      showToast('No entries marked for deletion', 'warning');
      return;
    }

    // Remove entries from state (reverse order to preserve indices)
    const sortedIndices = Array.from(indicesToDelete).sort((a, b) => b - a);
    sortedIndices.forEach(idx => {
      state.entries.splice(idx, 1);
    });

    state.duplicateGroups = [];
    updateStats();
    renderDuplicateGroups();
    saveToStorage();
    renderAllEntries();
    showToast(`Deleted ${deleteCount} duplicate entries`, 'success');
  }

  // ===== EXPORT =====
  function exportData() {
    if (state.entries.length === 0) {
      showToast('No entries to export', 'warning');
      return;
    }

    const format = $('#exportFormat').value;
    let content, filename, mimeType;

    switch (format) {
      case 'bitwarden-csv':
        content = exportBitwardenCSV();
        filename = 'bitwarden_export.csv';
        mimeType = 'text/csv';
        break;
      case 'bitwarden-json':
        content = exportBitwardenJSON();
        filename = 'bitwarden_export.json';
        mimeType = 'application/json';
        break;
      case 'chrome-csv':
        content = exportChromeCSV();
        filename = 'chrome_passwords.csv';
        mimeType = 'text/csv';
        break;
      case 'firefox-csv':
        content = exportFirefoxCSV();
        filename = 'firefox_passwords.csv';
        mimeType = 'text/csv';
        break;
      case 'lastpass-csv':
        content = exportLastPassCSV();
        filename = 'lastpass_export.csv';
        mimeType = 'text/csv';
        break;
      case '1password-csv':
        content = export1PasswordCSV();
        filename = '1password_export.csv';
        mimeType = 'text/csv';
        break;
      case 'dashlane-csv':
        content = exportDashlaneCSV();
        filename = 'dashlane_export.csv';
        mimeType = 'text/csv';
        break;
      case 'keeper-csv':
        content = exportKeeperCSV();
        filename = 'keeper_export.csv';
        mimeType = 'text/csv';
        break;
      case 'nordpass-csv':
        content = exportNordPassCSV();
        filename = 'nordpass_export.csv';
        mimeType = 'text/csv';
        break;
      case 'roboform-csv':
        content = exportRoboFormCSV();
        filename = 'roboform_export.csv';
        mimeType = 'text/csv';
        break;
      case 'keepass-csv':
        content = exportKeePassCSV();
        filename = 'keepass_export.csv';
        mimeType = 'text/csv';
        break;
      case 'enpass-csv':
        content = exportEnpassCSV();
        filename = 'enpass_export.csv';
        mimeType = 'text/csv';
        break;
      case 'protonpass-json':
        content = exportProtonPassJSON();
        filename = 'protonpass_export.json';
        mimeType = 'application/json';
        break;
      case 'zoho-csv':
        content = exportZohoCSV();
        filename = 'zoho_export.csv';
        mimeType = 'text/csv';
        break;
      case 'generic-csv':
        content = exportGenericCSV();
        filename = 'passwords_export.csv';
        mimeType = 'text/csv';
        break;
      case 'generic-json':
        content = exportGenericJSON();
        filename = 'passwords_export.json';
        mimeType = 'application/json';
        break;
      default:
        content = exportGenericCSV();
        filename = 'passwords_export.csv';
        mimeType = 'text/csv';
    }

    downloadFile(content, filename, mimeType);
    showToast(`Exported ${state.entries.length} entries as ${filename}`, 'success');
  }

  // ===== EXPORT FUNCTIONS =====
  function csvEscape(val) {
    val = String(val || '');
    if (val.includes(',') || val.includes('"') || val.includes('\n')) {
      return '"' + val.replace(/"/g, '""') + '"';
    }
    return val;
  }

  function exportBitwardenCSV() {
    const headers = 'folder,favorite,type,name,notes,fields,reprompt,login_uri,login_username,login_password,login_totp';
    const rows = state.entries.map(e =>
      [e.group || '', '0', '1', e.name, e.notes || '', '', '0', e.url, e.username, e.password, e.totp || ''].map(csvEscape).join(',')
    );
    return [headers, ...rows].join('\n');
  }

  function exportBitwardenJSON() {
    return JSON.stringify({
      encrypted: false,
      items: state.entries.map((e, i) => ({
        id: 'item-' + i,
        type: 1,
        name: e.name,
        notes: e.notes || null,
        login: {
          uris: e.url ? [{ uri: e.url, match: null }] : [],
          username: e.username,
          password: e.password,
          totp: e.totp || null
        },
        collectionIds: []
      }))
    }, null, 2);
  }

  function exportChromeCSV() {
    const headers = 'name,url,username,password';
    const rows = state.entries.map(e =>
      [e.name || e.url, e.url, e.username, e.password].map(csvEscape).join(',')
    );
    return [headers, ...rows].join('\n');
  }

  function exportFirefoxCSV() {
    const headers = 'hostname,httpRealm,formSubmitURL,usernameField,passwordField,username,password';
    const rows = state.entries.map(e =>
      [e.url, '', '', '', '', e.username, e.password].map(csvEscape).join(',')
    );
    return [headers, ...rows].join('\n');
  }

  function exportLastPassCSV() {
    const headers = 'url,username,password,totp,extra,name,grouping,fav';
    const rows = state.entries.map(e =>
      [e.url, e.username, e.password, e.totp || '', e.notes || '', e.name, e.group || '', '0'].map(csvEscape).join(',')
    );
    return [headers, ...rows].join('\n');
  }

  function export1PasswordCSV() {
    const headers = 'Title,Username,Password,URL,Notes,Type';
    const rows = state.entries.map(e =>
      [e.name, e.username, e.password, e.url, e.notes || '', 'Login'].map(csvEscape).join(',')
    );
    return [headers, ...rows].join('\n');
  }

  function exportDashlaneCSV() {
    const headers = 'username,username2,username3,password,name,website,category,note';
    const rows = state.entries.map(e =>
      [e.username, '', '', e.password, e.name, e.url, e.group || '', e.notes || ''].map(csvEscape).join(',')
    );
    return [headers, ...rows].join('\n');
  }

  function exportKeeperCSV() {
    const headers = 'Folder,Title,Login,Password,web_address,Notes,custom fields';
    const rows = state.entries.map(e =>
      [e.group || '', e.name, e.username, e.password, e.url, e.notes || '', ''].map(csvEscape).join(',')
    );
    return [headers, ...rows].join('\n');
  }

  function exportNordPassCSV() {
    const headers = 'name,url,username,password,note';
    const rows = state.entries.map(e =>
      [e.name, e.url, e.username, e.password, e.notes || ''].map(csvEscape).join(',')
    );
    return [headers, ...rows].join('\n');
  }

  function exportRoboFormCSV() {
    const headers = 'Name,Url,MatchUrl,Login,Pwd,Note';
    const rows = state.entries.map(e =>
      [e.name, e.url, e.url, e.username, e.password, e.notes || ''].map(csvEscape).join(',')
    );
    return [headers, ...rows].join('\n');
  }

  function exportKeePassCSV() {
    const headers = 'Group,Title,Username,Password,URL,Notes';
    const rows = state.entries.map(e =>
      [e.group || '', e.name, e.username, e.password, e.url, e.notes || ''].map(csvEscape).join(',')
    );
    return [headers, ...rows].join('\n');
  }

  function exportEnpassCSV() {
    const headers = 'Title,Username,Password,URL,Note';
    const rows = state.entries.map(e =>
      [e.name, e.username, e.password, e.url, e.notes || ''].map(csvEscape).join(',')
    );
    return [headers, ...rows].join('\n');
  }

  function exportProtonPassJSON() {
    return JSON.stringify({
      vaults: {
        default: {
          name: 'Personal',
          items: state.entries.map((e, i) => ({
            id: 'item-' + i,
            data: {
              metadata: { name: e.name, note: e.notes || '' },
              content: {
                itemTitle: e.name,
                username: e.username,
                password: e.password,
                urls: e.url ? [e.url] : [],
                note: e.notes || '',
                totpUri: e.totp || ''
              }
            }
          }))
        }
      }
    }, null, 2);
  }

  function exportZohoCSV() {
    const headers = 'Folder Name,Account Name,User Name,Password,Website URL,Notes';
    const rows = state.entries.map(e =>
      [e.group || '', e.name, e.username, e.password, e.url, e.notes || ''].map(csvEscape).join(',')
    );
    return [headers, ...rows].join('\n');
  }

  function exportGenericCSV() {
    const headers = 'name,url,username,password,notes,group';
    const rows = state.entries.map(e =>
      [e.name, e.url, e.username, e.password, e.notes || '', e.group || ''].map(csvEscape).join(',')
    );
    return [headers, ...rows].join('\n');
  }

  function exportGenericJSON() {
    return JSON.stringify(state.entries.map(e => ({
      name: e.name,
      url: e.url,
      username: e.username,
      password: e.password,
      notes: e.notes || '',
      group: e.group || '',
      totp: e.totp || ''
    })), null, 2);
  }

  function downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // ===== ENCRYPTION (AES-GCM with PBKDF2) =====
  async function deriveKey(passphrase, salt) {
    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      'raw', encoder.encode(passphrase), 'PBKDF2', false, ['deriveKey']
    );
    return crypto.subtle.deriveKey(
      { name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
  }

  async function encryptData(data, passphrase) {
    const encoder = new TextEncoder();
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const key = await deriveKey(passphrase, salt);
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      encoder.encode(JSON.stringify(data))
    );
    return {
      salt: Array.from(salt),
      iv: Array.from(iv),
      data: Array.from(new Uint8Array(encrypted))
    };
  }

  async function decryptData(encObj, passphrase) {
    const salt = new Uint8Array(encObj.salt);
    const iv = new Uint8Array(encObj.iv);
    const data = new Uint8Array(encObj.data);
    const key = await deriveKey(passphrase, salt);
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      data
    );
    return JSON.parse(new TextDecoder().decode(decrypted));
  }

  async function encryptAndSave() {
    const pass = $('#masterPass').value;
    if (!pass || pass.length < 4) {
      showToast('Enter a passphrase (min 4 characters)', 'warning');
      return;
    }

    try {
      showProgress('Encrypting data...', 50);
      const encrypted = await encryptData(state.entries, pass);
      localStorage.setItem('pwd-encrypted', JSON.stringify(encrypted));
      state.masterPassphrase = pass;
      hideProgress();
      showToast('Data encrypted and saved locally', 'success');
    } catch (err) {
      hideProgress();
      showToast('Encryption failed: ' + err.message, 'error');
    }
  }

  async function tryDecrypt(passphrase) {
    const raw = localStorage.getItem('pwd-encrypted');
    if (!raw) return false;

    try {
      const encrypted = JSON.parse(raw);
      const data = await decryptData(encrypted, passphrase);
      if (Array.isArray(data)) {
        state.entries = data;
        state.masterPassphrase = passphrase;
        updateStats();
        renderAllEntries();
        return true;
      }
    } catch {
      return false;
    }
    return false;
  }

  // ===== STORAGE =====
  function saveToStorage() {
    try {
      localStorage.setItem('pwd-entries', JSON.stringify(state.entries));
    } catch (e) {
      console.warn('Storage save failed:', e);
    }
  }

  function loadFromStorage() {
    try {
      const raw = localStorage.getItem('pwd-entries');
      if (raw) {
        const data = JSON.parse(raw);
        if (Array.isArray(data)) {
          state.entries = data;
          updateStats();
          renderAllEntries();
        }
      }
    } catch (e) {
      console.warn('Storage load failed:', e);
    }
  }

  // ===== UI UPDATES =====
  function updateStats() {
    $('#statEntries').textContent = state.entries.length;
    const dupCount = state.duplicateGroups.reduce((sum, g) => sum + g.entries.length - 1, 0);
    $('#statDuplicates').textContent = dupCount;
    $('#statGroups').textContent = state.duplicateGroups.length;
    $('#statFormats').textContent = state.formatsDetected.size;
  }

  // ===== SAMPLE DATA =====
  function loadSampleData() {
    const sampleEntries = [
      { source: 'Chrome', name: 'Google', url: 'https://accounts.google.com', username: 'user@gmail.com', password: 'MyP@ss123!', notes: '', group: '', totp: '' },
      { source: 'Chrome', name: 'Google', url: 'https://accounts.google.com', username: 'user@gmail.com', password: 'MyP@ss123!', notes: '', group: '', totp: '' },
      { source: 'Firefox', name: 'Google', url: 'https://accounts.google.com', username: 'user@gmail.com', password: 'MyP@ss123!', notes: '', group: '', totp: '' },
      { source: 'Bitwarden', name: 'GitHub', url: 'https://github.com', username: 'devuser', password: 'G!tHub2024#', notes: 'Work account', group: 'Work', totp: '' },
      { source: 'Chrome', name: 'GitHub', url: 'https://github.com', username: 'devuser', password: 'G!tHub2024#', notes: '', group: '', totp: '' },
      { source: 'LastPass', name: 'GitHub', url: 'https://github.com', username: 'devuser', password: 'G!tHub2024#', notes: '', group: 'Development', totp: '' },
      { source: 'Chrome', name: 'Facebook', url: 'https://www.facebook.com', username: 'john.doe@email.com', password: 'Fb_Secure99!', notes: '', group: '', totp: '' },
      { source: 'Bitwarden', name: 'Facebook', url: 'https://facebook.com', username: 'john.doe@email.com', password: 'Fb_Secure99!', notes: '', group: 'Social', totp: '' },
      { source: 'Chrome', name: 'Twitter', url: 'https://twitter.com', username: 'johndoe', password: 'Tw!tter2024', notes: '', group: '', totp: '' },
      { source: 'Chrome', name: 'Amazon', url: 'https://www.amazon.com', username: 'john@email.com', password: 'Amzn#Shop2024', notes: 'Shopping', group: '', totp: '' },
      { source: 'Firefox', name: 'Amazon', url: 'https://amazon.com', username: 'john@email.com', password: 'Amzn#Shop2024', notes: '', group: '', totp: '' },
      { source: 'Bitwarden', name: 'Netflix', url: 'https://netflix.com', username: 'john@email.com', password: 'Nflx_Ent3r!', notes: '', group: 'Entertainment', totp: '' },
      { source: '1Password', name: 'Netflix', url: 'https://www.netflix.com', username: 'john@email.com', password: 'Nflx_Ent3r!', notes: '', group: '', totp: '' },
      { source: 'Chrome', name: 'LinkedIn', url: 'https://linkedin.com', username: 'john.doe@email.com', password: 'L1nked#Pro', notes: '', group: '', totp: '' },
      { source: 'Chrome', name: 'Reddit', url: 'https://reddit.com', username: 'johndoe_reddit', password: 'R3dd!tFun', notes: '', group: '', totp: '' },
      { source: 'Bitwarden', name: 'Reddit', url: 'https://www.reddit.com', username: 'johndoe_reddit', password: 'R3dd!tFun', notes: '', group: 'Social', totp: '' },
    ];

    // Add extra sample entries with weak/reused passwords for health demo
    sampleEntries.push(
      { source: 'Chrome', name: 'Old Blog', url: 'https://myblog.wordpress.com', username: 'admin', password: '123456', notes: 'Old site', group: '', totp: '' },
      { source: 'Firefox', name: 'Bank Account', url: 'https://online.bank.com', username: 'john.doe', password: 'B@nk!ng2024$ecure', notes: 'Primary bank', group: 'Finance', totp: 'otpauth://totp/...' },
      { source: 'Chrome', name: 'Spotify', url: 'https://spotify.com', username: 'john@email.com', password: 'Mus1c#L0ver!', notes: '', group: 'Entertainment', totp: '' },
      { source: 'Bitwarden', name: 'Dropbox', url: 'https://dropbox.com', username: 'john@email.com', password: 'Dr0pB0x!Safe', notes: 'Cloud storage', group: 'Cloud', totp: '' },
      { source: 'Chrome', name: 'Old Forum', url: 'https://forum.example.com', username: 'johndoe', password: 'password', notes: 'Should change this!', group: '', totp: '' }
    );

    state.entries = sampleEntries;
    state.formatsDetected.add('chrome-csv');
    state.formatsDetected.add('firefox-csv');
    state.formatsDetected.add('bitwarden-csv');
    state.formatsDetected.add('lastpass-csv');
    state.formatsDetected.add('1password-csv');

    selectedEntryIndices.clear();
    state.duplicateGroups = [];

    updateStats();
    saveToStorage();
    renderAllEntries();

    // Switch to workspace tab
    $$('.tab-btn').forEach(b => b.classList.remove('active'));
    $('[data-tab="workspace"]').classList.add('active');
    $$('.tab-panel').forEach(p => p.style.display = 'none');
    $('#searchSection').style.display = 'block';
    $('#entriesSection').style.display = 'block';

    showToast('Loaded sample data with duplicates, weak passwords, and reused passwords', 'success');
  }

  function clearAllData() {
    saveUndoState();
    state.entries = [];
    state.duplicateGroups = [];
    state.formatsDetected.clear();
    selectedEntryIndices.clear();
    updateStats();
    renderDuplicateGroups();
    renderAllEntries();
    localStorage.removeItem('pwd-entries');
    localStorage.removeItem('pwd-encrypted');
    $('#resultsSection').style.display = 'none';
    $('#entriesSection').style.display = 'none';
    $('#searchSection').style.display = 'none';
    if ($('#healthDetails')) $('#healthDetails').style.display = 'none';
    showToast('All data cleared (undo available)', 'info');
  }

  // ===== PROGRESS =====
  function showProgress(text, percent) {
    const container = $('#progressContainer');
    const fill = $('#progressFill');
    const textEl = $('#progressText');
    container.classList.add('active');
    fill.style.width = percent + '%';
    textEl.textContent = text;
  }

  function hideProgress() {
    $('#progressContainer').classList.remove('active');
  }

  // ===== TOAST NOTIFICATIONS =====
  function showToast(message, type = 'info') {
    const container = $('#toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icons = {
      success: '✓',
      error: '✕',
      warning: '⚠',
      info: 'ℹ'
    };
    toast.innerHTML = `<strong>${icons[type] || 'ℹ'}</strong> ${escapeHtml(message)}`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('removing');
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  // ===== SHARE =====
  function shareApp(platform) {
    const url = window.location.href;
    const title = 'PwdCleaner – Password Manager Duplicate Cleaner';
    const text = 'Check out this privacy-first password duplicate cleaner! Supports 40+ formats, 100% client-side.';

    switch (platform) {
      case 'native':
        if (navigator.share) {
          navigator.share({ title, text, url }).catch(() => { });
        } else {
          navigator.clipboard.writeText(url).then(() => showToast('Link copied to clipboard!', 'success'));
        }
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
        break;
    }
  }

  // ===== SERVICE WORKER =====
  function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('sw.js').then(reg => {
        console.log('SW registered:', reg.scope);
      }).catch(err => {
        console.warn('SW registration failed:', err);
      });
    }
  }

  // ===== PWA INSTALL =====
  let deferredPrompt = null;

  function setupInstallPrompt() {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
      const btn = $('#installBtn');
      btn.style.display = 'inline-flex';
      btn.addEventListener('click', async () => {
        if (deferredPrompt) {
          deferredPrompt.prompt();
          const result = await deferredPrompt.userChoice;
          if (result.outcome === 'accepted') {
            showToast('App installed!', 'success');
          }
          deferredPrompt = null;
          btn.style.display = 'none';
        }
      });
    });

    window.addEventListener('appinstalled', () => {
      showToast('App installed successfully!', 'success');
      deferredPrompt = null;
    });
  }

  // ===== HELPERS =====
  function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function truncate(str, max) {
    if (!str) return '';
    return str.length > max ? str.substring(0, max) + '...' : str;
  }

  function debounce(fn, delay) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  }

  function getDomain(url) {
    try {
      let u = (url || '').trim();
      if (!u) return '';
      if (!u.includes('://')) u = 'https://' + u;
      return new URL(u).hostname.replace(/^www\./, '');
    } catch {
      return (url || '').toLowerCase().replace(/^www\./, '');
    }
  }

  // ===== PASSWORD STRENGTH SCORING =====
  function scorePassword(pw) {
    if (!pw) return { score: 0, label: 'None', level: 'none' };
    let score = 0;
    const len = pw.length;

    // Length scoring
    if (len >= 8) score += 10;
    if (len >= 12) score += 10;
    if (len >= 16) score += 10;
    if (len >= 20) score += 5;
    if (len >= 24) score += 5;

    // Character variety
    if (/[a-z]/.test(pw)) score += 10;
    if (/[A-Z]/.test(pw)) score += 10;
    if (/[0-9]/.test(pw)) score += 10;
    if (/[^a-zA-Z0-9]/.test(pw)) score += 15;

    // Mixed case bonus
    if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score += 5;
    // Mixed digits and letters
    if (/[a-zA-Z]/.test(pw) && /[0-9]/.test(pw)) score += 5;
    // Symbols bonus
    if (/[^a-zA-Z0-9]/.test(pw)) {
      const symbolCount = (pw.match(/[^a-zA-Z0-9]/g) || []).length;
      if (symbolCount >= 2) score += 5;
    }

    // Penalties
    if (COMMON_PASSWORDS.has(pw.toLowerCase())) score = Math.max(score - 40, 5);
    if (/^([a-zA-Z])\1+$/.test(pw)) score = Math.max(score - 20, 5); // All same char
    if (/^(012|123|234|345|456|567|678|789|890|abc|bcd|cde)/i.test(pw)) score -= 10; // Sequential
    if (/^[a-z]+$/.test(pw) || /^[A-Z]+$/.test(pw)) score -= 5; // All same case
    if (/^[0-9]+$/.test(pw)) score -= 10; // All digits
    if (len < 6) score = Math.min(score, 15);
    if (len < 4) score = Math.min(score, 5);

    score = Math.max(0, Math.min(100, score));

    let label, level;
    if (score < 25) { label = 'Very Weak'; level = 'weak'; }
    else if (score < 40) { label = 'Weak'; level = 'weak'; }
    else if (score < 60) { label = 'Fair'; level = 'fair'; }
    else if (score < 75) { label = 'Good'; level = 'good'; }
    else { label = 'Strong'; level = 'strong'; }

    return { score, label, level };
  }

  // ===== ESTIMATE CRACK TIME =====
  function estimateCrackTime(pw) {
    if (!pw) return 'Instantly';
    let charsetSize = 0;
    if (/[a-z]/.test(pw)) charsetSize += 26;
    if (/[A-Z]/.test(pw)) charsetSize += 26;
    if (/[0-9]/.test(pw)) charsetSize += 10;
    if (/[^a-zA-Z0-9]/.test(pw)) charsetSize += 33;
    if (charsetSize === 0) charsetSize = 26;

    const combinations = Math.pow(charsetSize, pw.length);
    // Assume 10 billion guesses per second (modern GPU cluster)
    const guessesPerSec = 1e10;
    const seconds = combinations / guessesPerSec / 2; // Average case

    if (seconds < 1) return 'Instantly';
    if (seconds < 60) return Math.round(seconds) + ' seconds';
    if (seconds < 3600) return Math.round(seconds / 60) + ' minutes';
    if (seconds < 86400) return Math.round(seconds / 3600) + ' hours';
    if (seconds < 2592000) return Math.round(seconds / 86400) + ' days';
    if (seconds < 31536000) return Math.round(seconds / 2592000) + ' months';
    const years = seconds / 31536000;
    if (years < 1000) return Math.round(years) + ' years';
    if (years < 1e6) return Math.round(years / 1000) + 'K years';
    if (years < 1e9) return Math.round(years / 1e6) + 'M years';
    return 'Centuries+';
  }

  // ===== NEW: SEARCH & FILTER =====
  function filterEntries() {
    const query = ($('#searchInput').value || '').toLowerCase().trim();
    const sourceFilter = $('#filterSource').value;
    const strengthFilter = $('#filterStrength').value;

    const allEntries = state.entries;
    let filtered = allEntries;

    if (query) {
      filtered = filtered.filter(e =>
        (e.name || '').toLowerCase().includes(query) ||
        (e.url || '').toLowerCase().includes(query) ||
        (e.username || '').toLowerCase().includes(query) ||
        (e.group || '').toLowerCase().includes(query) ||
        (e.notes || '').toLowerCase().includes(query)
      );
    }

    if (sourceFilter) {
      filtered = filtered.filter(e => e.source === sourceFilter);
    }

    if (strengthFilter) {
      filtered = filtered.filter(e => {
        const s = scorePassword(e.password);
        return s.level === strengthFilter;
      });
    }

    renderFilteredEntries(filtered, query);
    updateFilterCount(filtered.length, allEntries.length);
  }

  function renderFilteredEntries(entries, highlight) {
    const container = $('#allEntries');
    const section = $('#entriesSection');
    section.style.display = 'block';

    if (entries.length === 0) {
      container.innerHTML = `<div class="empty-state"><h3>No Matching Entries</h3><p>Try adjusting your search or filters.</p></div>`;
      return;
    }

    const maxDisplay = Math.min(entries.length, 500);
    let html = `<div class="batch-toolbar" id="batchToolbar" style="display:none;">
      <span class="batch-count" id="batchCount">0 selected</span>
      <button class="btn btn-danger btn-sm" id="batchDeleteBtn">Delete Selected</button>
      <button class="btn btn-secondary btn-sm" id="batchExportBtn">Export Selected</button>
    </div>`;

    html += `<div class="entries-header"><span></span><span>Name / URL</span><span>Username</span><span>Password</span><span>Strength</span><span>Actions</span></div>`;

    for (let i = 0; i < maxDisplay; i++) {
      const e = entries[i];
      const origIdx = state.entries.indexOf(e);
      const strength = scorePassword(e.password);
      const isChecked = selectedEntryIndices.has(origIdx) ? 'checked' : '';
      let displayUrl = escapeHtml(truncate(e.url, 40));
      if (highlight) {
        displayUrl = displayUrl.replace(new RegExp(`(${escapeRegExp(highlight)})`, 'gi'), '<span class="search-highlight">$1</span>');
      }

      html += `
        <div class="entry-row ${selectedEntryIndices.has(origIdx) ? 'highlight' : ''}" data-idx="${origIdx}">
          <input type="checkbox" class="entry-row-checkbox" data-idx="${origIdx}" ${isChecked} onchange="window.toggleEntrySelect(${origIdx}, this.checked)">
          <div>
            <span class="entry-source">${escapeHtml(e.source)}</span>
            <div class="entry-url">${displayUrl}</div>
          </div>
          <div class="entry-user">${escapeHtml(e.username)}</div>
          <div class="entry-password">
            <span class="masked" onclick="togglePassword(this)" data-pw="${escapeHtml(btoa(unescape(encodeURIComponent(e.password))))}" style="cursor:pointer;">${'*'.repeat(Math.min((e.password || '').length, 12))}</span>
          </div>
          <div><span class="strength-dot ${strength.level}" title="${strength.label} (${strength.score})"></span> <span style="font-size:0.75rem;color:var(--text-secondary);">${strength.label}</span></div>
          <div class="entry-actions">
            <button class="entry-edit-btn" onclick="window.openEditModal(${origIdx})" title="Edit entry">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </button>
          </div>
        </div>`;
    }

    if (entries.length > maxDisplay) {
      html += `<div style="text-align:center;padding:1rem;color:var(--text-secondary);">... showing ${maxDisplay} of ${entries.length} entries</div>`;
    }

    container.innerHTML = html;

    // Wire up batch toolbar
    const batchDelete = document.getElementById('batchDeleteBtn');
    const batchExport = document.getElementById('batchExportBtn');
    if (batchDelete) batchDelete.addEventListener('click', deleteSelectedEntries);
    if (batchExport) batchExport.addEventListener('click', exportSelectedEntries);

    updateBatchToolbar();
  }

  window.toggleEntrySelect = function (idx, checked) {
    if (checked) selectedEntryIndices.add(idx);
    else selectedEntryIndices.delete(idx);
    updateBatchToolbar();
    // Update row highlight
    const row = $(`.entry-row[data-idx="${idx}"]`);
    if (row) row.classList.toggle('highlight', checked);
  };

  function updateBatchToolbar() {
    const toolbar = $('#batchToolbar');
    if (!toolbar) return;
    if (selectedEntryIndices.size > 0) {
      toolbar.style.display = 'flex';
      const count = $('#batchCount');
      if (count) count.textContent = `${selectedEntryIndices.size} selected`;
    } else {
      toolbar.style.display = 'none';
    }
  }

  function updateFilterCount(shown, total) {
    const el = $('#filterCount');
    if (el) el.textContent = `Showing ${shown} of ${total} entries`;
  }

  function selectAllFiltered() {
    const visibleCheckboxes = $$('.entry-row-checkbox');
    visibleCheckboxes.forEach(cb => {
      const idx = parseInt(cb.dataset.idx);
      selectedEntryIndices.add(idx);
      cb.checked = true;
      const row = cb.closest('.entry-row');
      if (row) row.classList.add('highlight');
    });
    updateBatchToolbar();
    showToast(`Selected ${visibleCheckboxes.size} entries`, 'info');
  }

  function deleteSelectedEntries() {
    if (selectedEntryIndices.size === 0) {
      showToast('No entries selected', 'warning');
      return;
    }

    // Save undo state
    saveUndoState();

    const sorted = Array.from(selectedEntryIndices).sort((a, b) => b - a);
    sorted.forEach(idx => state.entries.splice(idx, 1));

    const count = selectedEntryIndices.size;
    selectedEntryIndices.clear();

    updateStats();
    saveToStorage();
    filterEntries();
    showToast(`Deleted ${count} entries (undo available)`, 'success');
  }

  function populateSourceFilter() {
    const select = $('#filterSource');
    if (!select) return;
    const sources = [...new Set(state.entries.map(e => e.source))].sort();
    select.innerHTML = '<option value="">All Sources</option>' +
      sources.map(s => `<option value="${escapeHtml(s)}">${escapeHtml(s)}</option>`).join('');
  }

  // ===== NEW: AUTO-CATEGORIZE =====
  function autoCategorize() {
    if (state.entries.length === 0) {
      showToast('No entries to categorize', 'warning');
      return;
    }

    const categoryMap = {
      'Social': ['facebook', 'twitter', 'instagram', 'linkedin', 'reddit', 'tiktok', 'snapchat', 'pinterest', 'tumblr', 'mastodon', 'threads'],
      'Email': ['gmail', 'outlook', 'yahoo', 'protonmail', 'hotmail', 'mail.', 'zoho mail', 'fastmail', 'tutanota'],
      'Shopping': ['amazon', 'ebay', 'etsy', 'walmart', 'target', 'aliexpress', 'shopify', 'bestbuy', 'newegg'],
      'Entertainment': ['netflix', 'spotify', 'youtube', 'hulu', 'disney', 'twitch', 'crunchyroll', 'hbomax', 'peacock', 'prime video'],
      'Finance': ['bank', 'paypal', 'venmo', 'cashapp', 'coinbase', 'binance', 'robinhood', 'chase', 'wellsfargo', 'citibank'],
      'Development': ['github', 'gitlab', 'bitbucket', 'stackoverflow', 'docker', 'aws', 'azure', 'heroku', 'vercel', 'netlify'],
      'Gaming': ['steam', 'epic games', 'playstation', 'xbox', 'nintendo', 'twitch', 'riot', 'blizzard', 'ea.com', 'ubisoft'],
      'Cloud Storage': ['dropbox', 'google drive', 'onedrive', 'icloud', 'box.com', 'mega.nz'],
      'News': ['nytimes', 'washingtonpost', 'bbc', 'cnn', 'reuters', 'theguardian', 'medium'],
      'Travel': ['booking', 'airbnb', 'expedia', 'tripadvisor', 'uber', 'lyft', 'hotels.com']
    };

    let categorized = 0;
    state.entries.forEach(entry => {
      if (entry.group && entry.group.trim()) return; // Already categorized
      const domain = getDomain(entry.url).toLowerCase();
      const name = (entry.name || '').toLowerCase();
      const combined = domain + ' ' + name;

      for (const [category, keywords] of Object.entries(categoryMap)) {
        if (keywords.some(kw => combined.includes(kw))) {
          entry.group = category;
          categorized++;
          return;
        }
      }
      entry.group = 'Other';
      categorized++;
    });

    saveToStorage();
    renderAllEntries();
    filterEntries();
    showToast(`Auto-categorized ${categorized} entries`, 'success');
  }

  // ===== NEW: UNDO =====
  function saveUndoState() {
    undoState = JSON.parse(JSON.stringify(state.entries));
    const btn = $('#undoBtn');
    if (btn) btn.style.display = 'inline-flex';
    clearTimeout(undoTimer);
    undoTimer = setTimeout(() => {
      undoState = null;
      if (btn) btn.style.display = 'none';
    }, 30000); // 30 second undo window
  }

  function performUndo() {
    if (!undoState) {
      showToast('Nothing to undo', 'warning');
      return;
    }
    state.entries = undoState;
    undoState = null;
    const btn = $('#undoBtn');
    if (btn) btn.style.display = 'none';
    selectedEntryIndices.clear();
    updateStats();
    saveToStorage();
    renderAllEntries();
    filterEntries();
    showToast('Undo successful', 'success');
  }

  // ===== NEW: PASSWORD GENERATOR =====
  function generatePasswords() {
    const length = parseInt($('#genLength').value) || 20;
    const useUpper = $('#genUpper').checked;
    const useLower = $('#genLower').checked;
    const useDigits = $('#genDigits').checked;
    const useSymbols = $('#genSymbols').checked;
    const excludeAmbiguous = $('#genAmbiguous').checked;
    const excludeChars = ($('#genExcludeChars').value || '');
    const count = Math.min(parseInt($('#genCount').value) || 1, 50);

    let chars = '';
    if (useUpper) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (useLower) chars += 'abcdefghijklmnopqrstuvwxyz';
    if (useDigits) chars += '0123456789';
    if (useSymbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?/~`';

    if (excludeAmbiguous) {
      chars = chars.replace(/[0O1lI]/g, '');
    }

    if (excludeChars) {
      for (const ch of excludeChars) {
        chars = chars.split(ch).join('');
      }
    }

    if (!chars) {
      showToast('Select at least one character type', 'warning');
      return;
    }

    const passwords = [];
    for (let n = 0; n < count; n++) {
      let pw = '';
      const arr = new Uint32Array(length);
      crypto.getRandomValues(arr);
      for (let i = 0; i < length; i++) {
        pw += chars[arr[i] % chars.length];
      }
      passwords.push(pw);
    }

    // Show first one in main output
    const output = $('#generatedPassword');
    output.value = passwords[0];
    updateGeneratorStrength(passwords[0]);

    // Show history
    const history = $('#genHistory');
    let html = '<div style="margin-top:0.5rem;">';
    passwords.forEach((pw, i) => {
      const str = scorePassword(pw);
      html += `<div class="gen-history-item">
        <span style="flex:1;">${escapeHtml(pw)}</span>
        <span class="strength-dot ${str.level}" title="${str.label}"></span>
        <button class="btn btn-sm btn-secondary copy-pw-btn" onclick="navigator.clipboard.writeText('${escapeHtml(pw)}'); window._showToast('Copied!','success')">Copy</button>
      </div>`;
    });
    html += '</div>';
    history.innerHTML = html;

    showToast(`Generated ${count} password(s)`, 'success');
  }

  window._showToast = showToast;

  function copyGeneratedPassword() {
    const pw = $('#generatedPassword').value;
    if (!pw) {
      showToast('Generate a password first', 'warning');
      return;
    }
    navigator.clipboard.writeText(pw).then(() => {
      showToast('Password copied to clipboard', 'success');
    }).catch(() => {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = pw;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      showToast('Password copied', 'success');
    });
  }

  function updateGeneratorStrength(pw) {
    const result = scorePassword(pw);
    const fill = $('#genStrengthFill');
    const label = $('#genStrengthLabel');

    fill.style.width = result.score + '%';
    label.textContent = result.label;

    const colors = {
      weak: 'var(--danger)',
      fair: 'var(--warning)',
      good: '#22d3ee',
      strong: 'var(--success)',
      none: 'var(--border)'
    };
    fill.style.background = colors[result.level] || colors.none;
    label.style.color = colors[result.level] || colors.none;
  }

  // ===== NEW: PASSWORD ANALYZER =====
  function analyzePassword() {
    const pw = $('#analyzeInput').value;
    if (!pw) {
      showToast('Enter a password to analyze', 'warning');
      return;
    }

    const result = scorePassword(pw);
    const crackTime = estimateCrackTime(pw);
    const container = $('#analyzerResult');
    container.style.display = 'block';

    // Score ring
    const ring = $('#analyzerRing');
    const scoreEl = $('#analyzerScore');
    const ratingEl = $('#analyzerRating');
    const crackEl = $('#analyzerCrackTime');

    scoreEl.textContent = result.score;
    ratingEl.textContent = result.label;
    crackEl.textContent = `Estimated crack time: ${crackTime}`;

    const colors = { weak: 'var(--danger)', fair: 'var(--warning)', good: '#22d3ee', strong: 'var(--success)' };
    ring.style.borderColor = colors[result.level] || 'var(--border)';
    scoreEl.style.color = colors[result.level] || 'var(--text-primary)';
    ratingEl.style.color = colors[result.level] || 'var(--text-primary)';

    // Checks
    const checks = [
      { label: 'Length >= 8 chars', pass: pw.length >= 8 },
      { label: 'Length >= 12 chars', pass: pw.length >= 12 },
      { label: 'Length >= 16 chars', pass: pw.length >= 16 },
      { label: 'Contains uppercase', pass: /[A-Z]/.test(pw) },
      { label: 'Contains lowercase', pass: /[a-z]/.test(pw) },
      { label: 'Contains digits', pass: /[0-9]/.test(pw) },
      { label: 'Contains symbols', pass: /[^a-zA-Z0-9]/.test(pw) },
      { label: 'Not a common password', pass: !COMMON_PASSWORDS.has(pw.toLowerCase()) },
      { label: 'No repeating characters', pass: !/(.)\1{2,}/.test(pw) },
      { label: 'Not all same case', pass: !/^[a-z]+$/.test(pw) && !/^[A-Z]+$/.test(pw) },
      { label: 'Mixed character types', pass: (/[a-z]/.test(pw) ? 1 : 0) + (/[A-Z]/.test(pw) ? 1 : 0) + (/[0-9]/.test(pw) ? 1 : 0) + (/[^a-zA-Z0-9]/.test(pw) ? 1 : 0) >= 3 },
      { label: 'No keyboard patterns', pass: !/^(qwerty|asdf|zxcv|1234|abcd)/i.test(pw) }
    ];

    const checksHtml = checks.map(c => `
      <div class="analyzer-check ${c.pass ? 'pass' : 'fail'}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          ${c.pass ? '<path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>' :
      '<circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>'}
        </svg>
        ${c.label}
      </div>
    `).join('');
    $('#analyzerChecks').innerHTML = checksHtml;

    // Suggestions
    const suggestions = [];
    if (pw.length < 12) suggestions.push('Increase password length to at least 12 characters.');
    if (!/[A-Z]/.test(pw)) suggestions.push('Add uppercase letters.');
    if (!/[a-z]/.test(pw)) suggestions.push('Add lowercase letters.');
    if (!/[0-9]/.test(pw)) suggestions.push('Add numbers.');
    if (!/[^a-zA-Z0-9]/.test(pw)) suggestions.push('Add special characters (!@#$%...).');
    if (COMMON_PASSWORDS.has(pw.toLowerCase())) suggestions.push('⚠️ This is a commonly used password. Change it immediately!');
    if (/(.)\1{2,}/.test(pw)) suggestions.push('Avoid repeating the same character 3+ times.');
    if (/^(qwerty|asdf|zxcv|1234|abcd)/i.test(pw)) suggestions.push('Avoid keyboard patterns.');

    const sugEl = $('#analyzerSuggestions');
    if (suggestions.length > 0) {
      sugEl.innerHTML = '<strong>Suggestions:</strong><ul style="margin:0.5rem 0 0 1.2rem;">' +
        suggestions.map(s => `<li>${s}</li>`).join('') + '</ul>';
      sugEl.style.display = 'block';
    } else {
      sugEl.innerHTML = '<strong style="color:var(--success);">✓ Excellent! No suggestions.</strong>';
      sugEl.style.display = 'block';
    }
  }

  // ===== NEW: HEALTH DASHBOARD =====
  function runHealthAnalysis() {
    if (state.entries.length === 0) {
      showToast('Import passwords first to analyze health', 'warning');
      return;
    }

    const entries = state.entries;
    let weakCount = 0, strongCount = 0, reusedCount = 0, noTotpCount = 0, shortPwCount = 0;
    const passwordCounts = {};
    let totalScore = 0;

    entries.forEach(e => {
      const str = scorePassword(e.password);
      totalScore += str.score;
      if (str.level === 'weak') weakCount++;
      if (str.level === 'strong') strongCount++;
      if ((e.password || '').length < 8) shortPwCount++;
      if (!e.totp) noTotpCount++;

      const normPw = (e.password || '').trim();
      if (normPw) {
        passwordCounts[normPw] = (passwordCounts[normPw] || 0) + 1;
      }
    });

    // Count reused
    for (const [pw, count] of Object.entries(passwordCounts)) {
      if (count > 1) reusedCount += count;
    }

    const healthScore = entries.length > 0 ? Math.round(totalScore / entries.length) : 0;

    // Update UI
    $('#healthWeak').textContent = weakCount;
    $('#healthReused').textContent = reusedCount;
    $('#healthStrong').textContent = strongCount;
    $('#healthNoTotp').textContent = noTotpCount;
    $('#healthShortPw').textContent = shortPwCount;

    // Update score ring
    const circle = $('#healthCircle');
    const scoreText = $('#healthScoreText');
    const circumference = 2 * Math.PI * 52;
    const offset = circumference - (healthScore / 100) * circumference;
    circle.style.strokeDashoffset = offset;
    scoreText.textContent = healthScore;

    const colors = {
      weak: '#ef4444',
      fair: '#f59e0b',
      good: '#22d3ee',
      strong: '#22c55e'
    };
    const level = healthScore < 40 ? 'weak' : healthScore < 60 ? 'fair' : healthScore < 80 ? 'good' : 'strong';
    circle.style.stroke = colors[level];
    scoreText.style.color = colors[level];

    // Update stats bar
    $('#statWeak').textContent = weakCount;
    $('#statReused').textContent = reusedCount;

    // Show health details
    const details = $('#healthDetails');
    details.style.display = 'block';
    let html = '<h4 style="margin-bottom:0.5rem;">Weak Passwords Detail</h4>';
    const weakEntries = entries.filter(e => scorePassword(e.password).level === 'weak');
    if (weakEntries.length > 0) {
      html += '<div style="max-height:300px;overflow-y:auto;">';
      weakEntries.slice(0, 50).forEach(e => {
        const s = scorePassword(e.password);
        html += `<div style="display:flex;align-items:center;gap:0.5rem;padding:0.4rem 0;border-bottom:1px solid var(--border);font-size:0.85rem;">
          <span class="strength-dot ${s.level}"></span>
          <span style="flex:1;color:var(--text-secondary);">${escapeHtml(truncate(e.url, 35))}</span>
          <span style="color:var(--text-secondary);">${escapeHtml(e.username)}</span>
          <span style="font-weight:600;color:var(--danger);">${s.score}/100</span>
        </div>`;
      });
      html += '</div>';
    } else {
      html += '<p style="color:var(--success);">No weak passwords found!</p>';
    }
    details.innerHTML = html;

    showToast(`Health Score: ${healthScore}/100 | ${weakCount} weak, ${reusedCount} reused`, healthScore >= 70 ? 'success' : 'warning');
  }

  // ===== NEW: EDIT MODAL =====
  window.openEditModal = function (idx) {
    const entry = state.entries[idx];
    if (!entry) return;
    $('#editIndex').value = idx;
    $('#editName').value = entry.name || '';
    $('#editUrl').value = entry.url || '';
    $('#editUsername').value = entry.username || '';
    $('#editPassword').value = entry.password || '';
    $('#editNotes').value = entry.notes || '';
    $('#editGroup').value = entry.group || '';
    $('#editModal').classList.add('active');
  };

  function closeEditModal() {
    $('#editModal').classList.remove('active');
  }

  function saveEntryEdit() {
    const idx = parseInt($('#editIndex').value);
    if (isNaN(idx) || !state.entries[idx]) return;

    state.entries[idx] = {
      ...state.entries[idx],
      name: $('#editName').value,
      url: $('#editUrl').value,
      username: $('#editUsername').value,
      password: $('#editPassword').value,
      notes: $('#editNotes').value,
      group: $('#editGroup').value
    };

    saveToStorage();
    closeEditModal();
    renderAllEntries();
    filterEntries();
    showToast('Entry updated', 'success');
  }

  function deleteEntryFromModal() {
    const idx = parseInt($('#editIndex').value);
    if (isNaN(idx) || !state.entries[idx]) return;

    saveUndoState();
    state.entries.splice(idx, 1);
    saveToStorage();
    closeEditModal();
    updateStats();
    renderAllEntries();
    filterEntries();
    showToast('Entry deleted (undo available)', 'success');
  }

  // ===== NEW: BACKUP & RESTORE =====
  function downloadBackup() {
    if (state.entries.length === 0) {
      showToast('No data to backup', 'warning');
      return;
    }

    const backup = {
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      app: 'PwdCleaner',
      entries: state.entries
    };

    downloadFile(JSON.stringify(backup, null, 2), `pwdcleaner_backup_${new Date().toISOString().slice(0, 10)}.json`, 'application/json');
    showToast(`Backup downloaded (${state.entries.length} entries)`, 'success');
  }

  function restoreFromBackup(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        let entries = [];
        if (data.entries && Array.isArray(data.entries)) {
          entries = data.entries;
        } else if (Array.isArray(data)) {
          entries = data;
        } else {
          throw new Error('Invalid backup format');
        }

        saveUndoState();
        state.entries = entries;
        updateStats();
        saveToStorage();
        renderAllEntries();
        showToast(`Restored ${entries.length} entries from backup`, 'success');
      } catch (err) {
        showToast('Invalid backup file: ' + err.message, 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  // ===== NEW: SMART MERGE =====
  function smartMergeEntries() {
    if (state.entries.length < 2) {
      showToast('Need at least 2 entries to merge', 'warning');
      return;
    }

    saveUndoState();

    const mergeMap = new Map();
    let mergeCount = 0;

    state.entries.forEach((entry, idx) => {
      const key = `${getDomain(entry.url)}|${(entry.username || '').toLowerCase()}`;
      if (!mergeMap.has(key)) {
        mergeMap.set(key, { entry: { ...entry }, indices: [idx] });
      } else {
        const existing = mergeMap.get(key);
        existing.indices.push(idx);
        mergeCount++;
        // Merge: prefer longer password, combine notes, prefer non-empty fields
        if ((entry.password || '').length > (existing.entry.password || '').length) {
          existing.entry.password = entry.password;
        }
        if (entry.name && (!existing.entry.name || existing.entry.name.length < entry.name.length)) {
          existing.entry.name = entry.name;
        }
        if (entry.notes && !existing.entry.notes.includes(entry.notes)) {
          existing.entry.notes = (existing.entry.notes ? existing.entry.notes + ' | ' : '') + entry.notes;
        }
        if (entry.totp && !existing.entry.totp) {
          existing.entry.totp = entry.totp;
        }
        if (entry.group && !existing.entry.group) {
          existing.entry.group = entry.group;
        }
      }
    });

    state.entries = Array.from(mergeMap.values()).map(m => m.entry);
    updateStats();
    saveToStorage();
    renderAllEntries();
    showToast(`Smart merged ${mergeCount} duplicate entries`, 'success');
  }

  // ===== NEW: REMOVE EMPTY =====
  function removeEmptyEntries() {
    const before = state.entries.length;
    saveUndoState();
    state.entries = state.entries.filter(e =>
      (e.password || '').trim() || (e.username || '').trim() || (e.url || '').trim()
    );
    const removed = before - state.entries.length;
    updateStats();
    saveToStorage();
    renderAllEntries();
    showToast(`Removed ${removed} empty entries`, removed > 0 ? 'success' : 'info');
  }

  // ===== NEW: NORMALIZE URLs =====
  function normalizeAllUrls() {
    let normalized = 0;
    state.entries.forEach(entry => {
      if (!entry.url) return;
      let url = entry.url.trim();
      // Remove trailing slash
      if (url.endsWith('/')) { url = url.slice(0, -1); normalized++; }
      // Ensure https
      if (url.startsWith('http://')) { url = 'https://' + url.slice(7); normalized++; }
      // Remove www
      url = url.replace(/^(https?:\/\/)www\./, '$1');
      entry.url = url;
    });

    saveToStorage();
    renderAllEntries();
    filterEntries();
    showToast(`Normalized ${normalized} URLs`, 'success');
  }

  // ===== NEW: EXPORT SELECTED =====
  function exportSelectedEntries() {
    if (selectedEntryIndices.size === 0) {
      showToast('No entries selected for export', 'warning');
      return;
    }

    const selectedEntries = Array.from(selectedEntryIndices).map(i => state.entries[i]).filter(Boolean);
    const original = state.entries;
    state.entries = selectedEntries;
    exportData();
    state.entries = original;
  }

  // ===== NEW: DETAILED STATS =====
  function refreshDetailedStats() {
    if (state.entries.length === 0) {
      showToast('No entries to analyze', 'warning');
      return;
    }

    // Source distribution
    const sourceCounts = {};
    state.entries.forEach(e => {
      sourceCounts[e.source] = (sourceCounts[e.source] || 0) + 1;
    });
    renderBarChart('sourceDistribution', sourceCounts);

    // Length distribution
    const lengthBuckets = { '1-4': 0, '5-8': 0, '9-12': 0, '13-16': 0, '17-24': 0, '25+': 0 };
    state.entries.forEach(e => {
      const len = (e.password || '').length;
      if (len <= 4) lengthBuckets['1-4']++;
      else if (len <= 8) lengthBuckets['5-8']++;
      else if (len <= 12) lengthBuckets['9-12']++;
      else if (len <= 16) lengthBuckets['13-16']++;
      else if (len <= 24) lengthBuckets['17-24']++;
      else lengthBuckets['25+']++;
    });
    renderBarChart('lengthDistribution', lengthBuckets);

    // Strength overview
    const strengthBuckets = { 'Very Weak': 0, 'Weak': 0, 'Fair': 0, 'Good': 0, 'Strong': 0 };
    state.entries.forEach(e => {
      const s = scorePassword(e.password);
      if (s.score < 25) strengthBuckets['Very Weak']++;
      else if (s.score < 40) strengthBuckets['Weak']++;
      else if (s.score < 60) strengthBuckets['Fair']++;
      else if (s.score < 75) strengthBuckets['Good']++;
      else strengthBuckets['Strong']++;
    });
    renderBarChart('strengthOverview', strengthBuckets);

    // Top domains
    const domainCounts = {};
    state.entries.forEach(e => {
      const d = getDomain(e.url);
      if (d) domainCounts[d] = (domainCounts[d] || 0) + 1;
    });
    const topDomains = Object.entries(domainCounts).sort((a, b) => b[1] - a[1]).slice(0, 10);
    const topObj = {};
    topDomains.forEach(([d, c]) => topObj[d] = c);
    renderBarChart('topDomains', topObj);

    showToast('Statistics refreshed', 'info');
  }

  function renderBarChart(containerId, data) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const entries = Object.entries(data).sort((a, b) => b[1] - a[1]);
    const maxVal = Math.max(...entries.map(e => e[1]), 1);

    let html = '';
    entries.forEach(([label, count]) => {
      const pct = (count / maxVal) * 100;
      html += `<div class="stat-bar-item">
        <span class="stat-bar-label" title="${escapeHtml(label)}">${escapeHtml(truncate(label, 15))}</span>
        <div class="stat-bar-track"><div class="stat-bar-fill" style="width:${pct}%"></div></div>
        <span class="stat-bar-count">${count}</span>
      </div>`;
    });

    container.innerHTML = html || '<p style="color:var(--text-secondary);font-size:0.85rem;">No data</p>';
  }

  // ===== NEW: KEYBOARD SHORTCUTS =====
  function handleKeyboardShortcut(e) {
    // Don't trigger when typing in inputs
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
      if (e.key === 'Escape') {
        e.target.blur();
        const searchInput = $('#searchInput');
        if (searchInput && searchInput.value) {
          searchInput.value = '';
          filterEntries();
        }
      }
      return;
    }

    if (e.ctrlKey || e.metaKey) {
      switch (e.key.toLowerCase()) {
        case 'i':
          e.preventDefault();
          $('#fileInput').click();
          break;
        case 'f':
          e.preventDefault();
          const searchInp = $('#searchInput');
          if (searchInp) {
            // Switch to workspace tab
            $$('.tab-btn').forEach(b => b.classList.remove('active'));
            $('[data-tab="workspace"]').classList.add('active');
            $$('.tab-panel').forEach(p => p.style.display = 'none');
            $('#searchSection').style.display = 'block';
            searchInp.focus();
          }
          break;
        case 'd':
          e.preventDefault();
          findDuplicates();
          break;
        case 'e':
          e.preventDefault();
          exportData();
          break;
        case 'g':
          e.preventDefault();
          // Switch to generator tab
          $$('.tab-btn').forEach(b => b.classList.remove('active'));
          $('[data-tab="generator"]').classList.add('active');
          $$('.tab-panel').forEach(p => p.style.display = 'none');
          $('#generatorPanel').style.display = 'block';
          $('#searchSection').style.display = 'none';
          $('#entriesSection').style.display = 'none';
          break;
        case 'z':
          e.preventDefault();
          performUndo();
          break;
        case 'l':
          e.preventDefault();
          loadSampleData();
          break;
      }
    }

    if (e.key === 'Escape') {
      closeEditModal();
      const searchInp = $('#searchInput');
      if (searchInp && searchInp.value) {
        searchInp.value = '';
        filterEntries();
      }
    }
  }

  // ===== NEW: ENHANCED RENDER ALL ENTRIES =====
  function renderAllEntries() {
    const section = $('#entriesSection');
    const container = $('#allEntries');

    if (state.entries.length === 0) {
      section.style.display = 'none';
      $('#searchSection').style.display = 'none';
      return;
    }

    // Show search section
    $('#searchSection').style.display = 'block';
    populateSourceFilter();

    // Check if we're on workspace tab
    const activeTab = document.querySelector('.tab-btn.active');
    if (activeTab && activeTab.dataset.tab !== 'workspace') return;

    section.style.display = 'block';
    const maxDisplay = Math.min(state.entries.length, 200);
    let html = `<div class="entries-header"><span>#</span><span>Name / URL</span><span>Username</span><span>Password</span><span>Strength</span><span>Actions</span></div>`;

    for (let i = 0; i < maxDisplay; i++) {
      const e = state.entries[i];
      const strength = scorePassword(e.password);
      html += `
        <div class="entry-row" style="font-size:0.85rem;">
          <span style="color:var(--text-secondary);font-size:0.75rem;">${i + 1}</span>
          <div>
            <span class="entry-source">${escapeHtml(e.source)}</span>
            <div class="entry-url">${escapeHtml(truncate(e.url, 40))}</div>
          </div>
          <div class="entry-user">${escapeHtml(e.username)}</div>
          <div class="entry-password"><span class="masked" onclick="togglePassword(this)" data-pw="${escapeHtml(btoa(unescape(encodeURIComponent(e.password || ''))))}" style="cursor:pointer;">${'*'.repeat(Math.min((e.password || '').length, 12))}</span></div>
          <div><span class="strength-dot ${strength.level}" title="${strength.label} (${strength.score})"></span></div>
          <div>
            <button class="entry-edit-btn" onclick="window.openEditModal(${i})" title="Edit entry">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </button>
          </div>
        </div>`;
    }

    if (state.entries.length > maxDisplay) {
      html += `<div style="text-align:center;padding:1rem;color:var(--text-secondary);">... and ${state.entries.length - maxDisplay} more entries. Use Search to filter.</div>`;
    }

    container.innerHTML = html;
  }

  // ===== ENHANCED HANDLE FILES (merge/replace mode) =====
  async function handleFiles(files) {
    const fileList = Array.from(files);
    if (fileList.length === 0) return;

    const replaceMode = $('#importModeCheckbox') && $('#importModeCheckbox').checked;

    if (replaceMode && state.entries.length > 0) {
      saveUndoState();
      state.entries = [];
    }

    showProgress('Importing files...', 0);
    let totalProcessed = 0;

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      const progress = Math.round(((i + 1) / fileList.length) * 100);
      showProgress(`Processing ${file.name}...`, progress);

      try {
        const content = await readFileContent(file);
        const ext = file.name.split('.').pop().toLowerCase();
        const parsed = parseFileContent(content, ext, file.name);
        state.entries.push(...parsed);
        totalProcessed += parsed.length;
      } catch (err) {
        showToast(`Error parsing ${file.name}: ${err.message}`, 'error');
      }
    }

    hideProgress();
    state.duplicateGroups = [];
    updateStats();
    saveToStorage();
    renderAllEntries();

    // Switch to workspace tab
    $$('.tab-btn').forEach(b => b.classList.remove('active'));
    $('[data-tab="workspace"]').classList.add('active');
    $$('.tab-panel').forEach(p => p.style.display = 'none');

    showToast(`${replaceMode ? 'Replaced' : 'Imported'} ${totalProcessed} entries from ${fileList.length} file(s)`, 'success');
  }

  // ===== ESCAPE REGEX =====
  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  // ===== INIT ON DOM READY =====
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();