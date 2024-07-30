let task = document.querySelectorAll(".task");
let toDo = document.querySelector(".toDo");
let inProgress = document.querySelector(".inProgress");
let awaitFeedback = document.querySelector(".awaitFeedback");
let done = document.querySelector(".done");

let toDoPos = toDo.getBoundingClientRect();
let inProgressPos = inProgress.getBoundingClientRect();
let awaitFeedbackPos = awaitFeedback.getBoundingClientRect();
let donePos = done.getBoundingClientRect();
  // console.log('todo', toDoPos);

task.forEach(addStart);

function addStart(elem){
    elem.addEventListener("touchstart",e=>{
        console.log(e);

        let startX=e.changedTouches[0].clientX;
        let startY=e.changedTouches[0].clientY;

        elem.addEventListener("touchmove", eve=>{
            eve.preventDefault();


            let nextX=eve.changedTouches[0].clientX
            let nextY=eve.changedTouches[0].clientY

            elem.style.left=nextX-startX+"px";
            elem.style.top=nextY-startY+"px";
            elem.style.zIndex=10;
        });

        elem.addEventListener("touchend",eve=>{
            elem.style.zIndex=0;
            if (elem.getBoundingClientRect().top
                > donePos.top) {
                if (!done.contains(elem)) {
                    done.appendChild(elem);
                }
            }
            else if (elem.getBoundingClientRect().bottom
                < toDoPos.bottom) {
                if (!toDo.contains(elem)) { toDo.appendChild(elem); }
            }

            elem.style.left = 0 + "px";
            elem.style.top = 0 + "px";

        }
        );
    })
}