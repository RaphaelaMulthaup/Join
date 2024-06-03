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
 * user logIn, passwordcheck and save currentUser for the next page in storage
 */
async function logIn(){
    let email = document.getElementById('email');
    let password = document.getElementById('password');
    let alertPw = document.getElementById('alert');
    let user = users.find( u => u.email == email.value && u.password == password.value)
    if(user) {
        console.log ('User gefunden')
        currentUser = user; 
        await saveCurrentUser();
        window.location.href = 'summary.html';
    } else {
        console.log ('User nicht gefunden')
        password.parentElement.style.border = '2px solid #FE818F';
        alertPw.innerHTML =` <span>Wrong password Ups! Try again.</span>`;
    }
}

/**
 * saves currentUser and the checkboxValue
 */
async function saveCurrentUser(){
    var checkboxValue = rememberMe();
    await putData("/currentUser",currentUser);
    await putData('/checkboxValue', checkboxValue);
    console.log ('Hochgesendete Daten', currentUser, 'checkbox-Wert', checkboxValue);
}

/**
 * 
 * @returns checkboxValue
 */
function rememberMe() {
    var checkbox = document.getElementById('checkbox');
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
}