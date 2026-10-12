/*
  CONTENIDO DE LAS GAVETAS
  ------------------------
  Aquí vive todo lo que se ve dentro de cada libreta, en español (es) e inglés (en).
  Para cambiar textos, fotos o productos solo hay que editar este archivo.

  Campos de cada libreta:
    etiqueta  → lo que dice la cinta del label maker en el lomo
    cinta     → color de la cinta
    tinta     → color de las letras de la cinta
    titulo    → título dentro de la libreta
    nota      → frase escrita a mano en la primera página
    tipo      → cómo se muestra el contenido: "galeria", "spreads", "textos", "recortes", "tienda" o "perfil"
    lado      → (opcional) "derecha" pone la libreta a la derecha de Luna
    logo      → (opcional) un dibujo que reemplaza al título dentro de la libreta
    items     → las cosas que hay dentro

  Cualquier texto puede ser { es: "...", en: "..." } o un texto solo (se usa igual en los dos idiomas).
  Las imágenes van en la carpeta /img. Si "imagen" está vacío se muestra un recuadro "foto pendiente".
*/

const GAVETAS = [
  {
    id: "arte",
    etiqueta: { es: "ARTE", en: "ART" },
    cinta: "#CFADC4",
    tinta: "#1C1A1E",
    alto: 0.92,
    titulo: { es: "Arte", en: "Art" },
    nota: { es: "Lo que sale de mis manos cuando nadie me está mirando.", en: "What comes out of my hands when no one is watching." },
    tipo: "galeria",
    items: [
      { titulo: { es: "Pieza de ejemplo I", en: "Sample piece I" }, tecnica: { es: "Técnica · año", en: "Medium · year" }, imagen: "" },
      { titulo: { es: "Pieza de ejemplo II", en: "Sample piece II" }, tecnica: { es: "Técnica · año", en: "Medium · year" }, imagen: "" },
      { titulo: { es: "Pieza de ejemplo III", en: "Sample piece III" }, tecnica: { es: "Técnica · año", en: "Medium · year" }, imagen: "" },
      { titulo: { es: "Pieza de ejemplo IV", en: "Sample piece IV" }, tecnica: { es: "Técnica · año", en: "Medium · year" }, imagen: "" }
    ]
  },
  {
    id: "escritos",
    etiqueta: { es: "ESCRITOS", en: "WRITINGS" },
    cinta: "#F5F2DF",
    tinta: "#1C1A1E",
    alto: 1,
    titulo: { es: "Escritos", en: "Writings" },
    nota: { es: "Pensamientos que no cupieron en voz alta.", en: "Thoughts that didn't fit out loud." },
    tipo: "textos",
    items: [
      {
        titulo: { es: "Título de un escrito", en: "Title of a piece" },
        fecha: { es: "Octubre 2026", en: "October 2026" },
        texto: {
          es: "Aquí va el primer párrafo de un escrito tuyo. Puede ser un poema, una reflexión, una carta que nunca enviaste. Cada escrito se abre completo al hacer clic en su título.",
          en: "The first paragraph of one of your pieces goes here. It can be a poem, a reflection, a letter you never sent. Each piece opens in full when you click its title."
        }
      },
      {
        titulo: { es: "Otro escrito", en: "Another piece" },
        fecha: { es: "Septiembre 2026", en: "September 2026" },
        texto: {
          es: "Un segundo texto de ejemplo. Reemplázalo por algo tuyo y aparecerá aquí con la misma letra y el mismo papel.",
          en: "A second sample text. Replace it with something of yours and it will show up here with the same handwriting and paper."
        }
      }
    ]
  },
  {
    id: "veo",
    etiqueta: { es: "COSAS QUE VEO", en: "THINGS I SEE" },
    cinta: "#979B82",
    tinta: "#F5F2DF",
    alto: 0.96,
    titulo: { es: "Cosas que veo", en: "Things I see" },
    nota: { es: "Recortes del mundo que me hicieron detenerme.", en: "Clippings of the world that made me stop." },
    tipo: "recortes",
    items: [
      { titulo: { es: "Algo que me llamó la atención", en: "Something that caught my eye" }, comentario: { es: "Por qué me pareció interesante.", en: "Why I found it interesting." }, imagen: "", enlace: "" },
      { titulo: { es: "Un lugar, un libro, una canción", en: "A place, a book, a song" }, comentario: { es: "Lo que pensé cuando lo vi.", en: "What I thought when I saw it." }, imagen: "", enlace: "" },
      { titulo: { es: "Una idea robada con cariño", en: "An idea, lovingly stolen" }, comentario: { es: "De dónde viene y qué me dejó.", en: "Where it came from and what it left me." }, imagen: "", enlace: "" }
    ]
  },
  {
    id: "yo",
    etiqueta: { es: "SOBRE MÍ", en: "ABOUT ME" },
    cinta: "#2A2D5E",
    tinta: "#F5F2DF",
    alto: 0.9,
    titulo: { es: "Sobre mí", en: "About me" },
    nota: { es: "Si llegaste hasta aquí, ya conoces casi todo.", en: "If you made it this far, you already know almost everything." },
    tipo: "perfil",
    items: [
      {
        imagen: "",          // tu foto, por ejemplo "img/elena.jpg"
        pie: { es: "yo, más o menos", en: "me, more or less" },
        texto: {
          es: "Aquí escribirás un poco sobre ti: quién eres, de dónde vienes, qué te mueve.",
          en: "A little about you will go here: who you are, where you come from, what moves you."
        },
        contacto: ""         // el correo que quieras mostrar, por ejemplo "hola@elenabrutau.com"
      }
    ]
  },
  {
    id: "commonplace",
    lado: "derecha",
    etiqueta: "COMMONPLACING",
    cinta: "#D7ABC6",
    tinta: "#1C1A1E",
    alto: 0.97,
    titulo: "Commonplacing",
    nota: { es: "Citas, recortes y cosas que no quiero olvidar, pegadas a mano.", en: "Quotes, clippings and things I don't want to forget, glued in by hand." },
    tipo: "spreads",
    items: [
      { titulo: { es: "Spread de ejemplo", en: "Sample spread" }, fecha: { es: "Octubre 2026", en: "October 2026" }, imagen: "" },
      { titulo: { es: "Otro spread", en: "Another spread" }, fecha: { es: "Septiembre 2026", en: "September 2026" }, imagen: "" }
    ]
  },
  {
    id: "diario",
    lado: "derecha",
    etiqueta: { es: "DIARIO", en: "JOURNAL" },
    cinta: "#A88A9F",
    tinta: "#F5F2DF",
    alto: 0.9,
    titulo: { es: "Diario", en: "Journal" },
    nota: { es: "Mis días, uno por uno, en papel.", en: "My days, one by one, on paper." },
    tipo: "spreads",
    items: [
      { titulo: { es: "Spread de ejemplo", en: "Sample spread" }, fecha: { es: "Octubre 2026", en: "October 2026" }, imagen: "" },
      { titulo: { es: "Otro spread", en: "Another spread" }, fecha: { es: "Septiembre 2026", en: "September 2026" }, imagen: "" }
    ]
  }
];

