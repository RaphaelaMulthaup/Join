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
    } catch (error) {
        console.error("Fehler beim Laden der Benutzerdaten:", error);
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
        <div class="preview-contact-container d_flexdirection_r_c" id="contact-container${user.index}" onclick="openContact(${user.index})">
            <section class="circle-area d_flex_c_c" id="border-circle${user.index}" style="background-color: ${user.color};">
                <div class="initial">${user.initials}</div>
            </section>
            <div class="name-email-container d_flex_column_sb">
                <div-white class="first-last-name" id="first-last-name${user.index}">${user.name}</div-white>
                <div class="email">${user.email}</div>
            </div>
        </div>
    `;
}

function extractInitials(users) {
    const initials = [];
    for (let i = 1; i <= 2 && i < users.length; i++) {
        const name = users[i].name;
        if (name) {
            const nameInitials = name.split(' ').map(word => word.charAt(0)).join('');
            initials.push(nameInitials);
        }
    }
    return initials;
}

// Beispielaufruf der Funktion
const firstTwoInitials = extractInitials(users);
console.log(firstTwoInitials);

// Funktion zur Generierung einer Farbe basierend auf dem Benutzernamen
function generateColor(username) {
    // Konvertiere den Benutzernamen in eine Zahl
    let num = 0;
    for (let i = 0; i < username.length; i++) {
        num += username.charCodeAt(i);
    }
    // Verwende die Zahl, um eine Farbe zu generieren
    const hue = num % 360; // Wert zwischen 0 und 360 für den Farbton
    const saturation = 70; // Sättigung
    const lightness = 60; // Helligkeit
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

// Beispielaufruf der Funktion mit einem Benutzernamen
const username = "Anna";
const userColor = generateColor(username);
console.log(userColor); // Gibt eine Farbe basierend auf dem Benutzernamen aus


async function saveNewUser(newUser) {
    const emailExists = await emailExists(newUser.email);

    if (emailExists) {
        console.log("E-Mail existiert bereits.");
        // Hier kannst du entsprechend reagieren, z.B. eine Fehlermeldung anzeigen
    } else {
        // Hier fügst du den neuen Benutzer hinzu oder führe andere Aktionen aus
        await setItem(newUser);
        console.log("Neuer Benutzer wurde erfolgreich angelegt.");
    }
}

function emailExists(existingemail) { 
    return users.some(user => user.email === existingemail);
}


function renderContacts() {

}

function renderContactsInput() {

}



function test(){
    if (emailExists("beispiel@email.com")) {
        console.log("Die E-Mail existiert bereits.");
    } else {
        console.log("Die E-Mail existiert noch nicht.");
    }
}

async function register(){
    registerBtn.disabled = true;

    const nameExists = users.some(user => user.name === user.value);
    const emailExists = users.some(user => user.email === email.value);
    if (nameExists) {
        console.log('Der Name existiert bereits.');
        alert('Der Name existiert bereits.')
        return;
    }

    if (emailExists) {
        console.log('Die E-Mail existiert bereits.');
        alert('Der E-Mail existiert bereits.')
        return;
    }
    users.push({
        name: user.value,
        email: email.value,
        password: passwordInput.value,
    });
    await setItem('users', JSON.stringify(users)); 
    console.log ('Hochgesendete Daten', users)
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

