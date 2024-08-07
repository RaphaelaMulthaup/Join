let findTaskFocus = false;
let overlayAddTaskOpen = false;

/**
 * This funktion sets clicked elements back to default.
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
 * This function colors the border of 'findTask' gray again.
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

document.addEventListener('DOMContentLoaded', () => {
    let button = document.getElementById('buttonAddTask');
    button.addEventListener('click', () => {
        if (window.innerWidth < 1170) {
            window.location.href = './addTask.html';
        } else {
            openOverlayAddTask();
        }
    });
});

/**
 * This function emptys the subtasksForm array, displays the add task overlay and sets overlayAddTaskOpen to true. Beforehand, it is checked whether something else is open or activated that should be closed beforehand.
 */
function openOverlayAddTask(){
    if (subMenuOpen) {
        closeSubMenu();
    }
    if (findTaskFocus) {
        findTaskDefault();
    }
    subtasksForm = [];
    displayOverlayAddTask();
    overlayAddTaskOpen = true;
}

/**
 * This function prepares the form and takes away the 'dNone' class from the div 'overlayAddTaskBackground'. The overlay with animation is displayed including contacts. 
 */
function displayOverlayAddTask(){
    prepareOverlayAddTaskForm();
    document.getElementById('overlayAddTaskBackground').classList.remove('dNone');
}

/**
 * This function fills overlayAddTask with the corresponding html code, sets event listerner, displays the contacts and sets as an attribute for addTaskDueDate that the date must not be in the past.
 */
function prepareOverlayAddTaskForm(){
    document.getElementById('overlayAddTask').innerHTML = htmlAddTaskOverlay();
    addEventListener();

    let dropdownContacts = document.getElementById('dropdownContacts');
    for (let i = 0; i < contactsAddTask.length; i++) {
        let contactForDropdown = contactsAddTask[i];
        dropdownContacts.innerHTML += htmlContactDropdown(contactForDropdown, i);
    }

    let addTaskDueDate = document.getElementById('addTaskDueDate');
    let today = new Date().toISOString().split('T')[0];
    addTaskDueDate.setAttribute('min', today);
}

/**
 * This function sets two event listener. One for an enter event at inputAddSubtask and one to hide the form validation hints.
 */
function addEventListener(){
    /**
     * This eventlistener creates a new subtask when the enter key is pressed within 'inputAddSubtask'.
     */
    let inputAddSubtask = document.getElementById('inputAddSubtask');

    inputAddSubtask.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            addSubtask();
        }
    });

    /**
     * This event listener checks validity. If the value is valid, the error display and red border are removed, if applicable.
     */

    document.querySelectorAll('.addTaskInputRequired').forEach(inputElement => {
        inputElement.addEventListener("input", function() {
            if (inputElement.checkValidity()) {
                // Wenn das Eingabefeld gültig ist, entfernen Sie die Fehlermeldung und den roten Rahmen
                let errorMessageElement = document.getElementById("requiredMessage" + inputElement.id.replace("addTask", "") + "AddTask");
                if (errorMessageElement) {
                    errorMessageElement.style.visibility = 'hidden';
                }
                inputElement.classList.remove("borderRed");
            }
        });
    });
}

/**
 * This function creates the overlay add task.
 * 
 * @returns the overlay add task
 */
