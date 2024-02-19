"use strict";
updateListTasks();
// localStorage.clear();


//==========================================

import { 
    getTasksLocalStorage,
    setTasksLocalStorage,
    generateUniqueId,
    initSortableList,
    updateListTasks
} from "./utils.js";

const form = document.querySelector('.form');
const textareaForm = document.querySelector('.form__textarea');
const buttonSendForm = document.querySelector('.form__send-btn');
const buttonCancel = document.querySelector('.form__cancel-btn');
const output = document.querySelector('.output');
let editId = null;
let isEditTask = false;

// All listeners
form.addEventListener("submit", sendTask);
output.addEventListener("click", (e) => {
  const taskElement = e.target.closest(".task__btns");
  if(!taskElement) return;



  if(e.target.closest(".task__pinned")) {
    pinnedTask(e);
  } else if(e.target.closest(".task__edit")) {
    editTask(e);
  } else if(e.target.closest(".task__del")) {
    delTask(e);
  } else if(e.target.closest(".task__done")) {
    doneTask(e);
  }

});
buttonCancel.addEventListener("click", resetForm);
output.addEventListener("dragover", initSortableList);
output.addEventListener("dragenter", e => e.preventDefault());


// All functions
function sendTask(e){
  e.preventDefault();

  const task = textareaForm.value.trim().replace(/\s+/g, " ");
  if(!task) return alert("Поле не должно быть пустым");

  if(isEditTask) {
    saveEditedTask(task);
    return;
  }

  const arrayTasksLocalStorage = getTasksLocalStorage();

  arrayTasksLocalStorage.push({
    id: generateUniqueId(),
    task,
    done: false,
    pinned: false,
    position: 1000,
  });

  setTasksLocalStorage(arrayTasksLocalStorage);
  updateListTasks();

  form.reset();
}

function doneTask(e) {
  const task = e.target.closest(".task");
  const taskId = +task.dataset.taskId;

  const arrayTasksLocalStorage = getTasksLocalStorage();
  const indexTask = arrayTasksLocalStorage.findIndex(item => item.id === taskId);

 if(indexTask === -1) return alert("Такая задача не найдена!");

 if(!arrayTasksLocalStorage[indexTask].done && arrayTasksLocalStorage[indexTask].pinned) {
  arrayTasksLocalStorage[indexTask].pinned = false;
 }

 if(arrayTasksLocalStorage[indexTask].done) {
  arrayTasksLocalStorage[indexTask].done = false;
 } else {
  arrayTasksLocalStorage[indexTask].done = true;
 }

 setTasksLocalStorage(arrayTasksLocalStorage);
 updateListTasks();
}

function pinnedTask(e) {
  const task = e.target.closest(".task");
  const taksId = +task.dataset.taskId;

  const arrayTasksLocalStorage = getTasksLocalStorage();
  const indexTask = arrayTasksLocalStorage.findIndex(item => taksId === item.id);

  if(indexTask === -1) return alert("Такая задача не найдена");

  if(arrayTasksLocalStorage[indexTask].done) {
    alert("Уберите отметку о выполнении задачи");
    return;
  }
  
   if(arrayTasksLocalStorage[indexTask].pinned) {
    arrayTasksLocalStorage[indexTask].pinned = false;
   } else {
    arrayTasksLocalStorage[indexTask].pinned = true;
   }
  
   setTasksLocalStorage(arrayTasksLocalStorage);
   updateListTasks();
}

function delTask(e) {
  const task = e.target.closest(".task");
  const taskId = +task.dataset.taskId;

  const arrayTasksLocalStorage = getTasksLocalStorage();
  const indexTask = arrayTasksLocalStorage.findIndex(item => taskId === item.id);
  const newArrayTasksLocalStorage = arrayTasksLocalStorage.filter(item => item.id !== taskId);

  if(indexTask === -1) return alert("Такая задача не найдена");

  setTasksLocalStorage(newArrayTasksLocalStorage);
  updateListTasks();
}

function editTask(e) {
  const task = e.target.closest(".task");
  const taskText = task.querySelector(".task__text");
  editId = +task.dataset.taskId;

  textareaForm.value = taskText.textContent;
  isEditTask = true;
  buttonSendForm.textContent = "Сохранить";
  buttonCancel.classList.remove("none");
  form.scrollIntoView({behavior: "smooth"});
}

function saveEditedTask(task) {
  const arrayTasksLocalStorage = getTasksLocalStorage();
  const editedTaskIndex = arrayTasksLocalStorage.findIndex(item =>  item.id === editId);

  if(editedTaskIndex !== -1) {
    arrayTasksLocalStorage[editedTaskIndex].task = task;
    setTasksLocalStorage(arrayTasksLocalStorage);
    updateListTasks();
  } else {
    alert("Такая задача не найдена!");
  }

  resetForm();
}

function resetForm() {
  editId = null;
  isEditTask = false;
  buttonSendForm.textContent = "Отправить";
  buttonCancel.classList.add("none");
  form.reset();
}
