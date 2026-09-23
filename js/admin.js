// ======================================================
// RITUAL CAFÉ
// Panel administrativo
// ======================================================


// ---------- CONFIGURACIÓN ----------

const CLAVE_INVENTARIO = "ritualCafeInventario";


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


// ======================================================
// INVENTARIO INICIAL
// ======================================================

const inventarioInicial = [

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


// ======================================================
// CARGAR INVENTARIO
// ======================================================

function cargarInventario() {

    const inventarioGuardado =
        localStorage.getItem(
            CLAVE_INVENTARIO
        );


    if (inventarioGuardado) {

        try {

            return JSON.parse(
                inventarioGuardado
            );

        } catch (error) {

            console.error(
                "No se pudo leer el inventario guardado.",
                error
            );

            return [...inventarioInicial];
        }
    }


    return [...inventarioInicial];
}


// ---------- INVENTARIO GLOBAL ----------

let inventario = cargarInventario();


// ======================================================
// GUARDAR INVENTARIO
// ======================================================

function guardarInventario() {

    localStorage.setItem(
        CLAVE_INVENTARIO,
        JSON.stringify(inventario)
    );

}


// ======================================================
// MOSTRAR MENSAJE
// ======================================================

function mostrarMensaje(texto) {

    const mensaje =
        document.getElementById(
            "mensaje-admin"
        );

    mensaje.textContent = texto;

}


// ======================================================
// ACTUALIZAR NÚMERO DEL PANEL
// ======================================================

function actualizarNumeroPanel() {

    const numero =
        document.querySelector(
            ".panel-titulo > span"
        );


    numero.textContent =
        String(inventario.length)
            .padStart(2, "0");

}


// ======================================================
// FORMULARIO
// ======================================================

function inicializarFormularioAdmin() {

    const formulario =
        document.getElementById(
            "form-nuevo-producto"
        );


    formulario.addEventListener(
        "submit",
        (evento) => {

            evento.preventDefault();


            // ==========================================
            // 1. OBTENER INPUTS
            // ==========================================

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


            // ==========================================
            // 2. OBTENER LOS VALORES
            // ==========================================

            const nombre =
                campoNombre.value.trim();

            const precio =
                Number(
                    campoPrecio.value
                );


            const stock =
                Number(
                    campoStock.value
                );


            const archivo =
                campoImagen.files[0];


            // ==========================================
            // 3. VALIDACIÓN
            // ==========================================

            if (
                !nombre ||
                Number.isNaN(precio) ||
                Number.isNaN(stock) ||
                precio < 0 ||
                stock < 0
            ) {

                mostrarMensaje(
                    "Revisa el nombre, precio y stock antes de continuar."
                );

                return;
            }


            // ==========================================
            // 4. CREAR PRODUCTO
            // ==========================================

            const agregarAlInventario =
                (imagenFinal) => {

                    const nuevoProducto = {

                        id: inventario.length + 1,

                        nombre: nombre,

                        precio: precio,

                        stock: stock,

                        imagen: imagenFinal

                    };


                    // ==================================
                    // 5. INSERTAR EN EL ARREGLO
                    // ==================================

                    inventario.push(
                        nuevoProducto
                    );


                    // ==================================
                    // 6. GUARDAR EN LOCALSTORAGE
                    // ==================================

                    guardarInventario();


                    // ==================================
                    // 7. MENSAJE
                    // ==================================

                    mostrarMensaje(
                        `"${nuevoProducto.nombre}" fue agregado al inventario.`
                    );


                    // ==================================
                    // 8. LIMPIAR FORMULARIO
                    // ==================================

                    formulario.reset();


                    // ==================================
                    // 9. ACTUALIZAR INTERFAZ
                    // ==================================

                    actualizarNumeroPanel();


                    // ==================================
                    // 10. MOSTRAR EN CONSOLA
                    // ==================================

                    console.log(
                        "Nuevo producto:",
                        nuevoProducto
                    );


                    console.log(
                        "Inventario actualizado:",
                        inventario
                    );


                    console.log(
                        "Inventario guardado en localStorage:",
                        localStorage.getItem(
                            CLAVE_INVENTARIO
                        )
                    );

                };


            // ==========================================
            // 11. PROCESAR IMAGEN
            // ==========================================

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


// ======================================================
// INICIALIZACIÓN
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        actualizarNumeroPanel();

        inicializarFormularioAdmin();

    }
);