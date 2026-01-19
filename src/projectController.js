class Project {
    constructor(title) {
        this.id = this.#generateProjectId();
        this.title = title;
        this.tasks = [];
    }

    #generateProjectId () {
            return "PROJECT_" + self.crypto.randomUUID();
    };
    
}

export const projectMethods = (function () {

    const fetchProjects = function (){
        const projects = Object.keys(localStorage);
        return projects;
    }

    const fetchProject = function (projectId){
        const storedProject = localStorage.getItem(projectId);
        if (!storedProject) {
            console.log("Project doesn't exist");
            return null;
        }
        return JSON.parse(storedProject);
    }
    
    const addProject = function (title) {
        const project = new Project(title);
        localStorage.setItem(project.id, JSON.stringify(project));
        return project.id;
    }

    const deleteProject = function(projectId){
        if (!localStorage.getItem(projectId)) {
            console.log("Project doesn't exist")
        }else {
            localStorage.removeItem(projectId);
        }
    }

    const updateProject = function(projectId, projectObject){
        const project = fetchProject(projectId);
        if (!project) {
            console.log("Project doesn't exist")
        }else {
            localStorage.setItem(projectId, JSON.stringify(projectObject));
        }
    }
    
    const addTaskToProject = function(projectId, taskObject){
        const project = fetchProject(projectId);
        if (!project) {
            console.log("Project doesn't exist")
        }else {
            project.tasks.push(taskObject);
            localStorage.setItem(projectId, JSON.stringify(project));
        }
    }

    return {fetchProjects, fetchProject, addProject, deleteProject, updateProject, addTaskToProject };
    
})();