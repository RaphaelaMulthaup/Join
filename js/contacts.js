const initials = [];

//Ich möchte das wenn die bildschirmbreite unter .. ist das der einzellen angeklickte Contact vor die anderen Contacts geschoben wird
// dabei soll ein Button mit drei Punkten erscheinen bei dem Drücken dieses Buttons soll Edit und Löschen erscheinen
// Wie mache ich das jetzt am besten.
/**
 * loadusers
*/
async function init() {
    const users = await loadusers();
    if (users) {
        abcOrder(users);
        await renderContactList(users);
    } else {
        console.error("Fehler beim Laden der Benutzerdaten.");
    }
}

/**
 * Loads users from storage, adds initials, and returns the updated user data.
 * @returns {Array} - The array of users with initials added.
 */
async function loadusers() {
    try {
        users = await loadData("/users");
        users = await addInitialsToUsersAndSave(users);
        return users;
    } catch (error) {
        console.error("Fehler beim Laden der Benutzerdaten:", error);
        return [];
    }
}

/**
 * Sorts an array of users alphabetically by name.
 * @param {Array} users - The array of users to be sorted.
 * @returns {Array} - The sorted array of users.
 */
async function abcOrder(users) {
    users.sort((a, b) => a.name.localeCompare(b.name));
    users.forEach((user, index) => {
        user.id = index +1;
    });
}

/**
 * Renders the contact list by populating index letters and associated contacts.
 */
async function renderContactList(users) {
    const container = document.getElementById('contactInput');
    const containerDetail = document.getElementById('contactDetailContainer');
    
    if (container && containerDetail) {
        container.innerHTML = '';
        containerDetail.innerHTML = '';
    }

    if (users.length === 0) return;

    const indexLetterOnly = [...new Set(users.map(user => user.name.charAt(0).toUpperCase()))];

    indexLetterOnly.forEach(letter => {
        loadFirstLetter(letter);
        console.log('indexletter', letter);
        loadContactIndex(letter, users);
    });
}


/**
 * Renders contact containers for users with names starting with the specified letter.
 * @param {string} letter - The letter to filter users by.
 * @param {Array} users - The array of users sorted alphabetically.
*/
function loadContactIndex(letter, users) {
    if (Array.isArray(users)) {
        for (let i = 0; i < users.length; i++) {
            const user = users[i];
            if (letter === user.name.charAt(0).toUpperCase()) {
                renderContactContainer(user, i);
                randomBackgroundColor(users);
            }
        }
    } else {
        console.error('Users is not an array or is undefined:', users);
    }
}

/**
 * Adds a letter and a line to the contact input container.
 * @param {string} indexLetter - The letter to be added.
 */
function loadFirstLetter(indexLetter) {
    const content = document.getElementById('contactInput');
    content.innerHTML += `
        <div class="indexContainer" id="indexLetter">${indexLetter}</div>
        <div class="line"></div>
    `;
}

/**
 * Assigns a random background color to users who don't have one.
 * Colors are randomly generated and stored for each user.
 * @returns {Promise<void>} Resolves when all user colors are set.
 */
async function randomBackgroundColor(users) {
    for (const user of users) {
        if (!user.color) {
            let color = '#' + Array.from({ length: 3 }, () => Math.floor(Math.random() * 255).toString(16).padStart(2, '0')).join('');
            user.color = color;
        }
    }
    return users;
}
/**
* Renders a contact container element based on user information.
* @param {Object} user - User information object.
* @param {number} user.index - User index.
* @param {string} user.name - User name.
* @param {string} user.email - User email.
* @param {string} user.initials - User initials for profile image.
* @param {string} user.color - Background color for the profile image.
* @returns {void}
*/
function renderContactContainer(user) {
    const content = document.getElementById('contactInput');

    // Use user.id instead of user.index
    if (typeof user.id === 'undefined') {
        console.error('user.id is undefined');
        return;
    }

    content.innerHTML += /*html*/`
        <div class="contactContainer" id="contactContainer${user.id}" onclick="openContact(${user.id}), slideOut()">
            <section class="circle bgColorCircle" id="circle${user.id}" style="background-color: ${user.color};">
                <div class="initial">${user.initials}</div>
            </section>
            <div class="userContainer">
                <div class="name" id="name${user.id}" title="${user.name}">${user.name}</div>
                <div class="email" title="${user.email}">${user.email}</div>
            </div>
        </div>
    `;
}

