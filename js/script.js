function crearImagenPlaceholder(colorFondo, colorIcono) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
      <rect width="200" height="200" fill="${colorFondo}"/>
      <path d="M55 68 h90 l-9 74 a20 20 0 0 1 -20 18 h-32 a20 20 0 0 1 -20 -18 Z" fill="${colorIcono}"/>
      <path d="M146 80 h13 a17 17 0 0 1 0 34 h-9" fill="none" stroke="${colorIcono}" stroke-width="8"/>
      <ellipse cx="100" cy="58" rx="40" ry="7" fill="${colorIcono}" opacity="0.4"/>
    </svg>`;
  return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
}

const PALETA_TUESTES = ["#8c3b21", "#9c2b1d", "#5c3a21", "#3f5c3a", "#6b4226", "#a85c32"];

function formatearPrecio(valor) {
  return valor.toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  });
}

function prefiereMovimientoReducido() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// ---- 1) Arreglo global del inventario (datos estáticos iniciales) ----

let inventario = [
  {
    id: 1,
    nombre: "Pergamino Popayán — panela y cítricos",
    precio: 38000,
    stock: 24,
    imagen: crearImagenPlaceholder("#f1e6cf", "#8c3b21"),
  },
  {
    id: 2,
    nombre: "Geisha Silvia — jazmín y durazno",
    precio: 62000,
    stock: 10,
    imagen: crearImagenPlaceholder("#f1e6cf", "#9c2b1d"),
  },
  {
    id: 3,
    nombre: "Caturra Piendamó — cacao y nuez",
    precio: 34000,
    stock: 30,
    imagen: crearImagenPlaceholder("#f1e6cf", "#5c3a21"),
  },
  {
    id: 4,
    nombre: "Honey Totoró — caramelo y mora",
    precio: 45000,
    stock: 4,
    imagen: crearImagenPlaceholder("#f1e6cf", "#3f5c3a"),
  },
  {
    id: 5,
    nombre: "Descafeinado Puracé — cacao suave",
    precio: 36000,
    stock: 0,
    imagen: crearImagenPlaceholder("#f1e6cf", "#6b4226"),
  },
];

let ultimoIdAgregado = null;

// ---- 2) Dibujado del catálogo ----

function crearTarjeta(producto) {
  const tarjeta = document.createElement("article");
  tarjeta.className = "tarjeta-producto";
  if (producto.id === ultimoIdAgregado) {
    tarjeta.classList.add("tarjeta-nueva");
  }

  const imagen = document.createElement("img");
  imagen.className = "tarjeta-imagen";
  imagen.src = producto.imagen;
  imagen.alt = producto.nombre;
  imagen.loading = "lazy";

  const cuerpo = document.createElement("div");
  cuerpo.className = "tarjeta-cuerpo";

  const titulo = document.createElement("h3");
  titulo.textContent = producto.nombre;

  const precio = document.createElement("p");
  precio.className = "tarjeta-precio";
  precio.textContent = formatearPrecio(producto.precio);

  const stock = document.createElement("p");
  stock.className = "tarjeta-stock";
  if (producto.stock === 0) {
    stock.classList.add("agotado");
    stock.textContent = "Agotado";
  } else {
    if (producto.stock <= 5) stock.classList.add("stock-bajo");
    stock.textContent = `Quedan ${producto.stock} unidades`;
  }

  const boton = document.createElement("button");
  boton.className = "boton-comprar";
  boton.type = "button";
  boton.textContent = "Comprar";
  boton.dataset.id = producto.id;
  boton.disabled = producto.stock === 0;
  boton.addEventListener("click", () => comprarProducto(producto.id));

  cuerpo.append(titulo, precio, stock, boton);
  tarjeta.append(imagen, cuerpo);
  return tarjeta;
}

function renderizarCatalogo() {
  const contenedor = document.getElementById("lista-catalogo");
  contenedor.innerHTML = ""; // ciclo de limpieza
  inventario.forEach((producto) => {
    contenedor.appendChild(crearTarjeta(producto)); // ciclo de redibujado
  });
}

// ---- 3) Panel de compra (independiente del panel administrativo) ----

function comprarProducto(id) {
  const producto = inventario.find((item) => item.id === id);
  if (!producto || producto.stock === 0) return;
  producto.stock -= 1;
  ultimoIdAgregado = null;
  renderizarCatalogo();
}

// ---- 4) Alta de un nuevo producto desde el formulario ----

function mostrarMensaje(texto) {
  const mensaje = document.getElementById("mensaje-admin");
  mensaje.textContent = texto;
}

function inicializarFormularioAdmin() {
  const formulario = document.getElementById("form-nuevo-producto");

  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const campoNombre = document.getElementById("nombre-producto");
    const campoPrecio = document.getElementById("precio-producto");
    const campoStock = document.getElementById("stock-producto");
    const campoImagen = document.getElementById("imagen-producto");

    const nombre = campoNombre.value.trim();
    // .value siempre llega como texto: se convierte explícitamente a número
    const precio = Number(campoPrecio.value);
    const stock = Number(campoStock.value);
    const archivo = campoImagen.files[0];

    if (!nombre || Number.isNaN(precio) || Number.isNaN(stock)) {
      mostrarMensaje("Revisa el nombre, el precio y el stock antes de continuar.");
      return;
    }

    const agregarAlInventario = (imagenFinal) => {
      // Objeto literal con exactamente las mismas propiedades
      // que usan los demás productos del inventario.
      const nuevoProducto = {
        id: inventario.length + 1, // longitud actual + 1, como sugiere la pista
        nombre: nombre,
        precio: precio,
        stock: stock,
        imagen: imagenFinal,
      };

      inventario.push(nuevoProducto); // inyección al catálogo base
      ultimoIdAgregado = nuevoProducto.id;
      renderizarCatalogo(); // limpieza y redibujado inmediato

      mostrarMensaje(`"${nuevoProducto.nombre}" se agregó al catálogo con id ${nuevoProducto.id}.`);
      formulario.reset();
      document.getElementById("catalogo").scrollIntoView({
        behavior: prefiereMovimientoReducido() ? "auto" : "smooth",
        block: "start",
      });
    };

    if (archivo) {
      const lector = new FileReader();
      lector.onload = (evt) => agregarAlInventario(evt.target.result);
      lector.onerror = () => {
        const color = PALETA_TUESTES[inventario.length % PALETA_TUESTES.length];
        agregarAlInventario(crearImagenPlaceholder("#f1e6cf", color));
      };
      lector.readAsDataURL(archivo);
    } else {
      const color = PALETA_TUESTES[inventario.length % PALETA_TUESTES.length];
      agregarAlInventario(crearImagenPlaceholder("#f1e6cf", color));
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderizarCatalogo();
  inicializarFormularioAdmin();
});
