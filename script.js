
// BIENVENIDA
console.log('Bienvenido a Broasteria, Chifa, "CHARDING"');

// NÚMERO DE WHATSAPP DEL NEGOCIO
const numeroWhatsApp = "51976240888";

// FUNCIÓN PARA ABRIR WHATSAPP
function abrirWhatsApp() {
    const mensaje = '¡Hola! Bienvenido a Broasteria, Chifa, "CHARDING".';
    const enlace = "https://wa.me/" + numeroWhatsApp +
        "?text=" + encodeURIComponent(mensaje);

    window.open(enlace, "_blank");
}

// BOTÓN DE CONTACTO
const botonWhatsApp = document.getElementById("whatsapp");

if (botonWhatsApp) {
    botonWhatsApp.addEventListener("click", function(event) {
        event.preventDefault();
        abrirWhatsApp();
    });
}

// BOTÓN FLOTANTE DE WHATSAPP
const botonFlotante = document.getElementById("whatsapp-flotante");

if (botonFlotante) {
    botonFlotante.addEventListener("click", function(event) {
        event.preventDefault();
        abrirWhatsApp();
    });
}

// CARRITO DE COMPRAS
let carrito = [];

const botonCarrito = document.getElementById("boton-carrito");
const ventanaCarrito = document.getElementById("ventana-carrito");
const cerrarCarrito = document.getElementById("cerrar-carrito");
const listaCarrito = document.getElementById("lista-carrito");
const totalCarrito = document.getElementById("total-carrito");
const contadorCarrito = document.getElementById("contador-carrito");

// ABRIR CARRITO
if (botonCarrito && ventanaCarrito) {
    botonCarrito.addEventListener("click", function() {
        ventanaCarrito.style.display = "flex";
    });
}

// CERRAR CARRITO
if (cerrarCarrito && ventanaCarrito) {
    cerrarCarrito.addEventListener("click", function() {
        ventanaCarrito.style.display = "none";
    });

    ventanaCarrito.addEventListener("click", function(event) {
        if (event.target === ventanaCarrito) {
            ventanaCarrito.style.display = "none";
        }
    });
}


// AGREGAR PRODUCTOS
document.querySelectorAll(".agregar-carrito").forEach(function(boton) {

    boton.addEventListener("click", function() {

        const producto = boton.closest(".producto");
        let nombre = boton.dataset.nombre;
        const selectorPrecio = producto.querySelector(".precio-producto");

        const precio = selectorPrecio
            ? Number(selectorPrecio.value)
            : Number(boton.dataset.precio);

        const campoCantidad = producto.querySelector(".cantidad-producto");
        const cantidad = Number(campoCantidad.value);

        // OBTENER SABOR SI EL PRODUCTO LO TIENE
        const selectorSabor = producto.querySelector(".sabor-producto");

        if (selectorSabor) {
            nombre += " - " + selectorSabor.value;
        }

        if (!nombre || !Number.isFinite(precio) || precio <= 0 ||
            !Number.isInteger(cantidad) || cantidad < 1) {
            alert("Revisa el precio y la cantidad del producto.");
            return;
        }

        const existente = carrito.find(function(item) {
            return item.nombre === nombre && item.precio === precio;
        });

        if (existente) {
            existente.cantidad += cantidad;
        } else {
            carrito.push({
                nombre: nombre,
                precio: precio,
                cantidad: cantidad
            });
        }

        actualizarCarrito();
        mostrarNotificacion("✓ ¡Producto agregado al carrito!");

    });

});

