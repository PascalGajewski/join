function getUserLeftTemplate(contact) {
  return `
            <div class="contacts-information-top">
                <div class="contact-icon" style="background-color: rgb(${
                  contact.bgcolor
                })";>
                    <div class="contact-initals-big">${contact.initals}</div>
                </div>
                <div class="contact-info-top-right">
                    <div class="contact-name">${contact.fullname}</div>
                    <div class="add-task" onclick="contactsOpenAddTask('${contact.fullname}')">
                        <img src="./assets/img/icons/contact-add-task.png" alt="+">
                        <div>Add Task</div>
                    </div>
                </div>
            </div>

            <div class="contacts-information-center">
                <div class="contacts-info-center-titel">Contact information</div> 
                <div class="contacts-config">
                    <div class="contacts-edit" onclick="contactsShowOverlayEdit(contacts, ${
                      contact.number
                    })">
                        <img src="./assets/img/icons/contact-edit.png" alt="edit">
                        <div>Edit Contact</div>
                    </div>
                   
                    <div  class="contacts-edit" onclick="deleteContacts(${
                      contact.number
                    })"> 
                        <img class="contacts-trash" src="./assets/img/icons/contacts-trash-black.png" alt="delete">        
                        <div>Delete Contact</div>
                    </div>
                </div>
                </div>

            <div class="contacts-information-bottom">
            <div>
                <div>
                    Email
                </div>
                <div class="contacts-info-botton-email contacts-info-botton-content">
                ${contact.email}
                </div>
            </div>
            <div>
                <div>
                    <div>
                        Phone
                    </div>
                    <div class="contacts-info-botton-content">
                    ${contact.phone.slice(0, 4)}-${contact.phone.slice(4)}
                    </div>
                </div>

            </div>
            </div>
`;
}

function mobileLeftTemplate(contact) {
  return `
    <div id="mobileLeftTemplate" class="">

        <div class="contacts-titel-mobile">
            <div class="contacts-sub-title-mobile">Kanban Project Management Tool</div>
            <img class="contacts-mobile-back" src="./assets/img/icons/help-side-back.svg" onclick="contactsCloseMobileContacts()" alt="X">
            <h1>Contacts</h1>
            <h3>Better with a team</h3>
            <div class=contacts-mobile-line></div>
        </div>

            <div class="contacts-information-top">
                <div  class="contact-icon-mobile" style="background-color: rgb(${
                  contact.bgcolor
                });">
                    <div class="contact-initals-big">${contact.initals}</div>
                </div>
                <div class="contact-info-top-right">
                    <div class="contact-name">${contact.fullname}</div>
                    <div class="add-task" onclick="contactsOpenAddTask('${contact.fullname}')">
                        <img src="./assets/img/icons/contact-add-task.png" alt="+">
                        <div>Add Task</div>
                    </div>
                </div>
            </div>

            <div class="contacts-information-center">
                <div class="contacts-info-center-titel">Contact information</div>
                    <div class="contacts-edit" onclick="contactsShowOverlayEdit(contacts, ${
                      contact.number
                    })">
                        <img src="./assets/img/icons/contact-edit.png" alt="edit">
                        <div>Edit Contact</div>
                    </div>
                </div>

            <div class="contacts-information-bottom">
            <div>
                <div>
                    Email
                </div>
                <div class="contacts-info-botton-email contacts-info-botton-content">
                ${contact.email}
                </div>
            </div>
            <div>
                <div>
                    <div>
                        Phone
                    </div>
                    <div class="contacts-info-botton-content">
                        ${contact.phone.slice(0, 4)}-${contact.phone.slice(4)}
                    </div>
                </div>
            </div>
            <div class="btn-trash" onclick="deleteContacts(${contact.number})"> 
                <img class="contacts-trash" src="./assets/img/icons/contacts-trash.png" alt="delete">
            </div>


            <div class="btn-mobil-edit" onclick="contactsShowOverlayEdit(contacts, ${
              contact.number
            })"> 
                <img src="./assets/img/icons/contacts-edit-mobile.png" alt="edit">
            </div>
    </div>
    `;
}

