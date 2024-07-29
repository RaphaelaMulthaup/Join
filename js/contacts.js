const initials = [];

/**
 * loadusers
*/
async function init() {
    const users = await loadusers();
    if (users) {
        abcOrder(users);
        await renderContactList(users);
    } else {
        //console.error("Fehler beim Laden der Benutzerdaten.");
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
        //console.error("Fehler beim Laden der Benutzerdaten:", error);
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
        //console.log('indexletter', letter);
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
        //console.error('Users is not an array or is undefined:', users);
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
        //console.error('user.id is undefined');
        return;
    }

    content.innerHTML += /*html*/`
        <div class="contactContainer" id="contactContainer${user.id}" onclick="openContact(${user.id}), slideOut()">
            <section class="circle bgColorCircle ellipse" id="circle${user.id}" style="background-color: ${user.color};">
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
    //console.log('openContact called with id:', id);

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
    //console.log('User object in findUserById:', user);
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
        //console.error('Invalid user object:', user);
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
        //console.error('Element with id "contactDetailContainer" not found');
        return null;
    }
    return content;
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
        //console.log('gelöschter Benutzer', user);
        users.splice(userIndex, 1);

        await deleteDeletedUserInTasks(nameDeletdUser);

      users.forEach((user, index) => {
        user.id = index + 1;
      });
      //console.log(users);
      closeAddContact();
      await putData('/users', users);
      await renderContactList(users);
    } else {
        //console.log(`User with ID ${userId} not found.`);
    }
  }