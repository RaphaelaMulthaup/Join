let users = [];

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
}