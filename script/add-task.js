/**
 * add-task.js contains all functions that are relevant for the add-task.html and task-template.html
 * @author Daniel Hartmann
 * @version 1.0
 */

/**
 * All global variables in add task.
 * @param {Array}
 */
const allCategoryColor = ['#FC71FF', '#1FD7C1', '#FF8A00', '#8AA4FF', '#FF0000', '#2AD300', '#E200BE', '#0038FF'];
let addSubtasks = [];
let assignedToUsers = [];
/**
 * All global validation variables for form validation.
 *  @param {Array}
 */
let chosenCategoryColor = [];
let chosenCategoryType = [];
let chosenAssignedTo = [];
let chosenPrioButton = [];
let chosenCategory = 'to-do';
let chosenSubtasks = []; // not a required field
/**
 * @param {Array} tasks - Array of tasks (for backend).
 * @param {Array} categorys - Array of categorys (for backend).
 */
let tasks = [];
let categorys = [];

/**
 * Load content from backend (contacts, users, tasks) and start the initAddTaskTemplates() function.
 * @async - await init(); (backend connection)
 */
async function initAddTask() {
    await init();
    initAddTaskTemplates();
}

/**
 * To initialize all functions on the add task.html and task-template.html file that are required for building the page.
 */
function initAddTaskTemplates() {
    initCategory();
    initAssignedTo();
    initDueDate();
    initPrioButtons();
    initSubtask();
}

/*-- Category --*/
/**
 * Generate the CategoryHTML from the add-task-template.js.
 */
function initCategory() {
    document.getElementById('add-task-category-render').innerHTML = loadCategoryHTML();
    document.getElementById('add-task-new-category-dots').innerHTML = '';
    document.getElementById('add-task-new-category-error').innerHTML = '';
}

/**
 * Render the dropdown menu and render the top section from the category.
 * If assigned-to dropdown is opened, it will be closed.
 */
function openCategoryDropdown() {
    document.getElementById('add-task-category-dropdown').classList.toggle('d-none');
    document.getElementById('add-task-assignedto-dropdown').classList.add('d-none');
    document.getElementById('add-task-new-category-error').innerHTML = '';
    renderTopCategory();
    renderCategorySelection();
}

/**
 * Render the top section from the category and open the placeholder.
 */
function renderTopCategory() {
    document.getElementById('add-task-category-dropdown-top').innerHTML = openTopPlaceholderHTML('Select task category');
}

/**
 * Render the new category field in the dropdown.
 * Render the category selection in the category dropdown using the global array categorys.
 */
function renderCategorySelection() {
    document.getElementById('add-task-category-dropdown').innerHTML = openNewCategoryHTML();

    if(categorys.length >= 0) {
        for (let i = 0; i < categorys.length; i++) {
            let color = categorys[i].color;
            let type = categorys[i].type;
    
            document.getElementById('add-task-category-dropdown').innerHTML += openCategorysHTML(color, type, i);
        }
    }
}

/**
 * Renders the selected section and shows them int the category top.
 * Dropdown will be closed.
 * @param {String} color -The color of the categorys array, represented as a hexadecimal string.
 * @param {String} type - The type of the categorys array, represented as a string.
 */
function setCategory(color, type) {
    choseCategory(color, type);
    document.getElementById('add-task-category-dropdown-top').innerHTML = openTopSetCategoryHTML(color, type);
    document.getElementById('add-task-category-dropdown').innerHTML = '';
    document.getElementById('add-task-category-dropdown').classList.add('d-none');
}

/**
 * Render the new-category inputfield in the top section in category.
 * Renders a selection of colorful dots.
 */
function renderNewCategory() {
    document.getElementById('add-task-category-dropdown-top').innerHTML = '';
    document.getElementById('add-task-category-dropdown').innerHTML = '';
    document.getElementById('add-task-add-new-category-section').innerHTML = openNewCategorySelectHTML();
    renderNewCategoryDots();
}

/**
 * Renders a selection of colorful dots for the new-category.
 */
