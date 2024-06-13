/*templates*/

let menuItems = ['menuItemSummary', 'menuItemAddTask', 'menuItemBoard', 'menuItemContacts']
let subMenuOpen = false;
let tasks = [];


/**
 * This function is used to load html templates first bevor adjust the menu. The elements are hidden until 'selectActivPage' has finished executing.
 * 
 * @param {string} id - This is the id of the menu item that was selected.
 */
async function loadPage(id) {
    document.querySelectorAll('.bodyMainpages').forEach(element => {
        element.style.display = 'none';
    });
    await includeHTML();
    if (document.querySelector('.menuItems')) {
        selectActivePage(id);
    }
    document.querySelectorAll('.bodyMainpages').forEach(element => {
        element.style.display = 'flex';
    });
}

/**
 * This function includes html templates. (menu and header)
 */
async function includeHTML() {
    let includeElements = document.querySelectorAll('[w3-include-html]');
    for (let i = 0; i < includeElements.length; i++) {
        const element = includeElements[i];
        file = element.getAttribute("w3-include-html"); // "includes/header.html"
        let resp = await fetch(file);
        if (resp.ok) {
            element.innerHTML = await resp.text();
        } else {
            element.innerHTML = 'Page not found';
        }
    }
}

/**
 * This function checks whether one of the menu item IDs was passed and selects it.
 * 
 * @param {string} id  - This is the id of the menu item that was selected.
 */
function selectActivePage(id){
    for (let i = 0; i < menuItems.length; i++) {
        let menuItem = document.getElementById(menuItems[i]);
        if ((id !=null) && (menuItems[i]==id)) {
            changeSelectedMenuItem(menuItem);
        } else{
            changeMenuItemToDefault(menuItem);
        }
    }
}

/**
 * This function colors the background of the selectet menu item and deactivates the hover effect for this.
 * 
 * @param {string} menuItem - This is the id of the menu item that was selected.
 */
function changeSelectedMenuItem(menuItem){
    menuItem.classList.add('menuItemActicePage');
    let img = menuItem.querySelector("img");
    img.classList.add('imgMenuItemActicePage');
    menuItem.classList.remove('menuItemHoveringPossible');
}

/**
 * This function sets the menu items which are not selected to standard and and gives them the option to change the style while hovering.
 * 
 * @param {string} menuItem - This is the id of the menu item that will be reset to default.
 */
function changeMenuItemToDefault(menuItem){
    menuItem.classList.remove('menuItemActicePage');
    let img = menuItem.querySelector("img");
    img.classList.remove('imgMenuItemActicePage');
    menuItem.classList.add('menuItemHoveringPossible');
}

/**
 * This function opens and closes the sub menu. Beforehand, it is checked whether something else is open or activated that should be closed beforehand.
 */
function openAndCloseSubMenu(circleInitials){
    let bodyAddTask = circleInitials.closest('#bodyAddTask');
    if (bodyAddTask) {
        if (buttonSelectContactClicked) {
            toggleSelectContactsButton();
        }
        if (buttonSelectCategoryClicked) {
            toggleSelectCategoryButton();
        }
        if (addSubtaskActiv) {
            inputSubtaskDefault();
        }
        searchSubtaskInEditing(); 
    }

    let bodyBoard = circleInitials.closest('#bodyBoard');
    if (bodyBoard) {
        if (findTaskFocus) {
            findTaskDefault();
        }
    }

    document.getElementById('subMenu').classList.toggle('dNone');
    subMenuOpen =!subMenuOpen;
}

/**
 * This function closes the sub menu.
 */
function closeSubMenu(){
    document.getElementById('subMenu').classList.add('dNone');
    subMenuOpen = false;
}

/**
 * This function stops the propagation of the onclick event.
 * 
 * @param {onclick event} event 
 */
function stayOpenOrActiv(event){
    event.stopPropagation();
}

/**
 * this funciton change the icon of in the passwordinput
 * 
 * @param {img} lockId - show if text is visible or not
 */
function togglePasswordVisibility(lockId) {
    var passwordField = document.getElementById(lockId);
    var lockIcon = document.querySelector("#" + lockId + ".lock");

    if 
    (passwordField.type == "text"){
        passwordField.type = "password";
        lockIcon.style.backgroundImage = "url('/assets/img/visibilityoff.svg')";
    } else {
        passwordField.type = "text";
        lockIcon.style.backgroundImage = "url('/assets/img/visibility.svg')";
    }
}

/**
 * check for checkbox
 */
function toggleSubmitButton() {
    var checkbox = document.getElementById('checkbox');
    var registerBtn = document.getElementById('registerBtn');
    registerBtn.disabled = !checkbox.checked;
}

/*Informations*/

/**
 * This function displays the privacy police and closes the other help pages if necessary.
 */
function openPrivacyPolicy(){
    closeLegalNotice();
    closeHelp();
    document.getElementById('privacyPolicy').style.display = 'flex';
}

/**
 * This function closes the privacy police.
 */
function closePrivacyPolicy(){
    document.getElementById('privacyPolicy').style.display = 'none';
}

/**
 * This function displays the legal notice and closes the other help pages if necessary.
 */
function openLegalNotice(){
    closePrivacyPolicy();
    closeHelp();
    document.getElementById('legalNotice').style.display = 'flex';
}

/**
 * This function closes the legal notice.
 */
function closeLegalNotice(){
    document.getElementById('legalNotice').style.display = 'none';
}

/**
 * This function closes the current tap.
 */
function closeTapReturnToPreviousTap(){
    window.close();   
}

/**
 * This function displays the help page, closes the other help pages if necessary and hides the question mark.
 */
function openHelp(){
    closeLegalNotice();
    closePrivacyPolicy();
    document.getElementById('help').style.display = 'flex';
    document.getElementById('divHelpQuestionMark').classList.add('dNone');
}

/**
 * This function closes the help page and displays the queston mark.
 */
function closeHelp(){
    document.getElementById('help').style.display = 'none';
    document.getElementById('divHelpQuestionMark').classList.remove('dNone');
}

/*form validation*/

/**
 * This function taskes away the required attribute from an element.
 * 
 * @param {string} id the id of the element
 */
function preventNotice(id) {
    let input = document.getElementById(id);
    input.removeAttribute('required');
}

/**
 * This function adds the required attribute to an element.
 * 
 * @param {string} id the id of the element
 */
function restoreRequired(id) {
    let input = document.getElementById(id);
    input.setAttribute('required', 'required');
}
