(function () {
  'use strict';

  const fields = ['minute', 'hour', 'day', 'month', 'weekday'];
  const labels = {
    minute: 'At every minute',
    hour: 'past every hour',
    day: 'on day',
    month: 'in month',
    weekday: 'on weekday',
  };
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  function populateSelect(id, min, max, allLabel) {
    const sel = document.getElementById(id);
    sel.innerHTML = `<option value="*">${allLabel}</option>`;
    for (let i = min; i <= max; i++) {
      sel.innerHTML += `<option value="${i}">${i}</option>`;
    }
  }

  function getExpression() {
    return fields.map(f => document.getElementById('cron-' + f).value).join(' ');
  }

  function nextRuns(expr) {
    const [minute, hour, day, month, weekday] = expr.split(' ');
    const runs = [];
    const now = new Date();
    for (let i = 0; i < 5; i++) {
      const d = new Date(now);
      d.setMinutes(d.getMinutes() + 1);
      let found = false;
      for (let attempts = 0; attempts < 1440 && !found; attempts++) {
        const m = d.getMinutes();
        const h = d.getHours();
        const dy = d.getDate();
        const mo = d.getMonth() + 1;
        const wd = d.getDay();
        if (
          (minute === '*' || parseInt(minute) === m) &&
          (hour === '*' || parseInt(hour) === h) &&
          (day === '*' || parseInt(day) === dy) &&
          (month === '*' || parseInt(month) === mo) &&
          (weekday === '*' || parseInt(weekday) === wd)
        ) {
          runs.push(d.toLocaleString());
          found = true;
        } else {
          d.setMinutes(d.getMinutes() + 1);
        }
      }
    }
    return runs;
  }

  function explanation(expr) {
    const parts = expr.split(' ');
    const words = [];
    if (parts[0] === '*') words.push('At every minute');
    else words.push(`At minute ${parts[0]}`);
    if (parts[1] === '*') words.push('of every hour');
    else words.push(`of hour ${parts[1]}`);
    if (parts[2] === '*') words.push('every day');
    else words.push(`on day ${parts[2]}`);
    if (parts[3] === '*') words.push('every month');
    else words.push(`in ${months[parseInt(parts[3]) - 1] || parts[3]}`);
    if (parts[4] === '*') words.push('every weekday');
    else words.push(`on ${weekdays[parseInt(parts[4])] || parts[4]}`);
    return words.join(' ');
  }

  function init() {
    populateSelect('cron-minute', 0, 59, 'Every minute');
    populateSelect('cron-hour', 0, 23, 'Every hour');
    populateSelect('cron-day', 1, 31, 'Every day');
    populateSelect('cron-month', 1, 12, 'Every month');
    populateSelect('cron-weekday', 0, 6, 'Every weekday');

    function update() {
      const expr = getExpression();
      document.getElementById('cron-output').value = expr;
      document.getElementById('cron-explanation').textContent = explanation(expr);
      const runs = nextRuns(expr);
      document.getElementById('next-runs').innerHTML = runs.map(r => `<li>${r}</li>`).join('');
    }

    fields.forEach(f => document.getElementById('cron-' + f).addEventListener('change', update));

    const presets = {
      'btn-preset-minute': '* * * * *',
      'btn-preset-hourly': '0 * * * *',
      'btn-preset-daily': '0 0 * * *',
      'btn-preset-weekly': '0 0 * * 0',
      'btn-preset-monthly': '0 0 1 * *',
    };

    Object.entries(presets).forEach(([id, expr]) => {
      document.getElementById(id).addEventListener('click', () => {
        const parts = expr.split(' ');
        parts.forEach((p, i) => { document.getElementById('cron-' + fields[i]).value = p; });
        update();
      });
    });

    update();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