/**
 * Opens a contact by finding the user with the specified ID, validating the user object,
 * retrieving the content element, animating the content, and updating the content with user details.
 *
 * @function openContact
 * @param {number} id - The ID of the contact to open.
 * @returns {void}
 */
function openContact(id) {
    console.log('openContact called with id:', id);

    const user = findUserById(id);
    if (!validateUser(user)) {
        return;
    }

    const content = getContentElement();
    if (!content) {
        return;
    }

    animateContent(content);
    updateUserContent(content, user);
}



/**
 * Find a user in the array based on the ID.
 * @param {number} id - The ID of the user to find.
 * @returns {Object|null} - The user object or null if not found.
 */
function findUserById(id) {
    const user = users.find(user => user.id === id);
    console.log('User object in findUserById:', user);
    return user;
}

/**
 * Validates a user object to ensure it contains necessary properties (initials, name, id).
 *
 * @function validateUser
 * @param {Object} user - The user object to validate.
 * @returns {boolean} True if the user object is valid, false otherwise.
 */
function validateUser(user) {
    if (!user || !user.initials || !user.name || !user.id) {
        console.error('Invalid user object:', user);
        return false;
    }
    return true;
}

/**
 * Retrieves the content element with the id "contactDetailContainer" from the DOM.
 *
 * @function getContentElement
 * @returns {HTMLElement|null} The content element if found, otherwise null.
 */
function getContentElement() {
    const content = document.getElementById('contactDetailContainer');
    if (!content) {
        console.error('Element with id "contactDetailContainer" not found');
        return null;
    }
    return content;
}

/**
 * Animates the content element by applying a CSS class for slide-in animation.
 *
 * @function animateContent
 * @param {HTMLElement} content - The content element to animate.
 * @returns {void}
 */
function animateContent(content) {
    content.classList.remove('contactSlideIn');
    content.offsetWidth; // Trigger reflow
    content.classList.add('contactSlideIn');
}


    // Ihre Funktionen hier
    function slideOut() {
        const backArrow = document.getElementById('backArrow');
        const contactSlideIn = document.getElementById('contactSlideInBox');

        if (backArrow && contactSlideIn) {
            backArrow.classList.remove('hidden');
            contactSlideIn.classList.remove('hidden');
        } else {
            console.error('Element(s) not found in slideOut function.');
        }
    }

    function slideIn() {
        if (window.innerWidth < 910) {
            const backArrow = document.getElementById('backArrow');
            const contactSlideOut = document.getElementById('contactSlideOut');

            if (backArrow && contactSlideOut) {
                backArrow.classList.add('hidden');
                contactSlideOut.classList.add('hidden');
            } else {
                console.error('Element(s) not found in slideIn function.');
            }
        }
    }


/**
 * Retrieve the element where the content will be updated.
 * @returns {HTMLElement} - The content element.
 */
function updateUserContent(content, user) {
    content.innerHTML = /*html*/`
        <div class="displayFlex">
            <div class="bigCircle bgColorCircleBig" id="bigCircle" style="background-color: ${user.color};">
                <div class="initialBig" id="initialBig" >${user.initials}</div>
            </div>
            <div class="userContainerBig">
                <p class="nameBig" id="name${user.id}">${user.name}</p>
                <div class="editDelete">
                    <div class="edit" id="edit" onclick="editContactSlide(${user.id}, '${user.color}', '${user.initials}', '${user.name}', '${user.email}', '${user.phone}')">
                        <a class="edit" alt=""><p>Edit</p></a>
                    </div>
                    <div class="delete" id="delete" onclick="deleteUserAndReassignIds(${user.id})">
                        <a alt=""><p>Delete</p></a>
                    </div>
                </div>
            </div>
        </div>
        <div class="userContactBig">
            <p>Contact information</p>
            <h6>Email</h6>
            <div class="email">${user.email}</div>
            <h6>Phone</h6>
            <div class="name" id="name${user.id}">${user.phone}</div>
        </div>
    `;
}


