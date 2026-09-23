// ======================================================
// RITUAL CAFÉ
// Catálogo público
// ======================================================


// ---------- IMAGEN PLACEHOLDER ----------

function crearImagenPlaceholder(colorFondo, colorIcono) {

    const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500">

            <rect
                width="500"
                height="500"
                fill="${colorFondo}"
            />

            <circle
                cx="250"
                cy="250"
                r="150"
                fill="none"
                stroke="${colorIcono}"
                stroke-width="2"
                opacity="0.3"
            />

            <path
                d="M150 190
                   h200
                   l-20 160
                   a35 35 0 0 1 -35 30
                   h-90
                   a35 35 0 0 1 -35 -30
                   Z"
                fill="${colorIcono}"
            />

            <path
                d="M350 220
                   h30
                   a35 35 0 0 1 0 70
                   h-25"
                fill="none"
                stroke="${colorIcono}"
                stroke-width="15"
            />

            <ellipse
                cx="250"
                cy="185"
                rx="90"
                ry="16"
                fill="${colorIcono}"
                opacity="0.45"
            />

            <text
                x="250"
                y="420"
                text-anchor="middle"
                fill="${colorIcono}"
                font-family="monospace"
                font-size="15"
                letter-spacing="4"
            >
                RITUAL / CAFÉ
            </text>

        </svg>
    `;

    return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
}


// ---------- PALETA ----------

const PALETA_TUESTES = [
    "#60432e",
    "#6f382b",
    "#4e5944",
    "#815536",
    "#73442f",
    "#523d30"
];


// ---------- FORMATEAR PRECIO ----------

function formatearPrecio(valor) {

    return valor.toLocaleString("es-CO", {
        style: "currency",
        currency: "COP",
        maximumFractionDigits: 0
    });
}


// ---------- INVENTARIO ----------
//
// Este es el arreglo global del inventario.
// Los productos tienen exactamente estas propiedades:
//
// id
// nombre
// precio
// stock
// imagen
//

let inventario = [

    {
        id: 1,
        nombre: "Pergamino Popayán — panela y cítricos",
        precio: 38000,
        stock: 24,
        imagen: crearImagenPlaceholder("#d8ccb6", "#60432e")
    },

    {
        id: 2,
        nombre: "Geisha Silvia — jazmín y durazno",
        precio: 62000,
        stock: 10,
        imagen: crearImagenPlaceholder("#ded4bf", "#8d4938")
    },

    {
        id: 3,
        nombre: "Caturra Piendamó — cacao y nuez",
        precio: 34000,
        stock: 30,
        imagen: crearImagenPlaceholder("#d5c5ad", "#4e5944")
    },

    {
        id: 4,
        nombre: "Honey Totoró — caramelo y mora",
        precio: 45000,
        stock: 4,
        imagen: crearImagenPlaceholder("#dfcfb7", "#815536")
    },

    {
        id: 5,
        nombre: "Descafeinado Puracé — cacao suave",
        precio: 36000,
        stock: 0,
        imagen: crearImagenPlaceholder("#d2c5b1", "#523d30")
    }

];


// ---------- ÚLTIMO PRODUCTO AGREGADO ----------

let ultimoIdAgregado = null;


// ---------- CREAR TARJETA ----------

function crearTarjeta(producto) {

    const tarjeta = document.createElement("article");

    tarjeta.className = "tarjeta-producto";


    if (producto.id === ultimoIdAgregado) {
        tarjeta.classList.add("tarjeta-nueva");
    }


    // Imagen

    const imagen = document.createElement("img");

    imagen.className = "tarjeta-imagen";

    imagen.src = producto.imagen;

    imagen.alt = `Café ${producto.nombre}`;

    imagen.loading = "lazy";


    // Cuerpo

    const cuerpo = document.createElement("div");

    cuerpo.className = "tarjeta-cuerpo";


    // Nombre

    const titulo = document.createElement("h3");

    titulo.textContent = producto.nombre;


    // Precio

    const precio = document.createElement("p");

    precio.className = "tarjeta-precio";

    precio.textContent = formatearPrecio(producto.precio);


    // Stock

    const stock = document.createElement("p");

    stock.className = "tarjeta-stock";


    if (producto.stock === 0) {

        stock.classList.add("agotado");

        stock.textContent = "Agotado";

    } else {

        if (producto.stock <= 5) {
            stock.classList.add("stock-bajo");
        }

        stock.textContent = `Quedan ${producto.stock} unidades`;
    }


    // Botón

    const boton = document.createElement("button");

    boton.className = "boton-comprar";

    boton.type = "button";

    boton.textContent = "Agregar al pedido";

    boton.dataset.id = producto.id;

    boton.disabled = producto.stock === 0;


    boton.addEventListener("click", () => {
        comprarProducto(producto.id);
    });


    cuerpo.append(
        titulo,
        precio,
        stock,
        boton
    );


    tarjeta.append(
        imagen,
        cuerpo
    );


    return tarjeta;
}


// ---------- RENDERIZAR CATÁLOGO ----------

function renderizarCatalogo() {

    const contenedor =
        document.getElementById("lista-catalogo");


    // Ciclo de limpieza

    contenedor.innerHTML = "";


    // Ciclo de redibujado

    inventario.forEach((producto) => {

        contenedor.appendChild(
            crearTarjeta(producto)
        );

    });
}


// ---------- COMPRA ----------

function comprarProducto(id) {

    const producto = inventario.find(
        (item) => item.id === id
    );


    if (!producto || producto.stock === 0) {
        return;
    }


    producto.stock -= 1;


    ultimoIdAgregado = null;


    renderizarCatalogo();
}


// ---------- INICIALIZAR ----------

document.addEventListener(
    "DOMContentLoaded",
    () => {

        renderizarCatalogo();

    }
);