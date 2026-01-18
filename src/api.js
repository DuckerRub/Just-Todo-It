import { projectMethods } from "./projectController";
import { taskMethods } from "./taskController";

// TODO: rename to workspace
export const projects = (function () {
    const fetchProjects = function () {
        return projectMethods.fetchProjects();
    }

    const addProject = function (title){
        return projectMethods.addProject(title);
    }

    const deleteProject = function (projectId) {
        projectMethods.deleteProject(projectId);
    }

    const editProjectTitle = function (projectId, newTitle) {
        projectMethods.editProjectTitle(projectId, newTitle);
    }

    // TODO remove this and use the OBjects one
    const fetchProjectTasks = function (projectId) {
        return projectMethods.fetchProjectTasks(projectId);
    }

    const fetchProjectTask = function (projectId, taskId) {
        return projectMethods.fetchProjectTask(projectId, taskId);
    }

    const fetchProjectsObjects = function () {
        const projectsArray = projectMethods.fetchProjects();
        const projectsObjectArray = [];
        projectsArray.forEach(element => {
            projectsObjectArray.push(projectMethods.fetchProject(element));
        });
        return projectsObjectArray;
    }

    return {addProject, fetchProjects, fetchProjectTasks, fetchProjectsObjects, fetchProjectTask, deleteProject, editProjectTitle};

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

// TODO - How to make this more adherent to SOLID?
// TODO make projects and tasks about crud, and the api about logic? But that creates dependency, at least api is currently only a proxy and each controller is independent-ish