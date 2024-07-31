/**
 * NodeList of all elements with class 'task'.
 * @type {NodeListOf<Element>}
 * The to-do, in-progress, await feedback and done column container element.
 * @type {HTMLElement}
 */
let task = document.querySelectorAll(".task");
let toDo = document.querySelector(".toDo");
let inProgress = document.querySelector(".inProgress");
let awaitFeedback = document.querySelector(".awaitFeedback");
let done = document.querySelector(".done");


task.forEach(addTouchEvents);

/**
 * Adds touch event listeners to the given element.
 * @param {Element} elem - The element to add touch events to.
 */
function addTouchEvents(elem) {
    elem.addEventListener("touchstart", e => handleTouchStart(e, elem));
}

/**
 * Handles the touchstart event.
 * @param {TouchEvent} e - The touchstart event object.
 * @param {Element} elem - The element that is being touched.
 */
function handleTouchStart(e, elem) {
    console.log(e);

    const startX = e.changedTouches[0].clientX;
    const startY = e.changedTouches[0].clientY;

    // Recalculate container positions on every touchstart
    updateContainerPositions();

    elem.addEventListener("touchmove", eve => handleTouchMove(eve, elem, startX, startY));
    elem.addEventListener("touchend", eve => handleTouchEnd(eve, elem));
}

/**
 * Handles the touchmove event.
 * @param {TouchEvent} eve - The touchmove event object.
 * @param {Element} elem - The element that is being moved.
 * @param {number} startX - The initial x-coordinate of the touch.
 * @param {number} startY - The initial y-coordinate of the touch.
 */
function handleTouchMove(eve, elem, startX, startY) {
    eve.preventDefault();

    const nextX = eve.changedTouches[0].clientX;
    const nextY = eve.changedTouches[0].clientY;

    elem.style.left = nextX - startX + "px";
    elem.style.top = nextY - startY + "px";
    elem.style.zIndex = 10;

    highlightDropZone(elem);
}

/**
 * Handles the touchend event.
 * @param {TouchEvent} eve - The touchend event object.
 * @param {Element} elem - The element that is being touched.
 */
function handleTouchEnd(eve, elem) {
    elem.style.zIndex = 0;

    if (elem.getBoundingClientRect().top > donePos.top) {
        moveToContainer(elem, done, "done");
    } else if (elem.getBoundingClientRect().bottom < toDoPos.bottom) {
        moveToContainer(elem, toDo, "to do");
    } else if (isOverlapping(elem, inProgress)) {
        moveToContainer(elem, inProgress, "in progress");
    } else if (isOverlapping(elem, awaitFeedback)) {
        moveToContainer(elem, awaitFeedback, "await feedback");
    } else {
        console.log("The card was not moved to any new column.");
    }

    resetElementPosition(elem);
    removeDropHighlights();
}

/**
 * Checks if the element is overlapping the container.
 * @param {Element} elem - The element being checked.
 * @param {Element} container - The container element.
 * @returns {boolean} True if overlapping, otherwise false.
 */
function isOverlapping(elem, container) {
    const elemRect = elem.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    return (
        elemRect.top < containerRect.bottom &&
        elemRect.bottom > containerRect.top &&
        elemRect.left < containerRect.right &&
        elemRect.right > containerRect.left
    );
}

/**
 * Highlights the drop zone of the element.
 * @param {Element} elem - The element being moved.
 */
function highlightDropZone(elem) {
    removeDropHighlights();

    if (elem.getBoundingClientRect().top > donePos.top) {
        done.classList.add("drop-highlight");
    } else if (elem.getBoundingClientRect().bottom < toDoPos.bottom) {
        toDo.classList.add("drop-highlight");
    } else if (isOverlapping(elem, inProgress)) {
        inProgress.classList.add("drop-highlight");
    } else if (isOverlapping(elem, awaitFeedback)) {
        awaitFeedback.classList.add("drop-highlight");
    }
}

/**
 * Removes the drop zone highlights.
 */
function removeDropHighlights() {
    toDo.classList.remove("drop-highlight");
    inProgress.classList.remove("drop-highlight");
    awaitFeedback.classList.remove("drop-highlight");
    done.classList.remove("drop-highlight");
}

/**
 * Moves the element to the specified container.
 * @param {Element} elem - The element to be moved.
 * @param {HTMLElement} container - The container to move the element to.
 * @param {string} containerName - The name of the container.
 */
function moveToContainer(elem, container, containerName) {
    if (!container.contains(elem)) {
        container.appendChild(elem);
        console.log(`Card moved to ${containerName}`);

        const taskId = elem.dataset.id;
        
        updateTaskStatus(taskId, containerName);
    }
}

/**
 * Resets the position of the element.
 * @param {Element} elem - The element to reset.
 */
function resetElementPosition(elem) {
    elem.style.left = "0px";
    elem.style.top = "0px";
}

/**
 * Updates the positions of the container elements.
 */
function updateContainerPositions() {
    toDoPos = toDo.getBoundingClientRect();
    inProgressPos = inProgress.getBoundingClientRect();
    awaitFeedbackPos = awaitFeedback.getBoundingClientRect();
    donePos = done.getBoundingClientRect();
}


/**
 * Moves the current dragged element to a new status.
 * @param {string} status - The new status to assign to the dragged element.
 * @returns {Promise<void>}
 */
async function updateTaskStatus(taskId, newStatus) {
    const task = tasks[taskId];
    task.status = newStatus;
    await putTasksToDatabase(tasks);
}