/**
 * Listens for click events on the document and updates the style of contact containers accordingly.
 * @param {Event} event - The click event.
 */
document.addEventListener('click', function (event) {
    const contactContainers = document.querySelectorAll('.contactContainer, bigCircle');
    contactContainers.forEach(container => {
        const isActive = container.contains(event.target);
        container.style.backgroundColor = isActive ? '#2A3647' : '';
        container.style.color = isActive ? '#ffffff' : '';
    });
});

/**
 * @param {initials} users 
 * @returns firstTwoInitials
 */
function extractInitials(users) {
    for (let i = 1; i <= 2 && i < users.length; i++) {
        const name = users[i].name;
        if (name) {
            const nameInitials = name.split(' ').map(word => word.charAt(0)).join('');
            initials.push(nameInitials);
        }
    }
    return initials;
}

/**
 * Adds initials to each user in the provided array and saves them.
 * @param {Array<Object>} users - The array of user objects.
 * @returns {Promise<Array<Object>>} - A promise that resolves to the updated array of user objects with initials added.
 */
async function addInitialsToUsersAndSave(users) {
    for (const user of users) {
        if(!user.initials){
            const [firstName, lastName] = user.name.split(" ").map(name => name.charAt(0).toUpperCase());
            if (!lastName == undefined) {
                 user.initials = firstName + lastName;
            } else{
                user.initials = firstName;
            }
        }
    }
    return users;
}

/**
 * Adds initials to a user object based on their name, saves the initials to the server,
 * and returns the modified user object.
 *
 * @async
 * @function addInitialsToUserAndSave
 * @param {Object} user - The user object to which initials will be added.
 * @returns {Promise<Object>} The modified user object with initials added.
 * @throws {Error} Throws an error if the user parameter is an array.
 */
async function addInitialsToUserAndSave(user) {
    if (Array.isArray(user)) {
        throw new Error("Function only accepts a single user object, not an array.");
    }

    const [firstName, lastName] = user.name.split(" ").map(name => name.charAt(0).toUpperCase());
    if (!lastName == undefined) {
        user.initials = firstName + lastName;
    } else{
        user.initials = firstName;
    }


    await putData(`/users/initials_${user.name}`, user.initials);

    return user;
}

/**
 * Checks if an email exists in the array of users.
 * @param {string} existingemail - The email to check for existence.
 * @returns {boolean} - True if the email exists, false otherwise.
 */
function emailExists(existingemail) {
    return users.some(user => user.email === existingemail);
}

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

    if (!areFieldsFilled()) {
        showAlertAndEnableButton('Bitte füllen Sie alle Felder aus.');
        return;
    }

    let users = await loadData("/users");

    if (isNameOrEmailTaken(users)) {
        return;
    }

    let newUser = createNewUser();
    await addUser(users, newUser);

    finalizeRegistration(users);
}

/**
 * Checks if all required input fields (name, email, phone) are filled.
 *
 * @function areFieldsFilled
 * @returns {boolean} True if all fields are filled, false otherwise.
 */
function areFieldsFilled() {
    return user.value.trim() !== '' && email.value.trim() !== '' && phone.value.trim() !== '';
}

/**
 * Shows an alert message and enables the register button.
 *
 * @function showAlertAndEnableButton
 * @param {string} message - The alert message to show.
 */
function showAlertAndEnableButton(message) {
    alert(message);
    registerBtn.disabled = false;
}

/**
 * Checks if the given name or email is already taken in the users list.
 *
 * @function isNameOrEmailTaken
 * @param {Array<Object>} users - The array of current users.
 * @returns {boolean} True if the name or email is taken, false otherwise.
 */
