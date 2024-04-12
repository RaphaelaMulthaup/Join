let users = [];
let currentUser = []; 
let reset = [];
let fillIn = []; //wenn true dann autoFillIn starten, sonst nicht // oder in den Cockies speicher wo ich noch nicht weiß wie das geht X-)

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
    users = JSON.parse(await getItem('users', 'currentUser'));
    currentUser = JSON.parse(await getItem('currentUser'));
    } catch (e){
        console.error('Loading error:' , e);
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
function logIn(){
    let email = document.getElementById('email');
    let password = document.getElementById('password');
    let alertPw = document.getElementById('alert');
    let user = users.find( u => u.email == email.value && u.password == password.value)
    if(user) {
        console.log ('User gefunden')
        currentUser = user; 
        saveCurrentUser();
        console.log (currentUser)
    } else {
        console.log ('User nicht gefunden')
        password.parentElement.style.border = '2px solid #FE818F';
        alertPw.innerHTML =` <span>Wrong password Ups! Try again.</span>`;

    }
}

async function saveCurrentUser(){
    await setItem('reset last currentUser', JSON.stringify(reset));
    await setItem('currentUser', JSON.stringify(currentUser));
    console.log ('Hochgesendete Daten', currentUser)
}
 
function autoFillIn(){
    
}