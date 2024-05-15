let findTaskFocus = false;
let overlayAddTaskOpen = false;

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
 * This function takes away the 'dNone' class from the div 'overlayAddTaskBackground'. The overlay with animation is displayed.  Beforehand, it is checked whether something else is open or activated that should be closed beforehand.
 */
function openOverlayAddTask(){
    if (subMenuOpen) {
        closeSubMenu();
    }
    if (findTaskFocus) {
        findTaskDefault();
    }
    document.getElementById('overlayAddTaskBackground').classList.remove('dNone');
    overlayAddTaskOpen = true;
}


/**
 * This function adds class 'removing' to 'overlayAddTask'. This will display the sliding out animation. After the animation plays, the div 'overlayAddTaskBackground' is given the class .dNone. 'removing' is then removed again.
 */
function closeOverlayAddTask(){
    let overlayAddTaskBackground = document.getElementById('overlayAddTaskBackground');
    let overlayAddTask = document.getElementById('overlayAddTask');
    overlayAddTask.classList.add('removing');
    setTimeout(function() {
        overlayAddTaskBackground.classList.add('dNone');
        overlayAddTask.classList.remove('removing');
    }, 100); // Dauer der Animation in Millisekunden
    overlayAddTaskOpen = false;
}

/*tasks*/

async function loadBoard(){
    let tasks = await loadData("/tasks");
    console.log(tasks);

    for (let i = 0; i < tasks.length; i++) {
        let task = tasks[i];
        if (task.status == "to do") {
            document.getElementById('tasksToDo').innerHTML += htmlMiniCard(task, i);
        } else if (task.status == "in progress") {
            document.getElementById('tasksInProgress').innerHTML += htmlMiniCard(task, i);
        } else if (task.status == "await feedback") {
            document.getElementById('tasksAwaitFeedback').innerHTML += htmlMiniCard(task, i);
        } else if (task.status == "done") {
            document.getElementById('tasksDone').innerHTML += htmlMiniCard(task, i);
        }
    }

    // Finde das DOM-Element für die Trunkierung
let textMiniCard = document.getElementById('.truncate');
const span = truncateDiv.querySelector('span');

// Maximale Zeilenhöhe (basierend auf der Zeilenhöhe)
const lineHeight = parseInt(window.getComputedStyle(span).lineHeight);
const maxLines = 2;

// Berechne die maximale Höhe
const maxHeight = lineHeight * maxLines;

// Kürze den Text, um höchstens zwei Zeilen umfassen zu können
while (span.offsetHeight > maxHeight) {
    span.textContent = span.textContent.replace(/\W*\s(\S)*$/, '...');
}

}

function htmlMiniCard(task, i){
    return /*html*/ `
        <div class="miniCard">
            <div class="category">${task.category}</div>
            <div class="textMiniCard" id="textMiniCard${i}">
                <h6 class="title">${task.title}</h6>
                <span class="description">${task.description}</span>
            </div>
            <div class="miniCardGraphically">
                <div class="initialsMiniCardGraphically"></div>
                <div class="prio"></div>
            </div>
        </div>
    `;
}