const taskManager = new TaskManager();
console.log("TaskManager inicial:", taskManager.tasks);

taskManager.render();

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

let taskIdAEliminar = null;
let nombreTareaAEliminar = "";

function mostrarToastExito(mensaje) {
    if (!toastExitoEl || !toastExitoMensaje) return;
    toastExitoMensaje.textContent = mensaje;
    const toast = bootstrap.Toast.getOrCreateInstance(toastExitoEl, { delay: 2500 });
    toast.show();
}

function pedirConfirmacionEliminar(taskId, nombreTarea) {
    taskIdAEliminar = taskId;
    nombreTareaAEliminar = nombreTarea || "esta tarea";
    textoConfirmarEliminar.textContent =
        '¿Estás seguro de que deseas eliminar la tarea "' + nombreTareaAEliminar + '"?';

    const modal = bootstrap.Modal.getOrCreateInstance(modalConfirmarEliminarEl);
    modal.show();
}

listaTareas.addEventListener("click", function (event) {
    const btnEliminar = event.target.closest(".delete-button, .btn-eliminar");
    if (btnEliminar) {
        event.preventDefault();
        event.stopPropagation();

        const tarjeta = btnEliminar.closest("[data-task-id]");
        if (!tarjeta) return;

        const taskId = Number(tarjeta.dataset.taskId);
        const tituloEl = tarjeta.querySelector(".fw-medium");
        const nombre = tituloEl ? tituloEl.textContent.trim() : "esta tarea";

        pedirConfirmacionEliminar(taskId, nombre);
        return;
    }

    const btnDone = event.target.closest(".done-button");
    if (btnDone) {
        event.preventDefault();
        event.stopPropagation();

        const parentTask = btnDone.closest("[data-task-id]");
        if (!parentTask) return;

        const taskId = Number(parentTask.dataset.taskId);

        const task = taskManager.getTaskById(taskId);
        if (!task) return;

        task.status = "DONE";

        taskManager.save();
        taskManager.render();

        mostrarToastExito('Tarea "' + task.name + '" marcada como hecha.');
        return;
    }
});

btnConfirmarEliminar.addEventListener("click", function () {
    if (taskIdAEliminar === null) return;

    taskManager.deleteTask(taskIdAEliminar);

    taskManager.save();

    taskManager.render();

    const modal = bootstrap.Modal.getInstance(modalConfirmarEliminarEl);
    if (modal) modal.hide();

    mostrarToastExito('Tarea "' + nombreTareaAEliminar + '" eliminada correctamente.');

    taskIdAEliminar = null;
    nombreTareaAEliminar = "";
});

listaTareas.addEventListener("change", function (event) {
    const checkbox = event.target.closest('input[type="checkbox"].form-check-input');
    if (!checkbox) return;

    const tarjeta = checkbox.closest("[data-task-id]");
    if (!tarjeta) return;

    const taskId = Number(tarjeta.dataset.taskId);
    const nuevoStatus = checkbox.checked ? "completada" : "pendiente";

    taskManager.updateTaskStatus(taskId, nuevoStatus);
    taskManager.save();
    taskManager.render();
});

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

    const name = tituloTareaInput.value.trim();
    const description = descripcionTareaInput.value.trim();
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

    taskManager.addTask(name, description, dueDate, "pendiente", priority, category);

    taskManager.save();

    taskManager.render();

    console.log("Tareas en TaskManager:", taskManager.tasks);

    mostrarToastExito('¡Tarea "' + name + '" creada correctamente!');

    formNuevaTarea.reset();
    alertaError.classList.add("d-none");
    alertaExito.classList.add("d-none");
    tituloTareaInput.classList.remove("is-invalid");
    descripcionTareaInput.classList.remove("is-invalid");
    fechaLimiteInput.classList.remove("is-invalid");
    prioridadTareaSelect.classList.remove("is-invalid");
    categoriaTareaInput.classList.remove("is-invalid");

    tituloTareaInput.focus();
});