// ACTUALIZAR CARRITO
function actualizarCarrito() {

    if (!listaCarrito || !totalCarrito || !contadorCarrito) return;

    listaCarrito.innerHTML = "";

    let total = 0;
    let cantidadTotal = 0;

    carrito.forEach(function(item, indice) {

        const subtotal = item.precio * item.cantidad;
        total += subtotal;
        cantidadTotal += item.cantidad;

        const elemento = document.createElement("div");
        elemento.className = "producto-carrito";

        elemento.innerHTML = `
    <div class="producto-info">
        <h4>${item.nombre}</h4>

        <p>Precio unitario: <strong>S/ ${item.precio.toFixed(2)}</strong></p>
        <div class="control-cantidad">
    <span>Cantidad:</span>

    <div class="botones-cantidad">
        <button class="disminuir-cantidad" data-indice="${indice}">−</button>

        <strong>${item.cantidad}</strong>

        <button class="aumentar-cantidad" data-indice="${indice}">+</button>
    </div>
</div>

        <div class="subtotal-producto">
            <span>Subtotal</span>
            <strong>S/ ${subtotal.toFixed(2)}</strong>
        </div>

        <button class="eliminar-producto" data-indice="${indice}">
            🗑 Quitar
        </button>
    </div>
`;

        listaCarrito.appendChild(elemento);
    });

    if (carrito.length === 0) {
        listaCarrito.innerHTML = "<p>Tu carrito está vacío.</p>";
    }

    // CALCULAR DELIVERY
    const entregaSeleccionada = document.querySelector(
        'input[name="entrega"]:checked'
    );

    const costoEnvio = carrito.length > 0 &&
        entregaSeleccionada &&
        entregaSeleccionada.value === "delivery" ? 3 : 0;

    total += costoEnvio;

    // MOSTRAR COSTO DE DELIVERY
    const textoDelivery = document.getElementById("costo-delivery");

    if (textoDelivery) {
        textoDelivery.textContent =
            "Costo de delivery: S/ " + costoEnvio.toFixed(2);
    }

    // MOSTRAR TOTAL Y CANTIDAD
    totalCarrito.textContent = total.toFixed(2);
    contadorCarrito.textContent = cantidadTotal;

    // CONTROLAR CANTIDAD DE PRODUCTOS
document.querySelectorAll(".aumentar-cantidad").forEach(function(boton) {
    boton.addEventListener("click", function() {
        const indice = Number(boton.dataset.indice);
        carrito[indice].cantidad++;
        actualizarCarrito();
    });
});

document.querySelectorAll(".disminuir-cantidad").forEach(function(boton) {
    boton.addEventListener("click", function() {
        const indice = Number(boton.dataset.indice);

        if (carrito[indice].cantidad > 1) {
            carrito[indice].cantidad--;
        }

        actualizarCarrito();
    });
});

// ELIMINAR PRODUCTOS
document.querySelectorAll(".eliminar-producto").forEach(function(boton) {
    boton.addEventListener("click", function() {
        const indice = Number(boton.dataset.indice);
        carrito.splice(indice, 1);
        actualizarCarrito();
    });
});
}
// ACTUALIZAR TOTAL AL CAMBIAR EL TIPO DE ENTREGA
document.querySelectorAll('input[name="entrega"]').forEach(function(opcion) {
    opcion.addEventListener("change", actualizarCarrito);
});

// VACIAR CARRITO
const botonVaciar = document.getElementById("vaciar-carrito");

if (botonVaciar) {
    botonVaciar.addEventListener("click", function() {
        carrito = [];
        actualizarCarrito();
    });
}



 
// FINALIZAR PEDIDO POR WHATSAPP
const botonFinalizar = document.getElementById("finalizar-pedido");

