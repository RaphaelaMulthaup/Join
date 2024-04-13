/**
 * This function expands or collapses the div with contacts and changes the arrow from top to bottom and vice versa.
 */
function toggleDropdown() {
    var dropdown = document.getElementById('addTaskAssignedTo');
    dropdown.classList.toggle('active');
    var arrowIcon = document.getElementById('arrowIcon');
    if (arrowIcon.src.includes("Down")) {
        arrowIcon.src = "./assets/img/arrowdropdownup.svg";
    } else {
        arrowIcon.src = "./assets/img/arrowdropdownDown.svg";
    }
}

/**
 * This eventlistener adds a plus sign inside a circular div to the Subtasks form field.
 */
document.addEventListener("DOMContentLoaded", function() {
    var divAddTaskSubtasks = document.querySelector(".divAddTaskSubtasks");
    var dataAddContent = divAddTaskSubtasks.getAttribute("data-add");
    divAddTaskSubtasks.innerHTML += dataAddContent;
});

/**
 * This function disables validation of the form, styles the button with urgent prioryty prominently and removes the prominent style from the other two buttons
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
 * This function disables validation of the form, styles the button with medium prioryty prominently and removes the prominent style from the other two buttons
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
 *This function disables validation of the form, styles the button with low prioryty prominently and removes the prominent style from the other two buttons
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