function isNameOrEmailTaken(users) {
    if (isNameTaken(users)) {
        showAlertAndEnableButton('Der Name existiert bereits.');
        return true;
    }

    if (isEmailTaken(users)) {
        showAlertAndEnableButton('Die E-Mail existiert bereits.');
        return true;
    }

    return false;
}

/**
 * Checks if a given name is already taken in the users list.
 *
 * @function isNameTaken
 * @param {Array<Object>} users - The array of current users.
 * @returns {boolean} True if the name is taken, false otherwise.
 */
function isNameTaken(users) {
    return users.some(obj => obj.name === user.value);
}

/**
 * Checks if a given email is already taken in the users list.
 *
 * @function isEmailTaken
 * @param {Array<Object>} users - The array of current users.
 * @returns {boolean} True if the email is taken, false otherwise.
 */
function isEmailTaken(users) {
    return users.some(obj => obj.email === email.value);
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
 * Finalizes the registration process by enabling the register button,
 * closing the add contact form, logging the user data, and rendering the contact list.
 *
 * @async
 * @function finalizeRegistration
 * @param {Array<Object>} users - The array of current users.
 * @returns {Promise<void>}
 */
async function finalizeRegistration(users) {
    registerBtn.disabled = false;
    closeAddContact();
    console.log('geladene Benutzer', users);
    await renderContactList(users);
}


/**
 * Checks if a given name is already taken in the users list.
 *
 * @function isNameTaken
 * @param {Array<Object>} users - The array of current users.
 * @returns {boolean} True if the name is taken, false otherwise.
 */
function isNameTaken(users) {
    return users.some(obj => obj.name === user.value);
}

/**
 * Checks if a given email is already taken in the users list.
 *
 * @function isEmailTaken
 * @param {Array<Object>} users - The array of current users.
 * @returns {boolean} True if the email is taken, false otherwise.
 */
function isEmailTaken(users) {
    return users.some(obj => obj.email === email.value);
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
 * Checks if all required input fields (name, email, phone) are filled.
 *
 * @function areFieldsFilled
 * @returns {boolean} True if all fields are filled, false otherwise.
 */
function areFieldsFilled() {
    return user.value.trim() !== '' && email.value.trim() !== '' && phone.value.trim() !== '';
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
 *
 * @example
 * const users = await loadData("/users");
 * const newUser = { name: 'Jane Doe', email: 'jane@example.com', phone: '1234567890' };
 * await addUser(users, newUser);
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

/**
 * Deletes a user by their ID, reassigns IDs to remaining users, updates the data on the server,
 * and renders the updated user list.
 *
 * @async
 * @function deleteUserAndReassignIds
 * @param {number} userId - The ID of the user to delete.
 * @returns {Promise<void>}
 */
async function deleteUserAndReassignIds(userId) {
    const userIndex = users.findIndex(user => user.id === userId);
    
    if (userIndex !== -1) {
        let nameDeletdUser = users[userIndex].name;
        console.log('gelöschter Benutzer', user);
        users.splice(userIndex, 1);

        await deleteDeletedUserInTasks(nameDeletdUser);

      users.forEach((user, index) => {
        user.id = index + 1;
      });
      console.log(users);
      closeAddContact();
      await putData('/users', users);
      await renderContactList(users);
    } else {
        console.log(`User with ID ${userId} not found.`);
    }
  }

/**
 * This function compares the name of the deleted user with the names of the users assigned to tasks and, if necessary, also deletes them in the tasks. When this happens, the tasks in the database are updated.
 * 
 * @param {string} nameDeletdUser the name of the deleted user
 */
async function deleteDeletedUserInTasks(nameDeletdUser){
    let tasksIncludingDeletedUser = await loadData("/tasks");
    for (let i = 0; i < tasksIncludingDeletedUser.length; i++) {
        let taskIncludingDeletedUser = tasksIncludingDeletedUser[i];
        if (taskIncludingDeletedUser.assignedTo) {
            for (let j = 0; j < taskIncludingDeletedUser.assignedTo.length; j++) {
            let userToCheck = taskIncludingDeletedUser.assignedTo[j].name;
            if (userToCheck == nameDeletdUser) {
                taskIncludingDeletedUser.assignedTo.splice(j, 1);
                if (taskIncludingDeletedUser.assignedTo.length == 0) {
                    delete taskIncludingDeletedUser.assignedTo;
                }
            } 
        }
        }
    }
    await putTasksToDatabase(tasksIncludingDeletedUser);
}

/**
 * Resets the contact form to its default state.
 */
function resetForm() {
    const setHTML = (id, html) => document.getElementById(id).innerHTML = html;
    const setOnClick = (id, handler) => document.getElementById(id).onclick = handler;
    const clearValue = (id) => document.getElementById(id).value = "";

    setHTML('formTitle', `
        <img src='./assets/img/favicon_light.svg' alt=''>
        <h1>Add contact</h1>
        <h2>Tasks are better with a team!</h2>
        <div class='blueLineAddContacts'></div>`
    );
    setHTML('registerBtn', `
        Create contact<img src='./assets/img/checkWhite.svg' style='padding-left: 10px'>`
    );
    setHTML('leftButton', `
        Cancel<img class="closeX" src='./assets/img/closeS.svg' style='padding-left: 10px'>`
    );
    setOnClick('leftButton', closeAddContact);
    setOnClick('registerBtn', registerContact);
    clearValue('user');
    clearValue('email');
    clearValue('phone');
    setHTML('middel', `
        <img class="ellipse" id="ellipse" src="./assets/img/ellipse.svg" alt="" />
        <img class="person" id="person" src="./assets/img/personWhite.svg" alt="" />`
    );
}


/**
 * Closes the add contact interface and resets the form after a delay.
 */
function closeAddContact() {
    document.getElementById('contactSlide').classList.add('closeContact');
    setTimeout(() => {
        document.getElementById('contactSlideBG').classList.add('d-none');
        resetForm();
    }, 1000);
}

/**
 * Opens the add contact interface.
 */
function addContact() {
    document.getElementById('contactSlide').classList.remove('closeContact');
    document.getElementById('contactSlideBG').classList.remove('d-none');
    document.body.style.overflowY = 'hidden';
}

/**
 * Fills the contact form with provided contact details for editing.
 * 
 * @param {number} id - The ID of the contact.
 * @param {string} color - The color associated with the contact.
 * @param {string} initials - The initials of the contact.
 * @param {string} name - The name of the contact.
 * @param {string} email - The email address of the contact.
 * @param {string} phone - The phone number of the contact.
 */
function editContactForm(id, color, initials, name, email, phone) {
    document.getElementById('formTitle').innerHTML = `
        <img src='./assets/img/favicon_light.svg' alt=''>
        <h1>Edit contact</h1>
        <div class='blueLineAddContacts'></div>`;
    document.getElementById('registerBtn').innerHTML = `
        Save<img src='./assets/img/checkWhite.svg' style='padding-left: 10px'>`;
    document.getElementById('leftButton').innerText = "Delete";
    document.getElementById('middel').innerHTML = `
        <section class="ellipse" id="circle${id}" style="background-color: ${color};">
        <div class="person initialBig">${initials}</div>`;
    document.getElementById('user').value = name;
    document.getElementById('email').value = email;
    document.getElementById('phone').value = phone;
}

/**
 * Opens the contact form for editing and fills it with provided contact details.
 * Sets the appropriate button actions.
 * 
 * @param {number} id - The ID of the contact.
 * @param {string} color - The color associated with the contact.
 * @param {string} initials - The initials of the contact.
 * @param {string} name - The name of the contact.
 * @param {string} email - The email address of the contact.
 * @param {string} phone - The phone number of the contact.
 */
function editContactSlide(id, color, initials, name, email, phone) {
    addContact();
    editContactForm(id, color, initials, name, email, phone);
    document.getElementById('leftButton').onclick = () => deleteUserAndReassignIds(id);
    document.getElementById('registerBtn').onclick = () => saveContactChange(id);
}

/**
 * Renders the add contact template into the contact slide section of the HTML document.
 * This function updates the innerHTML of the element with ID 'contactSlide' to display a form
 * for adding a new contact with fields for name, email, and phone number.
 * It also includes buttons to cancel the action or register a new contact.
 */
function addContactTemplate() {
    document.getElementById('contactSlide').innerHTML = /*html*/`
        <div class="contactGroup">
          <div class="left" id="formTitle">
            <img src="./assets/img/favicon_light.svg" alt="" />
            <h1 id="">Add contact</h1>
            <h2>Tasks are better with a team!</h2>
            <div class="blueLineAddContacts"></div>
          </div>
          <div class="middel" id="">
            <img class="ellipse" id="ellipse" src="./assets/img/ellipse.svg" alt="" />
            <img class="person" id="person" src="./assets/img/personWhite.svg" alt="" />
          </div>
          <div class="right" id="">
            <div class="slideBack" id="slideBack" onclick="closeAddContact()">
              <img src="./assets/img/close.svg" alt="closeButton" />
            </div>
            <div class="inputbox">
              <input type="name" id="user" class="input personInput" placeholder="Name"/>
            </div>
            <div class="inputbox">
              <input type="email" id="email" class="input mail" placeholder="Email"/>
            </div>
            <div class="inputbox">
              <input type="tel" id="phone" class="input phone" placeholder="Phone"/>
            </div>
            <div>
              <button id="leftButton" class="button buttonEmpty" onclick="closeAddContact()">
                Cancel <span id="closeX" class="closeX"></span>
              </button>
              <button id="registerBtn" class="button buttonFilled" onclick="registerContact()">
                Create contact
                <img id="checkWhite" src="./assets/img/checkWhite.svg" style="padding-left: 10px" alt="" />
              </button>
            </div>
            <div class="" id="contactList"></div>
          </div>
        </div>
      </div>
    </div>
    `
}

/**
 * Save changes to the contact information of a user by ID.
 * @param {number} id - The ID of the user to update.
 */
function saveContactChange(id) {
    const user = findUserById(id);
    if (!user) {
        console.error('User not found with id:', id);
        return;
    }

    const updatedData = getUpdatedFormData();
    if (!validateEditUser(updatedData)) {
        console.error('Validation failed for updated user data');
        return;
    }

    updateUserDetails(user, updatedData);
    finalizeUpdate(user);
}

/**
 * Validate the updated user data.
 * @param {Object} user - The updated user data.
 * @param {string} user.name - The name of the user.
 * @param {string} user.email - The email of the user.
 * @param {string} user.phone - The phone number of the user.
 * @returns {boolean} - True if the data is valid, false otherwise.
 */
function validateEditUser(user) {
    return user.name && user.email && user.phone;
}

/**
 * Get the new values from the form.
 * @returns {Object} - The updated user data.
 */
function getUpdatedFormData() {
    const updatedName = document.getElementById('user').value;
    const updatedEmail = document.getElementById('email').value;
    const updatedPhone = document.getElementById('phone').value;

    return { name: updatedName, email: updatedEmail, phone: updatedPhone };
}

/**
 * Update the user's details with the new data.
 * @param {Object} user - The user object to update.
 * @param {Object} updatedData - The new data for the user.
 */
function updateUserDetails(user, updatedData) {
    user.name = updatedData.name;
    user.email = updatedData.email;
    user.phone = updatedData.phone;
}

/**
 * Finalize the update process by updating the UI and saving data.
 * @param {Object} user - The updated user object.
 */
function finalizeUpdate(user) {
    updateUserContent(getContentElement(), user);
    putData("/users", users);
    console.log('User updated successfully and uploaded :)', user);
    renderContactList(users);
    closeAddContact();
}

/**
 * Resets the registration form.
 * @function resetForm
 */
function confirmation() {
    document.getElementById('slideInBG').classList.remove('d-none');
    setTimeout(() => {
        document.getElementById('slideInBG').classList.add('d-none');
        resetForm();
    }, 3000);
}