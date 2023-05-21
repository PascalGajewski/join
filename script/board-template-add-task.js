/**
 *  This function closes a opened Add Task Popup
 */

function closeAddTaskPopup() {
    document.getElementById('board-add-task').classList.add('d-none');
    document.getElementById('board-content').classList.remove('d-none');
}

/**
 * This function closes the add tasks popup
 */

function boardCloseAddTask() {
    document.getElementById('board-add-task').classList.add('d-none');
}
