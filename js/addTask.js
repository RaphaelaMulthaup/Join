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