function contactListLetterTemplate(letter) {
  return `
        <div id="contacts-letter-container-${letter}" class="contacts-letter-container">
            <div class="contacts-first-letter">
                ${letter}
            </div>
            <hr>
            <div id="contacs-render-single-Data-${letter}">  
            </div>
        </div>  
    `;
}

function contactListContactTemplate(contact) {
  return `
        <div id="contacs-singele-data${contact.number}" class="contacts-single-data" onclick="contactsShowUser(contacts, ${contact.number})">
            <div class="contacts-initals" style="background-color: rgb(${contact.bgcolor});">
                <div class="contacts-initals"> ${contact.initals} </div>
            </div>
            <div class="contacts-details">
                <div>${contact.fullname}</div>
                <div class="contacts-single-email">${contact.email}</div>
            </div>
        </div>
    `;
}

function contactsShowContactToEditTemplate(contact) {
  return `
            <div id="render-popup-edit-Contact" class="contacts-overlay" onclick="closeAllPopups()">
                <div class="contacts-add-contact fadeInRight fadeInBottom" onclick="doNotClose(event)">
                    <div class="contacts-add-contact-left">
                    <img class="contacts-white-edit" src="./assets/img/icons/X-white.png"
                    onclick="contactsCloseOverlayEdit()" alt="X">
                        <img class="contacts-join-logo"src="./assets/img/side-bar-join-logo.svg" alt="Join">
                        <h1>Edit Contact</h1>
                        <hr>
                    </div>
                    <div class="contacts-add-contact-right">
                        <img class="contacts-full" src="./assets/img/icons/contacs-x.svg"
                            onclick="contactsCloseOverlayEdit()" alt="X">
                        <div class="contact-img" style="background-color: rgb(${contact.bgcolor});">
                            <div class="contact-initals-big">${contact.initals}</div>
                    </div>
                        <form class="form-mobile" action="" onsubmit="editContact(${contact.number}); return false">
                            <div class="contacts-input-with-icon">
                                <input id="contacts-edit-fullname" class="contact-input" type="text" 
                                    placeholder="First- and Lastname"  value="${contact.fullname}" 
                                    title="Gebe Deinen Vor- und Nachnamen an (2 Wörter)">
                                <span class="contacts-icon-name"></span>
                            </div>
                            <div class="contacts-input-with-icon">
                                <input id="contacts-edit-email" class="contacts-email contact-input" type="email" required placeholder="Email"
                                    value="${contact.email}">
                                <span class="contacts-icon-email"></span>
                            </div>

                            <div class="contacts-input-with-icon">
                                <input id="contacts-edit-phone" class="contact-input" type="number" required placeholder="Phone" pattern="[0-9]+"
                                    value="${contact.phone}" title="Das Format sollte diesem Schema entsprechen: 012345678">
                                <span class="contacts-icon-phone"></span>
                            </div>

                            <div class="contacts-btn-container-edit">
                                <button type="submit" class="contacts-btn-save-contact">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
        </div>
    `;
}

function contactsShowCantDelTemplate(taskTitle) {
  const titleListHtml = taskTitle.map((title) => `<li>${title}</li>`).join('');

  return `
            <div id="render-popup-edit-Contact" class="contacts-overlay" onclick="closeAllPopups()">
                <div class="contacts-add-contact fadeInRight fadeInBottom" onclick="doNotClose(event)">
                    <div class="contacts-add-contact-left">
                    <img class="contacts-white-edit" src="./assets/img/icons/X-white.png"
                    onclick="contactsCloseOverlaycantDel()" alt="X">
                
                        <h2 class="deltitle">Contact can\'t be deleted</h2>
                
                        <hr>
                    </div>
                    <div class="contacts-add-contact-right delete">
                    <div class="taskdel">     
                        <p> This contact is still assigned to other tasks.</p> 
                        <p> To delete: </br> Distribute the Tasks differently. </p>
                        </br>
                        <p> Linked Task-Titel:</p>
                    </div>
                
                     <ul class="scroll">${titleListHtml}</ul>
                        <img class="contacts-full" src="./assets/img/icons/contacs-x.svg"
                            onclick="contactsCloseOverlaycantDel()" alt="X">
                           <a href="board.html" class="contacts-btn-save-contact contacts-btn-cantdel">Board</a>
                    </div>
                </div>
        </div>
    `;
}
