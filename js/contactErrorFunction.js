/**
 * Main function to register a new contact by verifying input fields, checking for duplicate names and emails,
 * creating a new user, and updating the user list.
 *
 * @async
 * @function registerContact
 * @returns {Promise<void>}
 */
async function registerContact() {
    registerBtn.disabled = true;
  
    let users = await loadData("/users");

    if (isNameOrEmailTaken(users)) {
        return;
    }    

    let newUser = createNewUser();
    await addUser(users, newUser);
}

/**
 * Checks if the given name or email is already taken in the users list.
 *
 * @function isNameOrEmailTaken
 * @param {Array<Object>} users - The array of current users.
 * @returns {boolean} True if the name or email is taken, false otherwise.
 */
function isNameOrEmailTaken(users) {
    const userField = document.getElementById('user');
    const emailField = document.getElementById('email');
    const alertUser = document.getElementById('alertUser');
    const alertEmail = document.getElementById('alertEmail');

    // Reset previous styles and messages
    userField.parentElement.style.border = '';
    emailField.parentElement.style.border = '';
    alertUser.innerHTML = '';
    alertEmail.innerHTML = '';

    const nameTaken = users.some(obj => obj.name === userField.value);
    const emailTaken = users.some(obj => obj.email === emailField.value);

    if (nameTaken || emailTaken) {
        if (nameTaken) {
            userField.parentElement.style.border = '2px solid #FE818F';
            alertUser.innerHTML = `<span>Name already isNameOrEmailTaken.</span>`;
        }
        if (emailTaken) {
            emailField.parentElement.style.border = '2px solid #FE818F';
            alertEmail.innerHTML = `<span>The email already exists.</span>`;
        }
        return true;
    }
    return false;
}

/**
 * Creates a new user object from input fields.
 *
 * @function createNewUser
 * @returns {Object} The new user object containing name, email, and phone properties.
 */
function createNewUser() {
    return {
        name: user.value,
        email: email.value,
        phone: phone.value,
    };
}

/**
 * Adds a new user to the list, sorts the list, assigns initials, saves the updated list,
 * assigns a random background color, and updates the data on the server.
 *
 * @async
 * @function addUser
 * @param {Array<Object>} users - The array of current users.
 * @param {Object} newUser - The new user to add.
 * @returns {Promise<void>}
 */
async function addUser(users, newUser) {
    users.push(newUser);
    await abcOrder(users);
    await addInitialsToUsersAndSave(users);
    await randomBackgroundColor(users)
    await putData("/users", users);
    console.log('Hochgesendete Daten', users);
    closeAddContact();
    await renderContactList(users);
    confirmation();
    loadusers();
}

