let buttonSelectContactClicked = false;
let categoryArrowUp = false;
let buttonSelectCategoryClicked = false;
let addSubtaskActiv = false;
let contactsAddTask = [];
let selectedContacts = [];
let selectedCategory;
let subtasksForm = [];
let formValidated = false;

/**
 * This function loads the add task page with the contacts and resets the selected category and the subtasks.
 */
async function loadAddTaskPage(){
    await loadPage('menuItemAddTask');
    await loadTasksAndContacts();
    await displayContacts();
    selectedCategory = '';
    subtasksForm = [];


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
}

/**
 * This function loads the contacts and displays them.
 */
async function displayContacts(){

    let dropdownContacts = document.getElementById('dropdownContacts');
    for (let i = 0; i < contactsAddTask.length; i++) {
        let contactForDropdown = contactsAddTask[i];
        dropdownContacts.innerHTML += htmlContactDropdown(contactForDropdown, i);
    }
}

/**
 * This function creates a selection point in the dropdown menu and returns it.
 * 
 * @param {object} contactForDropdown the contact that is displayed
 * @param {index} i index of the contact in the contactsAddTask JSON
 * @returns 
 */
function htmlContactDropdown(contactForDropdown, i){
    return /*html*/ `
        <label class="paddingLeftAddTask">
            <div class="coloredCircleInitials" style="background-color: ${contactForDropdown.color}">${contactForDropdown.initials}</div>
            <div class="selectContactsName">${contactForDropdown.name}</div> 
            <input type="checkbox" id="checkboxSelectContacts${i}" class="checkbox checkboxSelectContacts" style="display: none;">
            <label for="checkboxSelectContacts${i}"></label>
        </label>
    `;
}

/**
 * This funktion sets clickt elements back to default.
 */
function setElementsToDefaultAddTask(){
    closeSubMenu();
    selectContactsButtonDefault();
    categoryArrowDefault();
    inputSubtaskDefault();
    searchSubtaskInEditing();
}

/*assigned to*/

/**
 * This function disables validation of the form, prevents the function toggleSelectContactsButton from being executed twice and calls the function that expands or collapses the div with contacts.
 * 
 * @param {click event} event click on buttonSelectContacts
 */
function selectContactsButton(event) {
    event.preventDefault();
    event.stopPropagation(); // Verhindert, dass das Klicken auf das Inputfeld das Dropdown schließt
    toggleSelectContactsButton();
}

/**
 * This function expands or collapses the div with contacts and changes the arrow from top to bottom and vice versa. Beforehand, it is checked whether something else is open or activated that should be closed beforehand.
 */
function toggleSelectContactsButton(){
    let buttonText = document.getElementById("textSelectContacts");
    let inputField = document.getElementById("inputSelectContacts");
    let button = document.getElementById("buttonSelectContacts");
    let arrowIcon = document.getElementById('arrowIcon');
    let dropdownContacts =document.getElementById('dropdownContacts');

    if (buttonText.style.display === "none") {
        // Wenn der Text ausgeblendet ist, zeige ihn wieder an und blende das Inputfeld aus
        setButtonSelectContactsToDefault(buttonText, inputField, button, arrowIcon, dropdownContacts);
    } else {
        closeAndDisableEverythingOutsideSelectContactsButton();
        // Wenn der Text sichtbar ist, blende ihn aus und zeige das Inputfeld an
        activateInputSelectContacts(buttonText, inputField, button, arrowIcon, dropdownContacts);
    }
}

/**
 * This function shows 'textSelectContacts' again and turns the border of the button gray. The input field is hidden and the value is deleted. The downward arrow graphic is inserted and the dropdown menu is hidden.
 * 
 * @param {span} buttonText request text 'Select contacts to assign'
 * @param {span} inputField input field to search for a contact
 * @param {span} button button to open the dropdown menu to select a contact
 * @param {span} arrowIcon arrow icon belonging to the dropdown menu
 * @param {span} dropdownContacts the dropdown menu to select a contact
 */
function setButtonSelectContactsToDefault(buttonText, inputField, button, arrowIcon, dropdownContacts){
    buttonText.style.display = "inline";
    inputField.style.display = "none";
    inputField.value = "";
    button.style.border = "1px solid #D1D1D1";
    arrowIcon.src = "./assets/img/arrowdropdownDown.svg";
    buttonSelectContactClicked = false; // Button wurde nicht geklickt
    dropdownContacts.classList.add('dropdownContactsHidden');
    displayInitials();
}

