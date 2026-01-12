import "./styles.css";
import {projectMethods} from "./projectController";
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

    const addTaskToProject = function (projectId, taskObject) {
        projectMethods.addTaskToProject(projectId, taskObject)
    }

    return {addProject, fetchProjects, deleteProject, editProjectTitle, addTaskToProject};

})();

const tasks = (function () {
    //fetch all tasks

    //add task 

    //edit task

    //delete task

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
    projects.addTaskToProject("PROJECT_d1dd27f2-d3f0-48a1-8b67-c5ca305032f1",
        {title: "test",
        description: "testing test"
        }
    );
})

// TODO - How to make this more adherent to SOLID? 
// TODO I don't love that the methods here do 2 things: trigger DOM changes and data changes