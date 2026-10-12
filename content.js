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
    tipo      → cómo se muestra el contenido: "galeria", "textos", "recortes", "tienda" o "perfil"
    items     → las cosas que hay dentro

  Cualquier texto puede ser { es: "...", en: "..." } o un texto solo (se usa igual en los dos idiomas).
  Las imágenes van en la carpeta /img. Si "imagen" está vacío se muestra un recuadro "foto pendiente".
*/

const GAVETAS = [
  {
    id: "arte",
    etiqueta: { es: "ARTE", en: "ART" },
    cinta: "#B5652B",
    tinta: "#F6F4EF",
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
    cinta: "#F6F4EF",
    tinta: "#262523",
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
    cinta: "#A9AE95",
    tinta: "#262523",
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
    id: "clay",
    etiqueta: "CLAY",
    cinta: "#D9A63A",
    tinta: "#262523",
    alto: 0.88,
    titulo: "Clay",
    nota: { es: "Piezas hechas a mano, una por una. Ninguna sale igual a otra.", en: "Handmade pieces, one at a time. No two come out the same." },
    tipo: "tienda",
    items: [
      { nombre: { es: "Pieza de clay de ejemplo", en: "Sample clay piece" }, precio: "$00", detalle: { es: "Medidas, colores, si es única.", en: "Size, colors, whether it's one of a kind." }, imagen: "", enlace: "" },
      { nombre: { es: "Otra pieza", en: "Another piece" }, precio: "$00", detalle: { es: "Medidas, colores, si es única.", en: "Size, colors, whether it's one of a kind." }, imagen: "", enlace: "" },
      { nombre: { es: "Una más", en: "One more" }, precio: "$00", detalle: { es: "Medidas, colores, si es única.", en: "Size, colors, whether it's one of a kind." }, imagen: "", enlace: "" }
    ]
  },
  {
    id: "yo",
    etiqueta: { es: "SOBRE MÍ", en: "ABOUT ME" },
    cinta: "#7E7A74",
    tinta: "#F6F4EF",
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
  }
];

/* Libretas sin etiqueta: gavetas que todavía no se abren. Solo decoran el estante. */
const LIBRETAS_VACIAS = 3;
