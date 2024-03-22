/*templates*/

let menuItems = ['menuItemSummary', 'menuItemAddTask', 'menuItemBoard', 'menuItemContacts']

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
    let svg = menuItem.querySelector("svg");
    let paths = svg.querySelectorAll("path");
    paths.forEach(path => {
        path.classList.add('svgMenuItemActicePage');
    })
    menuItem.classList.remove('menuItemHoveringPossible');
}

/**
 * This function sets the menu items which are not selected to standard and and gives them the option to change the style while hovering.
 * 
 * @param {string} menuItem - This is the id of the menu item that will be reset to default.
 */
function changeMenuItemToDefault(menuItem){
    menuItem.classList.remove('menuItemActicePage');
    let svg = menuItem.querySelector("svg");
    let paths = svg.querySelectorAll("path");
    paths.forEach(path => {
        path.classList.remove('svgMenuItemActicePage');
    })
    menuItem.classList.add('menuItemHoveringPossible');
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


