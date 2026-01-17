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

    const populateTodoList = function (projectId) {

        const status = viewCompleted.dataset.completedStatus === "false" ? false : true;

        const taskArrayUnfiltered = projects.fetchProjectTasks(projectId);
        const taskArray = taskArrayUnfiltered.filter(e => e.taskStatus === status);

        while (todoList.firstChild) {
            todoList.removeChild(todoList.firstChild);
        }

        taskArray.forEach(element => {
            const newTodoItem = document.createElement("div");
            newTodoItem.classList.add("todo-item");
            newTodoItem.dataset.projectId = globalProjectId;
            newTodoItem.dataset.taskId = element.id;
            // newTodoItem.dataset.taskStatus = element.taskStatus;

            
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

    const changeTaskStatus = function (projectId, taskId) {
        tasks.changeTaskStatus(projectId, taskId);
        populateTodoList(projectId);
    }

    const closeModal = function () {
        const modal = document.getElementById("modal");
        modal.remove();
    }

    const deleteTask = function (projectId, taskId) {
        
        tasks.deleteTask(projectId, taskId);
        populateTodoList(projectId);
        closeModal();
    }

    const editTask = function (projectId, taskId) {

        const title = document.getElementById("title-modal");
        const description = document.getElementById("description-modal");
        const duedate = document.getElementById("duedate-modal");
        const priority = document.getElementById("priority-modal");

        tasks.editTask(projectId, taskId, title.value, description.value, duedate.value, priority.value);

        //update screen
        populateTodoList(projectId, false);
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
        modalContent.dataset.projectId = projectId;
        modalContent.dataset.taskId = taskId;

        const modalClose = document.createElement("div");
        modalClose.classList.add("todo-item");
        modalClose.id = "modal-close";
        modalClose.textContent = "X"
        modalClose.addEventListener("click", () => {
            closeModal();
        });

        const modalCompleteTodoAction = document.createElement("div");
        modalCompleteTodoAction.classList.add("complete-todo-action");
        //TODO apply different styles based on completed status
        modalCompleteTodoAction.addEventListener("click", e => {
            e.stopPropagation();
            const projectId = !e.target.parentNode.dataset.projectId ? e.target.dataset.projectId : e.target.parentNode.dataset.projectId;
            const taskId = !e.target.parentNode.dataset.taskId ? e.target.dataset.taskId : e.target.parentNode.dataset.taskId;
            changeTaskStatus(projectId, taskId);
            closeModal();
        })

        const modalTitle = document.createElement("input");
        modalTitle.classList.add("todo-title");
        modalTitle.type = "text";
        modalTitle.value = task.title;
        modalTitle.id = "title-modal";
        

        const modalSubTodoItem = document.createElement("div");
        modalSubTodoItem.classList.add("sub-todo-item");

        const modalDuedate = document.createElement("input");
        modalDuedate.classList.add("todo-duedate");
        modalDuedate.type = "date";
        modalDuedate.value = task.duedate;
        modalDuedate.id = "duedate-modal";
        modalSubTodoItem.append(modalDuedate);

        const modalPriority= document.createElement("select");
        modalPriority.classList.add("todo-priority");
        
        const lowOption = document.createElement("option");
        lowOption.value = "low";
        lowOption.textContent = "Low";
        modalPriority.appendChild(lowOption);

        const mediumOption = document.createElement("option");
        mediumOption.value = "medium";
        mediumOption.textContent = "Medium";
        modalPriority.appendChild(mediumOption);

        const highOption = document.createElement("option");
        highOption.value = "high";
        highOption.textContent = "High";
        modalPriority.appendChild(highOption);

        modalPriority.value = task.priority;
        modalPriority.id = "priority-modal";
        modalSubTodoItem.append(modalPriority);

        const modalDescription= document.createElement("textarea");
        modalDescription.classList.add("todo-description");
        modalDescription.rows = "5";
        modalDescription.cols = "33";
        modalDescription.value = task.description;
        modalDescription.id = "description-modal";

        const modalSaveButton= document.createElement("button");
        modalSaveButton.classList.add("todo-save-button");
        modalSaveButton.textContent = "Save and close";
        modalSaveButton.addEventListener("click", e => {
            e.stopPropagation();
            const projectId = !e.target.parentNode.dataset.projectId ? e.target.dataset.projectId : e.target.parentNode.dataset.projectId;
            const taskId = !e.target.parentNode.dataset.taskId ? e.target.dataset.taskId : e.target.parentNode.dataset.taskId;
            editTask(projectId, taskId);
            closeModal();
        })

        const modalDeleteButton= document.createElement("button");
        modalDeleteButton.classList.add("todo-delete-button");
        modalDeleteButton.textContent = "Delete task";
        modalDeleteButton.addEventListener("click", e => {
            e.stopPropagation();
            const projectId = !e.target.parentNode.dataset.projectId ? e.target.dataset.projectId : e.target.parentNode.dataset.projectId;
            const taskId = !e.target.parentNode.dataset.taskId ? e.target.dataset.taskId : e.target.parentNode.dataset.taskId;
            deleteTask(projectId, taskId);
        })

        modalContent.appendChild(modalCompleteTodoAction);
        modalContent.appendChild(modalTitle);
        modalContent.appendChild(modalClose);
        modalContent.appendChild(modalDescription);
        modalContent.appendChild(modalSubTodoItem);
        modalContent.appendChild(modalSaveButton);
        modalContent.appendChild(modalDeleteButton);

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
            changeTaskStatus(projectId, taskId);
        } else {
            openTaskModal(projectId, taskId);
        }
    });

    viewCompleted.addEventListener("click", () => {
        //TODO very brittle
        const status = viewCompleted.dataset.completedStatus === "false" ? false : true;
        
        viewCompleted.dataset.completedStatus = !status;
        populateTodoList(globalProjectId);
        if (status === false) {
            viewCompleted.textContent = "View uncompleted task";
        } else {
            viewCompleted.textContent = "View completed task";
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

// TODOs
// Workspace selector