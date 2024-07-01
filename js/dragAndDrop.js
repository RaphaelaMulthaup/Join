let currentDraggedElement;

function updateHTML(){

    let tasksToDo = tasks.filter(t => t['status'] == 'tasksToDo');
    let tasksToDo = tasks.filter(t => t['status'] == 'to do');

    document.getElementById('tasksToDo').innerHTML = '';

    for (let index = 0; index < tasksToDo.length; index++) {
        const element = tasksToDo[index];
        document.getElementById('tasksToDo').innerHTML += htmlboard(element);
        document.getElementById('tasksToDo').innerHTML += displayMiniCard(element);
    }
    
    let tasksInProgress = tasks.filter(t => t['status'] == 'tasksInProgress');
    let tasksInProgress = tasks.filter(t => t['status'] == 'in progress');

    document.getElementById('tasksInProgress').innerHTML = '';

    for (let index = 0; index < tasksInProgress.length; index++) {
        const element = tasksInProgress[index];
        document.getElementById('tasksInProgress').innerHTML += htmlboard(element);
        document.getElementById('tasksInProgress').innerHTML += displayMiniCard(element);
    }
    let tasksAwaitFeedback = tasks.filter(t => t['status'] == 'tasksAwaitFeedback');
    let tasksAwaitFeedback = tasks.filter(t => t['status'] == 'await feedback');

    document.getElementById('tasksAwaitFeedback').innerHTML = '';

    for (let index = 0; index < tasksAwaitFeedback.length; index++) {
        const element = tasksAwaitFeedback[index];
        document.getElementById('tasksAwaitFeedback').innerHTML += htmlboard(element);
        document.getElementById('tasksAwaitFeedback').innerHTML += displayMiniCard(element);
    }
    let tasksDone = tasks.filter(t => t['status'] == 'tasksDone');
    let tasksDone = tasks.filter(t => t['status'] == 'done');

    document.getElementById('tasksDone').innerHTML = '';

    for (let index = 0; index < tasksDone.length; index++) {
        const element = tasksDone[index];
        document.getElementById('tasksDone').innerHTML += htmlboard(element);
        document.getElementById('tasksDone').innerHTML += displayMiniCard(element);
    }
}

function startDragging(id) {
    currentDraggedElement = id;
}

function allowDrop(ev) {
    ev.preventDefault();
}

function moveTo(ev, status) {
async function moveTo(status) {
    tasks[currentDraggedElement]['status'] = status;
    console.log(status);
    ev.preventDefault();
    tasks[currentDraggedElement].status = status;
    console.log('tasks', tasks);
    putData(tasks);
    updateHTML();
    await putTasksToDatabase(tasks);
}

function highlight(id) {
    document.getElementById(id).classList.add('drag-area-highlight');
function highlight(i) {
    document.getElementById(d).classList.add('drag-area-highlight');
}

function removeHighlight(id) {
    document.getElementById(id).classList.remove('drag-area-highlight');
function removeHighlight(i) {
    document.getElementById(i).classList.remove('drag-area-highlight');
}