/**
 * This function starts the beginning Join logo animation
 */
function startAnimation() {
  if (window.innerWidth >= 768) {   // for big screens
    document.getElementById('login-logo').classList.add('animation');
    setTimeout(showLoginCard, 1000);
  }
  if (window.innerWidth < 768) {   // for small screens
    responsiveLogin();
  }
}

function showLoginCard() {
  document.getElementById('login-content').classList.remove('d-none');
  document.getElementById('login-animation-container').classList.add('d-none');
}

function responsiveLogin() {
  document.getElementById('login-logo').classList.add('d-none');
  document.getElementById('login-logo-responsive').classList.remove('d-none');
  document.getElementById('login-logo-responsive').classList.add('animation-responsive');
  setTimeout(showLoginCard, 1000);
}

/**
 * This function animates the "Send Mail" confirmatioon
 */
function sendMailConfirm() {
  document.getElementById('send-mail-confirm').classList.remove('d-none');
  setTimeout(hideMailConfirm, 3000);
}

function hideMailConfirm() {
  document.getElementById('send-mail-confirm').classList.add('d-none');
  window.location.replace('reset-password.html');
}
/**
 * This function animates the "New Passord set" confirmatioon
 */
function sendNewPasswordConfirm() {
  document.getElementById('send-new-password-confirm').classList.remove('d-none');
  setTimeout(hidePasswordConfirm, 3000);
}

function hidePasswordConfirm() {
  document.getElementById('send-new-password-confirm').classList.add('d-none');
  window.location.replace('index.html');
}

/**
 * This function animates the "Signup successful" confirmatioon
 */
function sendNewSignupConfirm() {
  document.getElementById('send-new-signup-confirm').classList.remove('d-none');
  setTimeout(hideNewSignupConfirm, 3000);
}

function hideNewSignupConfirm() {
  document.getElementById('send-new-signup-confirm').classList.add('d-none');
  window.location.replace('index.html');
}

/**
 * This function logs in a user
 */

function loginUser() {
  let email = document.getElementById('useremail');
  let password = document.getElementById('userpassword');
  let user = users.find((u) => u.email == email.value && u.password == password.value);
  if (user) {
    setCookieUser(user['name']);
    if (document.getElementById('remember-login').checked) {
      setCookieRememberUser(user['email']);
    }
    window.location.replace('summary.html');
  } else {
    showLoginError();
  }
}

function showLoginError(){
 document.getElementById('login-user-error').classList.remove('d-none');
 setTimeout(hideLoginError, 3000);
}

function hideLoginError(){
  document.getElementById('login-user-error').classList.add('d-none');
 }

/**
 * This function logs in the "Guest" user
 */

function guestLogin() {
  setCookieUser('Guest');
  window.location.replace('summary.html');
}

/**
 * This function registries a new User and submits the new User Data to the backend server
 * (In this version the users array is reloaded with the original users, so that the array is constant)
 */

async function addNewUser() {
  let name = document.getElementById('newusername');
  let email = document.getElementById('newuseremail');
  let password = document.getElementById('newuserpassword');
  users.push({
    name: name.value,
    email: email.value,
    password: password.value,
  });
  await backend.setItem('users', JSON.stringify(users));
}

/** This function sets a cookie for the remember function on the login website
 */

function setCookieRememberUser(currentUserMail) {
  let now = getCookieUserExpireTime();
  document.cookie =
    'email =' + currentUserMail + '; expires=' + now.toUTCString() + ';path=/';
}

/** This function calculates the expire time of the remember user cookie
 */

function getCookieUserExpireTime() {
  let now = new Date();
  let time = now.getTime();
  let expireTime = time + 24 * 1 * 60 * 60 * 1000; //Calculates the miliseconds for 24h  -> 24* 1h * 60 min * 60 sec * 1000 ms
  now.setTime(expireTime); // sets the time to the expiration date
  return now;
}

/** This function gets the remember user cookie
 */

function getRememberUserCookie(cname) {
  let name = cname + '=';
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return '';
}

/** This writes the remember user cookie
 */

function writeRememberUserMail() {
  if (getRememberUserCookie('email')) {
    document.getElementById('useremail').setAttribute('value', `${getRememberUserCookie('email')}`);
  }
}
