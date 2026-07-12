/* Local-only account creation, sign-in, and route protection. */
(() => {
  const ACCOUNT_KEY = 'skycash_account';
  const SESSION_KEY = 'skycash_session';
  const STORE_KEY = 'skycash_data';
  const protectedPages = ['dashboard', 'earn', 'wallet'];
  const page = document.body.dataset.page;
  const defaultData = () => ({ balance: 0, totalEarned: 0, adsToday: 0, lastAdDate: new Date().toDateString(), history: [], streak: 1 });
  const getAccount = () => JSON.parse(localStorage.getItem(ACCOUNT_KEY) || 'null');
  const setMessage = message => { const node = document.querySelector('.form-message'); if (node) node.textContent = message; };

  function ensureData() { if (!localStorage.getItem(STORE_KEY)) localStorage.setItem(STORE_KEY, JSON.stringify(defaultData())); }
  function redirect(url) { window.location.href = url; }

  document.addEventListener('DOMContentLoaded', () => {
    if (protectedPages.includes(page) && localStorage.getItem(SESSION_KEY) !== 'true') { redirect('login.html'); return; }
    if (protectedPages.includes(page)) {
      ensureData();
      const account = getAccount();
      document.querySelectorAll('[data-user-name]').forEach(el => { el.textContent = account?.email?.split('@')[0] || 'Collector'; });
    }
    document.querySelectorAll('.logout-button').forEach(button => button.addEventListener('click', () => { localStorage.removeItem(SESSION_KEY); redirect('index.html'); }));
    const signup = document.querySelector('#signup-form');
    if (signup) signup.addEventListener('submit', event => {
      event.preventDefault();
      const email = document.querySelector('#signup-email').value.trim().toLowerCase();
      const password = document.querySelector('#signup-password').value;
      const agreed = document.querySelector('#policy-agreement').checked;
      if (!agreed) return setMessage('Please agree to the Disclaimer & Website Policy to continue.');
      if (password.length < 6) return setMessage('Please choose a password with at least 6 characters.');
      if (getAccount()) return setMessage('An account already exists in this browser. Please log in.');
      localStorage.setItem(ACCOUNT_KEY, JSON.stringify({ email, password, createdAt: Date.now() }));
      localStorage.setItem(SESSION_KEY, 'true'); localStorage.setItem('skycash_policy_seen', 'true'); ensureData(); redirect('dashboard.html');
    });
    const login = document.querySelector('#login-form');
    if (login) login.addEventListener('submit', event => {
      event.preventDefault(); const email = document.querySelector('#login-email').value.trim().toLowerCase(); const password = document.querySelector('#login-password').value; const account = getAccount();
      if (!account || account.email !== email || account.password !== password) return setMessage('We could not find a matching local account.');
      localStorage.setItem(SESSION_KEY, 'true'); ensureData(); redirect('dashboard.html');
    });
  });
  window.SkycashAuth = { STORE_KEY, defaultData, ensureData };
})();
