import {tasks} from "./api";


export const DOMController = (function () {

    const todoForm = document.querySelector(".add-todo-component-form");


    const addTodo = function () {
        //TODO: properly fetch current selected project ID
        const projectId = "PROJECT_5d81c781-0966-412c-a4fa-1a7d56857d04";
        const titleForm = document.getElementById("title-form");
        const descriptionForm = document.getElementById("description-form");
        const duedateForm = document.getElementById("duedate-form");
        const priorityForm = document.getElementById("priority-form");

        //create item
        tasks.addTask(projectId, titleForm.value, descriptionForm.value, duedateForm.value, priorityForm.value);

        //update screen
        const newTodoItem = document.createElement("div");
        newTodoItem.classList.add("todo-item");
        
        const newCompleteTodoAction = document.createElement("div");
        newCompleteTodoAction.classList.add("complete-todo-action");

        const newTitle = document.createElement("div");
        newTitle.classList.add("todo-title");
        newTitle.textContent = titleForm.value;

        const newSubTodoItem = document.createElement("div");
        newSubTodoItem.classList.add("sub-todo-item");

        const newDuedate = document.createElement("div");
        newDuedate.classList.add("todo-duedate");
        newDuedate.textContent = duedateForm.value;

        const newPriority = document.createElement("div");
        newPriority.classList.add("todo-priority");
        newPriority.textContent = priorityForm.value;

        newSubTodoItem.appendChild(newDuedate);
        newSubTodoItem.appendChild(newPriority);

        newTodoItem.appendChild(newCompleteTodoAction);
        newTodoItem.appendChild(newTitle);
        newTodoItem.appendChild(newSubTodoItem);

        const todoList = document.querySelector(".todo-list");
        todoList.appendChild(newTodoItem);

        // clear form
        titleForm.value = "";
        descriptionForm.value = "";
        duedateForm.value = "";
        priorityForm.value = "low";

        //TODO: close form
        

    }

    todoForm.addEventListener("submit", e => {
        e.preventDefault();
        addTodo();
    })


})();