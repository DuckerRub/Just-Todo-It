import { format } from "date-fns";
import {projectMethods} from "./projectController";

class Task {
    constructor(title, description, duedate, priority) {
        this.id = this.generateId();
        this.title = title;
        this.description = description;
        this.duedate = format(duedate, "yyyy-MM-dd");
        this.priority = priority;
        this.taskStatus = false;
        // TODO Add checklist last as a way to experience how easy it is to maintain your code
    }

    getData(){
        return this;
    }

    generateId () {
            return "TASK_" + self.crypto.randomUUID();
        };
}

export const taskMethods = (function () {

    const addTask = function (projectId, title, description = "", duedate = new Date(), priority = "") {
        const task = new Task (title, description, duedate, priority);
        projectMethods.addTaskToProject(projectId, task);
    }

    const deleteTask = function (projectId, taskId) {
        const project = projectMethods.fetchProject(projectId);
        if (!project) {
            console.log("Project doesn't exist");
            return;
        }
        project.tasks = project.tasks.filter(e => e.id != taskId);
        projectMethods.updateProject(projectId, project);
    }


    const editTask = function (projectId, taskId, title, description = "", duedate = "", priority = "") {
        const project = projectMethods.fetchProject(projectId);
        if (!project) {
            console.log("Project doesn't exist");
            return;
        }

        const index = project.tasks.findIndex(e => e.id === taskId);
        if (index === -1) {
            console.log("Task doesn't exist");
            return;
        }
        project.tasks[index].title = title;
        project.tasks[index].description = description;
        project.tasks[index].duedate = format(duedate, "yyyy-MM-dd");
        project.tasks[index].priority = priority;
        projectMethods.updateProject(projectId, project);
    }

    const changeTaskStatus = function (projectId, taskId) {
        const project = projectMethods.fetchProject(projectId);
        if (!project) {
            console.log("Project doesn't exist");
            return;
        }

        const index = project.tasks.findIndex(e => e.id === taskId);
        if (index === -1) {
            console.log("Task doesn't exist");
            return;
        }
        const currentStatus = project.tasks[index].taskStatus;
        project.tasks[index].taskStatus = !currentStatus;
        projectMethods.updateProject(projectId, project);
    }

    return {addTask, deleteTask, editTask, changeTaskStatus};

})();
