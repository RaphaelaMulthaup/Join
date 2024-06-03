const initials = [];

// let sortedUser = renderContactList();
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
    // putData("/users", users)
}

/**
 * Renders the contact list by populating index letters and associated contacts.
 */
async function renderContactList(users) {
    console.log('Users before rendering:', users);
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
// async function randomBackgroundColor() {
//     users.forEach(async user => {
//         if (user && !user.color) {
//             let color = '#' + Array.from({ length: 3 }, () => Math.floor(Math.random() * 255)).map(c => c.toString(16)).join('');
//             user.color = color;
//             await putData(`user_${user.id}_color`, color);
//         }
//     });
// }

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

    content.innerHTML += `
        <div class="contactContainer" id="contactContainer${user.id}" onclick="openContact(${user.id})">
            <section class="circle bgColorCircle" id="circle${user.id}" style="background-color: ${user.color};">
                <div class="initial">${user.initials}</div>
            </section>
            <div class="userContainer">
                <div class="name" id="name${user.id}">${user.name}</div>
                <div class="email">${user.email}</div>
            </div>
        </div>
    `;
}

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

function findUserById(id) {
    const user = users.find(user => user.id === id);
    console.log('User object in findUserById:', user);
    return user;
}

function validateUser(user) {
    if (!user || !user.initials || !user.name || !user.id) {
        console.error('Invalid user object:', user);
        return false;
    }
    return true;
}
// function validateUser(user) {
//     if (!user || !user.color || !user.initials || !user.name || !user.id) {
//         console.error('Invalid user object:', user);
//         return false;
//     }
//     return true;
// }

function getContentElement() {
    const content = document.getElementById('contactDetailContainer');
    if (!content) {
        console.error('Element with id "contactDetailContainer" not found');
        return null;
    }
    return content;
}

function animateContent(content) {
    content.classList.remove('contactSlideIn');
    content.offsetWidth; // Trigger reflow
    content.classList.add('contactSlideIn');
}

function updateUserContent(content, user) {
    content.innerHTML = /*html*/`
        <div class="displayFlex">
            <div class="bigCircle bgColorCircleBig" id="bigCircle" style="background-color: ${user.color};">
                <div class="initialBig">${user.initials}</div>
            </div>
            <div class="userContainerBig">
                <p class="nameBig" id="name${user.id}">${user.name}</p>
                <div class="editDelete">
                    <div class="edit" id="edit" onclick="editContact(${user.id}, '${user.color}', '${user.initials}')">
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
            <p>Email</p>
            <div class="email">${user.email}</div>
            <p>Phone</p>
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

//**
// * @param {initials} users 
// * @returns firstTwoInitials
// */

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
            user.initials = firstName + lastName;
        }
    }
    return users;
}

async function addInitialsToUserAndSave(user) {
    if (Array.isArray(user)) {
        throw new Error("Function only accepts a single user object, not an array.");
    }

    const [firstName, lastName] = user.name.split(" ").map(name => name.charAt(0).toUpperCase());
    user.initials = firstName + lastName;

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

// work in progress
async function registerContact() {
    registerBtn.disabled = true;
    let users = await loadData("/users");
    users = Array.isArray(users) ? users : [];  // Ensure users is an array

    if (isNameTaken(users)) {
        alert('Der Name existiert bereits.');
        registerBtn.disabled = false;
        return;
    }

    if (isEmailTaken(users)) {
        alert('Die E-Mail existiert bereits.');
        registerBtn.disabled = false;
        return;
    }

    let newUser = createNewUser();

    await addUser(users, newUser);

    registerBtn.disabled = false;
    closeAddContact();
    console.log('geladene Benutzer', users);
    await renderContactList(users);
    // await loadusers();
    
}

function isNameTaken(users) {
    return users.some(obj => obj.name === user.value);
}

function isEmailTaken(users) {
    return users.some(obj => obj.email === email.value);
}

function createNewUser() {
    return {
        name: user.value,
        email: email.value,
        phone: phone.value,
    };
}

async function addUser(users, newUser) {
    users.push(newUser);
    await abcOrder(users);
    await addInitialsToUsersAndSave(users);
    await randomBackgroundColor(users)
    await putData("/users", users);
    console.log('Hochgesendete Daten', users);
    await renderContactList(users);
}


async function deleteUserAndReassignIds(userId) {
    const userIndex = users.findIndex(user => user.id === userId);
    
    if (userIndex !== -1) {
        console.log('gelöschter Benutzer', user);
        users.splice(userIndex, 1);
      
      users.forEach((user, index) => {
        user.id = index + 1;
      });
      console.log(users);
      await putData('/users', users);
      await renderContactList(users);
    } else {
        console.log(`User with ID ${userId} not found.`);
    }
    
  }

/**
 * Closes the add contact interface.
 */
function closeAddContact() {
    document.getElementById('contactSlide').classList.add('closeContact');
    setTimeout(() => document.getElementById('contactSlideBG').classList.add('d-none'), 500);
}

/**
 * Opens the add contact interface.
 */
function addContact() {
    document.getElementById('contactSlide').classList.remove('closeContact');
    document.getElementById('contactSlideBG').classList.remove('d-none');
    document.body.style.overflowY = 'hidden';
}



