async function init(){
    await loadusers();
   checkPasswords();
}

async function loadusers(){
    try {
        users = await loadData("users");
    } catch (e){
        console.error('Loading error:' , e);
    }
}

/**
 * user registration
 */
async function register(){
    registerBtn.disabled = true;
       let users = await loadData('users') || [];

    if (users.some(obj => obj.name === user.value)) {
        alert('Der Name existiert bereits.');
        return
    }

    if (users.some(obj => obj.email === email.value)) {
        alert('Die E-Mail existiert bereits.');
        return;
    }
    users.push({
        name: user.value,
        email: email.value,
        password: passwordInput.value,
    });
       await putData("/users",users);
       console.log ('Hochgesendete Daten', users)

}