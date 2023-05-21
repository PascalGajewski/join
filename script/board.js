/**
 * The global variables only for board
 */

let currentDraggedElement;
let currentContacts;
let currentPrio;
let currentDate;

/**
 * This function renders all the Tasks on the board
 */

async function renderTasks() {
  await initAddTask();
  renderTasksToDo();
  renderTasksInProgress();
  renderTasksAwaitingFeedback();
  renderTasksDone();
}

/**
 * This function renders the "to do" Tasks on the board
 */

function renderTasksToDo() {
  let toDo = tasks.filter((t) => t['category'] == 'to-do');
  document.getElementById('to-do').innerHTML = ``;
  for (let index = 0; index < toDo.length; index++) {
    const element = toDo[index];
    if (element) {
      filterContactsFromTask(element);
      document.getElementById('to-do').innerHTML += generateTaskHTML(element);
      generateContactsInTask(tasks.indexOf(element));
      calculateSubtaskProgress(element);
      generatePrioInTask(tasks.indexOf(element), element);
    }
  }
}

/**
 * This function renders the "in progress" Tasks on the board
 */

function renderTasksInProgress() {
  let inProgress = tasks.filter((t) => t['category'] == 'in-progress');
  document.getElementById('in-progress').innerHTML = ``;
  for (let index = 0; index < inProgress.length; index++) {
    const element = inProgress[index];
    if (element) {
      filterContactsFromTask(element);
      document.getElementById('in-progress').innerHTML += generateTaskHTML(element);
      calculateSubtaskProgress(element);
      generateContactsInTask(tasks.indexOf(element));
      generatePrioInTask(tasks.indexOf(element), element);
    }
  }
}

/**
 * This function renders the "awaiting feedback" Tasks on the board
 */

function renderTasksAwaitingFeedback() {
  let awaitingFeedback = tasks.filter(
    (t) => t['category'] == 'awaiting-feedback'
  );
  document.getElementById('awaiting-feedback').innerHTML = ``;
  for (let index = 0; index < awaitingFeedback.length; index++) {
    const element = awaitingFeedback[index];
    if (element) {
      filterContactsFromTask(element);
      document.getElementById('awaiting-feedback').innerHTML += generateTaskHTML(element);
      calculateSubtaskProgress(element);
      generateContactsInTask(tasks.indexOf(element));
      generatePrioInTask(tasks.indexOf(element), element);
    }
  }
}

/**
 * This function renders the "done" Tasks on the board
 */

function renderTasksDone() {
  let done = tasks.filter((t) => t['category'] == 'done');
  document.getElementById('done').innerHTML = ``;
  for (let index = 0; index < done.length; index++) {
    const element = done[index];
    if (element) {
      filterContactsFromTask(element);
      document.getElementById('done').innerHTML += generateTaskHTML(element);
      calculateSubtaskProgress(element);
      generateContactsInTask(tasks.indexOf(element));
      generatePrioInTask(tasks.indexOf(element), element);
    }
  }
}

/**
 *  This function generates the HTML Code for a Task Card, task variables are given by parent function
 * (Design is not completed yet!!!)
 */
