class TaskManager {
    constructor(currentId = 0) {
        this.tasks = [];
        this.currentId = currentId;
        this.load();
    }

    addTask(name, description, dueDate, status = "pendiente", priority = "media", category = "personal") {
        this.currentId++;

        this.tasks.push({
            id: this.currentId,
            name: name,
            description: description,
            dueDate: dueDate,
            status: status,
            priority: priority,
            category: category
        });
    }

    deleteTask(taskId) {
        const newTasks = [];

        for (let task of this.tasks) {
            if (task.id !== taskId) {
                newTasks.push(task);
            }
        }

        this.tasks = newTasks;
    }

    updateTaskStatus(taskId, status) {
        for (let task of this.tasks) {
            if (task.id === taskId) {
                task.status = status;
                break;
            }
        }
    }

    save() {
        const data = {
            tasks: this.tasks,
            currentId: this.currentId
        };
        localStorage.setItem("tasks", JSON.stringify(data));
    }

    load() {
        const stored = localStorage.getItem("tasks");
        if (stored) {
            try {
                const data = JSON.parse(stored);
                this.tasks = data.tasks || [];
                this.currentId = data.currentId || 0;
            } catch (e) {
                console.error("Error al cargar tareas desde localStorage:", e);
                this.tasks = [];
                this.currentId = 0;
            }
        }
    }

    createTaskHtml(task) {
        const fechaTexto = this.formatearFecha(task.dueDate);
        const prioridadTexto = this.capitalizar(task.priority);
        const categoriaTexto = this.capitalizar(task.category);
        const isCompletada = task.status === "completada";
        const checkedAttr = isCompletada ? "checked" : "";
        const completedClass = isCompletada ? "tarea-completada" : "";
        const titleClass = isCompletada ? "text-decoration-line-through text-muted" : "";

        return `
            <div class="border rounded-2 bg-success-subtle bg-opacity-25 overflow-hidden ${completedClass}"
                 data-task-card="true"
                 data-task-id="${task.id}"
                 data-status="${task.status || "pendiente"}"
                 data-priority="${task.priority}"
                 data-category="${(task.category || "").toLowerCase()}"
                 data-fecha="${task.dueDate}">
                <div class="d-flex align-items-center gap-3 p-3 pb-2">
                    <input class="form-check-input flex-shrink-0" type="checkbox" title="Marcar como completada" ${checkedAttr} />
                    <div class="fw-medium text-break flex-grow-1 ${titleClass}">${this.escapeHtml(task.name)}</div>
                    <div class="d-flex align-items-center gap-1 flex-shrink-0">
                        <button class="btn btn-sm btn-task-action" type="button" title="Editar">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-sm btn-task-action btn-eliminar delete-button" type="button" title="Eliminar">
                            <i class="bi bi-trash"></i>
                        </button>
                        <button class="btn btn-sm btn-task-action" type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#desc-tarea-${task.id}"
                                aria-expanded="false"
                                aria-controls="desc-tarea-${task.id}">
                            <i class="bi bi-chevron-down"></i>
                        </button>
                    </div>
                </div>
                <div class="d-flex align-items-center gap-1 flex-wrap px-3 pb-3">
                    <span class="badge rounded-pill border px-2 py-1 etiqueta-atributo">${fechaTexto}</span>
                    <span class="badge rounded-pill border px-2 py-1 etiqueta-atributo">${categoriaTexto}</span>
                    <span class="badge rounded-pill border px-2 py-1 etiqueta-atributo">${prioridadTexto}</span>
                </div>
                <div class="collapse" id="desc-tarea-${task.id}">
                    <div class="px-3 pb-3">
                        <div class="border-top pt-2 text-muted small">${this.escapeHtml(task.description)}</div>
                    </div>
                </div>
            </div>
        `;
    }

    render() {
        const listaTareas = document.querySelector("#listaTareas");
        if (!listaTareas) return;

        listaTareas.innerHTML = "";

        if (this.tasks.length === 0) {
            listaTareas.innerHTML = `
                <div class="text-center text-muted py-5">
                    <i class="bi bi-inbox fs-1 d-block mb-2"></i>
                    <p class="mb-0">No hay tareas. ¡Crea una nueva!</p>
                </div>
            `;
            return;
        }

        const sorted = [...this.tasks].sort((a, b) => {
            if (a.dueDate !== b.dueDate) {
                return (a.dueDate || "").localeCompare(b.dueDate || "");
            }
            return a.id - b.id;
        });

        for (const task of sorted) {
            listaTareas.insertAdjacentHTML("beforeend", this.createTaskHtml(task));
        }
    }

    formatearFecha(fechaISO) {
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

    capitalizar(texto) {
        if (!texto) return "";
        return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
    }

    escapeHtml(text) {
        if (!text) return "";
        const div = document.createElement("div");
        div.textContent = text;
        return div.innerHTML;
    }
}