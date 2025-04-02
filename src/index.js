//imports
import { Todo, openForm, getList, listAllToggle, listTodayToggle, listWeekToggle } from "./todo.js";
import { clearStorage, getTodoArray,  addTodo } from "./localStorage.js";

export let globalArray = getTodoArray();

document.addEventListener('DOMContentLoaded', () => {

    let todo1 = new Todo("workout", "hitchest", "04-24-2004", "high", "awdawda", "Personal");
    addTodo(todo1);
    console.log("Todo1 added");
    getList();
    const addButton = document.querySelector("#addTodo");
    const clearButton = document.querySelector("#clearStorage");
    const homeButton = document.querySelector("#homeButton");
    const todayButton = document.querySelector("#todayButton");
    const weekButton = document.querySelector("#weekButton");

    clearButton.addEventListener("click", () => {
        clearStorage();
        getList();
    });
    addButton.addEventListener("click", openForm);
    homeButton.addEventListener("click", listAllToggle);
    todayButton.addEventListener("click", listTodayToggle);
    weekButton.addEventListener("click", listWeekToggle);
})
