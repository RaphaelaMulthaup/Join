
function validateForm() {
    var addTaskTitle = document.getElementById("addTaskTitle");
    var requiredMessage = document.getElementById("requiredMessage");
  
    if (!addTaskTitle.value) {
        requiredMessage.style.display = "block";
        addTaskTitle.style.borderColor = "#FF8190";
      return false; // Prevent form submission
    } else {
    requiredMessage.style.display = "none";
    addTaskTitle.style.borderColor = ""; // Reset border color
      return true; // Allow form submission
    }
  }