if (botonFinalizar) {
    botonFinalizar.addEventListener("click", function(event) {
        event.preventDefault();
        event.stopImmediatePropagation();

        if (carrito.length === 0) {
            alert("Primero agrega productos a tu carrito.");
            return;
        }

        // DATOS DEL CLIENTE
        const campoNombre = document.getElementById("nombre-cliente");
        const campoDireccion = document.getElementById("direccion-cliente");
        const campoTelefono = document.getElementById("telefono-cliente");
        const campoCorreo = document.getElementById("correo-cliente");

        const nombreCliente = campoNombre ? campoNombre.value.trim() : "";
        const direccionCliente = campoDireccion ? campoDireccion.value.trim() : "";
        const telefonoCliente = campoTelefono ? campoTelefono.value.trim() : "";
        const correoCliente = campoCorreo ? campoCorreo.value.trim() : "";

        if (nombreCliente === "") {
            alert("Por favor, completa tus datos de cliente.");
            return;
        }

        // TIPO DE ENTREGA
        const entregaSeleccionada = document.querySelector(
            'input[name="entrega"]:checked'
        );

        const esDelivery = entregaSeleccionada &&
            entregaSeleccionada.value === "delivery";

        if (esDelivery && direccionCliente === "") {
            alert("Por favor, escribe tu dirección de entrega.");
            return;
        }

        // MÉTODO DE PAGO
        const pagoSeleccionado = document.querySelector(
            'input[name="metodo-pago"]:checked'
        );

        if (!pagoSeleccionado) {
            alert("Por favor, selecciona un método de pago.");
            return;
        }

        const metodoPago = pagoSeleccionado.value;

        // PREPARAR MENSAJE
        let mensaje = '¡Hola! Quisiera realizar un pedido en Broasteria, Chifa, "CHARDING":\n\n';

        mensaje += "CLIENTE: " + nombreCliente + "\n";

        if (telefonoCliente !== "") {
            mensaje += "TELÉFONO: " + telefonoCliente + "\n";
        }

        // CORREO OPCIONAL
        if (correoCliente !== "") {
            mensaje += "CORREO: " + correoCliente + "\n";
        }

        if (esDelivery) {
            mensaje += "DIRECCIÓN: " + direccionCliente + "\n";
        }

        mensaje += "\nPRODUCTOS:\n";

        let total = 0;

        carrito.forEach(function(item) {
            const subtotal = item.precio * item.cantidad;
            total += subtotal;

            mensaje += item.nombre + " x " + item.cantidad +
                " = S/ " + subtotal.toFixed(2) + "\n";
        });

        // COSTO DE ENTREGA
        const costoEnvio = esDelivery ? 3 : 0;

        mensaje += "\nTIPO DE ENTREGA: " +
            (esDelivery ? "Delivery" : "Recojo en el local");

        mensaje += "\nCosto de delivery: S/ " +
            costoEnvio.toFixed(2);

        total += costoEnvio;

        mensaje += "\n\nTOTAL A PAGAR: S/ " + total.toFixed(2);
        mensaje += "\nMÉTODO DE PAGO: " + metodoPago;

        // CONFIRMAR PEDIDO
        const confirmar = confirm(
            "RESUMEN DE TU PEDIDO\n\n" +
            "Cliente: " + nombreCliente + "\n" +
            "Teléfono: " + (telefonoCliente || "No proporcionado") + "\n" +
            "Correo: " + (correoCliente || "No proporcionado") + "\n" +
            "Productos: " + carrito.length + " tipos\n" +
            "Entrega: " + (esDelivery ? "Delivery" : "Recojo en el local") + "\n" +
            "Total: S/ " + total.toFixed(2) + "\n" +
            "Método de pago: " + metodoPago + "\n\n" +
            "¿Deseas continuar y enviar tu pedido por WhatsApp?"
        );

        if (!confirmar) {
            return;
        }

        // ABRIR WHATSAPP
        window.open(
            "https://wa.me/" + numeroWhatsApp +
            "?text=" + encodeURIComponent(mensaje),
            "_blank"
        );
    });
}

// MOSTRAR INFORMACIÓN SEGÚN EL MÉTODO DE PAGO
const opcionesPago = document.querySelectorAll(
    'input[name="metodo-pago"]'
);

const informacionYape = document.getElementById("informacion-yape");
const informacionEfectivo = document.getElementById("informacion-efectivo");

function actualizarInformacionPago() {
    const pago = document.querySelector(
        'input[name="metodo-pago"]:checked'
    );

    informacionYape.style.display =
        pago && pago.value === "Yape" ? "block" : "none";

    informacionEfectivo.style.display =
        pago && pago.value === "Efectivo" ? "block" : "none";
}

opcionesPago.forEach(function(opcion) {
    opcion.addEventListener("change", actualizarInformacionPago);
});

actualizarInformacionPago();
// COPIAR NÚMERO DE YAPE
const botonCopiarYape = document.getElementById("copiar-yape");

if (botonCopiarYape) {
    botonCopiarYape.addEventListener("click", async function() {
        try {
            await navigator.clipboard.writeText("976240888");

            botonCopiarYape.textContent = "✓ Número copiado";

            setTimeout(() => {
                botonCopiarYape.textContent = "📋 Copiar número de Yape";
            }, 2000);

        } catch (error) {
            alert("No se pudo copiar el número. Inténtalo nuevamente.");
        }
    });
}
actualizarCarrito();

console.log("Carrito y WhatsApp configurados correctamente.");
// REGISTRAR LA APLICACIÓN COMO PWA
if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("./service-worker.js")
            .then(() => {
                console.log("Aplicación Charding preparada para instalarse.");
            })
            .catch(error => {
                console.error("Error al registrar la aplicación:", error);
            });
    });
}

// MOSTRAR NOTIFICACIÓN DE PRODUCTO AGREGADO
function mostrarNotificacion(mensaje) {
    let notificacion = document.getElementById("notificacion-carrito");

    if (!notificacion) {
        notificacion = document.createElement("div");
        notificacion.id = "notificacion-carrito";
        document.body.appendChild(notificacion);
    }

    notificacion.textContent = mensaje;
    notificacion.classList.add("mostrar");

    clearTimeout(window.tiempoNotificacion);

    window.tiempoNotificacion = setTimeout(function() {
        notificacion.classList.remove("mostrar");
    }, 2000);
}
