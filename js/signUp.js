let allUsers = [];

async function init(){
    loadusers();
}

async function loadusers(){
    try {
    users = JSON.parse(await getItem('users'));
    allUsers = JSON.parse(await getItem('allUsers'));
    } catch (e){
        console.error('Loading error:' , e);
    }
}

/**
 * user registration
 */
async function register(){
    registerBtn.disabled = true;
       let allUsers = JSON.parse(await getItem('users')) || [];

    if (allUsers.some(obj => obj.name === user.value)) {
        alert('Der Name existiert bereits.');
        return;
    }

    if (allUsers.some(obj => obj.email === email.value)) {
        alert('Die E-Mail existiert bereits.');
        return;
    }
    allUsers.push({
        name: user.value,
        email: email.value,
        password: passwordInput.value,
    });
       await setItem('users', JSON.stringify(allUsers)); 
       console.log ('Hochgesendete Daten', allUsers)
}