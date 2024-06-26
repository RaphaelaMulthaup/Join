/**
 * This function activates the input field for adding a subtask. Beforehand, it is checked whether something else is open or activated that should be closed beforehand.
 */
function activateAddTaskSubtasks(){
    let buttonText = document.getElementById("textAddSubtask");
    let circleIcon = document.getElementById('circleIconPlusAddTaskSubtasks');
    let inputField = document.getElementById("inputAddSubtask");
    let inputSubtasks = document.getElementById("addTaskSubtasks");
    let iconsInput = document.getElementById('iconsInputAddSubtask');

    if (inputField.style.display === "none") { 
        closeAndDisableEverythingOutsidAddTaskSubtasks();   

        buttonText.style.display = "none";
        circleIcon.style.display = 'none';
        inputField.style.display = "inline";
        iconsInput.style.display = 'flex';
        inputSubtasks.style.border = "1px solid #29ABE2";
        inputField.focus(); // Inputfeld fokussieren
        addSubtaskActiv = true;
    }
}

/**
 * This function checkes whether elements outside addTaskSubtasks are open or activated, that should be closed beforehand.
 */
function closeAndDisableEverythingOutsidAddTaskSubtasks(){
    if (buttonSelectContactClicked) {
        toggleSelectContactsButton();
    }
    if (buttonSelectCategoryClicked) {
        toggleSelectCategoryButton();
    }
    if (subMenuOpen) {
        closeSubMenu();
    }
    searchSubtaskInEditing();
}

/**
 * This function resets 'addTaskSubtasks' to the default value.
 */
function inputSubtaskDefault(){
    let buttonText = document.getElementById("textAddSubtask");
    let circleIcon = document.getElementById('circleIconPlusAddTaskSubtasks');
    let inputField = document.getElementById("inputAddSubtask");
    let inputSubtasks = document.getElementById("addTaskSubtasks");
    let iconsInput = document.getElementById('iconsInputAddSubtask');

    buttonText.style.display = "inline";
    circleIcon.style.display = 'flex';
    inputField.style.display = "none";
    inputField.value = '';
    iconsInput.style.display = 'none';
    inputSubtasks.style.border = "1px solid #D1D1D1";
    addSubtaskActiv = false;
}

/**
 * This function adds a new subtask to the SubtasksForm array. The subtasks are then rendered. InputSubtask is them set back to default.
 */
function addSubtask(){
     // Wert aus dem Inputfeld lesen
     let newSubtask = document.getElementById('inputAddSubtask').value;
   
     // Überprüfen, ob der Wert nicht leer ist
     if (newSubtask.trim() !== '') {
        let newSubtaskWithStatus = htmlSubtasktInTaskJson(newSubtask);
        subtasksForm.push(newSubtaskWithStatus);

        renderSubtasks();
     }
    inputSubtaskDefault();
}

/**
 * This function renders the subtasks, including an eventlistener to display an edited subtask with enter.
 */
function renderSubtasks(){
    let list = document.getElementById('subtasks');

    list.innerHTML = '';
    for (let i = 0; i < subtasksForm.length; i++) {
        list.innerHTML += templateSubtask(subtasksForm[i].subtask, i);
        let id = 'inputEditSubtask' + i;
        addEnterKeyListener(id);
    }
}

/**
 * This funktion returns a html template to create a new subtask.
 * 
 * @param {span} subtask new subtask out of input 'inputAddSubtask'
 * @returns html template 'new subtask' including li element and a div with a input field to edit the subtask
 */
