let buttonSelectContactClicked = false;
let categoryArrowUp = false;
let buttonSelectCategoryClicked = false;
let addSubtaskActiv = false;
let contactsAddTask = [];
let selectedContacts = [];
let selectedCategory;
let subtasksForm = [];
let formValidated = false;
let satusNewTask = "to do";

/**
 * This function loads the add task page with the contacts and resets the selected category and the subtasks. An event listener for the enter event is added to the subtasks.
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
 * This function shows 'textSelectContacts' again and turns the border of the button gray. The input field is hidden and the value is deleted. The downward arrow graphic is inserted and the dropdown menu is hidden. The initials will be displayed.
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
 * @param {element} input the input field typ date
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
    document.getElementById('textSelectCategory').innerHTML = selection;
    errorMessageElement.style.visibility = 'hidden';
    button.classList.remove("borderRed");
}