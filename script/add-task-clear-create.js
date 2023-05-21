/**
 * add-task-clear-create.js is responsible for validating the add-task.
 * @author Daniel Hartmann
 * @version 1.0
 */


/*-- Clear Button --*/
/**
 * After pressing the clear button, all input fields and arrays will be reset.
 */
function clearAddTask() {
    chosenCategoryColor = [];
    chosenCategoryType = [];
    chosenAssignedTo = [];
    chosenPrioButton = [];
    chosenSubtasks = [];
    addSubtasks = [];
    assignedToUsers = [];
    document.getElementById('add-task-subtask-addtask-render').innerHTML = '';
    document.getElementById('add-task-assigned-users').innerHTML = '';

    initAddTaskTemplates();
}

/*-- Form / Create Button --*/
/**
 * Push the selected color and type from category section in the chosenCategoryColor and chosenCategoryType array. (form validate)
 * @param {String} color - The color of the categorys array or the entered category-name, represented as a hexadecimal string.
 * @param {String} type - The type of the categorys array or the selected color, represented as a string.
 */
function choseCategory(color, type) {
    chosenCategoryColor = [];
    chosenCategoryType = [];

    chosenCategoryColor.push(color);
    chosenCategoryType.push(type);
}

/**
 * After click on the create task button the form will be checked and if everything has been filled in correctly, the sendFormToBackend function will be executed.
 * @returns - Check the selected category, elected prio button and assigned user and if nothing has been selected, the function is aborted.
 *            If no category, prio burron or assigned user was selected a error will be created.
 */
function validateForm() {
    if (chosenCategoryType.length === 0 || chosenCategoryColor.length === 0) {
        renderError("add-task-new-category-error", "Please select a category name and pick a color");
        return;
    } if (chosenPrioButton.length === 0) {
        renderError("add-task-prio-button-error", "Please select a Priority");
        return;
    }
    pushChosenAssignedTo();
    if (chosenAssignedTo.length === 0) {
        renderError("add-task-assigned-error", "Please select a Contact");
        return;
    }
    pushChosenSubtasks(); // not a required field
    sendFormToBackend();
}

/**
 * Push the selected assigned user into the chosenAssignedTo array to validate the form.
 */
function pushChosenAssignedTo() {
    chosenAssignedTo = [];
    let contactsCheckboxes = document.querySelectorAll('.validate-assignedto-checkbox');
    for (let i = 0; i < contactsCheckboxes.length; i++) {
        if (contactsCheckboxes[i].checked) {
            chosenAssignedTo.push(contactsCheckboxes[i].value);
        }
    }
}

/**
 * Push subtask checkbox into the chosenSubtasks. (not required for the form validation)
 */
function pushChosenSubtasks() {
    let subtaskCheckboxes = document.querySelectorAll('input[name=subtasks]');
    for (let i = 0; i < subtaskCheckboxes.length; i++) {
        if (subtaskCheckboxes[i].checked) {
            let subtasks = {
                'subtask': subtaskCheckboxes[i].value,
                'status': 'true'
            };
            chosenSubtasks.push(subtasks);
        } else {
            let subtasks = {
                'subtask': subtaskCheckboxes[i].value,
                'status': 'false'
            };
            chosenSubtasks.push(subtasks);
        }
    }
}


/**
 * 1. Disabled the create task button to prevent multible submitting of the form element.
 * 2. Start pushTaskIntoBackend() function.
 * 3. Reset the form by automatic trigger the clear button.
 * 4. Shows the showsAddedTaskAnimation.
 * 5. Forwards to the board.html or render the board page.
 * 6. After sending the form into the backend the create task button will be activated again.
 * @async - pushTaskIntoBackend() / Pushed the task into the backend.
 */
async function sendFormToBackend() {
    try {
        document.getElementById('add-task-create-button').disabled = true;
        document.getElementById('add-task-create-button-media').disabled = true;

        await pushTaskIntoBackend();

        document.getElementById('add-task-clear-button').click(); // reset form
        showsAddedTaskAnimation();
        setTimeout(() => {
            loadOrRender();
        }, 2000);
    } catch (error) {
        console.log('An error has occurred!' + error);
    } finally {
        document.getElementById('add-task-create-button').disabled = false;
        document.getElementById('add-task-create-button-media').disabled = false;
    }
}

async function loadOrRender() {
    const board = 'board';
    let lastSegment = activePage.substring(activePage.lastIndexOf('/') + 1); // activePage in app.js
    let tempTrimmed = lastSegment.replace(/^\/|\.html$/g, '');
    if(tempTrimmed === board) {
        await renderTasks();
        boardCloseAddTask();
    } else {
        window.location.href = 'board.html';
    }
}

/**
 * Pushes a new task into the tasks array and sends it to the backend for storage.
 * @async - await backend.setItem('tasks', JSON.stringify(tasks));
 * @async - await backend.setItem('categorys', JSON.stringify(categorys));
 */
async function pushTaskIntoBackend() {
    let title = document.getElementById('add-task-input-title').value;
    let description = document.getElementById('add-task-input-description').value;
    let categoryColor = chosenCategoryColor[0];
    let categoryType = chosenCategoryType[0];
    let contact = chosenAssignedTo;
    let prio = chosenPrioButton[0];
    let subtask = chosenSubtasks;

    let task = {
        'number': tasks.length + 1,
        'title': title,
        'description': description,
        'categoryColor': categoryColor,
        'categoryType': categoryType,
        'category': chosenCategory,
        'contact': contact,
        'date': dateFormattedMilliseconds(),
        'prio': prio,
        'subtasks': subtask
    }

    tasks.push(task);
    await backend.setItem('tasks', JSON.stringify(tasks));
    await backend.setItem('categorys', JSON.stringify(categorys));
}

/**
 * Converts the selected date from the due-date input field to milliseconds
 * @returns - date in milliseconds.
 */
function dateFormattedMilliseconds() {
    let date = document.getElementById('add-task-input-due-date').value;
    let milliseconds = Date.parse(date);
    return milliseconds;
}

/**
 * Displays an animation to indicate that a task has been added to the tasks array.
 * Adds a CSS class to the "add-task-added" container to trigger the animation, 
 * then removes the class after a specified timeout to reset the animation.
 */
function showsAddedTaskAnimation() {
    const addedContainer = document.getElementById('add-task-added');
    addedContainer.classList.remove('d-none');
    addedContainer.classList.add('add-task-added-animation');
    setTimeout(() => {
        addedContainer.classList.remove('add-task-added-animation');
        addedContainer.classList.add('d-none');
    }, 2000);
}

/*Helpfunctions*/
/**
 * Renders an error message for a specific element.
 * @param {String} id - The ID of the element.
 * @param {String} message - The error message to display.
 */
function renderError(id, message) {
    document.getElementById(id).innerHTML = '';
    document.getElementById(id).innerHTML = `${addTaskErrorHTML(message)}`;
}

/**
 * Handles the keydown event for the input field "Add New Category", "Search New Contact" and "Add New Subtask".
 * @param {event} event - This parameter is used to detect if the user has pressed the "Enter" key, and if so, to prevent the default form submission behavior.
 * @param {Function} inputCallback - The function to be executed.
 */
function handleEnterKeyPress(event, inputCallback) {
    if (event.key === "Enter") {
      event.preventDefault();
      inputCallback();
    }
  }