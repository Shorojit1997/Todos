import { $createButton, $taskContainer } from "./element.js";
import { sanitizeInput } from "./utility.js";
import { ALL, EDIT, READ } from "./const.js";

let isFormOpen = false;
let tasks = [];
let SELECTED = ALL;

const getUniqueId = () => Date.now();

const editForm = (liElement, task) => {
  const $inputElement = document.createElement("input");
  const $updateButton = document.createElement("button");
  const $cancelButton = document.createElement("button");
  const $deleteButton = document.createElement("button");

  $inputElement.setAttribute("id", `input-${task.id}`);
  $updateButton.setAttribute("id", `btn-update-${task.id}`);
  $cancelButton.setAttribute("id", `btn-cancel-${task.id}`);

  $inputElement.value = task.title;

  $deleteButton.innerText = "Delete";
  $updateButton.innerHTML = "Update";
  $cancelButton.innerHTML = "Cancel";

  $deleteButton.addEventListener("click", () => deleteTaskHandler(task.id));
  $updateButton.addEventListener("click", () => updateTaskHandler(task.id));
  $cancelButton.addEventListener("click", () => calcelTaskHandler(task.id));

  liElement.append($inputElement, $updateButton, $deleteButton, $cancelButton);

  return liElement;
};

const createForm = () => {
  const $liElement = document.createElement("li");
  const $inputElement = document.createElement("input");
  const $addButton = document.createElement("button");

  $addButton.innerHTML = "Add";
  $inputElement.setAttribute("name", "title");
  $inputElement.setAttribute("placeholder", "Enter your task name");
  $inputElement.setAttribute("id", "title");
  $addButton.setAttribute("id", "add-task");
  $addButton.addEventListener("click", () => addTaskHandler());

  $liElement.appendChild($inputElement);
  $liElement.appendChild($addButton);

  return $liElement;
};

const createTask = (task) => {
  const $listElement = document.createElement("li");

  if (task.mode == READ) {
    const $textContainer = document.createElement("span");
    const $editButton = document.createElement("button");
    const $deleteButton = document.createElement("button");

    $editButton.setAttribute("id", `btn-edit-${task.id}`);
    $deleteButton.setAttribute("id", `btn-delete-${task.id}`);

    $editButton.addEventListener("click", () => editTaskHandler(task.id));
    $deleteButton.addEventListener("click", () => deleteTaskHandler(task.id));

    $deleteButton.innerText = "Delete";
    $textContainer.innerText = task.title;
    $editButton.innerText = "Edit";

    $listElement.append($textContainer, $editButton, $deleteButton);
  } else if (task.mode == EDIT) {
    editForm($listElement, task);
  }

  $listElement.setAttribute("id", task.id);

  return $listElement;
};

const renderTasks = (taskContiner, tasks) => {
  tasks.map((task) => {
    let element = createTask(task);
    taskContiner.appendChild(element);
  });
};

const updateTaskHandler = (taskId) => {
  const $inputElement = document.getElementById(`input-${taskId}`);
  const inputValue = sanitizeInput($inputElement.value);
  let task = tasks.find((task) => task.id === taskId);
  task.title = inputValue;
  task.mode = READ;
  render();
};

const editTaskHandler = (taskId) => {
  let task = tasks.find((task) => task.id === taskId);
  task.mode = EDIT;
  render();
};

const calcelTaskHandler = (taskId) => {
  let task = tasks.find((task) => task.id === taskId);
  task.mode = READ;
  render();
};

const deleteTaskHandler = (taskId) => {
  taskId = parseInt(taskId);
  tasks = tasks.filter((task) => taskId != task.id);
  render();
};

const addTaskHandler = () => {
  const $title = document.getElementById("title");
  const titleValue = sanitizeInput($title.value);

  if (titleValue.length) {
    tasks.push({
      id: getUniqueId(),
      title: titleValue,
      mode: READ,
    });
    render();
  }
};

const toogleButton = () => {
  if (!isFormOpen) {
    $createButton.innerText = "Hide form";
    isFormOpen = true;
    return;
  }

  $createButton.innerText = "Create";
  isFormOpen = false;
};

const renderOnSelect = (taskContainer) => {
  switch (SELECTED) {
    case ALL:
      renderTasks(taskContainer, tasks);
  }
};

const render = () => {
  $taskContainer.innerHTML = "";
  if (isFormOpen) {
    let form = createForm();
    $taskContainer.appendChild(form);
    renderOnSelect($taskContainer, tasks);
    return;
  }
  renderOnSelect($taskContainer, tasks);
};

const showForm = () => {
  toogleButton();
  render();
};

$createButton.addEventListener("click", showForm);