function templateSubtask(subtask, i){
    return /*html*/ `
        <div class="liAndEditSubtask">
            <li onclick="editSubtask(this), stayOpenOrActiv(event)">
                <span>${subtask}</span>
                <div class="iconsSubtask" style="display: none;">
                    <div class='circleIconAddTaskSubtasks'>
                        <img class="imgEdit" src="./assets/img/edit.svg">
                    </div>
                    <div class="verticalLineAddTaskSubtasks"></div>
                    <div class='circleIconAddTaskSubtasks' onclick="deleteSubtask(${i}), stayOpenOrActiv(event)">
                        <img src="./assets/img/delete.svg">
                    </div>
                </div>
            </li>
            <div class="editSubtask" style="display: none;" onclick="stayOpenOrActiv(event)" id="editSubtask${i}">
                <input type="text" class="inputEditSubtask" value="${subtask}" id="inputEditSubtask${i}">
                <div class="iconsSubtask">
                    <div class='circleIconAddTaskSubtasks' onclick="deleteSubtask(${i})">
                        <img src="./assets/img/delete.svg">
                    </div>
                    <div class="verticalLineAddTaskSubtasks"></div>
                    <div class='circleIconAddTaskSubtasks displayEditedSubtask' onclick="displayEditedSubtask(${i})">
                        <img src="./assets/img/check.svg">
                    </div>    
                </div>
            </div>
        </div>
    `;
}

/**
 * This function adds an eventlistener that displays edited subtasks by pressing the enter key.
 * 
 * @param {span} id input field to edit a subtask
 */
function addEnterKeyListener(id) {
    let inputEditSubtask = document.getElementById(id);
    inputEditSubtask.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            searchSubtaskInEditing();
        }
    });
}

/**
 * This function deletes a subtask and renders the subtasks new. Beforehand, it is checked whether something else is open or activated that should be closed beforehand.
 * 
 * @param {span} deleteButton delete butten which belongs to a subtask
 */
function deleteSubtask(index){
    closeAndDisableEverythingOutsidTheCurrentSubtask();
    subtasksForm.splice(index, 1);
    renderSubtasks();
}

/**
 * This function checkes whether elements outside the current subtasks are open or activated, that should be closed beforehand.
 */
function closeAndDisableEverythingOutsidTheCurrentSubtask(){
    if (buttonSelectContactClicked) {
        toggleSelectContactsButton();
    }
    if (buttonSelectCategoryClicked) {
        toggleSelectCategoryButton();
    }
    if (subMenuOpen) {
        closeSubMenu();
    }
    if (addSubtaskActiv) {
        inputSubtaskDefault();
    }
    searchSubtaskInEditing();
}

/**
 * This function hides the li element and opens the div with the input field to edit the subtask. The focus is placed on the input field and the text cursor is placed at the end of the value. Beforehand, it is checked whether something else is open or activated that should be closed beforehand.
 * 
 * @param {span} editButton edit butten which belongs to a subtask
 */
function editSubtask(editButton){        
    closeAndDisableEverythingOutsidTheCurrentSubtask();

    let li = editButton.closest('li');
    li.style.display = 'none';

    let liAndEditSubtask = editButton.closest('.liAndEditSubtask');
    let editSubtaskDiv = liAndEditSubtask.querySelector('.editSubtask');
    let inputEditSubtask = editSubtaskDiv.querySelector('.inputEditSubtask');
    editSubtaskDiv.style.display = 'flex';
    inputEditSubtask.focus();
    inputEditSubtask.setSelectionRange(inputEditSubtask.value.length, inputEditSubtask.value.length);
}

/**
 * This function saves the edited subtasks in the array and renders the subtsks new.
 * 
 * @param {index} index check icon which belongs to a subtask
 */
function displayEditedSubtask(index){
    let Input = document.getElementById('inputEditSubtask' + index);
    let newValueSubtask = Input.value;
    subtasksForm[index] = newValueSubtask;
    renderSubtasks();
}

/**
 * This function looks for all subtasks and checks whether one, and if so, which one, has display flex and is currently being processed. This subtask will be displayed.
 */
function searchSubtaskInEditing(){
    // Alle Elemente mit der Klasse '.editSubtask' abrufen
    let editSubtasks = document.querySelectorAll('.editSubtask');

    // Durch alle Elemente iterieren und dasjenige finden, das 'display: flex' hat
    for (let i = 0; i < editSubtasks.length; i++) {
        let editSubtask = editSubtasks[i];
        if (window.getComputedStyle(editSubtask).getPropertyValue('display') === 'flex') {
            let id = editSubtask.id;
            let index = id.replace("editSubtask", "");
            displayEditedSubtask(index);
            break; // Schleife abbrechen, sobald das Element gefunden wurde
        }
    }
}
