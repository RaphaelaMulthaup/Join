let users = [];

async function init() {
    loadusers();

}

async function loadusers(){
    try {
    users = JSON.parse(await getItem('users'));
    } catch (e){
        console.error('Loading error:' , e);
    }
}

async function register(){
    submitButton.disabled = true;
    users.push({
        name: user.value,
        email: email.value,
        password: passwordInput.value,
    });
    await setItem('users', JSON.stringify(users)); 
    document.getElementById('signupForm').reset();
}

// function resetForm() {
//     email.value = '';
//     passwordInput.value = '';
//     submitButton.disabled = false;
// }

function resetData() {
    setItem(JSON.stringify(''));
}