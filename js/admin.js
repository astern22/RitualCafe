// ======================================================
// RITUAL CAFÉ
// Panel administrativo
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


// ---------- INVENTARIO GLOBAL ----------

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


// ---------- MENSAJE ----------

function mostrarMensaje(texto) {

    const mensaje =
        document.getElementById("mensaje-admin");

    mensaje.textContent = texto;
}


// ---------- FORMULARIO ----------

function inicializarFormularioAdmin() {

    const formulario =
        document.getElementById(
            "form-nuevo-producto"
        );


    formulario.addEventListener(
        "submit",
        (evento) => {

            evento.preventDefault();


            // ------------------------------------------
            // 1. OBTENER INPUTS
            // ------------------------------------------

            const campoNombre =
                document.getElementById(
                    "nombre-producto"
                );

            const campoPrecio =
                document.getElementById(
                    "precio-producto"
                );

            const campoStock =
                document.getElementById(
                    "stock-producto"
                );

            const campoImagen =
                document.getElementById(
                    "imagen-producto"
                );


            // ------------------------------------------
            // 2. OBTENER VALORES
            // ------------------------------------------

            const nombre =
                campoNombre.value.trim();


            // .value devuelve String.
            // Convertimos explícitamente a Number.

            const precio =
                Number(campoPrecio.value);

            const stock =
                Number(campoStock.value);


            const archivo =
                campoImagen.files[0];


            // ------------------------------------------
            // 3. VALIDACIÓN
            // ------------------------------------------

            if (
                !nombre ||
                Number.isNaN(precio) ||
                Number.isNaN(stock) ||
                precio < 0 ||
                stock < 0
            ) {

                mostrarMensaje(
                    "Revisa los datos antes de registrar el lote."
                );

                return;
            }


            // ------------------------------------------
            // 4. CREAR PRODUCTO
            // ------------------------------------------

            const agregarAlInventario =
                (imagenFinal) => {


                    // Objeto literal.

                    // Tiene EXACTAMENTE las mismas
                    // propiedades que los productos
                    // originales.

                    const nuevoProducto = {

                        id: inventario.length + 1,

                        nombre: nombre,

                        precio: precio,

                        stock: stock,

                        imagen: imagenFinal

                    };


                    // ----------------------------------
                    // 5. INYECTAR AL ARREGLO
                    // ----------------------------------

                    inventario.push(
                        nuevoProducto
                    );


                    // ----------------------------------
                    // 6. LIMPIAR Y REDIBUJAR
                    // ----------------------------------

                    // En esta versión administrativa
                    // mostramos inmediatamente el
                    // producto recién creado.

                    mostrarMensaje(
                        `"${nuevoProducto.nombre}" fue registrado correctamente.`
                    );


                    formulario.reset();


                    // ----------------------------------
                    // 7. MOSTRAR CONFIRMACIÓN
                    // ----------------------------------

                    const numero =
                        document.querySelector(
                            ".panel-titulo > span"
                        );

                    numero.textContent =
                        String(nuevoProducto.id)
                            .padStart(2, "0");


                    console.log(
                        "Inventario actualizado:",
                        inventario
                    );


                    console.log(
                        "Nuevo producto:",
                        nuevoProducto
                    );

                };


            // ------------------------------------------
            // 8. IMAGEN
            // ------------------------------------------

            if (archivo) {

                const lector =
                    new FileReader();


                lector.onload =
                    (eventoLectura) => {

                        agregarAlInventario(
                            eventoLectura.target.result
                        );

                    };


                lector.onerror =
                    () => {

                        const color =
                            PALETA_TUESTES[
                                inventario.length %
                                PALETA_TUESTES.length
                            ];


                        agregarAlInventario(
                            crearImagenPlaceholder(
                                "#d8ccb6",
                                color
                            )
                        );

                    };


                lector.readAsDataURL(
                    archivo
                );

            } else {

                const color =
                    PALETA_TUESTES[
                        inventario.length %
                        PALETA_TUESTES.length
                    ];


                agregarAlInventario(
                    crearImagenPlaceholder(
                        "#d8ccb6",
                        color
                    )
                );

            }

        }
    );
}


// ---------- INICIALIZACIÓN ----------

document.addEventListener(
    "DOMContentLoaded",
    () => {

        inicializarFormularioAdmin();

    }
);