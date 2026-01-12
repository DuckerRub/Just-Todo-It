import "./styles.css";
import {projectMethods} from "./projectController";
import { taskMethods } from "./taskController";
import "./taskController";

const projects = (function () {
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

    return {addProject, fetchProjects, deleteProject, editProjectTitle};

})();

const tasks = (function () {

    const addTask = function (projectId, title, description, duedate, priority) {
        taskMethods.addTask(projectId, title, description, duedate, priority)
    }

    const deleteTask = function (projectId, taskId) {
        taskMethods.deleteTask(projectId, taskId)
    }

    const editTask = function (projectId, taskId, title, description, duedate, priority) {
        taskMethods.editTask(projectId, taskId, title, description, duedate, priority)
    }

    return {addTask, deleteTask, editTask}

})();

// Initialize default project
const initializeDefaultProject = (function name(params) {
    if (projects.fetchProjects().length === 0) {
            projects.addProject("Default");
    }
})();


// button just for easy testing
const button = document.querySelector("button");
button.addEventListener("click", () => {
    // tasks.addTask("PROJECT_bea2247b-79fa-4020-b764-4b096a26d529", "test123123213", "description123123", new Date(), "high")
    // tasks.deleteTask("PROJECT_bea2247b-79fa-4020-b764-4b096a26d529", "TASK_4f40c1a0-ca4a-4748-a6ac-e5136f7baacf")
    tasks.editTask("PROJECT_bea2247b-79fa-4020-b764-4b096a26d529", "TASK_82d7ae0f-4287-46e1-b7ca-269f6c9257d4", "5456nnnn", "nddddddww", new Date(), "low")
})

// TODO - How to make this more adherent to SOLID? 
// TODO I don't love that the methods here do 2 things: trigger DOM changes and data changes