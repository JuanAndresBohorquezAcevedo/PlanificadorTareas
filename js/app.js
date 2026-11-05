function validFormFieldInput(data) {
    const name = data.name;
    const description = data.description;
    const dueDate = data.dueDate;
    const priority = data.priority;
    const category = data.category;

    console.log("name: " + name);
    console.log("description: " + description);
    console.log("dueDate: " + dueDate);
    console.log("priority: " + priority);
    console.log("category: " + category);

    let isValid = true;

    if (!name || name.trim() === "") {
        tituloTareaInput.classList.add("is-invalid");
        isValid = false;
    } else {
        tituloTareaInput.classList.remove("is-invalid");
    }

    if (!description || description.trim() === "") {
        descripcionTareaInput.classList.add("is-invalid");
        isValid = false;
    } else {
        descripcionTareaInput.classList.remove("is-invalid");
    }

    if (!dueDate || dueDate.trim() === "") {
        fechaLimiteInput.classList.add("is-invalid");
        isValid = false;
    } else {
        fechaLimiteInput.classList.remove("is-invalid");
    }

    if (!priority || priority.trim() === "") {
        prioridadTareaSelect.classList.add("is-invalid");
        isValid = false;
    } else {
        prioridadTareaSelect.classList.remove("is-invalid");
    }

    if (!category || category.trim() === "") {
        categoriaTareaInput.classList.add("is-invalid");
        isValid = false;
    } else {
        categoriaTareaInput.classList.remove("is-invalid");
    }

    return isValid;
}

// Elementos del DOM
const formNuevaTarea = document.querySelector("#formNuevaTarea");
const alertaError = document.querySelector("#alertaError");
const mensajeError = document.querySelector("#mensajeError");
const alertaExito = document.querySelector("#alertaExito");
const mensajeExito = document.querySelector("#mensajeExito");
const listaTareas = document.querySelector("#listaTareas");

const tituloTareaInput = document.querySelector("#tituloTarea");
const descripcionTareaInput = document.querySelector("#descripcionTarea");
const fechaLimiteInput = document.querySelector("#fechaLimite");
const prioridadTareaSelect = document.querySelector("#prioridadTarea");
const categoriaTareaInput = document.querySelector("#categoriaTarea");

const modalConfirmarEliminarEl = document.querySelector("#modalConfirmarEliminar");
const btnConfirmarEliminar = document.querySelector("#btnConfirmarEliminar");
const textoConfirmarEliminar = document.querySelector("#textoConfirmarEliminar");
const toastExitoEl = document.querySelector("#toastExito");
const toastExitoMensaje = document.querySelector("#toastExitoMensaje");

let tarjetaAEliminar = null;
let nombreTareaAEliminar = "";
let contadorTareas = 100;

function formatearFecha(fechaISO) {
    if (!fechaISO) return "Sin fecha";

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const fecha = new Date(fechaISO + "T00:00:00");
    const diffDias = Math.round((fecha - hoy) / (1000 * 60 * 60 * 24));

    if (diffDias === 0) return "Hoy";
    if (diffDias === 1) return "Mañana";
    if (diffDias === -1) return "Ayer";

    return fecha.toLocaleDateString("es-ES", { day: "numeric", month: "short" });
}

function capitalizar(texto) {
    if (!texto) return "";
    return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
}

function mostrarToastExito(mensaje) {
    if (!toastExitoEl || !toastExitoMensaje) return;
    toastExitoMensaje.textContent = mensaje;
    const toast = bootstrap.Toast.getOrCreateInstance(toastExitoEl, { delay: 2500 });
    toast.show();
}

function pedirConfirmacionEliminar(tarjeta) {
    const tituloEl = tarjeta.querySelector(".fw-medium");
    nombreTareaAEliminar = tituloEl ? tituloEl.textContent.trim() : "esta tarea";
    textoConfirmarEliminar.textContent =
        '¿Estás seguro de que deseas eliminar la tarea "' + nombreTareaAEliminar + '"?';
    tarjetaAEliminar = tarjeta;

    const modal = bootstrap.Modal.getOrCreateInstance(modalConfirmarEliminarEl);
    modal.show();
}

// Botón eliminar
listaTareas.addEventListener("click", function (event) {
    const btn = event.target.closest(".btn-eliminar");
    if (!btn) return;

    event.preventDefault();
    event.stopPropagation();

    const tarjeta = btn.closest("[data-task-card], .border.rounded-2");
    if (tarjeta) {
        pedirConfirmacionEliminar(tarjeta);
    }
});

// Confirmar eliminación
btnConfirmarEliminar.addEventListener("click", function () {
    if (!tarjetaAEliminar) return;

    tarjetaAEliminar.remove();

    const modal = bootstrap.Modal.getInstance(modalConfirmarEliminarEl);
    if (modal) modal.hide();

    mostrarToastExito('Tarea "' + nombreTareaAEliminar + '" eliminada correctamente.');

    tarjetaAEliminar = null;
    nombreTareaAEliminar = "";
});

