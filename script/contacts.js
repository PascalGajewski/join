'use strict';
/**
 * contact.js contains all functions that are relevant for the contacts.html.
 * Windows behavior, saving, modifying and deleting records, as well as helper functions.
 * @author Carmen Birkle
 * @version 1.0
 */

/**
 * @param {Array} contacts - Array of contacts
 */
let contacts = [];
/**
 * @param {Array} sortContacts - Array for sortet contacts, sort by Initial char
 */
let sortContacts = [];

/**
 * Function so Display the Overlay to create an new Contact
 */
function contactsShowOverlayNew() {
  let overlay = document.getElementById('contacts-popup-add-contact');
  overlay.style.display = 'flex';
}

/**
 * Function to Close the Overlay for create an new Contact
 */
function contactsCloseOverlayNew() {
  let overlay = document.getElementById('contacts-popup-add-contact');
  overlay.style.display = 'none';
}

/**
 * Function to cancel a contact creation. closes the overlay and calls the
 * funktion to resets the fields
 */
function contactsCancelNewContact() {
  contactsCloseOverlayNew();
  contacsResetNewContact();
}

/**
 * Function to clear the input fields
 */
function contacsResetNewContact() {
  document.getElementById('contact-name').value = '';
  document.getElementById('contact-email').value = '';
  document.getElementById('contact-tel').value = '';
}

/**
 * Function to display the overlay to edit a contact
 */
function contactsCloseOverlayEdit() {
  document
    .getElementById('contacts-popup-edit-Contact')
    .classList.add('d-none');
}

/**
 * Function to display the overlay to add a new task
 */
function contactsOpenAddTask(name) {
  document.getElementById('contacts-add-task').classList.remove('d-none');
  chosenAssignedTo = [];
  assignedToUsers = [];
  chosenAssignedTo.push(name);
  const selectedContact = contacts.find(contact => contact.fullname === name);
  let bgColor = selectedContact.bgcolor;
  let initals = selectedContact.initals;
  assignedToUsers.push({ bgColor: bgColor, initals: initals });
  initAddTaskTemplates();
  renderAssignedUsers();
}

/**
 * Funktion to close the overlay from new task
 */
function contactsCloseAddTask() {
  document.getElementById('contacts-add-task').classList.add('d-none');
}

/**
 * Function to close all Popup-Windows and Overlays. It'll be called by click on the background
 * in combination with doNotClose();
 */
function closeAllPopups() {
  contactsCancelNewContact();
  contactsCloseOverlayEdit();
  contactsCloseAddTask();
}

/**
 * Function to avoid to call the closeAllPopup() Function for close all Popup Windows and Overlays.
 * @param {event} event - clickevent on a specific overlay element
 */
function doNotClose(event) {
  event.stopPropagation();
}

/**
 * Groups an array of contacts by their initials
 * @param {Array} contacts - An array of contact objects, each with a 'fullname' property
 * @returns {Map} A Map object with keys being the first letters of the fullnames (in uppercase),
 * and values being an array of contact objects with corresponding initials
 */
function groupContactsByInitials(contacts) {
  let initialsMap = new Map();
  contacts.forEach((contact) => {
    let name = contact.fullname.trim(); // removes blank character
    let initials = name.charAt(0).toUpperCase();
    if (!initialsMap.has(initials)) {
      initialsMap.set(initials, []);
    }
    initialsMap.get(initials).push(contact);
  });
  return initialsMap;
}

/**
 * Sorts the contacts alphabetically within each group of initials in the initialsMap.
 * @param {Map} initialsMap - The map of contacts grouped by their initials.
 * @returns {Map} The sorted map of contacts grouped by their initials.
 */
function sortContactsAlphabetically(initialsMap) {
  initialsMap.forEach((contacts, initials) => {
    contacts.sort((a, b) => {
      if (a.fullname < b.fullname) {
        return -1;
      }
      if (a.fullname > b.fullname) {
        return 1;
      }
      return 0;
    });
  });
  return initialsMap;
}

/**
 * Groups the list of contacts by initials, sorts the groups alphabetically,
 * and sorts the contacts within each group by fullname.
 * @function
 * @name getSortListofContacts
 * @param {Array} contacts - The list of contacts to be sorted
 * @returns {Map} A map object containing the sorted list of contacts grouped by initials
 */
function getSortListofContacts() {
  let initialsMap = groupContactsByInitials(contacts);
  let sortedInitialsMap = new Map([...initialsMap.entries()].sort()); // sort initials alphabetically
  sortContacts = sortContactsAlphabetically(sortedInitialsMap);
}

/**
 * Render Function for Dynamic ContactList Left
 */
