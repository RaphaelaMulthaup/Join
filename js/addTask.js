let buttonSelectContactClicked = false;
let categoryArrowUp = false;
let buttonSelectCategoryClicked = false;
let addSubtaskActiv = false;
let contactsAddTask =[];
let selectedContacts =[];

async function loadContacts(){
    contactsAddTask = await loadData('/users');
    console.log(contactsAddTask);

    let dropdownContacts = document.getElementById('dropdownContacts');
    for (let i = 0; i < contactsAddTask.length; i++) {
        let contactForDropdown = contactsAddTask[i];
        dropdownContacts.innerHTML += htmlContactDropdown(contactForDropdown, i);
    }
}

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

function displayInitials(){
    selectedContacts = [];
    console.log(selectedContacts);
    for (let i = 0; i < contactsAddTask.length; i++) {
        let checkbox = 'checkboxSelectContacts' + i;
        if (checkbox.checked) {
            selectedContacts.push(contactsAddTask[i]);
        } 
    }
    console.log(selectedContacts);

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
 * This function closes the dropdown menu, puts the selection inside the button 'buttonSelectCategory' and removes the error massage and the red border around buttonSelectCategory.
 * 
 * @param {span} selection the selected category
 */
function selectCategory(selection){
    let button = document.getElementById('buttonSelectCategory');
    let errorMessageElement = document.getElementById('requiredMessageCategoryAddTask');

    toggleSelectCategoryButton();
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
        list.innerHTML += templateSubtask(newSubtask);
     }
    inputSubtaskDefault();

    let inputEditSubtask = list.lastElementChild.querySelector('.inputEditSubtask');
    addEnterKeyListener(inputEditSubtask);
}

/**
 * This funktion returns a html template to create a new subtask.
 * 
 * @param {span} newSubtask new subtask out of input 'inputAddSubtask'
 * @returns html template 'new subtask' including li element and a div with a input field to edit the subtask
 */
function templateSubtask(newSubtask){
    return /*html*/ `
        <div class="liAndEditSubtask">
            <li onclick="editSubtask(this), stayOpenOrActiv(event)">
                <span>${newSubtask}</span>
                <div class="iconsSubtask" style="display: none;">
                    <div class='circleIconAddTaskSubtasks'>
                        <img class="imgEdit" src="./assets/img/edit.svg">
                    </div>
                    <div class="verticalLineAddTaskSubtasks"></div>
                    <div class='circleIconAddTaskSubtasks' onclick="deleteSubtask(this), stayOpenOrActiv(event)">
                        <img src="./assets/img/delete.svg">
                    </div>
                </div>
            </li>
            <div class="editSubtask" style="display: none;" onclick="stayOpenOrActiv(event)">
                <input type="text" class="inputEditSubtask" value="${newSubtask}">
                <div class="iconsSubtask">
                    <div class='circleIconAddTaskSubtasks' onclick="deleteSubtask(this)">
                        <img src="./assets/img/delete.svg">
                    </div>
                    <div class="verticalLineAddTaskSubtasks"></div>
                    <div class='circleIconAddTaskSubtasks displayEditedSubtask' onclick="displayEditedSubtask(this)">
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
 * @param {span} inputEditSubtask input field to edit a subtask
 */
function addEnterKeyListener(inputEditSubtask) {
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
function deleteSubtask(deleteButton){
    closeAndDisableEverythingOutsidTheCurrentSubtask();

    let divToDelet = deleteButton.closest('.liAndEditSubtask');
    divToDelet.remove();
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
 * @param {*} checkIcon check icon which belongs to a subtask
 */
function displayEditedSubtask(checkIcon){
    let editSubtask = checkIcon.closest('.editSubtask');
    let newValueSubtask = editSubtask.querySelector('.inputEditSubtask').value;
    let newSubtaskDisplayed = checkIcon.closest('.liAndEditSubtask').querySelector('span');
    let li = newSubtaskDisplayed.closest('li');

    newSubtaskDisplayed.innerHTML = newValueSubtask;
    li.style.display = 'flex';
    editSubtask.style.display = 'none';
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
            let checkIcon = editSubtask.querySelector('.displayEditedSubtask');
            displayEditedSubtask(checkIcon);
            break; // Schleife abbrechen, sobald das Element gefunden wurde
        }
    }
}

/**
 * This function creates an eventlistener that creates a new subtask when the enter key is pressed within 'inputAddSubtask'.
 */
document.addEventListener("DOMContentLoaded", function() {
    let inputAddSubtask = document.getElementById('inputAddSubtask');

    inputAddSubtask.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            addSubtask();
        }
    });
});


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
    let textButtonSelectCategory = document.getElementById('textSelectCategory').innerHTML;
    let button = document.getElementById('buttonSelectCategory');
    let errorMessageElement = document.getElementById('requiredMessageCategoryAddTask');

    if (textButtonSelectCategory == ('Select task category')) {
        errorMessageElement.style.visibility = 'visible';
        button.classList.add("borderRed");
    }
}

/**
 * This function checks whether the required input fields are valid and submits the form if necessary.
 */
function addNewTask() {
    validateInput("Title");
    validateInput("Description");
    validateInput("DueDate");
    validateInputCategory();

    let titleInput = document.getElementById("addTaskTitle");
    let descriptionInput = document.getElementById("addTaskDescription");
    let dueDateInput = document.getElementById("addTaskDueDate");
    let categoryInput = document.getElementById('textSelectCategory').innerHTML;
      
    if (titleInput.checkValidity() && descriptionInput.checkValidity() && dueDateInput.checkValidity() && categoryInput !== ('Select task category')) {
        document.getElementById("formAddNewTask").submit();
    } 
}
