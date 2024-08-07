/*display big card*/

let taskBigCard;
let indextaskBigCard;
let buttonSelectCategoryEditTaskClicked = false;
let buttonSelectContactEditTaskClicked = false;

/**
 * This function shows the big card and displays the selected task.
 * 
 * @param {index} i The index of the task in the tasks json.
 */
function openBigCard(i){
    document.getElementById('overlayBigCardBackground').classList.remove('dNone');
    displayDataInBigCard(i);
}

/**
 * This function displays the different data in big card.
 * 
 * @param {index} i The index of the task in the tasks json.
 */
function displayDataInBigCard(i){
    taskBigCard = tasks[i];
    indextaskBigCard = i;

    categoryBigCard();
    titleBigCard();
    descriptionBigCard();
    dueDateBigCard();
    priorityBigCard();
    assignedToBigCard();
    subtasksBigCard(i);
}

/**
 * This function displays the category in the big card and colors the div in the corresponding color.
 */
function categoryBigCard(){
    let categoryBigCard = document.getElementById('categoryBigCard');
    categoryBigCard.innerHTML = `${taskBigCard.category}`;

    if (taskBigCard.category == "User Story") {
        categoryBigCard.style.backgroundColor = '#0038FF';
    } else if (taskBigCard.category == "Technical Task") {
        categoryBigCard.style.backgroundColor = '#1FD7C1';
    }
}

/**
 * This function displays the title in the big card.
 */
function titleBigCard(){
    let titleBigCard = document.getElementById('titleBigCard');
    titleBigCard.innerHTML = `${taskBigCard.title}`;
}

/**
 * This function displays the description in the big card.
 */
function descriptionBigCard(){
    let descriptionBigCard = document.getElementById('descriptionBigCard');
    descriptionBigCard.innerHTML = `${taskBigCard.description}`;
}

/**
 * This function displays the due date in the big card.
*/
function dueDateBigCard(){
    let dueDateBigCard = document.getElementById('dueDateBigCard');
    dueDateBigCard.innerHTML = `${taskBigCard.dueDate}`;
}

/**
 * This function displays the priority in the big card and adds the corresponding icon.
 */
function priorityBigCard(){
    let priorityBigCard = document.getElementById('priorityBigCard');
    priorityBigCard.innerHTML = `${taskBigCard.prio}`;
    let imgPriorityBigCard = document.getElementById('imgPriorityBigCard');
    imgPriorityBigCard.src = ('./assets/img/capa' + taskBigCard.prio + '.svg');
}

/**
 * This function checks whether there are assigned users. If this is the case, the users and their initials will be displayed in the appropriate color. If this is not the case, assignedToBigCard is output.
 */
