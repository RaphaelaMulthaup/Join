/**
 * Initializes the application by loading the users.
 * @async
 * @function init
 * @returns {Promise<void>}
 */
async function init(){
    await loadusers();
}

/**
 * Loads the list of users from the data source.
 * @async
 * @function loadusers
 * @returns {Promise<void>}
 */
async function loadusers(){
    try {
        users = await loadData("users");
    } catch (e){
        //console.error('Loading error:' , e);
    }
}

/**
 * user registration
 */
/**
 * Handles the registration process.
 * @async
 * @function register
 * @returns {Promise<void>}
 */
async function register() {
    event.preventDefault();
    let password = document.getElementById("passwordInput").value;
    let confirmPassword = document.getElementById("passwordInputConfirm").value;

    if (!validatePasswords(password, confirmPassword)) return;

    registerBtn.disabled = true;
    let users = await loadData('users') || [];

    if (checkIfUserExists(users, user.value, email.value)) return;

    addUser(users, user.value, email.value, password);
    await putData("/users", users);
    //console.log('Hochgesendete Daten', users);
    
    resetForm();
    setTimeout(() => { redirectToHome();
    }, 1500);
}

/**
 * Validates if the passwords match.
 * @function validatePasswords
 * @param {string} password - The entered password.
 * @param {string} confirmPassword - The password confirmation.
 * @returns {boolean} - Returns true if passwords match, otherwise false.
 */
function validatePasswords(password, confirmPassword) {
    let confirm = document.getElementById('confirm');
    let alertPw = document.getElementById('alert');

    if (password !== confirmPassword) {
        confirm.style.border = '2px solid #FE818F';
        alertPw.innerHTML = `<span>Ups! Your passwords don't match</span>`;
        return false;
    }
    return true;
}

/**
 * Checks if a user or email already exists.
 * @function checkIfUserExists
 * @param {Array<Object>} users - The list of users.
 * @param {string} username - The username to check.
 * @param {string} email - The email to check.
 * @returns {boolean} - Returns true if user or email exists, otherwise false.
 */
function checkIfUserExists(users, username, email) {
    if (users.some(obj => obj.name === username)) {
        alert('Der Name existiert bereits.');
        registerBtn.disabled = false;
        return true;
    }

    if (users.some(obj => obj.email === email)) {
        alert('Die E-Mail existiert bereits.');
        registerBtn.disabled = false;
        return true;
    }
    return false;
}

/**
 * Adds a new user to the users list.
 * @function addUser
 * @param {Array<Object>} users - The list of users.
 * @param {string} username - The username to add.
 * @param {string} email - The email to add.
 * @param {string} password - The password to add.
 */
function addUser(users, username, email, password) {
    let initials;
    const [firstName, lastName] = username.split(" ").map(name => name.charAt(0).toUpperCase());
            if (lastName !== undefined) {
                initials = firstName + lastName;
            } else{
                initials = firstName;
            }

    users.push({
        name: username,
        email: email,
        password: password,
        initials: initials
    });
}

/**
 * Redirects the user to the home page.
 * @function redirectToHome
 */
function redirectToHome() {
    window.location.href = 'index.html';
}

/**
 * Resets the registration form.
 * @function resetForm
 */
function resetForm() {
    document.getElementById('slideInBG').style.display = 'block';
    document.getElementById('signupForm').reset();
}