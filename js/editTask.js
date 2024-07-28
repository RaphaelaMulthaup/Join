/**
 * This function fills overlayEditTask with the appropriate html, adds eventlistener, sets as an attribute for addTaskDueDate that the date must not be in the past and makes everything appear with an animation. The form is then pre-filled with the existing data.
 */
function editTask(){
    document.getElementById('overlayEditTask').innerHTML = htmlOverlayEditTask();
    addEventListener();

    let addTaskDueDate = document.getElementById('addTaskDueDate');
    let today = new Date().toISOString().split('T')[0];
    addTaskDueDate.setAttribute('min', today);

    document.getElementById('overlayEditTaskBackground').classList.remove('dNone');

    document.getElementById('addTaskTitle').value = taskBigCard.title;
    document.getElementById('addTaskDescription').value = taskBigCard.description;
    displayDueDateEditTask();
    displayPrioEditTask();
    displayContactsEditTask();
    displaySubtasksEditTask();
}

/**
 * This function creates the html code for the edit task overlay.
 * 
 * @returns the html code
 */
function htmlOverlayEditTask(){
    return /*html*/ `
        <div class="firstLineOverlayCard">
            <div class="bigCardCloseButton" onclick="closeOverlayEditTask()">
                <img src="./assets/img/close.svg" alt="close">
            </div>
        </div>
        <form class="formAddTask formEditTask" id="formAddNewTask">
            <div class="inputTagsAddTask inputTagsEditTask">
                <div class="formEditTaskUpperArea">

                    <div class="formElementAddTask">
                        <label class="formPointDescription formPointEditTaskHeadline" for="addTaskTitle">Title</label>
                        <input class="widthFormElementsAddTask heightFormElementsAddTask borderFormElementsAddTask inputTagAddTaskFocus addTaskInputRequired" id="addTaskTitle" name="addTaskTitle" type="text" required placeholder="Enter a title" autocomplete="off">
                        <span class="requiredMessage" id="requiredMessageTitleAddTask">This field is required</span>
                    </div>

                    <div class="formElementAddTask">
                        <label class="formPointDescription formPointEditTaskHeadline" for="addTaskDescription" >Description</label>
                        <textarea class="widthFormElementsAddTask borderFormElementsAddTask paddingLeftAddTask inputTagAddTaskFocus addTaskInputRequired" name="addTaskDescription" onmouseover="preventNotice('addTaskDescription')" 
                        onmouseout="restoreRequired('addTaskDescription')" id="addTaskDescription" required placeholder="Enter a description"></textarea>
                        <span class="requiredMessage" id="requiredMessageDescriptionAddTask">This field is required</span>
                    </div>

                    <div class="formElementAddTask">
                        <label class="formPointDescription formPointEditTaskHeadline" for="addTaskDueDate">Due date</label>
                        <input class="widthFormElementsAddTask heightFormElementsAddTask borderFormElementsAddTask paddingLeftAddTask paddingRightAddTask inputTagAddTaskFocus addTaskInputRequired" id="addTaskDueDate" name="addTaskDueDate" type="date" required onfocus="blackColorDueDate(this)" oninput="blackColorDueDate(this)" onblur="changeColorDueDate(this)">
                        <span class="requiredMessage" id="requiredMessageDueDateAddTask">This field is required</span>
                    </div>

                </div>
                <div class="formEditTaskLowerArea">

                    <div class="formElementAddTask">
                        <span class="formPointDescription editTaskHeadlinePrio formPointEditTaskHeadline">Priority</span>
                        <div class="addTaskPrioButtons editTaskPrioButtons widthFormElementsAddTask addTaskPrioButtons">
                            <button formnovalidate class="buttonAddTaskPage buttonUrgentEditTask" id="addTaskPrioUrgent" onclick="priorityUrgent(event)">Urgent <img id="imgUrgent" src="./assets/img/capaUrgent.svg"></button>
                            <button formnovalidate class="buttonAddTaskPage" id="addTaskPrioMedium" onclick="priorityMedium(event)">Medium <img id="imgMedium" src="./assets/img/capaMediumWhite.svg"></button>
                            <button formnovalidate class="buttonAddTaskPage" id="addTaskPrioLow" onclick="priorityLow(event)">Low <img id="imgLow" src="./assets/img/capaLow.svg"></button>
                        </div>
                    </div>

                    <div class="formElementAddTask">
                        <span class="formPointDescription formPointEditTaskHeadline">Assigned to</span>
                        <div class="dropdown" id="addTaskAssignedTo">
                            <button formnovalidate id="buttonSelectContacts" class="buttonSelectContacts widthFormElementsAddTask heightFormElementsAddTask borderFormElementsAddTask paddingRightAddTask" onclick="selectContactsButton(event)">
                                <span id="textSelectContacts">Select contacts to assign</span>
                                <input class="inputInsideDiv" type="text" id="inputSelectContacts" style="display: none;" autocomplete="off">
                                <img id="arrowIcon" src="./assets/img/arrowdropdownDown.svg" alt="">
                            </button>
                            <div class="dropdown-content widthFormElementsAddTask dropdownContactsHidden dropdownContactsEditTask" id="dropdownContacts" onclick="stayOpenOrActiv(event)"></div>
                        </div>
                        <div id="initialsSelectedContacts" class="initialsSelectedContacts"></div>
                    </div>

                    <div class="formElementAddTask">
                        <span class="formPointDescription formPointEditTaskHeadline" for="addTaskSubtasks">Subtasks</span>
                        <div class="widthFormElementsAddTask heightFormElementsAddTask borderFormElementsAddTask paddingLeftAddTask paddingRightAddTask inputTagAddTaskFocus" id="addTaskSubtasks" onclick="activateAddTaskSubtasks(); stayOpenOrActiv(event)">
                            <span id="textAddSubtask">Add new subtask</span>
                            <div id="circleIconPlusAddTaskSubtasks" class='circleIconAddTaskSubtasks'>
                                <img src="./assets/img/plus.svg">
                            </div>
                            <input id="inputAddSubtask" type="text" class="inputInsideDiv" style="display: none;" autocomplete="off">
                            <div id="iconsInputAddSubtask" class="iconsSubtask" style="display: none;">
                                <div class='circleIconAddTaskSubtasks' onclick="inputSubtaskDefault(), stayOpenOrActiv(event)">
                                    <img src="./assets/img/close.svg">
                                </div>
                                <div class="verticalLineAddTaskSubtasks"></div>
                                <div class='circleIconAddTaskSubtasks' onclick="stayOpenOrActiv(event), addSubtask()">
                                    <img src="./assets/img/check.svg">
                                </div>    
                            </div>
                        </div>
                        <ul id="subtasks">
                        </ul>
                    </div>

                </div>
            </div>
        </form>
        <div class="lowerAreaEditTask">
            <button class="button buttonFilled buttonWithIcon buttonOkEditTask" onclick="saveEdit()">
                Ok
                <div class="hookOkEditTask">
                    <svg width="15.49" height="11.22" viewBox="0 0 38 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3.92285 14.8085L15.1516 25.8745L33.8662 3.74243" stroke="white" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>

            </button>
        </div>
    `;
}

