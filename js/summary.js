async function init() {
    loadusers();
    guestName();
}

async function loadusers(){
    try {
    currentUser = JSON.parse(await getItem('currentUser'));   
    } catch (e){
        console.error('Loading error:' , e);
    }
}

function guestName() {
    document.getElementById('currentUser').value = currentUser.name;
}