/**
 * This function displays the initials of the selected contacts. The JSON 'selectedContacts' is emtied and filled again with the contacts with a checked Checkbox. After that the initals are displayed in 'initialsSelectedContacts' whitch was also emtied bevor.
 */
function displayInitials(){
    selectedContacts = [];
    for (let i = 0; i < contactsAddTask.length; i++) {
        let checkbox = document.getElementById('checkboxSelectContacts' + i);
        if (checkbox.checked) {
            selectedContacts.push(contactsAddTask[i]);
        } 
    }

    let initialsSelectedContacts = document.getElementById('initialsSelectedContacts');
    initialsSelectedContacts.innerHTML = '';
    for (let i = 0; i < selectedContacts.length; i++) {
        initialsSelectedContacts.innerHTML += htmlInitialsSelectedContacts(selectedContacts[i].color, selectedContacts[i].initials);
    }
}

/**
 * This function creates and returnes a div with the initails of the selected contacts.
 * 
 * @param {string} color the background color of the div
 * @param {string} initials the initials
 * @returns the created div
 */
function htmlInitialsSelectedContacts(color, initials){
    return /*html*/ `
        <div class="coloredCircleInitials" style="background-color: ${color}">${initials}</div>
    `;
}

/**
 * This function hides 'textSelectContacts' and turns the border of the button blue. The input field is shown and gets a focus. The upward arrow graphic is inserted and the dropdown menu is shown.
 * 
 * @param {span} buttonText request text 'Select contacts to assign'
 * @param {span} inputField input field to search for a contact
 * @param {span} button button to open the dropdown menu to select a contact
 * @param {span} arrowIcon arrow icon belonging to the dropdown menu
 * @param {span} dropdownContacts the dropdown menu to select a contact
 */
function activateInputSelectContacts(buttonText, inputField, button, arrowIcon, dropdownContacts){
    buttonText.style.display = "none";
    inputField.style.display = "inline";
    button.style.border = "1px solid #29ABE2";
    inputField.focus(); // Inputfeld fokussieren
    arrowIcon.src = "./assets/img/arrowdropdownup.svg";
    buttonSelectContactClicked = true; // Button wurde geklickt
    dropdownContacts.classList.remove('dropdownContactsHidden');
}


/**
 * This function checkes whether elements outside selectContactsButton are open or activated, that should be closed beforehand.
 */
