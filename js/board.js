let findTaskFocus = false;
let overlayAddTaskOpen = false;
let tasks = {};

/**
 * This funktion sets clickt elements back to default.
 */
function setElementsToDefaultBoard(){
    closeSubMenu();
    findTaskDefault();
}

/*headline*/

/**
 * This function colors the border of 'findTask' blue and puts a focus on the input field. Beforehand, it is checked whether something else is open or activated that should be closed beforehand.
 */
function findTaskActive(){
    if (subMenuOpen) {
        closeSubMenu();
    }
    let findTask = document.getElementById('findTask');
    let inputFindTask = document.getElementById('inputFindTask');
    findTask.style.border = "1px solid #29ABE2";
    inputFindTask.focus(); // Inputfeld fokussieren
    findTaskFocus = true;
}

/**
 * This function This function colors the border of 'findTask' gray again.
 */
function findTaskDefault(){
    let findTask = document.getElementById('findTask');
    findTask.style.border = "1px solid #A8A8A8";
    findTaskFocus = false;
}

/**
 * This function colors the SVG dark for 10ms before it returns to its original color.
 * 
 * @param {string} plusButton clicked plus button
 */
function plusButtonToDefault(plusButton) {
    let rect = plusButton.querySelector('rect');
    let paths = plusButton.querySelectorAll('path');
    rect.setAttribute('stroke', '#091931');
    paths.forEach(function(path) {
        path.setAttribute('stroke', '#091931');
    });

    setTimeout(function() {
        rect.setAttribute('stroke', '#2A3647');
        paths.forEach(function(path) {
            path.setAttribute('stroke', '#2A3647');
        });
    
    }, 10);
}

/**
 * This function takes away the 'dNone' class from the div 'overlayAddTaskBackground'. The overlay with animation is displayed.  Beforehand, it is checked whether something else is open or activated that should be closed beforehand.
 */
function openOverlayAddTask(){
    if (subMenuOpen) {
        closeSubMenu();
    }
    if (findTaskFocus) {
        findTaskDefault();
    }
    document.getElementById('overlayAddTaskBackground').classList.remove('dNone');
    overlayAddTaskOpen = true;
}


/**
 * This function adds class 'removing' to 'overlayAddTask'. This will display the sliding out animation. After the animation plays, the div 'overlayAddTaskBackground' is given the class .dNone. 'removing' is then removed again.
 */
function closeOverlayAddTask(){
    let overlayAddTaskBackground = document.getElementById('overlayAddTaskBackground');
    let overlayAddTask = document.getElementById('overlayAddTask');
    overlayAddTask.classList.add('removing');
    setTimeout(function() {
        overlayAddTaskBackground.classList.add('dNone');
        overlayAddTask.classList.remove('removing');
    }, 100); // Dauer der Animation in Millisekunden
    overlayAddTaskOpen = false;
}

/*tasks*/

/**
 * This function calls the 'loadBoard' function after the templates have been loaded.
 */
async function loadBoardPage(){
    await loadPage('menuItemBoard');
    loadBoard();
}

/**
 * This function loads the example tasks, checks whether tasks of a status exist and displays the tasks.
 */
async function loadBoard(){
    tasks = await loadData("/tasks");
    console.log(tasks);

    checkWhetherTasksExist();

    for (let i = 0; i < tasks.length; i++) {
        let task = tasks[i];
        checkStatus(task, i);
        shortenDescription(i);
        colorCategory(task, i);
        subtasks(task, i);
        initials(task, i);
        prio(task, i);
    }
}

/**
 * This function checks whether tasks of a status exist and shows or hides a message accordingly.
 * 
 * @param {json} tasks all example tasks
 */