/**
 * This function changes the format of the date, displays it and changes its color to black.
 */
function displayDueDateEditTask(){
    let partsOfDateArray = taskBigCard.dueDate.split('/');
    let [day, month, year] = partsOfDateArray;
    let dateISO = new Date(year, month, day);
    let partsOfDate = formatDate(dateISO);

    let addTaskDueDate = document.getElementById('addTaskDueDate');
    addTaskDueDate.value = partsOfDate;
    addTaskDueDate.style.color = 'black';
}

/**
 * This function extracts the year, month and day of the ISO date and writes the month and day in two digits.
 * 
 * @param {date ISO} partsOfDate the date in the SO 8601-format
 * @returns year, month and day in the individually format
 */
function formatDate(dateISO){

    let year = dateISO.getFullYear();
    let month = String(dateISO.getMonth()).padStart(2, '0'); // Monat ist 0-basiert, daher +1
    let day = String(dateISO.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

/**
 * This function checks what priority the task has and executes an activating click on the corresponding button.
 */
function displayPrioEditTask(){
    if (taskBigCard.prio == 'Low') {
        let buttonLow = document.getElementById('addTaskPrioLow');
        buttonLow.click();
    } else if (taskBigCard.prio == 'Medium') {
        let buttonMedium = document.getElementById('addTaskPrioMedium');
        buttonMedium.click();
    } else if (taskBigCard.prio == 'Urgent') {
        let buttonUrgent = document.getElementById('addTaskPrioUrgent');
        buttonUrgent.click();
    }
}

/**
 * This function displays all available contacts. If there are already contacts assigned to the task, a for loop is used to check for each contact where it is in contactsAddTask. With the corresponding index, the ID of the corresponding checkbox is found and checked. At the end, the initials of the checked contacts are displayed.
 */
function displayContactsEditTask(){
    let dropdownContacts = document.getElementById('dropdownContacts');
    for (let i = 0; i < contactsAddTask.length; i++) {
        let contactForDropdown = contactsAddTask[i];
        dropdownContacts.innerHTML += htmlContactDropdown(contactForDropdown, i);
    }

    if (taskBigCard.assignedTo) {
        selectedContacts = taskBigCard.assignedTo;
    
        for (let i = 0; i < selectedContacts.length; i++) {
            let selectedContact = selectedContacts[i];
            let index = contactsAddTask.findIndex(obj => obj.color === selectedContact.color && obj.name === selectedContact.name);
            let checkboxOfSelectedContact = document.getElementById('checkboxSelectContacts' + index);
            checkboxOfSelectedContact.checked = true;
        }
        displayInitials();
    }
}

/**
 * This function displays the subtasks.
 */
function displaySubtasksEditTask(){
    if (taskBigCard.subtasks) {
        subtasksForm = taskBigCard.subtasks;
        let subtasks = document.getElementById('subtasks');
        for (let i = 0; i < taskBigCard.subtasks.length; i++) {
            let subtask = taskBigCard.subtasks[i];
            subtasks.innerHTML += templateSubtask(subtask.subtask, i);
        }
    }
}

/**
 * This function makes the edit task overlay disappear and empties it.
 */
function closeOverlayEditTask(){
    document.getElementById('overlayEditTaskBackground').classList.add('dNone');
    document.getElementById('overlayEditTask').innerHTML = '';
}

/**
 * This function creates a new version of the original task. 
 * The old one is replaced and the data on the page is re-rendered. 
 * If the dropdown menu for the contacts was previously open, 
 * it will be closed and the clicked contacts will be included. 
 * At the end, the status of the form validation is reset again.
 */
async function saveEdit(){
    if (buttonSelectContactClicked) {
        toggleSelectContactsButton();
    }

    let satusOfTaskBigCard = taskBigCard.status;
    let categoryOfTaskBigCard = taskBigCard.category;
    let newTask = await validateForm('Description');
    if (formValidated) {
        newTask.status = satusOfTaskBigCard;
        newTask.category = categoryOfTaskBigCard;

        await replaceTaskAndRender(newTask);
    }  
    formValidated = false;
}

/**
 * This function replaces the old task with the revised version, saves it to the database, re-renders everything and closes the overlay edit task.
 * 
 * @param {object} newTask the revised task
 */
async function replaceTaskAndRender(newTask){
    tasks[indextaskBigCard] = newTask;
    await putTasksToDatabase(tasks);
    displayBoard();
    displayDataInBigCard(indextaskBigCard);
    closeOverlayEditTask();
}