let users = [];

// main java-script file , side behavior an all pages, menue
let activLogOutArea = false;
const activePage = window.location.pathname; // get the current pathname from window.location
setURL(
  'https://pascal-gajewski.developerakademie.net/smallest_backend_ever'
);

async function init() {
  await includeHTML();
  await downloadFromServer();
  contacts = (await JSON.parse(backend.getItem('contacts'))) || [];
  users = (await JSON.parse(backend.getItem('users'))) || [];
  tasks = (await JSON.parse(backend.getItem('tasks'))) || [];
  categorys = (await JSON.parse(backend.getItem('categorys'))) || [];
  if(window.location.pathname == '/contacts.html'){
    handleWindowResize();
  }
  changeProfileImage();
}
/**
 * Handles the window resize event by calling the appropriate functions to adjust the contacts display.
 * If the necessary functions are not available on the page, no action is taken.
 * @returns {void}
 */
function handleWindowResize() {
  try {
    handleWindowResizeContacs();
    getSortListofContacts();
    contactsShowContactlist(sortContacts);
  } catch (error) {
    //do nothing, then the corresponding js file is not included, because not relevant an this page
  }
}
/**
 * Includes HTML content into a webpage by replacing elements that have the "w3-include-html" attribute
 * with the content of the specified file.
 * @async
 * @param {string} currentPage - The name of the current page.
 */
async function includeHTML(currentPage) {
  let includeElements = document.querySelectorAll('[w3-include-html]');
  for (let i = 0; i < includeElements.length; i++) {
    const element = includeElements[i];
    file = element.getAttribute('w3-include-html');
    let resp = await fetch(file);
    if (resp.ok) {
      element.innerHTML = await resp.text();
      getElement();
    } else {
      element.innerHTML = 'Page not found';
    }
  }
}
/**
 * Shows the logout button in the header by removing the 'header-d-none' class from its corresponding HTML element.
 */
function showLogOut() {
  document.getElementById('header-log-out').classList.remove('header-d-none');
}

/**
 * Redirects the user to the login page.
 */
function logout() {
  window.location.href = 'index.html';
  deleteAllCookies();
}

/**
 * Toggles the display of the log out area and hides/shows the "New Contact" button accordingly.
 */

function toggleShowLogOutArea() {
  try {
    if (activLogOutArea) {
      activLogOutArea = false;
      document.getElementById('header-log-out').classList.add('header-d-none');
      document
        .getElementById('contacts-newcontact-btn-resp')
        .classList.remove('d-none');
    } else {
      activLogOutArea = true;
      document
        .getElementById('header-log-out')
        .classList.remove('header-d-none');
      document
        .getElementById('contacts-newcontact-btn-resp')
        .classList.add('d-none');
    }
  } catch (error) {}
}

/**
 * Sets the current active page element on the side bar by adding the 'side-bar-position' class to it. (blue focus/active)
 * Uses the activePage variable to determine the current page and creates an ID for the corresponding element in the side bar.
 * Is called in includeHTML-function.
 */

function getElement() {
  let lastSegment = activePage.substring(activePage.lastIndexOf('/') + 1);
  let tempTrimmed = lastSegment.replace(/^\/|\.html$/g, '');
  let activePageAsID = 'side-bar-' + tempTrimmed;

  let currentSideElement = document.getElementById(activePageAsID);
  if (currentSideElement !== null) {
    currentSideElement.classList.add('side-bar-position');
  }
}

/**
 * Function that returns the current time plus 1h as value
 * @returns {now} time - the current date + time + 1h
 */
function getCookieExpireTime() {
  let now = new Date();
  let time = now.getTime();
  // let expireTime = time + (24 * 60 * 60 * 1000); //Calculates the miliseconds 24 h * 60 min * 60 sec * 1000 ms
  let expireTime = time + 1 * 60 * 60 * 1000; //Calculates the miliseconds for 1h  -> 1h * 60 min * 60 sec * 1000 ms
  now.setTime(expireTime); // sets the time to the expiration date
  return now;
}

////<--------- Function for Image Changing --------->

/**
 * Sets a cookie,
 * with an expiration time calculated by the function 'getCookieExpireTime'.
 */
function setCookieUser(user) {
  // übergeben wird der Vor und Nachname z.B. Carmen Birkle z.B. bei der Einlog Funktion
  let now = getCookieExpireTime();
  const lowercaseName = user.toLowerCase().replace(' ', '');
  document.cookie =
    'user = ' + lowercaseName + '; expires=' + now.toUTCString() + '; path=/';
}

/**
 * Changes the profile image based on the value of the "user" cookie.
 * note: since there is no image upload option, this has been fixed.
 */
function checkProfileImage() {
  const img = document.getElementById('header-profile-img');
  switch (true) {
    case document.cookie.includes('user=carmenbirkle'):
      img.src = './assets/img/profile-images/carmenbirkle.jpg';
      break;
    case document.cookie.includes('user=pascalgajewski'):
      img.src = './assets/img/profile-images/pascalgajewski.jpg';
      break;
    case document.cookie.includes('user=danielhartmann'):
      img.src = './assets/img/profile-images/danielhartmann.jpg';
      break;
    default:
      img.src = './assets/img/profile-images/guest.svg';
  }
}

function changeProfileImage() {
  if (
    window.location.pathname.includes('summary') ||
    window.location.pathname.includes('legal-notice') ||
    window.location.pathname.includes('help') ||
    window.location.pathname.includes('contacts') ||
    window.location.pathname.includes('board') ||
    window.location.pathname.includes('add-task')
  ) {
    checkProfileImage();
  }
}

/**
 * Deletes the cookies from the current document.
 */
function deleteAllCookies() {
  const cookies = document.cookie.split(';');

  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i].trim();
    if (cookie.indexOf('user=') == 0) {
      document.cookie = cookie + '; expires=Thu, 01 Jan 1970 00:00:00 UTC';
    }
    if (cookie.indexOf('greetingResponsiveDone=true') == 0) {
      document.cookie = cookie + '; expires=Thu, 01 Jan 1970 00:00:00 UTC';
    }
  }
}
