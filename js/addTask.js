let buttonSelectContactClicked = false;
let categoryArrowUp = false;

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
 * This function expands or collapses the div with contacts and changes the arrow from top to bottom and vice versa.
 */
function toggleSelectContactsButton(){
    let buttonText = document.getElementById("textSelectContacts");
    let inputField = document.getElementById("inputSelectContacts");
    let button = document.getElementById("buttonSelectContacts");
    let dropdown = document.getElementById('addTaskAssignedTo');
    let arrowIcon = document.getElementById('arrowIcon');

    if (buttonText.style.display === "none") {
        // Wenn der Text ausgeblendet ist, zeige ihn wieder an und blende das Inputfeld aus
        buttonText.style.display = "inline";
        inputField.style.display = "none";
        inputField.value = "";
        button.style.border = "1px solid #D1D1D1";
        dropdown.classList.remove('active');
        arrowIcon.src = "./assets/img/arrowdropdownDown.svg";
        buttonSelectContactClicked = false; // Button wurde nicht geklickt
        
    } else {
        // Wenn der Text sichtbar ist, blende ihn aus und zeige das Inputfeld an
        buttonText.style.display = "none";
        inputField.style.display = "inline";
        button.style.border = "1px solid #29ABE2";
        inputField.focus(); // Inputfeld fokussieren
        dropdown.classList.add('active');
        arrowIcon.src = "./assets/img/arrowdropdownup.svg";
        buttonSelectContactClicked = true; // Button wurde geklickt
    }
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
    document.getElementById('addTaskPrioMedium').classList.remove('addTaskPrioActiv', 'addTaskPrioMediumActiv');
    document.getElementById('imgMedium').src = './assets/img/capaMedium.svg';
    document.getElementById('addTaskPrioLow').classList.remove('addTaskPrioActiv', 'addTaskPrioLowActiv');
    document.getElementById('imgLow').src = './assets/img/capaLow.svg';
    document.getElementById('addTaskPrioUrgent').classList.add('addTaskPrioActiv', 'addTaskPrioUrgentActiv');
    document.getElementById('imgUrgent').src = './assets/img/capaUrgentWhite.svg';
}

/**
 * This function disables validation of the form, styles the button with medium prioryty prominently and removes the prominent style from the other two buttons.
 * 
 * @param {click event} event click on addTaskPrioMedium
 */
function priorityMedium(event){
    event.preventDefault();
    document.getElementById('addTaskPrioUrgent').classList.remove('addTaskPrioActiv', 'addTaskPrioUrgentActiv');
    document.getElementById('imgUrgent').src = './assets/img/capaUrgent.svg';
    document.getElementById('addTaskPrioLow').classList.remove('addTaskPrioActiv', 'addTaskPrioLowActiv');
    document.getElementById('imgLow').src = './assets/img/capaLow.svg';
    document.getElementById('addTaskPrioMedium').classList.add('addTaskPrioActiv', 'addTaskPrioMediumActiv');
    document.getElementById('imgMedium').src = './assets/img/capaMediumWhite.svg';
}

/**
 *This function disables validation of the form, styles the button with low prioryty prominently and removes the prominent style from the other two buttons.
 *
 * @param {click event} event click on addTaskPrioLow
 */
function priorityLow(event){
    event.preventDefault();
    document.getElementById('addTaskPrioMedium').classList.remove('addTaskPrioActiv', 'addTaskPrioMediumActiv');
    document.getElementById('imgMedium').src = './assets/img/capaMedium.svg';
    document.getElementById('addTaskPrioUrgent').classList.remove('addTaskPrioActiv', 'addTaskPrioUrgentActiv');
    document.getElementById('imgUrgent').src = './assets/img/capaUrgent.svg';
    document.getElementById('addTaskPrioLow').classList.add('addTaskPrioActiv', 'addTaskPrioLowActiv');
    document.getElementById('imgLow').src = './assets/img/capaLowWhite.svg';
}

/*category*/

function defaultBorder(selectElement) {
    selectElement.classList.add('defaultBorder');
}

function toggleCategoryArrow() {
    let categorySelect = document.getElementById("addTaskCategory");
    if (categorySelect.style.backgroundImage.includes("arrowdropdownup.svg")) {
        categorySelect.style.backgroundImage = "url('../assets/img/arrowdropdownDown.svg')";
        categoryArrowUp = false;
    } else {
        categorySelect.style.backgroundImage = "url('../assets/img/arrowdropdownup.svg')";
        categoryArrowUp = true;
    }
}

/**
 * This function checks whether the arrow in the select tag from the category selection points upwards. If that's the case, the function toggleCategoryArrow is called to use the down arrow.
*/
function categoryArrowDefault(){
    if (categoryArrowUp) {
        toggleCategoryArrow();
    }
}

/*subtasks*/

/**
 * This eventlistener adds a plus sign inside a circular div to the Subtasks form field.
 */
document.addEventListener("DOMContentLoaded", function() {
    var divAddTaskSubtasks = document.querySelector(".divAddTaskSubtasks");
    var dataAddContent = divAddTaskSubtasks.getAttribute("data-add");
    divAddTaskSubtasks.innerHTML += dataAddContent;
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
 * This function checks whether the required input fields are valid and submits the form if necessary.
 */
function addNewTask() {
    validateInput("Title");
    validateInput("Description");
    validateInput("DueDate");
    validateInput("Category");

    let titleInput = document.getElementById("addTaskTitle");
    let descriptionInput = document.getElementById("addTaskDescription");
    let dueDateInput = document.getElementById("addTaskDueDate");
    let categoryInput = document.getElementById("addTaskCategory");
      
    if (titleInput.checkValidity() && descriptionInput.checkValidity() && dueDateInput.checkValidity() && categoryInput.checkValidity()) {
        document.getElementById("formAddNewTask").submit();
    } 
}
