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
      fecha: "Fecha:",
      devolver: "Si encuentras esta libreta, devuélvela a",
      foto: "foto pendiente",
      ver: "Ver de dónde viene",
      comprar: "Comprar",
      pronto: "Pronto a la venta",
      escribeme: "Escríbeme:",
      abrir: "Abrir la libreta",
      estante: "Estante de libretas de Elena Brutau"
    },
    en: {
      entrar: "turn the key to come in",
      pista: "pull out a notebook to open it",
      volver: "put it back on the shelf",
      fecha: "Date:",
      devolver: "If found, please return to",
      foto: "photo coming soon",
      ver: "See where it's from",
      comprar: "Buy",
      pronto: "Coming soon",
      escribeme: "Write to me:",
      abrir: "Open the notebook",
      estante: "Elena Brutau's shelf of notebooks"
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
    document.querySelectorAll(".idiomas button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.idioma === idioma)));
    libros.querySelectorAll("button.lomo").forEach((b) => {
      const g = GAVETAS.find((x) => x.id === b.dataset.id);
      b.querySelector(".cinta span").textContent = L(g.etiqueta);
      b.setAttribute("aria-label", `${tx("abrir")}: ${L(g.titulo)}`);
    });
    if (abierta) { llenar(abierta); alinear(); }
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
    return b;
  }

  function vasija() {
    const v = document.createElement("span");
    v.className = "vasija";
    v.setAttribute("aria-hidden", "true");
    v.innerHTML = `<svg viewBox="0 0 120 200">
      <path d="M30 120 C10 150 22 196 60 196 C98 196 112 150 88 120 Z" fill="#1C1A1E" opacity=".12" transform="translate(6 4)"/>
      <g class="trazo">
        <path d="M44 110 h32 v12 C104 140 104 196 60 196 C16 196 16 140 44 122 Z" fill="#CFADC4"/>
        <path d="M30 150 C50 158 72 158 92 150" stroke-width="1.2"/>
        <path d="M34 166 l6 8 l6 -8 l6 8 l6 -8 l6 8 l6 -8 l6 8 l6 -8 l6 8" stroke-width="1.2"/>
        <path d="M58 110 C56 80 44 56 22 34"/><path d="M40 70 C30 66 22 66 14 70"/><path d="M32 52 C30 42 32 34 38 28"/>
        <path d="M62 110 C66 76 76 48 98 20"/><path d="M76 66 C86 64 92 58 96 50"/><path d="M86 38 C84 30 86 22 92 16"/>
      </g>
      <g fill="#CBA455" stroke="#1C1A1E" stroke-width="1.2"><circle cx="22" cy="33" r="3.2"/><circle cx="98" cy="19" r="3.2"/><circle cx="38" cy="27" r="2.6"/><circle cx="96" cy="49" r="2.6"/><circle cx="14" cy="70" r="2.4"/></g>
    </svg>`;
    return v;
  }

  function luna() {
    const l = document.createElement("div");
    l.className = "luna";
    l.id = "luna";
    l.setAttribute("aria-hidden", "true");
    // Luna sentadita, a partir del doodle de Elena
    l.innerHTML = `<svg viewBox="0 0 300 345">
      <defs>
        <clipPath id="ojos-luna">
          <path d="M54 133 Q90 100 129 135 Q92 168 54 133 Z"/>
          <path d="M160 139 Q200 103 234 132 Q200 167 160 139 Z"/>
        </clipPath>
      </defs>
      <g class="cuerpo-luna">
        <path d="M164 292 Q210 270 199 236 Q192 216 173 213" fill="none" stroke="#161616" stroke-width="10" stroke-linecap="round"/>
        <path d="M131 178 Q120 238 92 296 Q88 312 104 312 L168 306 Q172 270 162 238 Q151 205 147 178 Z" fill="#161616"/>
        <path d="M112 262 L117 340 Q123 345 129 340 L134 264 Z" fill="#161616"/>
        <path d="M145 264 L141 340 Q147 345 153 340 L158 262 Z" fill="#161616"/>
        <path d="M59 22 L68 64 L212 65 L224 16 L240 62 Q262 120 261 152 Q258 171 230 177 Q160 187 90 181 Q36 177 32 156 Q36 110 52 68 Z" fill="#161616"/>
        <g stroke="#161616" stroke-width="2.4" stroke-linecap="round" fill="none">
          <path d="M40 146 L2 140 M38 154 L0 156 M40 162 L6 172"/>
          <path d="M254 144 L296 136 M256 152 L298 152 M254 160 L292 168"/>
        </g>
      </g>
      <g clip-path="url(#ojos-luna)">
        <rect x="40" y="95" width="210" height="80" fill="#CBA455"/>
        <g class="pupila" id="pupila" fill="#161616">
          <path d="M97 108 L84 160 L89 160 Z"/>
          <path d="M205 108 L192 160 L197 160 Z"/>
        </g>
        <rect class="parpado" x="40" y="95" width="210" height="80" fill="#161616"/>
      </g>
      <g stroke="#CFADC4" stroke-width="3" stroke-linecap="round" fill="none">
        <path d="M136 137 H152 M144 139 L131 172 M144 139 L150 175"/>
      </g>
    </svg>`;
    return l;
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
      b.innerHTML = `<span class="cinta"><span></span></span>`;
      b.addEventListener("click", () => abrir(g, b));
      libros.appendChild(b);
    });
    libros.appendChild(luna());
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
      <figure class="retrato">${foto(c.imagen, "Elena Brutau", "polaroid")}
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
    hojaIzq.innerHTML = fecha + cabecera(g, "titulo-libreta") +
      `<p class="firma renglon">E.${estrellita}</p><p class="pagina renglon">${n}</p>`;
    hojaDer.innerHTML = fecha + `<div class="solo-movil">${cabecera(g)}</div>` +
      (tipos[g.tipo] || tipos.perfil)(g.items || []) + `<p class="pagina renglon">${n + 1}</p>`;
    hojaDer.querySelectorAll("details").forEach((d) => d.addEventListener("toggle", alinear));
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
  window.addEventListener("resize", () => { if (abierta) alinear(); });

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
        setTimeout(() => { alinear(); hojaDer.focus({ preventScroll: true }); }, t(900));
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

  /* ---------- La entrada con la llave ---------- */
  function encender() {
    mundo.classList.add("encendida");
  }

  function entrar(e) {
    const conTeclado = e && e.detail === 0;
    entrada.classList.add("abierta");
    try { sessionStorage.setItem("entro", "1"); } catch (err) {}
    setTimeout(encender, t(1700));
    setTimeout(() => {
      const primero = libros.querySelector("button.lomo");
      if (primero && conTeclado) primero.focus({ preventScroll: true });
    }, t(2600));
  }

  $("llave").addEventListener("click", entrar);

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
      p.setAttribute("transform", `translate(${(dx * 13).toFixed(1)} ${(dy * 6).toFixed(1)})`);
    }
    requestAnimationFrame(cuadro);
  }

  /* ---------- Inicio ---------- */
  const hoy = new Date();
  $("fecha").textContent = [hoy.getDate(), hoy.getMonth() + 1, hoy.getFullYear()].map((x) => String(x).padStart(2, "0")).join(" / ");
  construirEstante();
  soltarPolvo();
  aplicarIdioma();
  requestAnimationFrame(cuadro);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { if (abierta) alinear(); });

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