function htmlAddTaskOverlay(){
    return /*html*/ `
        <div class="scroll-container">
    <div class="headlineAddTaskOverlay">
        <h1>Add Task</h1>
        <div class="addTaskOverlayCloseButton" onclick="stayOpenOrActiv(event); firstDefaultThenClosing()">
            <img src="./assets/img/close.svg" alt="close">
        </div>
    </div>
    <form onsubmit="addNewTask('OnBoardDescription'); return false;" class="formAddTask" novalidate id="formAddNewTask">
        <div class="inputTagsAddTask inputTagsAddTaskOverlay">
            <div class="addTaskFormLeft">
        
                <div class="formElementAddTask">
                    <label class="formPointDescription" for="addTaskTitle">Title<span class="colorRed">*</span></label>
                    <input class="widthFormElementsAddTask heightFormElementsAddTask borderFormElementsAddTask inputTagAddTaskFocus addTaskInputRequired" id="addTaskTitle" name="addTaskTitle" type="text" required placeholder="Enter a title" autocomplete="off">
                    <span class="requiredMessage" id="requiredMessageTitleAddTask">This field is required</span>
                </div>
        
                <div class="formElementAddTask">
                    <label class="formPointDescription" for="addTaskOnBoardDescription">Description<span class="colorRed">*</span></label>
                    <textarea class="widthFormElementsAddTask borderFormElementsAddTask paddingLeftAddTask inputTagAddTaskFocus addTaskInputRequired" name="addTaskDescription" id="addTaskOnBoardDescription" onmouseover="preventNotice('addTaskOnBoardDescription')" 
                    onmouseout="restoreRequired('addTaskOnBoardDescription')" required placeholder="Enter a description"></textarea>
                    <span class="requiredMessage" id="requiredMessageOnBoardDescriptionAddTask">This field is required</span>
                </div>
        
                <div class="formElementAddTask">
                    <span class="formPointDescription">Assigned to</span>
                    <div class="dropdown" id="addTaskAssignedTo">
                        <button formnovalidate id="buttonSelectContacts" class="buttonSelectContacts widthFormElementsAddTask heightFormElementsAddTask borderFormElementsAddTask paddingRightAddTask" onclick="selectContactsButton(event)">
                            <span id="textSelectContacts">Select contacts to assign</span>
                            <input class="inputInsideDiv" type="text" id="inputSelectContacts" style="display: none;" autocomplete="off">
                            <img id="arrowIcon" src="./assets/img/arrowdropdownDown.svg" alt="">
                        </button>
                        <div class="dropdown-content widthFormElementsAddTask dropdownContactsHidden" id="dropdownContacts" onclick="stayOpenOrActiv(event)"></div>
                    </div>
                    <div id="initialsSelectedContacts" class="initialsSelectedContacts"></div>
                </div>
        
            </div>
            <div class="verticalLineAddTask"></div>
            <div class="addTaskFormRight">
        
                <div class="formElementAddTask">
                    <label class="formPointDescription" for="addTaskDueDate">Due date<span class="colorRed">*</span></label>
                    <input class="widthFormElementsAddTask heightFormElementsAddTask borderFormElementsAddTask paddingLeftAddTask paddingRightAddTask inputTagAddTaskFocus addTaskInputRequired" id="addTaskDueDate" name="addTaskDueDate" type="date" required onfocus="blackColorDueDate(this)" oninput="blackColorDueDate(this)" onblur="changeColorDueDate(this)">
                    <span class="requiredMessage" id="requiredMessageDueDateAddTask">This field is required</span>
                </div>
                
                <div class="formElementAddTask">
                    <span class="formPointDescription">Prio</span>
                    <div class="addTaskPrioButtons addTaskPrioButtonsAddTask widthFormElementsAddTask">
                        <button formnovalidate class="buttonAddTaskPage" id="addTaskPrioUrgent" onclick="priorityUrgent(event)">Urgent <img id="imgUrgent" src="./assets/img/capaUrgent.svg"></button>
                        <button formnovalidate class="buttonAddTaskPage addTaskPrioActiv addTaskPrioMediumActiv" id="addTaskPrioMedium" onclick="priorityMedium(event)">Medium <img id="imgMedium" src="./assets/img/capaMediumWhite.svg"></button>
                        <button formnovalidate class="buttonAddTaskPage" id="addTaskPrioLow" onclick="priorityLow(event)">Low <img id="imgLow" src="./assets/img/capaLow.svg"></button>
                    </div>
                </div>
        
                <div class="formElementAddTask">
                    <span class="formPointDescription">Category<span class="colorRed">*</span></span>
                    <div class="dropdown" id="addTaskCategory">
                        <button formnovalidate id="buttonSelectCategory" class="buttonSelectCategory widthFormElementsAddTask heightFormElementsAddTask borderFormElementsAddTask paddingRightAddTask" onclick="selectCategoryButton(event)">
                            <span id="textSelectCategory">Select task category</span>
                            <img id="arrowIconCategory" src="./assets/img/arrowdropdownDown.svg">
                        </button>
                        <div class="dropdown-content widthFormElementsAddTask hidden" id="dropdownCategory">
                            <label class="paddingLeftAddTask" onclick="selectCategory('Technical Task')">Technical Task</label>
                            <label class="paddingLeftAddTask" onclick="selectCategory('User Story')">User Story</label>
                        </div>
                    </div>
                    <span class="requiredMessage" id="requiredMessageCategoryAddTask">This field is required</span>
                </div>
        
                <div class="formElementAddTask">
                    <span class="formPointDescription" for="addTaskSubtasks">Subtasks</span>
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
                    <ul id="subtasks" class="subtasksAddTask">
                    </ul>
                </div>
        
            </div>
        </div>
        <div class="lowerAreaAddTask">
            <span class="lowerAreaAddTaskNecessity">
                <span class="colorRed">*</span>
                This field is required
            </span>
            <div class="lowerAreaAddTaskButtons">
                <button type="button" class="button buttonEmpty buttonCancel buttonAddTaskPage" onclick="prepareOverlayAddTaskForm()">
                    Clear
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path class="svgCancelX" d="M6.9998 8.36587L2.0998 13.2659C1.91647 13.4492 1.68314 13.5409 1.3998 13.5409C1.11647 13.5409 0.883138 13.4492 0.699805 13.2659C0.516471 13.0825 0.424805 12.8492 0.424805 12.5659C0.424805 12.2825 0.516471 12.0492 0.699805 11.8659L5.5998 6.96587L0.699805 2.06587C0.516471 1.88254 0.424805 1.6492 0.424805 1.36587C0.424805 1.08254 0.516471 0.849202 0.699805 0.665869C0.883138 0.482536 1.11647 0.390869 1.3998 0.390869C1.68314 0.390869 1.91647 0.482536 2.0998 0.665869L6.9998 5.56587L11.8998 0.665869C12.0831 0.482536 12.3165 0.390869 12.5998 0.390869C12.8831 0.390869 13.1165 0.482536 13.2998 0.665869C13.4831 0.849202 13.5748 1.08254 13.5748 1.36587C13.5748 1.6492 13.4831 1.88254 13.2998 2.06587L8.3998 6.96587L13.2998 11.8659C13.4831 12.0492 13.5748 12.2825 13.5748 12.5659C13.5748 12.8492 13.4831 13.0825 13.2998 13.2659C13.1165 13.4492 12.8831 13.5409 12.5998 13.5409C12.3165 13.5409 12.0831 13.4492 11.8998 13.2659L6.9998 8.36587Z" fill="#2A3647"/>
                    </svg> 
                </button>
                <button class="button buttonFilled buttonWithIcon buttonAddTaskPage buttonCreateTask">
                    Create Task
                    <svg width="15.49" height="11.22" viewBox="0 0 38 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3.92285 14.8085L15.1516 25.8745L33.8662 3.74243" stroke="white" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
            </div>
        </div>
    </form>
</div>
    `;
}