function renderNewCategoryDots() {
    document.getElementById('add-task-new-category-dots').innerHTML = '';

    for (let i = 0; i < allCategoryColor.length; i++) {
        let dotColor = allCategoryColor[i];
        document.getElementById('add-task-new-category-dots').innerHTML += openNewCategoryDotsHTML(dotColor, i);
    }
}

/*-- Category add new Category --*/
/**
 * push the selected dot, from the new-category selection in the chosenCategoryColor array (for form validation).
 * @param {String} dotColor - The color of the celected color dot, represented as a hexadecimal string.
 * @param {Number} i - The index of the current iteration in the loop that generates the color dots.
 */
function saveNewColor(dotColor, i) {
    chosenCategoryColor = [];
    chosenCategoryColor.push(dotColor);
    renderNewCategoryDots();
    document.getElementById(`selected-dot-active${i}`).classList.add('dropdown-option-dots-selected');
}

/**
 * 1. Validate the new-category input field and selected dot-color.
 * 2. Pushes the input value from the 'New Category' input field
 * into an array(categorys) and saves it when the form is submitted.
 * 2. Pushes the selected dot-color from the 'New Category'
 * into an array(categorys) and saves it when the form is submitted.
 */
function saveNewCategory() {
    let newType = document.getElementById('new-category-type-name');

    if (newType.value === '' || chosenCategoryColor.length === 0) {
        renderError("add-task-new-category-error", "Please select a category name and pick a color");
    } else {
        let category = {
            'type': newType.value,
            'color': chosenCategoryColor[0]
        };
        categorys.push(category);
        initCategory();
        renderTopNewCategory();
        addedNewCategoryMessage();
    }
}

/**
 * Shows the value from the new-category input field and the selected dot-color.
 */
function renderTopNewCategory() {
    let newColor = categorys[categorys.length - 1].color;
    let newType = categorys[categorys.length - 1].type;

    choseCategory(newColor, newType);
    document.getElementById('add-task-category-dropdown-top').innerHTML = openTopSetCategoryHTML(newColor, newType);
}

/**
 * Shows a message when a new category is added to the category dropdown menu.
 */
function addedNewCategoryMessage() {
    document.getElementById('add-task-new-category-error').innerHTML = addTaskMessageHTML('Added new category');
    setTimeout(() => {
        document.getElementById('add-task-new-category-error').innerHTML = '';
    }, 2000)
}

function deleteCatgory(i, event) {
    categorys.splice(i, 1);
    renderCategorySelection();

    event.stopPropagation();
}

/*-- Assigned-To --*/
/**
 * Generate the loadAssignedToHTML from the add-task-template.js.
 * Executes the functions that renders the names and the new-contact field.
 */
function initAssignedTo() {
    document.getElementById('add-task-assigned-error').innerHTML = '';
    document.getElementById('add-task-assignedto-render').innerHTML = loadAssignedToHTML();
    renderAssignedToSelection();
    renderInviteNewContact();
}

/**
 * Open the dropdown form the assigned to section.
 * If category dropdown is opened, it will be closed.
 */
function openAssignedToDropdown() {
    document.getElementById('add-task-assignedto-dropdown').classList.toggle('d-none');
    document.getElementById('add-task-category-dropdown').classList.add('d-none');
    renderTopAssigendTo();
}

/**
 * Render the top section from the Assigned to and open the placeholder.
 */
function renderTopAssigendTo() {
    document.getElementById('add-task-assigned-error').innerHTML = '';
    document.getElementById('add-task-assigendto-dropdown-top').innerHTML = openTopPlaceholderHTML('Select contacts to assign');
}

/**
 * Render the new-contact field.
 */
function renderInviteNewContact() {
    document.getElementById('add-task-assignedto-dropdown').innerHTML += openInviteNewContactHTML();
}

/**
 * Render the fullname / email / bgColor / initals from the contacts (backend).
 * The fullname will be show in the dropdown assigned section.
 */
