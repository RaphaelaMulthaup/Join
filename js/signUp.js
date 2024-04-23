async function init(){
    loadusers();
}

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
    registerBtn.disabled = true;

    const nameExists = users.some(user => user.name === user.value);
    const emailExists = users.some(user => user.email === email.value);
    if (nameExists) {
        console.log('Der Name existiert bereits.');
        return;
    }

    if (emailExists) {
        console.log('Die E-Mail existiert bereits.');
        return;
    }
    users.push({
        name: user.value,
        email: email.value,
        password: passwordInput.value,
    });
    await setItem('users', JSON.stringify(users)); 
    console.log ('Hochgesendete Daten', users)
}