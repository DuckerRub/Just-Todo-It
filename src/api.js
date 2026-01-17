import "./styles.css";
import { projectMethods } from "./projectController";
import { taskMethods } from "./taskController";
import "./domController";
import { DOMController } from "./domController";

// TODO: rename to workspace
export const projects = (function () {
    const fetchProjects = function () {
        return projectMethods.fetchProjects();
    }

    const addProject = function (title){
        projectMethods.addProject(title);
    }

    const deleteProject = function (projectId) {
        projectMethods.deleteProject(projectId);
    }

    const editProjectTitle = function (projectId, newTitle) {
        projectMethods.editProjectTitle(projectId, newTitle);
    }

    const fetchProjectTasks = function (projectId) {
        return projectMethods.fetchProjectTasks(projectId);
    }

    const fetchProjectTask = function (projectId, taskId) {
        return projectMethods.fetchProjectTask(projectId, taskId);
    }

    return {addProject, fetchProjects, fetchProjectTasks, fetchProjectTask, deleteProject, editProjectTitle};

})();

export const tasks = (function () {

    const addTask = function (projectId, title, description, duedate, priority) {
        taskMethods.addTask(projectId, title, description, duedate, priority);
    }

    const deleteTask = function (projectId, taskId) {
        taskMethods.deleteTask(projectId, taskId)
    }

    const editTask = function (projectId, taskId, title, description, duedate, priority) {
        taskMethods.editTask(projectId, taskId, title, description, duedate, priority)
    }

    const changeTaskStatus = function (projectId, taskId) {
        taskMethods.changeTaskStatus(projectId, taskId)
    }

    return {addTask, deleteTask, editTask, changeTaskStatus}

})();

// Initialize default project
const initializeDefaultProject = (function name(params) {
    if (projects.fetchProjects().length === 0) {
            projects.addProject("My workspace");
    }
    tasks.addTask("PROJECT_622b9c87-e270-41b7-9469-3302a1d918b8","test", "asdhuasdhoausdh", "2026-01-30", "low");
    DOMController.populateTodoList("PROJECT_622b9c87-e270-41b7-9469-3302a1d918b8", false);
})();




// TODO - How to make this more adherent to SOLID? 