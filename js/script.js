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