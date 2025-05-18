let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function addTask() {
    const title = document.getElementById("taskTitle").value.trim();
    const priority = document.getElementById("taskPriority").value;
    const deadline = document.getElementById("taskDeadline").value;

    if (!title || !deadline) {
        alert("Please enter a title and deadline.");
        return;
    }

    tasks.push({
        id: Date.now(),
        title,
        priority,
        deadline,
        completed: false
    });

    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks();
    document.getElementById("taskTitle").value = "";
    document.getElementById("taskDeadline").value = "";
}

function toggleStatus(id) {
    tasks = tasks.map(task => task.id === id ? {
        ...task,
        completed: !task.completed
    } : task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks();
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks();
}

function renderTasks() {
    const taskList = document.getElementById("taskList");
    taskList.innerHTML = "";

    const statusFilter = document.getElementById("filterStatus").value;
    const priorityFilter = document.getElementById("filterPriority").value;

    tasks.forEach(task => {
        if ((statusFilter === "Completed" && !task.completed) ||
            (statusFilter === "Pending" && task.completed) ||
            (priorityFilter !== "All" && task.priority !== priorityFilter)) {
            return;
        }

        const li = document.createElement("li");
        li.className = `list-group-item task-item ${task.completed ? "completed" : ""}`;

        li.innerHTML = `
      <div class="form-check">
        <input type="checkbox" class="form-check-input" onchange="toggleStatus(${task.id})" ${task.completed ? "checked" : ""} />
      </div>
      <div class="task-details">
        <div class="task-title font-weight-bold">${task.title}</div>
        <div>
          <span class="badge priority-badge priority-${task.priority}">${task.priority}</span>
          <span class="due-date"><i class="far fa-calendar-alt"></i> ${task.deadline}</span>
          ${isOverdue(task) ? '<span class="status-badge">Overdue</span>' : getDueInDays(task)}
        </div>
      </div>
      <div>
        <i class="far fa-trash-alt text-danger" style="cursor:pointer;" onclick="deleteTask(${task.id})"></i>
      </div>
    `;
        taskList.appendChild(li);
    });
}

function isOverdue(task) {
    const today = new Date();
    const dueDate = new Date(task.deadline);
    return !task.completed && dueDate < today;
}

function getDueInDays(task) {
    const today = new Date();
    const dueDate = new Date(task.deadline);
    const diff = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
    return diff > 0 ? `<span class="text-info ml-2">Due in ${diff} days</span>` : "";
}

function filterTasks() {
    renderTasks();
}

renderTasks();