function crearTarea(data) {
    contadorTareas += 1;
    const idTarea = "desc-tarea-" + contadorTareas;

    const fechaTexto = formatearFecha(data.dueDate);
    const prioridadTexto = capitalizar(data.priority);
    const categoriaTexto = capitalizar(data.category);

    const tarjeta = document.createElement("div");
    tarjeta.className = "border rounded-2 bg-success-subtle bg-opacity-25 overflow-hidden";
    tarjeta.setAttribute("data-task-card", "true");
    tarjeta.setAttribute("data-status", data.status);
    tarjeta.setAttribute("data-priority", data.priority);
    tarjeta.setAttribute("data-category", data.category.toLowerCase());
    tarjeta.setAttribute("data-fecha", data.dueDate);

    tarjeta.innerHTML =
        '<div class="d-flex align-items-center gap-3 p-3 pb-2">' +
            '<input class="form-check-input flex-shrink-0" type="checkbox" />' +
            '<div class="fw-medium text-break flex-grow-1">' + data.name + '</div>' +
            '<div class="d-flex align-items-center gap-1 flex-shrink-0">' +
                '<button class="btn btn-sm btn-task-action" type="button" title="Editar"><i class="bi bi-pencil"></i></button>' +
                '<button class="btn btn-sm btn-task-action btn-eliminar" type="button" title="Eliminar"><i class="bi bi-trash"></i></button>' +
                '<button class="btn btn-sm btn-task-action" type="button" data-bs-toggle="collapse" ' +
                    'data-bs-target="#' + idTarea + '" aria-expanded="false" aria-controls="' + idTarea + '">' +
                    '<i class="bi bi-chevron-down"></i>' +
                '</button>' +
            '</div>' +
        '</div>' +
        '<div class="d-flex align-items-center gap-1 flex-wrap px-3 pb-3">' +
            '<span class="badge rounded-pill border px-2 py-1 etiqueta-atributo">' + fechaTexto + '</span>' +
            '<span class="badge rounded-pill border px-2 py-1 etiqueta-atributo">' + categoriaTexto + '</span>' +
            '<span class="badge rounded-pill border px-2 py-1 etiqueta-atributo">' + prioridadTexto + '</span>' +
        '</div>' +
        '<div class="collapse" id="' + idTarea + '">' +
            '<div class="px-3 pb-3">' +
                '<div class="border-top pt-2 text-muted small">' + data.description + '</div>' +
            '</div>' +
        '</div>';

    listaTareas.append(tarjeta);
}

function limpiarErrorAlEscribir(input) {
    input.addEventListener("input", function () {
        if (input.value.trim() !== "") {
            input.classList.remove("is-invalid");
        }
    });
    input.addEventListener("change", function () {
        if (input.value.trim() !== "") {
            input.classList.remove("is-invalid");
        }
    });
}

limpiarErrorAlEscribir(tituloTareaInput);
limpiarErrorAlEscribir(descripcionTareaInput);
limpiarErrorAlEscribir(fechaLimiteInput);
limpiarErrorAlEscribir(prioridadTareaSelect);
limpiarErrorAlEscribir(categoriaTareaInput);

formNuevaTarea.addEventListener("submit", function (event) {
    event.preventDefault();

    alertaExito.classList.add("d-none");

    const name = tituloTareaInput.value;
    const description = descripcionTareaInput.value;
    const dueDate = fechaLimiteInput.value;
    const priority = prioridadTareaSelect.value;
    const category = categoriaTareaInput.value;

    const formData = {
        name: name,
        description: description,
        dueDate: dueDate,
        priority: priority,
        category: category,
        status: "pendiente"
    };

    const isValid = validFormFieldInput(formData);

    if (!isValid) {
        mensajeError.textContent = "Por favor completa los campos marcados en rojo.";
        alertaError.classList.remove("d-none");
        return;
    }

    alertaError.classList.add("d-none");
    tituloTareaInput.classList.remove("is-invalid");
    descripcionTareaInput.classList.remove("is-invalid");
    fechaLimiteInput.classList.remove("is-invalid");
    prioridadTareaSelect.classList.remove("is-invalid");
    categoriaTareaInput.classList.remove("is-invalid");

    crearTarea(formData);

    mensajeExito.textContent = '¡Tarea "' + name + '" creada correctamente!';
    alertaExito.classList.remove("d-none");

    console.log("Tarea creada:", formData);

    formNuevaTarea.reset();

    setTimeout(function () {
        alertaExito.classList.add("d-none");
        const modalElement = document.querySelector("#modalNuevaTarea");
        const modal = bootstrap.Modal.getInstance(modalElement);
        if (modal) {
            modal.hide();
        }
    }, 1200);
});