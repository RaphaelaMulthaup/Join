let users = [];
let currentUser = []; 

async function init() {
    loadusers();
}

/**
 * load users form storage
 */
async function loadusers(){
    try {
    users = JSON.parse(await getItem('users'));
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

function logIn(){
    let email = document.getElementById('email');
    let password = document.getElementById('password');
    let msgBox = document.getElementById('msgBox');
    let user = users.find( u => u.email == email.value && u.password == password.value)
    if(user) {
        console.log ('User gefunden')
        currentUser = user; 
        console.log (currentUser)
    } else {
        console.log ('User nicht gefunden')
        msgBox.innerHTMl = 'Du hast dich nicht erfoglreich registriert';

    }
}

    // const urlParams = new URLSearchParams(window.location.search);
    // const msg = urlParams.get('msg');
    
    // if(msg){
    //     msgBox.innerHTMl = msg;
    // }
        