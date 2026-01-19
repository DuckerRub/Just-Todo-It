import { projectMethods } from "./projectController";
import { taskMethods } from "./taskController";

// TODO: rename to workspace
export const projects = (function () {
    const fetchProjects = function () {
        return projectMethods.fetchProjects();
    }

    const fetchProject = function (projectId) {
        return projectMethods.fetchProject(projectId);
    }

    const addProject = function (title){
        return projectMethods.addProject(title);
    }

    const deleteProject = function (projectId) {
        projectMethods.deleteProject(projectId);
    }

    const editProjectTitle = function (projectId, newTitle) {
        const projectObject = projectMethods.fetchProject(projectId);
        if (!projectObject) {
            console.log("Project doesn't exist")
        }else {
            projectObject.title = newTitle;
            projectMethods.updateProject(projectId, projectObject);
        }
    }

    const fetchProjectTasks = function (projectId) {
        const project = projectMethods.fetchProject(projectId);
        if (!project) {
            console.log("Project doesn't exist")
        }else {
            return project.tasks;
        }
    }

    const fetchProjectTask = function (projectId, taskId) {
        const project = projectMethods.fetchProject(projectId);
        if (!project) {
            console.log("Project doesn't exist")
        }else {
            const index = project.tasks.findIndex(e => e.id === taskId);
            return project.tasks[index];
        }
    }

    const fetchProjectsObjects = function () {
        const projectsArray = projectMethods.fetchProjects();
        const projectsObjectArray = [];
        projectsArray.forEach(element => {
            projectsObjectArray.push(projectMethods.fetchProject(element));
        });
        return projectsObjectArray;
    }

    return {addProject, fetchProjects, fetchProject, fetchProjectTasks, fetchProjectsObjects, fetchProjectTask, deleteProject, editProjectTitle};

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
