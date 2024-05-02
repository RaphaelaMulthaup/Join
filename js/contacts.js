/**
 * loadusers
 */
async function init() {
    loadusers();

}

async function loadusers(){
    try {
    users = JSON.parse(await getItem('users'));
    } catch (e){
        console.error('Loading error:' , e);
    }
}

async function saveUsers() {
    await setItem('')
}

function renderContacts() {

}

function renderContactsInput() {
    
}

function closeAddContact() {
    document.getElementById('contactSlide').classList.add('closeContact');
    setTimeout(() => document.getElementById('contactSlideBG').classList.add('d-none'), 500);
}

function addContact(){
    document.getElementById('contactSlide').classList.remove('closeContact');
    document.getElementById('contactSlideBG').classList.remove('d-none');
    document.body.style.overflowY = 'hidden';
}

