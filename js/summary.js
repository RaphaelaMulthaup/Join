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
        //console.error('Loading error:' , e);
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

/**
 * This function loads the tasks from the database, indicates how many tasks there are, filters them according to their statuses and indicates the frequency of the different statuses. Additionally, information about urgent tasks is provided.
 */
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

    summaryUrgent();
}

/**
 * This function creates a new array with all urgent tasks and displays its length. In addition, the date of the next urgent tasks is displayed. If there is no urgent task with a future date, 'currently no upcomming deadline' will be displayed.
 */
function summaryUrgent(){
    let nummerDisplayedUrgent = document.getElementById('nummerDisplayedUrgent');
    let tasksUrgent = tasks.filter(task => task.prio === 'Urgent');
    let nummerDisplayedUrgentValue = tasksUrgent.length;
    nummerDisplayedUrgent.innerHTML = nummerDisplayedUrgentValue;
    let dateDeadline = document.getElementById('dateDeadline');
    if (nummerDisplayedUrgentValue === 0) {
        displayCurrentlyNo(dateDeadline);
    } else{
        searchNextUrgentDate(tasksUrgent, dateDeadline);
    }
}

/**
 * This function determines the date of the next urgent task. The data is sorted and compared with the current date. The first date that is greater than the current one is the one you are looking for and the one that is displayed. If there is no date in the future, 'currently no' is displayed.
 * 
 * @param {JSON array} tasksUrgent All tasks with an urgent priority.
 * @param {html element} dateDeadline place for the next urgent date or a notice, that no urgent date exists in the future
 */
function searchNextUrgentDate(tasksUrgent, dateDeadline){
    let now = new Date();
    let tasksUrgentSorted = tasksUrgent.sort((a, b) => parseDate(a.dueDate) - parseDate(b.dueDate));
    if (parseDate(tasksUrgentSorted[tasksUrgentSorted.length - 1].dueDate) < now) {
        displayCurrentlyNo(dateDeadline);
    } else for (let task of tasksUrgentSorted) {
                if (parseDate(task.dueDate) > now) {
                    let dateDeadlineAdvertised = formatDateToAdvertisedFormat(task.dueDate);
                    dateDeadline.innerHTML = dateDeadlineAdvertised;
                }
            }
}

/**
 * This function changes the format of the date.
 * 
 * @param {string} dateString date in shlash format
 * @returns the date in "YYYY-MM-DD" format
 */
function parseDate(dateString) {
    let [day, month, year] = dateString.split('/');
    return new Date(`${year}-${month}-${day}`);
}

/**
 * 
 * @param {*} dateDeadline 
 */
function displayCurrentlyNo(dateDeadline){
    dateDeadline.innerHTML = 'currently no';
}

/**
 * This Funktion changes the date to a advertised format.
 * 
 * @param {string} dateString date in shlash format
 * @returns the date in advertised format
 */
function formatDateToAdvertisedFormat(dateString) {
    let [day, month, year] = dateString.split('/');
    let date = new Date(year, month - 1, day);

    let monthName = getMonthName(date.getMonth());
    let dayNumber = date.getDate();
    let yearNumber = date.getFullYear();

    return `${monthName} ${dayNumber}, ${yearNumber}`;
}

/**
 * This function returns the full name of a month.
 * 
 * @param {integer} monthNumber the position of the month
 * @returns the full name of a month
 */
function getMonthName(monthNumber) {
    let months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    return months[monthNumber];
}