let menuItems = ['menuItemSummary', 'menuItemAddTask', 'menuItemBoard', 'menuItemContacts']

/**
 * This function is used to load html templates first bevor adjust the menu.
 * 
 * @param {string} id - This is the id of the menu item that was selected.
 */
async function loadPage(id) {
    await includeHTML();
    selectActivePage(id);
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
 * This function colors tht background of the selectet menu item and sets the others to standard.
 * 
 * @param {*} menuItem 
 */
function changeSelectedMenuItem(menuItem){
    menuItem.classList.add('menuItemActicePage');
    menuItem.classList.remove('menuItemHoveringPossible');
    let svg = menuItem.querySelector("svg");
    let paths = svg.querySelectorAll("path");
    paths.forEach(path => {
        path.classList.add('svgMenuItemActicePage');
    })
}

function changeMenuItemToDefault(menuItem){
    menuItem.classList.remove('menuItemActicePage');
    menuItem.classList.add('menuItemHoveringPossible');
    let svg = menuItem.querySelector("svg");
    let paths = svg.querySelectorAll("path");
    paths.forEach(path => {
        path.classList.remove('svgMenuItemActicePage');
    })
}

/**
 * for sign up
 */
document.getElementById('passwordInput').addEventListener('input', function() {
    var lockIcon = document.getElementBy('lockIcon');
    if (this.value.length > 0) {
        lockIcon.classList.remove('ion-lock');
        lockIcon.classList.add('ion-eye');
    } else {
        lockIcon.classList.remove('ion-eye');
        lockIcon.classList.add('ion-lock');
    }
});


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


