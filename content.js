/*
  CONTENIDO DE LAS GAVETAS
  ------------------------
  Aquí vive todo lo que se ve dentro de cada libreta.
  Para cambiar textos, fotos o productos solo hay que editar este archivo.

  Campos de cada libreta:
    etiqueta  → lo que dice la cinta del label maker en el lomo
    cinta     → color de la cinta
    tinta     → color de las letras de la cinta
    titulo    → título dentro de la libreta
    nota      → frase escrita a mano en la primera página
    tipo      → cómo se muestra el contenido: "galeria", "textos", "recortes", "tienda" o "carta"
    items     → las cosas que hay dentro

  Las imágenes van en la carpeta /img. Si "imagen" está vacío se muestra un recuadro "foto pendiente".
*/

const GAVETAS = [
  {
    id: "arte",
    etiqueta: "ARTE",
    cinta: "#B3302B",
    tinta: "#FBF6EC",
    alto: 0.92,
    titulo: "Arte",
    nota: "Lo que sale de mis manos cuando nadie me está mirando.",
    tipo: "galeria",
    items: [
      { titulo: "Pieza de ejemplo I", tecnica: "Técnica · año", imagen: "" },
      { titulo: "Pieza de ejemplo II", tecnica: "Técnica · año", imagen: "" },
      { titulo: "Pieza de ejemplo III", tecnica: "Técnica · año", imagen: "" },
      { titulo: "Pieza de ejemplo IV", tecnica: "Técnica · año", imagen: "" }
    ]
  },
  {
    id: "escritos",
    etiqueta: "ESCRITOS",
    cinta: "#26467F",
    tinta: "#FBF6EC",
    alto: 1,
    titulo: "Escritos",
    nota: "Pensamientos que no cupieron en voz alta.",
    tipo: "textos",
    items: [
      {
        titulo: "Título de un escrito",
        fecha: "Octubre 2026",
        texto: "Aquí va el primer párrafo de un escrito tuyo. Puede ser un poema, una reflexión, una carta que nunca enviaste. Cada escrito se abre completo al hacer clic en su título."
      },
      {
        titulo: "Otro escrito",
        fecha: "Septiembre 2026",
        texto: "Un segundo texto de ejemplo. Reemplázalo por algo tuyo y aparecerá aquí con la misma letra y el mismo papel."
      }
    ]
  },
  {
    id: "veo",
    etiqueta: "COSAS QUE VEO",
    cinta: "#3C6A48",
    tinta: "#FBF6EC",
    alto: 0.96,
    titulo: "Cosas que veo",
    nota: "Recortes del mundo que me hicieron detenerme.",
    tipo: "recortes",
    items: [
      { titulo: "Algo que me llamó la atención", comentario: "Por qué me pareció interesante, en una o dos líneas.", imagen: "", enlace: "" },
      { titulo: "Un lugar, un libro, una canción", comentario: "Lo que pensé cuando lo vi.", imagen: "", enlace: "" },
      { titulo: "Una idea robada con cariño", comentario: "De dónde viene y qué me dejó.", imagen: "", enlace: "" }
    ]
  },
  {
    id: "clay",
    etiqueta: "CLAY",
    cinta: "#D9A42E",
    tinta: "#1A1712",
    alto: 0.88,
    titulo: "Clay",
    nota: "Piezas hechas a mano, una por una. Ninguna sale igual a otra.",
    tipo: "tienda",
    items: [
      { nombre: "Pieza de clay de ejemplo", precio: "$00", detalle: "Medidas, colores, si es única.", imagen: "", enlace: "" },
      { nombre: "Otra pieza", precio: "$00", detalle: "Medidas, colores, si es única.", imagen: "", enlace: "" },
      { nombre: "Una más", precio: "$00", detalle: "Medidas, colores, si es única.", imagen: "", enlace: "" }
    ]
  },
  {
    id: "yo",
    etiqueta: "SOBRE MÍ",
    cinta: "#ECE6D8",
    tinta: "#1A1712",
    alto: 0.9,
    titulo: "Sobre mí",
    nota: "Si llegaste hasta aquí, ya conoces casi todo.",
    tipo: "carta",
    items: [
      {
        texto: "Hola, soy Elena. Esta página es un pedazo de mi cabeza puesto en estantes: cada libreta guarda una parte de lo que hago, escribo y miro. Aquí puedes escribir quién eres, de dónde vienes y qué te mueve.",
        contacto: "" // escribe aquí el correo que quieras mostrar, por ejemplo "hola@elenabrutau.com"
      }
    ]
  }
];

/* Libretas sin etiqueta: gavetas que todavía no se abren. Solo decoran el estante. */
const LIBRETAS_VACIAS = 3;
