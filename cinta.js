/*
  LETRA DE CINTA
  --------------
  Dibuja texto como cinta: cada trazo lleva relleno de color y su propio contorno negro.
  El trazo se pinta tramo por tramo (primero negro grueso, luego color fino encima),
  así que cuando una letra se cruza consigo misma se ve qué parte pasa por encima,
  como en el lettering de Elena.

  Uso: Cinta.pintar(elemento)  → reemplaza el texto del elemento por el dibujo.
  Letra de una sola línea: Hershey Script Simplex (Dr. A. V. Hershey, U.S. National Bureau of Standards;
  formato de datos de James Hurt, Cognition, Inc.).
*/
(function () {
  "use strict";
  let FUENTE = null;
  const pendientes = [];

  fetch("fonts/cinta-script.json")
    .then((r) => r.json())
    .then((f) => { FUENTE = f; pendientes.splice(0).forEach((el) => pintar(el)); })
    .catch(() => {});

  const NS = "http://www.w3.org/2000/svg";
  const ESPACIO = 0.5;      // separación extra entre letras (unidades de la fuente)

  function trazar(texto) {
    const lineas = [];
    let x = 0, minY = 0, maxY = 0;
    for (const ch of texto) {
      const g = FUENTE[ch] || FUENTE[ch.normalize("NFD")[0]] || FUENTE["?"];
      if (!g) continue;
      const [ancho, trazos] = g;
      for (const t of trazos) {
        const pts = [];
        for (let i = 0; i < t.length; i += 2) {
          pts.push([t[i] + x, t[i + 1]]);
          if (t[i + 1] < minY) minY = t[i + 1];
          if (t[i + 1] > maxY) maxY = t[i + 1];
        }
        lineas.push(pts);
      }
      x += ancho + ESPACIO;
    }
    return { lineas, ancho: x, minY, maxY };
  }

  const d = (pts) => "M" + pts.map((p) => p[0].toFixed(1) + " " + p[1].toFixed(1)).join("L");

  // largo de un tramo y cuánto se mete el rosa en el tramo anterior para tapar la costura
  function svg(texto, { grosor = 2.1, borde = 0.75, tramo = 9 } = {}) {
    const { lineas, ancho, minY, maxY } = trazar(texto);
    const m = grosor + borde * 2;
    const tapa = grosor / 2 + borde + 0.6;
    const partes = [];
    for (const pts of lineas) {
      // largo acumulado a lo largo del trazo
      const L = [0];
      for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
      let i = 0;
      while (i < pts.length - 1) {
        let j = i + 1;
        while (j < pts.length - 1 && L[j] - L[i] < tramo) j++;
        let k = i;
        while (k > 0 && L[i] - L[k] < tapa) k--;
        partes.push(`<path d="${d(pts.slice(i, j + 1))}" class="cb"/><path d="${d(pts.slice(k, j + 1))}" class="cr"/>`);
        i = j;
      }
    }
    const vb = [-m, minY - m, ancho + 2 * m, maxY - minY + 2 * m].map((v) => v.toFixed(1)).join(" ");
    return `<svg class="cinta-letra" viewBox="${vb}" aria-hidden="true" focusable="false"
      style="--g:${grosor};--b:${borde};--baja:${((maxY - 9 + m) / (maxY - minY + 2 * m)).toFixed(3)}"><g>${partes.join("")}</g></svg>`;
  }

  function pintar(el) {
    if (!el) return;
    // tras pintar, el texto queda en un span solo para lectores de pantalla, así que volver a pintar es seguro
    const texto = el.textContent.trim();
    if (!FUENTE) { if (!pendientes.includes(el)) pendientes.push(el); return; }
    el.innerHTML = `<span class="sr-only">${texto.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]))}</span>${svg(texto)}`;
    el.classList.add("con-cinta");
  }

  window.Cinta = { pintar, svg, lista: () => !!FUENTE, usar: (f) => { FUENTE = f; } };
})();
