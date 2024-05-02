let sortedUser = indexLetterFunction();

/**
 * loadusers
 */
async function init() {
    await loadusers();
    if (users) {
        abcOrder(users);
        indexLetterFunction();
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

function indexLetterFunction() {
    let indexLetter = [];
    let firstLetter;

    for (let i = 0; i < users.length; i++) {
        firstLetter = users[i]["name"].charAt(0).toUpperCase();
        if (!indexLetter.includes(firstLetter)) {
            indexLetter.push(firstLetter);
    }
}
return indexLetter;
}

function renderContactList() {
    if(users.length !=0) {
        sortedUser = abcOrder(users);
        let indexLetterOnly = indexLetterFunction();
        
        for (let i = 0; i < indexLetterOnly.length; i++) {
            loadContactIndex(indexLetterOnly[i]);                      
        }
    }    
}

function loadContactIndex(letter) {
    for (let i = 0; i < contacts.length; i++) {
        if (letter == sortedUser[i]["name"].charAt(0).toUpperCase()) {
            renderContactContainer(i);
        }
    }
}

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


function closeAddContact() {
    document.getElementById('contactSlide').classList.add('closeContact');
    setTimeout(() => document.getElementById('contactSlideBG').classList.add('d-none'), 500);
}

function addContact() {
    document.getElementById('contactSlide').classList.remove('closeContact');
    document.getElementById('contactSlideBG').classList.remove('d-none');
    document.body.style.overflowY = 'hidden';
}