function renderAssignedToSelection() {
    document.getElementById('add-task-assignedto-dropdown').innerHTML = '';

    for (let i = 0; i < contacts.length; i++) {
        const name = contacts[i].fullname;
        const email = contacts[i].email;
        const bgColor = contacts[i].bgcolor;
        const initals = contacts[i].initals;
        const checkboxStatus = (name === chosenAssignedTo[0]) ? 'checked' : '';
        document.getElementById('add-task-assignedto-dropdown').innerHTML += openAssignedListHTML(name, email, bgColor, initals, checkboxStatus);
    }
}

/**
 * Render the input field from the new-contact that allows searching by email.
 */
function renderAssignedToNewContact() {
    document.getElementById('add-task-assignedto-dropdown').classList.toggle('d-none');
    document.getElementById('add-task-assigendto-dropdown-top').innerHTML = '';
    document.getElementById('add-task-add-new-contact-section').innerHTML = openNewContactSelectHTML();
}

/**
 * Searches the dropdown section for the entered email(assigned-new-contact-input).
 * Validate the value from the assigned-new-contact-input.
 */
function searchNewContact() {
    let emailInput = document.getElementById('assigned-new-contact-input').value;
    let checkEmail = document.querySelector(`input[type="checkbox"][name="${emailInput}"]`);
    if (checkEmail) {
        checkEmail.checked = true;
        renderTopAssigendToAfterNewContact();
        searchNewContactPushUser(emailInput);
        renderAssignedUsers();
    } else {
        renderError("add-task-assigned-error", `${emailInput} email not found!`);
        document.getElementById('assigned-new-contact-input').focus();
    }
    setTimeout(() => {
        document.getElementById('add-task-assigned-error').innerHTML = '';
    }, 2000);
}

/**
 * If you click on the cross, the assigned-new-contact-input will be closed.
 */
function renderTopAssigendToAfterNewContact() {
    document.getElementById('add-task-add-new-contact-section').innerHTML = openTopAssignedToHTML();
}

/**
 * Searches for a contact in the `contacts` array with the specified email address and 
 * pushes the contact's initials and bgColor into the `assignedToUsers` array, if not already present.
 * @param {String} emailInput - the value form the assigned-new-contact input field.
 */
function searchNewContactPushUser(emailInput) {
    const selectedContact = contacts.find(contact => contact.email === emailInput);
    let bgColor = selectedContact.bgcolor;
    let initals = selectedContact.initals;
    let index = assignedToUsers.findIndex(userInfo => userInfo.bgColor === bgColor && userInfo.initals === initals);
    // prevent multi generate
    if (index === -1) {
        assignedToUsers.push({ bgColor: bgColor, initals: initals });
    }
}

/**
 * Toggles the checkbox state of the assigned-to user and 
 * updates the assignedToUsers array with the user's background color and initials.
 * @param {event} event - The event object.
 * @param {String} bgColor - The background color of the user in the contacts array as rgb.
 * @param {String} initals - The initials of the user in the contacts array.
 */
function toggleCheckboxAssigned(event, bgColor, initals) {
    let divContainerAssigned = event.target.closest('.add-task-dropdown-option');
    let checkboxAssigned = divContainerAssigned.querySelector('.validate-assignedto-checkbox');

    if (divContainerAssigned === event.target) {
        checkboxAssigned.checked = !checkboxAssigned.checked;
    }

    updateAssignedToUsers(checkboxAssigned, bgColor, initals);
    renderAssignedUsers();
}

/**
 * Updates the assignedToUsers array based on the checkbox state of the assigned user.
 * @param {Object} checkboxAssigned - The HTML checkbox element representing the assigned user.
 * @param {String} bgColor - The background color of the user in the contacts array as rgb.
 * @param {String} initals - The initials of the user in the contacts array.
 */
function updateAssignedToUsers(checkboxAssigned, bgColor, initals) {
    let index = assignedToUsers.findIndex(userInfo => userInfo.bgColor === bgColor && userInfo.initals === initals);
    // prevent multi generate
    if (checkboxAssigned.checked) {
        if (index === -1) {
            assignedToUsers.push({ bgColor: bgColor, initals: initals });
        }
    } else {
        if (index !== -1) {
            assignedToUsers.splice(index, 1);
        }
    }
}

