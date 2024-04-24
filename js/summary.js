async function init() {
    loadusers();

}

/**
 * loads currentUser and greats the usere or guest
 */
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

/**
 * 
 * @returns greetings appropriate to the time of day.
 */
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