function generateTaskHTML(currentTask) {
  return `
    <div class="d-none task-card-overlay" id="task-card-overlay-${tasks.indexOf(currentTask)}">
      <img class="board-close-btn-task-move" src="./assets/img/icons/board-task-close.svg" 
      onclick="closeTaskCardOverlay(event, ${tasks.indexOf(currentTask)})">
      <h4><b>Move to</b></h4>
      <div class="move-task-btn-container">
        <span id="move-to-responsive-btn-to-do-of-task-${tasks.indexOf(currentTask)}" onclick="moveTo('to-do')" class="move-task-btn">To-Do</span>
        <span id="move-to-responsive-btn-in-progress-of-task-${tasks.indexOf(currentTask)}" onclick="moveTo('in-progress')" class="move-task-btn">In Progress</span>
        <span id="move-to-responsive-btn-awaiting-feedback-of-task-${tasks.indexOf(currentTask)}" onclick="moveTo('awaiting-feedback')"class="move-task-btn">Awaiting Feedback</span>
        <span id="move-to-responsive-btn-done-of-task-${tasks.indexOf(currentTask)}" onclick="moveTo('done')" class="move-task-btn" style="margin-bottom: 25px">Done</span>
      </div>
    </div>
    <div id="board-task-${tasks.indexOf(currentTask)}" draggable="true" 
    onclick="boardShowTask(${tasks.indexOf(currentTask)})" ondragstart="startDragging(${tasks.indexOf(currentTask)})"
    class="task-card">
      <span class="task-move-btn" id="move-to-${tasks.indexOf(currentTask)}" onclick="openTaskCardOverlay(event, ${tasks.indexOf(currentTask)})">Move</span>
      <span class="box-category" style="background-color: ${currentTask['categoryColor']}">${currentTask['categoryType']}</span>
      <h6>${currentTask['title']}</h6>
      <p>${currentTask['description']}</p>
      <div class="subtask-progress" id="subtask-progress-${tasks.indexOf(currentTask)}">
          <div class="progress-bar">
              <div class="progress" id="progress-bar-${tasks.indexOf(currentTask)}"></div>
          </div>
          <div id="progress-text-${tasks.indexOf(currentTask)}"></div>
        </div>
      <div style="display: flex; justify-content: space-between">
        <div style="display: flex; padding-left: 8px" id="box-contacts-${tasks.indexOf(currentTask)}"></div>
        <img style="object-fit: contain" id="box-prio-${tasks.indexOf(currentTask)}">
      </div>
    </div>
  `;
}

/**This function opens the task card overlay of the responsive move-to card
 */

function openTaskCardOverlay(event, currentTaskIndex){
  currentDraggedElement = currentTaskIndex;
if(!document.getElementById(`board-task-${currentTaskIndex}`).classList.contains('d-none')){
document.getElementById(`board-task-${currentTaskIndex}`).classList.add('d-none');};
if(document.getElementById(`task-card-overlay-${currentTaskIndex}`).classList.contains('d-none')){
  document.getElementById(`task-card-overlay-${currentTaskIndex}`).classList.remove('d-none');}
checkMoveToResponsive(currentTaskIndex);
event.stopPropagation();
}

/**This function closes the task card overlay of the responsive move-to card
 */

function closeTaskCardOverlay(event, currentTaskIndex){
  if(document.getElementById(`board-task-${currentTaskIndex}`).classList.contains('d-none')){
    document.getElementById(`board-task-${currentTaskIndex}`).classList.remove('d-none');};
    if(!document.getElementById(`task-card-overlay-${currentTaskIndex}`).classList.contains('d-none')){
      document.getElementById(`task-card-overlay-${currentTaskIndex}`).classList.add('d-none');}
    event.stopPropagation();
}

/**This function calculates the current progress of the checked subtasks
 */

function calculateSubtaskProgress(currentTask) {
  if(document.getElementById(`subtask-progress-${tasks.indexOf(currentTask)}`).classList.contains('d-none')){
  document.getElementById(`subtask-progress-${tasks.indexOf(currentTask)}`).classList.remove('d-none')};
  let progress = 0;
  let subtaskAmount = currentTask.subtasks.length;
  if (currentTask.subtasks.length > 0) {
    for (let i = 0; i < currentTask.subtasks.length; i++) {
      const subtask = currentTask.subtasks[i];
      if (subtask['status'] == 'true'){progress++;}}
    let progressInPercent = ((progress / subtaskAmount) * 100);
    document.getElementById(`progress-bar-${tasks.indexOf(currentTask)}`).style.width = progressInPercent + '%';
    document.getElementById(`progress-text-${tasks.indexOf(currentTask)}`).innerHTML = progress + '/' + subtaskAmount + ' Done';}
  else {
    if(!document.getElementById(`subtask-progress-${tasks.indexOf(currentTask)}`).classList.contains('d-none')){
    document.getElementById(`subtask-progress-${tasks.indexOf(currentTask)}`).classList.add('d-none')};
  }
}

/** This function opens a popup with the current selected task
 */

