import { format } from "date-fns";
import "./projectController";

// Task Class
class Task {
    constructor(title, description = "", duedate = "", priority = "", status = "") {
        this.id = this.generateId();
        this.title = title;
        this.description = description;
        this.duedate = format(duedate, "yyyy-MM-dd");
        this.priority = priority;
        this.status = status;
        // Project reference
        // TODO Add checklist last
    }

    getData(){
        return this;
    }

    generateId () {
            return self.crypto.randomUUID();
        };
}



const taskMethods = (function () {
    // add task

    // edit task

    // delete task

    // fetch all tasks from project

})();


// Local storage PoC
    // const task = new Task("test", "2026-01-30");
    // const taskJson = JSON.stringify(task);
    // localStorage.setItem(task.getTitle(), taskJson);
    // const getTaskData = JSON.parse(localStorage.getItem(task.getTitle()));
    // console.log(getTaskData);
    // // Gotta reconstruct shit
    // const getTaskDataReconstructed = new Task (
    //     getTaskData.title,
    //     getTaskData.duedate
    // )
    // console.log(getTaskDataReconstructed.getTitle());

