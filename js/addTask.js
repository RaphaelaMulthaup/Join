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


document.addEventListener("DOMContentLoaded", function() {
    var divAddTaskSubtasks = document.querySelector(".divAddTaskSubtasks");
    var dataAddContent = divAddTaskSubtasks.getAttribute("data-add");
    divAddTaskSubtasks.innerHTML += dataAddContent;
});
