let findTaskFocus = false;

/**
 * This funktion sets clickt elements back to default.
 */
function setElementsToDefaultBoard(){
    closeSubMenu();
    findTaskDefault();
}

/*headline*/

/**
 * This function colors the border of 'findTask' blue and puts a focus on the input field. Beforehand, it is checked whether something else is open or activated that should be closed beforehand.
 */
function findTaskActive(){
    if (subMenuOpen) {
        closeSubMenu();
    }
    let findTask = document.getElementById('findTask');
    let inputFindTask = document.getElementById('inputFindTask');
    findTask.style.border = "1px solid #29ABE2";
    inputFindTask.focus(); // Inputfeld fokussieren
    findTaskFocus = true;
}

/**
 * This function This function colors the border of 'findTask' gray again.
 */
function findTaskDefault(){
    let findTask = document.getElementById('findTask');
    findTask.style.border = "1px solid #A8A8A8";
    findTaskFocus = false;
}

/**
 * This function colors the SVG dark for 10ms before it returns to its original color.
 * 
 * @param {string} plusButton clicked plus button
 */
function plusButtonToDefault(plusButton) {
    let rect = plusButton.querySelector('rect');
    let paths = plusButton.querySelectorAll('path');
    rect.setAttribute('stroke', '#091931');
    paths.forEach(function(path) {
        path.setAttribute('stroke', '#091931');
    });

    setTimeout(function() {
        rect.setAttribute('stroke', '#2A3647');
        paths.forEach(function(path) {
            path.setAttribute('stroke', '#2A3647');
        });
    
    }, 10);
}

/**
 * This function takes away the .dNone class from the div 'overlayAddTaskBackground'. The overlay with animation is displayed.
 */
function openOverlayAddTask(){
    document.getElementById('overlayAddTaskBackground').classList.remove('dNone');
}

function closeOverlayAddTask(){
    let overlayAddTaskBackground = document.getElementById('overlayAddTaskBackground');
    let overlayAddTask = document.getElementById('overlayAddTask');
    overlayAddTask.classList.add('removing');
    setTimeout(function() {
        overlayAddTaskBackground.classList.add('dNone');
        overlayAddTask.classList.remove('removing');
    }, 100); // Dauer der Animation in Millisekunden
}
