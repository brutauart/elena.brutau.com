(function () {
  "use strict";

  const quieto = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const t = (ms) => (quieto ? 0 : ms);
  const $ = (id) => document.getElementById(id);

  const entrada = $("entrada");
  const mundo = $("mundo");
  const cuarto3d = $("cuarto3d");
  const libros = $("libros");
  const lector = $("lector");
  const libreta = $("libreta");
  const hojaIzq = $("hoja-izq");
  const hojaDer = $("hoja-der");
  const cintaTapa = $("cinta-tapa");

  let abierta = null;      // gaveta abierta
  let lomoActivo = null;   // botón del estante que se sacó

  /* ---------- Idioma ---------- */
  const TEXTOS = {
    es: {
      entrar: "gira la llave para entrar",
      pista: "saca una libreta para abrirla",
      volver: "devolver al estante",
      sigue: "sigue leyendo ↓",
      fecha: "Fecha:",
      devolver: "Si encuentras esta libreta, devuélvela a",
      foto: "foto pendiente",
      ver: "Ver de dónde viene",
      comprar: "Comprar",
      pronto: "Pronto a la venta",
      escribeme: "Escríbeme:",
      abrir: "Abrir la libreta",
      estante: "Estante de libretas de Elena Brutau",
      tienda: "LUNA & FRIENDS · TIENDA",
      abrirTienda: "Abrir la tienda de luna & friends",
      cerrarTienda: "cerrar la vitrina",
      vacio: "Este cajón todavía está vacío."
    },
    en: {
      entrar: "turn the key to come in",
      pista: "pull out a notebook to open it",
      volver: "put it back on the shelf",
      sigue: "keep reading ↓",
      fecha: "Date:",
      devolver: "If found, please return to",
      foto: "photo coming soon",
      ver: "See where it's from",
      comprar: "Buy",
      pronto: "Coming soon",
      escribeme: "Write to me:",
      abrir: "Open the notebook",
      estante: "Elena Brutau's shelf of notebooks",
      tienda: "LUNA & FRIENDS · SHOP",
      abrirTienda: "Open the luna & friends shop",
      cerrarTienda: "close the cabinet",
      vacio: "This drawer is still empty."
    }
  };

  let idioma = "es";
  try {
    const guardado = localStorage.getItem("idioma");
    if (guardado === "es" || guardado === "en") idioma = guardado;
    else if (!/^es\b/i.test(navigator.language || "")) idioma = "en";
  } catch (e) {}

  const tx = (clave) => TEXTOS[idioma][clave];
  // un campo puede ser texto o { es, en }
  const L = (v) => (v && typeof v === "object" ? (v[idioma] ?? v.es ?? "") : (v ?? ""));

  function aplicarIdioma() {
    document.documentElement.lang = idioma;
    document.querySelectorAll("[data-t]").forEach((el) => { el.textContent = tx(el.dataset.t); });
    mundo.setAttribute("aria-label", tx("estante"));
    $("vitrina").setAttribute("aria-label", tx("abrirTienda"));
    document.querySelectorAll(".idiomas button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.idioma === idioma)));
    libros.querySelectorAll("button.lomo").forEach((b) => {
      const g = GAVETAS.find((x) => x.id === b.dataset.id);
      b.querySelector(".cinta span").textContent = L(g.etiqueta);
      b.setAttribute("aria-label", `${tx("abrir")}: ${L(g.titulo)}`);
    });
    if (abierta) { llenar(abierta); alinear(); revisarScroll(); }
    if (tiendaAbierta) pintarTienda(catActual);
  }

  document.querySelectorAll(".idiomas button").forEach((b) => {
    b.addEventListener("click", () => {
      idioma = b.dataset.idioma;
      try { localStorage.setItem("idioma", idioma); } catch (e) {}
      aplicarIdioma();
    });
  });

  /* ---------- Utilidades ---------- */
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const parrafos = (v) => String(L(v)).split(/\n\s*\n/).filter(Boolean).map((p) => `<p>${esc(p)}</p>`).join("");

  function foto(imagen, alt, clase) {
    const c = clase ? " " + clase : "";
    if (!imagen) return `<div class="foto pendiente${c}" role="img" aria-label="${esc(tx("foto"))}">${esc(tx("foto"))}</div>`;
    return `<div class="foto${c}"><img src="${esc(imagen)}" alt="${esc(alt)}" loading="lazy"></div>`;
  }

  const giros = [-1.5, 1, -0.5, 1.8, -1, 0.6];

  /* ---------- El estante ---------- */
  function lomoVacio(h, extra, recostada) {
    const b = document.createElement("span");
    b.className = "lomo vacia" + (extra ? " extra" : "") + (recostada ? " recostada" : "");
    b.style.setProperty("--h", h);
    b.setAttribute("aria-hidden", "true");
    b.innerHTML = sello;
    return b;
  }

  function vasija() {
    const v = document.createElement("span");
    v.className = "vasija";
    v.setAttribute("aria-hidden", "true");
    v.innerHTML = `<svg viewBox="0 0 120 200">
      <g class="trazo" stroke-width="2.4">
        <path d="M60 112 C58 80 50 56 30 34"/><path d="M62 112 C66 74 74 50 92 26"/><path d="M61 112 C60 80 62 52 60 20"/>
        <path d="M42 66 Q20 58 16 40 Q36 44 42 66 Z" fill="#979B82"/>
        <path d="M76 62 Q98 56 104 38 Q84 40 76 62 Z" fill="#979B82"/>
        <path d="M60 46 Q46 34 50 16 Q62 28 60 46 Z" fill="#979B82"/>
        <path d="M28 32 Q22 18 34 12 Q44 18 36 32 Z" fill="#D7ABC6"/>
        <path d="M88 24 Q86 10 98 8 Q104 20 94 28 Z" fill="#CFADC4"/>
      </g>
      <g class="trazo" stroke-width="1"><path d="M40 64 L22 44 M78 60 L98 42 M59 44 L52 22"/></g>
      <path class="trazo" d="M48 108 H72 V118 C96 130 100 170 88 186 Q60 200 32 186 C20 170 24 130 48 118 Z" fill="#D7ABC6" stroke-width="2.6"/>
      <path class="trazo" d="M44 106 H76 V114 H44 Z" fill="#CFADC4" stroke-width="2.4"/>
      <path d="M40 140 v10 M46 140 v6 M78 168 v8" stroke="#1C1A1E" stroke-width="2" stroke-linecap="round"/>
    </svg>`;
    return v;
  }

  function luna() {
    const l = document.createElement("div");
    l.className = "luna";
    l.id = "luna";
    l.setAttribute("aria-hidden", "true");
    // Luna sentadita, a partir del doodle de Elena
    l.innerHTML = `<svg viewBox="0 0 300 420">
      <defs>
        <clipPath id="ojos-luna">
          <path d="M42 140 Q84 83 128 147 Q84 210 42 140 Z"/>
          <path d="M167 152 Q212 88 251 142 Q210 201 167 152 Z"/>
        </clipPath>
      </defs>
      <!-- cola -->
      <path d="M170 330 Q214 318 211 278 Q208 246 180 238" fill="none" stroke="#161616" stroke-width="11" stroke-linecap="round"/>
      <!-- cuerpo en triángulo, como el doodle -->
      <path d="M134 198 Q118 260 86 334 Q82 358 96 360 L176 350 Q182 300 166 260 Q154 226 148 198 Z" fill="#161616"/>
      <!-- patitas delanteras colgando por el borde del estante -->
      <path d="M106 300 L112 412 Q118 418 125 412 L132 304 Z" fill="#161616"/>
      <path d="M142 302 L138 414 Q144 420 151 414 L158 300 Z" fill="#161616"/>
      <!-- cabeza -->
      <path d="M46 10 L58 62 L229 62 L243 4 L262 70 Q284 120 287 160 Q288 178 272 182 Q200 206 144 204 Q80 202 28 176 Q12 170 13 160 Q20 104 46 10 Z" fill="#161616"/>
      <!-- bigotes -->
      <g stroke="#161616" stroke-width="2.4" stroke-linecap="round" fill="none">
        <path d="M20 150 L-18 142 M18 158 L-20 160 M20 166 L-14 178"/>
        <path d="M282 146 L318 136 M284 154 L322 154 M282 162 L316 172"/>
      </g>
      <!-- ojos como limones, con la rayita inclinada -->
      <g clip-path="url(#ojos-luna)">
        <rect x="30" y="80" width="240" height="130" fill="#CBA455"/>
        <g class="pupila" id="pupila" fill="#161616">
          <path d="M82 113 L96 112 L73 175 Z"/>
          <path d="M204 118 L222 115 L201 174 Z"/>
        </g>
        <rect class="parpado" x="30" y="80" width="240" height="130" fill="#161616"/>
      </g>
      <!-- nariz -->
      <g stroke="#CFADC4" stroke-width="3.2" stroke-linecap="round" fill="none">
        <path d="M139 147 H158 M147 149 L130 191 M147 149 L154 194"/>
      </g>
    </svg>`;
    return l;
  }

  // sellito dorado abajo en el lomo, como el del Hobonichi HON
  const sello = `<span class="sello-lomo" aria-hidden="true"><svg viewBox="0 0 20 20"><path d="M13 3 a8 8 0 1 0 4 13 a6.5 6.5 0 1 1 -4 -13z"/></svg><b>EB</b></span>`;

  function lomoLibreta(g, i) {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "lomo";
      b.setAttribute("role", "listitem");
      b.dataset.id = g.id;
      b.style.setProperty("--h", g.alto || 1);
      b.style.setProperty("--color-cinta", g.cinta);
      b.style.setProperty("--color-tinta", g.tinta);
      b.style.setProperty("--giro", giros[i % giros.length] + "deg");
      b.innerHTML = `<span class="cinta"><span></span></span>${sello}`;
      b.addEventListener("click", () => abrir(g, b));
      return b;
  }

  function construirEstante() {
    libros.appendChild(lomoVacio(0.84, false, false));
    const izquierda = GAVETAS.filter((g) => g.lado !== "derecha");
    const derecha = GAVETAS.filter((g) => g.lado === "derecha");
    izquierda.forEach((g, i) => {
      if (i === 2) libros.appendChild(vasija());
      libros.appendChild(lomoLibreta(g, i));
    });
    libros.appendChild(luna());
    derecha.forEach((g, i) => libros.appendChild(lomoLibreta(g, i + izquierda.length)));
    for (let i = 1; i < LIBRETAS_VACIAS; i++) {
      libros.appendChild(lomoVacio(i === 1 ? 0.95 : 0.86, true, i === LIBRETAS_VACIAS - 1));
    }
  }

  /* ---------- Contenido de cada tipo de libreta ---------- */
  const tipos = {
    galeria: (items) => `<div class="galeria">${items.map((o) => `
      <figure class="obra">${foto(o.imagen, L(o.titulo))}
        <figcaption>${esc(L(o.titulo))}<span>${esc(L(o.tecnica))}</span></figcaption>
      </figure>`).join("")}</div>`,

    spreads: (items) => `<div class="spreads">${items.map((o) => `
      <figure class="spread">${foto(o.imagen, L(o.titulo))}
        <figcaption>${esc(L(o.titulo))}<span>${esc(L(o.fecha))}</span></figcaption>
      </figure>`).join("")}</div>`,

    textos: (items) => `<div class="escritos">${items.map((e, i) => `
      <details class="escrito"${i === 0 ? " open" : ""}>
        <summary><h3 class="renglon">${esc(L(e.titulo))}</h3><time>${esc(L(e.fecha))}</time></summary>
        ${parrafos(e.texto).replace(/<p>/g, '<p class="renglon">')}
      </details>`).join("")}</div>`,

    recortes: (items) => `<div class="recortes">${items.map((r) => `
      <article class="recorte">${foto(r.imagen, L(r.titulo))}
        <div><h3 class="renglon">${esc(L(r.titulo))}</h3><p class="comentario renglon">${esc(L(r.comentario))}</p>
        ${r.enlace ? `<a href="${esc(r.enlace)}" target="_blank" rel="noopener">${esc(tx("ver"))}</a>` : ""}</div>
      </article>`).join("")}</div>`,

    tienda: (items) => `<div class="tienda">${items.map((p) => `
      <article class="pieza">${foto(p.imagen, L(p.nombre))}
        <div><h3 class="renglon">${esc(L(p.nombre))}</h3><p class="precio renglon">${esc(L(p.precio))}</p><p class="detalle renglon">${esc(L(p.detalle))}</p>
        ${p.enlace
          ? `<a class="comprar" href="${esc(p.enlace)}" target="_blank" rel="noopener">${esc(tx("comprar"))}</a>`
          : `<span class="comprar" aria-disabled="true">${esc(tx("pronto"))}</span>`}</div>
      </article>`).join("")}</div>`,

    perfil: (items) => items.map((c) => `<div class="perfil">
      <figure class="retrato retrato-der">${foto(c.imagen, "Elena Brutau", "polaroid")}
        <figcaption>${esc(L(c.pie))}</figcaption>
      </figure>
      <div class="carta">${parrafos(c.texto).replace(/<p>/g, '<p class="renglon">')}
      ${c.contacto ? `<p class="renglon">${esc(tx("escribeme"))} <a href="mailto:${esc(c.contacto)}">${esc(c.contacto)}</a></p>` : ""}</div>
    </div>`).join("")
  };
  tipos.carta = tipos.perfil;

  function cabecera(g, idTitulo) {
    const titulo = g.logo
      ? `<h2 class="sr-only"${idTitulo ? ` id="${idTitulo}"` : ""}>${esc(L(g.titulo))}</h2><figure class="logo-hoja"><img src="${esc(g.logo)}" alt=""></figure>`
      : `<h2 class="renglon"${idTitulo ? ` id="${idTitulo}"` : ""}>${esc(L(g.titulo))}</h2>`;
    return `<p class="devolver-a renglon">${esc(tx("devolver"))} <strong>elenabrutau.com</strong></p>
      ${titulo}
      <p class="nota renglon">${esc(L(g.nota))}</p>`;
  }

  const estrellita = `<svg class="estrellita" viewBox="0 0 100 100" aria-hidden="true"><path d="M50 2 L58 38 L96 26 L66 52 L92 86 L54 66 L40 98 L38 62 L4 70 L30 46 L10 14 L44 32 Z"/></svg>`;

  function llenar(g) {
    const n = GAVETAS.indexOf(g) * 14 + 12;
    const fecha = `<p class="fecha-hoja renglon">${esc(tx("fecha"))}</p>`;
    const p0 = g.tipo === "perfil" && (g.items || [])[0];
    const retratoIzq = p0 ? `<figure class="retrato retrato-izq">${foto(p0.imagen, "Elena Brutau", "polaroid")}<figcaption>${esc(L(p0.pie))}</figcaption></figure>` : "";
    hojaIzq.innerHTML = fecha + cabecera(g, "titulo-libreta") + retratoIzq +
      `<p class="firma renglon">E.${estrellita}</p><p class="pagina renglon">${n}</p>`;
    hojaDer.innerHTML = fecha + `<div class="solo-movil">${cabecera(g)}</div>` +
      (tipos[g.tipo] || tipos.perfil)(g.items || []) + `<p class="pagina renglon">${n + 1}</p>`;
    hojaIzq.insertAdjacentHTML("beforeend", `<p class="mas-abajo" aria-hidden="true">${esc(tx("sigue"))}</p>`);
    hojaDer.insertAdjacentHTML("beforeend", `<p class="mas-abajo" aria-hidden="true">${esc(tx("sigue"))}</p>`);
    hojaDer.querySelectorAll("details").forEach((d) => d.addEventListener("toggle", () => { alinear(); revisarScroll(); }));
    cintaTapa.textContent = L(g.etiqueta);
    libreta.style.setProperty("--color-cinta", g.cinta);
    libreta.style.setProperty("--color-tinta", g.tinta);
  }

  /* ---------- Escribir sobre las líneas ----------
     Mide dónde cae la línea base de cada texto y lo baja o sube unos píxeles
     para que las letras queden apoyadas en una línea de la cuadrícula. */
  function alinear() {
    [hojaIzq, hojaDer].forEach((hoja) => {
      const c = parseFloat(getComputedStyle(hoja).getPropertyValue("--c")) || 14;
      hoja.querySelectorAll(".renglon").forEach((el) => {
        if (el.offsetParent === null) return;          // oculto
        el.style.top = "0px";
        const marca = document.createElement("span");
        marca.className = "marca-base";
        el.insertBefore(marca, el.firstChild);
        let y = 0, n = marca;
        while (n && n !== hoja) { y += n.offsetTop; n = n.offsetParent; }
        marca.remove();
        if (n !== hoja) return;
        const d = Math.round(y / c) * c - y;            // distancia a la línea más cercana
        el.style.top = d.toFixed(2) + "px";
      });
    });
  }
  window.addEventListener("resize", () => { if (abierta) { alinear(); revisarScroll(); } });

  // "sigue leyendo": solo si la hoja tiene más contenido abajo
  function revisarScroll() {
    [hojaIzq, hojaDer].forEach((h) => {
      const falta = h.scrollHeight - h.clientHeight - h.scrollTop;
      h.classList.toggle("con-scroll", falta > 24);
    });
  }
  [hojaIzq, hojaDer].forEach((h) => h.addEventListener("scroll", revisarScroll, { passive: true }));

  // las letras llegan de internet un momento después: cuando terminan de cargar, volver a apoyar el texto en las líneas
  if (document.fonts) {
    ['14px "IM Fell English"', '14px "Courier Prime"', '20px "Sacramento"', '20px "Borel"', '14px "Archivo Narrow"']
      .forEach((f) => { try { document.fonts.load(f); } catch (e) {} });
    document.fonts.addEventListener("loadingdone", () => { if (abierta) { alinear(); revisarScroll(); } });
  }

  /* ---------- Abrir y cerrar ---------- */
  function abrir(g, lomo) {
    if (abierta) return;
    abierta = g;
    lomoActivo = lomo || libros.querySelector(`[data-id="${g.id}"]`);
    llenar(g);
    hojaIzq.scrollTop = 0;
    hojaDer.scrollTop = 0;
    if (lomoActivo) lomoActivo.classList.add("sacada");
    cuarto3d.classList.add("acercando");
    try { history.replaceState(null, "", "#" + g.id); } catch (e) {}

    setTimeout(() => {
      lector.hidden = false;
      alinear();
      void lector.offsetWidth;            // fuerza el estado inicial antes de animar
      lector.classList.add("visible");
      setTimeout(() => {
        lector.classList.add("abierta");
        setTimeout(() => { alinear(); revisarScroll(); hojaDer.focus({ preventScroll: true }); }, t(900));
        setTimeout(() => { if (abierta) { alinear(); revisarScroll(); } }, 2500);
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
        cuarto3d.classList.remove("acercando");
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

  /* ---------- La vitrina abierta (tienda) ---------- */
  const tienda = $("tienda");
  const cajones = $("cajones");
  const compartimentos = $("compartimentos");
  let tiendaAbierta = false;
  let catActual = (TIENDA.categorias[0] || {}).id;

  const dibujosCajon = {
    clay: `<svg viewBox="0 0 90 60" aria-hidden="true">
      <rect class="trazo" x="50" y="34" width="10" height="20" rx="3" fill="#F5F2DF" stroke-width="2"/>
      <path class="trazo" d="M40 36 Q55 12 70 36 Z" fill="#D7ABC6" stroke-width="2"/>
      <g fill="#F5F2DF"><circle cx="50" cy="28" r="2.2"/><circle cx="58" cy="24" r="1.8"/><circle cx="63" cy="31" r="1.8"/></g>
      <path d="M32 50 q7 -2 5 -9" fill="none" stroke="#161616" stroke-width="2.2" stroke-linecap="round"/>
      <path d="M24 38 L19 55 H32 L28 38 Z" fill="#161616"/>
      <path d="M15 31 L17 22 L21 28 H29 L33 21 L35 31 Q35 38 25 38 Q15 38 15 31 Z" fill="#161616"/>
      <ellipse cx="21" cy="31" rx="2.6" ry="1.7" fill="#CBA455"/><ellipse cx="29" cy="31" rx="2.6" ry="1.7" fill="#CBA455"/>
    </svg>`,
    stickers: `<svg viewBox="0 0 90 60" aria-hidden="true">
      <g transform="rotate(-5 45 30)">
        <rect class="trazo" x="26" y="6" width="40" height="50" rx="2" fill="#F5F2DF" stroke-width="2"/>
        <path class="trazo" d="M37 24 c-8 -6 -3 -12 0 -7 c3 -5 8 1 0 7 z" fill="#CFADC4" stroke-width="1.2"/>
        <path class="trazo" d="M55 13 l1.8 4.4 4.6 .4 -3.4 3 1 4.6 -4 -2.4 -4 2.4 1 -4.6 -3.4 -3 4.6 -.4 z" fill="#CBA455" stroke-width="1"/>
        <path d="M33 47 L34 39 L37 43 H43 L46 39 L47 47 Q47 51 40 51 Q33 51 33 47 Z" fill="#161616"/>
        <path class="trazo" d="M57 38 a6 6 0 1 0 3 10 a4.6 4.6 0 1 1 -3 -10 z" fill="#CBA455" stroke-width="1"/>
      </g>
    </svg>`,
    mas: `<svg viewBox="0 0 90 60" aria-hidden="true">
      <path class="trazo" d="M30 54 H52 L48 48 H32" fill="#CFADC4" stroke-width="1.8"/>
      <circle class="trazo" cx="30" cy="38" r="16" fill="#CFADC4" stroke-width="2"/>
      <circle class="trazo" cx="30" cy="38" r="7" fill="#7A5643" stroke-width="2"/>
      <g transform="rotate(6 66 32)">
        <rect class="trazo" x="54" y="14" width="26" height="36" fill="#F5F2DF" stroke-width="2"/>
        <path d="M58 21 q4 -3 8 0 t8 0" fill="none" stroke="#CFADC4" stroke-width="2" stroke-linecap="round"/>
        <path d="M60 41 L61 33 L64 37 H70 L73 33 L74 41 Q74 45 67 45 Q60 45 60 41 Z" fill="#161616"/>
      </g>
    </svg>`
  };

  function pintarTienda(catId) {
    catActual = catId;
    $("nota-tienda").textContent = L(TIENDA.nota);
    cajones.innerHTML = TIENDA.categorias.map((c, i) => `
      <button type="button" class="cajon" role="tab" id="cajon-${c.id}" data-cat="${c.id}"
        aria-selected="${c.id === catId}" aria-controls="compartimentos" tabindex="${c.id === catId ? 0 : -1}">
        ${dibujosCajon[c.id] || dibujosCajon.mas}
        <span class="cinta-cajon c${i % 3}">${esc(L(c.nombre))}</span>
      </button>`).join("");
    const cat = TIENDA.categorias.find((c) => c.id === catId) || TIENDA.categorias[0];
    compartimentos.setAttribute("aria-labelledby", "cajon-" + cat.id);
    compartimentos.innerHTML = (cat.productos || []).length
      ? cat.productos.map((p) => `
        <article class="cubiculo">
          ${foto(p.imagen, L(p.nombre))}
          <div class="etiqueta-precio">
            <h3>${esc(L(p.nombre))}</h3>
            <p class="precio">${esc(L(p.precio))}</p>
            <p class="detalle">${esc(L(p.detalle))}</p>
            ${p.enlace
              ? `<a class="comprar" href="${esc(p.enlace)}" target="_blank" rel="noopener">${esc(tx("comprar"))}</a>`
              : `<span class="comprar" aria-disabled="true">${esc(tx("pronto"))}</span>`}
          </div>
        </article>`).join("")
      : `<p class="cajon-vacio">${esc(tx("vacio"))}</p>`;
    cajones.querySelectorAll(".cajon").forEach((b) => b.addEventListener("click", () => {
      pintarTienda(b.dataset.cat);
      const nuevo = $("cajon-" + b.dataset.cat);
      if (nuevo) nuevo.focus({ preventScroll: true });
    }));
  }

  cajones.addEventListener("keydown", (e) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const ids = TIENDA.categorias.map((c) => c.id);
    let i = ids.indexOf(catActual) + (e.key === "ArrowRight" ? 1 : -1);
    i = (i + ids.length) % ids.length;
    pintarTienda(ids[i]);
    $("cajon-" + ids[i]).focus();
  });

  function abrirTienda() {
    if (tiendaAbierta || abierta) return;
    tiendaAbierta = true;
    pintarTienda(catActual);
    compartimentos.scrollTop = 0;
    cuarto3d.classList.add("acercando");
    try { history.replaceState(null, "", "#tienda"); } catch (e) {}
    tienda.hidden = false;
    void tienda.offsetWidth;
    tienda.classList.add("visible");
    setTimeout(() => { const c = $("cajon-" + catActual); if (c) c.focus({ preventScroll: true }); }, t(500));
  }

  function cerrarTienda() {
    if (!tiendaAbierta) return;
    tienda.classList.remove("visible");
    setTimeout(() => {
      tienda.hidden = true;
      tiendaAbierta = false;
      cuarto3d.classList.remove("acercando");
      $("vitrina").focus({ preventScroll: true });
    }, t(450));
    try { history.replaceState(null, "", location.pathname); } catch (e) {}
  }

  tienda.addEventListener("click", (e) => {
    if (e.target.closest("[data-cerrar-tienda]")) cerrarTienda();
  });

  document.addEventListener("keydown", (e) => {
    if (!tiendaAbierta) return;
    if (e.key === "Escape") { cerrarTienda(); return; }
    if (e.key === "Tab") {
      const foco = [...tienda.querySelectorAll('a[href], button:not([tabindex="-1"]), [tabindex="0"]')]
        .filter((el) => el.offsetParent !== null);
      if (!foco.length) return;
      const primero = foco[0], ultimo = foco[foco.length - 1];
      if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
      else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
    }
  });

  /* ---------- La entrada con la llave ---------- */
  function encender() {
    mundo.classList.add("encendida");
  }

  function entrar(e) {
    const conTeclado = e && e.detail === 0;
    entrada.classList.add("abierta");
    setTimeout(encender, t(1700));
    setTimeout(() => {
      const primero = libros.querySelector("button.lomo");
      if (primero && conTeclado) primero.focus({ preventScroll: true });
    }, t(2600));
  }

  $("llave").addEventListener("click", entrar);
  $("vitrina").addEventListener("click", abrirTienda);

  /* ---------- El mundo se mueve contigo ---------- */
  const aire = $("aire");
  function soltarPolvo() {
    const tipos = ["punto", "estrellita", "lilita", "punto", "estrellita"];
    for (let i = 0; i < 26; i++) {
      const m = document.createElement("span");
      m.className = "mota " + tipos[i % tipos.length];
      const z = -Math.round(40 + Math.random() * 520);
      const tam = 6 + Math.random() * 10;
      m.style.left = (6 + Math.random() * 88) + "%";
      m.style.top = (8 + Math.random() * 70) + "%";
      m.style.width = m.style.height = tam + "px";
      m.style.transform = `translateZ(${z}px)`;
      m.style.setProperty("--dur", (10 + Math.random() * 12).toFixed(1) + "s");
      m.style.setProperty("--delay", (-Math.random() * 12).toFixed(1) + "s");
      m.style.setProperty("--dx", Math.round(-30 + Math.random() * 60) + "px");
      m.style.setProperty("--dy", Math.round(-70 + Math.random() * 40) + "px");
      m.innerHTML = "<i></i>";
      aire.appendChild(m);
    }
  }

  let meta = { x: 0, y: 0 }, actual = { x: 0, y: 0 }, ultimoGesto = 0;
  let puntero = { x: innerWidth / 2, y: innerHeight / 2 };
  function moverA(px, py) {
    puntero = { x: px, y: py };
    meta = { x: px / innerWidth - 0.5, y: py / innerHeight - 0.5 };
    ultimoGesto = performance.now();
  }
  window.addEventListener("pointermove", (e) => moverA(e.clientX, e.clientY), { passive: true });
  window.addEventListener("deviceorientation", (e) => {
    if (e.gamma == null) return;
    meta = { x: Math.max(-0.5, Math.min(0.5, e.gamma / 50)), y: Math.max(-0.5, Math.min(0.5, (e.beta - 45) / 60)) };
    ultimoGesto = performance.now();
  });

  const pupila = () => $("pupila");
  const lunaEl = () => $("luna");
  function cuadro(ahora) {
    if (!quieto) {
      if (ahora - ultimoGesto > 4000) {             // si nadie se mueve, el cuarto respira solo
        meta = { x: Math.sin(ahora / 5200) * 0.25, y: Math.cos(ahora / 6100) * 0.15 };
      }
      actual.x += (meta.x - actual.x) * 0.05;
      actual.y += (meta.y - actual.y) * 0.05;
      cuarto3d.style.setProperty("--ry", (actual.x * 9).toFixed(3) + "deg");
      cuarto3d.style.setProperty("--rx", (-actual.y * 6).toFixed(3) + "deg");
    }
    const p = pupila(), l = lunaEl();
    if (p && l) {
      const r = l.getBoundingClientRect();
      const cx = r.left + r.width / 2, cy = r.top + r.height * 0.4;
      const dx = Math.max(-1, Math.min(1, (puntero.x - cx) / (innerWidth / 2)));
      const dy = Math.max(-1, Math.min(1, (puntero.y - cy) / (innerHeight / 2)));
      p.setAttribute("transform", `translate(${(dx * 14).toFixed(1)} ${(dy * 5).toFixed(1)})`);
    }
    requestAnimationFrame(cuadro);
  }

  /* ---------- Inicio ---------- */
  const hoy = new Date();
  $("fecha").textContent = [hoy.getDate(), hoy.getMonth() + 1, hoy.getFullYear()].map((x) => String(x).padStart(2, "0")).join(" / ");
  construirEstante();
  soltarPolvo();
  // en el celular las paredes laterales quedan muy de perfil: copia la ventana y la rosa a la pared del fondo
  const fondo = document.querySelector(".cara.fondo");
  [".der .ventana", ".izq .marco-rosa"].forEach((sel) => {
    const el = document.querySelector(sel);
    if (el && fondo) { const copia = el.cloneNode(true); copia.classList.add("en-fondo"); fondo.appendChild(copia); }
  });
  aplicarIdioma();
  requestAnimationFrame(cuadro);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { if (abierta) alinear(); });

  // la puerta con la llave sale siempre, salvo si alguien llega con el enlace directo a una libreta
  const directa = GAVETAS.find((g) => "#" + g.id === location.hash);

  if (location.hash === "#tienda") {
    entrada.classList.add("abierta");
    entrada.style.transition = "none";
    encender();
    setTimeout(abrirTienda, 300);
  } else if (directa) {
    entrada.classList.add("abierta");
    entrada.style.transition = "none";
    encender();
    if (directa) setTimeout(() => abrir(directa), 300);
  }
})();
