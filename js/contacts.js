let sortedUser = renderContactList();

/**
 * loadusers
 */
async function init() {
    await loadusers();
    if (users) {
        abcOrder(users);
        // indexLetterFunction();
        renderContactList();
    } else {
        console.error("Fehler beim Laden der Benutzerdaten.");
    }
}

async function loadusers() {
    try {
        users = JSON.parse(await getItem('users'));
        users = await addInitialsToUsersAndSave(users);
        return users;
    } catch (error) {
        console.error("Fehler beim Laden der Benutzerdaten:", error);
        return [];
    }
}

function abcOrder(users) {
    return users.sort((a, b) => a.name.localeCompare(b.name));
}

function renderContactList() {
    if (users.length === 0) return;

    const indexLetterOnly = [...new Set(users.map(user => user.name.charAt(0).toUpperCase()))];
    const sortedUser = abcOrder(users);

    indexLetterOnly.forEach(letter => {
        loadFirstLetter(letter);
        loadContactIndex(letter, sortedUser);
    });
}

function loadContactIndex(letter, sortedUser) {
    sortedUser.forEach((user, i) => {
        if (letter === user.name.charAt(0).toUpperCase()) {
            renderContactContainer(user, i);
        }
    });
}

function loadFirstLetter(indexLetter) {
    const content = document.getElementById('contactInput');
    content.innerHTML += `
        <div class="indexContainer" id="indexLetter">${indexLetter}</div>
        <div class="line"></div>
    `;
}


function renderContactContainer(user) {
    const content = document.getElementById('contactInput');
    content.innerHTML += `
        <div class="contactContainer " id="contactContainer${user.index}" onclick="openContact(${user.index})">
            <section class="circle" id="circle${user.index}" style="background-color: ${user.color};">
                <div class="initial">${user.initials}</div>
            </section>
            <div class="userContainer">
                <div class="name" id="name${user.index}">${user.name}</div-white>
                <div class="email">${user.email}</div>
            </div>
        </div>
    `;
}

document.addEventListener('click', function(event) {
    const contactContainers = document.querySelectorAll('.contactContainer');
    contactContainers.forEach(container => {
        const isActive = container.contains(event.target);
        container.style.backgroundColor = isActive ? '#2A3647' : '';
        container.style.color = isActive ? '#ffffff' : '';
    });
});

//**
// * 
// * @param {initials} users 
// * @returns firstTwoInitials //not working now
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



async function addInitialsToUserAndSave(user) {
    const [firstName, lastName] = user.name.split(" ").map(name => name.charAt(0).toUpperCase());
    user.initials = firstName + lastName;

    try {
        console.log('users', users);
        await setItem(`initials_${user.name}`, user.initials);
    } catch (error) {
        console.error(`Fehler beim Speichern der Initialen für Benutzer ${user.name}:`, error);
    }
}

async function addInitialsToUsersAndSave(users) {
    for (const user of users) {
        await addInitialsToUserAndSave(user);
    }
    return users;
}

function emailExists(existingemail) { 
    return users.some(user => user.email === existingemail);
}


function renderContacts() {

}

function renderContactsInput() {

}

async function registerContact(){
    registerBtn.disabled = true;
       let allUsers = JSON.parse(await getItem('users')) || [];

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


function closeAddContact() {
    document.getElementById('contactSlide').classList.add('closeContact');
    setTimeout(() => document.getElementById('contactSlideBG').classList.add('d-none'), 500);
}

function addContact() {
    document.getElementById('contactSlide').classList.remove('closeContact');
    document.getElementById('contactSlideBG').classList.remove('d-none');
    document.body.style.overflowY = 'hidden';
}

