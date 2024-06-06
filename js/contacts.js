const initials = [];
// const user = [];
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
    closeAddContact();
    await renderContactList(users);
    confirmation();
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
      closeAddContact();
      await putData('/users', users);
      await renderContactList(users);
    } else {
        console.log(`User with ID ${userId} not found.`);
    }
    
  }

/**
 * Closes the add contact interface.
 */
/**
 * Resets the contact form to its default state.
 */
function resetForm() {
    document.getElementById('formTitle').innerHTML = `
        <img src='./assets/img/favicon_light.svg' alt=''>
        <h1>Add contact</h1>
        <h2>Tasks are better with a team!</h2>
        <div class='blueLineAddContacts'></div>`;
    document.getElementById('registerBtn').innerHTML = `
        Create contact<img src='./assets/img/checkWhite.svg' style='padding-left: 10px'>`;
    document.getElementById('leftButton').innerHTML = `
        Cancel<img class="closeX" src='./assets/img/closeS.svg' style='padding-left: 10px'>`;
    document.getElementById('leftButton').onclick = closeAddContact;
    document.getElementById('registerBtn').onclick = registerContact;
    document.getElementById('user').value = "";
    document.getElementById('email').value = "";
    document.getElementById('phone').value = "";
    document.getElementById('middel').innerHTML = `
        <img class="ellipse" id="ellipse" src="./assets/img/ellipse.svg" alt="" />
        <img class="person" id="person" src="./assets/img/personWhite.svg" alt="" />`;
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

function saveContactChange(id) {
    // Suchen Sie den Benutzer im Array basierend auf der ID
    const user = findUserById(id);
    if (!user) {
        console.error('User not found with id:', id);
        return;
    }

    // Erhalten Sie die neuen Werte aus dem Formular
    const updatedName = document.getElementById('user').value;
    const updatedEmail = document.getElementById('email').value;
    const updatedPhone = document.getElementById('phone').value;
    // const updatedColor = document.querySelector(`#circle${id}`).style.backgroundColor; // oder eine andere Möglichkeit, die Farbe zu erhalten
    // const updatedInitials = document.querySelector(`#circle${id} .initialBig`).innerText;

    // Validierung der neuen Daten (optional)
    if (!validateEditUser({ name: updatedName, email: updatedEmail, phone: updatedPhone })) {
        console.error('Validation failed for updated user data');
        return;
    }

    // Aktualisieren Sie die Benutzerinformationen im Array
    user.name = updatedName;
    user.email = updatedEmail;
    user.phone = updatedPhone;
    // user.color = updatedColor;
    // user.initials = updatedInitials;

    // Aktualisieren Sie die Benutzerinformationen in der UI (optional)
    updateUserContent(getContentElement(), user);

    console.log('User updated successfully and uploadet :)', user);
    putData("/users", users);
    renderContactList(users);
    closeAddContact();
}

function validateEditUser(user) {
    // Beispiel-Validierung (angepasst an Ihre Bedürfnisse)
    return user.name && user.email && user.phone;
}

// function getContentElement() {
//     // Rückgabe des Elements, in dem der Benutzerinhalt aktualisiert werden soll
//     return document.getElementById('content');
// }

// function updateUserContent(content, user) {
//     // Beispielaktualisierung des Inhalts
//     content.innerHTML = `
//         <div class="user-info">
//             <div class="user-initials" style="background-color: ${user.color};">${user.initials}</div>
//             <div class="user-details">
//                 <p>Name: ${user.name}</p>
//                 <p>Email: ${user.email}</p>
//                 <p>Phone: ${user.phone}</p>
//             </div>
//         </div>`;
// }

function animateContent(content) {
    // Beispiel-Animation (angepasst an Ihre Bedürfnisse)
    content.classList.add('animate');
    setTimeout(() => content.classList.remove('animate'), 1000);
}

/**
 * Resets the registration form.
 * @function resetForm
 */
function confirmation() {
    setTimeout(() => document.getElementById('slideInBG').style.display = 'block'
    , 1500)
    resetForm();
}