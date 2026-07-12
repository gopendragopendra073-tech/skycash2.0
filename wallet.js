/* Fictional reward simulation and dashboard/wallet display data. */
(() => {
  const LIMIT = 10; const MINIMUM = 10000; const { STORE_KEY, defaultData } = window.SkycashAuth || {};
  const read = () => { const data = JSON.parse(localStorage.getItem(STORE_KEY) || 'null') || defaultData(); if (data.lastAdDate !== new Date().toDateString()) { data.adsToday = 0; data.lastAdDate = new Date().toDateString(); save(data); } return data; };
  const save = data => localStorage.setItem(STORE_KEY, JSON.stringify(data));
  const format = number => Number(number).toLocaleString();
  function render() {
    const data = read(); const percent = Math.min(100, Math.round((data.balance / MINIMUM) * 100));
    document.querySelectorAll('[data-balance]').forEach(el => el.textContent = format(data.balance));
    document.querySelectorAll('[data-total-earned]').forEach(el => el.textContent = format(data.totalEarned));
    document.querySelectorAll('[data-ads-today]').forEach(el => el.textContent = data.adsToday);
    document.querySelectorAll('[data-daily-limit]').forEach(el => el.textContent = LIMIT);
    document.querySelectorAll('[data-streak]').forEach(el => el.textContent = data.streak || 1);
    document.querySelectorAll('[data-progress-percent]').forEach(el => el.textContent = percent);
    document.querySelectorAll('[data-progress-bar]').forEach(el => el.style.width = `${percent}%`);
    const list = document.querySelector('[data-history-list]');
    if (list) list.innerHTML = data.history.length ? data.history.map(item => `<div class="history-item"><span class="history-icon">✦</span><div><p>${item.label}</p><small>${new Date(item.time).toLocaleString()}</small></div><strong class="history-amount">+${format(item.amount)} SKY</strong></div>`).join('') : '<p class="empty-history">No virtual coins collected yet. Visit Earn to start.</p>';
  }
  function toast(message) { const node = document.querySelector('.toast'); if (!node) return; node.textContent = message; node.classList.add('show'); setTimeout(() => node.classList.remove('show'), 4200); }
  function reward(amount) { const data = read(); data.balance += amount; data.totalEarned += amount; data.adsToday += 1; data.history.unshift({ label: 'Simulated ad reward', amount, time: Date.now() }); data.history = data.history.slice(0, 20); save(data); render(); const burst = document.querySelector('.coin-burst'); if (burst) { burst.textContent = `+${amount} ✦`; burst.classList.remove('show'); void burst.offsetWidth; burst.classList.add('show'); } }
  function setupAds() { const modal = document.querySelector('#ad-modal'); if (!modal) return; document.querySelectorAll('.watch-ad').forEach(button => button.addEventListener('click', () => {
    const data = read(); if (data.adsToday >= LIMIT) return toast(`Daily limit reached — come back tomorrow for more fictional SKY.`);
    const amount = Number(button.closest('.ad-card').dataset.reward); modal.classList.add('open'); modal.setAttribute('aria-hidden', 'false'); let remaining = 5; const count = modal.querySelector('[data-countdown]'); count.textContent = remaining;
    const timer = setInterval(() => { remaining -= 1; count.textContent = remaining; if (remaining <= 0) { clearInterval(timer); modal.classList.remove('open'); modal.setAttribute('aria-hidden', 'true'); reward(amount); } }, 1000);
  })); }
  document.addEventListener('DOMContentLoaded', () => { if (!STORE_KEY) return; render(); setupAds(); const withdraw = document.querySelector('.withdraw-button'); if (withdraw) withdraw.addEventListener('click', () => { const data = read(); toast(data.balance < MINIMUM ? 'You need more virtual coins before unlocking this feature.' : 'This website uses fictional virtual coins only. Withdrawals are not available.'); }); });
})();
