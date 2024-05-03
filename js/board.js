let findTaskFocus = false;

function findTaskActive(){
    let findTask = document.getElementById('findTask');
    let inputFindTask = document.getElementById('inputFindTask');
    findTask.style.border = "1px solid #29ABE2";
    inputFindTask.focus(); // Inputfeld fokussieren
    findTaskFocus = true;
}