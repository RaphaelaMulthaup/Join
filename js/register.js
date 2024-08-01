let reset = [];
let checkboxValue = [];

/**
 * load users, currentUser, fillIn if necessery
 */
async function init() {
    loadusers();
} 

/**
 * load users form storage
 */
async function loadusers(){
    users = await loadData("users");
    currentUser = await loadData("currentUser");
    checkboxValue = await loadData('checkboxValue');
    fillInValues();
}

/**
 * Handles user login by verifying credentials and redirecting to the summary page if successful.
 * Displays appropriate error messages if the login fails.
 */
async function logIn() {
    let email = document.getElementById('email');
    let password = document.getElementById('password');
    let alertPw = document.getElementById('alertPw');
    let alertUser = document.getElementById('alertUser');

    // Verify user credentials
    let result = await verifyUser(email, password);

    if (result.success) {
        window.location.href = 'summary.html';
    } else {
        // Display error messages
        displayError(result.errorType, email, password, alertUser, alertPw);
    }
}

/**
 * Verifies the user's email and password.
 *
 * @param {HTMLInputElement} email - The email input element.
 * @param {HTMLInputElement} password - The password input element.
 * @returns {Promise<Object>} A promise that resolves to an object indicating the result of the verification.
 *                             The object has a `success` property (boolean) and optionally an `errorType` property (string).
 *                             `errorType` will be either 'password' or 'user' if `success` is false.
 */
async function verifyUser(email, password) {
    let user = users.find(u => u.email == email.value);

    if (user) {
        if (user.password == password.value) {
            console.log('User gefunden');
            currentUser = user;
            await saveCurrentUser();
            return { success: true };
        } else {
            console.log('Falsches Passwort');
            return { success: false, errorType: 'password' };
        }
    } else {
        console.log('Benutzer existiert nicht');
        return { success: false, errorType: 'user' };
    }
}

/**
 * Displays error messages and updates the UI based on the type of error.
 *
 * @param {string} errorType - The type of error to display. Can be 'password' or 'user'.
 * @param {HTMLInputElement} emailElement - The email input element.
 * @param {HTMLInputElement} passwordElement - The password input element.
 * @param {HTMLElement} alertUser - The HTML element where the user error message will be displayed.
 * @param {HTMLElement} alertPw - The HTML element where the password error message will be displayed.
 */
function displayError(errorType, emailElement, passwordElement, alertUser, alertPw) {
    if (errorType === 'password') {
        passwordElement.parentElement.style.border = '2px solid #FE818F';
        alertPw.innerHTML = `<span>Wrong password. Ups! Try again.</span>`;
    } else if (errorType === 'user') {
        emailElement.parentElement.style.border = '2px solid #FE818F';
        alertUser.innerHTML = `<span>User does not exist. Please check your email address or sign up.</span>`;
    }
}

/**
 * saves currentUser and the checkboxValue
 */
async function saveCurrentUser(){
    let checkboxValue = rememberMe();
    await putData("/currentUser",currentUser);
    await putData('/checkboxValue', checkboxValue);
    // console.log ('Hochgesendete Daten', currentUser, 'checkbox-Wert', checkboxValue);
}

/**
 * 
 * @returns checkboxValue
 */
function rememberMe() {
    let checkbox = document.getElementById('checkbox');
    return checkbox.checked;
}

/**
 * if checkbox was true last time this time currentUser is filled in
 */
function fillInValues() {
    if (checkboxValue) {
        document.getElementById('email').value = currentUser.email;
        document.getElementById('password').value = currentUser.password;
    }
}

/**
 * reset currentUser when logging in as guest
 */
async function resetCurrentUser(){
    await putData('currentUser');
    await putData('checkboxValue', false);
    await putData('initialsHeader', 'G');
    window.location.href = 'summary.html';
}