function boardShowTask(currentTaskIndex) {
  document.getElementById('board-open-task').classList.remove('d-none');
  let currentTask = tasks[currentTaskIndex];
  let dueDate = new Date(currentTask['date']);
  document.getElementById('board-open-task').innerHTML = generateBoardOpenTaskHTML(currentTaskIndex, currentTask, dueDate);
  generatePrioInOpenTaskHTML(currentTaskIndex);
  generateContactsInOpenTaskHTML(currentTaskIndex);
  document.getElementById('board-html').classList.add('overflow-hidden');
}

/** This function generates the contacts icons with initals in the tasks
 */

function generateContactsInTask(index) {
  let contactField = document.getElementById(`box-contacts-${index}`);
  contactField.innerHTML = ``;
  for (let i = 0; i < currentContacts.length; i++) {
    if(currentContacts[i][0]){
    let bgcolor = currentContacts[i][0]['bgcolor'];
    let initals = currentContacts[i][0]['initals'];
    contactField.innerHTML += openAssignedUserHTML(bgcolor, initals);
    }
}
}

/** This function generates the prio logos in the tasks
 */

function generatePrioInTask(index, currentTask) {
  let prioIcon = document.getElementById(`box-prio-${index}`);
  prioIcon.innerHTML = ``;
  if (currentTask['prio'] == 'urgent') {
    prioIcon.setAttribute('src', './assets/img/icons/add-task-urgent.svg');
  }
  if (currentTask['prio'] == 'medium') {
    prioIcon.setAttribute('src', './assets/img/icons/add-task-medium.svg');
  }
  if (currentTask['prio'] == 'low') {
    prioIcon.setAttribute('src', './assets/img/icons/add-task-low.svg');
  }
}

/** This function filters the whole contacts to only that ones, that accure in the current task
 */

function filterContactsFromTask(currentTask) {
  currentContacts = [];
  for (let index = 0; index < currentTask['contact'].length; index++) {
    const currentContact = currentTask['contact'][index];
    let currentContactFromBackend = contacts.filter(
      (c) => c['fullname'] == currentContact
    );
    currentContacts.push(currentContactFromBackend);
  }
}

/** These functions make the tasks drag- and dropable
 */

function startDragging(currentTaskIndex) {
  currentDraggedElement = currentTaskIndex;
}

function allowDrop(ev) {
  ev.preventDefault();
}

async function moveTo(category) {
  tasks[currentDraggedElement]['category'] = category;
  await backend.setItem('tasks', JSON.stringify(tasks));
  renderTasks();
}

/** This function moves the tasks in the responsive view
 */

async function checkMoveToResponsive(currentTaskIndex) {
  let currentTaskCategory = tasks[currentTaskIndex]['category'];
    document.getElementById(`move-to-responsive-btn-${currentTaskCategory}-of-task-${currentTaskIndex}`).classList.add('same-category-btn');
}

/** These functions highlight the current dragged area
 */

function highlight(category) {
  document.getElementById(category).classList.add('drag-area-highlight');
}

function removeHighlight(category) {
  document.getElementById(category).classList.remove('drag-area-highlight');
}

/**
 * This function sets a fixed category of a given task (to push tasks directly into one of the four
 * different task containers)
 */

async function setStartCategory(category) {
  tasks[tasks.length - 1]['category'] = category;
  await backend.setItem('tasks', JSON.stringify(tasks));
  await renderTasks();
}

/**
 * This function opens the add tasks popup
 */

function boardOpenAddTask(category) {
  document.getElementById('board-add-task').classList.remove('d-none');
  chosenCategory = category;
}

/**
 * This functions filters the rendered tasks on board
 */

function boardFilterTasks() {
  let search = document.getElementById('board-task-search').value;
  search = search.toLowerCase();
  for (let i = 0; i < tasks.length; i++) {
    if (!(tasks[i]['title'].toLowerCase().includes(search) || tasks[i]['description'].toLowerCase().includes(search)) && !document.getElementById(`board-task-${i}`).classList.contains('d-none')) {
      document.getElementById(`board-task-${i}`).classList.add('d-none');
    }
    if ((tasks[i]['title'].toLowerCase().includes(search) || tasks[i]['description'].toLowerCase().includes(search)) && document.getElementById(`board-task-${i}`).classList.contains('d-none')) {
      document.getElementById(`board-task-${i}`).classList.remove('d-none');
    }
  }
}

/**
 *  This function closes a opened task
 */