/**
 * Render the user icons, after selected them.
 */
function renderAssignedUsers() {
    document.getElementById('add-task-assigned-users').innerHTML = '';
    for (let i = 0; i < assignedToUsers.length; i++) {
        let bgColor = assignedToUsers[i].bgColor;
        let initals = assignedToUsers[i].initals;
        document.getElementById('add-task-assigned-users').innerHTML += openAssignedUserHTML(bgColor, initals);
    }
}

/*-- Due Date --*/
/**
 * Generate the minimum due date for a task as the current date.
 */
function initDueDate() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('add-task-input-due-date').min = today;
}

/*-- Prio --*/
/**
 * Generate the prio buttons from array prioButtons.
 */
function initPrioButtons() {
    const prioButtons = ['urgent', 'medium', 'low'];
    document.getElementById('add-task-priobutton-render').innerHTML = '';
    document.getElementById('add-task-prio-button-error').innerHTML = '';

    for (let i = 0; i < prioButtons.length; i++) {
        let prioName = prioButtons[i];
        let prioNameFormatted = prioName.charAt(0).toUpperCase() + prioName.slice(1).toLowerCase();
        document.getElementById('add-task-priobutton-render').innerHTML += loadPrioButtonsHTML(prioName, prioNameFormatted);
    }
}

/**
 * Save the selected prio button id by pushing the id into the chosenPrioButton array. (validate form)
 * @param {String} prioId - (Id) from prio button (urgent, medium, low).
 */
function setAddTaskPrioButton(prioId) {
    initPrioButtons();

    chosenPrioButton = [];
    chosenPrioButton.push(prioId);

    setPrioButtonDesign(prioId);
}

/**
 * Generate a new design for the selected prio button.
 * @param {String} prioId - (Id) from prio button (urgent, medium, low).
 */
function setPrioButtonDesign(prioId) {
    document.getElementById(`prio-${prioId}`).classList.add(`bg-prio-${prioId}`, 'add-task-font-color');
    document.getElementById(`img-prio-${prioId}`).classList.add('d-none');
    document.getElementById(`img-prio-${prioId}-white`).classList.remove('d-none');
}

/*-- Subtask --*/
/**
 * Generate the subtask section from the add-task-template.js.
 */
function initSubtask() {
    document.getElementById('add-task-subtask-error').innerHTML = '';
    document.getElementById('add-task-subtask-render').innerHTML = loadSubtaskHTML();
}

/**
 * When the user click on the subtask section 
 * then the subtask input field will be generated and the input field is automatically focused.
 */
function changeSubtask() {
    document.getElementById('add-task-subtask-render').innerHTML = openSubtaskInputHTML();
    document.getElementById('add-task-subtask-input').focus();
}

/**
 * Validates the value from the subtask input field.
 * If the input is incorrect, a error will be generate.
 * If the input is correct, the input is pushed into the addSubtasks array and start the renderSubtaskCheckbox() function.
 */
function addNewSubtask() {
    document.getElementById('add-task-subtask-error').innerHTML = '';
    let subtaskInput = document.getElementById('add-task-subtask-input');
    if (subtaskInput.value === "") {
        renderError("add-task-subtask-error", "Please write a subtask");
        subtaskInput.focus();
    } else {
        addSubtasks.push(subtaskInput.value);
        subtaskInput.value = "";
        subtaskInput.focus();

        document.getElementById('add-task-subtask-addtask-render').innerHTML = '';
        renderSubtaskCheckbox();
    }
}

/**
 * Generates the subtask checkboxes after correct input from the addSubtasks array.
 */
function renderSubtaskCheckbox() {
    for (let i = 0; i < addSubtasks.length; i++) {
        let subTaskCheckbox = addSubtasks[i];
        document.getElementById('add-task-subtask-addtask-render').innerHTML += openSubtasksCheckboxHTML(subTaskCheckbox);
    }
}

