class Project {
    constructor(title) {
        this.id = this.generateProjectId();
        this.title = title;
        this.tasks = [];
    }

    countTasks () {
        return this.tasks.length;
    }
    
    generateProjectId () {
            return "PROJECT_" + self.crypto.randomUUID();
    };
}

export const projectMethods = (function () {
    
    const addProject = function (title) {
        const project = new Project(title);
        localStorage.setItem(project.id, JSON.stringify(project));
    }

    const deleteProject = function(projectId){
        if (!localStorage.getItem(projectId)) {
            console.log("Project doesn't exist")
        }else {
            localStorage.removeItem(projectId);
        }
    }

    const editProjectTitle = function(projectId, newTitle){
        const project = JSON.parse(localStorage.getItem(projectId));
        if (!project) {
            console.log("Project doesn't exist")
        }else {
            project.title = newTitle;
            localStorage.setItem(projectId, JSON.stringify(project));
        }
    }

    
    const fetchProjects = function (){
        const projects = Object.keys(localStorage);
        return projects;
    }
    
    const addTaskToProject = function(projectId, taskObject){
        const project = JSON.parse(localStorage.getItem(projectId));
        if (!project) {
            console.log("Project doesn't exist")
        }else {
            project.tasks.push(taskObject);
            localStorage.setItem(projectId, JSON.stringify(project));
        }
    }

    return {addProject, fetchProjects, deleteProject, editProjectTitle, addTaskToProject};
    
})();