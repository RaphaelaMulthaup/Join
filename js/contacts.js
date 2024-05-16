let sortedUser = renderContactList();
/**
 * loadusers
*/
async function init() {
    const users = await loadusers();
    if (users) {
        abcOrder(users);
        renderContactList();
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
function abcOrder(users) {
    return users.sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Renders the contact list by populating index letters and associated contacts.
 */
function renderContactList() {
    if (users.length === 0) return;

    const indexLetterOnly = [...new Set(users.map(user => user.name.charAt(0).toUpperCase()))];
    const sortedUser = abcOrder(users);

    indexLetterOnly.forEach(letter => {
        loadFirstLetter(letter);
        loadContactIndex(letter, sortedUser);
    });
}

/**
 * Renders contact containers for users with names starting with the specified letter.
 * @param {string} letter - The letter to filter users by.
 * @param {Array} sortedUser - The array of users sorted alphabetically.
*/
function loadContactIndex(letter, sortedUser) {
    sortedUser.forEach((user, i) => {
        if (letter === user.name.charAt(0).toUpperCase()) {
            renderContactContainer(user, i);
            randomBackgroundColor();
        }
    });
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
async function randomBackgroundColor() {
    users.forEach(async user => {
      if (user && !user.color) {
        let color = '#' + Array.from({length: 3}, () => Math.floor(Math.random() * 255)).map(c => c.toString(16)).join('');
        user.color = color;
        await setItem(`user_${user.id}_color`, color);
      }
    });
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
    content.innerHTML += `
        <div class="contactContainer " id="contactContainer${user.index}" onclick="openContact(${user.index})">
            <section class="circle bgColorCircle" id="circle${user.index}" style="background-color: ${user.color};">
                <div class="initial">${user.initials}</div>
            </section>
            <div class="userContainer">
                <div class="name" id="name${user.index}">${user.name}</div-white>
                <div class="email">${user.email}</div>
            </div>
        </div>
    `;
}

/**
 * Listens for click events on the document and updates the style of contact containers accordingly.
 * @param {Event} event - The click event.
 */
document.addEventListener('click', function(event) {
    const contactContainers = document.querySelectorAll('.contactContainer');
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
const initials = [];
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

// work in progress
async function saveNewUser(newUser) {
    const emailExists = await emailExists(newUser.email);

    if (emailExists) {
        console.log("E-Mail existiert bereits.");
        // Hier kannst du entsprechend reagieren, z.B. eine Fehlermeldung anzeigen
    } else {
        await setItem(newUser);
        console.log("Neuer Benutzer wurde erfolgreich angelegt.");
    }
}

/**
 * Adds initials to each user in the provided array and saves them.
 * @param {Array<Object>} users - The array of user objects.
 * @returns {Promise<Array<Object>>} - A promise that resolves to the updated array of user objects with initials added.
 */
async function addInitialsToUsersAndSave(users) {
    for (const user of users) {
        const [firstName, lastName] = user.name.split(" ").map(name => name.charAt(0).toUpperCase());
        user.initials = firstName + lastName;

        await setItem(`initials_${user.name}`, user.initials);
    }
    return users;
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
async function registerContact(){
    registerBtn.disabled = true;
       let allUsers = await loadData("/users") || [];

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

function openContact(user) {
    const content = document.getElementById('contactDetailContainer');
    content.innerHTML = `
        <div class="bigCircle bgColorCircleBig" 
          style="background-color: ${user.color};">
            <div class="initial">${user.initials}</div>
        </div>
        <div class="userContainerBig">
          <p class="nameBig" id="name${user.index}">${user.name}</p>
        </div>
    `;
}

  