/*
  LA TIENDA DE LUNA & FRIENDS (se abre al tocar la vitrina de la pared)
  ---------------------------------------------------------------------
  Cada categoría es un cajón de la vitrina. Cada producto:
    nombre, precio, detalle, imagen ("img/..." o vacío) y enlace (Etsy, Stripe, Shopify...).
  Si "enlace" está vacío, el botón dice "Pronto a la venta".
*/
const TIENDA = {
  nota: { es: "Stickers y piezas de clay hechas a mano, con Luna vigilando.", en: "Handmade stickers and clay pieces, with Luna keeping watch." },
  categorias: [
    {
      id: "clay",
      nombre: "Clay",
      productos: [
        { nombre: { es: "Pieza de clay de ejemplo", en: "Sample clay piece" }, precio: "$00", detalle: { es: "Medidas, colores, si es única.", en: "Size, colors, whether it's one of a kind." }, imagen: "", enlace: "" },
        { nombre: { es: "Otra pieza", en: "Another piece" }, precio: "$00", detalle: { es: "Medidas, colores, si es única.", en: "Size, colors, whether it's one of a kind." }, imagen: "", enlace: "" },
        { nombre: { es: "Una más", en: "One more" }, precio: "$00", detalle: { es: "Medidas, colores, si es única.", en: "Size, colors, whether it's one of a kind." }, imagen: "", enlace: "" }
      ]
    },
    {
      id: "stickers",
      nombre: "Stickers",
      productos: [
        { nombre: { es: "Sticker de ejemplo", en: "Sample sticker" }, precio: "$00", detalle: { es: "Tamaño, acabado (mate o brillante).", en: "Size, finish (matte or glossy)." }, imagen: "", enlace: "" },
        { nombre: { es: "Hoja de stickers", en: "Sticker sheet" }, precio: "$00", detalle: { es: "Cuántos trae y de qué tamaño.", en: "How many and what size." }, imagen: "", enlace: "" }
      ]
    },
    {
      id: "mas",
      nombre: { es: "Y más", en: "And more" },
      productos: [
        { nombre: { es: "Cinta washi de ejemplo", en: "Sample washi tape" }, precio: "$00", detalle: { es: "Ancho y largo.", en: "Width and length." }, imagen: "", enlace: "" }
      ]
    }
  ]
};

/* Libretas sin etiqueta: gavetas que todavía no se abren. Solo decoran el estante. */
const LIBRETAS_VACIAS = 2;
