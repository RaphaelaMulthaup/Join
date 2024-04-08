function toggleDropdown() {
    var dropdown = document.getElementById('addTaskAssignedTo');
    dropdown.classList.toggle('active');
    var arrowIcon = document.getElementById('arrowIcon');
    arrowIcon.classList.toggle('down');
    arrowIcon.classList.toggle('up');
}

document.addEventListener("DOMContentLoaded", function() {
    var divAddTaskSubtasks = document.querySelector(".divAddTaskSubtasks");
    var dataAddContent = divAddTaskSubtasks.getAttribute("data-add");
    divAddTaskSubtasks.innerHTML += dataAddContent;
});