function checkWhetherTasksExist(){
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
 * This function checks the status of the task and inserts it into the appropriate place in the board.
 * 
 * @param {object} task The task whose status is checked.
 * @param {index} i The index of the task in the tasks json.
 */
function checkStatus(task, i){
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
 * This function creates a mini card and returnes it.
 * 
 * @param {object} task The task that is displayed.
 * @param {index} i The index of the task in the tasks json.
 * @returns the mini card
 */
function htmlMiniCard(task, i){
    return /*html*/ `
        <div class="miniCard" id="miniCard${i}" onclick="openBigCard(${i})">
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
function colorCategory(task, i){
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
function shortenDescription(i){
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
function subtasks(task, i){
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
function chartSubtasks(i){
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
 */
function initials(task, i){
    let initialsMiniCardGraphically = document.getElementById('initialsMiniCardGraphically' + i);
    for (let index = 0; index < task.assignedTo.length; index++) {
        let user = task.assignedTo[index].name;
        let initials = user.split(' ').map(word => word.charAt(0)).join('');
        initialsMiniCardGraphically.innerHTML += /*html*/ `
            <div class="initialsMiniCard" id="initialsMiniCard${i}.${index}">
                <span>${initials}</span>
            </div>
        `;
        document.getElementById('initialsMiniCard' + i + '.' + index).style.backgroundColor =  task.assignedTo[index].color;
    }
}

/**
 * This function checks what priority the task has and inserts the corresponding icon.
 * 
 * @param {object} task The task that is displayed.
 * @param {index} i The index of the task in the tasks json.
 */
function prio(task, i){
    let prioDivMiniCard = document.getElementById('prio' + i);
    if (task.prio == 'Low') {
        prioDivMiniCard.innerHTML = /*html*/`
        <img class="prioImgMiniCard" src="./assets/img/capaLow.svg" alt="low">
        `;
    } else  if (task.prio == 'Medium') {
        prioDivMiniCard.innerHTML = /*html*/`
        <img class="prioImgMiniCard" src="./assets/img/capaMedium.svg" alt="medium">
        `;
    } else if (task.prio == 'Urgent') {
        prioDivMiniCard.innerHTML = /*html*/`
        <img class="prioImgMiniCard" src="./assets/img/capaUrgent.svg" alt="urgent">
        `;
    }
}

/*display big card*/

function openBigCard(i){
    document.getElementById('overlayBidCardkBackground').classList.remove('dNone');
    let task = tasks[i];

    categoryBigCard(task);
    titleBigCard(task);
    descriptionBigCard(task);
    dueDateBigCard(task);
    priorityBigCard(task);
    assignedToBigCard(task);
    subtasksBigCard(task);
}


/**
 * This function displays the category in the big card and colors the div in the corresponding color.
 * 
 * @param {object} task The task that is displayed.
 */
function categoryBigCard(task){
    let categoryBigCard = document.getElementById('categoryBigCard');
    categoryBigCard.innerHTML = `${task.category}`;

    if (task.category == "User Story") {
        categoryBigCard.style.backgroundColor = '#0038FF';
    } else if (task.category == "Technical Task") {
        categoryBigCard.style.backgroundColor = '#1FD7C1';
    }
}

/**
 * This function displays the title in the big card.
 * 
 * @param {object} task The task that is displayed.
 */
function titleBigCard(task){
    let titleBigCard = document.getElementById('titleBigCard');
    titleBigCard.innerHTML = `${task.title}`;
}

/**
 * This function displays the description in the big card.
 * 
 * @param {object} task The task that is displayed.
 */
function descriptionBigCard(task){
    let descriptionBigCard = document.getElementById('descriptionBigCard');
    descriptionBigCard.innerHTML = `${task.description}`;
}

/**
 * This function displays the due date in the big card.
 * 
 * @param {object} task The task that is displayed.
 */
function dueDateBigCard(task){
    let dueDateBigCard = document.getElementById('dueDateBigCard');
    dueDateBigCard.innerHTML = `${task.dueDate}`;
}

/**
 * This function displays the priority in the big card and adds the corresponding icon.
 * 
 * @param {object} task The task that is displayed.
 */
function priorityBigCard(task){
    let priorityBigCard = document.getElementById('priorityBigCard');
    priorityBigCard.innerHTML = `${task.prio}`;
    let imgPriorityBigCard = document.getElementById('imgPriorityBigCard');
    imgPriorityBigCard.src = ('./assets/img/capa' + task.prio + '.svg');
}

/**
 * This function checks whether there are assigned users. If this is the case, the users and their initials will be displayed in the appropriate color. If this is not the case, assignedToBigCard is output.
 * 
 * @param {object} task The task that is displayed.
 */
function assignedToBigCard(task){
    if (task.assignedTo) {
        let assignedToBigCardUsers = document.getElementById('assignedToBigCardUsers');
        for (let i = 0; i < task.assignedTo.length; i++) {
            let user = task.assignedTo[i];
            let initials = user.name.split(' ').map(word => word.charAt(0)).join('');
            assignedToBigCardUsers.innerHTML += htmlAssignedToBigCardUsers(i, initials, user);
            document.getElementById('initialsUserBigCard' + i).style.backgroundColor =  user.color;
        } 
    } else {
        document.getElementById('assignedToBigCard').classList.add('dNone');
    }
}

/**
 * This function creates a div to display the unser name and returns it.
 * 
 * @param {index} i The index of the user in the assignedTo json.
 * @param {span} initials user initials
 * @param {object} user information about the user
 * @returns returns the created div with the user name
 */
function htmlAssignedToBigCardUsers(i, initials, user){
    return /*html*/ `
    <div class="userBigCard">
        <div class="initialsUserBigCard" id="initialsUserBigCard${i}">
            <span>${initials}</span>
        </div>
        <span>${user.name}</span>
    </div>
    `;
}

/**
 * This function checks whether there are subtasks. If this is the case, the subtasks with a checkbox will be displayed. If this is not the case, assignedToBigCard is output. In addition, the checkboxes are set to checked if the subtask has already been completed.
 * 
 * @param {object} task The task that is displayed.
 */
function subtasksBigCard(task) {
    if (task.subtasks) {
        let subtasksBigCardChecklist = document.getElementById('subtasksBigCardChecklist');
        let subtasksHtml = ''; // Sammeln aller HTML-Elemente in einer Variable
        
        for (let i = 0; i < task.subtasks.length; i++) {
            let subtask = task.subtasks[i].subtask;
            subtasksHtml += htmlSubtaskBigCard(i, subtask); // HTML-Elemente sammeln
        }

        subtasksBigCardChecklist.innerHTML = subtasksHtml; // Einmalig innerHTML setzen
        
        for (let i = 0; i < task.subtasks.length; i++) {
            if (task.subtasks[i].status === 'done') {
                document.getElementById('checkboxSubtask' + i).checked = true;
            }
        }
    } else {
        document.getElementById('subtasksBigCard').classList.add('dNone');
    }
}

/**
 * This function creates a div to display the subtask and returns it.
 * 
 * @param {index} i The index of the subtask in the subtasks json.
 * @param {span} subtask the subtasks that is displayed
 * @returns returns the created div with the subtask
 */
function htmlSubtaskBigCard(i, subtask){
    return /*html*/ `
    <div class="subtaskBidCard" onclick="toggleCheckboxSubtasks('checkboxSubtask${i}')">
        <input type="checkbox" class="checkbox" id="checkboxSubtask${i}" style="display: none;">
        <label for="checkboxSubtask${i}"></label>
        <span>${subtask}</span>
    </div>
    `;
}

/*use big card*/

/**
 * This function changes the status of the checkbox that belongs to the subtasks, when the parent div is clicked.
 * 
 * @param {span} checkboxId ID of the checkbox
 */
function toggleCheckboxSubtasks(checkboxId) {
    let checkbox = document.getElementById(checkboxId);
    checkbox.checked = !checkbox.checked;
}
  