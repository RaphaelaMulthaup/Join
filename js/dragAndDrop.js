window.onload = function(){
    let miniCard = document.getElementsByClassName('box');

    miniCard.addEventlistener('touchmove', function(e){
        let touchLocation = e.targetTouches[0];

        miniCard.style.left = touchLocation.pageX + 'px';
        miniCard.style.top = touchLocation.pageY + 'px';
    })
    miniCard.addEventlistener('touched', function(e){
        let x = parsenInt(miniCard.style.left);
        let y = parsenInt(miniCard.style.top);
    })
}

let currentDraggedElement;

/**
 * Updates the HTML content of task sections based on their status.
 */
function updateHTML() {
    const statuses = ['to do', 'in progress', 'await feedback', 'done'];
    statuses.forEach(status => {
        const tasksByStatus = tasks.filter(t => t.status === status);
        const container = document.getElementById(`tasks${status.replace(' ', '')}`);
        container.innerHTML = tasksByStatus.map(displayMiniCard).join('');
    });
}

/**
* Sets the currently dragged element's ID.
* @param {number} id - The ID of the element being dragged.
*/
function startDragging(id) {
   currentDraggedElement = id;
}

/**
* Allows an element to be dropped.
* @param {DragEvent} ev - The drag event.
*/
function allowDrop(ev) {
   ev.preventDefault();
}

/**
 * Moves the current dragged element to a new status.
 * @param {string} status - The new status to assign to the dragged element.
 * @returns {Promise<void>}
 */
async function moveTo(status) {
    const task = tasks[currentDraggedElement];
    task.status = status;
    await putTasksToDatabase(tasks);
    displayBoard();
}

/**
 * Highlights the drop area.
 * @param {string} id - The ID of the element to highlight.
 */
function highlight(id) {
    document.getElementById(id).classList.add('drag-area-highlight');
}

/**
 * Removes the highlight from the drop area.
 * @param {string} id - The ID of the element to remove the highlight from.
 */
function removeHighlight(id) {
    document.getElementById(id).classList.remove('drag-area-highlight');
}