function contactsShowContactlist(sortContacts) {
  document.getElementById('contacts-list').innerHTML = '';
  for (let [key, value] of sortContacts) {
    document.getElementById('contacts-list').innerHTML +=
      contactListLetterTemplate(key);
    for (let contact of value) {
      if (contact.fullname.charAt(0) === key) {
        // check if the first letter of the name corresponds to the current letter
        document.getElementById(
          `contacs-render-single-Data-${key}`
        ).innerHTML += contactListContactTemplate(contact);
      }
    }
  }
}

/**
 * Displays the rendered overlay for editing contact
 * @param {Array} contacts - Array of contacts
 * @param {integer} contactNumber - unique contact number
 */
function contactsShowOverlayEdit(contacts, contactNumber) {
  contactsShowContactToEdit(contacts, contactNumber);
  document
    .getElementById('contacts-popup-edit-Contact')
    .classList.remove('d-none');
}

/**
 * Displays the rendered userdatas for editing from the selected contact
 * @param {Array} contacts - Array of contacts
 * @param {integer} contactNumber - unique contact number
 */
function contactsShowContactToEdit(contacts, contactNumber) {
  const selectedContact = contacts.find(
    (contact) => contact.number === contactNumber
  );
  document.getElementById('contacts-popup-edit-Contact').innerHTML =
    contactsShowContactToEditTemplate(selectedContact);
}

/**
 * This Funktion closed the contacts view in the mobile view
 */
function contactsCloseMobileContacts() {
  document
    .getElementById('contacts-container-right-mobile')
    .classList.add('d-none');
  document.getElementById('contacts-container-left').classList.remove('d-none');
}

/**
 * render-function to see the individual user data  on the left side in detail an render it.
 * contains a query if window size bigger then 1170 mobile or small displays are present,
 * then the function contacsshowuserMobile is called
 * @param {Object} contacts - Array of all Contacts
 * @param {integer} contactNumber - specific contact number
 */
function contactsShowUser(contacts, contactNumber) {
  const selectedContact = contacts.find(
    (contact) => contact.number === contactNumber
  );
  document.getElementById('contacts-user').innerHTML =
    getUserLeftTemplate(selectedContact);
  document.getElementById('contacts-container-right-mobile').innerHTML =
    mobileLeftTemplate(selectedContact);

  if (window.innerWidth < 1170) {
    document
      .getElementById('contacts-container-right-mobile')
      .classList.remove('d-none');
    document.getElementById('contacts-container-left').classList.add('d-none');
  } else {
    document
      .getElementById('contacts-container-right-mobile')
      .classList.add('d-none');
    document
      .getElementById('contacts-container-left')
      .classList.remove('d-none');
  }
}

/**
 * Function that continuously monitors the window size and hides and displays elements depending on the size.
 */
window.onresize = handleWindowResizeContacs;

/**
 * Is called from the window.onresize event and displays different elements depending on the window size
 */
function handleWindowResizeContacs() {
  try {
    if (window.innerWidth > 1170) {
      document
        .getElementById('contacts-container-right-mobile')
        .classList.add('d-none');
      document
        .getElementById('contacts-container-right')
        .classList.remove('d-none');
      document
        .getElementById('contacts-container-left')
        .classList.remove('d-none');
    } else {
      document
        .getElementById('contacts-container-right')
        .classList.add('d-none');
    }
  } catch (error) {}
}
/**
 * Generates a random RGB string.
 * Only colors up to the middle color spectrum are generated so that the white font color remains visible.
 * @returns {String} randomRGBColor - random RGB String
 */
function randomRGBColor() {
  let r = Math.floor(Math.random() * 156);
  let g = Math.floor(Math.random() * 156);
  let b = Math.floor(Math.random() * 156);
  let randomRGBColor = `${r},` + `${g},` + `${b}`;
  return randomRGBColor;
}

/**
 * Takes the user name and generates two initial from the two partial words
 * @param {String} name  - Username includes due to the html5 validation 2 words ( first and last name)
 * @returns {String} firstLetter - two letters representing first and last name
 */
function getInitials(name) {
  const firstLetters = name
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase());
  return firstLetters.join('');
}

/**
 * Find the highest number for contacts-numbers in the contact-array.
 * @returns {integer} - highest contacts-number
 */
function getHighestNumber() {
  let highestNumber = 0;
  contacts.forEach((contact) => {
    if (contact.number > highestNumber) {
      highestNumber = contact.number;
    }
  });
  return highestNumber;
}
/**
 * Get the name from the input field and capitalize the first letter of each word.
 * @param {string} name
 * @returns string with capitalized name
 */
function getCapitalizedName(name) {
  let words = name.split(' '); // teilt den Namen anhand von Leerzeichen auf
  let capitalizedWords = [];
  for (let word of words) {
    capitalizedWords.push(word.charAt(0).toUpperCase() + word.slice(1));
  }
  let capitalizedFullName = capitalizedWords.join(' ');
  return capitalizedFullName;
}

