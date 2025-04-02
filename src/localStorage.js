export function getTodoArray() {
    console.log("attempted local array Access");
    const todosString = localStorage.getItem("todoArray");
    return todosString ? JSON.parse(todosString) : [];
}

export function saveTodoArray(todos) {
    console.log("Saving array to local storage");
    localStorage.setItem("todoArray", JSON.stringify(todos));
}

export function addTodo(newTodo) {
    console.log("adding new todo");
    const todoArray = getTodoArray();
    todoArray.push(newTodo);
    saveTodoArray(todoArray);
    return todoArray;
}

export function clearStorage() {
    console.log("storage cleared");
    localStorage.clear();
    return [];
}

