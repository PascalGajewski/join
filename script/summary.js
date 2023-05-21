/**
 * summary.js contains all functions that are relevant for the summary.html.
 * @author Daniel Hartmann
 * @version 1.0
 */

/**
 * To initialize all functions on the summary.html that are required for building the page.
 * @async - await init(); Load content from backend (contacts, users, tasks).
 */
async function initSummary() {
    await init();
    summaryGreetingResponsive();
    summaryGreetings();
    changeGreetingName();
    countUrgent();
    findDeadline();
    countTaskTodoAndDone();
    countBoardTopSection();
}

/**
 * Generates a greeting message based on the current time of day and displays it.
 */
function summaryGreetings() {
    let currentHour = new Date().getHours();
    let greeting;

    if (currentHour < 12) {
        greeting = "Good morning,"
    } else if (currentHour < 18) {
        greeting = "Good afternoon,"
    } else {
        greeting = "Good evening,"
    }

    document.getElementById('summary-greeting').innerHTML = greeting;
    document.getElementById('summary-greeting-responsive').innerHTML = greeting;
}

/**
 * Generates a personalized greeting by retrieving the user's name from a cookie and searching for a matching user in the "users" array.
 * If no match was found, Guest will be displayed.
 */
function changeGreetingName() {
    let cookieValue = document.cookie;
    let nameFromCookie = cookieValue.split(';').find(cookie => cookie.includes('user='));

    showsGreetingName(nameFromCookie);
}

/**
 * Looks in the users array for a match with the cookie name and displayed it.
 * If no name found in the cookie, Guest will be displayed.
 * @param {String} nameFromCookie - Name from the user that was found in the cookie.
 */
function showsGreetingName(nameFromCookie) {
    if (nameFromCookie === undefined) {
        document.getElementById('summary-greeting-name').innerHTML = 'Guest';
        document.getElementById('summary-greeting-name-responsive').innerHTML = 'Guest';
    } else {
        let nameCookieFormatted = nameFromCookie.split('=')[1];
        const selectedUser = users.find(user => user.name.toLowerCase().replace(' ', '') === nameCookieFormatted);

        document.getElementById('summary-greeting-name').innerHTML = selectedUser.name;
        document.getElementById('summary-greeting-name-responsive').innerHTML = selectedUser.name;
    }
}

/**
 * Plays a welcome animation after logging in. 
 * @returns - If the screen is larger than 1350 or the welcome responsive animation has already played, the function will be aborted.
 */
function summaryGreetingResponsive() {
    if (window.innerWidth > 1350 || checkGreetingResponsiveCookie()) {
        document.getElementById('summary-welcome-responsive').classList.add('d-none');
        return;
    }

    showsGreetingResponsiveAnimation();
    setGreetingResponsiveCookie();
}

/**
 * Runs the welcome animation after logging in.
 */
function showsGreetingResponsiveAnimation() {
    document.getElementById('summary-welcome-responsive').classList.remove('d-none');
    document.getElementById('summary-body').classList.add('summary-hidden');
    setTimeout(() => {
        document.getElementById('summary-welcome-responsive').classList.add('summary-welcome-animation');
        setTimeout(() => {
            document.getElementById('summary-welcome-responsive').classList.add('d-none');
            document.getElementById('summary-body').classList.remove('summary-hidden');
        }, 1000);
    }, 2000);
}

/**
 * Look if a cookie name "greetingResponsiveDone=true" exists.
 * @returns - true or false
 */
function checkGreetingResponsiveCookie() {
    const cookieValue = document.cookie;
    return cookieValue.includes('greetingResponsiveDone=true');
}

/**
 * Sets a cookie with a lifetime of one hour.
 * getCookieExpireTime() = calculates the lifetime.
 */
function setGreetingResponsiveCookie() {
    let now = getCookieExpireTime();
    document.cookie = "greetingResponsiveDone=true; expires=" + now.toUTCString() + "; path=/";
}

/**
 * Counts how many tasks with priority "urgent" are in the tasks array, updates the urgent tasks count display.
 */
function countUrgent() {
    let urgentCount = 0;

    for (let i = 0; i < tasks.length; i++) {
        let taskPrio = tasks[i].prio;
        if (taskPrio === 'urgent') {
            urgentCount++;
        }
    }
    document.getElementById('summary-urgent-count').innerHTML = urgentCount;
}

/**
 * Find the lowest date in the tasks array.
 */
function findDeadline() {
    let lowestDate = Infinity;

    for (let i = 0; i < tasks.length; i++) {
        let milliseconds = tasks[i].date;
        if (milliseconds < lowestDate) {
            lowestDate = milliseconds;
        }
    }

    showDeadline(lowestDate);
}

/**
 * Converts milliseconds to: 'en-US', {month: 'long', day: 'numeric', year: 'numeric'}.
 * Show deadline datum.
 * @param {Number} lowestDate - (Date) in milliseconds
 */
function showDeadline(lowestDate) {
    const date = new Date(lowestDate);
    const formattedDate = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    document.getElementById('summary-find-deadline').innerHTML = formattedDate;
}

/**
 * Counts how many tasks in the category section with "to-do" or "done" are in the tasks array, updates the urgent tasks count display.
 */
function countTaskTodoAndDone() {
    let toDoCount = countLoopCategory('to-do');
    let doneCount = countLoopCategory('done');


    document.getElementById('summary-to-do-count').innerHTML = toDoCount;
    document.getElementById('summary-done-count').innerHTML = doneCount;
}

/**
 * Counts how many tasks in the category section with "in-progress" or "feedback" are in the tasks array, updates the urgent tasks count display.
 * Count and displays how many tasks are in the Board.
 */
function countBoardTopSection() {
    let taskBoardCount = tasks.length;
    let inProgress = countLoopCategory('in-progress');
    let feedback = countLoopCategory('awaiting-feedback');


    document.getElementById('summary-count-progress').innerHTML = inProgress;
    document.getElementById('summary-count-feedback').innerHTML = feedback;
    document.getElementById('summary-task-in-borad').innerHTML = taskBoardCount;
}

/**
 * Loop for counting the number of individual categories.
 * @param {String} nameCategory - Name of the corresponding category in the tasks.category array.
 * @returns - Number of (to-do, done, in-progress or awaiting-feedback)
 */
function countLoopCategory(nameCategory) {
    let countNumber = 0;

    for (let i = 0; i < tasks.length; i++) {
        let category = tasks[i].category;
        if (category === nameCategory) {
            countNumber++;
        }
    }
    
    return countNumber;
}
