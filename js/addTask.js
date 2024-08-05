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

document.addEventListener('DOMContentLoaded', (event) => {
    if (document.title == 'Join Add Task') {
        let addTaskDueDate = document.getElementById('addTaskDueDate');
        let today = new Date().toISOString().split('T')[0];
        addTaskDueDate.setAttribute('min', today);
    }
});

/**
 * This function loads the add task page with the contacts and resets the selected category and the subtasks. An event listener for the enter event is added to the subtasks.
 */
async function loadAddTaskPage(){
    await loadPage('menuItemAddTask');
    await loadTasksAndContacts();
    await displayContacts();
    selectedCategory = '';
    subtasksForm = [];
    currentUser = await loadData('currentUser');
    if (currentUser && currentUser.initials) {
        document.getElementById('initialsHeader').innerText = currentUser.initials;
    }

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
 * This function displays the initials of the selected contacts. The JSON 'selectedContacts' is emtied and filled again with the contacts with a checked Checkbox. After that the initals are displayed in 'initialsSelectedContacts' whitch was also emtied bevor. A maximum of five initials will be displayed. If there are more, a plus sign is added.
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
        if (i < 5) {
            initialsSelectedContacts.innerHTML += htmlInitialsSelectedContacts(selectedContacts[i].color, selectedContacts[i].initials);
        } else {
            initialsSelectedContacts.innerHTML += addPlusForMoreInitials();
            break;
        }
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
 * This function creates a graphic of a plus sign.
 * 
 * @returns graphic of a plus sign
 */
function addPlusForMoreInitials() {
    return `
        <svg width="30" height="30" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <mask id="mask0_75601_15213" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="25" height="24">
                <rect x="0.248535" width="24" height="24" fill="#D9D9D9"/>
            </mask>
            <g mask="url(#mask0_75601_15213)">
                <path d="M11.2485 13H6.24854C5.9652 13 5.7277 12.9042 5.53604 12.7125C5.34437 12.5208 5.24854 12.2833 5.24854 12C5.24854 11.7167 5.34437 11.4792 5.53604 11.2875C5.7277 11.0958 5.9652 11 6.24854 11H11.2485V6C11.2485 5.71667 11.3444 5.47917 11.536 5.2875C11.7277 5.09583 11.9652 5 12.2485 5C12.5319 5 12.7694 5.09583 12.961 5.2875C13.1527 5.47917 13.2485 5.71667 13.2485 6V11H18.2485C18.5319 11 18.7694 11.0958 18.961 11.2875C19.1527 11.4792 19.2485 11.7167 19.2485 12C19.2485 12.2833 19.1527 12.5208 18.961 12.7125C18.7694 12.9042 18.5319 13 18.2485 13H13.2485V18C13.2485 18.2833 13.1527 18.5208 12.961 18.7125C12.7694 18.9042 12.5319 19 12.2485 19C11.9652 19 11.7277 18.9042 11.536 18.7125C11.3444 18.5208 11.2485 18.2833 11.2485 18V13Z" fill="#2A3647"/>
            </g>
        </svg>
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

/**
 * This function clears the form add task.
 */
function clearAddTask(){
    document.getElementById('addTaskTitle').value = '';
    document.getElementById('addTaskDescription').value = '';

    let dropdownContacts = document.getElementById('dropdownContacts');
    let checkboxes = dropdownContacts.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => checkbox.checked = false);
    displayInitials();

    document.getElementById('addTaskDueDate').value = '';
    priorityMedium(event);
    document.getElementById('textSelectCategory').innerHTML = 'Select task category';

    subtasksForm = [];
    renderSubtasks();
}