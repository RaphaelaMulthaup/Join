let currentDraggedElement;

function updateHTML(){

    let tasksToDo = tasks.filter(t => t['status'] == 'tasksToDo');

    document.getElementById('tasksToDo').innerHTML = '';

    for (let index = 0; index < tasksToDo.length; index++) {
        const element = tasksToDo[index];
        document.getElementById('tasksToDo').innerHTML += htmlboard(element);
    }
    
    let tasksInProgress = tasks.filter(t => t['status'] == 'tasksInProgress');

    document.getElementById('tasksInProgress').innerHTML = '';

    for (let index = 0; index < tasksInProgress.length; index++) {
        const element = tasksInProgress[index];
        document.getElementById('tasksInProgress').innerHTML += htmlboard(element);
    }
    let tasksAwaitFeedback = tasks.filter(t => t['status'] == 'tasksAwaitFeedback');

    document.getElementById('tasksAwaitFeedback').innerHTML = '';

    for (let index = 0; index < tasksAwaitFeedback.length; index++) {
        const element = tasksAwaitFeedback[index];
        document.getElementById('tasksAwaitFeedback').innerHTML += htmlboard(element);
    }
    let tasksDone = tasks.filter(t => t['status'] == 'tasksDone');

    document.getElementById('tasksDone').innerHTML = '';

    for (let index = 0; index < tasksDone.length; index++) {
        const element = tasksDone[index];
        document.getElementById('tasksDone').innerHTML += htmlboard(element);
    }
}

// function updateHTML(){
//     let taskStatuses = ['tasksToDo', 'tasksInProgress', 'tasksAwaitFeedback', 'tasksDone'];
//     taskStatuses.forEach(status => {
//         let tasksByStatus = tasks.filter(t => t.status == status);
//         document.getElementById(status).innerHTML = '';

//         for (let index = 0; index < tasksByStatus.length; index++) {
//             const element = tasksByStatus[index];
//             document.getElementById(status).innerHTML += htmlMiniCard(element, index);
//         }
//     });
// }

function startDragging(id) {
    currentDraggedElement = id;
}

function allowDrop(ev) {
    ev.preventDefault();
}

function moveTo(ev, status) {
    console.log(status);
    ev.preventDefault();
    tasks[currentDraggedElement].status = status;
    putData(tasks);
    updateHTML();
}

function highlight(id) {
    document.getElementById(id).classList.add('drag-area-highlight');
}

function removeHighlight(id) {
    document.getElementById(id).classList.remove('drag-area-highlight');
}