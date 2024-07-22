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
              <div class="image-container ellipse">
              <img id="ellipse" src="./assets/img/personWhite.svg" alt="" />`
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
    }, 500);
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
    document.getElementById('middel').innerHTML = /*html*/`
        <section class="ellipse border-radius" id="circle${id}" style="background-color: ${color};">
        <div class="person initialBig">${initials}</div>
        `;
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
 */
function addContactTemplate() {
    fetch('./assets/templates/addContactTemplate.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('contactSlide').innerHTML = html;
        })
        .catch(error => {
            console.error('Error loading the template:', error);
        });
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

/**
 * Adds 'd-none' to ID 'leftButton' if screen is smaller then 500px
 */
function updateButtonVisibility() {
    const leftButton = document.getElementById('leftButton');
    const isCancelText = leftButton && leftButton.textContent.trim() === 'Cancel';
    const isScreenNarrow = window.innerWidth < 500;

    if (leftButton) {
        if (isCancelText && isScreenNarrow) {
            leftButton.classList.add('d-none');
        } else {
            leftButton.classList.remove('d-none');
        }
    } else {
        console.error('Element with ID "leftButton" not found.');
    }
}

window.addEventListener('resize', updateButtonVisibility);


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

/**
 * Displays the back arrow and contact slide-in box.
 * Removes the 'hidden' class from the elements with IDs 'backArrow' and 'contactSlideInBox'.
 * Logs an error if the elements are not found.
 */
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

/**
 * Hides the back arrow and contact slide-in box.
 * Adds the 'hidden' class to the elements with IDs 'backArrow' and 'contactSlideInBox'.
 * Logs an error if the elements are not found.
 */
function slideIn() {
    const backArrow = document.getElementById('backArrow');
    const contactSlideOut = document.getElementById('contactSlideInBox');

    if (backArrow && contactSlideOut) {
        backArrow.classList.add('hidden');
        contactSlideOut.classList.add('hidden');
    } else {
        console.error('Element(s) not found in slideIn function.');
    }
}


/**
 * Retrieve the element where the content will be updated.
 * @returns {HTMLElement} - The content element.
 */
function updateUserContent(content, user) {
    fetch('./assets/templates/userContentTemplate.html')
        .then(response => response.text())
        .then(template => {
            content.innerHTML = template.replace(/{{color}}/g, user.color)
                .replace(/{{initials}}/g, user.initials)
                .replace(/{{id}}/g, user.id)
                .replace(/{{name}}/g, user.name)
                .replace(/{{email}}/g, user.email)
                .replace(/{{phone}}/g, user.phone);
        })
        .catch(error => console.error('Error loading the template:', error));
}

/**
 * Toggles the 'mobileD-none' class on the element with the ID 'editDelete'.
 */
function toggleMobileEdit() {
    const editDelete = document.getElementById('editDelete');
    editDelete.classList.toggle('mobileD-none');
}

/**
 * Adds an onclick event listener to the element with the ID 'mobileEdit' that 
 * triggers the toggleMobileEdit function when the element is clicked.
 * 
 * This function is executed once the DOM content is fully loaded.
 */
document.addEventListener('DOMContentLoaded', function() {
    const mobileEdit = document.getElementById('mobileEdit');
    mobileEdit.onclick = toggleMobileEdit;
});

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
            if (lastName !== undefined) {
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
    if (lastName !== undefined) {
        user.initials = firstName + lastName;
    } else{
        user.initials = firstName;
    }
    await putData(`/users/initials_${user.name}`, user.initials);

    return user;
}