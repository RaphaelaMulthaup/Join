/*greeting*/

async function init() {
    loadusers();
    displayNumberOfTasks();
}

/**
 * loads currentUser and greats the usere or guest
 */
async function loadusers(){
    try {
    currentUser = await loadData('currentUser');   
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

/*summary of the number of tasks*/

async function displayNumberOfTasks(){
    tasks = await loadData("/tasks");
    let numberDisplayedToDo = document.getElementById('numberDisplayedToDo');
    numberDisplayedToDo.innerHTML = tasks.filter(task => task.status === 'to do').length;

    let numberDisplayedDone = document.getElementById('numberDisplayedDone');
    numberDisplayedDone.innerHTML = tasks.filter(task => task.status === 'done').length;

    let numberDisplayedTasks = document.getElementById('numberDisplayedTasks');
    numberDisplayedTasks.innerHTML = tasks.length;

    let numberDisplayedInProgress = document.getElementById('numberDisplayedInProgress');
    numberDisplayedInProgress.innerHTML = tasks.filter(task => task.status === 'in progress').length;

    let numberDisplayedAwaitingFeedback = document.getElementById('numberDisplayedAwaitingFeedback');
    numberDisplayedAwaitingFeedback.innerHTML = tasks.filter(task => task.status === 'await feedback').length;

    let nummerDisplayedUrgent = document.getElementById('nummerDisplayedUrgent');
    let tasksUrgent = tasks.filter(task => task.prio === 'Urgent');
    let nummerDisplayedUrgentValue = tasksUrgent.length;
    nummerDisplayedUrgent.innerHTML = nummerDisplayedUrgentValue;
    let dateDeadline = document.getElementById('dateDeadline');
    if (nummerDisplayedUrgentValue === 0) {
        dateDeadline.innerHTML = 'currently no';
    } else{
        let tasksUrgentSorted = tasksUrgent.sort((a, b) => parseDate(a.dueDate) - parseDate(b.dueDate));
        let dateDeadlineSlashFormat = tasksUrgentSorted[0].dueDate;
        let dateDeadlineAdvertised = formatDateToAdvertisedFormat(dateDeadlineSlashFormat);
        dateDeadline.innerHTML = dateDeadlineAdvertised;
    }
    
}

function parseDate(dateString) {
    let [day, month, year] = dateString.split('/');
    return new Date(`${year}-${month}-${day}`);
  }

  function formatDateToAdvertisedFormat(dateString) {
    let [day, month, year] = dateString.split('/');
    let date = new Date(year, month - 1, day);

    let monthName = getMonthName(date.getMonth());
    let dayNumber = date.getDate();
    let yearNumber = date.getFullYear();
 
    return `${monthName} ${dayNumber}, ${yearNumber}`;
  }

  function getMonthName(monthNumber) {
    let months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    return months[monthNumber];
  }