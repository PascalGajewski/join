
/**
 * This function opens the second Opened Task Page (for changing tasks)
 */

function openSecondTaskPage(currentTaskIndex) {
    document.getElementById('board-open-task').innerHTML = ``;
    document.getElementById('board-open-task').innerHTML =
    generateSecondTaskPageHTML(currentTaskIndex);
    initChangeDueDate(currentTaskIndex);
    initChangePrioButtons();
    setChangePrioButtonDesign(tasks[currentTaskIndex]['prio']);
    pushAlreadySelectedContacts();
    initChangeAssignedTo();
    renderChangeAssignedUsers();
    generateOpenSubtaskList(currentTaskIndex);
    calculateOpenSubtaskProgress(currentTaskIndex);
  }
  
  /**
   * This function generates the HTML code fpr the second Opened Task (for changing tasks)
   */
  
  function generateSecondTaskPageHTML(currentTaskIndex) {
    return /*html*/ `
      <div onclick="doNotClose(event)" class="open-task-card">
      <img class="board-close-button" src="./assets/img/icons/board-task-close.svg" 
      onclick="closeOpenTaskPopup()">
      <form  class="board-open-task-input input-bar" onsubmit="saveChangedTask(${currentTaskIndex}); return false" autocomplete="on">
      <div class="add-task-title">
          <label for="add-task-input-title">Title</label>
          <input id="change-task-input-title" type="text" placeholder="Title" value="${tasks[currentTaskIndex]['title']}" required>
      </div>
  
      <div class="add-task-description">
          <label for="change-task-input-description">Description</label>
          <textarea style="font-family: Inter, sans-serif; height: 60%" id="change-task-input-description"
          placeholder="Description" required>${tasks[currentTaskIndex]['description']}</textarea>
      </div>
  
      <div class="add-task-due-date" id="change-task-due-date">
      <label>Due date</label>
      </div>
  
      <div class="add-task-prio">
          <label>Prio</label>
          <div class="add-task-prio-button-container" id="change-task-prio-button-render"></div>
          <span id="change-task-prio-button-error"></span>
      </div>
  
      <div class="add-task-assigned margin-bottom-10">
      <label>Assigned to</label>
      <div class="add-task-assigned-dropdown" id="change-task-assignedto-render"></div>
      <span style="color: red" id="change-task-assigned-error"></span>
      <div class="add-task-assigned-users-main" id="change-task-assigned-users"></div>
      </div>
  
  
      <div class="add-task-assigned" id="open-subtask-progress-${currentTaskIndex}">
            <label>Subtasks</label>
            <div class="subtask-progress" >
                  <div class="progress-bar">
                      <div class="progress" id="open-progress-bar-${currentTaskIndex}"></div>
                  </div>
                  <div id="open-progress-text-${currentTaskIndex}"></div>
            </div>
            <div id="open-subtask-list-${currentTaskIndex}"></div>
      </div>
      
  
      <div class="board-button-box-main">
        <button type="submit" class="board-save-button">OK<img style="object-fit: contain; 
        color: white; margin-left: 10px" src="./assets/img/icons/board-ok-white.svg"></button>
      </div>
      </div>
      </form>
      `;
  }
  
  
  
  function calculateOpenSubtaskProgress(currentTaskIndex) {
    if(document.getElementById(`open-subtask-progress-${currentTaskIndex}`).classList.contains('d-none')){
      document.getElementById(`open-subtask-progress-${currentTaskIndex}`).classList.remove('d-none');
      };
    let progress = 0;
    let subtaskAmount = tasks[currentTaskIndex].subtasks.length;
    if (tasks[currentTaskIndex].subtasks.length > 0) {
      for (let i = 0; i < tasks[currentTaskIndex].subtasks.length; i++) {
        if (tasks[currentTaskIndex].subtasks[i]['status'] == 'true') {
          progress++;
        }
      }
      let progressInPercent = ((progress / subtaskAmount) * 100).toFixed(2);
      document.getElementById(`open-progress-bar-${currentTaskIndex}`).style.width = progressInPercent + '%';
      document.getElementById(`open-progress-text-${currentTaskIndex}`).innerHTML = progress + '/' + subtaskAmount + ' Done';
    }
    else {
      if(!document.getElementById(`open-subtask-progress-${currentTaskIndex}`).classList.contains('d-none')){
      document.getElementById(`open-subtask-progress-${currentTaskIndex}`).classList.add('d-none');
      }
    }
  }
  
  
  function generateOpenSubtaskList(currentTaskIndex){
    document.getElementById(`open-subtask-list-${currentTaskIndex}`).innerHTML = ``;
    for (let i = 0; i < tasks[currentTaskIndex].subtasks.length; i++) {
      let currentSubtask = tasks[currentTaskIndex].subtasks[i];
      boardWriteSubtaskList(currentSubtask, currentTaskIndex);
    }
  }
  
  function boardWriteSubtaskList(currentSubtask, currentTaskIndex){
    let indexOfCurrentSubtask = tasks[currentTaskIndex].subtasks.indexOf(currentSubtask);
    if(tasks[currentTaskIndex]['subtasks'][indexOfCurrentSubtask]['status'] == 'true'){
      document.getElementById(`open-subtask-list-${currentTaskIndex}`).innerHTML += boardWriteSubtaskCheckedListHTML(indexOfCurrentSubtask, currentSubtask, currentTaskIndex);}
    if(tasks[currentTaskIndex]['subtasks'][indexOfCurrentSubtask]['status'] == 'false'){
      document.getElementById(`open-subtask-list-${currentTaskIndex}`).innerHTML += boardWriteSubtaskUncheckedListHTML(indexOfCurrentSubtask, currentSubtask, currentTaskIndex);
    }
    } 
    
  function boardWriteSubtaskCheckedListHTML(indexOfCurrentSubtask, currentSubtask, currentTaskIndex){
    return `
    <div style="display: flex; gap:10px; align-items: center">
        <input type="checkbox" id="open-subtask-${indexOfCurrentSubtask}" checked onclick="checkSubtasksOnBoard(${indexOfCurrentSubtask}, ${currentTaskIndex})">
        <span>${currentSubtask['subtask']}</span>
    </div>
    `;
  }
  
  function boardWriteSubtaskUncheckedListHTML(indexOfCurrentSubtask, currentSubtask, currentTaskIndex){
    return `
    <div style="display: flex; gap:10px; align-items: center">
        <input type="checkbox" id="open-subtask-${indexOfCurrentSubtask}" onclick="checkSubtasksOnBoard(${indexOfCurrentSubtask}, ${currentTaskIndex})">
        <span>${currentSubtask['subtask']}</span>
    </div>
    `;
  }
  
  function checkSubtasksOnBoard(indexOfCurrentSubtask, currentTaskIndex){
    let checkbox = document.getElementById(`open-subtask-${indexOfCurrentSubtask}`);
    if(checkbox.checked){
      tasks[currentTaskIndex].subtasks[indexOfCurrentSubtask]['status'] = 'true';
      checkbox.checked = true;}
    else{
      tasks[currentTaskIndex].subtasks[indexOfCurrentSubtask]['status'] = 'false';
      checkbox.checked = false;
    }
    calculateOpenSubtaskProgress(currentTaskIndex);
  }
  
  /*-- Due Date --*/
  /**
   * Generate the due-date input field from the add-task-template.js.
   * min date = current date
   */
  function initChangeDueDate(currentTaskIndex) {
    document.getElementById('change-task-due-date').innerHTML = '';
    const today = new Date().toISOString().split('T')[0];
    let currentTask = tasks[currentTaskIndex];
    let dueDate = new Date(currentTask['date']).toISOString().split('T')[0];
    document.getElementById('change-task-due-date').innerHTML = loadChangeDueDateHTML(today, dueDate);
  }
  
  /*-- Due Date Template-HTML --*/
  function loadChangeDueDateHTML(today, dueDate) {
    return /*html*/ `
      <label for="change-task-input-due-date">Due date</label>
      <input style="font-family: Inter, sans-serif;" 
      value="${dueDate}" id="change-task-input-due-date" type="date" min="${today}" required>
      `;
  }
  
  /*-- Prio --*/
  /**
   * Generate the prio buttons from array prioButtons.
   */
  function initChangePrioButtons() {
    const prioButtons = ['urgent', 'medium', 'low'];
    document.getElementById('change-task-prio-button-render').innerHTML = '';
    document.getElementById('change-task-prio-button-error').innerHTML = '';
    for (let i = 0; i < prioButtons.length; i++) {
      let prioName = prioButtons[i];
      let prioNameFormatted =
        prioName.charAt(0).toUpperCase() + prioName.slice(1).toLowerCase();
      document.getElementById('change-task-prio-button-render').innerHTML +=
        loadChangePrioButtonsHTML(prioName, prioNameFormatted);
    }
  }
  /*-- Prio-Buttons-HTML --*/
  function loadChangePrioButtonsHTML(prioName, prioNameFormatted) {
    return`
      <button type="button" id="change-prio-${prioName}" onclick="setChangeAddTaskPrioButton('${prioName}')">
          ${prioNameFormatted}
          <img id="change-img-prio-${prioName}" src="./assets/img/icons/add-task-${prioName}.svg" alt="${prioName}">
          <img id="change-img-prio-${prioName}-white" class="d-none" src="./assets/img/icons/add-task-${prioName}-white.svg" alt="${prioName}">
      </button>
      `;
  }
  /**
   * Save the selected prio button id by pushing the id into the chosenPrioButton array. (validate form)
   * @param {String} prioId - (Id) from prio button (urgent, medium, low).
   */
  function setChangeAddTaskPrioButton(prioId) {
    initChangePrioButtons();
    chosenPrioButton = [];
    chosenPrioButton.push(prioId);
    setChangePrioButtonDesign(prioId);
  }
  /**
   * Generate a new design for the selected prio button.
   * @param {String} prioId - (Id) from prio button (urgent, medium, low).
   */
  function setChangePrioButtonDesign(prioId) {
    currentPrio = prioId;
    document.getElementById(`change-prio-${prioId}`).classList.add(`bg-prio-${prioId}`, 'add-task-font-color');
    document.getElementById(`change-img-prio-${prioId}`).classList.add('d-none');
    document.getElementById(`change-img-prio-${prioId}-white`).classList.remove('d-none')
  }
  
  /**
   * Shows an error if no prio button was selected. (form validation)
   */
  function renderChangePrioButtonError() {
    document.getElementById('add-task-prio-button-error').innerHTML = '';
    document.getElementById('add-task-prio-button-error').innerHTML =
      addTaskErrorHTML('Please select a Priority');
  }
  
  
  /*-- Assigned-To --*/
  /**
   * Executes the functions that renders the assigned to field.
   */
  function initChangeAssignedTo() {
    document.getElementById('change-task-assignedto-render').innerHTML = '';
    document.getElementById('change-task-assigned-error').innerHTML = '';
    document.getElementById('change-task-assignedto-render').innerHTML =
    loadChangeAssignedToHTML();
    renderChangeAssignedToSelection();
    renderChangeInviteNewContact();
  }
  
  /**
   * Open the dropdown form in the assigned to section.
   */
  function openChangeAssignedToDropdown() {
    document
      .getElementById('change-task-assignedto-dropdown')
      .classList.toggle('d-none');
    renderChangeTopAssigendTo();
  }
  
  /**
   * Render the top section from the Assigned to and open the placeholder.
   *
   */
  function renderChangeTopAssigendTo() {
    document.getElementById('change-task-assigendto-dropdown-top').innerHTML = '';
    document.getElementById('change-task-assigned-error').innerHTML = '';
    document.getElementById('change-task-assigendto-dropdown-top').innerHTML =
      openTopPlaceholderHTML('Select contacts to assign');
  }
  
  /**
   * Render the new-contact field.
   *
   */
  function renderChangeInviteNewContact() {
    document.getElementById('change-task-assignedto-dropdown').innerHTML +=
      openChangeInviteNewContactHTML();
  }
  
  /**
   * Render the fullname / email / bgcolor / initals from the contacts (backend).
   * The fullname will be show in the dropdown assigned section.
   */
  function renderChangeAssignedToSelection() {
    document.getElementById('change-task-assignedto-dropdown').innerHTML = '';
    for (let i = 0; i < contacts.length; i++) {
      let name = contacts[i].fullname;
      let email = contacts[i].email;
      let bgcolor = contacts[i].bgcolor;
      let initals = contacts[i].initals;
      openChangeAssignedList(name, email, bgcolor, initals);
    }
  }
  
  /**
   * Render the input field from the new-contact that allows searching by email.
   *
   */
  function renderChangeAssignedToNewContact() {
    document
      .getElementById('change-task-assignedto-dropdown')
      .classList.toggle('d-none');
    document.getElementById('change-task-assigendto-dropdown-top').innerHTML = '';
    document.getElementById('change-task-add-new-contact-section').innerHTML =
      openChangeNewContactSelectHTML();
  }
  
  /**
   * Handles the keydown event for the "Serach New Contact" input field.
   * @param {event} event - This parameter is used to detect if the user has pressed the "Enter" key, and if so,
   *                      to prevent the default form submission behavior.
   */
  function searchChangeNewContactEnter(event) {
    if (event.key == 'Enter') {
      event.preventDefault();
      searchChangeNewContact();
    }
  }
  
  /**
   * Searches the dropdown section for the entered email(assigned-new-contact-input).
   * Validate the value from the assigned-new-contact-input.
   */
  function searchChangeNewContact() {
    let emailInput = document.getElementById('change-assigned-new-contact-input').value;
    let checkEmail = document.querySelector(`input[type="checkbox"][name="${emailInput}"]`);
    if (checkEmail) {
      checkEmail.checked = true;
      renderChangeTopAssigendToAfterNewContact();
      searchChangeNewContactPushUser(emailInput);
      renderChangeAssignedUsers();
    } else {
      document.getElementById('change-task-assigned-error').innerHTML =
        addTaskErrorHTML(`${emailInput} email not found!`);
      document.getElementById('change-assigned-new-contact-input').focus();
    }
    setTimeout(() => {
      document.getElementById('change-task-assigned-error').innerHTML = '';
    }, 2000);
  }
  
  /**
   * If you click on the cross, the assigned-new-contact-input will be closed.
   *
   */
  function renderChangeTopAssigendToAfterNewContact() {
    document.getElementById('change-task-add-new-contact-section').innerHTML = '';
    document.getElementById('change-task-add-new-contact-section').innerHTML =
      openChangeTopAssignedToHTML();
  }
  
  /**
   * Searches for a contact in the `contacts` array with the specified email address and
   * pushes the contact's initials and bgcolor into the `assignedToUsers` array, if not already present.
   * @param {String} emailInput - the value form the assigned-new-contact input field.
   */
  function searchChangeNewContactPushUser(emailInput) {
    const selectedContact = contacts.find(
      (contact) => contact.email === emailInput
    );
    let bgcolor = selectedContact.bgcolor;
    let initals = selectedContact.initals;
    let name = selectedContact.fullname;
    let index = assignedToUsers.findIndex(
      (userInfo) => userInfo.bgcolor === bgcolor && userInfo.initals === initals
    );
    // prevent multi generate
    if (index === -1) {
      assignedToUsers.push({ fullname: name, bgcolor: bgcolor, initals: initals });
    }
  }
  
  /**
   * Toggles the checkbox state of the assigned-to user and
   * updates the assignedToUsers array with the user's background color and initials.
   * @param {event} event - The event object.
   * @param {String} bgcolor - The background color of the user in the contacts array as rgb.
   * @param {String} initals - The initials of the user in the contacts array.
   */
  function toggleChangeCheckboxAssigned(event, name, bgcolor, initals) {
    let divContainerAssigned = event.target.closest('.add-task-dropdown-option');
    let checkboxAssigned = divContainerAssigned.querySelector('.validate-assignedto-checkbox');
  
    if (divContainerAssigned === event.target) {
      checkboxAssigned.checked = !checkboxAssigned.checked;
    }
  
    updateChangeAssignedToUsers(checkboxAssigned, name, bgcolor, initals);
    renderChangeAssignedUsers();
  }
  
  /**
   * Updates the assignedToUsers array based on the checkbox state of the assigned user.
   * @param {Object} checkboxAssigned - The HTML checkbox element representing the assigned user.
   * @param {String} bgcolor - The background color of the user in the contacts array as rgb.
   * @param {String} initals - The initials of the user in the contacts array.
   */
  function updateChangeAssignedToUsers(checkboxAssigned, name, bgcolor, initals) {
    if(assignedToUsers){
    let index = assignedToUsers.findIndex((userInfo) => userInfo.bgcolor === bgcolor && userInfo.initals === initals);
    // prevent multi generate
    if (checkboxAssigned.checked) {
      if (index === -1) {
        assignedToUsers.push({ fullname: name, bgcolor: bgcolor, initals: initals });
      }
    } else {
      if (index !== -1) {
        assignedToUsers.splice(index, 1);
      }
    }
  }}
  
  /**
   * Render the user icons, after selected them.
   */
  function renderChangeAssignedUsers() {
    document.getElementById('change-task-assigned-users').innerHTML = '';
    for (let i = 0; i < assignedToUsers.length; i++) {
      if(assignedToUsers[i]){
      let bgcolor = assignedToUsers[i].bgcolor;
      let initals = assignedToUsers[i].initals;
      document.getElementById('change-task-assigned-users').innerHTML +=
        openChangeAssignedUserHTML(bgcolor, initals);
    }}
  }
  
  /**
   * Shows an error if no user was selected. (form validation)
   */
  function renderChangeAssignedToError() {
    document.getElementById('change-task-assigned-error').innerHTML = '';
    document.getElementById('change-task-assigned-error').innerHTML =
    'Please select a Contact';
  }


  /*-- Assigned to Template-HTML --*/
  
  /**
   * Generates the general HTML of the assigned to field
   */
  
  function loadChangeAssignedToHTML() {
    return /*html*/ `
      <div id="change-task-add-new-contact-section">
          <div class="add-task-dropdown-top" id="change-task-assigendto-dropdown-top" onclick="openChangeAssignedToDropdown()">
              <span>Select contacts to assign</span>
              <img src="assets/img/icons/add-task-dropdown-arrow.svg" alt="arrow">
          </div>
      </div>
      <div id="change-task-assignedto-dropdown" class="add-task-dropdown-open d-none">                          
      </div>
      `;
  }
  
  function openChangeTopAssignedToHTML() {
    return /*html*/ `
      <div class="add-task-dropdown-top" id="change-task-assigendto-dropdown-top" onclick="openChangeAssignedToDropdown()">
          <span>Select contacts to assign</span>
          <img src="assets/img/icons/add-task-dropdown-arrow.svg" alt="arrow">
      </div>
      `;
  }
  
  function openChangeAssignedList(name, email, bgcolor, initals) {
    for (let i = 0; i < assignedToUsers.length; i++) {
      if( assignedToUsers[i]){
      let assignedName = assignedToUsers[i].fullname;
      if (assignedName == name) {
        document.getElementById('change-task-assignedto-dropdown').innerHTML +=
          openChangeCheckboxCheckedHTML(name, email, bgcolor, initals);
        return;
      }}
    }
    document.getElementById('change-task-assignedto-dropdown').innerHTML +=
      openChangeCheckboxUncheckedHTML(name, email, bgcolor, initals);
  }
  
  function openChangeCheckboxCheckedHTML(name, email, bgcolor, initals) {
    return /*html*/ `
      <div style="justify-content: space-between;" class="add-task-dropdown-option"  onclick="toggleChangeCheckboxAssigned(event,'${name}','${bgcolor}','${initals}')">
          ${name}
          <input type="checkbox" name="${email}" value="${name}" checked class="validate-assignedto-checkbox">
      </div>
       `;
  }
  
  function openChangeCheckboxUncheckedHTML(name, email, bgcolor, initals) {
    return /*html*/ `
      <div style="justify-content: space-between;" class="add-task-dropdown-option"  onclick="toggleChangeCheckboxAssigned(event,'${name}','${bgcolor}','${initals}')">
          ${name}
          <input type="checkbox" name="${email}" value="${name}" class="validate-assignedto-checkbox">
      </div>
       `;
  }
  
  function openChangeInviteNewContactHTML() {
    return /*html*/ `
      <div class="add-task-dropdown-new-contact" onclick="renderChangeAssignedToNewContact()">
          Invite new Contact
          <img src="./assets/img/icons/add-task-new-contact.svg" alt="contact">
      </div>
      `;
  }
  
  function openChangeNewContactSelectHTML() {
    return /*html*/ `
      <div class="add-task-dropdown-top">
          <input id="chnge-assigned-new-contact-input" class="add-task-new-contact-input" type="email" placeholder="Contact email" onkeypress="searchChangeNewContactEnter(event)">
          <div class="add-task-new-categroy-buttons">
              <img src="./assets/img/icons/add-task-button-cross.svg" onclick="renderChangeTopAssigendToAfterNewContact()" alt="cross">
              <div class="add-task-category-greyline"></div>
              <img src="./assets/img/icons/add-task-button-check.svg" onclick="searchChangeNewContact()" alt="check">
          </div>
      </div>
      `;
  }
  
  function openChangeAssignedUserHTML(bgcolor, initals) {
    return `
      <div style="background: rgb(${bgcolor});" class="add-task-assigned-user">
          <div>${initals}</div>
      </div>
      `;
  }
  
  async function saveChangedTask(currentTaskIndex) {
    if(assignedToUsers.length < 1){
      renderChangeAssignedToError();
    }
    else{
    let currentTask = tasks[currentTaskIndex];
    await pushChangeTaskIntoBackend(currentTask);
    await renderTasks();
    closeOpenTaskPopup();
    }
  }
  
  function pushAlreadySelectedContacts() {
    assignedToUsers = [];
    for (let j = 0; j < currentContacts.length; j++) {
      const element = currentContacts[j][0];
      assignedToUsers.push(element);
    }
  }
  
  async function pushChangeTaskIntoBackend(currentTask) {
    let newContacts = [];
    currentTask['title'] = document.getElementById('change-task-input-title').value;
    currentTask['description'] = document.getElementById('change-task-input-description').value;
    currentTask['date'] = Date.parse(document.getElementById('change-task-input-due-date').value);
    currentTask['prio'] = currentPrio;
    currentTask['contact'] = '';
    for (let i = 0; i < assignedToUsers.length; i++) {
      const newContactName = assignedToUsers[i].fullname;
      let currentContactFromBackend = contacts.filter((c) => c['fullname'] == newContactName)[0].fullname;
      newContacts.push(currentContactFromBackend);
    }
    currentTask['contact'] = newContacts;
    await backend.setItem('tasks', JSON.stringify(tasks));
  }
  
  async function boardDeleteTask(currentTaskIndex) {
    tasks.splice(currentTaskIndex, 1);
    await backend.setItem('tasks', JSON.stringify(tasks));
    await renderTasks();
    closeOpenTaskPopup();
  }
  