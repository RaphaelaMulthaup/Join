/*templates*/

let menuItems = ['menuItemSummary', 'menuItemAddTask', 'menuItemBoard', 'menuItemContacts']

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
    selectActivePage(id);
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
 * This function opens and closes the sub menu.
 */
function openAndCloseSubMenu(){
    document.getElementById('subMenu').classList.toggle('dNone');
}

/**
 * This function closes the sub menu.
 */
function closeSubMenu(){
    document.getElementById('subMenu').classList.add('dNone');
}

/**
 * 
 * 
 * @param {*} event 
 */
function dontClose(event){
    event.stopPropagation();
}


/**
 * for sign up
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
 * check for password match
 */
function checkPasswordMatch() {
    var password = document.getElementById("passwordInput").value;
    var confirmPassword = document.getElementById("passwordInputConfirm").value;
    var confirm = document.getElementById('confirm');
    var alert = document.getElementById('alert');

    if (password === confirmPassword) {
        alert  ('you signt up succesfully');
        document.getElementById("signupForm").submit();
    } else {
        confirm.style.border = '2px solid #FE818F';
        alert.innerHTML = '<span style="color: #FE818F;">Ups! Your passwords don\'t match</span>';
        false;
    }
}

const STORAGE_TOKEN = '39QCOR1Z1NVJZHWNBMOEMDPO2Y6VX0RI1KUJ7OM7';
const STORAGE_URL = 'https://remote-storage.developerakademie.org/item';


async function setItem(key, value) {
    const payload = { key, value, token: STORAGE_TOKEN };
    return fetch(STORAGE_URL, { method: 'POST', body: JSON.stringify(payload)})
    .then(res => res.json());
}

async function getItem(key) {
    const url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
    return fetch(url).then(res => res.json());
}


