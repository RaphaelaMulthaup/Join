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
    try {
    users = JSON.parse(await getItem('users'));
    currentUser = JSON.parse(await getItem('currentUser'));
    checkboxValue = JSON.parse(await getItem('checkboxValue'));
    fillInValues();

    } catch (e){
        console.error('Loading error:' , e);//debugging error
    }
}

/**
 * user registration
 */
async function register(){
    submitButton.disabled = true;
    users.push({
        name: user.value,
        email: email.value,
        password: passwordInput.value,
    });
    await setItem('users', JSON.stringify(users)); 
    console.log ('Hochgesendete Daten', users)
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
    await setItem('currentUser', JSON.stringify({}));
    await setItem('currentUser', JSON.stringify(currentUser));
    await setItem('checkboxValue', JSON.stringify(checkboxValue));
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
    await setItem('currentUser', JSON.stringify({}));
    window.location.href = 'summary.html';
}