/**
 * Generates a contact according to a given schema. the input fields are read and stored in a contact, which is returned.
 * - initials: The initials of the name as a string.
 * - number: A unique number as an integer higher than the number of all existing contacts.
 * - fullname: The full name of the contact as a string.
 * - email: The email address of the contact as a string.
 * - phone: The phone number of the contact as a string.
 * - bgcolor: A randomly generated RGB color as a string.
 * @returns {Array} contact  - new generate contact
 *
 */
function createContact() {
  let name = document.getElementById('contact-name').value;
  let email = document.getElementById('contact-email').value;
  let phone = document.getElementById('contact-tel').value;
  let initials = getInitials(name);

  let contact = {
    initals: initials,
    number: getHighestNumber() + 1,
    fullname: getCapitalizedName(name),
    email: email,
    phone: phone,
    bgcolor: randomRGBColor(),
  };
  return contact;
}

/**
 * Shows the success message that the contact was saved
 * with a time delay of 2s
 */
function showSuccessInfo() {
  const div = document.getElementById('contacts-success');
  div.classList.add('fadeInBottomAlways');
  div.classList.remove('d-none');
  setTimeout(() => {
    contactsCloseOverlayNew();
    contacsResetNewContact();
    div.classList.remove('fadeInBottomAlways');
    div.classList.add('d-none');
  }, 2000);
}

/** Generates and saves a new contact. Stores the data in backend. Avoiding that the save button can
 *  be pressed more than once and all necessary data is updated and re-rendered
 * @async
 */
async function saveContact() {
  try {
    document.getElementById('contacts-save').disabled = true;
    const contact = createContact(); // new contact
    contacts.push(contact);
    await backend.setItem('contacts', JSON.stringify(contacts));
    showSuccessInfo();
    getSortListofContacts();
    contactsShowContactlist(sortContacts);
  } catch (error) {
    console.log(error);
  } finally {
    document.getElementById('contacts-save').disabled = false;
  }
}

/**
 * @async
 * the function dates the user data in the contacts array up and updates this to the backend. 
all views are updated and re-rendered and the window is closed
 * @param {integer} contact  contact-number
 */
async function editContact(contact) {
  updateContacts(contact);
  await backend.setItem('contacts', JSON.stringify(contacts));
  getSortListofContacts();
  contactsShowContactlist(sortContacts);
  contactsShowUser(contacts, contact);
  contactsCloseOverlayEdit();
}

/**
 * the function fetches the data from the input fields filters
 * the matching contact and index and updates the user data to the matching index
 * @param {integer} contact - contact-number
 */
function updateContacts(contact) {
  let name = document.getElementById('contacts-edit-fullname').value;
  let email = document.getElementById('contacts-edit-email').value;
  let phone = document.getElementById('contacts-edit-phone').value;

  const foundContact = contacts.find((c) => c.number === contact);
  const index = contacts.findIndex((c) => c.number === contact);

  foundContact.initals = getInitials(name);
  foundContact.fullname = name;
  foundContact.email = email;
  foundContact.phone = phone;

  contacts[index] = foundContact;
}

/**
 * based on the contact number the matching record is searched from the
 * contakt-array and the index is caught. this index dataset is deleted,
 * the contact list is re-sorted and generated and the page is reloaded
 * @async
 * @function
 * @param {integer} contact - the individual contact number, this is generated
 * dynamically in ascending order when creating a contact
 */
async function deleteContacts(contact) {
  const deleteContactName = getUserName(contact);
  if (checkContactInTask(deleteContactName)) {
    const container = document.getElementById('contacts-popup-noDel-Contact');
    container.classList.remove('d-none');
    const taskTitle = checkContactInTask(deleteContactName);
    container.innerHTML = contactsShowCantDelTemplate(taskTitle);
    return;
  } else {
    const index = contacts.findIndex((c) => c.number === contact);
    contacts.splice(index, 1);
    await backend.setItem('contacts', JSON.stringify(contacts));
    updateContactView();
  }
}

/**
 * Function to update the contact view after delete a contact
 */
function updateContactView() {
  document.getElementById('contacts-user').innerHTML = '';
  contactsCloseMobileContacts();
  getSortListofContacts();
  contactsShowContactlist(sortContacts);
}

function getUserName(contact) {
  const name = contacts.find((c) => c.number === contact);
  return name.fullname;
}

function checkContactInTask(deleteContactName) {
  const tasksWithUser = tasks.filter((task) =>
    task.contact.includes(deleteContactName)
  );
  const title = tasksWithUser.map((task) => task.title);
  if (title.length > 0) {
    return title;
  } else {
    return false;
  }
}

function contactsCloseOverlaycantDel() {
  document
    .getElementById('contacts-popup-noDel-Contact')
    .classList.add('d-none');
}
