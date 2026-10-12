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
    etiqueta: "SKETCHBOOK",
    cinta: "#F5F2DF",
    tinta: "#1C1A1E",
    alto: 0.92,
    titulo: "Sketchbook",
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
    etiqueta: { es: "ESCRITOS", en: "STORIES & SCRAPS" },
    cinta: "#F5F2DF",
    tinta: "#1C1A1E",
    alto: 1,
    titulo: { es: "Escritos", en: "Stories & scraps" },
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
    cinta: "#F5F2DF",
    tinta: "#1C1A1E",
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
    cinta: "#F5F2DF",
    tinta: "#1C1A1E",
    alto: 0.9,
    titulo: { es: "Sobre mí", en: "About me" },
    nota: { es: "Gracias por visitarme.", en: "Thank you for visiting me." },
    tipo: "perfil",
    items: [
      {
        imagen: "img/elena.jpg",
        pie: { es: "yo, cuando me río", en: "me, when I laugh" },
        texto: {
          es: "¡Hola! Me llamo Elena Brutau. Desde pequeña he estado obsesionada con plasmar mi vida en libretas.\n\nCuando me fui de Cuba a México a los 17, lo único que me llevé fueron mis diarios. Hice lo mismo nueve años más tarde, cuando vine a vivir a Estados Unidos.\n\nA esa obsesión temprana se le han sumado algunas nuevas: escribir historias, el polymer clay y hacer stickers (además del café, los libros y mis four cat babies: Tom, Ash, Luna y Félix, por supuesto).\n\nEsta página no solo agrupa todas mis obsesiones: también me permite compartirlas con ustedes, mis fellow journal friends.",
          en: "Hi! My name is Elena Brutau. Ever since I was little, I've been obsessed with capturing my life in notebooks.\n\nWhen I left Cuba for Mexico at 17, the only things I took with me were my journals. I did the same nine years later, when I moved to the United States.\n\nOver time, new obsessions joined that early one: writing stories, polymer clay and making stickers (plus coffee, books and my four cat babies: Tom, Ash, Luna and Felix, of course).\n\nThis page doesn't just gather all my obsessions in one place: it lets me share them with you, my fellow journal friends."
        },
        contacto: ""         // el correo que quieras mostrar, por ejemplo "hola@elenabrutau.com"
      }
    ]
  },
  {
    id: "commonplace",
    lado: "derecha",
    etiqueta: "COMMONPLACING",
    cinta: "#F5F2DF",
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
    cinta: "#F5F2DF",
    tinta: "#1C1A1E",
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

/*
  REDES (el tablerito de corcho del cuarto y las estampitas de Sobre mí)
  Pon el enlace completo de cada una. Si "enlace" está vacío, sale como "pronto".
*/
const REDES = [
  { id: "instagram", nombre: "Instagram", usuario: "@elenabrutau", enlace: "https://www.instagram.com/elenabrutau/" },
  { id: "youtube", nombre: "YouTube", usuario: "@elenabrutau", enlace: "https://www.youtube.com/@elenabrutau" }
];

/* Libretas sin etiqueta: gavetas que todavía no se abren. Solo decoran el estante. */
const LIBRETAS_VACIAS = 2;
