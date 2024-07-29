let currentDraggedElement;
let isDragging = false;
let startX, startY;

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
function startDragging(id, event) {
   currentDraggedElement = id;
   isDragging = true;

   startX = event.type === 'touchstart' ? event.touches[0].pageX : event.pageX;
   startY = event.type === 'touchstart' ? event.touches[0].pageY : event.pageY;

   document.addEventListener('mousemove', onDrag);
   document.addEventListener('touchmove', onDrag);
}

/**
 * Handles the dragging movement.
 * @param {Event} event - The move event (mouse or touch).
 */
function onDrag(event) {
    if (!isDragging) return;

    const currentX = event.type === 'touchmove' ? event.touches[0].pageX : event.pageX;
    const currentY = event.type === 'touchmove' ? event.touches[0].pageY : event.pageY;

    const draggedElement = document.getElementById(`task-${currentDraggedElement}`);
    draggedElement.style.transform = `translate(${currentX - startX}px, ${currentY - startY}px)`;
}

/**
 * Ends the dragging process.
 */
function endDrag() {
    isDragging = false;
    document.removeEventListener('mousemove', onDrag);
    document.removeEventListener('touchmove', onDrag);

    // Reset the transform property
    const draggedElement = document.getElementById(`task-${currentDraggedElement}`);
    draggedElement.style.transform = '';
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

// Event Listeners for Drag Start and End
document.querySelectorAll('.draggable').forEach(element => {
    element.addEventListener('mousedown', (event) => startDragging(element.dataset.id, event));
    element.addEventListener('touchstart', (event) => startDragging(element.dataset.id, event));
    element.addEventListener('mouseup', endDrag);
    element.addEventListener('touchend', endDrag);
});

// Drop Zone Event Listeners
document.querySelectorAll('.drop-zone').forEach(zone => {
    zone.addEventListener('dragover', allowDrop);
    zone.addEventListener('dragenter', () => highlight(zone.id));
    zone.addEventListener('dragleave', () => removeHighlight(zone.id));
    zone.addEventListener('drop', async (event) => {
        event.preventDefault();
        const status = zone.dataset.status;
        await moveTo(status);
        removeHighlight(zone.id);
    });
});


///// Version 1
// let currentDraggedElement;

// /**
//  * Updates the HTML content of task sections based on their status.
//  */
// function updateHTML() {
//     const statuses = ['to do', 'in progress', 'await feedback', 'done'];
//     statuses.forEach(status => {
//         const tasksByStatus = tasks.filter(t => t.status === status);
//         const container = document.getElementById(`tasks${status.replace(' ', '')}`);
//         container.innerHTML = tasksByStatus.map(displayMiniCard).join('');
//     });
// }

// /**
// * Sets the currently dragged element's ID.
// * @param {number} id - The ID of the element being dragged.
// */
// function startDragging(id) {
//    currentDraggedElement = id;
// }

// /**
// * Allows an element to be dropped.
// * @param {DragEvent} ev - The drag event.
// */
// function allowDrop(ev) {
//    ev.preventDefault();
// }

// /**
//  * Moves the current dragged element to a new status.
//  * @param {string} status - The new status to assign to the dragged element.
//  * @returns {Promise<void>}
//  */
// async function moveTo(status) {
//     const task = tasks[currentDraggedElement];
//     task.status = status;
//     await putTasksToDatabase(tasks);
//     displayBoard();
// }

// /**
//  * Highlights the drop area.
//  * @param {string} id - The ID of the element to highlight.
//  */
// function highlight(id) {
//     document.getElementById(id).classList.add('drag-area-highlight');
// }

// /**
//  * Removes the highlight from the drop area.
//  * @param {string} id - The ID of the element to remove the highlight from.
//  */
// function removeHighlight(id) {
//     document.getElementById(id).classList.remove('drag-area-highlight');
// }


///// Version 2
// let currentDraggedElement;

// /**
//  * Updates the HTML content of task sections based on their status.
//  */
// function updateHTML() {
//     const statuses = ['to do', 'in progress', 'await feedback', 'done'];
//     statuses.forEach(status => {
//         const tasksByStatus = tasks.filter(t => t.status === status);
//         const container = document.getElementById(`tasks${status.replace(' ', '')}`);
//         container.innerHTML = tasksByStatus.map(displayMiniCard).join('');
//         addDragAndDropHandlers(container);
//     });
// }

// /**
//  * Adds drag and drop handlers to the given container's child elements.
//  * @param {HTMLElement} container - The container element.
//  */
// function addDragAndDropHandlers(container) {
//     const elements = container.children;
//     for (let element of elements) {
//         element.setAttribute('draggable', true);
//         element.addEventListener('dragstart', (event) => startDragging(event, element.id));
//         element.addEventListener('touchstart', (event) => startDragging(event, element.id));
//     }
// }

// /**
//  * Sets the currently dragged element's ID.
//  * @param {Event} event - The drag or touch event.
//  * @param {number} id - The ID of the element being dragged.
//  */
// function startDragging(event, id) {
//     currentDraggedElement = id;
//     event.dataTransfer?.setData('text', id); // Only for drag events
//     if (event.type === 'touchstart') {
//         const touch = event.touches[0];
//         event.target.style.position = 'absolute';
//         event.target.style.left = `${touch.pageX}px`;
//         event.target.style.top = `${touch.pageY}px`;
//         document.addEventListener('touchmove', onDrag);
//         document.addEventListener('touchend', endDrag);
//     }
// }

// function onDrag(event) {
//     if (!currentDraggedElement) return;
//     const touch = event.touches[0];
//     const element = document.getElementById(currentDraggedElement);
//     element.style.left = `${touch.pageX}px`;
//     element.style.top = `${touch.pageY}px`;
// }

// function endDrag(event) {
//     currentDraggedElement = null;
//     document.removeEventListener('touchmove', onDrag);
//     document.removeEventListener('touchend', endDrag);
// }

// /**
//  * Allows an element to be dropped.
//  * @param {DragEvent} ev - The drag event.
//  */
// function allowDrop(ev) {
//     ev.preventDefault();
// }

// /**
//  * Moves the current dragged element to a new status.
//  * @param {string} status - The new status to assign to the dragged element.
//  * @returns {Promise<void>}
//  */
// async function moveTo(status) {
//     const task = tasks[currentDraggedElement];
//     task.status = status;
//     await putTasksToDatabase(tasks);
//     displayBoard();
// }

// /**
//  * Highlights the drop area.
//  * @param {string} id - The ID of the element to highlight.
//  */
// function highlight(id) {
//     document.getElementById(id).classList.add('drag-area-highlight');
// }

// /**
//  * Removes the highlight from the drop area.
//  * @param {string} id - The ID of the element to remove the highlight from.
//  */
// function removeHighlight(id) {
//     document.getElementById(id).classList.remove('drag-area-highlight');
// }

// /**
//  * Initializes the drag and drop functionality on page load.
//  */
// document.addEventListener('DOMContentLoaded', () => {
//     updateHTML();
//     const dropZones = document.querySelectorAll('.drop-zone');
//     dropZones.forEach(zone => {
//         zone.addEventListener('dragover', allowDrop);
//         zone.addEventListener('drop', async (event) => {
//             event.preventDefault();
//             await moveTo(zone.id);
//         });
//         zone.addEventListener('touchend', async (event) => {
//             event.preventDefault();
//             await moveTo(zone.id);
//         });
//     });
// });
