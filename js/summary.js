async function init() {
    loadusers();

}

async function loadusers(){
    try {
    currentUser = JSON.parse(await getItem('currentUser'));   
    if (currentUser && currentUser.name) {
        document.querySelector('.greetingCurrent').innerText = getGreeting();
        document.getElementById('currentUser').innerText = currentUser.name;
    }
    } catch (e){
        console.error('Loading error:' , e);
    }
}

function getGreeting() {
    const currentTime = new Date();
    const currentHour = currentTime.getHours();

    if (currentHour < 12) {
        return "Good morning,";
    } else if (currentHour < 18) {
        return "Good afternoon,";
    } else {
        return "Good evening,";
    }
}