function closeAndDisableEverythingOutsideSelectContactsButton(){
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
 * This function checks whether the drop down menu for selecting contacts is expanded. If that's the case, the function toggleSelectContactsButton is called to collapse it.
*/
function selectContactsButtonDefault(){
    if (buttonSelectContactClicked) {
        toggleSelectContactsButton();
    }
}

/*due date*/

/**
 * This function changes the font color to black when the input field receives focus or when the user types something.
 * 
 * @param {string} input the input field typ date
 */
function blackColorDueDate(input) {
    input.style.color = 'black';
}

/**
 * This function changes the font color to black if a date has been entered or to gray if no date has been entered.
 * 
 * @param {string} input the input field typ date
 */
function changeColorDueDate(input){
    if (input.value !== '') {
        input.style.color = 'black'; // Ändert die Schriftfarbe auf Schwarz, wenn ein Datum eingetragen ist
    } else {
        input.style.color = '#D1D1D1'; // Ändert die Schriftfarbe auf Grau, wenn kein Datum eingetragen ist
    }
}

/*prio*/

/**
 * This function disables validation of the form, styles the button with urgent prioryty prominently and removes the prominent style from the other two buttons.
 *
 * @param {click event} event click on addTaskPrioUrgent
 */
function priorityUrgent(event){
    event.preventDefault();
    if (addTaskPrioUrgent.classList.contains('addTaskPrioActiv')) {
        document.getElementById('addTaskPrioUrgent').classList.remove('addTaskPrioActiv', 'addTaskPrioUrgentActiv');
        document.getElementById('imgUrgent').src = './assets/img/capaUrgent.svg';    
    } else {
        document.getElementById('addTaskPrioMedium').classList.remove('addTaskPrioActiv', 'addTaskPrioMediumActiv');
        document.getElementById('imgMedium').src = './assets/img/capaMedium.svg';
        document.getElementById('addTaskPrioLow').classList.remove('addTaskPrioActiv', 'addTaskPrioLowActiv');
        document.getElementById('imgLow').src = './assets/img/capaLow.svg';
        document.getElementById('addTaskPrioUrgent').classList.add('addTaskPrioActiv', 'addTaskPrioUrgentActiv');
        document.getElementById('imgUrgent').src = './assets/img/capaUrgentWhite.svg';
    }
}

/**
 * This function disables validation of the form, styles the button with medium prioryty prominently and removes the prominent style from the other two buttons.
 * 
 * @param {click event} event click on addTaskPrioMedium
 */
function priorityMedium(event){
    event.preventDefault();
    if (addTaskPrioMedium.classList.contains('addTaskPrioActiv')) {
        document.getElementById('addTaskPrioMedium').classList.remove('addTaskPrioActiv', 'addTaskPrioMediumActiv');
        document.getElementById('imgMedium').src = './assets/img/capaMedium.svg';    
    } else {
        document.getElementById('addTaskPrioUrgent').classList.remove('addTaskPrioActiv', 'addTaskPrioUrgentActiv');
        document.getElementById('imgUrgent').src = './assets/img/capaUrgent.svg';
        document.getElementById('addTaskPrioLow').classList.remove('addTaskPrioActiv', 'addTaskPrioLowActiv');
        document.getElementById('imgLow').src = './assets/img/capaLow.svg';
        document.getElementById('addTaskPrioMedium').classList.add('addTaskPrioActiv', 'addTaskPrioMediumActiv');
        document.getElementById('imgMedium').src = './assets/img/capaMediumWhite.svg';
    }
}

/**
 *This function disables validation of the form, styles the button with low prioryty prominently and removes the prominent style from the other two buttons.
 *
 * @param {click event} event click on addTaskPrioLow
 */
function priorityLow(event){
    event.preventDefault();
    if (addTaskPrioLow.classList.contains('addTaskPrioActiv')) {
        document.getElementById('addTaskPrioLow').classList.remove('addTaskPrioActiv', 'addTaskPrioLowActiv');
        document.getElementById('imgLow').src = './assets/img/capaLow.svg';    
    } else {
        document.getElementById('addTaskPrioMedium').classList.remove('addTaskPrioActiv', 'addTaskPrioMediumActiv');
        document.getElementById('imgMedium').src = './assets/img/capaMedium.svg';
        document.getElementById('addTaskPrioUrgent').classList.remove('addTaskPrioActiv', 'addTaskPrioUrgentActiv');
        document.getElementById('imgUrgent').src = './assets/img/capaUrgent.svg';
        document.getElementById('addTaskPrioLow').classList.add('addTaskPrioActiv', 'addTaskPrioLowActiv');
        document.getElementById('imgLow').src = './assets/img/capaLowWhite.svg';
    }
}

/*category*/
/**
 * This function disables validation of the form, prevents the function toggleSelectCategoryButton from being executed twice and calls the function that expands or collapses the div with categorys.
 * 
 * @param {click event} event click on buttonSelectCategory
 */
function selectCategoryButton(event) {
    event.preventDefault();
    event.stopPropagation(); // Verhindert, dass das Klicken auf das Inputfeld das Dropdown schließt
    toggleSelectCategoryButton();
}

/**
 * This function expands or collapses the div with categorys and changes the arrow from top to bottom and vice versa. Beforehand, it is checked whether something else is open or activated that should be closed beforehand.
 */
function toggleSelectCategoryButton(){
    let arrowIcon = document.getElementById('arrowIconCategory');
    let dropdownCategory = document.getElementById('dropdownCategory');

    if (buttonSelectCategoryClicked) {
        arrowIcon.src = "./assets/img/arrowdropdownDown.svg";
        buttonSelectCategoryClicked = false; // Button wurde nicht geklickt
        dropdownCategory.classList.add('hidden');
        
    } else {   
        closeAndDisableEverythingOutsideSelectCategroyButton();   

        arrowIcon.src = "./assets/img/arrowdropdownup.svg";
        buttonSelectCategoryClicked = true; // Button wurde geklickt
        dropdownCategory.classList.remove('hidden');
    }
}

/**
 * This function checkes whether elements outside selectCategoryButton are open or activated, that should be closed beforehand.
 */
function closeAndDisableEverythingOutsideSelectCategroyButton(){
    if (buttonSelectContactClicked) {
        toggleSelectContactsButton();
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
 * This function checks whether the “Select category” button was clicked. In this case the function “toggleSelectCategoryButton()” is called.
 */
function categoryArrowDefault(){
    if (buttonSelectCategoryClicked) {
        toggleSelectCategoryButton();
    }
}

/**
 * This function closes the dropdown menu, puts the selection inside the button 'buttonSelectCategory' and removes the error massage and the red border around buttonSelectCategory. In addition, the selected category is saved in a global variable.
 * 
 * @param {span} selection the selected category
 */
function selectCategory(selection){
    let button = document.getElementById('buttonSelectCategory');
    let errorMessageElement = document.getElementById('requiredMessageCategoryAddTask');

    toggleSelectCategoryButton();
    selectedCategory = selection;
    console.log(selectedCategory);
    document.getElementById('textSelectCategory').innerHTML = selection;
    errorMessageElement.style.visibility = 'hidden';
    button.classList.remove("borderRed");
}

/*subtasks*/
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
 * This function adds the new subtask to the list, including an eventlistener to display an edited subtask with enter, and resets 'addTaskSubtasks'.
 */
function addSubtask(){
     // Wert aus dem Inputfeld lesen
     let newSubtask = document.getElementById('inputAddSubtask').value;
     let list = document.getElementById('subtasks');

     // Überprüfen, ob der Wert nicht leer ist
     if (newSubtask.trim() !== '') {
        subtasksForm.push(newSubtask);

        renderSubtasks();
     }
    inputSubtaskDefault();
}

function renderSubtasks(){
    let list = document.getElementById('subtasks');

    list.innerHTML = '';
    for (let i = 0; i < subtasksForm.length; i++) {
        list.innerHTML += templateSubtask(subtasksForm[i], i);
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
 * This function deletes a subtask. Beforehand, it is checked whether something else is open or activated that should be closed beforehand.
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
 * This function displays the edited subtask inside a li element.
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

/*form validation*/

/**
 * This event listener checks validity. If the value is valid, the error display and red border are removed, if applicable.
 */
document.addEventListener("DOMContentLoaded", function() {
    document.querySelectorAll('.addTaskInputRequired').forEach(inputElement => {
        inputElement.addEventListener("input", function() {
            if (inputElement.checkValidity()) {
                // Wenn das Eingabefeld gültig ist, entfernen Sie die Fehlermeldung und den roten Rahmen
                let errorMessageElement = document.getElementById("requiredMessage" + inputElement.id.replace("addTask", "") + "AddTask");
                errorMessageElement.style.visibility = 'hidden';
                inputElement.classList.remove("borderRed");
            }
        });
    });
});

/**
 * This function checks whether the value of the input field is valid. In this case, an error message is displayed and the border of the input field turns red.
 * 
 * @param {string} element The element that is to be checked is named.
 */
function validateInput(element) {
    let inputElement = document.getElementById("addTask" + element);
    let errorMessageElement = document.getElementById("requiredMessage" + element + "AddTask");
    
    if (!inputElement.checkValidity()) {
        // Benutzerdefinierte Fehlermeldung anzeigen
        errorMessageElement.style.visibility = 'visible';
        inputElement.classList.add("borderRed"); // Färben Sie den Rahmen des Eingabefelds rot
    }
}

/**
 * This function checks whether a category has been selected. If not, the border of buttonSelectCategory will be colored red and the error message will appear.
 */
function validateInputCategory(){
    if (document.getElementById('textSelectCategory') !== null) {
        let textButtonSelectCategory = document.getElementById('textSelectCategory').innerHTML;
        let button = document.getElementById('buttonSelectCategory');
        let errorMessageElement = document.getElementById('requiredMessageCategoryAddTask');

        if (textButtonSelectCategory == ('Select task category')) {
            errorMessageElement.style.visibility = 'visible';
            button.classList.add("borderRed");
        }
    }

}

/**
 * This function checks whether the required input fields are valid and submits the form if necessary.
 */
async function addNewTask() {
    let newTask = await validateForm();
    if (formValidated) {
        newTask.category = "selectedCategory";
        tasks.push(newTask);  
        console.log(tasks);
        await putTasksToDatabase(tasks);
        location.reload(); 
    }
    formValidated = false;
}

async function validateForm(){
    validateInput("Title");
    validateInput("Description");
    validateInput("DueDate");
    validateInputCategory();

    let titleInput = document.getElementById("addTaskTitle");
    let descriptionInput = document.getElementById("addTaskDescription");
    let dueDateInput = document.getElementById("addTaskDueDate");
    let categoryValid = true;

    let categoryElement = document.getElementById('textSelectCategory');
    if (categoryElement !== null) {
        let categoryInput = categoryElement.innerHTML;
        categoryValid = categoryInput !== 'Select task category';
    }
      
    if (titleInput.checkValidity() && descriptionInput.checkValidity() && dueDateInput.checkValidity() && categoryValid) {
        let newTask = await addNewTaskRecordAndSaveData();
        formValidated = true;
        return newTask;
    }
}

/**
 * This function records the data for a new task and pushes them to 'tasks'.
 */
async function addNewTaskRecordAndSaveData(){
    let titleNewTask = document.getElementById('addTaskTitle').value;
    let descriptionNewTask = document.getElementById('addTaskDescription').value;

    let dueDateNewTask = document.getElementById('addTaskDueDate').value;

    let assignedToNewTask = [];
    for (let i = 0; i < selectedContacts.length; i++) {
        let selectedContactforNewTaskAllInformations = selectedContacts[i];
        let  selectedContactforNewTask = htmlContactInTaskJson(selectedContactforNewTaskAllInformations);
        assignedToNewTask.push(selectedContactforNewTask);
    }

    let addTaskPrioUrgent = document.getElementById('addTaskPrioUrgent');
    let addTaskPrioMedium = document.getElementById('addTaskPrioMedium');
    let addTaskPrioLow = document.getElementById('addTaskPrioLow');
    let prioNewTask;
    if (addTaskPrioUrgent.classList.contains('addTaskPrioActiv')) {
        prioNewTask = 'Urgent'
    } else if (addTaskPrioMedium.classList.contains('addTaskPrioActiv')) {
        prioNewTask = 'Medium'
    } else if (addTaskPrioLow.classList.contains('addTaskPrioActiv')) {
        prioNewTask = 'Low'
    }

    let subtasksNewTask = [];
    for (let i = 0; i < subtasksForm.length; i++) {
        let subtask = htmlSubtasktInTaskJson(subtasksForm[i]);
        subtasksNewTask.push(subtask);
    }

    let newTask = createNewTask(titleNewTask, descriptionNewTask, assignedToNewTask, dueDateNewTask, prioNewTask, subtasksNewTask);
    return newTask;
}

/**
 * This function creates an object with the data of a contact and returns it.
 * 
 * @param {object} selectedContactforNewTaskAllInformations the detailed informations about a contact
 * @returns an object with the data of a contact
 */
function htmlContactInTaskJson(selectedContactforNewTaskAllInformations){
    return {
        name: selectedContactforNewTaskAllInformations.name, 
        color: selectedContactforNewTaskAllInformations.color
    };
}

/**
 * This function creates an object with the data of a subtask and returns it.
 * 
 * @param {string} subtask the subtask
 * @returns an object with the data of a subtask
 */
function htmlSubtasktInTaskJson(subtask){
    return {
        subtask: subtask,
        status: 'to do'
    };
}


/**
 * This function creates an object with the data of a new task and returns it.
 * 
 * @param {string} titleNewTask title
 * @param {string} descriptionNewTask description
 * @param {object} assignedToNewTask name and color of each contact
 * @param {string} dueDateNewTask date
 * @param {string} prioNewTask priority
 * @param {object} subtasksNewTask subtasks
 * @returns  an object with the data of a new task
 */
function createNewTask(titleNewTask, descriptionNewTask, assignedToNewTask, dueDateNewTask, prioNewTask, subtasksNewTask){
    return {
            title: titleNewTask,
            description: descriptionNewTask,
            assignedTo: assignedToNewTask,
            dueDate: dueDateNewTask,
            prio: prioNewTask,
            subtasks: subtasksNewTask,
            status: "to do"
        };
}
