// elenabrutau.com — idioma ES/EN y visor de páginas del diario
(function () {
  const raiz = document.documentElement;
  let idioma = 'en';
  try { idioma = localStorage.getItem('idioma') || (navigator.language || 'en').slice(0, 2); } catch (e) {}
  if (idioma !== 'es') idioma = 'en';

  function ponerIdioma(i) {
    idioma = i;
    raiz.setAttribute('data-lang', i);
    raiz.setAttribute('lang', i);
    document.querySelectorAll('.idiomas button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.idioma === i)));
    document.querySelectorAll('[data-es]').forEach(el => { el.textContent = el.dataset[i] || el.dataset.en; });
    document.querySelectorAll('[data-alt-es]').forEach(el => { el.alt = i === 'es' ? el.dataset.altEs : el.dataset.altEn; });
    try { localStorage.setItem('idioma', i); } catch (e) {}
  }
  document.querySelectorAll('.idiomas button').forEach(b => b.addEventListener('click', () => ponerIdioma(b.dataset.idioma)));
  ponerIdioma(idioma);

  // Diario: cuadrícula + visor
  const caja = document.querySelector('[data-diario]');
  if (!caja || !window.DIARIO) return;
  const lista = window.DIARIO.slice().reverse();
  const limite = parseInt(caja.dataset.limite || '0', 10);
  const mostrar = limite ? lista.slice(0, limite) : lista;
  caja.innerHTML = mostrar.map((p, i) =>
    `<div class="hoja"><button type="button" data-i="${i}" aria-label="${p.fecha || 'page'}"><img src="img/diario/mini/diario-${p.n}.webp" alt="" loading="lazy" width="800" height="571"></button><span>${p.fecha || ''}</span></div>`
  ).join('');

  const visor = document.createElement('div');
  visor.className = 'visor';
  visor.setAttribute('role', 'dialog');
  visor.setAttribute('aria-modal', 'true');
  visor.innerHTML = `<img alt=""><div class="controles"><button type="button" data-v="prev" aria-label="previous">←</button><span class="fecha"></span><button type="button" data-v="next" aria-label="next">→</button><button type="button" data-v="cerrar" aria-label="close" style="margin-left:14px">✕</button></div>`;
  document.body.appendChild(visor);
  const img = visor.querySelector('img'), fecha = visor.querySelector('.fecha');
  let actual = 0, antes = null;
  function ver(i) {
    actual = (i + lista.length) % lista.length;
    const p = lista[actual];
    img.src = `img/diario/diario-${p.n}.webp`;
    img.alt = p.fecha || '';
    fecha.textContent = p.fecha || '';
  }
  function abrir(i) { antes = document.activeElement; ver(i); visor.classList.add('abierto'); visor.querySelector('[data-v="cerrar"]').focus(); }
  function cerrar() { visor.classList.remove('abierto'); if (antes) antes.focus(); }
  caja.addEventListener('click', e => { const b = e.target.closest('button[data-i]'); if (b) abrir(+b.dataset.i); });
  visor.addEventListener('click', e => {
    const v = e.target.closest('[data-v]');
    if (v) { if (v.dataset.v === 'prev') ver(actual - 1); else if (v.dataset.v === 'next') ver(actual + 1); else cerrar(); }
    else if (e.target === visor) cerrar();
  });
  document.addEventListener('keydown', e => {
    if (!visor.classList.contains('abierto')) return;
    if (e.key === 'Escape') cerrar();
    if (e.key === 'ArrowLeft') ver(actual - 1);
    if (e.key === 'ArrowRight') ver(actual + 1);
  });
})();
