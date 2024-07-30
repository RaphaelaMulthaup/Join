/*mini cards*/

/**
 * This function calls the 'loadBoard' function after the templates have been loaded.
 */
async function loadBoardPage() {
    await loadPage('menuItemBoard');
    await loadTasksAndContacts();
    await loadUsers();
    displayBoard();
}

/**
 * This function loads the example tasks and displays them.
 */
async function loadTasksAndContacts() {
    let newTasks = await loadData("/tasks");
    contactsAddTask = await loadData('/users');

    if (newTasks && newTasks.length > 0) {
        tasks = newTasks;
    }
}

/**
 * loads currentUser and greats the usere or guest
 */
async function loadUsers() {
    try {
        currentUser = await loadData('currentUser');
        if (currentUser && currentUser.name) {
            // console.log(currentUser);
            // console.log(currentUser.name);
        }
    } catch (e) {
        console.error('Loading error:', e);
    }
}

/**
 * 'headlineBoardStatusTasks' is set to default, it is being checked whether tasks of a status exist and displays the tasks.
 */
function displayBoard() {
    document.getElementById('headlineBoardStatusTasks').innerHTML = htmlboard();
    checkWhetherTasksExist();
    for (let i = 0; i < tasks.length; i++) {
        displayMiniCard(i);
    }
}

/**
 * Generates the HTML for the board.
 * @returns {string} - The HTML string for the board.
 */
function htmlboard() {
    return /*html*/ `
        <div id="noticeNoTaskFound" class="dNone">
            <span>No task found</span>
        </div>
        <div class="statusGroup">
            <div class="headlineStatusTasks">
                <h5 class="h5StatusTask">To do</h5>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" onmouseup="plusButtonToDefault(this)" onclick="openOverlayAddTask()">
                    <rect x="1" y="1" width="22" height="22" rx="7" stroke="#2A3647" stroke-width="2"/>
                    <path d="M12 8V16" stroke="#2A3647" stroke-width="2" stroke-linecap="round"/>
                    <path d="M16 12.0754L8 12.0754" stroke="#2A3647" stroke-width="2" stroke-linecap="round"/>
                </svg>
            </div>
            <div class="tasks drop-zone toDo" id="tasksToDo" data-status="to do" ondrop="moveTo('to do')" ondragleave="removeHighlight('tasksToDo')" ondragover="allowDrop(event); highlight('tasksToDo')">
                <div class="noTasksExisting" id="noTasksExistingToDo">
                    <span>No tasks To do</span>
                </div>
            </div>
        </div>
        <div class="statusGroup">
            <div class="headlineStatusTasks">
                <h5 class="h5StatusTask">In progress</h5>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" onmouseup="plusButtonToDefault(this)" onclick="openOverlayAddTaskCertainStatus('in progress')">
                    <rect x="1" y="1" width="22" height="22" rx="7" stroke="#2A3647" stroke-width="2"/>
                    <path d="M12 8V16" stroke="#2A3647" stroke-width="2" stroke-linecap="round"/>
                    <path d="M16 12.0754L8 12.0754" stroke="#2A3647" stroke-width="2" stroke-linecap="round"/>
                </svg>
            </div>
            <div class="tasks drop-zone inProgress" id="tasksInProgress" data-status="in progress" ondrop="moveTo('in progress')" ondragleave="removeHighlight('tasksInProgress')" ondragover="allowDrop(event); highlight('tasksInProgress')">
                <div class="noTasksExisting" id="noTasksExistingInProgress">
                    <span>No tasks In progress</span>
                </div>
            </div>
        </div>
        <div class="statusGroup">
            <div class="headlineStatusTasks">
                <h5 class="h5StatusTask">Await feedback</h5>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" onmouseup="plusButtonToDefault(this)" onclick="openOverlayAddTaskCertainStatus('await feedback')">
                    <rect x="1" y="1" width="22" height="22" rx="7" stroke="#2A3647" stroke-width="2"/>
                    <path d="M12 8V16" stroke="#2A3647" stroke-width="2" stroke-linecap="round"/>
                    <path d="M16 12.0754L8 12.0754" stroke="#2A3647" stroke-width="2" stroke-linecap="round"/>
                </svg>
            </div>
            <div class="tasks drop-zone awaitFeedback" id="tasksAwaitFeedback" data-status="await feedback" ondrop="moveTo('await feedback')" ondragleave="removeHighlight('tasksAwaitFeedback')" ondragover="allowDrop(event); highlight('tasksAwaitFeedback')">
                <div class="noTasksExisting" id="noTasksExistingAwaitFeedback">
                    <span>No tasks Await feedback</span>
                </div>
            </div>
        </div>
        <div class="statusGroup">
            <div class="headlineStatusTasks">
                <h5 class="h5StatusTask">Done</h5>
            </div>
            <div class="tasks drop-zone done" id="tasksDone" data-status="done" ondrop="moveTo('done')" ondragleave="removeHighlight('tasksDone')" ondragover="allowDrop(event); highlight('tasksDone')">
                <div class="noTasksExisting" id="noTasksExistingDone">
                    <span>No tasks Done</span>
                </div>
            </div>
        </div>
    `;
}

