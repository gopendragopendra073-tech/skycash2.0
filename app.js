/* Shared UI helpers and the entertainment policy modal. */
(() => {
  const POLICY_KEY = 'skycash_policy_accepted';
  const modalCopy = `
    <h2>Disclaimer &amp; Website Policy</h2>
    <div class="modal-policy-text"><p><b>Skycash is for entertainment purposes only.</b> All coins, balances, and money displayed are fictional and have no real-world value.</p><ul><li>No real cash, cryptocurrency, or financial reward can be earned.</li><li>Skycash is not an investment, job, or financial service.</li><li>Your account is stored only in this browser.</li></ul><p>By continuing, you acknowledge that this is a fictional virtual-coin experience.</p></div>`;

  function showPolicyModal(context) {
    if (document.querySelector('.policy-modal')) return;
    const modal = document.createElement('div');
    modal.className = 'policy-modal';
    modal.innerHTML = `<div class="policy-modal-card" role="dialog" aria-modal="true" aria-labelledby="policy-modal-heading">${modalCopy}<a class="text-link" href="privacy.html">Read the full policy →</a><button class="button" type="button">I understand</button></div>`;
    document.body.append(modal);
    modal.querySelector('h2').id = 'policy-modal-heading';
    modal.querySelector('button').focus();
    modal.querySelector('button').addEventListener('click', () => { localStorage.setItem(POLICY_KEY, 'true'); localStorage.setItem(`skycash_policy_${context}_seen`, 'true'); modal.remove(); });
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });
    const toggle = document.querySelector('.nav-toggle');
    const nav = document.querySelector('.site-nav');
    if (toggle && nav) toggle.addEventListener('click', () => { const open = nav.classList.toggle('open'); toggle.setAttribute('aria-expanded', open); toggle.textContent = open ? '×' : '☰'; });
    const authPage = document.body.dataset.page;
    if (['login', 'signup'].includes(authPage) && localStorage.getItem(`skycash_policy_${authPage}_seen`) !== 'true') showPolicyModal(authPage);
    document.querySelectorAll('[data-count]').forEach(el => {
      const target = Number(el.dataset.count); const suffix = el.dataset.suffix || ''; const start = performance.now();
      const tick = now => { const value = Math.min(1, (now - start) / 1200); el.textContent = Math.floor(target * value).toLocaleString() + suffix; if (value < 1) requestAnimationFrame(tick); };
      requestAnimationFrame(tick);
    });
  });
  window.SkycashUI = { showPolicyModal };
})();
