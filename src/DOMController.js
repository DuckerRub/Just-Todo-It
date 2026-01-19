import "./styles.css";
import {tasks, projects} from "./api";



const DOMController = (function () {

    const container = document.querySelector(".container");
    const todoList = document.getElementById("todo-list");
    const viewCompleted = document.getElementById("view-completed-items");
    const addTodoForm = document.getElementById("add-todo-component");
    const todoForm = document.querySelector(".add-todo-component-form");
    const addWorkspaceForm = document.getElementById("submit-workspace-button");

    const getSelectedWorkspaceId = function () {
        const selectedProject = document.querySelector(".selectedWorkspace");
        if (selectedProject) {
            return selectedProject.dataset.projectId;
        } else {
            console.log("Returned first project");
            return projects.fetchProjects()[0];
        }
    }

    const populateTodoList = function (projectId) {

        const status = viewCompleted.dataset.showingCompleted === "false" ? false : true;

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

    const closeModal = function () {
        const modal = document.getElementById("modal");
        modal.remove();
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

            const title = document.getElementById("title-modal");
            const description = document.getElementById("description-modal");
            const duedate = document.getElementById("duedate-modal");
            const priority = document.getElementById("priority-modal");

            tasks.editTask(projectId, taskId, title.value, description.value, duedate.value, priority.value);

            populateTodoList(projectId, false);
            closeModal();
        })

        const modalDeleteButton= document.createElement("button");
        modalDeleteButton.classList.add("todo-delete-button");
        modalDeleteButton.textContent = "Delete task";
        modalDeleteButton.addEventListener("click", e => {
            e.stopPropagation();
            const projectId = !e.target.parentNode.dataset.projectId ? e.target.dataset.projectId : e.target.parentNode.dataset.projectId;
            const taskId = !e.target.parentNode.dataset.taskId ? e.target.dataset.taskId : e.target.parentNode.dataset.taskId;
            tasks.deleteTask(projectId, taskId);
            populateTodoList(projectId);
            closeModal();
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

    const closeWorkspaceModal = function () {
        const modal = document.getElementById("workspace-modal");
        modal.remove();
    }

    const openWorkspaceModal = function (projectId) {
        const project = projects.fetchProject(projectId);

        const workspaceModal = document.createElement("div");
        workspaceModal.classList.add("workspace-modal");
        workspaceModal.classList.add("expanded");
        workspaceModal.id = "workspace-modal";

        const modalContent = document.createElement("div");
        modalContent.classList.add("workspace-modal");
        modalContent.id = "workspace-modal-content";
        modalContent.dataset.projectId = projectId;

        const modalClose = document.createElement("div");
        modalClose.classList.add("workspace-item");
        modalClose.id = "workspace-modal-close";
        modalClose.textContent = "X"
        modalClose.addEventListener("click", () => {
            closeWorkspaceModal();
        });

        const modalTitle = document.createElement("input");
        modalTitle.classList.add("workspace-modal-title");
        modalTitle.type = "text";
        modalTitle.value = project.title;
        modalTitle.id = "workspace-modal-title";

        const modalSaveButton= document.createElement("button");
        modalSaveButton.classList.add("workspace-modal-save-button");
        modalSaveButton.textContent = "Save and close";
        modalSaveButton.addEventListener("click", e => {
            e.stopPropagation();
            const projectId = e.target.parentNode.dataset.projectId;
            const title = document.getElementById("workspace-modal-title")
            projects.editProjectTitle(projectId, title.value);
            populateWorkspaceSelector();
            switchSelectedWorkspace(projectId);
            closeWorkspaceModal();
        });

        const modalDeleteButton= document.createElement("button");
        modalDeleteButton.classList.add("workspace-modal-delete-button");
        modalDeleteButton.textContent = "Delete workspace";
        modalDeleteButton.addEventListener("click", e => {
            e.stopPropagation();
            projects.deleteProject(e.target.parentNode.dataset.projectId);
            location.reload();
        });

        modalContent.appendChild(modalTitle);
        modalContent.appendChild(modalClose);
        modalContent.appendChild(modalDeleteButton);
        modalContent.appendChild(modalSaveButton);

        workspaceModal.appendChild(modalContent);

        container.append(workspaceModal);

        workspaceModal.style.display = "block"
        
        
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
            workspaceItem.dataset.projectId = e.id;
            workspaceItem.addEventListener("click", e => {
                // e.stopPropagation();
                const projectId = !e.target.dataset.projectId ? e.target.parentNode.dataset.projectId : e.target.dataset.projectId;
                switchSelectedWorkspace(projectId);
                if (e.target.id === "workspace-item-button") {
                    openWorkspaceModal(projectId);
                }
            })
            const workspaceItemTitle = document.createElement("div");
            workspaceItemTitle.id = "workspace-item-title";
            workspaceItemTitle.textContent = e.title;
            workspaceItem.appendChild(workspaceItemTitle);
            const workspaceItemButton = document.createElement("button");
            workspaceItemButton.id = "workspace-item-button";
            workspaceItemButton.textContent = "Edit";
            workspaceItem.appendChild(workspaceItemButton);

            workspaceSelector.prepend(workspaceItem);
        });
    }

    const switchSelectedWorkspace = function (projectId) {
        const selectedProject = document.querySelector(".selectedWorkspace");
        if (selectedProject) {
            selectedProject.classList.remove("selectedWorkspace")
        }
        populateTodoList(projectId);
        const newSelectedProject = document.querySelector(`.workspace-item[data-project-id="${projectId}"]`)
        newSelectedProject.classList.add("selectedWorkspace");
    }

    return {populateTodoList, openTaskModal, switchSelectedWorkspace, populateWorkspaceSelector, getSelectedWorkspaceId, todoList, viewCompleted, addTodoForm, todoForm, addWorkspaceForm};

})();