function closeOpenTaskPopup() {
  document.getElementById('board-open-task').classList.add('d-none');
  document.getElementById('board-html').classList.remove('overflow-hidden');
}

/**
 * This function writes the HTML code into a new opened task
 */

function generateBoardOpenTaskHTML(currentTaskIndex, currentTask, dueDate) {
  return `
    <div onclick="doNotClose(event)" class="open-task-card">
        <img class="board-close-button" src="./assets/img/icons/board-task-close.svg" 
        onclick="closeOpenTaskPopup()">
        <span class="box-category" style="background-color: ${currentTask['categoryColor']}">
        ${currentTask['categoryType']}</span>
        <h1>${currentTask['title']}</h1>
        <p>${currentTask['description']}</p>
        <p><b>Due date:</b><span style="margin-left: 25px">
        ${dueDate.getDate().toString().padStart(2, 0)}-${(dueDate.getMonth()+1).toString().padStart(2, 0)}-${dueDate.getFullYear()}</span></p>
        <div style="display: flex; align-items: center"><span><b>Priority:</b></span>
        <div class="board-prio-button" id="open-task-priority"></div></div>
        <p><b>Assigned to:</b></p>
        <div id="open-task-contacts"></div>
        <div class="board-button-box-main">
        <div class="board-button-box">
        <div class="board-delete-button" onclick="boardDeleteTask(${currentTaskIndex})"><img style="object-fit: contain" src="./assets/img/icons/board-delete-button-black.svg"></div>
        <div class="board-edit-button" onclick="openSecondTaskPage(${currentTaskIndex})"><img style="object-fit: contain" src="./assets/img/icons/board-edit-button-white.svg"></div>
        </div>
        </div>
    </div>
    `;
}

/**
 * This function generates the Priority section in the opened task
 */

function generatePrioInOpenTaskHTML(currentTaskIndex) {
  if (tasks[currentTaskIndex]['prio'] == 'urgent') {
    document.getElementById(`open-task-priority`).innerHTML = `Urgent<img class="board-prio-img" id="open-task-priority-img">`;
    document.getElementById(`open-task-priority`).setAttribute('style', 'background-color: #FF3D00');
    document.getElementById('open-task-priority-img').setAttribute('src', './assets/img/icons/add-task-urgent-white.svg');
  }
  if (tasks[currentTaskIndex]['prio'] == 'medium') {
    document.getElementById(`open-task-priority`).innerHTML = `Medium<img class="board-prio-img" id="open-task-priority-img">`;
    document.getElementById(`open-task-priority`).setAttribute('style', 'background-color: #FFA800');
    document.getElementById('open-task-priority-img').setAttribute('src', './assets/img/icons/add-task-medium-white.svg');
  }
  if (tasks[currentTaskIndex]['prio'] == 'low') {
    document.getElementById(`open-task-priority`).innerHTML = `Low<img class="board-prio-img" id="open-task-priority-img">`;
    document.getElementById(`open-task-priority`).setAttribute('style', 'background-color: #7AE229');
    document.getElementById('open-task-priority-img').setAttribute('src', './assets/img/icons/add-task-low-white.svg');
  }
}

/**
 * This function generates the Contacts section in the opened task
 */

function generateContactsInOpenTaskHTML(currentTaskIndex) {
  document.getElementById('open-task-contacts').innerHTML = ``;
  currentContacts = [];
  for (let index = 0; index < tasks[currentTaskIndex]['contact'].length; index++) {
    const currentContact = tasks[currentTaskIndex]['contact'][index];
    let currentContactFromBackend = contacts.filter((c) => c['fullname'] == currentContact);
    currentContacts.push(currentContactFromBackend);
  }
  for (let j = 0; j < currentContacts.length; j++) {
    if(currentContacts[j][0]){
    const element = currentContacts[j][0];
    document.getElementById('open-task-contacts').innerHTML += `
            <div style="display: flex; align-items: center; gap: 25px; margin-bottom: 25px"><div style="color: white; 
            background-color:rgb(${element['bgcolor']}); border-radius: 100%; padding: 10px">${element['initals']}</div>
            <span>${element['fullname']}</span></div>
            `;
    }
  }
}
