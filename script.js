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
    v.innerHTML = `<svg viewBox="0 0 120 200">
      <path d="M30 120 C10 150 22 196 60 196 C98 196 112 150 88 120 Z" fill="#B9B4AD" opacity=".55" transform="translate(6 4)"/>
      <g class="trazo">
        <path d="M44 110 h32 v12 C104 140 104 196 60 196 C16 196 16 140 44 122 Z" fill="#F6F4EF"/>
        <path d="M30 150 C50 158 72 158 92 150" stroke-width="1.2"/>
        <path d="M34 166 l6 8 l6 -8 l6 8 l6 -8 l6 8 l6 -8 l6 8 l6 -8 l6 8" stroke-width="1.2"/>
        <path d="M58 110 C56 80 44 56 22 34"/><path d="M40 70 C30 66 22 66 14 70"/><path d="M32 52 C30 42 32 34 38 28"/>
        <path d="M62 110 C66 76 76 48 98 20"/><path d="M76 66 C86 64 92 58 96 50"/><path d="M86 38 C84 30 86 22 92 16"/>
      </g>
      <g fill="#262523"><circle cx="22" cy="33" r="3.2"/><circle cx="98" cy="19" r="3.2"/><circle cx="38" cy="27" r="2.6"/><circle cx="96" cy="49" r="2.6"/><circle cx="14" cy="70" r="2.4"/></g>
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

  const estrellita = `<svg class="estrellita" viewBox="0 0 100 100" aria-hidden="true"><path d="M50 2 L58 38 L96 26 L66 52 L92 86 L54 66 L40 98 L38 62 L4 70 L30 46 L10 14 L44 32 Z"/></svg>`;

  function llenar(g) {
    const n = GAVETAS.indexOf(g) * 14 + 12;
    const fecha = `<p class="fecha-hoja">Fecha:</p>`;
    hojaIzq.innerHTML = fecha + cabecera(g, "titulo-libreta") +
      `<p class="firma">E.${estrellita}</p><p class="pagina">${n}</p>`;
    hojaDer.innerHTML = fecha + `<div class="solo-movil">${cabecera(g)}</div>` +
      (tipos[g.tipo] || tipos.carta)(g.items || []) + `<p class="pagina">${n + 1}</p>`;
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
  const hoy = new Date();
  $("fecha").textContent = [hoy.getDate(), hoy.getMonth() + 1, hoy.getFullYear()].map((x) => String(x).padStart(2, "0")).join(" / ");
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