const eventHandler = (function () {

    const addWorkspaceForm = function () {
        const projectTitle = document.getElementById("workspace-title-form");
        const projectId = projects.addProject(!projectTitle.value ? "Untitled" : projectTitle.value );
        projectTitle.value = "";
        DOMController.populateWorkspaceSelector();
        DOMController.switchSelectedWorkspace(projectId);
    };

    const addTodoForm = function () {
        const cta = document.querySelector('.add-todo-component-cta');
        const closeTodoForm = document.getElementById("close-todo-form");
        DOMController.addTodoForm.classList.add("expanded");
        cta.classList.add("hidden-cta");

        closeTodoForm.addEventListener("click", e => {
            e.stopPropagation();
            cta.classList.remove("hidden-cta");
            DOMController.addTodoForm.classList.remove("expanded");
        });
        
    }

    const todoForm = function () {

        const projectId = DOMController.getSelectedWorkspaceId();

        const titleForm = document.getElementById("title-form");
        const descriptionForm = document.getElementById("description-form");
        const duedateForm = document.getElementById("duedate-form");
        const priorityForm = document.getElementById("priority-form");
        tasks.addTask(projectId, titleForm.value, descriptionForm.value, duedateForm.value, priorityForm.value);
        DOMController.populateTodoList(projectId, false);
        titleForm.value = "";
        descriptionForm.value = "";
        duedateForm.value = "";
        priorityForm.value = "low";

        const cta = document.querySelector('.add-todo-component-cta.hidden-cta');
        const addTodoForm = document.querySelector(".add-todo-component.expanded");
        cta.classList.remove("hidden-cta");
        addTodoForm.classList.remove("expanded");
    };

    const todoList = function (e) {
        const projectId = !e.target.parentNode.dataset.projectId ? e.target.dataset.projectId : e.target.parentNode.dataset.projectId;
        const taskId = !e.target.parentNode.dataset.taskId ? e.target.dataset.taskId : e.target.parentNode.dataset.taskId;
        if (e.target.classList.contains("complete-todo-action")) {
            tasks.changeTaskStatus(projectId, taskId);
            DOMController.populateTodoList(projectId);
        } else {
            DOMController.openTaskModal(projectId, taskId);
        }
    };

    const viewCompleted = function () {

        const isShowingCompleted = DOMController.viewCompleted.dataset.showingCompleted === "true";
        DOMController.viewCompleted.dataset.showingCompleted = !isShowingCompleted;
        DOMController.populateTodoList(DOMController.getSelectedWorkspaceId());
        DOMController.viewCompleted.textContent = isShowingCompleted 
            ? "View completed tasks" 
            : "View uncompleted tasks";
    };

    return {addTodoForm, todoForm, todoList, viewCompleted, addWorkspaceForm}

})();

const eventBinder = (function () {

    DOMController.addWorkspaceForm.addEventListener("click", e => {
        e.preventDefault();
        eventHandler.addWorkspaceForm()
    });
    DOMController.addTodoForm.addEventListener("click", eventHandler.addTodoForm);
    DOMController.todoForm.addEventListener("submit", e => {
        e.preventDefault();
        eventHandler.todoForm()});
    DOMController.todoList.addEventListener("click", eventHandler.todoList);
    DOMController.viewCompleted.addEventListener("click", eventHandler.viewCompleted);
})();

// Initialize project
export const initialSetup = function () {
    if (projects.fetchProjects().length === 0) {
        // Makes sure there's at least a default workspace created
            projects.addProject("My workspace");
        }
    DOMController.populateWorkspaceSelector();
    const selectedProject = document.querySelector(".workspace-item");
    selectedProject.classList.add("selectedWorkspace");
    DOMController.viewCompleted.dataset.showingCompleted = "false";
    DOMController.populateTodoList(DOMController.getSelectedWorkspaceId());
};

// button just for easy testing
const button = document.getElementById("test-button");
button.addEventListener("click", () => {
    console.log("listener working");
})