function assignedToBigCard(){
    let assignedToBigCardUsers = document.getElementById('assignedToBigCardUsers');
    assignedToBigCardUsers.innerHTML = '';
    if (taskBigCard.assignedTo) {
        for (let i = 0; i < taskBigCard.assignedTo.length; i++) {
            let user = taskBigCard.assignedTo[i];
            let initials = user.name.split(' ').map(word => word.charAt(0)).join('');
            assignedToBigCardUsers.innerHTML += htmlAssignedToBigCardUsers(i, initials, user, currentUser);
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
 * @param {object} currentUser Check if the initials match the current user and replace with "you" if they do
 * @returns returns the created div with the user name
 */
function htmlAssignedToBigCardUsers(i, initials, user, currentUser){
      if (currentUser && initials === currentUser.initials) {
        initials = "you";
    }

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
 * @param {index} i The index of the task in the tasks json.
 */
function subtasksBigCard(index) {
    if (taskBigCard.subtasks) {
        let subtasksBigCardChecklist = document.getElementById('subtasksBigCardChecklist');
        let subtasksHtml = ''; // Sammeln aller HTML-Elemente in einer Variable
        
        for (let i = 0; i < taskBigCard.subtasks.length; i++) {
            let subtask = taskBigCard.subtasks[i].subtask;
            subtasksHtml += htmlSubtaskBigCard(i, subtask, index); // HTML-Elemente sammeln
        }

        subtasksBigCardChecklist.innerHTML = subtasksHtml; // Einmalig innerHTML setzen
        
        for (let i = 0; i < taskBigCard.subtasks.length; i++) {
            if (taskBigCard.subtasks[i].status === 'done') {
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
 * @param {index} index The index of the task in the tasks json.
 * @returns returns the created div with the subtask
 */
function htmlSubtaskBigCard(i, subtask, index){
    return /*html*/ `
    <div class="subtaskBidCard" onclick="toggleCheckboxSubtasks('checkboxSubtask${i}')">
        <input type="checkbox" class="checkbox" id="checkboxSubtask${i}" style="display: none;" onchange="changeStatusSubtask('${index}', '${i}')">
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

    let event = new Event('change');
    checkbox.dispatchEvent(event);
}

/**
 * This function adds class 'removing' to 'overlayBigCard'. This will display the sliding out animation. After the animation plays, the div 'overlayBidCardBackground' is given the class .dNone. 'overlayBigCard' is set to default. 'removing' is then removed again.
 */
function closeBigCard(){
    let overlayBigCardBackground = document.getElementById('overlayBigCardBackground');
    let overlayBigCard = document.getElementById('overlayBigCard');
    overlayBigCard.classList.add('removing');
    setTimeout(function() {
        overlayBigCardBackground.classList.add('dNone');
        document.getElementById('overlayBigCard').innerHTML = htmlBigCard();
        overlayBigCard.classList.remove('removing');
    }, 100); // Dauer der Animation in Millisekunden
}

/**
 * This function creates the default content of the big card.
 * 
 * @returns  the default content of the big card
 */
function htmlBigCard(){
    return /*html*/ `
            <div class="bigCardData">    
                <div class="firstLineBigCard">
                    <div class="categoryBigCard" id="categoryBigCard"></div>
                    <div class="bigCardCloseButton" onclick="closeBigCard()">
                        <img src="./assets/img/close.svg" alt="close">
                    </div>
                </div>
                <h1 class="titleBigCard" id="titleBigCard"></h1>
                <span class="descriptionBigCard" id="descriptionBigCard"></span>
                <table>
                    <tr>
                        <td class="firstColumn">Due date:</td>
                        <td id="dueDateBigCard"></td>
                    </tr>
                    <tr class="middleLineTableBigCard">
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td class="firstColumn">Priority:</td>
                        <td class="priorityBigCard">
                            <span id="priorityBigCard"></span>
                            <img id="imgPriorityBigCard" src="">
                        </td>
                    </tr>
                </table>
                <div class="assignedToBigCard" id="assignedToBigCard">
                    <span>Assigned To:</span>
                    <div id="assignedToBigCardUsers"></div>
                </div>
                <div class="subtasksBigCard" id="subtasksBigCard">
                    <span>Subtasks</span>
                    <div id="subtasksBigCardChecklist"></div>
                </div>
            </div>
            <div class="editAndDeleteBigCard">
                <div class="deleteBigCard" onclick="deleteTask()">
                    <svg width="17" height="18" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3.14453 18C2.59453 18 2.1237 17.8042 1.73203 17.4125C1.34036 17.0208 1.14453 16.55 1.14453 16V3C0.861198 3 0.623698 2.90417 0.432031 2.7125C0.240365 2.52083 0.144531 2.28333 0.144531 2C0.144531 1.71667 0.240365 1.47917 0.432031 1.2875C0.623698 1.09583 0.861198 1 1.14453 1H5.14453C5.14453 0.716667 5.24036 0.479167 5.43203 0.2875C5.6237 0.0958333 5.8612 0 6.14453 0H10.1445C10.4279 0 10.6654 0.0958333 10.857 0.2875C11.0487 0.479167 11.1445 0.716667 11.1445 1H15.1445C15.4279 1 15.6654 1.09583 15.857 1.2875C16.0487 1.47917 16.1445 1.71667 16.1445 2C16.1445 2.28333 16.0487 2.52083 15.857 2.7125C15.6654 2.90417 15.4279 3 15.1445 3V16C15.1445 16.55 14.9487 17.0208 14.557 17.4125C14.1654 17.8042 13.6945 18 13.1445 18H3.14453ZM3.14453 3V16H13.1445V3H3.14453ZM5.14453 13C5.14453 13.2833 5.24036 13.5208 5.43203 13.7125C5.6237 13.9042 5.8612 14 6.14453 14C6.42786 14 6.66536 13.9042 6.85703 13.7125C7.0487 13.5208 7.14453 13.2833 7.14453 13V6C7.14453 5.71667 7.0487 5.47917 6.85703 5.2875C6.66536 5.09583 6.42786 5 6.14453 5C5.8612 5 5.6237 5.09583 5.43203 5.2875C5.24036 5.47917 5.14453 5.71667 5.14453 6V13ZM9.14453 13C9.14453 13.2833 9.24037 13.5208 9.43203 13.7125C9.6237 13.9042 9.8612 14 10.1445 14C10.4279 14 10.6654 13.9042 10.857 13.7125C11.0487 13.5208 11.1445 13.2833 11.1445 13V6C11.1445 5.71667 11.0487 5.47917 10.857 5.2875C10.6654 5.09583 10.4279 5 10.1445 5C9.8612 5 9.6237 5.09583 9.43203 5.2875C9.24037 5.47917 9.14453 5.71667 9.14453 6V13Z" fill="#2A3647"/>
                    </svg>                        
                    <span>Delete</span>
                </div>
                <div class="verticalLineEditAndDeleteBigCard"></div>
                <div class="editBigCard" onclick="editTask()">
                    <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3.0612 22.1418H4.92787L16.4279 10.6418L14.5612 8.7751L3.0612 20.2751V22.1418ZM22.1279 8.70843L16.4612 3.10843L18.3279 1.24176C18.839 0.730653 19.4668 0.475098 20.2112 0.475098C20.9556 0.475098 21.5834 0.730653 22.0945 1.24176L23.9612 3.10843C24.4723 3.61954 24.739 4.23621 24.7612 4.95843C24.7834 5.68065 24.539 6.29732 24.0279 6.80843L22.1279 8.70843ZM20.1945 10.6751L6.0612 24.8084H0.394531V19.1418L14.5279 5.00843L20.1945 10.6751Z" fill="#2A3647"/>
                    </svg>                        
                    <span>Edit</span>
                </div>
            </div>
    `;
}

/**
 * This function changes the status of a subtask and saves it to the database. Afterwards, board is reloaded with the new data.
 * 
 * @param {index} index The index of the task in the tasks json.
 * @param {index} i The index of the subtask in the subtasks json.
 */
async function changeStatusSubtask(index, i) {
    let newStatus = tasks[index].subtasks[i].status == 'to do' ? 'done' : 'to do';
    tasks[index].subtasks[i].status = newStatus;

    await fetch(`${firebaseUrl}/tasks/${index}/subtasks/${i}/status.json`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(newStatus)
    });

    displayBoard();
}

/**
 * This function deletes the task that is open in the big card. 'tasks' is replaced with a filtered version without the current task. After that, tasks will be saved to the database. The big card is then closed and the board is reloaded.
 */
async function deleteTask(){
    tasks = tasks.filter(taskToCheck => taskToCheck !== taskBigCard);
    await putTasksToDatabase(tasks);
    closeBigCard();
    displayBoard();
}