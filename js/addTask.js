function toggleDropdown() {
    var dropdown = document.getElementById('addTaskAssignedTo');
    dropdown.classList.toggle('active');
    var arrowIcon = document.getElementById('arrowIcon');
    arrowIcon.classList.toggle('down');
    arrowIcon.classList.toggle('up');
}