/**
 * This function checks whether tasks of a status exist and shows or hides a message accordingly.
 */
function checkWhetherTasksExist() {
    let numberOfTasksToDo = tasks.filter(task => task.status === "to do").length;
    if (numberOfTasksToDo > 0) {
        document.getElementById('noTasksExistingToDo').classList.toggle('dNone');
    }
    let numberOfTasksInProgress = tasks.filter(task => task.status === "in progress").length;
    if (numberOfTasksInProgress > 0) {
        document.getElementById('noTasksExistingInProgress').classList.toggle('dNone');
    }
    let numberOfTasksAwaitFeedback = tasks.filter(task => task.status === "await feedback").length;
    if (numberOfTasksAwaitFeedback > 0) {
        document.getElementById('noTasksExistingAwaitFeedback').classList.toggle('dNone');
    }
    let numberOfTasksDone = tasks.filter(task => task.status === "done").length;
    if (numberOfTasksDone > 0) {
        document.getElementById('noTasksExistingDone').classList.toggle('dNone');
    }
}

/**
 * This function displays the mini card.
 * 
 * @param {index} i The index of the task in the tasks json.
 */
function displayMiniCard(i) {
    let task = tasks[i];
    checkStatus(task, i);
    // shortenDescription(i);
    colorCategory(task, i);
    subtasks(task, i);
    if (task.assignedTo) {
        initials(task, i, currentUser);
    }
    prio(task, i);
}

/**
 * This function checks the status of the task and inserts it into the appropriate place in the board.
 * 
 * @param {object} task The task whose status is checked.
 * @param {index} i The index of the task in the tasks json.
 */
function checkStatus(task, i) {
    if (task.status == "to do") {
        document.getElementById('tasksToDo').innerHTML += htmlMiniCard(task, i);
    } else if (task.status == "in progress") {
        document.getElementById('tasksInProgress').innerHTML += htmlMiniCard(task, i);
    } else if (task.status == "await feedback") {
        document.getElementById('tasksAwaitFeedback').innerHTML += htmlMiniCard(task, i);
    } else if (task.status == "done") {
        document.getElementById('tasksDone').innerHTML += htmlMiniCard(task, i);
    }
}

/**
 * Generates the HTML for a mini card.
 * @param {object} task - The task object.
 * @param {number} i - The index of the task.
 * @returns {string} - The HTML string for the mini card.
 */
function htmlMiniCard(task, i) {
    return /*html*/ ` 
        <div class="miniCard draggable test task" id="miniCard${i}" data-id="${i}" onclick="openBigCard(${i})" draggable="true" ondragstart="startDragging(${i}, event)">
            <div class="category" id="category${i}">${task.category}</div>
            <div class="textMiniCard">
                <h6 class="title">${task.title}</h6>
                <span class="description" id="description${i}">${task.description}</span>
            </div>
            <div class="miniCardGraphically">
                <div class="initialsMiniCardGraphically" id="initialsMiniCardGraphically${i}"></div>
                <div class="prio" id="prio${i}"></div>
            </div>
        </div>
    `;
}

/**
 * This function colors the background of category.
 * 
 * @param {object} task The task that is displayed.
 * @param {index} i The index of the task in the tasks json.
 */
function colorCategory(task, i) {
    let category = document.getElementById('category' + i);
    if (task.category == "User Story") {
        category.style.backgroundColor = '#0038FF';
    } else if (task.category == "Technical Task") {
        category.style.backgroundColor = '#1FD7C1';
    }
}

/**
 * This function shortens the description to a maximum of two lines and adds three points.
 * 
 * @param {index} i The index of the task in the tasks json.
 */
function shortenDescription(i) {
    let description = document.getElementById('description' + i);
    let maxLineHeight = 40;

    while (description.offsetHeight > maxLineHeight) {
        description.textContent = description.textContent.replace(/\W*\s(\S)*$/, '...');
    }
}

