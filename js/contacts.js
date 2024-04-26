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