/**
 * This function sets the status of the task before the overlay opens.
 * 
 * @param {string} status The status that a new task should have.
 */
function openOverlayAddTaskCertainStatus(status){
    satusNewTask = status;
    openOverlayAddTask();
}

/**
 * This function first sets other elements to default bevor closing overlay add task.
 */
function firstDefaultThenClosing(){
    setElementsToDefaultAddTask();
    closeOverlayAddTask();
}

/**
 * This function adds class 'removing' to 'overlayAddTask'. This will display the sliding out animation. After the animation plays, the div 'overlayAddTaskBackground' is given the class .dNone. 'removing' is then removed again. The html in overlayAddTask will be deleted. StatusNewTask is set back to 'to do' and overlayAddTaskOpen back to false.
 */
function closeOverlayAddTask(){
    satusNewTask = "to do";
    let overlayAddTaskBackground = document.getElementById('overlayAddTaskBackground');
    let overlayAddTask = document.getElementById('overlayAddTask');
    overlayAddTask.classList.add('removing');
    setTimeout(function() {
        overlayAddTaskBackground.classList.add('dNone');
        overlayAddTask.classList.remove('removing');
    }, 100); // Dauer der Animation in Millisekunden
    overlayAddTask.innerHTML = '';
    overlayAddTaskOpen = false;
}