/**
 * This function checks whether there are subtasks. If this is the case, a new div with progress bar and information about the progress is created and inserted into the mini card. For the progress bar, the progress is calculated in percent and the number of subtasks in total, as well as the number of completed subtasks, is also shown in writing.
 * 
 * @param {object} task The task that is displayed.
 * @param {index} i The index of the task in the tasks json.
 */
function subtasks(task, i) {
    if (task.subtasks) {
        let miniCard = document.getElementById('miniCard' + i);
        let divChartSubtasks = chartSubtasks(i);
        miniCard.insertBefore(divChartSubtasks, miniCard.querySelector('.miniCardGraphically'));
        let numberOfSubtasks = task.subtasks.length;
        let numberOfDoneSubtasks = task.subtasks.filter(subtask => subtask.status === "done").length;
        let progressInPercent = (numberOfDoneSubtasks / numberOfSubtasks) * 100;
        document.getElementById('progress' + i).style.width = progressInPercent + '%';
        document.getElementById('progressInNumbers' + i).innerHTML = `${numberOfDoneSubtasks}/${numberOfSubtasks}`;
    }
}

/**
 * This function creates a new div for subtasks progress, assigns it a class and fills it with html elements. In the end it will be returned.
 * 
 * @param {index} i The index of the task in the tasks json.
 * @returns the new created div
 */
function chartSubtasks(i) {
    let chartSubtasks = document.createElement('div');
    chartSubtasks.classList.add('progressInfos');
    chartSubtasks.innerHTML = /*html*/ `
        <div class="progressBar">
            <div class="progress" id="progress${i}"></div>
        </div>
        <div class="progressInNumbers">
            <span id="progressInNumbers${i}"></span>
            <span>Subtasks</span>
        </div>
    `;
    return chartSubtasks;
}

/**
 * This function converts the names of those assigned to the task into initials and displays them inside a cicle. In addition, the background of the circle is colored in the color that corresponds to the person.
 * 
 * @param {object} task The task that is displayed.
 * @param {index} i The index of the task in the tasks json.
 * @param {index} currentUser The currentUser check if the initials match the current user and replace with "you" if they do
 */
function initials(task, i, currentUser) {
    let initialsMiniCardGraphically = document.getElementById('initialsMiniCardGraphically' + i);
    for (let index = 0; index < task.assignedTo.length; index++) {

        if (index < 5) {
            let user = task.assignedTo[index].name;
            let initials = user.split(' ').map(word => word.charAt(0)).join('');

            if (currentUser && user === currentUser.name) {
                initials = "you";
            }

            initialsMiniCardGraphically.innerHTML += /*html*/ `
                <div class="initialsMiniCard" id="initialsMiniCard${i}.${index}">
                    <span>${initials}</span>
                </div>
            `;
            document.getElementById('initialsMiniCard' + i + '.' + index).style.backgroundColor = task.assignedTo[index].color;
        } else {
            initialsMiniCardGraphically.innerHTML += addPlusForMoreInitials();
            break;
        }
    }
}

/**
 * This function checks what priority the task has and inserts the corresponding icon.
 * 
 * @param {object} task The task that is displayed.
 * @param {index} i The index of the task in the tasks json.
 */
function prio(task, i) {
    let prioDivMiniCard = document.getElementById('prio' + i);
    if (task.prio == 'Low') {
        prioDivMiniCard.innerHTML = /*html*/`
        <img class="prioImgMiniCard" src="./assets/img/capaLow.svg" alt="low">
        `;
    } else if (task.prio == 'Medium') {
        prioDivMiniCard.innerHTML = /*html*/`
        <img class="prioImgMiniCard" src="./assets/img/capaMedium.svg" alt="medium">
        `;
    } else if (task.prio == 'Urgent') {
        prioDivMiniCard.innerHTML = /*html*/`
        <img class="prioImgMiniCard" src="./assets/img/capaUrgent.svg" alt="urgent">
        `;
    }
}

/*search tasks*/

/**
 * This function search tasks. At first tasks is reloaded from the database. A new array is then created with the tasks that contain the value from the input field either in the title or the description. This array replaces tasks. The board is displayed again based on tasks.
 */
async function searchFunction() {
    tasks = await loadData("/tasks");
    let toSearch = document.getElementById('inputFindTask').value;
    let filteredTasks = tasks.filter(task =>
        task.title.toLowerCase().includes(toSearch.toLowerCase()) ||
        task.description.toLowerCase().includes(toSearch.toLowerCase())
    );
    tasks = filteredTasks;
    displayBoard();
    if (tasks.length == 0) {
        document.getElementById('noticeNoTaskFound').classList.remove('dNone');
    }
}