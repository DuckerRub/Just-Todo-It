import "./styles.css";
import {tasks, projects} from "./api";

// TODO my frontend is absolute dog shit

export const DOMController = (function () {

    const workspaceSelector = document.getElementById("workspace-selector");
    const todoForm = document.querySelector(".add-todo-component-form");
    const todoList = document.getElementById("todo-list");
    const container = document.querySelector(".container");
    const addTodoForm = document.getElementById("add-todo-component");
    const viewCompleted = document.getElementById("view-completed-items");
    

    const getSelectedWorkspaceId = function () {
        const selectedProject = document.querySelector(".selectedWorkspace");
        return selectedProject.dataset.projectId;
    }

    const addTodo = function () {
        const projectId = getSelectedWorkspaceId();

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
            newTodoItem.dataset.projectId = projectId;
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

    const populateWorkspaceSelector = function () {

        const projectsArray = projects.fetchProjectsObjects();

        const workspaceSelector = document.getElementById("workspace-selector");

        const children = Array.from(workspaceSelector.children);
        children.forEach(child => {
            if (!child.classList.contains("add-workspace-item")) {
            workspaceSelector.removeChild(child);
            }
        });

        projectsArray.forEach(e => {
            const workspaceItem = document.createElement("div");
            workspaceItem.classList.add("workspace-item");
            workspaceItem.id = "workspace-item";
            workspaceItem.textContent = e.title;
            workspaceItem.dataset.projectId = e.id;
            workspaceItem.addEventListener("click", e => {
                // populateTodoList(e.id);
            })

            workspaceSelector.prepend(workspaceItem);
        });
    }

    const addWorkspace = function (title) {
        const projectId = projects.addProject(title);
        populateWorkspaceSelector();
        const newProject = document.querySelector(`.workspace-item[data-project-id="${projectId}"]`)
        newProject.classList.add("selectedWorkspace");
    }

    const switchSelectedWorkspace = function (projectId) {
        const selectedProject = document.querySelector(".selectedWorkspace");
        selectedProject.classList.remove("selectedWorkspace")
        populateTodoList(projectId);
        const newSelectedProject = document.querySelector(`.workspace-item[data-project-id="${projectId}"]`)
        newSelectedProject.classList.add("selectedWorkspace");
    }

    workspaceSelector.addEventListener("click", e => {
        //TODO too ugly and hardcoded
        if (e.target.id === "workspace-selector") {
            console.log("open selector")
        } else if (e.target.id === "workspace-item") {
            switchSelectedWorkspace(e.target.dataset.projectId);
        } else if (e.target.id === "submit-workspace-button") {
            e.preventDefault();
            const projectTitle = document.getElementById("workspace-title-form");
            addWorkspace(projectTitle.value);
            projectTitle.value = "";
        }
    })

    // TODO separate event binding elsewhere, consider removing logic as well, what should a event binder do?
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
        const cta = document.querySelector('.add-todo-component-cta.hidden-cta');
        const addTodoForm = document.querySelector(".add-todo-component.expanded");
        cta.classList.remove("hidden-cta");
        addTodoForm.classList.remove("expanded");
    });

    todoList.addEventListener("click", e => {
        const projectId = !e.target.parentNode.dataset.projectId ? e.target.dataset.projectId : e.target.parentNode.dataset.projectId;
        const taskId = !e.target.parentNode.dataset.taskId ? e.target.dataset.taskId : e.target.parentNode.dataset.taskId;
        //TODO improve this if, and questions if this is really the way to go
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
        populateTodoList(getSelectedWorkspaceId());
        if (status === false) {
            viewCompleted.textContent = "View uncompleted task";
        } else {
            viewCompleted.textContent = "View completed task";
        }
        
    });


    return {populateTodoList, populateWorkspaceSelector, getSelectedWorkspaceId};

})();

// Initialize default project
export const initialSetup = function () {
    if (projects.fetchProjects().length === 0) {
            projects.addProject("My workspace");
        }
    DOMController.populateWorkspaceSelector();
    const selectedProject = document.querySelector(".workspace-item");
    selectedProject.classList.add("selectedWorkspace")
    DOMController.populateTodoList(DOMController.getSelectedWorkspaceId());
};

// button just for easy testing
const button = document.getElementById("test-button");
button.addEventListener("click", () => {
    console.log("listener working");
    localStorage.setItem(getSelectedWorkspaceId(), JSON.stringify({
        id: getSelectedWorkspaceId(),
        title:"My workspace",
        tasks:[]
    }));
})

// TODOs
// Workspace selector