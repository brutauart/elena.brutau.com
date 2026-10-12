(function () {
  "use strict";

  const quieto = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const t = (ms) => (quieto ? 0 : ms);
  const $ = (id) => document.getElementById(id);

  const entrada = $("entrada");
  const cuarto = $("cuarto");
  const libros = $("libros");
  const lector = $("lector");
  const libreta = $("libreta");
  const hojaIzq = $("hoja-izq");
  const hojaDer = $("hoja-der");
  const cintaTapa = $("cinta-tapa");

  let abierta = null;      // gaveta abierta
  let lomoActivo = null;   // botón del estante que se sacó

  /* ---------- Utilidades ---------- */
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  function foto(imagen, alt) {
    if (!imagen) return `<div class="foto pendiente" role="img" aria-label="Foto pendiente">foto pendiente</div>`;
    return `<div class="foto"><img src="${esc(imagen)}" alt="${esc(alt)}" loading="lazy"></div>`;
  }

  const giros = [-1.5, 1, -0.5, 1.8, -1, 0.6];

  /* ---------- El estante ---------- */
  function lomoVacio(h, extra, recostada) {
    const b = document.createElement("span");
    b.className = "lomo vacia" + (extra ? " extra" : "") + (recostada ? " recostada" : "");
    b.style.setProperty("--h", h);
    b.setAttribute("aria-hidden", "true");
    return b;
  }

  function vasija() {
    const v = document.createElement("span");
    v.className = "vasija";
    v.setAttribute("aria-hidden", "true");
    v.innerHTML = `<svg viewBox="0 0 80 100" fill="none" stroke="#5B3B22" stroke-width="1.6" stroke-linecap="round">
      <path d="M40 100 C38 70 30 50 14 30"/><path d="M26 48 C20 44 16 44 10 46"/><path d="M20 38 C18 32 20 26 24 22"/>
      <path d="M41 100 C44 66 52 40 66 14"/><path d="M53 50 C60 48 64 44 68 38"/><path d="M60 30 C58 24 60 18 64 12"/>
      <circle cx="14" cy="29" r="2.4" fill="#C9A35A" stroke="none"/><circle cx="66" cy="13" r="2.4" fill="#C9A35A" stroke="none"/>
      <circle cx="24" cy="21" r="2" fill="#C9A35A" stroke="none"/><circle cx="68" cy="37" r="2" fill="#C9A35A" stroke="none"/>
    </svg>`;
    return v;
  }

  function construirEstante() {
    libros.appendChild(lomoVacio(0.84, false, false));
    GAVETAS.forEach((g, i) => {
      if (i === 2) libros.appendChild(vasija());
      const b = document.createElement("button");
      b.type = "button";
      b.className = "lomo";
      b.setAttribute("role", "listitem");
      b.dataset.id = g.id;
      b.style.setProperty("--h", g.alto || 1);
      b.style.setProperty("--color-cinta", g.cinta);
      b.style.setProperty("--color-tinta", g.tinta);
      b.style.setProperty("--giro", giros[i % giros.length] + "deg");
      b.setAttribute("aria-label", `Abrir la libreta ${g.titulo}`);
      b.innerHTML = `<span class="cinta"><span>${esc(g.etiqueta)}</span></span>`;
      b.addEventListener("click", () => abrir(g, b));
      libros.appendChild(b);
    });
    for (let i = 1; i < LIBRETAS_VACIAS; i++) {
      libros.appendChild(lomoVacio(i === 1 ? 0.95 : 0.86, true, i === LIBRETAS_VACIAS - 1));
    }
  }

  /* ---------- Contenido de cada tipo de libreta ---------- */
  const tipos = {
    galeria: (items) => `<div class="galeria">${items.map((o) => `
      <figure class="obra">${foto(o.imagen, o.titulo)}
        <figcaption>${esc(o.titulo)}<span>${esc(o.tecnica)}</span></figcaption>
      </figure>`).join("")}</div>`,

    textos: (items) => `<div class="escritos">${items.map((e, i) => `
      <details class="escrito"${i === 0 ? " open" : ""}>
        <summary><h3>${esc(e.titulo)}</h3><time>${esc(e.fecha)}</time></summary>
        ${String(e.texto || "").split(/\n\s*\n/).map((p) => `<p>${esc(p)}</p>`).join("")}
      </details>`).join("")}</div>`,

    recortes: (items) => `<div class="recortes">${items.map((r) => `
      <article class="recorte">${foto(r.imagen, r.titulo)}
        <div><h3>${esc(r.titulo)}</h3><p>${esc(r.comentario)}</p>
        ${r.enlace ? `<a href="${esc(r.enlace)}" target="_blank" rel="noopener">Ver de dónde viene</a>` : ""}</div>
      </article>`).join("")}</div>`,

    tienda: (items) => `<div class="tienda">${items.map((p) => `
      <article class="pieza">${foto(p.imagen, p.nombre)}
        <div><h3>${esc(p.nombre)}</h3><p class="precio">${esc(p.precio)}</p><p>${esc(p.detalle)}</p>
        ${p.enlace
          ? `<a class="comprar" href="${esc(p.enlace)}" target="_blank" rel="noopener">Comprar</a>`
          : `<span class="comprar" aria-disabled="true">Pronto a la venta</span>`}</div>
      </article>`).join("")}</div>`,

    carta: (items) => items.map((c) => `<div class="carta">
      ${String(c.texto || "").split(/\n\s*\n/).map((p) => `<p>${esc(p)}</p>`).join("")}
      ${c.contacto ? `<p>Escríbeme: <a href="mailto:${esc(c.contacto)}">${esc(c.contacto)}</a></p>` : ""}
    </div>`).join("")
  };

  function cabecera(g, idTitulo) {
    return `<p class="devolver-a">Si encuentras esta libreta, devuélvela a <strong>elenabrutau.com</strong></p>
      <h2${idTitulo ? ` id="${idTitulo}"` : ""}>${esc(g.titulo)}</h2>
      <p class="nota">${esc(g.nota)}</p>`;
  }

  function llenar(g) {
    hojaIzq.innerHTML = cabecera(g, "titulo-libreta") + `<p class="firma">— E.</p>`;
    hojaDer.innerHTML = `<div class="solo-movil">${cabecera(g)}<br></div>` + (tipos[g.tipo] || tipos.carta)(g.items || []);
    hojaIzq.scrollTop = 0;
    hojaDer.scrollTop = 0;
    cintaTapa.textContent = g.etiqueta;
    libreta.style.setProperty("--color-cinta", g.cinta);
    libreta.style.setProperty("--color-tinta", g.tinta);
  }

  /* ---------- Abrir y cerrar ---------- */
  function abrir(g, lomo) {
    if (abierta) return;
    abierta = g;
    lomoActivo = lomo || libros.querySelector(`[data-id="${g.id}"]`);
    llenar(g);
    if (lomoActivo) lomoActivo.classList.add("sacada");
    try { history.replaceState(null, "", "#" + g.id); } catch (e) {}

    setTimeout(() => {
      lector.hidden = false;
      void lector.offsetWidth;            // fuerza el estado inicial antes de animar
      lector.classList.add("visible");
      setTimeout(() => {
        lector.classList.add("abierta");
        setTimeout(() => hojaDer.focus({ preventScroll: true }), t(900));
      }, t(700));
    }, t(350));
  }

  function cerrar() {
    if (!abierta) return;
    lector.classList.remove("abierta");
    setTimeout(() => {
      lector.classList.remove("visible");
      setTimeout(() => {
        lector.hidden = true;
        if (lomoActivo) {
          lomoActivo.classList.remove("sacada");
          lomoActivo.focus({ preventScroll: true });
        }
        abierta = null;
        lomoActivo = null;
      }, t(650));
    }, t(850));
    try { history.replaceState(null, "", location.pathname); } catch (e) {}
  }

  lector.addEventListener("click", (e) => {
    if (e.target.closest("[data-cerrar]")) cerrar();
  });

  document.addEventListener("keydown", (e) => {
    if (!abierta) return;
    if (e.key === "Escape") { cerrar(); return; }
    if (e.key === "Tab") {             // mantener el foco dentro de la libreta abierta
      const foco = [...lector.querySelectorAll('a[href], button, summary, [tabindex="0"]')]
        .filter((el) => el.offsetParent !== null);
      if (!foco.length) return;
      const primero = foco[0], ultimo = foco[foco.length - 1];
      if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
      else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
    }
  });

  /* ---------- La entrada con la llave ---------- */
  function encender() {
    cuarto.classList.add("encendida");
  }

  function entrar(e) {
    const conTeclado = e && e.detail === 0;
    entrada.classList.add("abierta");
    try { sessionStorage.setItem("entro", "1"); } catch (e) {}
    setTimeout(encender, t(1100));
    setTimeout(() => {
      const primero = libros.querySelector("button.lomo");
      if (primero && conTeclado) primero.focus({ preventScroll: true });
    }, t(1700));
  }

  $("llave").addEventListener("click", entrar);

  /* ---------- Inicio ---------- */
  construirEstante();

  let yaEntro = false;
  try { yaEntro = sessionStorage.getItem("entro") === "1"; } catch (e) {}
  const directa = GAVETAS.find((g) => "#" + g.id === location.hash);

  if (yaEntro || directa) {
    entrada.classList.add("abierta");
    entrada.style.transition = "none";
    encender();
    if (directa) setTimeout(() => abrir(directa), 300);
  }
})();
