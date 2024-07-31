let task = document.querySelectorAll(".task");
let toDo = document.querySelector(".toDo");
let inProgress = document.querySelector(".inProgress");
let awaitFeedback = document.querySelector(".awaitFeedback");
let done = document.querySelector(".done");

let toDoPos = toDo.getBoundingClientRect();
let inProgressPos = inProgress.getBoundingClientRect();
let awaitFeedbackPos = awaitFeedback.getBoundingClientRect();
let donePos = done.getBoundingClientRect();

task.forEach(addTouchEvents);

function addTouchEvents(elem) {
    elem.addEventListener("touchstart", e => handleTouchStart(e, elem));
}

function handleTouchStart(e, elem) {
    console.log(e);

    let startX = e.changedTouches[0].clientX;
    let startY = e.changedTouches[0].clientY;

    elem.addEventListener("touchmove", eve => handleTouchMove(eve, elem, startX, startY));
    elem.addEventListener("touchend", eve => handleTouchEnd(eve, elem));
}

function handleTouchMove(eve, elem, startX, startY) {
    eve.preventDefault();

    let nextX = eve.changedTouches[0].clientX;
    let nextY = eve.changedTouches[0].clientY;

    elem.style.left = nextX - startX + "px";
    elem.style.top = nextY - startY + "px";
    elem.style.zIndex = 10;

    highlightDropZone(elem);
}

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

function isOverlapping(elem, container) {
    let elemRect = elem.getBoundingClientRect();
    let containerRect = container.getBoundingClientRect();

    return (
        elemRect.top < containerRect.bottom &&
        elemRect.bottom > containerRect.top &&
        elemRect.left < containerRect.right &&
        elemRect.right > containerRect.left
    );
}

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

function removeDropHighlights() {
    toDo.classList.remove("drop-highlight");
    inProgress.classList.remove("drop-highlight");
    awaitFeedback.classList.remove("drop-highlight");
    done.classList.remove("drop-highlight");
}

function moveToContainer(elem, container, containerName) {
    if (!container.contains(elem)) {
        container.appendChild(elem);
        console.log(`Card moved to ${containerName}`);

        const taskId = elem.dataset.id;
        
        updateTaskStatus(taskId, containerName);
    }
}

function resetElementPosition(elem) {
    elem.style.left = "0px";
    elem.style.top = "0px";
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