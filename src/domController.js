import {tasks, projects} from "./api";
const globalProjectId = "PROJECT_622b9c87-e270-41b7-9469-3302a1d918b8";

export const DOMController = (function () {

    const todoForm = document.querySelector(".add-todo-component-form");
    const todoList = document.getElementById("todo-list");
    const container = document.querySelector(".container");
    const addTodoForm = document.getElementById("add-todo-component");
    const viewCompleted = document.getElementById("view-completed-items");

    
    const addTodo = function () {
        //TODO: properly fetch current selected project ID
        const projectId = globalProjectId;

        const titleForm = document.getElementById("title-form");
        const descriptionForm = document.getElementById("description-form");
        const duedateForm = document.getElementById("duedate-form");
        const priorityForm = document.getElementById("priority-form");

        //create item
        tasks.addTask(projectId, titleForm.value, descriptionForm.value, duedateForm.value, priorityForm.value);

        //update screen
        populateTodoList(projectId, false);

        // clear form
        titleForm.value = "";
        descriptionForm.value = "";
        duedateForm.value = "";
        priorityForm.value = "low";

        //TODO: close form
        

    }

    const populateTodoList = function (projectId, completedStatus) {
        const taskArrayUnfiltered = projects.fetchProjectTasks(projectId);
        const taskArray = taskArrayUnfiltered.filter(e => e.completed === completedStatus);

        while (todoList.firstChild) {
            todoList.removeChild(todoList.firstChild);
        }

        taskArray.forEach(element => {
            const newTodoItem = document.createElement("div");
            newTodoItem.classList.add("todo-item");
            newTodoItem.dataset.projectId = globalProjectId;
            newTodoItem.dataset.taskId = element.id;

            
            const newCompleteTodoAction = document.createElement("div");
            newCompleteTodoAction.classList.add("complete-todo-action");
    
            const newTitle = document.createElement("div");
            newTitle.classList.add("todo-title");
            newTitle.textContent = element.title;
    
            const newSubTodoItem = document.createElement("div");
            newSubTodoItem.classList.add("sub-todo-item");
    
            const newDuedate = document.createElement("div");
            newDuedate.classList.add("todo-duedate");
            newDuedate.textContent = element.duedate;
    
            const newPriority = document.createElement("div");
            newPriority.classList.add("todo-priority");
            newPriority.textContent = element.priority;
    
            newSubTodoItem.appendChild(newDuedate);
            newSubTodoItem.appendChild(newPriority);
    
            newTodoItem.appendChild(newCompleteTodoAction);
            newTodoItem.appendChild(newTitle);
            newTodoItem.appendChild(newSubTodoItem);
    
            todoList.appendChild(newTodoItem);
        });

    }

    const completeTask = function (projectId, taskId) {
        tasks.completeTask(projectId, taskId);
        populateTodoList(projectId);
    }

    const openTaskModal = function (projectId, taskId) {

        const task = projects.fetchProjectTask(projectId, taskId);

        const modal = document.createElement("div");
        modal.classList.add("todo-item");
        modal.classList.add("expanded");
        modal.id = "modal";

        const modalContent = document.createElement("div");
        modalContent.classList.add("todo-item");
        modalContent.id = "modal-content";

        const modalClose = document.createElement("div");
        modalClose.classList.add("todo-item");
        modalClose.id = "modal-close";
        modalClose.textContent = "X"
        modalClose.addEventListener("click", e => {
            modal.style.display = "none";
        });

        const modalCompleteTodoAction = document.createElement("div");
        modalCompleteTodoAction.classList.add("complete-todo-action");
        //TODO apply different styles based on completed status
        modalCompleteTodoAction.textContent = ""

        const modalTitle = document.createElement("div");
        modalTitle.classList.add("todo-title");
        modalTitle.textContent = task.title;

        const modalSubTodoItem = document.createElement("div");
        modalSubTodoItem.classList.add("sub-todo-item");

        const modalDuedate = document.createElement("div");
        modalDuedate.classList.add("todo-duedate");
        modalDuedate.textContent = task.duedate;
        modalSubTodoItem.append(modalDuedate);

        const modalPriority= document.createElement("div");
        modalPriority.classList.add("todo-priority");
        modalPriority.textContent = task.priority;
        modalSubTodoItem.append(modalPriority);

        const modalDescription= document.createElement("div");
        modalDescription.classList.add("todo-description");
        modalDescription.textContent = task.description;

        modalContent.appendChild(modalCompleteTodoAction);
        modalContent.appendChild(modalTitle);
        modalContent.appendChild(modalClose);
        modalContent.appendChild(modalDescription);
        modalContent.appendChild(modalSubTodoItem);

        modal.appendChild(modalContent);

        container.append(modal);

        modal.style.display = "block"
    }

    addTodoForm.addEventListener("click", () => {
        const cta = document.querySelector('.add-todo-component-cta');
        const closeTodoForm = document.getElementById("close-todo-form");
        addTodoForm.classList.add("expanded");
        cta.classList.add("hidden-cta");
        closeTodoForm.addEventListener("click", e => {
            e.stopPropagation();
            cta.classList.remove("hidden-cta");
            addTodoForm.classList.remove("expanded");
        })
    })

    todoForm.addEventListener("submit", e => {
        e.preventDefault();
        addTodo();
    });

    todoList.addEventListener("click", e => {
        const projectId = !e.target.parentNode.dataset.projectId ? e.target.dataset.projectId : e.target.parentNode.dataset.projectId;
        const taskId = !e.target.parentNode.dataset.taskId ? e.target.dataset.taskId : e.target.parentNode.dataset.taskId;
        if (e.target.classList.contains("complete-todo-action")) {
            completeTask(projectId, taskId);
        } else {
            openTaskModal(projectId, taskId);
        }
    });

    viewCompleted.addEventListener("click", () => {
        //TODO very brittle
        const status = viewCompleted.dataset.completedStatus === "false" ? false : true;
        populateTodoList(globalProjectId, !status);
        viewCompleted.dataset.completedStatus = !status;
        if (status === false) {
            viewCompleted.textContent = "View uncompleted items";
        } else {
            viewCompleted.textContent = "View completed items";
        }
        
    });

    return {populateTodoList};

})();



// button just for easy testing
const button = document.getElementById("test-button");
button.addEventListener("click", () => {
    console.log("listener working");
    localStorage.setItem(globalProjectId, JSON.stringify({
        id: globalProjectId,
        title:"My workspace",
        tasks:[]
    }));
})