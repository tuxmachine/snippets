function Log(baseFn, type, message) {
	const c = document.getElementById('log');
  if (!c) return;
  const m = document.createElement('div');
  m.innerHTML = `<span class="${type}">[${(new Date()).toISOString()}] ${message}</span>`;
  c.insertBefore(m, c.firstChild);
  baseFn.call(this, message);
}
['log', 'error', 'warn', 'info'].forEach(n => console[n] = Log.bind(console, console[fn], n));
