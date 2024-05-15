let findTaskFocus = false;
let overlayAddTaskOpen = false;

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


async function loadBoard(){
    let tasks = await loadData("/tasks");
    console.log(tasks);

    for (let i = 0; i < tasks.length; i++) {
        let task = tasks[i];
        checkStatus(task, i);
        shortenDescription(i);
        colorCategory(task, i);
        if (task.subtasks) {
            let miniCard = document.getElementById('miniCard' + i);
            let divChartSubtasks = chartSubtasks(i);
            miniCard.insertBefore(divChartSubtasks, miniCard.querySelector('.miniCardGraphically'));
        }
    }
}

/**
 * This function checks the status of the task and inserts it into the appropriate place in the board.
 * 
 * @param {json} task The task whose status is checked.
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
 * @param {json} task The task whose status is checked.
 * @param {index} i The index of the task in the tasks json.
 * @returns the mini card
 */
function htmlMiniCard(task, i){
    return /*html*/ `
        <div class="miniCard" id="miniCard${i}">
            <div class="category" id="category${i}">${task.category}</div>
            <div class="textMiniCard">
                <h6 class="title">${task.title}</h6>
                <span class="description" id="description${i}">${task.description}</span>
            </div>
            <div class="miniCardGraphically">
                <div class="initialsMiniCardGraphically"></div>
                <div class="prio"></div>
            </div>
        </div>
    `;
}

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

function chartSubtasks(i){
    let chartSubtasks = document.createElement('div');

    chartSubtasks.innerHTML = /*html*/ `
        <div class="progressBar">
            <div class="progress"></div>
        </div>
  
    `;

    return chartSubtasks;
}

