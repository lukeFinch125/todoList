import { getTodoArray, clearStorage, addTodo, saveTodoArray } from "./localStorage";
import { format } from "date-fns";
import './todo.css';
import './template.css';

const { isBefore, endOfToday, startOfDay, add } = require("date-fns");
const list = document.querySelector("#todoList");
let allToggle = true;
let todayToggle = false;
let weekToggle = false;


export class Todo {
    // Private fields
  
    constructor(title, description, dueDate, priority, notes, project) {
      this.title = title;
      this.description = description;
      this.dueDate = new Date(dueDate);
      this.priority = priority;
      this.notes = notes;
      this.project = project;
    }
  
    // Public methods that can interact with private fields
    changePriority(priority) {
      this.priority = priority;
    }
  
    changeDueDate(dueDate) {
      this.dueDate = dueDate;
    }
  
    printTodo() {
      return `${this.title} - ${format(this.dueDate, "PPP")} - ${this.priority} - ${this.description}`;
    }

    toJSON() {
        return {
          title: this.title,
          description: this.description,
          dueDate: this.dueDate.toISOString(),
          priority: this.priority,
          notes: this.notes,
          project: this.project,
        };
      }
  }

  export function openForm() {
    console.log("form opened");

    document.querySelector("#modaloverlay").style.display = "block";

    const exisitingForm = document.querySelector("#formPopup");
    if(exisitingForm) {
      exisitingForm.remove();
    }

    const form = document.createElement('form');
    form.id = "formPopup";

    form.addEventListener("submit", function(event) {
        event.preventDefault();
        
        const formData = new FormData(form);
        const title = formData.get("title");
        const description = formData.get("description");
        const dueDate = formData.get("dueDate");
        const priority = formData.get("priority");
        const notes = formData.get("notes");
        const project = formData.get("project");
        const newTodo = new Todo(title, description, dueDate, priority, notes, project);

        console.log("newTodo added to form // openform()");
        addTodo(newTodo);
        getList();

        form.reset();
        document.querySelector("#modaloverlay").style.display = "none";
    });


    const formTitle = document.createElement('h1');
    formTitle.id = "formTitle";
    formTitle.textContent = "Add Todo to List";

    const titleLabel = document.createElement('label');
    titleLabel.textContent = "Title: ";
    titleLabel.setAttribute('for', 'titleInput');
    const titleInput = document.createElement('input');
    titleInput.type = "text";
    titleInput.id = "titleInput";
    titleInput.name = "title";
    titleInput.required = true;

    const descriptionLabel = document.createElement('label');
    descriptionLabel.textContent = "Description: ";
    descriptionLabel.setAttribute('for', 'descriptionInput');
    const descriptionInput = document.createElement('input');
    descriptionInput.type = "text";
    descriptionInput.id = "descriptionInput";
    descriptionInput.name = "description";

    const dueLabel = document.createElement('label');
    dueLabel.textContent = "Due Date: ";
    dueLabel.setAttribute('for', 'dueInput');
    const dueInput = document.createElement('input');
    dueInput.type = "date";
    dueInput.id = "dueInput";
    dueInput.name = "dueDate";
    dueInput.required = true;

    const priorityLabel = document.createElement('label');
    priorityLabel.textContent = "Priority: ";
    priorityLabel.setAttribute('for', 'selectPriority');
    const selectPriority = document.createElement('select');
    selectPriority.id = "priorityInput";
    selectPriority.name = "priority";
    selectPriority.required = true;

    const optionOne = document.createElement('option');
    optionOne.value = "high";
    optionOne.textContent = "high";
    selectPriority.appendChild(optionOne);
    const optionTwo = document.createElement('option');
    optionTwo.value = "medium";
    optionTwo.textContent = "medium";
    selectPriority.appendChild(optionTwo);
    const optionThree = document.createElement('option');
    optionThree.value = "low";
    optionThree.textContent = "low";
    selectPriority.appendChild(optionThree);


    const notesLabel = document.createElement('label');
    notesLabel.textContent = "additional notes: ";
    notesLabel.setAttribute('for', 'notesInput');
    const notesInput = document.createElement('input');
    notesInput.type = "text";
    notesInput.id = "notesInput";
    notesInput.name = "notes";

    const projectLabel = document.createElement('label');
    projectLabel.textContent = "Project: ";
    projectLabel.setAttribute('for', 'projectInput');
    const projectInput = document.createElement('input');
    projectInput.type = "text";
    projectInput.id = "projectInput";
    projectInput.name = "project";

    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.textContent = 'Submit';

    form.appendChild(titleLabel);
    form.appendChild(titleInput);
    form.appendChild(descriptionLabel);
    form.appendChild(descriptionInput);
    form.appendChild(dueLabel);
    form.appendChild(dueInput);
    form.appendChild(priorityLabel);
    form.appendChild(selectPriority);
    form.appendChild(notesLabel);
    form.appendChild(notesInput);
    form.appendChild(projectLabel);
    form.appendChild(projectInput);
    form.appendChild(submitButton);

    const formContainer = document.querySelector("#formContainer");
    formContainer.append(form);
  }

  export function getList() {
    console.log("list updating");

    const tempArray = getTodoArray();
    const arrayToReturn = [];

    if(tempArray.length === 0) {
      list.textContent = "No todos yet";
      return
    }

    if(allToggle == true) {
      updateList(tempArray);
    } else if (weekToggle === true) {
      console.log("showing week");
      tempArray.forEach((todo) => {
        const todoDueDate = new Date(todo.dueDate);
        if (
          isBefore(todoDueDate, add(endOfToday(), { days: 7 })) &&
          isBefore(startOfDay(new Date()), todoDueDate)
        ) {
          arrayToReturn.push(todo);
        }            
      });
      updateList(arrayToReturn);
    } else if (todayToggle === true) {
      console.log("Showing day schedule");
      tempArray.forEach((todo) => {
        const todoDueDate = new Date(todo.dueDate);
        if (
          isBefore(todoDueDate, add(endOfToday(), { days: 1 })) &&
          isBefore(startOfDay(new Date()), todoDueDate)
        ) {
          arrayToReturn.push(todo);
        }                  
      });
      updateList(arrayToReturn);
    } else {
      updateList(tempArray);
      console.log("cannot have all turned off");
    }
  }

  function updateList(array) {
    console.log("listUpdating");
    list.classList.add('listChild');
    list.textContent = "";
    array.forEach((todo) => {
      const child = document.createElement('div');
      child.textContent = `Title: ${todo.title} DueDate: ${todo.dueDate} Priority: ${todo.priority}`;
      list.appendChild(child);
    })
  }

  export function listAllToggle() {
    allToggle = true;
    todayToggle = false;
    weekToggle = false;
    console.log(`list all = ${allToggle}`);
    getList();
  }
  
  export function listTodayToggle() {
    allToggle = false;
    todayToggle = true;
    weekToggle = false;
    console.log(`list today = ${todayToggle}`);
    getList();
  }
  
  export function listWeekToggle() {
    allToggle = false;
    todayToggle = false;
    weekToggle = true;
    console.log(`week toggle = ${weekToggle}`);
    getList();
  }






  