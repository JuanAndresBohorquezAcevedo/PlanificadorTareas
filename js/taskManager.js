class TaskManager {
    constructor(currentId = 0) {
        this.tasks = [];
        this.currentId = currentId;
    }

    addTask(name, description, dueDate, status, priority, category) {
    this.currentId++;

    this.tasks.push({
        id: this.currentId,
        name: name,
        description: description,
        dueDate: dueDate,
        status: "PORHACER",
        priority: priority,    
        category: category 
    });
}
}