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

    let inputElement;
    if (document.getElementById("addTask" + element)) {
        inputElement = document.getElementById("addTask" + element);
    } else {
        inputElement = document.getElementById('addTaskOnBoard' + element);
    }

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
 * This function creates a new task. If the form is valid, selectedCategory and satusNewTask are added and then the newTask is pushed into tasks. The database is updated and the page is reloaded. In the end formValidated is set to false.
 * 
 * @param {string} descriptionOrigin origin of the description
 */
async function addNewTask(descriptionOrigin) {
    let newTask = await validateForm(descriptionOrigin);
    if (formValidated) {
        newTask.category = selectedCategory;
        newTask.status = satusNewTask;
        tasks.push(newTask);  
        await putTasksToDatabase(tasks);
        location.reload(); 
    }
    formValidated = false;
}

/**
 * This function checks whether the required input fields are valid and submits the form if necessary.
 * 
 * @param {string} descriptionOrigin origin of the description
 */
async function validateForm(descriptionOrigin){
    validateInput("Title");
    validateInput(descriptionOrigin);
    validateInput("DueDate");
    validateInputCategory();

    let { titleInput, descriptionInput, dueDateInput, categoryValid } = getFormInputs();
      
    if (titleInput.checkValidity() && descriptionInput.checkValidity() && dueDateInput.checkValidity() && categoryValid) {
        let newTask = await addNewTaskRecordAndSaveData(descriptionInput);
        formValidated = true;
        return newTask;
    }
}

/**
 * This function sets variables for the form's input fields, checks whether there is a query of the category, and then sets categoryValid to true if a category is selected.
 * 
 * @returns the variables and categoryValid
 */
function getFormInputs(){
    let titleInput = document.getElementById("addTaskTitle");

    let descriptionInput;
    if (document.getElementById("addTaskDescription")) {
        descriptionInput = document.getElementById("addTaskDescription");
    } else {
        descriptionInput = document.getElementById('addTaskOnBoardDescription');
    }

    let dueDateInput = document.getElementById("addTaskDueDate");
    let categoryValid = true;

    let categoryElement = document.getElementById('textSelectCategory');
    if (categoryElement !== null) {
        let categoryInput = categoryElement.innerHTML;
        categoryValid = categoryInput !== 'Select task category';
    }

    return { titleInput, descriptionInput, dueDateInput, categoryValid };
}

/**
 * This function records the data for a new task and pushes them to 'tasks'.
 */
async function addNewTaskRecordAndSaveData(descriptionInput){
    let titleNewTask = document.getElementById('addTaskTitle').value;
    let descriptionNewTask = descriptionInput.value;

    let dueDateNewTask = getDate();

    let assignedToNewTask = [];
    for (let i = 0; i < selectedContacts.length; i++) {
        let selectedContactforNewTaskAllInformations = selectedContacts[i];
        let  selectedContactforNewTask = ContactInTaskJson(selectedContactforNewTaskAllInformations);
        assignedToNewTask.push(selectedContactforNewTask);
    }

    let prioNewTask = determinePrioNewTask();

    let newTask = createNewTask(titleNewTask, descriptionNewTask, assignedToNewTask, dueDateNewTask, prioNewTask, subtasksForm);
    return newTask;
}

/**
 * This function reads the date from the input field and converts it into the required format.
 * 
 * @returns the date in the required format
 */
function getDate() {
    // Datum in ein Date-Objekt umwandeln
    let dateString = document.getElementById('addTaskDueDate').value;
    let date = new Date(dateString);

    // Tag, Monat und Jahr aus dem Date-Objekt extrahieren
    let day = String(date.getDate()).padStart(2, '0');
    let month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() gibt Monate von 0 bis 11 zurück, daher +1
    let year = date.getFullYear();

    // Datum im gewünschten Format zurückgeben
    return `${day}/${month}/${year}`;
}

/**
 * This function checks which of the prio buttons is activated and assigns the corresponding importance to the variable 'prioNewTask'.
 * 
 * @returns the status of importance
 */
function determinePrioNewTask(){
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
    return prioNewTask;
}

/**
 * This function creates an object with the data of a contact and returns it.
 * 
 * @param {object} selectedContactforNewTaskAllInformations the detailed informations about a contact
 * @returns an object with the data of a contact
 */
function ContactInTaskJson(selectedContactforNewTaskAllInformations){
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
function SubtasktInTaskJson(subtask){
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
            subtasks: subtasksNewTask
        };
}