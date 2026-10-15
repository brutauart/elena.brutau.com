// luna & friends — tienda de elenabrutau.com
// Para cambiar un precio, edita "precio". Para marcar una pieza como vendida, pon vendido: true.
(function () {
  const PAYPAL = 'hello@elenabrutau.com';
  const ENVIO = 6;          // envío fijo dentro de EE. UU.
  const GRATIS_DESDE = 50;  // envío gratis desde este subtotal

  const PIEZAS = [
    { id: 'gatito', precio: 30, tag: 'gatitos pals', fotos: 4, fijo: '',
      es: { nombre: 'gatito negro', tipo: 'figurita', desc: 'un gatito negro con suéter de otoño y ojos mostaza. se sienta en el borde de tu escritorio y te mira trabajar.' },
      en: { nombre: 'black kitty', tipo: 'figurine', desc: 'a black kitty in an autumn sweater with mustard eyes. it sits on the edge of your desk and watches you work.' },
      st: [[17, 25, 8.5, 5, -12], [87, 33, 7.5, 4, 10]] },
    { id: 'gatita', precio: 30, tag: 'gatitos pals', fotos: 3, fijo: '',
      es: { nombre: 'gatita blanca', tipo: 'figurita', desc: 'una gatita blanca de ojos azules con su suéter lila. tranquila, un poco tímida, ideal para una repisa con libros.' },
      en: { nombre: 'white kitty', tipo: 'figurine', desc: 'a white kitty with blue eyes in her lilac sweater. calm, a little shy, perfect for a shelf full of books.' },
      st: [[17, 24, 8.5, 5, 8], [86, 33, 7.5, 4, -10]] },
    { id: 'escarabajo', precio: 15, tag: 'pals', fotos: 6, fijo: '',
      es: { nombre: 'escarabajo de estrellas', tipo: 'desktop pal', desc: 'un escarabajo azul con brillo y estrellitas blancas pintadas a mano. un amigo de escritorio que no se va volando.' },
      en: { nombre: 'starry beetle', tipo: 'desktop pal', desc: 'a sparkly blue beetle with little white stars painted by hand. a desk friend that won’t fly away.' },
      st: [[20, 15, 8.5, 5, -8], [88, 30, 7.5, 4, 12]] },
    { id: 'mariquita', precio: 12, tag: 'pals', fotos: 3, fijo: '',
      es: { nombre: 'mariquita de estrellas', tipo: 'desktop pal', desc: 'una mariquita roja con estrellas en vez de puntitos. cabe en la punta de dos dedos.' },
      en: { nombre: 'starry ladybug', tipo: 'desktop pal', desc: 'a red ladybug with stars instead of spots. it fits on the tips of two fingers.' },
      st: [[64, 9, 8.5, 5, 10], [93, 24, 7.5, 4, -8]] },
    { id: 'arandano', precio: 14, tag: 'floreritos', fotos: 3, fijo: '',
      es: { nombre: 'mini florerito blueberry', tipo: 'mini florerito', desc: 'un florerito azul con forma de arándano, para una sola flor seca.' },
      en: { nombre: 'mini blueberry bud vase', tipo: 'mini bud vase', desc: 'a tiny blue vase shaped like a blueberry, for a single dried flower.' },
      st: [[27, 30, 8.5, 5, 8], [85, 46, 7.5, 4, -12]] },
    { id: 'margaritas', precio: 14, tag: 'floreritos', fotos: 2, fijo: '',
      es: { nombre: 'mini florerito de margaritas', tipo: 'mini florerito', desc: 'un florerito rojo con margaritas pintadas a mano, para una sola flor seca.' },
      en: { nombre: 'mini daisy bud vase', tipo: 'mini bud vase', desc: 'a tiny red vase with hand-painted daisies, for a single dried flower.' },
      st: [[21, 36, 8.5, 5, -10], [71, 42, 7.5, 4, 8]] },
    { id: 'verde', precio: 14, tag: 'floreritos', fotos: 2, fijo: '',
      es: { nombre: 'mini florerito vintage', tipo: 'mini florerito', desc: 'un florerito verde en forma de gota, para una sola flor seca.' },
      en: { nombre: 'mini vintage bud vase', tipo: 'mini bud vase', desc: 'a tiny green vase shaped like a drop, for a single dried flower.' },
      st: [[24, 40, 8.5, 5, 12], [73, 30, 7.5, 4, -8]] },
    { id: 'rayas', precio: 14, tag: 'floreritos', fotos: 2, fijo: '',
      es: { nombre: 'mini florerito de rayitas azules', tipo: 'mini florerito', desc: 'un florerito de rayas celestes y blancas, para una sola flor seca.' },
      en: { nombre: 'mini blue-striped bud vase', tipo: 'mini bud vase', desc: 'a tiny vase with light-blue and white stripes, for a single dried flower.' },
      st: [[13, 40, 8.5, 5, -8], [60, 33, 7.5, 4, 10]] },
    { id: 'berenjena', precio: 12, tag: 'pals', fotos: 1, fijo: 'azul',
      es: { nombre: 'berenjenita (mini berenjena)', tipo: 'desktop pal · para escritorio o librero', desc: 'una berenjena chiquita y brillante. no es un bichito, pero vive con ellos.' },
      en: { nombre: 'little eggplant (mini eggplant)', tipo: 'desktop pal · for your desk or bookshelf', desc: 'a tiny shiny eggplant. not a bug, but it lives with them.' },
      st: [[76, 22, 8.5, 5, -14], [82, 60, 7.5, 4, 8]] },
  ];
  // el set de floreritos: si están los 4 en la bolsa, cuestan 48 en vez de 56
  const SET = { ids: ['arandano', 'margaritas', 'verde', 'rayas'], precio: 48 };

  const T = {
    es: { todo: 'todo', gatitos: 'gatitos', pals: 'desktop pals', floreritos: 'floreritos', material: 'material', materialV: 'polymer clay, pintado a mano con acrílico, glaze de resina uv', hecho: 'hecho', hechoV: 'a mano por elena, pieza única', envio: 'envío', envioV: `$${ENVIO} en EE. UU. · gratis desde $${GRATIS_DESDE}`, quiero: 'lo quiero', enBolsa: 'en tu bolsa ✓', vendido: 'vendido', bolsa: 'tu bolsa', vacia: 'tu bolsa está vacía', quitar: 'quitar', subtotal: 'subtotal', envioCorto: 'envío', gratis: 'gratis', total: 'total', pagar: 'pagar con paypal', nota: 'pagas con tu cuenta de paypal o con tarjeta. envíos solo dentro de EE. UU.', setNota: 'set de 4 floreritos: −$8', foto: 'foto', faltan: n => `te faltan $${n} para el envío gratis`, gracias: '¡gracias por tu compra! te escribo desde hello@elenabrutau.com cuando tu pieza salga en camino.', abierta: 'al abrir una pieza', verBolsa: 'ver bolsa y pagar →', pill: 'bolsa' },
    en: { todo: 'all', gatitos: 'kitties', pals: 'desktop pals', floreritos: 'bud vases', material: 'material', materialV: 'polymer clay, hand-painted with acrylics, uv resin glaze', hecho: 'made', hechoV: 'by hand by elena, one of a kind', envio: 'shipping', envioV: `$${ENVIO} in the US · free from $${GRATIS_DESDE}`, quiero: 'i want it', enBolsa: 'in your bag ✓', vendido: 'sold', bolsa: 'your bag', vacia: 'your bag is empty', quitar: 'remove', subtotal: 'subtotal', envioCorto: 'shipping', gratis: 'free', total: 'total', pagar: 'pay with paypal', nota: 'pay with your paypal account or a card. shipping within the US only.', setNota: 'set of 4 bud vases: −$8', foto: 'photo', faltan: n => `$${n} more for free shipping`, gracias: 'thank you for your order! i’ll write you from hello@elenabrutau.com when your piece is on its way.', abierta: 'open piece', verBolsa: 'see bag & checkout →', pill: 'bag' },
  };

  const rej = document.getElementById('rejilla');
  if (!rej) return;
  const ficha = document.getElementById('ficha');
  const bolsaEl = document.getElementById('bolsa');
  const raiz = document.documentElement;
  const lang = () => (raiz.getAttribute('data-lang') === 'es' ? 'es' : 'en');
  const t = () => T[lang()];
  const foto = (id, n, mini) => `img/tienda/${id}-${n}${mini ? '-mini' : ''}.webp?v=2`;
  const estrella = (p, s) => `img/v2/estrella-${p.fijo === 'azul' ? 'e' : 'c'}${s}.png`;
  const $ = (id) => PIEZAS.find(p => p.id === id);

  let bolsa = [];
  try { bolsa = JSON.parse(localStorage.getItem('bolsa') || '[]').filter(id => $(id) && !$(id).vendido); } catch (e) { bolsa = []; }
  const guardar = () => { try { localStorage.setItem('bolsa', JSON.stringify(bolsa)); } catch (e) {} };

  let filtro = 'todo', abierta = PIEZAS[0].id, nFoto = 1;

  function cuentas() {
    let sub = bolsa.reduce((s, id) => s + $(id).precio, 0);
    const conSet = SET.ids.every(id => bolsa.includes(id));
    const descuento = conSet ? SET.ids.reduce((s, id) => s + $(id).precio, 0) - SET.precio : 0;
    sub -= descuento;
    const envio = bolsa.length === 0 || sub >= GRATIS_DESDE ? 0 : ENVIO;
    return { sub, descuento, envio, total: sub + envio };
  }

  function pintarFiltros() {
    document.querySelectorAll('.filtros button').forEach(b => {
      b.textContent = t()[b.dataset.f];
      b.setAttribute('aria-pressed', String(b.dataset.f === filtro));
    });
  }

  function pintarRejilla() {
    const L = lang();
    rej.innerHTML = PIEZAS.map(p => `
      <button type="button" class="pieza" data-id="${p.id}" ${filtro !== 'todo' && !p.tag.split(' ').includes(filtro) ? 'hidden' : ''}>
        <span class="foto">
          <img class="ph" src="${foto(p.id, 1, true)}" alt="${p[L].nombre}" loading="lazy" width="440" height="550">
          ${p.fotos > 1 ? `<img class="ph2" src="${foto(p.id, 2, true)}" alt="" loading="lazy">` : ''}
          ${p.st.map(([x, y, w, s, r]) => `<img class="sticker${p.fijo ? '' : ' crema'}" src="${estrella(p, s)}" alt="" style="width:${w}%;left:${x}%;top:${y}%;transform:translate(-50%,-50%) rotate(${r}deg)">`).join('')}
          ${p.vendido ? `<span class="sello">${t().vendido}</span>` : ''}
        </span>
        <span class="fila"><span class="nombre">${p[L].nombre}</span><span class="precio">$${p.precio}</span></span>
        <span class="sub">${p[L].tipo}</span>
      </button>`).join('');
  }

  function pintarFicha() {
    const L = lang(), p = $(abierta), tt = t();
    const fotos = Array.from({ length: p.fotos }, (_, i) => i + 1);
    const enBolsa = bolsa.includes(p.id);
    ficha.innerHTML = `
      <div>
        <div class="principal"><img src="${foto(p.id, nFoto)}" alt="${p[L].nombre}, ${tt.foto} ${nFoto}" width="640" height="800"></div>
        <div class="miniaturas">${fotos.map(n => `<button type="button" data-n="${n}" aria-label="${tt.foto} ${n}" aria-current="${n === nFoto}"><img src="${foto(p.id, n, true)}" alt="" loading="lazy"></button>`).join('')}</div>
      </div>
      <div class="info">
        <span class="sub">${p[L].tipo}</span>
        <h2>${p[L].nombre}<img class="st" src="img/v2/estrella-e5.png" alt=""></h2>
        <span class="precio">$${p.precio}</span>
        <p>${p[L].desc}</p>
        <ul class="datos">
          <li><span>${tt.material}</span><span>${tt.materialV}</span></li>
          <li><span>${tt.hecho}</span><span>${tt.hechoV}</span></li>
          <li><span>${tt.envio}</span><span>${tt.envioV}</span></li>
        </ul>
        ${p.vendido
          ? `<span class="cta apagado">${tt.vendido}</span>`
          : `<button type="button" class="cta" data-quiero="${p.id}" ${enBolsa ? 'aria-pressed="true"' : ''}><img src="img/v2/estrella-e4.png" alt="">${enBolsa ? tt.enBolsa : tt.quiero}</button>${enBolsa ? `<a class="enlace-linea ir-bolsa" href="#bolsa">${tt.verBolsa}</a>` : ''}`}
      </div>`;
  }

  const pill = document.createElement('a');
  pill.className = 'pill-bolsa'; pill.href = '#bolsa'; pill.hidden = true;
  document.body.appendChild(pill);
  let bolsaVisible = false;
  if ('IntersectionObserver' in window) new IntersectionObserver(es => { bolsaVisible = es[0].isIntersecting; pintarPill(); }).observe(bolsaEl);
  function pintarPill() {
    const c = cuentas();
    pill.hidden = !bolsa.length || bolsaVisible;
    pill.innerHTML = `<img src="img/v2/estrella-e4.png" alt="">${t().pill} (${bolsa.length}) · $${c.total}`;
  }
  function pintarBolsa() {
    pintarPill();
    const L = lang(), tt = t(), c = cuentas();
    if (!bolsa.length) { bolsaEl.innerHTML = `<h2>${tt.bolsa}</h2><p class="vacia">${tt.vacia}</p>`; bolsaEl.classList.remove('llena'); return; }
    bolsaEl.classList.add('llena');
    const faltan = GRATIS_DESDE - c.sub;
    bolsaEl.innerHTML = `
      <h2>${tt.bolsa} <span>(${bolsa.length})</span></h2>
      <ul>${bolsa.map(id => { const p = $(id); return `<li><img src="${foto(id, 1, true)}" alt=""><span>${p[L].nombre}</span><span class="precio">$${p.precio}</span><button type="button" data-quitar="${id}" aria-label="${tt.quitar} ${p[L].nombre}">✕</button></li>`; }).join('')}</ul>
      <dl>
        ${c.descuento ? `<div><dt>${tt.setNota}</dt><dd></dd></div>` : ''}
        <div><dt>${tt.subtotal}</dt><dd>$${c.sub}</dd></div>
        <div><dt>${tt.envioCorto}</dt><dd>${c.envio ? '$' + c.envio : tt.gratis}</dd></div>
        <div class="total"><dt>${tt.total}</dt><dd>$${c.total}</dd></div>
      </dl>
      ${faltan > 0 ? `<p class="nota">${tt.faltan(faltan)}</p>` : ''}
      <button type="button" class="cta pagar" data-pagar><img src="img/v2/estrella-e4.png" alt="">${tt.pagar}</button>
      <p class="nota">${tt.nota}</p>`;
  }

  function pagar() {
    const c = cuentas();
    const conSet = c.descuento > 0;
    const campos = {
      cmd: '_cart', upload: '1', business: PAYPAL, currency_code: 'USD', charset: 'utf-8',
      no_shipping: '2', no_note: '0', lc: lang() === 'es' ? 'es_XC' : 'en_US',
      return: 'https://elenabrutau.com/shop.html?gracias=1',
      cancel_return: 'https://elenabrutau.com/shop.html',
    };
    let n = 0;
    const items = bolsa.filter(id => !(conSet && SET.ids.includes(id)));
    items.forEach(id => { n++; const p = $(id); campos['item_name_' + n] = `luna & friends · ${p.es.nombre}`; campos['item_number_' + n] = p.id; campos['amount_' + n] = p.precio.toFixed(2); campos['quantity_' + n] = '1'; });
    if (conSet) { n++; campos['item_name_' + n] = 'luna & friends · set de 4 floreritos'; campos['item_number_' + n] = 'set-floreritos'; campos['amount_' + n] = SET.precio.toFixed(2); campos['quantity_' + n] = '1'; }
    campos.shipping_1 = c.envio.toFixed(2);
    const f = document.createElement('form');
    f.method = 'post'; f.action = 'https://www.paypal.com/cgi-bin/webscr';
    Object.entries(campos).forEach(([k, v]) => { const i = document.createElement('input'); i.type = 'hidden'; i.name = k; i.value = v; f.appendChild(i); });
    document.body.appendChild(f);
    f.submit();
  }

  function todo() { pintarFiltros(); pintarRejilla(); pintarFicha(); pintarBolsa(); const s = document.querySelector('.sep span'); if (s) s.textContent = t().abierta; }

  document.querySelector('.filtros').addEventListener('click', e => {
    const b = e.target.closest('button[data-f]'); if (!b) return;
    filtro = b.dataset.f; pintarFiltros(); pintarRejilla();
  });
  rej.addEventListener('click', e => {
    const b = e.target.closest('.pieza'); if (!b) return;
    abierta = b.dataset.id; nFoto = 1; pintarFicha();
    document.getElementById('abierta').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  });
  ficha.addEventListener('click', e => {
    const m = e.target.closest('[data-n]'); if (m) { nFoto = +m.dataset.n; pintarFicha(); return; }
    const q = e.target.closest('[data-quiero]');
    if (q) { const id = q.dataset.quiero; bolsa = bolsa.includes(id) ? bolsa : bolsa.concat(id); guardar(); pintarFicha(); pintarBolsa(); }
  });
  bolsaEl.addEventListener('click', e => {
    const x = e.target.closest('[data-quitar]');
    if (x) { bolsa = bolsa.filter(id => id !== x.dataset.quitar); guardar(); pintarFicha(); pintarBolsa(); return; }
    if (e.target.closest('[data-pagar]')) pagar();
  });
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href="#bolsa"]'); if (!a) return;
    e.preventDefault();
    bolsaEl.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
  });
  document.querySelectorAll('.idiomas button').forEach(b => b.addEventListener('click', todo));

  if (/[?&]gracias=1/.test(location.search)) {
    bolsa = []; guardar();
    const g = document.getElementById('gracias');
    if (g) { g.hidden = false; g.textContent = t().gracias; }
  }
  todo();
})();
